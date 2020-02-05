package com.ericsson.ecb.ui.metraoffer.utils;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.scope.refresh.RefreshScopeRefreshedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.yaml.snakeyaml.Yaml;

import com.ericsson.ecb.common.config.ConfigResourceBuilder;
import com.ericsson.ecb.common.config.CustomConfigResourceReader;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.exception.EcbBaseRuntimeException;

@Component
@ConfigurationProperties("ecb.moFileName")
public class MoErrorMessagesUtil implements ApplicationListener<RefreshScopeRefreshedEvent> {

  private static final Logger _LOGGER = LoggerFactory.getLogger(MoErrorMessagesUtil.class);
  private static final Map<String, String> errorMessages = new HashMap<>();

  private String errorMessagesFileName;

  @Autowired
  private CustomConfigResourceReader cfgReader;

  @Autowired
  private ConfigResourceBuilder cfgResourceBuilder;

  public synchronized void setErrorMessagesFileName(String errorMessagesFileName) {
    this.errorMessagesFileName = errorMessagesFileName;
  }

  public synchronized String getErrorMessagesFileName() {
    return errorMessagesFileName;
  }

  public String getErrorMessages(String key) throws EcbBaseException {
    return getErrorMessages().get(key);
  }

  public String getErrorMessages(String key, Object... args) throws EcbBaseException {
    return String.format(getErrorMessages().get(key), args);
  }

  private Map<String, String> getErrorMessages() throws EcbBaseException {
    if (!errorMessages.isEmpty()) {
      return errorMessages;
    }
    synchronized (this) {
      if (errorMessages.isEmpty()) {
        loadErrorMessages();
      }
      return errorMessages;
    }
  }

  @SuppressWarnings("unchecked")
  private void loadErrorMessages() throws EcbBaseException {
    try {
      Yaml yaml = new Yaml();
      String a = cfgReader.readCfgResourceAsString(
          cfgResourceBuilder.getErrorMessagesResourcePath(getErrorMessagesFileName()));
      try (InputStream stream = new ByteArrayInputStream(a.getBytes(StandardCharsets.UTF_16))) {
        errorMessages.putAll(yaml.loadAs(stream, Map.class));
      }
    } catch (IOException e) {
      _LOGGER.error("Error reading the error messages file", e);
      throw new EcbBaseException(getErrorMessages("ERR_IN_READING_ERR_MESSAGES_FILE"), e);
    }
  }

  @Override
  public void onApplicationEvent(RefreshScopeRefreshedEvent event) {
    _LOGGER.info("Re-loading error messages from an external file ::");
    try {
      loadErrorMessages();
    } catch (EcbBaseException e) {
      throw new EcbBaseRuntimeException(e.getMessage(), e);
    }
    _LOGGER.info("Completed the loading of error messages ::");
  }
}

