package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.ericsson.ecb.catalog.client.ExtendedPricelistClient;
import com.ericsson.ecb.catalog.client.PricelistClient;
import com.ericsson.ecb.catalog.client.UnitDependentRecurringChargeClient;
import com.ericsson.ecb.catalog.model.LocalizedPricelist;
import com.ericsson.ecb.catalog.model.LocalizedRateSchedule;
import com.ericsson.ecb.catalog.model.PriceableItemTemplateParameterTableMapping;
import com.ericsson.ecb.catalog.model.Pricelist;
import com.ericsson.ecb.catalog.model.PricelistMapping;
import com.ericsson.ecb.catalog.model.PricelistWithInUse;
import com.ericsson.ecb.catalog.model.RateSchedule;
import com.ericsson.ecb.catalog.model.UnitDependentRecurringCharge;
import com.ericsson.ecb.catalog.model.instance.EffectiveDateMode;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.customer.client.ExtendedSubscriptionClient;
import com.ericsson.ecb.customer.model.AccInfoForInUseRates;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.Constants;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyConstants;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.PricelistDto;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferData;
import com.ericsson.ecb.ui.metraoffer.model.RateScheduleSetDto;
import com.ericsson.ecb.ui.metraoffer.model.RateTableTreeNode;
import com.ericsson.ecb.ui.metraoffer.model.ResponseModel;
import com.ericsson.ecb.ui.metraoffer.model.SharedPricelistDto;
import com.ericsson.ecb.ui.metraoffer.model.TemplateParameterTableMappingDto;
import com.ericsson.ecb.ui.metraoffer.model.TreeNode;
import com.ericsson.ecb.ui.metraoffer.model.TreeNodeType;
import com.ericsson.ecb.ui.metraoffer.service.MetadataConfigService;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemTemplateService;
import com.ericsson.ecb.ui.metraoffer.service.PricelistMappingService;
import com.ericsson.ecb.ui.metraoffer.service.PricelistService;
import com.ericsson.ecb.ui.metraoffer.service.ProductOfferService;
import com.ericsson.ecb.ui.metraoffer.service.RateScheduleService;
import com.ericsson.ecb.ui.metraoffer.utils.CommonUtils;


@Service
public class PricelistServiceImpl implements PricelistService {

  private final Logger logger = LoggerFactory.getLogger(PricelistServiceImpl.class);

  @Autowired
  private PricelistClient pricelistClient;

  @Autowired
  private ProductOfferService productOfferService;

  @Autowired
  private ExtendedPricelistClient extendedPricelistClient;

  @Autowired
  private PricelistMappingService pricelistMappingService;

  @Autowired
  private MetadataConfigService metadataConfigService;

  @Autowired
  private RateScheduleService rateScheduleService;

  @Autowired
  private PriceableItemTemplateService priceableItemTemplateService;

  @Autowired
  private ExtendedSubscriptionClient extendedSubscriptionClient;

  @Autowired
  private LocalizedEntityService localizedEntityService;

  @Autowired
  private UnitDependentRecurringChargeClient unitDependentRecurringChargeClient;

