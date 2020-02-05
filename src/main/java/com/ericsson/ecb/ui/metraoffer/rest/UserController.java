package com.ericsson.ecb.ui.metraoffer.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.User;
import com.ericsson.ecb.ui.metraoffer.service.UserService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@Api(value = "User",
    description = "This table interacts with customer services related to logged in user details rest end points ")
@RequestMapping(RestControllerUri.USER)
public class UserController {

  @Autowired
  private UserService userService;

  @ApiOperation(value = "getUserDetails",
      notes = "Retrieve a user partion details row that matches the supplied identifier")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/{loginName}")
  public User getUserDetails(@PathVariable("loginName") String loginName) throws EcbBaseException {
    return userService.getUserDetails(loginName);
  }

}
