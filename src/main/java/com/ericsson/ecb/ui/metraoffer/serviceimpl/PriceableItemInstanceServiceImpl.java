package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.collections.MapUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.HttpClientErrorException;

import com.ericsson.ecb.catalog.client.AdjustmentClient;
import com.ericsson.ecb.catalog.client.PriceableItemInstanceClient;
import com.ericsson.ecb.catalog.client.UnitDependentRecurringChargeClient;
import com.ericsson.ecb.catalog.model.Adjustment;
import com.ericsson.ecb.catalog.model.PriceableItemInstanceDetails;
import com.ericsson.ecb.catalog.model.PricelistMapping;
import com.ericsson.ecb.catalog.model.UnitDependentRecurringCharge;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.AdjustmentModel;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemInstanceDetailsModel;
import com.ericsson.ecb.ui.metraoffer.model.ResponseModel;
import com.ericsson.ecb.ui.metraoffer.service.AdjustmentService;
import com.ericsson.ecb.ui.metraoffer.service.MetadataConfigService;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemInstanceService;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemRecurringService;
import com.ericsson.ecb.ui.metraoffer.service.PricelistMappingService;
import com.ericsson.ecb.ui.metraoffer.utils.CommonUtils;
import com.ericsson.ecb.ui.metraoffer.utils.EntityHelper;

@Service
public class PriceableItemInstanceServiceImpl implements PriceableItemInstanceService {

  @Autowired
  private PriceableItemInstanceClient priceableItemInstanceClient;

  @Autowired
  private MetadataConfigService metadataConfigService;

  @Autowired
  private AdjustmentService adjustmentService;

  @Autowired
  private LocalizedEntityService localizedEntityService;

  @Autowired
  private PriceableItemRecurringService priceableItemRecurringService;

  @Autowired
  private PricelistMappingService pricelistMappingService;

  @Autowired
  private AdjustmentClient adjustmentClient;

  @Autowired
  private UnitDependentRecurringChargeClient unitDependentRecurringChargeClient;

  @Autowired
  private EntityHelper entityHelper;

  @Override
  public PriceableItemInstanceDetailsModel getPriceableItemInstance(Integer offerId,
      Integer piInstanceId) throws EcbBaseException {
    PriceableItemInstanceDetails priceableItemInstanceDetails =
        priceableItemInstanceClient.getPriceableItemInstance(offerId, piInstanceId).getBody();
    Set<BigDecimal> validEnumValues = new HashSet<>();
    PriceableItemInstanceDetailsModel priceableItemInstanceDetailsModel =
        new PriceableItemInstanceDetailsModel();
    if (priceableItemInstanceDetails != null) {
      BeanUtils.copyProperties(priceableItemInstanceDetails, priceableItemInstanceDetailsModel);
      if (!CollectionUtils.isEmpty(priceableItemInstanceDetails.getProperties())) {
        priceableItemInstanceDetailsModel.getProperties()
            .putAll(priceableItemInstanceDetails.getProperties());
      }
      priceableItemInstanceDetailsModel.setExtendedProps(
          metadataConfigService.getExtendedProperties(priceableItemInstanceDetails.getProperties(),
              priceableItemInstanceDetails.getKind()));
      validEnumValues = priceableItemInstanceDetails.getValidEnumValues();
    }

    if (!CollectionUtils.isEmpty(validEnumValues)) {
      priceableItemInstanceDetailsModel.getValidEnumValues().addAll(validEnumValues);
      priceableItemInstanceDetailsModel.getSortedEnumValues().addAll(validEnumValues);
      Collections.sort(priceableItemInstanceDetailsModel.getSortedEnumValues());
    }

    Collection<AdjustmentModel> adjustmentModel =
        adjustmentService.getPiInstanceAdjustmentWithReasonCode(piInstanceId);

    if (!CollectionUtils.isEmpty(adjustmentModel)) {
      priceableItemInstanceDetailsModel.setAdjustmetWidget(Boolean.TRUE);
    } else {
      priceableItemInstanceDetailsModel.setAdjustmetWidget(Boolean.FALSE);
    }

    if (priceableItemInstanceDetailsModel.getKind().equals(PropertyKind.UNIT_DEPENDENT_RECURRING)
        || priceableItemInstanceDetailsModel.getKind().equals(PropertyKind.RECURRING)) {

      priceableItemInstanceDetailsModel.getBiWeeklyIntervals().clear();
      priceableItemInstanceDetailsModel.getBiWeeklyIntervals()
          .addAll(priceableItemRecurringService.getBiWeeklyCycleIntervals());
    }
    localizedEntityService.localizedGetEntity(priceableItemInstanceDetailsModel);
    return priceableItemInstanceDetailsModel;
  }

