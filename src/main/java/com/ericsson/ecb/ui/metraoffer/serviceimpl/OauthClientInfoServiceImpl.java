package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.common.OauthClientInfoCache;
import com.ericsson.ecb.ui.metraoffer.service.OauthClientInfoService;
import com.nimbusds.oauth2.sdk.GrantType;
import com.nimbusds.oauth2.sdk.client.ClientInformation;

@Service
public class OauthClientInfoServiceImpl implements OauthClientInfoService {

  private static final String LEGACY = "legacy";
  private static final String TRUSTED = "trusted";
  private static final String TICKET = "ticket";
  private static final String CLIENT_ID = "client_id";
  private static final String CLIENT_SECRET = "client_secret";
  private static final String GRANT_TYPE = "grant_type";
  private static final String SCOPE = "scope";

  @Autowired
  private OauthClientInfoCache oauthClientInfoCache;

  @Override
  public Map<String, String> getLegacyClientInfo() throws EcbBaseException {
    ClientInformation clientInformation = oauthClientInfoCache.getClientInfo(LEGACY);
    return getClientProps(clientInformation);
  }

  @Override
  public Map<String, String> getTrustedClientInfo() throws EcbBaseException {
    ClientInformation clientInformation = oauthClientInfoCache.getClientInfo(TRUSTED);
    return getClientProps(clientInformation);
  }

  @Override
  public Map<String, String> getTicketClientInfo() throws EcbBaseException {
    ClientInformation clientInformation = oauthClientInfoCache.getClientInfo(TICKET);
    return getClientProps(clientInformation);

  }

  private Map<String, String> getClientProps(ClientInformation clientInfo) {
    Map<String, String> infoMap = new HashMap<>();
    if (clientInfo != null) {
      if (clientInfo.getID() != null) {
        infoMap.put(CLIENT_ID, clientInfo.getID().getValue());
      }
      if (clientInfo.getSecret() != null) {
        infoMap.put(CLIENT_SECRET, clientInfo.getSecret().getValue());
      }
      if (clientInfo.getMetadata() != null) {
        Set<GrantType> grantTypes = clientInfo.getMetadata().getGrantTypes();
        grantTypes.forEach(grantType -> {
          if (GrantType.JWT_BEARER.toString().equals(grantType.getValue().trim())) {
            infoMap.put(GRANT_TYPE, GrantType.JWT_BEARER.getValue());
          } else if (GrantType.PASSWORD.toString().equals(grantType.getValue().trim())) {
            infoMap.put(GRANT_TYPE, GrantType.PASSWORD.getValue());
          } else if (GrantType.AUTHORIZATION_CODE.toString().equals(grantType.getValue().trim())) {
            infoMap.put(GRANT_TYPE, GrantType.AUTHORIZATION_CODE.getValue());
          } else if (GrantType.REFRESH_TOKEN.toString().equals(grantType.getValue().trim())) {
            infoMap.put(GRANT_TYPE, GrantType.REFRESH_TOKEN.getValue());
          }
        });
        infoMap.put(SCOPE, clientInfo.getMetadata().getScope().toString());
      }
    }
    return infoMap;
  }
}
