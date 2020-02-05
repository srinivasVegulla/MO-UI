package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.ericsson.ecb.catalog.model.LocalizedProductOffer;
import com.ericsson.ecb.catalog.model.ProductOffer;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.type.Currency;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferData;
import com.ericsson.ecb.ui.metraoffer.service.ProductOfferService;
import com.google.gson.Gson;

public class ProductOfferControllerTest {

  private MockMvc mockMvc;

  @Mock
  private ProductOfferService productOfferService;

  @InjectMocks
  private ProductOfferController productOfferController;

  private ProductOfferData productOfferData;

  private PaginatedList<ProductOfferData> pageablePO;

  private ProductOffer productOffer;

  private LocalizedProductOffer localizedProductOffer;

  private Integer offerId = 1;
  private Integer page = 0;
  private Integer size = 20;

  private final static String URI = RestControllerUri.PRODUCT_OFFER;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(productOfferController).build();
    productOffer = new ProductOffer();
    localizedProductOffer = new LocalizedProductOffer();
    productOfferData = new ProductOfferData();
    productOfferData.setOfferId(1);
    pageablePO = new PaginatedList<ProductOfferData>();
  }

  @Test
  public void shouldGetProductOffer() throws Exception {
    when(productOfferController.getProductOffer(1)).thenReturn(productOfferData);
    mockMvc.perform(get(URI + "/" + offerId)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldFindPOWithNoAvailableDates() throws Exception {
    when(
        productOfferController.findPOWithNoAvailableDates(page, size, null, null, null, null, null))
            .thenReturn(pageablePO);
    mockMvc
        .perform(
            get(URI + "/WithNoAvailableDates").param("page", page + "1").param("size", size + ""))
        .andExpect(status().isOk());
  }

  @Test
  public void shouldFindPOWithAvailableDates() throws Exception {
    when(productOfferController.findPOWithAvailableDates(page, size, null, null, null, null, null))
        .thenReturn(pageablePO);
    mockMvc
        .perform(
            get(URI + "/WithAvailableDates").param("page", page + "1").param("size", size + ""))
        .andExpect(status().isOk());
  }


  @Test
  public void shouldCreateProductOffer() throws Exception {
    productOffer.setName("Sample PO");
    productOffer.setDisplayName("Sample Po DisplayName");
    productOffer.setDescription("Sample Po Description");
    Currency currecty = new Currency();
    currecty.setValue("USD");
    productOffer.setCurrency(currecty);
    productOffer.setPopartitionid(1);
    when(productOfferController.createProductOffer(localizedProductOffer))
        .thenReturn(productOfferData);

    Gson gson = new Gson();
    String json = gson.toJson(productOffer);

    mockMvc.perform(get(URI)).andExpect(status().isOk());

    mockMvc
        .perform(
            MockMvcRequestBuilders.post(URI).contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

  }

  @Test
  public void shouldDeleteProductOffer() throws Exception {
    ResponseEntity<Boolean> flag = new ResponseEntity<Boolean>(true, HttpStatus.OK);
    when(productOfferController.deleteProductOffer(1)).thenReturn(flag);
    mockMvc.perform(delete(URI + "/{offerId}", 1)).andExpect(status().isOk());

    mockMvc.perform(delete(URI + "/{offerId}", 1).accept(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldHideProductOffer() throws Exception {
    ResponseEntity<Boolean> flag = new ResponseEntity<Boolean>(true, HttpStatus.OK);
    Boolean hide = true;
    when(productOfferController.hideProductOffer(offerId, hide)).thenReturn(flag);
    String result = mockMvc
        .perform(MockMvcRequestBuilders.put(URI + "/{offerId}/hide/?hide=" + hide, offerId)
            .accept(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    Assert.assertNotNull(result);
  }

  @Test
  public void shouldGetPoUsedLocations() throws Exception {
    when(productOfferController.getPoUsedLocations(1, page, size, null, null, null, null, null))
        .thenReturn(pageablePO);
    mockMvc
        .perform(
            get(URI + "/Locations/{offerId}", 1).param("page", page + "").param("size", size + ""))
        .andExpect(status().isOk());
  }

  @Test
  public void shouldCopyProductOffer() throws Exception {
    when(productOfferController.copyProductOffer(offerId, localizedProductOffer))
        .thenReturn(productOffer);

    Gson gson = new Gson();
    String json = gson.toJson(productOffer);

    mockMvc
        .perform(MockMvcRequestBuilders.post(URI + "/{offerId}", offerId)
            .contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldCheckConfiguration() throws Exception {
    Boolean flag = Boolean.TRUE;
    when(productOfferController.checkConfiguration(offerId)).thenReturn(flag);
    mockMvc.perform(get(URI + "/checkConfig/{offerId}", offerId)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldupdateSelectiveProductOffer() throws Exception {
    HashMap<String, ProductOfferData> map = new HashMap<String, ProductOfferData>();
    ProductOfferData productOfferData = new ProductOfferData();
    Boolean record = Boolean.TRUE;
    Set<String> fields = new HashSet<>();
    when(productOfferController.updateSelectiveProductOffer(map, fields, offerId))
        .thenReturn(record);
    Gson gson = new Gson();
    String json = gson.toJson(productOfferData);
    mockMvc
        .perform(MockMvcRequestBuilders.put(URI + "/update-fields/{offerId}", offerId)
            .param("fields", new Gson().toJson(fields)).contentType(MediaType.APPLICATION_JSON)
            .content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldExportToCsv() throws Exception {
    mockMvc.perform(post(URI + "/exportToCsv")).andExpect(status().isOk());
  }
}
