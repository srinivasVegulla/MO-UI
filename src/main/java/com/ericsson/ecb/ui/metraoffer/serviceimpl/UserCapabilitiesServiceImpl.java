package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.exception.EcbBaseRuntimeException;
import com.ericsson.ecb.ui.metraoffer.service.UserCapabilitiesService;
import com.ericsson.ecb.ui.metraoffer.utils.MoErrorMessagesUtil;
import com.ericsson.ecb.ui.metraoffer.utils.UICapsUtil;

@Service
public class UserCapabilitiesServiceImpl implements UserCapabilitiesService {

  private static final String ECB_SECURITY_USERINFO_URL = "https://ECB-SECURITY/uaa/oauth/userinfo";

  private static final Logger logger = LoggerFactory.getLogger(UserCapabilitiesServiceImpl.class);

  @Autowired
  private RestTemplate restTemplate;

  @Autowired
  private UICapsUtil uiCapsUtil;

  @Autowired
  private MoErrorMessagesUtil moErrorMessagesUtil;

  /**
   * Retrieve the User Capabilities per feature. If Capability is defined in system then it will
   * return true or false based an User assigned capabilities otherwise it will be null value
   * 
   * @param httpServletRequest - the HttpServletRequest instance having the logged-in User
   *        information
   * @param entity - the Widget value of the requested capability
   * @param feature - the Feature value of the requested capability
   * 
   * @throws EcbBaseException
   */
  @Override
  public Boolean findUserCapabilitiesPerFeature(HttpServletRequest httpServletRequest,
      String entity, String feature) throws EcbBaseException {

    String userInfoToken =
        getUserInfoToken(httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION));

    return uiCapsUtil.doesUserHasCapabilitiesForWidget(entity, feature, userInfoToken);
  }

  /**
   * Retrieve the logged-in User Capabilities. If Capability is defined in system then it will
   * return true or false based an User assigned capabilities otherwise it will be null value
   * 
   * @param httpServletRequest - the HttpServletRequest instance having the logged-in User
   *        information
   */
  @Override
  public Map<String, Map<String, Boolean>> findUserCapabilities(
      HttpServletRequest httpServletRequest) throws EcbBaseException {
    String oauthToken = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
    String userinfoToken = getUserInfoToken(oauthToken);
    return uiCapsUtil.retrieveUserUICapabilities(userinfoToken);
  }

  /**
   * Retrieval of the Encoded User Token Information
   * 
   * @param authToken - the logged-in User authentication token
   * 
   * @return the Encoded User Token Information
   * @throws EcbBaseException
   */
  private String getUserInfoToken(String authToken) throws EcbBaseException {
    logger.debug("Request to Oauth service to get user info token, oauthToken :{}", authToken);
    MultiValueMap<String, String> parametersMap = new LinkedMultiValueMap<>();
    parametersMap.add(HttpHeaders.AUTHORIZATION, authToken);
    RequestEntity<String> requestEntity = new RequestEntity<>(parametersMap, null, null);

    ResponseEntity<String> result = restTemplate.exchange(ECB_SECURITY_USERINFO_URL, HttpMethod.GET,
        requestEntity, String.class);

    if (result == null) {
      throw new EcbBaseRuntimeException(
          moErrorMessagesUtil.getErrorMessages("ERR_IN_RETRIEVAL_OF_USER_INFO"));
    }

    logger.info("Received User Info token details: {}", result);
    return result.getBody();
  }

}
