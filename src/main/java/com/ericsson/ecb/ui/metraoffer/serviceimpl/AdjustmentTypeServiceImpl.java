package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ericsson.ecb.catalog.client.AdjustmentTypeClient;
import com.ericsson.ecb.catalog.model.AdjustmentType;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.model.AdjustmentTypeModel;
import com.ericsson.ecb.ui.metraoffer.service.AdjustmentTypeService;
import com.ericsson.ecb.ui.metraoffer.utils.CommonUtils;

@Service
public class AdjustmentTypeServiceImpl implements AdjustmentTypeService {

  @Autowired
  private AdjustmentTypeClient adjustmentTypeClient;

  @Autowired
  private LocalizedEntityService localizedEntityService;


  @Override
  public PaginatedList<AdjustmentType> getAdjustmentType(Integer piId) throws EcbBaseException {
    String query = PropertyRsqlConstants.ITEM_TYPE_ID_EQUAL + piId;
    return localizedEntityService.localizedFindEntity(
        findAdjustmentTypeFromApi(1, Integer.MAX_VALUE, null, query, null, null, null));
  }

  @Override
  public PaginatedList<AdjustmentTypeModel> findAdjustmentType(Integer page, Integer size,
      String[] sort, String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException {
    PaginatedList<AdjustmentTypeModel> adjustmentTypeModelPaginated = new PaginatedList<>();
    List<AdjustmentTypeModel> adjustmentTypeModels = new ArrayList<>();
    PaginatedList<AdjustmentType> adjustmentModelPaginated = findAdjustmentTypeFromApi(1,
        Integer.MAX_VALUE, sort, query, descriptionLanguage, descriptionFilters, descriptionSort);
    Collection<AdjustmentType> adjustmentTypes = adjustmentModelPaginated.getRecords();
    adjustmentTypes.forEach(adjustmentType -> {
      AdjustmentTypeModel adjustmentTypeModel = new AdjustmentTypeModel();
      BeanUtils.copyProperties(adjustmentType, adjustmentTypeModel);
      adjustmentTypeModels.add(adjustmentTypeModel);
    });
    CommonUtils.copyPaginatedList(adjustmentModelPaginated, adjustmentTypeModelPaginated);
    adjustmentTypeModelPaginated.setRecords(adjustmentTypeModels);
    return localizedEntityService.localizedFindEntity(adjustmentTypeModelPaginated);
  }

  private PaginatedList<AdjustmentType> findAdjustmentTypeFromApi(Integer page, Integer size,
      String[] sort, String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException {
    return adjustmentTypeClient.findAdjustmentType(page, size, sort, query, descriptionLanguage,
        descriptionFilters, descriptionSort).getBody();
  }

  @Override
  public Boolean isAdjustmentTypeExist(Integer piId) throws EcbBaseException {
    String query = PropertyRsqlConstants.ITEM_TYPE_ID_EQUAL + piId;
    Collection<AdjustmentType> adjustmentTypes =
        findAdjustmentTypeFromApi(1, Integer.MAX_VALUE, null, query, null, null, null).getRecords();
    if (CollectionUtils.isEmpty(adjustmentTypes)) {
      return Boolean.FALSE;
    } else {
      return Boolean.TRUE;
    }
  }
}


