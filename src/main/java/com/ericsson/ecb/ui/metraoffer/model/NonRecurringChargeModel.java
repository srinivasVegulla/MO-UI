package com.ericsson.ecb.ui.metraoffer.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

import com.ericsson.ecb.catalog.model.NonRecurringChargeTemplate;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.ui.metraoffer.constants.Constants;
import com.fasterxml.jackson.annotation.JsonIgnore;

import springfox.documentation.annotations.ApiIgnore;

public class NonRecurringChargeModel extends NonRecurringChargeTemplate {

  private static final long serialVersionUID = 1L;

  private Collection<ExtendedProperty> extendedProperties;

  private String typeDisplayName;

  private Boolean adjustmetWidget;

  private Boolean delete;

  public NonRecurringChargeModel() {
    extendedProperties = new ArrayList<>();
  }

  public PropertyKind getKindType() {
    return PropertyKind.NON_RECURRING;
  }

  @JsonIgnore
  @ApiIgnore
  @Override
  public PropertyKind getKind() {
    return null;
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

  public Boolean getDelete() {
    return delete;
  }

  public void setDelete(Boolean delete) {
    this.delete = delete;
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
}
