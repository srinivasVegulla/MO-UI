package com.ericsson.ecb.ui.metraoffer.rest;

import java.util.Collection;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ericsson.ecb.catalog.model.Rule;
import com.ericsson.ecb.catalog.model.RuleSet;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.RuleData;
import com.ericsson.ecb.ui.metraoffer.service.RuleSetService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@Api(value = "RuleSet", description = "This API pertains to sets of rules within a rate schedule.")
@RestController
@RequestMapping(RestControllerUri.RULE_SET)
public class RuleSetController {

  @Autowired
  private RuleSetService ruleSetService;

  @ApiOperation(value = "findRulesInSchedule",
      notes = "Retrieve a Rules defined in parameter table based supplied scheduleId")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/{scheduleId}/current")
  public PaginatedList<Rule> findRulesInSchedule(@PathVariable("scheduleId") Integer scheduleId,
      @ApiParam(value = "Results page you want to retrieve (1..N)",
          required = false) @RequestParam(required = false, name = "page") Integer page,
      @ApiParam(value = "Number of records per page",
          required = false) @RequestParam(required = false, name = "size") Integer size,
      @ApiParam(
          value = "Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
          required = false) @RequestParam(required = false, name = "sort") String[] sort,
      @ApiParam(value = "Filter criteria to apply (e.g., \"accountId==123\")",
          required = false) @RequestParam(required = false, name = "query") String query)
      throws EcbBaseException {
    return ruleSetService.findRulesInSchedule(scheduleId, page, size, sort, query);
  }

  @ApiOperation(value = "findRulesDataInSchedule",
      notes = "Retrieve a Rules defined in parameter table based supplied scheduleId")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/{scheduleId}")
  public PaginatedList<RuleData> findRulesDataInSchedule(
      @PathVariable("scheduleId") Integer scheduleId,
      @ApiParam(value = "Parameter Table Name. ex: cookies.com/rateCookies",
          required = false) @RequestParam(required = false, name = "ptName") String ptName,
      @ApiParam(value = "Results page you want to retrieve (1..N)",
          required = false) @RequestParam(required = false, name = "page") Integer page,
      @ApiParam(value = "Number of records per page",
          required = false) @RequestParam(required = false, name = "size") Integer size,
      @ApiParam(
          value = "Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
          required = false) @RequestParam(required = false, name = "sort") String[] sort,
      @ApiParam(value = "Filter criteria to apply (e.g., \"accountId==123\")",
          required = false) @RequestParam(required = false, name = "query") String query)
      throws EcbBaseException {
    return ruleSetService.findRulesDataInSchedule(scheduleId, ptName, page, size, sort, query);
  }

  @ApiOperation(value = "exportToXml",
      notes = "Retrieve a Rules defined in parameter table based supplied scheduleId to xml data")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST,
      value = "/{scheduleId}/exportToXml")
  public void exportToXml(HttpServletResponse response,
      @PathVariable("scheduleId") Integer scheduleId) throws Exception {
    ruleSetService.exportToXml(response, scheduleId);
  }

  @ApiOperation(value = "convertXmlToJson", notes = "Convert XML data to JSON data")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST,
      value = "/convertXmlToJson")
  public Collection<RuleData> convertXmlToJson(
      @ApiParam(value = "Parameter Table Name. ex: cookies.com/rateCookies",
          required = false) @RequestParam(required = false, name = "paramtableName") String ptName,
      @ApiParam(value = "XML Data", required = false) @RequestBody String xmlData)
      throws Exception {
    return ruleSetService.convertXmlToJson(ptName, xmlData);
  }


  @ApiOperation(value = "removeRule",
      notes = "Remove rule of a particular schedule defined in a parameter table")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.DELETE,
      value = "/{scheduleId}/current/{order}")
  public RuleSet deleteRule(@PathVariable("scheduleId") Integer scheduleId,
      @PathVariable("order") Integer order) throws EcbBaseException {
    return ruleSetService.removeRule(scheduleId, order);
  }

  @ApiOperation(value = "updateRule", notes = "Update Rule of given order index")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT,
      value = "/current")
  public RuleSet updateRule(@RequestBody Rule rule) throws EcbBaseException {
    return ruleSetService.updateRule(rule);
  }

  @ApiOperation(value = "createRule", notes = "Insert a rule at given order index")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST,
      value = "/current")
  public RuleSet insertRule(@RequestBody Rule rule) throws EcbBaseException {
    return ruleSetService.insertRule(rule);
  }

  @ApiOperation(value = "createRuleSet", notes = "Create a new set of rule for a Schedule")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST,
      value = "/{scheduleId}")
  public RuleSet createRuleSet(@RequestBody List<Rule> rules,
      @PathVariable("scheduleId") Integer scheduleId) throws EcbBaseException {
    return ruleSetService.createRuleSet(scheduleId, rules);
  }

  @ApiOperation(value = "copyRates", notes = "Copies rules of a particular schedule")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST,
      value = "/copy-rates/{fromSchedId}/to/{toSchedId}")
  public RuleSet copyRates(@PathVariable("fromSchedId") Integer fromSchedId,
      @PathVariable("toSchedId") Integer toSchedId) throws EcbBaseException {
    return ruleSetService.copyRates(fromSchedId, toSchedId);
  }
}
