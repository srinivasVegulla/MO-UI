import { Component, OnInit, Input} from '@angular/core';
import { UtilityService } from '../../helpers/utility.service';
import { utilService } from '../../helpers/util.service';
import { CalendarStdHolGenericService } from '../calendar-stdholday.service';
import { CalendarsService } from '../calendars-list.service';
import { TranslationService } from 'angular-l10n';

@Component({
  selector: 'ecb-calendar-standardday',
  templateUrl: '../calendar-stdholday.component.html',
  styleUrls: ['./calendar-standardday.component.scss']
})
export class CalendarStandardDayComponent extends CalendarStdHolGenericService implements  OnInit {
  days: any[] = [];
  localizedWeekDays:  any;
  allDaysOfWeek: any[];
  existWeekDays: any;
  existPeriodIds: any[] = [];
  allViewPeriods: any;
  loadPeriodGridData = false;
  loadDefaultGridData = false;

  @Input() set selectedCalendarId(value) {
    this.calendarId = value;
   }
  constructor(_utilityService: UtilityService,
    _utilService: utilService,
    _service: CalendarsService,
    _translationService: TranslationService) {
      super(_utilityService, _translationService, _service, _utilService);
      this.widgetModel = 'std';
  }
  ngOnInit() {
    this.getDefaultGridConfigData();
    this.getPeriodGridConfigData();
    this.defaultEditCols = ['code'];
    this.periodEditCols = ['weekdays', 'startHr', 'startMin', 'startFormat', 'endHr', 'endMin', 'endFormat'];
    this.initWeekDays();
    this.calendarCode(this.calendarId, (result) => { this.processStandardDays(result); });
  }

  getDefaultGridConfigData() {
    this._utilityService.getextdata({
      data: 'calStandardDaysColumnDef.json',
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
      data: 'calStandardDaysPeriodsColumnDef.json',
      success: (result) => {
        this.calPeriodColDef  = result;
        this.loadPeriodGridData = true;
      },
      failure: (error) => {
        //Error message
        this.loadPeriodGridData = false;
      }
    });
  }

  private initWeekDays() {
    this.localizedWeekDays = {
      'MONDAY': 'TEXT_MONDAY',
      'TUESDAY': 'TEXT_TUESDAY',
      'WEDNESDAY': 'TEXT_WEDNESDAY',
      'THURSDAY': 'TEXT_THURSDAY',
      'FRIDAY': 'TEXT_FRIDAY',
      'SATURDAY': 'TEXT_SATURDAY',
      'SUNDAY': 'TEXT_SUNDAY'
    };
    this.allDaysOfWeek = Object.keys(this.localizedWeekDays);
  }

  private processStandardDays(result) {
    this.existPeriodIds = [];
    const days = this._utilityService.cloneJson(result.calendarDay);
    const periods = [];
    this.calDefViewRecords = this.setDefaultDays(days);
    if (this._utilityService.isEmpty(result.calendarPeriods)) {
      periods.push(this.newPeriod());
    } else {
      result.calendarPeriods.forEach(rows => {
        let daysPeriods = {};
        rows.forEach((period, index) => {
          if (index === 0) {
            this.encodePeriod(period, 'start', period.begin);
            this.encodePeriod(period, 'end', period.end);
            period['weekdays'] = [];
            period['weekDayPeriods'] = [];
            daysPeriods = period;
          }
          daysPeriods['weekdays'].push(this.existWeekDays[period.dayId]);
          daysPeriods['weekDayPeriods'].push(this.existWeekDays[period.dayId] + '-' + period.periodId);
          this.existPeriodIds.push(period.periodId + '');
        });
        periods.push(daysPeriods);
      });
    }
    this.calPeriodViewRecords = periods;
    this.calDefEditRecords = this._utilityService.cloneJson(this.calDefViewRecords);
    this.calPeriodEditRecords = this._utilityService.cloneJson(periods);
    this.allViewPeriods = this.getAllPeriods(periods);
  }

  setDefaultDays(existStandardDays) {
    this.existWeekDays = {};
    const standardDays = [];
    Object.keys(this.localizedWeekDays).forEach(day => {
      let calendarDay = {
       code: 1,
       calendarId: this.calendarId
      };
      for (const std of existStandardDays) {
        if (std.weekday === day) {
          calendarDay = std;
          this.existWeekDays[std.dayId] = day;
        }
      }
      calendarDay['localizedWeekday'] = this.localizedWeekDays[day];
      calendarDay['weekday'] = day;
      standardDays.push(calendarDay);
    });
    return standardDays;
  }
  onModalDialogCloseDeletePeriod(event) {
    this.processDialogCloseDelPeriod(event, (out) => { this.processStandardDays(out); });
  }
  validateDefEditWidget(column) {
  }
  deleteEditDefault(record, defIndex) {
    if (record.holidayId == null) {
      this.removeDefRecordFromView(defIndex);
    }else {
      this.deleteDefault(record, defIndex);
    }
    if (this.calPeriodEditRecords.length === 0) {
      this.addPeriod(0);
    }
    this.OnDefaultTooltipCloseEdit();
  }
  deleteAllPeriods(defaultName) {
    for (const ind in this.calPeriodEditRecords) {
      if (this.calPeriodEditRecords[ind] && this.calPeriodEditRecords[ind].name === defaultName) {
        this.removePeriodRecordFromView(ind);
      }
    }
  }

