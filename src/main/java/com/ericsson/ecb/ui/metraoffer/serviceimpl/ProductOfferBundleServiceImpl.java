package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ericsson.ecb.catalog.client.ExtendedProductOfferBundleClient;
import com.ericsson.ecb.catalog.client.ProductOfferBundleClient;
import com.ericsson.ecb.catalog.client.ProductOfferClient;
import com.ericsson.ecb.catalog.model.PricelistMapping;
import com.ericsson.ecb.catalog.model.ProductOffer;
import com.ericsson.ecb.catalog.model.ProductOfferBundle;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.Constants;
import com.ericsson.ecb.ui.metraoffer.constants.Pagination;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.PricelistMappingModel;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferBundleData;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferBundleOptionality;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferData;
import com.ericsson.ecb.ui.metraoffer.service.PricelistMappingService;
import com.ericsson.ecb.ui.metraoffer.service.ProductOfferBundleService;
import com.ericsson.ecb.ui.metraoffer.service.ProductOfferService;
import com.ericsson.ecb.ui.metraoffer.utils.CommonUtils;

@Service
public class ProductOfferBundleServiceImpl implements ProductOfferBundleService {

  @Autowired
  private ExtendedProductOfferBundleClient extendedProductOfferBundleClient;

  @Autowired
  private ProductOfferBundleClient productOfferBundleClient;

  @Autowired
  private PricelistMappingService pricelistMappingService;

  @Autowired
  private ProductOfferService productOfferService;

  @Autowired
  private ProductOfferClient productOfferClient;

  @Autowired
  private LocalizedEntityService localizedEntityService;

  public static final Boolean DEFAULT_OPTIONALITY = Boolean.TRUE;

  private static final Logger LOGGER = LoggerFactory.getLogger(ProductOfferBundleServiceImpl.class);

  public ProductOfferBundleData getProductOfferBundle(Integer bundleId) throws EcbBaseException {
    ProductOfferData productOfferData = productOfferService.getProductOffer(bundleId);
    ProductOfferBundleData productOfferBundleData = new ProductOfferBundleData();
    BeanUtils.copyProperties(productOfferData, productOfferBundleData);
    productOfferBundleData.getApprovalDetailsMap().putAll(productOfferData.getApprovalDetailsMap());
    productOfferBundleData.getExtendedProperties().addAll(productOfferData.getExtendedProperties());
    productOfferBundleData.setPoBundleOptionality(getBundleOptionality(bundleId));
    productOfferBundleData.setEditOptionality(isPoOptionalityEditable(productOfferBundleData));
    productOfferBundleData.setPriceableItems(findPricelistMapping(Collections.singleton(bundleId)));
    return productOfferBundleData;
  }

  private Collection<ProductOfferBundleOptionality> getBundleOptionality(Integer bundleId)
      throws EcbBaseException {
    Collection<ProductOfferBundle> productOfferBundles = findProductOfferBundle(bundleId);
    Map<Integer, ProductOffer> posInbundle = getPosInBundle(bundleId);
    Collection<ProductOfferBundleOptionality> poBundleOptionalities = new ArrayList<>();
    productOfferBundles.forEach(bundle -> {
      ProductOfferBundleOptionality poBundleOptionality = new ProductOfferBundleOptionality();
      BeanUtils.copyProperties(bundle, poBundleOptionality);
      poBundleOptionality.setPoName(posInbundle.get(bundle.getIdPoItem()).getName());
      poBundleOptionalities.add(poBundleOptionality);
    });
    return poBundleOptionalities;
  }

  private Map<Integer, ProductOffer> getPosInBundle(Integer bundleId) throws EcbBaseException {
    List<ProductOffer> posInBundle = findProductOfferInBundleApi(bundleId);
    Map<Integer, ProductOffer> productOffers = new HashMap<>();
    posInBundle.forEach(po -> productOffers.put(po.getOfferId(), po));
    return productOffers;
  }

  private List<ProductOffer> findProductOfferInBundleApi(Integer bundleId) throws EcbBaseException {
    return extendedProductOfferBundleClient.findProductOfferInBundle(bundleId).getBody();
  }

  private Boolean addProductOfferToBundle(List<ProductOfferBundle> bundles)
      throws EcbBaseException {
    return extendedProductOfferBundleClient.addProductOfferToBundle(bundles).getBody();
  }

  private Boolean setPoOptionalityInOffering(ProductOfferBundle bundle) throws EcbBaseException {
    return extendedProductOfferBundleClient.setProductOfferOptionalityInBundle(bundle).getBody();
  }

