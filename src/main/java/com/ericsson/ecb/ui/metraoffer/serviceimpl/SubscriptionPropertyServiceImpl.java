package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import com.ericsson.ecb.catalog.client.EntitySpecsClient;
import com.ericsson.ecb.catalog.client.SharedPropertyClient;
import com.ericsson.ecb.catalog.client.SpecificationCharacteristicClient;
import com.ericsson.ecb.catalog.model.EntitySpecs;
import com.ericsson.ecb.catalog.model.ExtendedSpecificationCharacteristic;
import com.ericsson.ecb.catalog.model.LocalizedSharedPropertyModel;
import com.ericsson.ecb.catalog.model.LocalizedSpecificationCharacteristicValue;
import com.ericsson.ecb.catalog.model.SharedProperty;
import com.ericsson.ecb.catalog.model.SharedPropertyModel;
import com.ericsson.ecb.catalog.model.SpecificationCharacteristic;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.Constants;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferData;
import com.ericsson.ecb.ui.metraoffer.model.ResponseModel;
import com.ericsson.ecb.ui.metraoffer.model.SubscriptionProperty;
import com.ericsson.ecb.ui.metraoffer.service.ProductOfferService;
import com.ericsson.ecb.ui.metraoffer.service.SubscriptionPropertyService;
import com.ericsson.ecb.ui.metraoffer.utils.CommonUtils;
import com.ericsson.ecb.ui.metraoffer.utils.EntityHelper;

@Service
public class SubscriptionPropertyServiceImpl implements SubscriptionPropertyService {

  @Autowired
  private SharedPropertyClient sharedPropertyClient;

  @Autowired
  private EntitySpecsClient entitySpecsClient;

  @Autowired
  private ProductOfferService productOfferService;

  @Autowired
  private LocalizedEntityService localizedEntityService;

  @Autowired
  private SpecificationCharacteristicClient specificationCharacteristicClient;

  @Autowired
  private EntityHelper entityHelper;

  public static final String EDITABLE_REQUIRED = "Editable & Required";

  public static final String EDITABLE_NOT_REQUIRED = "Editable(Not Required)";

  public static final String READ_ONLY = "Read-Only";

  public static final String EDITABLE_REQUIRED_CODE = "ER";

  public static final String EDITABLE_NOT_REQUIRED_CODE = "ENR";

  public static final String READ_ONLY_CODE = "RO";

  public static final String USER_EDITABLE = "userEditable";

  public static final String IS_REQUIRED = "isRequired";

  public static final Map<String, String> FILTER_STRING;
  public static final Map<String, String> TEXT;

  static {
    Map<String, String> filter = new HashMap<>();
    filter.put(EDITABLE_NOT_REQUIRED, USER_EDITABLE + RsqlOperator.EQUAL_TRUE + RsqlOperator.AND
        + IS_REQUIRED + RsqlOperator.EQUAL_FALSE);
    filter.put(EDITABLE_REQUIRED, USER_EDITABLE + RsqlOperator.EQUAL_TRUE + RsqlOperator.AND
        + IS_REQUIRED + RsqlOperator.EQUAL_TRUE);
    filter.put(READ_ONLY, USER_EDITABLE + RsqlOperator.EQUAL_FALSE + RsqlOperator.AND + IS_REQUIRED
        + RsqlOperator.EQUAL_FALSE);
    FILTER_STRING = Collections.unmodifiableMap(filter);

    Map<String, String> text = new HashMap<>();
    text.put(EDITABLE_REQUIRED_CODE, EDITABLE_REQUIRED);
    text.put(EDITABLE_NOT_REQUIRED_CODE, EDITABLE_NOT_REQUIRED);
    text.put(READ_ONLY_CODE, READ_ONLY);
    TEXT = Collections.unmodifiableMap(text);
  }


  private final Logger logger = LoggerFactory.getLogger(SubscriptionPropertyServiceImpl.class);