  isDaySelected(selectedDays, day) {
    return this._utilityService.isObject(selectedDays) && selectedDays.indexOf(day) > -1;
  }

  addRemoveStdPeriods(record, day) {
    if (!this._utilityService.isObject(record.weekdays)) {
      record.weekdays = [];
    }
    const index = record.weekdays.indexOf(day);
    if (index > -1) {
      record.weekdays.splice(index, 1);
    }else {
      record.weekdays.push(day);
    }
    this.validatePeriodEditWidget('filledTime');
  }

  getAllPeriods(pRecords) {
    const records = [];
    pRecords.forEach(record => {
      if (!this._utilityService.isEmpty(record.weekdays)) {
        record.weekdays.forEach(day => {
          const period = this._utilityService.cloneJson(record);
          period.weekday = day;
          period.periodId = null;
          for (const dayId in this.existWeekDays) {
            if (this.existWeekDays[dayId] === day) {
              period.dayId = dayId;
            }
          }
          for (const existDays in record.weekDayPeriods) {
            if (record.weekDayPeriods[existDays].split('-')[0] === day) {
              period.periodId = record.weekDayPeriods[existDays].split('-')[1];
            }
          }
          records.push(period);
        });
      }
    });
    return records;
  }
  getDeletePeriods(newRows) {
    const newPeriods = [];
    newRows.forEach(record => {
      if (!this._utilityService.isEmpty(record.periodId)) {
        newPeriods.push(record.periodId);
      }
    });
    const deltedIds = this._utilityService.arrayDiffelements(newPeriods, this.existPeriodIds);
    return deltedIds;
  }
  processSaveCalRecords() {
    const dRecords = this._utilityService.cloneJson(this.calDefEditRecords);
    const periods = this._utilityService.cloneJson(this.calPeriodEditRecords);
    this.validateDefEditWidget(null);
    if (this.calDefaultError == null) {
      this.validatePeriodEditWidget(null);
    }
    if (this.calPeriodError == null) {
      const pRecords = this.getAllPeriods(periods);
      const calRecords = {
       'createDefaultList': [],
       'updateDefaultList': [],
       'deleteDefaultIds': [],
       'createPeriodList': [],
       'updatePeriodsList': [],
       'deletePeriodIds': this.getDeletePeriods(pRecords)
      };
      const createPeriods = {};
      const excludeDefaults = [];
      /* Process Period Override records */
      if (!this.isEmptyRecord(periods, this.periodEditCols, 'periodId')) {
        pRecords.forEach((pRecord) => {
            if (!this._utilityService.isObject(pRecord['periodId'])) {
              if (!this._utilityService.isObject(createPeriods[pRecord.weekday])) {
                createPeriods[pRecord.weekday] = {
                  'calendarId': this.calendarId,
                  'calendarPeriods': [],
                  'calendarHoliday': {}
                };
              }
              dRecords.forEach((drecord) => {
                if (drecord.weekday === pRecord.weekday) {
                  createPeriods[pRecord.weekday]['code'] = drecord.code;
                  createPeriods[pRecord.weekday]['weekday'] = drecord.weekday;
                  if (this._utilityService.isObject(drecord['dayId'])) {
                    createPeriods[pRecord.weekday]['dayId'] = drecord.dayId;
                  }else {
                    pRecord.dayId = null;
                  }
                  if (excludeDefaults.indexOf(pRecord.weekday) === -1) {
                    excludeDefaults.push(pRecord.weekday);
                  }
                }
              });
              createPeriods[pRecord.weekday]['calendarPeriods'].push(pRecord);
            } else {
              if (this.checkIfAnyUpdate(this.allViewPeriods, pRecord, 'periodId', ['weekdays'])) {
                calRecords['updatePeriodsList'].push(pRecord);
              }
            }
        });
        for (const index in createPeriods) {
          if (createPeriods[index] !== null) {
            calRecords['createPeriodList'].push(createPeriods[index]);
          }
        }
      }
      /* Process Default Records */
      if (!this.isEmptyRecord(dRecords, this.defaultEditCols, 'weekday')) {
        dRecords.forEach((drecord) => {
          if (this._utilityService.isObject(drecord['dayId']) && typeof(drecord.code) === 'string') {
            calRecords['updateDefaultList'].push(drecord);
          }else if (!this._utilityService.isObject(drecord['dayId']) && typeof(drecord.code) === 'string') {
            if (excludeDefaults.indexOf(drecord.weekday) < 0) {
              const cdRecords = drecord;
              cdRecords['calendarDay'] = {'calendarId': this.calendarId};
              calRecords['createDefaultList'].push(cdRecords);
            }
          }
        });
      }
      if (this.calDefaultError == null && this.calPeriodError === null) {
        this.saveCalendarRecords(calRecords, this.calendarId,
        (result) => {
          this.getCalendars(this.calendarId, (output) => { this.processStandardDays(output); });
        });
      }
    }
  }
  saveEnableStatus() {
    return this.checkEnableSaveButton();
  }
}
