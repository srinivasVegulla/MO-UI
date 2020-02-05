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

import com.ericsson.ecb.catalog.model.UsagePriceableItemTemplate;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.UsagePriceableItemModel;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemUsageService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@Api(value = RestControllerUri.USAGE,
    description = "This Controller interact with Priceableitem Template of USAGE")
@RequestMapping(RestControllerUri.USAGE)
public class PriceableItemUsageController {

  @Autowired
  private PriceableItemUsageService priceableItemUsageService;


  @ApiOperation(value = "findUsagePriceableItem", notes = "Find all UsagePriceableItem")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
  public PaginatedList<UsagePriceableItemTemplate> findUsagePriceableItem(
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
    return priceableItemUsageService.findUsagePriceableItem(page, size, sort, query,
        descriptionLanguage, descriptionFilters, descriptionSort);
  }

  @ApiOperation(value = "getUsagePriceableItem",
      notes = "get USAGE priceableitem Template by give propId")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/{propId}")
  public UsagePriceableItemTemplate getUsagePriceableItem(@PathVariable("propId") Integer propId)
      throws EcbBaseException {
    return priceableItemUsageService.getUsagePriceableItem(propId);
  }

  @ApiOperation(value = "getUsagePriceableItemDetailsWithChilds",
      notes = "get USAGE priceableitem Template by give propId")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/details/{templateId}")
  public UsagePriceableItemModel getUsagePriceableItemDetailsWithChilds(
      @PathVariable("templateId") Integer templateId) throws EcbBaseException {
    return priceableItemUsageService.getUsagePriceableItemDetailsWithChilds(templateId);
  }

  @ApiOperation(value = "updateUsagePriceableItem", notes = "update USAGE priceableItem Template")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT,
      value = "/update-fields/{propId}")
  public Boolean updateUsagePriceableItem(@RequestBody UsagePriceableItemTemplate record,
      @RequestParam(required = true, name = "fields") Set<String> fields,
      @PathVariable("propId") Integer propId) throws EcbBaseException {
    return priceableItemUsageService.updateUsagePriceableItem(record, fields, propId);
  }

}
