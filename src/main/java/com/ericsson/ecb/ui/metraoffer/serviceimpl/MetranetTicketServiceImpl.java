package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.spec.InvalidKeySpecException;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.crypto.BadPaddingException;
import javax.crypto.NoSuchPaddingException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.netflix.eureka.EurekaDiscoveryClient.EurekaServiceInstance;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.oauth2.dto.UiTicketInfo;
import com.ericsson.ecb.oauth2.store.OpenIdRole;
import com.ericsson.ecb.oauth2.store.RpJwtAccessTokenConverter;
import com.ericsson.ecb.oauth2.ticket.UiTicketHandler;
import com.ericsson.ecb.oauth2.util.Convert;
import com.ericsson.ecb.ui.metraoffer.config.MetranetTicketConfig;
import com.ericsson.ecb.ui.metraoffer.exception.PreconditionFailedException;
import com.ericsson.ecb.ui.metraoffer.service.MetranetTicketService;
import com.ericsson.ecb.ui.metraoffer.service.OauthClientInfoService;
import com.ericsson.ecb.ui.metraoffer.utils.MoErrorMessagesUtil;
import com.netflix.appinfo.InstanceInfo;
import com.nimbusds.jwt.JWTClaimsSet;

@Service
public class MetranetTicketServiceImpl implements MetranetTicketService {

  private static final Logger logger = LoggerFactory.getLogger(MetranetTicketServiceImpl.class);

  @Autowired
  private MetranetTicketConfig metranetTicketConfig;

  @Autowired
  private RestTemplate restTemplate;

  @Autowired
  private UiTicketHandler uiTicketHandler;

  @Autowired
  private DiscoveryClient discoveryClient;

  @Value("${eureka.instance.preferIpAddress:#{false}}")
  private boolean preferIpAddress;

  @Autowired
  private RpJwtAccessTokenConverter rpJwtAccessTokenConverter;

  @Autowired
  private OauthClientInfoService oauthClientInfoService;

  @Autowired
  private MoErrorMessagesUtil moErrorMessagesUtil;

  @Override
  public Object getAccessWithEncryptedJwt(String ticket, Boolean tokenExpired) throws Exception {
    JWTClaimsSet jwtClaimsSet = getJWTClaimsSet(ticket, tokenExpired);
    String jwtAssertion = getEncryptedJwtAssertion(jwtClaimsSet);
    logger.info("Generated Encrypted JWT assertion :{}", jwtAssertion);
    if (jwtAssertion == null) {
      throw new PreconditionFailedException(
          moErrorMessagesUtil.getErrorMessages("NOT_ABLE_TO_GENERATE_ASSERTION"));
    }
    return getAccessToken(jwtAssertion);
  }

  private JWTClaimsSet getJWTClaimsSet(String ticket, Boolean tokenExpired)
      throws InvalidKeyException, NoSuchPaddingException, NoSuchAlgorithmException,
      NoSuchProviderException, InvalidAlgorithmParameterException, InvalidKeySpecException,
      BadPaddingException, PreconditionFailedException, EcbBaseException {
    logger.info("Received ticket from metranet:{}", ticket);
    UiTicketInfo uiTicketInfo =
        uiTicketHandler.decryptMetranetUiTicket(Convert.fromBase64UrlToBase64(ticket));
    if (tokenExpired != null && tokenExpired) {
      logger.info("Handling expired token : {}", tokenExpired);
      uiTicketInfo.setExpirationDate(Date.from(Instant.now().plusSeconds(1200)));
    }
    String audience = buildAudience();
    JWTClaimsSet jwtClaimsSet = buildJwtClaimsSet(uiTicketInfo, audience);

    if (jwtClaimsSet == null) {
      throw new PreconditionFailedException(
          moErrorMessagesUtil.getErrorMessages("EXPIRED_TIKCET", ticket));
    }
    return jwtClaimsSet;
  }

  private Object getAccessToken(String jwtAssertion) throws EcbBaseException {
    MultiValueMap<String, String> parametersMap = new LinkedMultiValueMap<>();
    parametersMap.add(metranetTicketConfig.getAssertionParam(), jwtAssertion);
    Map<String, String> props = oauthClientInfoService.getTicketClientInfo();
    props.forEach((key, value) -> {
      if (!StringUtils.isEmpty(value)) {
        parametersMap.add(key, value);
      } else {
        parametersMap.add(key, jwtAssertion);
      }
    });
    logger.info("Request Parameter :{}", parametersMap);
    logger.info("Request to Oauth service to get access token");
    String tokenDetails = restTemplate.postForObject("https://ECB-SECURITY/uaa/oauth/token",
        parametersMap, String.class);
    logger.info("Received Oauth token details: {}", tokenDetails);
    return tokenDetails;
  }

  private String buildAudience() {
    List<String> svcList = discoveryClient.getServices();
    ServiceInstance instance = null;
    for (String svc : svcList) {
      if ("ECB-SECURITY".equalsIgnoreCase(svc)) {
        instance = discoveryClient.getInstances("ECB-SECURITY").get(0);
      }
    }
    InstanceInfo instanceInfo = null;
    if (instance != null) {
      instanceInfo = ((EurekaServiceInstance) instance).getInstanceInfo();
      String host =
          preferIpAddress ? instanceInfo.getIPAddr() : instanceInfo.getHostName().toLowerCase();
      int port = instanceInfo.getSecurePort();
      return "https://" + host + ":" + port;
    }
    return null;
  }

  private JWTClaimsSet buildJwtClaimsSet(UiTicketInfo uiTicketInfo, String baseUri) {
    JWTClaimsSet jwtClaimsSet = null;
    Date now = Date.from(new Date().toInstant().minusSeconds(60));

    if (uiTicketInfo.getExpirationDate().after(now) && uiTicketInfo.getExpirationDate().after(
        Date.from(now.toInstant().plusSeconds(metranetTicketConfig.getJwtAssertionTimeToLive())))) {

      // Use Ticket date to Build JWT Claims ...
      jwtClaimsSet = new JWTClaimsSet.Builder().issuer(metranetTicketConfig.getAppName())
          .audience(baseUri)
          .expirationTime(Date
              .from(now.toInstant().plusSeconds(metranetTicketConfig.getJwtAssertionTimeToLive())))
          .issueTime(now).notBeforeTime(now).jwtID(UUID.randomUUID().toString())
          .subject(uiTicketInfo.getNameSpace() + "/" + uiTicketInfo.getUserName()).build();
    }
    return jwtClaimsSet;
  }

  private String getEncryptedJwtAssertion(JWTClaimsSet jwtClaimsSet) {
    return rpJwtAccessTokenConverter.produceJwtFromJwtClaimsSet(jwtClaimsSet, OpenIdRole.OP, null);
  }

}
