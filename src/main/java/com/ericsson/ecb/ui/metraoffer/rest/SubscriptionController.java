package com.ericsson.ecb.ui.metraoffer.rest;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.customer.model.Subscription;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.service.SubscriptionService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@Api(value = "Subscription",
    description = "This interacts with product catalog product offer Subscription rest end points ")
@RequestMapping(RestControllerUri.SUBSCRIPTION)
public class SubscriptionController {

  @Autowired
  private SubscriptionService subscriptionService;

  /**
   * Retrieve a page of Subscription that match the supplied filter
   *
   * @param pageable the pagination settings to use
   * @param query the dynamic search criteria
   * @return the page of matching Collection of Subscription records
   */
  @ApiOperation(value = "findSubscription",
      notes = "Retrieve a page of Subscription that match the supplied filter")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
  public Collection<Subscription> findSubscription(
      @RequestParam(required = false, name = "page") Integer page,
      @RequestParam(required = false, name = "size") Integer size,
      @RequestParam(required = false, name = "sort") String[] sort,
      @RequestParam(required = false, name = "query") String query) throws EcbBaseException {
    return subscriptionService.findSubscription(page, size, sort, query);
  }


}
