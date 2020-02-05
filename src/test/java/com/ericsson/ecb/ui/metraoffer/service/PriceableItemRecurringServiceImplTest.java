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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ericsson.ecb.catalog.client.ExtendedPriceableItemTemplateClient;
import com.ericsson.ecb.catalog.client.RecurringChargeClient;
import com.ericsson.ecb.catalog.model.CycleMode;
import com.ericsson.ecb.catalog.model.LocalizedUnitDependentRecurringChargeTemplate;
import com.ericsson.ecb.catalog.model.RecurringCharge;
import com.ericsson.ecb.catalog.model.UnitDependentRecurringChargeTemplate;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.UsageCycle;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntity;
import com.ericsson.ecb.ui.metraoffer.model.ExtendedProperty;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemTemplateModel;
import com.ericsson.ecb.ui.metraoffer.model.UnitDependentRecurringChargeModel;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.PriceableItemRecurringServiceImpl;
import com.ericsson.ecb.ui.metraoffer.utils.EntityHelper;

public class PriceableItemRecurringServiceImplTest {

  @InjectMocks
  private PriceableItemRecurringServiceImpl priceableItemRecurringServiceImpl;

  @Mock
  private RecurringChargeClient recurringChargeClient;

  @Mock
  private MetadataConfigService metadataConfigService;

  @Mock
  private PriceableItemTemplateService priceableItemTemplateService;

  @Mock
  private AdjustmentTypeService adjustmentTypeService;

  @Mock
  private ExtendedPriceableItemTemplateClient extendedPriceableItemTemplateClient;

  @Mock
  private LocalizedEntity localizedEntity;

  @Mock
  private EntityHelper entityHelper;

  private RecurringCharge recurringCharge;

  private Integer propId = 1;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    recurringCharge = new RecurringCharge();

  }

  @Test
  public void shouldGetRecurringChargeDetails() throws Exception {

    UnitDependentRecurringChargeModel unitDependentRecurringChargeModel =
        new UnitDependentRecurringChargeModel();
    recurringCharge.setCycleMode(CycleMode.FIXED);
    recurringCharge.setUsageCycleId(1);

    ResponseEntity<RecurringCharge> value = new ResponseEntity<>(recurringCharge, HttpStatus.OK);
    when(recurringChargeClient.getRecurringCharge(propId)).thenReturn(value);

    PriceableItemTemplateModel value2 = new PriceableItemTemplateModel();
    value2.setOfferingsCount(1);
    value2.setSharedRateListCount(1);
    when(priceableItemTemplateService.getPriceableItemTemplateDetails(propId)).thenReturn(value2);

    Boolean flag = Boolean.TRUE;
    when(adjustmentTypeService.isAdjustmentTypeExist(1)).thenReturn(flag);

    List<ExtendedProperty> extendedProperties = new ArrayList<>();
    when(metadataConfigService.getExtendedProperties(
        unitDependentRecurringChargeModel.getProperties(),
        unitDependentRecurringChargeModel.getKindType())).thenReturn(extendedProperties);

    UsageCycle usageCycle = new UsageCycle();
    when(priceableItemTemplateService.getUsageCycle(1)).thenReturn(usageCycle);

    priceableItemRecurringServiceImpl.getRecurringChargeDetails(propId);
  }

  @Test
  public void shouldCreateRecurringChargePriceableItemTemplate() throws EcbBaseException {
    LocalizedUnitDependentRecurringChargeTemplate record =
        new LocalizedUnitDependentRecurringChargeTemplate();

    ResponseEntity<UnitDependentRecurringChargeTemplate> value =
        new ResponseEntity<>(record, HttpStatus.OK);

    when(extendedPriceableItemTemplateClient.createRecurringChargePriceableItemTemplate(record))
        .thenReturn(value);
    when(localizedEntity.localizedCreateEntity(record)).thenReturn(record);

    priceableItemRecurringServiceImpl.createRecurringChargePriceableItemTemplate(record);
  }

  @Test
  public void shouldGetRecurringCharge() throws Exception {

    ResponseEntity<RecurringCharge> value = new ResponseEntity<>(recurringCharge, HttpStatus.OK);

    when(recurringChargeClient.getRecurringCharge(propId)).thenReturn(value);

    priceableItemRecurringServiceImpl.getRecurringCharge(propId);
  }

  @Test
  public void shouldPreInitialize() {
    LocalizedUnitDependentRecurringChargeTemplate record =
        new LocalizedUnitDependentRecurringChargeTemplate();
    priceableItemRecurringServiceImpl.preInitialize(record);
  }

  @Test
  public void shouldFindRecurringCharge() throws EcbBaseException {

    List<RecurringCharge> records = new ArrayList<>();
    PaginatedList<RecurringCharge> paginated = new PaginatedList<>();
    paginated.setRecords(records);
    ResponseEntity<PaginatedList<RecurringCharge>> value =
        new ResponseEntity<PaginatedList<RecurringCharge>>(paginated, HttpStatus.OK);

    when(recurringChargeClient.findRecurringCharge(1, Integer.MAX_VALUE, null, null, null, null,
        null)).thenReturn(value);
    priceableItemRecurringServiceImpl.findRecurringCharge(1, Integer.MAX_VALUE, null, null, null,
        null, null);
  }

  @Test
  public void shouldupdateRecurringChargePriceableItemTemplate() throws Exception {
    UnitDependentRecurringChargeTemplate record = new UnitDependentRecurringChargeTemplate();
    Set<String> fields = new HashSet<>();
    Boolean result = Boolean.TRUE;
    when(entityHelper.updateSelective(record, fields, propId)).thenReturn(result);
    priceableItemRecurringServiceImpl.updateRecurringChargePriceableItemTemplate(record, fields,
        propId);
  }
}
