package com.ericsson.ecb.ui.metraoffer.service;

import com.ericsson.ecb.catalog.model.EffectiveDate;
import com.ericsson.ecb.common.exception.EcbBaseException;

public interface EffectiveDateService {
  public EffectiveDate updateEffectiveDate(EffectiveDate record, Integer effDateId)
      throws EcbBaseException;
}
