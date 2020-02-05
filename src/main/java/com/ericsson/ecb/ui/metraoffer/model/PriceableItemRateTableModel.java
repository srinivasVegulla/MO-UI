package com.ericsson.ecb.ui.metraoffer.model;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

public class PriceableItemRateTableModel {

  private String instanceTablename;

  private Integer paramtableId;

  private String name;

  private String displayName;

  private String description;

  private String decisionTypeName;

  public String getInstanceTablename() {
    return instanceTablename;
  }

  public void setInstanceTablename(String instanceTablename) {
    this.instanceTablename = instanceTablename;
  }

  public Integer getParamtableId() {
    return paramtableId;
  }

  public void setParamtableId(Integer paramtableId) {
    this.paramtableId = paramtableId;
  }

  public String getDisplayName() {
    if (StringUtils.isBlank(this.displayName))
      return this.name;
    return displayName;
  }

  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getDecisionTypeName() {
    return decisionTypeName;
  }

  public void setDecisionTypeName(String decisionTypeName) {
    this.decisionTypeName = decisionTypeName;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  @Override
  public int hashCode() {
    return HashCodeBuilder.reflectionHashCode(this, false);
  }

  @Override
  public boolean equals(Object o) {
    return EqualsBuilder.reflectionEquals(this, o, false);
  }

  @Override
  public String toString() {
    return ToStringBuilder.reflectionToString(this);
  }
}
