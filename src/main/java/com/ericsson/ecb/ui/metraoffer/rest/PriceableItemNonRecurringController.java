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

import com.ericsson.ecb.catalog.model.LocalizedNonRecurringChargeTemplate;
import com.ericsson.ecb.catalog.model.NonRecurringCharge;
import com.ericsson.ecb.catalog.model.NonRecurringChargeTemplate;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.NonRecurringChargeModel;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemNonRecurringService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@Api(value = RestControllerUri.NON_RECURRING,
    description = "This Controller interact with Priceableitem Template of NON_RECURRING")
@RequestMapping(RestControllerUri.NON_RECURRING)
public class PriceableItemNonRecurringController {

  @Autowired
  private PriceableItemNonRecurringService priceableItemNonRecurringService;


  @ApiOperation(value = "findNonRecurringCharge", notes = "Find all NonRecurringCharge")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
  public PaginatedList<NonRecurringCharge> findNonRecurringCharge(
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
    return priceableItemNonRecurringService.findNonRecurringCharge(page, size, sort, query,
        descriptionLanguage, descriptionFilters, descriptionSort);
  }

  @ApiOperation(value = "getNonRecurringCharge",
      notes = "get NON_RECURRING priceableitem Template by give propId")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/{propId}")
  public NonRecurringCharge getNonRecurringCharge(@PathVariable("propId") Integer propId)
      throws EcbBaseException {
    return priceableItemNonRecurringService.getNonRecurringCharge(propId);
  }


  @ApiOperation(value = "getNonRecurringChargeDetails",
      notes = "get NON_RECURRING priceableitem Template by give propId")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/details/{propId}")
  public NonRecurringChargeModel getNonRecurringChargeDetails(
      @PathVariable("propId") Integer propId) throws EcbBaseException {
    return priceableItemNonRecurringService.getNonRecurringChargeDetails(propId);
  }

  @ApiOperation(value = "createNonRecurringChargePriceableItemTemplate",
      notes = "create NON_RECURRING priceableItem Template")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
  public NonRecurringChargeModel createNonRecurringChargePriceableItemTemplate(
      @ApiParam(value = "",
          required = true) @RequestBody LocalizedNonRecurringChargeTemplate record)
      throws EcbBaseException {
    return priceableItemNonRecurringService.createNonRecurringChargePriceableItemTemplate(record);
  }

  @ApiOperation(value = "updateNonRecurringCharge",
      notes = "update NON_RECURRING priceableItem Template")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT,
      value = "/{propId}")
  public NonRecurringCharge updateNonRecurringCharge(@PathVariable("propId") Integer propId,
      @ApiParam(value = "", required = true) @RequestBody NonRecurringCharge nonRecurringCharge)
      throws EcbBaseException {
    return priceableItemNonRecurringService.updateNonRecurringCharge(nonRecurringCharge, propId);
  }

  @ApiOperation(value = "updateNonRecurringChargePriceableItemTemplate",
      notes = "update NON_RECURRING priceableItem Template with fields wise")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT,
      value = "/update-fields/{propId}")
  public Boolean updateNonRecurringChargePriceableItemTemplate(
      @RequestBody NonRecurringChargeTemplate record,
      @RequestParam(required = true, name = "fields") Set<String> fields,
      @PathVariable("propId") Integer propId) throws EcbBaseException {
    return priceableItemNonRecurringService.updateNonRecurringChargePriceableItemTemplate(record,
        fields, propId);
  }

}
