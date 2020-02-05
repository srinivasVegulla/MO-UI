package com.ericsson.ecb.ui.metraoffer.service;

import static org.mockito.Mockito.when;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;

import com.ericsson.ecb.oauth2.service.Context;
import com.ericsson.ecb.oidc.service.RpClientRegistrationService;
import com.ericsson.ecb.ui.metraoffer.common.OauthClientInfoCache;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.OauthClientInfoServiceImpl;
import com.nimbusds.oauth2.sdk.client.ClientInformation;

public class OauthClientInfoServiceImplTest {

  @InjectMocks
  private OauthClientInfoServiceImpl oauthClientInfoServiceImpl;


  @InjectMocks
  private OauthClientInfoCache oauthClientInfoCache2;


  @Mock
  private OauthClientInfoCache oauthClientInfoCache;

  @Mock
  private RpClientRegistrationService rpClientRegistrationService;


  @Mock
  private Context ctx;

  @Mock
  private Environment env;

  @Autowired
  private ClientInformation value;

  private static final String TILD = "~";
  private static final String LEGACY = "legacy";
  private static final String TRUSTED = "trusted";
  private static final String TICKET = "ticket";
  private static final String APP_NAME = "ecb-metraoffer";
  private static final String APP_ID = "2573b241-c7a4-3670-9ab8-ab153c74231e";
  private static final String DBS_ID = "0ddd3ed0-3ede-35c7-bb0a-a4dac582c5fc";
  private static final String DBS_MARK =
      "sqlserver~sathya-vm.metratech.com~1433~NetMeter~sa~MetraTech1";
  private static final String APP_MARK = "sathya-vm.metratech.com~8074~ecb-metraoffer";

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
  }


  @Test
  public void shouldGetClientInfo() throws Exception {
    when(ctx.getAppMark()).thenReturn(APP_MARK);
    when(ctx.getDbsMark()).thenReturn(DBS_MARK);
    when(ctx.getAppName()).thenReturn(APP_NAME);
    when(rpClientRegistrationService.read(APP_ID, DBS_ID, "{" + APP_NAME + TILD + LEGACY + "}"))
        .thenReturn(value);
    when(oauthClientInfoCache2.getClientInfo(LEGACY)).thenReturn(value);
    oauthClientInfoServiceImpl.getLegacyClientInfo();
  }

  @Test
  public void shouldTrustedGetClientInfo() throws Exception {
    when(ctx.getAppMark()).thenReturn(APP_MARK);
    when(ctx.getDbsMark()).thenReturn(DBS_MARK);
    when(ctx.getAppName()).thenReturn(APP_NAME);
    when(rpClientRegistrationService.read(APP_ID, DBS_ID, "{" + APP_NAME + TILD + TRUSTED + "}"))
        .thenReturn(value);
    when(oauthClientInfoCache2.getClientInfo(TRUSTED)).thenReturn(value);
    oauthClientInfoServiceImpl.getTrustedClientInfo();
  }

  @Test
  public void shouldGetTicketClientInfo() throws Exception {
    when(ctx.getAppMark()).thenReturn(APP_MARK);
    when(ctx.getDbsMark()).thenReturn(DBS_MARK);
    when(ctx.getAppName()).thenReturn(APP_NAME);
    when(rpClientRegistrationService.read(APP_ID, DBS_ID, "{" + APP_NAME + TILD + TICKET + "}"))
        .thenReturn(value);
    when(oauthClientInfoCache2.getClientInfo(TICKET)).thenReturn(value);
    oauthClientInfoServiceImpl.getTicketClientInfo();
  }

}
