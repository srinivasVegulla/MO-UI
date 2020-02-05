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

import com.ericsson.ecb.catalog.client.ExtendedPricelistMappingClient;
import com.ericsson.ecb.catalog.client.PricelistMappingClient;
import com.ericsson.ecb.catalog.client.UnitDependentRecurringChargeClient;
import com.ericsson.ecb.catalog.model.PricelistMapping;
import com.ericsson.ecb.catalog.model.UnitDependentRecurringCharge;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntity;
import com.ericsson.ecb.ui.metraoffer.constants.Constants;
import com.ericsson.ecb.ui.metraoffer.constants.Pagination;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.PricelistMappingModel;
import com.ericsson.ecb.ui.metraoffer.model.PricelistMappingVO;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.PricelistMappingServiceImpl;

public class PricelistMappingServiceImplTest {

  @Mock
  private PricelistMappingService pricelistMappingService;

  @Mock
  private ExtendedPricelistMappingClient extendedPricelistMappingClient;

  @InjectMocks
  private PricelistMappingServiceImpl pricelistMappingServiceImpl;

  @Mock
  private PricelistMappingClient pricelistMappingClient;

  @Mock
  private UnitDependentRecurringChargeClient unitDependentRecurringChargeClient;

  @Mock
  private LocalizedEntity localizedEntity;

  private PricelistMappingModel pricelistMappingModel;

  private PricelistMappingVO pricelistMappingVO;

  private ResponseEntity<PaginatedList<PricelistMapping>> pricelistMappingPageable;

