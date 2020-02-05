package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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

import com.ericsson.ecb.catalog.model.PricelistMapping;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.PricelistMappingModel;
import com.ericsson.ecb.ui.metraoffer.service.PricelistMappingService;
import com.google.gson.Gson;

public class PricelistMappingControllerTest {
  private MockMvc mockMvc;

  @Mock
  private PricelistMappingService pricelistMappingService;

  @InjectMocks
  private PricelistMappingController pricelistMappingController;

  private PricelistMappingModel pricelistMappingModel;

  private Integer offerId = 1;

  private Integer piInstanceParentId = 1;


  private final static String URI = RestControllerUri.PRICELIST_MAPPING;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(pricelistMappingController).build();
  }

  @Test
  public void shouldPricelistMappingById() throws Exception {
    when(pricelistMappingService.getPricelistMappingByOfferId(1)).thenReturn(pricelistMappingModel);
    mockMvc.perform(get(URI + "/" + offerId)).andExpect(status().isOk());
  }

  @Test
  public void shouldGetPricelistMappingByPiInstanceId() throws Exception {
    when(pricelistMappingService.getPricelistMappingByPiInstanceParentId(offerId,
        piInstanceParentId)).thenReturn(pricelistMappingModel);
    String result = mockMvc
        .perform(get(URI + "/{offerId}/pi-instanceParentId/{piInstanceParentId}", offerId,
            piInstanceParentId).accept(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    Assert.assertNotNull(result);
  }

  @Test
  public void shouldUpdatePricelistMapping() throws Exception {
    PricelistMapping response = new PricelistMapping();
    PricelistMapping request = new PricelistMapping();
    request.setOfferId(1);;
    request.setCanicb(true);
    request.setPricelistId(2);
    Gson gson = new Gson();
    String json = gson.toJson(request);
    when(pricelistMappingService.updatePricelistMapping(request)).thenReturn(response);
    String result = mockMvc
        .perform(
            MockMvcRequestBuilders.put(URI).contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    Assert.assertNotNull(result);
  }

}
