package com.ericsson.ecb.ui.metraoffer.model;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.ericsson.ecb.common.model.PropertyKind;

public class TreeNode implements Comparable<TreeNode> {

  private Integer id;

  private Integer parentId;

  private TreeNodeType nodeType;

  private PropertyKind kind;

  private String name;

  private Integer nameId;

  private String displayName;

  private Integer displayNameId;

  private String description;

  private Boolean leaf;

  private List<TreeNode> children;

  private Integer offerId;

  private Integer added = 0;

  private Integer available = 0;

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public Integer getParentId() {
    return parentId;
  }

  public void setParentId(Integer parentId) {
    this.parentId = parentId;
  }

  public TreeNodeType getNodeType() {
    return nodeType;
  }

  public void setNodeType(TreeNodeType nodeType) {
    this.nodeType = nodeType;
  }

  public PropertyKind getKind() {
    return kind;
  }

  public void setKind(PropertyKind kind) {
    this.kind = kind;
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

  public Boolean getLeaf() {
    return leaf;
  }

  public void setLeaf(Boolean leaf) {
    this.leaf = leaf;
  }

  public List<TreeNode> getChildren() {
    return children;
  }

  public void setChildren(List<TreeNode> children) {
    this.children = children;
  }

  public Integer getOfferId() {
    return offerId;
  }

  public void setOfferId(Integer offerId) {
    this.offerId = offerId;
  }

  public Integer getAdded() {
    return added;
  }

  public void setAdded(Integer added) {
    this.added = added;
  }

  public Integer getAvailable() {
    return available;
  }

  public void setAvailable(Integer available) {
    this.available = available;
  }

  public Integer getNameId() {
    return nameId;
  }

  public void setNameId(Integer nameId) {
    this.nameId = nameId;
  }

  public Integer getDisplayNameId() {
    return displayNameId;
  }

  public void setDisplayNameId(Integer displayNameId) {
    this.displayNameId = displayNameId;
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

  @Override
  public int compareTo(TreeNode treeNode) {
    if (StringUtils.isEmpty(this.displayName) || StringUtils.isEmpty(treeNode.getDisplayName()))
      return 0;
    return this.displayName.compareToIgnoreCase(treeNode.getDisplayName());
  }
}
