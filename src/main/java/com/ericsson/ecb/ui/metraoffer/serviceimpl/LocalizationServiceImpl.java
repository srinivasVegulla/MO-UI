package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.MapUtils;
import org.apache.commons.collections4.ListUtils;
import org.apache.commons.collections4.map.CaseInsensitiveMap;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.supercsv.exception.SuperCsvException;
import org.supercsv.io.CsvMapReader;
import org.supercsv.io.CsvMapWriter;
import org.supercsv.prefs.CsvPreference;

import com.ericsson.ecb.catalog.client.ProductOfferClient;
import com.ericsson.ecb.catalog.model.LocalizedSpecificationCharacteristicValue;
import com.ericsson.ecb.catalog.model.PriceableItemTemplateWithInUse;
import com.ericsson.ecb.catalog.model.PricelistMapping;
import com.ericsson.ecb.catalog.model.ProductOffer;
import com.ericsson.ecb.catalog.model.ReasonCode;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.client.DescriptionClient;
import com.ericsson.ecb.common.client.ExtendedDescriptionClient;
import com.ericsson.ecb.common.client.LanguageClient;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.AggregatedLocalizedInfo;
import com.ericsson.ecb.common.model.Description;
import com.ericsson.ecb.common.model.Language;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyConstants;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.exception.PartialContentException;
import com.ericsson.ecb.ui.metraoffer.model.AdjustmentModel;
import com.ericsson.ecb.ui.metraoffer.model.Localization;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemTemplateModel;
import com.ericsson.ecb.ui.metraoffer.model.SubscriptionProperty;
import com.ericsson.ecb.ui.metraoffer.service.AdjustmentService;
import com.ericsson.ecb.ui.metraoffer.service.LocalizationService;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemTemplateService;
import com.ericsson.ecb.ui.metraoffer.service.PricelistMappingService;
import com.ericsson.ecb.ui.metraoffer.service.ProductOfferBundleService;
import com.ericsson.ecb.ui.metraoffer.service.SubscriptionPropertyService;
import com.ericsson.ecb.ui.metraoffer.utils.CommonUtils;
import com.ericsson.ecb.ui.metraoffer.utils.MoErrorMessagesUtil;
import com.ericsson.ecb.ui.metraoffer.utils.MoRsqlParser;
import com.google.gson.Gson;

@Service
public class LocalizationServiceImpl implements LocalizationService {

  @Autowired
  private DescriptionClient descriptionClient;

  @Autowired
  private ExtendedDescriptionClient extendedDescriptionClient;

  @Autowired
  private LanguageClient languageClient;

  @Autowired
  private PriceableItemTemplateService priceableItemTemplateService;

  @Autowired
  private AdjustmentService adjustmentService;

  @Autowired
  private PricelistMappingService pricelistMappingService;

  @Autowired
  private ProductOfferBundleService productOfferBundleService;

  @Autowired
  private ProductOfferClient productOfferClient;

  @Autowired
  private SubscriptionPropertyService subscriptionPropertyService;

  @Autowired
  private MoErrorMessagesUtil moErrorMessagesUtil;

  private String kindQuery = KIND_IN + "(" + PropertyKind.ADJUSTMENT.toString() + ","
      + PropertyKind.DISCOUNT.toString() + "," + PropertyKind.USAGE.toString() + ","
      + PropertyKind.RECURRING.toString() + "," + PropertyKind.NON_RECURRING.toString() + ","
      + PropertyKind.UNIT_DEPENDENT_RECURRING.toString() + "," + PropertyKind.REASON_CODE.toString()
      + ")";

  private static final String FILE_NAME = "fileName";
  private static final String ERROR_TYPE = "errorType";
  private static final String ERROR_MSG = "errorMsg";
  private static final String ERROR_JSON_DATA = "errorJsonData";
  private static final String VALIDATION_ERROR = "VALIDATION_ERROR";
  private static final String DUPLICATE_ERROR = "DUPLICATE_ROW_ERROR";
  private static final String PARTIAL_ERROR = "PARTIAL_UPLOAD_ERROR";

  private static final Logger LOGGER = LoggerFactory.getLogger(ProductOfferBundleServiceImpl.class);

  private Map<Integer, String> getLanguageCodeIdMap() throws EcbBaseException {
    Collection<Language> languages = findLanguage();
    Map<Integer, String> map = new HashMap<>();
    languages.forEach(rec -> map.put(rec.getLangCodeId(), rec.getLangCode()));
    return map;
  }

  @Override
  public Map<String, Integer> getLanguageCodeMap() throws EcbBaseException {
    Collection<Language> languages = findLanguage();
    Map<String, Integer> map = new HashMap<>();
    languages.forEach(rec -> map.put(rec.getLangCode(), rec.getLangCodeId()));
    return map;
  }

