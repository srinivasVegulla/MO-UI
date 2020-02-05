package com.ericsson.ecb.ui.metraoffer.service;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

import com.ericsson.ecb.catalog.client.ProductOfferClient;
import com.ericsson.ecb.catalog.client.SharedPropertyClient;
import com.ericsson.ecb.catalog.model.LocalizedSpecificationCharacteristicValue;
import com.ericsson.ecb.catalog.model.PriceableItemTemplateWithInUse;
import com.ericsson.ecb.catalog.model.PricelistMapping;
import com.ericsson.ecb.catalog.model.ProductOffer;
import com.ericsson.ecb.catalog.model.ReasonCode;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.client.BasePropertyClient;
import com.ericsson.ecb.common.client.DescriptionClient;
import com.ericsson.ecb.common.client.ExtendedDescriptionClient;
import com.ericsson.ecb.common.client.LanguageClient;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.AggregatedLocalizedInfo;
import com.ericsson.ecb.common.model.Description;
import com.ericsson.ecb.common.model.Language;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.exception.PartialContentException;
import com.ericsson.ecb.ui.metraoffer.model.AdjustmentModel;
import com.ericsson.ecb.ui.metraoffer.model.Localization;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemTemplateModel;
import com.ericsson.ecb.ui.metraoffer.model.SubscriptionProperty;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.LocalizationServiceImpl;

public class LocalizationServiceImplTest {

  @Mock
  private LocalizationService localizationService;

  @InjectMocks
  private LocalizationServiceImpl localizationServiceImpl;

  @Mock
  private BasePropertyClient basePropertyClient;

  @Mock
  private DescriptionClient descriptionClient;

  @Mock
  private SharedPropertyClient sharedPropertyClient;

  @Mock
  private LanguageClient languageClient;

  @Mock
  private ProductOfferClient productOfferClient;

  @Mock
  private ProductOfferBundleService productOfferBundleService;

  @Mock
  private PricelistMappingService pricelistMappingService;

  @Mock
  private SubscriptionPropertyService subscriptionPropertyService;

  @Mock
  private PriceableItemTemplateService priceableItemTemplateService;

  @Mock
  private AdjustmentService adjustmentService;

  @Mock
  private ExtendedDescriptionClient extendedDescriptionClient;

  private ResponseEntity<PaginatedList<Language>> languageResponse;

  private ResponseEntity<ProductOffer> productOfferRsp;

  private ProductOffer productOffer;

  private Integer offerId = 1;

  private Integer page = 1;

  private Integer size = Integer.MAX_VALUE;

  public static String KIND_IN = "kind" + RsqlOperator.IN;

