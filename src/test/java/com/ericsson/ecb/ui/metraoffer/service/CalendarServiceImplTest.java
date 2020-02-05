package com.ericsson.ecb.ui.metraoffer.service;

import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;

import com.ericsson.ecb.catalog.client.CalendarClient;
import com.ericsson.ecb.catalog.client.CalendarDayClient;
import com.ericsson.ecb.catalog.client.CalendarHolidayClient;
import com.ericsson.ecb.catalog.client.CalendarPeriodClient;
import com.ericsson.ecb.catalog.client.ExtendedCalendarClient;
import com.ericsson.ecb.catalog.client.ExtendedCalendarDayClient;
import com.ericsson.ecb.catalog.client.ExtendedCalendarHolidayClient;
import com.ericsson.ecb.catalog.client.ExtendedCalendarPeriodClient;
import com.ericsson.ecb.catalog.model.Calendar;
import com.ericsson.ecb.catalog.model.CalendarDay;
import com.ericsson.ecb.catalog.model.CalendarHoliday;
import com.ericsson.ecb.catalog.model.CalendarInUseInfo;
import com.ericsson.ecb.catalog.model.CalendarPeriod;
import com.ericsson.ecb.catalog.model.CalendarWithInUse;
import com.ericsson.ecb.catalog.model.ExtendedCalendarHoliday;
import com.ericsson.ecb.catalog.model.ExtendedCalendarPeriod;
import com.ericsson.ecb.catalog.model.LocalizedCalendar;
import com.ericsson.ecb.catalog.model.template.CalendarWeekday;
import com.ericsson.ecb.common.api.PaginatedList;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.metadata.client.MetadataConfigClient;
import com.ericsson.ecb.metadata.model.enumeration.Entries;
import com.ericsson.ecb.metadata.model.enumeration.Entry;
import com.ericsson.ecb.metadata.model.enumeration.Enum;
import com.ericsson.ecb.metadata.model.enumeration.EnumSpace;
import com.ericsson.ecb.metadata.model.enumeration.EnumSpaces;
import com.ericsson.ecb.metadata.model.enumeration.Enums;
import com.ericsson.ecb.metadata.model.enumeration.MtEnum;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.model.CalendarHolidayDto;
import com.ericsson.ecb.ui.metraoffer.model.CalendarInUse;
import com.ericsson.ecb.ui.metraoffer.model.StandardCalendarDayDtoList;
import com.ericsson.ecb.ui.metraoffer.serviceimpl.CalendarServiceImpl;

public class CalendarServiceImplTest {

  @InjectMocks
  private CalendarServiceImpl calendarServiceImpl;

  @Mock
  private CalendarClient calendarClient;

  @Mock
  private ExtendedCalendarClient extendedCalendarClient;

  @Mock
  private LocalizedEntityService localizedEntity;

  @Mock
  private ExtendedCalendarPeriodClient extendedCalendarPeriodClient;

  @Mock
  private ExtendedCalendarDayClient extendedCalendarDayClient;

  @Mock
  private CalendarPeriodClient calendarPeriodClient;

  @Mock
  private CalendarHolidayClient calendarHolidayClient;

  @Mock
  private CalendarDayClient calendarDayClient;

  @Mock
  private ExtendedCalendarHolidayClient extendedCalendarHolidayClient;

  @Mock
  private MetadataConfigClient metadataConfigClient;

