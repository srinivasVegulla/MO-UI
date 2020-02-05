package com.ericsson.ecb.ui.metraoffer.model;

import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

public class PricelistMappingModel {

  private Integer offerId;

  private String offerName;

  private String offerDisplayName;

  private Map<String, List<PricelistMappingVO>> pricelistMappingVO;

  public Integer getOfferId() {
    return offerId;
  }

  public void setOfferId(Integer offerId) {
    this.offerId = offerId;
  }

  public String getOfferName() {
    return offerName;
  }

  public void setOfferName(String offerName) {
    this.offerName = offerName;
  }

  public String getOfferDisplayName() {
    return offerDisplayName;
  }

  public void setOfferDisplayName(String offerDisplayName) {
    this.offerDisplayName = offerDisplayName;
  }

  public Map<String, List<PricelistMappingVO>> getPricelistMappingVO() {
    return pricelistMappingVO;
  }

  public void setPricelistMappingVO(Map<String, List<PricelistMappingVO>> pricelistMappingVO) {
    this.pricelistMappingVO = pricelistMappingVO;
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
