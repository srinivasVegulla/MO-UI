package com.ericsson.ecb.ui.metraoffer.model;

import java.util.HashMap;
import java.util.Map;

import com.ericsson.ecb.common.api.PaginatedList;

public class CustomPaginatedList<T> extends PaginatedList<T> {

  private static final long serialVersionUID = 1L;

  private HashMap<String, Object> utilityMap = new HashMap<>();

  public Map<String, Object> getUtilityMap() {
    return utilityMap;
  }
}
