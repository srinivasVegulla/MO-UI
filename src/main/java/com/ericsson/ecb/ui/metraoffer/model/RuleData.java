package com.ericsson.ecb.ui.metraoffer.model;



import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.ericsson.ecb.catalog.model.Rule;
import com.ericsson.ecb.catalog.model.RuleCondition;

public class RuleData extends Rule {

  private static final long serialVersionUID = 1L;

  private LinkedHashMap<String, RuleCondition> conditions;

  private LinkedHashMap<String, Object> actions;

  public RuleData() {
    this.conditions = new LinkedHashMap<>();
    this.actions = new LinkedHashMap<>();
  }

  @Override
  public Map<String, RuleCondition> getConditions() {
    return conditions;
  }

  @Override
  public Map<String, Object> getActions() {
    return actions;
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
