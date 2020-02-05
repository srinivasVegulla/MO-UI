package com.ericsson.ecb.ui.metraoffer.model;

import com.ericsson.ecb.catalog.model.CalendarWithInUse;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class CalendarInUse extends CalendarWithInUse {

  private static final long serialVersionUID = 1L;

  @Override
  @JsonIgnore
  public String getDisplayName() {
    return super.getDisplayName();
  }
}
