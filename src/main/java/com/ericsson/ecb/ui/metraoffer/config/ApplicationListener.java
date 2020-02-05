package com.ericsson.ecb.ui.metraoffer.config;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.netflix.eureka.EurekaDiscoveryClient.EurekaServiceInstance;
import org.springframework.context.ApplicationContext;
import org.springframework.context.SmartLifecycle;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.ericsson.ecb.common.dto.EcbAppInfo;
import com.ericsson.ecb.common.exception.EcbBaseRuntimeException;
import com.netflix.appinfo.ApplicationInfoManager;
import com.netflix.appinfo.InstanceInfo;

/**
 * Created by gjwilk on 10/6/17.
 */
@Component
public class ApplicationListener implements SmartLifecycle {
  private static final Logger logger = LoggerFactory.getLogger(ApplicationListener.class);

  private static final String IMPL_NAME = "Implementation-Title";
  private static final String IMPL_VERSION = "Implementation-Version";
  private static final String IMPL_TIMESTAMP = "Implementation-Timestamp";
  private static final String SECURE_PROTOCOL = "https://";
  private static final String COLON = ":";
  private static final String ENDPOINT_URL = "/refresh";

  /**
   * The set of known API Providers (Protected Resources)
   */
  protected static final Set<String> apiProviders =
      Collections.unmodifiableSet(new HashSet<>(Arrays.asList("ecb-metraoffer", "ecb-billing",
          "ecb-product-catalog", "ecb-customer", "ecb-foundation", "ecb-metadata", "ecb-pricing")));

  private RestTemplate restTemplate;

  private DiscoveryClient discoveryClient;

  private EcbAppInfo appInfo;

  @Value("${eureka.instance.preferIpAddress:#{false}}")
  private boolean preferIpAddress;

  @Autowired
  private ApplicationContext applicationContext;

  @Autowired
  private HttpServletRequest httpServletRequest;

  public ApplicationListener(DiscoveryClient discoveryClient,
      RestTemplateBuilder restTemplateBuilder) {

    this.discoveryClient = discoveryClient;
    this.restTemplate = restTemplateBuilder.build();
  }

  @Override
  public void start() {
    updateApplicationMetadata();
  }

  @Override
  public void stop() {
    logger.info("stop has been invoked...");
  }

  @Override
  public void stop(final Runnable callback) {
    logger.info("Shudown initiated...");
  }

  @Override
  public boolean isRunning() {
    return false;
  }

  @Override
  public boolean isAutoStartup() {
    return true;
  }

  /**
   * Returning Integer.MAX_VALUE only suggests that this will be last bean to start, ensuring that
   * Eureka client is initialized before this bean.
   */
  @Override
  public int getPhase() {
    return Integer.MAX_VALUE;
  }

  public EcbAppInfo getAppInfo() {
    return this.appInfo;
  }

  /**
   * Refresh endpoints for all API services from Eureka Dashboard
   * 
   * @return the status of refresh applications
   */
  public String ecbAppRefresh() {
    logger.info("ECB-Application Refresh event start....");
    executeEcbRefreshEndpoints();
    logger.info("ECB-Application Refresh event end....");
    return HttpStatus.OK.name();
  }

  /**
   * This function extracts jar build version information and sets it in the application metadata
   * sent to Eureka registry server for future reference.
   */
  @SuppressWarnings("deprecation")
  private synchronized void updateApplicationMetadata() {
    try {
      Map<String, String> metadata = new HashMap<>();
      Properties buildProps = new Properties();
      buildProps.load(this.getClass().getClassLoader().getResourceAsStream("build.properties"));
      this.appInfo = new EcbAppInfo().setName(buildProps.getProperty(IMPL_NAME))
          .setInstanceId(this.applicationContext.getId())
          .setVersion(buildProps.getProperty(IMPL_VERSION))
          .setTimestamp(buildProps.getProperty(IMPL_TIMESTAMP));

      metadata.put(IMPL_NAME, this.appInfo.getName());
      metadata.put(IMPL_VERSION, this.appInfo.getVersion());
      metadata.put(IMPL_TIMESTAMP, this.appInfo.getTimestamp());
      ApplicationInfoManager.getInstance().registerAppMetadata(metadata);
    } catch (Exception e) {
      logger.info("Error updating application metadata. "
          + "Possible cause - build.properties file was not generated during build. "
          + "This condition can be ignored in development.");
    }
  }

  /**
   * Executing the refresh endpoints
   */
  private void executeEcbRefreshEndpoints() {
    RequestEntity<String> requestEntity = createRequestEntity();
    List<String> urlList = getCandidateUrls();
    List<String> errorEndpoints = new ArrayList<>();

    if (!CollectionUtils.isEmpty(urlList)) {
      urlList.forEach(executeEnpoint -> {
        Runnable task = () -> restTemplate.exchange(executeEnpoint, HttpMethod.POST, requestEntity,
            String.class);
        Thread taskExecutor = new Thread(task);
        taskExecutor.setUncaughtExceptionHandler((Thread thread, Throwable e) -> {
          errorEndpoints.add(executeEnpoint);
          logger.error("Refresh failing application :{}", executeEnpoint, e);
        });
        taskExecutor.start();
      });
    }
    if (!errorEndpoints.isEmpty()) {
      logger.error("Access Denied for the configured ECB Applications. {}", errorEndpoints);
      throw new EcbBaseRuntimeException(String
          .format("Refresh functionality failed for Applications : %s", errorEndpoints.toString()));
    }
  }

  private RequestEntity<String> createRequestEntity() {
    MultiValueMap<String, String> parametersMap = new LinkedMultiValueMap<>();
    parametersMap.add(HttpHeaders.AUTHORIZATION,
        httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION));
    return new RequestEntity<>(parametersMap, null, null);
  }

  /**
   * Get refresh endpoints for all API services from Eureka Dashboard
   * 
   * @return endpointsList list of refresh endpoint URLs
   */
  private List<String> getCandidateUrls() {
    List<String> svcList = discoveryClient.getServices();
    List<String> endpointsList = new ArrayList<>();

    for (String svcId : svcList) {
      for (ServiceInstance instance : discoveryClient.getInstances(svcId)) {
        InstanceInfo instanceInfo = ((EurekaServiceInstance) instance).getInstanceInfo();
        String host = preferIpAddress ? instanceInfo.getIPAddr() : instanceInfo.getHostName();
        if (apiProviders.contains(instanceInfo.getAppName().toLowerCase())) {
          String url = SECURE_PROTOCOL + host + COLON + instanceInfo.getSecurePort() + ENDPOINT_URL;
          logger.debug("Refresh ECB Application name  : {} and Refresh endpoint url : {}",
              instanceInfo.getAppName(), url);
          endpointsList.add(url);
        }
      }
    }
    return endpointsList;
  }
}
