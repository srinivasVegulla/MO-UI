package com.ericsson.ecb.ui.metraoffer.config;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.zip.GZIPInputStream;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.netflix.zuul.filters.post.SendResponseFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.netflix.zuul.context.RequestContext;

import springfox.documentation.swagger2.web.Swagger2Controller;

/**
 * Zuul filter to rewrite micro-services Swagger URL Base Path.
 */
public class SwaggerBasePathRewritingFilter extends SendResponseFilter {

  private final Logger log = LoggerFactory.getLogger(SwaggerBasePathRewritingFilter.class);

  private ObjectMapper mapper = new ObjectMapper();

  @Override
  public String filterType() {
    return "post";
  }

  @Override
  public int filterOrder() {
    return 100;
  }

  /**
   * Filter requests to micro-services Swagger docs.
   */
  @Override
  public boolean shouldFilter() {
    return RequestContext.getCurrentContext().getRequest().getRequestURI()
        .endsWith(Swagger2Controller.DEFAULT_URL);
  }

  @Override
  public Object run() {
    RequestContext context = RequestContext.getCurrentContext();

    if (!context.getResponseGZipped()) {
      context.getResponse().setCharacterEncoding("UTF-8");
    }

    String rewrittenResponse = rewriteBasePath(context);
    context.setResponseBody(rewrittenResponse);
    return null;
  }

  @SuppressWarnings("unchecked")
  private String rewriteBasePath(RequestContext context) {
    InputStream responseDataStream = context.getResponseDataStream();
    String requestUri = RequestContext.getCurrentContext().getRequest().getRequestURI();
    try {
      if (context.getResponseGZipped()) {
        responseDataStream = new GZIPInputStream(context.getResponseDataStream());
      }
      String response = IOUtils.toString(responseDataStream, StandardCharsets.UTF_8);
      if (response != null) {
        LinkedHashMap<String, Object> map = this.mapper.readValue(response, LinkedHashMap.class);

        String basePath = requestUri.replace(Swagger2Controller.DEFAULT_URL, "");
        map.put("basePath", basePath);
        log.debug("Swagger-docs: rewritten Base URL with correct micro-service route: {}",
            basePath);
        Object securityDefs = map.get("securityDefinitions");
        if (securityDefs instanceof LinkedHashMap) {
          LinkedHashMap<String, Object> sdMap = (LinkedHashMap<String, Object>) securityDefs;
          Object oauth2Schema = sdMap.get("oauth2schema");
          if (oauth2Schema instanceof LinkedHashMap) {
            LinkedHashMap<String, Object> o2sMap = (LinkedHashMap<String, Object>) oauth2Schema;
            if (o2sMap.containsKey("authorizationUrl")) {
              o2sMap.put("authorizationUrl", "/uaa/oauth/authorize");
              log.debug("Swagger-docs: rewritten OAuth URL with correct micro-service route: {}",
                  "/uaa/oauth/authorize");
            }
          }
        }
        return mapper.writeValueAsString(map);
      }
    } catch (IOException e) {
      log.error("Swagger-docs filter error", e);
    }
    finally {
      try {
        responseDataStream.close();
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
    return null;
  }
}