  @Override
  public CaseInsensitiveMap<String, Integer> getLanguageCodeCaseInsensitiveMap()
      throws EcbBaseException {
    CaseInsensitiveMap<String, Integer> map = new CaseInsensitiveMap<>();
    map.putAll(getLanguageCodeMap());
    return map;
  }

  private List<Description> updateDescriptionBatch(List<Description> descriptionList)
      throws EcbBaseException {
    return extendedDescriptionClient.createOrUpdateDescriptionBatch(descriptionList).getBody();
  }

  private Collection<Language> findLanguage() throws EcbBaseException {
    return findLanguage(getPage(null), getSize(null), null, null);
  }

  @Override
  public Collection<Language> findLanguage(Integer page, Integer size, String[] sort, String query)
      throws EcbBaseException {
    Collection<Language> languages = languageClient
        .findLanguage(getPage(page), getSize(size), sort, query).getBody().getRecords();
    languages.forEach(language -> {
      if (StringUtils.equals(ENGLISH_US_CODE, language.getLangCode())) {
        language.setDescription(ENGLISH_US_DESCRIPTION);
      } else if (StringUtils.equals(ENGLISH_UK_CODE, language.getLangCode())) {
        language.setDescription(ENGLISH_UK_DESCRIPTION);
      }
    });
    return languages;
  }

  private Map<String, String> findLanguageCodeDesc() throws EcbBaseException {
    Map<String, String> codeDescMap = new HashMap<>();
    Collection<Language> languagegs = findLanguage(1, Integer.MAX_VALUE, null, null);
    languagegs.forEach(lang -> codeDescMap.put(lang.getLangCode(), lang.getDescription()));
    return codeDescMap;
  }

  private Integer getPage(Integer page) {
    return (page != null && page > 0) ? page : 1;
  }

  private Integer getSize(Integer size) {
    return (size != null && size > 0) ? size : Integer.MAX_VALUE;
  }

  @Override
  public Collection<Description> updateLocalization(List<Localization> localizationList,
      Set<String> selectedLangs) throws EcbBaseException {
    Map<String, Integer> languageCodeMap = getLanguageCodeMap();
    List<Description> descriptionList =
        prepareDescriptionPOJO(localizationList, selectedLangs, languageCodeMap);
    return updateDescriptionBatch(descriptionList);
  }

  private List<Description> prepareDescriptionPOJO(List<Localization> localizationList,
      Set<String> selectedLangs, Map<String, Integer> languageCodeMap) {
    List<Description> descriptionList = new ArrayList<>();
    localizationList
        .forEach(localization -> localization.getLocalizationMap().forEach((langCode, desc) -> {
          if (selectedLangs.contains(langCode)) {
            Description description = new Description();
            description.setDesc(desc);
            description.setDescId(localization.getDescId());
            description.setLangCodeId(languageCodeMap.get(langCode));
            descriptionList.add(description);
          }
        }));
    return descriptionList;
  }

  @Override
  public PaginatedList<Localization> findSubscribableItemLocalization(Integer offerId, Integer page,
      Integer size, String[] sort, String queryIn) throws EcbBaseException {
    Collection<Integer> subscribableItemIds = findSubscribableItemId(offerId);
    Collection<Integer> specIds = findProductOfferSubscriptionProperties(offerId);
    Set<Integer> propIdList = new HashSet<>();
    propIdList.addAll(subscribableItemIds);
    propIdList.addAll(specIds);
    String subQuery = CommonUtils.getQueryStringFromCollection(propIdList, PROP_ID_IN);
    String query = !StringUtils.isBlank(queryIn) ? queryIn + RsqlOperator.AND + subQuery : subQuery;
    Collection<Localization> recordsUibe = new ArrayList<>();
    Collection<Localization> recordsApi =
        findLocalization(1, Integer.MAX_VALUE, sort, query).getRecords();
    Set<Integer> kindValues = getPropertyKindValues();
    recordsApi.forEach(localization -> {
      PropertyKind kind = localization.getKind();
      if ((kindValues.contains(kind.getValue())
          && subscribableItemIds.contains(localization.getPropId()))
          || (PropertyKind.SHARED_PROP.equals(kind)
              && specIds.contains(localization.getPropId()))) {
        recordsUibe.add(localization);
      }
    });
    return CommonUtils.customPaginatedList(recordsUibe, page, size);
  }