  @Override
  public Boolean deletePiInstanceByInstanceIdFromOffering(Integer offerId, Integer piInstanceId)
      throws EcbBaseException {
    return priceableItemInstanceClient
        .deletePriceableItemInstanceFromOffering(offerId, piInstanceId).getBody();
  }

  @Override
  public List<ResponseModel> addPriceableItemInstanceListToOffering(Integer offerId,
      List<Integer> piTemplateIdList) throws EcbBaseException {
    List<ResponseModel> records = new ArrayList<>();
    ResponseModel responseModel = null;
    Set<Integer> templateIds = new HashSet<>();
    Iterator<Integer> piTemplateIdItr = piTemplateIdList.iterator();
    while (piTemplateIdItr.hasNext()) {
      Integer piTemplateId = piTemplateIdItr.next();
      try {
        addPriceableItemInstanceToOffering(offerId, piTemplateId);
        templateIds.add(piTemplateId);
      } catch (HttpClientErrorException e) {
        responseModel = new ResponseModel();
        responseModel.setData(piTemplateId);
        responseModel.setCode(e.getRawStatusCode());
        responseModel.setMessage(e.getStatusText());
        records.add(responseModel);
      }
    }
    updateInstanceLocalization(offerId, templateIds);
    return records;
  }

  private void updateInstanceLocalization(Integer offerId, Set<Integer> templateIds)
      throws EcbBaseException {
    String query = PropertyRsqlConstants.OFFER_ID_EQUAL + offerId + RsqlOperator.AND
        + PropertyRsqlConstants.PARAM_TABLE_ID_NULL_TRUE;
    Collection<PricelistMapping> pricelistMappingList =
        pricelistMappingService.findPricelistMapping(null, query);
    PaginatedList<PricelistMapping> pricelistMappingPaginated = new PaginatedList<>();
    pricelistMappingPaginated.setRecords(pricelistMappingList);
    localizedEntityService.localizedFindEntity(pricelistMappingPaginated);
    updateUdrcUnitDisplayName(pricelistMappingList);
    Collection<PricelistMapping> pricelistMappingResultList = new ArrayList<>();
    Map<Integer, Integer> instanceAndTemplateIdMap = new HashMap<>();
    templateIds.forEach(piTemplateId -> {
      Set<Integer> instanceIds = new HashSet<>();
      pricelistMappingList.forEach(pricelistMapping -> {
        if (pricelistMapping.getItemInstanceUnitDisplayNameId() == null)
          pricelistMapping.setItemInstanceUnitDisplayName(null);
        pricelistMapping.setItemInstanceDescription(pricelistMapping.getItemTemplateDescription());
        pricelistMapping.setItemInstanceDisplayName(pricelistMapping.getItemTemplateDisplayName());
        if (pricelistMapping.getPiInstanceParentId() == null
            && pricelistMapping.getItemTemplateId().equals(piTemplateId)) {
          pricelistMappingResultList.add(pricelistMapping);
          instanceIds.add(pricelistMapping.getItemInstanceId());
          instanceAndTemplateIdMap.put(pricelistMapping.getItemInstanceId(),
              pricelistMapping.getItemTemplateId());
        }
      });
      pricelistMappingList.forEach(pricelistMapping -> {
        if (pricelistMapping.getPiInstanceParentId() != null
            && instanceIds.contains(pricelistMapping.getPiInstanceParentId())) {
          pricelistMappingResultList.add(pricelistMapping);
          instanceAndTemplateIdMap.put(pricelistMapping.getItemInstanceId(),
              pricelistMapping.getItemTemplateId());
        }
      });
    });
    List<Object> updateLocalizedList = new ArrayList<>();
    updateLocalizedList.addAll(pricelistMappingResultList);
    Collection<Adjustment> adjustmentModels = getLocalizedAdjustments(instanceAndTemplateIdMap);
    if (!CollectionUtils.isEmpty(adjustmentModels))
      updateLocalizedList.addAll(adjustmentModels);
    localizedEntityService.localizedUpdateAllEntity(updateLocalizedList);
  }

