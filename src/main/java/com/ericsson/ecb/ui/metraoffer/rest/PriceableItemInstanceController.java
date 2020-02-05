package com.ericsson.ecb.ui.metraoffer.rest;

import java.util.List;
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

import com.ericsson.ecb.catalog.model.PriceableItemInstanceDetails;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.ResponseModel;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemInstanceService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@Api(value = "PriceableItemInstanceDetails",
    description = "This controller is used to get Priceable items of a product offer")
@RequestMapping(RestControllerUri.PRICEABLE_ITEM_INSTANCE)
public class PriceableItemInstanceController {

  @Autowired
  private PriceableItemInstanceService priceableItemInstanceService;

  /**
   * Retrieve a PriceableItemInstanceDetails record that matches the supplied identifier
   *
   * @param offerId the id value of product offer
   * @param piInstanceId id value of priceable item
   * @return the matching PriceableItemInstanceDetails record
   */
  @ApiOperation(value = "getPriceableItemDetails",
      notes = "Retrieve a PriceableItemDetails that matches the supplied identifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/{offerId}/{piInstanceId}")
  public ResponseEntity<PriceableItemInstanceDetails> getPriceableItemInstanceDetails(
      @ApiParam(value = "", required = true) @PathVariable("offerId") final Integer offerId,
      @ApiParam(value = "",
          required = true) @PathVariable("piInstanceId") final Integer piInstanceId)
      throws EcbBaseException {
    return new ResponseEntity<>(
        priceableItemInstanceService.getPriceableItemInstance(offerId, piInstanceId),
        HttpStatus.OK);
  }

  /**
   * Delete PriceableItemInstance that matches the supplied identifier
   *
   * @param offerId the value for id_po
   * @param piInstanceId he value for id_pi_instance
   * @return the status of the delete operation
   */
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = {RequestMethod.DELETE},
      value = {"/{offerId}/pi-instance/{piInstanceId}"})
  @ApiOperation(value = "deletePriceableItemInstanceFromOffering",
      notes = "Delete a PriceableItemInstance from Offering that matches the supplied identifier")
  public Boolean deletePriceableItemInstanceFromOffering(@PathVariable("offerId") Integer offerId,
      @PathVariable("piInstanceId") Integer piInstanceId) throws EcbBaseException {
    return priceableItemInstanceService.deletePiInstanceByInstanceIdFromOffering(offerId,
        piInstanceId);
  }

  /**
   * Add PriceableItemInstance that matches the supplied identifier
   *
   * @param offerId
   * @param piTemplateId
   * @return boolean, status of adition
   * @throws EcbBaseException
   */
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST,
      value = "/{offerId}/pi-template/{piTemplateId}")
  @ApiOperation(value = "addPriceableItemInstanceToOffering",
      notes = "Adds a PriceableItemInstance to Offering that matches the supplied identifier")
  public Boolean addPriceableItemInstanceToOffering(@PathVariable("offerId") Integer offerId,
      @PathVariable("piTemplateId") Integer piTemplateId) throws EcbBaseException {
    return priceableItemInstanceService.addPriceableItemInstanceToOffering(offerId, piTemplateId);
  }

  /**
   * Add PriceableItemInstances that matches the supplied identifier
   *
   * @param record the data to insert
   * 
   * @return boolean, status
   * 
   */
  @ApiOperation(value = "addPriceableItemInstanceListToProductOffer",
      notes = "Adds list of PriceableItemInstance mapping that matches the supplied identifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST,
      value = "/{offerId}")
  public List<ResponseModel> addPriceableItemInstanceListToProductOffer(
      @PathVariable("offerId") Integer offerId, @RequestBody List<Integer> piTemplateIds)
      throws EcbBaseException {
    return priceableItemInstanceService.addPriceableItemInstanceListToOffering(offerId,
        piTemplateIds);
  }

  /**
   * Update PriceableItemInstance that matches the supplied identifier
   * 
   * @param priceableItemInstanceDetails
   * @param offerId
   * @param piInstanceId
   * @return updated record
   * @throws EcbBaseException
   */
  @ApiOperation(value = "updatePriceableItemInstance",
      notes = "Update PriceableItemInstance record")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT,
      value = "/{offerId}/pi-instance/{piInstanceId}")
  public Boolean updatePriceableItemInstance(
      @RequestBody PriceableItemInstanceDetails priceableItemInstanceDetails,
      @PathVariable("offerId") Integer offerId, @PathVariable("piInstanceId") Integer piInstanceId,
      @RequestParam("fields") Set<String> fields) throws EcbBaseException {
    return priceableItemInstanceService.updatePriceableItemInstance(priceableItemInstanceDetails,
        offerId, piInstanceId, fields);
  }

}
