package com.ericsson.ecb.ui.metraoffer.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RateTableTreeNode {

  private List<TreeNode> treeNodes;

  private Map<String, Integer> selectedIndex = new HashMap<>();

  public Map<String, Integer> getSelectedIndex() {
    return selectedIndex;
  }

  public List<TreeNode> getTreeNodes() {
    return treeNodes;
  }

  public void setTreeNodes(List<TreeNode> treeNodes) {
    this.treeNodes = treeNodes;
  }

}
