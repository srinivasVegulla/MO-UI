package com.ericsson.ecb.ui.metraoffer.common;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ericsson.ecb.oauth2.service.Context;
import com.ericsson.ecb.oidc.service.RpClientRegistrationService;
import com.nimbusds.oauth2.sdk.client.ClientInformation;

@Service
public class OauthClientInfoCache {

  private static Map<String, ClientInformation> clientDetailMap = new HashMap<>();

  private static final String TILDE = "~";

  private static final String PIPE = "|";

  @Autowired
  private Context ctx;

  @Autowired
  private RpClientRegistrationService rpClientRegistrationService;

  public ClientInformation getClientInfo(String type) {
    ClientInformation clientInformation = null;

    String appId = ctx.getAppMark() == null ? null
        : UUID.nameUUIDFromBytes(ctx.getAppMark().getBytes(StandardCharsets.UTF_8)).toString();

    String dbsId = ctx.getDbsMark() == null ? null
        : UUID.nameUUIDFromBytes(ctx.getDbsMark().getBytes(StandardCharsets.UTF_8)).toString();
    String name = "{" + ctx.getAppName() + TILDE + type + "}";

    if (appId != null && dbsId != null && type != null) {
      String key = appId + PIPE + dbsId + PIPE + name;
      clientInformation = clientDetailMap.get(key);
      if (clientInformation == null) {
        clientInformation = loadClientInfo(name, appId, dbsId);
        if (clientInformation != null)
          clientDetailMap.put(key, clientInformation);
      }
    }
    return clientInformation;
  }

  private ClientInformation loadClientInfo(String name, String appId, String dbsId) {
    return rpClientRegistrationService.read(appId, dbsId, name);
  }

}