  private Set<Integer> getPropertyKindValues() {
    Set<Integer> propertyKindValues = new HashSet<>();
    propertyKindValues.add(PropertyKind.OFFERING.getValue());
    propertyKindValues.add(PropertyKind.RECURRING.getValue());
    propertyKindValues.add(PropertyKind.NON_RECURRING.getValue());
    propertyKindValues.add(PropertyKind.UNIT_DEPENDENT_RECURRING.getValue());
    propertyKindValues.add(PropertyKind.DISCOUNT.getValue());
    propertyKindValues.add(PropertyKind.USAGE.getValue());
    return propertyKindValues;
  }

  @Override
  public PaginatedList<Localization> findPiTemplateLocalization(Integer pItemplateId, Integer page,
      Integer size, String[] sort, String queryIn) throws EcbBaseException {
    Set<Integer> propIdList = getPiTemplatePropId(pItemplateId);
    String query = getQuery(propIdList, queryIn);
    LOGGER.info(
        "Query params of findPiTemplateLocalization >> pItemplateId : {}, page : {}, size : {}, sort : {} , query : {} ",
        pItemplateId, page, size, sort, query);
    return findLocalization(page, size, sort, query);
  }

  private String getQuery(Collection<Integer> propIdList, String queryIn) {
    StringBuilder query = new StringBuilder();
    String subQuery = CommonUtils.getQueryStringFromCollection(propIdList, PROP_ID_IN);
    query.append(subQuery).append(RsqlOperator.AND).append(kindQuery);
    if (!StringUtils.isBlank(queryIn))
      query.append(RsqlOperator.AND).append(queryIn);
    return query.toString();
  }

  @Override
  public PaginatedList<Localization> findPiInstanceLocalization(Integer piInstanceId, Integer page,
      Integer size, String[] sort, String queryIn) throws EcbBaseException {
    Collection<Integer> propIdList = getPiInstanceIdList(piInstanceId);
    propIdList.addAll(getChildPiInstanceId(piInstanceId));
    String query = getQuery(propIdList, queryIn);
    LOGGER.info(
        "Query params of findPiTemplateLocalization >> piInstanceId : {}, page : {}, size : {}, sort : {} , query : {} ",
        piInstanceId, page, size, sort, query);

    return findLocalization(page, size, sort, query);
  }

  private Set<Integer> getChildPiInstanceId(Integer piInstanceId) throws EcbBaseException {
    Set<Integer> childPi = new HashSet<>();
    String query = PropertyRsqlConstants.SUBSCRIPTION_ID_IS_NULL_TRUE + RsqlOperator.AND
        + PropertyRsqlConstants.PARAM_TABLE_ID_NULL_TRUE + RsqlOperator.AND
        + PropertyRsqlConstants.PI_INSTANCE_PARENT_ID_EQUAL + piInstanceId;
    Collection<PricelistMapping> pricelistMapping =
        pricelistMappingService.findPricelistMapping(null, query);
    pricelistMapping.forEach(pricelist -> childPi.add(pricelist.getItemInstanceId()));
    return childPi;
  }

  private Set<Integer> getPiTemplatePropId(Integer piTemplateId) throws EcbBaseException {
    Set<Integer> propIdList = new HashSet<>();
    PriceableItemTemplateModel priceableItemTemplateModel =
        priceableItemTemplateService.getPriceableItemTemplateDetails(piTemplateId);
    propIdList.add(piTemplateId);
    List<PriceableItemTemplateWithInUse> priceableItemTemplateList =
        priceableItemTemplateModel.getChilds();
    for (PriceableItemTemplateWithInUse priceableItemTemplate : priceableItemTemplateList) {
      propIdList.add(priceableItemTemplate.getTemplateId());
    }

    Collection<AdjustmentModel> adjustmentModelList =
        adjustmentService.getPiTemplateAdjustmentWithReasonCode(piTemplateId);

    for (AdjustmentModel adjustmentModel : adjustmentModelList) {
      propIdList.add(adjustmentModel.getPropId());
      Collection<ReasonCode> reasonCodeList = adjustmentModel.getReasonCodes();
      for (ReasonCode reasonCode : reasonCodeList) {
        propIdList.add(reasonCode.getPropId());
      }
    }
    return propIdList;
  }

  @Override
  public PaginatedList<Localization> findLocalization(Integer page, Integer size, String[] sort,
      String query) throws EcbBaseException {
    return getLocalizedInfo(page, size, sort, query);
  }

