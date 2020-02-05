package com.ericsson.ecb.ui.metraoffer.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.ericsson.ecb.catalog.model.LocalizedProductOffer;
import com.ericsson.ecb.catalog.model.PricelistMapping;
import com.ericsson.ecb.common.model.Description;
import com.ericsson.ecb.common.model.EnumData;
import com.ericsson.ecb.customer.model.BusinessPartition;
import com.ericsson.ecb.ui.metraoffer.utils.DateUtility;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ProductOfferData extends LocalizedProductOffer {

  private static final long serialVersionUID = 1L;

  private String poPartitionName;

  private Collection<EnumData> currencies;

  private Collection<BusinessPartition> poPartitions;

  private Map<Integer, String> accountTypeEligibilities;

  private Map<Integer, String> selectedAccountTypeEligibility;

  private Integer subcriptionCount;

  private ArrayList<ExtendedProperty> extendedProperties;

  private Collection<PricelistMapping> priceableItems;

  private Integer numberOfLocationsPoUsed;

  private Boolean isAccountTypeEligibilityUpdated;

  private HashMap<String, Object> approvalDetailsMap;

  private Boolean anyOneBundleIsAvailable;

  public ProductOfferData() {
    super();
    this.currencies = new ArrayList<>();
    this.poPartitions = new ArrayList<>();
    this.accountTypeEligibilities = new HashMap<>();
    this.selectedAccountTypeEligibility = new HashMap<>();
    this.priceableItems = new ArrayList<>();
    this.subcriptionCount = 0;
    this.extendedProperties = new ArrayList<>();
    this.isAccountTypeEligibilityUpdated = Boolean.FALSE;
    this.anyOneBundleIsAvailable=Boolean.FALSE;
    this.approvalDetailsMap = new HashMap<>();
  }

  public Collection<EnumData> getCurrencies() {
    return currencies;
  }

  public Collection<BusinessPartition> getPoPartitions() {
    return poPartitions;
  }

  public Map<Integer, String> getAccountTypeEligibilities() {
    return accountTypeEligibilities;
  }

  public Map<Integer, String> getSelectedAccountTypeEligibility() {
    return selectedAccountTypeEligibility;
  }

  @JsonIgnore
  public Integer getSubcriptionCount() {
    return subcriptionCount;
  }


  public void setSubcriptionCount(Integer subcriptionCount) {
    this.subcriptionCount = subcriptionCount;
  }

  public String getPoPartitionName() {
    return poPartitionName;
  }

  public void setPoPartitionName(String poPartitionName) {
    this.poPartitionName = poPartitionName;
  }

  public void setCurrencies(Collection<EnumData> currencies) {
    getCurrencies().addAll(currencies);
  }

  public void setPoPartitions(Collection<BusinessPartition> poPartitions) {
    getPoPartitions().addAll(poPartitions);
  }

  public void setAccountTypeEligibilities(Map<Integer, String> accountTypeEligibilities) {
    getAccountTypeEligibilities().putAll(accountTypeEligibilities);
  }

  public void setSelectedAccountTypeEligibility(
      Map<Integer, String> selectedAccountTypeEligibility) {
    getSelectedAccountTypeEligibility().putAll(selectedAccountTypeEligibility);
  }

  public void setProperties(Map<String, Object> properties) {
    getProperties().putAll(properties);
  }

  @JsonProperty(access = JsonProperty.Access.READ_ONLY)
  public String getAvailStartDate() {
    if (getAvailableStartDate() != null)
      return DateUtility.convertOffsetDateToString(getAvailableStartDate());
    return StringUtils.EMPTY;
  }

  @JsonProperty(access = JsonProperty.Access.READ_ONLY)
  public String getAvailEndDate() {
    if (getAvailableEndDate() != null)
      return DateUtility.convertOffsetDateToString(getAvailableEndDate());
    return StringUtils.EMPTY;
  }

  @JsonProperty(access = JsonProperty.Access.READ_ONLY)
  public String getEffEndDate() {
    if (getEndDate() != null)
      return DateUtility.convertOffsetDateToString(getEndDate());
    return StringUtils.EMPTY;
  }

  @JsonProperty(access = JsonProperty.Access.READ_ONLY)
  public String getEffStartDate() {
    if (getStartDate() != null)
      return DateUtility.convertOffsetDateToString(getStartDate());
    return StringUtils.EMPTY;
  }

  @JsonProperty(access = JsonProperty.Access.READ_ONLY)
  public Boolean getDelete() {
    return !isAvailableOrSubscriptions();
  }

  @JsonProperty(access = JsonProperty.Access.READ_ONLY)
  public Boolean getAddRemovePoPi() {
    return !(isAvailableOrSubscriptions() || getAnyOneBundleIsAvailable());
  }

  @JsonIgnore
  public Boolean isAvailableOrSubscriptions() {
    if (isAvailable())
      return Boolean.TRUE;
    else if (haveSubscriptions())
      return Boolean.TRUE;
    else
      return Boolean.FALSE;
  }

  @JsonIgnore
  public Boolean isAvailable() {
    if (getAvailableStartDate() != null || getAvailableEndDate() != null)
      return Boolean.TRUE;
    else
      return Boolean.FALSE;
  }

  @JsonIgnore
  public Boolean haveSubscriptions() {
    if (this.getSubcriptionCount() != null && this.getSubcriptionCount() > 0)
      return Boolean.TRUE;
    else
      return Boolean.FALSE;
  }

  public Collection<PricelistMapping> getPriceableItems() {
    return priceableItems;
  }

  public void setPriceableItems(Collection<PricelistMapping> priceableItems) {
    this.getPriceableItems().addAll(priceableItems);
  }

  public Collection<ExtendedProperty> getExtendedProperties() {
    return extendedProperties;
  }

  public Integer getNumberOfLocationsPoUsed() {
    return numberOfLocationsPoUsed;
  }

  public void setNumberOfLocationsPoUsed(Integer numberOfLocationsPoUsed) {
    this.numberOfLocationsPoUsed = numberOfLocationsPoUsed;
  }

  public Boolean getIsAccountTypeEligibilityUpdated() {
    return isAccountTypeEligibilityUpdated;
  }

  public void setIsAccountTypeEligibilityUpdated(Boolean isAccountTypeEligibilityUpdated) {
    this.isAccountTypeEligibilityUpdated = isAccountTypeEligibilityUpdated;
  }

  @Override
  @JsonIgnore
  public Map<String, Description> getLocalizedNames() {
    return super.getLocalizedNames();
  }


  @Override
  @JsonIgnore
  public Map<String, Description> getLocalizedDisplayNames() {
    return super.getLocalizedDisplayNames();
  }

  @Override
  @JsonIgnore
  public Map<String, Description> getLocalizedDescriptions() {
    return super.getLocalizedDescriptions();
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

  public Map<String, Object> getApprovalDetailsMap() {
    return approvalDetailsMap;
  }

  @JsonIgnore
  public Boolean getAnyOneBundleIsAvailable() {
    return anyOneBundleIsAvailable;
  }

  public void setAnyOneBundleIsAvailable(Boolean anyOneBundleIsAvailable) {
    this.anyOneBundleIsAvailable = anyOneBundleIsAvailable;
  }

}
