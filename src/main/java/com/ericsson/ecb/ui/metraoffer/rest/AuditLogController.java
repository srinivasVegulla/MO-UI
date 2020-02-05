package com.ericsson.ecb.ui.metraoffer.rest;

import java.io.IOException;
import java.time.OffsetDateTime;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.AuditSummary;
import com.ericsson.ecb.ui.metraoffer.model.ChunkRule;
import com.ericsson.ecb.ui.metraoffer.model.RateChanges;
import com.ericsson.ecb.ui.metraoffer.service.AuditLogService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@Api(value = RestControllerUri.AUDIT_LOG,
    description = "This table interacts with AuditLog rest end points ")
@RequestMapping(RestControllerUri.AUDIT_LOG)
public class AuditLogController {

  @Autowired
  private AuditLogService auditLogService;

  @ApiOperation(value = "findAuditSummary",
      notes = "Retrieve a page of Audit rows that match the supplied filter")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
  public PaginatedList<AuditSummary> findAuditSummary(
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
    return auditLogService.findAuditSummary(page, size, sort, query);
  }

  @ApiOperation(value = "findRatesAuditSummary",
      notes = "Retrieve a page of Audit rows that match the supplied filter")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/param-table/{paramtableId}/template/{templateId}/pricelist/{pricelistId}")
  public PaginatedList<AuditSummary> findRatesAuditSummary(
      @PathVariable("paramtableId") Integer paramtableId,
      @PathVariable("templateId") Integer templateId,
      @PathVariable("pricelistId") Integer pricelistId,
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
    return auditLogService.findRatesAuditSummary(paramtableId, templateId, pricelistId, page, size,
        sort, query);
  }

  @ApiOperation(value = "findRateChanges",
      notes = "Retrieve a page of Audit rows that match the supplied filter")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/rate-changes/{schedule-id}")
  public RateChanges findRateChanges(@PathVariable("schedule-id") Integer scheduleId,
      @RequestParam(required = false,
          name = "scheduleAndMetadataInfo") Boolean scheduleAndMetadataInfo)
      throws EcbBaseException {
    return auditLogService.findRateChanges(scheduleId, scheduleAndMetadataInfo);
  }

  @ApiOperation(value = "diffRuleSet",
      notes = "Retrieve a page of Audit rows that match the supplied filter")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/rate-changes/{schedule-id}/{active-date}")
  public PaginatedList<ChunkRule> diffRuleSet(@PathVariable("schedule-id") Integer scheduleId,
      @ApiParam(value = "The date value in offsetdatetime format, EX: 2017-11-14T18:47:25.419Z",
          required = true) @PathVariable("active-date") @DateTimeFormat(
              iso = ISO.DATE_TIME) final OffsetDateTime activeDate,

      @RequestParam(required = false, name = "page") Integer page,
      @ApiParam(value = "Number of records per page",
          required = false) @RequestParam(required = false, name = "size") Integer size)
      throws EcbBaseException {
    return auditLogService.diffRuleSet(scheduleId, activeDate, page, size);
  }

  @RequestMapping(value = "/exportToCsv", method = RequestMethod.POST)
  public void exportToCsv(HttpServletResponse response,
      @RequestParam(required = false, name = "paramtableId") Integer paramtableId,
      @RequestParam(required = false, name = "templateId") Integer templateId,
      @RequestParam(required = false, name = "pricelistId") Integer pricelistId,
      @ApiParam(value = "Results page you want to retrieve (1..N)",
          required = false) @RequestParam(required = false, name = "page") Integer page,
      @ApiParam(value = "Number of records per page",
          required = false) @RequestParam(required = false, name = "size") Integer size,
      @ApiParam(
          value = "Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
          required = false) @RequestParam(required = false, name = "sort") String[] sort,
      @ApiParam(value = "Filter criteria to apply (e.g., \"accountId==123\")",
          required = false) @RequestParam(required = false, name = "query") String query)
      throws EcbBaseException, IOException {
    auditLogService.exportToCsv(response, paramtableId, templateId, pricelistId, page, size, sort,
        query);
  }

}
