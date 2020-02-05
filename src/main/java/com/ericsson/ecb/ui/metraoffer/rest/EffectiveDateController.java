package com.ericsson.ecb.ui.metraoffer.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ericsson.ecb.catalog.model.EffectiveDate;
import com.ericsson.ecb.catalog.model.instance.EffectiveDateMode;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.service.EffectiveDateService;

import io.swagger.annotations.Api;

@RestController
@Api(value = "EffectiveDate", description = "This table is used to updated the Effective dates")
@RequestMapping(RestControllerUri.EFFECTIVE_DATE)
public class EffectiveDateController {

  @Autowired
  private EffectiveDateService effectiveDateService;

  @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PUT,
      value = "/{effDateId}")
  public EffectiveDate updateEffectiveDate(@RequestBody EffectiveDate record,
      @PathVariable("effDateId") Integer effDateId) throws EcbBaseException {
    if (record.getStartDate() != null && record.getBeginoffset() == null) {
      record.setBeginoffset(0);
      record.setBeginType(EffectiveDateMode.EXPLICIT_DATE);
    }
    if (record.getEndDate() != null && record.getEndoffset() == null) {
      record.setEndoffset(0);
      record.setEndType(EffectiveDateMode.EXPLICIT_DATE);
    }
    return effectiveDateService.updateEffectiveDate(record, effDateId);
  }

}
