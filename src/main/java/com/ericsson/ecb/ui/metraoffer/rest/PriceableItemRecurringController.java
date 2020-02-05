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

import com.ericsson.ecb.catalog.model.LocalizedUnitDependentRecurringChargeTemplate;
import com.ericsson.ecb.catalog.model.RecurringCharge;
import com.ericsson.ecb.catalog.model.UnitDependentRecurringChargeTemplate;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.UnitDependentRecurringChargeModel;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemRecurringService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@Api(value = RestControllerUri.RECURRING,
    description = "This Controller interact with Priceableitem Template of RECURRING")
@RequestMapping(RestControllerUri.RECURRING)
public class PriceableItemRecurringController {

  @Autowired
  private PriceableItemRecurringService priceableItemRecurringService;


  @ApiOperation(value = "findRecurringCharge", notes = "Find all RecurringCharge")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
  public PaginatedList<RecurringCharge> findRecurringCharge(
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
    return priceableItemRecurringService.findRecurringCharge(page, size, sort, query,
        descriptionLanguage, descriptionFilters, descriptionSort);
  }

  @ApiOperation(value = "getRecurringCharge",
      notes = "get RECURRING priceableitem Template by give propId")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/{propId}")
  public RecurringCharge getRecurringCharge(@PathVariable("propId") Integer propId)
      throws EcbBaseException {
    return priceableItemRecurringService.getRecurringCharge(propId);
  }


  @ApiOperation(value = "getRecurringChargeDetails",
      notes = "get RECURRING priceableitem Template by give propId")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/details/{propId}")
  public UnitDependentRecurringChargeModel getRecurringChargeDetails(
      @PathVariable("propId") Integer propId) throws EcbBaseException {
    return priceableItemRecurringService.getRecurringChargeDetails(propId);
  }

  @ApiOperation(value = "createRecurringChargePriceableItemTemplate",
      notes = "create RECURRING priceableItem Template")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
  public UnitDependentRecurringChargeModel createRecurringChargePriceableItemTemplate(
      @ApiParam(value = "",
          required = true) @RequestBody LocalizedUnitDependentRecurringChargeTemplate record)
      throws EcbBaseException {
    return priceableItemRecurringService.createRecurringChargePriceableItemTemplate(record);
  }

  @ApiOperation(value = "updateRecurringChargePriceableItemTemplate",
      notes = "update RECURRING priceableItem Template with fields wise")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT,
      value = "/update-fields/{propId}")
  public Boolean updateRecurringChargePriceableItemTemplate(
      @RequestBody UnitDependentRecurringChargeTemplate record,
      @RequestParam(required = true, name = "fields") Set<String> fields,
      @PathVariable("propId") Integer propId) throws EcbBaseException {
    return priceableItemRecurringService.updateRecurringChargePriceableItemTemplate(record, fields,
        propId);
  }

}
