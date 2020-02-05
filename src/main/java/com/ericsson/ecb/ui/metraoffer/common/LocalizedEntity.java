package com.ericsson.ecb.ui.metraoffer.common;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.MapUtils;
import org.apache.commons.collections4.ListUtils;
import org.apache.commons.collections4.map.CaseInsensitiveMap;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.ericsson.ecb.catalog.model.LocalizedSharedPropertyModel;
import com.ericsson.ecb.catalog.model.LocalizedSpecificationCharacteristicValue;
import com.ericsson.ecb.catalog.model.PriceableItemInstanceDetails;
import com.ericsson.ecb.catalog.model.PricelistMapping;
import com.ericsson.ecb.catalog.model.SharedPropertyModel;
import com.ericsson.ecb.catalog.model.SpecificationCharacteristic;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.client.ExtendedDescriptionClient;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.Description;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.ui.metraoffer.constants.LocalizedEntityConstants;
import com.ericsson.ecb.ui.metraoffer.model.SubscriptionProperty;
import com.ericsson.ecb.ui.metraoffer.service.LocalizationService;
import com.ericsson.ecb.ui.metraoffer.utils.InvokeGetterSetter;
import com.ericsson.ecb.ui.metraoffer.utils.MoErrorMessagesUtil;

@Service
@Component
public class LocalizedEntity implements LocalizedEntityService {

  @Autowired
  private LocalizationService localizationService;

  @Autowired
  private ExtendedDescriptionClient extendedDescriptionClient;

  @Autowired
  private HttpServletRequest request;

  @Autowired
  private MoErrorMessagesUtil moErrorMessagesUtil;

  private static final String VALUES = LocalizedEntityConstants.VALUES;

  private static final Map<String, Integer> subscriptionPropSizeMap = new HashMap<>();
  private static final Map<String, Integer> nonSubscriptionPropSizeMap = new HashMap<>();
  private static final Map<String, Integer> languageCodeMap = new HashMap<>();

  private static final Logger LOGGER = LoggerFactory.getLogger(LocalizedEntity.class);

  @Override
  public <T> T localizedCreateEntity(T obj) throws EcbBaseException {
    String loggedInLangCode = getLoggedInLangCode();
    Map<String, Integer> langCodeMap = getLanguageCodeMap();
    if (!isLangCodeExist(langCodeMap, loggedInLangCode))
      throw new EcbBaseException(
          moErrorMessagesUtil.getErrorMessages("LANG_CODE_NOT_EXIST", loggedInLangCode));
    Map<String, String> createPropNameMap = getCreatePropNameMap(obj);
    Set<String> propNames = getCreatePropNames(createPropNameMap);
    propNames.add(VALUES);

    Map<String, Object> resultMap = InvokeGetterSetter.invokeGetters(obj, propNames);
    validateResultPropValues(obj, resultMap);
    fillLocalizedMap(createPropNameMap, resultMap, langCodeMap, loggedInLangCode, obj);

    Object valuesObj = resultMap.get(VALUES);
    if (valuesObj != null) {
      LocalizedSharedPropertyModel localizedSharedPropertyModel =
          (LocalizedSharedPropertyModel) obj;
      if (localizedSharedPropertyModel.getSpecType() == 3) {
        List<LocalizedSpecificationCharacteristicValue> values =
            localizedSharedPropertyModel.getValues();
        if (CollectionUtils.isNotEmpty(values)) {
          for (LocalizedSpecificationCharacteristicValue value : values) {
            Map<String, Description> resultNameMap = value.getLocalizedValues();
            resultNameMap.putAll(getLocalizedDescMap(value.getValue(), loggedInLangCode,
                langCodeMap, LocalizedEntityConstants.VALUE_SIZE));
          }
        }
      }
    }
    return obj;
  }

  private void validateResultPropValues(Object obj, Map<String, Object> resultMap)
      throws EcbBaseException {
    Set<String> props = getPropNameMap(obj).keySet();
    Set<Entry<String, Object>> resultMapEntrySet = resultMap.entrySet();
    Iterator<Entry<String, Object>> iterator = resultMapEntrySet.iterator();
    String errorMsg = " Should be a number";
    while (iterator.hasNext()) {
      Entry<String, Object> entry = iterator.next();
      if (props.contains(entry.getKey())) {
        if (entry.getValue() == null)
          throw new EcbBaseException(entry.getKey() + errorMsg);
        else {
          try {
            Integer.parseInt(entry.getValue().toString());
          } catch (NumberFormatException nfe) {
            throw new EcbBaseException(entry.getKey() + errorMsg);
          }
        }
      }
    }
  }

