package com.ericsson.ecb.ui.metraoffer;

import static springfox.documentation.builders.PathSelectors.regex;

import java.lang.annotation.Annotation;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import javax.annotation.PreDestroy;

import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.type.TypeHandler;
import org.mybatis.spring.annotation.MapperScan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.cloud.commons.util.InetUtils;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.eureka.EurekaInstanceConfigBean;
import org.springframework.cloud.netflix.feign.EnableFeignClients;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.cloud.netflix.hystrix.EnableHystrix;
import org.springframework.cloud.netflix.hystrix.dashboard.EnableHystrixDashboard;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableOAuth2Client;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;

import com.ericsson.ecb.ui.metraoffer.config.SwaggerBasePathRewritingFilter;
import com.google.common.base.Function;
import com.google.common.base.Optional;
import com.google.common.base.Predicate;
import com.google.common.collect.Lists;
import com.netflix.appinfo.AmazonInfo;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import springfox.documentation.RequestHandler;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.AuthorizationScope;
import springfox.documentation.service.GrantType;
import springfox.documentation.service.ImplicitGrant;
import springfox.documentation.service.LoginEndpoint;
import springfox.documentation.service.OAuth;
import springfox.documentation.service.SecurityReference;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * An ECB instance of the Spring Cloud Eureka Service Registry
 *
 */
@Configuration
@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class})
@SpringBootApplication
@EnableZuulProxy
@EnableEurekaClient
@EnableHystrix
@EnableSwagger2
@EnableOAuth2Client
@ComponentScan({"com.ericsson.ecb.ui", "com.ericsson.ecb.common", "com.ericsson.ecb.oauth2",
    "com.ericsson.ecb.oidc.rest.rp", "com.ericsson.ecb.oidc.service",
    "com.ericsson.ecb.common.authz", "com.ericsson.ecb.oidc.service", "com.ericsson.ecb.oidc.util",
    "com.ericsson.ecb.oidc.http"})
@MapperScan({"com.ericsson.ecb.oauth2.mapper", "com.ericsson.ecb.oidc.mapper",
    "com.ericsson.ecb.common.dal"})
@EnableHystrixDashboard
@EnableFeignClients("com.ericsson.ecb")
public class EcbMetraOfferApplication {
  private static final Logger logger = LoggerFactory.getLogger(EcbMetraOfferApplication.class);

  private static final String SERVER_PORT = "server.port";

  public static final String SECURITY_SCHEMA_OAUTH2 = "oauth2schema";
  public static final String AUTHORIZATION_SCOPE_READ = "read";
  public static final String AUTHORIZATION_SCOPE_READ_DESCRIPTION = "Read-Only Access";
  public static final String AUTHORIZATION_SCOPE_WRITE = "write";
  public static final String AUTHORIZATION_SCOPE_WRITE_DESCRIPTION = "Read/Write Access";

  protected EcbMetraOfferApplication() {
    super();
  }

  @Bean
  public EurekaInstanceConfigBean eurekaInstanceConfig(InetUtils inetUtils,
      Environment environment) {
    EurekaInstanceConfigBean config = new EurekaInstanceConfigBean(inetUtils);
    AmazonInfo info = AmazonInfo.Builder.newBuilder().autoBuild("eureka");
    String awsName = info.get(AmazonInfo.MetaDataKey.publicHostname);
    if (!StringUtils.isBlank(awsName)) {
      config.setHostname(awsName);
      config.setIpAddress(info.get(AmazonInfo.MetaDataKey.publicIpv4));
      config.setDataCenterInfo(info);
    }
    int port = Integer.parseInt(environment.getProperty(SERVER_PORT));
    config.setNonSecurePortEnabled(false);
    config.setSecurePortEnabled(true);
    config.setSecurePort(port);
    config.setSecureHealthCheckUrl("https://" + config.getHostname() + ":" + config.getSecurePort()
        + config.getHealthCheckUrlPath());
    config.setStatusPageUrl("https://" + config.getHostname() + ":" + config.getSecurePort()
        + config.getStatusPageUrlPath());
    return config;
  }

