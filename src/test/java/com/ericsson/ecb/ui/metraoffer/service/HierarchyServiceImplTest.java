package com.ericsson.ecb.ui.metraoffer.service;

import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ericsson.ecb.catalog.client.ExtendedProductOfferBundleClient;
import com.ericsson.ecb.catalog.client.PricelistMappingClient;
import com.ericsson.ecb.catalog.client.ProductOfferClient;
import com.ericsson.ecb.catalog.model.PricelistMapping;
import com.ericsson.ecb.catalog.model.ProductOffer;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.TreeNode;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.HierarchyServiceImpl;

public class HierarchyServiceImplTest {

  @Mock
  private ProductOfferClient productOfferClient;

  @Mock
  private PricelistMappingClient pricelistMappingClient;

  @Mock
  private ExtendedProductOfferBundleClient extendedProductOfferBundleClient;

  @Mock
  private LocalizedEntityService localizedEntityService;

  @InjectMocks
  private HierarchyServiceImpl hierarchyServiceImpl;

  private ResponseEntity<PaginatedList<PricelistMapping>> pricelistMappingResponeEntity;

  private String PRICELIST_CONDITION = PropertyRsqlConstants.SUBSCRIPTION_ID_IS_NULL_TRUE
      + RsqlOperator.AND + PropertyRsqlConstants.PARAM_TABLE_ID_NULL_TRUE;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    PaginatedList<PricelistMapping> paginatedList = new PaginatedList<PricelistMapping>();
    pricelistMappingResponeEntity =
        new ResponseEntity<PaginatedList<PricelistMapping>>(paginatedList, HttpStatus.OK);
    List<PricelistMapping> pricelistMappingList = new ArrayList<PricelistMapping>();
    PricelistMapping pricelistMapping = new PricelistMapping();
    pricelistMapping.setOfferId(1);
    pricelistMapping.setItemTypeKind(PropertyKind.USAGE);;
    pricelistMapping.setItemTypeId(1);
    pricelistMapping.setItemTemplateId(1);
    pricelistMapping.setItemInstanceId(1);
    pricelistMappingList.add(pricelistMapping);

    PricelistMapping childPi = new PricelistMapping();
    childPi.setOfferId(1);
    childPi.setItemTypeKind(PropertyKind.USAGE);;
    childPi.setItemTypeId(1);
    childPi.setItemTemplateId(1);
    childPi.setItemInstanceId(2);
    childPi.setPiInstanceParentId(1);
    pricelistMappingList.add(childPi);

    PricelistMapping childPi2 = new PricelistMapping();
    childPi2.setOfferId(1);
    childPi2.setItemTypeKind(PropertyKind.USAGE);;
    childPi2.setItemTypeId(1);
    childPi2.setItemTemplateId(1);
    childPi2.setItemInstanceId(3);
    childPi2.setPiInstanceParentId(1);
    pricelistMappingList.add(childPi2);

    paginatedList.setRecords(pricelistMappingList);
  }

  @Test
  public void shouldGetProductOfferHierarchy() throws Exception {
    ProductOffer productOffer = new ProductOffer();
    productOffer.setOfferId(1);
    productOffer.setBundle(false);
    ResponseEntity<ProductOffer> productOfferResponse =
        new ResponseEntity<ProductOffer>(productOffer, HttpStatus.OK);;
    when(productOfferClient.getProductOffer(1)).thenReturn(productOfferResponse);
    when(pricelistMappingClient.findPricelistMapping(1, Integer.MAX_VALUE, null,
        PropertyRsqlConstants.OFFER_ID_EQUAL + 1 + " and " + PRICELIST_CONDITION, null, null, null))
            .thenReturn(pricelistMappingResponeEntity);
    PaginatedList<TreeNode> paginatedList = new PaginatedList<>();
    when(localizedEntityService.localizedFindEntity(paginatedList)).thenReturn(paginatedList);
    hierarchyServiceImpl.getPropertyKindHierarchy(1);
  }

  @Test
  public void shouldFindProductOfferInBundle() throws Exception {
    ProductOffer productOffer = new ProductOffer();
    productOffer.setOfferId(1);
    productOffer.setBundle(true);
    ResponseEntity<ProductOffer> productOfferResponse =
        new ResponseEntity<ProductOffer>(productOffer, HttpStatus.OK);

    List<ProductOffer> posOfBundleList = new ArrayList<ProductOffer>();
    ProductOffer poOfBundle = new ProductOffer();
    poOfBundle.setOfferId(2);
    poOfBundle.setBundle(false);
    posOfBundleList.add(poOfBundle);

    ResponseEntity<List<ProductOffer>> productOffersInBundleResponse =
        new ResponseEntity<List<ProductOffer>>(posOfBundleList, HttpStatus.OK);

    when(productOfferClient.getProductOffer(1)).thenReturn(productOfferResponse);
    when(extendedProductOfferBundleClient.findProductOfferInBundle(1))
        .thenReturn(productOffersInBundleResponse);
    when(pricelistMappingClient.findPricelistMapping(1, Integer.MAX_VALUE, null,
        "offerId=in=(1, 2)" + " and " + PRICELIST_CONDITION, null, null, null))
            .thenReturn(pricelistMappingResponeEntity);
    PaginatedList<TreeNode> paginatedList = new PaginatedList<>();
    when(localizedEntityService.localizedFindEntity(paginatedList)).thenReturn(paginatedList);
    hierarchyServiceImpl.getPropertyKindHierarchy(1);
  }

}
