package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.Collection;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.ericsson.ecb.customer.model.Subscription;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.service.SubscriptionService;

public class SubscriptionControllerTest {

  private MockMvc mockMvc;

  @Mock
  private SubscriptionService subscriptionService;

  @InjectMocks
  private SubscriptionController subscriptionController;

  private Collection<Subscription> subscriptions;

  private Integer page = 0;

  private Integer size = 20;


  private final String URI = RestControllerUri.SUBSCRIPTION;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(subscriptionController).build();
    Subscription subscription = new Subscription();
    subscriptions = new ArrayList<Subscription>();
    subscriptions.add(subscription);
  }

  @Test
  public void shouldFindSubscription() throws Exception {
    when(subscriptionService.findSubscription(page, size, null, null)).thenReturn(subscriptions);
    mockMvc.perform(get(URI).param("page", page + "").param("size", size + ""))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldFindSubscriptionWithSizeZeero() throws Exception {
    when(subscriptionService.findSubscription(page, 0, null, null)).thenReturn(subscriptions);
    mockMvc.perform(get(URI).param("page", page + "").param("size", 0 + ""))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldFindSubscriptionWithSizeNull() throws Exception {
    when(subscriptionService.findSubscription(page, null, null, null)).thenReturn(subscriptions);
    mockMvc.perform(get(URI).param("page", page + "")).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

}
