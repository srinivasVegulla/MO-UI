package com.ericsson.ecb.ui.metraoffer.model;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.ericsson.ecb.common.model.PropertyKind;

public class Localization {

  private Integer propId;

  private String propName;

  private String kindType;

  private String property;

  private PropertyKind kind;

  private Integer descId;

  private Map<String, String> localizationMap = new HashMap<>();

  public Integer getPropId() {
    return propId;
  }

  public void setPropId(Integer propId) {
    this.propId = propId;
  }

  public String getPropName() {
    return propName;
  }

  public void setPropName(String propName) {
    this.propName = propName;
  }

  public String getKindType() {
    return kindType;
  }

  public void setKindType(String kindType) {
    this.kindType = kindType;
  }

  public String getProperty() {
    return property;
  }

  public void setProperty(String property) {
    this.property = property;
  }

  public PropertyKind getKind() {
    return kind;
  }

  public void setKind(PropertyKind kind) {
    this.kind = kind;
  }

  public Integer getDescId() {
    return descId;
  }

  public void setDescId(Integer descId) {
    this.descId = descId;
  }

  public Map<String, String> getLocalizationMap() {
    return localizationMap;
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
