package com.ericsson.ecb.ui.metraoffer.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.metadata.model.DefineService;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.service.MetadataConfigService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@Api(value = "MetadataConfig",
    description = "This table interacts with product catalog Metadata Config rest end points ")
@RequestMapping(RestControllerUri.META_DATA_CONFIG)
public class MetadataConfigController {

  @Autowired
  private MetadataConfigService metadataConfigService;

  @ApiOperation(value = "getExtendedPropsMetadata",
      notes = "Retrieve a EpMap row that matches the supplied identifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/extended-props/{propertyKind}")
  public ResponseEntity<DefineService> getExtendedPropsMetadata(
      @ApiParam(value = "propertyKind",
          required = true) @PathVariable("propertyKind") final PropertyKind propertyKind)
      throws EcbBaseException {
    return new ResponseEntity<>(metadataConfigService.getExtendedPropsMetadata(propertyKind),
        HttpStatus.OK);
  }

}
