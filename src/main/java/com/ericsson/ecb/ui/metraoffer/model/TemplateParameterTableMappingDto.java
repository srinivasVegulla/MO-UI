package com.ericsson.ecb.ui.metraoffer.model;

import com.ericsson.ecb.catalog.model.PriceableItemTemplateParameterTableMapping;

public class TemplateParameterTableMappingDto extends PriceableItemTemplateParameterTableMapping {
  
  private static final long serialVersionUID = 1L;
  private String piKind;

  public String getPiKind() {
    return piKind;
  }

  public void setPiKind(String piKind) {
    this.piKind = piKind;
  }
  
}
