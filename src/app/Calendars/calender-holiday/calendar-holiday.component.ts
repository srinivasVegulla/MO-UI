import { Component, OnInit, Input} from '@angular/core';
import { UtilityService } from '../../helpers/utility.service';
import { utilService } from '../../helpers/util.service';
import { CalendarStdHolGenericService } from '../calendar-stdholday.service';
import { CalendarsService } from '../calendars-list.service';
import { TranslationService, LocaleService } from 'angular-l10n';
import { calenderLocaleFeilds } from '../../../assets/calenderLocalization';
import { DateFormatPipe } from 'angular2-moment';

@Component({
  selector: 'ecb-calendar-holiday',
  templateUrl: '../calendar-stdholday.component.html',
  styleUrls: ['./calendar-holiday.component.scss'],
  providers: [DateFormatPipe]
})
export class CalendarHolidayComponent extends CalendarStdHolGenericService implements  OnInit {
  currentLocale: any;
  calendarLocale: any;
  amLocaleDateFormat: any;
  days: any[] = [];
  holidayNames: any;
  loadPeriodGridData = false;
  loadDefaultGridData = false;

  @Input() set selectedCalendarId(value) {
    this.calendarId = value;
   }
  constructor(_utilityService: UtilityService,
    _utilService: utilService,
    _service: CalendarsService,
    _translationService: TranslationService,
    private readonly  _locale: LocaleService,
    private readonly  _dateformat: DateFormatPipe) {
      super(_utilityService, _translationService, _service, _utilService);
      this.widgetModel = 'hol';
  }
  ngOnInit() {
    this.getDefaultGridConfigData();
    this.getPeriodGridConfigData();
    this.currentLocale = this._locale.getCurrentLocale();
    this.calendarLocale = calenderLocaleFeilds[this.currentLocale];
    this.amLocaleDateFormat = this.calendarLocale.amLocaleDateFormat;
    this.defaultEditCols = ['name', 'holidayLocaleDate'];
    this.periodEditCols = ['name', 'startHr', 'startMin', 'startFormat', 'endHr', 'endMin', 'endFormat'];
    this.calendarCode(this.calendarId, (result) => { this.processHolidays(result); });
  }

  getDefaultGridConfigData() {
    this._utilityService.getextdata({
      data: 'calHolidaysColumnDef.json',
      success: (result) => {
        this.calDefaultColDef  = result;
        this.loadDefaultGridData = true;
      },
      failure: (error) => {
        //Error message
        this.loadDefaultGridData = false;
      }
    });
  }

  getPeriodGridConfigData() {
    this._utilityService.getextdata({
      data: 'calHolidaysPeriodsColumnDef.json',
      success: (result) => {
        this.calPeriodColDef  = result;
        this.loadPeriodGridData = true;
      },
      failure: (error) => {
        //Error Message
        this.loadPeriodGridData = false;
      }
    });
  }

  private processHolidays(result) {
    const holidayList = {};
    const days = this._utilityService.cloneJson(result.calendarHoliday);
    const periods = this._utilityService.cloneJson(result.calendarHolidayPeriods);
    if (this._utilityService.isEmpty(periods)) {
      periods.push(this.newPeriod());
    }
    if (this._utilityService.isEmpty(days)) {
      days.push(this.newHoliday());
    }else {
      for (const index in days) {
        if (days[index] !== null) {
          const holiday = days[index];
          const localeDate = this._dateformat.transform(new Date(holiday.year, holiday.month - 1, holiday.day), this.amLocaleDateFormat);
          days[index]['day'] = holiday.day;
          days[index]['month'] = holiday.month;
          days[index]['year'] = holiday.year;
          days[index]['holidayLocaleDate'] = localeDate;
          holidayList[holiday.dayId] = holiday.name;
        }
      }
      if (!this._utilityService.isEmpty(result.calendarHolidayPeriods)) {
        periods.forEach(period => {
          period['name'] = holidayList[period.dayId];
          this.encodePeriod(period, 'start', period.begin);
          this.encodePeriod(period, 'end', period.end);
        });
      }
    }
    this.calDefViewRecords = days;
    this.calPeriodViewRecords = periods;
    this.calDefEditRecords = this._utilityService.cloneJson(days);
    this.calPeriodEditRecords = this._utilityService.cloneJson(periods);
    this.setHolidayNames();
  }

