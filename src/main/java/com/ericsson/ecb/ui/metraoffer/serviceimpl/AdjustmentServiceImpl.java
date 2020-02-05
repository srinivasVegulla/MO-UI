package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ericsson.ecb.catalog.client.AdjustmentClient;
import com.ericsson.ecb.catalog.client.ExtendedAdjustmentClient;
import com.ericsson.ecb.catalog.model.Adjustment;
import com.ericsson.ecb.catalog.model.AdjustmentTemplateReasonCodeMapping;
import com.ericsson.ecb.catalog.model.LocalizedAdjustment;
import com.ericsson.ecb.catalog.model.ReasonCode;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.model.AdjustmentModel;
import com.ericsson.ecb.ui.metraoffer.service.AdjustmentReasonCodeService;
import com.ericsson.ecb.ui.metraoffer.service.AdjustmentService;
import com.ericsson.ecb.ui.metraoffer.utils.CommonUtils;
import com.ericsson.ecb.ui.metraoffer.utils.MoErrorMessagesUtil;

@Service
public class AdjustmentServiceImpl implements AdjustmentService {

  @Autowired
  private AdjustmentClient adjustmentClient;

  @Autowired
  private ExtendedAdjustmentClient extendedAdjustmentClient;

  @Autowired
  private AdjustmentReasonCodeService adjustmentReasonCodeService;

  @Autowired
  private LocalizedEntityService localizedEntityService;

  @Autowired
  private MoErrorMessagesUtil moErrorMessagesUtil;

  private static final Integer NEW_RECORDS = 1;

  private static final Integer UPDATED_RECORDS = 2;

  private static final Integer DELETED_RECORDS = 3;

  @Override
  public Adjustment addAdjustmentToPriceableItemTemplate(LocalizedAdjustment adjustment)
      throws EcbBaseException {
    Adjustment adjustmentRsp = adjustmentClient.createAdjustment(adjustment).getBody();
    localizedEntityService.localizedCreateEntity(adjustment);
    return adjustmentRsp;
  }

  @Override
  public Boolean removeAdjustmentFromPiTemplate(final Integer propId) throws EcbBaseException {
    return extendedAdjustmentClient.deleteAdjustment(propId).getBody();
  }

  @Override
  public Boolean removeReasonCodeFromAdjustment(final Integer propId,
      final Set<Integer> reasonCodeSet) throws EcbBaseException {
    List<Integer> reasonCodeList = new ArrayList<>();
    reasonCodeList.addAll(reasonCodeSet);
    return extendedAdjustmentClient.removeReasonCodeMappings(propId, reasonCodeList).getBody();
  }

  @Override
  public Boolean addReasonCodeToAdjustment(final Integer propId, final Set<Integer> reasonCodeSet)
      throws EcbBaseException {
    List<Integer> reasonCodeList = new ArrayList<>();
    reasonCodeList.addAll(reasonCodeSet);
    return extendedAdjustmentClient.addReasonCodeMappings(propId, reasonCodeList).getBody();
  }

  @Override
  public Adjustment updateAdjustment(AdjustmentModel adjustmentMoldel, final Integer propId)
      throws EcbBaseException {
    Adjustment adjustment = new Adjustment();
    BeanUtils.copyProperties(adjustmentMoldel, adjustment);
    Adjustment adjustmentRsp = adjustmentClient.updateAdjustment(adjustment, propId).getBody();
    localizedEntityService.localizedUpdateAllEntity(Collections.singletonList(adjustmentRsp));
    return adjustmentRsp;
  }

  @Override
  public Collection<AdjustmentModel> findPiTemplateAdjustment(Integer templateId)
      throws EcbBaseException {
    String query = PropertyRsqlConstants.ITEM_TEMPLATE_ID_EQUAL + templateId;
    return findAdjustmentByQuery(query);
  }

  @Override
  public Collection<AdjustmentModel> findPiInstanceAdjustment(Integer instanceId)
      throws EcbBaseException {
    String query = PropertyRsqlConstants.ITEM_INSTANCE_ID_EQUAL + instanceId;
    return findAdjustmentByQuery(query);
  }