  /**
   * Entry point for launching the registry from the command line
   * 
   * @param args the command line arguments
   * @throws UnknownHostException
   */
  public static void main(String[] args) throws UnknownHostException {
    logger.info("");
    logger.info("*****************************************************************************");
    logger.info("** E N T E R P R I S E  &  C L O U D   M E T R A O F F E R   S E R V I C E **");
    logger.info("*****************************************************************************");
    logger.info("");
    Properties properties = System.getProperties();
    properties.setProperty("file.encoding", "UTF-8");
    properties.setProperty("spring.security.strategy", "MODE_INHERITABLETHREADLOCAL");
    Environment env = new SpringApplicationBuilder(EcbMetraOfferApplication.class).web(true)
        .run(args).getEnvironment();
    String protocol = "http";
    if (env.getProperty("server.ssl.key-store") != null) {
      protocol = "https";
    }
    logger.info(
        "\n----------------------------------------------------------\n\t"
            + "Application '{}' is running! Access URLs:\n\t" + "Local: \t\t{}://localhost:{}\n\t"
            + "External: \t{}://{}:{}\n\t" + "Public: \t{}://{}:{}\n\t"
            + "Profile(s): \t{}\n----------------------------------------------------------",
        env.getProperty("spring.application.name"), protocol, env.getProperty(SERVER_PORT),
        protocol, InetAddress.getLocalHost().getHostAddress(), env.getProperty(SERVER_PORT),
        protocol,
        AmazonInfo.Builder.newBuilder().autoBuild("eureka")
            .get(AmazonInfo.MetaDataKey.publicHostname),
        env.getProperty(SERVER_PORT), env.getActiveProfiles());

  }

  @Bean
  public List<TypeHandler<?>> typeHandlers() throws NoSuchMethodException {
    List<TypeHandler<?>> list = new ArrayList<>();
    return list;
  }

  @Bean
  public RequestInterceptor requestTokenBearerInterceptor() {
    return new RequestInterceptor() {
      @Override
      public void apply(RequestTemplate requestTemplate) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        OAuth2AuthenticationDetails details =
            (OAuth2AuthenticationDetails) authentication.getDetails();
        requestTemplate.header("Authorization", "Bearer " + details.getTokenValue());
      }
    };
  }

  @Bean
  public Docket customerApi() {
    return new Docket(DocumentationType.SWAGGER_2).apiInfo(apiInfo()).select()
        .apis(MyRequestHandlerSelectors.withoutClassAnnotation(FeignClient.class))
        .paths(regex("/api/.*")).build().securitySchemes(Lists.newArrayList(securityScheme()))
        .securityContexts(Lists.newArrayList(securityContext()));
  }

  private OAuth securityScheme() {
    AuthorizationScope readScope =
        new AuthorizationScope(AUTHORIZATION_SCOPE_READ, AUTHORIZATION_SCOPE_READ_DESCRIPTION);
    AuthorizationScope writeScope =
        new AuthorizationScope(AUTHORIZATION_SCOPE_WRITE, AUTHORIZATION_SCOPE_WRITE_DESCRIPTION);
    LoginEndpoint loginEndpoint = new LoginEndpoint("uaa/oauth/authorize");
    GrantType grantType = new ImplicitGrant(loginEndpoint, "access_token");
    return new OAuth(SECURITY_SCHEMA_OAUTH2, Lists.newArrayList(readScope, writeScope),
        Lists.newArrayList(grantType));
  }

  private SecurityContext securityContext() {
    return SecurityContext.builder().securityReferences(defaultAuth()).forPaths(regex("/api/.*"))
        .build();
  }

  private List<SecurityReference> defaultAuth() {
    AuthorizationScope readScope =
        new AuthorizationScope(AUTHORIZATION_SCOPE_READ, AUTHORIZATION_SCOPE_READ_DESCRIPTION);
    AuthorizationScope writeScope =
        new AuthorizationScope(AUTHORIZATION_SCOPE_WRITE, AUTHORIZATION_SCOPE_WRITE_DESCRIPTION);
    AuthorizationScope[] authorizationScopes = new AuthorizationScope[2];
    authorizationScopes[0] = readScope;
    authorizationScopes[1] = writeScope;
    return Lists.newArrayList(new SecurityReference(SECURITY_SCHEMA_OAUTH2, authorizationScopes));
  }

  private ApiInfo apiInfo() {
    return new ApiInfoBuilder().title("Ericsson Enterprise and Cloud Billing: MetraOffer REST APIs")
        .description("MetraOffer REST API's for Ericsson Enterprise and Cloud Billing")
        .termsOfServiceUrl("http://www.ericsson.com").build();
  }

  @PreDestroy
  public void shutdown() {
    logger.info("Shutdown called...");
  }

  @Configuration
  public static class SwaggerBasePathRewritingConfiguration {
    @Bean
    public SwaggerBasePathRewritingFilter swaggerBasePathRewritingFilter() {
      return new SwaggerBasePathRewritingFilter();
    }
  }

}


class MyRequestHandlerSelectors {
  public static Predicate<RequestHandler> withoutClassAnnotation(
      final Class<? extends Annotation> annotation) {
    return input -> declaringClass(input).transform(annotationPresent(annotation))
        .or(Boolean.FALSE);
  }

  private static Function<Class<?>, Boolean> annotationPresent(
      final Class<? extends Annotation> annotation) {
    return input -> !input.isAnnotationPresent(annotation);
  }

  @SuppressWarnings("deprecation")
  private static Optional<? extends Class<?>> declaringClass(RequestHandler input) {
    return Optional.fromNullable(input.declaringClass());
  }
}