  @Override
  public <T> T localizedGetEntity(T obj) throws EcbBaseException {

    Map<String, String> getPropNameMap = getPropNameMap(obj);
    Set<String> propNames = getPropNameMap.keySet();
    Integer loggedInLangCodeId = getLoggedInLangCodeId();
    Map<String, Object> resultMap = InvokeGetterSetter.invokeGetters(obj, propNames);
    Set<Integer> descIds = getDescIds(resultMap);

    Map<String, Object> subScriptionPropResultMap =
        InvokeGetterSetter.invokeGetters(obj, getSubScriptionPropNames());
    if (MapUtils.isNotEmpty(subScriptionPropResultMap)) {
      resultMap.putAll(subScriptionPropResultMap);
      Object valuesObjTmp = subScriptionPropResultMap.get(VALUES);
      if (valuesObjTmp != null) {
        SubscriptionProperty subscriptionProperty = (SubscriptionProperty) obj;
        if (subscriptionProperty.getSpecType() == 3) {
          List<LocalizedSpecificationCharacteristicValue> values = subscriptionProperty.getValues();
          Set<Integer> subscriptionPropValuedescIds = getSubscriptionPropDescIds(values);
          descIds.addAll(subscriptionPropValuedescIds);
        }
      }
    }

    Map<Integer, String> descMap = new HashMap<>();
    if (CollectionUtils.isNotEmpty(descIds)) {
      descMap.putAll(localizationService.getDescsBylangCodeId(descIds, loggedInLangCodeId));
    }

    if (MapUtils.isEmpty(descMap))
      throw new EcbBaseException(moErrorMessagesUtil.getErrorMessages("LOCALIZED_DATA_NOT_FOUND"));

    Map<String, Object> valueMap = getLocalizedEntity(getPropNameMap, resultMap, descMap);
    InvokeGetterSetter.invokeSetters(obj, valueMap);

    Object valuesObj = resultMap.get(VALUES);
    if (valuesObj != null) {
      SubscriptionProperty subscriptionProperty = (SubscriptionProperty) obj;
      if (subscriptionProperty.getSpecType() == 3) {
        List<LocalizedSpecificationCharacteristicValue> values = subscriptionProperty.getValues();
        if (CollectionUtils.isNotEmpty(values)) {
          for (LocalizedSpecificationCharacteristicValue value : values) {
            value.setValue((String) descMap.get(value.getValueId()));
          }
        }
      }
    }
    return obj;
  }

  @Override
  public <T> PaginatedList<T> localizedFindEntity(PaginatedList<T> paginatedObjList)
      throws EcbBaseException {

    if (paginatedObjList == null)
      return paginatedObjList;

    Collection<T> objList = paginatedObjList.getRecords();

    if (CollectionUtils.isEmpty(objList))
      return paginatedObjList;
    Object objTmp = objList.iterator().next();
    Map<String, String> findPropNameMap = getPropNameMap(objTmp);
    if (isSubscriptionPropObj(objTmp)) {
      findPropNameMap.remove(LocalizedEntityConstants.NAME_ID);
      findPropNameMap.remove(LocalizedEntityConstants.CATEGORY_ID);
    }
    Set<String> propNames = findPropNameMap.keySet();
    Integer loggedInLangCodeId = getLoggedInLangCodeId();
    Map<String, Object> resultMap = null;
    Set<Integer> descIds = new HashSet<>();
    for (Object obj : objList) {
      resultMap = InvokeGetterSetter.invokeGetters(obj, propNames);
      descIds.addAll(getDescIds(resultMap));
    }

    Map<Integer, String> descMap = new HashMap<>();
    if (CollectionUtils.isNotEmpty(descIds)) {
      descMap.putAll(localizationService.getDescsBylangCodeId(descIds, loggedInLangCodeId));
    }

    for (Object obj : objList) {
      resultMap = InvokeGetterSetter.invokeGetters(obj, propNames);
      Map<String, Object> valueMap = getLocalizedEntity(findPropNameMap, resultMap, descMap);
      InvokeGetterSetter.invokeSetters(obj, valueMap);
    }
    return paginatedObjList;
  }

