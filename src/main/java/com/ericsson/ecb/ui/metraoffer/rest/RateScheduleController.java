package com.ericsson.ecb.ui.metraoffer.rest;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ericsson.ecb.catalog.model.LocalizedRateSchedule;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.ParamTableRateSchedule;
import com.ericsson.ecb.ui.metraoffer.model.RateScheduleDto;
import com.ericsson.ecb.ui.metraoffer.model.RateScheduleSetDto;
import com.ericsson.ecb.ui.metraoffer.model.RatesDto;
import com.ericsson.ecb.ui.metraoffer.model.ResponseModel;
import com.ericsson.ecb.ui.metraoffer.service.RateScheduleService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@Api(value = "RateSchedule",
    description = "This table interacts with Rate Schedule and Rule set rest end points ")
@RequestMapping(RestControllerUri.RATE_SCHEDULE)
public class RateScheduleController {

  @Autowired
  private RateScheduleService rateScheduleService;

  /**
   * 
   * @param ParamtableId
   * @return
   * @throws EcbBaseException
   */
  @ApiOperation(value = "removeSchedule", notes = "Remove rate schedule of a parameter table")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.DELETE,
      value = "/{scheduleId}")
  public ResponseEntity<Boolean> deleteRateSchedule(@PathVariable("scheduleId") Integer scheduleId)
      throws EcbBaseException {
    return rateScheduleService.removeRateSchedule(scheduleId);
  }

  /**
   * Find parameter table details with schedules and rate tables
   * 
   * @param offerId
   * @param piInstanceId
   * @param scheduleFirstIndex
   * @return
   * @throws EcbBaseException
   */
  @ApiOperation(value = "getParameterTables",
      notes = "Retrieve parameter table details with schedules and rate tables")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/Rates/{offerId}/{piInstanceId}")
  public RatesDto findRates(@PathVariable("offerId") Integer offerId,
      @PathVariable("piInstanceId") Integer piInstanceId,
      @RequestParam(value = "scheduleFirstIndex", required = false) Boolean scheduleFirstIndex)
      throws EcbBaseException {
    return rateScheduleService.getRates(offerId, piInstanceId, scheduleFirstIndex);
  }

  /**
   * 
   * @param ParamtableId
   * @return
   * @throws EcbBaseException
   */
  @ApiOperation(value = "getRateSchedules", notes = "Retrieve rate schedules with rate tables")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/{paramtableId}/{itemTemplateId}/{pricelistId}")
  public RatesDto getRateSchedules(@PathVariable("paramtableId") Integer paramtableId,
      @PathVariable("itemTemplateId") Integer itemTemplateId,
      @PathVariable("pricelistId") Integer pricelistId,
      @ApiParam(value = "Results page you want to retrieve (1..N)",
          required = false) @RequestParam(required = false, name = "page") Integer page,
      @ApiParam(value = "Number of records per page",
          required = false) @RequestParam(required = false, name = "size") Integer size,
      @ApiParam(
          value = "Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
          required = false) @RequestParam(required = false, name = "sort") String[] sort)
      throws EcbBaseException {
    return rateScheduleService.getRateSchedules(paramtableId, itemTemplateId, pricelistId, page,
        size, sort);
  }

  /**
   * Create new Rate Schedules for a parameter table
   * 
   * @param rateSchedule
   * @return
   * @throws EcbBaseException
   */
  @ApiOperation(value = "createRateSchedule", notes = "Insert a new rate schedule")
  @RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE,
      produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
  public RateScheduleDto createRateSchedule(@RequestBody LocalizedRateSchedule rateSchedule)
      throws EcbBaseException {
    return rateScheduleService.createRateSchedule(rateSchedule);
  }

  @ApiOperation(value = "editRateScheduleSet", notes = "Edit rate schedule")
  @RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE,
      produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT, value = "/all")
  public List<ResponseModel> editRateScheduleSet(@RequestBody RateScheduleSetDto rateScheduleSetDto)
      throws EcbBaseException {
    return rateScheduleService.editRateScheduleSet(rateScheduleSetDto);
  }

  @ApiOperation(value = "getParameterTableRateSchedules",
      notes = "Retrieve rate schedules of a supplier parameter table")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/param-table-id/{ptId}/{schedule-id}/{scheduleId}")
  public PaginatedList<ParamTableRateSchedule> getParameterTableRateSchedules(
      @PathVariable("ptId") Integer ptId, @PathVariable("scheduleId") Integer scheduleId,
      @RequestParam("ptName") String ptName,
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
    return rateScheduleService.getParameterTableRateSchedules(ptId, scheduleId, ptName, page, size,
        sort, query, descriptionLanguage, descriptionFilters, descriptionSort);
  }

}
