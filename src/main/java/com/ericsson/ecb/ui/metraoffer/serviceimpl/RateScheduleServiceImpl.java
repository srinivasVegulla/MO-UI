package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ericsson.ecb.catalog.client.ExtendedRateScheduleClient;
import com.ericsson.ecb.catalog.client.PricelistClient;
import com.ericsson.ecb.catalog.client.RateScheduleClient;
import com.ericsson.ecb.catalog.client.RuleSetClient;
import com.ericsson.ecb.catalog.client.UnitDependentRecurringChargeClient;
import com.ericsson.ecb.catalog.model.LocalizedRateSchedule;
import com.ericsson.ecb.catalog.model.Pricelist;
import com.ericsson.ecb.catalog.model.PricelistMapping;
import com.ericsson.ecb.catalog.model.PricelistWithInUse;
import com.ericsson.ecb.catalog.model.RateSchedule;
import com.ericsson.ecb.catalog.model.Rule;
import com.ericsson.ecb.catalog.model.UnitDependentRecurringCharge;
import com.ericsson.ecb.catalog.model.instance.EffectiveDateMode;
import com.ericsson.ecb.catalog.model.instance.PricelistType;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.customer.client.SubscriptionClient;
import com.ericsson.ecb.customer.model.Subscription;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.Constants;
import com.ericsson.ecb.ui.metraoffer.constants.Pagination;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyConstants;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.ParamTableRateSchedule;
import com.ericsson.ecb.ui.metraoffer.model.ParameterTableMetadata;
import com.ericsson.ecb.ui.metraoffer.model.RateDto;
import com.ericsson.ecb.ui.metraoffer.model.RateScheduleDto;
import com.ericsson.ecb.ui.metraoffer.model.RateScheduleSetDto;
import com.ericsson.ecb.ui.metraoffer.model.RatesDto;
import com.ericsson.ecb.ui.metraoffer.model.RatesTableDto;
import com.ericsson.ecb.ui.metraoffer.model.ResponseModel;
import com.ericsson.ecb.ui.metraoffer.service.ParameterTableService;
import com.ericsson.ecb.ui.metraoffer.service.PricelistMappingService;
import com.ericsson.ecb.ui.metraoffer.service.PricelistService;
import com.ericsson.ecb.ui.metraoffer.service.RateScheduleService;
import com.ericsson.ecb.ui.metraoffer.service.RuleSetService;
import com.ericsson.ecb.ui.metraoffer.utils.CommonUtils;
import com.ericsson.ecb.ui.metraoffer.utils.DateUtility;

@Service
public class RateScheduleServiceImpl implements RateScheduleService {

  private static final Logger logger = LoggerFactory.getLogger(RateScheduleServiceImpl.class);

  @Autowired
  private RateScheduleClient rateScheduleClient;

  @Autowired
  private SubscriptionClient subscriptionClient;

  @Autowired
  private PricelistClient pricelistClient;

  @Autowired
  private RuleSetClient ruleSetClient;

  @Autowired
  private ExtendedRateScheduleClient extendedRateScheduleClient;

  @Autowired
  private PricelistMappingService pricelistMappingService;

  @Autowired
  private RuleSetService ruleSetService;

  @Autowired
  private PricelistService pricelistService;

  @Autowired
  private LocalizedEntityService localizedEntityService;

  @Autowired
  private ParameterTableService parameterTableService;

  @Autowired
  private UnitDependentRecurringChargeClient unitDependentRecurringChargeClient;

  public static final String NON_SHARED_PL_PREFIX = "Nonshared PL for:";

  @Override
  public ResponseEntity<Boolean> removeRateSchedule(Integer scheduleId) throws EcbBaseException {
    return extendedRateScheduleClient.deleteRateSchedule(scheduleId);
  }

