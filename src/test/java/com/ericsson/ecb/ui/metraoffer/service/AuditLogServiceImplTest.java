package com.ericsson.ecb.ui.metraoffer.service;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;

import com.ericsson.ecb.base.client.AuditAggregatorClient;
import com.ericsson.ecb.base.model.AuditAggregator;
import com.ericsson.ecb.catalog.client.PricelistClient;
import com.ericsson.ecb.catalog.client.RateScheduleClient;
import com.ericsson.ecb.catalog.client.RuleSetClient;
import com.ericsson.ecb.catalog.model.Chunk;
import com.ericsson.ecb.catalog.model.Pricelist;
import com.ericsson.ecb.catalog.model.RateSchedule;
import com.ericsson.ecb.catalog.model.Rule;
import com.ericsson.ecb.catalog.model.RuleCondition;
import com.ericsson.ecb.catalog.model.RuleOperator;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.Pagination;
import com.ericsson.ecb.ui.metraoffer.model.Configdata.ConstraintSet;
import com.ericsson.ecb.ui.metraoffer.model.Configdata.ConstraintSet.Actions;
import com.ericsson.ecb.ui.metraoffer.model.Configdata.ConstraintSet.Constraint;
import com.ericsson.ecb.ui.metraoffer.model.Configdata.ConstraintSet.Actions.Action;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.AuditLogServiceImpl;
import com.ericsson.ecb.ui.metraoffer.utils.MoErrorMessagesUtil;

public class AuditLogServiceImplTest {

  @Mock
  private AuditAggregatorClient auditAggregatorClient;

  @Mock
  private HttpServletResponse httpServletResponse;

  @Mock
  private RateScheduleClient rateScheduleClient;

  @Mock
  private RuleSetClient ruleSetClient;

  @Mock
  private PricelistClient pricelistClient;

  @Mock
  private ParameterTableService parameterTableService;

  @Mock
  private MoErrorMessagesUtil moErrorMessagesUtil;

  @InjectMocks
  private AuditLogServiceImpl auditLogServiceImpl;

  private ResponseEntity<PaginatedList<AuditAggregator>> auditLogResponseEntity;

  private PaginatedList<AuditAggregator> auditLogPaginatedList;

  private ResponseEntity<PaginatedList<RateSchedule>> rateScheduleResponseEntity;

  private PaginatedList<RateSchedule> paginatedRateSchedule;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    auditLogPaginatedList = new PaginatedList<>();
    List<AuditAggregator> auditList = new ArrayList<>();
    AuditAggregator auditAggregator = new AuditAggregator();
    auditAggregator.setLoginName("Admin");
    auditAggregator.setSpace("System_user");
    auditAggregator.setEventId(1);
    auditList.add(auditAggregator);
    auditLogPaginatedList.setRecords(auditList);
    auditLogResponseEntity =
        new ResponseEntity<PaginatedList<AuditAggregator>>(auditLogPaginatedList, HttpStatus.OK);

    paginatedRateSchedule = new PaginatedList<>();
    List<RateSchedule> rateScheduleList = new ArrayList<>();
    RateSchedule rateSchedule = new RateSchedule();
    rateSchedule.setSchedId(1);
    rateScheduleList.add(rateSchedule);
    paginatedRateSchedule.setRecords(rateScheduleList);

