package com.ericsson.ecb.ui.metraoffer.constants;

public class PropertyRsqlConstants extends PropertyConstants {

  public static final String ADJUSTMENT_ID_IN = ADJUSTMENT_ID + RsqlOperator.IN;
  public static final String AVAILABLE_START_DATE_NULL_TRUE =
      AVAILABLE_START_DATE + RsqlOperator.IS_NULL;
  public static final String AVAILABLE_START_DATE_NULL_FALSE =
      AVAILABLE_START_DATE + RsqlOperator.IS_NOT_NULL;
  public static final String AVAILABLE_END_DATE_NULL_TRUE =
      AVAILABLE_END_DATE + RsqlOperator.IS_NULL;
  public static final String BUNDLE_EQUAL = BUNDLE + RsqlOperator.EQUAL;
  public static final String CALENDAR_ID_EQUAL = CALENDAR_ID + RsqlOperator.EQUAL;
  public static final String CATEGORY_ASC = CATEGORY + RsqlOperator.PIPE_ASC;
  public static final String CURRENCY_EQUAL = CURRENCY + RsqlOperator.EQUAL;
  public static final String DAY_ID_IN = DAY_ID + RsqlOperator.IN;
  public static final String DESCENDENT_ID_EQUAL = DESCENDENT_ID + RsqlOperator.EQUAL;
  public static final String ENTITY_TYPE_ID_EQUAL = ENTITY_TYPE_ID + RsqlOperator.EQUAL;
  public static final String HIDDEN_EQUAL = HIDDEN + RsqlOperator.EQUAL;
  public static final String ID_PO_BUNDLE_EQUAL = ID_PO_BUNDLE + RsqlOperator.EQUAL;
  public static final String IN_ACTIVE_DATE_EQUAL = IN_ACTIVE_DATE + RsqlOperator.EQUAL;
  public static final String ITEM_INSTANCE_ID_IN = ITEM_INSTANCE_ID + RsqlOperator.IN;
  public static final String ITEM_INSTANCE_ID_EQUAL = ITEM_INSTANCE_ID + RsqlOperator.EQUAL;
  public static final String ITEM_TEMPLATE_ID_IN = ITEM_TEMPLATE_ID + RsqlOperator.IN;
  public static final String ITEM_TEMPLATE_ID_NOT_IN = ITEM_TEMPLATE_ID + RsqlOperator.OUT;
  public static final String ITEM_TEMPLATE_ID_EQUAL = ITEM_TEMPLATE_ID + RsqlOperator.EQUAL;
  public static final String ITEM_TEMPLATE_KIND_EQUAL = ITEM_TEMPLATE_KIND + RsqlOperator.EQUAL;
  public static final String ITEM_TYPE_ID_EQUAL = ITEM_TYPE_ID + RsqlOperator.EQUAL;
  public static final String ITEM_TYPE_KIND_EQUAL = ITEM_TYPE_KIND + RsqlOperator.EQUAL;
  public static final String KIND_NOT_EQUAL = KIND + RsqlOperator.NOT_EQUAL;
  public static final String LOGIN_EQUAL = LOGIN + RsqlOperator.EQUAL;
  public static final String OFFER_ID_EQUAL = OFFER_ID + RsqlOperator.EQUAL;
  public static final String OFFER_ID_IN = OFFER_ID + RsqlOperator.IN;
  public static final String OFFER_ID_NOT_IN = OFFER_ID + RsqlOperator.OUT;
  public static final String PARAM_TABLE_ID_EQUAL = PARAMTABLE_ID + RsqlOperator.EQUAL;
  public static final String PARAM_TABLE_ID_IN = PARAMTABLE_ID + RsqlOperator.IN;
  public static final String PARAM_TABLE_ID_NULL_TRUE = PARAMTABLE_ID + RsqlOperator.IS_NULL;
  public static final String PARAM_TABLE_ID_NULL_FALSE = PARAMTABLE_ID + RsqlOperator.IS_NOT_NULL;
  public static final String PI_ID_EQUAL = PI_ID + RsqlOperator.EQUAL;
  public static final String PI_INSTANCE_PARENT_ID_NULL_TRUE =
      PI_INSTANCE_PARENT_ID + RsqlOperator.IS_NULL;
  public static final String PI_INSTANCE_PARENT_ID_EQUAL =
      PI_INSTANCE_PARENT_ID + RsqlOperator.EQUAL;
  public static final String PL_PARTITION_ID_EQUAL = PL_PARTITION_ID + RsqlOperator.EQUAL;
  public static final String PO_PARTITION_ID_EQUAL = PO_PARTITION_ID + RsqlOperator.EQUAL;
  public static final String PRICELIST_ID_EQUAL = PRICELIST_ID + RsqlOperator.EQUAL;
  public static final String PRICELIST_ID_IN = PRICELIST_ID + RsqlOperator.IN;
  public static final String PRICELIST_ID_IS_NOT_NULL = PRICELIST_ID + RsqlOperator.IS_NOT_NULL;
  public static final String PROP_ID_EQUAL = PROP_ID + RsqlOperator.EQUAL;
  public static final String PROP_ID_IN = PROP_ID + RsqlOperator.IN;
  public static final String PT_ID_EQUAL = PT_ID + RsqlOperator.EQUAL;
  public static final String SCHED_ID_NOT_EQUAL = SCHED_ID + RsqlOperator.NOT_EQUAL;
  public static final String SCHEDULE_ID_IN = SCHEDULE_ID + RsqlOperator.IN;
  public static final String SPEC_ID_EQUAL = SPEC_ID + RsqlOperator.EQUAL;
  public static final String SPEC_ID_IN = SPEC_ID + RsqlOperator.IN;
  public static final String SPEC_ID_NOT_IN = SPEC_ID + RsqlOperator.OUT;
  public static final String SUBSCRIPTION_ID_IS_NULL_TRUE = SUBSCRIPTION_ID + RsqlOperator.IS_NULL;
  public static final String TABLE_NAME_IN = TABLE_NAME + RsqlOperator.IN;
  public static final String TEMPLATE_ID_EQUAL = TEMPLATE_ID + RsqlOperator.EQUAL;

  public static final String TEMPLATE_ID_NOT_EQUAL = TEMPLATE_ID + RsqlOperator.NOT_EQUAL;
  public static final String TEMPLATE_ID_IN = TEMPLATE_ID + RsqlOperator.IN;

  public static final String TEMPLATE_ID_NOT_IN = TEMPLATE_ID + RsqlOperator.OUT;

  public static final String TEMPLATE_PARENT_ID_IN = TEMPLATE_PARENT_ID + RsqlOperator.IN;

  public static final String TEMPLATE_PARENT_ID_IS_NULL_FALSE =
      TEMPLATE_PARENT_ID + RsqlOperator.IS_NOT_NULL;
  public static final String TEMPLATE_PARENT_ID_IS_NULL_TRUE =
      TEMPLATE_PARENT_ID + RsqlOperator.IS_NULL;
  public static final String TYPE_EQUAL_REGULAR = TYPE + RsqlOperator.EQUAL + Constants.REGULAR;
  public static final String TYPE_QUAL = TYPE + RsqlOperator.EQUAL;
  public static final String TYPE_ID_IN = TYPE_ID + RsqlOperator.IN;
}
