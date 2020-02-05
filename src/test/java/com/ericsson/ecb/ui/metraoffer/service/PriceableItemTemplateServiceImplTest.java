package com.ericsson.ecb.ui.metraoffer.service;

import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ericsson.ecb.catalog.client.ExtendedPriceableItemTemplateClient;
import com.ericsson.ecb.catalog.client.ExtendedPriceableItemTemplateParameterTableMappingClient;
import com.ericsson.ecb.catalog.client.ParameterTableClient;
import com.ericsson.ecb.catalog.client.PriceableItemTemplateClient;
import com.ericsson.ecb.catalog.client.PriceableItemTypeClient;
import com.ericsson.ecb.catalog.client.PriceableItemTypeParameterTableMappingClient;
import com.ericsson.ecb.catalog.client.PricelistClient;
import com.ericsson.ecb.catalog.client.PricelistMappingClient;
import com.ericsson.ecb.catalog.client.RateScheduleClient;
import com.ericsson.ecb.catalog.model.LocalizedPriceableItemTemplate;
import com.ericsson.ecb.catalog.model.ParameterTable;
import com.ericsson.ecb.catalog.model.PriceableItemTemplate;
import com.ericsson.ecb.catalog.model.PriceableItemTemplateParameterTableMapping;
import com.ericsson.ecb.catalog.model.PriceableItemTemplateWithInUse;
import com.ericsson.ecb.catalog.model.PriceableItemType;
import com.ericsson.ecb.catalog.model.PriceableItemTypeParameterTableMapping;
import com.ericsson.ecb.catalog.model.Pricelist;
import com.ericsson.ecb.catalog.model.PricelistMapping;
import com.ericsson.ecb.catalog.model.RateSchedule;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.client.UsageCycleClient;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.common.model.UsageCycle;
import com.ericsson.ecb.pricing.client.DecisionTypeClient;
import com.ericsson.ecb.pricing.model.DecisionType;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.Pagination;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.DiscountModel;
import com.ericsson.ecb.ui.metraoffer.model.NonRecurringChargeModel;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemTemplateModel;
import com.ericsson.ecb.ui.metraoffer.model.PricelistModel;
import com.ericsson.ecb.ui.metraoffer.model.ProductOfferData;
import com.ericsson.ecb.ui.metraoffer.model.UnitDependentRecurringChargeModel;
import com.ericsson.ecb.ui.metraoffer.model.UsagePriceableItemModel;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.PriceableItemTemplateServiceImpl;
import com.ericsson.ecb.ui.metraoffer.utils.CommonUtils;

public class PriceableItemTemplateServiceImplTest {

  @Mock
  private PriceableItemTemplateClient priceableItemTemplateClient;

  @Mock
  private PricelistMappingClient pricelistMappingClient;

  @Mock
  private PriceableItemTypeClient priceItemTypeClient;

  @Mock
  private PricelistClient pricelistClient;

  @Mock
  private RateScheduleClient rateScheduleClient;

  @Mock
  private PricelistMappingService pricelistMappingService;

  @Mock
  private ProductOfferService productOfferService;

  @Mock
  private PriceableItemTypeParameterTableMappingClient priceableItemTypeParameterTableMappingClient;

  @Mock
  private LocalizedEntityService localizedEntity;

  @Mock
  private LocalizedEntityService localizedEntityService;

  @Mock
  private PriceableItemDiscountService priceableItemDiscountService;

  @Mock
  private PriceableItemUsageService priceableItemUsageService;

  @Mock
  private PriceableItemRecurringService priceableItemRecurringService;

  @Mock
  private PriceableItemNonRecurringService priceableItemNonRecurringService;

  @Mock
  private PriceableItemUnitDependentRecurringService priceableItemUnitDependentRecurringService;

  @Mock
  private PriceableItemTemplateServiceImpl priceableItemTemplateServiceImpl;

  @InjectMocks
  private PriceableItemTemplateServiceImpl priceableItemTemplateImpl;

  private PaginatedList<ProductOfferData> paginatedProductOfferData;

  private PaginatedList<Pricelist> paginatedPricelist;

  private PaginatedList<PriceableItemTemplateWithInUse> priceableItemTemplateList =
      new PaginatedList<>();

  @Mock
  private ParameterTableClient parameterTableClient;

  @Mock
  private DecisionTypeClient decisionTypeClient;

  @Mock
  private ExtendedPriceableItemTemplateClient extendedPriceableItemTemplateClient;

