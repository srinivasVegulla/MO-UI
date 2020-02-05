package com.ericsson.ecb.ui.metraoffer.service;

import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.customer.client.SubscriptionClient;
import com.ericsson.ecb.customer.model.Subscription;
import com.ericsson.ecb.ui.metraoffer.constants.Pagination;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.SubscriptionServiceImpl;
import com.ericsson.ecb.ui.metraoffer.utils.CommonUtils;

public class SubscriptionServiceImplTest {

  @InjectMocks
  private SubscriptionServiceImpl subscriptionServiceImpl;

  @Mock
  private SubscriptionClient subscriptionClient;

  @Mock
  private Subscription subscription;

  private Collection<Subscription> subscriptions;
  private ResponseEntity<PaginatedList<Subscription>> subscriptionPaginatedRsp;

  private Integer offerId = 1;
  private List<Integer> offerIds;

  private Integer page = Pagination.DEFAULT_PAGE;
  private Integer size = Pagination.DEFAULT_MAX_SIZE;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    subscriptions = new ArrayList<Subscription>();
    offerIds = new ArrayList<Integer>();
    offerIds.add(offerId);

    subscription = new Subscription();
    subscription.setOfferId(offerId);
    subscription.setSubscriptionId(2);
    subscription.setAccountId(1);

    subscriptions.add(subscription);
    PaginatedList<Subscription> subscriptionPaginated = new PaginatedList<Subscription>();
    subscriptionPaginatedRsp =
        new ResponseEntity<PaginatedList<Subscription>>(subscriptionPaginated, HttpStatus.OK);
    subscriptionPaginated.setRecords(subscriptions);

  }

  @Test
  public void shouldFindSubscriptionsCountByOfferIdListLessThanBatchSize() throws Exception {
    for (int i = 2; i <= 10; i++) {
      offerIds.add(i);
    }
    String query =
        CommonUtils.getQueryStringFromCollection(offerIds, PropertyRsqlConstants.OFFER_ID_IN);
    when(subscriptionClient.findSubscription(page, size, null, query))
        .thenReturn(subscriptionPaginatedRsp);
    subscriptionServiceImpl.findSubscriptionsCountByOfferIdList(offerIds);
  }

  @Test
  public void shouldFindSubscriptionsCountByOfferIdListMoreThanBatchSize() throws Exception {

    for (int i = 2; i <= 200; i++) {
      offerIds.add(i);
    }
    String query =
        CommonUtils.getQueryStringFromCollection(offerIds, PropertyRsqlConstants.OFFER_ID_IN);
    offerIds.add(101);
    offerIds.add(102);
    when(subscriptionClient.findSubscription(page, size, null, query))
        .thenReturn(subscriptionPaginatedRsp);
    when(subscriptionClient.findSubscription(page, size, null,
        "offerId" + RsqlOperator.IN + "(101,102)")).thenReturn(subscriptionPaginatedRsp);
    subscriptionServiceImpl.findSubscriptionsCountByOfferIdList(offerIds);
  }

  @Test
  public void shouldFindSubscription() throws Exception {
    when(subscriptionClient.findSubscription(page, size, null, null))
        .thenReturn(subscriptionPaginatedRsp);
    subscriptionServiceImpl.findSubscription(page, size, null, null);
  }

  @Test
  public void shouldFindAllSubscription() throws Exception {
    when(subscriptionClient.findSubscription(page, size, null, null))
        .thenReturn(subscriptionPaginatedRsp);
    subscriptionServiceImpl.findSubscription(null, null);
  }

}
