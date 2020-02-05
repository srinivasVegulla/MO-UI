package com.ericsson.ecb.ui.metraoffer.model;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.springframework.beans.factory.annotation.Autowired;

import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.utils.MoErrorMessagesUtil;

/**
 * Enumeration defining different node type in tree structure
 *
 */
public enum TreeNodeType {

  BUNDLE(1), PO(2), PI(3), CHILD_PI(4), PARAM_TABLE(5);

  private final int value;

  @Autowired
  private static MoErrorMessagesUtil moErrorMessagesUtil;

  private TreeNodeType(int value) {
    this.value = value;
  }

  public int getValue() {
    return value;
  }

  public static TreeNodeType valueOf(Integer value) throws EcbBaseException {
    if (value == null) {
      return null;
    }
    for (TreeNodeType mode : values()) {
      if (mode.value == value) {
        return mode;
      }
    }
    throw new IllegalArgumentException(
        moErrorMessagesUtil.getErrorMessages("UNKNOWN_TYPE_MAP", value));
  }

  @Override
  public String toString() {
    return ToStringBuilder.reflectionToString(this);
  }
}
