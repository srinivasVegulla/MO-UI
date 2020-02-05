package com.ericsson.ecb.ui.metraoffer.constants;

public final class RsqlOperator {

  private RsqlOperator() {}

  public static final String EQUAL = "==";

  public static final String NOT_EQUAL = "!=";

  public static final String GREATER_THAN = ">";

  public static final String GREATER_THAN_EQUAL = GREATER_THAN + "=";

  public static final String LESS_THAN = "<";

  public static final String LESS_THAN_EQUAL = LESS_THAN + "=";

  public static final String BETWEEN = "=between=";

  public static final String IN = "=in=";

  public static final String OUT = "=out=";

  public static final String AND = " and ";

  public static final String OR = " or ";

  public static final String LIKE = "=like=";

  public static final String FALSE = "false";

  public static final String TRUE = "true";

  public static final String IS_NULL = "=isnull=" + TRUE;

  public static final String IS_NOT_NULL = "=isnull=" + FALSE;

  public static final String EQUAL_TRUE = EQUAL + TRUE;

  public static final String EQUAL_FALSE = EQUAL + FALSE;

  public static final String PIPE = "|";

  public static final String ASC = "asc";

  public static final String DESC = "desc";

  public static final String PIPE_ASC = PIPE + ASC;

  public static final String PIPE_DESC = PIPE + DESC;
}
