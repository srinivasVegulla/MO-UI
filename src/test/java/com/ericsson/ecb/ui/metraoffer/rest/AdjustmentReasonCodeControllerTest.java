package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

import com.ericsson.ecb.catalog.model.LocalizedReasonCode;
import com.ericsson.ecb.catalog.model.ReasonCode;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.service.AdjustmentReasonCodeService;
import com.google.gson.Gson;

public class AdjustmentReasonCodeControllerTest {

  private MockMvc mockMvc;

  @InjectMocks
  private AdjustmentReasonCodeController adjustmentReasonCodeController;

  @Mock
  private AdjustmentReasonCodeService adjustmentReasonCodeService;

  private ReasonCode reasonCode;

  private List<ReasonCode> reasonCodeList;

  private PaginatedList<ReasonCode> reasonCodePaginatedList;

  private Integer propId = 1;

  private final static String URI = RestControllerUri.ADJUSTMENT_REASON_CODE;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(adjustmentReasonCodeController).build();
    reasonCode = new ReasonCode();
    reasonCodeList = new ArrayList<>();
    reasonCodeList.add(reasonCode);
    reasonCodePaginatedList = new PaginatedList<>();
    reasonCodePaginatedList.setRecords(reasonCodeList);
  }

  /*
   * @Test public void shouldFindReasonCode() throws Exception {
   * when(adjustmentReasonCodeController.findReasonCode(page, size, null, null))
   * .thenReturn(reasonCodePaginatedList); mockMvc.perform(get(URI).param("page", page +
   * "").param("size", size + "")) .andExpect(status().isOk())
   * .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8)); }
   */

  @Test
  public void shouldReasonCode() throws Exception {
    adjustmentReasonCodeController.getReasonCode(propId);
    when(adjustmentReasonCodeController.getReasonCode(propId)).thenReturn(reasonCode);
    mockMvc.perform(get(URI + "/{propId}", propId)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldRemoveReasonCodeFromAdjustment() throws Exception {
    Boolean flag = Boolean.TRUE;
    when(adjustmentReasonCodeController.deleteReasonCode(propId)).thenReturn(flag);
    mockMvc.perform(delete(URI + "/{propId}", propId).accept(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldUpdateReasonCode() throws Exception {
    Set<String> fields = new HashSet<>();;
    fields.add("displayName");
    Boolean record = Boolean.TRUE;
    when(adjustmentReasonCodeController.updateReasonCode(propId, fields, reasonCode))
        .thenReturn(record);
    Gson gson = new Gson();
    String json = gson.toJson(reasonCode);
    mockMvc
        .perform(MockMvcRequestBuilders.put(URI + "/{propId}?fields=displayName", propId)
            .contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }


  @Test
  public void shouldCreateReasonCode() throws Exception {

    LocalizedReasonCode record = new LocalizedReasonCode();

    when(adjustmentReasonCodeController.createReasonCode(record)).thenReturn(record);

    Gson gson = new Gson();
    String json = gson.toJson(record);

    String result = mockMvc
        .perform(
            MockMvcRequestBuilders.post(URI).contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    Assert.assertNotNull(result);
  }


}
