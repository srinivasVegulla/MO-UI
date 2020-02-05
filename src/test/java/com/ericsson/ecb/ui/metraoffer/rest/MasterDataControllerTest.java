package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Collection;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.ericsson.ecb.common.model.EnumData;
import com.ericsson.ecb.customer.model.BusinessPartition;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.CurrenciesAndPartitions;
import com.ericsson.ecb.ui.metraoffer.service.MasterDataService;

public class MasterDataControllerTest {

  private MockMvc mockMvc;

  @Mock
  private MasterDataService masterDataService;

  @InjectMocks
  private MasterDataController masterDataController;

  private Collection<EnumData> enumDataCollection;

  private Collection<BusinessPartition> businessPartionCollection;

  private CurrenciesAndPartitions currenciesAndPartitions;

  private final static String URI = RestControllerUri.MASTER_DATA;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(masterDataController).build();
  }

  @Test
  public void shouldFindCurrencies() throws Exception {
    when(masterDataService.getCurrencies()).thenReturn(enumDataCollection);
    mockMvc.perform(get(URI + "/Currencies")).andExpect(status().isOk());
  }

  @Test
  public void shouldFindPartitions() throws Exception {
    when(masterDataService.getUserPartitions()).thenReturn(businessPartionCollection);
    mockMvc.perform(get(URI + "/Partitions")).andExpect(status().isOk());
  }

  @Test
  public void shouldFindCurrenciesAndPartitions() throws Exception {
    when(masterDataService.findCurrenciesAndPartitions()).thenReturn(currenciesAndPartitions);
    mockMvc.perform(get(URI + "/CurrenciesAndPartitions")).andExpect(status().isOk());
  }

}