  @Override
  public List<ProductOffer> findBundleForProductOffer(Integer offerId) throws EcbBaseException {
    return extendedProductOfferBundleClient.findBundleForProductOffer(offerId).getBody();
  }

  @Override
  public Collection<ProductOfferData> getProductOffersInBundle(Integer bundleId)
      throws EcbBaseException {
    List<ProductOffer> productOffers = findProductOfferInBundleApi(bundleId);
    return prepareProductOfferDataPojo(productOffers);
  }

  @Override
  public Collection<Integer> getProductOfferIdsInBundle(Integer bundleId) throws EcbBaseException {
    Collection<Integer> offerIds = new ArrayList<>();
    List<ProductOffer> productOffers = findProductOfferInBundleApi(bundleId);
    productOffers.forEach(productOffer -> offerIds.add(productOffer.getOfferId()));
    return offerIds;
  }

  private Collection<ProductOfferData> prepareProductOfferDataPojo(List<ProductOffer> productOffers)
      throws EcbBaseException {
    Collection<ProductOfferData> productOfferDataList = new ArrayList<>();
    if (!CollectionUtils.isEmpty(productOffers)) {
      Map<Integer, ProductOfferData> productOfferDataMap = new HashMap<>();
      productOffers.forEach(productOffer -> {
        ProductOfferData productOfferData = new ProductOfferData();
        BeanUtils.copyProperties(productOffer, productOfferData);
        productOfferDataMap.put(productOfferData.getOfferId(), productOfferData);
      });
      Collection<PricelistMapping> pricelistMappings =
          findPricelistMapping(productOfferDataMap.keySet());
      pricelistMappings
          .forEach(pricelistMapping -> (productOfferDataMap.get(pricelistMapping.getOfferId()))
              .getPriceableItems().add(pricelistMapping));
      productOfferDataList = productOfferDataMap.values();
      PaginatedList<ProductOfferData> paginatedRecords = new PaginatedList<>();
      paginatedRecords.setRecords(productOfferDataList);
      localizedEntityService.localizedFindEntity(paginatedRecords);
    }
    return productOfferDataList;
  }

  private Collection<PricelistMapping> findPricelistMapping(Set<Integer> offerIds)
      throws EcbBaseException {
    return pricelistMappingService.findPricelistMappingByOfferId(offerIds);
  }

  @Override
  public PricelistMappingModel getPriceableItemsInOfferings(Integer bundleId)
      throws EcbBaseException {
    return pricelistMappingService.getPricelistMappingByOfferId(bundleId);
  }

  public Boolean updatePoOptionality(Integer bundleId, Integer offerId, Boolean optionality)
      throws EcbBaseException {
    ProductOfferBundle bundle = new ProductOfferBundle();
    bundle.setIdPoBundle(bundleId);
    bundle.setIdPoItem(offerId);
    bundle.setOptional(optionality);
    return setPoOptionalityInOffering(bundle);
  }

  public Boolean updatePosOptionality(Collection<ProductOfferBundleOptionality> poBundleOptionality)
      throws EcbBaseException {
    for (ProductOfferBundleOptionality optionality : poBundleOptionality) {
      try {
        updatePoOptionality(optionality.getIdPoBundle(), optionality.getIdPoItem(),
            optionality.getOptional());
      } catch (EcbBaseException ex) {
        LOGGER.error(
            "Exception occured while updating Productoffer Optionality of  bundleId : {}, offerId: {}, Optionality: {} Message: {}",
            optionality.getIdPoBundle(), optionality.getIdPoItem(), optionality.getOptional(),
            ex.getMessage());
        CommonUtils.handleExceptions(ex, null);
      }
    }
    return Boolean.TRUE;
  }

  @Override
  public Boolean addProductOffersToBundle(Integer bundleId, List<Integer> offerIds)
      throws EcbBaseException {
    List<ProductOfferBundle> bundles = new ArrayList<>();
    offerIds.forEach(offerId -> {
      ProductOfferBundle bundle = new ProductOfferBundle();
      bundle.setIdPoBundle(bundleId);
      bundle.setIdPoItem(offerId);
      bundle.setOptional(DEFAULT_OPTIONALITY);
      bundles.add(bundle);
    });
    return addProductOfferToBundle(bundles);
  }

  private Boolean removeProductOffersFromBundle(Integer bundleId, List<Integer> offerIdList)
      throws EcbBaseException {
    return extendedProductOfferBundleClient.removeProductOfferFromBundle(bundleId, offerIdList)
        .getBody();
  }

