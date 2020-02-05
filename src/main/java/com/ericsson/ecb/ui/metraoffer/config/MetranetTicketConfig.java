package com.ericsson.ecb.ui.metraoffer.config;

import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Configuration
@ConfigurationProperties("metranet.ticket.auth.request")
@Component
public class MetranetTicketConfig {

  private Map<String, String> params;

  private String assertionParam;

  private String signerKey;

  private String appName;

  private Integer jwtAssertionTimeToLive;

  public Map<String, String> getParams() {
    return params;
  }

  public void setParams(Map<String, String> params) {
    this.params = params;
  }

  public String getAssertionParam() {
    return assertionParam;
  }

  public void setAssertionParam(String assertionParam) {
    this.assertionParam = assertionParam;
  }

  public String getSignerKey() {
    return signerKey;
  }

  public void setSignerKey(String signerKey) {
    this.signerKey = signerKey;
  }

  public String getAppName() {
    return appName;
  }

  public void setAppName(String appName) {
    this.appName = appName;
  }

  public Integer getJwtAssertionTimeToLive() {
    return jwtAssertionTimeToLive;
  }

  public void setJwtAssertionTimeToLive(Integer jwtAssertionTimeToLive) {
    this.jwtAssertionTimeToLive = jwtAssertionTimeToLive;
  }



}
