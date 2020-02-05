package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.HashSet;
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

import com.ericsson.ecb.catalog.model.LocalizedUnitDependentRecurringChargeTemplate;
import com.ericsson.ecb.catalog.model.RecurringCharge;
import com.ericsson.ecb.catalog.model.UnitDependentRecurringChargeTemplate;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.UnitDependentRecurringChargeModel;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemRecurringService;
import com.google.gson.Gson;

public class PriceableItemRecurringControllerTest {

  private MockMvc mockMvc;

  @InjectMocks
  private PriceableItemRecurringController priceableItemRecurringController;

  @Mock
  private PriceableItemRecurringService priceableItemRecurringService;

  private RecurringCharge recurringCharge;

  private UnitDependentRecurringChargeModel unitDependentRecurringChargeModel;

  private UnitDependentRecurringChargeTemplate unitDependentRecurringChargeTemplate;

  private LocalizedUnitDependentRecurringChargeTemplate localizedUnitDependentRecurringChargeTemplate;

  private Integer propId = 1;

  private final static String URI = RestControllerUri.RECURRING;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(priceableItemRecurringController).build();
    recurringCharge = new RecurringCharge();
    unitDependentRecurringChargeModel = new UnitDependentRecurringChargeModel();
    unitDependentRecurringChargeTemplate = new UnitDependentRecurringChargeTemplate();
    localizedUnitDependentRecurringChargeTemplate =
        new LocalizedUnitDependentRecurringChargeTemplate();
  }

  @Test
  public void shouldGetRecurringCharge() throws Exception {
    when(priceableItemRecurringService.getRecurringCharge(propId)).thenReturn(recurringCharge);
    mockMvc.perform(get(URI + "/{propId}", propId)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldGetRecurringChargeDetails() throws Exception {
    when(priceableItemRecurringService.getRecurringChargeDetails(propId))
        .thenReturn(unitDependentRecurringChargeModel);
    mockMvc.perform(get(URI + "/details/{propId}", propId)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldCreateRecurringChargePriceableItemTemplate() throws Exception {

    when(priceableItemRecurringService
        .createRecurringChargePriceableItemTemplate(localizedUnitDependentRecurringChargeTemplate))
            .thenReturn(unitDependentRecurringChargeModel);

    Gson gson = new Gson();
    String json = gson.toJson(unitDependentRecurringChargeTemplate);

    mockMvc
        .perform(
            MockMvcRequestBuilders.post(URI).contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldUpdateRecurringChargePriceableItemTemplate() throws Exception {
    UnitDependentRecurringChargeTemplate unitDependentRecurringChargeTemplate =
        new UnitDependentRecurringChargeTemplate();
    Boolean record = Boolean.TRUE;
    Set<String> fields = new HashSet<>();
    when(priceableItemRecurringService.updateRecurringChargePriceableItemTemplate(
        unitDependentRecurringChargeTemplate, fields, propId)).thenReturn(record);
    Gson gson = new Gson();
    String json = gson.toJson(unitDependentRecurringChargeTemplate);

    mockMvc
        .perform(MockMvcRequestBuilders.put(URI + "/update-fields/{propId}", propId)
            .param("fields", new Gson().toJson(fields)).contentType(MediaType.APPLICATION_JSON)
            .content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldFindRecurringCharge() throws Exception {
    PaginatedList<RecurringCharge> recurringChargePaginated = new PaginatedList<>();
    when(priceableItemRecurringService.findRecurringCharge(1, Integer.MAX_VALUE, null, null, null,
        null, null)).thenReturn(recurringChargePaginated);
    mockMvc.perform(get(URI).param("page", 1 + "").param("size", Integer.MAX_VALUE + ""))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }
}