  private PaginatedList<Localization> getLocalizedInfo(Integer page, Integer size, String[] sort,
      String query) throws EcbBaseException {
    List<Localization> localizationList = new ArrayList<>();
    LOGGER.debug(
        "Query params of getLocalizedInfo >> page : {}, size : {}, sort : {} , query : {} ",
        getPage(page), getSize(size), sort, query);

    Map<String, String> duplicateParam = MoRsqlParser.checkDuplicateParams(query);
    if (MapUtils.isNotEmpty(duplicateParam)
        && StringUtils.isNotBlank(duplicateParam.get("langCodeId"))) {
      LOGGER.error(
          "Query string is not correct, Multi language filter does not support, Duplicate param(s) in query string {}",
          duplicateParam);
      throw new EcbBaseException(moErrorMessagesUtil.getErrorMessages("MULTI_LANG_NOT_SUPPORT"));
    }

    PaginatedList<AggregatedLocalizedInfo> paginaedRecords = extendedDescriptionClient
        .getLocalizedInfo(getPage(page), getSize(size), sort, query).getBody();
    Collection<AggregatedLocalizedInfo> records = paginaedRecords.getRecords();
    Map<Integer, String> langIdMap = getLanguageCodeIdMap();

    records.forEach(aggregatedLocalizedInfo -> localizationList
        .add(prepareLocalizationObj(aggregatedLocalizedInfo, langIdMap)));

    PaginatedList<Localization> localizationPaginatedList = new PaginatedList<>();

    CommonUtils.copyPaginatedList(paginaedRecords, localizationPaginatedList);
    localizationPaginatedList.setRecords(localizationList);

    return localizationPaginatedList;
  }

  private Localization prepareLocalizationObj(AggregatedLocalizedInfo record,
      Map<Integer, String> langIdMap) {
    Localization localization = new Localization();
    localization.setKindType(record.getKindType());
    localization.setKind(record.getKind());
    localization.setPropName(record.getPropName());
    localization.setPropId(record.getPropId());
    localization.setDescId(record.getDescId());
    Map<String, String> localizationMapTmp = new HashMap<>();
    Map<Integer, String> descMap = record.getLangDesc();
    langIdMap.forEach((langCodeId, langCode) -> {
      if (descMap.containsKey(langCodeId))
        localizationMapTmp.put(langCode, descMap.get(langCodeId));
      else
        localizationMapTmp.put(langCode, StringUtils.EMPTY);
    });
    localization.getLocalizationMap().putAll(localizationMapTmp);
    localization.setProperty(record.getProperty());
    return localization;
  }

  private Collection<Integer> findSubscribableItemId(Integer offerId) throws EcbBaseException {
    Collection<Integer> propIds = new HashSet<>();
    Collection<Integer> offerIds = new HashSet<>();
    offerIds.add(offerId);
    ProductOffer productOffer = productOfferClient.getProductOffer(offerId).getBody();

    if (productOffer.getBundle()) {
      offerIds.addAll(productOfferBundleService.getProductOfferIdsInBundle(offerId));
    }
    propIds.addAll(offerIds);
    Collection<Integer> itemInstanceIds = getPoPriceableMappingItemInstanceIds(offerIds);
    propIds.addAll(itemInstanceIds);
    return propIds;
  }

  private Collection<Integer> getPoPriceableMappingItemInstanceIds(Collection<Integer> offerIds)
      throws EcbBaseException {
    Collection<Integer> itemInstanceIds = new HashSet<>();
    String query = CommonUtils.getQueryStringFromCollection(offerIds, OFFER_ID_IN);
    Collection<PricelistMapping> pricelistMapping =
        pricelistMappingService.findPricelistMapping(null, query);
    pricelistMapping.forEach(mapping -> itemInstanceIds.add(mapping.getItemInstanceId()));
    return itemInstanceIds;
  }

  private Collection<Integer> findProductOfferSubscriptionProperties(Integer offerId)
      throws EcbBaseException {
    Collection<Integer> propId = new ArrayList<>();
    Collection<SubscriptionProperty> subscriptionPropertyList = subscriptionPropertyService
        .findProductOfferSubscriptionProperties(1, Integer.MAX_VALUE, null, null, offerId)
        .getRecords();
    if (!CollectionUtils.isEmpty(subscriptionPropertyList)) {
      subscriptionPropertyList
          .forEach(subscriptionProperty -> propId.add(subscriptionProperty.getSpecId()));
    }
    return propId;
  }

  private Collection<Integer> getPiInstanceIdList(Integer piInstanceId) throws EcbBaseException {
    Collection<Integer> propId = new ArrayList<>();
    propId.add(piInstanceId);

    Collection<AdjustmentModel> adjustmentModels =
        adjustmentService.getPiInstanceAdjustmentWithReasonCode(piInstanceId);
    if (CollectionUtils.isNotEmpty(adjustmentModels)) {
      adjustmentModels.forEach(adjustmentModel -> {
        propId.add(adjustmentModel.getPropId());
        Collection<ReasonCode> reasonCodes = adjustmentModel.getReasonCodes();
        if (CollectionUtils.isNotEmpty(reasonCodes)) {
          reasonCodes.forEach(reasonCode -> propId.add(reasonCode.getPropId()));
        }
      });
    }
    return propId;
  }

