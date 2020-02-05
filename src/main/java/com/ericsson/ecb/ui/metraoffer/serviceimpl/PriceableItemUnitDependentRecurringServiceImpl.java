package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ericsson.ecb.catalog.client.ExtendedPriceableItemTemplateClient;
import com.ericsson.ecb.catalog.client.RecurringChargeUnitValuesClient;
import com.ericsson.ecb.catalog.client.UnitDependentRecurringChargeClient;
import com.ericsson.ecb.catalog.model.CycleMode;
import com.ericsson.ecb.catalog.model.LocalizedUnitDependentRecurringChargeTemplate;
import com.ericsson.ecb.catalog.model.RecurringChargeUnitValues;
import com.ericsson.ecb.catalog.model.UnitDependentRecurringCharge;
import com.ericsson.ecb.catalog.model.UnitDependentRecurringChargeTemplate;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.common.model.UsageCycle;
import com.ericsson.ecb.common.type.CycleType;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.model.ExtendedProperty;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemTemplateModel;
import com.ericsson.ecb.ui.metraoffer.model.UnitDependentRecurringChargeModel;
import com.ericsson.ecb.ui.metraoffer.service.AdjustmentTypeService;
import com.ericsson.ecb.ui.metraoffer.service.MetadataConfigService;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemRecurringService;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemTemplateService;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemUnitDependentRecurringService;
import com.ericsson.ecb.ui.metraoffer.utils.EntityHelper;

@Service
public class PriceableItemUnitDependentRecurringServiceImpl
    implements PriceableItemUnitDependentRecurringService {

  @Autowired
  private UnitDependentRecurringChargeClient unitDependentRecurringChargeClient;

  @Autowired
  private MetadataConfigService metadataConfigService;

  @Autowired
  private PriceableItemTemplateService priceableItemTemplateService;

  @Autowired
  private AdjustmentTypeService adjustmentTypeService;

  @Autowired
  private PriceableItemRecurringService priceableItemRecurringService;

  @Autowired
  private RecurringChargeUnitValuesClient recurringChargeUnitValuesClient;

  @Autowired
  private ExtendedPriceableItemTemplateClient extendedPriceableItemTemplateClient;

  @Autowired
  private LocalizedEntityService localizedEntityService;

  @Autowired
  private EntityHelper entityHelper;

  @Override
  public PaginatedList<UnitDependentRecurringCharge> findUnitDependentRecurringCharge(Integer page,
      Integer size, String[] sort, String query) throws EcbBaseException {
    return unitDependentRecurringChargeClient
        .findUnitDependentRecurringCharge(page, size, sort, query).getBody();
  }

  @Override
  public UnitDependentRecurringChargeModel getUnitDependentRecurringChargeDetails(Integer propId)
      throws EcbBaseException {
    UnitDependentRecurringChargeModel unitDependentRecurringChargeModel =
        new UnitDependentRecurringChargeModel();
    UnitDependentRecurringCharge unitDependentRecurringCharge =
        getUnitDependentRecurringCharge(propId);
    BeanUtils.copyProperties(unitDependentRecurringCharge, unitDependentRecurringChargeModel);
    unitDependentRecurringChargeModel.setKindType(PropertyKind.UNIT_DEPENDENT_RECURRING);

    unitDependentRecurringChargeModel.getBiWeeklyIntervals().clear();
    unitDependentRecurringChargeModel.getBiWeeklyIntervals()
        .addAll(priceableItemRecurringService.getBiWeeklyCycleIntervals());

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

    unitDependentRecurringChargeModel.getValidEnumValues().clear();
    unitDependentRecurringChargeModel.getValidEnumValues().addAll(getValidEnumValues(propId));
    unitDependentRecurringChargeModel.getSortedEnumValues()
        .addAll((unitDependentRecurringChargeModel.getValidEnumValues()));
    Collections.sort(unitDependentRecurringChargeModel.getSortedEnumValues());

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
  public UnitDependentRecurringCharge getUnitDependentRecurringCharge(Integer propId)
      throws EcbBaseException {
    return unitDependentRecurringChargeClient.getUnitDependentRecurringCharge(propId);
  }

  @Override
  public Boolean updateUnitRecurringChargePriceableItemTemplate(
      UnitDependentRecurringChargeTemplate record, Set<String> fields, Integer propId)
      throws EcbBaseException {
    record.setKind(PropertyKind.UNIT_DEPENDENT_RECURRING);
    if (record.getCycleTypeId() == null)
      record.setCycleTypeId(CycleType.MONTHLY);
    return entityHelper.updateSelective(record, fields, propId);
  }

  @Override
  public UnitDependentRecurringChargeModel createUniDependentRecurringChargePriceableItemTemplate(
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

    unitDependentRecurringChargeModel.setKindType(PropertyKind.UNIT_DEPENDENT_RECURRING);

    return unitDependentRecurringChargeModel;
  }

  private LocalizedUnitDependentRecurringChargeTemplate preInitialize(
      LocalizedUnitDependentRecurringChargeTemplate record) {
    record = priceableItemRecurringService.preInitialize(record);
    record.setKind(PropertyKind.UNIT_DEPENDENT_RECURRING);
    record.setIntegral(Boolean.FALSE);
    record.setRatingType(1);
    String displayName = record.getDisplayName();
    String unitDisplayName = StringUtils.isNotBlank(displayName) ? displayName + " Unit" : "Unit";
    record.setUnitName(unitDisplayName);
    record.setUnitDisplayName(unitDisplayName);
    record.setMinUnitValue(BigDecimal.ZERO);
    record.setMaxUnitValue(new BigDecimal(999999999));
    return record;
  }

  private Set<BigDecimal> getValidEnumValues(Integer propId) throws EcbBaseException {
    Set<BigDecimal> set = new HashSet<>();
    String query = PropertyRsqlConstants.PROP_ID_EQUAL + propId;
    Collection<RecurringChargeUnitValues> recurringChargeUnitValues =
        recurringChargeUnitValuesClient
            .findRecurringChargeUnitValues(1, Integer.MAX_VALUE, null, query).getBody()
            .getRecords();
    recurringChargeUnitValues
        .forEach(recurringChargeUnitValue -> set.add(recurringChargeUnitValue.getEnumValue()));
    return set;
  }
}
