package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.client.EnumDataClient;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.EnumData;
import com.ericsson.ecb.customer.client.BusinessPartitionClient;
import com.ericsson.ecb.customer.model.BusinessPartition;
import com.ericsson.ecb.ui.metraoffer.model.CurrenciesAndPartitions;
import com.ericsson.ecb.ui.metraoffer.service.MasterDataService;

@Service
public class MasterDataServiceImpl implements MasterDataService {

  @Autowired
  private EnumDataClient enumDataClient;

  @Autowired
  private BusinessPartitionClient businessPartitionClient;

  @Override
  public Collection<EnumData> getCurrencies() throws EcbBaseException {
    return getCurrenciesInfo(FILTER_CURRENCY);
  }


  @Override
  public Collection<EnumData> getCurrencies(String query) throws EcbBaseException {
    return getCurrenciesInfo(query);
  }

  @Override
  public Collection<BusinessPartition> getUserPartitions() throws EcbBaseException {
    return getPartitions();

  }

  /**
   * Retrieves Currencies and Partitions that are exists in system
   *
   * @return CurrenciesAndPartitions
   * @throws EcbBaseException
   */
  @Override
  public CurrenciesAndPartitions findCurrenciesAndPartitions() throws EcbBaseException {
    CurrenciesAndPartitions currenciesAndPartitions = new CurrenciesAndPartitions();
    currenciesAndPartitions.setCurrencies(getCurrencies());
    currenciesAndPartitions.setPartitions(getUserPartitions());
    return currenciesAndPartitions;
  }

  @Override
  public Collection<EnumData> findEnumData(Integer page, Integer size, String[] sort, String query)
      throws EcbBaseException {
    PaginatedList<EnumData> paginatedList =
        enumDataClient.findEnumData(page, size, sort, query).getBody();
    return paginatedList.getRecords();
  }

  @Override
  public Collection<BusinessPartition> getPartitionById() throws EcbBaseException {
    return getPartitions();
  }

  private Collection<EnumData> getCurrenciesInfo(String query) throws EcbBaseException {
    Collection<EnumData> records = findEnumData(1, Integer.MAX_VALUE, null, query);
    if (!CollectionUtils.isEmpty(records)) {
      records.forEach(currency -> currency.setName(currency.getName()
          .substring(currency.getName().lastIndexOf('/') + 1, currency.getName().length())));
    }
    return records;
  }


  private Collection<BusinessPartition> getPartitions() throws EcbBaseException {
    PaginatedList<BusinessPartition> paginatedList =
        businessPartitionClient.findBusinessPartition(1, Integer.MAX_VALUE, null, null).getBody();
    Collection<BusinessPartition> records = paginatedList.getRecords();
    if (records != null && !records.isEmpty()) {
      records.removeIf(businessPartition -> businessPartition.getAccountId() <= 0);
    }
    return records;
  }

}
