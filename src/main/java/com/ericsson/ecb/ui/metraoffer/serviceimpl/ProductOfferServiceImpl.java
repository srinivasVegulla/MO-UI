package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.supercsv.io.CsvBeanWriter;
import org.supercsv.io.ICsvBeanWriter;
import org.supercsv.prefs.CsvPreference;

import com.ericsson.ecb.catalog.client.ExtendedProductOfferClient;
import com.ericsson.ecb.catalog.client.ProductOfferClient;
import com.ericsson.ecb.catalog.model.LocalizedProductOffer;
import com.ericsson.ecb.catalog.model.ProductOffer;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.customer.model.BusinessPartition;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.Constants;
import com.ericsson.ecb.ui.metraoffer.constants.Pagination;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyConstants;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.CustomPaginatedList;
import com.ericsson.ecb.ui.metraoffer.model.ExportProductOffer;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferData;
import com.ericsson.ecb.ui.metraoffer.service.AccountTypeService;
import com.ericsson.ecb.ui.metraoffer.service.ApprovalsService;
import com.ericsson.ecb.ui.metraoffer.service.MasterDataService;
import com.ericsson.ecb.ui.metraoffer.service.MetadataConfigService;
import com.ericsson.ecb.ui.metraoffer.service.ProductOfferBundleService;
import com.ericsson.ecb.ui.metraoffer.service.ProductOfferService;
import com.ericsson.ecb.ui.metraoffer.service.SubscriptionService;
import com.ericsson.ecb.ui.metraoffer.utils.ApprovalsUtil;
import com.ericsson.ecb.ui.metraoffer.utils.CommonUtils;
import com.ericsson.ecb.ui.metraoffer.utils.EntityHelper;
import com.ericsson.ecb.ui.metraoffer.utils.InvokeGetterSetter;
import com.google.common.collect.MapDifference;
import com.google.common.collect.MapDifference.ValueDifference;
import com.google.common.collect.Maps;

@Service
public class ProductOfferServiceImpl implements ProductOfferService {

  @Autowired
  private ProductOfferClient productOfferClient;

  @Autowired
  private MasterDataService masterDataService;

  @Autowired
  private ExtendedProductOfferClient extendedProductOfferClient;

  @Autowired
  private SubscriptionService subscriptionService;

  @Autowired
  private MetadataConfigService metadataConfigService;

  @Autowired
  private AccountTypeService accountTypeService;

  @Autowired
  private ProductOfferBundleService productOfferBundleService;

  @Autowired
  private LocalizedEntityService localizedEntityService;

  @Autowired
  private EntityHelper entityHelper;

  @Autowired
  private ApprovalsService approvalService;

  @Autowired
  private ApprovalsUtil approvalsUtil;

  public static final String FILTER_CURRENCY = "name=='Global/SystemCurrencies/SystemCurrencies/";

  private static final Logger LOGGER = LoggerFactory.getLogger(ProductOfferServiceImpl.class);

  /**
   * Retrieve Product Offer that matches the supplied identifier
   *
   * @param offerId the value for API service param
   * @return the matching ProductOfferData record
   * @throws EcbBaseException
   * @ @throws MetraOfferException
   */
  @Override
  public ProductOfferData getProductOffer(Integer offerId) throws EcbBaseException {
    ProductOffer productOffer = getProductOfferById(offerId);
    List<ProductOfferData> records = new ArrayList<>();

    ProductOfferData productOfferData = null;
    List<Integer> offerIdList = new ArrayList<>();
    if (productOffer != null) {
      productOfferData = preparePOObject(productOffer, null);
      if (productOfferData.getOfferId() != null)
        offerIdList.add(productOfferData.getOfferId());

      productOfferData.setCurrencies(masterDataService
          .getCurrencies(FILTER_CURRENCY + productOffer.getCurrency().getValue() + "'"));

      productOfferData.setPoPartitions(masterDataService.getPartitionById());

      productOfferData.getExtendedProperties().addAll(metadataConfigService
          .getExtendedProperties(productOffer.getProperties(), PropertyKind.OFFERING));

      productOfferData.setAccountTypeEligibilities(accountTypeService.findAccountTypeEligibility());

      productOfferData.setSelectedAccountTypeEligibility(
          accountTypeService.getAccountTypeEligibilityInProductOffer(offerId));

      if (!productOffer.getBundle()) {
        updateBundleInfoInPo(productOfferData);
      }
      updateApprovalsDetails(productOfferData);
      records.add(productOfferData);
    }
    if (!CollectionUtils.isEmpty(offerIdList)) {
      Map<Integer, Integer> subscriptionMap =
          subscriptionService.findSubscriptionsCountByOfferIdList(offerIdList);
      updateSubscriptionCount(records, subscriptionMap);
    }
    return localizedEntityService.localizedGetEntity(productOfferData);
  }

