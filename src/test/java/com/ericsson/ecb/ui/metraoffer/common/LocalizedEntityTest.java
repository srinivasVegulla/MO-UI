package com.ericsson.ecb.ui.metraoffer.common;

import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.collections4.map.CaseInsensitiveMap;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ericsson.ecb.catalog.model.LocalizedSharedPropertyModel;
import com.ericsson.ecb.catalog.model.LocalizedSpecificationCharacteristicValue;
import com.ericsson.ecb.catalog.model.PriceableItemInstanceDetails;
import com.ericsson.ecb.catalog.model.PricelistMapping;
import com.ericsson.ecb.catalog.model.SharedPropertyModel;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.client.ExtendedDescriptionClient;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.Description;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.ui.metraoffer.constants.LocalizedEntityConstants;
import com.ericsson.ecb.ui.metraoffer.model.SubscriptionProperty;
import com.ericsson.ecb.ui.metraoffer.service.LocalizationService;

public class LocalizedEntityTest {

  @InjectMocks
  private LocalizedEntity localizedEntity;

  @Mock
  private LocalizationService localizationService;

  @Mock
  private ExtendedDescriptionClient extendedDescriptionClient;

  @Mock
  private HttpServletRequest request;

  private static final String LANG_CODE = "us";
  private static final String LANG_CODE_POST_FIX = " {us}";
  private static final Integer LANG_CODE_ID = 1;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void shouldLocalizedCreateEntity() throws EcbBaseException {
    LocalizedSharedPropertyModel sharedPropertyModel = new LocalizedSharedPropertyModel();
    sharedPropertyModel.setDescriptionId(1);
    sharedPropertyModel.setDescription("test");
    sharedPropertyModel.getLocalizedDescriptions().put(LANG_CODE,
        getDescription(sharedPropertyModel.getDescriptionId(),
            sharedPropertyModel.getDescription() + LANG_CODE_POST_FIX));
    sharedPropertyModel.setSpecType(3);

    LocalizedSpecificationCharacteristicValue localizedSpecificationCharacteristicValue =
        new LocalizedSpecificationCharacteristicValue();;
    localizedSpecificationCharacteristicValue.setScvId(1);
    localizedSpecificationCharacteristicValue.setValue("test value");
    localizedSpecificationCharacteristicValue.setValueId(3);
    localizedSpecificationCharacteristicValue.getLocalizedValues().put(LANG_CODE,
        getDescription(localizedSpecificationCharacteristicValue.getValueId(),
            localizedSpecificationCharacteristicValue.getValue() + LANG_CODE_POST_FIX));
    sharedPropertyModel.getValues().add(localizedSpecificationCharacteristicValue);

    when(request.getParameter(LocalizedEntityConstants.LOGGED_IN_LANGUAGE_CODE))
        .thenReturn(LANG_CODE);
    when(localizationService.getLanguageCodeMap()).thenReturn(getLanguageCodeMap());
    localizedEntity.localizedCreateEntity(sharedPropertyModel);
  }

  //@Test
  public void shouldLocalizedGetEntity() throws EcbBaseException {
    SubscriptionProperty subscriptionProperty = new SubscriptionProperty();
    subscriptionProperty.setDescription("test");
    subscriptionProperty.setDescriptionId(1);
    subscriptionProperty.setSpecType(3);
    LocalizedSpecificationCharacteristicValue localizedSpecificationCharacteristicValue =
        new LocalizedSpecificationCharacteristicValue();
    localizedSpecificationCharacteristicValue.setValue("test value");
    localizedSpecificationCharacteristicValue.setValueId(2);
    subscriptionProperty.getValues().add(localizedSpecificationCharacteristicValue);
    when(localizationService.getLanguageCodeCaseInsensitiveMap()).thenReturn(getLanguageCodeMap());

    Set<Integer> descIds = new HashSet<>();
    descIds.add(1);
    descIds.add(2);
    Map<Integer, String> descsBylangCodeId = new HashMap<>();
    descsBylangCodeId.put(1, subscriptionProperty.getDescription() + LANG_CODE_POST_FIX);
    descsBylangCodeId.put(2,
        localizedSpecificationCharacteristicValue.getValue() + LANG_CODE_POST_FIX);
    when(localizationService.getDescsBylangCodeId(descIds, LANG_CODE_ID))
        .thenReturn(descsBylangCodeId);
    localizedEntity.localizedGetEntity(subscriptionProperty);
  }