  @Override
  public RatesDto getRates(Integer offerId, Integer piInstanceId, Boolean firstIndex)
      throws EcbBaseException {

    RatesDto ratesDtoData = priceListMappingData(offerId, piInstanceId, firstIndex);
    List<RateDto> rateDtoList = new ArrayList<>();

    Optional<RateDto> rateDtoOptional = ratesDtoData.getRates().stream().findFirst();
    if (rateDtoOptional.isPresent()) {
      RateDto rateDtoData = rateDtoOptional.get();
      if (PropertyKind.UNIT_DEPENDENT_RECURRING.equals(rateDtoData.getItemTemplateKind())) {
        rateDtoList = getUdrcRates(ratesDtoData);
        ratesDtoData.getRates().clear();
        ratesDtoData.getRates().addAll(rateDtoList);
      } else {
        rateDtoList = ratesDtoData.getRates();
      }
    }

    if (CollectionUtils.isNotEmpty(rateDtoList)) {
      RateDto rateDto = firstIndex == Boolean.TRUE ? rateDtoList.iterator().next()
          : rateDtoList.get(rateDtoList.size() - 1);

      List<ParameterTableMetadata> properties =
          parameterTableService.getTableMetadataWithDn(rateDto.getParamtableId());
      rateDto.getProperties().addAll(properties);
    }
    return ratesDtoData;
  }

  private List<RateDto> getUdrcRates(RatesDto ratesDtoData) {
    List<RateDto> rates = new ArrayList<>();
    List<RateDto> rateDtoList = new ArrayList<>();
    Integer ratingType = ratesDtoData.getRatingType();

    ratesDtoData.getRates().forEach(rateDto -> {
      if (isValidUdrc(ratingType, rateDto.getParamtableName()))
        rates.add(rateDto);
    });
    rateDtoList.addAll(rates);
    return rateDtoList;
  }

  private RatesDto priceListMappingData(Integer offerId, Integer piInstanceId, Boolean firstIndex)
      throws EcbBaseException {
    Boolean scheduleFirstIndex = firstIndex == null ? Boolean.FALSE : firstIndex;
    RatesDto ratesDto = new RatesDto();
    ResponseEntity<PaginatedList<Subscription>> subscriptionList =
        subscriptionClient.findSubscription(Pagination.DEFAULT_PAGE, Pagination.DEFAULT_MAX_SIZE,
            null, PropertyRsqlConstants.OFFER_ID_EQUAL + offerId);
    if (subscriptionList != null) {
      ratesDto.setSubscriptionCount(subscriptionList.getBody().getRecords().size());
    }
    String query = PropertyRsqlConstants.OFFER_ID_EQUAL + offerId + RsqlOperator.AND
        + PropertyRsqlConstants.ITEM_INSTANCE_ID_EQUAL + piInstanceId + RsqlOperator.AND
        + PropertyRsqlConstants.PARAM_TABLE_ID_NULL_FALSE;
    Collection<PricelistMapping> pricelistMappingsList =
        pricelistMappingService.findPricelistMapping(null, query);

    setRatingType(pricelistMappingsList, ratesDto);

    if (!CollectionUtils.isEmpty(pricelistMappingsList)) {
      Set<Integer> pricelistIds = pricelistMappingsList.stream()
          .map(PricelistMapping::getPricelistId).collect(Collectors.toSet());
      Collection<PricelistWithInUse> pricelistRecords = pricelistService
          .findAllPricelist(1, Integer.MAX_VALUE, null, CommonUtils.getQueryStringFromCollection(
              pricelistIds, PropertyRsqlConstants.PRICELIST_ID_IN), null, null, null)
          .getRecords();
      Map<Integer, PricelistType> pricelistMap = pricelistRecords.stream()
          .collect(Collectors.toMap(Pricelist::getPricelistId, Pricelist::getType));

      List<RateDto> rateDtoList = getRatesList(pricelistMappingsList, pricelistMap,
          scheduleFirstIndex, ratesDto.getRatingType());
      ratesDto.getRates().addAll(rateDtoList);
    }
    return ratesDto;
  }

  private void setRatingType(Collection<PricelistMapping> pricelistMappingsList, RatesDto ratesDto)
      throws EcbBaseException {
    Optional<PricelistMapping> pricelistMappingOptional =
        pricelistMappingsList.stream().findFirst();
    if (pricelistMappingOptional.isPresent()) {
      PricelistMapping pricelistMapping = pricelistMappingOptional.get();
      if (PropertyKind.UNIT_DEPENDENT_RECURRING.equals(pricelistMapping.getItemTemplateKind())) {

        String query = PropertyRsqlConstants.PROP_ID_EQUAL + pricelistMapping.getItemInstanceId();
        Collection<UnitDependentRecurringCharge> udrcPaginatedRecords =
            unitDependentRecurringChargeClient
                .findUnitDependentRecurringCharge(1, Integer.MAX_VALUE, null, query).getBody()
                .getRecords();
        Optional<UnitDependentRecurringCharge> unitDependentRecurringCharge =
            udrcPaginatedRecords.stream().findFirst();
        if (unitDependentRecurringCharge.isPresent()) {
          ratesDto.setRatingType(unitDependentRecurringCharge.get().getRatingType());
        }
      }
    }
  }

