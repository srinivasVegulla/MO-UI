package com.ericsson.ecb.ui.metraoffer.rest;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.codehaus.jettison.json.JSONException;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.ericsson.ecb.catalog.model.Calendar;
import com.ericsson.ecb.catalog.model.CalendarDay;
import com.ericsson.ecb.catalog.model.CalendarInUseInfo;
import com.ericsson.ecb.catalog.model.CalendarPeriod;
import com.ericsson.ecb.catalog.model.CalendarWithInUse;
import com.ericsson.ecb.catalog.model.ExtendedCalendarPeriod;
import com.ericsson.ecb.catalog.model.LocalizedCalendar;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.ui.metraoffer.constants.RestControllerUri;
import com.ericsson.ecb.ui.metraoffer.model.CalendarDetails;
import com.ericsson.ecb.ui.metraoffer.model.CalendarHolidayDto;
import com.ericsson.ecb.ui.metraoffer.model.CalendarInUse;
import com.ericsson.ecb.ui.metraoffer.model.ResponseModel;
import com.ericsson.ecb.ui.metraoffer.model.StandardCalendarDayDtoList;
import com.ericsson.ecb.ui.metraoffer.service.CalendarService;
import com.google.gson.Gson;

public class CalendarControllerTest {

  private MockMvc mockMvc;

  @InjectMocks
  private CalendarController calendarController;

  @Mock
  private CalendarService calendarService;

  private final String URI = RestControllerUri.CALENDAR;

  private Integer calendarId = 1;
  private Integer page = 0;
  private Integer size = 20;
  LocalizedCalendar localisedCalendar = new LocalizedCalendar();
  Calendar calendar = new Calendar();
  CalendarWithInUse calendarWithInUse = new CalendarWithInUse();
  PaginatedList<Calendar> record = new PaginatedList<Calendar>();
  StandardCalendarDayDtoList calendardayDetails = new StandardCalendarDayDtoList();

  ResponseModel responseModel = new ResponseModel();

  List<ResponseModel> calendarDayResponse = new ArrayList<ResponseModel>();

  @Before
  public void init() throws JSONException {
    MockitoAnnotations.initMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(calendarController).build();
  }