  @Test
  public void localizedFindEntity() throws EcbBaseException {
    PaginatedList<SubscriptionProperty> paginatedObjList = new PaginatedList<>();
    Collection<SubscriptionProperty> subscriptionPropertyList = new ArrayList<>();
    SubscriptionProperty subscriptionProperty = new SubscriptionProperty();
    subscriptionProperty.setDescription("Test DisplayName");
    subscriptionProperty.setDescriptionId(1);
    subscriptionPropertyList.add(subscriptionProperty);
    paginatedObjList.setRecords(subscriptionPropertyList);
    when(localizationService.getLanguageCodeCaseInsensitiveMap()).thenReturn(getLanguageCodeMap());

    Set<Integer> descIds = new HashSet<>();
    descIds.add(1);
    Map<Integer, String> descsBylangCodeId = new HashMap<>();
    descsBylangCodeId.put(1, subscriptionProperty.getDescription() + LANG_CODE_POST_FIX);
    when(localizationService.getDescsBylangCodeId(descIds, LANG_CODE_ID))
        .thenReturn(descsBylangCodeId);

    localizedEntity.localizedFindEntity(paginatedObjList);
  }

  @Test
  public void localizedFindEntityForIf1() throws EcbBaseException {
    localizedEntity.localizedFindEntity(null);
  }

  @Test
  public void localizedFindEntityForIf2() throws EcbBaseException {
    PaginatedList<SubscriptionProperty> paginatedObjList = new PaginatedList<>();
    paginatedObjList.setRecords(null);
    localizedEntity.localizedFindEntity(paginatedObjList);
  }

  @Test
  public void localizedFindEntityForIf() throws EcbBaseException {
    PaginatedList<PriceableItemInstanceDetails> paginatedObjList = new PaginatedList<>();
    Collection<PriceableItemInstanceDetails> priceableItemInstanceDetailsList = new ArrayList<>();
    PriceableItemInstanceDetails subscriptionProperty = new PriceableItemInstanceDetails();
    subscriptionProperty.setDescription("Test DisplayName");
    subscriptionProperty.setDescriptionId(1);
    subscriptionProperty.setKind(PropertyKind.UNIT_DEPENDENT_RECURRING);
    priceableItemInstanceDetailsList.add(subscriptionProperty);
    paginatedObjList.setRecords(priceableItemInstanceDetailsList);
    when(localizationService.getLanguageCodeCaseInsensitiveMap()).thenReturn(getLanguageCodeMap());

    Set<Integer> descIds = new HashSet<>();
    descIds.add(1);
    Map<Integer, String> descsBylangCodeId = new HashMap<>();
    descsBylangCodeId.put(1, subscriptionProperty.getDescription() + LANG_CODE_POST_FIX);
    when(localizationService.getDescsBylangCodeId(descIds, LANG_CODE_ID))
        .thenReturn(descsBylangCodeId);
    localizedEntity.localizedFindEntity(paginatedObjList);
  }


  @Test
  public void shouldLocalizedUpdateEntity() throws EcbBaseException {
    SharedPropertyModel subscriptionProperty = new SharedPropertyModel();
    subscriptionProperty.setDescription("Test DisplayName");
    subscriptionProperty.setDescriptionId(1);
    subscriptionProperty.setSpecType(3);
    LocalizedSpecificationCharacteristicValue localizedSpecificationCharacteristicValue =
        new LocalizedSpecificationCharacteristicValue();
    localizedSpecificationCharacteristicValue.setValue("test value");
    localizedSpecificationCharacteristicValue.setValueId(2);
    subscriptionProperty.getValues().add(localizedSpecificationCharacteristicValue);
    when(localizationService.getLanguageCodeCaseInsensitiveMap()).thenReturn(getLanguageCodeMap());
    List<Description> descriptions = new ArrayList<>();
    descriptions.add(getDescription(subscriptionProperty.getDescriptionId(),
        subscriptionProperty.getDescription()));
    descriptions.add(getDescription(localizedSpecificationCharacteristicValue.getValueId(),
        localizedSpecificationCharacteristicValue.getValue()));
    ResponseEntity<Boolean> booleanRsp = new ResponseEntity<>(true, HttpStatus.OK);
    when(extendedDescriptionClient.updateDescriptionBatch(descriptions)).thenReturn(booleanRsp);
    localizedEntity.localizedUpdateEntity(subscriptionProperty);
  }

