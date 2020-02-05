package com.ericsson.ecb.ui.metraoffer.service;

import java.util.Set;

import com.ericsson.ecb.catalog.model.AdjustmentType;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.model.AdjustmentTypeModel;

public interface AdjustmentTypeService {

  public PaginatedList<AdjustmentType> getAdjustmentType(Integer piId) throws EcbBaseException;

  public PaginatedList<AdjustmentTypeModel> findAdjustmentType(Integer page, Integer size,
      String[] sort, String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException;

  public Boolean isAdjustmentTypeExist(Integer piId) throws EcbBaseException;

}
