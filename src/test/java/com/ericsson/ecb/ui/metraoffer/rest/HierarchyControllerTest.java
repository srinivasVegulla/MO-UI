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

import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.TreeNode;
import com.ericsson.ecb.ui.metraoffer.service.HierarchyService;

public class HierarchyControllerTest {

  private MockMvc mockMvc;

  @Mock
  private HierarchyService hierarchyService;

  @InjectMocks
  private HierarchyController hierarchyController;

  private Integer id = 1;

  private final static String URI = RestControllerUri.HIERACHY;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(hierarchyController).build();
  }

  @Test
  public void shouetGetPropertyKindHierarchy() throws Exception {
    when(hierarchyService.getPropertyKindHierarchy(id)).thenReturn(new TreeNode());
    mockMvc.perform(get(URI + "/" + id)).andExpect(status().isOk());
  }

}
