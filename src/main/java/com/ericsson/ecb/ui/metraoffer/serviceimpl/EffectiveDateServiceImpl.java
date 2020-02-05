package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ericsson.ecb.catalog.client.EffectiveDateClient;
import com.ericsson.ecb.catalog.model.EffectiveDate;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.service.EffectiveDateService;

@Service
public class EffectiveDateServiceImpl implements EffectiveDateService {

  @Autowired
  private EffectiveDateClient effectiveDateClient;

  @Override
  public EffectiveDate updateEffectiveDate(EffectiveDate record, Integer effDateId)
      throws EcbBaseException {
    return effectiveDateClient.updateEffectiveDate(record, effDateId).getBody();
  }

}
