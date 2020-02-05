package com.ericsson.ecb.ui.metraoffer.service;

import java.util.List;
import java.util.Set;

import org.springframework.http.ResponseEntity;

import com.ericsson.ecb.catalog.model.LocalizedPricelist;
import com.ericsson.ecb.catalog.model.Pricelist;
import com.ericsson.ecb.catalog.model.PricelistWithInUse;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.customer.model.AccInfoForInUseRates;
import com.ericsson.ecb.ui.metraoffer.model.PricelistDto;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferData;
import com.ericsson.ecb.ui.metraoffer.model.ResponseModel;
import com.ericsson.ecb.ui.metraoffer.model.SharedPricelistDto;
import com.ericsson.ecb.ui.metraoffer.model.TemplateParameterTableMappingDto;

public interface PricelistService {

  public PaginatedList<Pricelist> findPricelist(Integer page, Integer size, String[] sort,
      String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException;

  public PaginatedList<PricelistWithInUse> findSharedPricelist(Integer page, Integer size,
      String[] sort, String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException;

  public PaginatedList<ProductOfferData> findInUseOfferings(Integer pricelistId, Integer page,
      Integer size, String[] sort, String query, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException;

  public ResponseEntity<Pricelist> createPricelist(LocalizedPricelist pricelist)
      throws EcbBaseException;

  public ResponseEntity<Pricelist> updatePricelist(Pricelist pricelist) throws EcbBaseException;

  public ResponseEntity<Boolean> deletePricelist(Integer pricelistId) throws EcbBaseException;

  public PricelistDto getPricelist(Integer pricelistId) throws EcbBaseException;

  public PaginatedList<TemplateParameterTableMappingDto> getPricelistPriceableItemParamTableMapping(
      Integer pricelistId, Integer templateId, Integer page, Integer size, String[] sort,
      String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException;

  public Object getMappedParameterTables(Integer pricelistId, Integer selectedParentTemplateId,
      Integer selectedTemplatedId, Integer selectedParameterTableId) throws EcbBaseException;

  public List<ResponseModel> addParameterTables(List<SharedPricelistDto> records)
      throws EcbBaseException;

  public PaginatedList<AccInfoForInUseRates> findInUseSubscribers(Integer page, Integer size,
      String[] sort, String query) throws EcbBaseException;

  public PaginatedList<PricelistWithInUse> findAllPricelist(Integer page, Integer size,
      String[] sort, String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException;

  public Pricelist getSharedPricelist(Integer pricelistId) throws EcbBaseException;

  public PricelistWithInUse getSharedRateInUseInfo(Integer pricelistId) throws EcbBaseException;

  public ResponseEntity<Pricelist> copyPriceList(Integer pricelistId, LocalizedPricelist record)
      throws EcbBaseException;

  public PaginatedList<PricelistWithInUse> findRqrdSharedPricelist(Integer itemTemplateId,
      Integer paramtableId) throws EcbBaseException;
}
