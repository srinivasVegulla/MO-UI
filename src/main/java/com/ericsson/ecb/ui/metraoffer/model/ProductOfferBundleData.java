package com.ericsson.ecb.ui.metraoffer.model;

import java.util.ArrayList;
import java.util.Collection;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ProductOfferBundleData extends ProductOfferData {

  private static final long serialVersionUID = 1L;

  private Boolean editOptionality;

  private Collection<ProductOfferBundleOptionality> poBundleOptionality;

  public ProductOfferBundleData() {
    super();
    this.poBundleOptionality = new ArrayList<>();
  }

  public Collection<ProductOfferBundleOptionality> getPoBundleOptionality() {
    return poBundleOptionality;
  }

  public void setPoBundleOptionality(
      Collection<ProductOfferBundleOptionality> poBundleOptionality) {
    this.getPoBundleOptionality().addAll(poBundleOptionality);
  }

  public Boolean getEditOptionality() {
    return editOptionality;
  }

  public void setEditOptionality(Boolean editOptionality) {
    this.editOptionality = editOptionality;
  }

  @JsonProperty(access = JsonProperty.Access.READ_ONLY)
  public Integer getTotalProductOffers() {
    if (!CollectionUtils.isEmpty(poBundleOptionality))
      return poBundleOptionality.size();
    return 0;
  }

  @JsonProperty(access = JsonProperty.Access.READ_ONLY)
  public Integer getOptionalProductOffers() {
    Integer optionalPos = 0;
    if (!CollectionUtils.isEmpty(poBundleOptionality)) {
      for (ProductOfferBundleOptionality optionality : poBundleOptionality) {
        if (optionality.getOptional())
          optionalPos++;
      }
    }
    return optionalPos;
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
