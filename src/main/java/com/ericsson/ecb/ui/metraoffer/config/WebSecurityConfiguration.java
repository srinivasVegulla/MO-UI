package com.ericsson.ecb.ui.metraoffer.config;

import java.net.InetAddress;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.UnknownHostException;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import javax.sql.DataSource;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.client.loadbalancer.RestTemplateCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;
import org.springframework.web.client.RestTemplate;

import com.ericsson.ecb.oauth2.event.JwkSetEventSource;
import com.ericsson.ecb.oauth2.mapper.EventMapper;
import com.ericsson.ecb.oauth2.mapper.JwkSetDml;
import com.ericsson.ecb.oauth2.service.Context;
import com.ericsson.ecb.oauth2.store.JoseEnv;
import com.ericsson.ecb.oauth2.store.OpenIdRole;
import com.ericsson.ecb.oauth2.store.RpJwtAccessTokenConverter;
import com.ericsson.ecb.oauth2.util.JwkSetDmlHandler;
import com.ericsson.ecb.oauth2.util.UrlHelper;
import com.ericsson.ecb.oidc.http.rp.RpClientHandler;
import com.ericsson.ecb.oidc.mapper.ClientDetailDdl;
import com.ericsson.ecb.oidc.service.RpClientRegistrationService;
import com.ericsson.ecb.oidc.util.ClientDetailDdlHandler;
import com.ericsson.ecb.ui.metraoffer.utils.RpUrlHelper;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.oauth2.sdk.client.ClientInformation;

import springfox.documentation.swagger.web.SecurityConfiguration;
import springfox.documentation.swagger.web.SecurityConfigurationBuilder;

