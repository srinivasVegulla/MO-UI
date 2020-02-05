package com.ericsson.ecb.ui.metraoffer.model;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.ericsson.ecb.catalog.model.LocalizedRateSchedule;
import com.ericsson.ecb.catalog.model.RateSchedule;

public class RateScheduleSetDto {

  private List<LocalizedRateSchedule> createSet;

  private List<RateScheduleDto> copySet;

  private List<RateSchedule> updateSet;

  private Set<Integer> deleteIds = new HashSet<>();

  public List<LocalizedRateSchedule> getCreateSet() {
    return createSet;
  }

  public void setCreateSet(List<LocalizedRateSchedule> createSet) {
    this.createSet = createSet;
  }

  public List<RateSchedule> getUpdateSet() {
    return updateSet;
  }

  public void setUpdateSet(List<RateSchedule> updateSet) {
    this.updateSet = updateSet;
  }

  public Set<Integer> getDeleteIds() {
    return deleteIds;
  }

  public List<RateScheduleDto> getCopySet() {
    return copySet;
  }

  public void setCopySet(List<RateScheduleDto> copySet) {
    this.copySet = copySet;
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