  private Map<String, Object> getLocalizedEntity(Map<String, String> getPropNameMap,
      Map<String, Object> resultMap, Map<Integer, String> descMap) {
    Map<String, Object> valueMap = new HashMap<>();
    getPropNameMap.forEach((k, v) -> {
      Object displayNameIdObj = resultMap.get(k);
      if (displayNameIdObj != null)
        valueMap.put(v, descMap.get((Integer) displayNameIdObj));
    });
    return valueMap;
  }

  @Override
  public <T> T localizedUpdateEntity(T obj) throws EcbBaseException {
    Map<String, String> propNameMap = getPropNameMap(obj);
    Set<String> propNames = getUpdatePropNames(propNameMap);
    propNames.add(VALUES);
    Integer loggedInLangCodeId = getLoggedInLangCodeId();
    Map<String, Object> resultMap = InvokeGetterSetter.invokeGetters(obj, propNames);
    Object valuesObj = resultMap.get(VALUES);
    Map<Integer, String> valueMap = new HashMap<>();
    if (valuesObj != null) {
      SharedPropertyModel sharedPropertyModel = (SharedPropertyModel) obj;
      if (sharedPropertyModel.getSpecType() == 3) {
        List<LocalizedSpecificationCharacteristicValue> values = sharedPropertyModel.getValues();
        if (CollectionUtils.isNotEmpty(values)) {
          validateValueId(values);
          for (LocalizedSpecificationCharacteristicValue value : values) {
            valueMap.put(value.getValueId(), value.getValue());
          }
        }
      }
    }
    resultMap.remove(VALUES);
    valueMap.putAll(getUpdateLocalizedEntity(resultMap, propNameMap));
    List<Description> descriptions = getUpdateDescriptionList(valueMap, loggedInLangCodeId);
    if (CollectionUtils.isNotEmpty(descriptions))
      extendedDescriptionClient.updateDescriptionBatch(descriptions);
    return obj;
  }


  @Override
  public <T> Collection<T> localizedUpdateAllEntity(Collection<T> objList) throws EcbBaseException {

    if (CollectionUtils.isEmpty(objList))
      return objList;

    Object object = objList.iterator().next();
    Map<String, String> propNameMap = getPropNameMap(object);
    if (object instanceof PricelistMapping) {
      propNameMap.remove(LocalizedEntityConstants.ITEM_TEMPLATE_DISPLAY_NAME_ID);
      propNameMap.remove(LocalizedEntityConstants.ITEM_TEMPLATE_DESCRIPTION_ID);
      propNameMap.remove(LocalizedEntityConstants.OFFER_DISPLAY_NAME_ID);
    }

    Set<String> propNames = getUpdatePropNames(propNameMap);
    Integer loggedInLangCodeId = getLoggedInLangCodeId();
    Map<String, Integer> langCodeMap = getLanguageCodeMap();
    List<Description> descriptions = new ArrayList<>();

    for (Object obj : objList) {
      Map<String, Object> resultMap = InvokeGetterSetter.invokeGetters(obj, propNames);
      Map<Integer, String> valueMap = getUpdateLocalizedEntity(resultMap, propNameMap);
      descriptions.addAll(getUpdateAllDescriptionList(valueMap, loggedInLangCodeId, langCodeMap));
    }
    if (CollectionUtils.isNotEmpty(descriptions)) {
      LOGGER.info("Total descriptions to be updated... size: {}", descriptions.size());
      List<List<Description>> descriptionsBatch = ListUtils.partition(descriptions, 500);
      LOGGER.info("Total descriptions batches prepared : {}", descriptionsBatch.size());
      for (List<Description> descriptionsList : descriptionsBatch) {
        LOGGER.info("updating descriptions... size: {}", descriptionsList.size());
        extendedDescriptionClient.updateDescriptionBatch(descriptionsList);
      }
    }
    return objList;
  }

  private void validateValueId(List<LocalizedSpecificationCharacteristicValue> values)
      throws EcbBaseException {
    Map<String, Integer> choiceMap = new LinkedHashMap<>();
    values.forEach(value -> {
      if (value.getValueId() == null) {
        choiceMap.put(value.getValue(), value.getValueId());
      }
    });
    if (!MapUtils.isEmpty(choiceMap))
      throw new EcbBaseException(
          moErrorMessagesUtil.getErrorMessages("CHOICES_VALUE_ID_NOT_NULL", choiceMap));
  }