  private String kindQuery = KIND_IN + "(" + PropertyKind.ADJUSTMENT.toString() + ","
      + PropertyKind.DISCOUNT.toString() + "," + PropertyKind.USAGE.toString() + ","
      + PropertyKind.RECURRING.toString() + "," + PropertyKind.NON_RECURRING.toString() + ","
      + PropertyKind.UNIT_DEPENDENT_RECURRING.toString() + "," + PropertyKind.REASON_CODE.toString()
      + ")";

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    languageResponse = prepareLanguageResponseObj();
    productOffer = new ProductOffer();
    productOffer.setOfferId(offerId);
    productOffer.setBundle(true);
    productOfferRsp = new ResponseEntity<ProductOffer>(productOffer, HttpStatus.OK);
  }

  @Test
  public void shouldFindLanguage() throws Exception {
    when(languageClient.findLanguage(page, size, null, null)).thenReturn(languageResponse);
    localizationServiceImpl.findLanguage(page, size, null, null);
  }

  @Test
  public void shouldFindLocalization() throws Exception {

    AggregatedLocalizedInfo aggregatedLocalizedInfo = new AggregatedLocalizedInfo();
    List<AggregatedLocalizedInfo> aggregatedLocalizedInfoList = new ArrayList<>();
    aggregatedLocalizedInfoList.add(aggregatedLocalizedInfo);
    PaginatedList<AggregatedLocalizedInfo> paginatedList = new PaginatedList<>();
    paginatedList.setRecords(aggregatedLocalizedInfoList);

    ResponseEntity<PaginatedList<AggregatedLocalizedInfo>> value =
        new ResponseEntity<>(paginatedList, HttpStatus.OK);
    when(extendedDescriptionClient.getLocalizedInfo(page, size, null, null)).thenReturn(value);
    when(languageClient.findLanguage(page, Integer.MAX_VALUE, null, null))
        .thenReturn(prepareLanguageResponseObj());
    localizationServiceImpl.findLocalization(page, Integer.MAX_VALUE, null, null);
  }

  @Test
  public void shouldUpdateLocalization() throws Exception {
    Set<String> langCodes = new HashSet<>();
    langCodes.add("us");
    String desc="Sample Po";
    Description description = new Description();
    description.setDescId(1);
    description.setLangCodeId(1);
    description.setDesc(desc);

    List<Description> descriptions = new ArrayList<Description>();
    descriptions.add(description);

    Map<String, String> localizationMap = new HashMap<String, String>();
    localizationMap.put("us", desc);

    List<Localization> localizationList = new ArrayList<Localization>();
    Localization localization = new Localization();
    localization.setDescId(1);
    localization.getLocalizationMap().putAll(localizationMap);
    localizationList.add(localization);

    when(languageClient.findLanguage(page, size, null, null)).thenReturn(languageResponse);
    
    List<Description> list=new ArrayList<Description>();
    ResponseEntity<List<Description>> value =
        new ResponseEntity<>(list, HttpStatus.OK);

    when(extendedDescriptionClient.createOrUpdateDescriptionBatch(descriptions)).thenReturn(value);
    
    localizationServiceImpl.updateLocalization(localizationList, langCodes);
  }

  private ResponseEntity<PaginatedList<Language>> prepareLanguageResponseObj() {
    Collection<Language> languages = new ArrayList<Language>();

    Language language1 = new Language();
    language1.setLangCodeId(1);
    language1.setLangCode("us");
    languages.add(language1);

    Language language2 = new Language();
    language2.setLangCodeId(2);
    language2.setLangCode("jp");
    languages.add(language2);

    Language language3 = new Language();
    language3.setLangCodeId(3);
    language3.setLangCode("fr");
    languages.add(language3);

    PaginatedList<Language> languagPaginated = new PaginatedList<Language>();
    languagPaginated.setRecords(languages);
    return new ResponseEntity<PaginatedList<Language>>(languagPaginated, HttpStatus.OK);
  }

  @Test
  public void shouldGetLanguageCodeMap() throws EcbBaseException {
    when(languageClient.findLanguage(page, size, null, null)).thenReturn(languageResponse);
    localizationServiceImpl.getLanguageCodeMap();
  }

  @Test
  public void shouldFindSubscribableItemLocalization() throws EcbBaseException {
    String queryIn = "propId=in=(1,2,4)";
    List<Integer> offerIds = new ArrayList<>();
    Collection<PricelistMapping> pricelistMappings = new ArrayList<>();
    PricelistMapping pricelistMapping = new PricelistMapping();
    pricelistMapping.setOfferId(1);
    pricelistMapping.setItemInstanceId(2);
    pricelistMappings.add(pricelistMapping);
    when(productOfferClient.getProductOffer(offerId)).thenReturn(productOfferRsp);
    when(productOfferBundleService.getProductOfferIdsInBundle(offerId)).thenReturn(offerIds);
    when(pricelistMappingService.findPricelistMapping(null, "offerId=in=(1)"))
        .thenReturn(pricelistMappings);
    PaginatedList<SubscriptionProperty> subscriptionProperties = new PaginatedList<>();
    List<SubscriptionProperty> subscriptionPropertyList = new ArrayList<>();
    SubscriptionProperty subscriptionProperty = new SubscriptionProperty();
    subscriptionProperty.setSpecId(4);
    subscriptionPropertyList.add(subscriptionProperty);
    subscriptionProperties.setRecords(subscriptionPropertyList);
    when(subscriptionPropertyService.findProductOfferSubscriptionProperties(1, Integer.MAX_VALUE,
        null, null, offerId)).thenReturn(subscriptionProperties);
    ResponseEntity<PaginatedList<AggregatedLocalizedInfo>> localizedInfo =
        getAggregatedLocalizedInfo();
    when(extendedDescriptionClient.getLocalizedInfo(page, size, null, queryIn))
        .thenReturn(localizedInfo);
    when(languageClient.findLanguage(page, size, null, null)).thenReturn(languageResponse);
    localizationServiceImpl.findSubscribableItemLocalization(offerId, page, size, null, "");
  }

  private ResponseEntity<PaginatedList<AggregatedLocalizedInfo>> getAggregatedLocalizedInfo() {

    AggregatedLocalizedInfo aggregatedLocalizedInfo = new AggregatedLocalizedInfo();
    aggregatedLocalizedInfo.setDescId(1);
    aggregatedLocalizedInfo.setKind(PropertyKind.OFFERING);
    aggregatedLocalizedInfo.setProperty("Display Name");
    List<AggregatedLocalizedInfo> aggregatedLocalizedInfoList = new ArrayList<>();
    aggregatedLocalizedInfoList.add(aggregatedLocalizedInfo);
    PaginatedList<AggregatedLocalizedInfo> paginatedList = new PaginatedList<>();
    paginatedList.setRecords(aggregatedLocalizedInfoList);
    ResponseEntity<PaginatedList<AggregatedLocalizedInfo>> localizedInfo =
        new ResponseEntity<>(paginatedList, HttpStatus.OK);
    return localizedInfo;
  }

  @Test
  public void shouldFindPiTemplateLocalization() throws EcbBaseException {
    Integer pItemplateId = 1;
    String queryIn = "propId=in=(1,2,3,4)" + RsqlOperator.AND + kindQuery;
    PriceableItemTemplateModel priceableItemTemplateModel = new PriceableItemTemplateModel();
    priceableItemTemplateModel.setTemplateId(1);
    PriceableItemTemplateWithInUse childPi = new PriceableItemTemplateWithInUse();
    childPi.setTemplateId(2);
    priceableItemTemplateModel.addChild(childPi);
    when(priceableItemTemplateService.getPriceableItemTemplateDetails(pItemplateId))
        .thenReturn(priceableItemTemplateModel);

    Collection<ReasonCode> reasonCodeList = new ArrayList<>();
    ReasonCode reasonCode = new ReasonCode();
    reasonCode.setPropId(3);
    reasonCodeList.add(reasonCode);
    Collection<AdjustmentModel> adjustmentModelList = new ArrayList<>();
    AdjustmentModel adjustmentModel = new AdjustmentModel();
    adjustmentModel.setPropId(4);
    adjustmentModel.getReasonCodes().addAll(reasonCodeList);
    adjustmentModelList.add(adjustmentModel);

    when(adjustmentService.getPiTemplateAdjustmentWithReasonCode(pItemplateId))
        .thenReturn(adjustmentModelList);

    ResponseEntity<PaginatedList<AggregatedLocalizedInfo>> localizedInfo =
        getAggregatedLocalizedInfo();
    when(extendedDescriptionClient.getLocalizedInfo(page, size, null, queryIn))
        .thenReturn(localizedInfo);
    when(languageClient.findLanguage(page, size, null, null)).thenReturn(languageResponse);

    localizationServiceImpl.findPiTemplateLocalization(pItemplateId, page, size, null, "");
  }

  @Test
  public void shouldFindPiInstanceLocalization() throws EcbBaseException {
    Integer piInstanceId = 1;
    String queryIn = "propId=in=(1)" + RsqlOperator.AND + kindQuery;
    ResponseEntity<PaginatedList<AggregatedLocalizedInfo>> localizedInfo =
        getAggregatedLocalizedInfo();
    when(extendedDescriptionClient.getLocalizedInfo(page, size, null, queryIn))
        .thenReturn(localizedInfo);
    when(languageClient.findLanguage(page, size, null, null)).thenReturn(languageResponse);

    localizationServiceImpl.findPiInstanceLocalization(piInstanceId, page, size, null, "");
  }

  @Test
  public void shouldExportToCsv() throws Exception {
    String queryIn = "";
    HttpServletResponse response = mock(HttpServletResponse.class);
    Set<String> langguageCodes = new HashSet<>();
    langguageCodes.add("us");
    LinkedHashMap<String, String> fileHeaderMap = new LinkedHashMap<>();
    ResponseEntity<PaginatedList<AggregatedLocalizedInfo>> localizedInfo =
        getAggregatedLocalizedInfo();
    when(extendedDescriptionClient.getLocalizedInfo(page, size, null, queryIn))
        .thenReturn(localizedInfo);
    when(languageClient.findLanguage(page, size, null, null)).thenReturn(languageResponse);
    ByteArrayOutputStream output = new ByteArrayOutputStream();
    PrintWriter printWriter = new PrintWriter(new OutputStreamWriter(output));
    when(response.getWriter()).thenReturn(printWriter);

    localizationServiceImpl.exportToCsv(response, page, size, null, "", fileHeaderMap,
        langguageCodes);
  }

  @Test
  public void shouldImportFromCvs() throws EcbBaseException {
    MockMultipartFile mfile = new MockMultipartFile("file", "filename.txt", "text/csv",
        "Object Type,Object Name,Property,English(US){us},descId\n Product,Conference Translation,Display Name,DisplayNameTest,1111\n"
            .getBytes());
    when(languageClient.findLanguage(page, size, null, null)).thenReturn(languageResponse);
    List<Description> descriptionListRequest = new ArrayList<>();
    Description description = new Description();
    description.setDescId(1111);
    description.setDesc("DisplayNameTest");
    description.setLangCodeId(1);
    descriptionListRequest.add(description);
    List<Description> descriptionListResponse = new ArrayList<>();
    ResponseEntity<List<Description>> value =
        new ResponseEntity<>(descriptionListResponse, HttpStatus.OK);
    when(extendedDescriptionClient.createOrUpdateDescriptionBatch(descriptionListRequest))
        .thenReturn(value);
    localizationServiceImpl.importFromCsv(mfile);
  }

  @Test(expected = EcbBaseException.class)
  public void shouldImportFromCsvForEcbException() throws EcbBaseException {
    MockMultipartFile mfile = new MockMultipartFile("file", "filename.txt", "text/csv",
        "Object Type,Object Name,Property,English(US){null},descId\n Product,Conference Translation,Display Name,DisplayNameTest,1111\n"
            .getBytes());
    when(languageClient.findLanguage(page, size, null, null)).thenReturn(languageResponse);
    List<Description> descriptionListRequest = new ArrayList<>();
    Description description = new Description();
    description.setDescId(1111);
    description.setDesc("DisplayNameTest");
    description.setLangCodeId(1);
    descriptionListRequest.add(description);
    List<Description> descriptionListResponse = new ArrayList<>();
    ResponseEntity<List<Description>> value =
        new ResponseEntity<>(descriptionListResponse, HttpStatus.OK);
    when(extendedDescriptionClient.createOrUpdateDescriptionBatch(descriptionListRequest))
        .thenReturn(value);
    localizationServiceImpl.importFromCsv(mfile);
  }

  @Test(expected = PartialContentException.class)
  public void shouldImportFromCsv() throws EcbBaseException {
    MockMultipartFile mfile = new MockMultipartFile("file", "filename.txt", "text/csv",
        "Object Type,Object Name,Property,English(US){us},descId\n Product,Conference Translation,Display Name,DisplayNameTest,1111\n"
            .getBytes());
    when(languageClient.findLanguage(page, size, null, null)).thenReturn(languageResponse);
    List<Description> descriptionListRequest = new ArrayList<>();
    Description description = new Description();
    description.setDescId(1111);
    description.setDesc("DisplayNameTest");
    description.setLangCodeId(1);
    descriptionListRequest.add(description);
    ResponseEntity<List<Description>> value =
        new ResponseEntity<>(descriptionListRequest, HttpStatus.OK);
    when(extendedDescriptionClient.createOrUpdateDescriptionBatch(descriptionListRequest))
        .thenReturn(value);
    localizationServiceImpl.importFromCsv(mfile);
  }

  @Test(expected = EcbBaseException.class)
  public void shouldImportFromCvsForDuplicate() throws EcbBaseException {
    MockMultipartFile mfile = new MockMultipartFile("file", "filename.txt", "text/csv",
        "Object Type,Object Name,Property,English(US){us},descId\n Product,Conference Translation,Display Name,DisplayNameTest,1111\n Product,Conference Translation,Display Name,DisplayNameTest,1111"
            .getBytes());
    when(languageClient.findLanguage(page, size, null, null)).thenReturn(languageResponse);
    List<Description> descriptionListRequest = new ArrayList<>();
    Description description = new Description();
    description.setDescId(1111);
    description.setDesc("DisplayNameTest");
    description.setLangCodeId(1);

    Description description1 = new Description();
    description1.setDescId(1111);
    description1.setDesc("DisplayNameTest");
    description1.setLangCodeId(1);

    descriptionListRequest.add(description);
    descriptionListRequest.add(description1);
    List<Description> descriptionListResponse = new ArrayList<>();
    ResponseEntity<List<Description>> value =
        new ResponseEntity<>(descriptionListResponse, HttpStatus.OK);
    when(extendedDescriptionClient.createOrUpdateDescriptionBatch(descriptionListRequest))
        .thenReturn(value);
    localizationServiceImpl.importFromCsv(mfile);
  }

  @Test(expected = EcbBaseException.class)
  public void shouldImportFromCvsForSuperCsvException() throws EcbBaseException {
    MockMultipartFile mfile = new MockMultipartFile("file", "filename.txt", "text/csv",
        "Object Type,Object Name,Property,English(US){us},descId\n Product,Conference Translation Display Name,DisplayNameTest,1111\n"
            .getBytes());
    when(languageClient.findLanguage(page, size, null, null)).thenReturn(languageResponse);
    List<Description> descriptionListRequest = new ArrayList<>();
    Description description = new Description();
    description.setDescId(1111);
    description.setDesc("DisplayNameTest");
    description.setLangCodeId(1);

    /*
     * Description description1 = new Description(); description1.setDescId(1111);
     * description1.setDesc("DisplayNameTest"); description1.setLangCodeId(1);
     */

    descriptionListRequest.add(description);
    // descriptionListRequest.add(description1);
    List<Description> descriptionListResponse = new ArrayList<>();
    ResponseEntity<List<Description>> value =
        new ResponseEntity<>(descriptionListResponse, HttpStatus.OK);
    when(extendedDescriptionClient.createOrUpdateDescriptionBatch(descriptionListRequest))
        .thenReturn(value);
    localizationServiceImpl.importFromCsv(mfile);
  }

  @Test(expected = EcbBaseException.class)
  public void shouldImportFromCvsForNumberFormatException() throws EcbBaseException {
    MockMultipartFile mfile = new MockMultipartFile("file", "filename.txt", "text/csv",
        "Object Type,Object Name,Property,English(US){us},descId\n Product,Conference Translation,Display Name,DisplayNameTest,abc\n"
            .getBytes());
    when(languageClient.findLanguage(page, size, null, null)).thenReturn(languageResponse);
    List<Description> descriptionListRequest = new ArrayList<>();
    Description description = new Description();
    description.setDescId(1111);
    description.setDesc("DisplayNameTest");
    description.setLangCodeId(1);
    descriptionListRequest.add(description);
    List<Description> descriptionListResponse = new ArrayList<>();
    ResponseEntity<List<Description>> value =
        new ResponseEntity<>(descriptionListResponse, HttpStatus.OK);
    when(extendedDescriptionClient.createOrUpdateDescriptionBatch(descriptionListRequest))
        .thenReturn(value);
    localizationServiceImpl.importFromCsv(mfile);
  }

  @Test
  public void shouldGetDescsBylangCodeId() throws EcbBaseException {
    Set<Integer> descIds = new HashSet<>();
    descIds.add(1);
    descIds.add(2);
    Description description1 = new Description();
    description1.setDescId(1);
    description1.setLangCodeId(1);
    Description description2 = new Description();
    description2.setDescId(2);
    description2.setLangCodeId(1);
    List<Description> descriptionList = new ArrayList<>();
    descriptionList.add(description1);
    descriptionList.add(description2);
    PaginatedList<Description> paginated = new PaginatedList<>();
    paginated.setRecords(descriptionList);

    ResponseEntity<PaginatedList<Description>> value =
        new ResponseEntity<>(paginated, HttpStatus.OK);
    when(descriptionClient.findDescription(1, Integer.MAX_VALUE, null,
        "langCodeId==1 and descId=in=(1,2)")).thenReturn(value);
    localizationServiceImpl.getDescsBylangCodeId(descIds, 1);
  }

  @Test
  public void shouldGetSubscriptionPropLocalization() throws EcbBaseException {
    SubscriptionProperty subscriptionProperty = new SubscriptionProperty();
    subscriptionProperty.setSpecId(1);
    subscriptionProperty.setNameId(1);
    subscriptionProperty.setCategoryId(2);
    subscriptionProperty.setDescriptionId(3);
    subscriptionProperty.setSpecType(3);

    List<LocalizedSpecificationCharacteristicValue> values = new ArrayList<>();
    LocalizedSpecificationCharacteristicValue value =
        new LocalizedSpecificationCharacteristicValue();
    value.setValue("value");
    value.setValueId(4);
    values.add(value);
    subscriptionProperty.getValues().addAll(values);
    when(subscriptionPropertyService.getSubscriptionProperty(1)).thenReturn(subscriptionProperty);

    AggregatedLocalizedInfo aggregatedLocalizedInfo = new AggregatedLocalizedInfo();
    List<AggregatedLocalizedInfo> aggregatedLocalizedInfoList = new ArrayList<>();
    aggregatedLocalizedInfoList.add(aggregatedLocalizedInfo);
    PaginatedList<AggregatedLocalizedInfo> paginatedList = new PaginatedList<>();
    paginatedList.setRecords(aggregatedLocalizedInfoList);

    ResponseEntity<PaginatedList<AggregatedLocalizedInfo>> localizedInfo =
        new ResponseEntity<>(paginatedList, HttpStatus.OK);
    when(extendedDescriptionClient.getLocalizedInfo(page, size, null,
        "kind==SHARED_PROP and descId=in=(1,2,3,4)")).thenReturn(localizedInfo);

    when(languageClient.findLanguage(page, size, null, null)).thenReturn(languageResponse);

    localizationServiceImpl.getSubscriptionPropLocalization(1, page, size, null, null);
  }

}
