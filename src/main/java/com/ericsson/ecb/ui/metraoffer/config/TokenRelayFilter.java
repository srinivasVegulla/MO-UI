package com.ericsson.ecb.ui.metraoffer.config;

import java.util.Set;

import org.springframework.stereotype.Component;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;

@Component
public class TokenRelayFilter extends ZuulFilter {
  @SuppressWarnings("unchecked")
  @Override
  public Object run() {
    RequestContext ctx = RequestContext.getCurrentContext();

    Set<String> headers = (Set<String>) ctx.get("ignoredHeaders");
    // We need our JWT tokens relayed to resource servers
    headers.remove("authorization");

    return null;
  }

  @Override
  public boolean shouldFilter() {
    return true;
  }

  @Override
  public String filterType() {
    return "pre";
  }

  @Override
  public int filterOrder() {
    return 10000;
  }
}