  private Collection<ProductOfferBundle> findProductOfferBundle(Integer bundleId)
      throws EcbBaseException {
    String query = PropertyRsqlConstants.ID_PO_BUNDLE_EQUAL + bundleId;
    return findProductOfferBundle(Pagination.DEFAULT_PAGE, Pagination.DEFAULT_MAX_SIZE, null,
        query);
  }

  private Collection<ProductOfferBundle> findProductOfferBundle(Integer page, Integer size,
      String[] sort, String query) throws EcbBaseException {
    return productOfferBundleClient.findProductOfferBundle(page, size, sort, query).getBody()
        .getRecords();
  }

  @Override
  public Boolean updateProductOfferBundle(ProductOfferBundleData record, Set<String> fields,
      Integer offerId) throws EcbBaseException {

    ProductOfferData newProductOfferData = new ProductOfferData();
    BeanUtils.copyProperties(record, newProductOfferData);
    newProductOfferData.getProperties().clear();
    newProductOfferData.getProperties().putAll(record.getProperties());
    ProductOfferBundleData productOfferBundleData = getProductOfferBundle(record.getOfferId());

    if (productOfferBundleData.getEditOptionality()) {
      Collection<ProductOfferBundleOptionality> uiPoBundleOptionalities =
          record.getPoBundleOptionality();
      updatePosOptionality(uiPoBundleOptionalities);
    }
    return productOfferService.updateProductOffer(newProductOfferData, fields, offerId);
  }

  @Override
  public Boolean removeProductOfferFromBundle(Integer bundleId, Integer offerId)
      throws EcbBaseException {
    List<Integer> offerIdList = new ArrayList<>();
    offerIdList.add(offerId);
    return removeProductOffersFromBundle(bundleId, offerIdList);
  }

