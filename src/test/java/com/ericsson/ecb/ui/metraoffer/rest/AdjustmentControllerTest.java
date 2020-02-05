package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.ericsson.ecb.catalog.model.Adjustment;
import com.ericsson.ecb.catalog.model.LocalizedAdjustment;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.AdjustmentModel;
import com.ericsson.ecb.ui.metraoffer.service.AdjustmentService;
import com.google.gson.Gson;

public class AdjustmentControllerTest {

  private MockMvc mockMvc;

  @InjectMocks
  private AdjustmentController adjustmentController;

  @Mock
  private AdjustmentService adjustmentService;

  private Adjustment adjustment;

  private LocalizedAdjustment localizedAdjustment;

  private List<Adjustment> adjustmentList;

  private PaginatedList<Adjustment> paginatedAdjustment;

  private Set<Integer> reasonCodeList;

  private Integer propId = 1;

  private Integer templateId = 1;

  private final static String URI = RestControllerUri.ADJUSTMENT;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(adjustmentController).build();
    adjustment = new Adjustment();
    localizedAdjustment = new LocalizedAdjustment();
    adjustmentList = new ArrayList<>();
    adjustmentList.add(adjustment);
    paginatedAdjustment = new PaginatedList<>();
    paginatedAdjustment.setRecords(adjustmentList);
    reasonCodeList = new HashSet<>();
  }

  @Test
  public void shouldAddAdjustmentToPriceableItemTemplate() throws Exception {
    when(adjustmentController.addAdjustmentToPriceableItemTemplate(localizedAdjustment))
        .thenReturn(adjustment);

    Gson gson = new Gson();
    String json = gson.toJson(adjustment);

    mockMvc
        .perform(MockMvcRequestBuilders.post(URI + "/adjustment")
            .contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldRemoveAdjustmentFromPiTemplate() throws Exception {

    Boolean flag = Boolean.TRUE;
    when(adjustmentController.removeAdjustmentFromPiTemplate(propId)).thenReturn(flag);

    mockMvc.perform(delete(URI + "/{propId}", propId).accept(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldRemoveReasonCodeFromAdjustment() throws Exception {
    reasonCodeList.add(1);
    Boolean flag = Boolean.TRUE;
    when(adjustmentController.removeReasonCodeFromAdjustment(propId, reasonCodeList))
        .thenReturn(flag);

    mockMvc
        .perform(
            delete(URI + "/reason-code/{propId}", propId).accept(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldAddReasonCodeToAdjustment() throws Exception {
    Boolean flag = Boolean.TRUE;
    when(adjustmentController.addReasonCodeToAdjustment(propId, reasonCodeList)).thenReturn(flag);

    Gson gson = new Gson();
    String json = gson.toJson(reasonCodeList);

    mockMvc
        .perform(MockMvcRequestBuilders.post(URI + "/reason-code/{propId}", propId)
            .contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldFindAdjustment() throws Exception {
    when(adjustmentController.findAdjustment(1, Integer.MAX_VALUE, null, null, null, null, null))
        .thenReturn(paginatedAdjustment);
    mockMvc.perform(get(URI).param("page", 1 + "").param("size", Integer.MAX_VALUE + ""))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldGetAdjustmentWithReasonCode() throws Exception {
    Collection<AdjustmentModel> adjustmentModelList = new ArrayList<>();
    AdjustmentModel adjustmentModel = new AdjustmentModel();
    adjustmentModel.setPropId(1);
    adjustmentModelList.add(adjustmentModel);
    when(adjustmentController.getPiTemplateAdjustmentWithReasonCode(templateId))
        .thenReturn(adjustmentModelList);
    mockMvc.perform(get(URI + "/adjustment-reason-code/pi-template/{piTemplateId}", templateId))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldCreateAdjustment() throws Exception {
    when(adjustmentController.createAdjustment(localizedAdjustment)).thenReturn(adjustment);
    Gson gson = new Gson();
    String json = gson.toJson(adjustment);

    mockMvc.perform(get(URI)).andExpect(status().isOk());
    mockMvc
        .perform(
            MockMvcRequestBuilders.post(URI).contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldUpdatePiTemplateAdjustmentAndReasonCode() throws Exception {
    Integer templateId = 1;
    AdjustmentModel adjustmentModel1 = new AdjustmentModel();
    AdjustmentModel adjustmentModel2 = new AdjustmentModel();
    Collection<AdjustmentModel> uiAdjustmentModelList = new ArrayList<>();
    uiAdjustmentModelList.add(adjustmentModel1);
    uiAdjustmentModelList.add(adjustmentModel2);
    Boolean flag = Boolean.TRUE;
    when(adjustmentController.updatePiTemplateAdjustmentAndReasonCode(templateId,
        uiAdjustmentModelList)).thenReturn(flag);
    Gson gson = new Gson();
    String json = gson.toJson(uiAdjustmentModelList);

    mockMvc
        .perform(MockMvcRequestBuilders.post(URI + "/adjustment-reason-code/{templateId}", 1)
            .contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldupdatePiInstanceAdjustment() throws Exception {
    Integer piInstanceId = 1;
    AdjustmentModel adjustmentModel1 = new AdjustmentModel();
    AdjustmentModel adjustmentModel2 = new AdjustmentModel();
    Collection<AdjustmentModel> uiAdjustmentModelList = new ArrayList<>();
    uiAdjustmentModelList.add(adjustmentModel1);
    uiAdjustmentModelList.add(adjustmentModel2);
    Boolean flag = Boolean.TRUE;
    when(adjustmentController.updatePiInstanceAdjustment(piInstanceId, uiAdjustmentModelList))
        .thenReturn(flag);

    Gson gson = new Gson();
    String json = gson.toJson(uiAdjustmentModelList);

    mockMvc
        .perform(MockMvcRequestBuilders.post(URI + "/pi-instance/{piInstanceId}", 1)
            .contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldGetPiInstanceAdjustmentWithReasonCode() throws Exception {
    Integer instanceId = 1;
    Collection<AdjustmentModel> value = new ArrayList<>();
    when(adjustmentController.getPiInstanceAdjustmentWithReasonCode(instanceId)).thenReturn(value);
    mockMvc.perform(get(URI + "/adjustment-reason-code/pi-instance/{piInstanceId}", instanceId))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }
}
