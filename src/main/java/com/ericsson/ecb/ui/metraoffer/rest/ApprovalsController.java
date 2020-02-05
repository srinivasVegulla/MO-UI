package com.ericsson.ecb.ui.metraoffer.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ericsson.ecb.base.model.AuditAggregator;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.Approvals;
import com.ericsson.ecb.ui.metraoffer.model.OfferingViewChangeDetails;
import com.ericsson.ecb.ui.metraoffer.model.RatesViewChangeDetails;
import com.ericsson.ecb.ui.metraoffer.service.ApprovalsService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@Api(value = RestControllerUri.APPROVALS,
    description = "This Controller fetch the data of pending approvals of Product Offering and Rate Update.")
@RequestMapping(RestControllerUri.APPROVALS)
public class ApprovalsController {

  @Autowired
  private ApprovalsService service;

  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/offerings/pending-approvals/{offer-id}")
  @ApiOperation(value = "findOfferingUpdatePendingApprovals",
      notes = "Find Product Offering Update Pending Approvals")
  public PaginatedList<Approvals> findOfferingUpdatePendingApprovals(
      @PathVariable("offer-id") final Integer offerId,
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
    return service.findOfferingUpdatePendingApprovals(offerId, page, size, sort, query);
  }

  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/rates/pending-approvals/{schedule-id}")
  @ApiOperation(value = "findOfferingUpdatePendingApprovals",
      notes = "Find Rate Update Pending Approvals")
  public PaginatedList<Approvals> findRateUpdatePendingApprovals(
      @PathVariable("schedule-id") final Integer scheduleId,
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
    return service.findRateUpdatePendingApprovals(scheduleId, page, size, sort, query);
  }

  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/change-history/{approval-id}")
  @ApiOperation(value = "findApprovalChangeHistory",
      notes = "Find Product approvals change history")
  public PaginatedList<AuditAggregator> findApprovalChangeHistory(
      @PathVariable("approval-id") final Integer approvalId,
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
    return service.findApprovalChangeHistory(approvalId, page, size, sort, query);
  }

  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/offering/view-change-details/{approval-id}")
  @ApiOperation(value = "offeringViewChangeDetails",
      notes = "View change details of ofering pending approvals")
  public OfferingViewChangeDetails offeringViewChangeDetails(
      @PathVariable("approval-id") final Integer approvalId) throws EcbBaseException {
    return service.offeringViewChangeDetails(approvalId);
  }

  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/rates/view-change-details/{schedule-id}/{approval-id}")
  @ApiOperation(value = "ratesViewChangeDetails",
      notes = "View change details of rates pending approvals")
  public RatesViewChangeDetails ratesviewChangeDetails(
      @PathVariable("schedule-id") final Integer scheduleId,
      @PathVariable("approval-id") final Integer approvalId) throws EcbBaseException {
    return service.ratesViewChangeDetails(scheduleId, approvalId);
  }

  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST,
      value = "/approve-approvals")
  @ApiOperation(value = "approveApprovals", notes = "approve the list of approvals")
  public Boolean approveApprovals(@ApiParam(
      value = "RequestBody allows List of Approvals, on given list of approvals on success will get TRUE with 200 code, rest all cases will get failed approvls with Map<approvalId, errorMsg> ",
      required = true) @RequestBody List<Approvals> approvalsList) throws EcbBaseException {
    return service.approveApprovals(approvalsList);
  }

}
