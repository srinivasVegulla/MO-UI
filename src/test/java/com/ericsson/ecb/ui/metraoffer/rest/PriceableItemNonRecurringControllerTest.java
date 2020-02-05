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

import com.ericsson.ecb.catalog.model.LocalizedNonRecurringChargeTemplate;
import com.ericsson.ecb.catalog.model.NonRecurringCharge;
import com.ericsson.ecb.catalog.model.NonRecurringChargeTemplate;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.NonRecurringChargeModel;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemNonRecurringService;
import com.google.gson.Gson;

public class PriceableItemNonRecurringControllerTest {

  private MockMvc mockMvc;

  @InjectMocks
  private PriceableItemNonRecurringController priceableItemNonRecurringController;

  @Mock
  private PriceableItemNonRecurringService priceableItemNonRecurringService;

  private NonRecurringCharge nonRecurringCharge;

  private NonRecurringChargeModel nonRecurringChargeModel;

  private Integer propId = 1;

  private final static String URI = RestControllerUri.NON_RECURRING;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(priceableItemNonRecurringController).build();
    nonRecurringCharge = new NonRecurringCharge();
    nonRecurringChargeModel = new NonRecurringChargeModel();
  }

  @Test
  public void shouldGetNonRecurringCharge() throws Exception {
    when(priceableItemNonRecurringService.getNonRecurringCharge(propId))
        .thenReturn(nonRecurringCharge);
    mockMvc.perform(get(URI + "/{propId}", propId)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldGetNonRecurringChargeDetails() throws Exception {
    when(priceableItemNonRecurringService.getNonRecurringChargeDetails(propId))
        .thenReturn(nonRecurringChargeModel);
    mockMvc.perform(get(URI + "/details/{propId}", propId)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldCreateNonRecurringChargePriceableItemTemplate() throws Exception {
    LocalizedNonRecurringChargeTemplate record = new LocalizedNonRecurringChargeTemplate();
    when(priceableItemNonRecurringController.createNonRecurringChargePriceableItemTemplate(record))
        .thenReturn(nonRecurringChargeModel);

    Gson gson = new Gson();
    String json = gson.toJson(nonRecurringChargeModel);
    mockMvc.perform(get(URI)).andExpect(status().isOk());
    mockMvc
        .perform(
            MockMvcRequestBuilders.post(URI).contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldUpdateNonRecurringCharge() throws Exception {
    when(priceableItemNonRecurringService.updateNonRecurringCharge(nonRecurringChargeModel, propId))
        .thenReturn(nonRecurringCharge);

    Gson gson = new Gson();
    String json = gson.toJson(nonRecurringChargeModel);

    mockMvc
        .perform(MockMvcRequestBuilders.put(URI + "/{propId}", propId)
            .contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldUpdateNonRecurringChargePriceableItemTemplate() throws Exception {
    NonRecurringChargeTemplate nonRecurringChargeTemplate = new NonRecurringChargeTemplate();
    Boolean record = Boolean.TRUE;
    Set<String> fields = new HashSet<>();
    when(priceableItemNonRecurringService
        .updateNonRecurringChargePriceableItemTemplate(nonRecurringChargeTemplate, fields, propId))
            .thenReturn(record);
    Gson gson = new Gson();
    String json = gson.toJson(nonRecurringChargeTemplate);

    mockMvc
        .perform(MockMvcRequestBuilders.put(URI + "/update-fields/{propId}", propId)
            .param("fields", new Gson().toJson(fields)).contentType(MediaType.APPLICATION_JSON)
            .content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldFindNonRecurringCharge() throws Exception {
    PaginatedList<NonRecurringCharge> records = new PaginatedList<>();
    when(priceableItemNonRecurringService.findNonRecurringCharge(1, Integer.MAX_VALUE, null, null,
        null, null, null)).thenReturn(records);
    mockMvc.perform(get(URI).param("page", 1 + "").param("size", Integer.MAX_VALUE + ""))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }
}
