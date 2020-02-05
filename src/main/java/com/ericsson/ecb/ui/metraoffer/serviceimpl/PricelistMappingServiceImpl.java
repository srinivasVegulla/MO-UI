package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ericsson.ecb.catalog.client.ExtendedPricelistMappingClient;
import com.ericsson.ecb.catalog.client.PricelistMappingClient;
import com.ericsson.ecb.catalog.client.UnitDependentRecurringChargeClient;
import com.ericsson.ecb.catalog.model.ParameterTable;
import com.ericsson.ecb.catalog.model.PricelistMapping;
import com.ericsson.ecb.catalog.model.UnitDependentRecurringCharge;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.Constants;
import com.ericsson.ecb.ui.metraoffer.constants.Pagination;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.PricelistMappingModel;
import com.ericsson.ecb.ui.metraoffer.model.PricelistMappingVO;
import com.ericsson.ecb.ui.metraoffer.service.PricelistMappingService;
import com.ericsson.ecb.ui.metraoffer.utils.CommonUtils;

@Service
public class PricelistMappingServiceImpl implements PricelistMappingService {

  @Autowired
  private PricelistMappingClient pricelistMappingClient;

  @Autowired
  private ExtendedPricelistMappingClient extendedPricelistMappingClient;

  @Autowired
  private LocalizedEntityService localizedEntityService;

  @Autowired
  private UnitDependentRecurringChargeClient unitDependentRecurringChargeClient;

  private static final String KIND_UDRC = PropertyKind.UNIT_DEPENDENT_RECURRING.toString();


  public static final String QUERY_FIND_PRICEABLEITEMS =
      PropertyRsqlConstants.SUBSCRIPTION_ID_IS_NULL_TRUE + RsqlOperator.AND
          + PropertyRsqlConstants.PARAM_TABLE_ID_NULL_TRUE + RsqlOperator.AND;

  public static final String QUERY_FIND_PRICEABLEITEMS_WITH_PARAMTABLES =
      PropertyRsqlConstants.SUBSCRIPTION_ID_IS_NULL_TRUE + RsqlOperator.AND
          + PropertyRsqlConstants.PARAM_TABLE_ID_NULL_FALSE + RsqlOperator.AND
          + PropertyRsqlConstants.OFFER_ID_EQUAL;

  @Override
  public PricelistMappingModel getPricelistMappingByPiInstanceParentId(Integer offerId,
      Integer piInstanceParentId) throws EcbBaseException {

    String query = PropertyRsqlConstants.OFFER_ID_EQUAL + offerId + RsqlOperator.AND
        + PropertyRsqlConstants.PI_INSTANCE_PARENT_ID_EQUAL + piInstanceParentId + RsqlOperator.AND
        + PropertyRsqlConstants.SUBSCRIPTION_ID_IS_NULL_TRUE;

    Collection<PricelistMapping> records = findPricelistMapping(null, query);
    PricelistMappingModel pricelistMappingModel = new PricelistMappingModel();
    if (CollectionUtils.isNotEmpty(records)) {
      preparepricelistMappingModel(pricelistMappingModel, records.iterator().next());
      Map<String, List<PricelistMappingVO>> pOParamItemNodeMap = getPricelistMappingTree(records);
      pricelistMappingModel.setPricelistMappingVO(pOParamItemNodeMap);
    }
    if (MapUtils.isNotEmpty(pricelistMappingModel.getPricelistMappingVO())) {
      List<PricelistMappingVO> pricelistMappingVOList = new ArrayList<>();
      pricelistMappingModel.getPricelistMappingVO().forEach(
          (kind, pricelistmappingVOList) -> pricelistMappingVOList.addAll(pricelistmappingVOList));
      PaginatedList<PricelistMappingVO> paginatedList = new PaginatedList<>();
      paginatedList.setRecords(pricelistMappingVOList);
      localizedEntityService.localizedFindEntity(paginatedList);
    }
    return pricelistMappingModel;
  }


  @Override
  public PricelistMappingModel getPricelistMappingByOfferId(Integer offerId)
      throws EcbBaseException {
    Collection<PricelistMapping> records =
        findPricelistMappingByOfferId(Collections.singleton(offerId));
    PricelistMappingModel pricelistMappingModel = new PricelistMappingModel();
    if (CollectionUtils.isNotEmpty(records)) {
      preparepricelistMappingModel(pricelistMappingModel, records.iterator().next());
      Map<String, List<PricelistMappingVO>> pOParamItemNodeMap = getPricelistMappingTree(records);
      pricelistMappingModel.setPricelistMappingVO(pOParamItemNodeMap);
    }
    addParameterTable(pricelistMappingModel, offerId);
    return pricelistMappingModel;
  }

