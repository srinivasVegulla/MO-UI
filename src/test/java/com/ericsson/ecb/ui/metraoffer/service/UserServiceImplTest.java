package com.ericsson.ecb.ui.metraoffer.service;

import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.customer.client.AccountAncestorClient;
import com.ericsson.ecb.customer.client.AccountMapperClient;
import com.ericsson.ecb.customer.model.AccountAncestor;
import com.ericsson.ecb.customer.model.AccountMapper;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.UserServiceImpl;
import com.ericsson.ecb.ui.metraoffer.utils.MoErrorMessagesUtil;

public class UserServiceImplTest {

  @Mock
  private AccountMapperClient accountMapperClient;

  @Mock
  private AccountAncestorClient accountAncestorClient;
  
  @Mock
  private MoErrorMessagesUtil moErrorMessagesUtil;

  @InjectMocks
  private UserServiceImpl userServiceImpl;

  PaginatedList<AccountMapper> accountMapperPaginatedList;

  ResponseEntity<PaginatedList<AccountMapper>> accountMapperResponseEntity;

  PaginatedList<AccountAncestor> accountAncestorPaginatedList;

  ResponseEntity<PaginatedList<AccountAncestor>> accountAncestorResponseEntity;

  private String loginName = "admin";

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    accountMapperPaginatedList = new PaginatedList<AccountMapper>();
    accountMapperResponseEntity =
        new ResponseEntity<PaginatedList<AccountMapper>>(accountMapperPaginatedList, HttpStatus.OK);
    accountAncestorPaginatedList = new PaginatedList<AccountAncestor>();
    accountAncestorResponseEntity = new ResponseEntity<PaginatedList<AccountAncestor>>(
        accountAncestorPaginatedList, HttpStatus.OK);
  }

  @Test(expected = IllegalArgumentException.class)
  public void shouldGetUserDetailsWithException() throws Exception {
    when(accountMapperClient.findAccountMapper(1, Integer.MAX_VALUE, null,
        PropertyRsqlConstants.LOGIN_EQUAL + "'" + loginName + "'"))
            .thenReturn(accountMapperResponseEntity);

    when(accountAncestorClient.findAccountAncestor(1, Integer.MAX_VALUE, null,
        PropertyRsqlConstants.DESCENDENT_ID_EQUAL + 1 + " and ancestorId !=1"))
            .thenReturn(accountAncestorResponseEntity);

    userServiceImpl.getUserDetails(loginName);
  }

  @Test
  public void shouldGetUserDetails() throws Exception {
    List<AccountMapper> accountMapperList = new ArrayList<AccountMapper>();
    AccountMapper accountMapper = new AccountMapper();
    accountMapper.setAccountId(1);
    accountMapper.setLogin("admin");
    accountMapper.setSpace("mt");
    accountMapperList.add(accountMapper);
    accountMapperPaginatedList.setRecords(accountMapperList);

    List<AccountAncestor> accountAncestorList = new ArrayList<AccountAncestor>();
    AccountAncestor accountAncestor = new AccountAncestor();
    accountAncestor.setAncestorId(1);
    accountAncestor.setPath("/137");
    accountAncestorList.add(accountAncestor);
    accountAncestorPaginatedList.setRecords(accountAncestorList);

    when(accountMapperClient.findAccountMapper(1, Integer.MAX_VALUE, null,
        PropertyRsqlConstants.LOGIN_EQUAL + "'" + loginName + "'"))
            .thenReturn(accountMapperResponseEntity);

    when(accountAncestorClient.findAccountAncestor(1, Integer.MAX_VALUE, null,
        PropertyRsqlConstants.DESCENDENT_ID_EQUAL + 1)).thenReturn(accountAncestorResponseEntity);

    userServiceImpl.getUserDetails(loginName);
  }

}