  private List<RateDto> getRatesList(Collection<PricelistMapping> pricelistMappingsList,
      Map<Integer, PricelistType> pricelistMap, Boolean scheduleFirstIndex, Integer ratingType)
      throws EcbBaseException {
    int count = 0;
    List<RateDto> rateDtoList = new ArrayList<>(pricelistMappingsList.size());
    if (isUdrcInstancePresent(pricelistMappingsList))
      trimInvalidUdrcItems(pricelistMappingsList, ratingType);
    int size = pricelistMappingsList.size();
    for (PricelistMapping pricelistMapping : pricelistMappingsList) {
      PricelistType pricelistType = pricelistMap.get(pricelistMapping.getPricelistId());
      if (!PricelistType.ICB.equals(pricelistType)) {
        RateDto rateDto = new RateDto();
        BeanUtils.copyProperties(pricelistMapping, rateDto);
        rateDto.setPricelistType(pricelistType);
        if (pricelistMapping.getPricelistId() != null
            && ((count == (size - 1) && !scheduleFirstIndex)
                || (count == 0 && scheduleFirstIndex))) {
          rateDto.getRateSchedules()
              .addAll(getRateSchedulesByParamTableId(rateDto.getParamtableId(),
                  rateDto.getItemTemplateId(), pricelistMapping.getPricelistId(), null, null));
        }
        rateDtoList.add(rateDto);
        count++;
      }
    }
    return rateDtoList;
  }

  private Boolean isUdrcInstancePresent(Collection<PricelistMapping> pricelistMappingsList) {
    if (CollectionUtils.isNotEmpty(pricelistMappingsList)) {
      Optional<PricelistMapping> pricelistMappingOptional =
          pricelistMappingsList.stream().findFirst();
      if (pricelistMappingOptional.isPresent()) {
        PricelistMapping pricelistMappingTmp = pricelistMappingOptional.get();
        if (PropertyKind.UNIT_DEPENDENT_RECURRING.equals(pricelistMappingTmp.getItemTemplateKind()))
          return Boolean.TRUE;
      }
    }
    return Boolean.FALSE;
  }

  private void trimInvalidUdrcItems(Collection<PricelistMapping> pricelistMappingsList,
      Integer ratingType) {
    Iterator<PricelistMapping> iterator = pricelistMappingsList.iterator();
    while (iterator.hasNext()) {
      PricelistMapping pricelistMapping = iterator.next();
      if (PropertyKind.UNIT_DEPENDENT_RECURRING.equals(pricelistMapping.getItemTemplateKind())
          && !isValidUdrc(ratingType, pricelistMapping.getParamtableName())) {
        iterator.remove();
      }
    }
  }

  private Boolean isValidUdrc(Integer ratingType, String paramtableName) {
    if ((ratingType != null) && ((ratingType.equals(0)
        && StringUtils.contains(paramtableName, Constants.UDRC_TIERED))
        || (ratingType.equals(1) && StringUtils.contains(paramtableName, Constants.UDRC_TAPERED))))
      return Boolean.TRUE;
    return Boolean.FALSE;
  }

  @Override
  public RatesDto getRateSchedules(Integer paramTableId, Integer itemTemplateId,
      Integer pricelistId, Integer page, Integer size, String[] sort) throws EcbBaseException {

    RatesDto ratesDto = new RatesDto();
    List<RateDto> rateDtoList = new ArrayList<>();
    RateDto rateDto = new RateDto();

    List<RateScheduleDto> rateScheduleDto =
        getRateSchedulesByParamTableId(paramTableId, itemTemplateId, pricelistId, page, size);
    rateDto.getRateSchedules().addAll(rateScheduleDto);

    List<ParameterTableMetadata> parameterTableMetadata =
        parameterTableService.getTableMetadataWithDn(paramTableId);
    rateDto.getProperties().addAll(parameterTableMetadata);
    rateDtoList.add(rateDto);
    ratesDto.getRates().addAll(rateDtoList);
    return ratesDto;
  }

