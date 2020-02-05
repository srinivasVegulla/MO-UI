/*package com.ericsson.ecb.ui.metraoffer.utils;

import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.config.ConfigResourceBuilder;
import com.ericsson.ecb.common.config.CustomConfigResourceReader;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.exception.EcbConfigResourceNotFoundException;
import com.ericsson.ecb.customer.client.BusinessPartitionClient;
import com.ericsson.ecb.customer.model.BusinessPartition;
import com.ericsson.ecb.oauth2.store.RpJwtAccessTokenConverter;

public class UICapsUtilTest {

  @InjectMocks
  private UICapsUtil uiCapsUtil;

  @Mock
  private CustomConfigResourceReader cfgReader;

  @Mock
  private ConfigResourceBuilder cfgResourceBuilder;

  @Mock
  private RpJwtAccessTokenConverter jwtAccessTokenConverter;

  @Mock
  private BusinessPartitionClient businessPartitionClient;

  @Spy
  private Map<String, Map<String, String>> uiCapabilities = new HashMap<>();

  private Map<String, String> capabilities = new HashMap<>();

  private static final String OFFERING = "Offerings";
  private static final String ADJUSTMENT_REASONS = "AdjustmentReasons";
  private static final String CALENDARS = "Calendars";
  private static final String SUBSCRIPTION_PROPERTIES = "SubscriptionProperties";
  private static final String PRICEABLE_ITEM_TEMPLATE = "PriceableItemTemplate";
  private static final String LOCALIZATION = "Localization";
  private static final String SHARED_RATES = "SharedRates";
  private static final String AUDIT_LOG = "AuditLog";

  private static final String UI_PARTITION_BREAD_CRUMB = "UIPartitionBreadCrumb";
  private static final String UI_PO_GRID = "UIPOGrid";
  private static final String CREATE = "Create";
  private static final String UI_BREAD_CRUMB = "UIBreadCrumb";

  private static final String MANAGE_SUBSCRIPTION_PROPERTIES_CAPABILITY =
      "MetraTech.Auth.Capabilities.ManageSubscriptionPropertiesCapability";
  private static final String DELETE_SUBSCRIPTION_PROPERTIES_CAPABILITY =
      "MetraTech.Auth.Capabilities.DeleteSubscriptionPropertiesCapability";
  private static final String MANAGE_PATH_CAPABILITY = "Metratech.MTPathCapability";
  private static final String DELETE_RATES_SCHEDULES_CAPABILITY =
      "MetraTech.Auth.Capabilities.DeleteRatesSchedulesCapability";
  private static final String MANAGE_ENUM_CAPABILITY = "Metratech.MTEnumTypeCapability";
  private static final String LOGON_CAPABILITY = "Metratech.MTApplicationLogOnCapability";
  private static final String UI_MO_LOGON_CAPABILITY = "UIMoLogOnCapability";
  private static final String MT_ALL_CAPABILITY = "Metratech.MTAllCapability";
  private static final String LOGON = "Logon";

  private static final String CONFIG_RESOURCE_RESPONSE = UI_PARTITION_BREAD_CRUMB + ":\r\n" + " "
      + OFFERING + ":" + " " + MT_ALL_CAPABILITY + "," + LOGON_CAPABILITY + "\r\n" + " "
      + LOCALIZATION + ":" + " " + MT_ALL_CAPABILITY + "," + LOGON_CAPABILITY + "\r\n" + " "
      + SHARED_RATES + ":" + " " + MT_ALL_CAPABILITY + "," + LOGON_CAPABILITY + "\r\n" + " "
      + SUBSCRIPTION_PROPERTIES
      + ": MetraTech.Auth.Capabilities.ManageSubscriptionPropertiesCapability,MetraTech.Auth.Capabilities.DeleteSubscriptionPropertiesCapability\r\n"
      + " " + AUDIT_LOG + ": False\r\n" + " " + PRICEABLE_ITEM_TEMPLATE + ": False\r\n" + " "
      + ADJUSTMENT_REASONS + " " + ": False\r\n" + " " + CALENDARS + " " + " : False\r\n"
      + UI_MO_LOGON_CAPABILITY + ":\r\n" + " " + LOGON + ":" + " " + LOGON_CAPABILITY + ","
      + MT_ALL_CAPABILITY + "\r\n" + UI_PO_GRID + ":\r\n"
      + " Delete_Column_(un)hide: Metratech.MTAllCapability,MetraTech.MTManageProductOfferingsCapability\r\n"
      + " copy_column_(un)hide:" + " " + MT_ALL_CAPABILITY + ","
      + "MetraTech.Auth.Capabilities.ManageOfferingsCapability\r\n"
      + " hide_column_(un)hide: MetraTech.Auth.Capabilities.ManageOfferingsCapability\r\n"
      + " Download: Metratech.MTAllCapability,MetraTech.Auth.Capabilities.ManageOfferingsCapability,MetraTech.Auth.Capabilities.ManageRatesSchedulesandRatesCapability,MetraTech.Auth.Capabilities.ManageRatesTableCapability,MetraTech.Auth.Capabilities.ManageRatesCapability,MetraTech.MTManageRatesCapability,MetraTech.Auth.Capabilities.DeleteRatesSchedulesCapability,MetraTech.Auth.Capabilities.DeleteRatesCapability,MetraTech.MTManageProductOfferingsCapability,MetraTech.Auth.Capabilities.ManageSubscriptionPropertiesCapability,MetraTech.Auth.Capabilities.DeleteSubscriptionPropertiesCapability,MetraTech.Auth.Capabilities.ManageSharedRatesCapability,MetraTech.Auth.Capabilities.DeleteSharedRatesCapability\r\n"
      + " " + CREATE
      + ": Metratech.MTAllCapability,MetraTech.Auth.Capabilities.ManageOfferingsCapability";

  private static final String USER_INFO_TOKEN =
      "eyJraWQiOiJXeGNmangiLCJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAtMjU2In0.QAj1zIfy-1InRz-wQuep_WmONw97xvFEVYrrkPlrooLS9u4hf0PtYNIqlAMGHayFAsy-YeYPq3625uQgbC5xCra7wG6EVaVneIDbHLuD1SjN_eDwVvnP9480HbFyYsWuSDFaeOKAQr1AfE4tVhp1X8cfvTV5oII0y6Svv0Ytl__Edl8TApGJNDisnTi7qY-wSfZITn85TZuydnFc6EoQXufw_x4BGRwyYYgF11woYbjEzzBpAX9isanr8L0Yg2SGhTQK03w2VuXBDtv3k0uC124LLA1Z_J3F5UX6SN6jB6mxp5l84a8SW2lcxC9RDnC0P53i5HBhGDVo3fK14ey1Kg.cln7A3wDz2gpFIpr.tRh1_KlkfJQGPfqqKq406mg0fS4vd8j7BRoqPfTgb9ZucEQGCQ2Hw-oZ2OSJM53yCJjTpnjBvJ23Zu42DsjtMqG1x4F4AS6OPH4yI37c5TCTw6PTAvYk_6DJf42uJJwVU8RbeMlvTmKhlVlki7OZs7MJZFavxmQIKqAwGG8VygUWswFYorYtEjk2AsEw0a4-Raapd0WBwCk5P4pyAynVovgC0h0W6Gc4twlYPlQF3y3zLYUYCuloxY5Tg1tG0BgFcs0QM-uKqvvn1UYcAIY7-pxwIKy6GUeSTvVO6-qTF_Q9h0j7V-oSj97eVN4XIvc3q-S0D-NSk7oT2Tp3-w_jWMHCnzfF7cPzxZuSse0paH70Lqd8cD2eIwDSszZbprwYevGlGr6T0FiFVtLQsiiW2ZmvPGdPq5_uH-kOA0qpPdQXcFVNpKq7nqsThMM6ohMbcLug2ra-Hw9-Q5km5koiHVs8QzcOqE-XNA-IF1IxqCf6ZnVRsPfFRxi2oiFFOGQQuhPYPgX9oZQBupUnhVnmDnJEtAcjvcXQ8rN5CZuHDuhbQFJ-FtDOIgcq9JkJO0EHRKrZGeEz8sZfu3ju_Z2bmrJswi026y1hanrRyTc9Jf2ecZoNTjV1tQfZ1JH2PMoyBGwPdm1qkhZZJufUMW8JkclYzvQb2A1Wn9WbLNv7IfvvvhkwXj_sVeteetyFMKROul0uY1DQM_bqG_HJJgT5exi1OfQqIyIXA9hklXYbwcM04RBRMGzU1cJRRZ0cnxtpHwDYhQJR58mecoqDtju8oZemYxfugMPg1hdDBgEQ9l-YZvlO7nJmh-4vJdJ6-QTYVl3Jk90BRr2zGFMwlXaU9CtJEYxZYgLCqPw-L7wacmAppIx-NdHLf4AhL-QJgJ6rzR2RUeetu699-UPdkLXEIDGGpNQKHqcw8fW2H1xdyt6cN-jLP_HwqonnfaPpGqDFiHHOZ5NfPKPWVP3JP3LFb-k8ErkJXuOPRXGEea9_0HAmgAPEa5ZwWRmNHdIshuGFH8EL5gqcFEnq6CHK1q8y6gwN_a23UBNR8D_lbEcASUphcUwh05qAS0bWk6qGceoTCEdLjAstO4r5SJmRbdt9INCvgTREAjk6SMXrG6tgzj1PxM4M_KTS7H8zmRETYhLln1sEkahJIHrxV7ZGN9upeVzg18eSq6orAcjHzmA6Cv_BCp9WEP5vojQvvt3cEEWe1yL7Ls0YEXJ4TBe2U5kZJbYipeYu6Lt3NKU1nfEZDtEt3Kfjw7Yxov6oTIgEdGBaoDvCQ_A.CeL9chiYNDHdopVfQx-qEw";

  private static final int ADMIN_USER_TYPE_ID = 1;

  @Before
  public void init() throws EcbConfigResourceNotFoundException {
    MockitoAnnotations.initMocks(this);
    mockResponses();
  }

  private void mockResponses() throws EcbConfigResourceNotFoundException {
    Map<String, Set<Integer>> decodedUserInfoTokenRes = buildDecodeUserInfoRes();
    when(cfgReader.readCfgResourceAsString(Mockito.anyString()))
        .thenReturn(CONFIG_RESOURCE_RESPONSE);
    when((jwtAccessTokenConverter).getCaps(Mockito.anyString()))
        .thenReturn(decodedUserInfoTokenRes);
    capabilities.put(CREATE, LOGON_CAPABILITY);
  }

  @SuppressWarnings("unchecked")
  @Test(expected = EcbBaseException.class)
  public void testRetrieveUICapsFromApiFileForCatch() throws EcbBaseException {
    when(cfgReader.readCfgResourceAsString(Mockito.anyString())).thenThrow(IOException.class);
    uiCapsUtil.retrieveUserUICapabilities(Mockito.anyString());
    Assert.fail();
  }

  @Test(expected = EcbBaseException.class)
  public void testNotAuthorizedUser() throws EcbBaseException {
    Map<String, Set<Integer>> decodedUserInfoToken = new HashMap<String, Set<Integer>>();
    Set<Integer> userIdSet = new HashSet<>();
    userIdSet.add(631257221);
    decodedUserInfoToken.put(DELETE_SUBSCRIPTION_PROPERTIES_CAPABILITY, userIdSet);
    when((jwtAccessTokenConverter).getCaps(Mockito.anyString())).thenReturn(decodedUserInfoToken);
    uiCapsUtil.retrieveUserUICapabilities(Mockito.anyString());
    Assert.fail();
  }

  @Test
  public void testUpdateBreadCrummbMapToTrue() throws EcbBaseException {
    ResponseEntity<PaginatedList<BusinessPartition>> responseEntity = buildPaginatedListRes();
    when(businessPartitionClient.findBusinessPartition(1, Integer.MAX_VALUE, null,
        "typeId==" + ADMIN_USER_TYPE_ID)).thenReturn(responseEntity);
    Map<String, Map<String, Boolean>> reqUICapabilities =
        uiCapsUtil.retrieveUserUICapabilities(Mockito.anyString());
    Assert.assertNotNull(reqUICapabilities);
    Assert.assertTrue(reqUICapabilities.get(UI_BREAD_CRUMB).get(ADJUSTMENT_REASONS));

  }

  @Test
  public void testUserHasCapabilitiesForSysUser() throws EcbBaseException {
    ResponseEntity<PaginatedList<BusinessPartition>> responseEntity = buildPaginatedListRes();
    when(businessPartitionClient.findBusinessPartition(1, Integer.MAX_VALUE, null,
        "typeId==" + ADMIN_USER_TYPE_ID)).thenReturn(responseEntity);
    Boolean userCapabilityResponse =
        uiCapsUtil.doesUserHasCapabilitiesForWidget(UI_BREAD_CRUMB, OFFERING, USER_INFO_TOKEN);
    Boolean userBreadCrumbCalRes =
        uiCapsUtil.doesUserHasCapabilitiesForWidget(UI_BREAD_CRUMB, CALENDARS, USER_INFO_TOKEN);
    Assert.assertNotNull(userCapabilityResponse);
    Assert.assertTrue(userCapabilityResponse);
    Assert.assertTrue(userBreadCrumbCalRes);
  }

  @Test
  public void testUserHasCapabilitiesForPartUser() throws EcbBaseException {
    ResponseEntity<PaginatedList<BusinessPartition>> responseEntity = buildPaginatedListRes();

    PaginatedList<BusinessPartition> paginatedList = new PaginatedList<BusinessPartition>();
    Collection<BusinessPartition> bussinessPartitionRes = new HashSet<>();
    paginatedList.setRecords(bussinessPartitionRes);
    responseEntity =
        new ResponseEntity<PaginatedList<BusinessPartition>>(paginatedList, HttpStatus.OK);

    when(businessPartitionClient.findBusinessPartition(1, Integer.MAX_VALUE, null,
        "typeId==" + ADMIN_USER_TYPE_ID)).thenReturn(responseEntity);
    Boolean userCapabilityResponse =
        uiCapsUtil.doesUserHasCapabilitiesForWidget(UI_BREAD_CRUMB, OFFERING, USER_INFO_TOKEN);
    Boolean userBreadCrumbCalRes =
        uiCapsUtil.doesUserHasCapabilitiesForWidget(UI_BREAD_CRUMB, CALENDARS, USER_INFO_TOKEN);

    Assert.assertNotNull(userCapabilityResponse);
    Assert.assertTrue(userCapabilityResponse);
    Assert.assertFalse(userBreadCrumbCalRes);
  }

  private ResponseEntity<PaginatedList<BusinessPartition>> buildPaginatedListRes() {
    PaginatedList<BusinessPartition> paginatedList = new PaginatedList<BusinessPartition>();
    Collection<BusinessPartition> bussinessPartitionRes = new HashSet<>();
    BusinessPartition businessPartition = new BusinessPartition();
    businessPartition.setTypeId(ADMIN_USER_TYPE_ID);
    bussinessPartitionRes.add(businessPartition);
    paginatedList.setRecords(bussinessPartitionRes);
    return new ResponseEntity<PaginatedList<BusinessPartition>>(paginatedList, HttpStatus.OK);
  }

  *//**
   * This method builds the Decode userInfo token response
   * 
   * @return
   *//*
  private Map<String, Set<Integer>> buildDecodeUserInfoRes() {
    Map<String, Set<Integer>> decodedUserInfoToken = new HashMap<String, Set<Integer>>();
    Set<Integer> userIdSet = new HashSet<>();
    userIdSet.add(631257221);
    decodedUserInfoToken.put(LOGON_CAPABILITY, userIdSet);
    decodedUserInfoToken.put(MANAGE_PATH_CAPABILITY, userIdSet);
    decodedUserInfoToken.put(DELETE_RATES_SCHEDULES_CAPABILITY, userIdSet);
    decodedUserInfoToken.put(MANAGE_ENUM_CAPABILITY, userIdSet);
    decodedUserInfoToken.put(MANAGE_SUBSCRIPTION_PROPERTIES_CAPABILITY, userIdSet);
    decodedUserInfoToken.put(DELETE_SUBSCRIPTION_PROPERTIES_CAPABILITY, userIdSet);
    decodedUserInfoToken.put(MANAGE_PATH_CAPABILITY, userIdSet);
    return decodedUserInfoToken;

  }

}
*/