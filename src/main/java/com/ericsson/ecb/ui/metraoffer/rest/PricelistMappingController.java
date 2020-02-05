package com.ericsson.ecb.ui.metraoffer.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ericsson.ecb.catalog.model.PricelistMapping;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.PricelistMappingModel;
import com.ericsson.ecb.ui.metraoffer.service.PricelistMappingService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@Api(value = "PricelistMapping",
    description = "This table interacts with product catalog pricelist mapping rest end points ")
@RequestMapping(RestControllerUri.PRICELIST_MAPPING)
public class PricelistMappingController {

  @Autowired
  private PricelistMappingService pricelistMappingService;

  /**
   * Retrieve a ProductOffer Pricelist Mappings
   *
   * @param offerId the offer id
   * @param piInstanceParentId the priceable Item Instance Parent Id
   * @return the PricelistMappingModel
   */
  @ApiOperation(value = "getPricelistMappingByPiInstanceParentId",
      notes = "Retrieve a ProductOffer Pricelist Mappings that matches the supplied identifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/{offerId}/pi-instanceParentId/{piInstanceParentId}")
  public PricelistMappingModel getPricelistMappingByPiInstanceId(
      @PathVariable("offerId") Integer offerId,
      @PathVariable("piInstanceParentId") Integer piInstanceParentId) throws EcbBaseException {
    return pricelistMappingService.getPricelistMappingByPiInstanceParentId(offerId,
        piInstanceParentId);
  }

  /**
   * Retrieve a ProductOffer Pricelist Mappings
   *
   * @param offerId the offer id
   * @return the response model
   * @throws EcbBaseException
   */
  @ApiOperation(value = "getPricelistMappingByOfferId",
      notes = "Retrieve a ProductOffer Pricelist Mappings that matches the supplied identifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/{offerId}")
  public PricelistMappingModel getPricelistMappingByOfferId(
      @PathVariable("offerId") Integer offerId) throws EcbBaseException {
    return pricelistMappingService.getPricelistMappingByOfferId(offerId);
  }

  /**
   * Updates pricelist for priceable item parameter table.
   *
   * @param record the data to insert
   * @return the count of inserted PricelistMapping records
   */
  @ApiOperation(value = "updatePricelistMapping", notes = "Update a PricelistMapping row")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT)
  public ResponseEntity<PricelistMapping> updatePricelistMapping(
      @RequestBody PricelistMapping record) throws EcbBaseException {
    return new ResponseEntity<>(pricelistMappingService.updatePricelistMapping(record),
        HttpStatus.OK);
  }

}