  private LinkedHashMap<String, String> getDefaultHeaders(Set<String> langguageCode)
      throws EcbBaseException {
    LinkedHashMap<String, String> headerMap = new LinkedHashMap<>();
    Map<String, String> langHeader = findLanguageCodeDesc();
    headerMap.put(OBJECT_TYPE_HEADER, OBJECT_TYPE_HEADER);
    headerMap.put(OBJECT_NAME_HEADER, OBJECT_NAME_HEADER);
    headerMap.put(OBJECT_PROPERTY_HEADER, OBJECT_PROPERTY_HEADER);
    if (CollectionUtils.isNotEmpty(langguageCode)) {
      Set<String> langguageCodeSet = getLanguageCodeMap().keySet();
      langguageCode.forEach(langCode -> {
        if (langguageCodeSet.contains(langCode))
          headerMap.put(langCode, langHeader.get(langCode));
      });
    }
    return headerMap;
  }

  private String[] getCsvHeaders(LinkedHashMap<String, String> headerMap) throws EcbBaseException {
    Set<String> langguageCodeSet = getLanguageCodeMap().keySet();
    headerMap.forEach((langCode, header) -> {
      if (langguageCodeSet.contains(langCode)) {
        headerMap.put(langCode, header + "{" + langCode.toUpperCase() + "}");
      }
    });
    headerMap.put(DESC_ID_HEADER, DESC_ID_HEADER);
    Collection<String> headerSet = headerMap.values();
    String[] headers = new String[headerSet.size()];
    headers = headerSet.toArray(headers);
    return headers;
  }

  private Set<String> getLanguageCode(LinkedHashMap<String, String> headerMap)
      throws EcbBaseException {
    Set<String> langCode = new HashSet<>();
    Set<String> langguageCodeSet = getLanguageCodeMap().keySet();
    Iterator<String> langCodeItr = headerMap.keySet().iterator();
    while (langCodeItr.hasNext()) {
      String code = langCodeItr.next();
      if (langguageCodeSet.contains(code))
        langCode.add(code);
    }
    return langCode;
  }

  @Override
  public void exportToCsv(HttpServletResponse response, Integer page, Integer size, String[] sort,
      String query, LinkedHashMap<String, String> fileHeaderMap, Set<String> langguageCodes)
      throws Exception {
    String csvFileName =
        new SimpleDateFormat("'export-localization-'yyyyMMddHHmm'.csv'").format(new Date());

    response.setContentType("text/csv; charset=UTF-8");
    String headerKey = "Content-Disposition";
    String headerValue = String.format("attachment; filename=\"%s\"", csvFileName);
    response.setHeader(headerKey, headerValue);
    PaginatedList<Localization> paginatedRecords = findLocalization(page, size, sort, query);

    CsvMapWriter csvWriter =
        new CsvMapWriter(response.getWriter(), CsvPreference.STANDARD_PREFERENCE);

    String[] headers = null;

    if (CollectionUtils.isNotEmpty(langguageCodes)) {
      fileHeaderMap = getDefaultHeaders(langguageCodes);
      headers = getCsvHeaders(fileHeaderMap);
    } else if (MapUtils.isNotEmpty(fileHeaderMap)) {
      headers = getCsvHeaders(fileHeaderMap);
      langguageCodes = getLanguageCode(fileHeaderMap);
    } else {
      langguageCodes = new HashSet<>();
      langguageCodes.add("us");
      fileHeaderMap = getDefaultHeaders(langguageCodes);
      headers = getCsvHeaders(fileHeaderMap);
    }
    csvWriter.writeHeader(headers);
    Collection<Localization> records = paginatedRecords.getRecords();
    for (Localization record : records) {
      csvWriter.write(getLocalizatioMap(record, fileHeaderMap, langguageCodes), headers);
    }
    csvWriter.close();
  }

  private Map<String, String> getLocalizatioMap(Localization record,
      LinkedHashMap<String, String> headerMap, Set<String> lanCode) {
    Map<String, String> map = new HashMap<>();
    map.put(headerMap.get(OBJECT_TYPE_HEADER), record.getKindType());
    map.put(headerMap.get(OBJECT_NAME_HEADER), record.getPropName());
    map.put(headerMap.get(OBJECT_PROPERTY_HEADER), record.getProperty());
    lanCode.forEach(
        langCode -> map.put(headerMap.get(langCode), record.getLocalizationMap().get(langCode)));
    map.put(headerMap.get(DESC_ID_HEADER), record.getDescId() + "");
    return map;
  }

