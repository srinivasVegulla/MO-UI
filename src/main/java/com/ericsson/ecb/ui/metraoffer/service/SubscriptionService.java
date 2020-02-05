package com.ericsson.ecb.ui.metraoffer.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.customer.model.Subscription;

public interface SubscriptionService {

  public Map<Integer, Integer> findSubscriptionsCountByOfferIdList(List<Integer> offerIdList)
      throws EcbBaseException;

  public Collection<Subscription> findSubscription(Integer page, Integer size, String[] sort,
      String query) throws EcbBaseException;

  public Collection<Subscription> findSubscription(String[] sort, String query)
      throws EcbBaseException;

}
