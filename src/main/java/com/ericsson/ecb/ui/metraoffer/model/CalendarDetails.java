package com.ericsson.ecb.ui.metraoffer.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.ericsson.ecb.catalog.model.CalendarDay;
import com.ericsson.ecb.catalog.model.CalendarPeriod;

public class CalendarDetails {

  private Integer calendarId;

  public Integer getCalendarId() {
    return calendarId;
  }

  public void setCalendarId(Integer calendarId) {
    this.calendarId = calendarId;
  }

  private Collection<CalendarDay> calendarDay = new ArrayList<>();

  private List<List<CalendarPeriod>> calendarPeriods = new ArrayList<>();

  private Collection<CalendarHolidayData> calendarHoliday = new ArrayList<>();

  private Collection<CalendarPeriod> calendarHolidayPeriods = new ArrayList<>();

  public Collection<CalendarDay> getCalendarDay() {
    return calendarDay;
  }

  public List<List<CalendarPeriod>> getCalendarPeriods() {
    return calendarPeriods;
  }

  public Collection<CalendarHolidayData> getCalendarHoliday() {
    return calendarHoliday;
  }

  public Collection<CalendarPeriod> getCalendarHolidayPeriods() {
    return calendarHolidayPeriods;
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
