package com.ericsson.ecb.ui.metraoffer.service;

import java.util.List;
import java.util.Map;
import java.util.Set;

import com.ericsson.ecb.catalog.model.LocalizedPriceableItemTemplate;
import com.ericsson.ecb.catalog.model.PriceableItemTemplate;
import com.ericsson.ecb.catalog.model.PriceableItemTemplateParameterTableMapping;
import com.ericsson.ecb.catalog.model.PriceableItemTemplateWithInUse;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.common.model.UsageCycle;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemRateTableModel;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemTemplateModel;
import com.ericsson.ecb.ui.metraoffer.model.PricelistModel;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferData;

public interface PriceableItemTemplateService {

  public PaginatedList<PriceableItemTemplateModel> findPriceableItemTemplatesForOfferings(
      Boolean isBundle, Integer offerId, Integer page, Integer size, String[] sort, String query,
      String descriptionLanguage, Set<String> descriptionFilters, String descriptionSort)
      throws EcbBaseException;

  public PaginatedList<PriceableItemTemplateWithInUse> findPriceableItemTemplate(Integer page,
      Integer size, String[] sort, String query, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException;

  public PaginatedList<PriceableItemTemplateModel> findPriceableItemTemplateGridView(Integer page,
      Integer size, String[] sort, String query, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException;

  public PaginatedList<ProductOfferData> findInUseOfferings(Integer templateId, Integer page,
      Integer size, String[] sort, String query, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException;

  public PaginatedList<PricelistModel> findInUseSharedRateList(Integer templateId,
      Set<Integer> childPiTemplate, Integer page, Integer size, String[] sort, String query,
      String descriptionLanguage, Set<String> descriptionFilters, String descriptionSort)
      throws EcbBaseException;

  public PaginatedList<PriceableItemTemplateParameterTableMapping> getPriceableItemParamTableMapping(
      Integer page, Integer size, String[] sort, String query, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException;

  public Object getPriceableItemTemplateDetails(Integer templateId, PropertyKind kind)
      throws EcbBaseException;

  public Boolean deletePriceableItemTemplate(Integer templateId) throws EcbBaseException;

  public PriceableItemTemplateModel getPriceableItemTemplateDetails(Integer templateId)
      throws EcbBaseException;

  public PaginatedList<ProductOfferData> findInUseOfferingsOfExtendedProps(PropertyKind kind,
      Integer page, Integer size, String[] sort, String query, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException;

  public List<PriceableItemRateTableModel> getRateTableWithDecisionTypeName(Integer piId)
      throws EcbBaseException;

  public PriceableItemTemplate getPriceableItemTemplate(Integer templateId) throws EcbBaseException;

  public PriceableItemTemplate createPriceableItemTemplate(LocalizedPriceableItemTemplate record)
      throws EcbBaseException;

  public UsageCycle getUsageCycle(Integer usageCycleId) throws EcbBaseException;

  public Map<PropertyKind, String> findViewChargeType();

  public Map<PropertyKind, String> findCreateChargeType();

}
