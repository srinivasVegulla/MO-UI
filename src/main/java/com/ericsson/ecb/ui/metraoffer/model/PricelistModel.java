package com.ericsson.ecb.ui.metraoffer.model;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.ericsson.ecb.catalog.model.Pricelist;

public class PricelistModel extends Pricelist {

  private static final long serialVersionUID = 1L;

  private String itemTemplateDisplayName;

  private Integer itemTemplateDisplayNameId;

  public String getItemTemplateDisplayName() {
    return itemTemplateDisplayName;
  }

  public void setItemTemplateDisplayName(String itemTemplateDisplayName) {
    this.itemTemplateDisplayName = itemTemplateDisplayName;
  }

  public Integer getItemTemplateDisplayNameId() {
    return itemTemplateDisplayNameId;
  }

  public void setItemTemplateDisplayNameId(Integer itemTemplateDisplayNameId) {
    this.itemTemplateDisplayNameId = itemTemplateDisplayNameId;
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
