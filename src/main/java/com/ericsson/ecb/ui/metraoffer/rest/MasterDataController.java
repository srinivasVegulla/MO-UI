package com.ericsson.ecb.ui.metraoffer.rest;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.EnumData;
import com.ericsson.ecb.customer.model.BusinessPartition;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.CurrenciesAndPartitions;
import com.ericsson.ecb.ui.metraoffer.service.MasterDataService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@Api(value = "MasterData",
    description = "This table interacts with ecb-api services to get master data")
@RequestMapping(RestControllerUri.MASTER_DATA)
public class MasterDataController {

  @Autowired
  private MasterDataService masterDataService;

  /**
   * Retrieves all currency types from system
   * 
   * @return currency types
   * @throws EcbBaseException
   */
  @ApiOperation(value = "findCurrencies", notes = "Retrieve Currencies")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "Currencies")
  public Collection<EnumData> findCurrencies() throws EcbBaseException {
    return masterDataService.getCurrencies();
  }

  /**
   * Retrieves all Partitions from system
   * 
   * @return Partitions
   * @throws EcbBaseException
   */
  @ApiOperation(value = "findPartitions", notes = "Retrieve Partitions")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/Partitions")
  public Collection<BusinessPartition> findPartitions() throws EcbBaseException {
    return masterDataService.getUserPartitions();
  }

  /**
   * Retrieves all currency types and Partitions from system
   * 
   * @return currency types and Partitions
   * @throws EcbBaseException
   */
  @ApiOperation(value = "findCurrenciesAndPartitions", notes = "Retrieve Currencies and Partitions")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, value = "/CurrenciesAndPartitions",
      method = RequestMethod.GET)
  public CurrenciesAndPartitions findCurrenciesAndPartitions() throws EcbBaseException {
    return masterDataService.findCurrenciesAndPartitions();
  }
}
