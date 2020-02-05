package com.ericsson.ecb.ui.metraoffer.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.StringTokenizer;
import java.util.TreeMap;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.stereotype.Component;

import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.customer.client.BusinessPartitionClient;
import com.ericsson.ecb.customer.model.BusinessPartition;
import com.ericsson.ecb.oauth2.store.RpJwtAccessTokenConverter;

@Component
@EnableConfigurationProperties
public class UICapsUtil {

  @Autowired
  private JwtAccessTokenConverter jwtAccessTokenConverter;

  @Autowired
  private BusinessPartitionClient businessPartitionClient;

  @Autowired
  private CapabilitiesUtil capabilitiesUtil;

  private static final String FALSE = "FALSE";
  private static final String TRUE = "TRUE";

  private static final String COMMA = ",";
  private static final int ADMIN_USER_TYPE_ID = 1;
  private static final String UI_BREAD_CRUMB = "UIBreadCrumb";
  private static final String UI_MO_LOGON_CAPABILITY = "UIMoLogOnCapability";
  private static final String LOGON = "Logon";
  private static final String CAPABILITY_UN_DEFINED =
      "Unable to Authorize the User. Capability Not defined";
  private static final String UI_PARTITION_BREADCRUMB = "UIPartitionBreadCrumb";

  /**
   * This method will be called for every widget of a page to be rendered
   *
   * @param entity its the actual page, grid or details page
   * @param feature Its the name of the widget or field identifier
   * @return flag to return true if the user has required capabilities
   * @throws EcbBaseException
   */
  public Boolean doesUserHasCapabilitiesForWidget(final String entity, final String feature,
      String userInfoToken) throws EcbBaseException {
    Map<String, Set<Integer>> userCapsMap = decodeUserInfoTokenToCapabilities(userInfoToken);
    Map<String, Map<String, String>> capabilities = capabilitiesUtil.getUICapabilities();
    Map<String, Boolean> breadCrumb = null;

    if (UI_BREAD_CRUMB.equals(entity)) {
      breadCrumb = getPartitionUserDefaultBreadCrumbMap(capabilities, userCapsMap.keySet());

      if (!isPartitionUser()) {
        updateBreadCrummbMapToTrue(breadCrumb);
      }

      return breadCrumb.get(feature);
    }

    return isUserHasFeatureCapability(entity, feature, userCapsMap.keySet(), capabilities);
  }

  /**
   * Retrieve the User Capabilities
   * 
   * @param userInfoToken -- the encoded User Token Information.
   * @return the User Capabilities
   * @throws EcbBaseException
   */
  public Map<String, Map<String, Boolean>> retrieveUserUICapabilities(String userInfoToken)
      throws EcbBaseException {

    Map<String, Map<String, Boolean>> reqUICapabilities = null;

    Map<String, Set<Integer>> userCapsMap = decodeUserInfoTokenToCapabilities(userInfoToken);

    Map<String, Map<String, String>> capabilities = capabilitiesUtil.getUICapabilities();

    String uIMoLogOnCapabilities = capabilities.get(UI_MO_LOGON_CAPABILITY).get(LOGON);

    List<String> logOncapabilities = getCommaSeperatedValues(uIMoLogOnCapabilities);

    if (!isAuthorizedUser(userCapsMap.keySet(), logOncapabilities)) {
      throw new EcbBaseException(CAPABILITY_UN_DEFINED);
    }

    Map<String, Boolean> breadCrumb =
        getPartitionUserDefaultBreadCrumbMap(capabilities, userCapsMap.keySet());

    if (!isPartitionUser()) {
      updateBreadCrummbMapToTrue(breadCrumb);
    }

    reqUICapabilities = processUserUICapabilitiesData(userCapsMap, capabilities);
    reqUICapabilities.put(UI_BREAD_CRUMB, breadCrumb);
    return reqUICapabilities;
  }

  /**
   * This method Checks whether the user is an Authorized user or not
   * 
   * @param userCapabilities
   * @param logOncapabilities
   * @return
   */
  private Boolean isAuthorizedUser(Set<String> userCapabilities, List<String> logOncapabilities) {
    Boolean isAuthorizedUser = Boolean.FALSE;
    for (String logOncapability : logOncapabilities) {
      if (userCapabilities.contains(logOncapability)) {
        isAuthorizedUser = Boolean.TRUE;
        break;
      }
    }
    return isAuthorizedUser;
  }

