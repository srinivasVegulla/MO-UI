package com.ericsson.ecb.ui.metraoffer.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.ericsson.ecb.ui.metraoffer.service.PriceableItemRecurringService.BiWeeklyInterval;


import com.ericsson.ecb.catalog.model.PriceableItemInstanceDetails;

public class PriceableItemInstanceDetailsModel extends PriceableItemInstanceDetails {

  private static final long serialVersionUID = 1L;

  private Boolean adjustmetWidget;

  private List<ExtendedProperty> extendedProps;

  private List<BigDecimal> sortedEnumValues = new ArrayList<>();
  
  private List<BiWeeklyInterval>  biWeeklyIntervals = new ArrayList<>();

  public List<ExtendedProperty> getExtendedProps() {
    return extendedProps;
  }

  public void setExtendedProps(List<ExtendedProperty> extendedProps) {
    this.extendedProps = extendedProps;
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
