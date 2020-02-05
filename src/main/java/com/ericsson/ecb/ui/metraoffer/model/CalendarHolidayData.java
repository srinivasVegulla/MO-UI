package com.ericsson.ecb.ui.metraoffer.model;

import com.ericsson.ecb.catalog.model.CalendarHoliday;

public class CalendarHolidayData extends CalendarHoliday {
 
  private static final long serialVersionUID = 1L;
  
  private Long periodCount;

  public Long getPeriodCount() {
    return periodCount;
  }

  public void setPeriodCount(Long periodCount) {
    this.periodCount = periodCount;
  }

}
