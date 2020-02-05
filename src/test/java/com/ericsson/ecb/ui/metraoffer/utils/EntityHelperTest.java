package com.ericsson.ecb.ui.metraoffer.utils;

import static org.mockito.Mockito.when;

import java.util.HashSet;
import java.util.Set;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ericsson.ecb.catalog.client.ExtendedPriceableItemTemplateClient;
import com.ericsson.ecb.catalog.client.PriceableItemInstanceClient;
import com.ericsson.ecb.catalog.client.ProductOfferClient;
import com.ericsson.ecb.catalog.client.ReasonCodeClient;
import com.ericsson.ecb.catalog.client.SharedPropertyClient;
import com.ericsson.ecb.catalog.model.DiscountTemplate;
import com.ericsson.ecb.catalog.model.NonRecurringChargeTemplate;
import com.ericsson.ecb.catalog.model.PriceableItemInstanceDetails;
import com.ericsson.ecb.catalog.model.ProductOffer;
import com.ericsson.ecb.catalog.model.ReasonCode;
import com.ericsson.ecb.catalog.model.SharedPropertyModel;
import com.ericsson.ecb.catalog.model.UnitDependentRecurringChargeTemplate;
import com.ericsson.ecb.catalog.model.UsagePriceableItemTemplate;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.exception.EcbConfigResourceNotFoundException;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.model.SubscriptionProperty;

public class EntityHelperTest {

  @InjectMocks
  private EntityHelper entityHelper;

  @Mock
  private LocalizedEntityService localizedEntityService;

  @Mock
  private ProductOfferClient productOfferClient;

  @Mock
  private SharedPropertyClient sharedPropertyClient;

  @Mock
  private ReasonCodeClient reasonCodeClient;

  @Mock
  private ExtendedPriceableItemTemplateClient extendedPriceableItemTemplateClient;
  
  @Mock
  private PriceableItemInstanceClient priceableItemInstanceClient;

  private Integer id = 1;
  private Set<String> fields = null;
  private Set<String> nonLocalizedFields = null;

  @Before
  public void init() throws EcbConfigResourceNotFoundException {
    MockitoAnnotations.initMocks(this);
    fields = new HashSet<>();
    fields.add("displayName");

    nonLocalizedFields = new HashSet<>();
  }

  @Test
  public void shouldupdateSelectiveProductOffer() throws EcbBaseException {
    nonLocalizedFields.add("hidden");
    fields.addAll(nonLocalizedFields);
    ProductOffer record = new ProductOffer();
    ResponseEntity<ProductOffer> value = new ResponseEntity<>(record, HttpStatus.OK);
    when(productOfferClient.updateSelectiveProductOffer(record, nonLocalizedFields, id))
        .thenReturn(value);
    when(localizedEntityService.localizedUpdateEntity(record)).thenReturn(record);
    entityHelper.updateSelective(record, fields, id);
  }

  @Test
  public void shouldupdateSelectiveSharedPropertyModel() throws EcbBaseException {
    nonLocalizedFields.add("userEditable");
    fields.addAll(nonLocalizedFields);
    SubscriptionProperty record = new SubscriptionProperty();
    SharedPropertyModel sharedPropertyModel = new SharedPropertyModel();
    BeanUtils.copyProperties(record, sharedPropertyModel);
    sharedPropertyModel.getValues().clear();
    sharedPropertyModel.getValues().addAll(record.getValues());
    ResponseEntity<SharedPropertyModel> value =
        new ResponseEntity<>(sharedPropertyModel, HttpStatus.OK);
    when(sharedPropertyClient.updateSelectiveSharedProperty(sharedPropertyModel, nonLocalizedFields,
        id)).thenReturn(value);

    when(localizedEntityService.localizedUpdateEntity(record)).thenReturn(record);
    entityHelper.updateSelective(record, fields, id);
  }

