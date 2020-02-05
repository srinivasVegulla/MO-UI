package com.ericsson.ecb.ui.metraoffer.serviceimpl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
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
import com.ericsson.ecb.common.constants.EcbExceptionMessage;
import com.ericsson.ecb.common.exception.EcbBaseException;
import com.ericsson.ecb.common.exception.EcbNotFoundException;
import com.ericsson.ecb.metadata.client.MetadataConfigClient;
import com.ericsson.ecb.metadata.model.enumeration.Entry;
import com.ericsson.ecb.ui.metraoffer.common.LocalizedEntityService;
import com.ericsson.ecb.ui.metraoffer.constants.Constants;
import com.ericsson.ecb.ui.metraoffer.constants.PropertyRsqlConstants;
import com.ericsson.ecb.ui.metraoffer.constants.RsqlOperator;
import com.ericsson.ecb.ui.metraoffer.model.CalendarDetails;
import com.ericsson.ecb.ui.metraoffer.model.CalendarHolidayData;
import com.ericsson.ecb.ui.metraoffer.model.CalendarHolidayDto;
import com.ericsson.ecb.ui.metraoffer.model.CalendarInUse;
import com.ericsson.ecb.ui.metraoffer.model.ResponseModel;
import com.ericsson.ecb.ui.metraoffer.model.StandardCalendarDayDtoList;
import com.ericsson.ecb.ui.metraoffer.service.CalendarService;
import com.ericsson.ecb.ui.metraoffer.utils.CommonUtils;

@Service
public class CalendarServiceImpl implements CalendarService {

  @Autowired
  private CalendarClient calendarClient;

  @Autowired
  private ExtendedCalendarClient extendedCalendarClient;

  @Autowired
  private LocalizedEntityService localizedEntityService;

  @Autowired
  private ExtendedCalendarDayClient extendedCalendarDayClient;

  @Autowired
  private MetadataConfigClient metadataConfigClient;

  @Autowired
  private CalendarPeriodClient calendarPeriodClient;

  @Autowired
  private CalendarHolidayClient calendarHolidayClient;

  @Autowired
  private ExtendedCalendarHolidayClient extendedCalendarHolidayClient;

  @Autowired
  private ExtendedCalendarPeriodClient extendedCalendarPeriodClient;

  @Autowired
  private CalendarDayClient calendarDayClient;

