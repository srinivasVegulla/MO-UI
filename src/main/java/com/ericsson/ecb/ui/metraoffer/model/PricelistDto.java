package com.ericsson.ecb.ui.metraoffer.model;

import java.util.Collection;

import com.ericsson.ecb.catalog.model.PricelistWithInUse;

public class PricelistDto extends PricelistWithInUse {

  private static final long serialVersionUID = 1L;

  private Collection<ExtendedProperty> extendedProperties;

  public Collection<ExtendedProperty> getExtendedProperties() {
    return extendedProperties;
  }

  public void setExtendedProperties(Collection<ExtendedProperty> extendedProperties) {
    this.extendedProperties = extendedProperties;
  }

}
