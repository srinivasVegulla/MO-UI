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
import com.ericsson.ecb.common.client.EnumDataClient;
import com.ericsson.ecb.common.model.EnumData;
import com.ericsson.ecb.customer.client.BusinessPartitionClient;
import com.ericsson.ecb.customer.model.BusinessPartition;
import com.ericsson.ecb.ui.metraoffer.constants.Pagination;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.CurrenciesAndPartitions;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.MasterDataServiceImpl;

public class MasterDataServiceImplTest {

  @Mock
  private EnumDataClient enumDataClient;

  @Mock
  private BusinessPartitionClient businessPartitionClient;

  @Mock
  private MasterDataService masterDataService;

  @InjectMocks
  private MasterDataServiceImpl masterDataServiceImpl;

  private CurrenciesAndPartitions currenciesAndPartitions;

  private PaginatedList<EnumData> enumDataPaginated;
  private ResponseEntity<PaginatedList<EnumData>> enumDataPaginatedlist;

  private PaginatedList<BusinessPartition> businessPartitionPaginated;
  private ResponseEntity<PaginatedList<BusinessPartition>> businessPartitionPaginatedlist;

  public static final String FILTER_CURRENCY =
      "name" + RsqlOperator.LIKE + "'Global/SystemCurrencies/SystemCurrencies/%'";

