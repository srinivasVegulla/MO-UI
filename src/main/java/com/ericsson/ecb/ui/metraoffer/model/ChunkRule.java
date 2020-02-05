package com.ericsson.ecb.ui.metraoffer.model;

import java.io.Serializable;

import com.ericsson.ecb.catalog.model.DiffType;
import com.ericsson.ecb.catalog.model.Rule;

public class ChunkRule implements Serializable {

  private static final long serialVersionUID = 1L;

  private DiffType type;

  private int startIndex;

  private int endIndex;

  private Rule originalItem;

  private Rule revisedItem;

  public DiffType getType() {
    return type;
  }

  public void setType(DiffType type) {
    this.type = type;
  }

  public int getStartIndex() {
    return startIndex;
  }

  public void setStartIndex(int startIndex) {
    this.startIndex = startIndex;
  }

  public int getEndIndex() {
    return endIndex;
  }

  public void setEndIndex(int endIndex) {
    this.endIndex = endIndex;
  }

  public Rule getOriginalItem() {
    return originalItem;
  }

  public void setOriginalItem(Rule originalItem) {
    this.originalItem = originalItem;
  }

  public Rule getRevisedItem() {
    return revisedItem;
  }

  public void setRevisedItem(Rule revisedItem) {
    this.revisedItem = revisedItem;
  }

}
