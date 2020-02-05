package com.ericsson.ecb.ui.metraoffer.service;

import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.PrintWriter;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ericsson.ecb.catalog.client.RuleSetClient;
import com.ericsson.ecb.catalog.model.Rule;
import com.ericsson.ecb.catalog.model.RuleCondition;
import com.ericsson.ecb.catalog.model.RuleOperator;
import com.ericsson.ecb.catalog.model.RuleSet;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.metadata.client.MetadataConfigClient;
import com.ericsson.ecb.metadata.model.DefineService;
import com.ericsson.ecb.metadata.model.PropertyType;
import com.ericsson.ecb.ui.metraoffer.constants.Constants;
import com.ericsson.ecb.ui.metraoffer.model.Configdata;
import com.ericsson.ecb.ui.metraoffer.model.Configdata.ConstraintSet;
import com.ericsson.ecb.ui.metraoffer.model.Configdata.ConstraintSet.Actions;
import com.ericsson.ecb.ui.metraoffer.model.Configdata.ConstraintSet.Actions.Action;
import com.ericsson.ecb.ui.metraoffer.model.Configdata.ConstraintSet.Constraint;
import com.ericsson.ecb.ui.metraoffer.model.ParameterTableMetadata;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.RuleSetServiceImpl;

public class RuleSetServiceImplTest {

  @Mock
  private RuleSetClient ruleSetClient;

  @InjectMocks
  private RuleSetServiceImpl ruleSetServiceImpl;

  @Mock
  private ApprovalsService approvalService;

  private JAXBContext context;
  private Marshaller marshaller;
  @Mock
  private Unmarshaller jaxbUnmarshaller;

  @Mock
  private ParameterTableService parameterTableService;

  @Mock
  private MetadataConfigClient metadataConfigClient;

  @Before
  public void init() throws Exception {
    MockitoAnnotations.initMocks(this);
    context = JAXBContext.newInstance(Configdata.class);
    marshaller = context.createMarshaller();
    marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
    jaxbUnmarshaller = context.createUnmarshaller();

  }

  @Test
  public void shouldFindRulesInSchedule() throws Exception {
    PaginatedList<Rule> pageableList = new PaginatedList<Rule>();
    List<Rule> ruleList = new ArrayList<Rule>();
    ruleList.add(new Rule());
    pageableList.setRecords(ruleList);

    when(ruleSetClient.findRulesInSchedule(1, 0, 20, null, "")).thenReturn(pageableList);
    ruleSetServiceImpl.findRulesInSchedule(1, 0, 20, null, "");
    assertNotNull(ruleList);
  }

  @Test
  public void shouldRemoveRule() throws Exception {
    RuleSet ruleSet = new RuleSet();
    when(ruleSetClient.removeRule(1, 0)).thenReturn(ruleSet);
    ruleSetServiceImpl.removeRule(1, 0);
  }

  @Test
  public void shouldUpdateRule() throws Exception {
    RuleSet response = new RuleSet();
    Rule request = new Rule();
    request.setOrder(0);
    request.setScheduleId(2913);
    when(ruleSetClient.updateRule(request, request.getOrder())).thenReturn(response);
    ruleSetServiceImpl.updateRule(request);
  }

  @Test
  public void shouldCreateRule() throws Exception {
    RuleSet response = new RuleSet();
    Rule request = new Rule();
    request.setOrder(0);
    request.setScheduleId(2913);
    when(ruleSetClient.insertRule(request)).thenReturn(response);
    ruleSetServiceImpl.insertRule(request);
  }

  @Test
  public void shouldCreateRuleSet() throws Exception {
    List<Rule> rules = new ArrayList<Rule>();
    Rule rule = new Rule();
    rule.setOrder(0);
    rule.setScheduleId(1);
    rules.add(rule);
    RuleSet ruleSet = new RuleSet();
    ResponseEntity<RuleSet> response = new ResponseEntity<RuleSet>(ruleSet, HttpStatus.OK);
    when(ruleSetClient.createRuleSet(1, rules)).thenReturn(response);
    ruleSetServiceImpl.createRuleSet(1, rules);
  }


