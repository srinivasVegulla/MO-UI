package com.ericsson.ecb.ui.metraoffer.service;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.exception.EcbBaseRuntimeException;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.UserCapabilitiesServiceImpl;
import com.ericsson.ecb.ui.metraoffer.utils.MoErrorMessagesUtil;
import com.ericsson.ecb.ui.metraoffer.utils.UICapsUtil;

public class UserCapabilitiesServiceImplTest {

  public static final String ECB_SECURITY_USERINFO_URL = "https://ECB-SECURITY/uaa/oauth/userinfo";

  @InjectMocks
  private UserCapabilitiesServiceImpl userCapabilitiesServiceImpl;

  @Mock
  private RestTemplate restTemplate;

  @Mock
  UICapsUtil uICapsUtil;

  @Mock
  private MoErrorMessagesUtil moErrorMessagesUtil;

  HttpServletRequest httpServletRequest;

  RequestEntity<String> requestEntity;

  ResponseEntity<String> userInfoTokenRes;

  MultiValueMap<String, String> parametersMap = new LinkedMultiValueMap<>();

  private static final String AUTH_TOKEN =
      "Bearer eyJraWQiOiJMZ1hTcHUiLCJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAtMjU2In0.VCg94hsxv9GdHg82oe7ShhPGKJiYEuevDZM9SkGf1JEhUhsD22u7gSIEUIMcwAyhh8pUsCEF4bt6fCsQG6wbxIoLo4_ZwA2-ifOG6vzK5sPQjSzIMu0xczWHaKsnHLugqRRJ0EeqE0G9hM6HWB90VpA4fpVmsxdzXrznjGu46wvRfru2AIHTmXIvnttKD9yeTOCeKHaTr60wzL5spINS0ZJK_VAtT8YcLrg6hn7FUaq2Milp8TkWtl34GVTPDh47wO-Vp8PfRIvL5yI4dpWXwSHMZoL-gt4bLUOHoIyGHHLHaZvmDltas0HZBKe7SpqCgn-6x7w4SK3CUNb93I33Hw.UDWasbuHpSEgq9Ki.UZgXTltMvrVqqXoa0AqhYoP2EqHRNmsUeBYHXp5C7DCD-8L7XxJ9zaFU7S_kHTdp4812eIjTZOfw3RIY-j9mZeY2Yn_vzKh47sppFkFzCBrNEXrSeWBAO3qr2CTNujPNQyrwP42aAGy5E0a6-ftE84r_anxP2D4XotxRQouYJUJNK43vvAhbpHzwxNuF2I420A30DV8gUDOi8eD7EXXxMDTrVmLCper5isfvjF681igVl_RTfWEHHyXcgkYSrFTpuji8Ztw_YcShlDPCKZ0Nptg_fDM3FohyIihWCwq0BTaZ8tYqNBivzo0763Ce8CnjPwMqKeBzEfSaoiZBC4rBnAk230HlvwgdYPhTgfSYl9UnUCKtwm0HJw6EVcUHnbrifxGOu-Gth_2qju4cfd9zV3fHW24kmAH8D0AlI2ayNwoFnZjEory2FU6MI3a_afIcO-o1V269E7TCI2JsEfAFllKHfqZ_T76kvJjP5s1EiMDcfqRtdkluOq_moS28w0N5EWiWBdrhV_FlzOb4sl1L6cw398Tb3fmmEx-MNy4zND5l68Vz8T9r8fQWTkKhOALhXRV6B96dfKx-rrY-I89ZtmcEcd5n96_RlMe4GLhxENCJz7y32Ksde_l7pxHz6yXxYe8VboFY19q7heIaAC6-3qWt-hdxKpVLdfetGba0aesaogqODTD8T8hnfMDqKNZpdjGYsfhN5O7UBLTEgoJKgLGpULaS7lQYi0if2x-DNxzVa_llmnfhKehh2eEHr2Fi9rhIEYjnFdOil0i32rd3_bXn_ZaJFLT2ZKPme3tT11Uh-GLMHN9wmW9coNvgXByMP7y3i7bJuh-jUS-JJmvpLZaoovT48IquM1dnLMgUchgfl-dbAgYLer1XckiFYQpTbbTZpuGvkfmpwzeEwaDYITEoXwIMV6JfTAQP5-NfJTV87KEtYHIKcihbGsBFRJvkM9eB5qrkHWUNmmSgSYBcvaTeiFyM28mis2QjjX_Lg5Yv5jl2pFfGi401CIDcS4TrfkI4c4A9NKyQUkzmnmM5ggOvf2xiY2CfdwT0ljFjFVYf2cGR_C2C8u0TWeTNc6q7HL2qF0qW5hXo5FjI5g1CV5c0WLk7nLOEY5urbsbzEexCl7MAbNEZnaG9mHhOW5FrNEQOlj_5jNa6PJ4qBvV9lU7DjofmeOhqAfj_VhoBaW5ogZDcF7dgSPbkiKRaFeqRrQqCaDXRRV2k60g1RheXIVzsSibdEuFbn2btXCNjkzKZqVlPP2DD4dRb2HE4EWfhDdq-cxy5hh_Rka2jAY30CoejMu0iFYZX8as_l_P5jKQIE-DvdcqULECHtYxMWZvJYTashnXePBPKE_FtIcLatUFSO-MhHhLqOSlWOJACHqOD_5vMpPlpUoNse7nNAHVoQqZ_lp5AFImLj9CxBlr7u4dUc7zG9s2CRbpDgwOAxlsE6mLg0eLRkNozHcquFSoSiB9XqoT7Me7wc18PSrPQEMcK6zY6.7m6nfWW7Q4EIk8qy6Aimsw";
  private static final String USER_INFO_TOKEN =
      "eyJraWQiOiJXeGNmangiLCJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAtMjU2In0.QAj1zIfy-1InRz-wQuep_WmONw97xvFEVYrrkPlrooLS9u4hf0PtYNIqlAMGHayFAsy-YeYPq3625uQgbC5xCra7wG6EVaVneIDbHLuD1SjN_eDwVvnP9480HbFyYsWuSDFaeOKAQr1AfE4tVhp1X8cfvTV5oII0y6Svv0Ytl__Edl8TApGJNDisnTi7qY-wSfZITn85TZuydnFc6EoQXufw_x4BGRwyYYgF11woYbjEzzBpAX9isanr8L0Yg2SGhTQK03w2VuXBDtv3k0uC124LLA1Z_J3F5UX6SN6jB6mxp5l84a8SW2lcxC9RDnC0P53i5HBhGDVo3fK14ey1Kg.cln7A3wDz2gpFIpr.tRh1_KlkfJQGPfqqKq406mg0fS4vd8j7BRoqPfTgb9ZucEQGCQ2Hw-oZ2OSJM53yCJjTpnjBvJ23Zu42DsjtMqG1x4F4AS6OPH4yI37c5TCTw6PTAvYk_6DJf42uJJwVU8RbeMlvTmKhlVlki7OZs7MJZFavxmQIKqAwGG8VygUWswFYorYtEjk2AsEw0a4-Raapd0WBwCk5P4pyAynVovgC0h0W6Gc4twlYPlQF3y3zLYUYCuloxY5Tg1tG0BgFcs0QM-uKqvvn1UYcAIY7-pxwIKy6GUeSTvVO6-qTF_Q9h0j7V-oSj97eVN4XIvc3q-S0D-NSk7oT2Tp3-w_jWMHCnzfF7cPzxZuSse0paH70Lqd8cD2eIwDSszZbprwYevGlGr6T0FiFVtLQsiiW2ZmvPGdPq5_uH-kOA0qpPdQXcFVNpKq7nqsThMM6ohMbcLug2ra-Hw9-Q5km5koiHVs8QzcOqE-XNA-IF1IxqCf6ZnVRsPfFRxi2oiFFOGQQuhPYPgX9oZQBupUnhVnmDnJEtAcjvcXQ8rN5CZuHDuhbQFJ-FtDOIgcq9JkJO0EHRKrZGeEz8sZfu3ju_Z2bmrJswi026y1hanrRyTc9Jf2ecZoNTjV1tQfZ1JH2PMoyBGwPdm1qkhZZJufUMW8JkclYzvQb2A1Wn9WbLNv7IfvvvhkwXj_sVeteetyFMKROul0uY1DQM_bqG_HJJgT5exi1OfQqIyIXA9hklXYbwcM04RBRMGzU1cJRRZ0cnxtpHwDYhQJR58mecoqDtju8oZemYxfugMPg1hdDBgEQ9l-YZvlO7nJmh-4vJdJ6-QTYVl3Jk90BRr2zGFMwlXaU9CtJEYxZYgLCqPw-L7wacmAppIx-NdHLf4AhL-QJgJ6rzR2RUeetu699-UPdkLXEIDGGpNQKHqcw8fW2H1xdyt6cN-jLP_HwqonnfaPpGqDFiHHOZ5NfPKPWVP3JP3LFb-k8ErkJXuOPRXGEea9_0HAmgAPEa5ZwWRmNHdIshuGFH8EL5gqcFEnq6CHK1q8y6gwN_a23UBNR8D_lbEcASUphcUwh05qAS0bWk6qGceoTCEdLjAstO4r5SJmRbdt9INCvgTREAjk6SMXrG6tgzj1PxM4M_KTS7H8zmRETYhLln1sEkahJIHrxV7ZGN9upeVzg18eSq6orAcjHzmA6Cv_BCp9WEP5vojQvvt3cEEWe1yL7Ls0YEXJ4TBe2U5kZJbYipeYu6Lt3NKU1nfEZDtEt3Kfjw7Yxov6oTIgEdGBaoDvCQ_A.CeL9chiYNDHdopVfQx-qEw";
  private static final String ENTITY = "UIPoGrid";
  private static final String FEATURE = "Create";

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    httpServletRequest = mock(HttpServletRequest.class);
    when(httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(AUTH_TOKEN);
    mockRestTemplateResponse();
  }