  /**
   * Retrieve calendar rows that match the supplied filter
   *
   * @param page the number of the page
   * @param size the number of records per page
   * @param sort the sort direction to use
   * @param query the filter criteria to use
   * @return the page of matching calendars records @
   * @throws EcbBaseException
   */
  @Override
  public PaginatedList<CalendarInUse> findCalendar(Integer page, Integer size, String[] sort,
      String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException {
    PaginatedList<CalendarWithInUse> paginatedRecords = findCalendarWithInUse(page, size, sort,
        query, descriptionLanguage, descriptionFilters, descriptionSort);

    PaginatedList<CalendarInUse> calendarInUseRecords = new PaginatedList<>();
    List<CalendarInUse> calendarInUseList = new ArrayList<>();

    if (CollectionUtils.isNotEmpty(paginatedRecords.getRecords())) {
      for (CalendarWithInUse calendarWithInUse : paginatedRecords.getRecords()) {
        CalendarInUse calendarInUse = new CalendarInUse();
        BeanUtils.copyProperties(calendarWithInUse, calendarInUse);
        calendarInUseList.add(calendarInUse);
      }
    }
    CommonUtils.copyPaginatedList(paginatedRecords, calendarInUseRecords);
    calendarInUseRecords.setRecords(calendarInUseList);
    return localizedEntityService.localizedFindEntity(calendarInUseRecords);
  }

  /**
   * insert Calendar
   *
   * @param calendar the value for API service param
   * @return the matching calendar records @
   * @throws EcbBaseException
   */
  @Override
  public Calendar createCalendar(LocalizedCalendar record) throws EcbBaseException {
    setCalendarDefaults(record);
    localizedEntityService.localizedCreateEntity(record);
    return calendarClient.createCalendar(record).getBody();
  }

  /**
   * delete calendar
   *
   * @param calendarId
   * @return boolean, delete status of specified calendar @
   * @throws EcbBaseException
   */
  @Override
  public Boolean deleteCalendar(Integer calendarId) throws EcbBaseException {
    return extendedCalendarClient.deleteCalendar(calendarId).getBody();
  }

  @Override
  public LocalizedCalendar copyCalendar(LocalizedCalendar record, Integer calendarId)
      throws EcbBaseException {
    setCalendarDefaults(record);
    localizedEntityService.localizedCreateEntity(record);
    return extendedCalendarClient.copyCalendar(record, calendarId).getBody();
  }

  /**
   * Retrieve calendar that matches the supplied identifier
   *
   * @param calendarId the value for API service param
   * @return the matching calendar record
   * @throws EcbBaseException
   * @ @throws MetraOfferException
   */
  @Override
  public CalendarWithInUse getCalendar(Integer calendarId) throws EcbBaseException {
    String query = PropertyRsqlConstants.CALENDAR_ID_EQUAL + calendarId;
    CalendarWithInUse calendarWithInUseData = null;
    List<CalendarWithInUse> calendarWithInUseList =
        (List<CalendarWithInUse>) findCalendarWithInUse(1, Integer.MAX_VALUE, null, query, null,
            null, null).getRecords();
    if (CollectionUtils.isNotEmpty(calendarWithInUseList) && calendarWithInUseList.size() == 1) {
      calendarWithInUseData = calendarWithInUseList.get(0);
      localizedEntityService.localizedGetEntity(calendarWithInUseData);
    } else {
      throw new EcbNotFoundException(EcbExceptionMessage.NOT_FOUND_ERROR);
    }
    return calendarWithInUseData;
  }

  private void setCalendarDefaults(LocalizedCalendar record) {
    record.setTimezoneoffset(Constants.TIME_ZONE_OFFSET);
    record.setCombinedweekend(Constants.COMBINED_WEEKEND);
  }

  /**
   * Saves the Standard Calendar Day Details
   *
   * @param StandardCalendarDayDtoList the value passed from UI.
   * @return the list of response model
   * @throws EcbBaseException
   */
  @Override
  public List<ResponseModel> saveStandardCalendarDayDetails(
      StandardCalendarDayDtoList standardCalendarDayDtoList) throws EcbBaseException {
    List<ResponseModel> responseModelList = new ArrayList<>();
    if (standardCalendarDayDtoList != null) {
      if (CollectionUtils.isNotEmpty(standardCalendarDayDtoList.getDeletePeriodIds()))
        responseModelList.add(perfomStandardDayCrudOperations(
            standardCalendarDayDtoList.getDeletePeriodIds(), Constants.DELETE_DAY_PERIOD));
      if (CollectionUtils.isNotEmpty(standardCalendarDayDtoList.getUpdatePeriodsList()))
        responseModelList.add(perfomStandardDayCrudOperations(
            standardCalendarDayDtoList.getUpdatePeriodsList(), Constants.UPDATE_DAY_PERIOD));
      if (CollectionUtils.isNotEmpty(standardCalendarDayDtoList.getCreatePeriodList()))
        responseModelList.add(perfomStandardDayCrudOperations(
            standardCalendarDayDtoList.getCreatePeriodList(), Constants.CREATE_DAY_PERIOD));
      if (CollectionUtils.isNotEmpty(standardCalendarDayDtoList.getUpdateDefaultList()))
        responseModelList.add(perfomStandardDayCrudOperations(
            standardCalendarDayDtoList.getUpdateDefaultList(), Constants.UPDATE_CALENDAR_DAY));
      if (CollectionUtils.isNotEmpty(standardCalendarDayDtoList.getCreateDefaultList()))
        responseModelList.add(perfomStandardDayCrudOperations(
            standardCalendarDayDtoList.getCreateDefaultList(), Constants.CREATE_CALENDAR_DAY));
    }
    return responseModelList;
  }

  /**
   * This method Perform Create/Update Calendar Day details . And also Create/Update/Delete Time
   * periods for t he corresponding day.
   * 
   * @param standardCalendarDayDtoList
   * @param operationType
   * @return
   * @throws EcbBaseException
   */
  @SuppressWarnings("unchecked")
  private <T> ResponseModel perfomStandardDayCrudOperations(List<T> standardCalendarDayDtoList,
      String operationType) throws EcbBaseException {
    ResponseModel responseModel = new ResponseModel();
    try {
      if (Constants.CREATE_CALENDAR_DAY.equals(operationType))
        extendedCalendarDayClient
            .createCalendarDayBatch((List<CalendarDay>) standardCalendarDayDtoList);

      if (Constants.UPDATE_CALENDAR_DAY.equals(operationType))
        extendedCalendarDayClient
            .updateCalendarDayBatch((List<CalendarDay>) standardCalendarDayDtoList);

      if (Constants.CREATE_DAY_PERIOD.equals(operationType))
        createPeriodBatch((List<ExtendedCalendarPeriod>) standardCalendarDayDtoList);

      if (Constants.UPDATE_DAY_PERIOD.equals(operationType))
        updatePeriodBatch((List<CalendarPeriod>) standardCalendarDayDtoList);

      if (Constants.DELETE_DAY_PERIOD.equals(operationType))
        deletePeriodsList((List<Integer>) standardCalendarDayDtoList);

      responseModel.setCode(200);
    } catch (Exception e) {
      CommonUtils.handleExceptions(e, responseModel);
      responseModel.setMessage(operationType + e.getMessage());
      responseModel.setData(standardCalendarDayDtoList);
    }
    return responseModel;
  }

  @Override
  public PaginatedList<CalendarInUseInfo> findInUsePriceableItems(Integer calendarId, Integer page,
      Integer size, String[] sort, String queryIn, String descriptionLanguage,
      Set<String> descriptionFilters, String descriptionSort) throws EcbBaseException {
    String query;
    String queryCalendarId = PropertyRsqlConstants.CALENDAR_ID_EQUAL + calendarId;
    if (StringUtils.isNotBlank(queryIn)) {
      query = queryIn + RsqlOperator.AND + queryCalendarId;
    } else {
      query = queryCalendarId;
    }
    PaginatedList<CalendarInUseInfo> inUseRecords =
        extendedCalendarClient.findCalendarWithInUseInfo(page, size, sort, query,
            descriptionLanguage, descriptionFilters, descriptionSort).getBody();
    return localizedEntityService.localizedFindEntity(inUseRecords);
  }

  @Override
  public Map<String, String> getCalendarCodeMetadata() throws EcbBaseException {
    Collection<Entry> mtEnum = metadataConfigClient.getCalendarCodeMetadata().getBody()
        .getEnumSpaces().get(0).getEnumSpaces().get(0).getEnums().get(0).getEnums().get(0)
        .getEntries().get(0).getEntries();
    Map<String, String> codeType = new HashMap<>();
    mtEnum.forEach(entry -> codeType.put(entry.getValue(), entry.getName()));
    return codeType;
  }

  @Override
  public CalendarDetails getStandardDayDetails(Integer calendarId) throws EcbBaseException {

    CalendarDetails calendarDays = new CalendarDetails();
    List<CalendarDay> calendarDayList = new ArrayList<>();
    Collection<CalendarDay> calendarDayListTemp =
        findCalendarDay(PropertyRsqlConstants.CALENDAR_ID_EQUAL + calendarId);

    if (CollectionUtils.isNotEmpty(calendarDayListTemp)) {
      Set<Integer> dayIds = getDayIds(calendarDayListTemp);
      String dayIdQuery =
          CommonUtils.getQueryStringFromCollection(dayIds, PropertyRsqlConstants.DAY_ID_IN);
      Collection<CalendarPeriod> calendarPeriodsList = findCalendarPeriod(dayIdQuery);

      calendarDayListTemp.forEach(calendarDay -> {
        if (calendarDay.getWeekday() != null
            && !calendarDay.getWeekday().equals(CalendarWeekday.DEFAULT_WEEKDAY)
            && !calendarDay.getWeekday().equals(CalendarWeekday.DEFAULT_WEEKEND)) {
          calendarDayList.add(calendarDay);
        }
      });
      if (CollectionUtils.isNotEmpty(calendarPeriodsList)) {

        Function<CalendarPeriod, List<Object>> beginEndAndCode =
            calendarPeriod -> Arrays.<Object>asList(calendarPeriod.getBegin(),
                calendarPeriod.getEnd(), calendarPeriod.getCode());

        Map<Object, List<CalendarPeriod>> map = calendarPeriodsList.stream()
            .collect(Collectors.groupingBy(beginEndAndCode, Collectors.toList()));

        List<List<CalendarPeriod>> periods = new ArrayList<>(map.entrySet().size());
        for (Map.Entry<Object, List<CalendarPeriod>> period : map.entrySet()) {
          periods.add(period.getValue());
        }
        calendarDays.getCalendarPeriods().addAll(periods);
      }
      calendarDays.getCalendarDay().addAll(calendarDayList);
    }
    calendarDays.setCalendarId(calendarId);
    return calendarDays;
  }

  @Override
  public CalendarDetails getHolidayDetails(Integer calendarId) throws EcbBaseException {

    CalendarDetails calendarDays = new CalendarDetails();
    Collection<CalendarDay> calendarDayListTemp =
        findCalendarDay(PropertyRsqlConstants.CALENDAR_ID_EQUAL + calendarId);

    if (CollectionUtils.isNotEmpty(calendarDayListTemp)) {

      Set<Integer> holidayDayIds = getHolidayIds(calendarDayListTemp);
      if (CollectionUtils.isNotEmpty(holidayDayIds)) {
        String holidayDayIdQuery = CommonUtils.getQueryStringFromCollection(holidayDayIds,
            PropertyRsqlConstants.DAY_ID_IN);

        Collection<CalendarHoliday> calendarHolidayLists = findCalendarHoliday(holidayDayIdQuery);

        List<CalendarHolidayData> calendarHolidayDataList =
            new ArrayList<>(calendarHolidayLists.size());
        for (CalendarHoliday calendarHoliday : calendarHolidayLists) {
          CalendarHolidayData calendarHolidayData = new CalendarHolidayData();
          BeanUtils.copyProperties(calendarHoliday, calendarHolidayData);
          calendarHolidayDataList.add(calendarHolidayData);
        }

        Collection<CalendarPeriod> calendarHolidayPeriodsList =
            findCalendarPeriod(holidayDayIdQuery);

        if (CollectionUtils.isNotEmpty(calendarHolidayPeriodsList)) {

          Map<Integer, Long> periodsMap = calendarHolidayPeriodsList.stream()
              .collect(Collectors.groupingBy(CalendarPeriod::getDayId, Collectors.counting()));

          for (CalendarHolidayData calendarHolidayData : calendarHolidayDataList) {
            Long periodCount = periodsMap.get(calendarHolidayData.getDayId());
            if (periodCount != null) {
              calendarHolidayData.setPeriodCount(periodCount);
            }
          }
          calendarDays.getCalendarHolidayPeriods().addAll(calendarHolidayPeriodsList);
        }
        calendarDays.getCalendarHoliday().addAll(calendarHolidayDataList);
      }
    }
    calendarDays.setCalendarId(calendarId);
    return calendarDays;
  }

  private Collection<CalendarPeriod> findCalendarPeriod(String query) throws EcbBaseException {
    Collection<CalendarPeriod> record = new ArrayList<>();
    if (StringUtils.isNotBlank(query)) {
      String[] sortArray = new String[1];
      sortArray[0] = "begin|asc";
      record = calendarPeriodClient.findCalendarPeriod(1, Integer.MAX_VALUE, sortArray, query)
          .getBody().getRecords();
    }
    return record;
  }

  private Set<Integer> getHolidayIds(Collection<CalendarDay> calendarDayList) {
    Set<Integer> holidayDayIds = new HashSet<>();
    calendarDayList.forEach(calendarDay -> {
      if (calendarDay.getWeekday() == null) {
        holidayDayIds.add(calendarDay.getDayId());
      }
    });
    return holidayDayIds;
  }

  private Set<Integer> getDayIds(Collection<CalendarDay> calendarDayList) {
    Set<Integer> dayIds = new HashSet<>();
    calendarDayList.forEach(calendarDay -> {
      if (calendarDay.getWeekday() != null) {
        dayIds.add(calendarDay.getDayId());
      }
    });
    return dayIds;
  }

  private Collection<CalendarDay> findCalendarDay(String query) throws EcbBaseException {
    return calendarDayClient.findCalendarDay(1, Integer.MAX_VALUE, null, query).getBody()
        .getRecords();
  }

  private Collection<CalendarHoliday> findCalendarHoliday(String query) throws EcbBaseException {
    Collection<CalendarHoliday> record = new ArrayList<>();
    if (StringUtils.isNotBlank(query)) {
      record = calendarHolidayClient.findCalendarHoliday(1, Integer.MAX_VALUE, null, query)
          .getBody().getRecords();
    }
    return record;
  }

  @Override
  public List<ResponseModel> calendarHolidaysBatch(CalendarHolidayDto records, Integer calendarId)
      throws EcbBaseException {

    List<ResponseModel> responseModelList = new ArrayList<>();

    List<CalendarPeriod> updateHolidayPeriodList = records.getUpdatePeriodsList();
    List<Integer> deleteHolidayList = records.getDeleteDefaultIds();
    List<Integer> deleteHolidayPeriodList = records.getDeletePeriodIds();

    ResponseModel responseModel;

    if (CollectionUtils.isNotEmpty(deleteHolidayPeriodList)) {
      responseModel =
          getHolidaysList(calendarId, deleteHolidayPeriodList, Constants.DELETE_HOLIDAY_PERIOD);
      responseModelList.add(responseModel);
    }
    if (CollectionUtils.isNotEmpty(deleteHolidayList)) {
      responseModel = getHolidaysList(calendarId, deleteHolidayList, Constants.DELETE_HOLIDAY);
      responseModelList.add(responseModel);
    }
    if (CollectionUtils.isNotEmpty(updateHolidayPeriodList)) {
      responseModel =
          getHolidaysList(calendarId, updateHolidayPeriodList, Constants.UPDATE_HOLIDAY_PERIOD);
      responseModelList.add(responseModel);
    }
    List<CalendarHoliday> updateHolidayList = records.getUpdateDefaultList();
    if (CollectionUtils.isNotEmpty(updateHolidayList)) {
      responseModel = getHolidaysList(calendarId, updateHolidayList, Constants.UPDATE_HOLIDAY);
      responseModelList.add(responseModel);
    }
    List<ExtendedCalendarPeriod> createHolidayPeriodsList = records.getCreatePeriodList();
    if (CollectionUtils.isNotEmpty(createHolidayPeriodsList)) {
      responseModel =
          getHolidaysList(calendarId, createHolidayPeriodsList, Constants.CREATE_HOLIDAY_PERIOD);
      responseModelList.add(responseModel);
    }
    List<ExtendedCalendarHoliday> createHolidayList = records.getCreateDefaultList();
    if (CollectionUtils.isNotEmpty(createHolidayList)) {
      responseModel = getHolidaysList(calendarId, createHolidayList, Constants.CREATE_HOLIDAY);
      responseModelList.add(responseModel);
    }

    return responseModelList;
  }

  private List<ExtendedCalendarHoliday> createHolidayBatch(
      List<ExtendedCalendarHoliday> createHolidayList) throws EcbBaseException {
    return extendedCalendarHolidayClient.createCalendarHolidayBatch(createHolidayList).getBody();
  }

  private List<ExtendedCalendarPeriod> createPeriodBatch(
      List<ExtendedCalendarPeriod> createHolidayPeriodsList) throws EcbBaseException {
    return extendedCalendarPeriodClient.createCalendarPeriodBatch(createHolidayPeriodsList)
        .getBody();
  }

  private List<CalendarHoliday> updateHolidayBatch(List<CalendarHoliday> editHolidayList)
      throws EcbBaseException {
    return extendedCalendarHolidayClient.updateCalendarHolidayBatch(editHolidayList).getBody();
  }

  private List<CalendarPeriod> updatePeriodBatch(List<CalendarPeriod> updateHolidayPeriodList)
      throws EcbBaseException {
    return extendedCalendarPeriodClient.updateCalendarPeriodBatch(updateHolidayPeriodList)
        .getBody();
  }

  private Boolean deleteHolidayList(List<Integer> deleteHolidayIds) throws EcbBaseException {
    return extendedCalendarHolidayClient.deleteCalendarHolidayList(deleteHolidayIds).getBody();
  }

  @SuppressWarnings("unchecked")
  private ResponseModel getHolidaysList(Integer calendarId, List<?> holidaysList, String operation)
      throws EcbBaseException {
    Object result = new Object();
    ResponseModel responseModel = new ResponseModel();
    if (CollectionUtils.isNotEmpty(holidaysList)) {
      responseModel.setMessage(calendarId + "");
      try {
        if (Constants.CREATE_HOLIDAY.equals(operation)) {
          result = createHolidayBatch((List<ExtendedCalendarHoliday>) holidaysList);
        } else if (Constants.UPDATE_HOLIDAY.equals(operation)) {
          result = updateHolidayBatch((List<CalendarHoliday>) holidaysList);
        } else if (Constants.UPDATE_HOLIDAY_PERIOD.equals(operation)) {
          result = updatePeriodBatch((List<CalendarPeriod>) holidaysList);
        } else if (Constants.DELETE_HOLIDAY.equals(operation)) {
          result = deleteHolidayList((List<Integer>) holidaysList);
        } else if (Constants.DELETE_HOLIDAY_PERIOD.equals(operation)) {
          result = deletePeriodsList((List<Integer>) holidaysList);
        } else if (Constants.CREATE_HOLIDAY_PERIOD.equals(operation)) {
          result = createPeriodBatch((List<ExtendedCalendarPeriod>) holidaysList);
        }
        responseModel.setCode(200);
        responseModel.setData(operation + result);
      } catch (HttpClientErrorException e) {
        responseModel.setCode(e.getRawStatusCode());
        responseModel.setData(operation + e.getStatusText());
      } catch (Exception e) {
        CommonUtils.handleExceptions(e, responseModel);
        responseModel.setData(operation + e.getMessage());
      }
    }
    return responseModel;
  }

  /**
   * delete Holiday
   *
   * @param holidayId
   * @return boolean, delete status of specified holiday @
   * @throws EcbBaseException
   */
  @Override
  public Boolean deleteHoliday(Integer holidayId) throws EcbBaseException {
    List<Integer> holidayList = new ArrayList<>();
    holidayList.add(holidayId);
    return deleteHolidayList(holidayList);
  }

  /**
   * delete Period
   *
   * @param periodId
   * @return boolean, delete status of specified period @
   * @throws EcbBaseException
   */
  @Override
  public Boolean deletePeriod(Set<Integer> periodId) throws EcbBaseException {
    List<Integer> periodList = new ArrayList<>(periodId.size());
    periodList.addAll(periodId);
    return deletePeriodsList(periodList);
  }

  private Boolean deletePeriodsList(List<Integer> deletePeriodIds) throws EcbBaseException {
    return extendedCalendarPeriodClient.deleteCalendarPeriod(deletePeriodIds).getBody();
  }

  @Override
  public ResponseEntity<Calendar> updateCalendar(Calendar record, Integer calendarId)
      throws EcbBaseException {
    ResponseEntity<Calendar> calendar = calendarClient.updateCalendar(record, calendarId);
    localizedEntityService.localizedUpdateEntity(calendar.getBody());
    return calendar;
  }

  private PaginatedList<CalendarWithInUse> findCalendarWithInUse(Integer page, Integer size,
      String[] sort, String query, String descriptionLanguage, Set<String> descriptionFilters,
      String descriptionSort) throws EcbBaseException {
    return extendedCalendarClient.extendedFindCalendar(page, size, sort, query, descriptionLanguage,
        descriptionFilters, descriptionSort).getBody();
  }
}
