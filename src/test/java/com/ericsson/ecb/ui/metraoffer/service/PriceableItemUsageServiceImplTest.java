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
import com.ericsson.ecb.catalog.client.PriceableItemTypeClient;
import com.ericsson.ecb.catalog.client.UsagePriceableItemClient;
import com.ericsson.ecb.catalog.model.PriceableItemTemplate;
import com.ericsson.ecb.catalog.model.PriceableItemType;
import com.ericsson.ecb.catalog.model.UsagePriceableItem;
import com.ericsson.ecb.catalog.model.UsagePriceableItemTemplate;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemTemplateModel;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.PriceableItemUsageServiceImpl;
import com.ericsson.ecb.ui.metraoffer.utils.EntityHelper;

public class PriceableItemUsageServiceImplTest {

  @InjectMocks
  private PriceableItemUsageServiceImpl priceableItemUsageServiceImpl;

  @Mock
  private UsagePriceableItemClient usagePriceableItemClient;

  @Mock
  private PriceableItemTypeClient priceItemTypeClient;

  @Mock
  private PriceableItemTemplateService priceableItemTemplateService;

  @Mock
  PriceableItemUsageService priceableItemUsageService;

  @Mock
  private MetadataConfigService metadataConfigService;

  @Mock
  private AdjustmentTypeService adjustmentTypeService;

  @Mock
  private LocalizedEntityService localizedEntity;

  @Mock
  private ExtendedPriceableItemTemplateClient extendedPriceableItemTemplateClient;

  @Mock
  private EntityHelper entityHelper;

  private Integer piId = 1;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void shouldGetUsagePriceableItem() throws Exception {
    ResponseEntity<UsagePriceableItemTemplate> record =
        new ResponseEntity<UsagePriceableItemTemplate>(HttpStatus.OK);
    when(extendedPriceableItemTemplateClient.getUsagePriceableItemTemplate(piId))
        .thenReturn(record);
    when(localizedEntity.localizedGetEntity(record)).thenReturn(record);
    priceableItemUsageServiceImpl.getUsagePriceableItem(piId);
  }

  @Test
  public void shouldFindUsagePriceableItem() throws EcbBaseException {
    UsagePriceableItem record = new UsagePriceableItem();

    List<UsagePriceableItem> records = new ArrayList<>();
    records.add(record);

    PaginatedList<UsagePriceableItem> paginated = new PaginatedList<>();
    paginated.setRecords(records);

    ResponseEntity<PaginatedList<UsagePriceableItemTemplate>> record1 =
        new ResponseEntity<PaginatedList<UsagePriceableItemTemplate>>(HttpStatus.OK);

    when(extendedPriceableItemTemplateClient.findUsagePriceableItemTemplate(1, Integer.MAX_VALUE,
        null, null, null, null, null)).thenReturn(record1);
    priceableItemUsageServiceImpl.findUsagePriceableItem(1, Integer.MAX_VALUE, null, null, null,
        null, null);
  }

  @Test
  public void shouldUpdateUsagePriceableItem() throws EcbBaseException {
    UsagePriceableItemTemplate record = new UsagePriceableItemTemplate();
    Set<String> fields = new HashSet<>();
    Boolean result = Boolean.TRUE;
    when(entityHelper.updateSelective(record, fields, piId)).thenReturn(result);
    priceableItemUsageServiceImpl.updateUsagePriceableItem(record, fields, piId);
  }

  @Test
  public void shouldGetUsagePriceableItemDetailsWithChilds() throws Exception {
    Integer templateId = 1;

    PriceableItemTemplate priceableItemTemplate = new PriceableItemTemplate();
    priceableItemTemplate.setPiId(piId);
    when(priceableItemTemplateService.getPriceableItemTemplate(templateId))
        .thenReturn(priceableItemTemplate);

    UsagePriceableItemTemplate usagePriceableItemTemplate = new UsagePriceableItemTemplate();
    usagePriceableItemTemplate.setPiId(1);
    usagePriceableItemTemplate.setPropId(1);
    ResponseEntity<UsagePriceableItemTemplate> usagePriceableItemTemplateRsp =
        new ResponseEntity<>(usagePriceableItemTemplate, HttpStatus.OK);
    when(extendedPriceableItemTemplateClient.getUsagePriceableItemTemplate(piId))
        .thenReturn(usagePriceableItemTemplateRsp);

    when(localizedEntity.localizedGetEntity(usagePriceableItemTemplate))
        .thenReturn(usagePriceableItemTemplate);

    PriceableItemTemplateModel priceableItemTemplateModel = new PriceableItemTemplateModel();
    priceableItemTemplateModel.setChargeTypeName("changeTypeName");
    when(priceableItemTemplateService.getPriceableItemTemplateDetails(templateId))
        .thenReturn(priceableItemTemplateModel);

    Boolean flag = true;
    when(adjustmentTypeService.isAdjustmentTypeExist(templateId)).thenReturn(flag);

    priceableItemUsageServiceImpl.getUsagePriceableItemDetailsWithChilds(templateId);
  }

  @Test
  public void shouldGetUsagePriceableItemDetailsWithChildsWithTemplateParentIdNotNull()
      throws Exception {
    Integer templateId = 1;

    PriceableItemTemplate priceableItemTemplate = new PriceableItemTemplate();
    priceableItemTemplate.setPiId(piId);
    priceableItemTemplate.setTemplateParentId(2);
    when(priceableItemTemplateService.getPriceableItemTemplate(templateId))
        .thenReturn(priceableItemTemplate);

    UsagePriceableItemTemplate usagePriceableItemTemplate = new UsagePriceableItemTemplate();
    usagePriceableItemTemplate.setPiId(1);
    usagePriceableItemTemplate.setPropId(1);
    ResponseEntity<UsagePriceableItemTemplate> usagePriceableItemTemplateRsp =
        new ResponseEntity<>(usagePriceableItemTemplate, HttpStatus.OK);
    when(extendedPriceableItemTemplateClient.getUsagePriceableItemTemplate(piId))
        .thenReturn(usagePriceableItemTemplateRsp);

    when(localizedEntity.localizedGetEntity(usagePriceableItemTemplate))
        .thenReturn(usagePriceableItemTemplate);

    PriceableItemType priceableItemType = new PriceableItemType();
    priceableItemType.setName("name");
    ResponseEntity<PriceableItemType> priceableItemTypeRsp =
        new ResponseEntity<>(priceableItemType, HttpStatus.OK);
    when(priceItemTypeClient.getPriceableItemType(piId)).thenReturn(priceableItemTypeRsp);

    when(localizedEntity.localizedGetEntity(priceableItemType)).thenReturn(priceableItemType);

    Boolean flag = true;
    when(adjustmentTypeService.isAdjustmentTypeExist(templateId)).thenReturn(flag);

    priceableItemUsageServiceImpl.getUsagePriceableItemDetailsWithChilds(templateId);
  }
}