  private Map<Integer, String> getUpdateLocalizedEntity(Map<String, Object> resultMap,
      Map<String, String> propNameMap) throws EcbBaseException {
    Map<Integer, String> valueMap = new HashMap<>();
    Iterator<Entry<String, String>> iterator = propNameMap.entrySet().iterator();

    while (iterator.hasNext()) {
      String desc = StringUtils.EMPTY;
      Entry<String, String> entry = iterator.next();
      if (resultMap.keySet().contains(entry.getKey())) {
        Object descIdObj = resultMap.get(entry.getKey());
        Object descObj = resultMap.get(entry.getValue());
        if (descIdObj == null && descObj != null)
          throw new EcbBaseException(moErrorMessagesUtil
              .getErrorMessages("LOCALIZATION_UPDATE_NOT_POSSIBLE", entry.getKey()));
        if (descIdObj != null && !descIdObj.equals(0)) {
          if (descObj != null)
            desc = descObj.toString();
          valueMap.put((Integer) descIdObj, desc);
        }
      }
    }
    return valueMap;
  }

  private Set<Integer> getDescIds(Map<String, Object> resultMap) {
    Set<Integer> descIds = new HashSet<>();
    resultMap.values().forEach(obj -> {
      if (obj != null) {
        Integer descId = (Integer) obj;
        descIds.add(descId);
      }
    });
    return descIds;
  }

  private Set<Integer> getSubscriptionPropDescIds(
      List<LocalizedSpecificationCharacteristicValue> values) {
    Set<Integer> descIds = new HashSet<>();
    if (CollectionUtils.isNotEmpty(values)) {
      for (LocalizedSpecificationCharacteristicValue value : values) {
        descIds.add(value.getValueId());
      }
    }
    return descIds;
  }

  @Override
  public String getLoggedInLangCode() {
    String langCode = request.getParameter(LocalizedEntityConstants.LOGGED_IN_LANGUAGE_CODE);
    if (!StringUtils.isBlank(langCode))
      return langCode;
    String swaggerDlangCode = request.getParameter(LocalizedEntityConstants.SWAGGER_DLANG);
    if (!StringUtils.isBlank(swaggerDlangCode))
      return swaggerDlangCode;
    return LocalizedEntityConstants.DEFAULT_LANG_CODE;
  }

  @Override
  public Integer getLoggedInLangCodeId() throws EcbBaseException {
    String langCode = getLoggedInLangCode();
    CaseInsensitiveMap<String, Integer> langCodeMap = getLangCodeCaseInsensitiveMap();
    if (!langCodeMap.containsKey(langCode))
      throw new EcbBaseException(
          moErrorMessagesUtil.getErrorMessages("LANG_CODE_NOT_EXIST", langCode));
    return langCodeMap.get(langCode);
  }

  private Set<String> getSubScriptionPropNames() {
    Set<String> propNames = new HashSet<>();
    propNames.add(VALUES);
    return propNames;
  }

  private Map<String, String> getCreatePropNameMap(Object obj) {
    Map<String, String> createPropNameMap = new HashMap<>();
    createPropNameMap.put(LocalizedEntityConstants.DISPLAY_NAME,
        LocalizedEntityConstants.LOCALIZED_DISPLAY_NAMES);
    createPropNameMap.put(LocalizedEntityConstants.DESCRIPTION,
        LocalizedEntityConstants.LOCALIZED_DESCRIPTIONS);
    createPropNameMap.put(LocalizedEntityConstants.UNIT_DISPLAY_NAME,
        LocalizedEntityConstants.LOCALIZED_UNIT_DISPLAY_NAMES);
    createPropNameMap.put(LocalizedEntityConstants.CATEGORY,
        LocalizedEntityConstants.LOCALIZED_CATEGORIES);
    if (isSubscriptionPropObj(obj)) {
      createPropNameMap.put(LocalizedEntityConstants.NAME,
          LocalizedEntityConstants.LOCALIZED_NAMES);
    }
    return createPropNameMap;
  }