  @Override
  public Map<Integer, String> getDescsBylangCodeId(Set<Integer> descIds, Integer langId)
      throws EcbBaseException {
    List<Integer> descIdsList = new ArrayList<>(descIds);
    List<List<Integer>> descIdBatch = ListUtils.partition(descIdsList, 500);
    LOGGER.info("Prepared t_description batches {} of total descIds {}", descIdBatch.size(),
        descIds.size());
    Collection<Description> descriptions = new ArrayList<>();
    for (Collection<Integer> descIdList : descIdBatch) {
      String descIdIn = CommonUtils.getQueryStringFromCollection(descIdList,
          PropertyConstants.DESC_ID + RsqlOperator.IN);
      String query = PropertyConstants.LANG_CODE_ID + RsqlOperator.EQUAL + langId + RsqlOperator.AND
          + descIdIn;
      LOGGER.info(" query for localized values - t_description : {}", query);
      descriptions.addAll(descriptionClient.findDescription(1, Integer.MAX_VALUE, null, query)
          .getBody().getRecords());
    }
    Map<Integer, String> descMap = new HashMap<>();
    descriptions
        .forEach(description -> descMap.put(description.getDescId(), description.getDesc()));
    return descMap;
  }

  @Override
  public Integer importFromCsv(MultipartFile file) throws EcbBaseException {
    Gson json = new Gson();
    Map<String, String> resultMap;
    String fileName = file.getOriginalFilename();
    CsvMapReader reader = getCsvReader(file);
    String[] headers = getFileHeaders(reader);
    resultMap = validateFileHeaders(headers);
    if (MapUtils.isNotEmpty(resultMap)) {
      closeReader(reader);
      HashMap<String, Object> errorMap = new HashMap<>();
      errorMap.put(ERROR_TYPE, VALIDATION_ERROR);
      errorMap.put(ERROR_JSON_DATA, resultMap);
      throw new EcbBaseException(json.toJson(errorMap));
    }
    Map<String, Integer> descriptionRowMapper = new HashMap<>();
    List<Description> descriptionsToBeUpdated =
        getDescriptionsFromCsvMapReader(fileName, reader, headers, descriptionRowMapper);
    LOGGER.debug("records fetched from file size: {}", descriptionsToBeUpdated.size());
    List<Description> descriptionsNotUpdated = updateDescriptionBatch(descriptionsToBeUpdated);
    Set<Integer> numberOfRowsInFile =
        descriptionRowMapper.values().stream().collect(Collectors.toSet());
    Map<Integer, Integer> rows = new HashMap<>();
    if (CollectionUtils.isNotEmpty(descriptionsNotUpdated)) {
      Map<String, Object> partialContentMap = new HashMap<>();
      descriptionsNotUpdated.forEach(description -> {
        String key = getDescriptionKey(description);
        if (descriptionRowMapper.containsKey(key)) {
          rows.put(descriptionRowMapper.get(key), description.getDescId());
        }
      });
      Integer savedRecords = numberOfRowsInFile.size() - rows.keySet().size();
      partialContentMap.put(FILE_NAME, file.getOriginalFilename());
      partialContentMap.put("totalRecords", numberOfRowsInFile.size());
      partialContentMap.put("failedRecords", rows.keySet().size());
      partialContentMap.put("savedRecords", savedRecords);
      partialContentMap.put("row-n_descId", rows);
      HashMap<String, Object> errorMap = new HashMap<>();
      errorMap.put(ERROR_TYPE, PARTIAL_ERROR);
      errorMap.put(ERROR_JSON_DATA, partialContentMap);
      throw new PartialContentException(json.toJson(errorMap));
    }
    LOGGER.debug("All records have been uploaded to database");
    return numberOfRowsInFile.size();
  }

  private String getDescriptionKey(Description description) {
    return description.getDescId() + description.getLangCodeId() + description.getDesc();
  }

  private String[] getFileHeaders(CsvMapReader reader) throws EcbBaseException {
    String[] headers = null;
    try {
      headers = reader.getHeader(true);
    } catch (IOException io) {
      throw new EcbBaseException(
          moErrorMessagesUtil.getErrorMessages("UNABLE_TO_READ_FILE", io.getMessage()));
    }
    return headers;
  }