  private Collection<PricelistMapping> updateUdrcUnitDisplayName(
      Collection<PricelistMapping> pricelistMappingList) throws EcbBaseException {
    Map<Integer, PricelistMapping> udrcTemplateId = new HashMap<>();
    pricelistMappingList.forEach(pricelistMapping -> {
      if (PropertyKind.UNIT_DEPENDENT_RECURRING.equals(pricelistMapping.getItemTemplateKind())) {
        udrcTemplateId.put(pricelistMapping.getItemTemplateId(), pricelistMapping);
      }
    });
    if (!CollectionUtils.isEmpty(udrcTemplateId)) {
      String query = CommonUtils.getQueryStringFromCollection(udrcTemplateId.keySet(),
          PropertyRsqlConstants.PROP_ID_IN);
      PaginatedList<UnitDependentRecurringCharge> udrcPaginatedRecords =
          unitDependentRecurringChargeClient
              .findUnitDependentRecurringCharge(1, Integer.MAX_VALUE, null, query).getBody();
      Collection<UnitDependentRecurringCharge> urdrcRecords =
          localizedEntityService.localizedFindEntity(udrcPaginatedRecords).getRecords();
      urdrcRecords.forEach(udrc -> {
        PricelistMapping pricelistMapping = udrcTemplateId.get(udrc.getPropId());
        pricelistMapping.setItemInstanceUnitDisplayName(udrc.getUnitDisplayName());
      });
    }
    return udrcTemplateId.values();
  }

  private List<Adjustment> getLocalizedAdjustments(Map<Integer, Integer> instanceAndTemplateIdMap)
      throws EcbBaseException {
    Map<Integer, Map<Integer, Adjustment>> templateIdAdjustments =
        findAdjustmentsOfTemplates(instanceAndTemplateIdMap.values());
    if (!MapUtils.isEmpty(templateIdAdjustments)) {
      List<Adjustment> instanceLocalizedAdjustments = new ArrayList<>();
      Map<Integer, List<Adjustment>> instanceAdjustments =
          findAdjustmentsOfInstances(instanceAndTemplateIdMap.keySet());
      instanceAndTemplateIdMap.forEach((instanceId, templateId) -> {
        List<Adjustment> instanceAdjustmentList = instanceAdjustments.get(instanceId);
        if (!CollectionUtils.isEmpty(instanceAdjustmentList)) {
          instanceAdjustmentList.forEach(instanceAdjustment -> {
            Adjustment templateAdjustment =
                templateIdAdjustments.get(templateId).get(instanceAdjustment.getAdjustmentTypeId());
            instanceAdjustment.setDisplayName(templateAdjustment.getDisplayName());
            instanceAdjustment.setDescription(templateAdjustment.getDescription());
            instanceLocalizedAdjustments.add(instanceAdjustment);
          });
        }
      });
      return instanceLocalizedAdjustments;
    }
    return Collections.emptyList();
  }

  private Map<Integer, List<Adjustment>> findAdjustmentsOfInstances(
      Collection<Integer> instanceIdsForAdjustments) throws EcbBaseException {
    String query = CommonUtils.getQueryStringFromCollection(instanceIdsForAdjustments,
        PropertyRsqlConstants.ITEM_INSTANCE_ID_IN);
    Collection<Adjustment> records = adjustmentClient
        .findAdjustment(1, Integer.MAX_VALUE, null, query, null, null, null).getBody().getRecords();
    return records.stream()
        .collect(Collectors.groupingBy(Adjustment::getItemInstanceId, Collectors.toList()));
  }

  private Map<Integer, Map<Integer, Adjustment>> findAdjustmentsOfTemplates(
      Collection<Integer> templateIdsForAdjustments) throws EcbBaseException {
    Map<Integer, Map<Integer, Adjustment>> resultRecords = new HashMap<>();
    String query = CommonUtils.getQueryStringFromCollection(templateIdsForAdjustments,
        PropertyRsqlConstants.ITEM_TEMPLATE_ID_IN);
    PaginatedList<Adjustment> records = adjustmentClient
        .findAdjustment(1, Integer.MAX_VALUE, null, query, null, null, null).getBody();
    localizedEntityService.localizedFindEntity(records);
    Map<Integer, List<Adjustment>> recordsMap = records.getRecords().stream()
        .collect(Collectors.groupingBy(Adjustment::getItemTemplateId, Collectors.toList()));

    recordsMap.forEach((templateId, adjustmentList) -> {
      Map<Integer, Adjustment> listAdjustment = new HashMap<>();
      adjustmentList
          .forEach(adjustment -> listAdjustment.put(adjustment.getAdjustmentTypeId(), adjustment));
      resultRecords.put(templateId, listAdjustment);
    });
    return resultRecords;
  }

  @Override
  public Boolean addPriceableItemInstanceToOffering(Integer offerId, Integer piTemplateId)
      throws EcbBaseException {
    return priceableItemInstanceClient.addPriceableItemInstanceToOffering(offerId, piTemplateId)
        .getBody();
  }

  @Override
  public Boolean updatePriceableItemInstance(
      PriceableItemInstanceDetails priceableItemInstanceDetails, Integer offerId,
      Integer piInstanceId, Set<String> fields) throws EcbBaseException {
    return entityHelper.updateEntityInstance(priceableItemInstanceDetails, offerId, piInstanceId,
        fields);
  }

}
