package com.ericsson.ecb.ui.metraoffer;

import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.test.context.ActiveProfiles;
import com.ericsson.ecb.ui.metraoffer.config.WebSecurityConfiguration;

//@RunWith(SpringRunner.class)
@SpringBootTest(classes = {EcbMetraOfferApplication.class})
@ActiveProfiles("it")
public class EcbMetraOfferApplicationTest {

  @MockBean
  private JwtAccessTokenConverter nimbus;

  @TestConfiguration
  static class TestContextConfiguration {

  }

  @Test
  public void contextLoads() {

  }

  @SuppressWarnings("unused")
  @Test
  public void testTokenConverter () {
    DiscoveryClient discoveryClient = Mockito.mock(DiscoveryClient.class);
    WebSecurityConfiguration config = new WebSecurityConfiguration(discoveryClient);
  }
}
