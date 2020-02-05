package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.multipart.MultipartFile;

import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.model.Description;
import com.ericsson.ecb.common.model.Language;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.Localization;
import com.ericsson.ecb.ui.metraoffer.service.LocalizationService;
import com.google.gson.Gson;

public class LocalizationControllerTest {

  private MockMvc mockMvc;

  @Mock
  private LocalizationService localizationService;

  @InjectMocks
  private LocalizationController localizationController;

  private Integer page = 1;

  private Integer size = 999;

  private final String URI = RestControllerUri.LOCALIZATION;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(localizationController).build();
  }

  @Test
  public void shouldFindLocalization() throws Exception {
    PaginatedList<Localization> localizationList = new PaginatedList<>();
    when(localizationController.findLocalization(page, size, null, null))
        .thenReturn(localizationList);
    mockMvc.perform(get(URI)).andExpect(status().isOk());
  }

  @Test
  public void shouldFindLanguage() throws Exception {
    Collection<Language> languages = new ArrayList<Language>();
    when(localizationController.findLanguage(page, size, null, null)).thenReturn(languages);
    mockMvc.perform(get(URI + "/Language")).andExpect(status().isOk());
  }

  @Test
  public void shouldUpdateLocalization() throws Exception {
    Localization localization = new Localization();
    localization.setPropId(1);
    localization.setPropName("propName");
    localization.setProperty("property");
    localization.setDescId(2);
    Map<String, String> localizationMap = new HashMap<>();
    localizationMap.put("us", "test");
    localization.getLocalizationMap().putAll(localizationMap);

    List<Localization> localizationList = new ArrayList<Localization>();
    localizationList.add(localization);

    Collection<Description> descriptions = new ArrayList<Description>();
    Gson gson = new Gson();
    String json = gson.toJson(localizationList);

    Set<String> selectedLangs = new HashSet<>();;
    selectedLangs.add("us");

    when(localizationService.updateLocalization(localizationList, selectedLangs))
        .thenReturn(descriptions);

    mockMvc
        .perform(MockMvcRequestBuilders.put(URI + "?selectedLangs=us")
            .contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldFindSubscribableItemLocalization() throws Exception {
    PaginatedList<Localization> localizationList = new PaginatedList<>();
    when(localizationController.findSubscribableItemLocalization(1, page, size, null, null))
        .thenReturn(localizationList);
    mockMvc.perform(get(URI + "/subscribable-item/{offerId}", 1)).andExpect(status().isOk());
  }

  @Test
  public void shouldFindPiTemplateLocalization() throws Exception {
    PaginatedList<Localization> localizationList = new PaginatedList<>();
    when(localizationController.findPiTemplateLocalization(1, page, size, null, null))
        .thenReturn(localizationList);
    mockMvc.perform(get(URI + "/pi-template/{piTemplateId}", 1)).andExpect(status().isOk());
  }

  @Test
  public void shouldFindPiInstanceLocalization() throws Exception {
    PaginatedList<Localization> localizationList = new PaginatedList<>();
    when(localizationController.findPiInstanceLocalization(1, page, size, null, null))
        .thenReturn(localizationList);
    mockMvc.perform(get(URI + "/pi-instanceId/{piInstanceId}", 1)).andExpect(status().isOk());
  }

  @Test
  public void shouldGetSubscriptionPropLocalization() throws Exception {
    PaginatedList<Localization> localizationList = new PaginatedList<>();
    when(localizationController.getSubscriptionPropLocalization(1, page, size, null, null))
        .thenReturn(localizationList);
    mockMvc.perform(get(URI)).andExpect(status().isOk());
  }

  @Test
  public void shouldexportToCsv() throws Exception {
    HttpServletResponse response = Mockito.mock(HttpServletResponse.class);
    Set<String> langguageCode = new HashSet<>();;
    langguageCode.add("us");

    localizationService.exportToCsv(response, page, size, null, null, null, langguageCode);

    Gson gson = new Gson();
    HashMap<String, String> fileHeaderMap = new HashMap<>();
    String json = gson.toJson(fileHeaderMap);

    String result = mockMvc
        .perform(MockMvcRequestBuilders.post(URI + "/exportToCsv")
            .contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    Assert.assertNotNull(result);

  }

  @Test
  public void shouldImportFromCsv() throws UnsupportedEncodingException, Exception {
    MultipartFile file1 = Mockito.mock(MultipartFile.class);
    when(localizationService.importFromCsv(file1)).thenReturn(0);
    MockMultipartFile file = new MockMultipartFile("file", "orig", null, "bar".getBytes());
    String result =
        mockMvc.perform(MockMvcRequestBuilders.fileUpload(URI + "/uploadFromCsv").file(file))
            .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    Assert.assertNotNull(result);
  }
}