  @Test
  public void shouldCopyRates() throws Exception {
    PaginatedList<Rule> pageableList = new PaginatedList<Rule>();
    List<Rule> ruleList = new ArrayList<Rule>();
    ruleList.add(new Rule());
    pageableList.setRecords(ruleList);
    RuleSet ruleSet = new RuleSet();
    ResponseEntity<RuleSet> response = new ResponseEntity<RuleSet>(ruleSet, HttpStatus.OK);
    when(ruleSetClient.findRulesInCurrentRuleSet(1, 1, Integer.MAX_VALUE, null, null))
        .thenReturn(pageableList);
    when(ruleSetClient.createRuleSet(2, ruleList)).thenReturn(response);
    ruleSetServiceImpl.copyRates(1, 2);
  }

  @Test
  public void shouldExportToXml() throws Exception {

    PaginatedList<Rule> pageableList = new PaginatedList<Rule>();
    List<Rule> ruleList = getRules();
    pageableList.setRecords(ruleList);
    when(ruleSetClient.findRulesInCurrentRuleSet(1, null, null, null, null))
        .thenReturn(pageableList);
    HttpServletResponse response = mock(HttpServletResponse.class);
    PrintWriter writer = new PrintWriter("sample");
    when(response.getWriter()).thenReturn(writer);
    marshaller.marshal(prepareRuleModel(pageableList.getRecords()), response.getWriter());

    ruleSetServiceImpl.exportToXml(response, 1);
  }

  private Configdata prepareRuleModel(Collection<Rule> rules) {

    Configdata configdata = new Configdata();
    ConstraintSet constraintSet = new ConstraintSet();
    List<ConstraintSet> constraintSetList = new ArrayList<>();
    constraintSetList.add(constraintSet);
    configdata.setConstraintSet(constraintSetList);
    return configdata;
  }

  @Test
  public void shouldConvertXmlToJson() throws Exception {
    String xmlData = "<configdata> " + " <constraint_set> " + " <actions> " + " <action> "
        + " <prop_name>UnitAmount</prop_name> " + " <prop_value>10.0</prop_value> " + " </action> "
        + " </actions> " + " <constraint> " + " <prop_name>UnitValue</prop_name> "
        + " <condition>EQUALS</condition> " + " <prop_value>20.0</prop_value> " + " </constraint> "
        + " </constraint_set> " + " </configdata>";

    String ptName = "cookies.com/rateCookies";
    StringReader reader = new StringReader(xmlData);
    Configdata configdata = (Configdata) jaxbUnmarshaller.unmarshal(reader);
    prepareRuleModel(ptName, configdata);
    ruleSetServiceImpl.convertXmlToJson(ptName, xmlData);
  }

  private Collection<Rule> prepareRuleModel(String ptName, Configdata configdata) throws Exception {
    getDefineService();
    List<Rule> rules = getRules();
    return rules;
  }

  @Test
  public void shouldFindRulesDataInSchedule() throws Exception {

    PaginatedList<Rule> pageableList = new PaginatedList<Rule>();
    List<Rule> ruleList = getRules();
    pageableList.setRecords(ruleList);
    List<ParameterTableMetadata> metadataList = new ArrayList<>();
    ParameterTableMetadata parameterTableMetadata = new ParameterTableMetadata();
    metadataList.add(parameterTableMetadata);
    when(parameterTableService.getTableMetadataWithDn(2)).thenReturn(metadataList);
    getDefineService();

    Map<String, Object> map = new HashMap<>();
    map.put(Constants.HAS_PENDING_APPROVALS, Boolean.TRUE);

    when(approvalService.getRateApprovalsStatus(1)).thenReturn(map);
    when(ruleSetClient.findRulesInCurrentRuleSet(1, 0, 20, null, "")).thenReturn(pageableList);

    ruleSetServiceImpl.findRulesDataInSchedule(1, "cookies.com/rateCookies", 0, 20, null, "");
    assertNotNull(ruleList);
  }

  private void getDefineService() throws Exception {
    String ptName = "cookies.com/rateCookies";
    DefineService defineService = new DefineService();

    List<PropertyType> propertyTypeList = new ArrayList<>();
    PropertyType propertyType1 = new PropertyType();
    propertyType1.setDn("UnitAmount");

    PropertyType propertyType2 = new PropertyType();
    propertyType2.setDn("UnitValue");
    propertyTypeList.add(propertyType1);
    propertyTypeList.add(propertyType2);
    defineService.setPropertyTypes(propertyTypeList);

    ResponseEntity<DefineService> value =
        new ResponseEntity<DefineService>(defineService, HttpStatus.OK);
    when(metadataConfigClient
        .getParameterTableMetadata(ptName.substring(ptName.lastIndexOf('/') + 1, ptName.length())))
            .thenReturn(value);
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
}