  private List<RateScheduleDto> getRateSchedulesByParamTableId(Integer paramTableId,
      Integer itemTemplateId, Integer pricelistId, Integer page, Integer size)
      throws EcbBaseException {

    String[] sort = {PropertyConstants.START_DATE + RsqlOperator.PIPE + RsqlOperator.DESC};

    String query = PropertyRsqlConstants.PT_ID_EQUAL + paramTableId + RsqlOperator.AND
        + PropertyRsqlConstants.ITEM_TEMPLATE_ID_EQUAL + itemTemplateId + RsqlOperator.AND
        + PropertyRsqlConstants.PRICELIST_ID_EQUAL + pricelistId;

    Collection<RateSchedule> rateScheduleRecords =
        findRateSchedule(Pagination.getPage(page), Pagination.getSize(size), sort, query)
            .getRecords();

    if (CollectionUtils.isEmpty(rateScheduleRecords)) {
      createNonLocalizedRateSchedule(paramTableId, itemTemplateId, pricelistId);
      rateScheduleRecords =
          findRateSchedule(Pagination.getPage(page), Pagination.getSize(size), sort, query)
              .getRecords();
    }
    List<RateScheduleDto> rateSchedulesDtoList = new ArrayList<>();
    if (CollectionUtils.isNotEmpty(rateScheduleRecords)) {
      List<RateSchedule> currentAndFutureRateScheduleList =
          getCurrentAndFutureRateSchedules(rateScheduleRecords);
      for (RateSchedule rateSchedule : currentAndFutureRateScheduleList) {
        rateSchedulesDtoList.add(setRateScheduleDtoByRateSchedule(rateSchedule));
      }
    }
    return rateSchedulesDtoList;
  }

  private void createNonLocalizedRateSchedule(Integer paramTableId, Integer itemTemplateId,
      Integer pricelistId) throws EcbBaseException {
    LocalizedRateSchedule rateSchedule = new LocalizedRateSchedule();
    rateSchedule.setItemTemplateId(itemTemplateId);
    rateSchedule.setPricelistId(pricelistId);
    rateSchedule.setPtId(paramTableId);
    rateSchedule.setStartDateType(EffectiveDateMode.NOT_SET);
    rateSchedule.setEndDateType(EffectiveDateMode.NOT_SET);
    extendedRateScheduleClient.createRateSchedule(rateSchedule, null);
  }

  private RateScheduleDto setRateScheduleDtoByRateSchedule(RateSchedule rateSchedule)
      throws EcbBaseException {
    RateScheduleDto rateScheduleDto = new RateScheduleDto();
    List<RatesTableDto> ratesTablesDtoList = new ArrayList<>();
    BeanUtils.copyProperties(rateSchedule, rateScheduleDto);
    rateScheduleDto.setStartDateMillisec(
        DateUtility.convertOffsetDateToMillisecond(rateScheduleDto.getStartDate()));
    rateScheduleDto.setEndDateMillisec(
        DateUtility.convertOffsetDateToMillisecond(rateScheduleDto.getEndDate()));
    rateScheduleDto.setRulesCount(getRulesCount(rateSchedule.getSchedId()));
    rateScheduleDto.getRatesTables().addAll(ratesTablesDtoList);
    return rateScheduleDto;
  }

  private Integer getRulesCount(Integer scheduleId) throws EcbBaseException {
    try {
      PaginatedList<Rule> rules = ruleSetService.findRulesInSchedule(scheduleId,
          Pagination.DEFAULT_PAGE, Pagination.DEFAULT_MAX_SIZE, null, null);
      return rules.getTotalCount();
    } catch (Exception e) {
      CommonUtils.handleExceptions(e, null);
      return 0;
    }
  }

  @Override
  public RateScheduleDto createRateSchedule(LocalizedRateSchedule rateschedule)
      throws EcbBaseException {
    localizedEntityService.localizedCreateEntity(rateschedule);
    RateSchedule rateSchedule =
        extendedRateScheduleClient.createRateSchedule(rateschedule, null).getBody();
    return setRateScheduleDtoByRateSchedule(rateSchedule);
  }

  private RateScheduleDto copyRateSchedule(LocalizedRateSchedule rateschedule, Integer srcSchedId)
      throws EcbBaseException {
    localizedEntityService.localizedCreateEntity(rateschedule);
    RateSchedule rateSchedule =
        extendedRateScheduleClient.createRateSchedule(rateschedule, srcSchedId).getBody();
    return setRateScheduleDtoByRateSchedule(rateSchedule);
  }

