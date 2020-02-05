package com.ericsson.ecb.ui.metraoffer.service;

import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ericsson.ecb.catalog.client.AdjustmentClient;
import com.ericsson.ecb.catalog.client.PriceableItemInstanceClient;
import com.ericsson.ecb.catalog.model.Adjustment;
import com.ericsson.ecb.catalog.model.PriceableItemInstanceDetails;
import com.ericsson.ecb.catalog.model.PricelistMapping;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.AdjustmentModel;
import com.ericsson.ecb.ui.metraoffer.model.ExtendedProperty;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemRecurringService.BiWeeklyInterval;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.PriceableItemInstanceServiceImpl;
import com.ericsson.ecb.ui.metraoffer.utils.EntityHelper;

public class PriceableItemInstanceServiceImplTest {

  @Mock
  private PriceableItemInstanceClient priceableItemInstanceClient;

  @Mock
  private AdjustmentClient adjustmentClient;

  @Mock
  private MetadataConfigService metadataConfigService;

  @Mock
  private PricelistMappingService pricelistMappingService;

  @Mock
  private PriceableItemRecurringService priceableItemRecurringService;

  @Mock
  private LocalizedEntityService localizedEntity;

  @Mock
  private AdjustmentService adjustmentService;

  @Mock
  private LocalizedEntityService localizedEntityService;

  @Mock
  private EntityHelper entityHelper;

  @InjectMocks
  private PriceableItemInstanceServiceImpl priceableItemInstanceServiceImpl;

  private ResponseEntity<Boolean> addPiToPoResponseEntity;

