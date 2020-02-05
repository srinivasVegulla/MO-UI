package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.util.List;
import java.util.Set;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ericsson.ecb.catalog.client.ExtendedPriceableItemTemplateClient;
import com.ericsson.ecb.catalog.client.PriceableItemTypeClient;
import com.ericsson.ecb.catalog.model.PriceableItemTemplate;
import com.ericsson.ecb.catalog.model.PriceableItemType;
import com.ericsson.ecb.catalog.model.UsagePriceableItemTemplate;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.model.ExtendedProperty;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemTemplateModel;
import com.ericsson.ecb.ui.metraoffer.model.UsagePriceableItemModel;
import com.ericsson.ecb.ui.metraoffer.service.AdjustmentTypeService;
import com.ericsson.ecb.ui.metraoffer.service.MetadataConfigService;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemTemplateService;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemUsageService;
import com.ericsson.ecb.ui.metraoffer.utils.EntityHelper;

@Service
public class PriceableItemUsageServiceImpl implements PriceableItemUsageService {

  @Autowired
  private ExtendedPriceableItemTemplateClient extendedPriceableItemTemplateClient;

  @Autowired
  private PriceableItemTemplateService priceableItemTemplateService;

  @Autowired
  private MetadataConfigService metadataConfigService;

  @Autowired
  private AdjustmentTypeService adjustmentTypeService;

  @Autowired
  private PriceableItemTypeClient priceItemTypeClient;

  @Autowired
  private LocalizedEntityService localizedEntityService;

  @Autowired
  private EntityHelper entityHelper;

  @Override
  public PaginatedList<UsagePriceableItemTemplate> findUsagePriceableItem(Integer page,
      Integer size, String[] sort, String query, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException {
    return extendedPriceableItemTemplateClient.findUsagePriceableItemTemplate(page, size, sort,
        query, descriptionLanguage, descriptionFilters, descriptionSort).getBody();
  }

  @Override
  public UsagePriceableItemModel getUsagePriceableItemDetailsWithChilds(Integer templateId)
      throws EcbBaseException {

    UsagePriceableItemModel usagePriceableItemModel = new UsagePriceableItemModel();
    PriceableItemTemplate priceableItemTemplate =
        priceableItemTemplateService.getPriceableItemTemplate(templateId);

    UsagePriceableItemTemplate usagePriceableItem = getUsagePriceableItem(templateId);

    BeanUtils.copyProperties(usagePriceableItem, usagePriceableItemModel);
    usagePriceableItemModel.setTemplateId(templateId);

    if (priceableItemTemplate.getTemplateParentId() == null) {
      PriceableItemTemplateModel priceableItemTemplateModel =
          priceableItemTemplateService.getPriceableItemTemplateDetails(templateId);
      usagePriceableItemModel.setChilds(priceableItemTemplateModel.getChilds());
      usagePriceableItemModel.setTypeDisplayName(priceableItemTemplateModel.getChargeTypeName());
    } else {
      usagePriceableItemModel
          .setTypeDisplayName(getPriceableItemTypeName(usagePriceableItemModel.getPiId()));
    }
    usagePriceableItemModel.setAdjustmetWidget(
        adjustmentTypeService.isAdjustmentTypeExist(priceableItemTemplate.getPiId()));

    List<ExtendedProperty> extendedProperties = metadataConfigService.getExtendedProperties(
        usagePriceableItemModel.getProperties(), usagePriceableItemModel.getKindType());
    usagePriceableItemModel.setExtendedProperties(extendedProperties);

    return usagePriceableItemModel;
  }

  @Override
  public Boolean updateUsagePriceableItem(UsagePriceableItemTemplate record, Set<String> fields,
      Integer propId) throws EcbBaseException {
    record.setKind(PropertyKind.USAGE);
    return entityHelper.updateSelective(record, fields, propId);
  }

  @Override
  public UsagePriceableItemTemplate getUsagePriceableItem(Integer propId) throws EcbBaseException {
    UsagePriceableItemTemplate usagePriceableItemTemplate =
        extendedPriceableItemTemplateClient.getUsagePriceableItemTemplate(propId).getBody();
    return localizedEntityService.localizedGetEntity(usagePriceableItemTemplate);
  }

  private String getPriceableItemTypeName(Integer piId) throws EcbBaseException {
    PriceableItemType priceableItemType = priceItemTypeClient.getPriceableItemType(piId).getBody();
    return localizedEntityService.localizedGetEntity(priceableItemType).getName();
  }
}
