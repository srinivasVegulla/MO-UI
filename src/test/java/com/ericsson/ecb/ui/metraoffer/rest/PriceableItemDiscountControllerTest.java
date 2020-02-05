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

import com.ericsson.ecb.catalog.model.Discount;
import com.ericsson.ecb.catalog.model.DiscountTemplate;
import com.ericsson.ecb.catalog.model.LocalizedDiscountTemplate;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.DiscountModel;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemDiscountService;
import com.google.gson.Gson;

public class PriceableItemDiscountControllerTest {

  private MockMvc mockMvc;

  @InjectMocks
  private PriceableItemDiscountController priceableItemDiscountController;

  @Mock
  private PriceableItemDiscountService priceableItemDiscountService;

  private Discount discount;

  private DiscountModel discountModel;

  private DiscountTemplate discountTemplate;

  private LocalizedDiscountTemplate localizedDiscountTemplate;

  private Integer propId = 1;

  private final static String URI = RestControllerUri.DISCOUNT;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(priceableItemDiscountController).build();
    discount = new Discount();
    discountModel = new DiscountModel();
    discountTemplate = new DiscountTemplate();
    localizedDiscountTemplate = new LocalizedDiscountTemplate();
  }

  @Test
  public void shouldGetDiscount() throws Exception {
    when(priceableItemDiscountService.getDiscount(propId)).thenReturn(discount);
    mockMvc.perform(get(URI + "/{propId}", propId)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldGetDiscountDetails() throws Exception {
    when(priceableItemDiscountService.getDiscountDetails(propId)).thenReturn(discountModel);
    mockMvc.perform(get(URI + "/details/{propId}", propId)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldCreateDiscountPriceableItemTemplate() throws Exception {

    when(
        priceableItemDiscountService.createDiscountPriceableItemTemplate(localizedDiscountTemplate))
            .thenReturn(discountModel);

    Gson gson = new Gson();
    String json = gson.toJson(discountTemplate);

    mockMvc
        .perform(
            MockMvcRequestBuilders.post(URI).contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldUpdateDiscount() throws Exception {

    when(priceableItemDiscountService.updateDiscount(discountModel, propId)).thenReturn(discount);

    Gson gson = new Gson();
    String json = gson.toJson(discountTemplate);

    mockMvc
        .perform(MockMvcRequestBuilders.put(URI + "/{propId}", propId)
            .contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldUpdateDiscountPriceableItemTemplate() throws Exception {
    DiscountTemplate discountTemplate = new DiscountTemplate();
    Boolean record = Boolean.TRUE;
    Set<String> fields = new HashSet<>();
    when(priceableItemDiscountService.updateDiscountPriceableItemTemplate(discountTemplate, fields,
        propId)).thenReturn(record);
    Gson gson = new Gson();
    String json = gson.toJson(discountTemplate);

    mockMvc
        .perform(MockMvcRequestBuilders.put(URI + "/update-fields/{propId}", propId)
            .param("fields", new Gson().toJson(fields)).contentType(MediaType.APPLICATION_JSON)
            .content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldFindDiscount() throws Exception {
    PaginatedList<Discount> records = new PaginatedList<>();
    when(priceableItemDiscountService.findDiscount(1, Integer.MAX_VALUE, null, null, null, null,
        null)).thenReturn(records);
    mockMvc.perform(get(URI).param("page", 1 + "").param("size", Integer.MAX_VALUE + ""))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }
}
