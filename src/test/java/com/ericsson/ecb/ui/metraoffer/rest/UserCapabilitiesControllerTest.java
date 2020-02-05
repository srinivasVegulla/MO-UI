package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

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
import com.ericsson.ecb.ui.metraoffer.service.UserCapabilitiesService;

public class UserCapabilitiesControllerTest {

	private final String URI = RestControllerUri.USER_CAPABILITIES;
	private MockMvc mockMvc;

	@InjectMocks
	private UserCapabilitiesController userCapabilitiesController;

	@Mock
	private UserCapabilitiesService userCapabiltiesService;

	private static final String ENTITY = "UIPOGrid";

	private static final String FEATURE = "Create";

	@Before
	public void init() throws JSONException {
		MockitoAnnotations.initMocks(this);
		mockMvc = MockMvcBuilders.standaloneSetup(userCapabilitiesController).build();
	}

	@Test
	public void testFindUiCapabilities() throws Exception {
		HttpServletRequest httpServletRequest = mock(HttpServletRequest.class);
		Map<String, Map<String, Boolean>> records = new HashMap<>();
		when(userCapabiltiesService.findUserCapabilities(httpServletRequest)).thenReturn(records);
		mockMvc.perform(get(URI)).andExpect(status().isOk());
	}

	@Test
	public void testFindUserCapabilitiesPerFeatur() throws Exception {
		HttpServletRequest httpServletRequest = mock(HttpServletRequest.class);
		Boolean userCapabilityResponse = Boolean.TRUE;
		when(userCapabiltiesService.findUserCapabilitiesPerFeature(httpServletRequest, ENTITY, FEATURE))
				.thenReturn(userCapabilityResponse);
		mockMvc.perform(get(URI + "/feature/").param("entity", ENTITY + "").param("feature", FEATURE + ""))
				.andExpect(status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
	}

}
