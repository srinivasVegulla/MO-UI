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

import com.ericsson.ecb.catalog.model.LocalizedReasonCode;
import com.ericsson.ecb.catalog.model.ReasonCode;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.service.AdjustmentReasonCodeService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@Api(value = RestControllerUri.ADJUSTMENT_REASON_CODE,
    description = "This Controller interact with ReasonCodes of Adjustments")
@RequestMapping(RestControllerUri.ADJUSTMENT_REASON_CODE)
public class AdjustmentReasonCodeController {

  @Autowired
  private AdjustmentReasonCodeService adjustmentReasonCodeService;

  @ApiOperation(value = "findReasonCode", notes = "Find all ReasonCodes")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
  public PaginatedList<ReasonCode> findReasonCode(
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
    return adjustmentReasonCodeService.findReasonCode(page, size, sort, query, descriptionLanguage,
        descriptionFilters, descriptionSort);
  }

  @ApiOperation(value = "getReasonCode", notes = "get Reasoncode by given propId")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/{propId}")
  public ReasonCode getReasonCode(@PathVariable("propId") Integer propId) throws EcbBaseException {
    return adjustmentReasonCodeService.getReasonCode(propId);
  }

  @ApiOperation(value = "deleteReasonCode", notes = "delete Reasoncode by given propId")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.DELETE,
      value = "/{propId}")
  public Object deleteReasonCode(@PathVariable("propId") Integer propId) throws EcbBaseException {
    return adjustmentReasonCodeService.deleteReasonCode(propId);
  }


  @ApiOperation(value = "updateReasonCode", notes = "Update Reasoncode of given propId")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT,
      value = "/{propId}")
  public Boolean updateReasonCode(@PathVariable("propId") Integer propId,
      @RequestParam(required = true, name = "fields") Set<String> fields,
      @RequestBody ReasonCode reasonCode) throws EcbBaseException {
    return adjustmentReasonCodeService.updateReasonCode(reasonCode, fields, propId);
  }

  @ApiOperation(value = "createReasonCode", notes = "create ReasonCode")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
  public ReasonCode createReasonCode(
      @ApiParam(value = "", required = true) @RequestBody LocalizedReasonCode reasonCode)
      throws EcbBaseException {
    return adjustmentReasonCodeService.createReasonCode(reasonCode);
  }
}