  private void addParameterTable(PricelistMappingModel pricelistMappingModel, Integer offerId)
      throws EcbBaseException {
    Map<Integer, List<ParameterTable>> parameterTableMap = getParameterTable(offerId);
    if (MapUtils.isNotEmpty(parameterTableMap)) {

      Map<Integer, Integer> ratingTypeMap = getRatingType(pricelistMappingModel);

      pricelistMappingModel.getPricelistMappingVO().forEach(
          (kind, pricelistMappingVOList) -> pricelistMappingVOList.forEach(pricelistMappingVO -> {
            if (KIND_UDRC.equals(kind)) {
              Integer ratingType = ratingTypeMap.get(pricelistMappingVO.getItemInstanceId());
              List<ParameterTable> parameterTablesToAdd = new ArrayList<>();
              List<ParameterTable> parameterTables =
                  parameterTableMap.get(pricelistMappingVO.getItemInstanceId());
              parameterTables.forEach(parameterTable -> {
                if ((ratingType.equals(0)
                    && StringUtils.contains(parameterTable.getName(), Constants.UDRC_TIERED))
                    || (ratingType.equals(1) && StringUtils.contains(parameterTable.getName(),
                        Constants.UDRC_TAPERED))) {
                  parameterTablesToAdd.add(parameterTable);
                }
              });
              pricelistMappingVO.addParameterTables(parameterTablesToAdd);
            } else {
              pricelistMappingVO.addParameterTables(
                  parameterTableMap.get(pricelistMappingVO.getItemInstanceId()));
            }
          }));
    }
  }

  private Map<Integer, Integer> getRatingType(PricelistMappingModel pricelistMappingModel)
      throws EcbBaseException {
    Map<Integer, Integer> ratingTypeMap = new HashMap<>();
    if (pricelistMappingModel.getPricelistMappingVO().keySet().contains(KIND_UDRC)) {
      List<PricelistMappingVO> pricelistMappingVOList =
          pricelistMappingModel.getPricelistMappingVO().get(KIND_UDRC);
      Set<Integer> instanceId = new HashSet<>();
      pricelistMappingVOList
          .forEach(pricelistMappingVO -> instanceId.add(pricelistMappingVO.getItemInstanceId()));
      String query =
          CommonUtils.getQueryStringFromCollection(instanceId, PropertyRsqlConstants.PROP_ID_IN);
      Collection<UnitDependentRecurringCharge> udrcPaginatedRecords =
          unitDependentRecurringChargeClient
              .findUnitDependentRecurringCharge(1, Integer.MAX_VALUE, null, query).getBody()
              .getRecords();
      udrcPaginatedRecords.forEach(unitDependentRecurringCharge -> ratingTypeMap.put(
          unitDependentRecurringCharge.getPropId(), unitDependentRecurringCharge.getRatingType()));
    }
    return ratingTypeMap;
  }

  private Map<Integer, List<ParameterTable>> getParameterTable(Integer offerId)
      throws EcbBaseException {
    Map<Integer, List<ParameterTable>> parameterTableMap = new HashMap<>();
    Collection<PricelistMapping> pricelistMappingCollection =
        findPricelistMappingWithParamTablesByOfferId(offerId);
    pricelistMappingCollection.forEach(pricelistMapping -> {
      Integer itemInstanceId = pricelistMapping.getItemInstanceId();
      ParameterTable parameterTable = new ParameterTable();
      prepareParameterTable(pricelistMapping, parameterTable);
      if (!parameterTableMap.containsKey(itemInstanceId)) {
        List<ParameterTable> parameterTableList = new ArrayList<>();
        parameterTableList.add(parameterTable);
        parameterTableMap.put(itemInstanceId, parameterTableList);
      } else {
        parameterTableMap.get(itemInstanceId).add(parameterTable);
      }
    });
    return parameterTableMap;
  }

