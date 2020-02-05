package com.ericsson.ecb.ui.metraoffer.service;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.ResponseEntity;

import com.ericsson.ecb.catalog.model.Calendar;
import com.ericsson.ecb.catalog.model.CalendarInUseInfo;
import com.ericsson.ecb.catalog.model.CalendarWithInUse;
import com.ericsson.ecb.catalog.model.LocalizedCalendar;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.ui.metraoffer.model.CalendarDetails;
import com.ericsson.ecb.ui.metraoffer.model.CalendarHolidayDto;
import com.ericsson.ecb.ui.metraoffer.model.CalendarInUse;
import com.ericsson.ecb.ui.metraoffer.model.ResponseModel;
import com.ericsson.ecb.ui.metraoffer.model.StandardCalendarDayDtoList;

public interface CalendarService {

  public PaginatedList<CalendarInUse> findCalendar(Integer page, Integer size, String[] sort,
      String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException;

  public Calendar createCalendar(LocalizedCalendar record) throws EcbBaseException;

  public Boolean deleteCalendar(Integer calendarId) throws EcbBaseException;

  public LocalizedCalendar copyCalendar(LocalizedCalendar record, Integer calendarId)
      throws EcbBaseException;

  public CalendarWithInUse getCalendar(Integer calendarId) throws EcbBaseException;

  public List<ResponseModel> saveStandardCalendarDayDetails(StandardCalendarDayDtoList records)
      throws EcbBaseException;

  public PaginatedList<CalendarInUseInfo> findInUsePriceableItems(Integer calendarId, Integer page,
      Integer size, String[] sort, String query, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException;

  public Map<String, String> getCalendarCodeMetadata() throws EcbBaseException;

  public CalendarDetails getStandardDayDetails(Integer calendarId) throws EcbBaseException;

  public CalendarDetails getHolidayDetails(Integer calendarId) throws EcbBaseException;

  public List<ResponseModel> calendarHolidaysBatch(CalendarHolidayDto records, Integer calendarId)
      throws EcbBaseException;

  public Boolean deleteHoliday(Integer holidayId) throws EcbBaseException;

  public Boolean deletePeriod(Set<Integer> periodId) throws EcbBaseException;

  public ResponseEntity<Calendar> updateCalendar(Calendar record, Integer calendarId)
      throws EcbBaseException;

}
