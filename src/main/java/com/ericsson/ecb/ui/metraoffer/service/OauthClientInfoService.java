package com.ericsson.ecb.ui.metraoffer.service;

import java.util.Map;

import com.ericsson.ecb.common.exception.EcbBaseException;

public interface OauthClientInfoService {

  public Map<String, String> getLegacyClientInfo() throws EcbBaseException;

  public Map<String, String> getTicketClientInfo() throws EcbBaseException;

  public Map<String, String> getTrustedClientInfo() throws EcbBaseException;

}
