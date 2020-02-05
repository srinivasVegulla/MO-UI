package com.ericsson.ecb.ui.metraoffer.service;

import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ericsson.ecb.catalog.client.ExtendedProductOfferAccountTypeMappingClient;
import com.ericsson.ecb.catalog.client.ProductOfferAccountTypeMappingClient;
import com.ericsson.ecb.catalog.model.ProductOfferAccountTypeMapping;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.customer.client.AccountTypeClient;
import com.ericsson.ecb.customer.model.AccountType;
import com.ericsson.ecb.ui.metraoffer.constants.Pagination;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.AccountTypeServiceImpl;

public class AccountTypeServiceImplTest {

  @InjectMocks
  private AccountTypeServiceImpl accountTypeServiceImpl;

  @Mock
  private AccountTypeClient accountTypeClient;

  @Mock
  private ProductOfferAccountTypeMappingClient poAccountTypeMappingClient;

  @Mock
  private ExtendedProductOfferAccountTypeMappingClient extendedPoAccountTypeMappingClient;

  private ResponseEntity<PaginatedList<AccountType>> accountTypePaginatedRsp;

  private ResponseEntity<PaginatedList<ProductOfferAccountTypeMapping>> poAccountTypeMappingPaginatedRsp;

  private Map<Integer, String> accountTypeTypeEligibility;

  private List<ProductOfferAccountTypeMapping> poAccountTypeMappings;

  private Collection<AccountType> accountTypes;

  private List<Integer> typeIds;

  private ResponseEntity<Boolean> booleanRspEntity;

  private Integer offerId = 1;

  private Integer page = Pagination.DEFAULT_PAGE;

  private Integer size = Pagination.DEFAULT_MAX_SIZE;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    AccountType accountType1 = new AccountType();
    accountType1.setTypeId(1);

    AccountType accountType2 = new AccountType();
    accountType2.setTypeId(2);

    accountTypes = new ArrayList<AccountType>();
    accountTypes.add(accountType1);
    accountTypes.add(accountType2);

    PaginatedList<AccountType> paginatedOfferList = new PaginatedList<AccountType>();
    paginatedOfferList.setRecords(accountTypes);
    accountTypePaginatedRsp =
        new ResponseEntity<PaginatedList<AccountType>>(paginatedOfferList, HttpStatus.OK);

    typeIds = new ArrayList<Integer>();
    typeIds.add(1);
    typeIds.add(3);

    accountTypeTypeEligibility = new HashMap<Integer, String>();
    accountTypeTypeEligibility.put(1, "1");
    accountTypeTypeEligibility.put(2, "2");

    ProductOfferAccountTypeMapping poAccountTypeMapping1 = new ProductOfferAccountTypeMapping();
    poAccountTypeMapping1.setOfferId(1);
    poAccountTypeMapping1.setAccountTypeId(1);

    ProductOfferAccountTypeMapping poAccountTypeMapping2 = new ProductOfferAccountTypeMapping();
    poAccountTypeMapping2.setOfferId(1);
    poAccountTypeMapping2.setAccountTypeId(2);

    poAccountTypeMappings = new ArrayList<ProductOfferAccountTypeMapping>();
    poAccountTypeMappings.add(poAccountTypeMapping1);
    poAccountTypeMappings.add(poAccountTypeMapping2);

    PaginatedList<ProductOfferAccountTypeMapping> paginatedPoAccTypeMapping =
        new PaginatedList<ProductOfferAccountTypeMapping>();
    paginatedPoAccTypeMapping.setRecords(poAccountTypeMappings);

    poAccountTypeMappingPaginatedRsp =
        new ResponseEntity<PaginatedList<ProductOfferAccountTypeMapping>>(paginatedPoAccTypeMapping,
            HttpStatus.OK);

    booleanRspEntity = new ResponseEntity<Boolean>(false, HttpStatus.OK);

  }

  @Test
  public void shouldFindAccountTypeEligibility() throws Exception {
    when(accountTypeClient.findAccountType(page, size, null, "subscriptionAllowed==true"))
        .thenReturn(accountTypePaginatedRsp);
    accountTypeServiceImpl.findAccountTypeEligibility();
  }

  @Test
  public void shouldGetAccountTypeEligibilityInProductOffer() throws Exception {
    when(poAccountTypeMappingClient.findProductOfferAccountTypeMapping(page, size, null,
        "offerId==1")).thenReturn(poAccountTypeMappingPaginatedRsp);
    when(accountTypeClient.findAccountType(page, size, null,
        "typeId=in=(1,2) and subscriptionAllowed==true")).thenReturn(accountTypePaginatedRsp);
    accountTypeServiceImpl.getAccountTypeEligibilityInProductOffer(offerId);
  }

  @Test
  public void shouldAddAccountTypeEligibilityToProductOffer() throws Exception {
    List<ProductOfferAccountTypeMapping> poAccountTypeMappings = new ArrayList<>();;
    ProductOfferAccountTypeMapping productOfferAccountTypeMapping1 =
        new ProductOfferAccountTypeMapping();
    productOfferAccountTypeMapping1.setOfferId(1);
    productOfferAccountTypeMapping1.setAccountTypeId(1);
    ProductOfferAccountTypeMapping productOfferAccountTypeMapping2 =
        new ProductOfferAccountTypeMapping();
    productOfferAccountTypeMapping2.setOfferId(1);
    productOfferAccountTypeMapping2.setAccountTypeId(3);

    poAccountTypeMappings.add(productOfferAccountTypeMapping1);
    poAccountTypeMappings.add(productOfferAccountTypeMapping2);

    when(extendedPoAccountTypeMappingClient
        .createProductOfferAccountTypeMappingBatch(poAccountTypeMappings))
            .thenReturn(booleanRspEntity);
    accountTypeServiceImpl.addAccountTypeEligibilityToProductOffer(offerId, typeIds);
  }

  @Test
  public void shouldRemoveAccountTypeEligibilityFromProductOffer() throws Exception {
    when(extendedPoAccountTypeMappingClient.removeProductOfferAccountTypeMappingInList(offerId,
        typeIds)).thenReturn(booleanRspEntity);
    accountTypeServiceImpl.removeAccountTypeEligibilityFromProductOffer(offerId, typeIds);
  }

  @Test
  public void shouldRefreshAccountTypeEligibilityProductOffer() throws Exception {
    when(poAccountTypeMappingClient.findProductOfferAccountTypeMapping(page, size, null,
        "offerId==1")).thenReturn(poAccountTypeMappingPaginatedRsp);
    when(accountTypeClient.findAccountType(page, size, null,
        "typeId=in=(1,2) and subscriptionAllowed==true")).thenReturn(accountTypePaginatedRsp);
    List<Integer> typeIds2 = new ArrayList<Integer>();
    typeIds2.add(2);
    when(extendedPoAccountTypeMappingClient.removeProductOfferAccountTypeMappingInList(offerId,
        typeIds2)).thenReturn(booleanRspEntity);

    ProductOfferAccountTypeMapping poAccTypeMapping = new ProductOfferAccountTypeMapping();
    poAccTypeMapping.setOfferId(1);
    poAccTypeMapping.setAccountTypeId(3);

    List<ProductOfferAccountTypeMapping> poAccTypeMappings = new ArrayList<>();
    poAccTypeMappings.add(poAccTypeMapping);

    when(extendedPoAccountTypeMappingClient
        .createProductOfferAccountTypeMappingBatch(poAccTypeMappings)).thenReturn(booleanRspEntity);

    accountTypeServiceImpl.refreshAccountTypeEligibilityProductOffer(offerId, typeIds);
  }
}
