package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.Month;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ericsson.ecb.catalog.client.ExtendedPriceableItemTemplateClient;
import com.ericsson.ecb.catalog.client.RecurringChargeClient;
import com.ericsson.ecb.catalog.model.CycleMode;
import com.ericsson.ecb.catalog.model.LocalizedUnitDependentRecurringChargeTemplate;
import com.ericsson.ecb.catalog.model.RecurringCharge;
import com.ericsson.ecb.catalog.model.UnitDependentRecurringChargeTemplate;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.common.model.UsageCycle;
import com.ericsson.ecb.common.type.CycleType;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.Constants;
import com.ericsson.ecb.ui.metraoffer.model.ExtendedProperty;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemTemplateModel;
import com.ericsson.ecb.ui.metraoffer.model.UnitDependentRecurringChargeModel;
import com.ericsson.ecb.ui.metraoffer.service.AdjustmentTypeService;
import com.ericsson.ecb.ui.metraoffer.service.MetadataConfigService;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemRecurringService;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemTemplateService;
import com.ericsson.ecb.ui.metraoffer.utils.EntityHelper;

@Service
public class PriceableItemRecurringServiceImpl implements PriceableItemRecurringService {

  @Autowired
  private RecurringChargeClient recurringChargeClient;

  @Autowired
  private MetadataConfigService metadataConfigService;

  @Autowired
  private PriceableItemTemplateService priceableItemTemplateService;

  @Autowired
  private AdjustmentTypeService adjustmentTypeService;

  @Autowired
  private ExtendedPriceableItemTemplateClient extendedPriceableItemTemplateClient;

  @Autowired
  private LocalizedEntityService localizedEntityService;

  @Autowired
  private EntityHelper entityHelper;

  public static final int DEFAULT_CYCLE_TYPE_DAY = 1;
  public static final int DEFAULT_CYCLE_TYPE_YEAR = 2000;
  public static final int DEFAULT_USAGE_TYPE_MONDAY_OFFSET = 3;
  public static final String DATE_VALUE_SEPARATOR = " - ";
  public static final int NO_OF_BIWEEKLY_INTERVALS = 14;

