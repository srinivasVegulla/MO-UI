package com.ericsson.ecb.ui.metraoffer.service;

public interface MetranetTicketService {
  public Object getAccessWithEncryptedJwt(String ticket, Boolean tokenExpired) throws Exception;
}
