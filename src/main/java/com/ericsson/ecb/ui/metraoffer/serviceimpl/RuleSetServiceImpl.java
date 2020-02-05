package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamReader;

import org.apache.commons.collections.MapUtils;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ericsson.ecb.catalog.client.RuleSetClient;
import com.ericsson.ecb.catalog.model.Rule;
import com.ericsson.ecb.catalog.model.RuleCondition;
import com.ericsson.ecb.catalog.model.RuleOperator;
import com.ericsson.ecb.catalog.model.RuleSet;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.metadata.client.MetadataConfigClient;
import com.ericsson.ecb.metadata.model.DefineService;
import com.ericsson.ecb.ui.metraoffer.model.Configdata;
import com.ericsson.ecb.ui.metraoffer.model.Configdata.ConstraintSet;
import com.ericsson.ecb.ui.metraoffer.model.Configdata.ConstraintSet.Actions;
import com.ericsson.ecb.ui.metraoffer.model.Configdata.ConstraintSet.Actions.Action;
import com.ericsson.ecb.ui.metraoffer.model.Configdata.ConstraintSet.Constraint;
import com.ericsson.ecb.ui.metraoffer.model.CustomPaginatedList;
import com.ericsson.ecb.ui.metraoffer.model.RuleData;
import com.ericsson.ecb.ui.metraoffer.service.ApprovalsService;
import com.ericsson.ecb.ui.metraoffer.service.RuleSetService;

@Service
public class RuleSetServiceImpl implements RuleSetService {

  private static final Logger LOGGER = LoggerFactory.getLogger(RuleSetServiceImpl.class);

  @Autowired
  private RuleSetClient ruleSetClient;

  @Autowired
  private MetadataConfigClient metadataConfigClient;

  @Autowired
  private ApprovalsService approvalsService;

  @Override
  public PaginatedList<Rule> findRulesInSchedule(Integer scheduleId, Integer page, Integer size,
      String[] sort, String query) throws EcbBaseException {
    return ruleSetClient.findRulesInCurrentRuleSet(scheduleId, page, size, sort, query);
  }

  @Override
  public CustomPaginatedList<RuleData> findRulesDataInSchedule(Integer scheduleId, String ptName,
      Integer page, Integer sizeIn, String[] sort, String query) throws EcbBaseException {

    DefineService defineServices = getParameterTableMetadata(ptName);

    Integer size = sizeIn != null ? sizeIn : Integer.MAX_VALUE;
    Collection<Rule> rules =
        ruleSetClient.findRulesInCurrentRuleSet(scheduleId, page, size, sort, query).getRecords();
    CustomPaginatedList<RuleData> paginatedList = new CustomPaginatedList<>();
    Collection<RuleData> ruleDataList = new ArrayList<>();
    rules.forEach(rule -> {
      RuleData ruleData = new RuleData();
      BeanUtils.copyProperties(rule, ruleData);
      defineServices.getPropertyTypes().forEach(propertyType -> {
        if (rule.getConditions().containsKey(propertyType.getDn())) {
          ruleData.getConditions().put(propertyType.getDn(),
              rule.getConditions().get(propertyType.getDn()));
        } else {
          if (rule.getActions().containsKey(propertyType.getDn())) {
            ruleData.getActions().put(propertyType.getDn(),
                rule.getActions().get(propertyType.getDn()));
          }
        }
      });
      ruleDataList.add(ruleData);
    });
    paginatedList.setTotalCount(ruleDataList.size());
    paginatedList.setRecords(ruleDataList);
    Map<String, Object> statusMap = approvalsService.getRateApprovalsStatus(scheduleId);
    paginatedList.getUtilityMap().putAll(statusMap);
    return paginatedList;
  }


  private DefineService getParameterTableMetadata(String ptName) throws EcbBaseException {
    return metadataConfigClient
        .getParameterTableMetadata(ptName.substring(ptName.lastIndexOf('/') + 1, ptName.length()))
        .getBody();
  }

  @Override
  public void exportToXml(HttpServletResponse response, Integer scheduleId) throws Exception {
    Collection<Rule> rules =
        ruleSetClient.findRulesInCurrentRuleSet(scheduleId, null, null, null, null).getRecords();

    String fileName = "export.xml";
    response.setContentType("text/xml");
    String headerKey = "Content-Disposition";
    String headerValue = String.format("attachment; filename=\"%s\"", fileName);
    response.setHeader(headerKey, headerValue);
    JAXBContext context = JAXBContext.newInstance(Configdata.class);
    Marshaller marshaller = context.createMarshaller();
    marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
    marshaller.marshal(prepareRuleModel(rules), response.getWriter());
  }

  @Override
  public Collection<RuleData> convertXmlToJson(String ptName, String xmlData) throws Exception {
    Collection<RuleData> ruleData = null;
    JAXBContext jaxbContext = JAXBContext.newInstance(Configdata.class);
    if (!StringUtils.isBlank(xmlData)) {
      Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
      XMLInputFactory xif = XMLInputFactory.newFactory();
      xif.setProperty(XMLInputFactory.IS_SUPPORTING_EXTERNAL_ENTITIES, false);
      xif.setProperty(XMLInputFactory.SUPPORT_DTD, false);
      XMLStreamReader xsr = xif.createXMLStreamReader(new StringReader(xmlData));
      Configdata configdata = (Configdata) jaxbUnmarshaller.unmarshal(xsr);
      ruleData = prepareRuleModel(ptName, configdata);
    }
    return ruleData;
  }

