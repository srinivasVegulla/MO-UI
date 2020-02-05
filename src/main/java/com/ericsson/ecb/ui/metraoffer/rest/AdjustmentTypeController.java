package com.ericsson.ecb.ui.metraoffer.rest;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ericsson.ecb.catalog.model.AdjustmentType;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.AdjustmentTypeModel;
import com.ericsson.ecb.ui.metraoffer.service.AdjustmentTypeService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@Api(value = RestControllerUri.ADJUSTMENT_TYPE,
    description = "This Controller interact with AdjustmentType which is used to create Adjustment")
@RequestMapping(RestControllerUri.ADJUSTMENT_TYPE)
public class AdjustmentTypeController {

  @Autowired
  private AdjustmentTypeService adjustmentTypeService;

  @ApiOperation(value = "getAdjustmentType", notes = "get AdjustmentType by given piId")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/{piId}")
  public PaginatedList<AdjustmentType> getAdjustmentType(
      @ApiParam(value = "piId", required = true) @PathVariable("piId") final Integer piId)
      throws EcbBaseException {
    return adjustmentTypeService.getAdjustmentType(piId);
  }

  @ApiOperation(value = "findAdjustmentType", notes = "Find all AdjustmentTypes")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
  public PaginatedList<AdjustmentTypeModel> findAdjustmentType(
      @RequestParam(required = false, name = "page") Integer page,
      @RequestParam(required = false, name = "size") Integer size,
      @RequestParam(required = false, name = "sort") String[] sort,
      @RequestParam(required = false, name = "query") String query,
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
    return adjustmentTypeService.findAdjustmentType(page, size, sort, query, descriptionLanguage,
        descriptionFilters, descriptionSort);
  }
}
