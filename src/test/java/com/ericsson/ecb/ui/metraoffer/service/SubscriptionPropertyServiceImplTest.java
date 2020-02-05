package com.ericsson.ecb.ui.metraoffer.service;

import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.model.SubscriptionProperty;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.SubscriptionPropertyServiceImpl;
import com.ericsson.ecb.ui.metraoffer.utils.EntityHelper;

public class SubscriptionPropertyServiceImplTest {

  @Mock
  private SharedPropertyClient sharedPropertyClient;

  @Mock
  private EntitySpecsClient entitySpecsClient;

  @Mock
  private ProductOfferService productOfferService;

  @Mock
  private LocalizedEntityService localizedEntity;

  @Mock
  private SpecificationCharacteristicClient specificationCharacteristicClient;

  @Mock
  private EntityHelper entityHelper;

  @InjectMocks
  private SubscriptionPropertyServiceImpl subscriptionPropertyServiceImpl;

  private ResponseEntity<PaginatedList<SharedProperty>> sharedPropertyRspEntityPaginated;

  private ResponseEntity<PaginatedList<SharedProperty>> sharedPropertyRspEntityPaginated3;

  private PaginatedList<SharedProperty> sharedPropertyPaginated;

  private PaginatedList<SharedProperty> sharedPropertyPaginated2;

  private PaginatedList<SharedProperty> sharedPropertyPaginated3;

  private SharedProperty sharedProperty;

  private Integer offerId = 1;

  private Integer specId = 1;

  private Integer page = 1;

  private Integer size = Integer.MAX_VALUE;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    sharedProperty = new SharedProperty();
    sharedProperty.setCategory("sample");
    sharedProperty.setSpecId(specId);

    SharedProperty sharedProperty2 = new SharedProperty();
    sharedProperty2.setCategory("sample");
    sharedProperty2.setSpecId(2);

    SharedProperty sharedProperty3 = new SharedProperty();
    sharedProperty2.setSpecId(3);


    SharedProperty sharedProperty4 = new SharedProperty();
    sharedProperty2.setSpecId(4);

    List<SharedProperty> sharedProperties = new ArrayList<>();
    sharedProperties.add(sharedProperty);
    sharedProperties.add(sharedProperty2);


    List<SharedProperty> sharedProperties2 = new ArrayList<>();
    sharedProperties2.add(sharedProperty3);
    sharedProperties2.add(sharedProperty4);

    List<SharedProperty> sharedProperties3 = new ArrayList<>();
    sharedProperties3.add(sharedProperty);


    sharedPropertyPaginated = new PaginatedList<SharedProperty>();
    sharedPropertyPaginated.setRecords(sharedProperties);


    sharedPropertyPaginated2 = new PaginatedList<SharedProperty>();
    sharedPropertyPaginated2.setRecords(sharedProperties2);

    sharedPropertyPaginated3 = new PaginatedList<SharedProperty>();
    sharedPropertyPaginated3.setRecords(sharedProperties3);


    sharedPropertyRspEntityPaginated =
        new ResponseEntity<PaginatedList<SharedProperty>>(sharedPropertyPaginated, HttpStatus.OK);