  private Map<String, String> getPropNameMap(Object obj) {
    Map<String, String> propNameMap = new HashMap<>();
    propNameMap.put(LocalizedEntityConstants.DISPLAY_NAME_ID,
        LocalizedEntityConstants.DISPLAY_NAME);
    propNameMap.put(LocalizedEntityConstants.DESCRIPTION_ID, LocalizedEntityConstants.DESCRIPTION);
    propNameMap.put(LocalizedEntityConstants.CATEGORY_ID, LocalizedEntityConstants.CATEGORY);
    propNameMap.put(LocalizedEntityConstants.OFFER_DISPLAY_NAME_ID,
        LocalizedEntityConstants.OFFER_DISPLAY_NAME);
    propNameMap.put(LocalizedEntityConstants.ITEM_INSTANCE_DESCRIPTION_ID,
        LocalizedEntityConstants.ITEM_INSTANCE_DESCRIPTION);
    propNameMap.put(LocalizedEntityConstants.ITEM_INSTANCE_DISPLAY_NAME_ID,
        LocalizedEntityConstants.ITEM_INSTANCE_DISPLAY_NAME);
    propNameMap.put(LocalizedEntityConstants.ITEM_INSTANCE_UNIT_DISPLAY_NAME_ID,
        LocalizedEntityConstants.ITEM_INSTANCE_UNIT_DISPLAY_NAME);
    propNameMap.put(LocalizedEntityConstants.ITEM_TEMPLATE_DISPLAY_NAME_ID,
        LocalizedEntityConstants.ITEM_TEMPLATE_DISPLAY_NAME);
    propNameMap.put(LocalizedEntityConstants.ITEM_TEMPLATE_DESCRIPTION_ID,
        LocalizedEntityConstants.ITEM_TEMPLATE_DESCRIPTION);
    propNameMap.put(LocalizedEntityConstants.CHARGE_TYPE_NAME_ID,
        LocalizedEntityConstants.CHARGE_TYPE_NAME);
    if (isSubscriptionPropObj(obj))
      propNameMap.put(LocalizedEntityConstants.NAME_ID, LocalizedEntityConstants.NAME);

    if (isUnitDisplaNamePropertyRequired(obj))
      propNameMap.put(LocalizedEntityConstants.UNIT_DISPLAY_NAME_ID,
          LocalizedEntityConstants.UNIT_DISPLAY_NAME);

    return propNameMap;
  }

  private Set<String> getCreatePropNames(Map<String, String> createPropNameMap) {
    Set<String> propNames = new HashSet<>();
    createPropNameMap.forEach((k, v) -> {
      propNames.add(k);
      propNames.add(v);
    });
    return propNames;
  }

  private Set<String> getUpdatePropNames(Map<String, String> updatePropNameMap) {
    Set<String> propNames = new HashSet<>();
    updatePropNameMap.forEach((k, v) -> {
      propNames.add(k);
      propNames.add(v);
    });
    return propNames;
  }

  private void fillLocalizedMap(Map<String, String> createPropNameMap,
      Map<String, Object> resultMap, Map<String, Integer> langCodeMap, String loggedInLangCode,
      Object obj) {
    createPropNameMap.forEach((k, v) -> {
      Object propObj = resultMap.get(k);
      Map<String, Integer> propertySizeMap = getPropertySizeMap(obj);
      if (propObj != null) {
        @SuppressWarnings("unchecked")
        Map<String, Description> resultDescMap = (Map<String, Description>) resultMap.get(v);
        resultDescMap.putAll(getLocalizedDescMap(propObj.toString(), loggedInLangCode, langCodeMap,
            propertySizeMap.get(k)));
      }
    });
  }

  private Map<String, Integer> getPropertySizeMap(Object obj) {
    if ((obj instanceof SpecificationCharacteristic))
      return subscriptionPropSizeMap;
    else
      return nonSubscriptionPropSizeMap;
  }

  private Map<String, Description> getLocalizedDescMap(String desc, String loggedInLangCode,
      Map<String, Integer> langCodeMap, Integer size) {
    Map<String, Description> localizedDescMap = new HashMap<>();
    Set<String> langCodes = langCodeMap.keySet();
    langCodes.forEach(langCode -> {
      Description description = new Description();
      if (langCode.equals(loggedInLangCode)) {
        description.setDesc(desc);
      } else {
        if (StringUtils.isNotEmpty(desc)) {
          String descTmp = desc + " {" + langCode.toUpperCase() + "}";
          descTmp = descTmp.length() > size ? descTmp.substring(0, size) : descTmp;
          description.setDesc(descTmp);
        } else {
          description.setDesc("{" + langCode.toUpperCase() + "}");
        }
      }
      if (StringUtils.isNotEmpty(description.getDesc())) {
        description.setLangCodeId(langCodeMap.get(langCode));
        localizedDescMap.put(langCode, description);
      }
    });
    return localizedDescMap;
  }

