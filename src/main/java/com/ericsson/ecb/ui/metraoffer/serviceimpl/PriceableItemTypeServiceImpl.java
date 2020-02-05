package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ericsson.ecb.catalog.client.PriceableItemTypeClient;
import com.ericsson.ecb.catalog.model.PriceableItemType;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyConstants;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemTypeModel;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemTypeService;
import com.ericsson.ecb.ui.metraoffer.utils.CommonUtils;

@Service
public class PriceableItemTypeServiceImpl implements PriceableItemTypeService {

  @Autowired
  private PriceableItemTypeClient priceableItemTypeClient;

  @Autowired
  private LocalizedEntityService localizedEntityService;

  @Override
  public PaginatedList<PriceableItemTypeModel> findPriceableItemType(Integer page, Integer size,
      String[] sort, String queryIn, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException {
    PaginatedList<PriceableItemTypeModel> priceableItemTypeModelPaginated = new PaginatedList<>();
    Collection<PriceableItemTypeModel> priceableItemTypeModelList = new ArrayList<>();
    String query = null;
    String subQuery =
        PropertyConstants.KIND + RsqlOperator.NOT_EQUAL + PropertyKind.USAGE.toString();
    if (!StringUtils.isBlank(queryIn)) {
      query = queryIn + RsqlOperator.AND + subQuery;
    } else {
      query = subQuery;
    }
    PaginatedList<PriceableItemType> priceableItemTypePaginated = findPriceableItemTypeFromApi(page,
        size, sort, query, descriptionLanguage, descriptionFilters, descriptionSort);
    Collection<PriceableItemType> priceableItemTypeList = priceableItemTypePaginated.getRecords();
    priceableItemTypeList.forEach(priceableItemType -> {
      PriceableItemTypeModel priceableItemTypeModel = new PriceableItemTypeModel();
      BeanUtils.copyProperties(priceableItemType, priceableItemTypeModel);
      priceableItemTypeModelList.add(priceableItemTypeModel);
    });
    priceableItemTypeModelPaginated.setRecords(priceableItemTypeModelList);
    CommonUtils.copyPaginatedList(priceableItemTypePaginated, priceableItemTypeModelPaginated);
    return localizedEntityService.localizedFindEntity(priceableItemTypeModelPaginated);
  }


  private PaginatedList<PriceableItemType> findPriceableItemTypeFromApi(Integer page, Integer size,
      String[] sort, String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException {
    return priceableItemTypeClient.findPriceableItemType(page, size, sort, query,
        descriptionLanguage, descriptionFilters, descriptionSort).getBody();
  }
}