  @Mock
  private ProductOfferBundleService productOfferBundleService;

  @Mock
  private UsageCycleClient usageCycleClient;

  @Mock
  private ExtendedPriceableItemTemplateParameterTableMappingClient extendedPriceableItemTemplateParameterTableMappingClient;

  private Integer page = Pagination.DEFAULT_PAGE;
  private Integer size = Pagination.DEFAULT_MAX_SIZE;
  private Integer offerId = 1;
  private Integer templateId = 1;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    Integer templateId = 1;

    PriceableItemTemplate priceableItemTemplate = new PriceableItemTemplate();
    priceableItemTemplate.setTemplateId(templateId);
    priceableItemTemplate.setTemplateParentId(null);
    priceableItemTemplate.setName("Templatename");
    priceableItemTemplate.setDisplayName("TemplateDisplayName");
    priceableItemTemplate.setDescription("TemplateDescription");

    Collection<PriceableItemTemplate> priceableItemTemplateList =
        new ArrayList<PriceableItemTemplate>();
    priceableItemTemplateList.add(priceableItemTemplate);

    PaginatedList<PriceableItemTemplate> paginatedList = new PaginatedList<PriceableItemTemplate>();
    paginatedList.setRecords(priceableItemTemplateList);

    PaginatedList<PricelistMapping> paginatedPMList = new PaginatedList<PricelistMapping>();
    List<PricelistMapping> pricelistMappingList = new ArrayList<PricelistMapping>();
    PricelistMapping pricelistMapping = new PricelistMapping();
    pricelistMapping.setOfferId(1);
    pricelistMapping.setItemTypeKind(PropertyKind.ADJUSTMENT);;
    pricelistMapping.setItemTypeId(1);
    pricelistMapping.setItemTemplateId(1);
    pricelistMapping.setItemInstanceId(1);
    pricelistMappingList.add(pricelistMapping);
    paginatedPMList.setRecords(pricelistMappingList);

