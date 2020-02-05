package com.ericsson.ecb.ui.metraoffer.service;

import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ericsson.ecb.catalog.client.ExtendedPriceableItemTemplateClient;
import com.ericsson.ecb.catalog.client.RecurringChargeUnitValuesClient;
import com.ericsson.ecb.catalog.client.UnitDependentRecurringChargeClient;
import com.ericsson.ecb.catalog.model.CycleMode;
import com.ericsson.ecb.catalog.model.LocalizedUnitDependentRecurringChargeTemplate;
import com.ericsson.ecb.catalog.model.RecurringChargeUnitValues;
import com.ericsson.ecb.catalog.model.UnitDependentRecurringCharge;
import com.ericsson.ecb.catalog.model.UnitDependentRecurringChargeTemplate;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.UsageCycle;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.model.ExtendedProperty;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemTemplateModel;
import com.ericsson.ecb.ui.metraoffer.model.UnitDependentRecurringChargeModel;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.PriceableItemUnitDependentRecurringServiceImpl;
import com.ericsson.ecb.ui.metraoffer.utils.EntityHelper;

public class PriceableItemUnitDependentRecurringServiceImplTest {

  @InjectMocks
  private PriceableItemUnitDependentRecurringServiceImpl priceableItemUnitDependentRecurringServiceImpl;

  @Mock
  private UnitDependentRecurringChargeClient unitDependentRecurringChargeClient;

  @Mock
  private MetadataConfigService metadataConfigService;

  @Mock
  private PriceableItemTemplateService priceableItemTemplateService;

  @Mock
  private AdjustmentTypeService adjustmentTypeService;;

  @Mock
  private PriceableItemRecurringService priceableItemRecurringService;

  @Mock
  private RecurringChargeUnitValuesClient recurringChargeUnitValuesClient;

  @Mock
  private ExtendedPriceableItemTemplateClient extendedPriceableItemTemplateClient;

  @Mock
  private LocalizedEntityService localizedEntity;

  @Mock
  private EntityHelper entityHelper;

  private UnitDependentRecurringCharge unitDependentRecurringCharge;

  private Integer propId = 1;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    unitDependentRecurringCharge = new UnitDependentRecurringCharge();

  }

  @Test
  public void shouldGetUnitDependentRecurringChargeDetails() throws Exception {

    UnitDependentRecurringChargeModel unitDependentRecurringChargeModel =
        new UnitDependentRecurringChargeModel();
    unitDependentRecurringCharge.setCycleMode(CycleMode.FIXED);
    unitDependentRecurringCharge.setUsageCycleId(1);
    when(unitDependentRecurringChargeClient.getUnitDependentRecurringCharge(propId))
        .thenReturn(unitDependentRecurringCharge);

    PriceableItemTemplateModel priceableItemTemplateModel = new PriceableItemTemplateModel();
    priceableItemTemplateModel.setOfferingsCount(1);
    priceableItemTemplateModel.setSharedRateListCount(1);
    when(priceableItemTemplateService.getPriceableItemTemplateDetails(propId))
        .thenReturn(priceableItemTemplateModel);

    Boolean flag = Boolean.TRUE;
    when(adjustmentTypeService.isAdjustmentTypeExist(1)).thenReturn(flag);

    List<ExtendedProperty> extendedProperties = new ArrayList<>();
    when(metadataConfigService.getExtendedProperties(
        unitDependentRecurringChargeModel.getProperties(),
        unitDependentRecurringChargeModel.getKindType())).thenReturn(extendedProperties);
    RecurringChargeUnitValues recurringChargeUnitValues = new RecurringChargeUnitValues();

    Collection<RecurringChargeUnitValues> recurringChargeUnitValuesList = new ArrayList<>();;
    recurringChargeUnitValuesList.add(recurringChargeUnitValues);
    PaginatedList<RecurringChargeUnitValues> paginated =
        new PaginatedList<RecurringChargeUnitValues>();
    paginated.setRecords(recurringChargeUnitValuesList);

    ResponseEntity<PaginatedList<RecurringChargeUnitValues>> value =
        new ResponseEntity<PaginatedList<RecurringChargeUnitValues>>(paginated, HttpStatus.OK);
    when(recurringChargeUnitValuesClient.findRecurringChargeUnitValues(1, Integer.MAX_VALUE, null,
        PropertyRsqlConstants.PROP_ID_EQUAL + 1)).thenReturn(value);

    UsageCycle usageCycle = new UsageCycle();
    when(priceableItemTemplateService.getUsageCycle(1)).thenReturn(usageCycle);

    priceableItemUnitDependentRecurringServiceImpl.getUnitDependentRecurringChargeDetails(propId);
  }

  @Test
  public void shouldCreateUniDependentRecurringChargePriceableItemTemplate()
      throws EcbBaseException {

    LocalizedUnitDependentRecurringChargeTemplate record =
        new LocalizedUnitDependentRecurringChargeTemplate();

    when(priceableItemRecurringService.preInitialize(record)).thenReturn(record);
    ResponseEntity<UnitDependentRecurringChargeTemplate> value =
        new ResponseEntity<>(record, HttpStatus.OK);
    when(extendedPriceableItemTemplateClient.createRecurringChargePriceableItemTemplate(record))
        .thenReturn(value);
    when(localizedEntity.localizedCreateEntity(record)).thenReturn(record);

    priceableItemUnitDependentRecurringServiceImpl
        .createUniDependentRecurringChargePriceableItemTemplate(record);
  }

  @Test
  public void shouldGetUnitDependentRecurringCharge() throws Exception {
    when(unitDependentRecurringChargeClient.getUnitDependentRecurringCharge(propId))
        .thenReturn(unitDependentRecurringCharge);
    priceableItemUnitDependentRecurringServiceImpl.getUnitDependentRecurringCharge(propId);
  }

  @Test
  public void shouldFindUnitDependentRecurringCharge() throws EcbBaseException {
    List<UnitDependentRecurringCharge> unitDependentRecurringChargeList = new ArrayList<>();
    unitDependentRecurringChargeList.add(unitDependentRecurringCharge);
    PaginatedList<UnitDependentRecurringCharge> paginated = new PaginatedList<>();
    paginated.setRecords(unitDependentRecurringChargeList);

    ResponseEntity<PaginatedList<UnitDependentRecurringCharge>> value =
        new ResponseEntity<PaginatedList<UnitDependentRecurringCharge>>(paginated, HttpStatus.OK);

    when(unitDependentRecurringChargeClient.findUnitDependentRecurringCharge(1, Integer.MAX_VALUE,
        null, null)).thenReturn(value);

    priceableItemUnitDependentRecurringServiceImpl.findUnitDependentRecurringCharge(1,
        Integer.MAX_VALUE, null, null);
  }

  @Test
  public void shouldUpdateUnitRecurringChargePriceableItemTemplate() throws Exception {
    UnitDependentRecurringChargeTemplate record = new UnitDependentRecurringChargeTemplate();;
    Set<String> fields = new HashSet<>();
    Boolean result = Boolean.TRUE;
    when(entityHelper.updateSelective(record, fields, propId)).thenReturn(result);
    priceableItemUnitDependentRecurringServiceImpl
        .updateUnitRecurringChargePriceableItemTemplate(record, fields, propId);
  }
}