  private void mockRestTemplateResponse() {
    MultiValueMap<String, String> parametersMap = new LinkedMultiValueMap<>();
    parametersMap.add(HttpHeaders.AUTHORIZATION, AUTH_TOKEN);
    RequestEntity<String> requestEntity = new RequestEntity<>(parametersMap, null, null);
    ResponseEntity<String> value = new ResponseEntity<>(USER_INFO_TOKEN, HttpStatus.OK);
    when(restTemplate.exchange(ECB_SECURITY_USERINFO_URL, HttpMethod.GET, requestEntity,
        String.class)).thenReturn(value);

  }

  @Test(expected = EcbBaseRuntimeException.class)
  public void testGetUserInfoTokenNull() throws Exception {
    MultiValueMap<String, String> parametersMap = new LinkedMultiValueMap<>();
    parametersMap.add(HttpHeaders.AUTHORIZATION, AUTH_TOKEN);
    RequestEntity<String> requestEntity = new RequestEntity<>(parametersMap, null, null);
    when(restTemplate.exchange(ECB_SECURITY_USERINFO_URL, HttpMethod.GET, requestEntity,
        String.class)).thenReturn(userInfoTokenRes);
    userCapabilitiesServiceImpl.findUserCapabilities(httpServletRequest);
    Assert.fail();
  }