  public static final String ACCOUNT_ID_CONDITION = "accountId==";

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    enumDataPaginated = new PaginatedList<EnumData>();
    enumDataPaginatedlist =
        new ResponseEntity<PaginatedList<EnumData>>(enumDataPaginated, HttpStatus.OK);
    businessPartitionPaginated = new PaginatedList<BusinessPartition>();
    businessPartitionPaginatedlist = new ResponseEntity<PaginatedList<BusinessPartition>>(
        businessPartitionPaginated, HttpStatus.OK);
  }

  @Test
  public void shouldGetCurrencies() throws Exception {
    List<EnumData> list = new ArrayList<EnumData>();
    EnumData enumData = new EnumData();
    enumData.setEnumDataId(1);
    enumData.setName("Global/SystemCurrencies/SystemCurrencies/INR");
    list.add(enumData);
    enumDataPaginated.setRecords(list);
    enumDataPaginated.setTotalCount(1);
    when(enumDataClient.findEnumData(Pagination.DEFAULT_PAGE, Pagination.DEFAULT_MAX_SIZE, null,
        FILTER_CURRENCY)).thenReturn(enumDataPaginatedlist);
    masterDataServiceImpl.getCurrencies();
  }

  @Test
  public void shouldGetCurrenciesByQuery() throws Exception {
    List<EnumData> list = new ArrayList<EnumData>();
    EnumData enumData = new EnumData();
    enumData.setEnumDataId(1);
    enumData.setName("Global/SystemCurrencies/SystemCurrencies/INR");
    list.add(enumData);
    enumDataPaginated.setRecords(list);
    enumDataPaginated.setTotalCount(1);
    when(enumDataClient.findEnumData(Pagination.DEFAULT_PAGE, Pagination.DEFAULT_MAX_SIZE, null,
        FILTER_CURRENCY)).thenReturn(enumDataPaginatedlist);
    masterDataServiceImpl.getCurrencies(FILTER_CURRENCY);
  }

  @Test
  public void shouldGetPartitions() throws Exception {
    List<BusinessPartition> list = new ArrayList<BusinessPartition>();
    BusinessPartition businessPartition = new BusinessPartition();
    businessPartition.setAccountId(1);
    businessPartition.setLogin("root");
    list.add(businessPartition);
    BusinessPartition businessPartition1 = new BusinessPartition();
    businessPartition1.setAccountId(-1);
    businessPartition1.setLogin("root");
    list.add(businessPartition1);
    businessPartitionPaginated.setRecords(list);
    businessPartitionPaginated.setTotalCount(1);
    when(businessPartitionClient.findBusinessPartition(1, Integer.MAX_VALUE, null, null))
        .thenReturn(businessPartitionPaginatedlist);
    masterDataServiceImpl.getUserPartitions();
  }

  @Test
  public void shouldGetPartitionsWithPartitionNotEqualOne() throws Exception {
    List<BusinessPartition> list = new ArrayList<BusinessPartition>();
    BusinessPartition businessPartition = new BusinessPartition();
    businessPartition.setAccountId(2);
    businessPartition.setLogin("root2");
    list.add(businessPartition);
    BusinessPartition businessPartition1 = new BusinessPartition();
    businessPartition1.setAccountId(-1);
    businessPartition1.setLogin("root2");
    list.add(businessPartition1);
    businessPartitionPaginated.setRecords(list);
    businessPartitionPaginated.setTotalCount(1);
    when(businessPartitionClient.findBusinessPartition(1, Integer.MAX_VALUE, null,
        // "accountId==2"
        null)).thenReturn(businessPartitionPaginatedlist);
    masterDataServiceImpl.getUserPartitions();
  }

  @Test
  public void shouldGetPartitionsWithNull() throws Exception {
    List<BusinessPartition> list = new ArrayList<BusinessPartition>();
    BusinessPartition businessPartition = new BusinessPartition();
    businessPartition.setAccountId(2);
    businessPartition.setLogin("root2");
    list.add(businessPartition);
    BusinessPartition businessPartition1 = new BusinessPartition();
    businessPartition1.setAccountId(-1);
    businessPartition1.setLogin("root2");
    list.add(businessPartition1);
    businessPartitionPaginated.setRecords(list);
    businessPartitionPaginated.setTotalCount(1);
    when(businessPartitionClient.findBusinessPartition(1, Integer.MAX_VALUE, null, null))
        .thenReturn(businessPartitionPaginatedlist);
    masterDataServiceImpl.getUserPartitions();
  }

  @Test
  public void shouldGetPartitionsWithNull2() throws Exception {
    List<BusinessPartition> list = new ArrayList<BusinessPartition>();
    BusinessPartition businessPartition = new BusinessPartition();
    businessPartition.setAccountId(1);
    businessPartition.setLogin("root");
    list.add(businessPartition);
    BusinessPartition businessPartition1 = new BusinessPartition();
    businessPartition1.setAccountId(-1);
    businessPartition1.setLogin("root");
    list.add(businessPartition1);
    businessPartitionPaginated.setRecords(list);
    businessPartitionPaginated.setTotalCount(1);
    when(businessPartitionClient.findBusinessPartition(1, Integer.MAX_VALUE, null, null))
        .thenReturn(businessPartitionPaginatedlist);
    masterDataServiceImpl.getUserPartitions();
  }


  @Test
  public void shouldGetPartitionsById() throws Exception {
    List<BusinessPartition> list = new ArrayList<BusinessPartition>();
    BusinessPartition businessPartition = new BusinessPartition();
    businessPartition.setAccountId(1);
    businessPartition.setLogin("root");
    list.add(businessPartition);
    businessPartitionPaginated.setRecords(list);
    businessPartitionPaginated.setTotalCount(1);
    when(businessPartitionClient.findBusinessPartition(1, Integer.MAX_VALUE, null, null))
        .thenReturn(businessPartitionPaginatedlist);
    masterDataServiceImpl.getPartitionById();
  }

  @Test
  public void shouldFindCurrenciesAndPartitions() throws Exception {
    when(enumDataClient.findEnumData(Pagination.DEFAULT_PAGE, Pagination.DEFAULT_MAX_SIZE, null,
        FILTER_CURRENCY)).thenReturn(enumDataPaginatedlist);
    when(businessPartitionClient.findBusinessPartition(1, Integer.MAX_VALUE, null, null))
        .thenReturn(businessPartitionPaginatedlist);
    when(masterDataService.findCurrenciesAndPartitions()).thenReturn(currenciesAndPartitions);
    masterDataServiceImpl.findCurrenciesAndPartitions();
  }
}