  private Integer page = Pagination.DEFAULT_PAGE;
  private Integer size = Pagination.DEFAULT_MAX_SIZE;
  private Integer offerId = 1;
  private Integer piInstanceParentId = 1;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    pricelistMappingModel = new PricelistMappingModel();
    pricelistMappingModel.setOfferId(1);
    pricelistMappingModel.setOfferName("offerName");
    pricelistMappingModel.setOfferDisplayName("offerDisplayName");
    List<PricelistMappingVO> pricelistMappingVOList = new ArrayList<>();
    pricelistMappingVOList.add(pricelistMappingVO);
    Map<String, List<PricelistMappingVO>> map = new HashMap<String, List<PricelistMappingVO>>();
    map.put("USAGE", pricelistMappingVOList);
    pricelistMappingModel.setPricelistMappingVO(map);
    PaginatedList<PricelistMapping> paginatedList = new PaginatedList<PricelistMapping>();
    pricelistMappingPageable =
        new ResponseEntity<PaginatedList<PricelistMapping>>(paginatedList, HttpStatus.OK);
    paginatedList.setRecords(getPricelistMappings());
  }

  @Test
  public void shouldGetPricelistMappingByOfferId() throws Exception {
    when(pricelistMappingClient.findPricelistMapping(Pagination.DEFAULT_PAGE,
        Pagination.DEFAULT_MAX_SIZE, null,
        PricelistMappingServiceImpl.QUERY_FIND_PRICEABLEITEMS_WITH_PARAMTABLES + 1, null, null,
        null)).thenReturn(pricelistMappingPageable);

    PaginatedList<PricelistMapping> paginated = new PaginatedList<>();
    List<PricelistMapping> pricelistMappingList = new ArrayList<>();
    PricelistMapping pricelistMapping = new PricelistMapping();
    pricelistMappingList.add(pricelistMapping);
    paginated.setRecords(pricelistMappingList);

    ResponseEntity<PaginatedList<PricelistMapping>> pricelistMappingRsp =
        new ResponseEntity<>(paginated, HttpStatus.OK);
    when(pricelistMappingClient.findPricelistMapping(Pagination.DEFAULT_PAGE,
        Pagination.DEFAULT_MAX_SIZE,
        null, PricelistMappingServiceImpl.QUERY_FIND_PRICEABLEITEMS
            + PropertyRsqlConstants.OFFER_ID_IN + "(1)",
        null, null, null)).thenReturn(pricelistMappingRsp);
    when(localizedEntity.localizedFindEntity(pricelistMappingRsp.getBody()))
        .thenReturn(pricelistMappingRsp.getBody());
    pricelistMappingServiceImpl.getPricelistMappingByOfferId(1);
  }

  @Test
  public void shouldGetPricelistMappingByOfferIdForUDRC() throws Exception {

    List<PricelistMappingVO> pricelistMappingVOList = new ArrayList<>();
    pricelistMappingVOList.add(pricelistMappingVO);
    Map<String, List<PricelistMappingVO>> map = new HashMap<String, List<PricelistMappingVO>>();
    map.put("1", pricelistMappingVOList);
    pricelistMappingModel.setPricelistMappingVO(map);

    PaginatedList<PricelistMapping> paginatedList = new PaginatedList<PricelistMapping>();
    Collection<PricelistMapping> pricelistMappings = new ArrayList<PricelistMapping>();

    PricelistMapping pricelistMapping1 = new PricelistMapping();
    pricelistMapping1.setParamtableId(1);
    pricelistMapping1.setOfferId(1);
    pricelistMapping1.setItemTypeKind(PropertyKind.UNIT_DEPENDENT_RECURRING);;
    pricelistMapping1.setItemTypeId(1);
    pricelistMapping1.setItemTemplateId(1);
    pricelistMapping1.setItemInstanceId(1);


    PricelistMapping pricelistMapping2 = new PricelistMapping();
    pricelistMapping2.setOfferId(2);
    pricelistMapping2.setItemTypeKind(PropertyKind.UNIT_DEPENDENT_RECURRING);;
    pricelistMapping2.setItemTypeId(2);
    pricelistMapping2.setItemTemplateId(1);
    pricelistMapping2.setItemInstanceId(2);
    pricelistMapping2.setPiInstanceParentId(2);
    pricelistMappings.add(pricelistMapping2);

    pricelistMapping1.setParamtableName(Constants.UDRC_TIERED);
    pricelistMapping1.setParamtableDescription("desc1");
    pricelistMapping1.setParamtableDisplayName("dsip name1");

    paginatedList.setRecords(pricelistMappings);

    ResponseEntity<PaginatedList<PricelistMapping>> pricelistMappingPageable11 =
        new ResponseEntity<PaginatedList<PricelistMapping>>(paginatedList, HttpStatus.OK);

    when(pricelistMappingClient.findPricelistMapping(Pagination.DEFAULT_PAGE,
        Pagination.DEFAULT_MAX_SIZE,
        null, PricelistMappingServiceImpl.QUERY_FIND_PRICEABLEITEMS
            + PropertyRsqlConstants.OFFER_ID_IN + "(1)",
        null, null, null)).thenReturn(pricelistMappingPageable11);


    PaginatedList<UnitDependentRecurringCharge> paginated1 = new PaginatedList<>();
    List<UnitDependentRecurringCharge> UnitDependentRecurringChargeList = new ArrayList<>();
    UnitDependentRecurringCharge unitDependentRecurringCharge = new UnitDependentRecurringCharge();
    unitDependentRecurringCharge.setKind(PropertyKind.UNIT_DEPENDENT_RECURRING);
    unitDependentRecurringCharge.setRatingType(1);
    unitDependentRecurringCharge.setPropId(2);
    UnitDependentRecurringChargeList.add(unitDependentRecurringCharge);
    paginated1.setRecords(UnitDependentRecurringChargeList);
    ResponseEntity<PaginatedList<UnitDependentRecurringCharge>> unitDependentRecurringChargeRsp =
        new ResponseEntity<>(paginated1, HttpStatus.OK);
    when(unitDependentRecurringChargeClient.findUnitDependentRecurringCharge(1, Integer.MAX_VALUE,
        null, PropertyRsqlConstants.PROP_ID_IN + "(2)"))
            .thenReturn(unitDependentRecurringChargeRsp);

    ResponseEntity<PaginatedList<PricelistMapping>> pricelistMappingRsp =
        new ResponseEntity<>(paginatedList, HttpStatus.OK);
    when(pricelistMappingClient.findPricelistMapping(Pagination.DEFAULT_PAGE,
        Pagination.DEFAULT_MAX_SIZE, null,
        PricelistMappingServiceImpl.QUERY_FIND_PRICEABLEITEMS_WITH_PARAMTABLES + 1, null, null,
        null)).thenReturn(pricelistMappingRsp);
    when(localizedEntity.localizedFindEntity(pricelistMappingRsp.getBody()))
        .thenReturn(pricelistMappingRsp.getBody());
    pricelistMappingServiceImpl.getPricelistMappingByOfferId(1);
  }

  @Test
  public void shouldGetPricelistMappingByPiInstanceParentId() throws Exception {
    String query = PropertyRsqlConstants.OFFER_ID_EQUAL + 1 + RsqlOperator.AND
        + PropertyRsqlConstants.PI_INSTANCE_PARENT_ID_EQUAL + 1 + RsqlOperator.AND
        + PropertyRsqlConstants.SUBSCRIPTION_ID_IS_NULL_TRUE;
    when(pricelistMappingClient.findPricelistMapping(page, size, null, query, null, null, null))
        .thenReturn(pricelistMappingPageable);
    pricelistMappingServiceImpl.getPricelistMappingByPiInstanceParentId(offerId,
        piInstanceParentId);
  }

  @Test
  public void shouldGetPricelistMappingItemTemplateIdsByOfferId() throws Exception {
    String query = PropertyRsqlConstants.OFFER_ID_EQUAL + offerId;
    when(pricelistMappingClient.findPricelistMapping(page, size, null, query, null, null, null))
        .thenReturn(pricelistMappingPageable);
    pricelistMappingServiceImpl.getPricelistMappingItemTemplateIdsByOfferId(offerId);
  }

  @Test
  public void shouldUpdatePricelistMapping() throws Exception {
    PricelistMapping pricelistMapping = new PricelistMapping();

    ResponseEntity<PricelistMapping> responseEntity =
        new ResponseEntity<PricelistMapping>(pricelistMapping, HttpStatus.OK);
    when(extendedPricelistMappingClient.updatePricelistMapping(pricelistMapping))
        .thenReturn(responseEntity);
    pricelistMappingServiceImpl.updatePricelistMapping(pricelistMapping);
  }

  private Collection<PricelistMapping> getPricelistMappings() {
    Collection<PricelistMapping> pricelistMappings = new ArrayList<PricelistMapping>();
    PricelistMapping pricelistMapping1 = new PricelistMapping();
    pricelistMapping1.setOfferId(1);
    pricelistMapping1.setItemTypeKind(PropertyKind.USAGE);;
    pricelistMapping1.setItemTypeId(1);
    pricelistMapping1.setItemTemplateId(1);
    pricelistMapping1.setItemInstanceId(1);
    pricelistMapping1.setParamtableId(1);
    pricelistMappings.add(pricelistMapping1);

    PricelistMapping pricelistMapping2 = new PricelistMapping();
    pricelistMapping2.setOfferId(1);
    pricelistMapping2.setItemTypeKind(PropertyKind.ADJUSTMENT);;
    pricelistMapping2.setItemTypeId(1);
    pricelistMapping2.setItemTemplateId(1);
    pricelistMapping2.setItemInstanceId(1);
    pricelistMapping2.setPiInstanceParentId(1);
    pricelistMappings.add(pricelistMapping2);

    PricelistMapping pricelistMapping3 = new PricelistMapping();
    pricelistMapping3.setOfferId(1);
    pricelistMapping3.setItemTypeKind(PropertyKind.NON_RECURRING);;
    pricelistMapping3.setItemTypeId(1);
    pricelistMapping3.setItemTemplateId(1);
    pricelistMapping3.setItemInstanceId(1);
    pricelistMappings.add(pricelistMapping3);

    PricelistMapping pricelistMapping4 = new PricelistMapping();
    pricelistMapping4.setOfferId(1);
    pricelistMapping4.setItemTypeKind(PropertyKind.RECURRING);;
    pricelistMapping4.setItemTypeId(1);
    pricelistMapping4.setItemTemplateId(1);
    pricelistMapping4.setItemInstanceId(1);
    pricelistMappings.add(pricelistMapping4);

    return pricelistMappings;
  }
}