  private List<RateSchedule> getCurrentAndFutureRateSchedules(
      Collection<RateSchedule> rateSchedules) {
    List<RateSchedule> currentAndFutureRateScheduleList = new ArrayList<>();
    rateSchedules.forEach(rateSchedule -> {
      if (rateSchedule != null) {
        long currentDateInMillSec =
            DateUtility.convertOffsetDateToMillisecond(OffsetDateTime.now());
        if (!(rateSchedule.getEndDate() != null && DateUtility
            .convertOffsetDateToMillisecond(rateSchedule.getEndDate()) < currentDateInMillSec)) {
          currentAndFutureRateScheduleList.add(rateSchedule);
        }
      }
    });
    return currentAndFutureRateScheduleList;
  }

  private RateSchedule updateRateScheduleApi(RateSchedule rateschedule) throws EcbBaseException {
    return rateScheduleClient.updateRateSchedule(rateschedule, rateschedule.getSchedId()).getBody();
  }

  private RateScheduleDto updateNonLocalizedRateSchedule(RateSchedule rateschedule)
      throws EcbBaseException {
    return setRateScheduleDtoByRateSchedule(updateRateScheduleApi(rateschedule));
  }

  @Override
  public RateScheduleDto updateRateSchedule(RateSchedule rateschedule) throws EcbBaseException {
    RateSchedule rateSchedule = updateRateScheduleApi(rateschedule);
    localizedEntityService.localizedUpdateEntity(rateSchedule);
    return setRateScheduleDtoByRateSchedule(rateSchedule);
  }

  @Override
  public List<ResponseModel> editRateScheduleSet(RateScheduleSetDto rateScheduleSetDto)
      throws EcbBaseException {
    List<ResponseModel> responseModelList = new ArrayList<>();
    List<LocalizedRateSchedule> createScheduleList = rateScheduleSetDto.getCreateSet();
    List<RateSchedule> updateScheduleList = rateScheduleSetDto.getUpdateSet();
    List<RateScheduleDto> copyScheduleList = rateScheduleSetDto.getCopySet();
    Set<Integer> deleteIds = rateScheduleSetDto.getDeleteIds();
    if (!CollectionUtils.isEmpty(copyScheduleList)) {
      Iterator<RateScheduleDto> iteratorCopy = copyScheduleList.iterator();
      LocalizedRateSchedule localizedRateSchedule;
      while (iteratorCopy.hasNext()) {
        RateScheduleDto rateScheduleDto = iteratorCopy.next();
        if (rateScheduleDto.getCopyScheduleId() == null || rateScheduleDto.getCopyScheduleId() <= 0
            || deleteIds.contains(rateScheduleDto.getCopyScheduleId())) {
          localizedRateSchedule = new LocalizedRateSchedule();
          BeanUtils.copyProperties(rateScheduleDto, localizedRateSchedule);
          createScheduleList.add(localizedRateSchedule);
          iteratorCopy.remove();
        }
      }
    }
    if (!CollectionUtils.isEmpty(deleteIds))
      responseModelList.addAll(removeRateScheduleBatch(deleteIds));

    if (!CollectionUtils.isEmpty(updateScheduleList))
      responseModelList.addAll(updateRateScheduleBatch(updateScheduleList));

    if (!CollectionUtils.isEmpty(createScheduleList))
      responseModelList.addAll(createRateSchedulesBatch(createScheduleList));

    if (!CollectionUtils.isEmpty(copyScheduleList))
      responseModelList.addAll(copyRateSchedulesBatch(copyScheduleList));

    return responseModelList;
  }

  private List<ResponseModel> removeRateScheduleBatch(Set<Integer> deleteIds)
      throws EcbBaseException {
    List<ResponseModel> responseModelList = new ArrayList<>();
    for (Integer scheduleId : deleteIds) {
      ResponseModel responseModel = new ResponseModel();
      responseModel.setMessage(scheduleId + "");
      try {
        ResponseEntity<Boolean> responseEntity = removeRateSchedule(scheduleId);
        responseModel.setCode(200);
        responseModel.setData(responseEntity.getBody());
      } catch (Exception ex) {
        CommonUtils.handleExceptions(ex, responseModel);
      }
      responseModelList.add(responseModel);
    }
    return responseModelList;
  }

