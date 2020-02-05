package com.ericsson.ecb.ui.metraoffer.rest;

import java.util.Collection;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ericsson.ecb.catalog.model.Adjustment;
import com.ericsson.ecb.catalog.model.LocalizedAdjustment;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.AdjustmentModel;
import com.ericsson.ecb.ui.metraoffer.service.AdjustmentService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@Api(value = RestControllerUri.ADJUSTMENT,
    description = "This Controller iteract with Adjustment and mapped ReasonCodes")
@RequestMapping(RestControllerUri.ADJUSTMENT)

public class AdjustmentController {

  @Autowired
  private AdjustmentService adjustmentService;

  @ApiOperation(value = "(Create)/addAdjustmentToPriceableItemTemplate",
      notes = "Add/Create Adjustment to Priceable Item Template")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST,
      value = "/adjustment")
  public Adjustment addAdjustmentToPriceableItemTemplate(
      @RequestBody LocalizedAdjustment adjustment) throws EcbBaseException {
    return adjustmentService.addAdjustmentToPriceableItemTemplate(adjustment);
  }

  @ApiOperation(value = "removeAdjustmentFromPiTemplate",
      notes = "Remove/Delete Adjustment From Priceable Item Template")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.DELETE,
      value = "/{propId}")
  public Boolean removeAdjustmentFromPiTemplate(@PathVariable("propId") final Integer propId)
      throws EcbBaseException {
    return adjustmentService.removeAdjustmentFromPiTemplate(propId);
  }

  @ApiOperation(value = "removeReasonCodeFromAdjustment",
      notes = "Remove/UnMaping set of ReasonCodes from given Adjustment propId")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.DELETE,
      value = "/reason-code/{propId}")
  public Boolean removeReasonCodeFromAdjustment(@PathVariable("propId") final Integer propId,
      @RequestParam(required = false, name = "reasonCodeList") final Set<Integer> reasonCodeList)
      throws EcbBaseException {
    return adjustmentService.removeReasonCodeFromAdjustment(propId, reasonCodeList);
  }

  @ApiOperation(value = "addReasonCodeToAdjustment",
      notes = "Add/Map set of ReasonCodes to given Adjustment propId")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST,
      value = "/reason-code/{propId}")
  public Boolean addReasonCodeToAdjustment(@PathVariable("propId") final Integer propId,
      @RequestBody final Set<Integer> reasonCodeList) throws EcbBaseException {
    return adjustmentService.addReasonCodeToAdjustment(propId, reasonCodeList);
  }

  @ApiOperation(value = "updatePiTemplateAdjustmentAndReasonCode",
      notes = "Update/Save Adjustments with reascodes")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST,
      value = "/adjustment-reason-code/{templateId}")
  public Boolean updatePiTemplateAdjustmentAndReasonCode(
      @PathVariable("templateId") final Integer templateId,
      @RequestBody Collection<AdjustmentModel> uiAdjustmentModelList) throws EcbBaseException {
    return adjustmentService.updatePiTemplateAdjustmentAndReasonCode(templateId,
        uiAdjustmentModelList);
  }

  @ApiOperation(value = "updatePiInstanceAdjustment",
      notes = "Update/Save Adjustments with reascodes")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST,
      value = "/pi-instance/{piInstanceId}")
  public Boolean updatePiInstanceAdjustment(
      @PathVariable("piInstanceId") final Integer piInstanceId,
      @RequestBody Collection<AdjustmentModel> uiAdjustmentModelList) throws EcbBaseException {
    return adjustmentService.updatePiInstanceAdjustment(piInstanceId, uiAdjustmentModelList);
  }

  @ApiOperation(value = "findAdjustment", notes = "Find all adjustments")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
  public PaginatedList<Adjustment> findAdjustment(
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
    return adjustmentService.findAdjustment(page, size, sort, query, descriptionLanguage,
        descriptionFilters, descriptionSort);
  }

  @ApiOperation(value = "getPiTemplateAdjustmentWithReasonCode",
      notes = "get list of Pi Template Adjustments with attached ReasonCodes of given templateId")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/adjustment-reason-code/pi-template/{piTemplateId}")
  public Collection<AdjustmentModel> getPiTemplateAdjustmentWithReasonCode(
      @PathVariable("piTemplateId") Integer piTemplateId) throws EcbBaseException {
    return adjustmentService.getPiTemplateAdjustmentWithReasonCode(piTemplateId);
  }

  @ApiOperation(value = "getPiInstanceAdjustmentWithReasonCode",
      notes = "get list of Pi Instance Adjustments with attached ReasonCodes of given templateId")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/adjustment-reason-code/pi-instance/{piInstanceId}")
  public Collection<AdjustmentModel> getPiInstanceAdjustmentWithReasonCode(
      @PathVariable("piInstanceId") Integer piInstanceId) throws EcbBaseException {
    return adjustmentService.getPiInstanceAdjustmentWithReasonCode(piInstanceId);
  }

  @ApiOperation(value = "createAdjustment", notes = "create Adjustment")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
  public Adjustment createAdjustment(
      @ApiParam(value = "", required = true) @RequestBody LocalizedAdjustment adjustment)
      throws EcbBaseException {
    return adjustmentService.createAdjustment(adjustment);
  }
}
