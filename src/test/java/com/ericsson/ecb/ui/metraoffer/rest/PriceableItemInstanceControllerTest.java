package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

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

import com.ericsson.ecb.catalog.model.PriceableItemInstanceDetails;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemInstanceDetailsModel;
import com.ericsson.ecb.ui.metraoffer.model.ResponseModel;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemInstanceService;
import com.google.gson.Gson;

public class PriceableItemInstanceControllerTest {

  private MockMvc mockMvc;

  @Mock
  private PriceableItemInstanceService priceableItemInstanceService;

  @InjectMocks
  private PriceableItemInstanceController priceableItemInstanceController;

  private Integer offerId = 1;

  private Integer piInstanceId = 1;

  private Integer piTemplateId1 = 1;

  private Integer piTemplateId2 = 1;

  private Integer piTemplateId3 = 1;


  private final static String URI = RestControllerUri.PRICEABLE_ITEM_INSTANCE;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(priceableItemInstanceController).build();
  }

  @Test
  public void shouldGetPriceableItemInstance() throws Exception {
    PriceableItemInstanceDetailsModel priceableItemInstanceDetailsModel =
        new PriceableItemInstanceDetailsModel();
    when(priceableItemInstanceService.getPriceableItemInstance(offerId, piInstanceId))
        .thenReturn(priceableItemInstanceDetailsModel);
    mockMvc.perform(get(URI + "/" + offerId + "/" + piInstanceId)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));

  }

  @Test
  public void shouldDeletePriceableItemInstanceFromOffering() throws Exception {
    when(priceableItemInstanceService.deletePiInstanceByInstanceIdFromOffering(1, 1))
        .thenReturn(true);
    String result = mockMvc
        .perform(delete(URI + "/{offerId}/pi-instance/{piInstanceId}", offerId, piInstanceId)
            .accept(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    Assert.assertNotNull(result);
  }

  @Test
  public void shouldAddPriceableItemInstanceToOffering() throws Exception {

    PriceableItemInstanceDetails priceableItemInstanceDetails = new PriceableItemInstanceDetails();
    priceableItemInstanceDetails.setOfferId(1);

    when(priceableItemInstanceService.addPriceableItemInstanceToOffering(offerId, piTemplateId1))
        .thenReturn(true);

    String result = mockMvc
        .perform(MockMvcRequestBuilders
            .post(URI + "/{offerId}/pi-template/{piTemplateId}", offerId, piTemplateId1)
            .accept(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    Assert.assertNotNull(result);
  }

  @Test
  public void shouldAddPriceableItemInstanceListToOffering() throws Exception {
    List<Integer> piTemplateIdList = new ArrayList<Integer>();
    piTemplateIdList.add(piTemplateId1);
    piTemplateIdList.add(piTemplateId2);
    piTemplateIdList.add(piTemplateId3);
    ResponseModel responseModel = new ResponseModel();
    responseModel.setCode(200);
    List<ResponseModel> responseModels = new ArrayList<ResponseModel>();
    responseModels.add(responseModel);

    when(priceableItemInstanceService.addPriceableItemInstanceListToOffering(offerId,
        piTemplateIdList)).thenReturn(responseModels);

    Gson gson = new Gson();
    String json = gson.toJson(piTemplateIdList);

    String result = mockMvc
        .perform(MockMvcRequestBuilders.post(URI + "/{offerId}", offerId)
            .contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    Assert.assertNotNull(result);
  }

  @Test
  public void shouldUpdatePriceableItemInstanceDetails() throws Exception {

    PriceableItemInstanceDetails priceableItemInstanceDetails = new PriceableItemInstanceDetails();
    priceableItemInstanceDetails.setOfferId(1);
    priceableItemInstanceDetails.setPricelistId(3);
    priceableItemInstanceDetails.setPiInstanceParentId(2);

    Boolean record = Boolean.TRUE;
    when(priceableItemInstanceService.updatePriceableItemInstance(priceableItemInstanceDetails,
        offerId, piInstanceId, new HashSet<String>())).thenReturn(record);

    Gson gson = new Gson();
    String json = gson.toJson(priceableItemInstanceDetails);

    String result = mockMvc
        .perform(MockMvcRequestBuilders
            .put(URI + "/{offerId}/pi-instance/{piInstanceId}", offerId, piInstanceId)
            .param("fields", "properties").contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    Assert.assertNotNull(result);
  }

  @Test
  public void shouldAddPriceableItemInstanceListToProductOffer() throws Exception {
    List<Integer> piTemplateIds = new ArrayList<Integer>();
    piTemplateIds.add(piTemplateId1);
    Gson gson = new Gson();
    String json = gson.toJson(piTemplateIds);
    when(
        priceableItemInstanceService.addPriceableItemInstanceListToOffering(offerId, piTemplateIds))
            .thenReturn(new ArrayList<ResponseModel>());
    mockMvc
        .perform(MockMvcRequestBuilders.post(URI + "/{offerId}", offerId)
            .contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

  }
}
