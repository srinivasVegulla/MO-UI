package com.ericsson.ecb.ui.metraoffer.service;

import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;

import com.ericsson.ecb.catalog.client.ExtendedPricelistClient;
import com.ericsson.ecb.catalog.client.PricelistClient;
import com.ericsson.ecb.catalog.client.ProductOfferClient;
import com.ericsson.ecb.catalog.client.UnitDependentRecurringChargeClient;
import com.ericsson.ecb.catalog.model.LocalizedPricelist;
import com.ericsson.ecb.catalog.model.LocalizedRateSchedule;
import com.ericsson.ecb.catalog.model.PriceableItemTemplateParameterTableMapping;
import com.ericsson.ecb.catalog.model.Pricelist;
import com.ericsson.ecb.catalog.model.PricelistWithInUse;
import com.ericsson.ecb.catalog.model.RateSchedule;
import com.ericsson.ecb.catalog.model.UnitDependentRecurringCharge;
import com.ericsson.ecb.catalog.model.instance.EffectiveDateMode;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.customer.client.ExtendedSubscriptionClient;
import com.ericsson.ecb.customer.client.SubscriptionClient;
import com.ericsson.ecb.customer.model.AccInfoForInUseRates;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferData;
import com.ericsson.ecb.ui.metraoffer.model.RateScheduleSetDto;
import com.ericsson.ecb.ui.metraoffer.model.ResponseModel;
import com.ericsson.ecb.ui.metraoffer.model.SharedPricelistDto;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.PricelistMappingServiceImpl;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.PricelistServiceImpl;

public class PricelistServiceImplTest {

  @Mock
  private PricelistClient pricelistClient;

  @InjectMocks
  private PricelistServiceImpl pricelistServiceImpl;

  @Mock
  private PricelistMappingServiceImpl pricelistMappingService;

  @Mock
  private ProductOfferClient productOfferClient;

  @Mock
  private SubscriptionClient subscriptionClient;

  @Mock
  private ExtendedPricelistClient extendedPricelistClient;

  @Mock
  private RateScheduleService rateScheduleService;

  @Mock
  private ProductOfferService productOfferService;

  @Mock
  private PriceableItemTemplateService priceableItemTemplateService;

  @Mock
  private ExtendedSubscriptionClient extendedSubscriptionClient;

  @Mock
  private LocalizedEntityService localizedEntityService;

  @Mock
  private MetadataConfigService metadataConfigService;

  @Mock
  private PricelistService pricelistService;

  @Mock
  private UnitDependentRecurringChargeClient unitDependentRecurringChargeClient;

  private PaginatedList<RateSchedule> paginatedRateSchedule = new PaginatedList<>();

  private PaginatedList<PriceableItemTemplateParameterTableMapping> templateTableMappingPaginatedList =
      new PaginatedList<>();

  private static final Integer PRICELIST_ID = 50;

  private Integer pricelistId = 1;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    List<RateSchedule> rateSchedules = new ArrayList<>();
    RateSchedule rateSchedule = new RateSchedule();
    rateSchedule.setPtId(50);
    rateSchedule.setItemTemplateId(1);
    rateSchedule.setSchedId(10);
    rateSchedule.setPricelistId(PRICELIST_ID);
    rateSchedules.add(rateSchedule);
    RateSchedule rateSchedule2 = new RateSchedule();
    rateSchedule2.setPtId(51);
    rateSchedule2.setItemTemplateId(2);
    rateSchedule2.setTemplateParentId(1);
    rateSchedule2.setSchedId(20);
    rateSchedule2.setPricelistId(PRICELIST_ID);
    rateSchedules.add(rateSchedule2);
    RateSchedule rateSchedule3 = new RateSchedule();
    rateSchedule3.setPtId(52);
    rateSchedule3.setItemTemplateId(3);
    rateSchedule3.setTemplateParentId(4);
    rateSchedule3.setSchedId(20);
    rateSchedule3.setPricelistId(PRICELIST_ID);
    rateSchedules.add(rateSchedule3);
    paginatedRateSchedule.setRecords(rateSchedules);