  private Integer offerId = 1;
  private Integer piTemplateId1 = 1;
  private Integer piTemplateId2 = 2;
  private Integer piInstanceId = 1;
  private List<Integer> piTemplateIdList = new ArrayList<Integer>();
  private PriceableItemInstanceDetails priceableItemInstanceDetails;
  private Set<String> fields = new HashSet<String>();

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    piTemplateIdList.add(piTemplateId1);
    piTemplateIdList.add(piTemplateId2);
    priceableItemInstanceDetails = new PriceableItemInstanceDetails();
    addPiToPoResponseEntity = new ResponseEntity<Boolean>(true, HttpStatus.OK);
    fields.add("properties");
  }

  @Test
  public void shouldGetPriceableItemInstance() throws Exception {
    priceableItemInstanceDetails.setKind(PropertyKind.USAGE);
    priceableItemInstanceDetails.getProperties().put("glCode", "123");
    priceableItemInstanceDetails.getValidEnumValues().add(new BigDecimal(1));
    priceableItemInstanceDetails.setKind(PropertyKind.RECURRING);
    Map<String, Object> properties = new HashMap<String, Object>();
    properties.put("glCode", "123");
    properties.put("ExternalURL", "test");
    ResponseEntity<PriceableItemInstanceDetails> responseEntity =
        new ResponseEntity<PriceableItemInstanceDetails>(priceableItemInstanceDetails,
            HttpStatus.OK);
    when(priceableItemInstanceClient.getPriceableItemInstance(offerId, piInstanceId))
        .thenReturn(responseEntity);
    when(metadataConfigService.getExtendedProperties(properties, PropertyKind.USAGE))
        .thenReturn(new ArrayList<ExtendedProperty>());
    when(adjustmentService.getPiInstanceAdjustmentWithReasonCode(piInstanceId))
        .thenReturn(new ArrayList<AdjustmentModel>());
    when(priceableItemRecurringService.getBiWeeklyCycleIntervals())
        .thenReturn(new ArrayList<BiWeeklyInterval>());
    when(localizedEntity.localizedGetEntity(responseEntity)).thenReturn(responseEntity);

    priceableItemInstanceServiceImpl.getPriceableItemInstance(offerId, piInstanceId);
  }

  @Test
  public void shouldDeletePiInstanceByInstanceIdFromOffering() throws Exception {
    ResponseEntity<Boolean> responseEntityBoolean =
        new ResponseEntity<Boolean>(true, HttpStatus.OK);
    when(priceableItemInstanceClient.deletePriceableItemInstanceFromOffering(offerId, piInstanceId))
        .thenReturn(responseEntityBoolean);
    priceableItemInstanceServiceImpl.deletePiInstanceByInstanceIdFromOffering(offerId,
        piInstanceId);
  }

  @Test
  public void shouldAddPriceableItemInstanceToOfferingWithPiInstanceParentIdNull()
      throws Exception {
    when(priceableItemInstanceClient.addPriceableItemInstanceToOffering(offerId, piTemplateId1))
        .thenReturn(addPiToPoResponseEntity);

    Collection<PricelistMapping> pricelistMappings = new ArrayList<>();
    PricelistMapping pricelistMapping = new PricelistMapping();
    pricelistMapping.setItemTemplateId(1);
    pricelistMappings.add(pricelistMapping);
    when(pricelistMappingService.findPricelistMapping(null, PropertyRsqlConstants.OFFER_ID_EQUAL + 1
        + RsqlOperator.AND + PropertyRsqlConstants.PARAM_TABLE_ID_NULL_TRUE))
            .thenReturn(pricelistMappings);
    when(localizedEntity.localizedUpdateAllEntity(pricelistMappings)).thenReturn(pricelistMappings);
    priceableItemInstanceServiceImpl.addPriceableItemInstanceToOffering(offerId, piTemplateId1);
  }


  @Test
  public void shouldAddPriceableItemInstanceToOfferingWithPiInstanceParentIdNotNull()
      throws Exception {
    when(priceableItemInstanceClient.addPriceableItemInstanceToOffering(offerId, piTemplateId1))
        .thenReturn(addPiToPoResponseEntity);

    Collection<PricelistMapping> pricelistMappings = new ArrayList<>();
    PricelistMapping pricelistMapping = new PricelistMapping();
    pricelistMapping.setItemTemplateId(1);
    pricelistMapping.setPiInstanceParentId(1);
    pricelistMappings.add(pricelistMapping);
    when(pricelistMappingService.findPricelistMapping(null, PropertyRsqlConstants.OFFER_ID_EQUAL + 1
        + RsqlOperator.AND + PropertyRsqlConstants.PARAM_TABLE_ID_NULL_TRUE))
            .thenReturn(pricelistMappings);
    when(localizedEntity.localizedUpdateAllEntity(pricelistMappings)).thenReturn(pricelistMappings);
    priceableItemInstanceServiceImpl.addPriceableItemInstanceToOffering(offerId, piTemplateId1);
  }


  @Test
  public void shouldAddPriceableItemInstanceListToOffering() throws Exception {
    when(priceableItemInstanceClient.addPriceableItemInstanceToOffering(offerId, piTemplateId1))
        .thenReturn(addPiToPoResponseEntity);
    when(priceableItemInstanceClient.addPriceableItemInstanceToOffering(offerId, piTemplateId2))
        .thenReturn(addPiToPoResponseEntity);

    Collection<PricelistMapping> pricelistMappings = new ArrayList<>();
    PricelistMapping pricelistMapping1 = new PricelistMapping();
    pricelistMapping1.setItemTemplateId(1);
    pricelistMapping1.setItemInstanceId(11);
    pricelistMapping1.setItemTemplateDescription("ItemTemplateDescription1");
    pricelistMapping1.setItemTemplateDescriptionId(1);
    pricelistMapping1.setItemTemplateDisplayName("ItemTemplateDisplayName1");
    pricelistMapping1.setItemTemplateDisplayNameId(2);
    pricelistMappings.add(pricelistMapping1);

    PricelistMapping pricelistMapping2 = new PricelistMapping();
    pricelistMapping2.setItemTemplateId(2);
    pricelistMapping2.setItemInstanceId(22);
    pricelistMapping2.setItemTemplateDescription("ItemTemplateDescription2");
    pricelistMapping2.setItemTemplateDescriptionId(3);
    pricelistMapping2.setItemTemplateDisplayName("ItemTemplateDisplayName2");
    pricelistMapping2.setItemTemplateDisplayNameId(4);
    pricelistMappings.add(pricelistMapping2);


    when(pricelistMappingService.findPricelistMapping(null, PropertyRsqlConstants.OFFER_ID_EQUAL + 1
        + RsqlOperator.AND + PropertyRsqlConstants.PARAM_TABLE_ID_NULL_TRUE))
            .thenReturn(pricelistMappings);

    PaginatedList<PricelistMapping> pricelistMappingPaginated = new PaginatedList<>();
    pricelistMappingPaginated.setRecords(pricelistMappings);

    localizedEntityService.localizedFindEntity(pricelistMappingPaginated);

    Adjustment instaceAdjustment1 = new Adjustment();
    instaceAdjustment1.setItemInstanceId(11);
    instaceAdjustment1.setDisplayName("instance-displayName1");
    instaceAdjustment1.setDescription("instance-description1");
    instaceAdjustment1.setAdjustmentTypeId(1);
    Adjustment instaceAdjustment2 = new Adjustment();
    instaceAdjustment2.setItemInstanceId(22);
    instaceAdjustment2.setAdjustmentTypeId(2);
    instaceAdjustment2.setDisplayName("instance-displayName1");
    instaceAdjustment2.setDescription("instance-description1");
    List<Adjustment> instanceAdjustments = new ArrayList<>();
    instanceAdjustments.add(instaceAdjustment1);
    instanceAdjustments.add(instaceAdjustment2);
    PaginatedList<Adjustment> instaceAdjustmentPaginated = new PaginatedList<>();
    instaceAdjustmentPaginated.setRecords(instanceAdjustments);
    ResponseEntity<PaginatedList<Adjustment>> instanceAdjustmentRecords =
        new ResponseEntity<>(instaceAdjustmentPaginated, HttpStatus.OK);
    when(adjustmentClient.findAdjustment(1, Integer.MAX_VALUE, null,
        PropertyRsqlConstants.ITEM_INSTANCE_ID_IN + "(22,11)", null, null, null))
            .thenReturn(instanceAdjustmentRecords);


    Adjustment templateAdjustment1 = new Adjustment();
    templateAdjustment1.setItemTemplateId(1);
    templateAdjustment1.setDisplayName("template-displayName1");
    templateAdjustment1.setDescription("template-description1");
    templateAdjustment1.setAdjustmentTypeId(1);
    Adjustment templateadjustment2 = new Adjustment();
    templateadjustment2.setItemTemplateId(2);
    templateadjustment2.setAdjustmentTypeId(2);
    templateadjustment2.setDisplayName("template-displayName1");
    templateadjustment2.setDescription("template-description1");
    List<Adjustment> adjustments = new ArrayList<>();
    adjustments.add(templateAdjustment1);
    adjustments.add(templateadjustment2);
    PaginatedList<Adjustment> templateAdjustmentPaginated = new PaginatedList<>();
    templateAdjustmentPaginated.setRecords(adjustments);
    ResponseEntity<PaginatedList<Adjustment>> templateAdjustmentRecords =
        new ResponseEntity<>(templateAdjustmentPaginated, HttpStatus.OK);
    when(adjustmentClient.findAdjustment(1, Integer.MAX_VALUE, null,
        PropertyRsqlConstants.ITEM_TEMPLATE_ID_IN + "(2,1)", null, null, null))
            .thenReturn(templateAdjustmentRecords);

    priceableItemInstanceServiceImpl.addPriceableItemInstanceListToOffering(offerId,
        piTemplateIdList);
  }

  @Test
  public void shouldUpdatePriceableItemInstance() throws Exception {
    Boolean result = Boolean.TRUE;
    when(entityHelper.updateEntityInstance(priceableItemInstanceDetails, offerId, piInstanceId,
        fields)).thenReturn(result);
    priceableItemInstanceServiceImpl.updatePriceableItemInstance(priceableItemInstanceDetails,
        offerId, piInstanceId, fields);
  }
}
