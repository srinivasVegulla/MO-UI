package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.util.List;
import java.util.Set;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ericsson.ecb.catalog.client.DiscountClient;
import com.ericsson.ecb.catalog.client.ExtendedPriceableItemTemplateClient;
import com.ericsson.ecb.catalog.model.Discount;
import com.ericsson.ecb.catalog.model.DiscountTemplate;
import com.ericsson.ecb.catalog.model.LocalizedDiscountTemplate;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.model.DiscountModel;
import com.ericsson.ecb.ui.metraoffer.model.ExtendedProperty;
import com.ericsson.ecb.ui.metraoffer.model.PriceableItemTemplateModel;
import com.ericsson.ecb.ui.metraoffer.service.MetadataConfigService;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemDiscountService;
import com.ericsson.ecb.ui.metraoffer.service.PriceableItemTemplateService;
import com.ericsson.ecb.ui.metraoffer.utils.EntityHelper;

@Service
public class PriceableItemDiscountServiceImpl implements PriceableItemDiscountService {

  @Autowired
  private DiscountClient discountClient;

  @Autowired
  private MetadataConfigService metadataConfigService;

  @Autowired
  private PriceableItemTemplateService priceableItemTemplateService;

  @Autowired
  private ExtendedPriceableItemTemplateClient extendedPriceableItemTemplateClient;

  @Autowired
  private LocalizedEntityService localizedEntityService;

  @Autowired
  private EntityHelper entityHelper;

  @Override
  public Discount getDiscount(Integer propId) throws EcbBaseException {
    return discountClient.getDiscount(propId).getBody();
  }

  @Override
  public PaginatedList<Discount> findDiscount(Integer page, Integer size, String[] sort,
      String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException {
    return discountClient.findDiscount(page, size, sort, query, descriptionLanguage,
        descriptionFilters, descriptionSort).getBody();
  }

  @Override
  public DiscountModel getDiscountDetails(Integer propId) throws EcbBaseException {

    Discount discount = getDiscount(propId);
    DiscountModel discountModel = new DiscountModel();
    BeanUtils.copyProperties(discount, discountModel);

    PriceableItemTemplateModel priceableItemTemplateModel =
        priceableItemTemplateService.getPriceableItemTemplateDetails(propId);
    discountModel.setPiId(priceableItemTemplateModel.getPiId());
    discountModel.setTypeDisplayName(priceableItemTemplateModel.getChargeTypeName());
    discountModel.setDelete(priceableItemTemplateModel.getDelete());

    List<ExtendedProperty> extendedProperties = metadataConfigService
        .getExtendedProperties(discountModel.getProperties(), discountModel.getKindType());
    discountModel.setExtendedProperties(extendedProperties);

    return discountModel;
  }

  @Override
  public Discount updateDiscount(Discount record, Integer propId) throws EcbBaseException {
    return discountClient.updateDiscount(record, propId).getBody();
  }

  @Override
  public Boolean updateDiscountPriceableItemTemplate(DiscountTemplate record, Set<String> fields,
      Integer propId) throws EcbBaseException {
    return entityHelper.updateSelective(record, fields, propId);
  }

  @Override
  public DiscountModel createDiscountPriceableItemTemplate(LocalizedDiscountTemplate record)
      throws EcbBaseException {
    localizedEntityService.localizedCreateEntity(record);
    Discount discount =
        extendedPriceableItemTemplateClient.createDiscountPriceableItemTemplate(record).getBody();
    DiscountModel discountModel = new DiscountModel();
    BeanUtils.copyProperties(discount, discountModel);
    return discountModel;
  }
}