    sharedPropertyRspEntityPaginated3 =
        new ResponseEntity<PaginatedList<SharedProperty>>(sharedPropertyPaginated3, HttpStatus.OK);

  }

  @Test
  public void shouldFindSubscriptionProperty() throws EcbBaseException {

    ExtendedSpecificationCharacteristic eSpecificationCharacteristic =
        new ExtendedSpecificationCharacteristic();

    List<ExtendedSpecificationCharacteristic> eSpecificationCharacteristicList = new ArrayList<>();
    eSpecificationCharacteristicList.add(eSpecificationCharacteristic);

    PaginatedList<ExtendedSpecificationCharacteristic> eSpecificationCharacteristicPaginated =
        new PaginatedList<>();
    eSpecificationCharacteristicPaginated.setRecords(eSpecificationCharacteristicList);

    ResponseEntity<PaginatedList<ExtendedSpecificationCharacteristic>> eSpecificationCharacteristicRsp =
        new ResponseEntity<>(eSpecificationCharacteristicPaginated, HttpStatus.OK);

    when(sharedPropertyClient.extendedFindSpecificationCharacteristic(page, size, null, null, null,
        null, null)).thenReturn(eSpecificationCharacteristicRsp);
    subscriptionPropertyServiceImpl.findSubscriptionProperty(page, size, null, null, null, null,
        null);
  }

  @Test
  public void shouldFindSubscriptionPropertyForOfferings() throws EcbBaseException {
    when(sharedPropertyClient.findSharedPropertyInProductOffer(offerId, page, size, null, null))
        .thenReturn(sharedPropertyRspEntityPaginated);

    PaginatedList<SpecificationCharacteristic> paginated = new PaginatedList<>();
    SpecificationCharacteristic specificationCharacteristic = new SpecificationCharacteristic();
    List<SpecificationCharacteristic> specificationCharacteristicList = new ArrayList<>();
    specificationCharacteristicList.add(specificationCharacteristic);
    paginated.setRecords(specificationCharacteristicList);
    ResponseEntity<PaginatedList<SpecificationCharacteristic>> rsp =
        new ResponseEntity<>(paginated, HttpStatus.OK);
    when(specificationCharacteristicClient.findSpecificationCharacteristic(page, size, null,
        "specId=out=(1,4)", null, null, null)).thenReturn(rsp);

    subscriptionPropertyServiceImpl.findSubscriptionPropertyForOfferings(page, size, null, null,
        null, null, null, offerId);
  }

  @Test
  public void shouldFindSubscriptionPropertyForOfferingsForIf() throws EcbBaseException {

    String query = "scvId==1";

    when(sharedPropertyClient.findSharedPropertyInProductOffer(offerId, page, size, null, null))
        .thenReturn(sharedPropertyRspEntityPaginated);

    PaginatedList<SpecificationCharacteristic> paginated = new PaginatedList<>();
    SpecificationCharacteristic specificationCharacteristic = new SpecificationCharacteristic();
    List<SpecificationCharacteristic> specificationCharacteristicList = new ArrayList<>();
    specificationCharacteristicList.add(specificationCharacteristic);
    paginated.setRecords(specificationCharacteristicList);
    ResponseEntity<PaginatedList<SpecificationCharacteristic>> rsp =
        new ResponseEntity<>(paginated, HttpStatus.OK);
    when(specificationCharacteristicClient.findSpecificationCharacteristic(page, size, null,
        "scvId==1 and specId=out=(1,4)", null, null, null)).thenReturn(rsp);



    subscriptionPropertyServiceImpl.findSubscriptionPropertyForOfferings(page, size, null, query,
        null, null, null, offerId);
  }

  @Test
  public void shouldFindProductOfferSubscriptionProperties() throws EcbBaseException {
    when(sharedPropertyClient.findSharedPropertyInProductOffer(offerId, page, size, null, null))
        .thenReturn(sharedPropertyRspEntityPaginated);
    subscriptionPropertyServiceImpl.findProductOfferSubscriptionProperties(page, size, null, null,
        offerId);
  }

  @Test
  public void createSubscriptionProperty() throws EcbBaseException {
    SubscriptionProperty newrecord = new SubscriptionProperty();
    LocalizedSharedPropertyModel record = new LocalizedSharedPropertyModel();
    record.setCategory("Category1");
    record.setName("Name");
    record.setDescription("Description");
    record.setSpecType(2);
    BeanUtils.copyProperties(newrecord, record);
    ResponseEntity<LocalizedSharedPropertyModel> sharedPropertyRsp =
        new ResponseEntity<LocalizedSharedPropertyModel>(record, HttpStatus.OK);
    when(localizedEntity.localizedCreateEntity(record)).thenReturn(record);
    when(sharedPropertyClient.createSharedProperty(record)).thenReturn(sharedPropertyRsp);
    subscriptionPropertyServiceImpl.createSubscriptionProperty(newrecord);
  }

  @Test
  public void createSubscriptionPropertyForNull() throws EcbBaseException {
    SubscriptionProperty newrecord = new SubscriptionProperty();
    LocalizedSharedPropertyModel record = new LocalizedSharedPropertyModel();
    record.setCategory("Category1");
    record.setName("Name");
    record.setDescription("Description");
    record.setSpecType(2);
    BeanUtils.copyProperties(newrecord, record);
    ResponseEntity<LocalizedSharedPropertyModel> sharedPropertyRsp =
        new ResponseEntity<>(null, HttpStatus.OK);
    when(localizedEntity.localizedCreateEntity(record)).thenReturn(record);
    when(sharedPropertyClient.createSharedProperty(record)).thenReturn(sharedPropertyRsp);
    subscriptionPropertyServiceImpl.createSubscriptionProperty(newrecord);
  }

  /*
   * @Test public void shouldUpdateSubscriptionProperty() throws EcbBaseException {
   * SubscriptionProperty record1 = new SubscriptionProperty(); SharedPropertyModel record = new
   * SharedPropertyModel();
   * 
   * 
   * //record1.setDescriptionId(1); //record1.setCategoryId(2); record1.getSpecTypes().put(0,
   * "String"); record1.getCategoryNames().add("category");
   * 
   * List<LocalizedSpecificationCharacteristicValue> values = new ArrayList<>();
   * LocalizedSpecificationCharacteristicValue localizedSpecificationCharacteristicValue = new
   * LocalizedSpecificationCharacteristicValue(); //localizedSpecificationCharacteristicVa
   * localizedSpecificationCharacteristicValue.setValue("value");
   * localizedSpecificationCharacteristicValue.setValueId(3);
   * localizedSpecificationCharacteristicValue.setScvId(4);
   * localizedSpecificationCharacteristicValue.setIsDefault(true);
   * values.add(localizedSpecificationCharacteristicValue);
   * 
   * record.getValues().addAll(values);
   * 
   * List<String> listString = new ArrayList<>(); listString.add("Sample List");
   * record1.setList(listString); record1.setDefaultItem("DefultItem"); record1.setValue("value2");
   * record1.setValueId(2); record1.setScvId(4); record1.setSpecId(5); record1.setNameId(6);
   * record1.setEditingForSubscription("edit Subscription");
   * record1.setEditingForSubscriptionCode("edit code"); //record.getI
   * 
   * record.setCategory("Category1"); record.setName("Name"); record.setDescription("Description");
   * record.setSpecType(2); record.setIsRequired(Boolean.TRUE);
   * record.setUserEditable(Boolean.TRUE); record.setUserVisible(Boolean.TRUE); //
   * record.setMinValue("10"); //record.setMaxValue("20");
   * 
   * record.setDescriptionId(11); record.setCategoryId(22); record.setSpecId(record1.getSpecId());
   * record.setNameId(6);
   * 
   * //record.getValues().addAll(values); //String name = null;
   * 
   * Set<String> fields = new HashSet<>(); fields.add("name");
   * 
   * //BeanUtils.copyProperties(record, record1);
   * 
   * ResponseEntity<SharedPropertyModel> sharedPropertyRsp = new
   * ResponseEntity<SharedProperty>(sharedProperty, HttpStatus.OK);
   * 
   * ResponseEntity<SharedPropertyModel> sharedPropertyRsp = new
   * ResponseEntity<SharedPropertyModel>(record, HttpStatus.OK);
   * 
   * 
   * SharedProperty sharedProperty = new SharedProperty(); List<SharedProperty> sharedPropertyList =
   * new ArrayList<>(); sharedPropertyList.add(sharedProperty);
   * 
   * PaginatedList<SharedProperty> paginatedList = new PaginatedList<SharedProperty>();
   * paginatedList.setRecords(sharedPropertyList); ResponseEntity<PaginatedList<SharedProperty>>
   * value = new ResponseEntity<PaginatedList<SharedProperty>>(paginatedList, HttpStatus.OK);
   * 
   * when(sharedPropertyClient.findSharedProperty(page, size, null, "specId==1", null, null,
   * null)).thenReturn(value);
   * 
   * when(sharedPropertyClient.findSharedProperty(page, size, null, "specId==1", null, null, null))
   * .thenReturn(sharedPropertyRspEntityPaginated);
   * 
   * when(sharedPropertyClient.updateSelectiveSharedProperty(record, fields, specId))
   * .thenReturn(sharedPropertyRsp);
   * when(localizedEntity.localizedUpdateEntity(record)).thenReturn(record);
   * 
   * subscriptionPropertyServiceImpl.updateSubscriptionProperty(record1, fields, specId); }
   */


  @Test
  public void shouldGetSubscriptionProperty() throws EcbBaseException {
    when(sharedPropertyClient.findSharedProperty(page, size, null, "specId==1", null, null, null))
        .thenReturn(sharedPropertyRspEntityPaginated);
    subscriptionPropertyServiceImpl.getSubscriptionProperty(specId);
  }


  @Test
  public void shouldFindInUseOfferings() throws Exception {
    EntitySpecs entitySpecs = new EntitySpecs();
    entitySpecs.setSpecId(specId);
    List<EntitySpecs> entitySpecsList = new ArrayList<>();
    entitySpecsList.add(entitySpecs);

    PaginatedList<EntitySpecs> entitySpecsPaginated = new PaginatedList<EntitySpecs>();
    entitySpecsPaginated.setRecords(entitySpecsList);

    ResponseEntity<PaginatedList<EntitySpecs>> entitySpecsRsp =
        new ResponseEntity<PaginatedList<EntitySpecs>>(entitySpecsPaginated, HttpStatus.OK);

    when(entitySpecsClient.findEntitySpecs(1, Integer.MAX_VALUE, null, "specId==1"))
        .thenReturn(entitySpecsRsp);

    subscriptionPropertyServiceImpl.findInUseOfferings(specId, page, size, null, null, null, null,
        null);
  }


  @Test
  public void shouldGetSubscriptionPropertyForEdit() throws Exception {

    SubscriptionProperty record1 = new SubscriptionProperty();
    String[] sort = {PropertyRsqlConstants.CATEGORY_ASC};
    when(sharedPropertyClient.findSharedProperty(page, size, sort, "specId==1", null, null, null))
        .thenReturn(sharedPropertyRspEntityPaginated3);

    when(sharedPropertyClient.findSharedProperty(page, size, sort, null, null, null, null))
        .thenReturn(sharedPropertyRspEntityPaginated);

    BeanUtils.copyProperties(sharedPropertyRspEntityPaginated, record1);
    when(localizedEntity.localizedFindEntity(sharedPropertyPaginated))
        .thenReturn(sharedPropertyPaginated);
    Integer entityCount = 1;
    record1.setEntityCount(entityCount);
    record1.getCategoryNames();
    subscriptionPropertyServiceImpl.getSubscriptionPropertyForEdit(specId);
  }

  @Test
  public void shouldDeleteSubscriptionProperty() throws EcbBaseException {
    ResponseEntity<Boolean> booleanRsp = new ResponseEntity<>(true, HttpStatus.OK);
    when(sharedPropertyClient.deleteSharedProperty(specId)).thenReturn(booleanRsp);
    subscriptionPropertyServiceImpl.deleteSubscriptionProperty(specId);
  }

  @Test
  public void shouldAddSubscriptionPropertyToOfferings() throws EcbBaseException {
    List<Integer> specIds = new ArrayList<Integer>();
    specIds.add(1);
    ResponseEntity<Boolean> booleanRsp = new ResponseEntity<>(true, HttpStatus.OK);
    when(sharedPropertyClient.addSharedPropertyToProductOffer(offerId, specId))
        .thenReturn(booleanRsp);
    subscriptionPropertyServiceImpl.addSubscriptionPropertyToOfferings(offerId, specIds);
  }

  @Test
  public void shouldAddSubscriptionPropertyToOfferingsForHttpCatch() throws EcbBaseException {
    List<Integer> specIds = new ArrayList<Integer>();
    specIds.add(1);
    HttpClientErrorException httpClientErrorException =
        new HttpClientErrorException(HttpStatus.NOT_FOUND);
    when(sharedPropertyClient.addSharedPropertyToProductOffer(offerId, specId))
        .thenThrow(httpClientErrorException);
    subscriptionPropertyServiceImpl.addSubscriptionPropertyToOfferings(offerId, specIds);
  }

  @Test
  public void shouldAddSubscriptionPropertyToOfferingsForEcbCatch() throws EcbBaseException {
    List<Integer> specIds = new ArrayList<Integer>();
    specIds.add(1);
    EcbBaseException ecbBaseException = new EcbBaseException();
    when(sharedPropertyClient.addSharedPropertyToProductOffer(offerId, specId))
        .thenThrow(ecbBaseException);
    subscriptionPropertyServiceImpl.addSubscriptionPropertyToOfferings(offerId, specIds);
  }

  @Test
  public void shoudRemoveSubscriptionPropertyFromProductOffer() throws EcbBaseException {
    ResponseEntity<Boolean> booleanRsp = new ResponseEntity<>(true, HttpStatus.OK);
    when(sharedPropertyClient.removeSharedPropertyFromProductOffer(offerId, specId))
        .thenReturn(booleanRsp);
    subscriptionPropertyServiceImpl.removeSubscriptionPropertyFromProductOffer(offerId, specId);
  }

  @Test
  public void shouldfindEditingForSubscriptionFilter() {
    subscriptionPropertyServiceImpl.findEditingForSubscriptionFilter();
  }

  @Test
  public void shouldfindSubscriptionPropertyType() {
    subscriptionPropertyServiceImpl.findSubscriptionPropertyType();
  }


  @Test
  public void shouldUpdateSubscriptionProperty() throws EcbBaseException {
    SharedPropertyModel sharedPropertyModel = new SharedPropertyModel();

    SharedProperty sharedProperty = new SharedProperty();
    List<SharedProperty> sharedPropertyList = new ArrayList<>();
    sharedProperty.setScvId(1);
    sharedProperty.setValue("value");
    sharedProperty.setValueId(2);
    sharedProperty.setDefault(true);
    sharedPropertyList.add(sharedProperty);

    LocalizedSpecificationCharacteristicValue localizedSpecificationCharacteristicValue =
        new LocalizedSpecificationCharacteristicValue();
    localizedSpecificationCharacteristicValue.setValue(sharedProperty.getValue());
    localizedSpecificationCharacteristicValue.setValueId(sharedProperty.getValueId());
    localizedSpecificationCharacteristicValue.setScvId(sharedProperty.getScvId());
    localizedSpecificationCharacteristicValue.setIsDefault(sharedProperty.getDefault());

    sharedPropertyModel.getValues().add(localizedSpecificationCharacteristicValue);

    SubscriptionProperty subscriptionProperty = new SubscriptionProperty();
    subscriptionProperty.setUserEditable(true);
    subscriptionProperty.setIsRequired(true);
    subscriptionProperty.setCategory("Category1");
    subscriptionProperty.setName("Name");
    subscriptionProperty.setDescription("Desc");
    subscriptionProperty.setSpecType(0);
    subscriptionProperty.setUserVisible(true);
    subscriptionProperty.getValues().add(localizedSpecificationCharacteristicValue);

    sharedPropertyModel.setCategory(subscriptionProperty.getCategory());
    sharedPropertyModel.setName(subscriptionProperty.getName());
    sharedPropertyModel.setDescription(subscriptionProperty.getDescription());
    sharedPropertyModel.setSpecType(subscriptionProperty.getSpecType());
    sharedPropertyModel.setIsRequired(subscriptionProperty.getIsRequired());
    sharedPropertyModel.setUserEditable(subscriptionProperty.getUserEditable());
    sharedPropertyModel.setUserVisible(subscriptionProperty.getUserVisible());

    sharedPropertyModel.getValues().clear();
    sharedPropertyModel.getValues().addAll(subscriptionProperty.getValues());

    sharedPropertyModel.setMinValue(subscriptionProperty.getMinValue());
    sharedPropertyModel.setMaxValue(subscriptionProperty.getMaxValue());

    Set<String> fields = new HashSet<>();
    fields.add("name");
    PaginatedList<SharedProperty> paginatedList = new PaginatedList<>();
    paginatedList.setRecords(sharedPropertyList);
    ResponseEntity<PaginatedList<SharedProperty>> sharedPropertyRsp =
        new ResponseEntity<PaginatedList<SharedProperty>>(paginatedList, HttpStatus.OK);
    when(sharedPropertyClient.findSharedProperty(page, size, null, "specId==1", null, null, null))
        .thenReturn(sharedPropertyRsp);


    ResponseEntity<SharedPropertyModel> sharedPropertyModelRsp =
        new ResponseEntity<SharedPropertyModel>(sharedPropertyModel, HttpStatus.OK);
    when(sharedPropertyClient.updateSelectiveSharedProperty(sharedPropertyModel, fields, specId))
        .thenReturn(sharedPropertyModelRsp);

    when(localizedEntity.localizedUpdateEntity(sharedPropertyModel))
        .thenReturn(sharedPropertyModel);

    Boolean result = Boolean.TRUE;
    when(entityHelper.updateSelective(sharedPropertyModel, fields, specId)).thenReturn(result);

    subscriptionPropertyServiceImpl.updateSubscriptionProperty(subscriptionProperty, fields,
        specId);
  }

  @Test
  public void shouldUpdateSubscriptionPropertyForElseIf() throws EcbBaseException {
    SharedPropertyModel sharedPropertyModel = new SharedPropertyModel();

    SharedProperty sharedProperty = new SharedProperty();
    List<SharedProperty> sharedPropertyList = new ArrayList<>();
    sharedProperty.setScvId(1);
    sharedProperty.setValue("value");
    sharedProperty.setValueId(2);
    sharedProperty.setDefault(true);
    sharedPropertyList.add(sharedProperty);

    LocalizedSpecificationCharacteristicValue localizedSpecificationCharacteristicValue =
        new LocalizedSpecificationCharacteristicValue();
    localizedSpecificationCharacteristicValue.setValue(sharedProperty.getValue());
    localizedSpecificationCharacteristicValue.setValueId(sharedProperty.getValueId());
    localizedSpecificationCharacteristicValue.setScvId(sharedProperty.getScvId());
    localizedSpecificationCharacteristicValue.setIsDefault(sharedProperty.getDefault());

    sharedPropertyModel.getValues().add(localizedSpecificationCharacteristicValue);

    SubscriptionProperty subscriptionProperty = new SubscriptionProperty();
    subscriptionProperty.setUserEditable(true);
    subscriptionProperty.setIsRequired(true);
    subscriptionProperty.setCategory("Category1");
    subscriptionProperty.setName("Name");
    subscriptionProperty.setDescription("Desc");
    subscriptionProperty.setSpecType(3);
    subscriptionProperty.setUserVisible(true);
    subscriptionProperty.getValues().add(localizedSpecificationCharacteristicValue);

    sharedPropertyModel.setCategory(subscriptionProperty.getCategory());
    sharedPropertyModel.setName(subscriptionProperty.getName());
    sharedPropertyModel.setDescription(subscriptionProperty.getDescription());
    sharedPropertyModel.setSpecType(subscriptionProperty.getSpecType());
    sharedPropertyModel.setIsRequired(subscriptionProperty.getIsRequired());
    sharedPropertyModel.setUserEditable(subscriptionProperty.getUserEditable());
    sharedPropertyModel.setUserVisible(subscriptionProperty.getUserVisible());

    sharedPropertyModel.getValues().clear();
    sharedPropertyModel.getValues().addAll(subscriptionProperty.getValues());

    sharedPropertyModel.setMinValue(subscriptionProperty.getMinValue());
    sharedPropertyModel.setMaxValue(subscriptionProperty.getMaxValue());

    Set<String> fields = new HashSet<>();
    fields.add("name");

    PaginatedList<SharedProperty> paginatedList = new PaginatedList<>();
    paginatedList.setRecords(sharedPropertyList);
    ResponseEntity<PaginatedList<SharedProperty>> sharedPropertyRsp =
        new ResponseEntity<PaginatedList<SharedProperty>>(paginatedList, HttpStatus.OK);
    when(sharedPropertyClient.findSharedProperty(page, size, null, "specId==1", null, null, null))
        .thenReturn(sharedPropertyRsp);

    ResponseEntity<SharedPropertyModel> sharedPropertyModelRsp =
        new ResponseEntity<SharedPropertyModel>(sharedPropertyModel, HttpStatus.OK);
    when(sharedPropertyClient.updateSelectiveSharedProperty(sharedPropertyModel, fields, specId))
        .thenReturn(sharedPropertyModelRsp);

    when(localizedEntity.localizedUpdateEntity(sharedPropertyModel))
        .thenReturn(sharedPropertyModel);

    subscriptionPropertyServiceImpl.updateSubscriptionProperty(subscriptionProperty, fields,
        specId);
  }

  @Test
  public void shouldUpdateSubscriptionPropertyForNull() throws EcbBaseException {
    SharedPropertyModel sharedPropertyModel = new SharedPropertyModel();

    SharedProperty sharedProperty = new SharedProperty();
    List<SharedProperty> sharedPropertyList = new ArrayList<>();
    sharedProperty.setScvId(1);
    sharedProperty.setValue("value");
    sharedProperty.setValueId(2);
    sharedProperty.setDefault(true);
    sharedPropertyList.add(sharedProperty);

    LocalizedSpecificationCharacteristicValue localizedSpecificationCharacteristicValue =
        new LocalizedSpecificationCharacteristicValue();
    localizedSpecificationCharacteristicValue.setValue(sharedProperty.getValue());
    localizedSpecificationCharacteristicValue.setValueId(sharedProperty.getValueId());
    localizedSpecificationCharacteristicValue.setScvId(sharedProperty.getScvId());
    localizedSpecificationCharacteristicValue.setIsDefault(sharedProperty.getDefault());

    sharedPropertyModel.getValues().add(localizedSpecificationCharacteristicValue);

    SubscriptionProperty subscriptionProperty = new SubscriptionProperty();
    subscriptionProperty.setUserEditable(true);
    subscriptionProperty.setIsRequired(true);
    subscriptionProperty.setCategory("Category1");
    subscriptionProperty.setName("Name");
    subscriptionProperty.setDescription("Desc");
    subscriptionProperty.setSpecType(3);
    subscriptionProperty.setUserVisible(true);
    subscriptionProperty.getValues().add(localizedSpecificationCharacteristicValue);

    sharedPropertyModel.setCategory(subscriptionProperty.getCategory());
    sharedPropertyModel.setName(subscriptionProperty.getName());
    sharedPropertyModel.setDescription(subscriptionProperty.getDescription());
    sharedPropertyModel.setSpecType(subscriptionProperty.getSpecType());
    sharedPropertyModel.setIsRequired(subscriptionProperty.getIsRequired());
    sharedPropertyModel.setUserEditable(subscriptionProperty.getUserEditable());
    sharedPropertyModel.setUserVisible(subscriptionProperty.getUserVisible());

    sharedPropertyModel.getValues().clear();
    sharedPropertyModel.getValues().addAll(subscriptionProperty.getValues());

    sharedPropertyModel.setMinValue(subscriptionProperty.getMinValue());
    sharedPropertyModel.setMaxValue(subscriptionProperty.getMaxValue());

    Set<String> fields = new HashSet<>();
    fields.add("name");

    PaginatedList<SharedProperty> paginatedList = new PaginatedList<>();
    paginatedList.setRecords(sharedPropertyList);
    ResponseEntity<PaginatedList<SharedProperty>> sharedPropertyRsp =
        new ResponseEntity<PaginatedList<SharedProperty>>(paginatedList, HttpStatus.OK);
    when(sharedPropertyClient.findSharedProperty(page, size, null, "specId==1", null, null, null))
        .thenReturn(sharedPropertyRsp);

    ResponseEntity<SharedPropertyModel> sharedPropertyModelRsp =
        new ResponseEntity<>(null, HttpStatus.OK);
    when(sharedPropertyClient.updateSelectiveSharedProperty(sharedPropertyModel, fields, specId))
        .thenReturn(sharedPropertyModelRsp);

    when(localizedEntity.localizedUpdateEntity(sharedPropertyModel))
        .thenReturn(sharedPropertyModel);

    subscriptionPropertyServiceImpl.updateSubscriptionProperty(subscriptionProperty, fields,
        specId);
  }

}
