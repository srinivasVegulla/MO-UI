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
import com.ericsson.ecb.catalog.model.UnitDependentRecurringCharge;
import com.ericsson.ecb.catalog.model.UnitDependentRecurringChargeTemplate;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.UnitDependentRecurringChargeModel;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemUnitDependentRecurringService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@Api(value = RestControllerUri.UNIT_DEPENDENT_RECURRING,
    description = "This Controller interact with Priceableitem Template of UNIT_DEPENDENT_RECURRING")
@RequestMapping(RestControllerUri.UNIT_DEPENDENT_RECURRING)
public class PriceableItemUnitDependentRecurringController {

  @Autowired
  private PriceableItemUnitDependentRecurringService priceableItemUnitDependentRecurringService;

  @ApiOperation(value = "findUnitDependentRecurringCharge",
      notes = "Find all UnitDependentRecurringCharge")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
  public PaginatedList<UnitDependentRecurringCharge> findUnitDependentRecurringCharge(
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
    return priceableItemUnitDependentRecurringService.findUnitDependentRecurringCharge(page, size,
        sort, query);
  }

  @ApiOperation(value = "getUnitDependentRecurringCharge",
      notes = "get UNIT_DEPENDENT_RECURRING priceableitem Template by give propId")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/{propId}")
  public UnitDependentRecurringCharge getUnitDependentRecurringCharge(
      @PathVariable("propId") Integer propId) throws EcbBaseException {
    return priceableItemUnitDependentRecurringService.getUnitDependentRecurringCharge(propId);
  }


  @ApiOperation(value = "getUnitDependentRecurringChargeDetails",
      notes = "get UNIT_DEPENDENT_RECURRING priceableitem Template by give propId")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/details/{propId}")
  public UnitDependentRecurringChargeModel getUnitDependentRecurringChargeDetails(
      @PathVariable("propId") Integer propId) throws EcbBaseException {
    return priceableItemUnitDependentRecurringService
        .getUnitDependentRecurringChargeDetails(propId);
  }

  @ApiOperation(value = "createUniDependentRecurringChargePriceableItemTemplate",
      notes = "create UNIT_DEPENDENT_RECURRING priceableItem Template")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
  public UnitDependentRecurringChargeModel createUniDependentRecurringChargePriceableItemTemplate(
      @ApiParam(value = "",
          required = true) @RequestBody LocalizedUnitDependentRecurringChargeTemplate record)
      throws EcbBaseException {
    return priceableItemUnitDependentRecurringService
        .createUniDependentRecurringChargePriceableItemTemplate(record);
  }

  @ApiOperation(value = "updateUnitDependentRecurringCharge",
      notes = "update UNIT_DEPENDENT_RECURRING priceableItem Template with field wise")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT,
      value = "/update-fields/{propId}")
  public Boolean updateUnitDependentRecurringCharge(
      @RequestBody UnitDependentRecurringChargeTemplate record,
      @RequestParam(required = true, name = "fields") Set<String> fields,
      @PathVariable("propId") Integer propId) throws EcbBaseException {
    return priceableItemUnitDependentRecurringService
        .updateUnitRecurringChargePriceableItemTemplate(record, fields, propId);
  }



}