  newHoliday() {
    return {
      'holidayId': null,
      'holidayLocaleDate': null
    };
  }
  onModalDialogCloseDeletePeriod(event) {
    this.processDialogCloseDelPeriod(event, (out) => { this.processHolidays(out); });
  }
  onModalDialogCloseDeleteDefault(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      if (this.showCover) {
        this.calDefEditRecords.forEach((item, index) => {
          if (this.delSelectedDefaultRecord['holidayId'] === item.holidayId) {
            this.deletePeriodRecordsFromView(index);
            this.removeDefRecordFromView(index);
          }
          this.setHolidayNames();
        });
      }else {
        this.deleteDefRecord(this.delSelectedDefaultRecord['holidayId'], this.delSelectedDefaultRecordIndex,
        (result) => {
          this.getCalendars(this.calendarId, (output) => { this.processHolidays(output); });
        });
      }
    }
  }

  addDefFromView(editCalendarPanel, data, position) {
    this.displayCoverHandler(editCalendarPanel);
    if (data.holidayId !== null) {
      this.addHoliday(position);
    }
  }
  addHoliday(position) {
    this.addDefRecord(position, this.newHoliday());
  }
  setHolidayNames() {
    const holidays = [];
    holidays.push({'label': '', 'value': ''});
    (this.calDefEditRecords).forEach(record => {
      if (!this._utilityService.isEmpty(record['name'])&& !this.checkUniqueHoliday(holidays,record.name)) {
        holidays.push({'label': record.name, 'value': record.name});
      }
    });
    this.holidayNames = holidays;
  }
  assignLocaleDate(index) {
    const selectedDate = this.calDefEditRecords[index]['holidayLocaleDate'];
    const localeDate = this._dateformat.transform(selectedDate, this.amLocaleDateFormat);
    this.calDefEditRecords[index]['day'] = selectedDate.getDate();
    this.calDefEditRecords[index]['month'] = selectedDate.getMonth() + 1;
    this.calDefEditRecords[index]['year'] = selectedDate.getFullYear();
    this.calDefEditRecords[index]['holidayLocaleDate'] = localeDate;
    this.validateDefEditWidget('holidayLocaleDate');
  }

  processSaveCalRecords() {
    const dRecords = this._utilityService.cloneJson(this.calDefEditRecords);
    const pRecords = this._utilityService.cloneJson(this.calPeriodEditRecords);
    this.validateDefEditWidget(null);
    if (this.calDefaultError == null) {
      this.validatePeriodEditWidget(null);
    }
    if (this.calPeriodError == null) {
      const deleteDayIds = this.getDeleteIds(this.calDefViewRecords, dRecords, 'dayId', null);
      const holiday = {
       'createDefaultList': [],
       'updateDefaultList': [],
       'deleteDefaultIds': this.getDeleteIds(this.calDefViewRecords, dRecords, 'holidayId', null),
       'createPeriodList': [],
       'updatePeriodsList': [],
       'deletePeriodIds': this.getDeleteIds(this.calPeriodViewRecords, pRecords, 'periodId', deleteDayIds)
      };
      const createPeriods = {};
      const excludeNewHolidays = [];
      /* Process Period Override records */
      if (!this.isEmptyRecord(pRecords, this.periodEditCols, 'periodId')) {
        pRecords.forEach((pRecord) => {
            if (!this._utilityService.isObject(pRecord['periodId'])) {
              if (!this._utilityService.isObject(createPeriods[pRecord.name])) {
                createPeriods[pRecord.name] = {
                  'calendarId': this.calendarId,
                  'calendarPeriods': [],
                  'calendarHoliday': {}
                };
              }
              dRecords.forEach((drecord) => {
                if (drecord.name === pRecord.name && !this._utilityService.isObject(drecord['holidayId'])) {
                  createPeriods[pRecord.name]['calendarHoliday'] = drecord;
                  if (excludeNewHolidays.indexOf(pRecord.name) === -1) {
                    excludeNewHolidays.push(pRecord.name);
                  }
                }
              });
              dRecords.forEach((drecord) => {
                if (drecord.name === pRecord.name) {
                  pRecord['dayId'] = drecord.dayId;
                  createPeriods[pRecord.name]['dayId'] = drecord.dayId;
                }
              });
              createPeriods[pRecord.name]['calendarPeriods'].push(pRecord);
            } else {
              if (this.checkIfAnyUpdate(this.calPeriodViewRecords, pRecord, 'periodId', null)) {
                holiday['updatePeriodsList'].push(pRecord);
              }
            }
        });
        for (const index in createPeriods) {
          if (createPeriods[index] !== null) {
            holiday['createPeriodList'].push(createPeriods[index]);
          }
        }
      }
      /* Process Default Records */
      if (!this.isEmptyRecord(dRecords, this.defaultEditCols, 'holidayId')) {
        dRecords.forEach((drecord) => {
          if (!this._utilityService.isObject(drecord['holidayId'])) {
            if (excludeNewHolidays.indexOf(drecord.name) < 0) {
              const cdRecords = drecord;
              cdRecords['calendarDay'] = {'calendarId': this.calendarId};
              holiday['createDefaultList'].push(cdRecords);
            }
          }else {
            if (this.checkIfAnyUpdate(this.calDefViewRecords, drecord, 'holidayId', null)) {
              holiday['updateDefaultList'].push(drecord);
            }
          }
        });
      }
      if (this.calDefaultError == null && this.calPeriodError === null) {
        this.saveCalendarRecords(holiday, this.calendarId,
        (result) => {
          this.getCalendars(this.calendarId, (output) => { this.processHolidays(output); });
        });
      }
    }
  }

  validateDefEditWidget(column) {
    const dRecords = this.calDefEditRecords;
    this.calDefaultError = null;
    this.defaultTooltipIndex = null;
    if (!this.isEmptyRecord(dRecords, this.defaultEditCols, 'holidayId')) {
      for (const index in dRecords) {
        if (dRecords[index] != null) {
          if (column == null || (column !== null && column === 'name')) {
            if (this._utilityService.isEmpty(dRecords[index]['name']) && this.calDefaultError === null) {
              this.calDefaultError = 'TEXT_HOLIDAY_NAME_NOT_EMPTY';
              this.calDefaultErrorCol = 'name';
            } else if (this.checkUniqueHoliday(this.holidayNames, dRecords[index]['name'])) {
              this.calDefaultError = 'TEXT_HOLIDAY_NAME_NOT_UNIQUE';
              this.calDefaultErrorCol = 'name';
            }
          }
          if (dRecords[index]['holidayLocaleDate'] === null && this.calDefaultError === null
            && (column == null || (column !== null && column === 'holidayLocaleDate'))) {
            this.calDefaultError = 'TEXT_HOLIDAY_DATE_NOT_BLANK';
            this.calDefaultErrorCol = 'holidayLocaleDate';
          }
          if (this.calDefaultError !== null) {
            this.calDefEditRecords[index]['error'] = true;
            this.defaultTooltipIndex = parseInt(index + '', 10);
            break;
          }else {
            this.OnDefaultTooltipCloseEdit();
          }
        }
      }
    }
  }
  
  checkUniqueHoliday(holidays, holiday) {
    let existCount = 0;
    for (const index in holidays){
      if (holidays[index].value != null) {
        if ((holidays[index].value).toUpperCase() === holiday.trim().toUpperCase()) {
          existCount += 1;
        }
      }
    }
    return existCount === 2 ;
  }

  deleteEditDefault(record, defIndex) {
    if (record.holidayId == null) {
      this.deletePeriodRecordsFromView(defIndex);
      this.removeDefRecordFromView(defIndex);
    }else {
      this.deleteDefault(record, defIndex);
    }
    if (this.calPeriodEditRecords.length === 0) {
      this.addPeriod(0);
    }
    this.OnDefaultTooltipCloseEdit();
    this.setHolidayNames();
  }

  deletePeriodRecordsFromView(defIndex) {
    const noOfTimePeriods = this.getPeriodRecordCountOfHolidays(this.calDefEditRecords[defIndex].name);
    for (let indx = 0; indx < noOfTimePeriods; indx++) {
      this.deleteAllPeriods(this.calDefEditRecords[defIndex].name);
    }
    if (this.calPeriodEditRecords.length === 0) {
      this.addPeriod(0);
    }
  }

  getPeriodRecordCountOfHolidays(defaultName) {
    let noOfTimePeriods = 0;
    for (const ind in this.calPeriodEditRecords) {
      if (this.calPeriodEditRecords[ind] && this.calPeriodEditRecords[ind].name === defaultName) {
        noOfTimePeriods++;
      }
    }
    return noOfTimePeriods;
  }

  deleteAllPeriods(defaultName) {
    for (const ind in this.calPeriodEditRecords) {
      if (this.calPeriodEditRecords[ind] && this.calPeriodEditRecords[ind].name === defaultName) {
        this.removePeriodRecordFromView(ind);
      }
    }
  }
  validatePostAssignCalDate() {
    setTimeout(() => {
      this.validateDefEditWidget('holidayLocaleDate');
    }, 500);
  }
  processPeriodNameChange() {
    const names = {};
    this.calDefViewRecords.forEach(record => {
        names[record.name] = record.dayId;
    });
    this.calPeriodEditRecords.forEach(record => {
      if (this._utilityService.isObject(names[record.name])) {
        record.dayId = names[record.name];
      }
    });
    this.validatePeriodEditWidget('filledTime');
  }
  showOverrideTimePeriod() {
    const dRecords = this.calDefEditRecords;
    if (dRecords === undefined || dRecords.length === 0) {
      return false;
    }else if (dRecords.length === 1 && 
      !this._utilityService.isObject(dRecords[0]['holidayId'])) {
        return this._utilityService.isEmpty(dRecords[0]['name']) ||
        this._utilityService.isEmpty(dRecords[0]['holidayLocaleDate']) ? false : true;
    } else {
      return true;
    }
  }
  saveEnableStatus() {
    if (this.calDefEditRecords) {
      const dRecords = this._utilityService.cloneJson(this.calDefEditRecords);
      const deleteDefaultIds = this.getDeleteIds(this.calDefViewRecords, dRecords, 'holidayId', null);
      if (deleteDefaultIds.length > 0) {
        return true;
      } else if (dRecords.length === 1 &&
        !this._utilityService.isObject(dRecords[0]['holidayId']) &&
        !this.showOverrideTimePeriod()) {
        return false;
      } else {
        return this.checkEnableSaveButton();
      }
    }
  }
  isTranslateText(value){
   return this._utilityService.isStaticString(value);
  }
}