  @Test
  public void shouldupdateSelectiveReasonCode() throws EcbBaseException {
    nonLocalizedFields.add("hidden");
    fields.addAll(nonLocalizedFields);
    ReasonCode record = new ReasonCode();
    ResponseEntity<ReasonCode> value = new ResponseEntity<>(record, HttpStatus.OK);

    when(reasonCodeClient.updateSelectiveReasonCode(record, nonLocalizedFields, id))
        .thenReturn(value);

    when(localizedEntityService.localizedUpdateEntity(record)).thenReturn(record);
    entityHelper.updateSelective(record, fields, id);
  }

  @Test
  public void shouldupdateSelectiveUsagePriceableItemTemplate() throws EcbBaseException {
    nonLocalizedFields.add("hidden");
    fields.addAll(nonLocalizedFields);
    UsagePriceableItemTemplate record = new UsagePriceableItemTemplate();
    ResponseEntity<UsagePriceableItemTemplate> value = new ResponseEntity<>(record, HttpStatus.OK);

    when(extendedPriceableItemTemplateClient.updateSelectiveUsagePriceableItemTemplate(record,
        nonLocalizedFields, id)).thenReturn(value);

    when(localizedEntityService.localizedUpdateEntity(record)).thenReturn(record);
    entityHelper.updateSelective(record, fields, id);
  }


  @Test
  public void shouldupdateSelectiveUnitDependentRecurringChargeTemplate() throws EcbBaseException {
    nonLocalizedFields.add("hidden");
    fields.addAll(nonLocalizedFields);
    UnitDependentRecurringChargeTemplate record = new UnitDependentRecurringChargeTemplate();
    record.setKind(PropertyKind.RECURRING);
    ResponseEntity<UnitDependentRecurringChargeTemplate> value =
        new ResponseEntity<>(record, HttpStatus.OK);

    when(extendedPriceableItemTemplateClient.updateRecurringChargePriceableItemTemplate(record,
        fields, id)).thenReturn(value);

    when(localizedEntityService.localizedUpdateEntity(record)).thenReturn(record);
    entityHelper.updateSelective(record, fields, id);
  }

  @Test
  public void shouldupdateSelectiveDiscountTemplate() throws EcbBaseException {
    nonLocalizedFields.add("hidden");
    fields.addAll(nonLocalizedFields);
    DiscountTemplate record = new DiscountTemplate();
    ResponseEntity<DiscountTemplate> value = new ResponseEntity<>(record, HttpStatus.OK);

    when(extendedPriceableItemTemplateClient
        .updateDiscountPriceableItemTemplate((DiscountTemplate) record, fields, id))
            .thenReturn(value);

    when(localizedEntityService.localizedUpdateEntity(record)).thenReturn(record);
    entityHelper.updateSelective(record, fields, id);
  }

  @Test
  public void shouldupdateSelectiveNonRecurringChargeTemplate() throws EcbBaseException {
    nonLocalizedFields.add("hidden");
    fields.addAll(nonLocalizedFields);
    NonRecurringChargeTemplate record = new NonRecurringChargeTemplate();
    ResponseEntity<NonRecurringChargeTemplate> value = new ResponseEntity<>(record, HttpStatus.OK);

    when(extendedPriceableItemTemplateClient.updateNonRecurringChargePriceableItemTemplate(
        (NonRecurringChargeTemplate) record, fields, id)).thenReturn(value);

    when(localizedEntityService.localizedUpdateEntity(record)).thenReturn(record);
    entityHelper.updateSelective(record, fields, id);
  }
  
  @Test
  public void shouldupdateEntityInstance() throws EcbBaseException {
    nonLocalizedFields.add("hidden");
    fields.addAll(nonLocalizedFields);
    PriceableItemInstanceDetails record = new PriceableItemInstanceDetails();
    record.setKind(PropertyKind.RECURRING);
    ResponseEntity<PriceableItemInstanceDetails> value =
        new ResponseEntity<>(record, HttpStatus.OK);

    when(priceableItemInstanceClient.updatePriceableItemInstanceSelectiveMap(record, 1, id,
        nonLocalizedFields)).thenReturn(value);
    when(localizedEntityService.localizedUpdateEntity(record)).thenReturn(record);

    entityHelper.updateEntityInstance(record, 1, id, fields);
  }
}
