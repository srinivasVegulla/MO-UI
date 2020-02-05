package com.ericsson.ecb.ui.metraoffer.model;

import java.util.List;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.ericsson.ecb.catalog.model.CalendarDay;
import com.ericsson.ecb.catalog.model.CalendarPeriod;
import com.ericsson.ecb.catalog.model.ExtendedCalendarPeriod;

/**
 * This class holds the Calendar Day Dto Object details which is sent from UI.
 *
 */
public class StandardCalendarDayDtoList {

  private List<CalendarDay> createDefaultList;

  private List<CalendarDay> updateDefaultList;

  private List<ExtendedCalendarPeriod> createPeriodList;

  private List<CalendarPeriod> updatePeriodsList;

  private List<Integer> deletePeriodIds;

  public List<CalendarDay> getCreateDefaultList() {
    return createDefaultList;
  }

  public void setCreateDefaultList(List<CalendarDay> createDefaultList) {
    this.createDefaultList = createDefaultList;
  }

  public List<CalendarDay> getUpdateDefaultList() {
    return updateDefaultList;
  }

  public void setUpdateDefaultList(List<CalendarDay> updateDefaultList) {
    this.updateDefaultList = updateDefaultList;
  }

  public List<ExtendedCalendarPeriod> getCreatePeriodList() {
    return createPeriodList;
  }

  public void setCreatePeriodList(List<ExtendedCalendarPeriod> createPeriodList) {
    this.createPeriodList = createPeriodList;
  }

  public List<CalendarPeriod> getUpdatePeriodsList() {
    return updatePeriodsList;
  }

  public void setUpdatePeriodsList(List<CalendarPeriod> updatePeriodsList) {
    this.updatePeriodsList = updatePeriodsList;
  }

  public List<Integer> getDeletePeriodIds() {
    return deletePeriodIds;
  }

  public void setDeletePeriodIds(List<Integer> deletePeriodIds) {
    this.deletePeriodIds = deletePeriodIds;
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
