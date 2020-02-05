package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;

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
import com.ericsson.ecb.ui.metraoffer.model.ParamTableRateSchedule;
import com.ericsson.ecb.ui.metraoffer.model.RateScheduleDto;
import com.ericsson.ecb.ui.metraoffer.model.RateScheduleSetDto;
import com.ericsson.ecb.ui.metraoffer.model.RatesDto;
import com.ericsson.ecb.ui.metraoffer.model.ResponseModel;
import com.ericsson.ecb.ui.metraoffer.service.RateScheduleService;
import com.google.gson.Gson;

public class RateScheduleControllerTest {

  private MockMvc mockMvc;

  @Mock
  private RateScheduleService rateScheduleService;

  @InjectMocks
  private RateScheduleController rateScheduleController;

  private RateScheduleDto rateScheduleDto;

  private RatesDto ratesDTO;

  private Integer offerId = 1;
  private Integer piInstanceId = 2;
  private Integer paramTableId = 3;
  private Integer itemTemplateId = 4;
  private Integer pricelistId = 5;
  private Integer scheduleId = 1;
  private String paramTableName = "metratech.com/rateconn";

  private final static String URI = RestControllerUri.RATE_SCHEDULE;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(rateScheduleController).build();
    rateScheduleDto = new RateScheduleDto();
  }

  @Test
  public void shouldFindRates() throws Exception {
    when(rateScheduleService.getRates(offerId, piInstanceId, false)).thenReturn(ratesDTO);
    mockMvc.perform(get(URI + "/Rates/" + offerId + "/" + piInstanceId)).andExpect(status().isOk());
  }

  @Test
  public void shouldGetRateSchedules() throws Exception {
    when(rateScheduleService.getRateSchedules(paramTableId, itemTemplateId, pricelistId, 1,
        Integer.MAX_VALUE, null)).thenReturn(ratesDTO);
    mockMvc.perform(get(URI + "/" + paramTableId + "/" + itemTemplateId + "/" + pricelistId))
        .andExpect(status().isOk());
  }

  @Test
  public void shouldCreateRateSchedule() throws Exception {
    Gson gson = new Gson();
    String json = gson.toJson(rateScheduleDto);

    String result = mockMvc
        .perform(
            MockMvcRequestBuilders.post(URI).contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    Assert.assertNotNull(result);
  }

  @Test
  public void shouldDeleteRateSchedule() throws Exception {
    ResponseEntity<Boolean> responseEntity = new ResponseEntity<Boolean>(true, HttpStatus.OK);
    when(rateScheduleService.removeRateSchedule(scheduleId)).thenReturn(responseEntity);
    mockMvc.perform(delete(URI + "/" + scheduleId)).andExpect(status().isOk());
  }

  @Test
  public void shouldEditRateScheduleSet() throws Exception {
    RateScheduleSetDto rateScheduleSetDto = new RateScheduleSetDto();
    Gson gson = new Gson();
    String json = gson.toJson(rateScheduleSetDto);
    when(rateScheduleService.editRateScheduleSet(rateScheduleSetDto))
        .thenReturn(new ArrayList<ResponseModel>());
    mockMvc.perform(put(URI + "/all").contentType(MediaType.APPLICATION_JSON_UTF8).content(json))
        .andExpect(status().isOk());
  }

  @Test
  public void shouldGetParameterTableRateSchedules() throws Exception {
    when(rateScheduleService.getParameterTableRateSchedules(50, 1, paramTableName, 1,
        Integer.MAX_VALUE, null, null, null, null, null))
            .thenReturn(new PaginatedList<ParamTableRateSchedule>());
    mockMvc.perform(
        get(URI + "/param-table-id/" + 50 + "/schedule-id/" + 1).param("ptName", paramTableName))
        .andExpect(status().isOk());
  }
}
