package com.ericsson.ecb.ui.metraoffer.utils;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ericsson.ecb.catalog.client.ExtendedPriceableItemTemplateClient;
import com.ericsson.ecb.catalog.client.PriceableItemInstanceClient;
import com.ericsson.ecb.catalog.client.ProductOfferClient;
import com.ericsson.ecb.catalog.client.ReasonCodeClient;
import com.ericsson.ecb.catalog.client.SharedPropertyClient;
import com.ericsson.ecb.catalog.model.DiscountTemplate;
import com.ericsson.ecb.catalog.model.NonRecurringChargeTemplate;
import com.ericsson.ecb.catalog.model.PriceableItemInstanceDetails;
import com.ericsson.ecb.catalog.model.ProductOffer;
import com.ericsson.ecb.catalog.model.ReasonCode;
import com.ericsson.ecb.catalog.model.SharedPropertyModel;
import com.ericsson.ecb.catalog.model.UnitDependentRecurringChargeTemplate;
import com.ericsson.ecb.catalog.model.UsagePriceableItemTemplate;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.model.SubscriptionProperty;

@Service
public class EntityHelper {

  @Autowired
  private LocalizedEntityService localizedEntityService;

  @Autowired
  private ProductOfferClient productOfferClient;

  @Autowired
  private SharedPropertyClient sharedPropertyClient;

  @Autowired
  private ExtendedPriceableItemTemplateClient extendedPriceableItemTemplateClient;

  @Autowired
  private ReasonCodeClient reasonCodeClient;

  @Autowired
  private PriceableItemInstanceClient priceableItemInstanceClient;

  public Boolean updateSelective(Object record, Set<String> fields, Integer id)
      throws EcbBaseException {
    Object entity = null;
    Set<String> nonLocalizedFields = CommonUtils.getNonLocalizedProps(fields);
    if (CollectionUtils.isNotEmpty(nonLocalizedFields)) {
      if (record instanceof ProductOffer) {
        entity = productOfferClient.updateSelectiveProductOffer((ProductOffer) record,
            nonLocalizedFields, id);
      } else if (record instanceof SharedPropertyModel) {
        SubscriptionProperty subscriptionProperty = (SubscriptionProperty) record;
        SharedPropertyModel sharedPropertyModel = new SharedPropertyModel();
        BeanUtils.copyProperties(subscriptionProperty, sharedPropertyModel);
        sharedPropertyModel.getValues().clear();
        sharedPropertyModel.getValues().addAll(subscriptionProperty.getValues());

        entity = sharedPropertyClient
            .updateSelectiveSharedProperty(sharedPropertyModel, nonLocalizedFields, id).getBody();

        SharedPropertyModel sharedPropertyModelEntity = (SharedPropertyModel) entity;
        subscriptionProperty.getValues().clear();
        subscriptionProperty.getValues().addAll(sharedPropertyModelEntity.getValues());

        subscriptionProperty.setName(subscriptionProperty.getDisplayName());
        subscriptionProperty.setCategory(subscriptionProperty.getDisplayCategory());

      } else if (record instanceof ReasonCode) {
        entity = reasonCodeClient
            .updateSelectiveReasonCode((ReasonCode) record, nonLocalizedFields, id).getBody();
      } else if (record instanceof UsagePriceableItemTemplate) {
        entity = extendedPriceableItemTemplateClient.updateSelectiveUsagePriceableItemTemplate(
            (UsagePriceableItemTemplate) record, nonLocalizedFields, id).getBody();
      } else if (record instanceof UnitDependentRecurringChargeTemplate) {
        UnitDependentRecurringChargeTemplate urdc = (UnitDependentRecurringChargeTemplate) record;
        entity = extendedPriceableItemTemplateClient
            .updateRecurringChargePriceableItemTemplate(urdc, fields, id).getBody();
        if (PropertyKind.RECURRING.equals(urdc.getKind())) {
          urdc.setUnitDisplayName(null);
          urdc.setUnitDisplayNameId(null);
        }
      } else if (record instanceof DiscountTemplate) {
        entity = extendedPriceableItemTemplateClient
            .updateDiscountPriceableItemTemplate((DiscountTemplate) record, fields, id).getBody();
      } else if (record instanceof NonRecurringChargeTemplate) {
        entity = extendedPriceableItemTemplateClient.updateNonRecurringChargePriceableItemTemplate(
            (NonRecurringChargeTemplate) record, fields, id).getBody();
      }
      if (entity == null)
        return Boolean.FALSE;
    }
    if (isContainsLocalizedProps(fields))
      localizedEntityService.localizedUpdateEntity(record);
    return Boolean.TRUE;
  }

  public Boolean updateEntityInstance(Object record, Integer offerId, Integer instanceId,
      Set<String> fields) throws EcbBaseException {
    Object entity = null;
    Set<String> nonLocalizedFields = CommonUtils.getNonLocalizedProps(fields);
    if (CollectionUtils.isNotEmpty(nonLocalizedFields)) {
      if (record instanceof PriceableItemInstanceDetails) {
        PriceableItemInstanceDetails priceableItemInstance = (PriceableItemInstanceDetails) record;
        entity = priceableItemInstanceClient.updatePriceableItemInstanceSelectiveMap(
            priceableItemInstance, offerId, instanceId, nonLocalizedFields);
        if (PropertyKind.RECURRING.equals(priceableItemInstance.getKind())) {
          priceableItemInstance.setUnitDisplayName(null);
          priceableItemInstance.setUnitDisplayNameId(null);
        }
      }
      if (entity == null)
        return Boolean.FALSE;
    }
    if (isContainsLocalizedProps(fields))
      localizedEntityService.localizedUpdateEntity(record);
    return Boolean.TRUE;
  }


  private Boolean isContainsLocalizedProps(Collection<String> fields) {
    Set<String> props = CommonUtils.getAllLocalizedProps();
    Set<String> result =
        props.stream().distinct().filter(fields::contains).collect(Collectors.toSet());
    if (CollectionUtils.isNotEmpty(result))
      return Boolean.TRUE;
    return Boolean.FALSE;
  }

}
