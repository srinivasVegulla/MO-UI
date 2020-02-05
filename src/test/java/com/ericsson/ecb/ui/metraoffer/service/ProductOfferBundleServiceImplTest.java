package com.ericsson.ecb.ui.metraoffer.service;

import static org.mockito.Mockito.when;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ericsson.ecb.catalog.client.ExtendedProductOfferAccountTypeMappingClient;
import com.ericsson.ecb.catalog.client.ExtendedProductOfferBundleClient;
import com.ericsson.ecb.catalog.client.PricelistMappingClient;
import com.ericsson.ecb.catalog.client.ProductOfferBundleClient;
import com.ericsson.ecb.catalog.client.ProductOfferClient;
import com.ericsson.ecb.catalog.model.ProductOffer;
import com.ericsson.ecb.catalog.model.ProductOfferBundle;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.type.Currency;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.Pagination;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.PricelistMappingModel;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferBundleData;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferBundleOptionality;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferData;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.ProductOfferBundleServiceImpl;

public class ProductOfferBundleServiceImplTest {

  @Mock
  private ExtendedProductOfferBundleClient extendedProductOfferBundleClient;

  @Mock
  private ProductOfferBundleClient productOfferBundleClient;

  @Mock
  private ProductOfferClient productOfferClient;

  @Mock
  private PricelistMappingService pricelistMappingService;

  @Mock
  private ProductOfferService productOfferService;

  @Mock
  LocalizedEntityService localizedEntity;

  @Mock
  PricelistMappingClient pricelistMappingClient;

  @Mock
  ExtendedProductOfferAccountTypeMappingClient extendedPoAccountTypeMappingClient;

  @InjectMocks
  private ProductOfferBundleServiceImpl productOfferBundleServiceImpl;

  private ResponseEntity<PaginatedList<ProductOffer>> productOfferPaginatedRep;

  private ResponseEntity<PaginatedList<ProductOfferBundle>> productOfferBundlePaginatedRep;

  private ProductOffer productOffer1;

  private ProductOfferData productOfferData;

  private ProductOfferBundle productOfferBundle;

  private List<ProductOffer> productOffers;

  private ResponseEntity<List<ProductOffer>> productOfferList;

  private ResponseEntity<ProductOffer> productOfferRsp;

  private Integer bundleId = 1;

  private Integer offerId = 1;

  private List<Integer> offerIdList;

  private Integer page = Pagination.DEFAULT_PAGE;

  private Integer size = Pagination.DEFAULT_MAX_SIZE;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    offerIdList = new ArrayList<>();
    offerIdList.add(offerId);
    offerIdList.add(2);

    productOffer1 = new ProductOffer();
    productOffer1.setOfferId(offerId);
    productOffer1.setName("Sample Po1");

    ProductOffer productOffer2 = new ProductOffer();
    productOffer2.setOfferId(2);
    productOffer2.setName("Sample Po2");

    productOffers = new ArrayList<ProductOffer>();
    PaginatedList<ProductOffer> paginatedOfferList = new PaginatedList<>();
    productOffers.add(productOffer1);
    productOffers.add(productOffer2);
    paginatedOfferList.setRecords(productOffers);

    productOfferPaginatedRep =
        new ResponseEntity<PaginatedList<ProductOffer>>(paginatedOfferList, HttpStatus.OK);

    productOfferBundle = new ProductOfferBundle();
    productOfferBundle.setIdPoBundle(bundleId);
    productOfferBundle.setIdPoItem(offerId);
    productOfferBundle.setOptional(true);

    ProductOfferBundle productOfferBundle2 = new ProductOfferBundle();
    productOfferBundle2.setIdPoBundle(bundleId);
    productOfferBundle2.setIdPoItem(2);
    productOfferBundle2.setOptional(true);

    Collection<ProductOfferBundle> productOfferBundles = new ArrayList<>();
    productOfferBundles.add(productOfferBundle);
    productOfferBundles.add(productOfferBundle2);

