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
import com.ericsson.ecb.catalog.client.NonRecurringChargeClient;
import com.ericsson.ecb.catalog.model.LocalizedNonRecurringChargeTemplate;
import com.ericsson.ecb.catalog.model.NonRecurringCharge;
import com.ericsson.ecb.catalog.model.NonRecurringChargeTemplate;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemTemplateModel;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.PriceableItemNonRecurringServiceImpl;
import com.ericsson.ecb.ui.metraoffer.utils.EntityHelper;

public class PriceableItemNonRecurringServiceImplTest {

  @InjectMocks
  private PriceableItemNonRecurringServiceImpl priceableItemNonRecurringServiceImpl;

  @Mock
  private NonRecurringChargeClient nonRecurringChargeClient;

  @Mock
  private MetadataConfigService metadataConfigService;

  @Mock
  private PriceableItemTemplateService priceableItemTemplateService;

  @Mock
  private AdjustmentTypeService adjustmentTypeService;

  @Mock
  private ExtendedPriceableItemTemplateClient extendedPriceableItemTemplateClient;

  @Mock
  private LocalizedEntityService localizedEntity;

  @Mock
  private EntityHelper entityHelper;

  private NonRecurringCharge nonRecurringCharge;

  private List<NonRecurringCharge> nonRecurringChargeList;

  private PaginatedList<NonRecurringCharge> nonRecurringChargePaginated;

  private Integer propId = 1;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    nonRecurringCharge = new NonRecurringCharge();
    nonRecurringChargeList = new ArrayList<>();
    nonRecurringChargeList.add(nonRecurringCharge);
    nonRecurringChargePaginated = new PaginatedList<>();
    nonRecurringChargePaginated.setRecords(nonRecurringChargeList);
  }

  @Test
  public void shouldGetNonRecurringChargeDetails() throws Exception {
    nonRecurringCharge.setPropId(propId);
    ResponseEntity<NonRecurringCharge> rspEntity =
        new ResponseEntity<>(nonRecurringCharge, HttpStatus.OK);
    when(nonRecurringChargeClient.getNonRecurringCharge(propId)).thenReturn(rspEntity);

    PriceableItemTemplateModel priceableItemTemplateModel = new PriceableItemTemplateModel();
    priceableItemTemplateModel.setOfferingsCount(1);
    priceableItemTemplateModel.setSharedRateListCount(1);
    when(priceableItemTemplateService.getPriceableItemTemplateDetails(propId))
        .thenReturn(priceableItemTemplateModel);

    priceableItemNonRecurringServiceImpl.getNonRecurringChargeDetails(propId);
  }

  @Test
  public void shouldCreateNonRecurringChargePriceableItemTemplate() throws EcbBaseException {
    LocalizedNonRecurringChargeTemplate record = new LocalizedNonRecurringChargeTemplate();

    ResponseEntity<NonRecurringChargeTemplate> value = new ResponseEntity<>(record, HttpStatus.OK);
    when(extendedPriceableItemTemplateClient.createNonRecurringChargePriceableItemTemplate(record))
        .thenReturn(value);
    when(localizedEntity.localizedCreateEntity(record)).thenReturn(record);

    priceableItemNonRecurringServiceImpl.createNonRecurringChargePriceableItemTemplate(record);
  }

  @Test
  public void shouldGetNonRecurringCharge() throws Exception {
    NonRecurringCharge nonRecurringCharge = new NonRecurringCharge();
    ResponseEntity<NonRecurringCharge> value =
        new ResponseEntity<>(nonRecurringCharge, HttpStatus.OK);
    when(nonRecurringChargeClient.getNonRecurringCharge(propId)).thenReturn(value);
    priceableItemNonRecurringServiceImpl.getNonRecurringCharge(propId);
  }

  @Test
  public void shouldFindNonRecurringCharge() throws EcbBaseException {

    ResponseEntity<PaginatedList<NonRecurringCharge>> value =
        new ResponseEntity<PaginatedList<NonRecurringCharge>>(nonRecurringChargePaginated,
            HttpStatus.OK);
    when(nonRecurringChargeClient.findNonRecurringCharge(1, Integer.MAX_VALUE, null, null, null,
        null, null)).thenReturn(value);

    priceableItemNonRecurringServiceImpl.findNonRecurringCharge(1, Integer.MAX_VALUE, null, null,
        null, null, null);
  }

  @Test
  public void shouldUpdateNonRecurringChargePriceableItemTemplate() throws EcbBaseException {
    NonRecurringChargeTemplate record = new NonRecurringChargeTemplate();
    Set<String> fields = new HashSet<>();
    Boolean result = Boolean.TRUE;
    when(entityHelper.updateSelective(record, fields, propId)).thenReturn(result);
    priceableItemNonRecurringServiceImpl.updateNonRecurringChargePriceableItemTemplate(record,
        fields, propId);
  }

  @Test
  public void shouldUpdateNonRecurringCharge() throws EcbBaseException {
    NonRecurringCharge record = new NonRecurringCharge();
    ResponseEntity<NonRecurringCharge> value = new ResponseEntity<>(record, HttpStatus.OK);
    when(nonRecurringChargeClient.updateNonRecurringCharge(record, propId)).thenReturn(value);
    when(localizedEntity.localizedUpdateEntity(record)).thenReturn(record);
    priceableItemNonRecurringServiceImpl.updateNonRecurringCharge(record, propId);
  }
}
