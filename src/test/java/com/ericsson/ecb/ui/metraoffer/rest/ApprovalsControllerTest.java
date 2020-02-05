package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;

import org.codehaus.jettison.json.JSONException;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.ericsson.ecb.base.model.AuditAggregator;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.Approvals;
import com.ericsson.ecb.ui.metraoffer.model.OfferingViewChangeDetails;
import com.ericsson.ecb.ui.metraoffer.model.RatesViewChangeDetails;
import com.ericsson.ecb.ui.metraoffer.service.ApprovalsService;
import com.google.gson.Gson;

public class ApprovalsControllerTest {

  private MockMvc mockMvc;

  @InjectMocks
  private ApprovalsController approvalsController;

  @Mock
  private ApprovalsService approvalsService;

  private final String URI = RestControllerUri.APPROVALS;

  private Integer offerId = 1;
  private Integer schedId = 2;
  private Integer approvalId = 3;
  private Integer page = 1;
  private Integer size = 20;

  @Before
  public void init() throws JSONException {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(approvalsController).build();
  }

  @Test
  public void shouldFindOfferingUpdatePendingApprovals() throws Exception {
    PaginatedList<Approvals> record = new PaginatedList<Approvals>();
    when(approvalsController.findOfferingUpdatePendingApprovals(offerId, page, size, null, null))
        .thenReturn(record);
    mockMvc
        .perform(get(URI + "/offerings/pending-approvals/" + offerId).param("page", page + "")
            .param("size", size + ""))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldFindRateUpdatePendingApprovals() throws Exception {
    PaginatedList<Approvals> record = new PaginatedList<Approvals>();
    when(approvalsController.findRateUpdatePendingApprovals(schedId, page, size, null, null))
        .thenReturn(record);
    mockMvc
        .perform(get(URI + "/rates/pending-approvals/" + schedId).param("page", page + "")
            .param("size", size + ""))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }
  
  @Test
  public void shouldFindApprovalChangeHistory() throws Exception {
    PaginatedList<AuditAggregator> record = new PaginatedList<AuditAggregator>();
    when(approvalsController.findApprovalChangeHistory(approvalId, page, size, null, null))
        .thenReturn(record);
    mockMvc
        .perform(get(URI + "/change-history/" + approvalId).param("page", page + "")
            .param("size", size + ""))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }
  
  @Test
  public void shouldOfferingViewChangeDetails() throws Exception {
    OfferingViewChangeDetails record = new OfferingViewChangeDetails();
    when(approvalsController.offeringViewChangeDetails(approvalId))
        .thenReturn(record);
    mockMvc
        .perform(get(URI + "/offering/view-change-details/" + approvalId))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }
  
  @Test
  public void shouldRatesviewChangeDetails() throws Exception {
    RatesViewChangeDetails record = new RatesViewChangeDetails();
    when(approvalsController.ratesviewChangeDetails(schedId, approvalId))
        .thenReturn(record);
    mockMvc
        .perform(get(URI + "/rates/view-change-details/" + schedId + "/" + approvalId))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }
  
  @Test
  public void shouldApproveApprovals() throws Exception {
    List<Approvals> approvalsList = new ArrayList<>();
    when(approvalsController.approveApprovals(approvalsList))
        .thenReturn(Boolean.TRUE);
    Gson gson = new Gson();
    String json = gson.toJson(approvalsList);
    mockMvc
        .perform(MockMvcRequestBuilders.post(URI + "/approve-approvals")
            .contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }
}
