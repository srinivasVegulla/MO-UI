package com.ericsson.ecb.ui.metraoffer.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.service.MetranetTicketService;

import io.swagger.annotations.Api;

@RestController
@Api(value = "MetranetTicket",
    description = "This controller is used to work with ticket based authentication from metranet to metraoffer module.")
@RequestMapping(RestControllerUri.METRANET_TICKET)
public class MetranetTicketController {

  @Autowired
  private MetranetTicketService metranetTicketService;

  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET,
      value = "/encrypted-jwt")
  public Object getAccessWithEncryptedJwt(@RequestParam("ticket") String ticket,
      @RequestParam(required = false, name = "tokenExpired") Boolean tokenExpired)
      throws Exception {
    return metranetTicketService.getAccessWithEncryptedJwt(ticket, tokenExpired);
  }

}