  private List<Description> getUpdateAllDescriptionList(Map<Integer, String> localizedInfoMap,
      Integer loggedInLangCodeId, Map<String, Integer> langCodeMap) {
    List<Description> descriptions = new ArrayList<>();
    localizedInfoMap.forEach((descId, desc) -> langCodeMap.forEach((langCode, langCodeId) -> {
      Description description = new Description();
      if (langCodeId.equals(loggedInLangCodeId)) {
        description.setDesc(desc);
      } else {
        if (StringUtils.isNotEmpty(desc)) {
          String tmpDesc = desc + " {" + langCode.toUpperCase() + "}";
          tmpDesc = tmpDesc.length() > 4000 ? tmpDesc.substring(0, 4000) : tmpDesc;
          description.setDesc(tmpDesc);
        } else {
          description.setDesc("{" + langCode.toUpperCase() + "}");
        }
      }
      description.setDescId(descId);
      description.setLangCodeId(langCodeId);
      descriptions.add(description);
    }));
    return descriptions;
  }

  private List<Description> getUpdateDescriptionList(Map<Integer, String> localizedInfoMap,
      Integer loggedInLangCodeId) {
    List<Description> descriptions = new ArrayList<>();
    localizedInfoMap.forEach((descId, desc) -> {
      Description description = new Description();
      description.setDescId(descId);
      description.setDesc(desc);
      description.setLangCodeId(loggedInLangCodeId);
      descriptions.add(description);
    });
    return descriptions;
  }

  private Boolean isLangCodeExist(Map<String, Integer> langCodeMap, String loggedInLangCode) {
    Boolean flag = Boolean.FALSE;
    CaseInsensitiveMap<String, Integer> map = new CaseInsensitiveMap<>();
    map.putAll(langCodeMap);
    if (map.containsKey(loggedInLangCode))
      flag = Boolean.TRUE;
    return flag;
  }

  private Boolean isSubscriptionPropObj(Object obj) {
    return (obj instanceof SpecificationCharacteristic) ? Boolean.TRUE : Boolean.FALSE;
  }

  private Boolean isUnitDisplaNamePropertyRequired(Object obj) {
    if (obj instanceof PriceableItemInstanceDetails) {
      PriceableItemInstanceDetails priceableItemInstanceDetails =
          (PriceableItemInstanceDetails) obj;
      return PropertyKind.UNIT_DEPENDENT_RECURRING.equals(priceableItemInstanceDetails.getKind());
    }
    return Boolean.FALSE;
  }

  private CaseInsensitiveMap<String, Integer> getLangCodeCaseInsensitiveMap()
      throws EcbBaseException {
    CaseInsensitiveMap<String, Integer> map = new CaseInsensitiveMap<>();
    map.putAll(getLanguageCodeMap());
    return map;
  }

  private Map<String, Integer> getLanguageCodeMap() throws EcbBaseException {
    if (MapUtils.isNotEmpty(languageCodeMap))
      return languageCodeMap;
    synchronized (this) {
      if (MapUtils.isEmpty(languageCodeMap)) {
        Map<String, Integer> langCodeMap = localizationService.getLanguageCodeMap();
        languageCodeMap.putAll(langCodeMap);
      }
    }
    return languageCodeMap;
  }

  @PostConstruct
  public void initializeProperySizeMap() {
    subscriptionPropSizeMap.put(LocalizedEntityConstants.CATEGORY,
        LocalizedEntityConstants.CATEGORY_SIZE);
    subscriptionPropSizeMap.put(LocalizedEntityConstants.NAME, LocalizedEntityConstants.NAME_SIZE);
    subscriptionPropSizeMap.put(LocalizedEntityConstants.DESCRIPTION,
        LocalizedEntityConstants.CATEGORY_DESCRIPTION_SIZE);
    subscriptionPropSizeMap.put(LocalizedEntityConstants.VALUES,
        LocalizedEntityConstants.VALUE_SIZE);
    nonSubscriptionPropSizeMap.put(LocalizedEntityConstants.DISPLAY_NAME,
        LocalizedEntityConstants.DISPLAY_NAME_SIZE);
    nonSubscriptionPropSizeMap.put(LocalizedEntityConstants.DESCRIPTION,
        LocalizedEntityConstants.DESCRIPTION_SIZE);
    nonSubscriptionPropSizeMap.put(LocalizedEntityConstants.UNIT_DISPLAY_NAME,
        LocalizedEntityConstants.UNIT_DISPLAY_NAME_SIZE);
  }
}
