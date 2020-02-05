package com.ericsson.ecb.ui.metraoffer.service;

import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.netflix.eureka.EurekaDiscoveryClient.EurekaServiceInstance;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;

import com.ericsson.ecb.oauth2.dto.UiTicketInfo;
import com.ericsson.ecb.oauth2.store.RpJwtAccessTokenConverter;
import com.ericsson.ecb.oauth2.ticket.UiTicketHandler;
import com.ericsson.ecb.oauth2.util.Convert;
import com.ericsson.ecb.ui.metraoffer.config.MetranetTicketConfig;
import com.ericsson.ecb.ui.metraoffer.exception.PreconditionFailedException;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.MetranetTicketServiceImpl;
import com.ericsson.ecb.ui.metraoffer.utils.MoErrorMessagesUtil;
import com.netflix.appinfo.InstanceInfo;

public class MetranetTicketServiceImplTest {

  @InjectMocks
  private MetranetTicketServiceImpl metranetTicketServiceImpl;

  @Mock
  private UiTicketHandler uiTicketHandler;

  @Mock
  private DiscoveryClient discoveryClient;

  @Mock
  private MetranetTicketConfig metranetTicketConfig;

  @Mock
  private JwtAccessTokenConverter jwtAccessTokenConverter;

  @Mock
  private RpJwtAccessTokenConverter rpJwtAccessTokenConverter;
  
  @Mock
  private MoErrorMessagesUtil moErrorMessagesUtil;

  String ticket =
      "Bearer eyJraWQiOiJwUFQ4a2siLCJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAtMjU2In0.JyVpYkMM8GftSLWDY-ONYX_9FGw8pGSwUl_7RK0bMnTrNJv007uylQESOE54SQ9aQrUsNg6G19CU_xcGsPfU2P7kYixJQmRNwWCQDqrkDxLvU0NxYCxnUPMq1A5NRGBZt9pwlaQIxVCYsJBWuijd5ENsXHLHh5sksNGW2EpNTL89wULRNT2m46G6oZsPoGAuE13SeT1qU3h8hp4n3W2Wco6g-nhShGk-HSqMwNmI-GrNIfGfquYC1wq8G4b-zTZm5EVby_B_vWPQyfUWLkuvuASQfuUZvXDNgk4gUaJB_le5PFYTZmq-nS8Jc8LMYHnMh0xCVwMv_cjw1OLOAEAuxw.dNNwinObLlibMyxJ.yS93XkCtsk833Jnkpc0ZG6-RPBGmDSLZCFDKrKGy_b-u5-77p3hFZYzk7kYIwOXHWmPn44Qn1NLkzqdNGZj29aVgNqtWmDhPTX6GoQ9wDLKTeF0j3iXOo04hmPy_5COVnITUrwM4fz1smmv87pOI06DLhZbTEMYPt8wgLADCLJAnuRocUvBGkMlOTJzG2OAOKV0_xES26zY2nPgHvToSje09AcsGoaFSIYzUcfVGdbqGjMrRlNkGU8qyAt4-XNpeEOF1D4NR9vbyQhpnVwUbMC2IERNGSN040Mw9BQewNif_MvSfEXaQENOW-D7MYPpfj3oh7rRLNb6Enj8nlHcrRWYMvpTZiKqMyaD2R1lcO4bFcsrm3mzFl9lwAKuZ3qEudo5qJPthD33_MRlzoBfE_916Rq6R8hvavmMr72PYpqvMZI__0ItaNYqpqP6f8dNSKZHL098BTnsXn85kmBsmGkogXn03xrMK9hb9Vyuc5HtdmhEvAFg8LJ57yV1nh5VdbPqIG6gDfHPj0jyDe16Rtg3mTIEXsdPo_6necp8ENbZ5T2--NO0h6KuPJfLIdyUjDKXXUPGDNwwoB1FzhwplmoDH6XfXfYd1POXx62oS4cCLLnf97CYoGaXT474dwi23-U9JEZKUaoqjIxXOEAVX9mSr1xOGJAmZV9enUbEqSWa4yTspmHd5tMngohmPNcUQNYHvt-sNqT_82ZixCDCBaASFFh2Qb1xp3O2w1HL1EcxVVAVwKJx1vN_TxnKfpwbW2nPgYcN8gHZs8_4CdPVzkMmEZtgxvP12o6Hjh38kPfDfpL72YCgx2PqwqjU3CXp8UkZAWb_50VTTLmKoyjhdDBYXgBrtHfOBcuKW_w3bKMD8RR10CbjoqV8ZymgpKFBCyv_uqztZQNpXzEDqn27H60hzfAIibVRmDWXPrqJjQLKU6XD-L8WiRc6d0NtCNQYEv5JQTBVduPGlqINYK_mBqVW4r_IDAEQwGsEpNy-WxrWr6aXJadqgTMeQgIia-CML2GJU03yN5FPcE0kiucb2JoKUVzJYKdt9b7-CLaOP4rP6ycemk1bkXD1MGdWH780tbQZexHTH6_j_UTdzkdll0t2zyil8-g6z76r85WavaEagl2ei8FUA1SA12q99X2_5zYJ17HSeFoTWQwnJr4f-CQLrGrvbuisvLXvBgLePNz-E-kq7kAcNlK257CaPYnXodpO71qU5IkyAslJxNR90kcBBEjEJDJMdR_hAmTXVfVP6Cj-v8pdErQs5RUICfhh20iKreH8wtNIrk91VmfKqXbweX67FBgbPgtyF5yTowYxiIvwfpHWubir67eWsif6hXxQ-CB7Ri-cDQ7BIj8HF36Vievq8VcnNn0xD8efWthKiFQ.adZBcMsVTXcehQEcBPpCRg";


  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
  }

  @Test(expected = PreconditionFailedException.class)
  public void shouldGetAccessWithEncryptedJwt() throws Exception {
    UiTicketInfo uiTicketInfo = Mockito.mock(UiTicketInfo.class);
    Date now = new Date();
    when(uiTicketInfo.getExpirationDate())
        .thenReturn(Date.from(now.toInstant().plusMillis(600000)));
    when(uiTicketInfo.getNameSpace()).thenReturn("mt");
    when(uiTicketInfo.getUserName()).thenReturn("admin");
    when(uiTicketHandler.decryptMetranetUiTicket(Convert.fromBase64UrlToBase64(ticket)))
        .thenReturn(uiTicketInfo);

    List<String> services = new ArrayList<>();
    services.add("ECB-SECURITY");
    when(discoveryClient.getServices()).thenReturn(services);

    List<ServiceInstance> serviceInstances = new ArrayList<>();
    EurekaServiceInstance serviceInstance = Mockito.mock(EurekaServiceInstance.class);
    InstanceInfo instanceInfo = Mockito.mock(InstanceInfo.class);
    when(instanceInfo.getSecurePort()).thenReturn(8074);
    when(instanceInfo.getHostName()).thenReturn("hostName.metratech.com");
    when(serviceInstance.getInstanceInfo()).thenReturn(instanceInfo);
    serviceInstances.add(serviceInstance);
    when(discoveryClient.getInstances("ECB-SECURITY")).thenReturn(serviceInstances);
    when(metranetTicketConfig.getJwtAssertionTimeToLive()).thenReturn(100);

    metranetTicketServiceImpl.getAccessWithEncryptedJwt(ticket, false);
  }
}
