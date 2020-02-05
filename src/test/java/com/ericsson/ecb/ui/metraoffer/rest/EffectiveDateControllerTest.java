package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.OffsetDateTime;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.ericsson.ecb.catalog.model.EffectiveDate;
import com.ericsson.ecb.catalog.model.instance.EffectiveDateMode;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.service.EffectiveDateService;

public class EffectiveDateControllerTest {
  private MockMvc mockMvc;

  @Mock
  private EffectiveDateService effectiveDateService;

  @InjectMocks
  private EffectiveDateController effectiveDateController;

  private EffectiveDate effectiveDate;

  private JSONObject record;

  private final static String URI = RestControllerUri.EFFECTIVE_DATE;

  @Before
  public void init() throws JSONException {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(effectiveDateController).build();
    record = new JSONObject();
    record.put("beginType", "EXPLICIT_DATE");
    record.put("effDateId", 725);
    record.put("endType", "EXPLICIT_DATE");
    record.put("startDate", "2017-07-10T10:29:47.137Z");
    record.put("endDate", "2017-07-10T10:29:47.137Z");

    effectiveDate = new EffectiveDate();
    effectiveDate.setEffDateId(1);
    effectiveDate.setStartDate(OffsetDateTime.now());
    effectiveDate.setEndDate(OffsetDateTime.now());
    effectiveDate.setBeginType(EffectiveDateMode.EXPLICIT_DATE);
    effectiveDate.setEndType(EffectiveDateMode.EXPLICIT_DATE);
  }

  @Test
  public void shouldUpdateEffectiveDateWithNull() throws Exception {
    when(effectiveDateService.updateEffectiveDate(effectiveDate, 1)).thenReturn(effectiveDate);
    mockMvc.perform(
        put(URI + "/" + 1).contentType(MediaType.APPLICATION_JSON_UTF8).content(record.toString()))
        .andExpect(status().isOk());
  }

  @Test
  public void shouldUpdateEffectiveDate() throws Exception {
    effectiveDate.setBeginoffset(0);
    effectiveDate.setEndoffset(0);
    record.put("endoffset", 0);
    record.put("beginoffset", 0);
    when(effectiveDateService.updateEffectiveDate(effectiveDate, 1)).thenReturn(effectiveDate);
    mockMvc.perform(
        put(URI + "/" + 1).contentType(MediaType.APPLICATION_JSON_UTF8).content(record.toString()))
        .andExpect(status().isOk());
  }

}