  @Override
  public PaginatedList<ProductOfferData> findProductOffersForBundle(Integer bundleId, Integer page,
      Integer size, String[] sort, String queryIn, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException {
    PaginatedList<ProductOfferData> paginatedrecords;
    Set<Integer> mandatoryOfferings = new HashSet<>();
    Set<Integer> optionalOfferings = new HashSet<>();
    Collection<ProductOfferBundle> productOfferBundles = findProductOfferBundle(bundleId);
    productOfferBundles.forEach(productOfferBundle -> {
      if (productOfferBundle.getOptional())
        optionalOfferings.add(productOfferBundle.getIdPoItem());
      else
        mandatoryOfferings.add(productOfferBundle.getIdPoItem());
    });
    mandatoryOfferings.add(bundleId);

    Set<Integer> offeringIdsOfAddedUsagePi = new HashSet<>();
    Set<Integer> ignoreOfferingIds = new HashSet<>();
    Set<Integer> addedUsageTemplateIds = new HashSet<>();
    Collection<PricelistMapping> pricelistMappings = getAllUsagePriceableItmes();

    pricelistMappings.forEach(pricelistMapping -> {
      if (mandatoryOfferings.contains(pricelistMapping.getOfferId())) {
        addedUsageTemplateIds.add(pricelistMapping.getItemTemplateId());
      }
    });
    pricelistMappings.forEach(pricelistMapping -> {
      if (addedUsageTemplateIds.contains(pricelistMapping.getItemTemplateId())) {
        offeringIdsOfAddedUsagePi.add(pricelistMapping.getOfferId());
      }
    });
    ignoreOfferingIds.addAll(offeringIdsOfAddedUsagePi);
    ignoreOfferingIds.addAll(mandatoryOfferings);
    ignoreOfferingIds.addAll(optionalOfferings);

    String offerIdNotInQuery = CommonUtils.getQueryStringFromCollection(ignoreOfferingIds,
        PropertyRsqlConstants.OFFER_ID_NOT_IN);
    Collection<ProductOfferData> availableProductOffers = new ArrayList<>();
    ProductOffer productOfferBundle = productOfferClient.getProductOffer(bundleId).getBody();
    Map<Integer, String> partitionIdNameMap = productOfferService.getPartitionIdAndName();
    String query = prepareProductOffersForBundle(queryIn, offerIdNotInQuery, productOfferBundle);
    LOGGER.debug("Query for findProductOffersForBundle >> findProductOffer : {}", query);
    PaginatedList<ProductOffer> productOfferPaginated =
        productOfferClient.findProductOffer(1, Integer.MAX_VALUE, sort, query, descriptionLanguage,
            descriptionFilters, descriptionSort).getBody();
    Collection<ProductOffer> productOfferCollection = productOfferPaginated.getRecords();
    productOfferCollection.forEach(productOffer -> {
      ProductOfferData productOfferData = preparePOObject(productOffer, partitionIdNameMap);
      availableProductOffers.add(productOfferData);
    });
    paginatedrecords = CommonUtils.customPaginatedList(availableProductOffers, page, size);
    return localizedEntityService.localizedFindEntity(paginatedrecords);
  }

  private Collection<PricelistMapping> getAllUsagePriceableItmes() throws EcbBaseException {
    String usagePiQuery = PropertyRsqlConstants.SUBSCRIPTION_ID_IS_NULL_TRUE + RsqlOperator.AND
        + PropertyRsqlConstants.PARAM_TABLE_ID_NULL_TRUE + RsqlOperator.AND
        + PropertyRsqlConstants.PI_INSTANCE_PARENT_ID_NULL_TRUE + RsqlOperator.AND
        + PropertyRsqlConstants.ITEM_TEMPLATE_KIND_EQUAL + PropertyKind.USAGE;
    return pricelistMappingService.findPricelistMapping(null, usagePiQuery);
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

  private String prepareProductOffersForBundle(String queryIn, String offerIdNotInQuery,
      ProductOffer productOffer) {
    Integer poPartitionId = productOffer.getPopartitionid();
    String currency = productOffer.getCurrency().getValue();
    StringBuilder query = new StringBuilder();

    if (!StringUtils.isBlank(queryIn))
      query.append(queryIn).append(RsqlOperator.AND);

    query.append(PropertyRsqlConstants.BUNDLE_EQUAL).append(RsqlOperator.FALSE)
        .append(RsqlOperator.AND).append(PropertyRsqlConstants.HIDDEN_EQUAL)
        .append(RsqlOperator.FALSE);

    if (poPartitionId != null)
      query.append(RsqlOperator.AND).append(PropertyRsqlConstants.PO_PARTITION_ID_EQUAL)
          .append(poPartitionId);

    if (!StringUtils.isBlank(currency))
      query.append(RsqlOperator.AND).append(PropertyRsqlConstants.CURRENCY_EQUAL).append(currency);

    if (!StringUtils.isBlank(offerIdNotInQuery))
      query.append(RsqlOperator.AND).append(offerIdNotInQuery);

    return query.toString();
  }

  private Boolean isPoOptionalityEditable(ProductOfferBundleData bundle) throws EcbBaseException {
    Integer productOffers = 0;
    if (bundle.isAvailableOrSubscriptions())
      return Boolean.FALSE;
    Collection<ProductOfferBundleOptionality> optionality = bundle.getPoBundleOptionality();
    if (CollectionUtils.isEmpty(optionality))
      return Boolean.FALSE;
    else {
      productOffers = optionality.size();
      if (productOffers > 1)
        return Boolean.TRUE;
      else {
        Collection<PricelistMapping> pricelistMappings = pricelistMappingService
            .findPricelistMappingByOfferId(Collections.singleton(bundle.getOfferId()));
        if (CollectionUtils.isEmpty(pricelistMappings))
          return Boolean.FALSE;
        else {
          return Boolean.TRUE;
        }
      }
    }
  }

  @Override
  public Boolean updateSelectiveProductOffer(Map<String, ProductOfferBundleData> recordsMap,
      Set<String> fields, Integer bundleId) throws EcbBaseException {
    ProductOfferBundleData newProductOfferBundleData = recordsMap.get(Constants.NEW_ENTITY);
    ProductOfferData newProductOfferData = new ProductOfferData();
    BeanUtils.copyProperties(newProductOfferBundleData, newProductOfferData);
    newProductOfferData.getProperties().clear();
    newProductOfferData.getProperties().putAll(newProductOfferBundleData.getProperties());
    ProductOfferBundleData productOfferBundleData =
        getProductOfferBundle(newProductOfferBundleData.getOfferId());

    if (productOfferBundleData.getEditOptionality()) {
      Collection<ProductOfferBundleOptionality> uiPoBundleOptionalities =
          newProductOfferBundleData.getPoBundleOptionality();
      updatePosOptionality(uiPoBundleOptionalities);
    }
    ProductOfferData newTmpProductOfferData = recordsMap.get(Constants.NEW_ENTITY);
    ProductOfferData oldTmpProductOfferData = recordsMap.get(Constants.OLD_ENTITY);
    Map<String, ProductOfferData> recordsTmpMap = new HashMap<>();
    recordsTmpMap.put(Constants.NEW_ENTITY, newTmpProductOfferData);
    recordsTmpMap.put(Constants.OLD_ENTITY, oldTmpProductOfferData);

    return productOfferService.updateSelectiveProductOffer(recordsTmpMap, fields,
        newProductOfferBundleData.getOfferId());
  }
}
