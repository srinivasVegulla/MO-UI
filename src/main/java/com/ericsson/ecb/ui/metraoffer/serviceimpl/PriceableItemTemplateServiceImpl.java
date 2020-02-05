package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ericsson.ecb.catalog.client.ExtendedPriceableItemTemplateClient;
import com.ericsson.ecb.catalog.client.ExtendedPriceableItemTemplateParameterTableMappingClient;
import com.ericsson.ecb.catalog.client.ParameterTableClient;
import com.ericsson.ecb.catalog.client.PriceableItemTemplateClient;
import com.ericsson.ecb.catalog.client.PriceableItemTypeClient;
import com.ericsson.ecb.catalog.client.PriceableItemTypeParameterTableMappingClient;
import com.ericsson.ecb.catalog.client.PricelistClient;
import com.ericsson.ecb.catalog.client.RateScheduleClient;
import com.ericsson.ecb.catalog.model.LocalizedPriceableItemTemplate;
import com.ericsson.ecb.catalog.model.ParameterTable;
import com.ericsson.ecb.catalog.model.PriceableItemTemplate;
import com.ericsson.ecb.catalog.model.PriceableItemTemplateParameterTableMapping;
import com.ericsson.ecb.catalog.model.PriceableItemTemplateWithInUse;
import com.ericsson.ecb.catalog.model.PriceableItemType;
import com.ericsson.ecb.catalog.model.PriceableItemTypeParameterTableMapping;
import com.ericsson.ecb.catalog.model.Pricelist;
import com.ericsson.ecb.catalog.model.PricelistMapping;
import com.ericsson.ecb.catalog.model.RateSchedule;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.client.UsageCycleClient;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.common.model.UsageCycle;
import com.ericsson.ecb.pricing.client.DecisionTypeClient;
import com.ericsson.ecb.pricing.model.DecisionType;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.Constants;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemRateTableModel;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemTemplateModel;
import com.ericsson.ecb.ui.metraoffer.model.PricelistModel;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferData;
import com.ericsson.ecb.ui.metraoffer.model.UsagePriceableItemModel;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemDiscountService;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemNonRecurringService;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemRecurringService;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemTemplateService;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemUnitDependentRecurringService;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemUsageService;
import com.ericsson.ecb.ui.metraoffer.service.PricelistMappingService;
import com.ericsson.ecb.ui.metraoffer.service.ProductOfferBundleService;
import com.ericsson.ecb.ui.metraoffer.service.ProductOfferService;
import com.ericsson.ecb.ui.metraoffer.utils.CommonUtils;

@Service
public class PriceableItemTemplateServiceImpl implements PriceableItemTemplateService {

  @Autowired
  private PriceableItemTemplateClient priceableItemTemplateClient;

  @Autowired
  private PricelistMappingService pricelistMappingService;

  @Autowired
  private ProductOfferService productOfferService;

  @Autowired
  private PriceableItemTypeClient priceItemTypeClient;

  @Autowired
  private PricelistClient pricelistClient;

  @Autowired
  private RateScheduleClient rateScheduleClient;

  @Autowired
  private ExtendedPriceableItemTemplateParameterTableMappingClient extendedPriceableItemTemplateParameterTableMappingClient;

  @Autowired
  private PriceableItemUsageService priceableItemUsageService;

  @Autowired
  private PriceableItemDiscountService priceableItemDiscountService;

  @Autowired
  private PriceableItemNonRecurringService priceableItemNonRecurringService;

  @Autowired
  private PriceableItemRecurringService priceableItemRecurringService;

  @Autowired
  private PriceableItemUnitDependentRecurringService priceableItemUnitDependentRecurringService;

  @Autowired
  private ExtendedPriceableItemTemplateClient extendedPriceableItemTemplateClient;

  @Autowired
  private PriceableItemTypeParameterTableMappingClient priceableItemTypeParameterTableMappingClient;

  @Autowired
  private ParameterTableClient parameterTableClient;

  @Autowired
  private DecisionTypeClient decisionTypeClient;

  @Autowired
  private UsageCycleClient usageCycleClient;

  @Autowired
  private LocalizedEntityService localizedEntityService;

  @Autowired
  private ProductOfferBundleService productOfferBundleService;

  private static final Logger LOGGER =
      LoggerFactory.getLogger(PriceableItemTemplateServiceImpl.class);

