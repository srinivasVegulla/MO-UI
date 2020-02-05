package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.customer.client.SubscriptionClient;
import com.ericsson.ecb.customer.model.Subscription;
import com.ericsson.ecb.ui.metraoffer.constants.Pagination;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.service.SubscriptionService;
import com.ericsson.ecb.ui.metraoffer.utils.CommonUtils;

@Service
public class SubscriptionServiceImpl implements SubscriptionService {

  @Autowired
  private SubscriptionClient subscriptionClient;

  public static final Integer BATCH_SIZE = 200;

  @Override
  public Collection<Subscription> findSubscription(Integer page, Integer size, String[] sort,
      String query) throws EcbBaseException {

    Collection<Subscription> subscriptions = null;
    PaginatedList<Subscription> subsList = subscriptionClient
        .findSubscription(Pagination.getPage(page), Pagination.getSize(size), sort, query)
        .getBody();
    if (subsList != null && !subsList.getRecords().isEmpty()) {
      subscriptions = subsList.getRecords();
    }
    return subscriptions;
  }

  @Override
  public Collection<Subscription> findSubscription(String[] sort, String query)
      throws EcbBaseException {
    return findSubscription(Pagination.DEFAULT_PAGE, Pagination.DEFAULT_MAX_SIZE, sort, query);
  }

  @Override
  public Map<Integer, Integer> findSubscriptionsCountByOfferIdList(List<Integer> offerIdList)
      throws EcbBaseException {
    Collection<Subscription> subscriptions = new ArrayList<>();
    Map<Integer, Integer> subscriptionsCountByOfferIdMap = new HashMap<>();
    if (offerIdList != null && !offerIdList.isEmpty()) {
      if (offerIdList.size() > BATCH_SIZE) {
        for (int i = 0; i < offerIdList.size();) {
          int nextInc = Math.min(offerIdList.size() - i, BATCH_SIZE);
          Collection<Subscription> subscriptionsTmp =
              findSubscription(null, CommonUtils.getQueryStringFromCollection(
                  offerIdList.subList(i, i + nextInc), PropertyRsqlConstants.OFFER_ID_IN));
          if (subscriptionsTmp != null) {
            subscriptions.addAll(subscriptionsTmp);
          }
          i = i + nextInc;
        }
      } else {
        subscriptions = findSubscription(null, CommonUtils.getQueryStringFromCollection(offerIdList,
            PropertyRsqlConstants.OFFER_ID_IN));
      }
    }
    if (subscriptions != null && !subscriptions.isEmpty()) {
      subscriptions.forEach(subscription -> {
        Integer offerId = subscription.getOfferId();
        if (subscriptionsCountByOfferIdMap.containsKey(offerId)) {
          subscriptionsCountByOfferIdMap.put(offerId,
              subscriptionsCountByOfferIdMap.get(offerId) + 1);
        } else {
          subscriptionsCountByOfferIdMap.put(offerId, 1);
        }
      });
    }
    return subscriptionsCountByOfferIdMap;
  }
}
