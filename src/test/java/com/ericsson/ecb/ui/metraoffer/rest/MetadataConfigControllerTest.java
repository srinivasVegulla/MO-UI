package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.metadata.model.DefineService;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.service.MetadataConfigService;

public class MetadataConfigControllerTest {

  private MockMvc mockMvc;

  @Mock
  private MetadataConfigService metadataConfigService;

  @InjectMocks
  private MetadataConfigController metadataConfigController;


  private final static String URI = RestControllerUri.META_DATA_CONFIG;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(metadataConfigController).build();
  }

  @Test
  public void shouldGetExtendedPropsMetadata() throws Exception {
    when(metadataConfigService.getExtendedPropsMetadata(PropertyKind.OFFERING))
        .thenReturn(new DefineService());
    mockMvc.perform(get(URI + "/extended-props/" + PropertyKind.OFFERING))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

}