  private CsvMapReader getCsvReader(MultipartFile file) throws EcbBaseException {
    CsvMapReader reader = null;
    try {
      BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(), "UTF-8"));
      reader = new CsvMapReader(br, CsvPreference.STANDARD_PREFERENCE);
    } catch (IOException io) {
      throw new EcbBaseException(
          moErrorMessagesUtil.getErrorMessages("UNABLE_TO_READ_FILE", io.getMessage()));
    }
    return reader;
  }

  private List<Description> getDescriptionsFromCsvMapReader(String fileName, CsvMapReader reader,
      String[] headers, Map<String, Integer> descriptionRowMapper) throws EcbBaseException {
    Gson json = new Gson();
    Map<String, String> resultMap = new HashMap<>();
    Iterator<String> langHeaderItr = null;
    Map<String, String> row;
    int rowNo = 2;
    int colNo = 0;
    String objectType = StringUtils.EMPTY;
    String objectName = StringUtils.EMPTY;
    String property = StringUtils.EMPTY;
    String descId = StringUtils.EMPTY;
    Set<String> langHeaders = getLangHeaders(headers);
    Map<String, Integer> headerLangCodeIdMap = getHeaderLangCodeIdMap(langHeaders);
    List<Description> descriptions = new ArrayList<>();
    Map<String, Integer> dublicateRows = new HashMap<>();
    Set<String> duplicateCheck = new HashSet<>();
    LOGGER.debug("Reading records from uploaded file...");
    try {
      while ((row = reader.read(headers)) != null) {
        colNo = 3;
        langHeaderItr = langHeaders.iterator();
        objectType = row.get(headers[0]);
        objectName = row.get(headers[1]);
        property = row.get(headers[2]);
        descId = row.get(DESC_ID_HEADER);
        while (langHeaderItr.hasNext()) {
          colNo++;
          String header = langHeaderItr.next();
          Description description =
              getDescription(descId, headerLangCodeIdMap.get(header), row.get(header));
          descriptions.add(description);
          descriptionRowMapper.put(getDescriptionKey(description), rowNo);
        }
        if (!duplicateCheck.add(descId)) {
          dublicateRows.put(descId,
              (dublicateRows.get(descId) == null ? 1 : dublicateRows.get(descId)) + 1);
        }
        rowNo++;
      }
      if (MapUtils.isNotEmpty(dublicateRows)) {
        throw new EcbBaseException();
      }
    } catch (SuperCsvException sce) {
      HashMap<String, Object> errorMap = new HashMap<>();
      resultMap.putAll(
          errorMap(rowNo, null, null, null, null, "Column mismatch on record no: " + rowNo));
      LOGGER.error("Error occured while reading file, size or row is invalid, error msg : {}",
          sce.getMessage());
      resultMap.put(FILE_NAME, fileName);
      errorMap.put(ERROR_TYPE, VALIDATION_ERROR);
      errorMap.put(ERROR_JSON_DATA, resultMap);
      throw new EcbBaseException(json.toJson(errorMap));
    } catch (NumberFormatException nfe) {
      HashMap<String, Object> errorMap = new HashMap<>();
      resultMap.putAll(
          errorMap(rowNo, headers.length, objectType, objectName, property, "No valid descId"));
      LOGGER.error(
          "Error occured while reading file, descId is not numeric number in uploaded file, error msg : {}",
          nfe.getMessage());
      resultMap.put(FILE_NAME, fileName);
      errorMap.put(ERROR_TYPE, VALIDATION_ERROR);
      errorMap.put(ERROR_JSON_DATA, resultMap);
      throw new EcbBaseException(json.toJson(errorMap));
    } catch (Exception ex) {
      CommonUtils.handleExceptions(ex, null);
      String errorMsg = StringUtils.EMPTY;
      if (MapUtils.isEmpty(dublicateRows)) {
        resultMap.putAll(errorMap(rowNo, colNo, objectType, objectName, property, ex.getMessage()));
        LOGGER.error("Error occured while reading file, error msg : {}", ex.getMessage());
        errorMsg = json.toJson(resultMap);
      } else {
        HashMap<String, Object> errorMap = new HashMap<>();
        HashMap<String, Object> errorMsgMap = new HashMap<>();
        errorMsgMap.put(FILE_NAME, fileName);
        errorMsgMap.put("descId-row-count", dublicateRows);
        errorMap.put(ERROR_TYPE, DUPLICATE_ERROR);
        errorMap.put(ERROR_JSON_DATA, errorMsgMap);
        LOGGER.error(
            "Error occured while validating the file, there are duplicate rows found, error msg : {}",
            ex.getMessage());
        errorMsg = json.toJson(errorMap);
      }
      throw new EcbBaseException(errorMsg);
    } finally {
      closeReader(reader);
    }
    return descriptions;
  }

  private Map<String, String> errorMap(Integer rowNo, Integer colNo, String objectType,
      String objectName, String property, String errorMsg) {
    Map<String, String> resultMap = new HashMap<>();
    resultMap.put(ROW_NUNBER, rowNo + "");
    if (colNo != null && objectType != null) {
      resultMap.put(COLUMN_NUMBER, colNo + "");
      resultMap.put(OBJECT_TYPE, objectType);
      resultMap.put(OBJECT_NAME, objectName);
      resultMap.put(PROPERTY, property);
    }
    resultMap.put(ERROR_MSG, errorMsg);
    return resultMap;
  }

  private void closeReader(CsvMapReader reader) throws EcbBaseException {
    try {
      reader.close();
    } catch (IOException e) {
      LOGGER.error("Error occured while closing CsvMapReader, error msg: {}", e.getMessage());
      throw new EcbBaseException(e.getMessage());
    }
  }

  private Map<String, String> validateFileHeaders(String[] headers) throws EcbBaseException {
    int length = headers.length;
    Map<String, String> resultMap = new HashMap<>();
    boolean isValidHeader = true;

    for (int i = 0; i < length; i++) {
      if (StringUtils.isBlank(headers[i])) {
        resultMap.put(ERROR_MSG, ERROR_MSG_INVALID_HEADERS);
        return resultMap;
      }
    }

    if (length > 4) {
      Map<String, Integer> languageCodeMap = getLanguageCodeCaseInsensitiveMap();
      for (int j = 3; j < headers.length - 1; j++) {
        String langCode = StringUtils.substringBetween(headers[j], "{", "}");
        if (langCode == null)
          resultMap.put(ERROR_MSG, INVALID_HEADERS + headers[j] + NOT_VALID_LANG_CODE);
        else if (!languageCodeMap.keySet().contains(langCode.toLowerCase())) {
          resultMap.put(ERROR_MSG, INVALID_HEADERS + headers[j] + NOT_VALID_LANG_CODE);
        }
      }
      if (!DESC_ID_HEADER.equals(headers[length - 1])) {
        resultMap.put(DESC_ID_HEADER_NAME, headers[length - 1] + NOT_VALID_HEADER);
        isValidHeader = false;
      }
    } else {
      isValidHeader = false;
    }
    if (!isValidHeader) {
      resultMap.put(ERROR_MSG, ERROR_MSG_INVALID_HEADERS);
    }
    return resultMap;
  }

  private Description getDescription(String descIdStr, Integer langCodeId, String desc) {
    Description description = new Description();
    Integer descId = Integer.valueOf(descIdStr);
    description.setDescId(descId);
    description.setLangCodeId(langCodeId);
    description.setDesc(desc);
    return description;
  }

  private Set<String> getLangHeaders(String[] headers) {
    Set<String> langHeaders = new HashSet<>(headers.length - 2);
    for (int i = 3; i < headers.length - 1; i++)
      langHeaders.add(headers[i]);
    return langHeaders;
  }

  private Map<String, Integer> getHeaderLangCodeIdMap(Set<String> langHeaders)
      throws EcbBaseException {
    Map<String, Integer> headerLangCodeIdMap = new HashMap<>();
    Map<String, Integer> languageCodeMap = getLanguageCodeCaseInsensitiveMap();
    Iterator<String> langHeadersItr = langHeaders.iterator();
    while (langHeadersItr.hasNext()) {
      String header = langHeadersItr.next();
      String langCode = StringUtils.substringBetween(header, "{", "}").toLowerCase();
      if (StringUtils.isNotBlank(langCode) && languageCodeMap.containsKey(langCode))
        headerLangCodeIdMap.put(header, languageCodeMap.get(langCode));
      else {
        LOGGER.debug("File language header - {} is not correct", header);
        throw new EcbBaseException(
            moErrorMessagesUtil.getErrorMessages("FILE_LANG_HEADER_INCORRECT", header));
      }
    }
    return headerLangCodeIdMap;
  }

  @Override
  public PaginatedList<Localization> getSubscriptionPropLocalization(Integer specId, Integer page,
      Integer size, String[] sort, String queryIn) throws EcbBaseException {
    Set<Integer> descId = new HashSet<>();
    SubscriptionProperty subscriptionProperty =
        subscriptionPropertyService.getSubscriptionProperty(specId);
    descId.add(subscriptionProperty.getNameId());
    descId.add(subscriptionProperty.getCategoryId());
    descId.add(subscriptionProperty.getDescriptionId());
    if (subscriptionProperty.getSpecType() == 3) {
      List<LocalizedSpecificationCharacteristicValue> valueList = subscriptionProperty.getValues();
      if (CollectionUtils.isNotEmpty(valueList)) {
        valueList.forEach(value -> {
          Integer valueId = value.getValueId();
          if (valueId != null)
            descId.add(valueId);
        });
      }
    }
    String query =
        KIND + RsqlOperator.EQUAL + PropertyKind.SHARED_PROP.toString() + RsqlOperator.AND
            + CommonUtils.getQueryStringFromCollection(descId, DESC_ID + RsqlOperator.IN);
    if (!StringUtils.isEmpty(queryIn))
      query = query + RsqlOperator.AND + queryIn;
    LOGGER.debug("query for getSubscriptionPropLocalization : {}", query);
    return findLocalization(page, size, sort, query);
  }

}
