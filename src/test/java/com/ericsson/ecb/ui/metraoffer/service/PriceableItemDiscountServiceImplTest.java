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

import com.ericsson.ecb.catalog.client.DiscountClient;
import com.ericsson.ecb.catalog.client.ExtendedPriceableItemTemplateClient;
import com.ericsson.ecb.catalog.model.Discount;
import com.ericsson.ecb.catalog.model.DiscountTemplate;
import com.ericsson.ecb.catalog.model.LocalizedDiscountTemplate;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.model.DiscountModel;
import com.ericsson.ecb.ui.metraoffer.model.ExtendedProperty;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemTemplateModel;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.PriceableItemDiscountServiceImpl;
import com.ericsson.ecb.ui.metraoffer.utils.EntityHelper;

public class PriceableItemDiscountServiceImplTest {

  @InjectMocks
  private PriceableItemDiscountServiceImpl priceableItemDiscountServiceImpl;

  @Mock
  private DiscountClient discountClient;

  @Mock
  private PriceableItemTemplateService priceableItemTemplateService;

  @Mock
  private MetadataConfigService metadataConfigService;

  @Mock
  private ExtendedPriceableItemTemplateClient extendedPriceableItemTemplateClient;

  @Mock
  private LocalizedEntityService localizedEntity;

  @Mock
  private EntityHelper entityHelper;

  private Discount discount;

  private DiscountModel discountModel;

  private List<Discount> discountList;

  private PaginatedList<Discount> paginatedDiscount;

  private ResponseEntity<PaginatedList<Discount>> paginatedrspDiscount;

  private ResponseEntity<Discount> rspDiscount;

  private PriceableItemTemplateModel priceableItemTemplateModel;

  private Integer propId = 1;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    discount = new Discount();
    discountList = new ArrayList<>();
    discountList.add(discount);
    paginatedDiscount = new PaginatedList<>();
    paginatedDiscount.setRecords(discountList);
    paginatedrspDiscount = new ResponseEntity<>(paginatedDiscount, HttpStatus.OK);
    rspDiscount = new ResponseEntity<>(discount, HttpStatus.OK);
    priceableItemTemplateModel = new PriceableItemTemplateModel();
    discountModel = new DiscountModel();

    BeanUtils.copyProperties(discount, discountModel);

  }

  @Test
  public void shouldGetDiscountDetails() throws Exception {
    List<ExtendedProperty> extendedProps = new ArrayList<>();

    when(discountClient.getDiscount(propId)).thenReturn(rspDiscount);
    priceableItemTemplateModel.setOfferingsCount(1);
    priceableItemTemplateModel.setSharedRateListCount(1);
    when(priceableItemTemplateService.getPriceableItemTemplateDetails(propId))
        .thenReturn(priceableItemTemplateModel);
    when(metadataConfigService.getExtendedProperties(discount.getProperties(),
        discountModel.getKindType())).thenReturn(extendedProps);
    priceableItemDiscountServiceImpl.getDiscountDetails(propId);
  }

  @Test
  public void shouldUpdateDiscount() throws Exception {
    when(discountClient.updateDiscount(discount, propId)).thenReturn(rspDiscount);
    priceableItemDiscountServiceImpl.updateDiscount(discount, propId);
  }

  @Test
  public void shouldCreateDiscountPriceableItemTemplate() throws EcbBaseException {
    LocalizedDiscountTemplate record = new LocalizedDiscountTemplate();
    DiscountTemplate discountTemplate = new DiscountTemplate();
    ResponseEntity<DiscountTemplate> rspDiscountTemplate =
        new ResponseEntity<>(discountTemplate, HttpStatus.OK);
    when(extendedPriceableItemTemplateClient.createDiscountPriceableItemTemplate(record))
        .thenReturn(rspDiscountTemplate);
    when(localizedEntity.localizedCreateEntity(record)).thenReturn(record);
    priceableItemDiscountServiceImpl.createDiscountPriceableItemTemplate(record);
  }

  @Test
  public void shouldGetDiscount() throws Exception {
    when(discountClient.getDiscount(propId)).thenReturn(rspDiscount);
    priceableItemDiscountServiceImpl.getDiscount(propId);
  }

  @Test
  public void shouldFindDiscount() throws EcbBaseException {
    when(discountClient.findDiscount(1, Integer.MAX_VALUE, null, null, null, null, null))
        .thenReturn(paginatedrspDiscount);
    priceableItemDiscountServiceImpl.findDiscount(1, Integer.MAX_VALUE, null, null, null, null,
        null);
  }

  @Test
  public void shouldUpdateDiscountPriceableItemTemplate() throws Exception {
    DiscountTemplate record = new DiscountTemplate();
    Set<String> fields = new HashSet<>();
    Boolean result = Boolean.TRUE;
    when(entityHelper.updateSelective(record, fields, propId)).thenReturn(result);
    priceableItemDiscountServiceImpl.updateDiscountPriceableItemTemplate(record, fields, propId);
  }
}