  /**
   * Gets the pricelist mapping tree.
   *
   * @param pricelistMappingList the pricelist mapping list
   * @return the pricelist mapping tree
   */
  private Map<String, List<PricelistMappingVO>> getPricelistMappingTree(
      Collection<PricelistMapping> pricelistMappingList) {

    Map<String, List<PricelistMappingVO>> parentItemMap = new HashMap<>();
    Map<String, List<PricelistMappingVO>> paramTableMap = new HashMap<>();
    Map<String, List<PricelistMappingVO>> subItemMap = new HashMap<>();

    Set<String> kindTypeSet = new HashSet<>();
    pricelistMappingList.forEach(pricelistMapping -> {
      PropertyKind propertyKind = pricelistMapping.getItemTypeKind();
      if (propertyKind != null) {
        String kindType = propertyKind.name();
        Integer piInstanceParentId = pricelistMapping.getPiInstanceParentId();

        PricelistMappingVO pricelistMappingVO = new PricelistMappingVO();

        if (pricelistMapping.getParamtableId() != null) {
          addItemToMap(paramTableMap, pricelistMapping.getItemTemplateId().toString(),
              pricelistMappingVO);
        } else {
          if (piInstanceParentId != null) {
            kindTypeSet.add(kindType);
            addItemToMap(subItemMap, piInstanceParentId.toString(), pricelistMappingVO);
          } else {
            addItemToMap(parentItemMap, kindType, pricelistMappingVO);
          }
        }
        preparePricelistMappingVO(pricelistMappingVO, pricelistMapping);

      }
    });

    prepareAsTree(parentItemMap, paramTableMap, true);
    prepareAsTree(parentItemMap, subItemMap, false);
    prepareAsTree(subItemMap, paramTableMap, true);
    prepareAsTree(subItemMap, subItemMap, false);

    if (parentItemMap.size() == 0 && subItemMap.size() > 0 && kindTypeSet.size() == 1) {
      subItemMap.forEach((key, value) -> parentItemMap.put(kindTypeSet.iterator().next(), value));
    }
    return parentItemMap;
  }

  /**
   * Prepare as tree.
   *
   * @param parentMap the parent map
   * @param childMap the child map
   * @param isItemTypeId the is item type id
   */
  private void prepareAsTree(Map<String, List<PricelistMappingVO>> parentMap,
      Map<String, List<PricelistMappingVO>> childMap, boolean isItemTypeId) {
    parentMap.forEach((dummyKey, parentList) -> parentList.forEach(parentPricelistMappingVO -> {
      String keyId;
      if (isItemTypeId) {
        keyId = parentPricelistMappingVO.getItemTemplateId().toString();
      } else {
        keyId = parentPricelistMappingVO.getItemInstanceId().toString();
      }
      if (childMap.containsKey(keyId)) {
        parentPricelistMappingVO.addChild(childMap.get(keyId));
      }
    }));
  }

  /**
   * Adds the item to map.
   *
   * @param itemMap the item map
   * @param key the key
   * @param pricelistMappingVO the pricelist mapping VO
   */
  private void addItemToMap(Map<String, List<PricelistMappingVO>> itemMap, String key,
      PricelistMappingVO pricelistMappingVO) {
    if (itemMap.containsKey(key)) {
      itemMap.get(key).add(pricelistMappingVO);
    } else {
      List<PricelistMappingVO> pricelistMappingVoList = new ArrayList<>();
      pricelistMappingVoList.add(pricelistMappingVO);
      itemMap.put(key, pricelistMappingVoList);
    }
  }

  /**
   * Prepare pricelist mapping VO.
   *
   * @param pricelistMappingVO the pricelist mapping VO
   * @param pricelistMapping the pricelist mapping
   */
  private void preparePricelistMappingVO(PricelistMappingVO pricelistMappingVO,
      PricelistMapping pricelistMapping) {

    pricelistMappingVO.setItemTemplateId(pricelistMapping.getItemTemplateId());
    pricelistMappingVO.setPiInstanceParentId(pricelistMapping.getPiInstanceParentId());
    pricelistMappingVO.setItemInstanceId(pricelistMapping.getItemInstanceId());

    if (pricelistMapping.getParamtableId() != null) {
      pricelistMappingVO.setName(pricelistMapping.getParamtableName());
      pricelistMappingVO.setDisplayName(pricelistMapping.getParamtableDisplayName());
      pricelistMappingVO.setDisplayNameId(pricelistMapping.getParamtableDisplayNameId());
      pricelistMappingVO.setDescription(pricelistMapping.getParamtableDescription());
      pricelistMappingVO.setDescriptionId(pricelistMapping.getParamtableDescriptionId());
    } else {
      pricelistMappingVO.setName(pricelistMapping.getItemTemplateName());
      pricelistMappingVO.setDisplayName(pricelistMapping.getItemInstanceDisplayName());
      pricelistMappingVO.setDisplayNameId(pricelistMapping.getItemInstanceDisplayNameId());
      pricelistMappingVO.setDescription(pricelistMapping.getItemInstanceDescription());
      pricelistMappingVO.setDescriptionId(pricelistMapping.getItemInstanceDescriptionId());
    }
  }

