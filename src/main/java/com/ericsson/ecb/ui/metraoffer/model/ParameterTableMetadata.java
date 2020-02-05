package com.ericsson.ecb.ui.metraoffer.model;

import java.util.List;

import com.ericsson.ecb.catalog.model.ParameterTableProperty;
import com.ericsson.ecb.common.model.EnumData;

public class ParameterTableMetadata extends ParameterTableProperty {

  private static final long serialVersionUID = 1L;

  private Boolean conditionColumn = Boolean.FALSE;

  private String displayName;

  private List<EnumData> enumData;

  private ParameterTableProperty _opParameterTableMetadata;

  public Boolean getConditionColumn() {
    return conditionColumn;
  }

  public void setConditionColumn(Boolean conditionColumn) {
    this.conditionColumn = conditionColumn;
  }

  public String getDisplayName() {
    return displayName;
  }

  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }

  public List<EnumData> getEnumData() {
    return enumData;
  }

  public void setEnumData(List<EnumData> enumData) {
    this.enumData = enumData;
  }

  public ParameterTableProperty get_opParameterTableMetadata() {
    return _opParameterTableMetadata;
  }

  public void set_opParameterTableMetadata(ParameterTableProperty _opParameterTableMetadata) {
    this._opParameterTableMetadata = _opParameterTableMetadata;
  }

}
