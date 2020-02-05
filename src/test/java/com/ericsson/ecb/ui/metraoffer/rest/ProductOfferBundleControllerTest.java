package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
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

import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.PricelistMappingModel;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferBundleData;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferData;
import com.ericsson.ecb.ui.metraoffer.model.ResponseModel;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemInstanceService;
import com.ericsson.ecb.ui.metraoffer.service.ProductOfferBundleService;
import com.ericsson.ecb.ui.metraoffer.service.ProductOfferService;
import com.google.gson.Gson;

public class ProductOfferBundleControllerTest {

  private MockMvc mockMvc;

  @Mock
  private ProductOfferBundleService productOfferBundleService;

  @Mock
  private PriceableItemInstanceService priceableItemInstanceService;

  @Mock
  private ProductOfferService productOfferService;

  @InjectMocks
  private ProductOfferBundleController productOfferBundleController;

  private ProductOfferBundleData productOfferBundleData;

  private List<ProductOfferData> productOfferDataList;

  private List<Integer> offerIdList;

  private Integer offerId = 1;
  private Integer bundleId = 1;

  private static final String URI = RestControllerUri.PRODUCT_OFFER_BUNDLE;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    this.mockMvc = MockMvcBuilders.standaloneSetup(productOfferBundleController).build();
    productOfferBundleData = new ProductOfferBundleData();
    productOfferBundleData.setOfferId(offerId);
    productOfferDataList = new ArrayList<ProductOfferData>();
    productOfferDataList.add(productOfferBundleData);

    offerIdList = new ArrayList<Integer>();
    offerIdList.add(offerId);
  }

  @Test
  public void shouldGetProductOfferBundle() throws Exception {
    when(productOfferBundleController.getProductOfferBundle(offerId))
        .thenReturn(productOfferBundleData);
    mockMvc.perform(get(URI + "/" + offerId)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldGetProductOffersInBundle() throws Exception {
    when(productOfferBundleController.getProductOffersInBundle(offerId))
        .thenReturn(productOfferDataList);
    mockMvc.perform(get(URI + "/ProductOffers/" + offerId)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldGetPriceableItemsInBundle() throws Exception {
    PricelistMappingModel pricelistMappingModel = new PricelistMappingModel();
    when(productOfferBundleController.getPriceableItemsInBundle(offerId))
        .thenReturn(pricelistMappingModel);
    mockMvc.perform(get(URI + "/PriceableItems/" + offerId)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldAddProductOffersToBundle() throws Exception {
    Boolean flag = Boolean.TRUE;
    when(productOfferBundleController.addProductOffersToBundle(offerId, offerIdList))
        .thenReturn(flag);
    Gson gson = new Gson();
    String json = gson.toJson(offerIdList);
    mockMvc
        .perform(MockMvcRequestBuilders.post(URI + "/{bundleId}", offerId)
            .contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldRemoveProductOfferFromBundle() throws Exception {
    Boolean flag = Boolean.TRUE;
    when(productOfferBundleController.removeProductOfferFromBundle(bundleId, offerId))
        .thenReturn(flag);
    mockMvc
        .perform(delete(URI + "/{bundleId}/offerId/{offerId}", bundleId, offerId)
            .accept(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldUpdatePoOptionality() throws Exception {
    Boolean optionality = Boolean.TRUE;
    Boolean flag = Boolean.TRUE;
    when(productOfferBundleController.updatePoOptionality(bundleId, offerId, optionality))
        .thenReturn(flag);
    String result = mockMvc
        .perform(MockMvcRequestBuilders
            .put(URI + "/{bundleId}/offerId/{offerId}/optionality/{optionality}", bundleId, offerId,
                optionality)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    Assert.assertNotNull(result);

  }

  @Test
  public void shouldAddPriceableItemInstanceListToOffering() throws Exception {
    List<Integer> piTemplateIdList = new ArrayList<Integer>();
    piTemplateIdList.add(1);
    piTemplateIdList.add(2);
    ResponseModel responseModel = new ResponseModel();
    responseModel.setCode(200);
    List<ResponseModel> responseModels = new ArrayList<ResponseModel>();
    responseModels.add(responseModel);
    when(productOfferBundleController.addPriceableItemsToBundle(bundleId, piTemplateIdList))
        .thenReturn(responseModels);
    Gson gson = new Gson();
    String json = gson.toJson(piTemplateIdList);

    String result = mockMvc
        .perform(MockMvcRequestBuilders.post(URI + "/PriceableItems/{bundleId}", bundleId)
            .contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    Assert.assertNotNull(result);
  }

  @Test
  public void shouldDeletePiInstanceByInstanceIdFromOffering() throws Exception {
    Integer piInstanceId = 1;
    when(productOfferBundleController.deletePiInstanceByInstanceIdFromOffering(1, 1))
        .thenReturn(true);
    String result = mockMvc
        .perform(delete(URI + "/PriceableItems/{bundleId}/pi-instance/{piInstanceId}", bundleId,
            piInstanceId).accept(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    Assert.assertNotNull(result);
  }

  @Test
  public void shouldHideProductOffer() throws Exception {
    ResponseEntity<Boolean> flag = new ResponseEntity<Boolean>(true, HttpStatus.OK);
    Boolean hide = true;
    when(productOfferBundleController.hideProductOffer(offerId, hide)).thenReturn(flag);
    String result = mockMvc
        .perform(MockMvcRequestBuilders.put(URI + "/{offerId}/hide/?hide=" + hide, offerId)
            .accept(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    Assert.assertNotNull(result);
  }

  @Test
  public void shouldupdateSelectiveProductOffer() throws Exception {
    ProductOfferBundleData record = new ProductOfferBundleData();
    Map<String, ProductOfferBundleData> recordsMap = new HashMap<String, ProductOfferBundleData>();
    Set<String> fields = new HashSet<>();
    Boolean flag = Boolean.TRUE;
    when(productOfferBundleController.updateSelectiveProductOffer(recordsMap, fields, bundleId))
        .thenReturn(flag);
    Gson gson = new Gson();
    String json = gson.toJson(record);

    mockMvc
        .perform(MockMvcRequestBuilders.put(URI + "/update-fields/{offerId}", bundleId)
            .param("fields", new Gson().toJson(fields)).contentType(MediaType.APPLICATION_JSON)
            .content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldFindProductOffersForBundle() throws Exception {
    PaginatedList<ProductOfferData> paginatedList = new PaginatedList<>();
    when(productOfferBundleController.findProductOffersForBundle(bundleId, 1, Integer.MAX_VALUE,
        null, null, null, null, null)).thenReturn(paginatedList);

    mockMvc.perform(get(URI + "/FindProductOffers/" + bundleId)).andExpect(status().isOk());

  }
}
