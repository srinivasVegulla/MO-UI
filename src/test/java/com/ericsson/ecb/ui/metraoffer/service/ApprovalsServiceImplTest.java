package com.ericsson.ecb.ui.metraoffer.service;

import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.provider.approval.Approval.ApprovalStatus;

import com.ericsson.ecb.base.client.ApprovalsV2Client;
import com.ericsson.ecb.base.client.AuditAggregatorClient;
import com.ericsson.ecb.base.client.ExtendedApprovalsV2Client;
import com.ericsson.ecb.base.model.ApprovalsV2;
import com.ericsson.ecb.base.model.AuditAggregator;
import com.ericsson.ecb.base.model.ViewChangeDetails;
import com.ericsson.ecb.catalog.client.PricelistClient;
import com.ericsson.ecb.catalog.client.RateScheduleClient;
import com.ericsson.ecb.catalog.model.Pricelist;
import com.ericsson.ecb.catalog.model.RateSchedule;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbAuthorizationException;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyConstants;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.Approvals;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.ApprovalsServiceImpl;
import com.ericsson.ecb.ui.metraoffer.utils.ApprovalsUtil;

public class ApprovalsServiceImplTest {

  @InjectMocks
  private ApprovalsServiceImpl approvalsServiceImpl;

  @Mock
  private ApprovalsV2Client approvalsV2Client;

  @Mock
  private ApprovalsUtil approvalsUtil;

  @Mock
  private ExtendedApprovalsV2Client extendedApprovalsV2Client;

  @Mock
  private AuditAggregatorClient auditAggregatorClient;

  @Mock
  private RateScheduleClient rateScheduleClient;

  @Mock
  private PricelistClient pricelistClient;

  @Mock
  private AsyncCommonService asyncCommonService;

  private Integer uniqueItemId = 1;

  private PaginatedList<AuditAggregator> paginatedAuditAggregatorList;

  private String offeringUpdateQuery = "uniqueItemId==" + uniqueItemId
      + " and currentState=in=(PENDING,FAILEDTOAPPLY) and changeType==OfferingUpdate";