  @Override
  public RuleSet removeRule(Integer scheduleId, Integer order) throws EcbBaseException {
    return ruleSetClient.removeRule(scheduleId, order);
  }

  @Override
  public RuleSet updateRule(Rule rule) throws EcbBaseException {
    return ruleSetClient.updateRule(rule, rule.getOrder());
  }

  @Override
  public RuleSet insertRule(Rule rule) throws EcbBaseException {
    return ruleSetClient.insertRule(rule);
  }

  @Override
  public RuleSet createRuleSet(Integer scheduleId, List<Rule> rules) throws EcbBaseException {
    trimConditionsIfOperatorIsNull(rules);
    return ruleSetClient.createRuleSet(scheduleId, rules).getBody();
  }

  private void trimConditionsIfOperatorIsNull(List<Rule> rules) {
    rules.forEach(rule -> {
      Map<String, RuleCondition> map = rule.getConditions();
      if (MapUtils.isNotEmpty(map)) {
        Collection<RuleCondition> ruleConditions = map.values();
        Set<RuleCondition> ruleConditionSet = new HashSet<>();
        ruleConditionSet.addAll(ruleConditions);
        if (CollectionUtils.isNotEmpty(ruleConditionSet) && ruleConditionSet.size() == 1) {
          RuleCondition ruleCondition = ruleConditionSet.stream().findFirst().get();
          if (ruleCondition.getOperator() == null && ruleCondition.getValue() == null)
            rule.getConditions().clear();
        }
      }
    });
  }

  @Override
  public RuleSet copyRates(Integer fromSchedId, Integer toSchedId) throws EcbBaseException {
    LOGGER.info("Copy Rates Fetching rules for the incoming scheduleId:{} to copy to:{}",
        fromSchedId, toSchedId);
    Collection<Rule> rules = ruleSetClient
        .findRulesInCurrentRuleSet(fromSchedId, 1, Integer.MAX_VALUE, null, null).getRecords();
    LOGGER.info("Copy Rates Receiving rules for the incoming scheduleId:{} , size:{}", fromSchedId,
        rules.size());
    return createRuleSet(toSchedId, (List<Rule>) rules);
  }

  private Configdata prepareRuleModel(Collection<Rule> rules) {
    Configdata configdata = new Configdata();
    List<ConstraintSet> constraintSetList = new ArrayList<>();
    rules.forEach(rule -> {
      ConstraintSet constraintSet = new ConstraintSet();
      Actions actions = new Actions();
      rule.getActions().forEach((propName, propValue) -> {
        Action action = new Action();
        action.setPropName(propName);
        action.setPropValue(propValue != null ? propValue.toString() : "");
        actions.getAction().add(action);
      });
      constraintSet.setActions(actions);
      List<Constraint> constraintList = new ArrayList<>();
      rule.getConditions().forEach((constraintTmp, ruleCondition) -> {
        if (ruleCondition.getOperator() != null && ruleCondition.getValue() != null) {
          Constraint constraint = new Constraint();
          constraint.setCondition(ruleCondition.getOperator().toString());
          constraint.setPropName(constraintTmp);
          constraint.setPropValue(ruleCondition.getValue().toString());
          constraintList.add(constraint);
        }
      });
      if (CollectionUtils.isNotEmpty(constraintList)) {
        constraintSet.getConstraint().addAll(constraintList);
      } else {
        Constraint constraint = new Constraint();
        List<Constraint> constraintListTmp = new ArrayList<>();
        constraintListTmp.add(constraint);
        constraintSet.getConstraint().addAll(constraintListTmp);
      }
      constraintSetList.add(constraintSet);
    });
    configdata.setConstraintSet(constraintSetList);
    return configdata;
  }


  private Collection<RuleData> prepareRuleModel(String ptName, Configdata configdata)
      throws EcbBaseException {

    DefineService defineServices = getParameterTableMetadata(ptName);
    Collection<RuleData> rules = new ArrayList<>();
    List<ConstraintSet> constraintSetList = configdata.getConstraintSet();
    constraintSetList.forEach(constraintSet -> {
      RuleData ruleData = new RuleData();
      Actions actions = constraintSet.getActions();
      List<Action> actionsList = actions.getAction();
      Map<String, RuleCondition> condMap = new HashMap<>();
      Map<String, String> actionMap = new HashMap<>();
      actionsList.forEach(action -> {
        actionMap.put(action.getPropName(), action.getPropValue());
        constraintSet.getConstraint().forEach(constraint -> {
          if (constraint.getCondition() != null && constraint.getPropName() != null
              && constraint.getPropValue() != null) {
            RuleCondition ruleCondition = new RuleCondition();
            ruleCondition.setValue(constraint.getPropValue());
            ruleCondition.setOperator(RuleOperator.valueOf(constraint.getCondition()));
            condMap.put(constraint.getPropName(), ruleCondition);
          }
        });
      });
      defineServices.getPropertyTypes().forEach(propertyType -> {
        if (condMap.containsKey(propertyType.getDn())) {
          ruleData.getConditions().put(propertyType.getDn(), condMap.get(propertyType.getDn()));
        } else {
          if (actionMap.containsKey(propertyType.getDn())) {
            ruleData.getActions().put(propertyType.getDn(), actionMap.get(propertyType.getDn()));
          }
        }
      });
      rules.add(ruleData);
    });
    return rules;
  }
}
