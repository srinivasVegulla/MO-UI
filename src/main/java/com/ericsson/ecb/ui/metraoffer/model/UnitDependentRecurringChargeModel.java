package com.ericsson.ecb.ui.metraoffer.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.ericsson.ecb.catalog.model.UnitDependentRecurringChargeTemplate;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.ui.metraoffer.constants.Constants;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemRecurringService.BiWeeklyInterval;
import com.fasterxml.jackson.annotation.JsonIgnore;

import springfox.documentation.annotations.ApiIgnore;

public class UnitDependentRecurringChargeModel extends UnitDependentRecurringChargeTemplate {

  private static final long serialVersionUID = 1L;

  private Collection<ExtendedProperty> extendedProperties;

  private PropertyKind kindType;

  private String typeDisplayName;

  private Boolean adjustmetWidget;

  private Boolean delete;

  private List<BigDecimal> sortedEnumValues = new ArrayList<>();

  private List<BiWeeklyInterval> biWeeklyIntervals = new ArrayList<>();

  public UnitDependentRecurringChargeModel() {
    extendedProperties = new ArrayList<>();
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

  public PropertyKind getKindType() {
    return kindType;
  }

  public void setKindType(PropertyKind kindType) {
    this.kindType = kindType;
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

  public List<BigDecimal> getSortedEnumValues() {
    return sortedEnumValues;
  }

  public List<BiWeeklyInterval> getBiWeeklyIntervals() {
    return biWeeklyIntervals;

  }
}
