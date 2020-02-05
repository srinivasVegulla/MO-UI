package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.util.Collection;
import java.util.Comparator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.customer.client.AccountAncestorClient;
import com.ericsson.ecb.customer.client.AccountMapperClient;
import com.ericsson.ecb.customer.model.AccountAncestor;
import com.ericsson.ecb.customer.model.AccountMapper;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.model.User;
import com.ericsson.ecb.ui.metraoffer.service.UserService;
import com.ericsson.ecb.ui.metraoffer.utils.MoErrorMessagesUtil;

@Service
public class UserServiceImpl implements UserService {

  private static final Logger LOGGER = LoggerFactory.getLogger(UserServiceImpl.class);

  @Autowired
  private AccountMapperClient accountMapperClient;

  @Autowired
  private AccountAncestorClient accountAncestorClient;

  @Autowired
  private MoErrorMessagesUtil moErrorMessagesUtil;

  public static final Integer ADMIN_ACC_ID = 137;

  @Override
  public User getUserDetails(String loginName) throws EcbBaseException {
    PaginatedList<AccountMapper> paginatedList =
        accountMapperClient.findAccountMapper(1, Integer.MAX_VALUE, null,
            PropertyRsqlConstants.LOGIN_EQUAL + "'" + loginName + "'").getBody();
    Collection<AccountMapper> records = paginatedList.getRecords();
    if (records == null || records.isEmpty()) {
      throw new IllegalArgumentException(
          moErrorMessagesUtil.getErrorMessages("USER_NOT_EXISTS", loginName));
    } else {
      User user = new User();
      AccountMapper accountMapper = records.iterator().next();
      PaginatedList<AccountAncestor> paginatedAncestorList =
          accountAncestorClient
              .findAccountAncestor(1, Integer.MAX_VALUE, null,
                  PropertyRsqlConstants.DESCENDENT_ID_EQUAL + accountMapper.getAccountId())
              .getBody();
      Collection<AccountAncestor> accountAncestorRecords = paginatedAncestorList.getRecords();
      if (accountAncestorRecords == null || accountAncestorRecords.isEmpty()) {
        throw new IllegalArgumentException(
            moErrorMessagesUtil.getErrorMessages("COULD_NOT_GET_ACCOUNT", loginName));
      }
      if (!accountAncestorRecords.isEmpty()) {
        Comparator<AccountAncestor> comparator =
            (p1, p2) -> Integer.compare(p1.getNumGenerations(), p2.getNumGenerations());
        AccountAncestor maxGenerationsRecord =
            accountAncestorRecords.stream().max(comparator).get();

        String[] accountPath = maxGenerationsRecord.getPath().split("/");
        if (accountPath.length > 2) {
          user.setPartitionId(Integer.valueOf(accountPath[1]));
        } else if (maxGenerationsRecord.getAncestorId().intValue() == 1) {
          user.setPartitionId(maxGenerationsRecord.getAncestorId());
        } else {
          LOGGER.info("Could not identify partition for user :{}", loginName);
        }
        BeanUtils.copyProperties(accountMapper, user);
      }
      return user;
    }
  }

}