  @Override
  public PaginatedList<Pricelist> findPricelist(Integer page, Integer size, String[] sort,
      String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException {
    query = prepareSharedRateFilterQuery(query);
    return pricelistClient.findPricelist(page, size, sort, query, descriptionLanguage,
        descriptionFilters, descriptionSort).getBody();
  }

  @Override
  public PaginatedList<PricelistWithInUse> findSharedPricelist(Integer page, Integer size,
      String[] sort, String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException {
    PaginatedList<PricelistWithInUse> pricelists = findNonLocalizedSharedPricelist(page, size, sort,
        query, descriptionLanguage, descriptionFilters, descriptionSort);
    return localizedEntityService.localizedFindEntity(pricelists);
  }

  private PaginatedList<PricelistWithInUse> findNonLocalizedSharedPricelist(Integer page,
      Integer size, String[] sort, String query, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException {
    query = prepareSharedRateFilterQuery(query);
    PaginatedList<PricelistWithInUse> sharedRates = findAllPricelist(page, size, sort, query,
        descriptionLanguage, descriptionFilters, descriptionSort);
    return localizedEntityService.localizedFindEntity(sharedRates);
  }

  @Override
  public Pricelist getSharedPricelist(Integer pricelistId) throws EcbBaseException {
    Pricelist pricelist = pricelistClient.getPricelist(pricelistId).getBody();
    return localizedEntityService.localizedGetEntity(pricelist);
  }

  @Override
  public PaginatedList<PricelistWithInUse> findAllPricelist(Integer page, Integer size,
      String[] sort, String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException {
    return extendedPricelistClient.extendedFindPricelist(page, size, sort, query,
        descriptionLanguage, descriptionFilters, descriptionSort).getBody();
  }

  private String prepareSharedRateFilterQuery(String query) {
    return (StringUtils.isEmpty(query)) ? PropertyRsqlConstants.TYPE_EQUAL_REGULAR
        : query + RsqlOperator.AND + PropertyRsqlConstants.TYPE_EQUAL_REGULAR;
  }

  @Override
  public PaginatedList<ProductOfferData> findInUseOfferings(Integer pricelistId, Integer page,
      Integer size, String[] sort, String query, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException {
    Pricelist pricelist = pricelistClient.getPricelist(pricelistId).getBody();
    if (pricelist != null) {
      Collection<PricelistMapping> pricelistMappings = pricelistMappingService
          .findPricelistMapping(null, PropertyRsqlConstants.PRICELIST_ID_EQUAL + pricelistId);

      Map<Integer, List<PricelistMapping>> pricelistMappingsMap =
          pricelistMappings.stream().collect(Collectors.groupingBy(PricelistMapping::getOfferId));
      Set<Integer> offerIds = pricelistMappingsMap.keySet();
      PaginatedList<ProductOfferData> records = productOfferService.findOfferingsForInUse(offerIds,
          page, size, sort, query, descriptionLanguage, descriptionFilters, descriptionSort);
      return localizedEntityService.localizedFindEntity(records);
    }
    return null;
  }

  @Override
  public ResponseEntity<Pricelist> createPricelist(LocalizedPricelist pricelist)
      throws EcbBaseException {
    localizedEntityService.localizedCreateEntity(pricelist);
    return pricelistClient.createPricelist(pricelist);
  }

  @Override
  public ResponseEntity<Pricelist> copyPriceList(Integer pricelistId, LocalizedPricelist record)
      throws EcbBaseException {
    localizedEntityService.localizedCreateEntity(record);
    return extendedPricelistClient.copyPriceList(pricelistId, record);
  }

  @Override
  public ResponseEntity<Pricelist> updatePricelist(Pricelist record) throws EcbBaseException {
    Pricelist pricelist = new Pricelist();
    BeanUtils.copyProperties(record, pricelist);
    ResponseEntity<Pricelist> pricelistRsp =
        pricelistClient.updatePricelist(pricelist, pricelist.getPricelistId());
    localizedEntityService.localizedUpdateEntity(pricelistRsp.getBody());
    return pricelistRsp;
  }

  @Override
  public ResponseEntity<Boolean> deletePricelist(Integer pricelistId) throws EcbBaseException {
    return extendedPricelistClient.deletePriceList(pricelistId);
  }

  @Override
  public PricelistDto getPricelist(Integer pricelistId) throws EcbBaseException {
    String query = PropertyRsqlConstants.PRICELIST_ID_EQUAL + pricelistId;
    PaginatedList<PricelistWithInUse> records =
        findSharedPricelist(1, Integer.MAX_VALUE, null, query, null, null, null);
    if (!CollectionUtils.isEmpty(records.getRecords())) {
      List<PricelistWithInUse> recordLists = (List<PricelistWithInUse>) records.getRecords();
      PricelistDto pricelistDto = new PricelistDto();
      BeanUtils.copyProperties(recordLists.get(0), pricelistDto);
      pricelistDto.setExtendedProperties(metadataConfigService
          .getExtendedProperties(pricelistDto.getProperties(), PropertyKind.PRICE_LIST));
      return localizedEntityService.localizedGetEntity(pricelistDto);
    }
    return null;
  }

  private Set<Integer> getRateScheduleTemplateId(Collection<RateSchedule> rateSchedules) {
    Set<Integer> templateIds = new HashSet<>();
    rateSchedules.forEach(rateSchedule -> {
      if (rateSchedule.getTemplateParentId() != null)
        templateIds.add(rateSchedule.getTemplateParentId());
      if (rateSchedule.getItemTemplateId() != null)
        templateIds.add(rateSchedule.getItemTemplateId());

    });
    return templateIds;
  }


  private Set<String> getRateScheduleTemplateIdTmpKey(Collection<RateSchedule> rateSchedules) {
    Set<String> templateIdKeys = new HashSet<>();
    rateSchedules.forEach(rateSchedule -> {
      if (rateSchedule.getItemTemplateId() != null && rateSchedule.getTemplateParentId() != null) {
        templateIdKeys
            .add(rateSchedule.getItemTemplateId() + "|" + rateSchedule.getTemplateParentId());
      }
    });
    return templateIdKeys;
  }

  private Map<String, PriceableItemTemplateParameterTableMapping> getPiTemplateIdParameterTableMappingKeyMap(
      Collection<PriceableItemTemplateParameterTableMapping> piTemplateParameterTableMappings) {
    Map<String, PriceableItemTemplateParameterTableMapping> templateMap = new HashMap<>();
    piTemplateParameterTableMappings.forEach(piTemplateParameterTableMapping -> {
      String piTemplateIdParameterTableMappingKey = piTemplateParameterTableMapping.getTemplateId()
          + "|" + piTemplateParameterTableMapping.getTemplateParentId();
      templateMap.put(piTemplateIdParameterTableMappingKey, piTemplateParameterTableMapping);
    });
    return templateMap;
  }

  private Collection<PriceableItemTemplateParameterTableMapping> getPriceableItemParamTableMapping(
      Set<Integer> templateIds) throws EcbBaseException {
    String query = StringUtils.EMPTY;
    if (!CollectionUtils.isEmpty(templateIds)) {
      query = CommonUtils.getQueryStringFromCollection(templateIds,
          PropertyRsqlConstants.TEMPLATE_PARENT_ID_IN) + RsqlOperator.OR
          + CommonUtils.getQueryStringFromCollection(templateIds,
              PropertyRsqlConstants.TEMPLATE_ID_IN);
    }
    return priceableItemTemplateService
        .getPriceableItemParamTableMapping(1, Integer.MAX_VALUE, null, query, null, null, null)
        .getRecords();
  }

  private RateSchedule getDummyRateSchedule(
      PriceableItemTemplateParameterTableMapping piTemplateParameterTableMapping) {
    RateSchedule dummyRateSchedule = new RateSchedule();
    dummyRateSchedule.setItemTemplateId(piTemplateParameterTableMapping.getTemplateId());
    dummyRateSchedule.setItemTemplateName(piTemplateParameterTableMapping.getName());
    dummyRateSchedule.setItemTemplateNameId(piTemplateParameterTableMapping.getNameId());
    dummyRateSchedule.setItemTemplateDisplayName(piTemplateParameterTableMapping.getDisplayName());
    dummyRateSchedule.setItemTemplateDescription(piTemplateParameterTableMapping.getDescription());
    dummyRateSchedule.setItemTemplateKind(piTemplateParameterTableMapping.getKind());
    dummyRateSchedule.setTemplateParentId(piTemplateParameterTableMapping.getTemplateParentId());
    return dummyRateSchedule;
  }

  private List<RateSchedule> getRateScheduleChildPis(Collection<RateSchedule> rateSchedules)
      throws EcbBaseException {
    List<RateSchedule> childRateSchedules = new ArrayList<>();
    Set<String> rateScheduleTemplateIdKeys = getRateScheduleTemplateIdTmpKey(rateSchedules);
    Set<Integer> rateScheduleTemplateIds = getRateScheduleTemplateId(rateSchedules);

    Collection<PriceableItemTemplateParameterTableMapping> piTemplateMappings =
        getPriceableItemParamTableMapping(rateScheduleTemplateIds);

    Map<String, PriceableItemTemplateParameterTableMapping> piTemplateIdParameterTableMappingKeyMap =
        getPiTemplateIdParameterTableMappingKeyMap(piTemplateMappings);

    piTemplateIdParameterTableMappingKeyMap
        .forEach((piTemplateIdParameterTableMappingKey, piTemplateParameterTableMapping) -> {
          if (!rateScheduleTemplateIdKeys.contains(piTemplateIdParameterTableMappingKey)) {
            childRateSchedules.add(getDummyRateSchedule(piTemplateParameterTableMapping));
          }
        });
    return childRateSchedules;
  }

  @Override
  public Object getMappedParameterTables(Integer pricelistId, Integer selectedParentTemplateId,
      Integer selectedTemplatedId, Integer selectedParameterTableId) throws EcbBaseException {

    logger.info("Fetching all mapped templates for pricelistId:{}", pricelistId);
    PaginatedList<RateSchedule> paginatedRateSchedule = rateScheduleService.findRateSchedule(1,
        Integer.MAX_VALUE, null, PropertyRsqlConstants.PRICELIST_ID_EQUAL + pricelistId);
    Collection<RateSchedule> rateSchedules = paginatedRateSchedule.getRecords();
    logger.info("Received Mapped templates for pricelistId:{} from rate schedules",
        rateSchedules.size());

    if (!CollectionUtils.isEmpty(rateSchedules)) {
      rateSchedules.addAll(getRateScheduleChildPis(rateSchedules));
    }

    List<TreeNode> parentPriceableItems = new ArrayList<>();
    if (!CollectionUtils.isEmpty(rateSchedules)) {
      Set<String> ignoreRecords = new HashSet<>();
      Set<Integer> templateIds = new HashSet<>();
      Map<Integer, List<TreeNode>> paramTableMap = new HashMap<>();
      Map<Integer, List<TreeNode>> childPiMap = new HashMap<>();
      for (RateSchedule rateSchedule : rateSchedules) {
        String record = rateSchedule.getItemTemplateId() + "-" + rateSchedule.getPtId();
        if (!ignoreRecords.contains(record)) {
          ignoreRecords.add(record);
          if (rateSchedule.getTemplateParentId() == null
              && !ignoreRecords.contains(rateSchedule.getItemTemplateId() + "")) {
            TreeNode parentPi =
                createPiNode(rateSchedule, rateSchedule.getItemTemplateId(), TreeNodeType.PI);
            parentPriceableItems.add(parentPi);
            ignoreRecords.add(rateSchedule.getItemTemplateId() + "");
          } else if (!ignoreRecords.contains(rateSchedule.getItemTemplateId() + "")) {
            List<TreeNode> piList = null;
            if (childPiMap.get(rateSchedule.getTemplateParentId()) == null) {
              piList = new ArrayList<>();
            } else {
              piList = childPiMap.get(rateSchedule.getTemplateParentId());
            }
            piList.add(createPiNode(rateSchedule, rateSchedule.getTemplateParentId(),
                TreeNodeType.CHILD_PI));
            childPiMap.put(rateSchedule.getTemplateParentId(), piList);
            ignoreRecords.add(rateSchedule.getItemTemplateId() + "");

          }
          if (rateSchedule.getPtId() != null) {
            List<TreeNode> paramTableList = null;
            if (paramTableMap.get(rateSchedule.getItemTemplateId()) == null) {
              paramTableList = new ArrayList<>();
            } else {
              paramTableList = paramTableMap.get(rateSchedule.getItemTemplateId());
            }
            paramTableList.add(createParamTableNode(rateSchedule, rateSchedule.getItemTemplateId(),
                TreeNodeType.PARAM_TABLE));
            paramTableMap.put(rateSchedule.getItemTemplateId(), paramTableList);
          }
          templateIds.add(rateSchedule.getItemTemplateId());
        }
      }
      logger.info("Mapped templates for pricelistId:{} ", templateIds);
      Map<Integer, Integer> templateParamTableMappingCount =
          getTemplateParamTableMappingCount(templateIds);
      for (TreeNode treeNode : parentPriceableItems) {
        List<TreeNode> children = childPiMap.get(treeNode.getId());
        if (!CollectionUtils.isEmpty(children)) {
          for (TreeNode childPiNode : children) {
            List<TreeNode> childrenTmp = paramTableMap.get(childPiNode.getId());
            if (childrenTmp != null)
              childPiNode.setChildren(childrenTmp);
            childPiNode.setAdded(childPiNode.getChildren().size());
            childPiNode.setAvailable(templateParamTableMappingCount.get(childPiNode.getId()));
            treeNode.setAdded(treeNode.getAdded() + childPiNode.getChildren().size());
          }
        }
        childPiMap.remove(treeNode.getId());
        List<TreeNode> parentParamTables = paramTableMap.get(treeNode.getId());
        if (!CollectionUtils.isEmpty(parentParamTables)) {
          if (children == null) {
            children = new ArrayList<>();
          }
          children.addAll(0, parentParamTables);
        }
        treeNode.setChildren(children);
        treeNode.setAdded(
            treeNode.getAdded() + (parentParamTables != null ? parentParamTables.size() : 0));
        treeNode.setAvailable(templateParamTableMappingCount.get(treeNode.getId()));
      }
      logger.info("Child templates only mapped to pricelist {}", childPiMap.size());
      if (!CollectionUtils.isEmpty(childPiMap)) {
        childPiMap.forEach((k, childPis) -> {
          for (TreeNode childPi : childPis) {
            List<TreeNode> childrenTmp = paramTableMap.get(childPi.getId());
            if (childrenTmp != null)
              childPi.setChildren(childrenTmp);
            if (childPi.getChildren() != null)
              childPi.setAdded(childPi.getChildren().size());
            else
              childPi.setAdded(0);
            childPi.setAvailable(childPi.getAdded());
            childPi.setAvailable(templateParamTableMappingCount.get(childPi.getId()));
            parentPriceableItems.add(childPi);
          }
        });
      }
    }

    sortTreeNode(parentPriceableItems);

    Map<String, Integer> selectedIndexMap = new HashMap<>();
    if (selectedTemplatedId != null) {
      selectedIndexMap = getIndexes(parentPriceableItems, selectedParentTemplateId,
          selectedTemplatedId, selectedParameterTableId);
    }
    RateTableTreeNode rateTableTreeNode = new RateTableTreeNode();
    rateTableTreeNode.setTreeNodes(parentPriceableItems);
    rateTableTreeNode.getSelectedIndex().putAll(selectedIndexMap);
    return rateTableTreeNode;
  }

  private Map<String, Integer> getIndexes(List<TreeNode> parentPriceableItems,
      Integer selectedParentTemplateId, Integer selectedTemplatedId,
      Integer selectedParameterTableId) {
    Map<String, Integer> map = new HashMap<>();
    Integer selectedParentTemplatedIdIndex = null;
    Integer selectedChildTemplatedIdIndex = null;
    Integer selectedParameterTableIdIndex = null;

    Integer id = selectedParentTemplateId != null ? selectedParentTemplateId : selectedTemplatedId;
    selectedParentTemplatedIdIndex = getSelectedIndex(parentPriceableItems, id, TreeNodeType.PI);

    if (selectedParentTemplatedIdIndex != null) {
      List<TreeNode> childPiNodes =
          parentPriceableItems.get(selectedParentTemplatedIdIndex).getChildren();
      if (!CollectionUtils.isEmpty(childPiNodes)) {
        selectedChildTemplatedIdIndex =
            getSelectedIndex(parentPriceableItems.get(selectedParentTemplatedIdIndex).getChildren(),
                selectedTemplatedId, TreeNodeType.CHILD_PI);
      }
    }
    if (selectedChildTemplatedIdIndex != null) {
      List<TreeNode> paramTableNodes = parentPriceableItems.get(selectedParentTemplatedIdIndex)
          .getChildren().get(selectedChildTemplatedIdIndex).getChildren();
      if (!CollectionUtils.isEmpty(paramTableNodes)) {
        selectedParameterTableIdIndex =
            getSelectedIndex(paramTableNodes, selectedParameterTableId, TreeNodeType.PARAM_TABLE);
      }
    } else {
      List<TreeNode> paramTableNodes =
          parentPriceableItems.get(selectedParentTemplatedIdIndex).getChildren();
      if (!CollectionUtils.isEmpty(paramTableNodes)) {
        selectedChildTemplatedIdIndex =
            getSelectedIndex(paramTableNodes, selectedParameterTableId, TreeNodeType.PARAM_TABLE);
      }
    }
    map.put("parent", selectedParentTemplatedIdIndex);
    map.put("child", selectedChildTemplatedIdIndex);
    map.put("subChild", selectedParameterTableIdIndex);
    return map;
  }



  private Integer getSelectedIndex(List<TreeNode> treeNodes, Integer id, TreeNodeType nodeType) {
    for (int i = 0; i < treeNodes.size(); i++) {
      TreeNode treeNode = treeNodes.get(i);
      if (nodeType.equals(treeNode.getNodeType()) && id.equals(treeNode.getId())) {
        return i;
      }
    }
    return null;
  }

  private TreeNode createPiNode(RateSchedule rateSchedule, Integer parentId,
      TreeNodeType nodeType) {
    TreeNode treeNode = new TreeNode();
    treeNode.setId(rateSchedule.getItemTemplateId());
    treeNode.setName(rateSchedule.getItemTemplateName());
    treeNode.setNameId(rateSchedule.getItemTemplateNameId());
    treeNode.setDisplayName(rateSchedule.getItemTemplateDisplayName());
    treeNode.setDisplayNameId(rateSchedule.getItemTemplateDisplayNameId());
    treeNode.setParentId(parentId);
    treeNode.setNodeType(nodeType);
    treeNode.setChildren(new ArrayList<TreeNode>());
    treeNode.setKind(rateSchedule.getItemTemplateKind());
    return treeNode;
  }

  private TreeNode createParamTableNode(RateSchedule rateSchedule, Integer parentId,
      TreeNodeType nodeType) {
    TreeNode treeNode = new TreeNode();
    treeNode.setId(rateSchedule.getPtId());
    treeNode.setName(rateSchedule.getPtName());
    treeNode.setNameId(rateSchedule.getPtNameId());
    treeNode.setDisplayName(rateSchedule.getPtDisplayName());
    treeNode.setDisplayNameId(rateSchedule.getPtDisplayNameId());
    treeNode.setParentId(parentId);
    treeNode.setNodeType(nodeType);
    treeNode.setChildren(new ArrayList<TreeNode>());
    treeNode.setKind(rateSchedule.getItemTemplateKind());
    return treeNode;
  }

  @Override
  public List<ResponseModel> addParameterTables(List<SharedPricelistDto> records)
      throws EcbBaseException {
    List<ResponseModel> responseModelList = new ArrayList<>();
    RateScheduleSetDto rateScheduleSetDto = new RateScheduleSetDto();
    List<LocalizedRateSchedule> rateSchedules = new ArrayList<>();
    if (!CollectionUtils.isEmpty(records)) {
      for (SharedPricelistDto sharedPricelistDto : records) {
        LocalizedRateSchedule rateSchedule = new LocalizedRateSchedule();
        rateSchedule.setSchedId(sharedPricelistDto.getRefId());
        rateSchedule.setItemTemplateId(sharedPricelistDto.getTemplateId());
        rateSchedule.setPricelistId(sharedPricelistDto.getPricelistId());
        rateSchedule.setPtId(sharedPricelistDto.getPtId());
        rateSchedule.setTemplateParentId(sharedPricelistDto.getTemplateParentId());
        rateSchedule.setStartDateType(EffectiveDateMode.NOT_SET);
        rateSchedule.setEndDateType(EffectiveDateMode.NOT_SET);
        rateSchedules.add(rateSchedule);
      }
      rateScheduleSetDto.setCreateSet(rateSchedules);
      responseModelList = rateScheduleService.editRateScheduleSet(rateScheduleSetDto);
    }
    return responseModelList;
  }

  @Override
  public PaginatedList<TemplateParameterTableMappingDto> getPricelistPriceableItemParamTableMapping(
      Integer pricelistId, Integer templateId, Integer page, Integer size, String[] sort,
      String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException {
    logger.info("Fetching already mapped rate tables to exclude them in the listing");
    PaginatedList<RateSchedule> paginatedRateSchedule = rateScheduleService.findRateSchedule(1,
        Integer.MAX_VALUE, null, PropertyRsqlConstants.PRICELIST_ID_EQUAL + pricelistId);
    Collection<RateSchedule> rateSchedules = paginatedRateSchedule.getRecords();
    logger.info("Received already mapped rate tables to exclude them in the listing {}",
        rateSchedules.size());
    Integer templateParentId = null;
    StringBuilder filterQuery = new StringBuilder();
    Set<String> ignoreRepeatedRates = new HashSet<>();
    if (!CollectionUtils.isEmpty(rateSchedules)) {
      for (RateSchedule rateSchedule : rateSchedules) {
        if (templateId != null && templateId.equals(rateSchedule.getItemTemplateId())) {
          templateParentId = rateSchedule.getTemplateParentId();
        }
        String record = rateSchedule.getItemTemplateId() + "-" + rateSchedule.getPtId();
        if (!ignoreRepeatedRates.contains(record)) {
          ignoreRepeatedRates.add(record);
          filterQuery.append("(" + PropertyRsqlConstants.TEMPLATE_ID_NOT_EQUAL
              + rateSchedule.getItemTemplateId() + RsqlOperator.AND
              + PropertyRsqlConstants.PT_ID_EQUAL + rateSchedule.getPtId() + ")");
        }
      }
    }
    query = prepareTemplateSpecQuery(templateId, templateParentId, query);
    logger.info(
        "Fetching PriceableItemTemplateParameterTableMapping with specific templete id if supplied query: {}",
        query);
    Collection<PriceableItemTemplateParameterTableMapping> records =
        priceableItemTemplateService.getPriceableItemParamTableMapping(1, Integer.MAX_VALUE, sort,
            query, descriptionLanguage, descriptionFilters, descriptionSort).getRecords();
    logger.info(
        "Received PriceableItemTemplateParameterTableMapping with specific templete id if supplied query size : {}",
        records.size());
    Collection<TemplateParameterTableMappingDto> dtoRecords =
        createMappingPaginated(records, ignoreRepeatedRates);
    PaginatedList<TemplateParameterTableMappingDto> paginatedRecords =
        CommonUtils.customPaginatedList(dtoRecords, page, size);
    return localizedEntityService.localizedFindEntity(paginatedRecords);
  }

  private String prepareTemplateSpecQuery(Integer templateId, Integer templateParentId,
      String query) {
    StringBuilder baseQuery = new StringBuilder();
    if (StringUtils.isNotBlank(query)) {
      baseQuery.append(query);
    }
    if (templateId != null) {
      if (StringUtils.isNotBlank(baseQuery))
        baseQuery.append(RsqlOperator.AND);
      baseQuery.append(PropertyRsqlConstants.TEMPLATE_ID_EQUAL).append(templateId);
      if (templateParentId != null) {
        if (StringUtils.isNotBlank(baseQuery))
          baseQuery.append(RsqlOperator.AND);
        baseQuery.append(PropertyConstants.TEMPLATE_PARENT_ID).append(RsqlOperator.EQUAL)
            .append(templateParentId);
      }
    }
    return baseQuery.toString();
  }

  private Collection<PriceableItemTemplateParameterTableMapping> getFilteredTemplateParameterTable(
      Collection<PriceableItemTemplateParameterTableMapping> templateParamTableMappings)
      throws EcbBaseException {
    Collection<PriceableItemTemplateParameterTableMapping> filteredList = new ArrayList<>();
    Map<Integer, Integer> ratingTypeMap = getRatingType(templateParamTableMappings);
    for (PriceableItemTemplateParameterTableMapping templateParamTableMapping : templateParamTableMappings) {
      if (templateParamTableMapping.getKind().equals(PropertyKind.UNIT_DEPENDENT_RECURRING)) {
        Integer ratingType = ratingTypeMap.get(templateParamTableMapping.getPropId());
        String ptName = getPtName(templateParamTableMapping.getPtName());
        if ((ratingType.equals(0) && StringUtils.contains(ptName, Constants.UDRC_TIERED))
            || (ratingType.equals(1) && StringUtils.contains(ptName, Constants.UDRC_TAPERED))) {
          filteredList.add(templateParamTableMapping);
        }
      } else {
        filteredList.add(templateParamTableMapping);
      }
    }
    return filteredList;
  }

  private Map<Integer, Integer> getTemplateParamTableMappingCount(Set<Integer> templateIds)
      throws EcbBaseException {
    StringBuilder query = new StringBuilder(CommonUtils.getQueryStringFromCollection(templateIds,
        PropertyRsqlConstants.TEMPLATE_ID_IN));
    query.append(RsqlOperator.OR);
    query.append(CommonUtils.getQueryStringFromCollection(templateIds,
        PropertyRsqlConstants.TEMPLATE_PARENT_ID_IN));
    logger.info("Fetching TemplateParamTableMappingCount with query :{}", query);
    Collection<PriceableItemTemplateParameterTableMapping> templateParamTableMappings =
        priceableItemTemplateService.getPriceableItemParamTableMapping(1, Integer.MAX_VALUE, null,
            query.toString(), null, null, null).getRecords();
    logger.info("Received TemplateParamTableMappingCount count :{}",
        templateParamTableMappings.size());
    Map<Integer, Integer> templateParamTableMappingCountMap = new HashMap<>();
    if (!CollectionUtils.isEmpty(templateParamTableMappings)) {

      Collection<PriceableItemTemplateParameterTableMapping> filteredRecords =
          getFilteredTemplateParameterTable(templateParamTableMappings);

      for (PriceableItemTemplateParameterTableMapping templateParamTableMapping : filteredRecords) {
        Integer templateId = templateParamTableMapping.getTemplateId();
        Integer count = templateParamTableMappingCountMap.get(templateId) != null
            ? templateParamTableMappingCountMap.get(templateId) : 0;
        templateParamTableMappingCountMap.put(templateId, count + 1);

        if (templateParamTableMapping.getTemplateParentId() != null) {
          Integer templateParentId = templateParamTableMapping.getTemplateParentId();
          Integer parentCount = templateParamTableMappingCountMap.get(templateParentId) != null
              ? templateParamTableMappingCountMap.get(templateParentId) : 0;
          templateParamTableMappingCountMap.put(templateParentId, parentCount + 1);
        }
      }
    }
    return templateParamTableMappingCountMap;
  }

  private Collection<TemplateParameterTableMappingDto> createMappingPaginated(
      Collection<PriceableItemTemplateParameterTableMapping> mappingRecords,
      Set<String> ignoreRepeatedRates) throws EcbBaseException {
    List<TemplateParameterTableMappingDto> templateParameterTableMappingList = new ArrayList<>();
    if (!CollectionUtils.isEmpty(mappingRecords)) {
      Collection<PriceableItemTemplateParameterTableMapping> mappingRecordsList = new ArrayList<>();
      mappingRecords.forEach(templateTableMapping -> {
        if (!ignoreRepeatedRates.contains(
            templateTableMapping.getTemplateId() + "-" + templateTableMapping.getPtId())) {
          mappingRecordsList.add(templateTableMapping);
        }
      });

      Collection<PriceableItemTemplateParameterTableMapping> filteredRecords =
          getFilteredTemplateParameterTable(mappingRecordsList);
      filteredRecords.forEach(templateTableMapping -> templateParameterTableMappingList
          .add(getTemplateParameterTableMappingDto(templateTableMapping)));
    }
    return templateParameterTableMappingList;
  }

  private TemplateParameterTableMappingDto getTemplateParameterTableMappingDto(
      PriceableItemTemplateParameterTableMapping templateTableMapping) {
    TemplateParameterTableMappingDto templateParameterTableMappingDto =
        new TemplateParameterTableMappingDto();
    BeanUtils.copyProperties(templateTableMapping, templateParameterTableMappingDto);
    templateParameterTableMappingDto
        .setPiKind(Constants.KIND.get(templateTableMapping.getKind().name()));
    return templateParameterTableMappingDto;
  }

  private String getPtName(String name) {
    return name.substring(name.lastIndexOf('/') + 1, name.length());
  }

  private Map<Integer, Integer> getRatingType(
      Collection<PriceableItemTemplateParameterTableMapping> mappingRecords)
      throws EcbBaseException {
    Map<Integer, Integer> ratingTypeMap = new HashMap<>();
    Set<Integer> propId = new HashSet<>();
    for (PriceableItemTemplateParameterTableMapping pi : mappingRecords) {
      if (pi.getKind().equals(PropertyKind.UNIT_DEPENDENT_RECURRING)) {
        propId.add(pi.getPropId());
      }
    }
    String query =
        CommonUtils.getQueryStringFromCollection(propId, PropertyRsqlConstants.PROP_ID_IN);
    Collection<UnitDependentRecurringCharge> udrcPaginatedRecords;
    udrcPaginatedRecords = unitDependentRecurringChargeClient
        .findUnitDependentRecurringCharge(1, Integer.MAX_VALUE, null, query).getBody().getRecords();
    udrcPaginatedRecords.forEach(unitDependentRecurringCharge -> ratingTypeMap.put(
        unitDependentRecurringCharge.getPropId(), unitDependentRecurringCharge.getRatingType()));
    return ratingTypeMap;
  }

  @Override
  public PaginatedList<AccInfoForInUseRates> findInUseSubscribers(Integer page, Integer size,
      String[] sort, String query) throws EcbBaseException {
    return extendedSubscriptionClient.getAccountInfoForInUse(page, size, sort, query).getBody();
  }

  @Override
  public PricelistWithInUse getSharedRateInUseInfo(Integer pricelistId) throws EcbBaseException {
    String query = PropertyRsqlConstants.PRICELIST_ID_EQUAL + pricelistId;
    PaginatedList<PricelistWithInUse> records =
        findSharedPricelist(1, Integer.MAX_VALUE, null, query, null, null, null);
    if (!CollectionUtils.isEmpty(records.getRecords())) {
      List<PricelistWithInUse> recordLists = (List<PricelistWithInUse>) records.getRecords();
      return recordLists.get(0);
    }
    return null;
  }

  private void sortTreeNode(List<TreeNode> list) {
    Collections.sort(list);
    sortChildren(list);
  }

  private static void sortChildren(List<TreeNode> list) {
    for (TreeNode treeNode : list) {
      if (!CollectionUtils.isEmpty(treeNode.getChildren())) {
        Collections.sort(treeNode.getChildren());
        sortChildren(treeNode.getChildren());
      }
    }
  }

  @Override
  public PaginatedList<PricelistWithInUse> findRqrdSharedPricelist(Integer itemTemplateId,
      Integer paramtableId) throws EcbBaseException {
    PaginatedList<PricelistWithInUse> paginatedList = null;
    Collection<RateSchedule> rateSchedules = getRateSchedules(itemTemplateId, paramtableId);
    if (!CollectionUtils.isEmpty(rateSchedules)) {
      Set<Integer> priceListIds = new HashSet<>();
      rateSchedules.forEach(rateSchedule -> priceListIds.add(rateSchedule.getPricelistId()));
      String query = CommonUtils.getQueryStringFromCollection(priceListIds,
          PropertyRsqlConstants.PRICELIST_ID_IN);
      paginatedList =
          findNonLocalizedSharedPricelist(1, Integer.MAX_VALUE, null, query, null, null, null);
    } else {
      List<PricelistWithInUse> pricelistWithInUseList = new ArrayList<>();
      paginatedList = new PaginatedList<>();
      paginatedList.setRecords(pricelistWithInUseList);
    }
    return paginatedList;
  }

  private Collection<RateSchedule> getRateSchedules(Integer itemTemplateId, Integer ptId)
      throws EcbBaseException {
    String query = PropertyRsqlConstants.ITEM_TEMPLATE_ID_EQUAL + itemTemplateId + RsqlOperator.AND
        + PropertyRsqlConstants.PT_ID_EQUAL + ptId;
    PaginatedList<RateSchedule> paginatedRateSchedule =
        rateScheduleService.findRateSchedule(1, Integer.MAX_VALUE, null, query);
    return paginatedRateSchedule.getRecords();
  }

}
