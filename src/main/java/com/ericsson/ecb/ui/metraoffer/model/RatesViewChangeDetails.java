package com.ericsson.ecb.ui.metraoffer.model;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

import com.ericsson.ecb.base.model.AuditAggregator;
import com.ericsson.ecb.catalog.model.Pricelist;
import com.ericsson.ecb.catalog.model.RateSchedule;
import com.ericsson.ecb.common.api.PaginatedList;

public class RatesViewChangeDetails {

  private List<LinkedHashMap<String, Object>> changeDetails = new ArrayList<>();

  private RateSchedule rateSchedule;

  private Pricelist pricelist;

  private PaginatedList<AuditAggregator> changeHistory = new PaginatedList<>();

  public PaginatedList<AuditAggregator> getChangeHistory() {
    return changeHistory;
  }

  public void setChangeHistory(PaginatedList<AuditAggregator> changeHistory) {
    this.changeHistory = changeHistory;
  }

  public RateSchedule getRateSchedule() {
    return rateSchedule;
  }

  public void setRateSchedule(RateSchedule rateSchedule) {
    this.rateSchedule = rateSchedule;
  }

  public Pricelist getPricelist() {
    return pricelist;
  }

  public void setPricelist(Pricelist pricelist) {
    this.pricelist = pricelist;
  }

  public List<LinkedHashMap<String, Object>> getChangeDetails() {
    return changeDetails;
  }

}
