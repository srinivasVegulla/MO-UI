package com.ericsson.ecb.ui.metraoffer.service;

import java.util.List;
import java.util.Set;

import org.springframework.http.ResponseEntity;

import com.ericsson.ecb.catalog.model.LocalizedRateSchedule;
import com.ericsson.ecb.catalog.model.RateSchedule;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.model.ParamTableRateSchedule;
import com.ericsson.ecb.ui.metraoffer.model.RateScheduleDto;
import com.ericsson.ecb.ui.metraoffer.model.RateScheduleSetDto;
import com.ericsson.ecb.ui.metraoffer.model.RatesDto;
import com.ericsson.ecb.ui.metraoffer.model.ResponseModel;

public interface RateScheduleService {

  public ResponseEntity<Boolean> removeRateSchedule(Integer scheduleId) throws EcbBaseException;

  public RatesDto getRates(Integer offerId, Integer piInstanceId, Boolean scheduleFirstIndex)
      throws EcbBaseException;

  public RatesDto getRateSchedules(Integer paramTableId, Integer itemTemplateId,
      Integer pricelistId, Integer page, Integer size, String[] sort) throws EcbBaseException;

  public RateScheduleDto createRateSchedule(LocalizedRateSchedule rateschedule)
      throws EcbBaseException;

  public RateScheduleDto updateRateSchedule(RateSchedule rateschedule) throws EcbBaseException;

  public List<ResponseModel> editRateScheduleSet(RateScheduleSetDto rateScheduleSetDto)
      throws EcbBaseException;

  public PaginatedList<ParamTableRateSchedule> getParameterTableRateSchedules(Integer ptId,
      Integer scheduleId, String ptName, Integer page, Integer size, String[] sort, String query,
      String descriptionLanguage, Set<String> descriptionFilters, String descriptionSort)
      throws EcbBaseException;

  public PaginatedList<RateSchedule> findRateSchedule(Integer page, Integer size, String[] sort,
      String query) throws EcbBaseException;

}