  private Collection<AdjustmentModel> findAdjustmentByQuery(String query) throws EcbBaseException {
    Collection<AdjustmentModel> adjustmentModelCollection = new ArrayList<>();
    Collection<Adjustment> adjustmentCollection =
        findAdjustmentFromApi(1, Integer.MAX_VALUE, null, query, null, null, null).getRecords();
    adjustmentCollection.forEach(adjustment -> {
      AdjustmentModel adjustmentModel = new AdjustmentModel();
      BeanUtils.copyProperties(adjustment, adjustmentModel);
      adjustmentModelCollection.add(adjustmentModel);
    });
    PaginatedList<AdjustmentModel> adjustmentModels = new PaginatedList<>();
    adjustmentModels.setRecords(adjustmentModelCollection);
    localizedEntityService.localizedFindEntity(adjustmentModels);
    return adjustmentModels.getRecords();
  }

  @Override
  public PaginatedList<Adjustment> findAdjustment(Integer page, Integer size, String[] sort,
      String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException {
    return findAdjustmentFromApi(page, size, sort, query, descriptionLanguage, descriptionFilters,
        descriptionSort);
  }

  private PaginatedList<Adjustment> findAdjustmentFromApi(Integer page, Integer size, String[] sort,
      String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException {
    return adjustmentClient.findAdjustment(page, size, sort, query, descriptionLanguage,
        descriptionFilters, descriptionSort).getBody();
  }

  @Override
  public Map<Integer, Set<Integer>> findAdjustmentReasonCode(Collection<Integer> adjustmentIdList)
      throws EcbBaseException {
    String query = CommonUtils.getQueryStringFromCollection(adjustmentIdList,
        PropertyRsqlConstants.ADJUSTMENT_ID_IN);
    Map<Integer, Set<Integer>> adjustmentReasonCodeMap;
    Collection<AdjustmentTemplateReasonCodeMapping> templateReasonCodeMapping =
        findAdjustmentTemplateReasonCodeMappingApi(1, Integer.MAX_VALUE, null, query).getRecords();
    adjustmentReasonCodeMap = templateReasonCodeMapping.stream().collect(
        Collectors.groupingBy(AdjustmentTemplateReasonCodeMapping::getAdjustmentId, Collectors
            .mapping(AdjustmentTemplateReasonCodeMapping::getReasonCodeId, Collectors.toSet())));
    return adjustmentReasonCodeMap;
  }

  public PaginatedList<AdjustmentTemplateReasonCodeMapping> findAdjustmentTemplateReasonCodeMappingApi(
      Integer page, Integer size, String[] sort, String query) throws EcbBaseException {
    return extendedAdjustmentClient.findAdjustmentTemplateReasonCodeMapping(page, size, sort, query)
        .getBody();
  }

  private Map<Integer, AdjustmentModel> getAdjustmentModelMap(
      Collection<AdjustmentModel> adjustmentModelList) {
    Map<Integer, AdjustmentModel> adjustmentModelMap = new HashMap<>();
    Integer dummyPropId = -1;
    for (AdjustmentModel adjustmentModel : adjustmentModelList) {
      Integer propId = adjustmentModel.getPropId();
      if (propId != null)
        adjustmentModelMap.put(propId, adjustmentModel);
      else
        adjustmentModelMap.put(dummyPropId--, adjustmentModel);
    }
    return adjustmentModelMap;
  }

  private Map<Integer, ReasonCode> getReasonCodeMap(Collection<ReasonCode> reasonCodeList) {
    Map<Integer, ReasonCode> reasonCodeMap = new HashMap<>();
    Integer dummyPropId = -1;
    for (ReasonCode reasonCode : reasonCodeList) {
      Integer propId = reasonCode.getPropId();
      if (propId != null)
        reasonCodeMap.put(reasonCode.getPropId(), reasonCode);
      else
        reasonCodeMap.put(dummyPropId--, reasonCode);
    }
    return reasonCodeMap;
  }

  @SuppressWarnings("unchecked")
  private Map<Integer, List<AdjustmentModel>> getFilteredAdjustmentRecords(
      Collection<AdjustmentModel> uIAdjustmentModelList,
      Collection<AdjustmentModel> backendAdjustmentModelList) {
    Map<Integer, AdjustmentModel> uIRecords = getAdjustmentModelMap(uIAdjustmentModelList);
    Map<Integer, AdjustmentModel> backendRecords =
        getAdjustmentModelMap(backendAdjustmentModelList);

    Map<Integer, List<AdjustmentModel>> adjustmentModelMap = new HashMap<>();

    List<AdjustmentModel> newRecords = new ArrayList<>();
    List<AdjustmentModel> updatedRecords = new ArrayList<>();
    List<AdjustmentModel> deletedRecords = new ArrayList<>();
    Collection<Integer> operationList;

    operationList = CollectionUtils.subtract(uIRecords.keySet(), backendRecords.keySet());
    operationList.forEach(propId -> newRecords.add(uIRecords.get(propId)));
    adjustmentModelMap.put(NEW_RECORDS, newRecords);

    operationList = CollectionUtils.intersection(uIRecords.keySet(), backendRecords.keySet());
    operationList.forEach(propId -> updatedRecords.add(uIRecords.get(propId)));
    adjustmentModelMap.put(UPDATED_RECORDS, updatedRecords);

    operationList = CollectionUtils.subtract(backendRecords.keySet(), uIRecords.keySet());
    operationList.forEach(propId -> deletedRecords.add(backendRecords.get(propId)));
    adjustmentModelMap.put(DELETED_RECORDS, deletedRecords);

    return adjustmentModelMap;
  }

  @SuppressWarnings("unchecked")
  private Map<Integer, List<ReasonCode>> getFilteredReasonCodeRecords(
      Collection<ReasonCode> uIAdjustmentModelList,
      Collection<ReasonCode> backendAdjustmentModelList) {

    Map<Integer, ReasonCode> uIRecords = getReasonCodeMap(uIAdjustmentModelList);
    Map<Integer, ReasonCode> backendRecords = getReasonCodeMap(backendAdjustmentModelList);

    Map<Integer, List<ReasonCode>> reasonCodeMap = new HashMap<>();

    List<ReasonCode> newRecords = new ArrayList<>();
    List<ReasonCode> deletedRecords = new ArrayList<>();
    Collection<Integer> operationList;

    operationList = CollectionUtils.subtract(uIRecords.keySet(), backendRecords.keySet());
    operationList.forEach(propId -> newRecords.add(uIRecords.get(propId)));
    reasonCodeMap.put(NEW_RECORDS, newRecords);

    operationList = CollectionUtils.subtract(backendRecords.keySet(), uIRecords.keySet());
    operationList.forEach(propId -> deletedRecords.add(backendRecords.get(propId)));
    reasonCodeMap.put(DELETED_RECORDS, deletedRecords);

    return reasonCodeMap;
  }

  @Override
  public Boolean updatePiInstanceAdjustment(Integer piInstanceId,
      Collection<AdjustmentModel> adjustmentModelList) throws EcbBaseException {
    for (AdjustmentModel adjustmentModel : adjustmentModelList) {
      updateAdjustment(adjustmentModel, adjustmentModel.getPropId());
    }
    return Boolean.TRUE;
  }

  @Override
  public Boolean updatePiTemplateAdjustmentAndReasonCode(Integer templateId,
      Collection<AdjustmentModel> uiAdjustmentModelList) throws EcbBaseException {

    Collection<AdjustmentModel> backendAdjustmentModelList =
        getPiTemplateAdjustmentWithReasonCode(templateId);

    Map<Integer, List<AdjustmentModel>> filteredRecordMap =
        getFilteredAdjustmentRecords(uiAdjustmentModelList, backendAdjustmentModelList);

    if (CollectionUtils.isNotEmpty(filteredRecordMap.get(DELETED_RECORDS)))
      removeAdjustmentsWithReasonCodesFromPiTemplate(filteredRecordMap.get(DELETED_RECORDS));

    if (CollectionUtils.isNotEmpty(filteredRecordMap.get(NEW_RECORDS)))
      addAdjustmentsWithReasonCodesToPiTemplate(filteredRecordMap.get(NEW_RECORDS));

    if (CollectionUtils.isNotEmpty(filteredRecordMap.get(UPDATED_RECORDS))) {
      List<AdjustmentModel> uiRecords = filteredRecordMap.get(UPDATED_RECORDS);

      updateAdjustmentsWithReasonCodesInPiTemplate(uiRecords, backendAdjustmentModelList);
    }
    return Boolean.TRUE;
  }

  private void updateAdjustmentsWithReasonCodesInPiTemplate(List<AdjustmentModel> uiRecords,
      Collection<AdjustmentModel> backendRecords) throws EcbBaseException {
    Map<Integer, AdjustmentModel> uiRecordMap = getAdjustmentModelMap(uiRecords);
    Map<Integer, AdjustmentModel> backendRecordMap = getAdjustmentModelMap(backendRecords);

    Iterator<Entry<Integer, AdjustmentModel>> iterator = uiRecordMap.entrySet().iterator();
    while (iterator.hasNext()) {
      Entry<Integer, AdjustmentModel> uimap = iterator.next();
      AdjustmentModel uiAdjustmentModel = uimap.getValue();
      Integer propId = uimap.getKey();

      if (!isBothAdjustmentAreSame(uiAdjustmentModel, backendRecordMap.get(propId))) {
        updateAdjustment(uiAdjustmentModel, propId);
      }

      Collection<ReasonCode> uiReasonCodeList = uiAdjustmentModel.getReasonCodes();
      Collection<ReasonCode> backendReasonCodeList = backendRecordMap.get(propId).getReasonCodes();

      Map<Integer, List<ReasonCode>> reasonCodeOperationRecords =
          getFilteredReasonCodeRecords(uiReasonCodeList, backendReasonCodeList);

      List<ReasonCode> removeReasonCodeList = reasonCodeOperationRecords.get(DELETED_RECORDS);
      if (CollectionUtils.isNotEmpty(removeReasonCodeList))
        removeReasonCodeFromAdjustment(propId, getReasonCodeSet(removeReasonCodeList));

      List<ReasonCode> newReasonCodeList = reasonCodeOperationRecords.get(NEW_RECORDS);
      if (CollectionUtils.isNotEmpty(newReasonCodeList))
        addReasonCodeToAdjustment(propId, getReasonCodeSet(newReasonCodeList));
    }
  }

  private Set<Integer> getReasonCodeSet(Collection<ReasonCode> reasonCodeList) {
    Set<Integer> reasonCodeSet = new HashSet<>();
    reasonCodeList.forEach(reasonCode -> reasonCodeSet.add(reasonCode.getPropId()));
    return reasonCodeSet;
  }

  private boolean isBothAdjustmentAreSame(AdjustmentModel ui, AdjustmentModel backend) {
    Boolean flag = Boolean.FALSE;
    if (ui.getPropId().equals(backend.getPropId())
        && StringUtils.equals(ui.getName(), backend.getName())
        && StringUtils.equals(ui.getDisplayName(), backend.getDisplayName())
        && StringUtils.equals(ui.getDescription(), backend.getDescription())) {
      flag = Boolean.TRUE;
    }
    return flag;
  }

  private void addAdjustmentsWithReasonCodesToPiTemplate(List<AdjustmentModel> adjustmentModelList)
      throws EcbBaseException {
    validateDublicateAdjustments(adjustmentModelList);
    for (AdjustmentModel adjustmentModel : adjustmentModelList) {
      LocalizedAdjustment adjustment = new LocalizedAdjustment();
      BeanUtils.copyProperties(adjustmentModel, adjustment);
      Adjustment newAdjustment = addAdjustmentToPriceableItemTemplate(adjustment);
      Collection<ReasonCode> reasonCodes = adjustmentModel.getReasonCodes();
      Set<Integer> reasonCodeSet = getReasonCodeId(reasonCodes);
      addReasonCodeToAdjustment(newAdjustment.getPropId(), reasonCodeSet);

      AdjustmentModel newAdjustmentModel = new AdjustmentModel();
      BeanUtils.copyProperties(newAdjustment, newAdjustmentModel);

      if (!isBothAdjustmentAreSame(newAdjustmentModel, adjustmentModel)) {
        newAdjustmentModel.setName(adjustmentModel.getName());
        newAdjustmentModel.setDisplayName(adjustmentModel.getDisplayName());
        newAdjustmentModel.setDescription(adjustmentModel.getDescription());
        updateAdjustment(newAdjustmentModel, newAdjustmentModel.getPropId());
      }
    }
  }

  private void validateDublicateAdjustments(List<AdjustmentModel> adjustmentModelList)
      throws EcbBaseException {
    Set<Integer> adjustmentTypeIds = new HashSet<>();
    for (Adjustment adjustment : adjustmentModelList) {
      if (!adjustmentTypeIds.add(adjustment.getAdjustmentTypeId())) {
        throw new EcbBaseException(
            moErrorMessagesUtil.getErrorMessages("DUPLICATE_ADJUSTMENT_CAN_NOT_ADD"));
      }
    }
  }

  private Set<Integer> getReasonCodeId(Collection<ReasonCode> reasonCodes) {
    Set<Integer> reasonCodeSet = new HashSet<>();
    reasonCodes.forEach(reasonCode -> reasonCodeSet.add(reasonCode.getPropId()));
    return reasonCodeSet;
  }

  private void removeAdjustmentsWithReasonCodesFromPiTemplate(
      List<AdjustmentModel> adjustmentModelList) throws EcbBaseException {
    for (AdjustmentModel adjustmentModel : adjustmentModelList) {
      Collection<ReasonCode> reasonCodes = adjustmentModel.getReasonCodes();
      Set<Integer> reasonCodeSet = getReasonCodeId(reasonCodes);
      if (CollectionUtils.isNotEmpty(reasonCodeSet))
        removeReasonCodeFromAdjustment(adjustmentModel.getPropId(), reasonCodeSet);
      removeAdjustmentFromPiTemplate(adjustmentModel.getPropId());
    }
  }

  @Override
  public Collection<AdjustmentModel> getPiTemplateAdjustmentWithReasonCode(Integer templateId)
      throws EcbBaseException {
    Collection<AdjustmentModel> adjustmentModelList = findPiTemplateAdjustment(templateId);
    return addReasonCodesToAdjustmentModel(adjustmentModelList);
  }

  @Override
  public Collection<AdjustmentModel> getPiInstanceAdjustmentWithReasonCode(Integer instanceId)
      throws EcbBaseException {
    Collection<AdjustmentModel> adjustmentModelList;
    adjustmentModelList = findPiInstanceAdjustment(instanceId);
    return addReasonCodesToAdjustmentModel(adjustmentModelList);
  }

  private Collection<AdjustmentModel> addReasonCodesToAdjustmentModel(
      Collection<AdjustmentModel> adjustmentModelList) throws EcbBaseException {
    if (!CollectionUtils.isEmpty(adjustmentModelList)) {
      Map<Integer, AdjustmentModel> adjustmentModelMap = new HashMap<>();
      adjustmentModelList.forEach(
          adjustmentModel -> adjustmentModelMap.put(adjustmentModel.getPropId(), adjustmentModel));

      Map<Integer, Set<Integer>> adjustmentReasonCodeMap =
          findAdjustmentReasonCode(adjustmentModelMap.keySet());

      if (MapUtils.isNotEmpty(adjustmentReasonCodeMap)) {
        Iterator<Entry<Integer, Set<Integer>>> iterator =
            adjustmentReasonCodeMap.entrySet().iterator();
        while (iterator.hasNext()) {
          Entry<Integer, Set<Integer>> entry = iterator.next();
          Collection<ReasonCode> reasonCodeCollection =
              adjustmentReasonCodeService.findReasonCode(entry.getValue());
          if (!CollectionUtils.isEmpty(reasonCodeCollection)
              && adjustmentModelMap.containsKey(entry.getKey())) {
            adjustmentModelMap.get(entry.getKey()).getReasonCodes().addAll(reasonCodeCollection);
          }
        }
      }
    }
    return adjustmentModelList;
  }

  @Override
  public Adjustment createAdjustment(LocalizedAdjustment adjustment) throws EcbBaseException {
    localizedEntityService.localizedCreateEntity(adjustment);
    return adjustmentClient.createAdjustment(adjustment).getBody();
  }
}
