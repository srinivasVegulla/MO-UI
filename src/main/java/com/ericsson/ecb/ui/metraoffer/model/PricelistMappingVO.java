package com.ericsson.ecb.ui.metraoffer.model;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.ericsson.ecb.catalog.model.ParameterTable;

public class PricelistMappingVO {

  private Integer itemInstanceId;

  private Integer piInstanceParentId;

  private String name;

  private String displayName;

  private Integer displayNameId;

  private String description;

  private Integer descriptionId;

  private List<PricelistMappingVO> childs;

  private List<ParameterTable> parameterTable;

  private Integer itemTemplateId;

  public Integer getItemInstanceId() {
    return itemInstanceId;
  }

  public void setItemInstanceId(Integer itemInstanceId) {
    this.itemInstanceId = itemInstanceId;
  }

  public Integer getPiInstanceParentId() {
    return piInstanceParentId;
  }

  public void setPiInstanceParentId(Integer piInstanceParentId) {
    this.piInstanceParentId = piInstanceParentId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDisplayName() {
    return displayName;
  }

  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public List<PricelistMappingVO> getChilds() {
    return childs;
  }

  public void setChilds(List<PricelistMappingVO> childs) {
    this.childs = childs;
  }

  public void addChild(List<PricelistMappingVO> childs) {
    if (this.childs == null)
      this.childs = new ArrayList<>();
    this.childs.addAll(childs);
  }

  public Integer getItemTemplateId() {
    return itemTemplateId;
  }

  public void setItemTemplateId(Integer itemTemplateId) {
    this.itemTemplateId = itemTemplateId;
  }

  public List<ParameterTable> getParameterTable() {
    return parameterTable;
  }

  public void addParameterTable(ParameterTable parameterTable) {
    if (this.parameterTable == null)
      this.parameterTable = new ArrayList<>();
    this.parameterTable.add(parameterTable);
  }

  public void addParameterTables(List<ParameterTable> parameterTable) {
    if (this.parameterTable == null)
      this.parameterTable = new ArrayList<>();
    if (CollectionUtils.isNotEmpty(parameterTable))
      this.parameterTable.addAll(parameterTable);
  }

  @Override
  public int hashCode() {
    return HashCodeBuilder.reflectionHashCode(this, false);
  }

  @Override
  public boolean equals(Object o) {
    return EqualsBuilder.reflectionEquals(this, o, false);
  }

  @Override
  public String toString() {
    return ToStringBuilder.reflectionToString(this);
  }

  public Integer getDisplayNameId() {
    return displayNameId;
  }

  public void setDisplayNameId(Integer displayNameId) {
    this.displayNameId = displayNameId;
  }

  public Integer getDescriptionId() {
    return descriptionId;
  }

  public void setDescriptionId(Integer descriptionId) {
    this.descriptionId = descriptionId;
  }
}
