package com.ericsson.ecb.ui.metraoffer.utils;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ericsson.ecb.common.authz.Caps;
import com.ericsson.ecb.common.exception.EcbBaseException;

@Component
public class CapabilitiesUtil {

  @Autowired
  private Caps caps;

  public Map<String, Map<String, String>> getUICapabilities() throws EcbBaseException {
    Map<String, String> uiCacheCapabilities = caps.getUiCapabilities();
    Map<String, Map<String, String>> uiCapabilities = new HashMap<>();
    uiCacheCapabilities.forEach((k, v) -> {
      String[] keys = k.split("\\.");
      if (uiCapabilities.containsKey(keys[0])) {
        uiCapabilities.get(keys[0]).put(keys[1], v);
      } else {
        Map<String, String> tmpMap = new HashMap<>();
        tmpMap.put(keys[1], v);
        uiCapabilities.put(keys[0], tmpMap);
      }
    });
    return uiCapabilities;
  }

  @PostConstruct
  public void readCapabilities() throws EcbBaseException {
    caps.readCapabilities();
  }

}