@Configuration
@EnableResourceServer
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class WebSecurityConfiguration extends ResourceServerConfigurerAdapter {
  private static final Logger logger = LoggerFactory.getLogger(WebSecurityConfiguration.class);

  protected static final String TILDE = "~";
  protected static final String SWAGGER_UI = "swagger-ui";

  protected static final String LEGACY = "legacy";
  protected static final String TRUSTED = "trusted";
  protected static final String TICKET = "ticket";

  private final DiscoveryClient discoveryClient;

  @Autowired
  private Environment env;

  @Autowired
  private Context ctx;

  @Autowired
  private DataSource dataSource;

  @Autowired
  private RpClientHandler rpClientHandler;

  @Autowired
  private RpClientRegistrationService rpClientRegistrationService;

  @Autowired
  private ClientDetailDdl clientDetailDdl;

  @Autowired
  private JwkSetDml jwkSetDml;

  @Autowired
  private EventMapper eventMapper;

  public WebSecurityConfiguration(DiscoveryClient discoveryClient) {
    this.discoveryClient = discoveryClient;
  }

  @Override
  public void configure(HttpSecurity http) throws Exception {
    http.csrf().disable().headers().frameOptions().disable().and().sessionManagement()
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS).and().authorizeRequests()
        .mvcMatchers("/api/profile-info").permitAll().mvcMatchers("/api/**").authenticated()
        .antMatchers("/refresh").authenticated().mvcMatchers("/management/health").permitAll()
        .mvcMatchers("/context").permitAll().mvcMatchers("/jwks_uri").permitAll()
        .mvcMatchers("/jwksets/roles").permitAll()
        // .mvcMatchers("/management/**").hasAuthority(AuthoritiesConstants.ADMIN)
        .mvcMatchers("/swagger-resources/configuration/ui").permitAll();
  }

  @Bean
  public TokenStore tokenStore(JwtAccessTokenConverter jwtAccessTokenConverter) {
    return new JwtTokenStore(jwtAccessTokenConverter);
  }

  @Bean
  public UrlHelper urlHelper() {
    return new RpUrlHelper(discoveryClient);
  }

  public boolean clientDetailSetup() {
    boolean result = false;

    ClientDetailDdlHandler clientDetailDdlHandler =
        new ClientDetailDdlHandler(urlHelper(), dataSource, clientDetailDdl, ctx.getDbsType());

    result = clientDetailDdlHandler.existsClientDetailTable(OpenIdRole.RP, ctx.getAppName());

    if (!result) {
      try {
        List<String> msgList =
            clientDetailDdlHandler.createClientDetailTable(OpenIdRole.RP, ctx.getAppName());
        if (msgList.size() == 1) {
          result = true;
        }
      } catch (Exception exc) {
        logger.error("Exception Creating ClientDetailTable For: '{}'", ctx.getAppName());
      }
    }

    return result;
  }

  @Bean
  public SecurityConfiguration securityConfiguration() throws URISyntaxException {
    SecurityConfiguration securityConfiguration = null;

    String appId = ctx.getAppMark() == null ? null
        : UUID.nameUUIDFromBytes(ctx.getAppMark().getBytes(StandardCharsets.UTF_8)).toString();
    String dbsId = ctx.getDbsMark() == null ? null
        : UUID.nameUUIDFromBytes(ctx.getDbsMark().getBytes(StandardCharsets.UTF_8)).toString();
    if (appId != null && dbsId != null) {
      boolean isOK = clientDetailSetup();
      if (isOK) {
        logger.info(
            "The dedicated ClientDetail table for '{}' is present and structured correctly.",
            ctx.getAppName());
      }

      String name = "{" + ctx.getAppName() + TILDE + SWAGGER_UI + "}";
      ClientInformation swaggerUiClientInfo = rpClientRegistrationService.read(appId, dbsId, name);
      if (swaggerUiClientInfo == null) {
        swaggerUiClientInfo = rpClientHandler.createSwagger();
      }

      name = "{" + ctx.getAppName() + TILDE + TICKET + "}";
      ClientInformation ticketClientInfo = rpClientRegistrationService.read(appId, dbsId, name);
      if (ticketClientInfo == null) {
        rpClientHandler.create(rpClientHandler.buildTicketClientMetadata());
      }

      name = "{" + ctx.getAppName() + TILDE + LEGACY + "}";
      ClientInformation legacyClientInfo = rpClientRegistrationService.read(appId, dbsId, name);
      if (legacyClientInfo == null) {
        rpClientHandler.create(rpClientHandler.buildLegacyClientMetadata());
      }

      name = "{" + ctx.getAppName() + TILDE + TRUSTED + "}";
      ClientInformation trustedClientInfo = rpClientRegistrationService.read(appId, dbsId, name);
      if (trustedClientInfo == null) {
        Set<URI> urlSet = getRedirectedUris();
        logger.info("Authrorization code redirected URIs {}", urlSet);
        rpClientHandler.create(rpClientHandler.buildTrustedClientMetadata(urlSet));
      }

      String clientId = null;
      String clientName = null;

      if (swaggerUiClientInfo != null) {
        if (swaggerUiClientInfo.getID() != null) {
          clientId = swaggerUiClientInfo.getID().getValue();
        }
        clientName = swaggerUiClientInfo.getMetadata().getName();
      }

      securityConfiguration = SecurityConfigurationBuilder.builder().appName(clientName)
          .clientId(clientId).realm("realm").build();
    }
    return securityConfiguration;
  }

  private Set<URI> getRedirectedUris() throws URISyntaxException {
    String host = env.getProperty("HOST");
    String port = env.getProperty("server.port");
    String uriPrefix = "https://" + host + ":" + port;
    Set<URI> urlSet = new HashSet<>();
    URI uri = new URI(uriPrefix + "/login");
    String ipAddress = getIpAddress(host);
    if (StringUtils.isNotEmpty(ipAddress)) {
      String uriPrefixForIp = "https://" + ipAddress + ":" + port;
      URI uriForIp = new URI(uriPrefixForIp + "/login");
      urlSet.add(uriForIp);
    }
    urlSet.add(uri);
    return urlSet;
  }

  private String getIpAddress(String hostName) {
    String ipAddress = StringUtils.EMPTY;
    try {
      InetAddress host = InetAddress.getByName(hostName);
      ipAddress = host.getHostAddress();
    } catch (UnknownHostException ex) {
      logger.error("Unable to convert hostname : {} to IpAddress", hostName);
    }
    logger.info("successfully converted hostname : {} to ApAddress : {}", hostName, ipAddress);
    return ipAddress;
  }

  @Bean
  public JwkSetEventSource jwkSetEventSource() {
    return new JwkSetEventSource();
  }

  @Bean
  public RpJwtAccessTokenConverter jwtAccessTokenConverter(
      @Qualifier("loadBalancedRestTemplate") RestTemplate keyUriRestTemplate) {

    JwkSetEventSource jwkSetEventSource = jwkSetEventSource();

    logger.info("Load the Private JWKSet from the Database ...");
    JwkSetDmlHandler jwkSetDmlHandler = new JwkSetDmlHandler(urlHelper(), jwkSetDml, eventMapper);
    JWKSet prvRpJwkSet = jwkSetDmlHandler.loadJwkSet(OpenIdRole.RP);
    RpJwtAccessTokenConverter rpJwtAccessTokenConverter = new RpJwtAccessTokenConverter(
        jwkSetDmlHandler, prvRpJwkSet, null, env.getProperty(JoseEnv.ECB_JWS_ALGORITHM_NAME),
        env.getProperty(JoseEnv.ECB_JWE_ALGORITHM_NAME));

    jwkSetEventSource.addJwkSetEventListener(rpJwtAccessTokenConverter);

    return rpJwtAccessTokenConverter;
  }

  @Bean
  public RestTemplate loadBalancedRestTemplate(RestTemplateCustomizer customizer) {
    RestTemplate restTemplate = new RestTemplate();
    customizer.customize(restTemplate);
    return restTemplate;
  }
}
