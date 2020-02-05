package com.ericsson.ecb.ui.metraoffer.service;

import java.util.Collection;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import com.ericsson.ecb.catalog.model.Rule;
import com.ericsson.ecb.catalog.model.RuleSet;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.model.CustomPaginatedList;
import com.ericsson.ecb.ui.metraoffer.model.RuleData;

public interface RuleSetService {

  public PaginatedList<Rule> findRulesInSchedule(Integer scheduleId, Integer page, Integer size,
      String[] sort, String query) throws EcbBaseException;

  public void exportToXml(HttpServletResponse response, Integer scheduleId) throws Exception;

  public Collection<RuleData> convertXmlToJson(String ptName, String xmlData) throws Exception;

  public RuleSet removeRule(Integer scheduleId, Integer order) throws EcbBaseException;

  public RuleSet updateRule(Rule rule) throws EcbBaseException;

  public RuleSet insertRule(Rule rule) throws EcbBaseException;

  public RuleSet createRuleSet(Integer scheduleId, List<Rule> rules) throws EcbBaseException;

  public RuleSet copyRates(Integer fromSchedId, Integer toSchedId) throws EcbBaseException;

  public CustomPaginatedList<RuleData> findRulesDataInSchedule(Integer scheduleId, String ptName,
      Integer page, Integer size, String[] sort, String query) throws EcbBaseException;

}
