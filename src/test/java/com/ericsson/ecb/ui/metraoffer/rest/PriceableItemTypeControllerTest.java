package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemTypeModel;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemTypeService;

public class PriceableItemTypeControllerTest {

  private MockMvc mockMvc;

  @InjectMocks
  private PriceableItemTypeController priceableItemTypeController;

  @Mock
  private PriceableItemTypeService priceableItemTypeService;

  private PriceableItemTypeModel priceableItemTypeModel;

  private List<PriceableItemTypeModel> priceableItemTypeModelList;

  private PaginatedList<PriceableItemTypeModel> paginatedPriceableItemTypeModel;

  private Integer page = 1;

  private Integer size = 20;

  private final static String URI = RestControllerUri.PRICEABLE_ITEM_TYPE;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(priceableItemTypeController).build();
    priceableItemTypeModel = new PriceableItemTypeModel();
    priceableItemTypeModelList = new ArrayList<>();
    priceableItemTypeModelList.add(priceableItemTypeModel);
    paginatedPriceableItemTypeModel = new PaginatedList<>();
    paginatedPriceableItemTypeModel.setRecords(priceableItemTypeModelList);
  }

  @Test
  public void shouldFindPriceableItemType() throws Exception {
    when(priceableItemTypeService.findPriceableItemType(page, size, null, null, null, null, null))
        .thenReturn(paginatedPriceableItemTypeModel);
    mockMvc.perform(get(URI).param("page", page + "").param("size", size + ""))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }
}
