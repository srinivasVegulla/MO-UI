package com.ericsson.ecb.ui.metraoffer.rest;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ericsson.ecb.catalog.model.Discount;
import com.ericsson.ecb.catalog.model.DiscountTemplate;
import com.ericsson.ecb.catalog.model.LocalizedDiscountTemplate;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.DiscountModel;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemDiscountService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@Api(value = RestControllerUri.DISCOUNT,
    description = "This Controller interact with Priceableitem Template of DISCOUNT")
@RequestMapping(RestControllerUri.DISCOUNT)
public class PriceableItemDiscountController {

  @Autowired
  private PriceableItemDiscountService priceableItemDiscountService;

  @ApiOperation(value = "findDiscount", notes = "Find all Discount")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
  public PaginatedList<Discount> findDiscount(
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
    return priceableItemDiscountService.findDiscount(page, size, sort, query, descriptionLanguage,
        descriptionFilters, descriptionSort);
  }

  @ApiOperation(value = "getDiscount", notes = "get DISCOUNT priceableitem Template by give propId")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/{propId}")
  public Discount getDiscount(@PathVariable("propId") Integer propId) throws EcbBaseException {
    return priceableItemDiscountService.getDiscount(propId);
  }

  @ApiOperation(value = "getDiscountDetails",
      notes = "get DISCOUNT priceableitem Template by give propId")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/details/{propId}")
  public DiscountModel getDiscountDetails(@PathVariable("propId") Integer propId) throws EcbBaseException {
    return priceableItemDiscountService.getDiscountDetails(propId);
  }

  @ApiOperation(value = "createDiscountPriceableItemTemplate",
      notes = "create DISCOUNT priceableItem Template")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
  public DiscountModel createDiscountPriceableItemTemplate(
      @ApiParam(value = "", required = true) @RequestBody LocalizedDiscountTemplate record)
      throws EcbBaseException {
    return priceableItemDiscountService.createDiscountPriceableItemTemplate(record);
  }

  @ApiOperation(value = "updateDiscount", notes = "update DISCOUNT priceableItem Template")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT,
      value = "/{propId}")
  public Discount updateDiscount(@PathVariable("propId") Integer propId,
      @ApiParam(value = "", required = true) @RequestBody Discount record) throws EcbBaseException {
    return priceableItemDiscountService.updateDiscount(record, propId);
  }

  @ApiOperation(value = "updateDiscountPriceableItemTemplate",
      notes = "update DISCOUNT priceableItem Template with fields wise")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT,
      value = "/update-fields/{propId}")
  public Boolean updateDiscountPriceableItemTemplate(@RequestBody DiscountTemplate record,
      @RequestParam(required = true, name = "fields") Set<String> fields,
      @PathVariable("propId") Integer propId) throws EcbBaseException {
    return priceableItemDiscountService.updateDiscountPriceableItemTemplate(record, fields, propId);
  }

}
