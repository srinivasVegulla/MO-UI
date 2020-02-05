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

import com.ericsson.ecb.catalog.client.ExtendedRateScheduleClient;
import com.ericsson.ecb.catalog.client.ParameterTablePropertyClient;
import com.ericsson.ecb.catalog.client.PricelistClient;
import com.ericsson.ecb.catalog.client.PricelistMappingClient;
import com.ericsson.ecb.catalog.client.RateScheduleClient;
import com.ericsson.ecb.catalog.client.RuleSetClient;
import com.ericsson.ecb.catalog.client.UnitDependentRecurringChargeClient;
import com.ericsson.ecb.catalog.model.LocalizedRateSchedule;
import com.ericsson.ecb.catalog.model.ParameterTableProperty;
import com.ericsson.ecb.catalog.model.Pricelist;
import com.ericsson.ecb.catalog.model.PricelistMapping;
import com.ericsson.ecb.catalog.model.PricelistWithInUse;
import com.ericsson.ecb.catalog.model.RateSchedule;
import com.ericsson.ecb.catalog.model.Rule;
import com.ericsson.ecb.catalog.model.RuleCondition;
import com.ericsson.ecb.catalog.model.RuleOperator;
import com.ericsson.ecb.catalog.model.UnitDependentRecurringCharge;
import com.ericsson.ecb.catalog.model.instance.EffectiveDateMode;
import com.ericsson.ecb.catalog.model.instance.PricelistType;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.customer.client.SubscriptionClient;
import com.ericsson.ecb.customer.model.Subscription;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.Constants;
import com.ericsson.ecb.ui.metraoffer.constants.Pagination;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.Configdata.ConstraintSet.Constraint;
import com.ericsson.ecb.ui.metraoffer.model.ParameterTableMetadata;
import com.ericsson.ecb.ui.metraoffer.model.RateScheduleDto;
import com.ericsson.ecb.ui.metraoffer.model.RateScheduleSetDto;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.PricelistMappingServiceImpl;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.PricelistServiceImpl;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.RateScheduleServiceImpl;

public class RateScheduleServiceImplTest {

  @Mock
  private SubscriptionClient subscriptionClient;

  @Mock
  private RateScheduleClient rateScheduleClient;

  @Mock
  private ParameterTablePropertyClient parameterTablePropertyClient;

  @Mock
  private PricelistClient pricelistClient;

  @Mock
  private RuleSetClient ruleSetClient;

  @Mock
  private ExtendedRateScheduleClient extendedRateScheduleClient;

  @Mock
  private LocalizedEntityService localizedEntity;

  @Mock
  private PricelistMappingClient pricelistMappingClient;

  @InjectMocks
  private RateScheduleServiceImpl rateScheduleServiceImpl;

  @Mock
  private PricelistMappingServiceImpl pricelistMappingServiceImpl;

  @Mock
  private PricelistServiceImpl pricelistServiceImpl;

  private ResponseEntity<PaginatedList<Subscription>> subscriptionList;

  private ResponseEntity<PaginatedList<RateSchedule>> rateSchedulePaginatedList;

  @Mock
  private UnitDependentRecurringChargeClient unitDependentRecurringChargeClient;

  @Mock
  private RuleSetService ruleSetService;

