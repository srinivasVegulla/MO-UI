package com.ericsson.ecb.ui.metraoffer.utils;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.netflix.eureka.EurekaDiscoveryClient.EurekaServiceInstance;

import com.ericsson.ecb.oauth2.store.OpenIdRole;
import com.ericsson.ecb.oauth2.util.UrlHelper;
import com.netflix.appinfo.InstanceInfo;

public class RpUrlHelper extends UrlHelper {
  private static final Logger logger = LoggerFactory.getLogger(RpUrlHelper.class);

  DiscoveryClient discoveryClient;

  @Value("${eureka.instance.preferIpAddress:#{false}}")
  private boolean preferIpAddress;

  public RpUrlHelper(DiscoveryClient discoveryClient) {
    super();
    this.discoveryClient = discoveryClient;
  }

  @Override
  public List<String> getCandidateUrls(String role, String path) {
    List<String> urlList = new ArrayList<>();

    List<String> svcList = this.discoveryClient.getServices();

    List<String> roleList = null;

    if (OpenIdRole.OP.equals(role)) {
      roleList = opList;
    } else {
      String msg = ">>> '" + role + "' Is An Invalid OpenID Partner Role For 'AP'";
      logger.error(msg);
    }

    if (roleList != null) {
      for (String svcId : svcList) {
        if (roleList.contains(svcId)) {
          urlList.addAll(getUrlsForSvcId(path, svcId));
        }
      }
    }

    return urlList;
  }

  @Override
  public List<String> getUrlsForSvcId(String path, String svcId) {
    List<String> urlList = new ArrayList<>(discoveryClient.getInstances(svcId).size());
    for (ServiceInstance instance : discoveryClient.getInstances(svcId)) {
      InstanceInfo instanceInfo = ((EurekaServiceInstance) instance).getInstanceInfo();
      String host = preferIpAddress ? instanceInfo.getIPAddr() : instanceInfo.getHostName().toLowerCase();
      if (UrlHelper.getOpList().contains(svcId)) {
        path = "/uaa" + path;
      }
      String url = "https://" + host + ":" + instanceInfo.getSecurePort() + path;
      urlList.add(url);
    }
    
    return urlList;
  }
}
