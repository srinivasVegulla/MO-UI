package com.ericsson.ecb.ui.metraoffer.model;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

public class RatesDto {

  private Integer subscriptionCount;

  private List<RateDto> rates;

  private Integer ratingType;

  public RatesDto() {
    rates = new ArrayList<>();
  }

  public Integer getSubscriptionCount() {
    return subscriptionCount;
  }

  public void setSubscriptionCount(Integer subscriptionCount) {
    this.subscriptionCount = subscriptionCount;
  }

  public List<RateDto> getRates() {
    return rates;
  }

  public Integer getRatingType() {
    return ratingType;
  }

  public void setRatingType(Integer ratingType) {
    this.ratingType = ratingType;
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
