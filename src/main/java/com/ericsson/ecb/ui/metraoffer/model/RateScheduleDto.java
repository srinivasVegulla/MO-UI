package com.ericsson.ecb.ui.metraoffer.model;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import com.ericsson.ecb.catalog.model.RateSchedule;

public class RateScheduleDto extends RateSchedule {

  private static final long serialVersionUID = 1L;

  private Long startDateMillisec;

  private Long endDateMillisec;

  private Integer copyScheduleId;

  private Integer rulesCount;

  private ArrayList<RatesTableDto> ratesTables;

  public RateScheduleDto() {
    ratesTables = new ArrayList<>();
  }

  public List<RatesTableDto> getRatesTables() {
    return ratesTables;
  }

  public Long getStartDateMillisec() {
    return startDateMillisec;
  }

  public void setStartDateMillisec(Long startDateMillisec) {
    this.startDateMillisec = startDateMillisec;
  }

  public Long getEndDateMillisec() {
    return endDateMillisec;
  }

  public void setEndDateMillisec(Long endDateMillisec) {
    this.endDateMillisec = endDateMillisec;
  }

  public Integer getRulesCount() {
    return rulesCount;
  }

  public void setRulesCount(Integer rulesCount) {
    this.rulesCount = rulesCount;
  }

  public Integer getCopyScheduleId() {
    return copyScheduleId;
  }

  public void setCopyScheduleId(Integer copyScheduleId) {
    this.copyScheduleId = copyScheduleId;
  }

  @Override
  public boolean equals(Object o) {
    return EqualsBuilder.reflectionEquals(this, o, false);
  }

  @Override
  public int hashCode() {
    return HashCodeBuilder.reflectionHashCode(this, false);
  }
}
