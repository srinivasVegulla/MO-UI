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
import com.ericsson.ecb.catalog.model.UnitDependentRecurringCharge;
import com.ericsson.ecb.catalog.model.UnitDependentRecurringChargeTemplate;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.UnitDependentRecurringChargeModel;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemUnitDependentRecurringService;
import com.google.gson.Gson;

public class PriceableItemUnitDependentRecurringControllerTest {

  private MockMvc mockMvc;

  @InjectMocks
  private PriceableItemUnitDependentRecurringController priceableItemUnitDependentRecurringController;

  @Mock
  private PriceableItemUnitDependentRecurringService priceableItemUnitDependentRecurringService;

  private UnitDependentRecurringCharge unitDependentRecurringCharge;

  private UnitDependentRecurringChargeModel unitDependentRecurringChargeModel;

  private Integer propId;

  private final static String URI = RestControllerUri.UNIT_DEPENDENT_RECURRING;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    mockMvc =
        MockMvcBuilders.standaloneSetup(priceableItemUnitDependentRecurringController).build();
    propId = 1;
    unitDependentRecurringCharge = new UnitDependentRecurringCharge();
    unitDependentRecurringChargeModel = new UnitDependentRecurringChargeModel();
  }

  @Test
  public void shouldGetUnitDependentRecurringCharge() throws Exception {
    when(priceableItemUnitDependentRecurringService.getUnitDependentRecurringCharge(propId))
        .thenReturn(unitDependentRecurringCharge);
    mockMvc.perform(get(URI + "/{propId}", propId)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldGetDiscountDetails() throws Exception {
    when(priceableItemUnitDependentRecurringService.getUnitDependentRecurringChargeDetails(propId))
        .thenReturn(unitDependentRecurringChargeModel);
    mockMvc.perform(get(URI + "/details/{propId}", propId)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldCreateUniDependentRecurringChargePriceableItemTemplate() throws Exception {
    LocalizedUnitDependentRecurringChargeTemplate record =
        new LocalizedUnitDependentRecurringChargeTemplate();
    when(priceableItemUnitDependentRecurringService
        .createUniDependentRecurringChargePriceableItemTemplate(record))
            .thenReturn(unitDependentRecurringChargeModel);

    Gson gson = new Gson();
    String json = gson.toJson(unitDependentRecurringChargeModel);

    mockMvc
        .perform(
            MockMvcRequestBuilders.post(URI).contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldUpdateRecurringChargePriceableItemTemplate() throws Exception {
    UnitDependentRecurringChargeTemplate unitDependentRecurringCharge =
        new UnitDependentRecurringChargeTemplate();
    Boolean record = Boolean.TRUE;
    Set<String> fields = new HashSet<>();
    when(priceableItemUnitDependentRecurringService.updateUnitRecurringChargePriceableItemTemplate(
        unitDependentRecurringCharge, fields, propId)).thenReturn(record);
    Gson gson = new Gson();
    String json = gson.toJson(unitDependentRecurringCharge);

    mockMvc
        .perform(MockMvcRequestBuilders.put(URI + "/update-fields/{propId}", propId)
            .param("fields", new Gson().toJson(fields)).contentType(MediaType.APPLICATION_JSON)
            .content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldFindUnitDependentRecurringCharge() throws Exception {
    PaginatedList<UnitDependentRecurringCharge> records = new PaginatedList<>();
    when(priceableItemUnitDependentRecurringService.findUnitDependentRecurringCharge(1,
        Integer.MAX_VALUE, null, null)).thenReturn(records);
    mockMvc.perform(get(URI).param("page", 1 + "").param("size", Integer.MAX_VALUE + ""))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }
}