  private void prepareParameterTable(PricelistMapping pricelistMapping,
      ParameterTable parameterTable) {
    parameterTable.setParamtableId(pricelistMapping.getParamtableId());
    parameterTable.setName(pricelistMapping.getParamtableName());
    parameterTable.setNameId(pricelistMapping.getParamtableNameId());
    parameterTable.setDisplayName(pricelistMapping.getParamtableDisplayName());
    parameterTable.setDisplayNameId(pricelistMapping.getParamtableDisplayNameId());
    parameterTable.setDescription(pricelistMapping.getParamtableDescription());
    parameterTable.setDisplayNameId(pricelistMapping.getParamtableDescriptionId());
  }


  /**
   * Preparepricelist mapping model.
   *
   * @param pricelistMappingModel the pricelist mapping model
   * @param pricelistMapping the pricelist mapping
   */
  private void preparepricelistMappingModel(PricelistMappingModel pricelistMappingModel,
      PricelistMapping pricelistMapping) {
    pricelistMappingModel.setOfferId(pricelistMapping.getOfferId());
    pricelistMappingModel.setOfferName(pricelistMapping.getOfferName());
    pricelistMappingModel.setOfferDisplayName(pricelistMapping.getOfferDisplayName());
  }

  @Override
  public Collection<PricelistMapping> findPricelistMapping(String[] sort, String query)
      throws EcbBaseException {
    PaginatedList<PricelistMapping> paginatedList =
        pricelistMappingClient.findPricelistMapping(Pagination.DEFAULT_PAGE,
            Pagination.DEFAULT_MAX_SIZE, sort, query, null, null, null).getBody();
    return paginatedList.getRecords();
  }

  @Override
  public Set<Integer> getPricelistMappingItemTemplateIdsByOfferId(Integer offerId)
      throws EcbBaseException {
    Set<Integer> itemTemplateIdSet = new HashSet<>();
    String query = PropertyRsqlConstants.OFFER_ID_EQUAL + offerId;
    Collection<PricelistMapping> pricelistMappingList = findPricelistMapping(null, query);
    pricelistMappingList
        .forEach(pricelistMapping -> itemTemplateIdSet.add(pricelistMapping.getItemTemplateId()));
    return itemTemplateIdSet;
  }

  @Override
  public PricelistMapping updatePricelistMapping(PricelistMapping record) throws EcbBaseException {
    return extendedPricelistMappingClient.updatePricelistMapping(record).getBody();
  }

  @Override
  public Collection<PricelistMapping> findPricelistMappingByOfferId(Set<Integer> offerIds)
      throws EcbBaseException {
    String orrerIdIn =
        CommonUtils.getQueryStringFromCollection(offerIds, PropertyRsqlConstants.OFFER_ID_IN);
    String query = QUERY_FIND_PRICEABLEITEMS + orrerIdIn;
    PaginatedList<PricelistMapping> records =
        pricelistMappingClient.findPricelistMapping(Pagination.DEFAULT_PAGE,
            Pagination.DEFAULT_MAX_SIZE, null, query, null, null, null).getBody();
    return localizedEntityService.localizedFindEntity(records).getRecords();
  }

  private Collection<PricelistMapping> findPricelistMappingWithParamTablesByOfferId(Integer offerId)
      throws EcbBaseException {
    String query = QUERY_FIND_PRICEABLEITEMS_WITH_PARAMTABLES + offerId;
    return pricelistMappingClient.findPricelistMapping(Pagination.DEFAULT_PAGE,
        Pagination.DEFAULT_MAX_SIZE, null, query, null, null, null).getBody().getRecords();
  }
}
