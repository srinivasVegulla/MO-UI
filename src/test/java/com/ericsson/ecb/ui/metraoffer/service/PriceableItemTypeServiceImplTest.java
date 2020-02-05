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

import com.ericsson.ecb.catalog.client.PriceableItemTypeClient;
import com.ericsson.ecb.catalog.model.PriceableItemType;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.PriceableItemTypeServiceImpl;

public class PriceableItemTypeServiceImplTest {

  @InjectMocks
  private PriceableItemTypeServiceImpl priceableItemTypeServiceImpl;

  @Mock
  private PriceableItemTypeClient priceableItemTypeClient;

  @Mock
  private LocalizedEntityService localizedEntity;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void shouldFindPriceableItemType() throws EcbBaseException {
    PriceableItemType priceableItemType = new PriceableItemType();
    priceableItemType.setPiId(1);
    List<PriceableItemType> list = new ArrayList<>();
    list.add(priceableItemType);
    PaginatedList<PriceableItemType> paginated = new PaginatedList<>();
    paginated.setRecords(list);
    ResponseEntity<PaginatedList<PriceableItemType>> responseEntity =
        new ResponseEntity<>(paginated, HttpStatus.OK);
    when(priceableItemTypeClient.findPriceableItemType(1, Integer.MAX_VALUE, null,
        PropertyRsqlConstants.KIND_NOT_EQUAL + "USAGE", null, null, null))
            .thenReturn(responseEntity);
    when(localizedEntity.localizedFindEntity(paginated)).thenReturn(paginated);
    priceableItemTypeServiceImpl.findPriceableItemType(1, Integer.MAX_VALUE, null, null, null, null,
        null);
  }

  @Test
  public void shouldFindPriceableItemTypeWithQueryParam() throws EcbBaseException {
    PriceableItemType priceableItemType = new PriceableItemType();
    priceableItemType.setPiId(1);
    List<PriceableItemType> list = new ArrayList<>();
    list.add(priceableItemType);
    PaginatedList<PriceableItemType> paginated = new PaginatedList<>();
    paginated.setRecords(list);
    ResponseEntity<PaginatedList<PriceableItemType>> responseEntity =
        new ResponseEntity<>(paginated, HttpStatus.OK);
    when(priceableItemTypeClient.findPriceableItemType(1, Integer.MAX_VALUE, null,
        PropertyRsqlConstants.PI_ID_EQUAL + 1 + RsqlOperator.AND
            + PropertyRsqlConstants.KIND_NOT_EQUAL + "USAGE",
        null, null, null)).thenReturn(responseEntity);
    when(localizedEntity.localizedFindEntity(paginated)).thenReturn(paginated);
    priceableItemTypeServiceImpl.findPriceableItemType(1, Integer.MAX_VALUE, null,
        PropertyRsqlConstants.PI_ID_EQUAL + 1, null, null, null);
  }
}
