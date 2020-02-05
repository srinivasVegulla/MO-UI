package com.ericsson.ecb.ui.metraoffer.service;

import static org.mockito.Mockito.when;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ericsson.ecb.catalog.client.EffectiveDateClient;
import com.ericsson.ecb.catalog.model.EffectiveDate;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.EffectiveDateServiceImpl;

public class EffectiveDateServiceImplTest {
  @Mock
  EffectiveDateClient effectiveDateClient;

  @InjectMocks
  EffectiveDateServiceImpl effectiveDateServiceImpl;

  EffectiveDate effectiveDate;

  ResponseEntity<EffectiveDate> effectiveDateRe;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    effectiveDate = new EffectiveDate();
    effectiveDateRe = new ResponseEntity<EffectiveDate>(effectiveDate, HttpStatus.OK);
  }

  @Test
  public void shouldUpdateEffectiveDate() throws Exception {

    when(effectiveDateClient.updateEffectiveDate(effectiveDate, 1)).thenReturn(effectiveDateRe);
    effectiveDateServiceImpl.updateEffectiveDate(effectiveDate, 1);

  }
}
