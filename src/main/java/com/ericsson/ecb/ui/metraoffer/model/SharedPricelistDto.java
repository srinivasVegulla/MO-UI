package com.ericsson.ecb.ui.metraoffer.model;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

public class SharedPricelistDto {

  private Integer templateId;

  private Integer ptId;

  private Integer pricelistId;

  private Integer refId;

  private Integer templateParentId;

  public Integer getTemplateParentId() {
    return templateParentId;
  }

  public void setTemplateParentId(Integer templateParentId) {
    this.templateParentId = templateParentId;
  }

  public Integer getTemplateId() {
    return templateId;
  }

  public void setTemplateId(Integer templateId) {
    this.templateId = templateId;
  }

  public Integer getPtId() {
    return ptId;
  }

  public void setPtId(Integer ptId) {
    this.ptId = ptId;
  }

  public Integer getPricelistId() {
    return pricelistId;
  }

  public void setPricelistId(Integer pricelistId) {
    this.pricelistId = pricelistId;
  }

  public Integer getRefId() {
    return refId;
  }

  public void setRefId(Integer refId) {
    this.refId = refId;
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