  private Integer calendarId = 1;
  private Calendar calendar;
  private LocalizedCalendar record;
  private StandardCalendarDayDtoList calendarDayDto;
  private CalendarDay calendarDay;
  private ExtendedCalendarPeriod extendedCalendarPeriod;
  private CalendarPeriod calendarPeriod;
  private List<CalendarDay> calendarDayList;
  private List<Integer> deleteTimePeriods;
  private List<CalendarPeriod> calendarPeriodList;
  private List<ExtendedCalendarPeriod> extendedCalendarPeriodList;
  private Integer id = 1;

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
    calendar = new Calendar();
    record = new LocalizedCalendar();
    calendarDayDto = new StandardCalendarDayDtoList();
    calendarDay = new CalendarDay();
    extendedCalendarPeriod = new ExtendedCalendarPeriod();
    calendarPeriod = new CalendarPeriod();
    calendarDayList = new ArrayList<CalendarDay>();
    deleteTimePeriods = new ArrayList<Integer>();
    extendedCalendarPeriodList = new ArrayList<ExtendedCalendarPeriod>();
    calendarPeriodList = new ArrayList<CalendarPeriod>();
  }

  @Test
  public void shouldGetCalendar() throws Exception {

    CalendarWithInUse calendarWithInUse = new CalendarWithInUse();
    when(localizedEntity.localizedGetEntity(calendar)).thenReturn(calendar);

    List<CalendarWithInUse> calendarWithInUseList = new ArrayList<>();
    calendarWithInUseList.add(calendarWithInUse);

    PaginatedList<CalendarWithInUse> paginatedList = new PaginatedList<CalendarWithInUse>();
    paginatedList.setRecords(calendarWithInUseList);
    ResponseEntity<PaginatedList<CalendarWithInUse>> value =
        new ResponseEntity<PaginatedList<CalendarWithInUse>>(paginatedList, HttpStatus.OK);
    when(extendedCalendarClient.extendedFindCalendar(1, Integer.MAX_VALUE, null, "calendarId==1",
        null, null, null)).thenReturn(value);
    when(localizedEntity.localizedGetEntity(calendarWithInUseList.get(0)))
        .thenReturn(calendarWithInUseList.get(0));
    calendarServiceImpl.getCalendar(calendarId);
  }


  @Test
  public void shouldFindCalendar() throws Exception {
    CalendarWithInUse calendarWithInUse = new CalendarWithInUse();
    calendarWithInUse.setCalendarId(calendarId);
    calendarWithInUse.setName("Sample");
    Collection<CalendarWithInUse> calendarWithInUseCollection = new ArrayList<>();
    calendarWithInUseCollection.add(calendarWithInUse);
    PaginatedList<CalendarWithInUse> paginatedList = new PaginatedList<>();
    paginatedList.setRecords(calendarWithInUseCollection);

    ResponseEntity<PaginatedList<CalendarWithInUse>> value =
        new ResponseEntity<PaginatedList<CalendarWithInUse>>(paginatedList, HttpStatus.OK);
    when(extendedCalendarClient.extendedFindCalendar(1, 20, null, null, null, null, null))
        .thenReturn(value);
    PaginatedList<CalendarInUse> paginatedRecords = new PaginatedList<>();
    when(localizedEntity.localizedFindEntity(paginatedRecords)).thenReturn(paginatedRecords);
    calendarServiceImpl.findCalendar(1, 20, null, null, null, null, null);
  }

  @Test
  public void shouldCreateCalendar() throws Exception {
    ResponseEntity<Calendar> value = new ResponseEntity<>(calendar, HttpStatus.OK);
    when(calendarClient.createCalendar(record)).thenReturn(value);
    when(localizedEntity.localizedCreateEntity(calendar)).thenReturn(calendar);
    calendarServiceImpl.createCalendar(record);
  }

  @Test
  public void shouldDeleteCalendar() throws Exception {
    ResponseEntity<Boolean> flag = new ResponseEntity<Boolean>(true, HttpStatus.OK);
    when(extendedCalendarClient.deleteCalendar(calendarId)).thenReturn(flag);
    calendarServiceImpl.deleteCalendar(calendarId);

  }

  @Test
  public void shouldCopyCalendar() throws Exception {
    ResponseEntity<LocalizedCalendar> value =
        new ResponseEntity<LocalizedCalendar>(record, HttpStatus.OK);
    when(extendedCalendarClient.copyCalendar(record, calendarId)).thenReturn(value);
    when(localizedEntity.localizedCreateEntity(calendar)).thenReturn(calendar);
    calendarServiceImpl.copyCalendar(record, calendarId);
  }


  @Test
  public void shouldFindInUsePriceableItems() throws Exception {
    PaginatedList<CalendarInUseInfo> paginatedList = new PaginatedList<CalendarInUseInfo>();
    ResponseEntity<PaginatedList<CalendarInUseInfo>> responseEntitity =
        new ResponseEntity<PaginatedList<CalendarInUseInfo>>(paginatedList, HttpStatus.OK);

    when(extendedCalendarClient.findCalendarWithInUseInfo(1, Integer.MAX_VALUE, null,
        "calendarId==1", null, null, null)).thenReturn(responseEntitity);
    calendarServiceImpl.findInUsePriceableItems(calendarId, 1, Integer.MAX_VALUE, null, null, null,
        null, null);
  }

  @Test
  public void shouldFindInUsePriceableItemsForIf() throws Exception {
    String query = "itemInstanceNameId==2";
    PaginatedList<CalendarInUseInfo> paginatedList = new PaginatedList<CalendarInUseInfo>();
    ResponseEntity<PaginatedList<CalendarInUseInfo>> responseEntitity =
        new ResponseEntity<PaginatedList<CalendarInUseInfo>>(paginatedList, HttpStatus.OK);

    when(extendedCalendarClient.findCalendarWithInUseInfo(1, Integer.MAX_VALUE, null,
        "itemInstanceNameId==2 and calendarId==1", null, null, null)).thenReturn(responseEntitity);
    calendarServiceImpl.findInUsePriceableItems(calendarId, 1, Integer.MAX_VALUE, null, query, null,
        null, null);
  }


  @Test
  public void shouldSaveStandardCalendarDayDetails() throws Exception {
    calendarDayDto = buildCalendarDayDto();
    mockCreateCalendarDayResponse();
    mockUpdateCalendarDayResponse();
    mockCreateTimePeriodResponse();
    mockUpdateTimePeriodResponse();
    mockDeleteTimePeriodResponse();
    calendarServiceImpl.saveStandardCalendarDayDetails(calendarDayDto);
  }

  @Test
  public void shouldSaveStandardCalendarDayDetailsForCatch() throws Exception {
    calendarDayDto = buildCalendarDayDto();
    mockCreateCalendarDayResponseForCatch();
    mockUpdateCalendarDayResponse();
    mockCreateTimePeriodResponse();
    mockUpdateTimePeriodResponse();
    mockDeleteTimePeriodResponse();
    calendarServiceImpl.saveStandardCalendarDayDetails(calendarDayDto);
  }

  private void mockDeleteTimePeriodResponse() throws EcbBaseException {
    ResponseEntity<Boolean> deleteCalendarPeriodResponse =
        new ResponseEntity<Boolean>(HttpStatus.OK);
    when(extendedCalendarPeriodClient.deleteCalendarPeriod(deleteTimePeriods))
        .thenReturn(deleteCalendarPeriodResponse);
  }

  private void mockUpdateTimePeriodResponse() throws EcbBaseException {
    ResponseEntity<List<CalendarPeriod>> updateCalendarPeriodResponse =
        new ResponseEntity<List<CalendarPeriod>>(calendarPeriodList, HttpStatus.OK);
    when(extendedCalendarPeriodClient.updateCalendarPeriodBatch(calendarPeriodList))
        .thenReturn(updateCalendarPeriodResponse);
  }

  private void mockCreateTimePeriodResponse() throws EcbBaseException {
    ResponseEntity<List<ExtendedCalendarPeriod>> createCalendarPeriodResponse =
        new ResponseEntity<List<ExtendedCalendarPeriod>>(extendedCalendarPeriodList, HttpStatus.OK);
    when(extendedCalendarPeriodClient.createCalendarPeriodBatch(extendedCalendarPeriodList))
        .thenReturn(createCalendarPeriodResponse);
  }

  private void mockCreateCalendarDayResponse() throws Exception {
    ResponseEntity<List<CalendarDay>> createCalendarDayResponse =
        new ResponseEntity<List<CalendarDay>>(calendarDayList, HttpStatus.OK);

    when(extendedCalendarDayClient.createCalendarDayBatch(calendarDayList))
        .thenReturn(createCalendarDayResponse);
  }

  private void mockCreateCalendarDayResponseForCatch() throws EcbBaseException {
    EcbBaseException exception = new EcbBaseException();
    when(extendedCalendarDayClient.createCalendarDayBatch(calendarDayList)).thenThrow(exception);
  }

  private void mockUpdateCalendarDayResponse() throws Exception {
    ResponseEntity<List<CalendarDay>> updateCalendarDayResponse =
        new ResponseEntity<List<CalendarDay>>(calendarDayList, HttpStatus.OK);
    when(extendedCalendarDayClient.updateCalendarDayBatch(calendarDayList))
        .thenReturn(updateCalendarDayResponse);
  }

  private StandardCalendarDayDtoList buildCalendarDayDto() {

    calendarDay = buildCalendarDayDetails(1, 2, CalendarWeekday.MONDAY);
    calendarDayList.add(calendarDay);
    calendarDayDto.setCreateDefaultList(calendarDayList);
    calendarDayDto.setUpdateDefaultList(calendarDayList);

    extendedCalendarPeriod = buildExtendedCalendarPeriodDetails(1, 1, 10);
    extendedCalendarPeriodList.add(extendedCalendarPeriod);

    calendarDayDto.setCreatePeriodList(extendedCalendarPeriodList);
    calendarPeriod = buildCalendarPeriod(10, 11, 2, 12);
    calendarPeriodList.add(calendarPeriod);

    calendarDayDto.setUpdatePeriodsList(calendarPeriodList);
    deleteTimePeriods.add(100);
    deleteTimePeriods.add(101);

    calendarDayDto.setDeletePeriodIds(deleteTimePeriods);
    return calendarDayDto;
  }

  private ExtendedCalendarPeriod buildExtendedCalendarPeriodDetails(int calendarId, int code,
      int dayId) {
    extendedCalendarPeriod.setCalendarId(calendarId);
    extendedCalendarPeriod.setCode(code);
    extendedCalendarPeriod.setDayId(dayId);
    extendedCalendarPeriod.setWeekday(CalendarWeekday.MONDAY);
    buildCalendarPeriod(8, 9, 1, dayId);
    extendedCalendarPeriod.getCalendarPeriods().add(calendarPeriod);
    return extendedCalendarPeriod;
  }

  private CalendarPeriod buildCalendarPeriod(int begin, int end, int code, int dayId) {
    calendarPeriod.setBegin(begin);
    calendarPeriod.setEnd(end);
    calendarPeriod.setCode(code);
    calendarPeriod.setDayId(dayId);
    return calendarPeriod;
  }

  private CalendarDay buildCalendarDayDetails(int calendarId, int code,
      CalendarWeekday calendarWeekday) {
    calendarDay.setCalendarId(calendarId);
    calendarDay.setCode(code);
    calendarDay.setWeekday(calendarWeekday);
    return calendarDay;
  }

  @Test
  public void shouldGetStandardDayDetails() throws Exception {

    ResponseEntity<PaginatedList<CalendarDay>> calendarDayListTemp = calendarDayList();
    ResponseEntity<PaginatedList<CalendarPeriod>> calendarPeriodListTemp = calendarPeriodList();

    String[] sortArray = new String[1];
    sortArray[0] = "begin|asc";

    when(calendarDayClient.findCalendarDay(1, Integer.MAX_VALUE, null,
        PropertyRsqlConstants.CALENDAR_ID_EQUAL + 1)).thenReturn(calendarDayListTemp);

    when(calendarPeriodClient.findCalendarPeriod(1, Integer.MAX_VALUE, sortArray,
        PropertyRsqlConstants.DAY_ID_IN + "(2)")).thenReturn(calendarPeriodListTemp);

    calendarServiceImpl.getStandardDayDetails(calendarId);
  }

  @Test
  public void shouldGetHolidayDetails() throws Exception {

    ResponseEntity<PaginatedList<CalendarDay>> calendarDayListTemp = calendarDayList();
    ResponseEntity<PaginatedList<CalendarHoliday>> calendarHolidayListTemp = calendarHolidayList();
    ResponseEntity<PaginatedList<CalendarPeriod>> calendarHolidayPeriodListTemp =
        calendarPeriodList();

    when(calendarDayClient.findCalendarDay(1, Integer.MAX_VALUE, null,
        PropertyRsqlConstants.CALENDAR_ID_EQUAL + 1)).thenReturn(calendarDayListTemp);

    String[] sortArray = new String[1];
    sortArray[0] = "begin|asc";

    when(calendarHolidayClient.findCalendarHoliday(1, Integer.MAX_VALUE, null,
        PropertyRsqlConstants.DAY_ID_IN + "(3)")).thenReturn(calendarHolidayListTemp);

    when(calendarPeriodClient.findCalendarPeriod(1, Integer.MAX_VALUE, sortArray,
        PropertyRsqlConstants.DAY_ID_IN + "(3)")).thenReturn(calendarHolidayPeriodListTemp);
    calendarServiceImpl.getHolidayDetails(calendarId);
  }

  public ResponseEntity<PaginatedList<CalendarDay>> calendarDayList() {
    CalendarDay calendarDay1 = new CalendarDay();
    calendarDay1.setDayId(2);
    calendarDay1.setWeekday(CalendarWeekday.MONDAY);

    CalendarDay calendarDay2 = new CalendarDay();
    calendarDay2.setDayId(3);

    List<CalendarDay> calendarDayList = new ArrayList<>();
    calendarDayList.add(calendarDay1);
    calendarDayList.add(calendarDay2);
    PaginatedList<CalendarDay> paginatedList = new PaginatedList<>();
    paginatedList.setRecords(calendarDayList);
    return new ResponseEntity<PaginatedList<CalendarDay>>(paginatedList, HttpStatus.OK);
  }

  public ResponseEntity<PaginatedList<CalendarPeriod>> calendarPeriodList() {
    CalendarPeriod calendarPeriod = new CalendarPeriod();
    calendarPeriod.setCode(1);
    calendarPeriod.setDayId(2);

    List<CalendarPeriod> calendarPeriodList = new ArrayList<>();
    calendarPeriodList.add(calendarPeriod);
    PaginatedList<CalendarPeriod> paginatedList = new PaginatedList<>();
    paginatedList.setRecords(calendarPeriodList);
    return new ResponseEntity<PaginatedList<CalendarPeriod>>(paginatedList, HttpStatus.OK);
  }

  private ResponseEntity<PaginatedList<CalendarHoliday>> calendarHolidayList() {
    CalendarHoliday calendarHoliday = new CalendarHoliday();
    calendarHoliday.setDayId(2);
    List<CalendarHoliday> calendarHolidayList = new ArrayList<>();
    calendarHolidayList.add(calendarHoliday);
    PaginatedList<CalendarHoliday> paginatedList = new PaginatedList<>();
    paginatedList.setRecords(calendarHolidayList);
    return new ResponseEntity<PaginatedList<CalendarHoliday>>(paginatedList, HttpStatus.OK);
  }

  @Test
  public void shouldCalendarHolidaysBatch() throws Exception {
    CalendarHolidayDto calendarHolidayDto = new CalendarHolidayDto();

    ResponseEntity<List<ExtendedCalendarHoliday>> listHolidayCreateResponse =
        new ResponseEntity<List<ExtendedCalendarHoliday>>(HttpStatus.OK);
    List<ExtendedCalendarHoliday> listHolidayCreate = new ArrayList<>();
    ExtendedCalendarHoliday createHoliday = new ExtendedCalendarHoliday();
    createHoliday.setName("new Holiday");
    listHolidayCreate.add(createHoliday);
    calendarHolidayDto.setCreateDefaultList(listHolidayCreate);

    ResponseEntity<List<ExtendedCalendarPeriod>> listHolidayPeriodCreateResponse =
        new ResponseEntity<List<ExtendedCalendarPeriod>>(HttpStatus.OK);
    List<ExtendedCalendarPeriod> listHolidayPeriodCreate = new ArrayList<>();
    ExtendedCalendarPeriod createHolidayPeriod = new ExtendedCalendarPeriod();
    createHolidayPeriod.setCode(1);
    listHolidayPeriodCreate.add(createHolidayPeriod);
    calendarHolidayDto.setCreatePeriodList(listHolidayPeriodCreate);

    ResponseEntity<List<CalendarHoliday>> listHolidayUpdateResponse =
        new ResponseEntity<List<CalendarHoliday>>(HttpStatus.OK);
    List<CalendarHoliday> listHolidayUpdate = new ArrayList<>();
    CalendarHoliday updateHoliday = new CalendarHoliday();
    updateHoliday.setDayId(11);
    updateHoliday.setName("update Holiday");
    listHolidayUpdate.add(updateHoliday);
    calendarHolidayDto.setUpdateDefaultList(listHolidayUpdate);

    ResponseEntity<List<CalendarPeriod>> listHolidayPeriodUpdateResponse =
        new ResponseEntity<List<CalendarPeriod>>(HttpStatus.OK);
    List<CalendarPeriod> listHolidayPeriodUpdate = new ArrayList<>();
    CalendarPeriod updateHolidayPeriod = new CalendarPeriod();
    updateHolidayPeriod.setCode(1);
    listHolidayPeriodUpdate.add(updateHolidayPeriod);
    calendarHolidayDto.setUpdatePeriodsList(listHolidayPeriodUpdate);

    ResponseEntity<Boolean> listHolidayDeleteResponse = new ResponseEntity<Boolean>(HttpStatus.OK);
    List<Integer> listHolidayDelete = new ArrayList<>();
    listHolidayDelete.add(1);
    calendarHolidayDto.setDeleteDefaultIds(listHolidayDelete);

    ResponseEntity<Boolean> listHolidayPeriodDeleteResponse =
        new ResponseEntity<Boolean>(HttpStatus.OK);
    List<Integer> listHolidayPeriodDelete = new ArrayList<>();
    listHolidayPeriodDelete.add(1);
    calendarHolidayDto.setDeletePeriodIds(listHolidayPeriodDelete);

    when(extendedCalendarHolidayClient
        .createCalendarHolidayBatch(calendarHolidayDto.getCreateDefaultList()))
            .thenReturn(listHolidayCreateResponse);
    when(extendedCalendarPeriodClient
        .createCalendarPeriodBatch(calendarHolidayDto.getCreatePeriodList()))
            .thenReturn(listHolidayPeriodCreateResponse);
    when(extendedCalendarHolidayClient
        .updateCalendarHolidayBatch(calendarHolidayDto.getUpdateDefaultList()))
            .thenReturn(listHolidayUpdateResponse);
    when(extendedCalendarPeriodClient
        .updateCalendarPeriodBatch(calendarHolidayDto.getUpdatePeriodsList()))
            .thenReturn(listHolidayPeriodUpdateResponse);
    when(extendedCalendarHolidayClient
        .deleteCalendarHolidayList(calendarHolidayDto.getDeleteDefaultIds()))
            .thenReturn(listHolidayDeleteResponse);
    when(extendedCalendarPeriodClient.deleteCalendarPeriod(calendarHolidayDto.getDeletePeriodIds()))
        .thenReturn(listHolidayPeriodDeleteResponse);
    calendarServiceImpl.calendarHolidaysBatch(calendarHolidayDto, calendarId);
  }

  @Test
  public void shouldCalendarHolidaysBatchForHttpCatch() throws Exception {
    CalendarHolidayDto calendarHolidayDto = new CalendarHolidayDto();

    List<ExtendedCalendarHoliday> listHolidayCreate = new ArrayList<>();
    ExtendedCalendarHoliday createHoliday = new ExtendedCalendarHoliday();
    createHoliday.setName("new Holiday");
    listHolidayCreate.add(createHoliday);
    calendarHolidayDto.setCreateDefaultList(listHolidayCreate);

    ResponseEntity<List<ExtendedCalendarPeriod>> listHolidayPeriodCreateResponse =
        new ResponseEntity<List<ExtendedCalendarPeriod>>(HttpStatus.OK);
    List<ExtendedCalendarPeriod> listHolidayPeriodCreate = new ArrayList<>();
    ExtendedCalendarPeriod createHolidayPeriod = new ExtendedCalendarPeriod();
    createHolidayPeriod.setCode(1);
    listHolidayPeriodCreate.add(createHolidayPeriod);
    calendarHolidayDto.setCreatePeriodList(listHolidayPeriodCreate);

    ResponseEntity<List<CalendarHoliday>> listHolidayUpdateResponse =
        new ResponseEntity<List<CalendarHoliday>>(HttpStatus.OK);
    List<CalendarHoliday> listHolidayUpdate = new ArrayList<>();
    CalendarHoliday updateHoliday = new CalendarHoliday();
    updateHoliday.setDayId(11);
    updateHoliday.setName("update Holiday");
    listHolidayUpdate.add(updateHoliday);
    calendarHolidayDto.setUpdateDefaultList(listHolidayUpdate);

    ResponseEntity<List<CalendarPeriod>> listHolidayPeriodUpdateResponse =
        new ResponseEntity<List<CalendarPeriod>>(HttpStatus.OK);
    List<CalendarPeriod> listHolidayPeriodUpdate = new ArrayList<>();
    CalendarPeriod updateHolidayPeriod = new CalendarPeriod();
    updateHolidayPeriod.setCode(1);
    listHolidayPeriodUpdate.add(updateHolidayPeriod);
    calendarHolidayDto.setUpdatePeriodsList(listHolidayPeriodUpdate);

    ResponseEntity<Boolean> listHolidayDeleteResponse = new ResponseEntity<Boolean>(HttpStatus.OK);
    List<Integer> listHolidayDelete = new ArrayList<>();
    listHolidayDelete.add(1);
    calendarHolidayDto.setDeleteDefaultIds(listHolidayDelete);

    ResponseEntity<Boolean> listHolidayPeriodDeleteResponse =
        new ResponseEntity<Boolean>(HttpStatus.OK);
    List<Integer> listHolidayPeriodDelete = new ArrayList<>();
    listHolidayPeriodDelete.add(1);
    calendarHolidayDto.setDeletePeriodIds(listHolidayPeriodDelete);

    HttpClientErrorException httpClientErrorException =
        new HttpClientErrorException(HttpStatus.NOT_FOUND);

    when(extendedCalendarHolidayClient
        .createCalendarHolidayBatch(calendarHolidayDto.getCreateDefaultList()))
            .thenThrow(httpClientErrorException);

    when(extendedCalendarPeriodClient
        .createCalendarPeriodBatch(calendarHolidayDto.getCreatePeriodList()))
            .thenReturn(listHolidayPeriodCreateResponse);
    when(extendedCalendarHolidayClient
        .updateCalendarHolidayBatch(calendarHolidayDto.getUpdateDefaultList()))
            .thenReturn(listHolidayUpdateResponse);
    when(extendedCalendarPeriodClient
        .updateCalendarPeriodBatch(calendarHolidayDto.getUpdatePeriodsList()))
            .thenReturn(listHolidayPeriodUpdateResponse);
    when(extendedCalendarHolidayClient
        .deleteCalendarHolidayList(calendarHolidayDto.getDeleteDefaultIds()))
            .thenReturn(listHolidayDeleteResponse);
    when(extendedCalendarPeriodClient.deleteCalendarPeriod(calendarHolidayDto.getDeletePeriodIds()))
        .thenReturn(listHolidayPeriodDeleteResponse);
    calendarServiceImpl.calendarHolidaysBatch(calendarHolidayDto, calendarId);
  }

  @Test
  public void shouldCalendarHolidaysBatchForExCatch() throws Exception {
    CalendarHolidayDto calendarHolidayDto = new CalendarHolidayDto();

    List<ExtendedCalendarHoliday> listHolidayCreate = new ArrayList<>();
    ExtendedCalendarHoliday createHoliday = new ExtendedCalendarHoliday();
    createHoliday.setName("new Holiday");
    listHolidayCreate.add(createHoliday);
    calendarHolidayDto.setCreateDefaultList(listHolidayCreate);

    ResponseEntity<List<ExtendedCalendarPeriod>> listHolidayPeriodCreateResponse =
        new ResponseEntity<List<ExtendedCalendarPeriod>>(HttpStatus.OK);
    List<ExtendedCalendarPeriod> listHolidayPeriodCreate = new ArrayList<>();
    ExtendedCalendarPeriod createHolidayPeriod = new ExtendedCalendarPeriod();
    createHolidayPeriod.setCode(1);
    listHolidayPeriodCreate.add(createHolidayPeriod);
    calendarHolidayDto.setCreatePeriodList(listHolidayPeriodCreate);

    ResponseEntity<List<CalendarHoliday>> listHolidayUpdateResponse =
        new ResponseEntity<List<CalendarHoliday>>(HttpStatus.OK);
    List<CalendarHoliday> listHolidayUpdate = new ArrayList<>();
    CalendarHoliday updateHoliday = new CalendarHoliday();
    updateHoliday.setDayId(11);
    updateHoliday.setName("update Holiday");
    listHolidayUpdate.add(updateHoliday);
    calendarHolidayDto.setUpdateDefaultList(listHolidayUpdate);

    ResponseEntity<List<CalendarPeriod>> listHolidayPeriodUpdateResponse =
        new ResponseEntity<List<CalendarPeriod>>(HttpStatus.OK);
    List<CalendarPeriod> listHolidayPeriodUpdate = new ArrayList<>();
    CalendarPeriod updateHolidayPeriod = new CalendarPeriod();
    updateHolidayPeriod.setCode(1);
    listHolidayPeriodUpdate.add(updateHolidayPeriod);
    calendarHolidayDto.setUpdatePeriodsList(listHolidayPeriodUpdate);

    ResponseEntity<Boolean> listHolidayDeleteResponse = new ResponseEntity<Boolean>(HttpStatus.OK);
    List<Integer> listHolidayDelete = new ArrayList<>();
    listHolidayDelete.add(1);
    calendarHolidayDto.setDeleteDefaultIds(listHolidayDelete);

    ResponseEntity<Boolean> listHolidayPeriodDeleteResponse =
        new ResponseEntity<Boolean>(HttpStatus.OK);
    List<Integer> listHolidayPeriodDelete = new ArrayList<>();
    listHolidayPeriodDelete.add(1);
    calendarHolidayDto.setDeletePeriodIds(listHolidayPeriodDelete);

    EcbBaseException ecbBaseException = new EcbBaseException();

    when(extendedCalendarHolidayClient
        .createCalendarHolidayBatch(calendarHolidayDto.getCreateDefaultList()))
            .thenThrow(ecbBaseException);

    when(extendedCalendarPeriodClient
        .createCalendarPeriodBatch(calendarHolidayDto.getCreatePeriodList()))
            .thenReturn(listHolidayPeriodCreateResponse);
    when(extendedCalendarHolidayClient
        .updateCalendarHolidayBatch(calendarHolidayDto.getUpdateDefaultList()))
            .thenReturn(listHolidayUpdateResponse);
    when(extendedCalendarPeriodClient
        .updateCalendarPeriodBatch(calendarHolidayDto.getUpdatePeriodsList()))
            .thenReturn(listHolidayPeriodUpdateResponse);
    when(extendedCalendarHolidayClient
        .deleteCalendarHolidayList(calendarHolidayDto.getDeleteDefaultIds()))
            .thenReturn(listHolidayDeleteResponse);
    when(extendedCalendarPeriodClient.deleteCalendarPeriod(calendarHolidayDto.getDeletePeriodIds()))
        .thenReturn(listHolidayPeriodDeleteResponse);
    calendarServiceImpl.calendarHolidaysBatch(calendarHolidayDto, calendarId);
  }


  @Test
  public void shouldDeleteHoliday() throws Exception {
    ResponseEntity<Boolean> flag = new ResponseEntity<Boolean>(true, HttpStatus.OK);
    when(extendedCalendarHolidayClient.deleteCalendarHolidayList(deleteListData()))
        .thenReturn(flag);
    calendarServiceImpl.deleteHoliday(id);
  }

  @Test
  public void shouldDeletePeriod() throws Exception {
    ResponseEntity<Boolean> flag = new ResponseEntity<Boolean>(true, HttpStatus.OK);
    when(extendedCalendarPeriodClient.deleteCalendarPeriod(deleteListData())).thenReturn(flag);
    calendarServiceImpl.deletePeriod(Collections.singleton(id));
  }

  private List<Integer> deleteListData() {
    List<Integer> holidayList = new ArrayList<>();
    holidayList.add(id);
    return holidayList;
  }

  @Test
  public void shouldUpdateCalendar() throws Exception {
    Calendar calendar = new Calendar();
    calendar.setCalendarId(calendarId);
    calendar.setDescription("Sample Description");
    ResponseEntity<Calendar> value = new ResponseEntity<>(calendar, HttpStatus.OK);
    when(calendarClient.updateCalendar(calendar, calendarId)).thenReturn(value);
    when(localizedEntity.localizedUpdateEntity(calendar)).thenReturn(calendar);
    calendarServiceImpl.updateCalendar(calendar, calendarId);
  }

  @Test
  public void shouldGetCalendarCodeMetadata() throws Exception {

    ResponseEntity<MtEnum> responseEntitity =
        new ResponseEntity<>(prepareMockMetaData(), HttpStatus.OK);
    when(metadataConfigClient.getCalendarCodeMetadata()).thenReturn(responseEntitity);
    calendarServiceImpl.getCalendarCodeMetadata();
  }

  private MtEnum prepareMockMetaData() {
    Entry entry = new Entry();
    entry.setValue("0");
    entry.setName("offPeak");
    List<Entry> entryList = new ArrayList<>();
    entryList.add(0, entry);

    Entries entries = new Entries();
    entries.setEntries(entryList);
    List<Entries> entriesList = new ArrayList<>();
    entriesList.add(0, entries);

    Enum enumValue = new Enum();
    enumValue.setEntries(entriesList);
    List<Enum> enumList = new ArrayList<>();
    enumList.add(0, enumValue);

    Enums enums = new Enums();
    enums.setEnums(enumList);
    List<Enums> enumsList = new ArrayList<>();
    enumsList.add(0, enums);

    EnumSpace enumSpace = new EnumSpace();
    enumSpace.setEnums(enumsList);
    List<EnumSpace> enumSpaceList = new ArrayList<>();
    enumSpaceList.add(0, enumSpace);

    EnumSpaces enumSpaces = new EnumSpaces();
    enumSpaces.setEnumSpaces(enumSpaceList);
    List<EnumSpaces> enumSpacesList = new ArrayList<>();
    enumSpacesList.add(0, enumSpaces);

    MtEnum mt = new MtEnum();
    mt.setEnumSpaces(enumSpacesList);

    return mt;
  }
}