  @Mock
  private ParameterTableService parameterTableService;
  private Integer offerId = 1;
  private Integer piInstanceId = 2;
  private Integer paramTableId = 3;
  private Integer itemTemplateId = 4;
  private Integer pricelistId = 5;
  private Integer scheduleId = 3;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
  }

  // @Test
  public void shouldGetParamaterTableIdByInstanceId() throws Exception {
    PaginatedList<PricelistMapping> pricelistMapping = new PaginatedList<PricelistMapping>();
    ResponseEntity<PaginatedList<PricelistMapping>> value =
        new ResponseEntity<PaginatedList<PricelistMapping>>(pricelistMapping, HttpStatus.OK);

    when(subscriptionClient.findSubscription(Pagination.DEFAULT_PAGE, Pagination.DEFAULT_MAX_SIZE,
        null, PropertyRsqlConstants.OFFER_ID_EQUAL + 2)).thenReturn(subscriptionList);

    String[] query = {PropertyRsqlConstants.OFFER_ID_EQUAL + 1 + RsqlOperator.AND
        + PropertyRsqlConstants.ITEM_INSTANCE_ID_EQUAL + 1 + RsqlOperator.AND
        + PropertyRsqlConstants.PARAM_TABLE_ID_EQUAL + 3};

    when(pricelistMappingClient.findPricelistMapping(Pagination.DEFAULT_PAGE,
        Pagination.DEFAULT_MAX_SIZE, query, null, null, null, null)).thenReturn(value);
    rateScheduleServiceImpl.getRates(offerId, piInstanceId, false);
  }

  // @Test
  public void shouldGetRateSchedulesByParamTableId() throws Exception {
    when(rateScheduleClient.findRateSchedule(Pagination.DEFAULT_PAGE, Pagination.DEFAULT_MAX_SIZE,
        null, PropertyRsqlConstants.PT_ID_EQUAL + 3, null, null, null))
            .thenReturn(rateSchedulePaginatedList);
    rateScheduleServiceImpl.getRateSchedules(paramTableId, itemTemplateId, pricelistId, 1, 10000,
        null);
  }

  @Test
  public void shouldRemoveSchedule() throws Exception {
    when(extendedRateScheduleClient.deleteRateSchedule(scheduleId))
        .thenReturn(new ResponseEntity<Boolean>(HttpStatus.OK));
    rateScheduleServiceImpl.removeRateSchedule(scheduleId);
  }

  @Test
  public void shouldUpdateRateSchedule() throws Exception {
    RateSchedule rateSchedule = new RateSchedule();
    RateSchedule rateSchedule1 = new RateSchedule();
    rateSchedule.setName("Update Dummy");
    rateSchedule.setSchedId(scheduleId);
    ResponseEntity<RateSchedule> rateScheduleRsp =
        new ResponseEntity<RateSchedule>(rateSchedule, HttpStatus.OK);
    when(rateScheduleClient.updateRateSchedule(rateSchedule, scheduleId))
        .thenReturn(rateScheduleRsp);
    rateSchedule1 = rateScheduleRsp.getBody();
    when(localizedEntity.localizedUpdateEntity(rateSchedule1)).thenReturn(rateSchedule1);
    rateScheduleServiceImpl.updateRateSchedule(rateSchedule);
  }

  @Test
  public void shouldCreateRateSchedule() throws Exception {
    LocalizedRateSchedule rateSchedule = new LocalizedRateSchedule();
    rateSchedule.setName("Create Dummy");
    ResponseEntity<RateSchedule> rateScheduleRsp =
        new ResponseEntity<RateSchedule>(rateSchedule, HttpStatus.OK);
    when(extendedRateScheduleClient.createRateSchedule(rateSchedule, null))
        .thenReturn(rateScheduleRsp);
    when(localizedEntity.localizedCreateEntity(rateSchedule)).thenReturn(rateSchedule);
    rateScheduleServiceImpl.createRateSchedule(rateSchedule);
  }

  @Test
  public void shouldEditRateScheduleSet() throws Exception {
    RateScheduleSetDto rateScheduleSetDto = new RateScheduleSetDto();
    List<LocalizedRateSchedule> listCreateSet = new ArrayList<>();
    LocalizedRateSchedule createSet = new LocalizedRateSchedule();
    createSet.setName("new Schedule");
    listCreateSet.add(createSet);
    rateScheduleSetDto.setCreateSet(listCreateSet);

    ResponseEntity<RateSchedule> rateScheduleRsp =
        new ResponseEntity<RateSchedule>(createSet, HttpStatus.OK);
    when(extendedRateScheduleClient.createRateSchedule(createSet, null))
        .thenReturn(rateScheduleRsp);
    when(localizedEntity.localizedCreateEntity(createSet)).thenReturn(createSet);

    List<RateSchedule> listUpdateSet = new ArrayList<RateSchedule>();
    RateSchedule updateSet = new RateSchedule();
    updateSet.setSchedId(11);
    updateSet.setName("update Schedule");
    listUpdateSet.add(createSet);
    rateScheduleSetDto.setUpdateSet(listUpdateSet);

    Set<Integer> deleteIds = new HashSet<>();
    deleteIds.add(1);
    rateScheduleSetDto.getDeleteIds().addAll(deleteIds);

    List<RateScheduleDto> listcopyset = new ArrayList<RateScheduleDto>();
    RateScheduleDto copySet = new RateScheduleDto();
    copySet.setCopyScheduleId(11);
    copySet.setSchedId(66);
    copySet.setName("copy Schedule");
    listcopyset.add(copySet);
    rateScheduleSetDto.setCopySet(listcopyset);

    LocalizedRateSchedule localizedCpySet = new LocalizedRateSchedule();
    BeanUtils.copyProperties(copySet, localizedCpySet);

    ResponseEntity<RateSchedule> rateScheduleRsp1 =
        new ResponseEntity<RateSchedule>(localizedCpySet, HttpStatus.OK);
    when(
        extendedRateScheduleClient.createRateSchedule(localizedCpySet, copySet.getCopyScheduleId()))
            .thenReturn(rateScheduleRsp1);
    when(localizedEntity.localizedCreateEntity(localizedCpySet)).thenReturn(localizedCpySet);

    PaginatedList<Rule> pgListRules = new PaginatedList<>();
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

    rules.add(rule);
    pgListRules.setRecords(rules);
    when(ruleSetService.findRulesInSchedule(copySet.getCopyScheduleId(), null, null, null, null))
        .thenReturn(pgListRules);
    when(ruleSetClient.createRuleSet(copySet.getSchedId(), rules));

    rateScheduleServiceImpl.editRateScheduleSet(rateScheduleSetDto);
  }



  @Test
  public void shouldEditRateScheduleSetForUpdateTryBlock() throws Exception {
    RateScheduleSetDto rateScheduleSetDto = new RateScheduleSetDto();
    List<LocalizedRateSchedule> listCreateSet = new ArrayList<>();
    LocalizedRateSchedule createSet = new LocalizedRateSchedule();
    createSet.setName("new Schedule");
    createSet.setSchedId(scheduleId);
    listCreateSet.add(createSet);
    rateScheduleSetDto.setCreateSet(listCreateSet);

    List<RateSchedule> listUpdateSet = new ArrayList<RateSchedule>();
    RateSchedule rateSchedule = new RateSchedule();
    rateSchedule.setName("Update Dummy");
    rateSchedule.setSchedId(scheduleId);
    listUpdateSet.add(rateSchedule);
    ResponseEntity<RateSchedule> rateScheduleRsp =
        new ResponseEntity<RateSchedule>(rateSchedule, HttpStatus.OK);
    when(rateScheduleClient.updateRateSchedule(rateSchedule, scheduleId))
        .thenReturn(rateScheduleRsp);

    PaginatedList<Rule> paginatedRule = new PaginatedList<>();
    List<Rule> ruleList = new ArrayList<>();
    Rule rule = new Rule();
    rule.setScheduleId(scheduleId);
    ruleList.add(rule);
    paginatedRule.setRecords(ruleList);
    when(ruleSetService.findRulesInSchedule(scheduleId, Pagination.DEFAULT_PAGE,
        Pagination.DEFAULT_MAX_SIZE, null, null)).thenReturn(paginatedRule);
    rateScheduleSetDto.setUpdateSet(listUpdateSet);

    Set<Integer> deleteIds = new HashSet<>();
    deleteIds.add(1);
    rateScheduleSetDto.getDeleteIds().addAll(deleteIds);

    List<RateScheduleDto> listcopyset = new ArrayList<RateScheduleDto>();
    RateScheduleDto copySet = new RateScheduleDto();
    copySet.setSchedId(11);
    copySet.setName("copy Schedule");
    listcopyset.add(copySet);
    rateScheduleSetDto.setCopySet(listcopyset);

    rateScheduleServiceImpl.editRateScheduleSet(rateScheduleSetDto);
  }

  @Test
  public void shouldGetParameterTableRateSchedules() throws Exception {
    PaginatedList<RateSchedule> paginatedRateSchedule = new PaginatedList<>();
    ResponseEntity<PaginatedList<RateSchedule>> responseEntity =
        new ResponseEntity<PaginatedList<RateSchedule>>(paginatedRateSchedule, HttpStatus.OK);
    List<RateSchedule> rateSchedules = new ArrayList<>();
    RateSchedule rateSchedule = new RateSchedule();
    rateSchedule.setPtId(50);
    rateSchedule.setSchedId(10);
    rateSchedule.setPricelistId(20);

    rateSchedules.add(rateSchedule);
    RateSchedule rateSchedule2 = new RateSchedule();
    rateSchedule2.setPtId(50);
    rateSchedule2.setSchedId(20);
    rateSchedule2.setPricelistId(30);

    rateSchedules.add(rateSchedule2);
    paginatedRateSchedule.setRecords(rateSchedules);

    when(rateScheduleClient.findRateSchedule(1, Integer.MAX_VALUE, null,
        PropertyRsqlConstants.PT_ID_EQUAL + 50 + RsqlOperator.AND
            + PropertyRsqlConstants.SCHED_ID_NOT_EQUAL + 1,
        null, null, null)).thenReturn(responseEntity);

    PaginatedList<Pricelist> paginatedPricelist = new PaginatedList<>();
    ResponseEntity<PaginatedList<Pricelist>> pricelistResponseEntity =
        new ResponseEntity<PaginatedList<Pricelist>>(paginatedPricelist, HttpStatus.OK);
    List<Pricelist> pricelistRecords = new ArrayList<>();
    Pricelist pricelist = new Pricelist();
    pricelist.setPricelistId(20);
    pricelist.setName("Sample 1");
    pricelist.setType(PricelistType.PO);
    pricelistRecords.add(pricelist);

    Pricelist pricelist1 = new Pricelist();
    pricelist1.setPricelistId(30);
    pricelist1.setName("Sample 2");
    pricelist1.setType(PricelistType.REGULAR);
    pricelistRecords.add(pricelist1);
    paginatedPricelist.setRecords(pricelistRecords);
    when(pricelistClient.findPricelist(1, Integer.MAX_VALUE, null,
        "pricelistId" + RsqlOperator.IN + "(20,30)", null, null, null))
            .thenReturn(pricelistResponseEntity);

    PaginatedList<Rule> paginatedRule = new PaginatedList<>();
    List<Rule> ruleList = new ArrayList<>();
    Rule rule = new Rule();
    rule.setScheduleId(10);
    ruleList.add(rule);
    paginatedRule.setRecords(ruleList);

    String query = PropertyRsqlConstants.SCHEDULE_ID_IN + "(10,20)" + RsqlOperator.AND
        + PropertyRsqlConstants.IN_ACTIVE_DATE_EQUAL + Constants.MAX_DATE;
    when(ruleSetClient.findRules("t_pt_rateconn", 1, Integer.MAX_VALUE, null, query))
        .thenReturn(paginatedRule);
    rateScheduleServiceImpl.getParameterTableRateSchedules(50, 1, "metratech.com/rateconn", 1,
        Integer.MAX_VALUE, null, null, null, null, null);
  }

  @Test
  public void shouldGetParameterTableRateSchedulesForIf() throws Exception {
    PaginatedList<RateSchedule> paginatedRateSchedule = new PaginatedList<>();
    ResponseEntity<PaginatedList<RateSchedule>> responseEntity =
        new ResponseEntity<PaginatedList<RateSchedule>>(paginatedRateSchedule, HttpStatus.OK);
    List<RateSchedule> rateSchedules = new ArrayList<>();
    RateSchedule rateSchedule = new RateSchedule();
    rateSchedule.setPtId(50);
    rateSchedule.setSchedId(10);
    rateSchedule.setPricelistId(20);

    rateSchedule.setPropId(15);
    rateSchedules.add(rateSchedule);
    RateSchedule rateSchedule2 = new RateSchedule();
    rateSchedule2.setPtId(50);
    rateSchedule2.setSchedId(20);
    rateSchedule2.setPricelistId(30);

    rateSchedule2.setPropId(15);
    rateSchedules.add(rateSchedule2);
    paginatedRateSchedule.setRecords(rateSchedules);

    when(rateScheduleClient.findRateSchedule(1, Integer.MAX_VALUE, null,
        "propId==15" + RsqlOperator.AND + PropertyRsqlConstants.PT_ID_EQUAL + 50 + RsqlOperator.AND
            + PropertyRsqlConstants.SCHED_ID_NOT_EQUAL + 1,
        null, null, null)).thenReturn(responseEntity);

    PaginatedList<Pricelist> paginatedPricelist = new PaginatedList<>();
    ResponseEntity<PaginatedList<Pricelist>> pricelistResponseEntity =
        new ResponseEntity<PaginatedList<Pricelist>>(paginatedPricelist, HttpStatus.OK);
    List<Pricelist> pricelistRecords = new ArrayList<>();
    Pricelist pricelist = new Pricelist();
    pricelist.setPricelistId(20);
    pricelist.setName("Sample 1");
    pricelist.setType(PricelistType.PO);
    pricelistRecords.add(pricelist);

    Pricelist pricelist1 = new Pricelist();
    pricelist1.setPricelistId(30);
    pricelist1.setName("Sample 2");
    pricelist1.setType(PricelistType.REGULAR);
    pricelistRecords.add(pricelist1);
    paginatedPricelist.setRecords(pricelistRecords);
    when(pricelistClient.findPricelist(1, Integer.MAX_VALUE, null,
        "pricelistId" + RsqlOperator.IN + "(20,30)", null, null, null))
            .thenReturn(pricelistResponseEntity);

    PaginatedList<Rule> paginatedRule = new PaginatedList<>();
    List<Rule> ruleList = new ArrayList<>();
    Rule rule = new Rule();
    rule.setScheduleId(10);
    ruleList.add(rule);
    paginatedRule.setRecords(ruleList);

    String query = PropertyRsqlConstants.SCHEDULE_ID_IN + "(10,20)" + RsqlOperator.AND
        + PropertyRsqlConstants.IN_ACTIVE_DATE_EQUAL + Constants.MAX_DATE;
    when(ruleSetClient.findRules("t_pt_rateconn", 1, Integer.MAX_VALUE, null, query))
        .thenReturn(paginatedRule);
    rateScheduleServiceImpl.getParameterTableRateSchedules(50, 1, "metratech.com/rateconn", 1,
        Integer.MAX_VALUE, null, "propId==15", null, null, null);
  }

  @Test
  public void shouldGetRates() throws EcbBaseException {
    Collection<PricelistMapping> value = new ArrayList<>();
    PricelistMapping pricelistMapping = new PricelistMapping();
    pricelistMapping.setPricelistId(1);
    pricelistMapping.setParamtableId(1);

    pricelistMapping.setItemInstanceId(2);
    pricelistMapping.setParamtableName(Constants.UDRC_TIERED);

    pricelistMapping.setItemTemplateKind(PropertyKind.UNIT_DEPENDENT_RECURRING);
    value.add(pricelistMapping);
    when(pricelistMappingServiceImpl.findPricelistMapping(null,
        PropertyRsqlConstants.OFFER_ID_EQUAL + 1 + RsqlOperator.AND
            + PropertyRsqlConstants.ITEM_INSTANCE_ID_EQUAL + 2 + RsqlOperator.AND
            + PropertyRsqlConstants.PARAM_TABLE_ID_NULL_FALSE)).thenReturn(value);
    Collection<Integer> pricelistIds = new ArrayList<>();
    pricelistIds.add(1);
    PricelistWithInUse pricelistWithInUse = new PricelistWithInUse();
    List<PricelistWithInUse> pricelistWithInUseList = new ArrayList<>();
    pricelistWithInUse.setPricelistId(2);
    pricelistWithInUse.setType(PricelistType.PO);
    pricelistWithInUseList.add(pricelistWithInUse);
    PaginatedList<PricelistWithInUse> value2 = new PaginatedList<>();
    value2.setRecords(pricelistWithInUseList);
    when(pricelistServiceImpl.findAllPricelist(1, Integer.MAX_VALUE, null,
        PropertyRsqlConstants.PRICELIST_ID_IN + "(1)", null, null, null)).thenReturn(value2);
    PaginatedList<RateSchedule> paginated = new PaginatedList<>();
    RateSchedule rateSchedule = new RateSchedule();
    rateSchedule.setPricelistId(1);
    List<RateSchedule> rateScheduleList = new ArrayList<>();
    rateScheduleList.add(rateSchedule);
    paginated.setRecords(rateScheduleList);
    ResponseEntity<PaginatedList<RateSchedule>> rateScheduleRsp =
        new ResponseEntity<>(paginated, HttpStatus.OK);
    String[] sortArray = new String[1];
    sortArray[0] = "startDate|desc";
    when(rateScheduleClient.findRateSchedule(1, Integer.MAX_VALUE, sortArray,
        PropertyRsqlConstants.PT_ID_EQUAL + 1 + RsqlOperator.AND
            + PropertyRsqlConstants.ITEM_TEMPLATE_ID_EQUAL + "null" + RsqlOperator.AND
            + PropertyRsqlConstants.PRICELIST_ID_EQUAL + 1,
        null, null, null)).thenReturn(rateScheduleRsp);

    PaginatedList<ParameterTableProperty> paginatedParam = new PaginatedList<>();
    ParameterTableProperty parameterTableProperty = new ParameterTableProperty();
    parameterTableProperty.setColumnName("_op");
    parameterTableProperty.setParamTableId(1);
    parameterTableProperty.setEnumName("enumName");
    List<ParameterTableProperty> parameterTablePropertyList = new ArrayList<>();
    parameterTablePropertyList.add(parameterTableProperty);
    paginatedParam.setRecords(parameterTablePropertyList);


    PaginatedList<UnitDependentRecurringCharge> paginatedUdrc = new PaginatedList<>();
    List<UnitDependentRecurringCharge> UnitDependentRecurringChargeList = new ArrayList<>();
    UnitDependentRecurringCharge unitDependentRecurringCharge = new UnitDependentRecurringCharge();
    unitDependentRecurringCharge.setKind(PropertyKind.UNIT_DEPENDENT_RECURRING);
    unitDependentRecurringCharge.setRatingType(0);
    unitDependentRecurringCharge.setPropId(1);
    UnitDependentRecurringChargeList.add(unitDependentRecurringCharge);
    paginatedUdrc.setRecords(UnitDependentRecurringChargeList);
    ResponseEntity<PaginatedList<UnitDependentRecurringCharge>> unitDependentRecurringChargeRsp =
        new ResponseEntity<>(paginatedUdrc, HttpStatus.OK);
    when(unitDependentRecurringChargeClient.findUnitDependentRecurringCharge(1, Integer.MAX_VALUE,
        null, PropertyRsqlConstants.PROP_ID_EQUAL + 2)).thenReturn(unitDependentRecurringChargeRsp);

    List<ParameterTableMetadata> properties = new ArrayList<>();
    when(parameterTableService.getTableMetadataWithDn(1)).thenReturn(properties);

    rateScheduleServiceImpl.getRates(offerId, piInstanceId, false);
  }

  @Test
  public void shouldGetRatesForRatingType() throws EcbBaseException {
    Collection<PricelistMapping> value = new ArrayList<>();
    PricelistMapping pricelistMapping = new PricelistMapping();
    pricelistMapping.setPricelistId(1);
    pricelistMapping.setParamtableId(1);

    pricelistMapping.setItemInstanceId(2);
    pricelistMapping.setParamtableName(Constants.UDRC_TIERED);

    pricelistMapping.setItemTemplateKind(PropertyKind.UNIT_DEPENDENT_RECURRING);
    value.add(pricelistMapping);
    when(pricelistMappingServiceImpl.findPricelistMapping(null,
        PropertyRsqlConstants.OFFER_ID_EQUAL + 1 + RsqlOperator.AND
            + PropertyRsqlConstants.ITEM_INSTANCE_ID_EQUAL + 2 + RsqlOperator.AND
            + PropertyRsqlConstants.PARAM_TABLE_ID_NULL_FALSE)).thenReturn(value);
    Collection<Integer> pricelistIds = new ArrayList<>();
    pricelistIds.add(1);
    PricelistWithInUse pricelistWithInUse = new PricelistWithInUse();
    List<PricelistWithInUse> pricelistWithInUseList = new ArrayList<>();
    pricelistWithInUse.setPricelistId(2);
    pricelistWithInUse.setType(PricelistType.PO);
    pricelistWithInUseList.add(pricelistWithInUse);
    PaginatedList<PricelistWithInUse> value2 = new PaginatedList<>();
    value2.setRecords(pricelistWithInUseList);
    when(pricelistServiceImpl.findAllPricelist(1, Integer.MAX_VALUE, null,
        PropertyRsqlConstants.PRICELIST_ID_IN + "(1)", null, null, null)).thenReturn(value2);
    PaginatedList<RateSchedule> paginated = new PaginatedList<>();
    RateSchedule rateSchedule = new RateSchedule();
    rateSchedule.setPricelistId(1);
    List<RateSchedule> rateScheduleList = new ArrayList<>();
    rateScheduleList.add(rateSchedule);
    paginated.setRecords(rateScheduleList);
    ResponseEntity<PaginatedList<RateSchedule>> rateScheduleRsp =
        new ResponseEntity<>(paginated, HttpStatus.OK);
    String[] sortArray = new String[1];
    sortArray[0] = "startDate|desc";
    when(rateScheduleClient.findRateSchedule(1, Integer.MAX_VALUE, sortArray,
        PropertyRsqlConstants.PT_ID_EQUAL + 1 + RsqlOperator.AND
            + PropertyRsqlConstants.ITEM_TEMPLATE_ID_EQUAL + "null" + RsqlOperator.AND
            + PropertyRsqlConstants.PRICELIST_ID_EQUAL + 1,
        null, null, null)).thenReturn(rateScheduleRsp);

    PaginatedList<ParameterTableProperty> paginatedParam = new PaginatedList<>();
    ParameterTableProperty parameterTableProperty = new ParameterTableProperty();
    parameterTableProperty.setColumnName("_op");
    parameterTableProperty.setParamTableId(1);
    parameterTableProperty.setEnumName("enumName");
    List<ParameterTableProperty> parameterTablePropertyList = new ArrayList<>();
    parameterTablePropertyList.add(parameterTableProperty);
    paginatedParam.setRecords(parameterTablePropertyList);


    PaginatedList<UnitDependentRecurringCharge> paginated1 = new PaginatedList<>();
    List<UnitDependentRecurringCharge> UnitDependentRecurringChargeList = new ArrayList<>();
    UnitDependentRecurringCharge unitDependentRecurringCharge = new UnitDependentRecurringCharge();
    unitDependentRecurringCharge.setKind(PropertyKind.UNIT_DEPENDENT_RECURRING);
    unitDependentRecurringCharge.setRatingType(1);
    unitDependentRecurringCharge.setPropId(1);
    UnitDependentRecurringChargeList.add(unitDependentRecurringCharge);
    paginated1.setRecords(UnitDependentRecurringChargeList);
    ResponseEntity<PaginatedList<UnitDependentRecurringCharge>> unitDependentRecurringChargeRsp =
        new ResponseEntity<>(paginated1, HttpStatus.OK);
    when(unitDependentRecurringChargeClient.findUnitDependentRecurringCharge(1, Integer.MAX_VALUE,
        null, PropertyRsqlConstants.PROP_ID_EQUAL + 2)).thenReturn(unitDependentRecurringChargeRsp);

    List<ParameterTableMetadata> properties = new ArrayList<>();
    when(parameterTableService.getTableMetadataWithDn(1)).thenReturn(properties);

    rateScheduleServiceImpl.getRates(offerId, piInstanceId, false);
  }

  @Test
  public void shouldGetRatesForElse() throws EcbBaseException {
    Collection<PricelistMapping> value = new ArrayList<>();
    PricelistMapping pricelistMapping = new PricelistMapping();
    pricelistMapping.setPricelistId(1);
    pricelistMapping.setParamtableId(1);

    /*
     * pricelistMapping.setItemInstanceId(2);
     * pricelistMapping.setParamtableName(Constants.UDRC_TIERED);
     * 
     * pricelistMapping.setItemTemplateKind(PropertyKind.UNIT_DEPENDENT_RECURRING);
     */
    value.add(pricelistMapping);
    when(pricelistMappingServiceImpl.findPricelistMapping(null,
        PropertyRsqlConstants.OFFER_ID_EQUAL + 1 + RsqlOperator.AND
            + PropertyRsqlConstants.ITEM_INSTANCE_ID_EQUAL + 2 + RsqlOperator.AND
            + PropertyRsqlConstants.PARAM_TABLE_ID_NULL_FALSE)).thenReturn(value);
    Collection<Integer> pricelistIds = new ArrayList<>();
    pricelistIds.add(1);
    PricelistWithInUse pricelistWithInUse = new PricelistWithInUse();
    List<PricelistWithInUse> pricelistWithInUseList = new ArrayList<>();
    pricelistWithInUse.setPricelistId(2);
    pricelistWithInUse.setType(PricelistType.PO);
    pricelistWithInUseList.add(pricelistWithInUse);
    PaginatedList<PricelistWithInUse> value2 = new PaginatedList<>();
    value2.setRecords(pricelistWithInUseList);
    when(pricelistServiceImpl.findAllPricelist(1, Integer.MAX_VALUE, null,
        PropertyRsqlConstants.PRICELIST_ID_IN + "(1)", null, null, null)).thenReturn(value2);
    PaginatedList<RateSchedule> paginated = new PaginatedList<>();
    RateSchedule rateSchedule = new RateSchedule();
    rateSchedule.setPricelistId(1);
    List<RateSchedule> rateScheduleList = new ArrayList<>();
    rateScheduleList.add(rateSchedule);
    paginated.setRecords(rateScheduleList);
    ResponseEntity<PaginatedList<RateSchedule>> rateScheduleRsp =
        new ResponseEntity<>(paginated, HttpStatus.OK);
    String[] sortArray = new String[1];
    sortArray[0] = "startDate|desc";
    when(rateScheduleClient.findRateSchedule(1, Integer.MAX_VALUE, sortArray,
        PropertyRsqlConstants.PT_ID_EQUAL + 1 + RsqlOperator.AND
            + PropertyRsqlConstants.ITEM_TEMPLATE_ID_EQUAL + "null" + RsqlOperator.AND
            + PropertyRsqlConstants.PRICELIST_ID_EQUAL + 1,
        null, null, null)).thenReturn(rateScheduleRsp);

    PaginatedList<ParameterTableProperty> paginatedParam = new PaginatedList<>();
    ParameterTableProperty parameterTableProperty = new ParameterTableProperty();
    parameterTableProperty.setColumnName("_op");
    parameterTableProperty.setParamTableId(1);
    parameterTableProperty.setEnumName("enumName");
    List<ParameterTableProperty> parameterTablePropertyList = new ArrayList<>();
    parameterTablePropertyList.add(parameterTableProperty);
    paginatedParam.setRecords(parameterTablePropertyList);


    PaginatedList<UnitDependentRecurringCharge> paginated1 = new PaginatedList<>();
    List<UnitDependentRecurringCharge> UnitDependentRecurringChargeList = new ArrayList<>();
    UnitDependentRecurringCharge unitDependentRecurringCharge = new UnitDependentRecurringCharge();
    unitDependentRecurringCharge.setKind(PropertyKind.UNIT_DEPENDENT_RECURRING);
    unitDependentRecurringCharge.setRatingType(1);
    unitDependentRecurringCharge.setPropId(1);
    UnitDependentRecurringChargeList.add(unitDependentRecurringCharge);
    paginated1.setRecords(UnitDependentRecurringChargeList);
    ResponseEntity<PaginatedList<UnitDependentRecurringCharge>> unitDependentRecurringChargeRsp =
        new ResponseEntity<>(paginated1, HttpStatus.OK);
    when(unitDependentRecurringChargeClient.findUnitDependentRecurringCharge(1, Integer.MAX_VALUE,
        null, PropertyRsqlConstants.PROP_ID_EQUAL + 2)).thenReturn(unitDependentRecurringChargeRsp);


    List<ParameterTableMetadata> properties = new ArrayList<>();
    when(parameterTableService.getTableMetadataWithDn(1)).thenReturn(properties);

    rateScheduleServiceImpl.getRates(offerId, piInstanceId, false);
  }

  @Test
  public void shouldFindRateSchedule() throws EcbBaseException {
    PaginatedList<RateSchedule> paginated = new PaginatedList<>();
    RateSchedule rateSchedule = new RateSchedule();
    List<RateSchedule> rateScheduleList = new ArrayList<>();
    rateScheduleList.add(rateSchedule);
    paginated.setRecords(rateScheduleList);
    ResponseEntity<PaginatedList<RateSchedule>> value =
        new ResponseEntity<>(paginated, HttpStatus.OK);
    when(rateScheduleClient.findRateSchedule(1, 1, null, "", null, null, null)).thenReturn(value);
    rateScheduleServiceImpl.findRateSchedule(1, 1, null, "");
  }

  @Test
  public void shouldGetRateSchedules() throws EcbBaseException {
    String[] sortArray = new String[1];
    sortArray[0] = "startDate|desc";
    PaginatedList<RateSchedule> paginated = new PaginatedList<>();
    RateSchedule rateSchedule = new RateSchedule();
    List<RateSchedule> rateScheduleList = new ArrayList<>();
    rateScheduleList.add(rateSchedule);
    paginated.setRecords(rateScheduleList);
    ResponseEntity<PaginatedList<RateSchedule>> value =
        new ResponseEntity<>(paginated, HttpStatus.OK);
    when(rateScheduleClient.findRateSchedule(1, 1, sortArray,
        PropertyRsqlConstants.PT_ID_EQUAL + 3 + RsqlOperator.AND
            + PropertyRsqlConstants.ITEM_TEMPLATE_ID_EQUAL + 4 + RsqlOperator.AND
            + PropertyRsqlConstants.PRICELIST_ID_EQUAL + 5,
        null, null, null)).thenReturn(value);

    List<ParameterTableMetadata> parameterTableMetadata = new ArrayList<>();
    when(parameterTableService.getTableMetadataWithDn(3)).thenReturn(parameterTableMetadata);
    rateScheduleServiceImpl.getRateSchedules(paramTableId, itemTemplateId, pricelistId, 1, 1, null);
  }

  @Test
  public void shouldGetRatesGetRateSchedulesByParamTableIdForElse() throws EcbBaseException {
    Collection<PricelistMapping> value = new ArrayList<>();
    PricelistMapping pricelistMapping = new PricelistMapping();
    pricelistMapping.setPricelistId(1);
    pricelistMapping.setParamtableId(1);
    pricelistMapping.setItemInstanceId(2);
    pricelistMapping.setParamtableName(Constants.UDRC_TIERED);

    value.add(pricelistMapping);
    when(pricelistMappingServiceImpl.findPricelistMapping(null,
        PropertyRsqlConstants.OFFER_ID_EQUAL + 1 + RsqlOperator.AND
            + PropertyRsqlConstants.ITEM_INSTANCE_ID_EQUAL + 2 + RsqlOperator.AND
            + PropertyRsqlConstants.PARAM_TABLE_ID_NULL_FALSE)).thenReturn(value);

    Collection<Integer> pricelistIds = new ArrayList<>();
    pricelistIds.add(1);
    PricelistWithInUse pricelistWithInUse = new PricelistWithInUse();
    List<PricelistWithInUse> pricelistWithInUseList = new ArrayList<>();
    pricelistWithInUse.setPricelistId(2);
    pricelistWithInUse.setType(PricelistType.PO);
    pricelistWithInUseList.add(pricelistWithInUse);
    PaginatedList<PricelistWithInUse> value2 = new PaginatedList<>();
    value2.setRecords(pricelistWithInUseList);
    when(pricelistServiceImpl.findAllPricelist(1, Integer.MAX_VALUE, null,
        PropertyRsqlConstants.PRICELIST_ID_IN + "(1)", null, null, null)).thenReturn(value2);

    PaginatedList<RateSchedule> paginated = new PaginatedList<>();
    ResponseEntity<PaginatedList<RateSchedule>> rateScheduleRsp =
        new ResponseEntity<>(paginated, HttpStatus.OK);
    String[] sortArray = new String[1];
    sortArray[0] = "startDate|desc";
    when(rateScheduleClient.findRateSchedule(1, Integer.MAX_VALUE, sortArray,
        PropertyRsqlConstants.PT_ID_EQUAL + 1 + RsqlOperator.AND
            + PropertyRsqlConstants.ITEM_TEMPLATE_ID_EQUAL + "null" + RsqlOperator.AND
            + PropertyRsqlConstants.PRICELIST_ID_EQUAL + 1,
        null, null, null)).thenReturn(rateScheduleRsp);

    LocalizedRateSchedule rateSchedule = new LocalizedRateSchedule();
    rateSchedule.setPricelistId(1);
    rateSchedule.setPtId(1);
    rateSchedule.setStartDateType(EffectiveDateMode.NOT_SET);
    rateSchedule.setEndDateType(EffectiveDateMode.NOT_SET);
    ResponseEntity<RateSchedule> rateScheduleRsp1 =
        new ResponseEntity<RateSchedule>(rateSchedule, HttpStatus.OK);

    when(extendedRateScheduleClient.createRateSchedule(rateSchedule, null))
        .thenReturn(rateScheduleRsp1);

    when(rateScheduleClient.findRateSchedule(1, Integer.MAX_VALUE, sortArray,
        PropertyRsqlConstants.PT_ID_EQUAL + 1 + RsqlOperator.AND
            + PropertyRsqlConstants.ITEM_TEMPLATE_ID_EQUAL + "null" + RsqlOperator.AND
            + PropertyRsqlConstants.PRICELIST_ID_EQUAL + 1,
        null, null, null)).thenReturn(rateScheduleRsp);

    rateScheduleServiceImpl.getRates(offerId, piInstanceId, false);
  }
}
