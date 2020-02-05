package com.ericsson.ecb.ui.metraoffer.rest;

import java.sql.Timestamp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ericsson.ecb.ui.metraoffer.config.ApplicationListener;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@Api(value = RestControllerUri.ECB_UI_MO, description = "")
@RequestMapping(RestControllerUri.ECB_UI_MO)
public class EcbUiMoController {

  @Autowired
  private ApplicationListener applicationListener;

  @ApiOperation(value = "ecbUiAppRefreh",
      notes = "Refresh endpoints for all Metraoffer API services from Eureka Dashboard")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
  public ResponseEntity<String> ecbAppRefresh() {
    applicationListener.ecbAppRefresh();
    Timestamp timestamp = new Timestamp(System.currentTimeMillis());
    return new ResponseEntity<>(timestamp.toString(), HttpStatus.OK);
  }
}
