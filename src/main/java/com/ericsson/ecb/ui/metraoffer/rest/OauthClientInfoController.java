package com.ericsson.ecb.ui.metraoffer.rest;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.service.OauthClientInfoService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@Api(value = RestControllerUri.OAUTH_CLIENT_INFO,
    description = "This Controller provides OauthClient info of client_id, client_secret, etc.,")
@RequestMapping(RestControllerUri.OAUTH_CLIENT_INFO)
public class OauthClientInfoController {

  @Autowired
  private OauthClientInfoService oauthClientInfoService;

  @ApiOperation(value = "getLegacyClientInfo", notes = "Retrieve a Client Information of Oauth")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/legacy")
  public ResponseEntity<Map<String, String>> getLegacyClientInfo() throws EcbBaseException {
    return new ResponseEntity<>(oauthClientInfoService.getLegacyClientInfo(), HttpStatus.OK);
  }

  @ApiOperation(value = "getTicketClientInfo", notes = "Retrieve a Client Information of Oauth")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/ticket")
  public ResponseEntity<Map<String, String>> getTicketClientInfo() throws EcbBaseException {
    return new ResponseEntity<>(oauthClientInfoService.getTicketClientInfo(), HttpStatus.OK);
  }

  @ApiOperation(value = "getTrustedClientInfo", notes = "Retrieve a Client Information of Oauth")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/trusted")
  public ResponseEntity<Map<String, String>> getTrustedClientInfo() throws EcbBaseException {
    return new ResponseEntity<>(oauthClientInfoService.getTrustedClientInfo(), HttpStatus.OK);
  }


}
