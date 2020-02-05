package com.ericsson.ecb.ui.metraoffer.model;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

public class AdjustmentTypeModel {

  private Integer adjustmentTypeId;

  private Integer propId;

  private Integer itemTypeId;

  private String name;

  private String displayName;
  
  private Integer displayNameId;

  private String description;
  
  private Integer descriptionId;

  public Integer getAdjustmentTypeId() {
    return adjustmentTypeId;
  }

  public void setAdjustmentTypeId(Integer adjustmentTypeId) {
    this.adjustmentTypeId = adjustmentTypeId;
  }

  public Integer getPropId() {
    return propId;
  }

  public void setPropId(Integer propId) {
    this.propId = propId;
  }

  public Integer getItemTypeId() {
    return itemTypeId;
  }

  public void setItemTypeId(Integer itemTypeId) {
    this.itemTypeId = itemTypeId;
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

  public Integer getDisplayNameId() {
    return displayNameId;
  }

  public void setDisplayNameId(Integer displayNameId) {
    this.displayNameId = displayNameId;
  }

  public Integer getDescriptionId() {
    return descriptionId;
  }

  public void setDescriptionId(Integer descriptionId) {
    this.descriptionId = descriptionId;
  }
}
