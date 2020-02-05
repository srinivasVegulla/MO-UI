package com.ericsson.ecb.ui.metraoffer.model;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.ericsson.ecb.catalog.model.PricelistMapping;
import com.ericsson.ecb.catalog.model.instance.PricelistType;

public class RateDto extends PricelistMapping {

  private static final long serialVersionUID = 1L;

  private List<RateScheduleDto> rateSchedules;

  private List<ParameterTableMetadata> properties;

  private PricelistType pricelistType;

  public RateDto() {
    rateSchedules = new ArrayList<>();
    properties = new ArrayList<>();
  }

  public List<RateScheduleDto> getRateSchedules() {
    return rateSchedules;
  }

  public List<ParameterTableMetadata> getProperties() {
    return properties;
  }

  public PricelistType getPricelistType() {
    return pricelistType;
  }

  public void setPricelistType(PricelistType pricelistType) {
    this.pricelistType = pricelistType;
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
