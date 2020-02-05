package com.ericsson.ecb.ui.metraoffer.service;

import java.util.Set;

import com.ericsson.ecb.catalog.model.LocalizedNonRecurringChargeTemplate;
import com.ericsson.ecb.catalog.model.NonRecurringCharge;
import com.ericsson.ecb.catalog.model.NonRecurringChargeTemplate;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.model.NonRecurringChargeModel;

public interface PriceableItemNonRecurringService {

  public NonRecurringChargeModel getNonRecurringChargeDetails(Integer propId)
      throws EcbBaseException;

  public NonRecurringChargeModel createNonRecurringChargePriceableItemTemplate(
      LocalizedNonRecurringChargeTemplate record) throws EcbBaseException;

  public NonRecurringCharge getNonRecurringCharge(Integer propId) throws EcbBaseException;

  public PaginatedList<NonRecurringCharge> findNonRecurringCharge(Integer page, Integer size,
      String[] sort, String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException;

  public Boolean updateNonRecurringChargePriceableItemTemplate(NonRecurringChargeTemplate record,
      Set<String> fields, Integer propId) throws EcbBaseException;

  public NonRecurringCharge updateNonRecurringCharge(NonRecurringCharge record, Integer propId)
      throws EcbBaseException;

}
