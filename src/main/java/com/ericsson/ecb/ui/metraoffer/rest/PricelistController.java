package com.ericsson.ecb.ui.metraoffer.rest;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ericsson.ecb.catalog.model.LocalizedPricelist;
import com.ericsson.ecb.catalog.model.Pricelist;
import com.ericsson.ecb.catalog.model.PricelistWithInUse;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.customer.model.AccInfoForInUseRates;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.PricelistDto;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferData;
import com.ericsson.ecb.ui.metraoffer.model.ResponseModel;
import com.ericsson.ecb.ui.metraoffer.model.SharedPricelistDto;
import com.ericsson.ecb.ui.metraoffer.model.TemplateParameterTableMappingDto;
import com.ericsson.ecb.ui.metraoffer.service.PricelistService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@Api(value = "Pricelist",
    description = "This table interacts with product catalog priclist rest end points ")
@RequestMapping(RestControllerUri.PRICELIST)
public class PricelistController {

  @Autowired
  private PricelistService pricelistService;

  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
  public ResponseEntity<PaginatedList<Pricelist>> findPricelist(
      @ApiParam(value = "Results page you want to retrieve (1..N)",
          required = false) @RequestParam(required = false, name = "page") Integer page,
      @ApiParam(value = "Number of records per page",
          required = false) @RequestParam(required = false, name = "size") Integer size,
      @ApiParam(
          value = "Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
          required = false) @RequestParam(required = false, name = "sort") String[] sort,
      @ApiParam(value = "Filter criteria to apply (e.g., \"accountId==123\")",
          required = false) @RequestParam(required = false, name = "query") String query,
      @ApiParam(
          value = "Language to use when searching descriptions (from Language).  If not set, searches across all languages.",
          required = false) @RequestParam(required = false,
              name = "dLang") String descriptionLanguage,
      @ApiParam(
          value = "Set of filters to use, in format of localizedProperty=filter-text, (e.g., nameId=%Offer%). Supported localizedId's are: nameId, displayNameId, descriptionId",
          required = false) @RequestParam(required = false,
              name = "dFilter") Set<String> descriptionFilters,
      @ApiParam(
          value = "Sorting criteria for localizedProperty in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria is not supported. Supported localizedId's are: nameId, displayNameId, descriptionId",
          required = false) @RequestParam(required = false, name = "dSort") String descriptionSort)
      throws EcbBaseException {
    PaginatedList<Pricelist> pricelist = pricelistService.findPricelist(page, size, sort, query,
        descriptionLanguage, descriptionFilters, descriptionSort);
    return new ResponseEntity<>(pricelist, HttpStatus.OK);
  }

  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/shared")
  public ResponseEntity<PaginatedList<PricelistWithInUse>> findSharedPricelist(
      @ApiParam(value = "Results page you want to retrieve (1..N)",
          required = false) @RequestParam(required = false, name = "page") Integer page,
      @ApiParam(value = "Number of records per page",
          required = false) @RequestParam(required = false, name = "size") Integer size,
      @ApiParam(
          value = "Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
          required = false) @RequestParam(required = false, name = "sort") String[] sort,
      @ApiParam(value = "Filter criteria to apply (e.g., \"accountId==123\")",
          required = false) @RequestParam(required = false, name = "query") String query,
      @ApiParam(
          value = "Language to use when searching descriptions (from Language).  If not set, searches across all languages.",
          required = false) @RequestParam(required = false,
              name = "dLang") String descriptionLanguage,
      @ApiParam(
          value = "Set of filters to use, in format of localizedProperty=filter-text, (e.g., nameId=%Offer%). Supported localizedId's are: nameId, displayNameId, descriptionId",
          required = false) @RequestParam(required = false,
              name = "dFilter") Set<String> descriptionFilters,
      @ApiParam(
          value = "Sorting criteria for localizedProperty in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria is not supported. Supported localizedId's are: nameId, displayNameId, descriptionId",
          required = false) @RequestParam(required = false, name = "dSort") String descriptionSort)
      throws EcbBaseException {
    return new ResponseEntity<>(pricelistService.findSharedPricelist(page, size, sort, query,
        descriptionLanguage, descriptionFilters, descriptionSort), HttpStatus.OK);
  }

  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/offerings/{pricelistId}")
  public ResponseEntity<PaginatedList<ProductOfferData>> findInUseOfferings(
      @PathVariable("pricelistId") Integer pricelistId,
      @ApiParam(value = "Results page you want to retrieve (1..N)",
          required = false) @RequestParam(required = false, name = "page") Integer page,
      @ApiParam(value = "Number of records per page",
          required = false) @RequestParam(required = false, name = "size") Integer size,
      @ApiParam(
          value = "Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
          required = false) @RequestParam(required = false, name = "sort") String[] sort,
      @ApiParam(value = "Filter criteria to apply (e.g., \"accountId==123\")",
          required = false) @RequestParam(required = false, name = "query") String query,
      @ApiParam(
          value = "Language to use when searching descriptions (from Language).  If not set, searches across all languages.",
          required = false) @RequestParam(required = false,
              name = "dLang") String descriptionLanguage,
      @ApiParam(
          value = "Set of filters to use, in format of localizedProperty=filter-text, (e.g., nameId=%Offer%). Supported localizedId's are: nameId, displayNameId, descriptionId",
          required = false) @RequestParam(required = false,
              name = "dFilter") Set<String> descriptionFilters,
      @ApiParam(
          value = "Sorting criteria for localizedProperty in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria is not supported. Supported localizedId's are: nameId, displayNameId, descriptionId",
          required = false) @RequestParam(required = false, name = "dSort") String descriptionSort)
      throws EcbBaseException {
    return new ResponseEntity<>(pricelistService.findInUseOfferings(pricelistId, page, size, sort,
        query, descriptionLanguage, descriptionFilters, descriptionSort), HttpStatus.OK);
  }

