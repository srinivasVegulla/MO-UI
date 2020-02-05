package com.ericsson.ecb.ui.metraoffer.model;

import com.ericsson.ecb.base.model.ApprovalsV2;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class Approvals extends ApprovalsV2 {

  private static final long serialVersionUID = 1L;

  @Override
  @JsonIgnore
  public String getChangeDetails() {
    return super.getChangeDetails();
  }

  @Override
  @JsonIgnore
  public String getActualDetails() {
    return super.getActualDetails();
  }

  @Override
  @JsonIgnore
  public String getHttpHeaders() {
    return super.getHttpHeaders();
  }

  @Override
  @JsonIgnore
  public String getUri() {
    return super.getUri();
  }

  @Override
  @JsonIgnore
  public String getHttpVerb() {
    return super.getHttpVerb();
  }

  @Override
  @JsonIgnore
  public String getServiceId() {
    return super.getServiceId();
  }

  @Override
  @JsonIgnore
  public Integer getPartitionId() {
    return super.getPartitionId();
  }
}
