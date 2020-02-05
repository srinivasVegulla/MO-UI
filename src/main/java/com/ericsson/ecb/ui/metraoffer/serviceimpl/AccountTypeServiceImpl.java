package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ericsson.ecb.catalog.client.ExtendedProductOfferAccountTypeMappingClient;
import com.ericsson.ecb.catalog.client.ProductOfferAccountTypeMappingClient;
import com.ericsson.ecb.catalog.model.ProductOfferAccountTypeMapping;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.customer.client.AccountTypeClient;
import com.ericsson.ecb.customer.model.AccountType;
import com.ericsson.ecb.ui.metraoffer.constants.Pagination;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyConstants;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.service.AccountTypeService;
import com.ericsson.ecb.ui.metraoffer.utils.CommonUtils;


@Service
public class AccountTypeServiceImpl implements AccountTypeService {

  @Autowired
  private AccountTypeClient accountTypeClient;

  @Autowired
  private ProductOfferAccountTypeMappingClient poAccountTypeMappingClient;

  @Autowired
  private ExtendedProductOfferAccountTypeMappingClient extendedPoAccountTypeMappingClient;


  private ProductOfferAccountTypeMapping preparePoAccountTypeMapping(Integer offerId,
      Integer typeId) {
    ProductOfferAccountTypeMapping poAccountTypeMapping = new ProductOfferAccountTypeMapping();
    poAccountTypeMapping.setOfferId(offerId);
    poAccountTypeMapping.setAccountTypeId(typeId);
    return poAccountTypeMapping;
  }

  private List<ProductOfferAccountTypeMapping> preparePoAccountTypeMappings(Integer offerId,
      List<Integer> typeIds) {
    List<ProductOfferAccountTypeMapping> poAccountTypeMappings = new ArrayList<>();
    typeIds
        .forEach(typeId -> poAccountTypeMappings.add(preparePoAccountTypeMapping(offerId, typeId)));
    return poAccountTypeMappings;
  }

  @Override
  public Boolean removeAccountTypeEligibilityFromProductOffer(Integer offerId,
      List<Integer> typeIds) throws EcbBaseException {
    return extendedPoAccountTypeMappingClient
        .removeProductOfferAccountTypeMappingInList(offerId, typeIds).getBody();
  }

  @Override
  public Boolean addAccountTypeEligibilityToProductOffer(Integer offerId, List<Integer> typeIds)
      throws EcbBaseException {
    List<ProductOfferAccountTypeMapping> poAccountTypeMappings =
        preparePoAccountTypeMappings(offerId, typeIds);
    return extendedPoAccountTypeMappingClient
        .createProductOfferAccountTypeMappingBatch(poAccountTypeMappings).getBody();
  }

  @Override
  public Boolean refreshAccountTypeEligibilityProductOffer(Integer offerId, List<Integer> uiTypeIds)
      throws EcbBaseException {
    List<Integer> existingTypeIds = new ArrayList<>();
    existingTypeIds.addAll(getAccountTypeEligibilityInProductOffer(offerId).keySet());
    if (!CollectionUtils.isEqualCollection(uiTypeIds, existingTypeIds)) {
      @SuppressWarnings("unchecked")
      Collection<Integer> addTypeIds = CollectionUtils.subtract(uiTypeIds, existingTypeIds);
      if (!CollectionUtils.isEmpty(addTypeIds))
        addAccountTypeEligibilityToProductOffer(offerId, new ArrayList<Integer>(addTypeIds));
      @SuppressWarnings("unchecked")
      Collection<Integer> removeTypeIds = CollectionUtils.subtract(existingTypeIds, uiTypeIds);
      if (!CollectionUtils.isEmpty(removeTypeIds))
        removeAccountTypeEligibilityFromProductOffer(offerId,
            new ArrayList<Integer>(removeTypeIds));
    }
    return Boolean.TRUE;
  }

  public Collection<AccountType> findAccountType(Integer page, Integer size, String[] sort,
      String queryIn) throws EcbBaseException {
    String query = PropertyConstants.SUBSCRIPTION_ALLOWED + RsqlOperator.EQUAL_TRUE;
    if (!StringUtils.isBlank(queryIn))
      query = queryIn + RsqlOperator.AND + query;
    return accountTypeClient.findAccountType(page, size, sort, query).getBody().getRecords();
  }

  @Override
  public Map<Integer, String> getAccountTypeEligibilityInProductOffer(Integer offerId)
      throws EcbBaseException {
    Collection<AccountType> accountTypes = Collections.emptyList();
    Collection<Integer> accountTypeIds = getPoAccountTypeIds(offerId);
    if (!CollectionUtils.isEmpty(accountTypeIds))
      accountTypes = getAccountTypes(accountTypeIds);
    return getAccoutTypeIdName(accountTypes);
  }

  private Map<Integer, String> getAccoutTypeIdName(Collection<AccountType> accountTypes) {
    Map<Integer, String> accoutTypeIdNameMap = new HashMap<>();
    accountTypes.forEach(
        accountType -> accoutTypeIdNameMap.put(accountType.getTypeId(), accountType.getName()));
    return accoutTypeIdNameMap;
  }

  public Collection<AccountType> getAccountTypes(Collection<Integer> accountTypeIds)
      throws EcbBaseException {
    return findAccountType(Pagination.DEFAULT_PAGE, Pagination.DEFAULT_MAX_SIZE, null,
        CommonUtils.getQueryStringFromCollection(accountTypeIds, PropertyRsqlConstants.TYPE_ID_IN));
  }

  private Collection<Integer> getPoAccountTypeIds(Integer offerId) throws EcbBaseException {
    Collection<Integer> accountTypeIds = new ArrayList<>();
    Collection<ProductOfferAccountTypeMapping> accountTypeMappings =
        getPoAccountTypeMapping(offerId);
    accountTypeMappings
        .forEach(accountTypeMapping -> accountTypeIds.add(accountTypeMapping.getAccountTypeId()));
    return accountTypeIds;
  }

  private Collection<ProductOfferAccountTypeMapping> getPoAccountTypeMapping(Integer offerId)
      throws EcbBaseException {
    return findProductOfferAccountTypeMapping(Pagination.DEFAULT_PAGE, Pagination.DEFAULT_MAX_SIZE,
        null, PropertyRsqlConstants.OFFER_ID_EQUAL + offerId);
  }

  private Collection<ProductOfferAccountTypeMapping> findProductOfferAccountTypeMapping(
      Integer page, Integer size, String[] sort, String query) throws EcbBaseException {
    return poAccountTypeMappingClient.findProductOfferAccountTypeMapping(page, size, sort, query)
        .getBody().getRecords();
  }

  @Override
  public Map<Integer, String> findAccountTypeEligibility() throws EcbBaseException {
    return getAccoutTypeIdName(
        findAccountType(Pagination.DEFAULT_PAGE, Pagination.DEFAULT_MAX_SIZE, null, null));
  }
}
