package com.ericsson.ecb.ui.metraoffer.model;

import java.util.List;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.ericsson.ecb.catalog.model.Chunk;
import com.ericsson.ecb.catalog.model.Pricelist;
import com.ericsson.ecb.catalog.model.RateSchedule;
import com.ericsson.ecb.catalog.model.Rule;

public class RateChanges {

  private RateSchedule rateSchedule;

  private Pricelist pricelist;

  private List<Chunk<Rule>> rules;

  private List<ParameterTableMetadata> tableMetadata;

  public RateSchedule getRateSchedule() {
    return rateSchedule;
  }

  public void setRateSchedule(RateSchedule rateSchedule) {
    this.rateSchedule = rateSchedule;
  }

  public List<Chunk<Rule>> getRules() {
    return rules;
  }

  public void setRules(List<Chunk<Rule>> rules) {
    this.rules = rules;
  }

  public List<ParameterTableMetadata> getTableMetadata() {
    return tableMetadata;
  }

  public void setTableMetadata(List<ParameterTableMetadata> tableMetadata) {
    this.tableMetadata = tableMetadata;
  }

  public Pricelist getPricelist() {
    return pricelist;
  }

  public void setPricelist(Pricelist pricelist) {
    this.pricelist = pricelist;
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
