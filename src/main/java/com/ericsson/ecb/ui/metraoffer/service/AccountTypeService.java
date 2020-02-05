package com.ericsson.ecb.ui.metraoffer.service;

import java.util.List;
import java.util.Map;

import com.ericsson.ecb.common.exception.EcbBaseException;

public interface AccountTypeService {

  public Map<Integer, String> findAccountTypeEligibility() throws EcbBaseException;

  public Map<Integer, String> getAccountTypeEligibilityInProductOffer(Integer offerId)
      throws EcbBaseException;

  public Boolean addAccountTypeEligibilityToProductOffer(Integer offerId, List<Integer> typeIds)
      throws EcbBaseException;

  public Boolean removeAccountTypeEligibilityFromProductOffer(Integer offerId,
      List<Integer> typeIds) throws EcbBaseException;

  public Boolean refreshAccountTypeEligibilityProductOffer(Integer offerId, List<Integer> typeIds)
      throws EcbBaseException;

}
