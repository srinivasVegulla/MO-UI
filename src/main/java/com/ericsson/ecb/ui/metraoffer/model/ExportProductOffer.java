package com.ericsson.ecb.ui.metraoffer.model;

import com.ericsson.ecb.catalog.model.ProductOffer;

public class ExportProductOffer extends ProductOffer {

  private static final long serialVersionUID = 1L;

  private String partitionName;
  
  private String currencyName;

  private String type;

  public String getPartitionName() {
    return partitionName;
  }

  public void setPartitionName(String partitionName) {
    this.partitionName = partitionName;
  }

  public String getCurrencyName() {
    return currencyName;
  }

  public void setCurrencyName(String currencyName) {
    this.currencyName = currencyName;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

}
