package com.ericsson.ecb.ui.metraoffer.config;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class ECBStaticConfig extends WebMvcConfigurerAdapter {

  @Autowired
  private Environment env;

  private static final Logger LOGGER = LoggerFactory.getLogger(ECBStaticConfig.class);

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {

    String location = env.getProperty("ecb.static.resource.location");
    String handler = env.getProperty("ecb.static.resource.handler");

    if (StringUtils.isNoneBlank(location) && StringUtils.isNoneBlank(handler)) {

      LOGGER.info(
          "Externalization file path of git repo of METRAOFFER-EXT-DATA : {} with handler : {}",
          location, handler);

      registry.addResourceHandler(handler).addResourceLocations(location)
          .setCacheControl(CacheControl.noStore());

    } else {
      LOGGER.error(
          "Unable to find path of externalization/METRAOFFER-EXT-DATA with property - metraoffer-ext-data ");
    }
    super.addResourceHandlers(registry);
  }
}
