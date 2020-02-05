package com.ericsson.ecb.ui.metraoffer.constants;

public final class Pagination {

  private Pagination() {}

  public static final Integer DEFAULT_PAGE = 1;

  public static final Integer DEFAULT_MIN_SIZE = 25;

  public static final Integer DEFAULT_MAX_SIZE = Integer.MAX_VALUE;

  public static Integer getPage(Integer page) {
    return (page != null ? page : DEFAULT_PAGE);
  }

  public static Integer getSize(Integer size) {
    return (size != null ? size : DEFAULT_MAX_SIZE);
  }
}
