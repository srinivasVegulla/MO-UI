package com.ericsson.ecb.ui.metraoffer.model;

import java.util.List;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.ericsson.ecb.catalog.model.CalendarHoliday;
import com.ericsson.ecb.catalog.model.CalendarPeriod;
import com.ericsson.ecb.catalog.model.ExtendedCalendarHoliday;
import com.ericsson.ecb.catalog.model.ExtendedCalendarPeriod;

public class CalendarHolidayDto {

  private List<ExtendedCalendarHoliday> createDefaultList;

  private List<ExtendedCalendarPeriod> createPeriodList;

  private List<CalendarHoliday> updateDefaultList;

  private List<CalendarPeriod> updatePeriodsList;

  private List<Integer> deleteDefaultIds;

  private List<Integer> deletePeriodIds;

  public List<ExtendedCalendarHoliday> getCreateDefaultList() {
    return createDefaultList;
  }

  public void setCreateDefaultList(List<ExtendedCalendarHoliday> createDefaultList) {
    this.createDefaultList = createDefaultList;
  }

  public List<ExtendedCalendarPeriod> getCreatePeriodList() {
    return createPeriodList;
  }

  public void setCreatePeriodList(List<ExtendedCalendarPeriod> createPeriodList) {
    this.createPeriodList = createPeriodList;
  }

  public List<CalendarHoliday> getUpdateDefaultList() {
    return updateDefaultList;
  }

  public void setUpdateDefaultList(List<CalendarHoliday> updateDefaultList) {
    this.updateDefaultList = updateDefaultList;
  }

  public List<CalendarPeriod> getUpdatePeriodsList() {
    return updatePeriodsList;
  }

  public void setUpdatePeriodsList(List<CalendarPeriod> updatePeriodsList) {
    this.updatePeriodsList = updatePeriodsList;
  }

  public List<Integer> getDeleteDefaultIds() {
    return deleteDefaultIds;
  }

  public void setDeleteDefaultIds(List<Integer> deleteDefaultIds) {
    this.deleteDefaultIds = deleteDefaultIds;
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
