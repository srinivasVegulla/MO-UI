package com.ericsson.ecb.ui.metraoffer.service;

import java.util.Set;

import com.ericsson.ecb.catalog.model.LocalizedUnitDependentRecurringChargeTemplate;
import com.ericsson.ecb.catalog.model.UnitDependentRecurringCharge;
import com.ericsson.ecb.catalog.model.UnitDependentRecurringChargeTemplate;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.model.UnitDependentRecurringChargeModel;

public interface PriceableItemUnitDependentRecurringService {

  public UnitDependentRecurringChargeModel getUnitDependentRecurringChargeDetails(Integer propId)
      throws EcbBaseException;

  public UnitDependentRecurringChargeModel createUniDependentRecurringChargePriceableItemTemplate(
      LocalizedUnitDependentRecurringChargeTemplate record) throws EcbBaseException;

  public UnitDependentRecurringCharge getUnitDependentRecurringCharge(Integer propId)
      throws EcbBaseException;

  public PaginatedList<UnitDependentRecurringCharge> findUnitDependentRecurringCharge(Integer page,
      Integer size, String[] sort, String query) throws EcbBaseException;

  public Boolean updateUnitRecurringChargePriceableItemTemplate(
      UnitDependentRecurringChargeTemplate record, Set<String> fields, Integer propId)
      throws EcbBaseException;

}
