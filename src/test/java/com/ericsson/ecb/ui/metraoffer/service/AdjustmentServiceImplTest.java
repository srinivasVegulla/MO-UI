package com.ericsson.ecb.ui.metraoffer.service;

import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ericsson.ecb.catalog.client.AdjustmentClient;
import com.ericsson.ecb.catalog.client.ExtendedAdjustmentClient;
import com.ericsson.ecb.catalog.model.Adjustment;
import com.ericsson.ecb.catalog.model.AdjustmentTemplateReasonCodeMapping;
import com.ericsson.ecb.catalog.model.LocalizedAdjustment;
import com.ericsson.ecb.catalog.model.ReasonCode;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.model.AdjustmentModel;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.AdjustmentServiceImpl;

public class AdjustmentServiceImplTest {

  @InjectMocks
  private AdjustmentServiceImpl adjustmentServiceImpl;

  @Mock
  private AdjustmentClient adjustmentClient;

  @Mock
  private ExtendedAdjustmentClient extendedAdjustmentClient;

  @Mock
  private AdjustmentReasonCodeService adjustmentReasonCodeService;

  @Mock
  private LocalizedEntityService localizedEntity;

  private Adjustment adjustment;

  private LocalizedAdjustment localizedAdjustment;

  private AdjustmentModel adjustmentModel;

  private Integer templateId = 1;

  private Integer propId = 1;

