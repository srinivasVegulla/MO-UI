package com.ericsson.ecb.ui.metraoffer.model;

import java.util.Collection;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.ericsson.ecb.common.model.EnumData;
import com.ericsson.ecb.customer.model.BusinessPartition;

public class CurrenciesAndPartitions {

  private Collection<EnumData> currencies;

  private Collection<BusinessPartition> partitions;

  public Collection<EnumData> getCurrencies() {
    return currencies;
  }

  public void setCurrencies(Collection<EnumData> currencies) {
    this.currencies = currencies;
  }

  public Collection<BusinessPartition> getPartitions() {
    return partitions;
  }

  public void setPartitions(Collection<BusinessPartition> partitions) {
    this.partitions = partitions;
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
