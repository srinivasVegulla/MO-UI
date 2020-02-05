package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.ericsson.ecb.catalog.model.Rule;
import com.ericsson.ecb.catalog.model.RuleSet;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.CustomPaginatedList;
import com.ericsson.ecb.ui.metraoffer.model.RuleData;
import com.ericsson.ecb.ui.metraoffer.service.RuleSetService;
import com.google.gson.Gson;

public class RuleSetControllerTest {

  private MockMvc mockMvc;

  @Mock
  private RuleSetService ruleSetService;

  @InjectMocks
  private RuleSetController ruleSetController;

  private PaginatedList<Rule> ratePageableList;

  private Integer page = 0;
  private Integer size = 20;
  private Integer scheduleId = 2913;

  private final static String URI = RestControllerUri.RULE_SET;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(ruleSetController).build();
    ratePageableList = new PaginatedList<Rule>();
  }

  @Test
  public void shouldFindRulesInSchedule() throws Exception {
    when(ruleSetService.findRulesInSchedule(1, page, size, null, null))
        .thenReturn(ratePageableList);
    mockMvc
        .perform(get(URI + "/" + 1 + "/current").param("page", page + "").param("size", size + ""))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldRemoveRule() throws Exception {
    RuleSet ruleSet = new RuleSet();
    when(ruleSetService.removeRule(1, 0)).thenReturn(ruleSet);
    mockMvc.perform(delete(URI + "/" + 1 + "/current/" + 0)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldUpdateRule() throws Exception {
    RuleSet response = new RuleSet();
    Rule request = new Rule();
    request.setOrder(0);
    request.setScheduleId(2913);
    Gson gson = new Gson();
    String json = gson.toJson(request);
    when(ruleSetService.updateRule(request)).thenReturn(response);
    String result = mockMvc
        .perform(MockMvcRequestBuilders.put(URI + "/current")
            .contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    Assert.assertNotNull(result);
  }

  @Test
  public void shouldCreateRule() throws Exception {
    RuleSet response = new RuleSet();
    Rule request = new Rule();
    request.setOrder(0);
    request.setScheduleId(2913);
    Gson gson = new Gson();
    String json = gson.toJson(request);
    when(ruleSetService.updateRule(request)).thenReturn(response);
    String result = mockMvc
        .perform(MockMvcRequestBuilders.post(URI + "/current")
            .contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    Assert.assertNotNull(result);
  }

  @Test
  public void shouldCreateRuleSet() throws Exception {
    RuleSet response = new RuleSet();
    List<Rule> rules = new ArrayList<Rule>();
    Rule rule = new Rule();
    rule.setOrder(0);
    rule.setScheduleId(2913);
    rules.add(rule);
    Gson gson = new Gson();
    String json = gson.toJson(rules);
    when(ruleSetService.createRuleSet(3, rules)).thenReturn(response);
    String result = mockMvc
        .perform(MockMvcRequestBuilders.post(URI + "/" + 3).contentType(MediaType.APPLICATION_JSON)
            .content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    Assert.assertNotNull(result);
  }

  @Test
  public void shouldCopyRule() throws Exception {
    RuleSet response = new RuleSet();
    when(ruleSetService.copyRates(1, 2)).thenReturn(response);
    mockMvc.perform(post(URI + "/copy-rates/" + 1 + "/to/" + 2)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldExportToXml() throws Exception {
    mockMvc.perform(post(URI + "/" + scheduleId + "/exportToXml")).andExpect(status().isOk());
  }

  @Test
  public void shouldConvertXmlToJson() throws Exception {
    Collection<RuleData> response = new ArrayList<>();
    String xmlData = "sample";
    String ptName = "cookies.com/rateCookies";
    Gson gson = new Gson();
    String json = gson.toJson(xmlData);
    when(ruleSetService.convertXmlToJson(ptName, xmlData)).thenReturn(response);
    String result = mockMvc
        .perform(MockMvcRequestBuilders.post(URI + "/convertXmlToJson")
            .contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    Assert.assertNotNull(result);
  }

  @Test
  public void shouldFindRulesDataInSchedule() throws Exception {
    CustomPaginatedList<RuleData> paginatedList = new CustomPaginatedList<>();
    when(ruleSetService.findRulesDataInSchedule(1, "cookies.com/rateCookies", page, size, null,
        null)).thenReturn(paginatedList);
    mockMvc
        .perform(get(URI + "/" + 1).param("ptName", "cookies.com/rateCookies" + "")
            .param("page", page + "").param("size", size + ""))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }
}
