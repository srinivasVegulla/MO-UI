package com.ericsson.ecb.ui.metraoffer.model;

import com.ericsson.ecb.catalog.model.ProductOfferBundle;

public class ProductOfferBundleOptionality extends ProductOfferBundle {

  private static final long serialVersionUID = -6132887772962381430L;

  private String poName;

  public String getPoName() {
    return poName;
  }

  public void setPoName(String poName) {
    this.poName = poName;
  }

}