  private void updateApprovalsDetails(ProductOfferData record) throws EcbBaseException {
    Map<String, Object> map = approvalService.getOfferingApprovalsStatus(record.getOfferId());
    record.getApprovalDetailsMap().putAll(map);
  }

  private void updateBundleInfoInPo(ProductOfferData productOfferData) throws EcbBaseException {
    List<ProductOffer> bundles =
        productOfferBundleService.findBundleForProductOffer(productOfferData.getOfferId());
    if (CollectionUtils.isNotEmpty(bundles)) {
      productOfferData.setNumberOfLocationsPoUsed(bundles.size());
      for (ProductOffer bundle : bundles)
        if (bundle.getAvailableStartDate() != null) {
          productOfferData.setAnyOneBundleIsAvailable(Boolean.TRUE);
          break;
        }
    }
  }

  /**
   * Retrieve Product Offer rows that match the supplied filter
   *
   * @param page the number of the page
   * @param sizeIn the number of records per page
   * @param sort the sort direction to use
   * @param queryIn the filter criteria to use
   * @return the page of matching ProductOfferData records @
   * @throws EcbBaseException
   */
  @Override
  public PaginatedList<ProductOfferData> findProductOffer(Integer page, Integer sizeIn,
      String[] sort, String queryIn, Boolean hidden, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException {
    Integer size = (sizeIn != null && sizeIn > 0) ? sizeIn : Integer.MAX_VALUE;
    String query = queryIn;
    if (hidden != null) {
      query = !StringUtils.isEmpty(queryIn)
          ? queryIn + RsqlOperator.AND + PropertyRsqlConstants.HIDDEN_EQUAL + hidden
          : PropertyRsqlConstants.HIDDEN_EQUAL + hidden;
    }

    Map<Integer, String> partitionIdNameMap = getPartitionIdAndName();
    LOGGER.debug("Query for findProductOffer : {}", query);
    PaginatedList<ProductOffer> pageableList = productOfferClient.findProductOffer(page, size, sort,
        query, descriptionLanguage, descriptionFilters, descriptionSort).getBody();
    List<ProductOfferData> records = new ArrayList<>();
    List<Integer> offerIdList = new ArrayList<>();
    Collection<ProductOffer> productOfferList = pageableList.getRecords();
    productOfferList.forEach(productOffer -> {
      if (productOffer != null) {
        records.add(preparePOObject(productOffer, partitionIdNameMap));
        offerIdList.add(productOffer.getOfferId());
      }
    });

    if (!offerIdList.isEmpty()) {
      Map<Integer, Integer> subscriptionMap =
          subscriptionService.findSubscriptionsCountByOfferIdList(offerIdList);
      updateSubscriptionCount(records, subscriptionMap);
    }

    CustomPaginatedList<ProductOfferData> productOfferDataList =
        createCustomPageablePO(pageableList, records);

    if (hidden != null) {
      Collection<ProductOffer> productOffers = productOfferClient.findProductOffer(1, 20, null,
          PropertyRsqlConstants.HIDDEN_EQUAL + !hidden, null, null, null).getBody().getRecords();

      Boolean visibilityFlag =
          (productOffers != null && !productOffers.isEmpty()) ? Boolean.TRUE : Boolean.FALSE;
      productOfferDataList.getUtilityMap().put(Constants.VISIBILITY_FLAG, visibilityFlag);
    }
    return localizedEntityService.localizedFindEntity(productOfferDataList);
  }

  @Override
  public PaginatedList<ProductOfferData> findOfferingsForInUse(Collection<Integer> offerIds,
      Integer page, Integer sizeIn, String[] sort, String queryIn, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException {

    PaginatedList<ProductOfferData> paginatedrecords = new PaginatedList<>();

    if (CollectionUtils.isEmpty(offerIds))
      return paginatedrecords;

    Integer size = (sizeIn != null && sizeIn > 0) ? sizeIn : Integer.MAX_VALUE;
    String query;

    String offerIdInSubQuery =
        CommonUtils.getQueryStringFromCollection(offerIds, PropertyRsqlConstants.OFFER_ID_IN);

    if (!StringUtils.isBlank(queryIn))
      query = queryIn + RsqlOperator.AND + offerIdInSubQuery;
    else
      query = offerIdInSubQuery;

    Map<Integer, String> partitionIdNameMap = getPartitionIdAndName();
    LOGGER.debug("Query findOfferingsForInUse >> findProductOffer :{}", query);
    PaginatedList<ProductOffer> pageableList = productOfferClient.findProductOffer(page, size, sort,
        query, descriptionLanguage, descriptionFilters, descriptionSort).getBody();

    List<ProductOfferData> records = new ArrayList<>();
    Collection<ProductOffer> productOffers = pageableList.getRecords();
    productOffers.forEach(productOffer -> {
      if (productOffer != null) {
        ProductOfferData productOfferData = new ProductOfferData();
        BeanUtils.copyProperties(productOffer, productOfferData);
        productOfferData
            .setPoPartitionName(partitionIdNameMap.get(productOfferData.getPopartitionid()));
        records.add(productOfferData);
      }
    });
    CommonUtils.copyPaginatedList(pageableList, paginatedrecords);
    paginatedrecords.setRecords(records);
    return localizedEntityService.localizedFindEntity(paginatedrecords);
  }


  /**
   * Retrieve Product Offer rows which are not having available dates
   *
   * @param page the number of the page
   * @param sizeIn the number of records per page
   * @param sort the sort direction to use
   * @param query the filter criteria to use
   * @return the page of matching ProductOfferData records @
   * @throws EcbBaseException
   */

  @Override
  public PaginatedList<ProductOfferData> findPOWithNoAvailableDates(Integer page, Integer size,
      String[] sort, String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException {
    String queryIn = PropertyRsqlConstants.AVAILABLE_START_DATE_NULL_TRUE + RsqlOperator.AND
        + PropertyRsqlConstants.AVAILABLE_END_DATE_NULL_TRUE;
    PaginatedList<ProductOffer> paginatedList =
        productOfferClient.findProductOffer(Pagination.getPage(page), Pagination.getSize(size),
            sort, queryIn, descriptionLanguage, descriptionFilters, descriptionSort).getBody();

    List<ProductOfferData> withNoAvailableDates = new ArrayList<>();
    Collection<ProductOffer> productOfferList = paginatedList.getRecords();
    productOfferList
        .forEach(productOffer -> withNoAvailableDates.add(preparePOObject(productOffer, null)));
    return createCustomPageablePO(paginatedList, withNoAvailableDates);
  }

  /**
   * Retrieve Product Offer rows which are having available dates
   *
   * @param page the number of the page
   * @param size the number of records per page
   * @param sort the sort direction to use
   * @param query the filter criteria to use
   * @return the page of matching ProductOfferData records @
   * @throws EcbBaseException
   */
  @Override
  public PaginatedList<ProductOfferData> findPOWithAvailableDates(Integer page, Integer size,
      String[] sort, String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException {
    PaginatedList<ProductOffer> paginatedList =
        productOfferClient.findProductOffer(Pagination.getPage(page), Pagination.getSize(size),
            sort, PropertyRsqlConstants.AVAILABLE_START_DATE_NULL_FALSE, descriptionLanguage,
            descriptionFilters, null).getBody();

    Collection<ProductOffer> productOfferList = paginatedList.getRecords();

    List<ProductOfferData> withAvailableDates = new ArrayList<>();
    productOfferList
        .forEach(productOffer -> withAvailableDates.add(preparePOObject(productOffer, null)));
    return createCustomPageablePO(paginatedList, withAvailableDates);
  }

  private ProductOfferData preparePOObject(ProductOffer productOffer,
      Map<Integer, String> partitionIdNameMap) {
    ProductOfferData productOfferData = new ProductOfferData();
    BeanUtils.copyProperties(productOffer, productOfferData);
    if (partitionIdNameMap != null)
      productOfferData
          .setPoPartitionName(partitionIdNameMap.get(productOfferData.getPopartitionid()));
    return productOfferData;
  }

  private CustomPaginatedList<ProductOfferData> createCustomPageablePO(
      PaginatedList<ProductOffer> paginatedlist, Collection<ProductOfferData> records) {
    CustomPaginatedList<ProductOfferData> paginatedPO = new CustomPaginatedList<>();
    paginatedPO.setTotalPages(paginatedlist.getTotalPages());
    paginatedPO.setTotalCount(paginatedlist.getTotalCount());
    paginatedPO.setCurrentPage(paginatedlist.getCurrentPage());
    paginatedPO.setTotalPageSize(paginatedlist.getTotalPageSize());
    paginatedPO.setRecords(records);
    return paginatedPO;
  }


  /**
   * insert ProductOffer
   *
   * @param productOffer the value for API service param
   * @return the matching ProductOfferData records @
   * @throws EcbBaseException
   */
  @Override
  public ProductOfferData createProductOffer(LocalizedProductOffer productOffer)
      throws EcbBaseException {
    localizedEntityService.localizedCreateEntity(productOffer);
    return preparePOObject(productOfferClient.createProductOffer(productOffer).getBody(), null);
  }


  /**
   * delete ProductOffer
   *
   * @param offerId
   * @return boolean, delete status of specified product offer @
   * @throws EcbBaseException
   */
  @Override
  public ResponseEntity<Boolean> deleteProductOffer(Integer offerId) throws EcbBaseException {
    return extendedProductOfferClient.deleteProductOffer(offerId);
  }

  private void updateSubscriptionCount(List<ProductOfferData> records,
      Map<Integer, Integer> subscriptionMap) {
    records.forEach(productOffer -> {
      if (subscriptionMap.containsKey(productOffer.getOfferId())) {
        productOffer.setSubcriptionCount(subscriptionMap.get(productOffer.getOfferId()));
      } else {
        productOffer.setSubcriptionCount(0);
      }
    });
  }

  @Override
  public ResponseEntity<Boolean> hideProductOffer(Integer offerId, Boolean hide)
      throws EcbBaseException {
    return extendedProductOfferClient.hideProductOffer(offerId, hide);
  }

  private Map<Integer, String> findPartitionIdName(
      Collection<BusinessPartition> businessPartitions) {
    Map<Integer, String> partitionIdNameMap = new HashMap<>();
    businessPartitions.forEach(businessPartition -> {
      if (businessPartition != null)
        partitionIdNameMap.put(businessPartition.getAccountId(), businessPartition.getLogin());
    });
    return partitionIdNameMap;
  }

  @Override
  public Map<Integer, String> getPartitionIdAndName() throws EcbBaseException {
    Collection<BusinessPartition> businessPartitions = masterDataService.getUserPartitions();
    return findPartitionIdName(businessPartitions);
  }

  private ProductOffer getProductOfferById(Integer offerId) throws EcbBaseException {
    return productOfferClient.getProductOffer(offerId).getBody();
  }

  @Override
  public PaginatedList<ProductOfferData> getPoUsedLocations(Integer offerId, Integer page,
      Integer size, String[] sort, String query, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException {
    List<ProductOffer> productOffers = productOfferBundleService.findBundleForProductOffer(offerId);
    Set<Integer> offerIds = null;
    if (!CollectionUtils.isEmpty(productOffers))
      offerIds = getOfferIdsFromOfferings(productOffers);
    return findOfferingsForInUse(offerIds, page, size, sort, query, descriptionLanguage,
        descriptionFilters, descriptionSort);
  }

  private Set<Integer> getOfferIdsFromOfferings(List<ProductOffer> productOffers) {
    Set<Integer> offerIds = new HashSet<>();
    productOffers.forEach(productOffer -> offerIds.add(productOffer.getOfferId()));
    return offerIds;
  }

  @Override
  public ProductOffer copyProductOffer(Integer srcOfferId, LocalizedProductOffer productOffer)
      throws EcbBaseException {
    localizedEntityService.localizedCreateEntity(productOffer);
    return extendedProductOfferClient.copyProductOffer(srcOfferId, productOffer).getBody();
  }

  @Override
  public Boolean checkConfiguration(Integer offerId) throws EcbBaseException {
    return extendedProductOfferClient.checkConfiguration(offerId).getBody();
  }

  @Override
  public void exportToCsv(HttpServletResponse response, String[] sort, String query)
      throws Exception {
    String csvFileName = "export.csv";
    response.setContentType("text/csv");
    String headerKey = "Content-Disposition";
    String headerValue = String.format("attachment; filename=\"%s\"", csvFileName);
    response.setHeader(headerKey, headerValue);
    PaginatedList<ProductOffer> productOffers = productOfferClient
        .findProductOffer(1, Integer.MAX_VALUE, sort, query, null, null, null).getBody();
    localizedEntityService.localizedFindEntity(productOffers);
    ICsvBeanWriter csvWriter =
        new CsvBeanWriter(response.getWriter(), CsvPreference.STANDARD_PREFERENCE);
    csvWriter.writeHeader(EXPORT_CSV_HEADER);
    Map<Integer, String> partionsMap = getPartitionIdAndName();
    for (ProductOffer productOffer : productOffers.getRecords()) {
      ExportProductOffer exportProductOffer = new ExportProductOffer();
      BeanUtils.copyProperties(productOffer, exportProductOffer);
      exportProductOffer.setPartitionName(partionsMap.get(productOffer.getPopartitionid()));
      exportProductOffer.setCurrencyName(productOffer.getCurrency().getValue());
      exportProductOffer.setType(productOffer.getBundle() ? "Bundle" : "Product Offer");
      csvWriter.write(exportProductOffer, EXPORT_CSV_FIELD_MAPPING);
    }
    csvWriter.close();
  }

  @Override
  public Boolean updateProductOffer(ProductOfferData record, Set<String> fields, Integer offerId)
      throws EcbBaseException {

    if (record.getIsAccountTypeEligibilityUpdated()) {
      Map<Integer, String> uiAccountTypeEligibility = record.getSelectedAccountTypeEligibility();
      List<Integer> uiAccountTypeEligibilityKeyIds = new ArrayList<>();
      uiAccountTypeEligibilityKeyIds.addAll(uiAccountTypeEligibility.keySet());
      try {
        accountTypeService.refreshAccountTypeEligibilityProductOffer(offerId,
            uiAccountTypeEligibilityKeyIds);
      } catch (Exception e) {
        LOGGER.error("Exception occured while updating AccountTypeEligibility for Offering {}",
            offerId);
        CommonUtils.handleExceptions(e, null);
      }
    }

    ProductOffer newRecord = new ProductOffer();
    BeanUtils.copyProperties(record, newRecord);
    newRecord.getProperties().clear();
    newRecord.getProperties().putAll(record.getProperties());
    if (fields.contains(PropertyConstants.HIDDEN) && approvalsUtil.isUpdatePoApprovalEnabled()) {
      try {
        hideProductOffer(offerId, newRecord.getHidden());
      } catch (Exception e) {
        LOGGER.error("could not update {} offering visibility , error msg: {}",
            newRecord.getOfferId(), e.getMessage());
      }
      fields.remove(PropertyConstants.HIDDEN);
    }
    return entityHelper.updateSelective(newRecord, fields, offerId);
  }


  @Override
  public Boolean updateSelectiveProductOffer(Map<String, ProductOfferData> recordsMap,
      Set<String> fields, Integer offerId) throws EcbBaseException {
    ProductOfferData oldProductOfferData = recordsMap.get(Constants.OLD_ENTITY);
    ProductOfferData newProductOfferData = recordsMap.get(Constants.NEW_ENTITY);
    Map<String, Object> mapDiff =
        getUpdatedProperties(oldProductOfferData, newProductOfferData, fields);
    return updateProductOffer(newProductOfferData, mapDiff.keySet(), offerId);
  }

  private Map<String, Object> getUpdatedProperties(ProductOffer oldRecord, ProductOffer newRecord,
      Set<String> fields) throws EcbBaseException {
    Map<String, Object> mapDiff = new HashMap<>();
    Map<String, Object> newMap = InvokeGetterSetter.invokeGetters(newRecord, fields);
    Map<String, Object> oldMap = InvokeGetterSetter.invokeGetters(oldRecord, fields);
    MapDifference<String, Object> diffMap = Maps.difference(newMap, oldMap);
    Map<String, ValueDifference<Object>> valueDiff = diffMap.entriesDiffering();
    Iterator<Entry<String, ValueDifference<Object>>> iterator = valueDiff.entrySet().iterator();
    while (iterator.hasNext()) {
      Entry<String, ValueDifference<Object>> entry = iterator.next();
      mapDiff.put(entry.getKey(), entry.getValue().leftValue());
    }
    return mapDiff;
  }
}