  private List<ResponseModel> updateRateScheduleBatch(List<RateSchedule> updateScheduleList)
      throws EcbBaseException {
    List<ResponseModel> responseModelList = new ArrayList<>();
    for (RateSchedule rateSchedule : updateScheduleList) {
      ResponseModel responseModel = new ResponseModel();
      responseModel.setMessage(rateSchedule.getSchedId() + "");
      try {
        RateScheduleDto rateScheduleDto = updateNonLocalizedRateSchedule(rateSchedule);
        responseModel.setCode(200);
        responseModel.setData(rateScheduleDto);
      } catch (Exception ex) {
        CommonUtils.handleExceptions(ex, responseModel);
      }
      responseModelList.add(responseModel);
    }
    return responseModelList;
  }

  private List<ResponseModel> createRateSchedulesBatch(
      List<LocalizedRateSchedule> createScheduleList) throws EcbBaseException {
    List<ResponseModel> responseModelList = new ArrayList<>();
    for (LocalizedRateSchedule rateSchedule : createScheduleList) {
      ResponseModel responseModel = new ResponseModel();
      responseModel.setMessage(rateSchedule.getSchedId() + "");
      try {
        RateScheduleDto rateScheduleDto = createRateSchedule(rateSchedule);
        responseModel.setCode(200);
        responseModel.setData(rateScheduleDto);
      } catch (Exception ex) {
        CommonUtils.handleExceptions(ex, responseModel);
      }
      responseModelList.add(responseModel);
    }
    return responseModelList;
  }

  private List<ResponseModel> copyRateSchedulesBatch(List<RateScheduleDto> copyScheduleList)
      throws EcbBaseException {
    List<ResponseModel> responseModelList = new ArrayList<>();
    for (RateScheduleDto rateScheduleDto : copyScheduleList) {
      ResponseModel responseModel = new ResponseModel();
      responseModel.setMessage(rateScheduleDto.getSchedId() + "");
      try {
        RateScheduleDto newRateScheduleDto = copyRateSchedules(rateScheduleDto);
        responseModel.setCode(200);
        responseModel.setData(newRateScheduleDto);
      } catch (Exception ex) {
        CommonUtils.handleExceptions(ex, responseModel);
      }
      responseModelList.add(responseModel);
    }
    return responseModelList;
  }

  private RateScheduleDto copyRateSchedules(RateScheduleDto rateScheduleDto)
      throws EcbBaseException {
    LocalizedRateSchedule rateSchedule = new LocalizedRateSchedule();
    BeanUtils.copyProperties(rateScheduleDto, rateSchedule);
    return copyRateSchedule(rateSchedule, rateScheduleDto.getCopyScheduleId());
  }

  @Override
  public PaginatedList<ParamTableRateSchedule> getParameterTableRateSchedules(Integer ptId,
      Integer scheduleId, String ptName, Integer page, Integer size, String[] sort, String query,
      String descriptionLanguage, Set<String> descriptionFilters, String descriptionSort)
      throws EcbBaseException {
    page = page != null ? page : 1;
    size = size != null ? size : Integer.MAX_VALUE;
    if (query != null) {
      query = query.concat(RsqlOperator.AND).concat(PropertyRsqlConstants.PT_ID_EQUAL + ptId);
    } else {
      query = PropertyRsqlConstants.PT_ID_EQUAL + ptId;

    }
    query = query.concat(RsqlOperator.AND + PropertyRsqlConstants.SCHED_ID_NOT_EQUAL + scheduleId);
    logger.info("Fetching rate schedules for parameter table id:{}, name:{}, query:{}", ptId,
        ptName, query);
    PaginatedList<RateSchedule> paginatedRateSchedules = rateScheduleClient.findRateSchedule(page,
        size, sort, query, descriptionLanguage, descriptionFilters, descriptionSort).getBody();
    Collection<RateSchedule> rateSchedules = paginatedRateSchedules.getRecords();
    logger.info("Received rate schedules rateschedules:{}", rateSchedules.size());
    if (!CollectionUtils.isEmpty(rateSchedules)) {
      List<ParamTableRateSchedule> paramTableRateScheduleList = new ArrayList<>();
      Map<Integer, Pricelist> pricelistDetailsMap = getPricelistDetailsMap(rateSchedules);
      Map<Integer, List<Rule>> scheduleRuleCountMap = getScheduleRuleCount(rateSchedules, ptName);
      for (RateSchedule rateSchedule : rateSchedules) {
        ParamTableRateSchedule paramTableRateSchedule = new ParamTableRateSchedule();
        BeanUtils.copyProperties(rateSchedule, paramTableRateSchedule);
        Pricelist pricelist = pricelistDetailsMap.get(rateSchedule.getPricelistId());
        if (!StringUtils.isEmpty(pricelist.getName())) {
          paramTableRateSchedule
              .setPricelistName(pricelist.getName().replace(NON_SHARED_PL_PREFIX, ""));
        }
        paramTableRateSchedule.setPricelistType(Constants.TYPES.get(pricelist.getType().name()));
        Integer ruleCount = scheduleRuleCountMap.get(rateSchedule.getSchedId()) != null
            ? scheduleRuleCountMap.get(rateSchedule.getSchedId()).size() : 0;
        paramTableRateSchedule.setRuleCount(ruleCount);
        paramTableRateScheduleList.add(paramTableRateSchedule);
      }
      return crateParamTableRateSchedulePaginatedList(paginatedRateSchedules,
          paramTableRateScheduleList);
    }
    return new PaginatedList<>();
  }

