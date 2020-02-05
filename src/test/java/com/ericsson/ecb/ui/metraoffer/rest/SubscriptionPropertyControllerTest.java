package com.ericsson.ecb.ui.metraoffer.rest;


import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

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

import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferData;
import com.ericsson.ecb.ui.metraoffer.model.ResponseModel;
import com.ericsson.ecb.ui.metraoffer.model.SubscriptionProperty;
import com.ericsson.ecb.ui.metraoffer.service.SubscriptionPropertyService;
import com.google.gson.Gson;

public class SubscriptionPropertyControllerTest {

  private MockMvc mockMvc;

  @InjectMocks
  private SubscriptionPropertyController subscriptionPropertyController;

  @Mock
  private SubscriptionPropertyService subscriptionPropertyService;

  private static final String URI = RestControllerUri.SUBSCRIPTION_PROPERTY;

  private SubscriptionProperty subscriptionProperty;

  private List<SubscriptionProperty> subscriptionProperties;

  private PaginatedList<SubscriptionProperty> subscriptionPropertyPaginated;

  private Integer offerId = 1;
  private Integer specId = 1;
  private Integer page = 0;
  private Integer size = 20;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    this.mockMvc = MockMvcBuilders.standaloneSetup(subscriptionPropertyController).build();
    subscriptionProperty = new SubscriptionProperty();
    subscriptionProperty.setSpecId(specId);

    subscriptionProperties = new ArrayList<>();
    subscriptionProperties.add(subscriptionProperty);

    subscriptionPropertyPaginated = new PaginatedList<SubscriptionProperty>();
    subscriptionPropertyPaginated.setRecords(subscriptionProperties);
  }


  @Test
  public void shouldFindSubscriptionProperty() throws Exception {
    when(subscriptionPropertyController.findSubscriptionProperty(page, size, null, null, null, null,
        null)).thenReturn(subscriptionPropertyPaginated);

    mockMvc.perform(get(URI).param("page", page + "").param("size", size + ""))
        .andExpect(status().isOk());
  }

  @Test
  public void shouldFindSubscriptionPropertyType() throws Exception {
    Map<Integer, String> map = new HashMap<>();
    when(subscriptionPropertyController.findSubscriptionPropertyType()).thenReturn(map);

    mockMvc.perform(get(URI + "/Type")).andExpect(status().isOk());
  }

  @Test
  public void shouldFindEditingForSubscriptionFilter() throws Exception {
    Map<String, String> map = new HashMap<String, String>();
    when(subscriptionPropertyController.findEditingForSubscriptionFilter()).thenReturn(map);
    mockMvc.perform(get(URI + "/EditingSubscriptionFilter")).andExpect(status().isOk());
  }

  @Test
  public void shouldFindInUseOfferings() throws Exception {
    ProductOfferData productOfferData = new ProductOfferData();
    List<ProductOfferData> productOfferDatas = new ArrayList<>();
    productOfferDatas.add(productOfferData);
    PaginatedList<ProductOfferData> paginatedProductOfferData =
        new PaginatedList<ProductOfferData>();
    paginatedProductOfferData.setRecords(productOfferDatas);

    when(subscriptionPropertyController.findInUseOfferings(specId, page, size, null, null, null,
        null, null)).thenReturn(paginatedProductOfferData);

    mockMvc.perform(get(URI + "/InUseOfferings/subscription-property/{specId}", specId)
        .param("page", page + "").param("size", size + "")).andExpect(status().isOk());

  }

  @Test
  public void shouldGetSubscriptionProperty() throws Exception {
    when(subscriptionPropertyController.getSubscriptionProperty(specId))
        .thenReturn(subscriptionProperty);

    mockMvc.perform(get(URI + "/subscription-property/{specId}", specId).param("page", page + "")
        .param("size", size + "")).andExpect(status().isOk());
  }

  @Test
  public void shouldCreateSubscriptionProperty() throws Exception {
    when(subscriptionPropertyController.createSubscriptionProperty(subscriptionProperty))
        .thenReturn(false);

    Gson gson = new Gson();
    String json = gson.toJson(subscriptionProperty);

    mockMvc
        .perform(
            MockMvcRequestBuilders.post(URI).contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldFindSubscriptionPropertyForOfferings() throws Exception {
    subscriptionPropertyController.findSubscriptionPropertyForOfferings(page, size, null, null,
        null, null, null, offerId);

    mockMvc
        .perform(get(URI + "/{offerId}", offerId).param("page", page + "").param("size", size + ""))
        .andExpect(status().isOk());
  }

  @Test
  public void shouldAddSubscriptionPropertyToOfferings() throws Exception {
    List<Integer> specIds = new ArrayList<>();
    specIds.add(specId);
    ResponseModel responseModel = new ResponseModel();
    List<ResponseModel> responseModels = new ArrayList<>();
    responseModels.add(responseModel);
    when(subscriptionPropertyController.addSubscriptionPropertyToOfferings(offerId, specIds))
        .thenReturn(responseModels);

    Gson gson = new Gson();
    String json = gson.toJson(specIds);

    mockMvc
        .perform(MockMvcRequestBuilders
            .post(URI + "/addSubscriptionPropertyToOfferings/product-offer/{offerId}", offerId)
            .contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

  }

  @Test
  public void shouldGetProductOfferSubscriptionProperties() throws Exception {
    when(subscriptionPropertyController.findProductOfferSubscriptionProperties(offerId, page, size,
        null, null)).thenReturn(subscriptionPropertyPaginated);

    mockMvc.perform(get(URI + "/product-offer/{offerId}", offerId).param("page", page + "")
        .param("size", size + "")).andExpect(status().isOk());
  }

  @Test
  public void shouldDeleteSubscriptionProperty() throws Exception {
    ResponseEntity<Boolean> booleanRsp = new ResponseEntity<Boolean>(HttpStatus.OK);
    when(subscriptionPropertyController.deleteSubscriptionProperty(specId)).thenReturn(booleanRsp);

    mockMvc
        .perform(delete(URI + "/subscription-property/{specId}", specId)
            .accept(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

  }

  @Test
  public void shouldRemoveSubscriptionPropertyFromProductOffer() throws Exception {

    ResponseEntity<Boolean> booleanRsp = new ResponseEntity<Boolean>(HttpStatus.OK);
    when(subscriptionPropertyController.removeSubscriptionPropertyFromProductOffer(offerId, specId))
        .thenReturn(booleanRsp);

    mockMvc.perform(
        delete(URI + "/product-offer/{offerId}/subscription-property/{specId}", offerId, specId)
            .accept(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldGetSubscriptionPropertyForEdit() throws Exception {
    SubscriptionProperty subscriptionProperty = new SubscriptionProperty();
    when(subscriptionPropertyController.getSubscriptionPropertyForEdit(1))
        .thenReturn(subscriptionProperty);
    mockMvc.perform(get(URI + "/subscription-property/details/{specId}", 1))
        .andExpect(status().isOk());
  }

  @Test
  public void shouldupdateSelectiveProductOffer() throws Exception {
    SubscriptionProperty record = new SubscriptionProperty();
    Set<String> fields = new HashSet<>();
    Boolean flag = Boolean.TRUE;

    when(subscriptionPropertyController.updateSubscriptionProperty(record, fields, specId))
        .thenReturn(flag);
    Gson gson = new Gson();
    String json = gson.toJson(record);

    mockMvc
        .perform(MockMvcRequestBuilders.put(URI + "/{specId}", offerId)
            .param("fields", new Gson().toJson(fields)).contentType(MediaType.APPLICATION_JSON)
            .content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }
}
