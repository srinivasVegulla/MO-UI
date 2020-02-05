package com.ericsson.ecb.ui.metraoffer.model;

import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import com.ericsson.ecb.catalog.model.SharedPropertyModel;
import com.ericsson.ecb.ui.metraoffer.constants.Constants;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class SubscriptionProperty extends SharedPropertyModel {

  private static final long serialVersionUID = 1L;

  private Integer entityCount;

  private String editingForSubscriptionCode;

  private String editingForSubscription;

  private Map<Integer, String> specTypes;

  private Set<String> categoryNames;

  private String displayName;

  private String displayCategory;

  public SubscriptionProperty() {
    setUserVisible(Boolean.FALSE);
    setUserEditable(Boolean.FALSE);
    setIsRequired(Boolean.FALSE);
    categoryNames = new LinkedHashSet<>();
    specTypes = new HashMap<>();
  }

  public Map<Integer, String> getSpecTypes() {
    return specTypes;
  }

  public String getSpecTypeName() {
    return Constants.TYPE.get(getSpecType());
  }

  public Set<String> getCategoryNames() {
    return categoryNames;
  }

  public String getEditingForSubscriptionCode() {
    return editingForSubscriptionCode;
  }

  public void setEditingForSubscriptionCode(String editingForSubscriptionCode) {
    this.editingForSubscriptionCode = editingForSubscriptionCode;
  }

  @JsonIgnore
  @Override
  public Boolean getIsRequired() {
    return super.getIsRequired();
  }

  @JsonIgnore
  @Override
  public Boolean getUserEditable() {
    return super.getUserEditable();
  }

  public String getEditingForSubscription() {
    return editingForSubscription;
  }

  public void setEditingForSubscription(String editingForSubscription) {
    this.editingForSubscription = editingForSubscription;
  }

  @Override
  public boolean equals(Object o) {
    return EqualsBuilder.reflectionEquals(this, o, false);
  }

  @Override
  public int hashCode() {
    return HashCodeBuilder.reflectionHashCode(this, false);
  }

  public String getDisplayName() {
    return displayName;
  }

  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }

  public String getDisplayCategory() {
    return displayCategory;
  }

  public void setDisplayCategory(String displayCategory) {
    this.displayCategory = displayCategory;
  }

  public Integer getEntityCount() {
    return entityCount;
  }

  public void setEntityCount(Integer entityCount) {
    this.entityCount = entityCount;
  }
}
