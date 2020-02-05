package com.ericsson.ecb.ui.metraoffer.model;

import java.time.OffsetDateTime;

import com.ericsson.ecb.base.model.AuditAggregator;

public class AuditSummary extends AuditAggregator {

  private static final long serialVersionUID = 1L;
  
  private String user;

  private OffsetDateTime ruleSetStartDate;

  public String getUser() {
    return user;
  }

  public void setUser(String user) {
    this.user = user;
  }

  public OffsetDateTime getRuleSetStartDate() {
    return ruleSetStartDate;
  }

  public void setRuleSetStartDate(OffsetDateTime ruleSetStartDate) {
    this.ruleSetStartDate = ruleSetStartDate;
  }

}
