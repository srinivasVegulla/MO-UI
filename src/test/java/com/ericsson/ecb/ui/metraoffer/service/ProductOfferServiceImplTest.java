package com.ericsson.ecb.ui.metraoffer.service;

import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ericsson.ecb.catalog.client.EffectiveDateClient;
import com.ericsson.ecb.catalog.client.ExtendedProductOfferClient;
import com.ericsson.ecb.catalog.client.ProductOfferClient;
import com.ericsson.ecb.catalog.model.LocalizedProductOffer;
import com.ericsson.ecb.catalog.model.ProductOffer;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.common.type.Currency;
import com.ericsson.ecb.customer.client.SubscriptionClient;
import com.ericsson.ecb.customer.model.BusinessPartition;
import com.ericsson.ecb.customer.model.Subscription;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.Constants;
import com.ericsson.ecb.ui.metraoffer.constants.Pagination;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.ExtendedProperty;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferData;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.ProductOfferServiceImpl;
import com.ericsson.ecb.ui.metraoffer.utils.EntityHelper;

public class ProductOfferServiceImplTest {

  @Mock
  private ProductOfferClient productOfferClient;

  @Mock
  private SubscriptionClient subscriptionClient;

  @Mock
  private SubscriptionService subscriptionService;

  @Mock
  private ExtendedProductOfferClient extendedProductOfferClient;

  @Mock
  private EffectiveDateClient effectiveDateClient;

  @Mock
  private MasterDataService masterDataService;

  @Mock
  private MetadataConfigService metadataConfigService;

  @InjectMocks
  private ProductOfferServiceImpl productOfferServiceImpl;

  @Mock
  private ProductOfferBundleService productOfferBundleService;

  private ProductOfferData productOfferData;

  private ResponseEntity<ProductOffer> productOfferRe;

  private List<ProductOffer> productOffers;

  private ResponseEntity<PaginatedList<ProductOffer>> productOfferPaginatedRsp;

  @Mock
  private LocalizedEntityService localizedEntity;

  @Mock
  private AccountTypeService accountTypeService;

  @Mock
  private EntityHelper entityHelper;

  @Mock
  private ApprovalsService approvalService;


  public static final String PO_WITH_AVAIL_DATES =
      PropertyRsqlConstants.AVAILABLE_START_DATE_NULL_FALSE;

  public static final String PO_WITH_NO_AVAIL_DATES =
      PropertyRsqlConstants.AVAILABLE_START_DATE_NULL_TRUE + RsqlOperator.AND
          + PropertyRsqlConstants.AVAILABLE_END_DATE_NULL_TRUE;

  private Integer offerId = 1;

  private Integer page = Pagination.DEFAULT_PAGE;

  private Integer size = Pagination.DEFAULT_MIN_SIZE;

  @Before
  public void init() {

    MockitoAnnotations.initMocks(this);
    productOfferData = new ProductOfferData();
    productOfferData.setOfferId(offerId);
    productOfferData.setName("Order Cookies");
    productOfferData.setDisplayName("Order Cookies");
    productOfferData.setDescription("Order Cookies");
    productOfferData.setCurrency(new Currency());
    productOfferData.setEffDateId(10);
    productOfferData.setUserSubscribe(true);
    productOfferData.setUserUnsubscribe(false);
    productOfferData.setAvailableStartDate(null);
    productOfferData.setAvailableEndDate(null);
    productOfferData.setStartDate(null);
    productOfferData.setEndDate(null);

    productOfferData.setBundle(false);

    productOffers = new ArrayList<ProductOffer>();

    productOffers.add(productOfferData);
    productOfferRe = new ResponseEntity<ProductOffer>(productOfferData, HttpStatus.OK);

    PaginatedList<ProductOffer> paginatedList = new PaginatedList<ProductOffer>();
    paginatedList.setRecords(productOffers);

    productOfferPaginatedRsp =
        new ResponseEntity<PaginatedList<ProductOffer>>(paginatedList, HttpStatus.OK);
  }

  @Test
  public void shouldFindProductOfferDataEmpty() throws Exception {

    ProductOffer productOffer = new ProductOffer();
    productOffer.setAvailableStartDate(OffsetDateTime.now());

    List<ProductOffer> productOffers = new ArrayList<>();
    productOffers.add(productOffer);
    when(productOfferClient.getProductOffer(1)).thenReturn(productOfferRe);

    when(productOfferBundleService.findBundleForProductOffer(offerId)).thenReturn(productOffers);
    Map<String, Object> map = new HashMap<>();
    map.put(Constants.HAS_PENDING_APPROVALS, Boolean.TRUE);
    when(approvalService.getOfferingApprovalsStatus(offerId)).thenReturn(map);
    productOfferServiceImpl.getProductOffer(1);

    assertNotNull(productOfferRe);
  }

