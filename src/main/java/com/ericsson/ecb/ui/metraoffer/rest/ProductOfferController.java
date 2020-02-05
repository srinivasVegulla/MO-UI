package com.ericsson.ecb.ui.metraoffer.rest;

import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ericsson.ecb.catalog.model.LocalizedProductOffer;
import com.ericsson.ecb.catalog.model.ProductOffer;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferData;
import com.ericsson.ecb.ui.metraoffer.service.ProductOfferService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@Api(value = "ProductOffer",
    description = "This table interacts with product catalog product offer rest end points ")
@RequestMapping(RestControllerUri.PRODUCT_OFFER)
public class ProductOfferController {

  @Autowired
  private ProductOfferService productOfferService;

  /**
   * Retrieve a Product offer row with the supplied identifier passing to rest API
   * 
   * @param offerId
   * @return the matching ProductOffer record
   * @throws EcbBaseException
   */
  @ApiOperation(value = "getProductOffer",
      notes = "Retrieve a ProductOffer row that matches the supplied identifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/{offerId}")
  public ProductOfferData getProductOffer(@PathVariable("offerId") Integer offerId)
      throws EcbBaseException {
    return productOfferService.getProductOffer(offerId);
  }

  /**
   * Retrieve Product Offer rows that match the supplied filter
   *
   * @param page the number of the page
   * @param size the number of records per page
   * @param sort the sort direction to use
   * @param query the filter criteria to use
   * @return the page of matching ProductOfferData records
   * @throws EcbBaseException
   */
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
  public PaginatedList<ProductOfferData> findProductOffer(
      @RequestParam(required = false, name = "page") Integer page,
      @RequestParam(required = false, name = "size") Integer size,
      @RequestParam(required = false, name = "sort") String[] sort,
      @RequestParam(required = false, name = "query") String query,
      @RequestParam(required = false, name = "hidden") Boolean hidden,
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
    return productOfferService.findProductOffer(page, size, sort, query, hidden,
        descriptionLanguage, descriptionFilters, descriptionSort);
  }

  /**
   * Retrieves Product Offer list for Packaging workspace with and without available dates
   * seperately.
   *
   * @param pageable the pagination settings to use
   * @param query the dynamic search criteria
   * @return the page of matching ProductOffer records
   * @throws EcbBaseException
   */
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/WithNoAvailableDates")
  public PaginatedList<ProductOfferData> findPOWithNoAvailableDates(
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
    return productOfferService.findPOWithNoAvailableDates(page, size, sort, query,
        descriptionLanguage, descriptionFilters, descriptionSort);
  }

  /**
   * Retrieves Product Offer list for Packaging workspace with and without available dates
   * seperately.
   *
   * @param pageable the pagination settings to use
   * @param query the dynamic search criteria
   * @return the page of matching ProductOffer records
   * @throws EcbBaseException
   */
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/WithAvailableDates")
  public PaginatedList<ProductOfferData> findPOWithAvailableDates(
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
    return productOfferService.findPOWithAvailableDates(page, size, sort, query,
        descriptionLanguage, descriptionFilters, descriptionSort);
  }

  /**
   * Insert product offer record into database by passing rest API
   *
   * @param record the data to insert
   * 
   * @return ProductOfferData
   * @throws EcbBaseException
   * 
   */
  @ApiOperation(value = "createProductOffer", notes = "Create Product Offer")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
  public ProductOfferData createProductOffer(@RequestBody LocalizedProductOffer productOffer)
      throws EcbBaseException {
    return productOfferService.createProductOffer(productOffer);
  }

  /**
   * Delete a Product offer row with the supplied identifier passing to rest API
   *
   * @param offerId of type Integer
   * @return boolean of the status
   * @throws EcbBaseException
   */
  @ApiOperation(value = "deleteProductOffer", notes = "Delete Product Offer")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.DELETE,
      value = "/{offerId}")
  public ResponseEntity<Boolean> deleteProductOffer(@PathVariable("offerId") Integer offerId)
      throws EcbBaseException {
    return productOfferService.deleteProductOffer(offerId);
  }

  /**
   * Update ProductOffer Hide or UnHide that match the offer Id
   *
   * @param offerId the value for product offer
   * @param hide the value for hide/show
   * @return {@code Boolean} the flag, true/false
   */
  @ApiOperation(value = "hideProductOffer",
      notes = "Hide/UnHide Product offer on that matches the supplied identifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT,
      value = "/{offerId}/hide")
  ResponseEntity<Boolean> hideProductOffer(@PathVariable("offerId") final Integer offerId,
      @RequestParam("hide") final Boolean hide) throws EcbBaseException {
    return productOfferService.hideProductOffer(offerId, hide);
  }

  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/Locations/{offerId}")
  @ApiOperation(value = "getPoUsedLocations", notes = "fetch Product offer locations where exists")
  public PaginatedList<ProductOfferData> getPoUsedLocations(
      @PathVariable("offerId") Integer offerId,
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
    return productOfferService.getPoUsedLocations(offerId, page, size, sort, query,
        descriptionLanguage, descriptionFilters, descriptionSort);
  }

  @ApiOperation(value = "copyProductOffer", notes = "Copy Product Offer")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST,
      value = "/{offerId}")
  public ProductOffer copyProductOffer(@PathVariable("offerId") Integer offerId,
      @RequestBody LocalizedProductOffer productOffer) throws EcbBaseException {
    return productOfferService.copyProductOffer(offerId, productOffer);
  }

  @ApiOperation(value = "checkConfiguration", notes = "")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/checkConfig/{offerId}")
  public Boolean checkConfiguration(@PathVariable("offerId") Integer offerId)
      throws EcbBaseException {
    return productOfferService.checkConfiguration(offerId);
  }

  @RequestMapping(value = "/exportToCsv", method = RequestMethod.POST)
  public void exportToCsv(HttpServletResponse response,
      @RequestParam(required = false, name = "sort") String[] sort,
      @RequestParam(required = false, name = "query") String query) throws Exception {
    productOfferService.exportToCsv(response, sort, query);
  }

  @ApiOperation(value = "updateProductOffer", notes = "update Productoffer with fields wise")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT,
      value = "/update-fields/{offerId}")
  public Boolean updateProductOffer(@RequestBody ProductOfferData record,
      @RequestParam(required = true, name = "fields") Set<String> fields,
      @PathVariable("offerId") Integer offerId) throws EcbBaseException {
    return productOfferService.updateProductOffer(record, fields, offerId);
  }

  @ApiOperation(value = "updateSelectiveProductOffer",
      notes = "selective update product offer with old and new productoffers.")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT,
      value = "/selective-update/{offerId}")
  public Boolean updateSelectiveProductOffer(@ApiParam(
      value = "RequestBody allows Map<String,ProductOfferData>, this map size should be two only with keys 'oldEntity' and 'newEntity' ",
      required = true) @RequestBody Map<String, ProductOfferData> recordsMap,
      @ApiParam(value = "fields updated in request body",
          required = true) @RequestParam(required = true, name = "fields") Set<String> fields,
      @PathVariable("offerId") Integer offerId) throws EcbBaseException {
    return productOfferService.updateSelectiveProductOffer(recordsMap, fields, offerId);
  }
}

