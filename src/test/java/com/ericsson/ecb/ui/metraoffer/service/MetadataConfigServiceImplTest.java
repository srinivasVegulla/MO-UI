package com.ericsson.ecb.ui.metraoffer.service;

import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.metadata.client.MetadataConfigClient;
import com.ericsson.ecb.metadata.client.MetadataConfigInterface;
import com.ericsson.ecb.metadata.model.DefineService;
import com.ericsson.ecb.metadata.model.PropertyType;
import com.ericsson.ecb.metadata.model.localization.LocaleEntry;
import com.ericsson.ecb.metadata.model.localization.LocaleSpace;
import com.ericsson.ecb.metadata.model.localization.MtLocalization;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntity;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.MetadataConfigServiceImpl;

public class MetadataConfigServiceImplTest {

  @Mock
  private MetadataConfigInterface metadataConfigInterface;

  @Mock
  private MetadataConfigClient metadataConfigClient;

  @InjectMocks
  private MetadataConfigServiceImpl metadataConfigServiceImpl;

  @Mock
  private LocalizedEntityService localizedEntityService;

  @Mock
  private LocalizedEntity localizedEntity;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void shouldGetExtendedPropsMetadata() throws Exception {
    DefineService defineService = new DefineService();
    ResponseEntity<DefineService> response = new ResponseEntity<>(defineService, HttpStatus.OK);
    when(metadataConfigInterface.getExtendedPropsMetadata(PropertyKind.OFFERING))
        .thenReturn(response);
    metadataConfigServiceImpl.getExtendedPropsMetadata(PropertyKind.OFFERING);
  }

  //@Test
  public void shouldGetPoExtendedProperties() throws Exception {
    Map<String, Object> properties = new HashMap<String, Object>();
    properties.put("glCode", "1123");
    properties.put("ExternalURL", "test");
    MtLocalization mtLocalization = new MtLocalization();
    mtLocalization.setLangCode("us");
    LocaleSpace localeSpace = new LocaleSpace();
    List<LocaleEntry> entries = new ArrayList<>();
    LocaleEntry localeEntry = new LocaleEntry();
    localeEntry.setName("glCode/glCode");
    localeEntry.setValue("1123");
    entries.add(localeEntry);
    localeSpace.setEntries(entries);
    mtLocalization.setLocaleSpace(localeSpace);
    ResponseEntity<MtLocalization> mtLocationRsp =
        new ResponseEntity<>(mtLocalization, HttpStatus.OK);
    when(localizedEntityService.getLoggedInLangCode()).thenReturn("us");
    when(metadataConfigClient.getLocalizationMetadata("SystemConfig", "recurring_us"))
        .thenReturn(mtLocationRsp);

    DefineService defineService = new DefineService();
    List<PropertyType> propertyTypes = new ArrayList<>();
    PropertyType propertyType = new PropertyType();
    propertyType.setDn("dn");
    propertyTypes.add(propertyType);
    defineService.setPropertyTypes(propertyTypes);
    ResponseEntity<DefineService> response = new ResponseEntity<>(defineService, HttpStatus.OK);
    when(metadataConfigInterface.getExtendedPropsMetadata(PropertyKind.RECURRING))
        .thenReturn(response);
    metadataConfigServiceImpl.getExtendedProperties(properties, PropertyKind.RECURRING);
  }
}
