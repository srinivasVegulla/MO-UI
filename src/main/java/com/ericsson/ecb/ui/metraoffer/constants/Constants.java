package com.ericsson.ecb.ui.metraoffer.constants;

import java.util.Collections;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.Map;

import com.ericsson.ecb.catalog.model.instance.PricelistType;
import com.ericsson.ecb.common.model.PropertyKind;

public class Constants {

  Constants() {}

  public static final String SIMPLE_DATE_FORMAT = "MM/dd/yyyy";
  public static final String OFFSET_DATE_FORMAT = "yyyy-MM-dd";

  public static final Integer PROPERTY_TYPE_STRING = 0;
  public static final Integer PROPERTY_TYPE_INTEGER = 1;
  public static final Integer PROPERTY_TYPE_DECIMAL = 2;
  public static final Integer PROPERTY_TYPE_LIST = 3;
  public static final Integer PROPERTY_TYPE_BOOLEAN = 4;
  public static final Integer PROPERTY_TYPE_DATE_TIME = 5;

  public static final String CREATE_HOLIDAY = "CREATE HOLIDAY";
  public static final String CREATE_HOLIDAY_PERIOD = "CREATE HOLIDAY PERIOD";
  public static final String UPDATE_HOLIDAY = "UPDATE HOLIDAY";
  public static final String UPDATE_HOLIDAY_PERIOD = "UPDATE HOLIDAY PERIOD";
  public static final String DELETE_HOLIDAY = "DELETE HOLIDAY";
  public static final String DELETE_HOLIDAY_PERIOD = "DELETE HOLIDAY PERIOD";

  public static final Boolean COMBINED_WEEKEND = Boolean.FALSE;
  public static final String CREATE_CALENDAR_DAY = "CREATE_CALENDAR_DAY: ";
  public static final String CREATE_DAY_PERIOD = "CREATE_DAY_PERIOD: ";
  public static final String DELETE_DAY_PERIOD = "DELETE_DAY_PERIOD: ";
  public static final Integer TIME_ZONE_OFFSET = 0;
  public static final String UPDATE_CALENDAR_DAY = "UPDATE_CALENDAR_DAY: ";
  public static final String UPDATE_DAY_PERIOD = "UPDATE_DAY_PERIOD: ";

  public static final String MAX_DATE = "2106-01-01";

  public static final String UDRC_TIERED = "UDRCTiered";
  public static final String UDRC_TAPERED = "UDRCTapered";

  public static final String REGULAR = "REGULAR";
  
  public static final String HAS_PENDING_APPROVALS = "hasPendingApprovals";
  public static final String APPROVALS_WARNING_MSG = "approvalsWarningMsg";
  public static final String ENABLE_APPROVALS_EDIT = "enableApprovalsEdit";

  public static final String NEW_ENTITY = "newEntity";
  public static final String OLD_ENTITY = "oldEntity";

  public static final String VISIBILITY_FLAG = "visibilityFlag";
  
  public static final Map<String, String> KIND;
  public static final Map<String, String> TYPES;
  public static final Map<PropertyKind, String> CHARGE_CATEGORY_TYPE;
  public static final Map<PropertyKind, String> CHARGE_CATEGORY_KIND;
  public static final Map<Integer, String> TYPE;

  static {
    Map<String, String> piKinds = new HashMap<>();
    piKinds.put(PropertyKind.NON_RECURRING.name(), "One Time Charges");
    piKinds.put(PropertyKind.RECURRING.name(), "Recurring Charges");
    piKinds.put(PropertyKind.USAGE.name(), "Usage Charges");
    piKinds.put(PropertyKind.DISCOUNT.name(), "Discount");
    piKinds.put(PropertyKind.UNIT_DEPENDENT_RECURRING.name(), "Unit Dependent Recurring");
    KIND = Collections.unmodifiableMap(piKinds);

    Map<String, String> pricelistTypes = new HashMap<>();
    pricelistTypes.put(PricelistType.PO.name(), "Local");
    pricelistTypes.put(PricelistType.REGULAR.name(), "Shared");
    pricelistTypes.put(PricelistType.ICB.name(), "Icb");
    TYPES = Collections.unmodifiableMap(pricelistTypes);

    EnumMap<PropertyKind, String> chargeCategoryType = new EnumMap<>(PropertyKind.class);
    chargeCategoryType.put(PropertyKind.RECURRING, "Recurring");
    chargeCategoryType.put(PropertyKind.UNIT_DEPENDENT_RECURRING, "Unit Dependent Recurring");
    chargeCategoryType.put(PropertyKind.NON_RECURRING, "One Time");
    chargeCategoryType.put(PropertyKind.DISCOUNT, "Discount");
    CHARGE_CATEGORY_TYPE = Collections.unmodifiableMap(chargeCategoryType);

    EnumMap<PropertyKind, String> chargeCategoryKind = new EnumMap<>(PropertyKind.class);
    chargeCategoryKind.put(PropertyKind.USAGE, "Usage");
    chargeCategoryKind.putAll(chargeCategoryType);
    CHARGE_CATEGORY_KIND = Collections.unmodifiableMap(chargeCategoryKind);

    Map<Integer, String> subscriptionProperty = new HashMap<>();
    subscriptionProperty.put(PROPERTY_TYPE_STRING, "String (Text Input)");
    subscriptionProperty.put(PROPERTY_TYPE_INTEGER, "Integer (Numeric Input)");
    subscriptionProperty.put(PROPERTY_TYPE_DECIMAL, "Decimal (Numeric Input)");
    subscriptionProperty.put(PROPERTY_TYPE_LIST, "List (Dropdown)");
    subscriptionProperty.put(PROPERTY_TYPE_BOOLEAN, "Boolean (Checkbox)");
    subscriptionProperty.put(PROPERTY_TYPE_DATE_TIME, "Date & Time (DateTime Input)");
    TYPE = Collections.unmodifiableMap(subscriptionProperty);
  }
}