  @Test
  public void shouldGetProductOfferData() throws Exception {
    productOfferData.setStartDate(OffsetDateTime.now());
    productOfferData.setEndDate(OffsetDateTime.now());
    Map<String, Object> properties = new HashMap<String, Object>();
    properties.put("glCode", "123");
    properties.put("ExternalURL", "test");

    Map<Integer, String> accountTypeEligibility = new HashMap<Integer, String>();
    accountTypeEligibility.put(1, "value1");

    when(productOfferClient.getProductOffer(offerId)).thenReturn(productOfferRe);
    when(metadataConfigService.getExtendedProperties(properties, PropertyKind.OFFERING))
        .thenReturn(new ArrayList<ExtendedProperty>());
    when(accountTypeService.findAccountTypeEligibility()).thenReturn(accountTypeEligibility);
    when(localizedEntity.localizedGetEntity(productOfferData)).thenReturn(productOfferData);
    productOfferServiceImpl.getProductOffer(offerId);
    assertNotNull(productOfferData);
  }

  @Test
  public void shouldFindPOWithAvailableDatesWithEmptyDates() throws Exception {
    when(productOfferClient.findProductOffer(0, 20, null, PO_WITH_AVAIL_DATES, null, null, null))
        .thenReturn(productOfferPaginatedRsp);
    productOfferServiceImpl.findPOWithAvailableDates(0, 20, null, PO_WITH_AVAIL_DATES, null, null,
        null);
    assertNotNull(productOffers);
  }

  @Test
  public void shouldFindPOWithAvailableDates() throws Exception {
    productOfferData.setAvailableStartDate(OffsetDateTime.now());
    productOfferData.setAvailableEndDate(OffsetDateTime.now());
    productOfferData.setStartDate(OffsetDateTime.now());
    productOfferData.setEndDate(OffsetDateTime.now());
    when(productOfferClient.findProductOffer(0, 20, null, PO_WITH_AVAIL_DATES, null, null, null))
        .thenReturn(productOfferPaginatedRsp);
    productOfferServiceImpl.findPOWithAvailableDates(0, 20, null, PO_WITH_AVAIL_DATES, null, null,
        null);
    assertNotNull(productOffers);
  }

  @Test
  public void shouldfindProductOffer() throws Exception {

    PaginatedList<Subscription> subscription = new PaginatedList<Subscription>();
    ResponseEntity<PaginatedList<Subscription>> subscriptionsResponse =
        new ResponseEntity<PaginatedList<Subscription>>(subscription, HttpStatus.OK);
    List<Integer> offerIds = new ArrayList<Integer>();
    offerIds.add(1);
    offerIds.add(2);

    Map<Integer, Integer> subscrptionMap = new HashMap<Integer, Integer>();
    subscrptionMap.put(1, 1);
    subscrptionMap.put(2, 2);

    productOfferData.setAvailableStartDate(OffsetDateTime.now());
    productOfferData.setAvailableEndDate(OffsetDateTime.now());
    productOfferData.setStartDate(OffsetDateTime.now());
    productOfferData.setEndDate(OffsetDateTime.now());

    List<BusinessPartition> businessPartitions = new ArrayList<BusinessPartition>();
    BusinessPartition businessPartition = new BusinessPartition();
    businessPartition.setAccountId(1);
    businessPartition.setLogin("root");

    when(productOfferClient.findProductOffer(1, 20, null,
        PropertyRsqlConstants.HIDDEN_EQUAL + Boolean.FALSE, null, null, null))
            .thenReturn(productOfferPaginatedRsp);
    when(subscriptionClient.findSubscription(1, 20, null, null)).thenReturn(subscriptionsResponse);
    when(subscriptionService.findSubscriptionsCountByOfferIdList(offerIds))
        .thenReturn(subscrptionMap);
    when(productOfferClient.findProductOffer(1, 20, null,
        PropertyRsqlConstants.HIDDEN_EQUAL + Boolean.TRUE, null, null, null))
            .thenReturn(productOfferPaginatedRsp);
    when(masterDataService.getUserPartitions()).thenReturn(businessPartitions);
    PaginatedList<ProductOfferData> productOfferDataList = new PaginatedList<ProductOfferData>();
    when(localizedEntity.localizedFindEntity(productOfferDataList))
        .thenReturn(productOfferDataList);
    productOfferServiceImpl.findProductOffer(1, 20, null, null, false, null, null, null);
    assertNotNull(productOffers);
  }

