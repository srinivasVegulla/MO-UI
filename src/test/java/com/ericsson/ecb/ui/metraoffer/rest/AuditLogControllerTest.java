package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.OffsetDateTime;

import javax.servlet.http.HttpServletResponse;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.AuditSummary;
import com.ericsson.ecb.ui.metraoffer.model.ChunkRule;
import com.ericsson.ecb.ui.metraoffer.model.RateChanges;
import com.ericsson.ecb.ui.metraoffer.service.AuditLogService;

public class AuditLogControllerTest {

  private MockMvc mockMvc;

  @Mock
  private AuditLogService auditLogService;

  @Mock
  private HttpServletResponse response;

  @InjectMocks
  private AuditLogController auditLogController;

  private final static String URI = RestControllerUri.AUDIT_LOG;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(auditLogController).build();
  }

  @Test
  public void shouldFindAuditSummary() throws Exception {
    PaginatedList<AuditSummary> paginatedAuditSummary = new PaginatedList<>();
    when(auditLogController.findAuditSummary(1, 20, null, null)).thenReturn(paginatedAuditSummary);
    mockMvc.perform(get(URI).param("page", 1 + "").param("size", 20 + ""))
        .andExpect(status().isOk());
  }

  @Test
  public void shouldFindRatesAuditSummary() throws Exception {
    PaginatedList<AuditSummary> paginatedAuditSummary = new PaginatedList<>();
    when(auditLogController.findRatesAuditSummary(1, 1, 1, 1, 20, null, null))
        .thenReturn(paginatedAuditSummary);
    mockMvc.perform(
        get(URI + "/param-table/{paramtableId}/template/{templateId}/pricelist/{pricelistId}", 1, 1,
            1).param("page", 1 + "").param("size", 20 + ""))
        .andExpect(status().isOk());
  }

  @Test
  public void shouldFindRateChanges() throws Exception {
    RateChanges rateChanges = new RateChanges();
    when(auditLogController.findRateChanges(1, true)).thenReturn(rateChanges);
    mockMvc
        .perform(
            get(URI + "/rate-changes//{schedule-id}", 1).param("scheduleAndMetadataInfo", "true"))
        .andExpect(status().isOk());
  }

  @Test
  public void shouldDiffRuleSet() throws Exception {
    PaginatedList<ChunkRule> rateChanges = new PaginatedList<>();
    when(auditLogController.diffRuleSet(1, OffsetDateTime.now(), 1, Integer.MAX_VALUE))
        .thenReturn(rateChanges);
    mockMvc
        .perform(get(URI + "/rate-changes//{schedule-id}/{active-date}", 1, "2018-04-05T07:30:58Z")
            .param("page", 1 + "").param("size", 20 + ""))
        .andExpect(status().isOk());
  }

  @Test
  public void shouldExportToCsv() throws Exception {
    mockMvc.perform(post(URI + "/exportToCsv")).andExpect(status().isOk());
  }
}
