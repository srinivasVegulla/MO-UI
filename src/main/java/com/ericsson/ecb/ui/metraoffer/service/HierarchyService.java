package com.ericsson.ecb.ui.metraoffer.service;

import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.model.TreeNode;

public interface HierarchyService {

  public TreeNode getPropertyKindHierarchy(Integer id) throws EcbBaseException;

}