  private String rateUpdateQuery = "uniqueItemId==" + uniqueItemId
      + " and currentState=in=(PENDING,FAILEDTOAPPLY) and changeType==RateUpdate";

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    AuditAggregator auditAggregator = new AuditAggregator();
    List<AuditAggregator> auditAggregatorList = new ArrayList<>();
    auditAggregatorList.add(auditAggregator);
    paginatedAuditAggregatorList = new PaginatedList<>();
    paginatedAuditAggregatorList.setRecords(auditAggregatorList);
  }

  @Test
  public void shouldFindOfferingUpdatePendingApprovals() throws EcbBaseException {

    ResponseEntity<PaginatedList<ApprovalsV2>> records = approvalsMockData();

    when(approvalsV2Client.findApprovalsV2(1, Integer.MAX_VALUE, null, "uniqueItemId=="
        + uniqueItemId
        + " and currentState=in=(PENDING,FAILEDTOAPPLY) and submitterName==admin and changeType==OfferingUpdate"))
            .thenReturn(records);
    approvalsServiceImpl.findOfferingUpdatePendingApprovals(uniqueItemId, 1, Integer.MAX_VALUE,
        null, "submitterName==admin");
  }

  @Test
  public void shouldFindOfferingUpdatePendingApprovalsForIF() throws EcbBaseException {
    ResponseEntity<PaginatedList<ApprovalsV2>> records = approvalsMockData();

    when(approvalsV2Client.findApprovalsV2(1, Integer.MAX_VALUE, null, offeringUpdateQuery))
        .thenReturn(records);
    approvalsServiceImpl.findOfferingUpdatePendingApprovals(uniqueItemId, 1, Integer.MAX_VALUE,
        null, null);
  }

  @Test
  public void shouldFindRateUpdatePendingApprovals() throws EcbBaseException {
    ResponseEntity<PaginatedList<ApprovalsV2>> records = approvalsMockData();
    when(approvalsV2Client.findApprovalsV2(1, Integer.MAX_VALUE, null,
        "uniqueItemId==1 and currentState=in=(PENDING,FAILEDTOAPPLY) and submitterName==Admin and changeType==RateUpdate"))
            .thenReturn(records);
    approvalsServiceImpl.findRateUpdatePendingApprovals(uniqueItemId, 1, Integer.MAX_VALUE, null,
        "submitterName==Admin");
  }

  @Test
  public void shouldGetOfferingsApprovalsStatus() throws EcbBaseException {
    ResponseEntity<PaginatedList<ApprovalsV2>> records = approvalsMockData();
    when(approvalsUtil.isUpdatePoApprovalEnabled()).thenReturn(Boolean.TRUE);

    when(approvalsV2Client.findApprovalsV2(1, Integer.MAX_VALUE, null, offeringUpdateQuery))
        .thenReturn(records);
    approvalsServiceImpl.getOfferingApprovalsStatus(uniqueItemId);
  }

  @Test
  public void shouldGetOfferingsApprovalsStatusForIfApprovalAllowMoreThanOne()
      throws EcbBaseException {

    when(approvalsUtil.isUpdatePoApprovalEnabled()).thenReturn(Boolean.TRUE);
    when(approvalsUtil.isUpdatePoApprovalAllowMoreThanOne()).thenReturn(Boolean.TRUE);
    ResponseEntity<PaginatedList<ApprovalsV2>> records = approvalsMockData();

    when(approvalsV2Client.findApprovalsV2(1, Integer.MAX_VALUE, null, offeringUpdateQuery))
        .thenReturn(records);
    approvalsServiceImpl.getOfferingApprovalsStatus(uniqueItemId);
  }

  @Test
  public void shouldGetOfferingsApprovalsStatusForIfApprovalEnabled() throws EcbBaseException {
    when(approvalsUtil.isUpdatePoApprovalEnabled()).thenReturn(Boolean.FALSE);
    ResponseEntity<PaginatedList<ApprovalsV2>> records = approvalsMockData();

    when(
        approvalsV2Client.findApprovalsV2(1, Integer.MAX_VALUE, null,
            "uniqueItemId==" + uniqueItemId
                + "  and currentState==PENDING and changeType==OfferingUpdate"))
                    .thenReturn(records);
    approvalsServiceImpl.getOfferingApprovalsStatus(uniqueItemId);
  }

  @Test
  public void shouldGetRateApprovalsStatus() throws EcbBaseException {
    when(approvalsUtil.isCreateRuleSetApprovalEnabled()).thenReturn(Boolean.TRUE);

    ResponseEntity<PaginatedList<ApprovalsV2>> records = approvalsMockData();
    when(approvalsV2Client.findApprovalsV2(1, Integer.MAX_VALUE, null, rateUpdateQuery))
        .thenReturn(records);
    approvalsServiceImpl.getRateApprovalsStatus(uniqueItemId);
  }

  @Test
  public void shouldGetRateApprovalsStatusForCreateRuleSetApprovalEnabled()
      throws EcbBaseException {
    when(approvalsUtil.isCreateRuleSetApprovalEnabled()).thenReturn(Boolean.FALSE);

    ResponseEntity<PaginatedList<ApprovalsV2>> records = approvalsMockData();
    when(approvalsV2Client.findApprovalsV2(1, Integer.MAX_VALUE, null,
        "uniqueItemId==" + uniqueItemId + " and currentState==PENDING and changeType==RateUpdate"))
            .thenReturn(records);
    approvalsServiceImpl.getRateApprovalsStatus(uniqueItemId);
  }

  @Test
  public void shouldGetRateApprovalsStatusForIf() throws EcbBaseException {
    when(approvalsUtil.isCreateRuleSetApprovalEnabled()).thenReturn(Boolean.TRUE);
    when(approvalsUtil.isCreateRuleSetApprovalAllowMoreThanOne()).thenReturn(Boolean.TRUE);

    ResponseEntity<PaginatedList<ApprovalsV2>> records = approvalsMockData();
    when(approvalsV2Client.findApprovalsV2(1, Integer.MAX_VALUE, null, rateUpdateQuery))
        .thenReturn(records);
    approvalsServiceImpl.getRateApprovalsStatus(uniqueItemId);
  }

  @Test
  public void shouldGetRateApprovalsStatusForCatch() throws EcbBaseException {
    when(approvalsUtil.isCreateRuleSetApprovalEnabled()).thenReturn(Boolean.TRUE);

    EcbAuthorizationException ecbAuthorizationException = new EcbAuthorizationException();
    when(approvalsV2Client.findApprovalsV2(1, Integer.MAX_VALUE, null, rateUpdateQuery))
        .thenThrow(ecbAuthorizationException);
    approvalsServiceImpl.getRateApprovalsStatus(uniqueItemId);
  }

  @Test
  public void shouldOfferingViewChangeDetails() throws EcbBaseException {
    ViewChangeDetails viewChangeDetails = new ViewChangeDetails();
    List<ViewChangeDetails> viewChangeDetailsList = new ArrayList<>();
    viewChangeDetailsList.add(viewChangeDetails);
    ResponseEntity<Object> records1 =
        new ResponseEntity<Object>(viewChangeDetailsList, HttpStatus.OK);

    ResponseEntity<PaginatedList<AuditAggregator>> records2 =
        new ResponseEntity<PaginatedList<AuditAggregator>>(paginatedAuditAggregatorList,
            HttpStatus.OK);

    when(extendedApprovalsV2Client.viewChangeDetails(uniqueItemId)).thenReturn(records1);
    String[] sort = new String[1];
    sort[0] = PropertyConstants.CREATE_DATE + RsqlOperator.PIPE + RsqlOperator.DESC;
    when(auditAggregatorClient.findAuditAggregator(1, Integer.MAX_VALUE, sort,
        "entityId==1 and entityTypeId==10")).thenReturn(records2);

    approvalsServiceImpl.offeringViewChangeDetails(uniqueItemId);
  }

  @Test
  public void shouldRatesViewChangeDetails() throws EcbBaseException {
    LinkedHashMap<String, Object> viewChangeDetailsMap = new LinkedHashMap<>();
    List<LinkedHashMap<String, Object>> viewChangeDetailsList = new ArrayList<>();
    viewChangeDetailsList.add(viewChangeDetailsMap);
    ResponseEntity<Object> records1 =
        new ResponseEntity<Object>(viewChangeDetailsList, HttpStatus.OK);

    when(extendedApprovalsV2Client.viewChangeDetails(uniqueItemId)).thenReturn(records1);

    ResponseEntity<PaginatedList<AuditAggregator>> records2 =
        new ResponseEntity<PaginatedList<AuditAggregator>>(paginatedAuditAggregatorList,
            HttpStatus.OK);
    String[] sort = new String[1];
    sort[0] = PropertyConstants.CREATE_DATE + RsqlOperator.PIPE + RsqlOperator.DESC;

    when(auditAggregatorClient.findAuditAggregator(1, Integer.MAX_VALUE, sort,
        "entityId==1 and entityTypeId==10")).thenReturn(records2);

    RateSchedule rateSchedule = new RateSchedule();
    ResponseEntity<RateSchedule> records3 =
        new ResponseEntity<RateSchedule>(rateSchedule, HttpStatus.OK);

    when(rateScheduleClient.getRateSchedule(uniqueItemId)).thenReturn(records3);

    Pricelist priceList = new Pricelist();
    ResponseEntity<Pricelist> records4 = new ResponseEntity<Pricelist>(priceList, HttpStatus.OK);

    when(pricelistClient.getPricelist(rateSchedule.getPricelistId())).thenReturn(records4);
    approvalsServiceImpl.ratesViewChangeDetails(uniqueItemId, uniqueItemId);

  }

  // @Test
  public void shouldApproveApprovals() throws EcbBaseException {
    Approvals approval = new Approvals();
    approval.setApprovalId(1);
    approval.setCurrentState(ApprovalStatus.APPROVED.toString());
    List<Approvals> approvalsList = new ArrayList<>();
    approvalsList.add(approval);
    CompletableFuture<Boolean> future = new CompletableFuture<>();
    when(asyncCommonService.asyncManageApprovalStatus(approval)).thenReturn(future);
    approvalsServiceImpl.approveApprovals(approvalsList);
  }

  private ResponseEntity<PaginatedList<ApprovalsV2>> approvalsMockData() {
    PaginatedList<ApprovalsV2> pgList = new PaginatedList<>();
    List<ApprovalsV2> approvalsV2List = new ArrayList<>();
    ApprovalsV2 approvalsV2 = new ApprovalsV2();
    approvalsV2.setSubmitterName("admin");
    approvalsV2List.add(approvalsV2);
    pgList.setRecords(approvalsV2List);
    return new ResponseEntity<>(pgList, HttpStatus.OK);
  }
}