  @Override
  public PaginatedList<RecurringCharge> findRecurringCharge(Integer page, Integer size,
      String[] sort, String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException {
    return recurringChargeClient.findRecurringCharge(page, size, sort, query, descriptionLanguage,
        descriptionFilters, descriptionSort).getBody();
  }

  @Override
  public UnitDependentRecurringChargeModel getRecurringChargeDetails(Integer propId)
      throws EcbBaseException {

    UnitDependentRecurringChargeModel unitDependentRecurringChargeModel =
        new UnitDependentRecurringChargeModel();
    unitDependentRecurringChargeModel.getBiWeeklyIntervals().clear();
    unitDependentRecurringChargeModel.getBiWeeklyIntervals().addAll(getBiWeeklyCycleIntervals());
    RecurringCharge recurringCharge = recurringChargeClient.getRecurringCharge(propId).getBody();
    BeanUtils.copyProperties(recurringCharge, unitDependentRecurringChargeModel);
    unitDependentRecurringChargeModel.setKindType(PropertyKind.RECURRING);

    PriceableItemTemplateModel priceableItemTemplateModel =
        priceableItemTemplateService.getPriceableItemTemplateDetails(propId);
    unitDependentRecurringChargeModel.setPiId(priceableItemTemplateModel.getPiId());
    unitDependentRecurringChargeModel
        .setTypeDisplayName(priceableItemTemplateModel.getChargeTypeName());
    unitDependentRecurringChargeModel.setDelete(priceableItemTemplateModel.getDelete());
    unitDependentRecurringChargeModel.setAdjustmetWidget(
        adjustmentTypeService.isAdjustmentTypeExist(priceableItemTemplateModel.getPiId()));

    List<ExtendedProperty> extendedProperties = metadataConfigService.getExtendedProperties(
        unitDependentRecurringChargeModel.getProperties(),
        unitDependentRecurringChargeModel.getKindType());
    unitDependentRecurringChargeModel.setExtendedProperties(extendedProperties);
    CycleMode cycleMode = unitDependentRecurringChargeModel.getCycleMode();

    if (cycleMode != null && cycleMode.equals(CycleMode.FIXED)) {
      UsageCycle usageCycle = priceableItemTemplateService
          .getUsageCycle(unitDependentRecurringChargeModel.getUsageCycleId());
      updateUsageCycle(unitDependentRecurringChargeModel, usageCycle);
    }
    return unitDependentRecurringChargeModel;
  }

  private void updateUsageCycle(UnitDependentRecurringChargeModel unitDependentRecurringChargeModel,
      UsageCycle usageCycle) {
    unitDependentRecurringChargeModel.setCycleTypeId(usageCycle.getCycleTypeId());
    unitDependentRecurringChargeModel.setDayOfMonth(usageCycle.getDayOfMonth());
    unitDependentRecurringChargeModel.setDayOfWeek(usageCycle.getDayOfWeek());
    unitDependentRecurringChargeModel.setFirstDayOfMonth(usageCycle.getFirstDayOfMonth());
    unitDependentRecurringChargeModel.setSecondDayOfMonth(usageCycle.getSecondDayOfMonth());
    unitDependentRecurringChargeModel.setStartDay(usageCycle.getStartDay());
    unitDependentRecurringChargeModel.setStartMonth(usageCycle.getStartMonth());
    unitDependentRecurringChargeModel.setStartYear(usageCycle.getStartYear());
  }

  @Override
  public RecurringCharge getRecurringCharge(Integer propId) throws EcbBaseException {
    return recurringChargeClient.getRecurringCharge(propId).getBody();
  }

  @Override
  public Boolean updateRecurringChargePriceableItemTemplate(
      UnitDependentRecurringChargeTemplate record, Set<String> fields, Integer propId)
      throws EcbBaseException {
    record.setKind(PropertyKind.RECURRING);
    if (record.getCycleTypeId() == null)
      record.setCycleTypeId(CycleType.MONTHLY);
    return entityHelper.updateSelective(record, fields, propId);
  }

  @Override
  public UnitDependentRecurringChargeModel createRecurringChargePriceableItemTemplate(
      LocalizedUnitDependentRecurringChargeTemplate record) throws EcbBaseException {
    LocalizedUnitDependentRecurringChargeTemplate newRecord = preInitialize(record);
    localizedEntityService.localizedCreateEntity(newRecord);
    UnitDependentRecurringChargeTemplate unitDependentRecurringChargeTemplate =
        extendedPriceableItemTemplateClient.createRecurringChargePriceableItemTemplate(newRecord)
            .getBody();
    UnitDependentRecurringChargeModel unitDependentRecurringChargeModel =
        new UnitDependentRecurringChargeModel();
    BeanUtils.copyProperties(unitDependentRecurringChargeTemplate,
        unitDependentRecurringChargeModel);

    unitDependentRecurringChargeModel.setKindType(PropertyKind.RECURRING);
    return unitDependentRecurringChargeModel;
  }

  @Override
  public LocalizedUnitDependentRecurringChargeTemplate preInitialize(
      LocalizedUnitDependentRecurringChargeTemplate record) {
    record.setAdvance(Boolean.FALSE);
    record.setCycleMode(CycleMode.BCR_CONSTRAINED);
    record.setCycleTypeId(CycleType.MONTHLY);
    record.setKind(PropertyKind.RECURRING);
    record.setProrateInstantly(Boolean.FALSE);
    record.setProrateOnActivate(Boolean.FALSE);
    record.setProrateOnDeactivate(Boolean.FALSE);
    record.setFixedProrationLength(Boolean.FALSE);
    record.setChargePerParticipant(Boolean.FALSE);
    record.setProrateOnRateChange(Boolean.FALSE);
    Set<BigDecimal> validEnumValues = new HashSet<>();
    record.setValidEnumValues(validEnumValues);
    return record;
  }

  public List<BiWeeklyInterval> getBiWeeklyCycleIntervals() {

    List<BiWeeklyInterval> biWeeklyIntervalList = new ArrayList<>(NO_OF_BIWEEKLY_INTERVALS);

    List<Integer> list = retrieveDayForInterval();

    int todayOffset = retrieveTodaysOffset();

    List<String> biWeeklyCycleIntervals = populateBiWeeklyCycleIntervals();

    int requiredLoopIndex = retrieveDefaultBiWeeklySelectedIndex(todayOffset);

    String[] finalBiWeeklyCycleIntervals =
        populateBiWeeklyIntevalsInReqOrder(biWeeklyCycleIntervals, requiredLoopIndex);
    for (Integer i = 0; i < list.size(); i++) {
      BiWeeklyInterval biWeeklyInterval = new BiWeeklyInterval();
      biWeeklyInterval.setStartDayId(list.get(i));
      biWeeklyInterval.setDayInterval(finalBiWeeklyCycleIntervals[i]);
      biWeeklyIntervalList.add(biWeeklyInterval);
    }

    return biWeeklyIntervalList;
  }

  private static String[] populateBiWeeklyIntevalsInReqOrder(List<String> biWeeklyCycleIntervals,
      int defaultSelectedIndex) {
    String[] finalBiWeeklyCycleIntervals = new String[14];

    int maxValue = NO_OF_BIWEEKLY_INTERVALS;
    int counter = 0;
    for (Integer i = defaultSelectedIndex; i < maxValue; i++) {
      finalBiWeeklyCycleIntervals[counter] = biWeeklyCycleIntervals.get(i);
      counter++;
      if (i == maxValue - 1) {
        maxValue = defaultSelectedIndex;
        i = -1;
      }
      if (counter == NO_OF_BIWEEKLY_INTERVALS) {
        break;
      }
    }
    return finalBiWeeklyCycleIntervals;
  }

  private static List<String> populateBiWeeklyCycleIntervals() {
    StringBuffer dateValueBuffer = null;
    List<String> biWeeklyCycleIntervals = new ArrayList<>(14);
    for (Integer counter = 0; counter < NO_OF_BIWEEKLY_INTERVALS; counter++) {
      dateValueBuffer = new StringBuffer();

      Calendar requiredDate = getRequiredPreviousDate(~(NO_OF_BIWEEKLY_INTERVALS - counter - 2));
      dateValueBuffer.append(getRequiredDateFormat(requiredDate));

      dateValueBuffer.append(DATE_VALUE_SEPARATOR);

      requiredDate = getRequiredPreviousDate(counter);
      dateValueBuffer.append(getRequiredDateFormat(requiredDate));

      biWeeklyCycleIntervals.add(dateValueBuffer.toString());
    }
    return biWeeklyCycleIntervals;
  }

  private static int retrieveDefaultBiWeeklySelectedIndex(int todayOffset) {
    int defaultSelectedIndex = 0;

    if (todayOffset == DEFAULT_USAGE_TYPE_MONDAY_OFFSET) {
      defaultSelectedIndex = NO_OF_BIWEEKLY_INTERVALS - 1;
    } else if (todayOffset < DEFAULT_USAGE_TYPE_MONDAY_OFFSET) {
      defaultSelectedIndex = DEFAULT_USAGE_TYPE_MONDAY_OFFSET - todayOffset - 1;
    } else {
      int requiredSelectedValue = todayOffset - DEFAULT_USAGE_TYPE_MONDAY_OFFSET;
      defaultSelectedIndex = NO_OF_BIWEEKLY_INTERVALS - requiredSelectedValue - 1;
    }
    return defaultSelectedIndex;
  }

  private static String getRequiredDateFormat(Calendar requiredDate) {
    DateFormat dateFormat = new SimpleDateFormat(Constants.SIMPLE_DATE_FORMAT);
    return dateFormat.format(requiredDate.getTime());
  }

  private static Calendar getRequiredPreviousDate(Integer noOfDays) {
    Calendar requiredDate = Calendar.getInstance();
    requiredDate.add(Calendar.DATE, noOfDays);
    return requiredDate;
  }

  private static int retrieveTodaysOffset() {
    Calendar calendar = Calendar.getInstance();

    LocalDate startDate =
        LocalDate.of(DEFAULT_CYCLE_TYPE_YEAR, Month.JANUARY, DEFAULT_CYCLE_TYPE_DAY);
    LocalDate today = LocalDate.of(calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH) + 1,
        calendar.get(Calendar.DAY_OF_MONTH));
    long diffInDays = ChronoUnit.DAYS.between(startDate, today);
    return ((int) diffInDays + 1) % NO_OF_BIWEEKLY_INTERVALS;
  }

  private static List<Integer> retrieveDayForInterval() {
    List<Integer> startDayList = new ArrayList<>(NO_OF_BIWEEKLY_INTERVALS);
    for (Integer i = 0; i < NO_OF_BIWEEKLY_INTERVALS; i++) {
      Integer startDay = ((DEFAULT_USAGE_TYPE_MONDAY_OFFSET + i) % NO_OF_BIWEEKLY_INTERVALS);
      if (startDay != 0) {
        startDayList.add(startDay);
      } else {
        startDayList.add(NO_OF_BIWEEKLY_INTERVALS);
      }
    }
    return startDayList;

  }
}

