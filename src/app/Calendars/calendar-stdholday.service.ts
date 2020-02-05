import { Injectable, Output, EventEmitter, HostListener } from '@angular/core';
import { UtilityService } from '../helpers/utility.service';
import { TranslationService } from 'angular-l10n';
import { CalendarsService } from './calendars-list.service';
import { utilService } from '../helpers/util.service';
import { SelectItem} from 'primeng/primeng';
import { S_IFCHR } from 'constants';

@Injectable()
export class CalendarStdHolGenericService{
  widgetModel: any;
  calendarId: number;
  addTooltip: any;
  deleteTooltip: any;
  editTooltip: any;
  calDefViewRecords: any;
  calDefaultLoading: boolean;
  calFetchError: string;
  calDefaultColDef: any;
  calPeriodColDef: any;
  calPeriodViewRecords: any;
  calCodes: any[];
  calDefaultError: string = null;
  calPeriodError: string = null;
  calDefaultErrorCol: string = null;
  calPeriodErrorCol: string = null;
  confirmDialog: number;
  delSelectedDefaultRecord: any;
  delSelectedDefaultRecordIndex: number;
  delSelectedPeriodRecord: any;
  delSelectedPeriodRecordIndex: number;
  defaultTooltipIndex: number;
  periodTooltipIndex: number;
  editCalendarPanel: any;
  showCover: boolean;
  calDefEditRecords: any;
  calPeriodEditRecords: any;
  saveCalendarError: any;
  calendarSaving: boolean;
  timeFormat: any[] = [{'label': '', 'value': null}, {'label': 'AM', 'value': 'AM'}, {'label': 'PM', 'value': 'PM'}];
  defaultEditCols: any[];
  periodEditCols: any[];
  calCodesDropDown: SelectItem[];
  @Output() isEdited = new EventEmitter<any>();
  @Output() isGetWidgetType = new EventEmitter();
  showErrorMessage: boolean;

  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === 27 && this._utilityService.isObject(this.editCalendarPanel)) {
      if (this.confirmDialog === 0 && this.editCalendarPanel.visibleStatus) {
          this.cancelCoverHandler();
      } else {
        this.confirmDialog = 0;
      }
    } else {
      this.confirmDialog = 0;
    }
  }
  constructor(protected _utilityService: UtilityService,
    protected _translationService: TranslationService,
    protected _service: CalendarsService,
    protected _utilService: utilService) {
    this.addTooltip = this._translationService.translate('TEXT_ADD');
    this.deleteTooltip = this._translationService.translate('TEXT_DELETE');
    this.editTooltip = this._translationService.translate('TEXT_EDIT');
    this.reset();
  }

  public reset() {
    this.calFetchError = null;
    this.calDefViewRecords = [];
    this.calPeriodViewRecords = [];
    this.calCodes = [];
    this.calDefaultLoading = false;
    this.confirmDialog = 0;
    this.showCover = false;
    this.saveCalendarError = null;
    this.calendarSaving = false;
    this.delSelectedDefaultRecord = {};
    this.isEdited.emit(false);
    this.showErrorMessage = false;
  }

  encodePeriod(holidayPeriod, prefix, time) {
    const secondtoHr = (time / 60) / 60;
    const second = secondtoHr >= 12 ? time - (12 * 60 * 60) : time;
    const hr = (second / 60) / 60;
    const roundHr = parseInt(hr + '', 10);
    const twoDigitHour = this._utilityService.toFixedNoDigit(roundHr, 2);
    holidayPeriod[prefix + 'Hr'] = parseInt(twoDigitHour + '', 10) === 0 ? 12 : twoDigitHour;
    holidayPeriod[prefix + 'Min'] = this._utilityService.toFixedNoDigit(parseInt(((second - (roundHr * 3600)) / 60) + '', 10), 2);
    holidayPeriod[prefix + 'Format'] = secondtoHr >= 12 && secondtoHr !== 24 ? 'PM' : 'AM';
  }

  decodePeriod(holidayPeriod, prefix) {
    let hour = parseInt(holidayPeriod[prefix + 'Hr'], 10);
    const min = parseInt(holidayPeriod[prefix + 'Min'], 10);
    if (holidayPeriod[prefix + 'Format'] === 'PM' && hour !== 12) {
      hour = hour + 12;
    }else if (holidayPeriod[prefix + 'Format'] === 'AM' && hour === 12 && min === 0 && prefix === 'end') {
      hour = 24;
    }else if (holidayPeriod[prefix + 'Format'] === 'AM' && hour === 12) {
      hour = 0;
    }
    holidayPeriod[prefix === 'start' ? 'begin' : 'end'] = (hour * 60 * 60) + (min * 60);
  }

  protected getCalendars(calendarId: number, callback: Function) {
    this.calDefaultError = null;
    this.calPeriodError = null;
    this.calFetchError = null;
    this._service[this.widgetModel === 'hol' ? 'getHolidays' : 'getStandardDays']({
      data: {
        calendarId
      },
      success: (result) => {
        callback(result);
      },
      failure: (errorMsg: string, code: any) => {
        this.getCalenderFetchError(code, errorMsg);
      },
      onComplete: () => {
          this.calDefaultLoading = false;
      }
    });
  }
  protected calendarCode(calendarId: number, callback: Function) {
    this.calDefaultLoading = true;
    this.calFetchError = null;
    this._service.calendarCode({
        success: (result) => {
          this.calCodes = result;
          this.prepareCalCodeDropDown();
            this.getCalendars(calendarId, callback);
        },
        failure: (errorMsg: string, code: any) => {
          this.getCalenderFetchError(code, errorMsg);
      },
        onComplete: () => {
            this.calDefaultLoading = false;
        }
    });
  }
  protected prepareCalCodeDropDown() {
    this.calCodesDropDown = [];
    Object.keys(this.calCodes).forEach(key => {
      this.calCodesDropDown.push({label: this.calCodes[key], value: key});
    });
  }

  getRowClass(data): string {
    return data.error && data.pauseErrorCheck !== 1 ? 'errorDeleteRow' : 'ecb-noErrorRow';
  }

  clearHighlight(records) {
    records.forEach(record => {
      record.error = false;
      record.pauseErrorCheck = 0;
    });
  }

  private getCalendarBar(code) {
    return 'ecb-calendarBar ecb-calendarBar' + code;
  }

  private getCalendarBg(code) {
    return 'ecb-calDImage ecb-calDImage' + code;
  }

  removeDefRecordFromView(index) {
    const tableData = JSON.parse(JSON.stringify(this.calDefEditRecords));
    tableData.splice(index, 1);
    this.calDefEditRecords = tableData;
  }
  removePeriodRecordFromView(index) {
    const tableData = JSON.parse(JSON.stringify(this.calPeriodEditRecords));
    tableData.splice(index, 1);
    this.calPeriodEditRecords = tableData;
  }

  deleteDefault(record, index) {
    this.OnDefaultTooltipCloseView();
    if (record.holidayId == null) {
      this.removeDefRecordFromView(index);
      return;
    }
    this.delSelectedDefaultRecord = record;
    this.delSelectedDefaultRecordIndex = index;
    this.confirmDialog = 1;
  }

  deletePeriod(record, index) {
    this.OnPeriodTooltipCloseView();
    this.OnPeriodTooltipCloseEdit();
    if (record.periodId == null) {
      this.removePeriodRecordFromView(index);
      return;
    }
    this.delSelectedPeriodRecord = record;
    this.delSelectedPeriodRecordIndex = index;
    this.confirmDialog = 2;
  }

  OnDefaultTooltipCloseView() {
    this.calDefaultError = null;
    this.clearHighlight(this.calDefViewRecords);
  }

  OnPeriodTooltipCloseView() {
    this.calPeriodError = null;
    this.clearHighlight(this.calPeriodViewRecords);
  }

  OnDefaultTooltipCloseEdit() {
    this.calDefaultError = null;
    this.clearHighlight(this.calDefEditRecords);
  }

  OnPeriodTooltipCloseEdit() {
    this.calPeriodError = null;
    this.clearHighlight(this.calPeriodEditRecords);
  }

  deleteDefRecord(calendarId, index, success) {
    this.defaultTooltipIndex = index;
    this._service.deleteHoliday({
      data: {
        calendarId
      },
      success: (result) => {
        success();
        this.isGetWidgetType.emit(this.widgetModel);
      },
      failure: (errorMsg: string, code: any) => {
        let calenderErrorView = this._utilityService.errorCheck(code, errorMsg, 'DELETE');
        this.calDefaultError = calenderErrorView;
        this.calDefViewRecords[index].error = calenderErrorView;
      }
    });
  }

  deletePeriodRecord(record, index, success) {
    let data = {};
    if (this.widgetModel === 'std') {
      const periodIds = [];
      record.weekDayPeriods.forEach(day => {
        periodIds.push(day.split('-')[1]);
      });
      data = {
        body: periodIds
      };
    } else {
      data = {
        periodId: record.periodId
      };
    }
    this.periodTooltipIndex = index;
    this._service[this.widgetModel === 'hol' ? 'deleteHolPeriod' : 'deleteStdPeriods']({
      data,
      success: (result) => {
        success();
        this.isGetWidgetType.emit(this.widgetModel);
      },
      failure: (errorMsg: string, code: any) => {
        this.calPeriodError = this._utilityService.errorCheck(code, errorMsg, 'DELETE');;
        this.calPeriodViewRecords[index].error = true;
      }
    });
  }

  displayCoverHandler(editCalendarPanel) {
    this.editCalendarPanel = editCalendarPanel;
    editCalendarPanel.show();
    this.showCover = true;
    this._utilService.checkNgxSlideModal(true);
  }

  cancelCoverHandler() {
    if (this.checkEnableSaveButton()) {
      this.confirmDialog = 3;
    } else {
      this.closeEditPanel();
    }
  }

  onModalDialogCloseCal(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this.closeEditPanel();
    }
  }

  closeEditPanel() {
    this.saveCalendarError = null;
    this.calendarSaving = false;
    this.calDefaultError = null;
    this.calPeriodError = null;
    this.defaultTooltipIndex = null;
    this.periodTooltipIndex = null;
    this.editCalendarPanel.hide();
    this.showCover = false;
    this._utilService.checkNgxSlideModal(false);
    this.calDefEditRecords = this._utilityService.cloneJson(this.calDefViewRecords);
    this.calPeriodEditRecords = this._utilityService.cloneJson(this.calPeriodViewRecords);
    this.showErrorMessage = false;
  }

  onlyNumber(event: any) {
    this._utilityService._onlyNumber(event);
  }

  handleClockNumber(max, data, attr) {
    const value = data[attr] < 0 ? 0 : (data[attr] > max ? max : data[attr]);
    data[attr] = value;
  }

  fix2Digit(data, attr, col) {
    if (!this._utilityService.isEmpty(data[attr])) {
      data[attr] = this._utilityService.toFixedNoDigit(parseInt(data[attr], 10), 2);
      this.validatePeriodEditWidget(col);
    }
  }

  addDefRecord(position, record) {
    const tableData = this._utilityService.cloneJson(this.calDefEditRecords);
    tableData.splice(position, 0, record);
    this.calDefEditRecords = tableData;
    setTimeout(() => {
      if ((<HTMLInputElement>document.getElementById('name-' + position)) != null) {
        (<HTMLInputElement>document.getElementById('name-' + position)).focus();
      }
        }, 300);
  }

  addPeriodRecord(position, record) {
    const tableData = this._utilityService.cloneJson(this.calPeriodEditRecords);
    tableData.splice(position, 0, record);
    this.calPeriodEditRecords = tableData;
    setTimeout(() => {
      if ((<HTMLInputElement>document.getElementById('period-' + position)) != null) {
        (<HTMLInputElement>document.getElementById('period-' + position)).focus();
      }
        }, 300);
  }
  decodePeriods() {
    this.calPeriodEditRecords.forEach(period => {
      this.decodePeriod(period, 'start');
      this.decodePeriod(period, 'end');
    });
  }
  validatePeriodEditWidget(column) {
    const pRecords = this.calPeriodEditRecords;
    this.calPeriodError = null;
    this.periodTooltipIndex = null;
    if (!this.isEmptyRecord(pRecords, this.periodEditCols, 'periodId')) {
      this.decodePeriods();
      for (const index in pRecords) {
        if (pRecords[index] != null) {
          this.validateDefaultDaySelection(pRecords, column, index);
          this.validateTimeFields(pRecords, column, index);
          this.validateTimeFieldWithOverllap(pRecords, column, index);
          if (this.calPeriodError !== null) {
            this.clearHighlight(this.calPeriodEditRecords);
            this.calPeriodEditRecords[index]['error'] = true;
            this.periodTooltipIndex = parseInt((this.calPeriodEditRecords.length === index ? parseInt(index, 10) - 1 : index) + '', 10);
            break;
          }else {
            this.OnPeriodTooltipCloseEdit();
          }
        }
      }
    }
  }
  validateDefaultDaySelection (pRecords, column, index) {
    if (this.widgetModel === 'hol' && this._utilityService.isEmpty(pRecords[index]['name'])
      && (column == null || (column !== null && column === 'name')) ) {
      this.calPeriodError = 'TEXT_SELECT_DAYS';
      this.calPeriodErrorCol = 'name';
    }
    if (this.widgetModel === 'std' && this._utilityService.isEmpty(pRecords[index]['weekdays'])
      && (column == null || (column !== null && column === 'weekdays')) ) {
      this.calPeriodError = 'TEXT_STD_DAY_SELECT';
      this.calPeriodErrorCol = 'weekdays';
    }
  }
  validateTimeFields(pRecords, column, index) {
    if ((column === null || column === 'startTime') && this.calPeriodError === null) {
      if (this._utilityService.isEmpty(pRecords[index]['startHr']) || this._utilityService.isEmpty(pRecords[index]['startMin']) 
      || this._utilityService.isEmpty(pRecords[index]['startFormat'])) {
        this.calPeriodError = 'TEXT_PROVIDE_HOL_PERIOD_STARTTIME';
        this.calPeriodErrorCol = 'startTime';
      }
    }
    if ((column == null || column === 'endTime') && this.calPeriodError === null) {
      if (this._utilityService.isEmpty(pRecords[index]['endHr']) || this._utilityService.isEmpty(pRecords[index]['endMin'])
      || this._utilityService.isEmpty(pRecords[index]['endFormat'])) {
        this.calPeriodError = 'TEXT_PROVIDE_HOL_PERIOD_ENDTIME';
        this.calPeriodErrorCol = 'endTime';
      }
    }
  }
  validateTimeFieldWithOverllap(pRecords, column, index) {
    if ((column == null || (column === 'startTime' || column === 'endTime' || column === 'filledTime')) && 
      this.calPeriodError === null) {
      if (!this.isSkipTimeCheck(pRecords[index], column)) {
        const newBegin = pRecords[index].begin;
        const newEnd = pRecords[index].end;
        if (newEnd <= newBegin) {
          this.calPeriodError = 'TEXT_HOL_PERIOD_ENDTIME_GREATER_STARTTIME';
          this.calPeriodErrorCol = 'endTime';
        }else {
          this.timeOverllapCheck(pRecords, index, newBegin, newEnd);
        }
      }
    }
  }
  timeOverllapCheck(pRecords, index, newBegin, newEnd) {
    const defPeriodCol = this.widgetModel === 'hol' ? 'name' : 'weekdays';
    for (const existInd in pRecords) {
      if (existInd !== null) {
        const chkRecord = pRecords[existInd];
        const isValidForOverlapCheck = index !== existInd && this.calPeriodError === null
        && !this._utilityService.isEmpty(chkRecord[defPeriodCol]);
        const isSameHoliday = pRecords[index][defPeriodCol] === chkRecord[defPeriodCol];
        const overllapCheck = (newBegin === chkRecord.begin && newEnd === chkRecord.end) ||
        (newBegin > chkRecord.begin && newBegin < chkRecord.end) ||
        (chkRecord.begin > newBegin && chkRecord.begin < newEnd);
        if (this.widgetModel === 'hol' && isValidForOverlapCheck && isSameHoliday && overllapCheck) {
           if (!this._utilityService.isEmpty(chkRecord.startFormat)) {
          this.calPeriodError = 'TEXT_HOL_TIME_PERIOD_OVERLAPS';
          this.calPeriodErrorCol = 'endTime';
          }
        }else if (this.widgetModel === 'std' && isValidForOverlapCheck) {
          const days = this._utilityService.arrayIntersects(pRecords[index].weekdays, chkRecord.weekdays);
          if (!this._utilityService.isEmpty(days) && overllapCheck && !this._utilityService.isEmpty(chkRecord.startFormat)) {
            this.calPeriodError = 'TEXT_HOL_TIME_PERIOD_OVERLAPS';
            this.calPeriodErrorCol = 'endTime';
          }
        }
      }
    }
  }

  isSkipTimeCheck(record, column) {
    const defPeriodCol = this.widgetModel === 'hol' ? 'name' : 'weekdays';
    return (column === 'filledTime' &&
    (this._utilityService.isEmpty(record[defPeriodCol])
    || !this._utilityService.isObject(record.startHr) || !this._utilityService.isObject(record.startMin)
    || !this._utilityService.isObject(record.endHr) || !this._utilityService.isObject(record.endMin)
    || !this._utilityService.isObject(record.startFormat) || !this._utilityService.isObject(record.endFormat)));
  }

  getDeleteIds(view, edit, attr, dayIds) {
    const ids = [];
    view.forEach((vRecord) => {
      let exist = false;
      edit.forEach((eRecord) => {
        if (vRecord[attr] === eRecord[attr]) {
          exist = true;
        }
      });
      if (!exist && (dayIds == null || (dayIds !== null && dayIds.indexOf(vRecord['dayId']) === -1))) {
        ids.push(vRecord[attr]);
      }
    });
    return ids;
  }
  saveCalendarRecords(holidayData, calendarId, refresh) {
    this.showErrorMessage = false;
    this.saveCalendarError = null;
    this.calendarSaving = true;
    this._service[this.widgetModel === 'hol' ? 'saveHoliday' : 'saveStandardDay']({
      data: {
        calendarId,
        body: holidayData
      },
      success: (result) => {
        let successSave = false;
        result.forEach(element => {
          if (element.code !== 200) {
            this.saveCalendarError = 'TEXT_UNABLE_SAVE_HOLIDAY';
          }else {
            successSave = true;
          }
        });
        if (this.saveCalendarError === null) {
          this.closeEditPanel();
          this.isGetWidgetType.emit(this.widgetModel);
          
        }
        if (successSave) {
          refresh();
        }
      },
      failure: (errorMsg: string, code: any) => {
        this.showErrorMessage = true;
        this.saveCalendarError = this._utilityService.errorCheck(code, errorMsg, 'EDIT');
      },
      onComplete: () => {
        this.calendarSaving = false;
      }
    });
  }
  isEmptyRecord(records, cols, id) {
    const record = records[0];
    if (records.length === 1 && !this._utilityService.isObject(record[id])) {
      let emptyColCount = 0;
      if (this.widgetModel === 'std' && id === 'dayId') {
          return typeof(record.code) === 'string' ? false : true;
      }else {
        cols.forEach((col) => {
          if (col !== 'code') {
            emptyColCount += this._utilityService.isEmpty(record[col]) ? 0 : 1;
          }
        });
        if (emptyColCount === 0) {
          record['error'] = false;
        }
        return emptyColCount === 0;
      }
    }else {
      return false;
    }
  }

  checkEnableSaveButton() {
    const saveEnabled = this.isSaveEnabled();
    this.isEdited.emit(saveEnabled);
    return saveEnabled;
  }
  isSaveEnabled() {
    if (this.showCover) {
      if (this.calendarSaving) {
        return false;
      }
      const defaultUniqueId = this.widgetModel === 'hol' ? 'holidayId' : 'dayId';
      if (this.isEmptyRecord(this.calDefEditRecords, this.defaultEditCols, defaultUniqueId) &&
      this.isEmptyRecord(this.calPeriodEditRecords, this.periodEditCols, 'periodId')) {
        return false;
      }else if (this.calDefViewRecords.length !== this.calDefEditRecords.length ||
      this.calPeriodViewRecords.length !== this.calPeriodEditRecords.length) {
        return true;
      }
      if (this.editCheck(this.calDefViewRecords, this.calDefEditRecords, defaultUniqueId)) {
        return true;
      }else {
        return this.editCheck(this.calPeriodViewRecords, this.calPeriodEditRecords, 'periodId');
      }
    } else {
      return false;
    }
  }

  editCheck(viewRecords, editRecords, id) {
    const breakMe = {};
    let isUpdate = false;
    try {
    editRecords.forEach((record) => {
      isUpdate = this.checkIfAnyUpdate(viewRecords, record, id, null);
      if (isUpdate) {
        throw breakMe;
      }
    });
    }catch (e) {
      if (e === breakMe) {
        return true;
      }
    }
    return isUpdate;
  }

  checkIfAnyUpdate(viewRecords, editRecord, uniqueId, excludeCols) {
    const periodEditCols = this._utilityService.cloneJson(this.periodEditCols);
    if (periodEditCols.indexOf('code') === -1) {
      periodEditCols.push('code');
    }
    const attrs = uniqueId === 'periodId' ? periodEditCols : this.defaultEditCols;
    if (excludeCols !== null) {
      excludeCols.forEach(col => {
        attrs.splice(attrs.indexOf(col), 1);
      });
    }
    let hasChanged = false;
    viewRecords.forEach((viewRecord) => {
       if ((viewRecord[uniqueId] + '' === editRecord[uniqueId] + '') ||
          (viewRecord['weekday'] === editRecord['weekday'] && uniqueId === 'dayId')) {
        attrs.forEach((attr) => {
          if (Object.prototype.toString.call(editRecord[attr]) === '[object Array]') {
            if (!this._utilityService.arraysEqual(editRecord[attr], viewRecord[attr])) {
              hasChanged = true;
            }
          }else if (editRecord[attr] + '' !==  viewRecord[attr] + '') {
            hasChanged = true;
          }
        });
      } else if (!this._utilityService.isObject(editRecord[uniqueId]) && uniqueId !== 'dayId') {
        hasChanged = true;
      }
    });
    return hasChanged;
  }
  addPeriodFromView(editCalendarPanel, data, position) {
    this.displayCoverHandler(editCalendarPanel);
    if (data.periodId !== null) {
      this.addPeriod(position);
    }
  }
  addPeriod(position) {
    this.addPeriodRecord(position, this.newPeriod());
  }
  newPeriod() {
    return {
      'periodId': null,
      'code': 1
    };
  }
  processDialogCloseDelPeriod(event, processCalendars) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      if (this.showCover) {
        this.calPeriodEditRecords.forEach((item, index) => {
          if (this.delSelectedPeriodRecord['periodId'] === item.periodId) {
            this.removePeriodRecordFromView(index);
          }
          if (this.calPeriodEditRecords.length === 0) {
            this.addPeriod(0);
          }
        });
      }else {
        this.deletePeriodRecord(this.delSelectedPeriodRecord, this.delSelectedPeriodRecordIndex,
        (result) => {
          this.getCalendars(this.calendarId, (output) => { processCalendars(output); });
        });
      }
    }
  }
  showOverrideTimePeriod() {
    return true;
  }
  onModalDialogCloseDeleteDefault(event) {}

  private getCalenderFetchError(code, errorMsg) {
    this.calDefViewRecords = [];
    this.calPeriodViewRecords = [];
    this.calFetchError= this._utilityService.errorCheck(code, errorMsg, 'LOAD');
  }
}
