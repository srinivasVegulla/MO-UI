package com.ericsson.ecb.ui.metraoffer.service;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.ResponseEntity;

import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferData;
import com.ericsson.ecb.ui.metraoffer.model.ResponseModel;
import com.ericsson.ecb.ui.metraoffer.model.SubscriptionProperty;

public interface SubscriptionPropertyService {

  public PaginatedList<SubscriptionProperty> findSubscriptionProperty(Integer page, Integer size,
      String[] sort, String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException;

  public PaginatedList<SubscriptionProperty> findSubscriptionPropertyForOfferings(Integer page,
      Integer size, String[] sort, String query, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort, Integer offerId)
      throws EcbBaseException;

  public PaginatedList<SubscriptionProperty> findProductOfferSubscriptionProperties(Integer page,
      Integer size, String[] sort, String query, Integer offerId) throws EcbBaseException;

  public Boolean createSubscriptionProperty(SubscriptionProperty record) throws EcbBaseException;

  public Boolean updateSubscriptionProperty(SubscriptionProperty record, Set<String> fields,
      final Integer specId) throws EcbBaseException;

  public SubscriptionProperty getSubscriptionProperty(final Integer specId) throws EcbBaseException;

  public PaginatedList<ProductOfferData> findInUseOfferings(Integer specId, Integer page,
      Integer size, String[] sort, String query, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException;

  public SubscriptionProperty getSubscriptionPropertyForEdit(Integer specId)
      throws EcbBaseException;

  public ResponseEntity<Boolean> deleteSubscriptionProperty(final Integer specId)
      throws EcbBaseException;

  public List<ResponseModel> addSubscriptionPropertyToOfferings(Integer offerId,
      List<Integer> specId) throws EcbBaseException;

  public ResponseEntity<Boolean> removeSubscriptionPropertyFromProductOffer(Integer offerId,
      Integer specId) throws EcbBaseException;

  public Map<String, String> findEditingForSubscriptionFilter();

  public Map<Integer, String> findSubscriptionPropertyType();

}