  @Test
  public void testfindUserCapabilitiesPerFeature() throws EcbBaseException {
    when(uICapsUtil.doesUserHasCapabilitiesForWidget(ENTITY, FEATURE, USER_INFO_TOKEN))
        .thenReturn(Boolean.TRUE);
    Boolean userCapsPerFeatureRes = userCapabilitiesServiceImpl
        .findUserCapabilitiesPerFeature(httpServletRequest, ENTITY, FEATURE);
    Assert.assertNotNull(userCapsPerFeatureRes);
    Assert.assertTrue(userCapsPerFeatureRes);
  }

  @Test
  public void testFindUserCapabilities() throws Exception {

    Map<String, Map<String, Boolean>> UICapsUtilresponse = new HashMap<>();
    Map<String, Boolean> featureMap = new HashMap<>();
    featureMap.put(FEATURE, true);
    UICapsUtilresponse.put(ENTITY, featureMap);

    when(uICapsUtil.retrieveUserUICapabilities(USER_INFO_TOKEN)).thenReturn(UICapsUtilresponse);
    Map<String, Map<String, Boolean>> userCapsServiceImplResponse =
        userCapabilitiesServiceImpl.findUserCapabilities(httpServletRequest);

    Assert.assertNotNull(userCapsServiceImplResponse);
    Assert.assertEquals(true, userCapsServiceImplResponse.get("UIPoGrid").get("Create"));

  }

}
