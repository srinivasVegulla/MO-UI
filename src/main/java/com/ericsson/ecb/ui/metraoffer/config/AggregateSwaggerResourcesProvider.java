package com.ericsson.ecb.ui.metraoffer.config;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.netflix.zuul.filters.Route;
import org.springframework.cloud.netflix.zuul.filters.RouteLocator;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import springfox.documentation.swagger.web.SwaggerResource;

@Component
@Primary
public class AggregateSwaggerResourcesProvider
    implements springfox.documentation.swagger.web.SwaggerResourcesProvider {

  private final Logger log = LoggerFactory.getLogger(AggregateSwaggerResourcesProvider.class);

  private final RouteLocator routeLocator;

  public AggregateSwaggerResourcesProvider(RouteLocator routeLocator) {
    this.routeLocator = routeLocator;
  }

  @Override
  public List<SwaggerResource> get() {
    List<SwaggerResource> resources = new ArrayList<>();

    resources.add(swaggerResource("ecb-ui-metraoffer", "/v2/api-docs"));

    // Add the registered microservices swagger docs as additional swagger resources
    List<Route> routes = routeLocator.getRoutes();
    routes.forEach(route -> {
      if (!"ecb-security".equalsIgnoreCase(route.getId())) {
        log.debug("Adding: {}: {}", route.getId(), route.getFullPath());
        resources
            .add(swaggerResource(route.getId(), route.getFullPath().replace("**", "v2/api-docs")));
      }
    });

    return resources;
  }

  private SwaggerResource swaggerResource(String name, String location) {
    SwaggerResource swaggerResource = new SwaggerResource();
    swaggerResource.setName(name);
    swaggerResource.setLocation(location);
    swaggerResource.setSwaggerVersion("2.0");
    return swaggerResource;
  }
}
