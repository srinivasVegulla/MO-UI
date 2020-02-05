package com.ericsson.ecb.ui.metraoffer.service;

import java.util.Collection;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseEntity;

import com.ericsson.ecb.catalog.model.LocalizedProductOffer;
import com.ericsson.ecb.catalog.model.ProductOffer;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferData;

public interface ProductOfferService {

  public static final String[] EXPORT_CSV_HEADER = {"Type", "Name", "DisplayName", "Description",
      "Currency", "Partition Name", "Effective Start Date", "Effective End Date",
      "Available Start Date", "Available End Date"};

  public static final String[] EXPORT_CSV_FIELD_MAPPING =
      {"type", "name", "displayName", "description", "currencyName", "partitionName", "startDate",
          "endDate", "availableStartDate", "availableEndDate"};

  public ProductOfferData getProductOffer(Integer offerId) throws EcbBaseException;

  public PaginatedList<ProductOfferData> getPoUsedLocations(Integer offerId, Integer page,
      Integer size, String[] sort, String query, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException;

  public PaginatedList<ProductOfferData> findProductOffer(Integer page, Integer size, String[] sort,
      String query, Boolean hide, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException;

  public PaginatedList<ProductOfferData> findPOWithAvailableDates(Integer page, Integer size,
      String[] sort, String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException;

  public PaginatedList<ProductOfferData> findPOWithNoAvailableDates(Integer page, Integer size,
      String[] sort, String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException;

  public ProductOfferData createProductOffer(LocalizedProductOffer productOffer)
      throws EcbBaseException;

  public ResponseEntity<Boolean> deleteProductOffer(final Integer offerId) throws EcbBaseException;

  public ResponseEntity<Boolean> hideProductOffer(final Integer offerId, final Boolean hidden)
      throws EcbBaseException;

  public Map<Integer, String> getPartitionIdAndName() throws EcbBaseException;

  public PaginatedList<ProductOfferData> findOfferingsForInUse(Collection<Integer> offerIds,
      Integer page, Integer sizeIn, String[] sort, String queryIn, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException;

  public ProductOffer copyProductOffer(Integer srcOfferId, LocalizedProductOffer productOffer)
      throws EcbBaseException;

  public Boolean checkConfiguration(Integer offerId) throws EcbBaseException;

  public void exportToCsv(HttpServletResponse response, String[] sort, String query)
      throws Exception;

  public Boolean updateProductOffer(ProductOfferData record, Set<String> fields, Integer offerId)
      throws EcbBaseException;

  public Boolean updateSelectiveProductOffer(Map<String, ProductOfferData> recordsMap, Set<String> fields,
      Integer offerId) throws EcbBaseException;



}