    paginatedPricelist = new PaginatedList<>();
    paginatedProductOfferData = new PaginatedList<>();
  }


  @Test
  public void shouldFindPriceableItemTemplate() throws Exception {
    when(extendedPriceableItemTemplateClient.extendedFindPriceableItemTemplate(page, size, null,
        null, null, null, null))
            .thenReturn(new ResponseEntity<PaginatedList<PriceableItemTemplateWithInUse>>(
                priceableItemTemplateList, HttpStatus.OK));
    priceableItemTemplateImpl.findPriceableItemTemplate(page, size, null, null, null, null, null);
  }


  @Test
  public void shouldFindPriceableItemTemplatesForOfferingsOfPo() throws Exception {
    PaginatedList<PriceableItemTemplateWithInUse> paginated = new PaginatedList<>();
    List<PriceableItemTemplateWithInUse> priceableItemTemplateWithInUseList = new ArrayList<>();
    PriceableItemTemplateWithInUse priceableItemTemplateWithInUse =
        new PriceableItemTemplateWithInUse();
    priceableItemTemplateWithInUseList.add(priceableItemTemplateWithInUse);
    paginated.setRecords(priceableItemTemplateWithInUseList);
    ResponseEntity<PaginatedList<PriceableItemTemplateWithInUse>> priceableItemTemplateRsp =
        new ResponseEntity<>(paginated, HttpStatus.OK);
    when(extendedPriceableItemTemplateClient.extendedFindPriceableItemTemplate(page, size, null,
        PropertyRsqlConstants.TEMPLATE_PARENT_ID_IS_NULL_TRUE, null, null, null))
            .thenReturn(priceableItemTemplateRsp);
    priceableItemTemplateImpl.findPriceableItemTemplatesForOfferings(false, offerId, page, size,
        null, null, null, null, null);
  }

  @Test
  public void shouldFindPriceableItemTemplatesForOfferingsOfBundle() throws Exception {
    PaginatedList<PriceableItemTemplateWithInUse> paginated = new PaginatedList<>();
    List<PriceableItemTemplateWithInUse> priceableItemTemplateWithInUseList = new ArrayList<>();
    PriceableItemTemplateWithInUse priceableItemTemplateWithInUse =
        new PriceableItemTemplateWithInUse();
    priceableItemTemplateWithInUseList.add(priceableItemTemplateWithInUse);
    paginated.setRecords(priceableItemTemplateWithInUseList);
    ResponseEntity<PaginatedList<PriceableItemTemplateWithInUse>> priceableItemTemplateRsp =
        new ResponseEntity<>(paginated, HttpStatus.OK);
    when(extendedPriceableItemTemplateClient.extendedFindPriceableItemTemplate(page, size, null,
        PropertyRsqlConstants.TEMPLATE_PARENT_ID_IS_NULL_TRUE, null, null, null))
            .thenReturn(priceableItemTemplateRsp);

    Collection<Integer> poBundle = new ArrayList<>();
    poBundle.add(125);
    when(productOfferBundleService.getProductOfferIdsInBundle(offerId)).thenReturn(poBundle);
    priceableItemTemplateImpl.findPriceableItemTemplatesForOfferings(true, offerId, page, size,
        null, null, null, null, null);
  }

  @Test
  public void shouldFindPriceableItemTemplateModel() throws Exception {
    ResponseEntity<PaginatedList<PriceableItemTemplateWithInUse>> priceableItemTemplateWithInUseRsp =
        new ResponseEntity<PaginatedList<PriceableItemTemplateWithInUse>>(HttpStatus.OK);
    when(extendedPriceableItemTemplateClient.extendedFindPriceableItemTemplate(page, size, null,
        null, null, null, null)).thenReturn(priceableItemTemplateWithInUseRsp);
    priceableItemTemplateImpl.findPriceableItemTemplate(page, size, null, null, null, null, null);
  }


  @Test
  public void shouldFindPriceableItemTemplateGridView() throws Exception {

    PaginatedList<PriceableItemTemplateWithInUse> paginatedP = new PaginatedList<>();
    List<PriceableItemTemplateWithInUse> priceableItemTemplateWithInUseList = new ArrayList<>();
    PriceableItemTemplateWithInUse priceableItemTemplateWithInUse =
        new PriceableItemTemplateWithInUse();
    priceableItemTemplateWithInUse.setTemplateId(1);
    priceableItemTemplateWithInUse.setTemplateParentId(2);
    priceableItemTemplateWithInUse.setSharedRateListCount(0);
    priceableItemTemplateWithInUse.setKind(PropertyKind.USAGE);
    priceableItemTemplateWithInUseList.add(priceableItemTemplateWithInUse);
    paginatedP.setRecords(priceableItemTemplateWithInUseList);

    PaginatedList<PriceableItemTemplateModel> paginatedModel = new PaginatedList<>();
    CommonUtils.copyPaginatedList(paginatedP, paginatedModel);

    ResponseEntity<PaginatedList<PriceableItemTemplateWithInUse>> priceableItemTemplateWithInUseRsp =
        new ResponseEntity<PaginatedList<PriceableItemTemplateWithInUse>>(paginatedP,
            HttpStatus.OK);
    when(extendedPriceableItemTemplateClient.extendedFindPriceableItemTemplate(page, size, null,
        PropertyRsqlConstants.TEMPLATE_PARENT_ID_IS_NULL_TRUE, null, null, null))
            .thenReturn(priceableItemTemplateWithInUseRsp);

    PaginatedList<PriceableItemTemplateWithInUse> paginatedP2 = new PaginatedList<>();
    List<PriceableItemTemplateWithInUse> priceableItemTemplateWithInUseList2 = new ArrayList<>();
    PriceableItemTemplateWithInUse priceableItemTemplateWithInUse2 =
        new PriceableItemTemplateWithInUse();
    priceableItemTemplateWithInUse2.setTemplateParentId(1);
    priceableItemTemplateWithInUse2.setKind(PropertyKind.USAGE);
    priceableItemTemplateWithInUse2.setSharedRateListCount(0);
    priceableItemTemplateWithInUseList2.add(priceableItemTemplateWithInUse2);
    paginatedP2.setRecords(priceableItemTemplateWithInUseList2);

    CommonUtils.copyPaginatedList(paginatedP2, paginatedModel);

    ResponseEntity<PaginatedList<PriceableItemTemplateWithInUse>> priceableItemTemplateWithInUseRsp2 =
        new ResponseEntity<PaginatedList<PriceableItemTemplateWithInUse>>(paginatedP2,
            HttpStatus.OK);
    when(extendedPriceableItemTemplateClient.extendedFindPriceableItemTemplate(page, size, null,
        PropertyRsqlConstants.TEMPLATE_PARENT_ID_IS_NULL_FALSE, null, null, null))
            .thenReturn(priceableItemTemplateWithInUseRsp2);

    PaginatedList<PriceableItemType> paginatedPt = new PaginatedList<>();
    List<PriceableItemType> priceableItemTypeList = new ArrayList<>();
    PriceableItemType priceableItemType = new PriceableItemType();
    priceableItemTypeList.add(priceableItemType);
    paginatedPt.setRecords(priceableItemTypeList);

    ResponseEntity<PaginatedList<PriceableItemType>> priceableItemTypeRsp =
        new ResponseEntity<>(paginatedPt, HttpStatus.OK);
    when(priceItemTypeClient.findPriceableItemType(page, size, null, null, null, null, null))
        .thenReturn(priceableItemTypeRsp);

    priceableItemTemplateImpl.findPriceableItemTemplateGridView(page, size, null, null, null, null,
        null);
  }

  @Test
  public void shouldFindInUseOfferings() throws Exception {
    Collection<ProductOfferData> productOffers = new ArrayList<>();
    ProductOfferData productOfferData = new ProductOfferData();
    productOfferData.setOfferId(offerId);
    productOffers.add(productOfferData);
    paginatedProductOfferData.setRecords(productOffers);

    Set<Integer> offerIds = new HashSet<>();
    offerIds.add(offerId);

    when(productOfferService.findOfferingsForInUse(offerIds, page, 1, null, null, null, null, null))
        .thenReturn(paginatedProductOfferData);

    priceableItemTemplateImpl.findInUseOfferings(templateId, page, size, null, null, null, null,
        null);
  }

  @Test
  public void shouldFindInUseSharedRateList() throws Exception {
    Set<Integer> childPiTemplate = new HashSet<>();
    Collection<PricelistModel> pricelistsModel = new ArrayList<>();

    PaginatedList<PricelistModel> pricelistModelCollection = new PaginatedList<>();
    PricelistModel pricelistModel = new PricelistModel();
    pricelistModel.setPricelistId(1);
    pricelistsModel.add(pricelistModel);
    pricelistModelCollection.setRecords(pricelistsModel);
    ResponseEntity<PaginatedList<PricelistModel>> reponseEntityPricelistModel =
        new ResponseEntity<>(pricelistModelCollection, HttpStatus.OK);

    Collection<Pricelist> pricelists = new ArrayList<>();
    Pricelist pricelist = new Pricelist();
    pricelist.setPricelistId(1);
    pricelists.add(pricelist);
    paginatedPricelist.setRecords(pricelists);

    ResponseEntity<PaginatedList<Pricelist>> reponseEntityPricelist =
        new ResponseEntity<>(paginatedPricelist, HttpStatus.OK);

    RateSchedule rateSchedule = new RateSchedule();
    rateSchedule.setPricelistId(1);
    rateSchedule.setItemTemplateId(1);
    rateSchedule.setItemTemplateDisplayName("AudioConfCall");
    rateSchedule.setItemTemplateDisplayNameId(3);
    Collection<RateSchedule> rateScheduleList = new ArrayList<>();
    rateScheduleList.add(rateSchedule);

    PaginatedList<RateSchedule> paginatedRateSchedule = new PaginatedList<>();
    paginatedRateSchedule.setRecords(rateScheduleList);
    ResponseEntity<PaginatedList<RateSchedule>> value =
        new ResponseEntity<>(paginatedRateSchedule, HttpStatus.OK);
    when(rateScheduleClient.findRateSchedule(1, Integer.MAX_VALUE, null, "itemTemplateId=in=(1)",
        null, null, null)).thenReturn(value);

    when(pricelistClient.findPricelist(page, size, null,
        PropertyRsqlConstants.PRICELIST_ID_IN + "(1)" + RsqlOperator.AND
            + PropertyRsqlConstants.TYPE_EQUAL_REGULAR,
        null, null, null)).thenReturn(reponseEntityPricelist);

    when(localizedEntity.localizedFindEntity(reponseEntityPricelistModel.getBody()))
        .thenReturn(reponseEntityPricelistModel.getBody());
    priceableItemTemplateImpl.findInUseSharedRateList(templateId, childPiTemplate, page, size, null,
        null, null, null, null);
  }

  @Test
  public void shouldFindInUseSharedRateListForIf() throws Exception {

    Set<Integer> childPiTemplate = new HashSet<>();
    childPiTemplate.add(2);
    childPiTemplate.add(3);

    Collection<PricelistModel> pricelistsModel = new ArrayList<>();

    PaginatedList<PricelistModel> pricelistModelCollection = new PaginatedList<>();
    PricelistModel pricelistModel = new PricelistModel();
    pricelistModel.setPricelistId(1);
    pricelistsModel.add(pricelistModel);
    pricelistModelCollection.setRecords(pricelistsModel);
    ResponseEntity<PaginatedList<PricelistModel>> reponseEntityPricelistModel =
        new ResponseEntity<>(pricelistModelCollection, HttpStatus.OK);


    Collection<Pricelist> pricelists = new ArrayList<>();
    Pricelist pricelist = new Pricelist();
    pricelist.setPricelistId(1);
    pricelists.add(pricelist);
    paginatedPricelist.setRecords(pricelists);

    ResponseEntity<PaginatedList<Pricelist>> reponseEntityPricelist =
        new ResponseEntity<>(paginatedPricelist, HttpStatus.OK);

    Collection<RateSchedule> rateScheduleList = new ArrayList<>();
    RateSchedule rateSchedule1 = new RateSchedule();
    rateSchedule1.setPricelistId(1);
    rateSchedule1.setItemTemplateId(1);
    rateSchedule1.setItemTemplateDisplayName("AudioConfCall");
    rateSchedule1.setItemTemplateDisplayNameId(3);

    RateSchedule rateSchedule2 = new RateSchedule();
    rateSchedule2.setPricelistId(2);
    rateSchedule2.setItemTemplateId(2);
    rateSchedule2.setItemTemplateDisplayName("AudioConfConn");
    rateSchedule2.setItemTemplateDisplayNameId(4);

    RateSchedule rateSchedule3 = new RateSchedule();
    rateSchedule3.setPricelistId(3);
    rateSchedule3.setItemTemplateId(3);
    rateSchedule3.setItemTemplateDisplayName("AudioConfFeature");
    rateSchedule3.setItemTemplateDisplayNameId(5);

    rateScheduleList.add(rateSchedule1);
    rateScheduleList.add(rateSchedule2);
    rateScheduleList.add(rateSchedule3);

    PaginatedList<RateSchedule> paginatedRateSchedule = new PaginatedList<>();
    paginatedRateSchedule.setRecords(rateScheduleList);
    ResponseEntity<PaginatedList<RateSchedule>> value =
        new ResponseEntity<>(paginatedRateSchedule, HttpStatus.OK);
    when(rateScheduleClient.findRateSchedule(1, Integer.MAX_VALUE, null,
        "itemTemplateId=in=(1,2,3)", null, null, null)).thenReturn(value);

    when(pricelistClient.findPricelist(page, size, null,
        PropertyRsqlConstants.PRICELIST_ID_IN + "(1,2,3)" + RsqlOperator.AND
            + PropertyRsqlConstants.TYPE_EQUAL_REGULAR,
        null, null, null)).thenReturn(reponseEntityPricelist);

    when(localizedEntity.localizedFindEntity(reponseEntityPricelistModel.getBody()))
        .thenReturn(reponseEntityPricelistModel.getBody());
    priceableItemTemplateImpl.findInUseSharedRateList(templateId, childPiTemplate, page, size, null,
        null, null, null, null);
  }


  @Test
  public void shouldGetRateTableWithDecisionTypeName() throws EcbBaseException {

    PriceableItemTypeParameterTableMapping record = new PriceableItemTypeParameterTableMapping();
    record.setPiId(1);
    record.setPiId(1);

    List<PriceableItemTypeParameterTableMapping> records = new ArrayList<>();
    records.add(record);

    PaginatedList<PriceableItemTypeParameterTableMapping> paginated = new PaginatedList<>();
    paginated.setRecords(records);

    ResponseEntity<PaginatedList<PriceableItemTypeParameterTableMapping>> value =
        new ResponseEntity<PaginatedList<PriceableItemTypeParameterTableMapping>>(paginated,
            HttpStatus.OK);

    when(priceableItemTypeParameterTableMappingClient.findPriceableItemTypeParameterTableMapping(1,
        Integer.MAX_VALUE, null, PropertyRsqlConstants.PI_ID_EQUAL + 1)).thenReturn(value);
    ParameterTable parameterTable = new ParameterTable();
    parameterTable.setParamtableId(1);
    List<ParameterTable> parameterTables = new ArrayList<>();
    parameterTables.add(parameterTable);

    PaginatedList<ParameterTable> paginatedParamTable = new PaginatedList<>();
    paginatedParamTable.setRecords(parameterTables);

    ResponseEntity<PaginatedList<ParameterTable>> value2 =
        new ResponseEntity<PaginatedList<ParameterTable>>(paginatedParamTable, HttpStatus.OK);

    when(parameterTableClient.findParameterTable(1, Integer.MAX_VALUE, null,
        PropertyRsqlConstants.PARAM_TABLE_ID_IN + "(null)", null, null, null)).thenReturn(value2);
    DecisionType decisionType = new DecisionType();
    List<DecisionType> decisionTypes = new ArrayList<>();
    decisionTypes.add(decisionType);

    PaginatedList<DecisionType> decisionTypePaginated = new PaginatedList<>();
    decisionTypePaginated.setRecords(decisionTypes);

    ResponseEntity<PaginatedList<DecisionType>> value3 =
        new ResponseEntity<PaginatedList<DecisionType>>(decisionTypePaginated, HttpStatus.OK);
    when(decisionTypeClient.findDecisionType(1, Integer.MAX_VALUE, null,
        PropertyRsqlConstants.TABLE_NAME_IN + "(null)")).thenReturn(value3);

    priceableItemTemplateImpl.getRateTableWithDecisionTypeName(1);
  }

  @Test
  public void shouldCreatePriceableItemTemplate() throws EcbBaseException {
    LocalizedPriceableItemTemplate record = new LocalizedPriceableItemTemplate();
    ResponseEntity<PriceableItemTemplate> value = new ResponseEntity<>(record, HttpStatus.OK);
    when(priceableItemTemplateClient.createPriceableItemTemplate(record)).thenReturn(value);
    when(localizedEntity.localizedCreateEntity(record)).thenReturn(record);
    priceableItemTemplateImpl.createPriceableItemTemplate(record);
  }

  @Test
  public void shouldGetPriceableItemTemplate() throws EcbBaseException {
    PriceableItemTemplate record = new PriceableItemTemplate();
    ResponseEntity<PriceableItemTemplate> value = new ResponseEntity<>(record, HttpStatus.OK);
    when(priceableItemTemplateClient.getPriceableItemTemplate(templateId)).thenReturn(value);
    priceableItemTemplateImpl.getPriceableItemTemplate(templateId);
  }

  @Test
  public void shouldgetPriceableItemTemplateDetails() throws EcbBaseException {

    PaginatedList<PriceableItemTemplateWithInUse> paginatedP = new PaginatedList<>();
    List<PriceableItemTemplateWithInUse> priceableItemTemplateWithInUseList = new ArrayList<>();
    PriceableItemTemplateWithInUse priceableItemTemplateWithInUse =
        new PriceableItemTemplateWithInUse();
    priceableItemTemplateWithInUse.setTemplateId(1);
    priceableItemTemplateWithInUseList.add(priceableItemTemplateWithInUse);
    paginatedP.setRecords(priceableItemTemplateWithInUseList);

    ResponseEntity<PaginatedList<PriceableItemTemplateWithInUse>> priceableItemTemplateWithInUseRsp =
        new ResponseEntity<PaginatedList<PriceableItemTemplateWithInUse>>(paginatedP,
            HttpStatus.OK);
    when(extendedPriceableItemTemplateClient.extendedFindPriceableItemTemplate(page, size, null,
        PropertyRsqlConstants.TEMPLATE_ID_EQUAL + 1 + RsqlOperator.AND
            + PropertyRsqlConstants.TEMPLATE_PARENT_ID_IS_NULL_TRUE,
        null, null, null)).thenReturn(priceableItemTemplateWithInUseRsp);

    PaginatedList<PriceableItemTemplateWithInUse> paginatedP2 = new PaginatedList<>();
    List<PriceableItemTemplateWithInUse> priceableItemTemplateWithInUseList2 = new ArrayList<>();
    PriceableItemTemplateWithInUse priceableItemTemplateWithInUse2 =
        new PriceableItemTemplateWithInUse();
    priceableItemTemplateWithInUse2.setTemplateId(1);
    priceableItemTemplateWithInUseList2.add(priceableItemTemplateWithInUse2);
    paginatedP2.setRecords(priceableItemTemplateWithInUseList2);

    ResponseEntity<PaginatedList<PriceableItemTemplateWithInUse>> priceableItemTemplateWithInUseRsp2 =
        new ResponseEntity<PaginatedList<PriceableItemTemplateWithInUse>>(paginatedP2,
            HttpStatus.OK);
    when(extendedPriceableItemTemplateClient.extendedFindPriceableItemTemplate(page, size, null,
        PropertyRsqlConstants.TEMPLATE_PARENT_ID_IS_NULL_FALSE, null, null, null))
            .thenReturn(priceableItemTemplateWithInUseRsp2);

    PaginatedList<PriceableItemType> paginatedPt = new PaginatedList<>();
    List<PriceableItemType> priceableItemTypeList = new ArrayList<>();
    PriceableItemType priceableItemType = new PriceableItemType();
    priceableItemTypeList.add(priceableItemType);
    paginatedPt.setRecords(priceableItemTypeList);

    ResponseEntity<PaginatedList<PriceableItemType>> priceableItemTypeRsp =
        new ResponseEntity<>(paginatedPt, HttpStatus.OK);
    when(priceItemTypeClient.findPriceableItemType(page, size, null, null, null, null, null))
        .thenReturn(priceableItemTypeRsp);

    PaginatedList<PriceableItemTemplateModel> priceableItemTemplateModelPaginated =
        new PaginatedList<>();
    Collection<PriceableItemTemplateModel> priceableItemTemplateModelList = new ArrayList<>();
    PriceableItemTemplateModel priceableItemTemplateModel = new PriceableItemTemplateModel();
    List<PriceableItemTemplateWithInUse> priceableItemTemplateList = new ArrayList<>();
    PriceableItemTemplateWithInUse priceableItemTemplate = new PriceableItemTemplateWithInUse();
    priceableItemTemplateList.add(priceableItemTemplate);
    priceableItemTemplateModel.getChilds().addAll(priceableItemTemplateList);
    priceableItemTemplateModelList.add(priceableItemTemplateModel);
    priceableItemTemplateModelPaginated.setRecords(priceableItemTemplateModelList);

    when(localizedEntity.localizedFindEntity(priceableItemTemplateModelPaginated))
        .thenReturn(priceableItemTemplateModelPaginated);

    priceableItemTemplateImpl.getPriceableItemTemplateDetails(templateId);
  }

  @Test
  public void shouldFindViewChargeType() {
    priceableItemTemplateImpl.findViewChargeType();
  }

  @Test
  public void findCreateChargeType() {
    priceableItemTemplateImpl.findCreateChargeType();
  }

  @Test
  public void shouldGetPriceableItemParamTableMapping() throws EcbBaseException {
    PaginatedList<PriceableItemTemplateParameterTableMapping> PriceableItemTemplateParameterTableMappingPgList =
        new PaginatedList<>();
    ResponseEntity<PaginatedList<PriceableItemTemplateParameterTableMapping>> PriceableItemTemplateParameterTableMappingRsp =
        new ResponseEntity<>(PriceableItemTemplateParameterTableMappingPgList, HttpStatus.OK);
    when(extendedPriceableItemTemplateParameterTableMappingClient
        .findPriceableItemTemplateParameterTableMapping(page, size, null, null, null, null, null))
            .thenReturn(PriceableItemTemplateParameterTableMappingRsp);
    priceableItemTemplateImpl.getPriceableItemParamTableMapping(page, size, null, null, null, null,
        null);
  }

  @Test
  public void shouldDeletePriceableItemTemplate() throws EcbBaseException {
    ResponseEntity<Boolean> value = new ResponseEntity<>(Boolean.TRUE, HttpStatus.OK);
    when(extendedPriceableItemTemplateClient.deletePriceableItemTemplate(templateId))
        .thenReturn(value);
    priceableItemTemplateImpl.deletePriceableItemTemplate(templateId);
  }

  @Test
  public void findInUseOfferingsOfExtendedProps() throws EcbBaseException {
    String query = PropertyRsqlConstants.ITEM_TEMPLATE_KIND_EQUAL + PropertyKind.USAGE.toString();
    List<PricelistMapping> pricelistMappingList = new ArrayList<>();
    PaginatedList<PricelistMapping> PricelistMappingPgList = new PaginatedList<>();
    PricelistMapping pricelistMapping1 = new PricelistMapping();
    pricelistMapping1.setItemTemplateKind(PropertyKind.USAGE);
    pricelistMapping1.setOfferId(1);
    pricelistMappingList.add(pricelistMapping1);

    PricelistMapping pricelistMapping2 = new PricelistMapping();
    pricelistMapping2.setItemTemplateKind(PropertyKind.USAGE);
    pricelistMapping2.setOfferId(2);
    pricelistMappingList.add(pricelistMapping2);

    PricelistMappingPgList.setRecords(pricelistMappingList);
    ResponseEntity<PaginatedList<PricelistMapping>> pricelistMappingRsp =
        new ResponseEntity<>(PricelistMappingPgList, HttpStatus.OK);

    when(pricelistMappingClient.findPricelistMapping(Pagination.DEFAULT_PAGE,
        Pagination.DEFAULT_MAX_SIZE, null, query, null, null, null))
            .thenReturn(pricelistMappingRsp);

    priceableItemTemplateImpl.findInUseOfferingsOfExtendedProps(PropertyKind.USAGE, page, size,
        null, null, null, null, null);
  }

  @Test
  public void shouldGetUsageCycle() throws EcbBaseException {
    UsageCycle usageCycle = new UsageCycle();
    ResponseEntity<UsageCycle> usageCycleRsp = new ResponseEntity<>(usageCycle, HttpStatus.OK);
    when(usageCycleClient.getUsageCycle(1)).thenReturn(usageCycleRsp);
    priceableItemTemplateImpl.getUsageCycle(1);
  }

  @Test
  public void shouldgetPriceableItemTemplateDetailsWithDiscount() throws EcbBaseException {
    DiscountModel discount = Mockito.mock(DiscountModel.class);
    when(priceableItemDiscountService.getDiscountDetails(templateId)).thenReturn(discount);
    priceableItemTemplateImpl.getPriceableItemTemplateDetails(templateId, PropertyKind.DISCOUNT);
  }

  @Test
  public void shouldgetPriceableItemTemplateDetailsWithUsage() throws EcbBaseException {
    UsagePriceableItemModel usage = new UsagePriceableItemModel();
    Collection<PriceableItemTemplateWithInUse> usageChilds = new ArrayList<>();
    PriceableItemTemplateWithInUse child = new PriceableItemTemplateWithInUse();
    child.setTemplateParentId(templateId);
    child.setTemplateId(2);
    usageChilds.add(child);
    usage.setTemplateId(templateId);
    usage.getChilds().addAll(usageChilds);
    when(priceableItemUsageService.getUsagePriceableItemDetailsWithChilds(templateId))
        .thenReturn(usage);

    List<Object> usagePiTemplates = new ArrayList<>();
    usagePiTemplates.add(usage);
    usagePiTemplates.addAll(usageChilds);
    PaginatedList<Object> paginatedTemplate = new PaginatedList<>();
    paginatedTemplate.setRecords(usagePiTemplates);

    when(localizedEntityService.localizedFindEntity(paginatedTemplate))
        .thenReturn(paginatedTemplate);
    priceableItemTemplateImpl.getPriceableItemTemplateDetails(templateId, PropertyKind.USAGE);
  }

  @Test
  public void shouldgetPriceableItemTemplateDetailsWithRecurring() throws EcbBaseException {
    UnitDependentRecurringChargeModel model = Mockito.mock(UnitDependentRecurringChargeModel.class);
    when(priceableItemRecurringService.getRecurringChargeDetails(templateId)).thenReturn(model);
    when(localizedEntityService.localizedGetEntity(model)).thenReturn(model);
    priceableItemTemplateImpl.getPriceableItemTemplateDetails(templateId, PropertyKind.RECURRING);
  }

  @Test
  public void shouldgetPriceableItemTemplateDetailsWithNonRecurring() throws EcbBaseException {
    NonRecurringChargeModel model = Mockito.mock(NonRecurringChargeModel.class);
    when(priceableItemNonRecurringService.getNonRecurringChargeDetails(templateId))
        .thenReturn(model);
    when(localizedEntityService.localizedGetEntity(model)).thenReturn(model);
    priceableItemTemplateImpl.getPriceableItemTemplateDetails(templateId,
        PropertyKind.NON_RECURRING);
  }

  @Test
  public void shouldgetPriceableItemTemplateDetailsWithUnitDependentRecurring()
      throws EcbBaseException {
    UnitDependentRecurringChargeModel model = Mockito.mock(UnitDependentRecurringChargeModel.class);
    when(priceableItemUnitDependentRecurringService
        .getUnitDependentRecurringChargeDetails(templateId)).thenReturn(model);
    when(localizedEntityService.localizedGetEntity(model)).thenReturn(model);
    priceableItemTemplateImpl.getPriceableItemTemplateDetails(templateId,
        PropertyKind.UNIT_DEPENDENT_RECURRING);
  }
}
