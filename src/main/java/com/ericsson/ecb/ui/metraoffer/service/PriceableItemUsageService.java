package com.ericsson.ecb.ui.metraoffer.service;

import java.util.Set;

import com.ericsson.ecb.catalog.model.UsagePriceableItemTemplate;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.model.UsagePriceableItemModel;

public interface PriceableItemUsageService {

  public UsagePriceableItemTemplate getUsagePriceableItem(Integer piId) throws EcbBaseException;

  public UsagePriceableItemModel getUsagePriceableItemDetailsWithChilds(Integer templateId)
      throws EcbBaseException;

  public PaginatedList<UsagePriceableItemTemplate> findUsagePriceableItem(Integer page,
      Integer size, String[] sort, String query, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException;

  public Boolean updateUsagePriceableItem(UsagePriceableItemTemplate record, Set<String> fields,
      Integer propId) throws EcbBaseException;
}