    PaginatedList<ProductOfferBundle> paginatedBundleList = new PaginatedList<>();
    paginatedBundleList.setRecords(productOfferBundles);

    productOfferBundlePaginatedRep =
        new ResponseEntity<PaginatedList<ProductOfferBundle>>(paginatedBundleList, HttpStatus.OK);

    productOfferData = new ProductOfferData();
    productOfferData.setOfferId(offerId);

    productOfferRsp = new ResponseEntity<ProductOffer>(productOffer1, HttpStatus.OK);
    productOfferList = new ResponseEntity<List<ProductOffer>>(productOffers, HttpStatus.OK);
  }

  @Test
  public void shouldFindProductOfferInBundle() throws Exception {
    ProductOfferBundleData productOfferBundleData = new ProductOfferBundleData();
    when(productOfferService.getProductOffer(bundleId)).thenReturn(productOfferBundleData);
    when(productOfferBundleClient.findProductOfferBundle(page, size, null,
        PropertyRsqlConstants.ID_PO_BUNDLE_EQUAL + 1)).thenReturn(productOfferBundlePaginatedRep);
    when(extendedProductOfferBundleClient.findProductOfferInBundle(bundleId))
        .thenReturn(productOfferList);
    productOfferBundleData = productOfferBundleServiceImpl.getProductOfferBundle(bundleId);
    Assert.assertNotNull(productOfferBundleData.getExtendedProperties());
  }

  @Test
  public void shouldGetProductOffersInBundle() throws Exception {
    ResponseEntity<List<ProductOffer>> productOfferRsp =
        new ResponseEntity<List<ProductOffer>>(productOffers, HttpStatus.OK);
    when(extendedProductOfferBundleClient.findProductOfferInBundle(bundleId))
        .thenReturn(productOfferRsp);
    when(productOfferService.getProductOffer(bundleId)).thenReturn(productOfferData);
    when(productOfferBundleClient.findProductOfferBundle(page, size, null,
        PropertyRsqlConstants.ID_PO_BUNDLE_EQUAL + 1)).thenReturn(productOfferBundlePaginatedRep);
    when(productOfferClient.findProductOffer(page, size, null,
        PropertyRsqlConstants.OFFER_ID_IN + "(1)", null, null, null))
            .thenReturn(productOfferPaginatedRep);
    productOfferBundleServiceImpl.getProductOffersInBundle(bundleId);
  }

  @Test
  public void shouldFindBundleForProductOffer() throws Exception {
    when(extendedProductOfferBundleClient.findBundleForProductOffer(offerId))
        .thenReturn(productOfferList);
    productOfferBundleServiceImpl.findBundleForProductOffer(offerId);
  }

  @Test
  public void shouldGetPriceableItemsInOfferings() throws Exception {
    PricelistMappingModel pricelistMappingModel = new PricelistMappingModel();
    when(pricelistMappingService.getPricelistMappingByOfferId(offerId))
        .thenReturn(pricelistMappingModel);
    productOfferBundleServiceImpl.getPriceableItemsInOfferings(bundleId);
  }

  @Test
  public void shouldUpdatePoOptionality() throws Exception {
    Boolean optionality = true;
    ResponseEntity<Boolean> flag = new ResponseEntity<>(true, HttpStatus.OK);
    when(extendedProductOfferBundleClient.setProductOfferOptionalityInBundle(productOfferBundle))
        .thenReturn(flag);
    productOfferBundleServiceImpl.updatePoOptionality(bundleId, offerId, optionality);
  }

  @Test
  public void shouldAddProductOffersToBundle() throws Exception {
    List<ProductOfferBundle> productOfferBundles = new ArrayList<>();
    productOfferBundles.add(productOfferBundle);

    ProductOfferBundle productOfferBundle2 = new ProductOfferBundle();
    productOfferBundle2.setIdPoBundle(bundleId);
    productOfferBundle2.setIdPoItem(2);
    productOfferBundle2.setOptional(true);
    productOfferBundles.add(productOfferBundle2);

    ResponseEntity<Boolean> flag = new ResponseEntity<>(Boolean.TRUE, HttpStatus.OK);
    when(extendedProductOfferBundleClient.addProductOfferToBundle(productOfferBundles))
        .thenReturn(flag);
    productOfferBundleServiceImpl.addProductOffersToBundle(bundleId, offerIdList);
  }

  @Test
  public void shouldRemoveProductOfferFromBundle() throws Exception {
    ResponseEntity<Boolean> flag = new ResponseEntity<>(true, HttpStatus.OK);
    List<Integer> offerIdList = new ArrayList<>();
    offerIdList.add(offerId);
    when(extendedProductOfferBundleClient.removeProductOfferFromBundle(bundleId, offerIdList))
        .thenReturn(flag);
    productOfferBundleServiceImpl.removeProductOfferFromBundle(bundleId, offerId);
  }

  @Test
  public void shouldFindProductOffersForBundle() throws Exception {
    String query = PropertyRsqlConstants.BUNDLE_EQUAL + Boolean.FALSE + RsqlOperator.AND
        + PropertyRsqlConstants.HIDDEN_EQUAL + Boolean.FALSE + RsqlOperator.AND
        + PropertyRsqlConstants.PO_PARTITION_ID_EQUAL + 1 + RsqlOperator.AND
        + PropertyRsqlConstants.CURRENCY_EQUAL + "USD" + RsqlOperator.AND
        + PropertyRsqlConstants.OFFER_ID_NOT_IN + "(1,2)";

    Currency currency = new Currency();
    currency.setValue("USD");
    productOffer1.setOfferId(offerId);
    productOffer1.setPopartitionid(1);
    productOffer1.setCurrency(currency);
    productOffer1.setAvailableStartDate(OffsetDateTime.now());
    productOffers.add(productOffer1);

    when(productOfferClient.getProductOffer(bundleId)).thenReturn(productOfferRsp);
    Map<Integer, String> partitionIdAndName = new HashMap<>();
    partitionIdAndName.put(1, "root");

    when(productOfferBundleClient.findProductOfferBundle(page, size, null,
        PropertyRsqlConstants.ID_PO_BUNDLE_EQUAL + 1)).thenReturn(productOfferBundlePaginatedRep);

    when(productOfferService.getPartitionIdAndName()).thenReturn(partitionIdAndName);
    when(productOfferClient.findProductOffer(page, size, null, null, null, null, null))
        .thenReturn(productOfferPaginatedRep);
    when(extendedProductOfferBundleClient.findProductOfferInBundle(bundleId))
        .thenReturn(productOfferList);
    when(productOfferClient.findProductOffer(page, size, null, query, null, null, null))
        .thenReturn(productOfferPaginatedRep);
    PaginatedList<ProductOfferData> paginatedrecords1 = new PaginatedList<ProductOfferData>();
    when(localizedEntity.localizedFindEntity(paginatedrecords1)).thenReturn(paginatedrecords1);
    productOfferBundleServiceImpl.findProductOffersForBundle(bundleId, page, size, null, null, null,
        null, null);
  }

  @Test
  public void shouldGetProductOfferInBundle() throws Exception {
    when(extendedProductOfferBundleClient.findProductOfferInBundle(bundleId))
        .thenReturn(productOfferList);
    productOfferBundleServiceImpl.getProductOfferIdsInBundle(bundleId);
  }

  @Test
  public void shouldUpdatePosOptionality() throws EcbBaseException {
    ProductOfferBundle bundle = new ProductOfferBundle();
    bundle.setIdPoBundle(bundleId);
    bundle.setIdPoItem(offerId);
    bundle.setOptional(true);
    ResponseEntity<Boolean> flag = new ResponseEntity<>(true, HttpStatus.OK);

    when(extendedProductOfferBundleClient.setProductOfferOptionalityInBundle(bundle))
        .thenReturn(flag);

    Collection<ProductOfferBundleOptionality> poBundleOptionalityCollection = new ArrayList<>();
    ProductOfferBundleOptionality poBundleOptionality = new ProductOfferBundleOptionality();
    poBundleOptionality.setIdPoBundle(bundleId);
    poBundleOptionality.setIdPoItem(offerId);
    poBundleOptionality.setOptional(true);
    poBundleOptionalityCollection.add(poBundleOptionality);
    productOfferBundleServiceImpl.updatePosOptionality(poBundleOptionalityCollection);
  }

  @Test
  public void shouldUpdatePosOptionalityForCatch() throws EcbBaseException {
    ProductOfferBundle bundle = new ProductOfferBundle();
    bundle.setIdPoBundle(bundleId);
    bundle.setIdPoItem(offerId);
    bundle.setOptional(true);

    when(extendedProductOfferBundleClient.setProductOfferOptionalityInBundle(bundle))
        .thenThrow(new EcbBaseException());

    Collection<ProductOfferBundleOptionality> poBundleOptionalityCollection = new ArrayList<>();
    ProductOfferBundleOptionality poBundleOptionality = new ProductOfferBundleOptionality();
    poBundleOptionality.setIdPoBundle(bundleId);
    poBundleOptionality.setIdPoItem(offerId);
    poBundleOptionality.setOptional(true);
    poBundleOptionalityCollection.add(poBundleOptionality);
    productOfferBundleServiceImpl.updatePosOptionality(poBundleOptionalityCollection);
  }

  @Test
  public void shouldUpdateProductOfferBundle() throws EcbBaseException {

    ProductOfferBundleData record = new ProductOfferBundleData();
    record.setOfferId(1);
    Set<String> fields = new HashSet<>();;

    ProductOfferData productOfferData = new ProductOfferData();
    when(productOfferService.getProductOffer(1)).thenReturn(productOfferData);

    when(productOfferBundleClient.findProductOfferBundle(1, Integer.MAX_VALUE, null,
        PropertyRsqlConstants.ID_PO_BUNDLE_EQUAL + 1)).thenReturn(productOfferBundlePaginatedRep);

    List<ProductOffer> productOfferList = new ArrayList<>();
    ProductOffer productOffer1 = new ProductOffer();
    productOffer1.setName("test");
    productOffer1.setOfferId(1);
    productOfferList.add(productOffer1);

    ProductOffer productOffer2 = new ProductOffer();
    productOffer2.setName("test2");
    productOffer2.setOfferId(2);
    productOfferList.add(productOffer2);

    ResponseEntity<List<ProductOffer>> poList =
        new ResponseEntity<>(productOfferList, HttpStatus.OK);
    when(extendedProductOfferBundleClient.findProductOfferInBundle(bundleId)).thenReturn(poList);

    ProductOfferData newProductOfferData = new ProductOfferData();
    newProductOfferData.setOfferId(1);
    Boolean result = Boolean.TRUE;
    when(productOfferService.updateProductOffer(newProductOfferData, fields, 1)).thenReturn(result);
    productOfferBundleServiceImpl.updateProductOfferBundle(record, fields, 1);
  }

  @Test
  public void shouldUpdateProductOfferBundleIsAvailableOrSubscriptions() throws EcbBaseException {

    ProductOfferBundleData record = new ProductOfferBundleData();
    record.setOfferId(1);
    Set<String> fields = new HashSet<>();;

    ProductOfferData productOfferData = new ProductOfferData();
    OffsetDateTime availableStartDate = OffsetDateTime.now();
    productOfferData.setAvailableStartDate(availableStartDate);
    when(productOfferService.getProductOffer(1)).thenReturn(productOfferData);

    when(productOfferBundleClient.findProductOfferBundle(1, Integer.MAX_VALUE, null,
        PropertyRsqlConstants.ID_PO_BUNDLE_EQUAL + 1)).thenReturn(productOfferBundlePaginatedRep);

    List<ProductOffer> productOfferList = new ArrayList<>();
    ProductOffer productOffer1 = new ProductOffer();
    productOffer1.setName("test");
    productOffer1.setOfferId(1);
    productOfferList.add(productOffer1);

    ProductOffer productOffer2 = new ProductOffer();
    productOffer2.setName("test2");
    productOffer2.setOfferId(2);
    productOfferList.add(productOffer2);

    ResponseEntity<List<ProductOffer>> poList =
        new ResponseEntity<>(productOfferList, HttpStatus.OK);
    when(extendedProductOfferBundleClient.findProductOfferInBundle(bundleId)).thenReturn(poList);

    ProductOfferData newProductOfferData = new ProductOfferData();
    newProductOfferData.setOfferId(1);
    Boolean result = Boolean.TRUE;
    when(productOfferService.updateProductOffer(newProductOfferData, fields, 1)).thenReturn(result);
    productOfferBundleServiceImpl.updateProductOfferBundle(record, fields, 1);
  }

  @Test
  public void shouldUpdateProductOfferBundleOptionality() throws EcbBaseException {

    ProductOfferBundleData record = new ProductOfferBundleData();
    record.setOfferId(1);
    Set<String> fields = new HashSet<>();;

    ProductOfferData productOfferData = new ProductOfferData();
    when(productOfferService.getProductOffer(1)).thenReturn(productOfferData);

    when(productOfferBundleClient.findProductOfferBundle(1, Integer.MAX_VALUE, null,
        PropertyRsqlConstants.ID_PO_BUNDLE_EQUAL + 1)).thenReturn(productOfferBundlePaginatedRep);

    List<ProductOffer> productOfferList = new ArrayList<>();
    ProductOffer productOffer1 = new ProductOffer();
    productOffer1.setName("test");
    productOffer1.setOfferId(1);
    productOfferList.add(productOffer1);

    ProductOffer productOffer2 = new ProductOffer();
    productOffer2.setName("test2");
    productOffer2.setOfferId(2);
    productOfferList.add(productOffer2);

    ResponseEntity<List<ProductOffer>> poList =
        new ResponseEntity<>(productOfferList, HttpStatus.OK);
    when(extendedProductOfferBundleClient.findProductOfferInBundle(bundleId)).thenReturn(poList);

    ProductOfferData newProductOfferData = new ProductOfferData();
    newProductOfferData.setOfferId(1);
    Boolean result = Boolean.TRUE;
    when(productOfferService.updateProductOffer(newProductOfferData, fields, 1)).thenReturn(result);
    productOfferBundleServiceImpl.updateProductOfferBundle(record, fields, 1);
  }

  @Test
  public void shouldUpdateSelectiveProductOffer() throws Exception {
    HashMap<String, ProductOfferBundleData> recordMap =
        new HashMap<String, ProductOfferBundleData>();
    ProductOfferBundleData offerData = new ProductOfferBundleData();
    ProductOfferData ofData = new ProductOfferData();
    offerData.setBundle(true);
    offerData.setOfferId(offerId);
    recordMap.put("oldEntity", offerData);
    recordMap.put("newEntity", offerData);
    Set<String> fields = new HashSet<>();
    when(productOfferService.getProductOffer(offerId)).thenReturn(ofData);
    when(productOfferBundleClient.findProductOfferBundle(page, size, null,
        PropertyRsqlConstants.ID_PO_BUNDLE_EQUAL + 1)).thenReturn(productOfferBundlePaginatedRep);
    when(extendedProductOfferBundleClient.findProductOfferInBundle(bundleId))
        .thenReturn(productOfferList);
    productOfferBundleServiceImpl.updateSelectiveProductOffer(recordMap, fields, bundleId);
  }

}
