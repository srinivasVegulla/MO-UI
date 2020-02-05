package com.ericsson.ecb.ui.metraoffer.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import com.ericsson.ecb.catalog.model.PriceableItemTemplateWithInUse;
import com.ericsson.ecb.ui.metraoffer.constants.Constants;

public class PriceableItemTemplateModel extends PriceableItemTemplateWithInUse {

  private static final long serialVersionUID = 1L;

  private List<PriceableItemTemplateWithInUse> childs;

  private String chargeTypeName;

  private Integer chargeTypeNameId;

  public PriceableItemTemplateModel() {
    childs = new ArrayList<>();
  }

  public List<PriceableItemTemplateWithInUse> getChilds() {
    return childs;
  }

  public void addChild(PriceableItemTemplateWithInUse child) {
    this.childs.add(child);
  }

  public void addChilds(Collection<PriceableItemTemplateWithInUse> childs) {
    this.childs.addAll(childs);
  }

  public String getChargeType() {
    return Constants.CHARGE_CATEGORY_KIND.get(getKind());
  }

  public String getChargeTypeName() {
    return chargeTypeName;
  }

  public void setChargeTypeName(String changeTypeName) {
    this.chargeTypeName = changeTypeName;
  }

  public Integer getChargeTypeNameId() {
    return chargeTypeNameId;
  }

  public void setChargeTypeNameId(Integer chargeTypeNameId) {
    this.chargeTypeNameId = chargeTypeNameId;
  }

  public Boolean getDelete() {
    if (getOfferingsCount() < 1 && getSharedRateListCount() < 1)
      return Boolean.TRUE;
    else
      return Boolean.FALSE;
  }

  @Override
  public boolean equals(Object o) {
    return EqualsBuilder.reflectionEquals(this, o, false);
  }

  @Override
  public int hashCode() {
    return HashCodeBuilder.reflectionHashCode(this, false);
  }
}