  @RequestMapping(method = RequestMethod.POST)
  public ResponseEntity<Pricelist> createPricelist(@RequestBody LocalizedPricelist record)
      throws EcbBaseException {
    return pricelistService.createPricelist(record);
  }


  @ApiOperation(value = "copyPriceList", notes = "Copy Price List")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST,
      value = "/{pricelistId}")
  public ResponseEntity<Pricelist> copyPriceList(@PathVariable("pricelistId") Integer pricelistId,
      @RequestBody LocalizedPricelist record) throws EcbBaseException {
    return pricelistService.copyPriceList(pricelistId, record);
  }

  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT)
  public ResponseEntity<Pricelist> updatePricelist(@RequestBody Pricelist record)
      throws EcbBaseException {
    return pricelistService.updatePricelist(record);
  }

  @RequestMapping(method = RequestMethod.DELETE, value = "/{pricelistId}")
  public ResponseEntity<Boolean> deletePricelist(@PathVariable("pricelistId") Integer pricelistId)
      throws EcbBaseException {
    return pricelistService.deletePricelist(pricelistId);
  }

  @ApiOperation(value = "getPricelist",
      notes = "Retrieve a Pricelist row that matches the supplied identifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/{pricelistId}")
  public PricelistDto getPricelist(@PathVariable("pricelistId") Integer pricelistId)
      throws EcbBaseException {
    return pricelistService.getPricelist(pricelistId);
  }

  @ApiOperation(value = "getMappedParameterTables",
      notes = "Retrives shared rates items hierarchy which includes priceable item templates and parameter tables")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/mapped-param-tables/{pricelistId}")
  public ResponseEntity<Object> getMappedParameterTables(
      @PathVariable("pricelistId") Integer pricelistId,
      @RequestParam(required = false,
          name = "selectedParentTemplateId") Integer selectedParentTemplateId,
      @RequestParam(required = false, name = "selectedTemplatedId") Integer selectedTemplatedId,
      @RequestParam(required = false,
          name = "selectedParameterTableId") Integer selectedParameterTableId)
      throws EcbBaseException {
    return new ResponseEntity<>(pricelistService.getMappedParameterTables(pricelistId,
        selectedParentTemplateId, selectedTemplatedId, selectedParameterTableId), HttpStatus.OK);
  }

  @ApiOperation(value = "getPricelistPriceableItemParamTableMapping",
      notes = "This service used to get the priceable item template and parameter table mapping and which will exclude already mapped param tables.")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/param-table-mapping/{pricelistId}")
  public PaginatedList<TemplateParameterTableMappingDto> getPricelistPriceableItemParamTableMapping(
      @PathVariable("pricelistId") Integer pricelistId,
      @RequestParam(required = false, name = "templateId") Integer templateId,
      @ApiParam(value = "Results page you want to retrieve (1..N)",
          required = false) @RequestParam(required = false, name = "page") Integer page,
      @ApiParam(value = "Number of records per page",
          required = false) @RequestParam(required = false, name = "size") Integer size,
      @ApiParam(
          value = "Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
          required = false) @RequestParam(required = false, name = "sort") String[] sort,
      @ApiParam(value = "Filter criteria to apply (e.g., \"accountId==123\")",
          required = false) @RequestParam(required = false, name = "query") String query,
      @ApiParam(
          value = "Language to use when searching descriptions (from Language).  If not set, searches across all languages.",
          required = false) @RequestParam(required = false,
              name = "dLang") String descriptionLanguage,
      @ApiParam(
          value = "Set of filters to use, in format of localizedProperty=filter-text, (e.g., nameId=%Offer%). Supported localizedId's are: nameId, displayNameId, descriptionId",
          required = false) @RequestParam(required = false,
              name = "dFilter") Set<String> descriptionFilters,
      @ApiParam(
          value = "Sorting criteria for localizedProperty in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria is not supported. Supported localizedId's are: nameId, displayNameId, descriptionId",
          required = false) @RequestParam(required = false, name = "dSort") String descriptionSort)
      throws EcbBaseException {
    return pricelistService.getPricelistPriceableItemParamTableMapping(pricelistId, templateId,
        page, size, sort, query, descriptionLanguage, descriptionFilters, descriptionSort);
  }

  @ApiOperation(value = "addParameterTables",
      notes = "Adds selected parameter table to supplied shared pricelist")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST,
      value = "/add-param-tables")
  public List<ResponseModel> addParameterTables(@RequestBody List<SharedPricelistDto> records)
      throws EcbBaseException {
    return pricelistService.addParameterTables(records);
  }

  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/subscribers")
  public ResponseEntity<PaginatedList<AccInfoForInUseRates>> findInUseSubscribers(
      @ApiParam(value = "Results page you want to retrieve (1..N)",
          required = false) @RequestParam(required = false, name = "page") Integer page,
      @ApiParam(value = "Number of records per page",
          required = false) @RequestParam(required = false, name = "size") Integer size,
      @ApiParam(
          value = "Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
          required = false) @RequestParam(required = false, name = "sort") String[] sort,
      @ApiParam(value = "Filter criteria to apply (e.g., \"accountId==123\")",
          required = false) @RequestParam(required = false, name = "query") String query)
      throws EcbBaseException {
    return new ResponseEntity<>(pricelistService.findInUseSubscribers(page, size, sort, query),
        HttpStatus.OK);
  }

  @ApiOperation(value = "getSharedPricelist",
      notes = "Retrieve a Pricelist row that matches the supplied identifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/shared/{pricelistId}")
  public ResponseEntity<Pricelist> getSharedPricelist(
      @PathVariable("pricelistId") Integer pricelistId) throws EcbBaseException {
    return new ResponseEntity<>(pricelistService.getSharedPricelist(pricelistId), HttpStatus.OK);
  }


  @ApiOperation(value = "getSharedRateInUseInfo",
      notes = "Retrieve a Pricelist row that matches the supplied identifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/inUseInfo/{pricelistId}")
  public ResponseEntity<PricelistWithInUse> getSharedRateInUseInfo(
      @PathVariable("pricelistId") Integer pricelistId) throws EcbBaseException {
    return new ResponseEntity<>(pricelistService.getSharedRateInUseInfo(pricelistId),
        HttpStatus.OK);
  }

  @ApiOperation(value = "findRqrdSharedPricelist",
      notes = "Retrieve a Pricelist row that matches the supplied identifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/rqrdSharedPricelist/item-template-id/{itemTemplateId}/paramtable-id/{paramtableId}")
  public PaginatedList<PricelistWithInUse> findRqrdSharedPricelist(
      @PathVariable("itemTemplateId") Integer itemTemplateId,
      @PathVariable("paramtableId") Integer paramtableId) throws EcbBaseException {
    return pricelistService.findRqrdSharedPricelist(itemTemplateId, paramtableId);
  }

}
