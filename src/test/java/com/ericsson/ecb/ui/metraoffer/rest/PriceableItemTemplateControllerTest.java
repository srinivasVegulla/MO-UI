package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.ericsson.ecb.catalog.model.PriceableItemTemplate;
import com.ericsson.ecb.catalog.model.PriceableItemTemplateWithInUse;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemRateTableModel;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemTemplateModel;
import com.ericsson.ecb.ui.metraoffer.model.PricelistModel;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferData;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemTemplateService;

public class PriceableItemTemplateControllerTest {

  private MockMvc mockMvc;

  @Mock
  private PriceableItemTemplateService priceableItemTemplateService;

  @InjectMocks
  private PriceableItemTemplateController priceableItemTemplateController;

  private List<PriceableItemTemplateModel> priceableItemTemplateModels;

  private PaginatedList<PriceableItemTemplateModel> priceableItemTemplateModelPaginated;

  private PaginatedList<ProductOfferData> paginagedProductOfferData;

  private PaginatedList<PricelistModel> paginagedPricelist;

  private PaginatedList<PriceableItemTemplateWithInUse> priceableItemTemplatePaginated;

  private PriceableItemTemplate priceableItemTemplate;

  private Integer page = 1;

  private Integer size = 20;

  private Integer offerId = 1;

  private Integer templateId = 1;
  private Set<Integer> childPiTemplate;

  private final static String URI = RestControllerUri.PRICEABLE_ITEM_TEMPLATE;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(priceableItemTemplateController).build();
    priceableItemTemplateModels = new ArrayList<PriceableItemTemplateModel>();
    PriceableItemTemplateModel priceableItemTemplateModel = new PriceableItemTemplateModel();
    priceableItemTemplateModels.add(priceableItemTemplateModel);
    paginagedProductOfferData = new PaginatedList<>();
    paginagedPricelist = new PaginatedList<>();
    priceableItemTemplateModelPaginated = new PaginatedList<>();
    priceableItemTemplatePaginated = new PaginatedList<>();
    priceableItemTemplate = new PriceableItemTemplate();
  }

  @Test
  public void shouldFindPriceableItemTemplateGridView() throws Exception {
    when(priceableItemTemplateService.findPriceableItemTemplateGridView(page, size, null, null,
        null, null, null)).thenReturn(priceableItemTemplateModelPaginated);
    mockMvc.perform(get(URI + "/GridView").param("page", page + "").param("size", size + ""))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldFindPriceableItemTemplate() throws Exception {
    when(priceableItemTemplateService.findPriceableItemTemplate(page, size, null, null, null, null,
        null)).thenReturn(priceableItemTemplatePaginated);
    mockMvc.perform(get(URI).param("page", page + "").param("size", size + ""))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }


  @Test
  public void shouldFindPriceableItemTemplatesForOfferingsOfPo() throws Exception {
    when(priceableItemTemplateService.findPriceableItemTemplatesForOfferings(false, offerId, page,
        size, null, null, null, null, null)).thenReturn(priceableItemTemplateModelPaginated);
    mockMvc
        .perform(get(URI + "/offering-id/" + offerId).param("isBundle", "false")
            .param("page", page + "").param("size", size + ""))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldFindPriceableItemTemplatesForOfferingsOfBundle() throws Exception {
    when(priceableItemTemplateService.findPriceableItemTemplatesForOfferings(true, offerId, page,
        size, null, null, null, null, null)).thenReturn(priceableItemTemplateModelPaginated);

    mockMvc
        .perform(get(URI + "/offering-id/" + offerId).param("isBundle", "true")
            .param("page", page + "").param("size", size + ""))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));


  }

  @Test
  public void shouldFindInUseOfferings() throws Exception {
    Collection<ProductOfferData> productOffers = new ArrayList<>();
    ProductOfferData productOfferData = new ProductOfferData();
    productOffers.add(productOfferData);
    paginagedProductOfferData.setRecords(productOffers);
    when(priceableItemTemplateService.findInUseOfferings(templateId, page, size, null, null, null,
        null, null)).thenReturn(paginagedProductOfferData);
    mockMvc
        .perform(get(URI + "/InUseOfferings/priceable-item-template/" + "/" + templateId)
            .param("page", page + "").param("size", size + ""))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldFindInUseSharedRateList() throws Exception {
    Collection<PricelistModel> pricelists = new ArrayList<>();
    PricelistModel pricelist = new PricelistModel();
    pricelists.add(pricelist);
    paginagedPricelist.setRecords(pricelists);
    when(priceableItemTemplateService.findInUseSharedRateList(templateId, childPiTemplate, page,
        size, null, null, null, null, null)).thenReturn(paginagedPricelist);
    mockMvc
        .perform(get(URI + "/InUseSharedRateList/priceable-item-template/" + "/" + templateId)
            .accept(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldFindViewChargeType() throws Exception {
    Map<PropertyKind, String> map = new HashMap<>();
    when(priceableItemTemplateService.findViewChargeType()).thenReturn(map);
    mockMvc.perform(get(URI + "/view-type")).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldFindCreateChargeType() throws Exception {
    Map<PropertyKind, String> map = new HashMap<>();
    when(priceableItemTemplateService.findCreateChargeType()).thenReturn(map);
    mockMvc.perform(get(URI + "/create-type")).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shuldGetPriceableItemTemplateDetails() throws Exception {
    Map<PropertyKind, String> map = new HashMap<>();
    PropertyKind recurringKind = PropertyKind.RECURRING;
    when(priceableItemTemplateService.getPriceableItemTemplateDetails(templateId, recurringKind))
        .thenReturn(map);
    mockMvc
        .perform(get(URI + "/priceable-item-template/{templateId}/kind/{kind}", templateId,
            recurringKind))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shuldGetPriceableItemTemplate() throws Exception {
    when(priceableItemTemplateService.getPriceableItemTemplate(templateId))
        .thenReturn(priceableItemTemplate);
    mockMvc.perform(get(URI + "/priceable-item-template/{templateId}", templateId))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shuldDeletePriceableItemTemplate() throws Exception {
    Boolean flag = Boolean.TRUE;
    when(priceableItemTemplateService.deletePriceableItemTemplate(templateId)).thenReturn(flag);
    mockMvc
        .perform(delete(URI + "/priceable-item-template/{templateId}", templateId)
            .accept(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldFindInUseOfferingsOfExtendedProps() throws Exception {
    PropertyKind kind = PropertyKind.DISCOUNT;
    when(priceableItemTemplateService.findInUseOfferingsOfExtendedProps(kind, page, size, null,
        null, null, null, null)).thenReturn(paginagedProductOfferData);
    mockMvc
        .perform(get(URI + "/kind/{kind}", kind).param("page", page + "").param("size", size + ""))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shuldGetRateTableWithDecisionTypeName() throws Exception {
    Integer piId = 1;
    List<PriceableItemRateTableModel> records = new ArrayList<>();
    when(priceableItemTemplateService.getRateTableWithDecisionTypeName(piId)).thenReturn(records);
    mockMvc.perform(get(URI + "/rate-table/{piId}", piId)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

}