  @Override
  public PaginatedList<PriceableItemTemplateModel> findPriceableItemTemplateGridView(Integer page,
      Integer size, String[] sort, String query, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException {

    PaginatedList<PriceableItemTemplateModel> priceableItemTemplateModelPaginated =
        findParentPriceableItemTemplate(page, size, sort, query, descriptionLanguage,
            descriptionFilters, descriptionSort);

    List<PriceableItemTemplateModel> priceableItemTemplateModels = new ArrayList<>();
    priceableItemTemplateModels.addAll(priceableItemTemplateModelPaginated.getRecords());

    Collection<PriceableItemTemplateWithInUse> childPriceableItemTemplates =
        findChildPriceableItemTemplate().getRecords();

    addChildPriceableItemTemplate(priceableItemTemplateModels, childPriceableItemTemplates);
    updateChangeType(priceableItemTemplateModels);
    localizedEntityService.localizedFindEntity(priceableItemTemplateModelPaginated);
    return priceableItemTemplateModelPaginated;
  }

  @Override
  public PriceableItemTemplateModel getPriceableItemTemplateDetails(Integer templateId)
      throws EcbBaseException {
    PriceableItemTemplateModel priceableItemTemplateModel = new PriceableItemTemplateModel();
    String query = PropertyRsqlConstants.TEMPLATE_ID_EQUAL + templateId;
    Collection<PriceableItemTemplateModel> priceableItemTemplateModelList =
        findPriceableItemTemplateGridView(1, Integer.MAX_VALUE, null, query, null, null, null)
            .getRecords();

    if (!CollectionUtils.isEmpty(priceableItemTemplateModelList)
        && priceableItemTemplateModelList.size() == 1) {
      priceableItemTemplateModel = priceableItemTemplateModelList.iterator().next();
    }
    return priceableItemTemplateModel;
  }

  private void updateChangeType(List<PriceableItemTemplateModel> priceableItemTemplateModels)
      throws EcbBaseException {
    Collection<PriceableItemType> priceableItemTypes =
        findPriceableItemTypeFromApi(1, Integer.MAX_VALUE, null, null);
    Map<Integer, PriceableItemType> typeName = getPriceableItemTypeName(priceableItemTypes);
    priceableItemTemplateModels.forEach(priceableItemTemplateModel -> {
      PriceableItemType priceableItemType = typeName.get(priceableItemTemplateModel.getPiId());
      priceableItemTemplateModel.setChargeTypeName(priceableItemType.getDisplayName());
      priceableItemTemplateModel.setChargeTypeNameId(priceableItemType.getDisplayNameId());
    });
  }

  private List<PriceableItemTemplateModel> addChildPriceableItemTemplate(
      List<PriceableItemTemplateModel> priceableItemTemplateModels,
      Collection<PriceableItemTemplateWithInUse> childPriceableItemTemplates) {
    Map<Integer, PriceableItemTemplateModel> parentPriceableItemTemplateModelMap =
        getPriceableItemTemplateModelIdMap(priceableItemTemplateModels);
    Map<Integer, Set<PriceableItemTemplateWithInUse>> chidPriceableItemTemplateMap =
        getPriceableItemTemplateIdMap(childPriceableItemTemplates);

    parentPriceableItemTemplateModelMap.forEach((key, value) -> {
      if (chidPriceableItemTemplateMap.containsKey(key)) {
        Set<PriceableItemTemplateWithInUse> inUseList = chidPriceableItemTemplateMap.get(key);
        value.addChilds(inUseList);
        if (value.getKind().equals(PropertyKind.USAGE)) {
          inUseList.forEach(priceableItemTemplateWithInUse -> value
              .setSharedRateListCount(value.getSharedRateListCount()
                  + priceableItemTemplateWithInUse.getSharedRateListCount()));
        }
      }
    });
    return priceableItemTemplateModels;
  }

  private Map<Integer, PriceableItemTemplateModel> getPriceableItemTemplateModelIdMap(
      List<PriceableItemTemplateModel> priceableItemTemplates) {
    Map<Integer, PriceableItemTemplateModel> priceableItemTemplateIdMap = new HashMap<>();
    priceableItemTemplates.forEach(priceableItemTemplate -> priceableItemTemplateIdMap
        .put(priceableItemTemplate.getTemplateId(), priceableItemTemplate));
    return priceableItemTemplateIdMap;
  }

  private Map<Integer, Set<PriceableItemTemplateWithInUse>> getPriceableItemTemplateIdMap(
      Collection<PriceableItemTemplateWithInUse> priceableItemTemplates) {
    Map<Integer, Set<PriceableItemTemplateWithInUse>> priceableItemTemplateIdMap = new HashMap<>();
    priceableItemTemplates.forEach(priceableItemTemplate -> {
      Integer templateParentId = priceableItemTemplate.getTemplateParentId();
      if (!priceableItemTemplateIdMap.containsKey(templateParentId)) {
        Set<PriceableItemTemplateWithInUse> set = new HashSet<>();
        set.add(priceableItemTemplate);
        priceableItemTemplateIdMap.put(templateParentId, set);
      } else {
        priceableItemTemplateIdMap.get(templateParentId).add(priceableItemTemplate);
      }
    });
    return priceableItemTemplateIdMap;
  }

  @Override
  public PaginatedList<PriceableItemTemplateModel> findPriceableItemTemplatesForOfferings(
      Boolean isBundle, Integer offeringId, Integer page, Integer size, String[] sort,
      String queryIn, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException {

    List<PriceableItemTemplateModel> records = new ArrayList<>();
    Collection<Integer> offerIds = new ArrayList<>();
    offerIds.add(offeringId);
    Set<Integer> itemTemplateIdSet = new HashSet<>();

    if (isBundle) {
      offerIds.addAll(productOfferBundleService.getProductOfferIdsInBundle(offeringId));
    }

    String usagePiQuery = PropertyRsqlConstants.SUBSCRIPTION_ID_IS_NULL_TRUE + RsqlOperator.AND
        + PropertyRsqlConstants.PARAM_TABLE_ID_NULL_TRUE + RsqlOperator.AND
        + PropertyRsqlConstants.PI_INSTANCE_PARENT_ID_NULL_TRUE + RsqlOperator.AND
        + CommonUtils.getQueryStringFromCollection(offerIds, PropertyRsqlConstants.OFFER_ID_IN);

    LOGGER.info(
        "Query string to findPricelistMapping for findPriceableItemTemplatesForOfferings : {}",
        usagePiQuery);

    Collection<PricelistMapping> pricelistMappings =
        pricelistMappingService.findPricelistMapping(null, usagePiQuery);

    pricelistMappings.forEach(pricelistMapping -> {
      if (pricelistMapping.getOfferId().equals(offeringId)
          || pricelistMapping.getItemTemplateKind().equals(PropertyKind.USAGE)) {
        itemTemplateIdSet.add(pricelistMapping.getItemTemplateId());
      }
    });

    Boolean isRecordsAlreadyExists = CollectionUtils.isNotEmpty(itemTemplateIdSet);
    StringBuilder query = new StringBuilder();
    query.append(PropertyRsqlConstants.TEMPLATE_PARENT_ID_IS_NULL_TRUE);
    if (StringUtils.isNotEmpty(queryIn)) {
      query.append(RsqlOperator.AND).append(queryIn);
      if (isRecordsAlreadyExists) {
        query.append(RsqlOperator.AND).append(CommonUtils.getQueryStringFromCollection(
            itemTemplateIdSet, PropertyRsqlConstants.TEMPLATE_ID_NOT_IN));
      }
    } else {
      if (isRecordsAlreadyExists) {
        query.append(RsqlOperator.AND).append(CommonUtils.getQueryStringFromCollection(
            itemTemplateIdSet, PropertyRsqlConstants.TEMPLATE_ID_NOT_IN));
      }
    }
    LOGGER.info(
        "Query string to findPriceableItemTemplate for findPriceableItemTemplatesForOfferings : {}",
        query);
    PaginatedList<PriceableItemTemplateWithInUse> priceableItemTemplates =
        findPriceableItemTemplate(page, size, sort, query.toString(), descriptionLanguage,
            descriptionFilters, descriptionSort);
    priceableItemTemplates.getRecords()
        .forEach(priceableItemTemplate -> records.add(preparePoObject(priceableItemTemplate)));
    PaginatedList<PriceableItemTemplateModel> paginatedRecords = new PaginatedList<>();
    CommonUtils.copyPaginatedList(priceableItemTemplates, paginatedRecords);
    paginatedRecords.setRecords(records);
    return localizedEntityService.localizedFindEntity(paginatedRecords);
  }

  private PaginatedList<PriceableItemTemplateModel> findParentPriceableItemTemplate(Integer page,
      Integer size, String[] sort, String queryIn, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException {
    String query = !StringUtils.isBlank(queryIn)
        ? queryIn + RsqlOperator.AND + PropertyRsqlConstants.TEMPLATE_PARENT_ID_IS_NULL_TRUE
        : PropertyRsqlConstants.TEMPLATE_PARENT_ID_IS_NULL_TRUE;
    LOGGER.info("Query string to findParentPriceableItemTemplate >> findPriceableItemTemplate : {}",
        query);
    List<PriceableItemTemplateModel> records = new ArrayList<>();
    PaginatedList<PriceableItemTemplateWithInUse> priceableItemTemplates =
        findPriceableItemTemplate(page, size, sort, query, descriptionLanguage, descriptionFilters,
            descriptionSort);

    priceableItemTemplates.getRecords()
        .forEach(priceableItemTemplate -> records.add(preparePoObject(priceableItemTemplate)));
    PaginatedList<PriceableItemTemplateModel> priceableItemTemplatePaginated =
        new PaginatedList<>();
    CommonUtils.copyPaginatedList(priceableItemTemplates, priceableItemTemplatePaginated);
    priceableItemTemplatePaginated.setRecords(records);
    return priceableItemTemplatePaginated;
  }

  private PaginatedList<PriceableItemTemplateWithInUse> findChildPriceableItemTemplate()
      throws EcbBaseException {
    String query = PropertyRsqlConstants.TEMPLATE_PARENT_ID_IS_NULL_FALSE;
    return findPriceableItemTemplate(1, Integer.MAX_VALUE, null, query, null, null, null);
  }

  @Override
  public PaginatedList<PriceableItemTemplateWithInUse> findPriceableItemTemplate(Integer page,
      Integer size, String[] sort, String query, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException {
    return extendedPriceableItemTemplateClient.extendedFindPriceableItemTemplate(page, size, sort,
        query, descriptionLanguage, descriptionFilters, descriptionSort).getBody();
  }

  private PriceableItemTemplateModel preparePoObject(
      PriceableItemTemplateWithInUse priceableItemTemplate) {
    PriceableItemTemplateModel priceableItemTemplateModel = new PriceableItemTemplateModel();
    BeanUtils.copyProperties(priceableItemTemplate, priceableItemTemplateModel);
    return priceableItemTemplateModel;
  }

  private Collection<PricelistMapping> getInUsePricelistMapping(String query)
      throws EcbBaseException {
    return pricelistMappingService.findPricelistMapping(null, query);
  }

  private Set<Integer> getInUseOfferingsId(Integer piTemplateId) throws EcbBaseException {
    String query = PropertyRsqlConstants.ITEM_TEMPLATE_ID_EQUAL + piTemplateId;
    Set<Integer> itemTemplateOfferIdsMap = new HashSet<>();
    Collection<PricelistMapping> pricelistMappings = getInUsePricelistMapping(query);
    pricelistMappings
        .forEach(pricelistMapping -> itemTemplateOfferIdsMap.add(pricelistMapping.getOfferId()));
    return itemTemplateOfferIdsMap;
  }

  private Map<Integer, PriceableItemType> getPriceableItemTypeName(
      Collection<PriceableItemType> priceableItemTypes) {
    Map<Integer, PriceableItemType> priceableItemTypeMap = new HashMap<>();
    priceableItemTypes.forEach(priceableItemType -> priceableItemTypeMap
        .put(priceableItemType.getPiId(), priceableItemType));
    return priceableItemTypeMap;
  }

  @Override
  public PaginatedList<ProductOfferData> findInUseOfferings(Integer templateId, Integer page,
      Integer size, String[] sort, String query, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException {
    Set<Integer> inUseOfferingsIds = getInUseOfferingsId(templateId);
    return productOfferService.findOfferingsForInUse(inUseOfferingsIds, page, size, sort, query,
        descriptionLanguage, descriptionFilters, descriptionSort);
  }

  @Override
  public PaginatedList<PricelistModel> findInUseSharedRateList(Integer templateId,
      Set<Integer> childPiTemplate, Integer page, Integer size, String[] sort, String queryIn,
      String descriptionLanguage, Set<String> descriptionFilters, String descriptionSort)
      throws EcbBaseException {

    Set<Integer> templateIds = new HashSet<>();
    templateIds.add(templateId);
    Boolean isChild = Boolean.FALSE;
    if (CollectionUtils.isNotEmpty(childPiTemplate)) {
      isChild = Boolean.TRUE;
      templateIds.addAll(childPiTemplate);
    }

    PaginatedList<PricelistModel> pricelistModelPaginatedList = new PaginatedList<>();
    List<PricelistModel> pricelistModelList = new ArrayList<>();

    Map<Integer, Map<Integer, String>> map = new HashMap<>();
    Map<Integer, Set<Integer>> mapSet = new HashMap<>();
    String templateIdquery = CommonUtils.getQueryStringFromCollection(templateIds,
        PropertyRsqlConstants.ITEM_TEMPLATE_ID_IN);
    Collection<RateSchedule> rateScheduleList = getRateSchedules(templateIdquery);

    Set<Integer> priceListIds = new HashSet<>();
    rateScheduleList.forEach(rateSchedule -> {
      priceListIds.add(rateSchedule.getPricelistId());
      HashMap<Integer, String> displayNameAndId = new HashMap<>();
      displayNameAndId.put(rateSchedule.getItemTemplateDisplayNameId(),
          rateSchedule.getItemTemplateDisplayName());
      map.put(rateSchedule.getItemTemplateId(), displayNameAndId);

      if (mapSet.containsKey(rateSchedule.getItemTemplateId())) {
        mapSet.get(rateSchedule.getItemTemplateId()).add(rateSchedule.getPricelistId());
      } else {
        Set<Integer> set = new HashSet<>();
        set.add(rateSchedule.getPricelistId());
        mapSet.put(rateSchedule.getItemTemplateId(), set);
      }
    });

    String pricelistIdQuery = CommonUtils.getQueryStringFromCollection(priceListIds,
        PropertyRsqlConstants.PRICELIST_ID_IN);
    String isRegularQuery = StringUtils.isNotBlank(pricelistIdQuery)
        ? pricelistIdQuery + RsqlOperator.AND + PropertyRsqlConstants.TYPE_EQUAL_REGULAR
        : PropertyRsqlConstants.TYPE_EQUAL_REGULAR;
    String query = StringUtils.isNotBlank(queryIn) ? queryIn + RsqlOperator.AND + isRegularQuery
        : isRegularQuery;
    LOGGER.info(" Query for findInUseSharedRateList >> findPriceListFrom : {}", query);
    PaginatedList<Pricelist> pricelistPaginatedList = findPriceListFromApi(1, Integer.MAX_VALUE,
        sort, query, descriptionLanguage, descriptionFilters, descriptionSort);

    if (isChild) {
      pricelistPaginatedList.getRecords().forEach(pricelist -> mapSet.forEach((key, value) -> {
        if (value.contains(pricelist.getPricelistId())) {
          PricelistModel pricelistModel = new PricelistModel();
          BeanUtils.copyProperties(pricelist, pricelistModel);
          map.get(key).forEach((k, v) -> {
            pricelistModel.setItemTemplateDisplayName(v);
            pricelistModel.setItemTemplateDisplayNameId(k);
          });
          pricelistModelList.add(pricelistModel);
        }
      }));
      pricelistModelPaginatedList.setRecords(pricelistModelList);
    } else {
      pricelistPaginatedList.getRecords().forEach(pricelist -> {
        PricelistModel pricelistModel = new PricelistModel();
        BeanUtils.copyProperties(pricelist, pricelistModel);
        pricelistModelList.add(pricelistModel);
      });
      pricelistModelPaginatedList.setRecords(pricelistModelList);
    }
    localizedEntityService.localizedFindEntity(pricelistModelPaginatedList);
    return CommonUtils.customPaginatedList(pricelistModelPaginatedList.getRecords(), page, size);
  }

  private Collection<RateSchedule> getRateSchedules(String templateIdquery)
      throws EcbBaseException {
    return rateScheduleClient
        .findRateSchedule(1, Integer.MAX_VALUE, null, templateIdquery, null, null, null).getBody()
        .getRecords();
  }

  private PaginatedList<Pricelist> findPriceListFromApi(Integer page, Integer size, String[] sort,
      String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException {
    return pricelistClient.findPricelist(page, size, sort, query, descriptionLanguage,
        descriptionFilters, descriptionSort).getBody();
  }

  private Collection<PriceableItemType> findPriceableItemTypeFromApi(Integer page, Integer size,
      String[] sort, String query) throws EcbBaseException {
    return priceItemTypeClient.findPriceableItemType(page, size, sort, query, null, null, null)
        .getBody().getRecords();
  }

  @Override
  public Map<PropertyKind, String> findViewChargeType() {
    return Constants.CHARGE_CATEGORY_KIND;
  }

  @Override
  public Map<PropertyKind, String> findCreateChargeType() {
    return Constants.CHARGE_CATEGORY_TYPE;
  }

  @Override
  public PaginatedList<PriceableItemTemplateParameterTableMapping> getPriceableItemParamTableMapping(
      Integer page, Integer size, String[] sort, String query, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException {
    return extendedPriceableItemTemplateParameterTableMappingClient
        .findPriceableItemTemplateParameterTableMapping(page, size, sort, query,
            descriptionLanguage, descriptionFilters, descriptionSort)
        .getBody();
  }

  @Override
  public Boolean deletePriceableItemTemplate(Integer templateId) throws EcbBaseException {
    return extendedPriceableItemTemplateClient.deletePriceableItemTemplate(templateId).getBody();
  }

  @Override
  public Object getPriceableItemTemplateDetails(Integer templateId, PropertyKind kind)
      throws EcbBaseException {
    Object obj = null;
    if (PropertyKind.DISCOUNT.equals(kind)) {
      obj = priceableItemDiscountService.getDiscountDetails(templateId);
    } else if (PropertyKind.USAGE.equals(kind)) {
      obj = priceableItemUsageService.getUsagePriceableItemDetailsWithChilds(templateId);
      UsagePriceableItemModel usageModel = (UsagePriceableItemModel) obj;
      Collection<PriceableItemTemplateWithInUse> usageChilds = usageModel.getChilds();
      if (CollectionUtils.isNotEmpty(usageChilds)) {
        List<Object> usagePiTemplates = new ArrayList<>();
        usagePiTemplates.add(usageModel);
        usagePiTemplates.addAll(usageChilds);
        PaginatedList<Object> paginatedTemplate = new PaginatedList<>();
        paginatedTemplate.setRecords(usagePiTemplates);
        localizedEntityService.localizedFindEntity(paginatedTemplate);
        return obj;
      }
    } else if (PropertyKind.RECURRING.equals(kind)) {
      obj = priceableItemRecurringService.getRecurringChargeDetails(templateId);
    } else if (PropertyKind.NON_RECURRING.equals(kind)) {
      obj = priceableItemNonRecurringService.getNonRecurringChargeDetails(templateId);
    } else if (PropertyKind.UNIT_DEPENDENT_RECURRING.equals(kind)) {
      obj = priceableItemUnitDependentRecurringService
          .getUnitDependentRecurringChargeDetails(templateId);
    }
    return localizedEntityService.localizedGetEntity(obj);
  }

  @Override
  public PaginatedList<ProductOfferData> findInUseOfferingsOfExtendedProps(PropertyKind kind,
      Integer page, Integer size, String[] sort, String query, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException {
    Set<Integer> inUseOfferingsIds = getOfferIdOfInUseExtendedProps(kind);
    return productOfferService.findOfferingsForInUse(inUseOfferingsIds, page, size, sort, query,
        descriptionLanguage, descriptionFilters, descriptionSort);
  }

  private Set<Integer> getOfferIdOfInUseExtendedProps(PropertyKind kind) throws EcbBaseException {
    String query = PropertyRsqlConstants.ITEM_TEMPLATE_KIND_EQUAL + kind.toString();
    Map<PropertyKind, Set<Integer>> offerIdOfInUseExtendedProps;
    Collection<PricelistMapping> pricelistMappingList =
        pricelistMappingService.findPricelistMapping(null, query);
    offerIdOfInUseExtendedProps = pricelistMappingList.stream()
        .collect(Collectors.groupingBy(PricelistMapping::getItemTemplateKind,
            Collectors.mapping(PricelistMapping::getOfferId, Collectors.toSet())));
    return offerIdOfInUseExtendedProps.get(kind);
  }

  @Override
  public List<PriceableItemRateTableModel> getRateTableWithDecisionTypeName(Integer piId)
      throws EcbBaseException {
    Set<Integer> piIdSet = getParameterTableIdFromPiId(piId);
    List<PriceableItemRateTableModel> priceableItemRateTableList = getParamTables(piIdSet);
    List<String> paramtableNameList = getParamTableName(priceableItemRateTableList);
    Map<String, String> paramNameDecisionTypeNameMap = getDecisionTypeNames(paramtableNameList);
    return updateDecisionTypeNameInModel(priceableItemRateTableList, paramNameDecisionTypeNameMap);
  }

  private List<String> getParamTableName(List<PriceableItemRateTableModel> modelList) {
    List<String> tableName = new ArrayList<>();
    modelList.forEach(model -> tableName.add(model.getInstanceTablename()));
    return tableName;
  }

  private List<PriceableItemRateTableModel> updateDecisionTypeNameInModel(
      List<PriceableItemRateTableModel> modelList, Map<String, String> nameMap) {
    modelList
        .forEach(model -> model.setDecisionTypeName(nameMap.get(model.getInstanceTablename())));
    return modelList;
  }

  private Map<String, String> getDecisionTypeNames(List<String> nameList) throws EcbBaseException {
    Map<String, String> nameMap = new HashMap<>();
    String query =
        CommonUtils.getQueryStringFromCollection(nameList, PropertyRsqlConstants.TABLE_NAME_IN);
    Collection<DecisionType> records = decisionTypeClient
        .findDecisionType(1, Integer.MAX_VALUE, null, query).getBody().getRecords();
    records
        .forEach(decisionType -> nameMap.put(decisionType.getTablename(), decisionType.getName()));
    return nameMap;
  }

  private List<PriceableItemRateTableModel> getParamTables(Set<Integer> paramtableId)
      throws EcbBaseException {
    List<PriceableItemRateTableModel> priceableItemRateTableModelList = new ArrayList<>();
    String query = CommonUtils.getQueryStringFromCollection(paramtableId,
        PropertyRsqlConstants.PARAM_TABLE_ID_IN);
    Collection<ParameterTable> records =
        parameterTableClient.findParameterTable(1, Integer.MAX_VALUE, null, query, null, null, null)
            .getBody().getRecords();
    records.forEach(parameterTable -> {
      PriceableItemRateTableModel model = new PriceableItemRateTableModel();
      BeanUtils.copyProperties(parameterTable, model);
      priceableItemRateTableModelList.add(model);
    });
    return priceableItemRateTableModelList;
  }

  private Set<Integer> getParameterTableIdFromPiId(Integer piId) throws EcbBaseException {
    Map<Integer, Set<Integer>> recordMap;
    String query = PropertyRsqlConstants.PI_ID_EQUAL + piId;
    Collection<PriceableItemTypeParameterTableMapping> records =
        priceableItemTypeParameterTableMappingClient
            .findPriceableItemTypeParameterTableMapping(1, Integer.MAX_VALUE, null, query).getBody()
            .getRecords();

    recordMap = records.stream().collect(Collectors.groupingBy(
        PriceableItemTypeParameterTableMapping::getPiId,
        Collectors.mapping(PriceableItemTypeParameterTableMapping::getPtId, Collectors.toSet())));
    return recordMap.get(piId);
  }

  @Override
  public PriceableItemTemplate getPriceableItemTemplate(Integer templateId)
      throws EcbBaseException {
    return priceableItemTemplateClient.getPriceableItemTemplate(templateId).getBody();
  }

  @Override
  public PriceableItemTemplate createPriceableItemTemplate(LocalizedPriceableItemTemplate record)
      throws EcbBaseException {
    localizedEntityService.localizedCreateEntity(record);
    return priceableItemTemplateClient.createPriceableItemTemplate(record).getBody();
  }

  @Override
  public UsageCycle getUsageCycle(Integer usageCycleId) throws EcbBaseException {
    return usageCycleClient.getUsageCycle(usageCycleId).getBody();
  }
}