  @Test
  public void shouldGetCalendar() throws Exception {
    when(calendarController.getCalendar(calendarId)).thenReturn(calendarWithInUse);
    mockMvc.perform(get(URI + "/{calendarId}", calendarId)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldFindCalendar() throws Exception {
    PaginatedList<CalendarInUse> record = new PaginatedList<CalendarInUse>();
    when(calendarController.findCalendar(page, size, null, null, null, null, null))
        .thenReturn(record);
    mockMvc.perform(get(URI).param("page", page + "").param("size", size + ""))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldCreateCalendar() throws Exception {
    calendar.setCalendarId(1);
    when(calendarController.createCalendar(localisedCalendar)).thenReturn(calendar);
    Gson gson = new Gson();
    String json = gson.toJson(calendar);
    mockMvc.perform(get(URI)).andExpect(status().isOk());
    mockMvc
        .perform(
            MockMvcRequestBuilders.post(URI).contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

  }

  @Test
  public void shouldDeleteCalendar() throws Exception {

    Boolean flag = Boolean.TRUE;
    when(calendarController.deleteCalendar(1)).thenReturn(flag);
    mockMvc.perform(delete(URI + "/{calendarId}", 1)).andExpect(status().isOk());
    mockMvc.perform(delete(URI + "/{calendarId}", 1).accept(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldCopyCalendar() throws Exception {
    when(calendarController.copyCalendar(calendarId, localisedCalendar))
        .thenReturn(localisedCalendar);
    Gson gson = new Gson();
    String json = gson.toJson(calendar);
    mockMvc
        .perform(MockMvcRequestBuilders.post(URI + "/{calendarId}", calendarId)
            .contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void saveStandardCalendarDayDetails() throws Exception {
    buildCalendardayJsonInputDetails();
    buildResponseModelJsonOutputDetails();
    assertSaveStandardCalendarDayDetailsResponse();
  }

  @Test
  public void shouldFindCalendarWithInUseInfo() throws Exception {
    PaginatedList<CalendarInUseInfo> paginatedList = new PaginatedList<CalendarInUseInfo>();

    when(calendarController.findCalendarWithInUseInfo(null, page, size, null, null, null, null,
        null)).thenReturn(paginatedList);
    mockMvc.perform(get(URI + "/in-use-info/" + calendarId)).andExpect(status().isOk());
  }

  private void assertSaveStandardCalendarDayDetailsResponse() throws Exception {
    when(calendarController.saveStandardCalendarDayDetails(calendardayDetails))
        .thenReturn(calendarDayResponse);
    Gson gson = new Gson();
    String json = gson.toJson(calendardayDetails);
    String result = mockMvc
        .perform(MockMvcRequestBuilders.put(URI + "/standard-day", calendardayDetails)
            .contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    Assert.assertNotNull(result);
  }

  private void buildResponseModelJsonOutputDetails() {
    responseModel.setCode(200);
    calendarDayResponse.add(responseModel);
  }

  private void buildCalendardayJsonInputDetails() {
    List<CalendarDay> calendarDayList = new ArrayList<>();
    CalendarDay calendarDay = new CalendarDay();
    calendarDayList.add(calendarDay);

    List<ExtendedCalendarPeriod> extendedCalendarPeriodList = new ArrayList<>();
    ExtendedCalendarPeriod extendedCalendarPeriod = new ExtendedCalendarPeriod();
    extendedCalendarPeriodList.add(extendedCalendarPeriod);

    List<CalendarPeriod> calendarPeriodList = new ArrayList<>();
    CalendarPeriod calendarPeriod = new CalendarPeriod();
    calendarPeriodList.add(calendarPeriod);

    List<Integer> deletePeriodIds = new ArrayList<>();
    deletePeriodIds.add(5);

    calendardayDetails.setCreateDefaultList(calendarDayList);
    calendardayDetails.setUpdateDefaultList(calendarDayList);
    calendardayDetails.setCreatePeriodList(extendedCalendarPeriodList);;
    calendardayDetails.setUpdatePeriodsList(calendarPeriodList);
    calendardayDetails.setDeletePeriodIds(deletePeriodIds);
  }

  @Test
  public void shouldGetStandardDayDetails() throws Exception {
    CalendarDetails calendarDetails = new CalendarDetails();
    when(calendarController.getStandardDayDetails(calendarId)).thenReturn(calendarDetails);
    mockMvc.perform(get(URI + "/standard-day/{calendarId}", calendarId)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldGetHolidayDetails() throws Exception {
    CalendarDetails calendarDetails = new CalendarDetails();
    when(calendarController.getHolidayDetails(calendarId)).thenReturn(calendarDetails);
    mockMvc.perform(get(URI + "/holiday/{calendarId}", calendarId)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
  }

  @Test
  public void shouldCalendarHolidaysBatchs() throws Exception {
    CalendarHolidayDto calendarHolidayDto = new CalendarHolidayDto();
    Gson gson = new Gson();
    String json = gson.toJson(calendarHolidayDto);
    when(calendarController.calendarHolidaysBatch(calendarHolidayDto, calendarId))
        .thenReturn(new ArrayList<ResponseModel>());
    mockMvc.perform(put(URI + "/holiday/{calendarId}", calendarId)
        .contentType(MediaType.APPLICATION_JSON_UTF8).content(json)).andExpect(status().isOk());
  }

  @Test
  public void shouldDeleteHoliday() throws Exception {
    when(calendarController.deleteHoliday(1)).thenReturn(Boolean.TRUE);
    mockMvc.perform(delete(URI + "/holiday/{holidayId}", 1).accept(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldDeletePeriods() throws Exception {
    when(calendarService.deletePeriod(Collections.singleton(1))).thenReturn(Boolean.TRUE);
    mockMvc.perform(delete(URI + "/period/{periodId}", 1).accept(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  }

  @Test
  public void shouldDeleteStdDayPeriods() throws Exception {
    Set<Integer> periodId = Collections.singleton(1);
    Gson gson = new Gson();
    String json = gson.toJson(periodId);
    when(calendarService.deletePeriod(periodId)).thenReturn(Boolean.TRUE);
    mockMvc.perform(put(URI + "/standard-day/period/", periodId)
        .contentType(MediaType.APPLICATION_JSON_UTF8).content(json)).andExpect(status().isOk());
  }

  @Test
  public void shouldUpdateCalendar() throws Exception {
    ResponseEntity<Calendar> calendar = new ResponseEntity<Calendar>(HttpStatus.OK);
    Calendar calendarDto = new Calendar();
    Gson gson = new Gson();
    String json = gson.toJson(calendarDto);
    when(calendarController.updateCalendar(calendarDto, calendarId)).thenReturn(calendar);
    mockMvc.perform(put(URI + "/{calendarId}", calendarId)
        .contentType(MediaType.APPLICATION_JSON_UTF8).content(json)).andExpect(status().isOk());
  }

  @Test
  public void shouldGetCalendarCodeMetadata() throws Exception {
    Map<String, String> metaData = new HashMap<>();
    when(calendarController.getCalendarCodeMetadata()).thenReturn(metaData);
    mockMvc.perform(get(URI + "/calendar-code/")).andExpect(status().isOk());
  }
}