  @Test
  public void shouldLocalizedUpdateAllEntity() throws EcbBaseException {
    Collection<SubscriptionProperty> subscriptionPropertyList = new ArrayList<>();
    SubscriptionProperty subscriptionProperty = new SubscriptionProperty();
    subscriptionProperty.setDescription("Test DisplayName");
    subscriptionProperty.setDescriptionId(1);
    subscriptionProperty.setSpecType(3);
    LocalizedSpecificationCharacteristicValue localizedSpecificationCharacteristicValue =
        new LocalizedSpecificationCharacteristicValue();
    localizedSpecificationCharacteristicValue.setValue("test value");
    localizedSpecificationCharacteristicValue.setValueId(2);
    subscriptionProperty.getValues().add(localizedSpecificationCharacteristicValue);
    subscriptionPropertyList.add(subscriptionProperty);
    when(localizationService.getLanguageCodeCaseInsensitiveMap()).thenReturn(getLanguageCodeMap());

    List<Description> descriptions = new ArrayList<>();
    descriptions.add(getDescription(subscriptionProperty.getDescriptionId(),
        subscriptionProperty.getDescription()));
    descriptions.add(getDescription(localizedSpecificationCharacteristicValue.getValueId(),
        localizedSpecificationCharacteristicValue.getValue()));
    ResponseEntity<Boolean> booleanRsp = new ResponseEntity<>(true, HttpStatus.OK);
    when(extendedDescriptionClient.updateDescriptionBatch(descriptions)).thenReturn(booleanRsp);
    localizedEntity.localizedUpdateAllEntity(subscriptionPropertyList);
  }

  @Test
  public void shouldLocalizedUpdateAllEntityForIF() throws EcbBaseException {
    localizedEntity.localizedUpdateAllEntity(null);
  }

  @Test
  public void shouldLocalizedUpdateAllEntityForIf2() throws EcbBaseException {
    Collection<PricelistMapping> pricelistMappingList = new ArrayList<>();
    PricelistMapping pricelistMapping = new PricelistMapping();
    pricelistMapping.setItemTemplateDisplayName("Test DisplayName");
    pricelistMapping.setItemTemplateDescriptionId(1);
    pricelistMapping.setOfferDisplayNameId(3);
    pricelistMapping.setItemTemplateDescriptionId(4);
    pricelistMapping.setItemTemplateDescription("desc");
    LocalizedSpecificationCharacteristicValue localizedSpecificationCharacteristicValue =
        new LocalizedSpecificationCharacteristicValue();
    localizedSpecificationCharacteristicValue.setValue("test value");
    localizedSpecificationCharacteristicValue.setValueId(2);
    pricelistMappingList.add(pricelistMapping);
    when(localizationService.getLanguageCodeCaseInsensitiveMap()).thenReturn(getLanguageCodeMap());

    List<Description> descriptions = new ArrayList<>();
    descriptions.add(getDescription(pricelistMapping.getItemTemplateDescriptionId(),
        pricelistMapping.getItemTemplateDescription()));
    descriptions.add(getDescription(localizedSpecificationCharacteristicValue.getValueId(),
        localizedSpecificationCharacteristicValue.getValue()));
    ResponseEntity<Boolean> booleanRsp = new ResponseEntity<>(true, HttpStatus.OK);
    when(extendedDescriptionClient.updateDescriptionBatch(descriptions)).thenReturn(booleanRsp);
    localizedEntity.localizedUpdateAllEntity(pricelistMappingList);
  }

  private Description getDescription(Integer descId, String desc) {
    Description desciption = new Description();
    desciption.setLangCodeId(LANG_CODE_ID);
    desciption.setDescId(descId);
    desciption.setDesc(desc);
    return desciption;
  }

  private CaseInsensitiveMap<String, Integer> getLanguageCodeMap() {
    CaseInsensitiveMap<String, Integer> languageCodeMap = new CaseInsensitiveMap<>();
    languageCodeMap.put(LANG_CODE, LANG_CODE_ID);
    return languageCodeMap;
  }

  @Test
  public void shouldInitializeProperySizeMap() {
    localizedEntity.initializeProperySizeMap();
  }

}
