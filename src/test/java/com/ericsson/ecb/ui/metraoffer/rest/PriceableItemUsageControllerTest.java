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

import com.ericsson.ecb.catalog.model.UsagePriceableItemTemplate;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.UsagePriceableItemModel;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemUsageService;
import com.google.gson.Gson;

public class PriceableItemUsageControllerTest {

  private MockMvc mockMvc;

  @InjectMocks
  private PriceableItemUsageController priceableItemUsageController;

  @Mock
  private PriceableItemUsageService priceableItemUsageService;

  private UsagePriceableItemModel usagePriceableItemModel;

  private UsagePriceableItemTemplate usagePriceableItemTemplate;

  private Integer templateId = 1;

  private Integer piId = 1;

  private final static String URI = RestControllerUri.USAGE;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(priceableItemUsageController).build();
    usagePriceableItemModel = new UsagePriceableItemModel();
    usagePriceableItemTemplate = new UsagePriceableItemTemplate();
  }

  @Test
  public void shouldGetUsagePriceableItemDetailsWithChilds() throws Exception {
    when(priceableItemUsageService.getUsagePriceableItemDetailsWithChilds(templateId))
        .thenReturn(usagePriceableItemModel);
    mockMvc.perform(get(URI + "/details/{templateId}", templateId)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldFindUsagePriceableItem() throws Exception {
    PaginatedList<UsagePriceableItemTemplate> records = new PaginatedList<>();
    when(priceableItemUsageService.findUsagePriceableItem(1, Integer.MAX_VALUE, null, null, null,
        null, null)).thenReturn(records);
    mockMvc.perform(get(URI).param("page", 1 + "").param("size", Integer.MAX_VALUE + ""))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldGetUsagePriceableItem() throws Exception {
    when(priceableItemUsageService.getUsagePriceableItem(piId))
        .thenReturn(usagePriceableItemTemplate);
    mockMvc.perform(get(URI + "/{propId}", piId)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldUpdateUsagePriceableItem() throws Exception {
    UsagePriceableItemTemplate usagePriceableItemTemplate = new UsagePriceableItemTemplate();
    Boolean record = Boolean.TRUE;
    Integer propId = 1;
    Set<String> fields = new HashSet<>();
    when(priceableItemUsageService.updateUsagePriceableItem(usagePriceableItemTemplate, fields,
        propId)).thenReturn(record);
    Gson gson = new Gson();
    String json = gson.toJson(usagePriceableItemTemplate);
    mockMvc
        .perform(MockMvcRequestBuilders.put(URI + "/update-fields/{propId}", propId)
            .param("fields", new Gson().toJson(fields)).contentType(MediaType.APPLICATION_JSON)
            .content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }
}