    List<PriceableItemTemplateParameterTableMapping> templateTableMappingRecords =
        new ArrayList<>();
    PriceableItemTemplateParameterTableMapping tableTemplateMapping =
        new PriceableItemTemplateParameterTableMapping();
    tableTemplateMapping.setTemplateId(10);
    tableTemplateMapping.setTemplateParentId(11);
    tableTemplateMapping.setPtId(50);
    tableTemplateMapping.setKind(PropertyKind.USAGE);
    PriceableItemTemplateParameterTableMapping tableTemplateMapping1 =
        new PriceableItemTemplateParameterTableMapping();
    tableTemplateMapping1.setTemplateId(20);
    tableTemplateMapping1.setTemplateParentId(21);
    tableTemplateMapping1.setPtId(51);
    tableTemplateMapping1.setKind(PropertyKind.RECURRING);
    templateTableMappingRecords.add(tableTemplateMapping);
    templateTableMappingRecords.add(tableTemplateMapping1);

    PriceableItemTemplateParameterTableMapping tableTemplateMapping2 =
        new PriceableItemTemplateParameterTableMapping();
    tableTemplateMapping2.setPropId(1);
    tableTemplateMapping2.setKind(PropertyKind.UNIT_DEPENDENT_RECURRING);
    tableTemplateMapping2.setPtName("metratech.com/UDRCTiered");
    templateTableMappingRecords.add(tableTemplateMapping2);

