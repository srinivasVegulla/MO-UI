package com.ericsson.ecb.ui.metraoffer.model;

import java.time.OffsetDateTime;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.ericsson.ecb.catalog.model.instance.EffectiveDateMode;

public class ParamTableRateSchedule {

  private Integer schedId;
  private String name;
  private String displayName;
  private String description;
  private Integer pricelistId;
  private String pricelistName;
  private String pricelistType;
  private Integer itemTemplateId;
  private String itemTemplateDisplayName;
  private OffsetDateTime startDate;
  private EffectiveDateMode startDateType;
  private Integer startDateOffset;
  private OffsetDateTime endDate;
  private EffectiveDateMode endDateType;
  private Integer endDateOffset;
  private Integer ruleCount;

  public Integer getSchedId() {
    return schedId;
  }

  public void setSchedId(Integer schedId) {
    this.schedId = schedId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDisplayName() {
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

  public Integer getPricelistId() {
    return pricelistId;
  }

  public void setPricelistId(Integer pricelistId) {
    this.pricelistId = pricelistId;
  }

  public String getPricelistName() {
    return pricelistName;
  }

  public void setPricelistName(String pricelistName) {
    this.pricelistName = pricelistName;
  }

  public String getPricelistType() {
    return pricelistType;
  }

  public void setPricelistType(String pricelistType) {
    this.pricelistType = pricelistType;
  }

  public Integer getItemTemplateId() {
    return itemTemplateId;
  }

  public void setItemTemplateId(Integer itemTemplateId) {
    this.itemTemplateId = itemTemplateId;
  }

  public String getItemTemplateDisplayName() {
    return itemTemplateDisplayName;
  }

  public void setItemTemplateDisplayName(String itemTemplateDisplayName) {
    this.itemTemplateDisplayName = itemTemplateDisplayName;
  }

  public OffsetDateTime getStartDate() {
    return startDate;
  }

  public void setStartDate(OffsetDateTime startDate) {
    this.startDate = startDate;
  }

  public EffectiveDateMode getStartDateType() {
    return startDateType;
  }

  public void setStartDateType(EffectiveDateMode startDateType) {
    this.startDateType = startDateType;
  }

  public Integer getStartDateOffset() {
    return startDateOffset;
  }

  public void setStartDateOffset(Integer startDateOffset) {
    this.startDateOffset = startDateOffset;
  }

  public OffsetDateTime getEndDate() {
    return endDate;
  }

  public void setEndDate(OffsetDateTime endDate) {
    this.endDate = endDate;
  }

  public EffectiveDateMode getEndDateType() {
    return endDateType;
  }

  public void setEndDateType(EffectiveDateMode endDateType) {
    this.endDateType = endDateType;
  }

  public Integer getEndDateOffset() {
    return endDateOffset;
  }

  public void setEndDateOffset(Integer endDateOffset) {
    this.endDateOffset = endDateOffset;
  }

  public Integer getRuleCount() {
    return ruleCount;
  }

  public void setRuleCount(Integer ruleCount) {
    this.ruleCount = ruleCount;
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
