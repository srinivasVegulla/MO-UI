package com.ericsson.ecb.ui.metraoffer.service;

import java.util.List;
import java.util.Set;

import com.ericsson.ecb.catalog.model.LocalizedUnitDependentRecurringChargeTemplate;
import com.ericsson.ecb.catalog.model.RecurringCharge;
import com.ericsson.ecb.catalog.model.UnitDependentRecurringChargeTemplate;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.model.UnitDependentRecurringChargeModel;

public interface PriceableItemRecurringService {

  public List<BiWeeklyInterval> getBiWeeklyCycleIntervals();

  public UnitDependentRecurringChargeModel getRecurringChargeDetails(Integer propId)
      throws EcbBaseException;

  public UnitDependentRecurringChargeModel createRecurringChargePriceableItemTemplate(
      LocalizedUnitDependentRecurringChargeTemplate record) throws EcbBaseException;

  public RecurringCharge getRecurringCharge(Integer propId) throws EcbBaseException;

  public LocalizedUnitDependentRecurringChargeTemplate preInitialize(
      LocalizedUnitDependentRecurringChargeTemplate record);

  public PaginatedList<RecurringCharge> findRecurringCharge(Integer page, Integer size,
      String[] sort, String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException;

  public Boolean updateRecurringChargePriceableItemTemplate(
      UnitDependentRecurringChargeTemplate record, Set<String> fields, Integer propId)
      throws EcbBaseException;

  class BiWeeklyInterval {

    private Integer startDayId;

    private String dayInterval;

    public Integer getStartDayId() {
      return startDayId;
    }

    public void setStartDayId(Integer startDayId) {
      this.startDayId = startDayId;
    }

    public String getDayInterval() {
      return dayInterval;
    }

    public void setDayInterval(String dayInterval) {
      this.dayInterval = dayInterval;
    }
  }
}
