package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.ericsson.ecb.ui.metraoffer.service.MetranetTicketService;

public class MetranetTicketControllerTest {

  private static final String TICKET =
      "RRVtDE9Qgj1%2fM5bsFNOaNbFj1YXM0IJ82s%2b6ya%2bMVragsDfcqvQF4y%2bNCFVOzObw";

  private MockMvc mockMvc;

  @Mock
  private MetranetTicketService metranetTicketService;

  @InjectMocks
  private MetranetTicketController metranetTicketController;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(metranetTicketController).build();
  }

  @Test
  public void shouldGetAccessWithEncryptedJwt() throws Exception {
    when(metranetTicketService.getAccessWithEncryptedJwt(TICKET, false)).thenReturn(null);
    mockMvc.perform(get("/ext/MetranetTicket/encrypted-jwt").param("ticket", TICKET))
        .andExpect(status().isOk());
  }

}
