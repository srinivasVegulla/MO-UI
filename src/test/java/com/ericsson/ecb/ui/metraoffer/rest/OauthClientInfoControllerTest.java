package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.HashMap;
import java.util.Map;

import org.codehaus.jettison.json.JSONException;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.OauthClientInfoServiceImpl;

public class OauthClientInfoControllerTest {

  private MockMvc mockMvc;

  @InjectMocks
  private OauthClientInfoController oauthClientInfoController;

  @Mock
  private OauthClientInfoServiceImpl oauthClientInfoServiceImpl;

  private final String URI = RestControllerUri.OAUTH_CLIENT_INFO;

  private Map<String, String> map = new HashMap<>();

  @Before
  public void init() throws JSONException {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(oauthClientInfoController).build();
  }

  @Test
  public void shouldGetLegacyClientInfo() throws Exception {
    when(oauthClientInfoServiceImpl.getLegacyClientInfo()).thenReturn(map);
    mockMvc.perform(get(URI + "/legacy")).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldGetTicketClientInfo() throws Exception {
    when(oauthClientInfoServiceImpl.getTicketClientInfo()).thenReturn(map);
    mockMvc.perform(get(URI + "/ticket")).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldGetTrustedClientInfo() throws Exception {
    when(oauthClientInfoServiceImpl.getTrustedClientInfo()).thenReturn(map);
    mockMvc.perform(get(URI + "/trusted")).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }
}
