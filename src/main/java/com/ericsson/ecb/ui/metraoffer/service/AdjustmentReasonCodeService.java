package com.ericsson.ecb.ui.metraoffer.service;

import java.util.Collection;
import java.util.Set;

import com.ericsson.ecb.catalog.model.LocalizedReasonCode;
import com.ericsson.ecb.catalog.model.ReasonCode;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;

public interface AdjustmentReasonCodeService {

  public ReasonCode getReasonCode(Integer propId) throws EcbBaseException;

  public PaginatedList<ReasonCode> findReasonCode(Integer page, Integer size, String[] sort,
      String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException;

  public Collection<ReasonCode> findReasonCode(Collection<Integer> propId) throws EcbBaseException;

  public Boolean deleteReasonCode(Integer propId) throws EcbBaseException;

  public Boolean updateReasonCode(ReasonCode reasonCode, Set<String> fields, Integer propId)
      throws EcbBaseException;

  public ReasonCode createReasonCode(LocalizedReasonCode reasonCode) throws EcbBaseException;

}
