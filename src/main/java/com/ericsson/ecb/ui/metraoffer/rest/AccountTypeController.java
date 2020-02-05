package com.ericsson.ecb.ui.metraoffer.rest;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.service.AccountTypeService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@Api(value = RestControllerUri.ACCOUNT_TYPE,
    description = "This controller produces the Account Type")
@RequestMapping(RestControllerUri.ACCOUNT_TYPE)
public class AccountTypeController {

  @Autowired
  private AccountTypeService accountTypeService;


  @ApiOperation(value = "findAccountTypeEligibility",
      notes = "Retrieve a AccountType row that matches the supplied identifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
  public Map<Integer, String> findAccountTypeEligibility() throws EcbBaseException {
    return accountTypeService.findAccountTypeEligibility();
  }


  @ApiOperation(value = "getAccountTypeEligibilityInProductOffer",
      notes = "Retrieve a AccountType row that matches the supplied identifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/{bundleId}")
  public Map<Integer, String> getAccountTypeEligibilityInProductOffer(
      @PathVariable("bundleId") Integer bundleId) throws EcbBaseException {
    return accountTypeService.getAccountTypeEligibilityInProductOffer(bundleId);
  }

  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.DELETE,
      value = "/{bundleId}")
  @ApiOperation(value = "removeAccountTypeEligibilityFromProductOffer",
      notes = "Removes the ProductOfferAccountTypeMapping row")
  public Boolean removeAccountTypeEligibilityFromProductOffer(
      @PathVariable("bundleId") Integer bundleId, @RequestBody List<Integer> typeIds)
      throws EcbBaseException {
    return accountTypeService.removeAccountTypeEligibilityFromProductOffer(bundleId, typeIds);
  }

  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST,
      value = "/{bundleId}")
  @ApiOperation(value = "addAccountTypeEligibilityToProductOffer",
      notes = "Creates the ProductOfferAccountTypeMapping row")
  public Boolean addAccountTypeEligibilityToProductOffer(@PathVariable("bundleId") Integer bundleId,
      @RequestBody List<Integer> typeIds) throws EcbBaseException {
    return accountTypeService.addAccountTypeEligibilityToProductOffer(bundleId, typeIds);
  }

  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT,
      value = "/{bundleId}")
  @ApiOperation(value = "refreshAccountTypeEligibilityProductOffer",
      notes = "Refresh the ProductOfferAccountTypeMapping row (delete all old ones and insert all new records)")
  public Boolean refreshAccountTypeEligibilityProductOffer(
      @PathVariable("bundleId") Integer bundleId, @RequestBody List<Integer> typeIds)
      throws EcbBaseException {
    return accountTypeService.refreshAccountTypeEligibilityProductOffer(bundleId, typeIds);
  }
}