    PriceableItemTemplateParameterTableMapping tableTemplateMapping3 =
        new PriceableItemTemplateParameterTableMapping();
    tableTemplateMapping3.setPropId(2);
    tableTemplateMapping3.setKind(PropertyKind.UNIT_DEPENDENT_RECURRING);
    tableTemplateMapping3.setPtName("metratech.com/UDRCTapered");
    templateTableMappingRecords.add(tableTemplateMapping3);
    templateTableMappingPaginatedList.setRecords(templateTableMappingRecords);
  }

  @Test
  public void shouldFindPricelist() throws Exception {
    PaginatedList<Pricelist> paginatedList = new PaginatedList<Pricelist>();
    ResponseEntity<PaginatedList<Pricelist>> responseEntitity =
        new ResponseEntity<PaginatedList<Pricelist>>(paginatedList, HttpStatus.OK);
    when(pricelistClient.findPricelist(1, 20, null, PropertyRsqlConstants.TYPE_EQUAL_REGULAR, null,
        null, null)).thenReturn(responseEntitity);
    pricelistServiceImpl.findPricelist(1, 20, null, null, null, null, null);
  }

  @Test
  public void shouldFindPricelistWithPartition() throws Exception {
    PaginatedList<Pricelist> paginatedList = new PaginatedList<Pricelist>();
    ResponseEntity<PaginatedList<Pricelist>> responseEntitity =
        new ResponseEntity<PaginatedList<Pricelist>>(paginatedList, HttpStatus.OK);
    when(pricelistClient.findPricelist(1, 20, null, PropertyRsqlConstants.TYPE_EQUAL_REGULAR, null,
        null, null)).thenReturn(responseEntitity);
    pricelistServiceImpl.findPricelist(1, 20, null, null, null, null, null);
  }

  @Test
  public void shouldFindPricelistWithQueryNotNull() throws Exception {
    PaginatedList<Pricelist> paginatedList = new PaginatedList<Pricelist>();
    ResponseEntity<PaginatedList<Pricelist>> responseEntitity =
        new ResponseEntity<PaginatedList<Pricelist>>(paginatedList, HttpStatus.OK);
    when(pricelistClient.findPricelist(1, 20, null, "name=='sample' and type==REGULAR", null, null,
        null)).thenReturn(responseEntitity);
    pricelistServiceImpl.findPricelist(1, 20, null, "name=='sample'", null, null, null);
  }

  @Test
  public void shouldFindSharedPricelist() throws Exception {
    PaginatedList<PricelistWithInUse> paginatedList = new PaginatedList<PricelistWithInUse>();
    ResponseEntity<PaginatedList<PricelistWithInUse>> responseEntitity =
        new ResponseEntity<PaginatedList<PricelistWithInUse>>(paginatedList, HttpStatus.OK);
    when(extendedPricelistClient.extendedFindPricelist(1, 20, null,
        PropertyRsqlConstants.TYPE_EQUAL_REGULAR, null, null, null)).thenReturn(responseEntitity);
    pricelistServiceImpl.findSharedPricelist(1, 20, null, null, null, null, null);
  }


  @Test
  public void shouldFindInUseOfferings() throws Exception {
    Pricelist pricelist = new Pricelist();
    ResponseEntity<Pricelist> pricelistRsp = new ResponseEntity<>(pricelist, HttpStatus.OK);
    when(pricelistClient.getPricelist(pricelistId)).thenReturn(pricelistRsp);
    Set<Integer> offerIds = new HashSet<>();
    offerIds.add(1);
    ProductOfferData productOfferData = new ProductOfferData();
    List<ProductOfferData> productOfferDataList = new ArrayList<>();
    productOfferDataList.add(productOfferData);
    PaginatedList<ProductOfferData> value = new PaginatedList<>();
    value.setRecords(productOfferDataList);
    when(productOfferService.findOfferingsForInUse(offerIds, 1, Integer.MAX_VALUE, null, "", null,
        null, null)).thenReturn(value);
    pricelistServiceImpl.findInUseOfferings(pricelistId, 1, 100, null, "name=='sample'", null, null,
        null);
  }

  @Test
  public void shouldFindInUseAccounts() throws Exception {
    PaginatedList<AccInfoForInUseRates> paginatedList = new PaginatedList<AccInfoForInUseRates>();
    ResponseEntity<PaginatedList<AccInfoForInUseRates>> responseEntitity =
        new ResponseEntity<PaginatedList<AccInfoForInUseRates>>(paginatedList, HttpStatus.OK);
    when(extendedSubscriptionClient.getAccountInfoForInUse(1, 20, null, null))
        .thenReturn(responseEntitity);
    pricelistServiceImpl.findInUseSubscribers(1, 20, null, null);
  }

  @Test
  public void shouldDeletePricelist() throws Exception {
    when(extendedPricelistClient.deletePriceList(pricelistId))
        .thenReturn(new ResponseEntity<Boolean>(HttpStatus.OK));
    pricelistServiceImpl.deletePricelist(pricelistId);
  }

  @Test
  public void shouldGetSharedPricelist() throws Exception {
    when(pricelistClient.getPricelist(pricelistId))
        .thenReturn(new ResponseEntity<Pricelist>(HttpStatus.OK));
    pricelistServiceImpl.getSharedPricelist(pricelistId);
  }

  @Test
  public void shouldUpdatePricelist() throws Exception {
    Pricelist pricelist = new Pricelist();
    pricelist.setName("Update Dummy");
    pricelist.setPricelistId(1);
    ResponseEntity<Pricelist> pricelistresp =
        new ResponseEntity<Pricelist>(pricelist, HttpStatus.OK);
    when(pricelistClient.updatePricelist(pricelist, pricelistId))
        .thenReturn(new ResponseEntity<Pricelist>(HttpStatus.OK));
    when(localizedEntityService.localizedUpdateEntity(pricelistresp)).thenReturn(pricelistresp);
    pricelistServiceImpl.updatePricelist(pricelist);
  }

  @Test
  public void shouldCreatePricelist() throws Exception {
    LocalizedPricelist pricelist = new LocalizedPricelist();
    pricelist.setName("New Dummy");
    when(pricelistClient.createPricelist(pricelist))
        .thenReturn(new ResponseEntity<Pricelist>(HttpStatus.OK));
    when(localizedEntityService.localizedCreateEntity(pricelist)).thenReturn(pricelist);
    pricelistServiceImpl.createPricelist(pricelist);
  }

  @Test
  public void shouldCopyPriceList() throws Exception {
    LocalizedPricelist pricelist = new LocalizedPricelist();
    pricelist.setName("New Dummy");
    when(extendedPricelistClient.copyPriceList(pricelistId, pricelist))
        .thenReturn(new ResponseEntity<Pricelist>(HttpStatus.OK));
    when(localizedEntityService.localizedCreateEntity(pricelist)).thenReturn(pricelist);
    pricelistServiceImpl.createPricelist(pricelist);
  }

  @Test
  public void shouldGetPricelist() throws Exception {
    PricelistWithInUse pricelistWithInUse = new PricelistWithInUse();
    List<PricelistWithInUse> pricelistWithInUseList = new ArrayList<>();
    pricelistWithInUseList.add(pricelistWithInUse);
    PaginatedList<PricelistWithInUse> list = new PaginatedList<PricelistWithInUse>();
    list.setRecords(pricelistWithInUseList);
    ResponseEntity<PaginatedList<PricelistWithInUse>> listRsp =
        new ResponseEntity<PaginatedList<PricelistWithInUse>>(list, HttpStatus.OK);
    when(extendedPricelistClient.extendedFindPricelist(1, Integer.MAX_VALUE, null,
        "pricelistId==1 and type==REGULAR", null, null, null)).thenReturn(listRsp);
    when(localizedEntityService.localizedFindEntity(list)).thenReturn(list);
    pricelistServiceImpl.getPricelist(pricelistId);
  }

  @Test
  public void shouldGetMappedParameterTables() throws Exception {
    when(rateScheduleService.findRateSchedule(1, Integer.MAX_VALUE, null,
        "pricelistId==" + PRICELIST_ID)).thenReturn(paginatedRateSchedule);
    when(priceableItemTemplateService.getPriceableItemParamTableMapping(1, Integer.MAX_VALUE, null,
        "templateParentId=in=(1,2,3,4) or templateId=in=(1,2,3,4)", null, null, null))
            .thenReturn(templateTableMappingPaginatedList);
    when(priceableItemTemplateService.getPriceableItemParamTableMapping(1, Integer.MAX_VALUE, null,
        "templateId=in=(1,2,3,20,10) or templateParentId=in=(1,2,3,20,10)", null, null, null))
            .thenReturn(templateTableMappingPaginatedList);
    formUdrcRecords();
    pricelistServiceImpl.getMappedParameterTables(PRICELIST_ID, 1, 2, 10);
  }

  @Test
  public void shouldGetPricelistPriceableItemParamTableMapping() throws Exception {
    when(rateScheduleService.findRateSchedule(1, Integer.MAX_VALUE, null,
        "pricelistId==" + PRICELIST_ID)).thenReturn(paginatedRateSchedule);
    when(priceableItemTemplateService.getPriceableItemParamTableMapping(1, Integer.MAX_VALUE, null,
        "", null, null, null)).thenReturn(templateTableMappingPaginatedList);
    formUdrcRecords();
    pricelistServiceImpl.getPricelistPriceableItemParamTableMapping(PRICELIST_ID, null, 1,
        Integer.MAX_VALUE, null, null, null, null, null);
  }

  @Test
  public void shouldGetPricelistPriceableItemParamTableMappingWithId() throws Exception {
    when(rateScheduleService.findRateSchedule(1, Integer.MAX_VALUE, null,
        "pricelistId==" + PRICELIST_ID)).thenReturn(paginatedRateSchedule);
    when(priceableItemTemplateService.getPriceableItemParamTableMapping(1, Integer.MAX_VALUE, null,
        "templateId==1", null, null, null)).thenReturn(templateTableMappingPaginatedList);
    formUdrcRecords();
    pricelistServiceImpl.getPricelistPriceableItemParamTableMapping(PRICELIST_ID, 1, 1,
        Integer.MAX_VALUE, null, null, null, null, null);
  }

  @Test
  public void shouldGetPricelistPriceableItemParamTableMappingWithQueryString() throws Exception {
    when(rateScheduleService.findRateSchedule(1, Integer.MAX_VALUE, null,
        "pricelistId==" + PRICELIST_ID)).thenReturn(paginatedRateSchedule);
    when(priceableItemTemplateService.getPriceableItemParamTableMapping(1, Integer.MAX_VALUE, null,
        "ptId==50 and templateId==1", null, null, null))
            .thenReturn(templateTableMappingPaginatedList);
    formUdrcRecords();
    pricelistServiceImpl.getPricelistPriceableItemParamTableMapping(PRICELIST_ID, 1, 1,
        Integer.MAX_VALUE, null, "ptId==50", null, null, null);
  }


  private void formUdrcRecords() throws EcbBaseException {
    PaginatedList<UnitDependentRecurringCharge> paginatedUdrc = new PaginatedList<>();
    List<UnitDependentRecurringCharge> records = new ArrayList<>();
    UnitDependentRecurringCharge unitDependentRecurringCharge1 = new UnitDependentRecurringCharge();
    unitDependentRecurringCharge1.setRatingType(0);
    unitDependentRecurringCharge1.setPropId(1);

    UnitDependentRecurringCharge unitDependentRecurringCharge2 = new UnitDependentRecurringCharge();
    unitDependentRecurringCharge2.setRatingType(1);
    unitDependentRecurringCharge2.setPropId(2);
    records.add(unitDependentRecurringCharge1);
    records.add(unitDependentRecurringCharge2);
    paginatedUdrc.setRecords(records);
    ResponseEntity<PaginatedList<UnitDependentRecurringCharge>> value =
        new ResponseEntity<>(paginatedUdrc, HttpStatus.OK);

    when(unitDependentRecurringChargeClient.findUnitDependentRecurringCharge(1, Integer.MAX_VALUE,
        null, "propId=in=(1,2)")).thenReturn(value);
  }

  @Test
  public void shouldAddParameterTables() throws Exception {
    List<SharedPricelistDto> sharedPricelistDtos = new ArrayList<>();
    SharedPricelistDto sharedPricelistDto = new SharedPricelistDto();
    sharedPricelistDto.setPricelistId(123);
    sharedPricelistDto.setPtId(50);
    sharedPricelistDto.setTemplateId(1);
    sharedPricelistDto.setPtId(100);
    sharedPricelistDtos.add(sharedPricelistDto);

    RateScheduleSetDto rateScheduleSetDto = new RateScheduleSetDto();
    List<LocalizedRateSchedule> rateSchedules = new ArrayList<>();
    if (!CollectionUtils.isEmpty(sharedPricelistDtos)) {
      for (SharedPricelistDto dto : sharedPricelistDtos) {
        LocalizedRateSchedule rateSchedule = new LocalizedRateSchedule();
        rateSchedule.setSchedId(dto.getRefId());
        rateSchedule.setItemTemplateId(dto.getTemplateId());
        rateSchedule.setPricelistId(dto.getPricelistId());
        rateSchedule.setPtId(dto.getPtId());
        rateSchedule.setStartDateType(EffectiveDateMode.NOT_SET);
        rateSchedule.setEndDateType(EffectiveDateMode.NOT_SET);
        rateSchedules.add(rateSchedule);
      }
    }
    rateScheduleSetDto.setCreateSet(rateSchedules);
    when(rateScheduleService.editRateScheduleSet(rateScheduleSetDto))
        .thenReturn(new ArrayList<ResponseModel>());
    pricelistServiceImpl.addParameterTables(sharedPricelistDtos);
  }

  @Test
  public void shouldGetSharedRateInUseInfo() throws EcbBaseException {

    PricelistWithInUse pricelistWithInUse = new PricelistWithInUse();
    List<PricelistWithInUse> pricelistWithInUseList = new ArrayList<>();
    pricelistWithInUseList.add(pricelistWithInUse);
    PaginatedList<PricelistWithInUse> paginated = new PaginatedList<>();
    paginated.setRecords(pricelistWithInUseList);
    ResponseEntity<PaginatedList<PricelistWithInUse>> value =
        new ResponseEntity<>(paginated, HttpStatus.OK);
    when(extendedPricelistClient.extendedFindPricelist(1, Integer.MAX_VALUE, null,
        "pricelistId==1 and type==REGULAR", null, null, null)).thenReturn(value);
    when(localizedEntityService.localizedFindEntity(paginated)).thenReturn(paginated);
    pricelistServiceImpl.getSharedRateInUseInfo(pricelistId);
  }

  @Test
  public void shouldFindRqrdSharedPricelist() throws EcbBaseException {
    String query = PropertyRsqlConstants.ITEM_TEMPLATE_ID_EQUAL + 1 + RsqlOperator.AND
        + PropertyRsqlConstants.PT_ID_EQUAL + 50;

    List<RateSchedule> rateSchedules = new ArrayList<>();
    RateSchedule rateSchedule3 = new RateSchedule();
    rateSchedule3.setPtId(50);
    rateSchedule3.setItemTemplateId(1);
    rateSchedule3.setSchedId(20);
    rateSchedule3.setPricelistId(PRICELIST_ID);
    rateSchedules.add(rateSchedule3);
    paginatedRateSchedule.setRecords(rateSchedules);

    when(rateScheduleService.findRateSchedule(1, Integer.MAX_VALUE, null, query))
        .thenReturn(paginatedRateSchedule);

    PricelistWithInUse pricelistWithInUse = new PricelistWithInUse();
    pricelistWithInUse.setPricelistId(PRICELIST_ID);
    List<PricelistWithInUse> pricelistWithInUseList = new ArrayList<>();
    pricelistWithInUseList.add(pricelistWithInUse);

    PaginatedList<PricelistWithInUse> paginatedList = new PaginatedList<PricelistWithInUse>();
    paginatedList.setRecords(pricelistWithInUseList);
    ResponseEntity<PaginatedList<PricelistWithInUse>> responseEntitity =
        new ResponseEntity<PaginatedList<PricelistWithInUse>>(paginatedList, HttpStatus.OK);
    when(extendedPricelistClient.extendedFindPricelist(1, Integer.MAX_VALUE, null,
        "pricelistId=in=(50) and type==REGULAR", null, null, null)).thenReturn(responseEntitity);

    pricelistServiceImpl.findRqrdSharedPricelist(1, 50);
  }

  @Test
  public void shouldFindRqrdSharedPricelistForElse() throws EcbBaseException {
    String query = PropertyRsqlConstants.ITEM_TEMPLATE_ID_EQUAL + 1 + RsqlOperator.AND
        + PropertyRsqlConstants.PT_ID_EQUAL + 50;

    List<RateSchedule> rateSchedules = new ArrayList<>();
    paginatedRateSchedule.setRecords(rateSchedules);

    when(rateScheduleService.findRateSchedule(1, Integer.MAX_VALUE, null, query))
        .thenReturn(paginatedRateSchedule);

    PricelistWithInUse pricelistWithInUse = new PricelistWithInUse();
    pricelistWithInUse.setPricelistId(PRICELIST_ID);
    List<PricelistWithInUse> pricelistWithInUseList = new ArrayList<>();
    pricelistWithInUseList.add(pricelistWithInUse);
    PaginatedList<PricelistWithInUse> paginatedList = new PaginatedList<PricelistWithInUse>();
    paginatedList.setRecords(pricelistWithInUseList);
    ResponseEntity<PaginatedList<PricelistWithInUse>> responseEntitity =
        new ResponseEntity<PaginatedList<PricelistWithInUse>>(paginatedList, HttpStatus.OK);
    when(extendedPricelistClient.extendedFindPricelist(1, Integer.MAX_VALUE, null,
        "pricelistId=in=(50) and type==REGULAR", null, null, null)).thenReturn(responseEntitity);

    pricelistServiceImpl.findRqrdSharedPricelist(1, 50);
  }
}