  @Override
  public PaginatedList<SubscriptionProperty> findSubscriptionProperty(Integer page, Integer size,
      String[] sort, String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException {
    Collection<SubscriptionProperty> subscriptionProperties = new ArrayList<>();
    PaginatedList<ExtendedSpecificationCharacteristic> extendedSpecificationCharacteristic =
        extendedFindSpecificationCharacteristicApi(page, size, sort, query, descriptionLanguage,
            descriptionFilters, descriptionSort);

    Collection<ExtendedSpecificationCharacteristic> extendedSpecificationCharacteristicList =
        extendedSpecificationCharacteristic.getRecords();
    if (!CollectionUtils.isEmpty(extendedSpecificationCharacteristicList)) {
      extendedSpecificationCharacteristicList.forEach(specificationCharacteristic -> {
        SubscriptionProperty subscriptionProperty = new SubscriptionProperty();
        BeanUtils.copyProperties(specificationCharacteristic, subscriptionProperty);
        subscriptionProperty.setEditingForSubscription(
            TEXT.get(getEditingForSubscriptionCode(subscriptionProperty)));
        subscriptionProperties.add(subscriptionProperty);
      });
    }
    PaginatedList<SubscriptionProperty> paginatedSubscriptionProperty = new PaginatedList<>();
    CommonUtils.copyPaginatedList(extendedSpecificationCharacteristic,
        paginatedSubscriptionProperty);
    paginatedSubscriptionProperty.setRecords(subscriptionProperties);
    return localizedEntityService.localizedFindEntity(paginatedSubscriptionProperty);
  }

  private PaginatedList<SharedProperty> findSubscriptionPropertyFromApi(Integer page, Integer size,
      String[] sort, String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException {
    return sharedPropertyClient.findSharedProperty(page, size, sort, query, descriptionLanguage,
        descriptionFilters, descriptionSort).getBody();
  }

  private PaginatedList<ExtendedSpecificationCharacteristic> extendedFindSpecificationCharacteristicApi(
      Integer page, Integer size, String[] sort, String query, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException {
    return sharedPropertyClient.extendedFindSpecificationCharacteristic(page, size, sort, query,
        descriptionLanguage, descriptionFilters, descriptionSort).getBody();
  }

  private SubscriptionProperty getSharedProperty(Integer specId) throws EcbBaseException {
    Collection<SharedProperty> sharedProperties =
        findSubscriptionPropertyFromApi(1, Integer.MAX_VALUE, null,
            PropertyRsqlConstants.SPEC_ID_EQUAL + specId, null, null, null).getRecords();
    return getSharedProperty(sharedProperties);
  }

  private SubscriptionProperty getSharedProperty(Collection<SharedProperty> sharedProperties) {
    SubscriptionProperty sharedProperty = new SubscriptionProperty();
    if (!CollectionUtils.isEmpty(sharedProperties)) {
      BeanUtils.copyProperties(sharedProperties.iterator().next(), sharedProperty);
      LocalizedSpecificationCharacteristicValue localizedSpecificationCharacteristicValue = null;
      for (SharedProperty sharedPropertyTmp : sharedProperties) {
        localizedSpecificationCharacteristicValue = new LocalizedSpecificationCharacteristicValue();
        localizedSpecificationCharacteristicValue.setScvId(sharedPropertyTmp.getScvId());
        localizedSpecificationCharacteristicValue.setValue(sharedPropertyTmp.getValue());
        localizedSpecificationCharacteristicValue.setValueId(sharedPropertyTmp.getValueId());
        localizedSpecificationCharacteristicValue.setIsDefault(sharedPropertyTmp.getDefault());
        sharedProperty.getValues().add(localizedSpecificationCharacteristicValue);
      }
    }
    return sharedProperty;
  }

  private Set<Integer> findInUseOfferingsId(Integer specId) throws EcbBaseException {
    Collection<EntitySpecs> entitySpecs = findEntitySpecs(specId);
    Set<Integer> inUseOfferings = new HashSet<>();
    entitySpecs.forEach(entitySpec -> inUseOfferings.add(entitySpec.getEntityId()));
    return inUseOfferings;
  }

  private Collection<EntitySpecs> findEntitySpecs(Integer specId) throws EcbBaseException {
    String query = PropertyRsqlConstants.SPEC_ID_EQUAL + specId;
    return entitySpecsClient.findEntitySpecs(1, Integer.MAX_VALUE, null, query).getBody()
        .getRecords();
  }

  @Override
  public Boolean createSubscriptionProperty(SubscriptionProperty record) throws EcbBaseException {
    LocalizedSharedPropertyModel newRecord = new LocalizedSharedPropertyModel();
    updateEditingForSubscriptionByCode(record, record.getEditingForSubscriptionCode());
    BeanUtils.copyProperties(record, newRecord);
    newRecord.getValues().addAll(record.getValues());
    localizedEntityService.localizedCreateEntity(newRecord);

    SharedPropertyModel sharedProperty =
        sharedPropertyClient.createSharedProperty(newRecord).getBody();
    if (sharedProperty != null)
      return Boolean.TRUE;
    return Boolean.FALSE;
  }

  @Override
  public Boolean updateSubscriptionProperty(SubscriptionProperty record, Set<String> fields,
      Integer specId) throws EcbBaseException {
    updateEditingForSubscriptionByCode(record, record.getEditingForSubscriptionCode());
    Integer specType = record.getSpecType();
    if (Constants.PROPERTY_TYPE_STRING.equals(specType)
        || Constants.PROPERTY_TYPE_BOOLEAN.equals(specType)) {
      record.setMaxValue(null);
    } else if (Constants.PROPERTY_TYPE_LIST.equals(specType)) {
      record.setMinValue(null);
      record.setMaxValue(null);
    }
    return entityHelper.updateSelective(record, fields, specId);
  }

  @Override
  public ResponseEntity<Boolean> deleteSubscriptionProperty(Integer specId)
      throws EcbBaseException {
    return sharedPropertyClient.deleteSharedProperty(specId);
  }

  @Override
  public SubscriptionProperty getSubscriptionProperty(Integer specId) throws EcbBaseException {
    return getSharedProperty(specId);
  }


  @Override
  public SubscriptionProperty getSubscriptionPropertyForEdit(Integer specId)
      throws EcbBaseException {
    SubscriptionProperty subscriptionProperty = new SubscriptionProperty();
    String[] sort = {PropertyRsqlConstants.CATEGORY_ASC};
    Collection<SharedProperty> sharedProperties =
        findSubscriptionPropertyFromApi(1, Integer.MAX_VALUE, sort, null, null, null, null)
            .getRecords();
    if (specId > 0) {
      subscriptionProperty = getSubscriptionProperty(specId, sharedProperties);
      subscriptionProperty
          .setEditingForSubscriptionCode(getEditingForSubscriptionCode(subscriptionProperty));
    }
    subscriptionProperty.getCategoryNames().addAll(getCategoryNames(sharedProperties));
    subscriptionProperty.getSpecTypes().putAll(Constants.TYPE);

    String name = subscriptionProperty.getName();
    String category = subscriptionProperty.getCategory();

    if (specId > 0)
      localizedEntityService.localizedGetEntity(subscriptionProperty);

    subscriptionProperty.setDisplayName(subscriptionProperty.getName());
    subscriptionProperty.setDisplayCategory(subscriptionProperty.getCategory());
    subscriptionProperty.setName(name);
    subscriptionProperty.setCategory(category);
    return subscriptionProperty;
  }

  private Set<String> getCategoryNames(Collection<SharedProperty> sharedProperties) {
    Set<String> categoryNames = new LinkedHashSet<>();
    sharedProperties.forEach(sharedProperty -> categoryNames.add(sharedProperty.getCategory()));
    return categoryNames;
  }

  private SubscriptionProperty getSubscriptionProperty(Integer specId,
      Collection<SharedProperty> sharedProperties) {
    Collection<SharedProperty> sharedPropertiesTmp = new ArrayList<>();
    sharedProperties.forEach(sharedProperty -> {
      if (sharedProperty.getSpecId().equals(specId))
        sharedPropertiesTmp.add(sharedProperty);
    });
    return getSharedProperty(sharedPropertiesTmp);
  }

  @Override
  public Map<Integer, String> findSubscriptionPropertyType() {
    return Constants.TYPE;
  }

  @Override
  public PaginatedList<ProductOfferData> findInUseOfferings(Integer specId, Integer page,
      Integer size, String[] sort, String query, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException {
    Set<Integer> inUseOfferingsIds = findInUseOfferingsId(specId);
    return productOfferService.findOfferingsForInUse(inUseOfferingsIds, page, size, sort, query,
        descriptionLanguage, descriptionFilters, descriptionSort);
  }

  @Override
  public Map<String, String> findEditingForSubscriptionFilter() {
    return FILTER_STRING;
  }

  @Override
  public List<ResponseModel> addSubscriptionPropertyToOfferings(Integer offerId,
      List<Integer> specIds) throws EcbBaseException {
    List<ResponseModel> records = new ArrayList<>();
    for (Integer specId : specIds) {
      try {
        sharedPropertyClient.addSharedPropertyToProductOffer(offerId, specId);
      } catch (HttpClientErrorException e) {
        ResponseModel responseModel = new ResponseModel();
        responseModel.setData(specId);
        responseModel.setCode(e.getRawStatusCode());
        responseModel.setMessage(e.getStatusText());
        records.add(responseModel);
      } catch (EcbBaseException e) {
        logger.error("Exception occured while adding subscriptionProperty to Offerings.");
        CommonUtils.handleExceptions(e, null);
      }
    }
    return records;
  }

  @Override
  public ResponseEntity<Boolean> removeSubscriptionPropertyFromProductOffer(Integer offerId,
      Integer specId) throws EcbBaseException {
    return sharedPropertyClient.removeSharedPropertyFromProductOffer(offerId, specId);
  }

  @Override
  public PaginatedList<SubscriptionProperty> findProductOfferSubscriptionProperties(Integer page,
      Integer size, String[] sort, String query, Integer offerId) throws EcbBaseException {
    PaginatedList<SubscriptionProperty> paginatedList = new PaginatedList<>();
    Collection<SharedProperty> sharedProperties =
        findSharedPropertyInProductOffer(offerId, page, size, sort, query).getRecords();
    List<SubscriptionProperty> subscriptionProperties = new ArrayList<>();
    Set<Integer> specId = new HashSet<>();
    if (!CollectionUtils.isEmpty(sharedProperties)) {
      sharedProperties.forEach(sharedProperty -> {
        if (specId.add(sharedProperty.getSpecId())) {
          SubscriptionProperty subscriptionProperty = new SubscriptionProperty();
          BeanUtils.copyProperties(sharedProperty, subscriptionProperty);
          if (subscriptionProperty.getCategory() == null) {
            subscriptionProperty.setCategory(StringUtils.EMPTY);
          }
          subscriptionProperties.add(subscriptionProperty);
        }
      });

      Map<String, List<SubscriptionProperty>> data = subscriptionProperties.stream()
          .collect(Collectors.groupingBy(SubscriptionProperty::getCategory));

      List<SubscriptionProperty> subscriptionPropertyList = new ArrayList<>();
      data.values().forEach(subscriptionPropertyList::addAll);
      paginatedList.setRecords(subscriptionPropertyList);
      paginatedList.setTotalCount(subscriptionProperties.size());
    }
    return localizedEntityService.localizedFindEntity(paginatedList);
  }

  private PaginatedList<SharedProperty> findSharedPropertyInProductOffer(Integer offerId,
      Integer page, Integer size, String[] sort, String query) throws EcbBaseException {
    return sharedPropertyClient.findSharedPropertyInProductOffer(offerId, page, size, sort, query)
        .getBody();
  }

  private Set<Integer> getSpecIdFromSharedProperties(Collection<SharedProperty> sharedProperties) {
    Set<Integer> specIds = new HashSet<>();
    sharedProperties.forEach(sharedProperty -> specIds.add(sharedProperty.getSpecId()));
    return specIds;
  }

  @Override
  public PaginatedList<SubscriptionProperty> findSubscriptionPropertyForOfferings(Integer page,
      Integer size, String[] sort, String inQuery, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort, Integer offerId)
      throws EcbBaseException {
    String query = StringUtils.EMPTY;
    Collection<SharedProperty> sharedProperties =
        findSharedPropertyInProductOffer(offerId, 1, Integer.MAX_VALUE, null, null).getRecords();
    String querySpecIdNotIn = CommonUtils.getQueryStringFromCollection(
        getSpecIdFromSharedProperties(sharedProperties), PropertyRsqlConstants.SPEC_ID_NOT_IN);
    if (!StringUtils.isBlank(inQuery)) {
      query = inQuery;
      if (!StringUtils.isBlank(querySpecIdNotIn)) {
        query = inQuery + RsqlOperator.AND + querySpecIdNotIn;
      }
    } else {
      if (!StringUtils.isBlank(querySpecIdNotIn)) {
        query = querySpecIdNotIn;
      }
    }

    PaginatedList<SpecificationCharacteristic> specRecords = findSpecificationCharacteristic(page,
        size, sort, query, descriptionLanguage, descriptionFilters, descriptionSort);
    List<SubscriptionProperty> subscriptionPropertyList = new ArrayList<>();
    specRecords.getRecords().forEach(specificationCharacteristic -> {
      SubscriptionProperty subscriptionProperty = new SubscriptionProperty();
      BeanUtils.copyProperties(specificationCharacteristic, subscriptionProperty);
      subscriptionProperty
          .setEditingForSubscription(TEXT.get(getEditingForSubscriptionCode(subscriptionProperty)));
      subscriptionPropertyList.add(subscriptionProperty);
    });
    PaginatedList<SubscriptionProperty> subscriptionPropertyRecs = new PaginatedList<>();
    CommonUtils.copyPaginatedList(specRecords, subscriptionPropertyRecs);
    subscriptionPropertyRecs.setRecords(subscriptionPropertyList);
    return localizedEntityService.localizedFindEntity(subscriptionPropertyRecs);
  }


  private String getEditingForSubscriptionCode(SubscriptionProperty sp) {
    String editingForSubscriptionCode;
    if (sp.getIsRequired() != null && sp.getIsRequired()) {
      editingForSubscriptionCode = EDITABLE_REQUIRED_CODE;
    } else if (sp.getUserEditable() != null && sp.getUserEditable()) {
      editingForSubscriptionCode = EDITABLE_NOT_REQUIRED_CODE;
    } else {
      editingForSubscriptionCode = READ_ONLY_CODE;
    }
    return editingForSubscriptionCode;
  }

  private void updateEditingForSubscriptionByCode(SubscriptionProperty sp,
      String editingForSubscriptionCode) {
    if (!StringUtils.isEmpty(editingForSubscriptionCode)) {
      if (StringUtils.equals(editingForSubscriptionCode, EDITABLE_REQUIRED_CODE)) {
        sp.setUserEditable(Boolean.TRUE);
        sp.setIsRequired(Boolean.TRUE);
      } else if (StringUtils.equals(editingForSubscriptionCode, EDITABLE_NOT_REQUIRED_CODE)) {
        sp.setUserEditable(Boolean.TRUE);
        sp.setIsRequired(Boolean.FALSE);
      } else if (StringUtils.equals(editingForSubscriptionCode, READ_ONLY_CODE)) {
        sp.setUserEditable(Boolean.FALSE);
        sp.setIsRequired(Boolean.FALSE);
      }
    }
  }

  private PaginatedList<SpecificationCharacteristic> findSpecificationCharacteristic(Integer page,
      Integer size, String[] sort, String query, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException {
    return specificationCharacteristicClient.findSpecificationCharacteristic(page, size, sort,
        query, descriptionLanguage, descriptionFilters, descriptionSort).getBody();
  }

}
