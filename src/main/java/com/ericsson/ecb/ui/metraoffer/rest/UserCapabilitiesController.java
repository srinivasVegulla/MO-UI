package com.ericsson.ecb.ui.metraoffer.rest;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.service.UserCapabilitiesService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@Api(value = RestControllerUri.USER_CAPABILITIES,
    description = "This controller provides the capabilties of the User")
@RequestMapping(RestControllerUri.USER_CAPABILITIES)
public class UserCapabilitiesController {

  @Autowired
  private UserCapabilitiesService userCapabiltiesService;

  /**
   * Retrieve the User Capabilities. If Capability is defined in system then it will return true or
   * false based an User assigned capabilities otherwise it will be null value
   * 
   * @param httpServletRequest - the HttpServletRequest instance having the logged-in User
   *        information
   * @throws Exception
   */
  @ApiOperation(value = "findUserCapabilities",
      notes = "Retrieve the User Capabilities that matches the supplied screen")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
  public Map<String, Map<String, Boolean>> findUserCapabilities(
      HttpServletRequest httpServletRequest) throws EcbBaseException {
    return userCapabiltiesService.findUserCapabilities(httpServletRequest);
  }

  /**
   * Retrieve the User Capabilities per feature. If Capability is defined in system then it will
   * return true or false based an User assigned capabilities otherwise it will be null value
   * 
   * @param httpServletRequest - the HttpServletRequest instance having the logged-in User
   *        information
   * @param entity - the Widget value of the requested capability
   * @param feature - the Feature value of the requested capability
   * 
   * @throws EcbBaseException
   */
  @ApiOperation(value = "findUserCapabilitiesPerFeature",
      notes = "Retrieve the User Capabilities that matches the supplied screen")
  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/feature")
  public Boolean findUserCapabilitiesPerFeature(HttpServletRequest httpServletRequest,
      @RequestParam("entity") String entity, @RequestParam("feature") String feature)
      throws EcbBaseException {
    return userCapabiltiesService.findUserCapabilitiesPerFeature(httpServletRequest, entity,
        feature);
  }
}
