package com.ericsson.ecb.ui.metraoffer.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.ericsson.ecb.catalog.model.ProductOffer;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.model.PricelistMappingModel;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferBundleData;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferData;

public interface ProductOfferBundleService {

  public ProductOfferBundleData getProductOfferBundle(Integer bundleId) throws EcbBaseException;

  public Collection<ProductOfferData> getProductOffersInBundle(Integer bundleId)
      throws EcbBaseException;

  public List<ProductOffer> findBundleForProductOffer(Integer offerId) throws EcbBaseException;

  public PricelistMappingModel getPriceableItemsInOfferings(Integer bundleId)
      throws EcbBaseException;

  public Boolean updatePoOptionality(Integer bundleId, Integer offerId, Boolean optionality)
      throws EcbBaseException;

  public Boolean addProductOffersToBundle(Integer bundleId, List<Integer> offerIdList)
      throws EcbBaseException;

  public Boolean removeProductOfferFromBundle(Integer bundleId, Integer offerId)
      throws EcbBaseException;

  public PaginatedList<ProductOfferData> findProductOffersForBundle(Integer bundleId, Integer page,
      Integer size, String[] sort, String query, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException;

  public Collection<Integer> getProductOfferIdsInBundle(Integer bundleId) throws EcbBaseException;

  public Boolean updateProductOfferBundle(ProductOfferBundleData record, Set<String> fields,
      Integer offerId) throws EcbBaseException;

  public Boolean updateSelectiveProductOffer(Map<String, ProductOfferBundleData> recordsMap,
      Set<String> fields, Integer bundleId) throws EcbBaseException;
}
