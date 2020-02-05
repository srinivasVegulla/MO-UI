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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ericsson.ecb.catalog.client.ExtendedReasonCodeClient;
import com.ericsson.ecb.catalog.client.ReasonCodeClient;
import com.ericsson.ecb.catalog.model.LocalizedReasonCode;
import com.ericsson.ecb.catalog.model.ReasonCode;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.AdjustmentReasonCodeServiceImpl;
import com.ericsson.ecb.ui.metraoffer.utils.EntityHelper;

public class AdjustmentReasonCodeServiceImplTest {

  @InjectMocks
  private AdjustmentReasonCodeServiceImpl adjustmentReasonCodeServiceImpl;

  @Mock
  private ReasonCodeClient reasonCodeClient;

  @Mock
  private ExtendedReasonCodeClient extendedReasonCodeClient;

  @Mock
  private LocalizedEntityService localizedEntity;

  @Mock
  private EntityHelper entityHelper;

  private ReasonCode reasonCode;

  private LocalizedReasonCode localizedReasonCode;

  private Integer propId = 1;

  private Integer page = 1;

  private Integer size = Integer.MAX_VALUE;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    reasonCode = new ReasonCode();
    localizedReasonCode = new LocalizedReasonCode();
  }

  @Test
  public void shouldGetReasonCode() throws Exception {
    ResponseEntity<ReasonCode> rspReasonCode = new ResponseEntity<>(reasonCode, HttpStatus.OK);
    when(reasonCodeClient.getReasonCode(propId)).thenReturn(rspReasonCode);
    when(localizedEntity.localizedGetEntity(reasonCode)).thenReturn(reasonCode);
    adjustmentReasonCodeServiceImpl.getReasonCode(propId);
  }

  @Test
  public void shouldFindReasonCodeWithPaginated() throws Exception {
    List<ReasonCode> reasonCodes = new ArrayList<>();
    reasonCodes.add(reasonCode);
    PaginatedList<ReasonCode> paginated = new PaginatedList<>();
    paginated.setRecords(reasonCodes);
    ResponseEntity<PaginatedList<ReasonCode>> rspReasonCode =
        new ResponseEntity<>(paginated, HttpStatus.OK);
    when(reasonCodeClient.findReasonCode(page, size, null, null, null, null, null))
        .thenReturn(rspReasonCode);
    adjustmentReasonCodeServiceImpl.findReasonCode(page, size, null, null, null, null, null);
  }

  // @Test
  public void shouldFindReasonCodeByPropId11() throws Exception {
    Collection<Integer> propIdList = new ArrayList<>();
    propIdList.add(propId);

    List<ReasonCode> reasonCodes = new ArrayList<>();
    reasonCodes.add(reasonCode);
    PaginatedList<ReasonCode> paginated = new PaginatedList<>();
    paginated.setRecords(reasonCodes);
    ResponseEntity<PaginatedList<ReasonCode>> rspReasonCode =
        new ResponseEntity<>(paginated, HttpStatus.OK);

    when(reasonCodeClient.findReasonCode(page, size, null, "propId=in=(1)", null, null, null))
        .thenReturn(rspReasonCode);
    adjustmentReasonCodeServiceImpl.findReasonCode(propIdList);
  }

  @Test
  public void shouldFindReasonCode() throws EcbBaseException {
    Collection<Integer> propIds = new ArrayList<>();
    propIds.add(1);

    PaginatedList<ReasonCode> paginated = new PaginatedList<>();
    List<ReasonCode> reasonCodeList = new ArrayList<>();
    ReasonCode reasonCode = new ReasonCode();
    reasonCodeList.add(reasonCode);
    paginated.setRecords(reasonCodeList);
    ResponseEntity<PaginatedList<ReasonCode>> value =
        new ResponseEntity<>(paginated, HttpStatus.OK);
    when(reasonCodeClient.findReasonCode(1, Integer.MAX_VALUE, null, "propId=in=(1)", null, null,
        null)).thenReturn(value);

    when(localizedEntity.localizedFindEntity(paginated)).thenReturn(paginated);

    adjustmentReasonCodeServiceImpl.findReasonCode(propIds);
  }

  @Test
  public void shouldDeleteReasonCode() throws Exception {
    Boolean flag = Boolean.TRUE;
    ResponseEntity<Boolean> rspBoolean = new ResponseEntity<>(flag, HttpStatus.OK);

    when(extendedReasonCodeClient.deleteReasonCode(propId)).thenReturn(rspBoolean);
    adjustmentReasonCodeServiceImpl.deleteReasonCode(propId);

  }

  @Test
  public void shouldUpdateReasonCode() throws Exception {
    reasonCode.setDisplayName("displayName");
    reasonCode.setPropId(propId);
    Set<String> fields = new HashSet<>();
    fields.add("displayName");
    Boolean result = Boolean.TRUE;
    when(entityHelper.updateSelective(reasonCode, fields, propId)).thenReturn(result);
    adjustmentReasonCodeServiceImpl.updateReasonCode(reasonCode, fields, propId);
  }

  @Test
  public void shouldCreateReasonCode() throws Exception {
    ResponseEntity<ReasonCode> value = new ResponseEntity<>(reasonCode, HttpStatus.OK);
    when(reasonCodeClient.createReasonCode(localizedReasonCode)).thenReturn(value);
    when(localizedEntity.localizedGetEntity(reasonCode)).thenReturn(reasonCode);
    adjustmentReasonCodeServiceImpl.createReasonCode(localizedReasonCode);
  }

}