  @Test
  public void shouldFindPOWithNoAvailableDates() throws Exception {
    when(productOfferClient.findProductOffer(0, 20, null, PO_WITH_NO_AVAIL_DATES, null, null, null))
        .thenReturn(productOfferPaginatedRsp);
    productOfferServiceImpl.findPOWithNoAvailableDates(0, 20, null, PO_WITH_NO_AVAIL_DATES, null,
        null, null);
    assertNotNull(productOffers);
  }

  @Test
  public void shouldCreateProductOffer() throws Exception {
    when(productOfferClient.createProductOffer(productOfferData)).thenReturn(productOfferRe);
    when(localizedEntity.localizedCreateEntity(productOfferData)).thenReturn(productOfferData);
    productOfferServiceImpl.createProductOffer(productOfferData);
  }

  @Test
  public void shouldDeleteProductOffer() throws Exception {
    ResponseEntity<Boolean> flag = new ResponseEntity<Boolean>(true, HttpStatus.OK);
    when(extendedProductOfferClient.deleteProductOffer(offerId)).thenReturn(flag);
    productOfferServiceImpl.deleteProductOffer(offerId);
  }

  @Test
  public void shouldHideProductOffer() throws Exception {
    Boolean hide = false;
    ResponseEntity<Boolean> flag = new ResponseEntity<Boolean>(true, HttpStatus.OK);
    when(extendedProductOfferClient.hideProductOffer(offerId, hide)).thenReturn(flag);
    productOfferServiceImpl.hideProductOffer(offerId, hide);
  }

  @Test
  public void shouldGetPoUsedLocations() throws Exception {
    Set<Integer> offerIds = new HashSet<>();
    offerIds.add(offerId);
    ProductOfferData productOfferData1 = new ProductOfferData();
    productOfferData1.setOfferId(offerId);
    productOfferData1.setPopartitionid(1);
    Collection<ProductOfferData> productOfferDataCollection = new ArrayList<>();
    productOfferDataCollection.add(productOfferData1);
    PaginatedList<ProductOfferData> paginatedList = new PaginatedList<>();
    paginatedList.setRecords(productOfferDataCollection);

    when(productOfferBundleService.findBundleForProductOffer(offerId)).thenReturn(productOffers);
    when(productOfferClient.findProductOffer(page, size, null, "offerId" + RsqlOperator.IN + "(1)",
        null, null, null)).thenReturn(productOfferPaginatedRsp);
    productOfferServiceImpl.findOfferingsForInUse(offerIds, page, size, null, null, null, null,
        null);
    productOfferServiceImpl.getPoUsedLocations(offerId, page, size, null, null, null, null, null);
  }


  @Test
  public void shouldGetProductOffer() throws Exception {
    when(productOfferClient.getProductOffer(offerId)).thenReturn(productOfferRe);
    HashMap<String, Object> mapDetails = new HashMap<String, Object>();
    List<ProductOffer> productOffers = new ArrayList<>();
    ProductOffer productOffer = new ProductOffer();
    productOffers.add(productOffer);
    when(productOfferBundleService.findBundleForProductOffer(offerId)).thenReturn(productOffers);
    when(localizedEntity.localizedGetEntity(productOfferData)).thenReturn(productOfferData);
    when(approvalService.getOfferingApprovalsStatus(offerId)).thenReturn(mapDetails);
    productOfferServiceImpl.getProductOffer(offerId);

  }

  @Test
  public void shouldUpdateSelectiveProductOffer() throws Exception {
    HashMap<String, ProductOfferData> recordMap = new HashMap<String, ProductOfferData>();
    ProductOfferData offerData = new ProductOfferData();
    recordMap.put("oldEntity", offerData);
    recordMap.put("newEntity", offerData);
    Set<String> fields = new HashSet<>();
    productOfferServiceImpl.updateSelectiveProductOffer(recordMap, fields, offerId);
  }

