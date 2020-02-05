package com.ericsson.ecb.ui.metraoffer.model;

import java.util.ArrayList;
import java.util.Collection;

import com.ericsson.ecb.catalog.model.Adjustment;
import com.ericsson.ecb.catalog.model.ReasonCode;

public class AdjustmentModel extends Adjustment {

  private static final long serialVersionUID = 1L;

  private Collection<ReasonCode> reasonCodes;

  public AdjustmentModel() {
    reasonCodes = new ArrayList<>();
  }

  public Collection<ReasonCode> getReasonCodes() {
    return reasonCodes;
  }
}
