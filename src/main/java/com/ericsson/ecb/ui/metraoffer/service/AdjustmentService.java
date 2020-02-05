package com.ericsson.ecb.ui.metraoffer.service;

import java.util.Collection;
import java.util.Map;
import java.util.Set;

import com.ericsson.ecb.catalog.model.Adjustment;
import com.ericsson.ecb.catalog.model.LocalizedAdjustment;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.model.AdjustmentModel;

public interface AdjustmentService {

  public Adjustment addAdjustmentToPriceableItemTemplate(LocalizedAdjustment adjustment)
      throws EcbBaseException;

  public Boolean removeAdjustmentFromPiTemplate(Integer propId) throws EcbBaseException;

  public Boolean removeReasonCodeFromAdjustment(Integer propId, Set<Integer> reasonCodeList)
      throws EcbBaseException;

  public Boolean addReasonCodeToAdjustment(Integer propId, Set<Integer> reasonCodeList)
      throws EcbBaseException;

  public Adjustment updateAdjustment(AdjustmentModel adjustmentMoldel, Integer propId)
      throws EcbBaseException;

  public PaginatedList<Adjustment> findAdjustment(Integer page, Integer size, String[] sort,
      String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException;

  public Collection<AdjustmentModel> findPiTemplateAdjustment(Integer templateId)
      throws EcbBaseException;

  public Map<Integer, Set<Integer>> findAdjustmentReasonCode(Collection<Integer> adjustmentIdList)
      throws EcbBaseException;

  public Collection<AdjustmentModel> getPiTemplateAdjustmentWithReasonCode(Integer templateId)
      throws EcbBaseException;

  public Adjustment createAdjustment(LocalizedAdjustment adjustment) throws EcbBaseException;

  public Boolean updatePiTemplateAdjustmentAndReasonCode(Integer templateId,
      Collection<AdjustmentModel> uiAdjustmentModelList) throws EcbBaseException;

  public Collection<AdjustmentModel> findPiInstanceAdjustment(Integer instanceId)
      throws EcbBaseException;

  public Collection<AdjustmentModel> getPiInstanceAdjustmentWithReasonCode(Integer instanceId)
      throws EcbBaseException;

  public Boolean updatePiInstanceAdjustment(Integer piInstanceId,
      Collection<AdjustmentModel> adjustmentModelList) throws EcbBaseException;

}
