package com.ericsson.ecb.ui.metraoffer.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.ericsson.ecb.catalog.model.PriceableItemTemplateWithInUse;
import com.ericsson.ecb.catalog.model.UsagePriceableItemTemplate;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.ui.metraoffer.constants.Constants;
import com.fasterxml.jackson.annotation.JsonIgnore;

import springfox.documentation.annotations.ApiIgnore;

public class UsagePriceableItemModel extends UsagePriceableItemTemplate {

  private static final long serialVersionUID = 1L;

  private Collection<ExtendedProperty> extendedProperties;

  private String typeDisplayName;

  private Boolean adjustmetWidget;

  private Integer templateId;

  public UsagePriceableItemModel() {
    this.childs = new ArrayList<>();
    extendedProperties = new ArrayList<>();
  }

  private Collection<PriceableItemTemplateWithInUse> childs;

  public PropertyKind getKindType() {
    return PropertyKind.USAGE;
  }

  @JsonIgnore
  @ApiIgnore
  @Override
  public PropertyKind getKind() {
    return PropertyKind.USAGE;
  }


  public Collection<PriceableItemTemplateWithInUse> getChilds() {
    return childs;
  }

  public void setChilds(Collection<PriceableItemTemplateWithInUse> childs) {
    getChilds().addAll(childs);
  }

  public Collection<ExtendedProperty> getExtendedProperties() {
    return extendedProperties;
  }

  public void setExtendedProperties(Collection<ExtendedProperty> extendedProperties) {
    this.extendedProperties.clear();
    this.extendedProperties.addAll(extendedProperties);
  }

  public String getChargeType() {
    return Constants.CHARGE_CATEGORY_KIND.get(getKindType());
  }

  public void setProperties(Map<String, Object> properties) {
    getProperties().clear();
    getProperties().putAll(properties);
  }

  public String getTypeDisplayName() {
    return typeDisplayName;
  }

  public void setTypeDisplayName(String typeDisplayName) {
    this.typeDisplayName = typeDisplayName;
  }

  public Boolean getAdjustmetWidget() {
    return adjustmetWidget;
  }

  public void setAdjustmetWidget(Boolean adjustmetWidget) {
    this.adjustmetWidget = adjustmetWidget;
  }

  public Integer getTemplateId() {
    return templateId;
  }

  public void setTemplateId(Integer templateId) {
    this.templateId = templateId;
  }

  @Override
  public boolean equals(Object o) {
    return EqualsBuilder.reflectionEquals(this, o, false);
  }

  @Override
  public int hashCode() {
    return HashCodeBuilder.reflectionHashCode(this, false);
  }

  @Override
  public String toString() {
    return ToStringBuilder.reflectionToString(this);
  }

}
