package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.map.CaseInsensitiveMap;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.HttpClientErrorException;

import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.metadata.client.MetadataConfigClient;
import com.ericsson.ecb.metadata.client.MetadataConfigInterface;
import com.ericsson.ecb.metadata.model.AttributeValue;
import com.ericsson.ecb.metadata.model.DefineService;
import com.ericsson.ecb.metadata.model.PropertyType;
import com.ericsson.ecb.metadata.model.localization.LocaleEntry;
import com.ericsson.ecb.metadata.model.localization.MtLocalization;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.model.ExtendedProperty;
import com.ericsson.ecb.ui.metraoffer.service.MetadataConfigService;

@Service
public class MetadataConfigServiceImpl implements MetadataConfigService {

  private static final Logger LOGGER = LoggerFactory.getLogger(MetadataConfigServiceImpl.class);

  @Autowired
  private MetadataConfigInterface metadataConfigInterface;

  @Autowired
  private MetadataConfigClient metadataConfigClient;

  @Autowired
  private LocalizedEntityService localizedEntityService;

  @Override
  public DefineService getExtendedPropsMetadata(PropertyKind propertyKind) throws EcbBaseException {
    return metadataConfigInterface.getExtendedPropsMetadata(propertyKind).getBody();
  }

  @Override
  public List<ExtendedProperty> getExtendedProperties(Map<String, Object> properties,
      PropertyKind propertyKind) throws EcbBaseException {
    CaseInsensitiveMap<String, Object> propertiesCaseInsensitiveMap = new CaseInsensitiveMap<>();
    propertiesCaseInsensitiveMap.putAll(properties);
    Map<String, String> attributesMap = getAttributeValuesMetadata(propertyKind);
    List<ExtendedProperty> extendedProperties = new ArrayList<>();
    DefineService defineService = getExtendedPropsMetadata(propertyKind);
    if (defineService != null) {
      List<PropertyType> propertyTypes = defineService.getPropertyTypes();
      if (!CollectionUtils.isEmpty(propertyTypes)) {
        propertyTypes.forEach(propertyType -> {
          ExtendedProperty extendedProperty = new ExtendedProperty();
          BeanUtils.copyProperties(propertyType, extendedProperty);
          extendedProperty.setValue(propertiesCaseInsensitiveMap.get(propertyType.getDn()));
          if (ValidPiKind.validPiKindList.contains(propertyKind)) {
            if (!CollectionUtils.isEmpty(attributesMap)
                && attributesMap.get(propertyType.getDn()) != null) {
              extendedProperty.setOverrideable(attributesMap.get(propertyType.getDn()));
            } else {
              extendedProperty.setOverrideable("false");
            }
          } else {
            extendedProperty.setOverrideable("true");
          }
          extendedProperties.add(extendedProperty);
        });
      }
    }
    if (PropKindName.PROP_KIND_NAME.get(propertyKind) != null)
      populateLocalizedValues(extendedProperties, propertyKind);
    return extendedProperties;
  }

  private Map<String, String> getAttributeValuesMetadata(PropertyKind propertyKind)
      throws EcbBaseException {
    Map<String, String> attributesMap = new HashMap<>();
    if (ValidPiKind.validPiKindList.contains(propertyKind)) {
      try {
        List<AttributeValue> attributeValues =
            metadataConfigInterface.getAttributeValuesMetadata(propertyKind).getBody();
        if (!CollectionUtils.isEmpty(attributeValues)) {
          attributeValues.forEach(attributeValue -> {
            attributesMap.put(attributeValue.getProperty(), attributeValue.getValue());
          });
        }
      } catch (HttpClientErrorException e) {
        LOGGER.error(
            "Handling HttpClientErrorException while getting attribute values. code:{}, message:{}",
            e.getRawStatusCode(), e.getStatusText());
      }
    }
    return attributesMap;
  }

  private MtLocalization getLocalizationMetadata(PropertyKind propertyKind)
      throws EcbBaseException {
    String entity = getEntiry(propertyKind);
    return metadataConfigClient.getLocalizationMetadata(EXTENDED_PROP_EXTENSION, entity).getBody();
  }

  private String getEntiry(PropertyKind propertyKind) {
    String loggedInLangCode = localizedEntityService.getLoggedInLangCode();
    return PropKindName.PROP_KIND_NAME.get(propertyKind) + "_" + loggedInLangCode;
  }

  private Map<String, String> getLocaleEntryMap(PropertyKind propertyKind) throws EcbBaseException {
    Map<String, String> localeEntryMap = new HashMap<>();
    MtLocalization mtLocalization = getLocalizationMetadata(propertyKind);
    List<LocaleEntry> localeEntry = mtLocalization.getLocaleSpace().getEntries();
    localeEntry.forEach(localeEntryTmp -> {
      localeEntryMap.put(StringUtils.substringAfter(localeEntryTmp.getName(), "/"),
          localeEntryTmp.getValue());
    });
    return localeEntryMap;
  }

  private void populateLocalizedValues(List<ExtendedProperty> extendedProperties,
      PropertyKind propertyKind) throws EcbBaseException {
    Map<String, String> localeEntryMap = getLocaleEntryMap(propertyKind);
    extendedProperties.forEach(extendedProperty -> {
      extendedProperty.setDisplayName(localeEntryMap.get(extendedProperty.getDn()));
    });
  }

}
