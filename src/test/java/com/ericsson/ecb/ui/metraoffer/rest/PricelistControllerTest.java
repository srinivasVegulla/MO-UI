package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;

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

import com.ericsson.ecb.catalog.model.LocalizedPricelist;
import com.ericsson.ecb.catalog.model.Pricelist;
import com.ericsson.ecb.catalog.model.PricelistWithInUse;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.customer.model.AccInfoForInUseRates;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.PricelistDto;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferData;
import com.ericsson.ecb.ui.metraoffer.model.ResponseModel;
import com.ericsson.ecb.ui.metraoffer.model.SharedPricelistDto;
import com.ericsson.ecb.ui.metraoffer.model.TemplateParameterTableMappingDto;
import com.ericsson.ecb.ui.metraoffer.model.TreeNode;
import com.ericsson.ecb.ui.metraoffer.service.PricelistService;
import com.google.gson.Gson;

public class PricelistControllerTest {

  private MockMvc mockMvc;

  @Mock
  private PricelistService pricelistService;

  @InjectMocks
  private PricelistController pricelistController;

  private static final Integer PRICELIST_ID = 1;

  private final static String URI = RestControllerUri.PRICELIST;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(pricelistController).build();
  }

  @Test
  public void shouldFindPricelist() throws Exception {
    PaginatedList<Pricelist> paginatedPricelist = new PaginatedList<Pricelist>();
    when(pricelistService.findPricelist(1, 20, null, null, null, null, null))
        .thenReturn(paginatedPricelist);
    mockMvc.perform(get(URI).param("page", 1 + "").param("size", 20 + ""))
        .andExpect(status().isOk());
  }

  @Test
  public void shouldFindSharedPricelist() throws Exception {
    PaginatedList<PricelistWithInUse> paginatedPricelist = new PaginatedList<PricelistWithInUse>();
    when(pricelistService.findSharedPricelist(1, 20, null, null, null, null, null))
        .thenReturn(paginatedPricelist);
    mockMvc.perform(get(URI + "/shared").param("page", 1 + "").param("size", 20 + ""))
        .andExpect(status().isOk());
  }

  @Test
  public void shouldFindInUseOfferings() throws Exception {
    PaginatedList<ProductOfferData> paginatedPricelist = new PaginatedList<>();
    when(pricelistService.findInUseOfferings(null, 1, 20, null, null, null, null, null))
        .thenReturn(paginatedPricelist);
    mockMvc
        .perform(
            get(URI + "/offerings/" + PRICELIST_ID).param("page", 1 + "").param("size", 20 + ""))
        .andExpect(status().isOk());
  }

  @Test
  public void shouldFindInUseSubscribers() throws Exception {
    PaginatedList<AccInfoForInUseRates> accInfoForInUseRates =
        new PaginatedList<AccInfoForInUseRates>();
    when(pricelistService.findInUseSubscribers(1, 20, null, "pricelistId==" + PRICELIST_ID))
        .thenReturn(accInfoForInUseRates);
    mockMvc.perform(get(URI + "/subscribers/").param("page", 1 + "").param("size", 20 + ""))
        .andExpect(status().isOk());
  }

  @Test
  public void shouldDeletePricelist() throws Exception {
    ResponseEntity<Boolean> responseEntity = new ResponseEntity<Boolean>(true, HttpStatus.OK);
    when(pricelistService.deletePricelist(PRICELIST_ID)).thenReturn(responseEntity);
    mockMvc.perform(delete(URI + "/" + PRICELIST_ID)).andExpect(status().isOk());
  }

  @Test
  public void shouldCreatePricelist() throws Exception {
    LocalizedPricelist pricelist = new LocalizedPricelist();
    Gson gson = new Gson();
    String json = gson.toJson(pricelist);
    when(pricelistService.createPricelist(pricelist))
        .thenReturn(new ResponseEntity<Pricelist>(HttpStatus.OK));
    mockMvc.perform(post(URI).contentType(MediaType.APPLICATION_JSON_UTF8).content(json))
        .andExpect(status().isOk());
  }

  @Test
  public void shouldCopyPriceList() throws Exception {
    Integer pricelistId = 1;
    LocalizedPricelist pricelist = new LocalizedPricelist();
    Gson gson = new Gson();
    String json = gson.toJson(pricelist);
    when(pricelistService.copyPriceList(pricelistId, pricelist))
        .thenReturn(new ResponseEntity<Pricelist>(HttpStatus.OK));
    mockMvc.perform(
        post(URI + "/" + pricelistId).contentType(MediaType.APPLICATION_JSON_UTF8).content(json))
        .andExpect(status().isOk());
  }

  @Test
  public void shouldUpdatePricelist() throws Exception {
    Pricelist pricelist = new Pricelist();
    pricelist.setPricelistId(1);
    Gson gson = new Gson();
    String json = gson.toJson(pricelist);
    when(pricelistService.updatePricelist(pricelist))
        .thenReturn(new ResponseEntity<Pricelist>(HttpStatus.OK));
    mockMvc.perform(put(URI).contentType(MediaType.APPLICATION_JSON_UTF8).content(json))
        .andExpect(status().isOk());
  }

  @Test
  public void shouldGetPricelist() throws Exception {
    PricelistDto pricelistDto = new PricelistDto();
    pricelistDto.setPricelistId(850);
    Gson gson = new Gson();
    String json = gson.toJson(pricelistDto);
    when(pricelistService.getPricelist(850)).thenReturn(pricelistDto);
    mockMvc.perform(
        get(URI + "/" + PRICELIST_ID).contentType(MediaType.APPLICATION_JSON_UTF8).content(json))
        .andExpect(status().isOk());
  }

  @Test
  public void shouldGetMappedParameterTables() throws Exception {
    List<TreeNode> treeNodes = new ArrayList<>();
    when(pricelistService.getMappedParameterTables(PRICELIST_ID, 1, 2, 10)).thenReturn(treeNodes);
    mockMvc.perform(get(URI + "/mapped-param-tables/" + PRICELIST_ID)).andExpect(status().isOk());
  }

  @Test
  public void shouldGetPricelistPriceableItemParamTableMapping() throws Exception {
    PaginatedList<TemplateParameterTableMappingDto> paginatedList = new PaginatedList<>();
    when(pricelistService.getPricelistPriceableItemParamTableMapping(PRICELIST_ID, null, 1,
        Integer.MAX_VALUE, null, null, null, null, null)).thenReturn(paginatedList);
    mockMvc.perform(get(URI + "/param-table-mapping/" + PRICELIST_ID)).andExpect(status().isOk());
  }

  @Test
  public void shouldAddParameterTables() throws Exception {
    SharedPricelistDto sharedPricelistDto = new SharedPricelistDto();
    List<SharedPricelistDto> sharedPricelistList = new ArrayList<>();
    sharedPricelistList.add(sharedPricelistDto);
    when(pricelistService.addParameterTables(sharedPricelistList))
        .thenReturn(new ArrayList<ResponseModel>());
    Gson gson = new Gson();
    String json = gson.toJson(sharedPricelistList);
    String result = mockMvc
        .perform(MockMvcRequestBuilders.post(URI + "/add-param-tables")
            .contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    Assert.assertNotNull(result);
  }

  @Test
  public void shouldGetSharedPricelist() throws Exception {
    PricelistDto pricelistDto = new PricelistDto();
    pricelistDto.setPricelistId(850);
    Gson gson = new Gson();
    String json = gson.toJson(pricelistDto);
    when(pricelistService.getSharedPricelist(850)).thenReturn(pricelistDto);
    mockMvc.perform(get(URI + "/shared/" + PRICELIST_ID)
        .contentType(MediaType.APPLICATION_JSON_UTF8).content(json)).andExpect(status().isOk());
  }

  @Test
  public void shouldGetSharedRateInUseInfo() throws Exception {
    PricelistWithInUse pricelistWithInUse = new PricelistWithInUse();
    pricelistWithInUse.setPricelistId(850);
    Gson gson = new Gson();
    String json = gson.toJson(pricelistWithInUse);
    when(pricelistService.getSharedRateInUseInfo(850)).thenReturn(pricelistWithInUse);
    mockMvc.perform(get(URI + "/inUseInfo/" + PRICELIST_ID)
        .contentType(MediaType.APPLICATION_JSON_UTF8).content(json)).andExpect(status().isOk());
  }

  @Test
  public void shouldFindRqrdSharedPricelist() throws Exception {
    PaginatedList<PricelistWithInUse> pgList = new PaginatedList<>();
    Gson gson = new Gson();
    String json = gson.toJson(pgList);
    when(pricelistService.findRqrdSharedPricelist(1, 2)).thenReturn(pgList);
    mockMvc.perform(get(URI + "/rqrdSharedPricelist/item-template-id/1/paramtable-id/2")
        .contentType(MediaType.APPLICATION_JSON_UTF8).content(json)).andExpect(status().isOk());
  }
}
