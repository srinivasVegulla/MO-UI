package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.service.ParameterTableService;

public class ParameterTableControllerTest {

  private MockMvc mockMvc;

  @Mock
  private ParameterTableService parameterTableService;

  @InjectMocks
  private ParameterTableController parameterTableController;

  private final static String URI = RestControllerUri.PARAMETER_TABLE;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(parameterTableController).build();
  }

  @Test
  public void shouldGetTableMetadataWithDn() throws Exception {
    when(parameterTableController.getTableMetadataWithDn(1)).thenReturn(new ArrayList<>());
    mockMvc.perform(get(URI + "/metadata/1")).andExpect(status().isOk());
  }

}