    rateScheduleResponseEntity =
        new ResponseEntity<PaginatedList<RateSchedule>>(paginatedRateSchedule, HttpStatus.OK);

  }

  @Test
  public void shouldFindAuditSummary() throws Exception {
    PaginatedList<AuditAggregator> paginatedRateSchedule = new PaginatedList<>();
    ResponseEntity<PaginatedList<AuditAggregator>> auditLogResponseEntity =
        new ResponseEntity<PaginatedList<AuditAggregator>>(paginatedRateSchedule, HttpStatus.OK);

    when(auditAggregatorClient.findAuditAggregator(1, Integer.MAX_VALUE, null,
        AuditLogService.ENTITY_TYPE_CONDITION)).thenReturn(auditLogResponseEntity);
    auditLogServiceImpl.findAuditSummary(1, Integer.MAX_VALUE, null, null);
  }

  @Test
  public void shouldFindAuditSummaryForIf() throws Exception {
    when(auditAggregatorClient.findAuditAggregator(1, Integer.MAX_VALUE, null,
        AuditLogService.ENTITY_TYPE_CONDITION)).thenReturn(auditLogResponseEntity);
    auditLogServiceImpl.findAuditSummary(1, Integer.MAX_VALUE, null, null);
  }

  @Test
  public void shouldFindRatesAuditSummary() throws Exception {

    PaginatedList<RateSchedule> paginatedRateSchedule = new PaginatedList<>();

    ResponseEntity<PaginatedList<RateSchedule>> rateScheduleResponseEntity =
        new ResponseEntity<PaginatedList<RateSchedule>>(paginatedRateSchedule, HttpStatus.OK);

    when(rateScheduleClient.findRateSchedule(Pagination.DEFAULT_PAGE, Pagination.DEFAULT_MAX_SIZE,
        null, "ptId==1 and itemTemplateId==1 and pricelistId==1", null, null, null))
            .thenReturn(rateScheduleResponseEntity);

    when(auditAggregatorClient.findAuditAggregator(Pagination.DEFAULT_PAGE,
        Pagination.DEFAULT_MAX_SIZE, null,
        "entityId=in=(1) and " + AuditLogService.ENTITY_TYPE_CONDITION))
            .thenReturn(auditLogResponseEntity);
    auditLogServiceImpl.findRatesAuditSummary(1, 1, 1, Pagination.DEFAULT_PAGE,
        Pagination.DEFAULT_MAX_SIZE, null, null);
  }


  @Test
  public void shouldFindRatesAuditSummaryForIf() throws Exception {
    when(rateScheduleClient.findRateSchedule(Pagination.DEFAULT_PAGE, Pagination.DEFAULT_MAX_SIZE,
        null, "ptId==1 and itemTemplateId==1 and pricelistId==1", null, null, null))
            .thenReturn(rateScheduleResponseEntity);

    when(auditAggregatorClient.findAuditAggregator(1, Integer.MAX_VALUE, null,
        "entityId=in=(1) and " + AuditLogService.ENTITY_TYPE_CONDITION))
            .thenReturn(auditLogResponseEntity);
    auditLogServiceImpl.findRatesAuditSummary(1, 1, 1, 1, Integer.MAX_VALUE, null, null);
  }

  @Test
  public void shouldFindRateChanges() throws Exception {
    RateSchedule rateSchedule = new RateSchedule();
    rateSchedule.setPricelistId(1);
    rateSchedule.setPtId(1);
    ResponseEntity<RateSchedule> rateScheduleResponseEntity =
        new ResponseEntity<RateSchedule>(rateSchedule, HttpStatus.OK);
    when(rateScheduleClient.getRateSchedule(1)).thenReturn(rateScheduleResponseEntity);

    Pricelist pricelist = new Pricelist();
    ResponseEntity<Pricelist> pricelistResponseEntity =
        new ResponseEntity<Pricelist>(pricelist, HttpStatus.OK);
    when(pricelistClient.getPricelist(1)).thenReturn(pricelistResponseEntity);
    when(parameterTableService.getTableMetadata(1)).thenReturn(new ArrayList<>());
    auditLogServiceImpl.findRateChanges(1, true);
  }

  @Test(expected = EcbBaseException.class)
  public void shouldFindRateChangesForCatch() throws Exception {

    HttpClientErrorException httpClientErrorException =
        new HttpClientErrorException(HttpStatus.NOT_FOUND);
    when(rateScheduleClient.getRateSchedule(1)).thenThrow(httpClientErrorException);

    auditLogServiceImpl.findRateChanges(1, true);
  }

  @Test
  public void shouldDiffRuleSet() throws Exception {
    List<Chunk<Rule>> rulesDiff = new ArrayList<>();
    List<Rule> ruleList = new ArrayList<>();
    ruleList = getRules();

    Chunk<Rule> chunkRule = new Chunk<Rule>();
    chunkRule.setOriginalItems(ruleList);
    chunkRule.setRevisedItems(ruleList);
    rulesDiff.add(chunkRule);
    OffsetDateTime activeDate = OffsetDateTime.now();
    when(ruleSetClient.diffRuleSet(1, activeDate, true)).thenReturn(rulesDiff);
    auditLogServiceImpl.diffRuleSet(1, activeDate, 1, 20);
  }

  @Test(expected = EcbBaseException.class)
  public void shouldDiffRuleSetForCatch() throws Exception {
    OffsetDateTime activeDate = OffsetDateTime.now();
    HttpClientErrorException httpClientErrorException =
        new HttpClientErrorException(HttpStatus.NOT_FOUND);
    when(ruleSetClient.diffRuleSet(1, activeDate, true)).thenThrow(httpClientErrorException);
    auditLogServiceImpl.diffRuleSet(1, activeDate, 1, 20);
  }

  @Test
  public void shouldDiffRuleSetForElseif1() throws Exception {
    List<Chunk<Rule>> rulesDiff = new ArrayList<>();
    List<Rule> ruleList = new ArrayList<>();
    ruleList = getRules();

    Chunk<Rule> chunkRule = new Chunk<Rule>();
    chunkRule.setRevisedItems(ruleList);
    rulesDiff.add(chunkRule);
    OffsetDateTime activeDate = OffsetDateTime.now();
    when(ruleSetClient.diffRuleSet(1, activeDate, true)).thenReturn(rulesDiff);
    auditLogServiceImpl.diffRuleSet(1, activeDate, 1, 20);
  }

  @Test
  public void shouldDiffRuleSetForElseif2() throws Exception {
    List<Chunk<Rule>> rulesDiff = new ArrayList<>();
    List<Rule> ruleList = new ArrayList<>();
    ruleList = getRules();

    Chunk<Rule> chunkRule = new Chunk<Rule>();
    chunkRule.setOriginalItems(ruleList);
    rulesDiff.add(chunkRule);
    OffsetDateTime activeDate = OffsetDateTime.now();
    when(ruleSetClient.diffRuleSet(1, activeDate, true)).thenReturn(rulesDiff);
    auditLogServiceImpl.diffRuleSet(1, activeDate, 1, 20);
  }

  private List<Rule> getRules() {
    List<Rule> rules = new ArrayList<>();
    Rule rule = new Rule();
    Constraint constraint = new Constraint();
    constraint.setPropName("UnitValue");
    constraint.setCondition("EQUALS");
    constraint.setPropValue("20.0");

    RuleCondition ruleCondition = new RuleCondition();
    ruleCondition.setValue(constraint.getPropValue());
    ruleCondition.setOperator(RuleOperator.valueOf(constraint.getCondition()));
    rule.getConditions().put(constraint.getPropName(), ruleCondition);

    ConstraintSet constraintSet = new ConstraintSet();
    constraintSet.getConstraint().add(constraint);

    Action action = new Action();
    action.setPropName("UnitAmount");
    action.setPropValue("10.0");

    Actions actions = new Actions();
    actions.getAction().add(action);

    rule.getActions().put(action.getPropName(), action.getPropValue());
    rules.add(rule);
    return rules;
  }


  @Test
  public void shouldExportToCsvWithPositive() throws Exception {
    HttpServletResponse response = mock(HttpServletResponse.class);
    PaginatedList<RateSchedule> paginated = new PaginatedList<>();
    List<RateSchedule> rateScheduleList = new ArrayList<>();
    RateSchedule rateSchedule = new RateSchedule();
    rateScheduleList.add(rateSchedule);
    paginated.setRecords(rateScheduleList);
    ResponseEntity<PaginatedList<RateSchedule>> findRateScheduleRsp =
        new ResponseEntity<>(paginated, HttpStatus.OK);
    when(rateScheduleClient.findRateSchedule(1, Integer.MAX_VALUE, null,
        "ptId==1 and itemTemplateId==1 and pricelistId==1", null, null, null))
            .thenReturn(findRateScheduleRsp);

    when(auditAggregatorClient.findAuditAggregator(1, Integer.MAX_VALUE, null,
        "entityId=in=(null) and entityTypeId==2")).thenReturn(auditLogResponseEntity);

    ByteArrayOutputStream output = new ByteArrayOutputStream();
    PrintWriter printWriter = new PrintWriter(new OutputStreamWriter(output));
    when(response.getWriter()).thenReturn(printWriter);

    auditLogServiceImpl.exportToCsv(response, 1, 1, 1, 1, Integer.MAX_VALUE, null, null);
  }

  @Test
  public void shouldExportToCsvWithNegative() throws Exception {
    HttpServletResponse response = mock(HttpServletResponse.class);
    when(auditAggregatorClient.findAuditAggregator(1, Integer.MAX_VALUE, null, "entityTypeId==2"))
        .thenReturn(auditLogResponseEntity);
    ByteArrayOutputStream output = new ByteArrayOutputStream();
    PrintWriter printWriter = new PrintWriter(new OutputStreamWriter(output));
    when(response.getWriter()).thenReturn(printWriter);
    auditLogServiceImpl.exportToCsv(response, null, null, null, null, null, null, null);
  }

}
