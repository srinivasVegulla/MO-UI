package com.ericsson.ecb.ui.metraoffer.service;

import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ericsson.ecb.catalog.client.AdjustmentTypeClient;
import com.ericsson.ecb.catalog.model.AdjustmentType;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.AdjustmentTypeServiceImpl;

public class AdjustmentTypeServiceImplTest {

  @InjectMocks
  private AdjustmentTypeServiceImpl adjustmentTypeServiceImpl;

  @Mock
  private AdjustmentTypeClient adjustmentTypeClient;
  
  @Mock
  private LocalizedEntityService localizedEntity;

  private Integer page = 1;

  private Integer size = Integer.MAX_VALUE;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void shouldFindAdjustmentType() throws EcbBaseException {
    AdjustmentType adjustmentType = new AdjustmentType();
    List<AdjustmentType> adjustmentTypeList = new ArrayList<>();
    adjustmentTypeList.add(adjustmentType);
    PaginatedList<AdjustmentType> adjustmentTypePaginated = new PaginatedList<>();
    adjustmentTypePaginated.setRecords(adjustmentTypeList);
    ResponseEntity<PaginatedList<AdjustmentType>> returnObj =
        new ResponseEntity<>(adjustmentTypePaginated, HttpStatus.OK);

    when(adjustmentTypeClient.findAdjustmentType(page, size, null, null, null, null, null))
        .thenReturn(returnObj);
    when(localizedEntity.localizedGetEntity(returnObj.getBody())).thenReturn(returnObj.getBody());
    adjustmentTypeServiceImpl.findAdjustmentType(page, size, null, null, null, null, null);
  }

  @Test
  public void shouldGetAdjustmentType() throws EcbBaseException {
    Integer piId = 1;
    PaginatedList<AdjustmentType> adjustmentTypePaginated = new PaginatedList<>();
    ResponseEntity<PaginatedList<AdjustmentType>> returnObj =
        new ResponseEntity<>(adjustmentTypePaginated, HttpStatus.OK);
    when(adjustmentTypeClient.findAdjustmentType(page, size, null, "itemTypeId==" + piId, null,
        null, null)).thenReturn(returnObj);
    when(localizedEntity.localizedGetEntity(returnObj.getBody())).thenReturn(returnObj.getBody());
    adjustmentTypeServiceImpl.getAdjustmentType(piId); 
  }

  @Test
  public void shouldisAdjustmentTypeExist() throws EcbBaseException {
    Integer piId = 1;
    PaginatedList<AdjustmentType> adjustmentTypePaginated = new PaginatedList<>();
    ResponseEntity<PaginatedList<AdjustmentType>> returnObj =
        new ResponseEntity<>(adjustmentTypePaginated, HttpStatus.OK);
    when(adjustmentTypeClient.findAdjustmentType(page, size, null, "itemTypeId==" + piId, null,
        null, null)).thenReturn(returnObj);
    adjustmentTypeServiceImpl.isAdjustmentTypeExist(piId);
  }
  
  @Test
  public void shouldisAdjustmentTypeExistForElse() throws EcbBaseException {
    Integer piId = 1;
    
    AdjustmentType adjustmentType = new AdjustmentType();
    adjustmentType.setItemTypeId(piId);
    adjustmentType.setName("sample Adj");
    
    List<AdjustmentType> adjustmentTypeList = new ArrayList<>();
    adjustmentTypeList.add(adjustmentType);
    
    PaginatedList<AdjustmentType> adjustmentTypePaginated = new PaginatedList<>();
    adjustmentTypePaginated.setRecords(adjustmentTypeList);
    ResponseEntity<PaginatedList<AdjustmentType>> returnObj =
        new ResponseEntity<>(adjustmentTypePaginated, HttpStatus.OK);
    when(adjustmentTypeClient.findAdjustmentType(page, size, null, "itemTypeId==" + piId, null,
        null, null)).thenReturn(returnObj);
    adjustmentTypeServiceImpl.isAdjustmentTypeExist(piId);
  }
}
