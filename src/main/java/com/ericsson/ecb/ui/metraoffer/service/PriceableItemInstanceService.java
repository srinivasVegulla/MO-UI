package com.ericsson.ecb.ui.metraoffer.service;

import java.util.List;
import java.util.Set;

import com.ericsson.ecb.catalog.model.PriceableItemInstanceDetails;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemInstanceDetailsModel;
import com.ericsson.ecb.ui.metraoffer.model.ResponseModel;

public interface PriceableItemInstanceService {

  public PriceableItemInstanceDetailsModel getPriceableItemInstance(final Integer offerId,
      final Integer piInstanceId) throws EcbBaseException;

  public List<ResponseModel> addPriceableItemInstanceListToOffering(Integer offerId,
      List<Integer> piTemplateIdList) throws EcbBaseException;

  public Boolean deletePiInstanceByInstanceIdFromOffering(Integer offerId, Integer piInstanceId)
      throws EcbBaseException;

  public Boolean addPriceableItemInstanceToOffering(Integer offerId, Integer piTemplateId)
      throws EcbBaseException;

  public Boolean updatePriceableItemInstance(
      PriceableItemInstanceDetails priceableItemInstanceDetails, Integer offerId,
      Integer piInstanceId, Set<String> fields) throws EcbBaseException;

}