  private Integer adjustmentTypeId = 1;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);

    adjustment = new Adjustment();
    adjustment.setItemTemplateId(templateId);
    adjustment.setAdjustmentTypeId(adjustmentTypeId);

    localizedAdjustment = new LocalizedAdjustment();
    localizedAdjustment.setItemTemplateId(templateId);
    localizedAdjustment.setAdjustmentTypeId(adjustmentTypeId);

    adjustmentModel = new AdjustmentModel();
    adjustmentModel.setItemTemplateId(templateId);
  }

  @Test
  public void shouldAddAdjustmentToPriceableItemTemplate() throws Exception {
    LocalizedAdjustment adjustmentRsp = new LocalizedAdjustment();
    BeanUtils.copyProperties(adjustment, adjustmentRsp);
    adjustmentRsp.setPropId(propId);
    ResponseEntity<Adjustment> adjustmentRspEntity =
        new ResponseEntity<>(adjustmentRsp, HttpStatus.OK);;
    when(adjustmentClient.createAdjustment(localizedAdjustment)).thenReturn(adjustmentRspEntity);
    when(localizedEntity.localizedCreateEntity(adjustment)).thenReturn(adjustment);
    adjustmentServiceImpl.addAdjustmentToPriceableItemTemplate(localizedAdjustment);
  }

  @Test
  public void shouldRemoveAdjustmentFromPiTemplate() throws Exception {
    Boolean flag = Boolean.TRUE;
    ResponseEntity<Boolean> value = new ResponseEntity<>(flag, HttpStatus.OK);
    when(extendedAdjustmentClient.deleteAdjustment(propId)).thenReturn(value);
    adjustmentServiceImpl.removeAdjustmentFromPiTemplate(propId);
  }

  @Test
  public void shouldRemoveReasonCodeFromAdjustment() throws Exception {
    Set<Integer> reasonCodeSet = new HashSet<>();
    reasonCodeSet.add(1);
    List<Integer> reasonCodeList = new ArrayList<>();
    reasonCodeList.addAll(reasonCodeSet);
    Boolean flag = Boolean.TRUE;
    ResponseEntity<Boolean> value = new ResponseEntity<>(flag, HttpStatus.OK);
    when(extendedAdjustmentClient.removeReasonCodeMappings(propId, reasonCodeList))
        .thenReturn(value);
    adjustmentServiceImpl.removeReasonCodeFromAdjustment(propId, reasonCodeSet);
  }

  @Test
  public void shouldAddReasonCodeToAdjustment() throws Exception {
    Set<Integer> reasonCodeSet = new HashSet<>();
    reasonCodeSet.add(1);
    List<Integer> reasonCodeList = new ArrayList<>();
    reasonCodeList.addAll(reasonCodeSet);
    Boolean flag = Boolean.TRUE;
    ResponseEntity<Boolean> value = new ResponseEntity<>(flag, HttpStatus.OK);

    when(extendedAdjustmentClient.addReasonCodeMappings(propId, reasonCodeList)).thenReturn(value);
    adjustmentServiceImpl.addReasonCodeToAdjustment(propId, reasonCodeSet);
  }


  @Test
  public void shouldUpdateAdjustment() throws Exception {
    AdjustmentModel adjustmentMoldel = new AdjustmentModel();
    Adjustment adjustment = new Adjustment();
    BeanUtils.copyProperties(adjustmentMoldel, adjustment);
    ResponseEntity<Adjustment> value = new ResponseEntity<>(adjustment, HttpStatus.OK);
    when(adjustmentClient.updateAdjustment(adjustment, propId)).thenReturn(value);
    when(localizedEntity.localizedUpdateEntity(adjustment)).thenReturn(adjustment);
    adjustmentServiceImpl.updateAdjustment(adjustmentMoldel, propId);
  }

  @Test
  public void shouldFindAdjustment() throws Exception {
    Adjustment adjustment = new Adjustment();
    List<Adjustment> adjustmentList = new ArrayList<>();
    adjustmentList.add(adjustment);
    PaginatedList<Adjustment> paginatedList = new PaginatedList<>();
    paginatedList.setRecords(adjustmentList);
    ResponseEntity<PaginatedList<Adjustment>> value =
        new ResponseEntity<>(paginatedList, HttpStatus.OK);
    when(adjustmentClient.findAdjustment(1, Integer.MAX_VALUE, null, null, null, null, null))
        .thenReturn(value);
    adjustmentServiceImpl.findAdjustment(1, Integer.MAX_VALUE, null, null, null, null, null);
  }

  @Test
  public void shouldFindAdjustmentReasonCode() throws Exception {

    Collection<Integer> adjustmentIdList = new ArrayList<>();
    adjustmentIdList.add(1);
    AdjustmentTemplateReasonCodeMapping adjustmentTemplateReasonCodeMapping =
        new AdjustmentTemplateReasonCodeMapping();
    adjustmentTemplateReasonCodeMapping.setAdjustmentId(1);
    List<AdjustmentTemplateReasonCodeMapping> adjustmentTemplateReasonCodeMappingList =
        new ArrayList<>();
    adjustmentTemplateReasonCodeMappingList.add(adjustmentTemplateReasonCodeMapping);
    PaginatedList<AdjustmentTemplateReasonCodeMapping> paginatedList = new PaginatedList<>();
    paginatedList.setRecords(adjustmentTemplateReasonCodeMappingList);
    ResponseEntity<PaginatedList<AdjustmentTemplateReasonCodeMapping>> value =
        new ResponseEntity<>(paginatedList, HttpStatus.OK);
    when(extendedAdjustmentClient.findAdjustmentTemplateReasonCodeMapping(1, Integer.MAX_VALUE,
        null, "adjustmentId=in=(1)")).thenReturn(value);
    adjustmentServiceImpl.findAdjustmentReasonCode(adjustmentIdList);
  }

  @Test
  public void shouldUpdatePiInstanceAdjustment() throws Exception {

    Integer piInstanceId = 1;
    Adjustment adjustment = new Adjustment();
    adjustment.setPropId(1);
    adjustment.setAdjustmentTypeId(1);
    adjustment.setItemInstanceId(1);
    AdjustmentModel adjustmentModel = new AdjustmentModel();
    adjustmentModel.setPropId(1);
    adjustmentModel.setAdjustmentTypeId(1);
    adjustmentModel.setItemInstanceId(1);
    Collection<AdjustmentModel> adjustmentModelList = new ArrayList<>();
    adjustmentModelList.add(adjustmentModel);
    ResponseEntity<Adjustment> value = new ResponseEntity<>(adjustment, HttpStatus.OK);
    when(adjustmentClient.updateAdjustment(adjustment, propId)).thenReturn(value);
    when(localizedEntity.localizedUpdateEntity(adjustment)).thenReturn(adjustment);
    adjustmentServiceImpl.updatePiInstanceAdjustment(piInstanceId, adjustmentModelList);
  }


  @Test
  public void shouldUpdatePiTemplateAdjustmentAndReasonCode() throws EcbBaseException {
    Collection<AdjustmentModel> uiAdjustmentModelList = new ArrayList<>();

    AdjustmentModel adjustmentModelNew = new AdjustmentModel();
    adjustmentModelNew.setPropId(2);
    Collection<ReasonCode> reasonCodesNew = new ArrayList<>();
    ReasonCode reasonCodeNew = new ReasonCode();
    reasonCodeNew.setPropId(2);
    reasonCodesNew.add(reasonCodeNew);
    adjustmentModelNew.getReasonCodes().addAll(reasonCodesNew);
    uiAdjustmentModelList.add(adjustmentModelNew);


    AdjustmentModel adjustmentModelUpdate = new AdjustmentModel();
    adjustmentModelUpdate.setPropId(1);
    Collection<ReasonCode> reasonCodesUpdate = new ArrayList<>();
    ReasonCode reasonCodeUpdate = new ReasonCode();
    reasonCodeUpdate.setPropId(1);
    reasonCodesUpdate.add(reasonCodeUpdate);
    adjustmentModelUpdate.getReasonCodes().addAll(reasonCodesUpdate);
    uiAdjustmentModelList.add(adjustmentModelUpdate);


    PaginatedList<Adjustment> paginatedListAdjustment = new PaginatedList<>();
    List<Adjustment> adjustmentList = new ArrayList<>();
    Adjustment adjustment = new Adjustment();
    adjustment.setPropId(1);
    adjustment.setItemTemplateId(1);
    adjustmentList.add(adjustment);

    Adjustment adjustment2 = new Adjustment();
    adjustment2.setPropId(3);
    adjustment2.setItemTemplateId(1);
    adjustmentList.add(adjustment2);

    paginatedListAdjustment.setRecords(adjustmentList);
    ResponseEntity<PaginatedList<Adjustment>> adjustmentRsp =
        new ResponseEntity<>(paginatedListAdjustment, HttpStatus.OK);
    when(adjustmentClient.findAdjustment(1, Integer.MAX_VALUE, null, "itemTemplateId==1", null,
        null, null)).thenReturn(adjustmentRsp);

    PaginatedList<AdjustmentTemplateReasonCodeMapping> paginatedAdjustmentTemplateReasonCode =
        new PaginatedList<>();
    List<AdjustmentTemplateReasonCodeMapping> adjustmentTemplateReasonCodeMappingList =
        new ArrayList<>();

    AdjustmentTemplateReasonCodeMapping adjustmentTemplateReasonCodeMapping =
        new AdjustmentTemplateReasonCodeMapping();
    adjustmentTemplateReasonCodeMapping.setAdjustmentId(1);
    adjustmentTemplateReasonCodeMapping.setReasonCodeId(1);
    adjustmentTemplateReasonCodeMappingList.add(adjustmentTemplateReasonCodeMapping);
    paginatedAdjustmentTemplateReasonCode.setRecords(adjustmentTemplateReasonCodeMappingList);
    ResponseEntity<PaginatedList<AdjustmentTemplateReasonCodeMapping>> adjustmentTemplateReasonCodeRsp =
        new ResponseEntity<>(paginatedAdjustmentTemplateReasonCode, HttpStatus.OK);
    when(extendedAdjustmentClient.findAdjustmentTemplateReasonCodeMapping(1, Integer.MAX_VALUE,
        null, "adjustmentId=in=(1,3)")).thenReturn(adjustmentTemplateReasonCodeRsp);

    Boolean flag = true;
    ResponseEntity<Boolean> booleanRsp = new ResponseEntity<>(flag, HttpStatus.OK);
    when(extendedAdjustmentClient.deleteAdjustment(3)).thenReturn(booleanRsp);


    LocalizedAdjustment localizedAdjustment = new LocalizedAdjustment();
    localizedAdjustment.setPropId(2);
    Adjustment adjustmentLocalized = new Adjustment();
    adjustmentLocalized.setPropId(1);
    ResponseEntity<Adjustment> localizedAdjustmentRsp =
        new ResponseEntity<>(adjustmentLocalized, HttpStatus.OK);
    when(adjustmentClient.createAdjustment(localizedAdjustment)).thenReturn(localizedAdjustmentRsp);

    List<Integer> reasonCodeList = new ArrayList<>();
    reasonCodeList.add(2);

    ResponseEntity<Boolean> reasonCodeMappingRsp = new ResponseEntity<>(true, HttpStatus.OK);;
    when(extendedAdjustmentClient.addReasonCodeMappings(1, reasonCodeList))
        .thenReturn(reasonCodeMappingRsp);

    Adjustment updateAdjustment = new Adjustment();
    updateAdjustment.setPropId(1);
    ResponseEntity<Adjustment> updateAdjustmentRsp =
        new ResponseEntity<>(updateAdjustment, HttpStatus.OK);
    when(adjustmentClient.updateAdjustment(updateAdjustment, 1)).thenReturn(updateAdjustmentRsp);


    List<Integer> addReasonCodeList = new ArrayList<>();
    addReasonCodeList.add(1);
    ResponseEntity<Boolean> addReasonCodeMappingsRsp = new ResponseEntity<>(true, HttpStatus.OK);;
    when(extendedAdjustmentClient.addReasonCodeMappings(1, addReasonCodeList))
        .thenReturn(addReasonCodeMappingsRsp);

    adjustmentServiceImpl.updatePiTemplateAdjustmentAndReasonCode(templateId,
        uiAdjustmentModelList);
  }

  @Test
  public void shouldGetPiTemplateAdjustmentWithReasonCode() throws EcbBaseException {
    PaginatedList<Adjustment> paginated = new PaginatedList<>();

    Adjustment adjustment = new Adjustment();
    adjustment.setItemTemplateId(1);
    List<Adjustment> adjustmentList = new ArrayList<>();
    adjustmentList.add(adjustment);

    paginated.setRecords(adjustmentList);

    ResponseEntity<PaginatedList<Adjustment>> value =
        new ResponseEntity<>(paginated, HttpStatus.OK);

    when(adjustmentClient.findAdjustment(1, Integer.MAX_VALUE, null, "itemTemplateId==1", null,
        null, null)).thenReturn(value);


    PaginatedList<AdjustmentTemplateReasonCodeMapping> paginatedAt = new PaginatedList<>();
    AdjustmentTemplateReasonCodeMapping adjustmentTemplateReasonCodeMapping =
        new AdjustmentTemplateReasonCodeMapping();
    adjustmentTemplateReasonCodeMapping.setAdjustmentId(1);
    adjustmentTemplateReasonCodeMapping.setReasonCodeId(1);
    List<AdjustmentTemplateReasonCodeMapping> adjustmentTemplateReasonCodeMappingList =
        new ArrayList<>();
    adjustmentTemplateReasonCodeMappingList.add(adjustmentTemplateReasonCodeMapping);
    paginatedAt.setRecords(adjustmentTemplateReasonCodeMappingList);

    ResponseEntity<PaginatedList<AdjustmentTemplateReasonCodeMapping>> atrcmRsp =
        new ResponseEntity<>(paginatedAt, HttpStatus.OK);
    when(extendedAdjustmentClient.findAdjustmentTemplateReasonCodeMapping(1, Integer.MAX_VALUE,
        null, "adjustmentId=in=(null)")).thenReturn(atrcmRsp);

    adjustmentServiceImpl.getPiTemplateAdjustmentWithReasonCode(1);
  }

  @Test
  public void shouldGetPiInstanceAdjustmentWithReasonCode() throws EcbBaseException {
    PaginatedList<Adjustment> paginated = new PaginatedList<>();
    Adjustment adjustment = new Adjustment();
    adjustment.setItemInstanceId(2);
    List<Adjustment> adjustmentList = new ArrayList<>();
    adjustmentList.add(adjustment);
    paginated.setRecords(adjustmentList);
    ResponseEntity<PaginatedList<Adjustment>> value =
        new ResponseEntity<>(paginated, HttpStatus.OK);
    when(adjustmentClient.findAdjustment(1, Integer.MAX_VALUE, null, "itemInstanceId==2", null,
        null, null)).thenReturn(value);

    PaginatedList<AdjustmentTemplateReasonCodeMapping> paginateList = new PaginatedList<>();
    AdjustmentTemplateReasonCodeMapping atrcm = new AdjustmentTemplateReasonCodeMapping();
    atrcm.setAdjustmentId(1);
    atrcm.setReasonCodeId(4);
    List<AdjustmentTemplateReasonCodeMapping> atrcmList = new ArrayList<>();
    atrcmList.add(atrcm);
    paginateList.setRecords(atrcmList);
    ResponseEntity<PaginatedList<AdjustmentTemplateReasonCodeMapping>> value1 =
        new ResponseEntity<>(paginateList, HttpStatus.OK);
    when(extendedAdjustmentClient.findAdjustmentTemplateReasonCodeMapping(1, Integer.MAX_VALUE,
        null, "adjustmentId=in=(null)")).thenReturn(value1);
    adjustmentServiceImpl.getPiInstanceAdjustmentWithReasonCode(2);
  }

  @Test
  public void shouldCreateAdjustment() throws EcbBaseException {
    LocalizedAdjustment locadjustment = new LocalizedAdjustment();
    ResponseEntity<Adjustment> value = new ResponseEntity<>(locadjustment, HttpStatus.OK);
    when(adjustmentClient.createAdjustment(locadjustment)).thenReturn(value);
    adjustmentServiceImpl.createAdjustment(locadjustment);
  }


}
