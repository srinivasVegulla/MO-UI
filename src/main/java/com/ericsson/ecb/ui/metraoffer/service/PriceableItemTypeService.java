package com.ericsson.ecb.ui.metraoffer.service;

import java.util.Set;

import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemTypeModel;

public interface PriceableItemTypeService {

  public PaginatedList<PriceableItemTypeModel> findPriceableItemType(Integer page, Integer size,
      String[] sort, String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException;

}
