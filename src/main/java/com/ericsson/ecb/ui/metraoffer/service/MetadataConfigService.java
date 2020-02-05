package com.ericsson.ecb.ui.metraoffer.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.metadata.model.DefineService;
import com.ericsson.ecb.common.model.PropertyKind;
import com.ericsson.ecb.ui.metraoffer.model.ExtendedProperty;

public interface MetadataConfigService {

  public static final String EXTENDED_PROP_EXTENSION = "SystemConfig";

  class ValidPiKind {
    public static List<PropertyKind> validPiKindList = new ArrayList<>();
    static {
      validPiKindList.add(PropertyKind.RECURRING);
      validPiKindList.add(PropertyKind.NON_RECURRING);
      validPiKindList.add(PropertyKind.UNIT_DEPENDENT_RECURRING);
      validPiKindList.add(PropertyKind.USAGE);
      validPiKindList.add(PropertyKind.AGGREGATE_CHARGE);
      validPiKindList.add(PropertyKind.DISCOUNT);
    }
  }

  class PropKindName {
    public static final Map<PropertyKind, String> PROP_KIND_NAME =
        new HashMap<PropertyKind, String>();
    static {
      PROP_KIND_NAME.put(PropertyKind.OFFERING, "po");
      PROP_KIND_NAME.put(PropertyKind.DISCOUNT, "discount");
      PROP_KIND_NAME.put(PropertyKind.NON_RECURRING, "nonrecurring");
      PROP_KIND_NAME.put(PropertyKind.RECURRING, "recurring");
      PROP_KIND_NAME.put(PropertyKind.UNIT_DEPENDENT_RECURRING, "unit_dependent_recurring");
      PROP_KIND_NAME.put(PropertyKind.USAGE, "usage");
      PROP_KIND_NAME.put(PropertyKind.AGGREGATE_CHARGE, "aggregate");
    }
  }

  public DefineService getExtendedPropsMetadata(final PropertyKind propertyKind)
      throws EcbBaseException;

  public List<ExtendedProperty> getExtendedProperties(Map<String, Object> properties,
      PropertyKind propertyKind) throws EcbBaseException;

}