  private Map<Integer, Pricelist> getPricelistDetailsMap(Collection<RateSchedule> rateSchedules)
      throws EcbBaseException {
    List<Integer> pricelistIds =
        rateSchedules.stream().map(RateSchedule::getPricelistId).collect(Collectors.toList());
    logger.info("Fetching rate schedules pricelist details for the pricelistIds:{}", pricelistIds);
    Collection<Pricelist> pricelistRecords =
        pricelistClient
            .findPricelist(1, Integer.MAX_VALUE, null, CommonUtils.getQueryStringFromCollection(
                pricelistIds, "pricelistId" + RsqlOperator.IN), null, null, null)
            .getBody().getRecords();
    logger.info("Received rate schedules pricelist details:{}", pricelistRecords.size());
    return pricelistRecords.stream()
        .collect(Collectors.toMap(pricelist -> pricelist.getPricelistId(), pricelist -> pricelist));
  }

  private Map<Integer, List<Rule>> getScheduleRuleCount(Collection<RateSchedule> rateSchedules,
      String ptName) throws EcbBaseException {
    List<Integer> schedIds =
        rateSchedules.stream().map(RateSchedule::getSchedId).collect(Collectors.toList());
    logger.info("Fetching rules count for the  schedules :{}", schedIds);
    ptName = "t_pt_" + ptName.substring(ptName.lastIndexOf('/') + 1, ptName.length());
    String filterQuery =
        CommonUtils.getQueryStringFromCollection(schedIds, PropertyRsqlConstants.SCHEDULE_ID_IN);
    filterQuery = filterQuery
        .concat(RsqlOperator.AND + PropertyRsqlConstants.IN_ACTIVE_DATE_EQUAL + Constants.MAX_DATE);

    PaginatedList<Rule> paginatedRules =
        ruleSetClient.findRules(ptName, 1, Integer.MAX_VALUE, null, filterQuery);
    if (paginatedRules != null) {
      Collection<Rule> ruleSetRecords = paginatedRules.getRecords();
      logger.info("Received rules count :{}", ruleSetRecords.size());
      return ruleSetRecords.stream().collect(Collectors.groupingBy(Rule::getScheduleId));
    }
    return new HashMap<>();
  }

  private PaginatedList<ParamTableRateSchedule> crateParamTableRateSchedulePaginatedList(
      PaginatedList<RateSchedule> paginatedlist, Collection<ParamTableRateSchedule> rateSchedules) {
    PaginatedList<ParamTableRateSchedule> paginatedParamTableRateSchedule = new PaginatedList<>();
    paginatedParamTableRateSchedule.setTotalPages(paginatedlist.getTotalPages());
    paginatedParamTableRateSchedule.setTotalCount(paginatedlist.getTotalCount());
    paginatedParamTableRateSchedule.setCurrentPage(paginatedlist.getCurrentPage());
    paginatedParamTableRateSchedule.setTotalPageSize(paginatedlist.getTotalPageSize());
    paginatedParamTableRateSchedule.setRecords(rateSchedules);
    return paginatedParamTableRateSchedule;
  }

  @Override
  public PaginatedList<RateSchedule> findRateSchedule(Integer page, Integer size, String[] sort,
      String query) throws EcbBaseException {
    return rateScheduleClient.findRateSchedule(page, size, sort, query, null, null, null).getBody();
  }
}
