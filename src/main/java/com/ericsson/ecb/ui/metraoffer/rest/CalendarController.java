package com.ericsson.ecb.ui.metraoffer.rest;

import java.util.Collections;
import java.util.List;
import java.util.Map;
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

import com.ericsson.ecb.catalog.model.Calendar;
import com.ericsson.ecb.catalog.model.CalendarInUseInfo;
import com.ericsson.ecb.catalog.model.CalendarWithInUse;
import com.ericsson.ecb.catalog.model.LocalizedCalendar;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.CalendarDetails;
import com.ericsson.ecb.ui.metraoffer.model.CalendarHolidayDto;
import com.ericsson.ecb.ui.metraoffer.model.CalendarInUse;
import com.ericsson.ecb.ui.metraoffer.model.ResponseModel;
import com.ericsson.ecb.ui.metraoffer.model.StandardCalendarDayDtoList;
import com.ericsson.ecb.ui.metraoffer.service.CalendarService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@Api(value = RestControllerUri.CALENDAR, description = "This controller produces the Calendar")
@RequestMapping(RestControllerUri.CALENDAR)
public class CalendarController {

  @Autowired
  private CalendarService calendarService;

  @ApiOperation(value = "findCalendar", notes = "view available calendars")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
  public PaginatedList<CalendarInUse> findCalendar(
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
    return calendarService.findCalendar(page, size, sort, query, descriptionLanguage,
        descriptionFilters, descriptionSort);
  }

  @ApiOperation(value = "createCalendar", notes = "create new calendar")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
  public Calendar createCalendar(@RequestBody LocalizedCalendar record) throws EcbBaseException {

    return calendarService.createCalendar(record);
  }

  @ApiOperation(value = "deleteCalendar", notes = "Delete Calendar")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.DELETE,
      value = "/{calendarId}")
  public Boolean deleteCalendar(@PathVariable("calendarId") Integer calendarId)
      throws EcbBaseException {
    return calendarService.deleteCalendar(calendarId);
  }

  @ApiOperation(value = "copyCalendar", notes = "Copy Calendar")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST,
      value = "/{calendarId}")
  public LocalizedCalendar copyCalendar(@PathVariable("calendarId") Integer calendarId,
      @RequestBody LocalizedCalendar record) throws EcbBaseException {
    return calendarService.copyCalendar(record, calendarId);
  }

  @ApiOperation(value = "getCalendar",
      notes = "Retrieve a Calendar row that matches the supplied identifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/{calendarId}")
  public CalendarWithInUse getCalendar(@PathVariable("calendarId") Integer calendarId)
      throws EcbBaseException {
    return calendarService.getCalendar(calendarId);
  }

  @ApiOperation(value = "saveStandardDays", notes = "Save Standard Day Details")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT,
      value = "/standard-day")
  public List<ResponseModel> saveStandardCalendarDayDetails(
      @RequestBody StandardCalendarDayDtoList calendarDayDto) throws EcbBaseException {
    return calendarService.saveStandardCalendarDayDetails(calendarDayDto);
  }

  @ApiOperation(value = "findCalendarWithInUseInfo",
      notes = "Retrieve In Use priceable Items for calendarId")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/in-use-info/{calendarId}")
  public PaginatedList<CalendarInUseInfo> findCalendarWithInUseInfo(
      @PathVariable("calendarId") Integer calendarId,
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
    return calendarService.findInUsePriceableItems(calendarId, page, size, sort, query,
        descriptionLanguage, descriptionFilters, descriptionSort);
  }

  @ApiOperation(value = "getCalendarCodeMetadata", notes = "Retrieve code for type in calendar")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/calendar-code/")
  public Map<String, String> getCalendarCodeMetadata() throws EcbBaseException {
    return calendarService.getCalendarCodeMetadata();
  }

  @ApiOperation(value = "getStandardDays",
      notes = "Retrieve a Calendar row that matches the supplied identifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/standard-day/{calendarId}")
  public CalendarDetails getStandardDayDetails(@PathVariable("calendarId") Integer calendarId)
      throws EcbBaseException {
    return calendarService.getStandardDayDetails(calendarId);
  }

  @ApiOperation(value = "getHolidays",
      notes = "Retrieve a Calendar row that matches the supplied identifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/holiday/{calendarId}")
  public CalendarDetails getHolidayDetails(@PathVariable("calendarId") Integer calendarId)
      throws EcbBaseException {
    return calendarService.getHolidayDetails(calendarId);
  }

  @ApiOperation(value = "saveHolidays", notes = "calendar Holiday")
  @RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE,
      produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT,
      value = "/holiday/{calendarId}")
  public List<ResponseModel> calendarHolidaysBatch(
      @RequestBody CalendarHolidayDto calendarHolidayDto,
      @PathVariable("calendarId") Integer calendarId) throws EcbBaseException {
    return calendarService.calendarHolidaysBatch(calendarHolidayDto, calendarId);
  }

  @ApiOperation(value = "deleteHoliday", notes = "Delete Holiday")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.DELETE,
      value = "/holiday/{holidayId}")
  public Boolean deleteHoliday(@PathVariable("holidayId") Integer holidayId)
      throws EcbBaseException {
    return calendarService.deleteHoliday(holidayId);
  }

  @ApiOperation(value = "deleteCalendarPeriod", notes = "Delete calendar period")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.DELETE,
      value = "/period/{periodId}")
  public ResponseEntity<Boolean> deletePeriods(@PathVariable("periodId") Integer periodId)
      throws EcbBaseException {
    return new ResponseEntity<>(calendarService.deletePeriod(Collections.singleton(periodId)),
        HttpStatus.OK);
  }

  @ApiOperation(value = "deleteStdDayPeriod", notes = "Delete calendar period")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT,
      value = "/standard-day/period/")
  public ResponseEntity<Boolean> deleteStdDayPeriods(@RequestBody Set<Integer> periodId)
      throws EcbBaseException {
    return new ResponseEntity<>(calendarService.deletePeriod(periodId), HttpStatus.OK);
  }

  @ApiOperation(value = "updateCalendar", notes = "Update calendar row")
  @RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE,
      produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT,
      value = "/{calendarId}")
  public ResponseEntity<Calendar> updateCalendar(@RequestBody Calendar record,
      @PathVariable("calendarId") Integer calendarId) throws EcbBaseException {
    return calendarService.updateCalendar(record, calendarId);
  }
}
