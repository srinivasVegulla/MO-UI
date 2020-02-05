package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.util.List;
import java.util.Set;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ericsson.ecb.catalog.client.ExtendedPriceableItemTemplateClient;
import com.ericsson.ecb.catalog.client.NonRecurringChargeClient;
import com.ericsson.ecb.catalog.model.LocalizedNonRecurringChargeTemplate;
import com.ericsson.ecb.catalog.model.NonRecurringCharge;
import com.ericsson.ecb.catalog.model.NonRecurringChargeTemplate;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.model.ExtendedProperty;
import com.ericsson.ecb.ui.metraoffer.model.NonRecurringChargeModel;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemTemplateModel;
import com.ericsson.ecb.ui.metraoffer.service.AdjustmentTypeService;
import com.ericsson.ecb.ui.metraoffer.service.MetadataConfigService;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemNonRecurringService;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemTemplateService;
import com.ericsson.ecb.ui.metraoffer.utils.EntityHelper;

@Service
public class PriceableItemNonRecurringServiceImpl implements PriceableItemNonRecurringService {

  @Autowired
  private NonRecurringChargeClient nonRecurringChargeClient;

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

  @Override
  public PaginatedList<NonRecurringCharge> findNonRecurringCharge(Integer page, Integer size,
      String[] sort, String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException {
    return nonRecurringChargeClient.findNonRecurringCharge(page, size, sort, query,
        descriptionLanguage, descriptionFilters, descriptionSort).getBody();
  }

  @Override
  public NonRecurringChargeModel getNonRecurringChargeDetails(Integer propId)
      throws EcbBaseException {

    NonRecurringChargeModel nonRecurringChargeModel = new NonRecurringChargeModel();
    NonRecurringCharge nonRecurringCharge = getNonRecurringCharge(propId);
    BeanUtils.copyProperties(nonRecurringCharge, nonRecurringChargeModel);

    PriceableItemTemplateModel priceableItemTemplateModel =
        priceableItemTemplateService.getPriceableItemTemplateDetails(propId);
    nonRecurringChargeModel.setPiId(priceableItemTemplateModel.getPiId());
    nonRecurringChargeModel.setTypeDisplayName(priceableItemTemplateModel.getChargeTypeName());
    nonRecurringChargeModel.setDelete(priceableItemTemplateModel.getDelete());
    nonRecurringChargeModel.setAdjustmetWidget(
        adjustmentTypeService.isAdjustmentTypeExist(priceableItemTemplateModel.getPiId()));

    List<ExtendedProperty> extendedProperties = metadataConfigService.getExtendedProperties(
        nonRecurringChargeModel.getProperties(), nonRecurringChargeModel.getKindType());
    nonRecurringChargeModel.setExtendedProperties(extendedProperties);

    return nonRecurringChargeModel;
  }

  @Override
  public NonRecurringCharge getNonRecurringCharge(Integer propId) throws EcbBaseException {
    return nonRecurringChargeClient.getNonRecurringCharge(propId).getBody();
  }

  @Override
  public NonRecurringCharge updateNonRecurringCharge(NonRecurringCharge record, Integer propId)
      throws EcbBaseException {
    NonRecurringCharge nonRecurringCharge =
        nonRecurringChargeClient.updateNonRecurringCharge(record, propId).getBody();
    return localizedEntityService.localizedUpdateEntity(nonRecurringCharge);
  }

  @Override
  public Boolean updateNonRecurringChargePriceableItemTemplate(NonRecurringChargeTemplate record,
      Set<String> fields, Integer propId) throws EcbBaseException {
    return entityHelper.updateSelective(record, fields, propId);
  }

  @Override
  public NonRecurringChargeModel createNonRecurringChargePriceableItemTemplate(
      LocalizedNonRecurringChargeTemplate record) throws EcbBaseException {
    NonRecurringChargeModel nonRecurringChargeModel = new NonRecurringChargeModel();
    localizedEntityService.localizedCreateEntity(record);
    NonRecurringChargeTemplate nonRecurringChargeTemplate = extendedPriceableItemTemplateClient
        .createNonRecurringChargePriceableItemTemplate(record).getBody();
    BeanUtils.copyProperties(nonRecurringChargeTemplate, nonRecurringChargeModel);
    return nonRecurringChargeModel;
  }
}