  /**
   * This Method get the Default breadcrumb Map
   * 
   * @param uiCapabilities
   * @param set
   * @return
   */
  private Map<String, Boolean> getPartitionUserDefaultBreadCrumbMap(
      Map<String, Map<String, String>> uiCapabilities, Set<String> userCapabilities) {
    Map<String, String> uIPartitionBreadCrumb = uiCapabilities.get(UI_PARTITION_BREADCRUMB);
    Map<String, Boolean> partitionUserDefaultBreadCrumbMap = new HashMap<>();
    Set<String> keys = uIPartitionBreadCrumb.keySet();
    keys.forEach(key -> {
      Object valueObj = uIPartitionBreadCrumb.get(key);
      Boolean value = Boolean.FALSE;
      String valueStr = String.valueOf(valueObj);
      if (TRUE.equalsIgnoreCase(valueStr) || FALSE.equalsIgnoreCase(valueStr)) {
        value = Boolean.valueOf(String.valueOf(valueObj));
      } else if (!org.springframework.util.CollectionUtils.isEmpty(uiCapabilities)) {
        List<String> capabilities = getCommaSeperatedValues(valueStr);
        for (String capability : capabilities) {
          if (userCapabilities.contains(capability)) {
            value = true;
            break;
          }
        }
      }
      partitionUserDefaultBreadCrumbMap.put(key, value);
    });
    return partitionUserDefaultBreadCrumbMap;
  }

  private Map<String, Boolean> updateBreadCrummbMapToTrue(Map<String, Boolean> map) {
    map.forEach((key, v) -> map.put(key, true));
    return map;
  }

  /**
   * Method to Process the UserUI Capabilities Data
   * 
   * @param userCapsMap
   * @param uiCapabilities
   * @param partitionUser
   * @return
   */
  private Map<String, Map<String, Boolean>> processUserUICapabilitiesData(
      Map<String, Set<Integer>> userCapsMap, Map<String, Map<String, String>> uiCapabilities) {

    Set<String> entities = uiCapabilities.keySet();
    Set<String> userCapabilities = userCapsMap.keySet();
    Map<String, Map<String, Boolean>> reqUICapabilities = new TreeMap<>();
    Map<String, Boolean> reqEntityCaps = null;
    Map<String, String> entityCaps = null;
    Set<String> features = null;

    for (String entity : entities) {
      if (UI_PARTITION_BREADCRUMB.equals(entity) || UI_MO_LOGON_CAPABILITY.equals(entity)) {
        continue;
      }
      reqEntityCaps = new HashMap<>();
      entityCaps = uiCapabilities.get(entity);
      features = entityCaps.keySet();
      for (String feature : features) {
        reqEntityCaps.put(feature,
            isUserHasFeatureCapability(entity, feature, userCapabilities, uiCapabilities));
      }
      reqUICapabilities.put(entity, reqEntityCaps);
    }
    return reqUICapabilities;
  }

  /**
   * Method to check Whether User is a System user or Partition user
   * 
   * @returns whether user is a partition user or not.
   * @throws EcbBaseException
   */
  private Boolean isPartitionUser() throws EcbBaseException {
    PaginatedList<BusinessPartition> paginatedList = businessPartitionClient
        .findBusinessPartition(1, Integer.MAX_VALUE, null, "typeId==" + ADMIN_USER_TYPE_ID)
        .getBody();
    if (paginatedList != null && CollectionUtils.isNotEmpty(paginatedList.getRecords())) {
      return Boolean.FALSE;
    }
    return Boolean.TRUE;
  }

  /**
   * Retrieve the Feature level capability of the User
   * 
   * @param entity -- the value of the the UI Widget
   * @param feature -- the value of the UI Feature
   * @param userCapabilities -- the system defined capabilities of the User
   * @param uiCapabilities -- the Capabilities defined of each widget in the external configuration
   * @return the boolean based on the available capability access
   */
  private Boolean isUserHasFeatureCapability(String entity, String feature,
      Set<String> userCapabilities, Map<String, Map<String, String>> uiCapabilities) {

    Boolean result = Boolean.FALSE;

    if (userCapabilities != null && uiCapabilities.containsKey(entity)) {
      Map<String, String> entityCaps = uiCapabilities.get(entity);

      if (entityCaps.containsKey(feature)) {
        String capsString = entityCaps.get(feature);

        List<String> featureCapabilities = getCommaSeperatedValues(capsString);

        result = checkUserCapabilityFeature(userCapabilities, result, featureCapabilities);
      }
    }
    return result;
  }

  private List<String> getCommaSeperatedValues(String capsString) {
    StringTokenizer tokenizer = new StringTokenizer(capsString, COMMA);
    List<String> featureCapabilities = new ArrayList<>();

    while (tokenizer.hasMoreTokens()) {
      featureCapabilities.add(tokenizer.nextToken().trim());
    }

    return featureCapabilities;
  }

  private Boolean checkUserCapabilityFeature(Set<String> userCapabilities, Boolean result,
      List<String> featureCapabilities) {
    for (String capability : featureCapabilities) {
      if (userCapabilities.contains(capability)) {
        result = Boolean.TRUE;
        break;
      }
    }
    return result;
  }

  /**
   * Decode the User Info Token to the Capabilities
   * 
   * @param userInfoToken -- the encoded User Token Information
   * 
   * @return the User assigned Capabilities Map
   */
  private Map<String, Set<Integer>> decodeUserInfoTokenToCapabilities(String userInfoToken) {
    return ((RpJwtAccessTokenConverter) jwtAccessTokenConverter).getCaps(userInfoToken);
  }

}
