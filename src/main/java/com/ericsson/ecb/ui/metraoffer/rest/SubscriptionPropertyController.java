package com.ericsson.ecb.ui.metraoffer.rest;

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

import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferData;
import com.ericsson.ecb.ui.metraoffer.model.ResponseModel;
import com.ericsson.ecb.ui.metraoffer.model.SubscriptionProperty;
import com.ericsson.ecb.ui.metraoffer.service.SubscriptionPropertyService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@Api(value = "SubscriptionProperty",
    description = "This controller interact with Subscription Properties")
@RequestMapping(RestControllerUri.SUBSCRIPTION_PROPERTY)
public class SubscriptionPropertyController {

  @Autowired
  private SubscriptionPropertyService subscriptionPropertyService;

  @ApiOperation(value = "findSubscriptionProperty",
      notes = "Retrieve a Subscription Properties rows that matches the supplied identifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
  public PaginatedList<SubscriptionProperty> findSubscriptionProperty(
      @ApiParam(value = "Results page you want to retrieve (1..N)",
          required = false) @RequestParam(required = false, name = "page") Integer page,
      @ApiParam(value = "Number of records per page",
          required = false) @RequestParam(required = false, name = "size") Integer size,
      @ApiParam(
          value = "Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
          required = false) @RequestParam(required = false, name = "sort") String[] sort,
      @ApiParam(value = "Filter criteria to apply (e.g., \"specId==123\")",
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
    return subscriptionPropertyService.findSubscriptionProperty(page, size, sort, query,
        descriptionLanguage, descriptionFilters, descriptionSort);
  }

  @ApiOperation(value = "findSubscriptionPropertyType",
      notes = "Retrieve a Subscription Property types")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/Type")
  public Map<Integer, String> findSubscriptionPropertyType() {
    return subscriptionPropertyService.findSubscriptionPropertyType();
  }

  @ApiOperation(value = "findEditingForSubscriptionFilter",
      notes = "Retrieve values for EditingForSubscriptionFilter")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/EditingSubscriptionFilter")
  public Map<String, String> findEditingForSubscriptionFilter() {
    return subscriptionPropertyService.findEditingForSubscriptionFilter();
  }

  @ApiOperation(value = "findInUseOfferings",
      notes = "Retrieve a Product offer rows that matches the supplied identifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/InUseOfferings/subscription-property/{specId}")
  public PaginatedList<ProductOfferData> findInUseOfferings(@PathVariable("specId") Integer specId,
      @ApiParam(value = "Results page you want to retrieve (1..N)",
          required = false) @RequestParam(required = false, name = "page") Integer page,
      @ApiParam(value = "Number of records per page",
          required = false) @RequestParam(required = false, name = "size") Integer size,
      @ApiParam(
          value = "Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
          required = false) @RequestParam(required = false, name = "sort") String[] sort,
      @ApiParam(value = "Filter criteria to apply (e.g., \"specId==123\")",
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
    return subscriptionPropertyService.findInUseOfferings(specId, page, size, sort, query,
        descriptionLanguage, descriptionFilters, descriptionSort);
  }

  @ApiOperation(value = "getSubscriptionPropertyForEdit",
      notes = "Retrieve a Subscription Property default values for edit")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/subscription-property/details/{specId}")
  public SubscriptionProperty getSubscriptionPropertyForEdit(@PathVariable("specId") Integer specId)
      throws EcbBaseException {
    return subscriptionPropertyService.getSubscriptionPropertyForEdit(specId);
  }


  @ApiOperation(value = "getSubscriptionProperty",
      notes = "Retrieve a Subscription Property default values for edit")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/subscription-property/{specId}")
  public SubscriptionProperty getSubscriptionProperty(@PathVariable("specId") Integer specId)
      throws EcbBaseException {
    return subscriptionPropertyService.getSubscriptionProperty(specId);
  }

  @ApiOperation(value = "createSubscriptionProperty", notes = "create a Subscription Property")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
  public Boolean createSubscriptionProperty(@ApiParam(
      value = "Create Subscription Property for editing for subscription code, will have to pass \"editingForSubscriptionCode\" and thsoe code are"
          + "\"ER - Editable & Required\", \"ENR - Editable(Not Required)\" and \"RO - Read-Onlly\" ",
      required = true) @RequestBody SubscriptionProperty record) throws EcbBaseException {
    return subscriptionPropertyService.createSubscriptionProperty(record);
  }

  @ApiOperation(value = "findSubscriptionPropertyForOfferings",
      notes = "Retrieve a page of SpecificationCharacteristic rows that match the supplied filter")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/{offerId}")
  public ResponseEntity<PaginatedList<SubscriptionProperty>> findSubscriptionPropertyForOfferings(
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
          required = false) @RequestParam(required = false, name = "dSort") String descriptionSort,
      @ApiParam(value = "This parameter is used to exlude already added specs",
          required = true) @PathVariable("offerId") final Integer offerId)
      throws EcbBaseException {
    return new ResponseEntity<>(
        subscriptionPropertyService.findSubscriptionPropertyForOfferings(page, size, sort, query,
            descriptionLanguage, descriptionFilters, descriptionSort, offerId),
        HttpStatus.OK);
  }

  @ApiOperation(value = "addSubscriptionPropertyToOfferings",
      notes = "Adds Spcification characteristics to product offer based on supplied offer id and specIds")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST,
      value = "/addSubscriptionPropertyToOfferings/product-offer/{offerId}")
  public List<ResponseModel> addSubscriptionPropertyToOfferings(
      @PathVariable("offerId") Integer offerId, @RequestBody List<Integer> specIds)
      throws EcbBaseException {
    return subscriptionPropertyService.addSubscriptionPropertyToOfferings(offerId, specIds);
  }

  @ApiOperation(value = "findProductOfferSubscriptionProperties",
      notes = "Retrives Subscription Properties based on supplied product offerid")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/product-offer/{offerId}")
  PaginatedList<SubscriptionProperty> findProductOfferSubscriptionProperties(
      @PathVariable("offerId") final Integer offerId,
      @RequestParam(required = false, name = "page") final Integer page,
      @RequestParam(required = false, name = "size") final Integer size,
      @RequestParam(required = false, name = "sort") final String[] sort,
      @RequestParam(required = false, name = "query") final String query) throws EcbBaseException {
    return subscriptionPropertyService.findProductOfferSubscriptionProperties(page, size, sort,
        query, offerId);
  }

  @ApiOperation(value = "deleteSubscriptionProperty",
      notes = "Delete Subscription Property based on supplied specId")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.DELETE,
      value = "/subscription-property/{specId}")
  ResponseEntity<Boolean> deleteSubscriptionProperty(@PathVariable("specId") final Integer specId)
      throws EcbBaseException {
    return subscriptionPropertyService.deleteSubscriptionProperty(specId);
  }

  @ApiOperation(value = "removeSubscriptionPropertyFromProductOffer",
      notes = "Remove Subscription Property of product offer based on supplied offerId and specId")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.DELETE,
      value = "/product-offer/{offerId}/subscription-property/{specId}")
  ResponseEntity<Boolean> removeSubscriptionPropertyFromProductOffer(
      @PathVariable("offerId") final Integer offerId, @PathVariable("specId") final Integer specId)
      throws EcbBaseException {
    return subscriptionPropertyService.removeSubscriptionPropertyFromProductOffer(offerId, specId);
  }

  @ApiOperation(value = "updateSubscriptionProperty",
      notes = "Update Subscription Property based on supplied specId id")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT,
      value = "/{specId}")
  public Boolean updateSubscriptionProperty(@RequestBody SubscriptionProperty record,
      @RequestParam(required = true, name = "fields") Set<String> fields,
      @PathVariable("specId") Integer specId) throws EcbBaseException {
    return subscriptionPropertyService.updateSubscriptionProperty(record, fields, specId);
  }

}
