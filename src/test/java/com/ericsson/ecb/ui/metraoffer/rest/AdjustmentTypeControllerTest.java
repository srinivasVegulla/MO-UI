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

import com.ericsson.ecb.catalog.model.AdjustmentType;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.AdjustmentTypeModel;
import com.ericsson.ecb.ui.metraoffer.service.AdjustmentTypeService;

public class AdjustmentTypeControllerTest {

  private MockMvc mockMvc;

  @InjectMocks
  private AdjustmentTypeController adjustmentTypeController;

  @Mock
  private AdjustmentTypeService adjustmentTypeService;

  private AdjustmentType adjustmentType;

  private AdjustmentTypeModel adjustmentTypeModel;

  private List<AdjustmentType> adjustmentTypeList;

  private List<AdjustmentTypeModel> adjustmentTypeModelList;

  private PaginatedList<AdjustmentType> paginatedAdjustmentType;

  private PaginatedList<AdjustmentTypeModel> paginatedAdjustmentTypeModel;

  private Integer piId = 1;

  private final static String URI = RestControllerUri.ADJUSTMENT_TYPE;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(adjustmentTypeController).build();
    adjustmentType = new AdjustmentType();
    adjustmentTypeModel = new AdjustmentTypeModel();
    adjustmentTypeList = new ArrayList<>();
    adjustmentTypeModelList = new ArrayList<>();
    adjustmentTypeList.add(adjustmentType);
    adjustmentTypeModelList.add(adjustmentTypeModel);
    paginatedAdjustmentType = new PaginatedList<>();
    paginatedAdjustmentTypeModel = new PaginatedList<>();
    paginatedAdjustmentType.setRecords(adjustmentTypeList);

    paginatedAdjustmentTypeModel.setRecords(adjustmentTypeModelList);
  }

 @Test
  public void shouldFindAdjustment() throws Exception {
    when(adjustmentTypeController.findAdjustmentType(1, 25, null, null, null, null, null))
        .thenReturn(paginatedAdjustmentTypeModel);
    mockMvc.perform(get(URI).param("page", 1 + "").param("size", 25 + ""))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldGetAdjustmentWithReasonCode() throws Exception {
    when(adjustmentTypeController.getAdjustmentType(piId)).thenReturn(paginatedAdjustmentType);
    mockMvc.perform(get(URI + "/{piId}", piId)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }
}
