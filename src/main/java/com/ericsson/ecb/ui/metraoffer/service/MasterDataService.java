package com.ericsson.ecb.ui.metraoffer.service;

import java.util.Collection;

import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.EnumData;
import com.ericsson.ecb.customer.model.BusinessPartition;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.CurrenciesAndPartitions;

public interface MasterDataService {

  public static final String FILTER_CURRENCY =
      "name" + RsqlOperator.LIKE + "'Global/SystemCurrencies/SystemCurrencies/%'";

  public static final String ACCOUNT_ID_CONDITION = "accountId" + RsqlOperator.EQUAL;

  public Collection<EnumData> getCurrencies() throws EcbBaseException;

  public Collection<EnumData> getCurrencies(String query) throws EcbBaseException;

  public Collection<BusinessPartition> getUserPartitions() throws EcbBaseException;

  public Collection<BusinessPartition> getPartitionById() throws EcbBaseException;

  public CurrenciesAndPartitions findCurrenciesAndPartitions() throws EcbBaseException;

  public Collection<EnumData> findEnumData(Integer page, Integer size, String[] sort, String query)
      throws EcbBaseException;

}