  @Test
  public void shouldCopyProductOffer() throws Exception {
    LocalizedProductOffer productOffer = new LocalizedProductOffer();
    ResponseEntity<ProductOffer> value = new ResponseEntity<>(HttpStatus.OK);
    when(extendedProductOfferClient.copyProductOffer(1, productOffer)).thenReturn(value);
    when(localizedEntity.localizedCreateEntity(productOffer)).thenReturn(productOffer);
    productOfferServiceImpl.copyProductOffer(1, productOffer);

  }

  @Test
  public void shouldCheckConfiguration() throws Exception {
    Boolean status = Boolean.TRUE;
    ResponseEntity<Boolean> value = new ResponseEntity<>(status, HttpStatus.OK);
    when(extendedProductOfferClient.checkConfiguration(1)).thenReturn(value);
    productOfferServiceImpl.checkConfiguration(1);
  }

  @Test
  public void shouldUpdateProductOffer() throws EcbBaseException {
    ProductOfferData record = new ProductOfferData();
    record.setIsAccountTypeEligibilityUpdated(true);
    Map<Integer, String> selectedAccountTypeEligibility = new HashMap<>();
    selectedAccountTypeEligibility.put(1, "Eligibility");
    record.setSelectedAccountTypeEligibility(selectedAccountTypeEligibility);
    Set<String> fields = new HashSet<>();

    ProductOffer newRecord = new ProductOffer();
    ResponseEntity<ProductOffer> updateSelectiveProductOffer =
        new ResponseEntity<>(newRecord, HttpStatus.OK);
    when(productOfferClient.updateSelectiveProductOffer(newRecord, fields, offerId))
        .thenReturn(updateSelectiveProductOffer);

    productOfferServiceImpl.updateProductOffer(record, fields, offerId);
  }

  @Test
  public void shouldExportToCsv() throws Exception {
    HttpServletResponse response = mock(HttpServletResponse.class);
    PaginatedList<ProductOffer> paginated = new PaginatedList<>();
    List<ProductOffer> productOfferList = new ArrayList<>();
    ProductOffer productOffer = new ProductOffer();
    Currency currency = new Currency();
    currency.setValue("currency");
    productOffer.setCurrency(currency);
    productOffer.setBundle(true);
    productOfferList.add(productOffer);
    paginated.setRecords(productOfferList);
    ResponseEntity<PaginatedList<ProductOffer>> productOfferRsp =
        new ResponseEntity<>(paginated, HttpStatus.OK);
    when(productOfferClient.findProductOffer(1, Integer.MAX_VALUE, null, null, null, null, null))
        .thenReturn(productOfferRsp);

    ByteArrayOutputStream output = new ByteArrayOutputStream();
    PrintWriter printWriter = new PrintWriter(new OutputStreamWriter(output));
    when(response.getWriter()).thenReturn(printWriter);

    productOfferServiceImpl.exportToCsv(response, null, null);
  }

  @Test
  public void shouldGetPartitionIdAndName() throws EcbBaseException {
    Collection<BusinessPartition> value = new ArrayList<>();
    BusinessPartition businessPartition = new BusinessPartition();
    value.add(businessPartition);
    when(masterDataService.getUserPartitions()).thenReturn(value);
    productOfferServiceImpl.getPartitionIdAndName();
  }

  @Test
  public void shoudFindOfferingsForInUseOfferIdNull() throws EcbBaseException {
    productOfferServiceImpl.findOfferingsForInUse(null, page, size, null, null, null, null, null);
  }

  @Test
  public void shoudFindOfferingsForInUse() throws EcbBaseException {
    Collection<Integer> offerIds = new ArrayList<>();
    offerIds.add(1);
    PaginatedList<ProductOffer> paginated = new PaginatedList<>();
    List<ProductOffer> productOfferList = new ArrayList<>();
    ProductOffer productOffer = new ProductOffer();
    productOfferList.add(productOffer);
    paginated.setRecords(productOfferList);
    ResponseEntity<PaginatedList<ProductOffer>> productOfferRsp =
        new ResponseEntity<>(paginated, HttpStatus.OK);

    String query = PropertyRsqlConstants.HIDDEN_EQUAL + Boolean.TRUE + RsqlOperator.AND
        + PropertyRsqlConstants.OFFER_ID_IN + "(1)";

    when(productOfferClient.findProductOffer(page, size, null, query, null, null, null))
        .thenReturn(productOfferRsp);

    productOfferServiceImpl.findOfferingsForInUse(offerIds, page, size, null,
        PropertyRsqlConstants.HIDDEN_EQUAL + Boolean.TRUE, null, null, null);
  }
}
