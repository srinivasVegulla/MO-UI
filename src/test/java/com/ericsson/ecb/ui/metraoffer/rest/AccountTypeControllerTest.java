package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jettison.json.JSONException;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.service.AccountTypeService;
import com.google.gson.Gson;

public class AccountTypeControllerTest {

  private MockMvc mockMvc;

  @InjectMocks
  private AccountTypeController accountTypeController;
  
  @Mock
  private AccountTypeService accountTypeService;

  private final String URI = RestControllerUri.ACCOUNT_TYPE;

  private Integer bundleId = 1;

  @Before
  public void init() throws JSONException {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(accountTypeController).build();
  }

  @Test
  public void shouldFindAccountTypeEligibility() throws Exception {
    Map<Integer, String> rsp = new HashMap<Integer, String>();
    rsp.put(1, "1");
    rsp.put(2, "2");
    when(accountTypeController.findAccountTypeEligibility()).thenReturn(rsp);
    mockMvc.perform(get(URI)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldGetAccountTypeEligibilityInProductOffer() throws Exception {
    Map<Integer, String> rsp = new HashMap<Integer, String>();
    rsp.put(1, "1");
    rsp.put(2, "2");
    when(accountTypeController.getAccountTypeEligibilityInProductOffer(bundleId)).thenReturn(rsp);
    mockMvc.perform(get(URI + "/{bundleId}", bundleId)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldRemoveAccountTypeEligibilityFromProductOffer() throws Exception {
    Boolean flag = new Boolean(true);
    List<Integer> typeIds = new ArrayList<Integer>();
    typeIds.add(1);
    typeIds.add(2);
    when(accountTypeController.removeAccountTypeEligibilityFromProductOffer(bundleId, typeIds))
        .thenReturn(flag);

    Gson gson = new Gson();
    String json = gson.toJson(typeIds);

    String result = mockMvc
        .perform(MockMvcRequestBuilders.delete(URI + "/{bundleId}", bundleId)
            .contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    Assert.assertNotNull(result);
  }

  @Test
  public void shouldAddAccountTypeEligibilityToProductOffer() throws Exception {
    Boolean flag = new Boolean(true);
    List<Integer> typeIds = new ArrayList<Integer>();
    typeIds.add(1);
    typeIds.add(2);
    when(accountTypeController.addAccountTypeEligibilityToProductOffer(bundleId, typeIds))
        .thenReturn(flag);

    Gson gson = new Gson();
    String json = gson.toJson(typeIds);

    String result = mockMvc
        .perform(MockMvcRequestBuilders.post(URI + "/{bundleId}", bundleId)
            .contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    Assert.assertNotNull(result);
  }


  @Test
  public void shouldemoveAccountTypeEligibilityFromProductOffer() throws Exception {
    Boolean flag = new Boolean(true);
    List<Integer> typeIds = new ArrayList<Integer>();
    typeIds.add(1);
    typeIds.add(2);
    when(accountTypeController.refreshAccountTypeEligibilityProductOffer(bundleId, typeIds))
        .thenReturn(flag);

    Gson gson = new Gson();
    String json = gson.toJson(typeIds);

    String result = mockMvc
        .perform(MockMvcRequestBuilders.put(URI + "/{bundleId}", bundleId)
            .contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    Assert.assertNotNull(result);
  }
}
