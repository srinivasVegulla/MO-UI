package com.ericsson.ecb.ui.metraoffer.model;

import java.util.ArrayList;
import java.util.List;

import com.ericsson.ecb.base.model.AuditAggregator;
import com.ericsson.ecb.base.model.ViewChangeDetails;
import com.ericsson.ecb.common.api.PaginatedList;

public class OfferingViewChangeDetails {

  private List<ViewChangeDetails> changeDetails = new ArrayList<>();

  private PaginatedList<AuditAggregator> changeHistory = new PaginatedList<>();

  public List<ViewChangeDetails> getChangeDetails() {
    return changeDetails;
  }

  public PaginatedList<AuditAggregator> getChangeHistory() {
    return changeHistory;
  }

  public void setChangeHistory(PaginatedList<AuditAggregator> changeHistory) {
    this.changeHistory = changeHistory;
  }

}
