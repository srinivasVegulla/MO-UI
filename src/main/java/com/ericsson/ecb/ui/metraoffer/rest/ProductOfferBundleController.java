package com.ericsson.ecb.ui.metraoffer.rest;

import java.util.Collection;
import java.util.List;
import java.util.Map;
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

import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.PricelistMappingModel;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferBundleData;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferData;
import com.ericsson.ecb.ui.metraoffer.model.ResponseModel;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemInstanceService;
import com.ericsson.ecb.ui.metraoffer.service.ProductOfferBundleService;
import com.ericsson.ecb.ui.metraoffer.service.ProductOfferService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@Api(value = "ProductOfferBundle",
    description = "This table interacts with Product Offer Bundle rest end points ")
@RequestMapping(RestControllerUri.PRODUCT_OFFER_BUNDLE)
public class ProductOfferBundleController {

  @Autowired
  private ProductOfferBundleService productOfferBundle;

  @Autowired
  private ProductOfferService productOfferService;

  @Autowired
  private PriceableItemInstanceService priceableItemInstanceService;


  @ApiOperation(value = "getProductOfferBundle", notes = "Returns a ProductOffer Bundle")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "{bundleId}")
  public ProductOfferBundleData getProductOfferBundle(
      @PathVariable("bundleId") final Integer bundleId) throws EcbBaseException {
    return productOfferBundle.getProductOfferBundle(bundleId);
  }

  @ApiOperation(value = "getProductOffersInBundle", notes = "Returns a list of POs on bundleId")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/ProductOffers/{bundleId}")
  public Collection<ProductOfferData> getProductOffersInBundle(
      @PathVariable("bundleId") final Integer bundleId) throws EcbBaseException {
    return productOfferBundle.getProductOffersInBundle(bundleId);
  }

  @ApiOperation(value = "getPriceableItemsInBundle",
      notes = "Returns a Pricelist Mapping Model which contains all Priceable Items")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/PriceableItems/{bundleId}")
  public PricelistMappingModel getPriceableItemsInBundle(
      @PathVariable("bundleId") final Integer bundleId) throws EcbBaseException {
    return productOfferBundle.getPriceableItemsInOfferings(bundleId);
  }

  @ApiOperation(value = "addProductOffersToBundle",
      notes = "Adds a list of product offers to a bundle")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST,
      value = "/{bundleId}")
  public Boolean addProductOffersToBundle(@PathVariable("bundleId") Integer bundleId,
      @RequestBody List<Integer> offerIdList) throws EcbBaseException {
    return productOfferBundle.addProductOffersToBundle(bundleId, offerIdList);
  }


  @ApiOperation(value = "removeProductOfferFromBundle",
      notes = "Removes product offer from a bundle on a bundleId")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.DELETE,
      value = "/{bundleId}/offerId/{offerId}")
  public Boolean removeProductOfferFromBundle(@PathVariable("bundleId") final Integer bundleId,
      @PathVariable("offerId") final Integer offerId) throws EcbBaseException {
    return productOfferBundle.removeProductOfferFromBundle(bundleId, offerId);
  }


  @ApiOperation(value = "updatePoOptionality",
      notes = "Updates the optional field of a bundle entry")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT,
      value = "/{bundleId}/offerId/{offerId}/optionality/{optionality}")
  public Boolean updatePoOptionality(@PathVariable("bundleId") final Integer bundleId,
      @PathVariable("offerId") final Integer offerId,
      @PathVariable("optionality") final Boolean optionality) throws EcbBaseException {
    return productOfferBundle.updatePoOptionality(bundleId, offerId, optionality);
  }


  @ApiOperation(value = "addPriceableItemsToBundle",
      notes = "Updates the optional field of a bundle entry")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST,
      value = "/PriceableItems/{bundleId}")
  public List<ResponseModel> addPriceableItemsToBundle(
      @PathVariable("bundleId") final Integer bundleId, @RequestBody List<Integer> piTemplateIdList)
      throws EcbBaseException {
    return priceableItemInstanceService.addPriceableItemInstanceListToOffering(bundleId,
        piTemplateIdList);
  }


  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = {RequestMethod.DELETE},
      value = {"/PriceableItems/{bundleId}/pi-instance/{piInstanceId}"})
  @ApiOperation(value = "deletePiInstanceByInstanceIdFromOffering",
      notes = "Delete a PriceableItemInstance From Offering that matches the supplied identifier")
  public Boolean deletePiInstanceByInstanceIdFromOffering(
      @PathVariable("bundleId") Integer bundleId,
      @PathVariable("piInstanceId") Integer piInstanceId) throws EcbBaseException {
    return priceableItemInstanceService.deletePiInstanceByInstanceIdFromOffering(bundleId,
        piInstanceId);
  }

  @ApiOperation(value = "findProductOffersForBundle", notes = "find ProductOffers to add bundle")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/FindProductOffers/{bundleId}")
  public PaginatedList<ProductOfferData> findProductOffersForBundle(
      @PathVariable("bundleId") Integer bundleId,
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
    return productOfferBundle.findProductOffersForBundle(bundleId, page, size, sort, query,
        descriptionLanguage, descriptionFilters, descriptionSort);
  }

  @ApiOperation(value = "hideProductOffer",
      notes = "Hide/UnHide a ProductOfferBundle on that matches the supplied identifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT,
      value = "/{offerId}/hide")
  ResponseEntity<Boolean> hideProductOffer(@PathVariable("offerId") final Integer offerId,
      @RequestParam("hide") final Boolean hide) throws EcbBaseException {
    return productOfferService.hideProductOffer(offerId, hide);
  }

  @ApiOperation(value = "updateProductOfferBundle",
      notes = "update ProductOfferBundle with field wise")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT,
      value = "/update-fields/{offerId}")
  public Boolean updateProductOffer(@RequestBody ProductOfferBundleData record,
      @RequestParam(required = true, name = "fields") Set<String> fields,
      @PathVariable("offerId") Integer offerId) throws EcbBaseException {
    return productOfferBundle.updateProductOfferBundle(record, fields, offerId);
  }

  @ApiOperation(value = "updateSelectiveProductOfferBundle",
      notes = "selective update product offer bundle with old and new productofferbundles.")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT,
      value = "/selective-update/{bundleId}")
  public Boolean updateSelectiveProductOffer(@ApiParam(
      value = "RequestBody allows Map<String,ProductOfferBundleData>, this map size should be two only with keys 'oldEntity' and 'newEntity' ",
      required = true) @RequestBody Map<String, ProductOfferBundleData> recordsMap,
      @ApiParam(value = "fields updated in request body",
          required = true) @RequestParam(required = true, name = "fields") Set<String> fields,
      @PathVariable("bundleId") Integer bundleId) throws EcbBaseException {
    return productOfferBundle.updateSelectiveProductOffer(recordsMap, fields, bundleId);
  }
}
