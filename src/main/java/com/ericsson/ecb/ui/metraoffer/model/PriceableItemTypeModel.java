package com.ericsson.ecb.ui.metraoffer.model;

import com.ericsson.ecb.catalog.model.PriceableItemType;
import com.ericsson.ecb.ui.metraoffer.constants.Constants;

public class PriceableItemTypeModel extends PriceableItemType {

  private static final long serialVersionUID = 1L;

  public String getChargeType() {
    return Constants.CHARGE_CATEGORY_KIND.get(getKind());
  }
}
