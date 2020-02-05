package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.codehaus.jettison.json.JSONException;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.ericsson.ecb.ui.metraoffer.config.ApplicationListener;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.google.gson.Gson;

public class EcbUiMoControllerTest {

  private MockMvc mockMvc;

  private final String URI = RestControllerUri.ECB_UI_MO;

  @InjectMocks
  private EcbUiMoController ecbUiMoController;

  @Mock
  private ApplicationListener applicationListener;

  @Before
  public void init() throws JSONException {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(ecbUiMoController).build();
  }

  @Test
  public void shouldEcbAppRefresh() throws Exception {
    String value = new String();
    when(applicationListener.ecbAppRefresh()).thenReturn(value);
    Gson gson = new Gson();
    String json = gson.toJson(value);
    mockMvc
        .perform(
            MockMvcRequestBuilders.post(URI).contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }
}
