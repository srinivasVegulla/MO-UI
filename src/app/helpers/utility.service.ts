import { Injectable, OnInit, OnDestroy} from '@angular/core';
import { ajaxUtilService } from '../helpers/ajaxUtil.service';
import { TranslationService, LocaleService } from 'angular-l10n';
import { calenderLocaleFeilds } from '../../assets/calenderLocalization';
import { dateFormatPipe } from '../helpers/dateFormat.pipe';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { utilService } from './util.service';

@Injectable()
export class UtilityService implements OnInit, OnDestroy {
  selectedSchedule: any;
  rateTitle;
  localeDateFormat: any;
  startDate: any;
  endDate: any;
  jsonParsedError = new BehaviorSubject<any>(null);
  patterns: any = {
    number: new RegExp('[0-9]'),
    decimal: new RegExp('[0-9\.\]')
  };
  adjustedHeight: any;
  initialTime: any;
  setIntervalValues: any;
  checkTime: any;
  timeGap: any;
  defaultTimeGap = 500;
  eventLocation: any;
  errorType: any;
  constructor(private readonly _ajaxUtil: ajaxUtilService,
              private readonly _translationService: TranslationService,
              private readonly _locale: LocaleService,
              private readonly _dateFormat: dateFormatPipe,
              private _router: Router,
              private readonly _util: utilService) {
              }

  ngOnInit() {
  }

  getextdata(options) {
    const defaults = {
      url: this._ajaxUtil.actionUrls().columnDef + options.data
    };
    return this._ajaxUtil.processRequest(defaults, options);
  }

  getFilteringTimeGap(options) {
    const defaults = {
      url: this._ajaxUtil.actionUrls().filteringTimeGap
    };
    return this._ajaxUtil.processRequest(defaults, options);
  }

  getCurrenciesAndPartitionsList(options) {
    const defaults = {
      url: this._ajaxUtil.actionUrls().CurrenciesAndPartitions
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  hideSkeleton(element) {
    setTimeout(() => {
     const dom = document.querySelector('.' + element);
     if (dom) {
      dom.innerHTML = ' ';
     }
    }, 300);
  }

  isObject(object) {
    return object !== null && object !== 'null'  && object !== 'undefined' && object !== undefined;
  }

  getDateDescription(selectedSchedule) {
    const to = this._translationService.translate('TEXT_TO');
    const noStart = this._translationService.translate('TEXT_NO_START');
    const billCycleAfter = this._translationService.translate('TEXT_BILL_CYCLE_AFTER');
    const daysAfterSubscription = this._translationService.translate('TEXT_DAYS_AFTER_SUBSCRIPTION');
    this.localeDateFormat = calenderLocaleFeilds[this._locale.getCurrentLocale()].localeDateFormat;

    this.selectedSchedule = this.datesFormateHandler(selectedSchedule);
    this.startDate = this._dateFormat.transform(selectedSchedule.startDate, this.localeDateFormat);

    if (selectedSchedule.startDateType === 'EXPLICIT_DATE') {
    this.rateTitle = ` ${this.startDate} ${to} ${this.getEndateDetails(selectedSchedule)}`;
    } else if (selectedSchedule.startDateType === 'NOT_SET') {
      this.rateTitle = ` ${noStart} ${to} ${this.getEndateDetails(selectedSchedule)}`;
    } else if (selectedSchedule.startDateType === 'NEXT_BILL_PERIOD') {
      this.rateTitle = ` ${billCycleAfter} ${this.startDate} ${to} ${this.getEndateDetails(selectedSchedule)}`;
    } else {
      this.rateTitle = ` ${selectedSchedule.startDateOffset} ${to} ${selectedSchedule.endDateOffset} ${daysAfterSubscription} `;
    }
    return this.rateTitle;
  }

  getEndateDetails(selectedSchedule) {
    const noEnd = this._translationService.translate('TEXT_NO_END');
    const billCycleAfter = this._translationService.translate('TEXT_BILL_CYCLE_AFTER');
    this.endDate = this._dateFormat.transform(selectedSchedule.endDate, this.localeDateFormat);
    if ( selectedSchedule.endDateType === 'EXPLICIT_DATE') {
      this.rateTitle = ` ${this.endDate} `;
    } else if (selectedSchedule.endDateType === 'NOT_SET') {
      this.rateTitle = ` ${noEnd} `;
    } else if (selectedSchedule.endDateType === 'NEXT_BILL_PERIOD') {
      this.rateTitle = `${billCycleAfter} ${this.endDate} `;
    }
    return this.rateTitle;
  }

  datesFormateHandler(schedule) {
    if (schedule !== undefined && schedule !== null) {
      if (schedule['startDate'] !== null) {
        const startDateFormat = new Date(schedule['startDate']);
        schedule['startDate'] = startDateFormat.toLocaleDateString();
      }
      if (schedule['endDate'] !== null) {
        const endDateFormat = new Date(schedule['endDate']);
        schedule['endDate'] = endDateFormat.toLocaleDateString();
      }
    }
    return schedule;
  }

  isEmpty(object) {
    if (this.isObject(object)) {
      return (typeof(object) === 'string' && object.trim() === ''
      || typeof(object) === 'object' && (object.length === 0 || Object.keys(object).length === 0) ) ? true : false;
    }
    return true;
  }

  downloadFile(data, fileName) {
    const blob = new Blob([data], { type: 'text/csv' });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
     window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
     const a = document.createElement('a');
     a.href = URL.createObjectURL(blob);
     a.download = fileName;
     document.body.appendChild(a);
     a.click();
     document.body.removeChild(a);
    }
  }

  getDaysInMonth(m, y) {
    --m;
    return ( /8|3|5|10/.test( m ) ) ? 30 :
    (m !== 1 ? 31 :
    (( y % 4 === 0 && y % 100 !== 0 ) || y % 400 === 0 ) ? 29 : 28);
  }

  changeLocale(lang) {
    this._locale.setCurrentLanguage(lang);
    document.getElementById('mainBody').dir = (lang ==='he' || lang ==='ar-sa') ? 'RTL' : 'LTR';
    localStorage.setItem('currentLang', lang);
  }
  encode(unencoded) {
    return encodeURIComponent(unencoded).replace(/'/g, '%27').replace(/"/g, '%22');
  }
  decode(encoded) {
    return decodeURIComponent(encoded.replace(/\+/g,  ' '));
  }
  toFixedNoDigit(number, count) {
    const no = parseInt('1' + '0'.repeat(count), 10);
    return (count === 1 || number > no - 1) ? '' + number : '0'.repeat((count - (('' + parseInt(number, 10)).length))) + number;
  }
  cloneJson(object) {
    return JSON.parse(JSON.stringify(object));
  }
  _onlyNumber(event: any) {
    if (event.keyCode !== 9) {
      return this.patternRestrict(event, this.patterns.number);
    }else {
      return true;
    }
  }
  _decimal(event: any) {
    return this.patternRestrict(event, this.patterns.decimal);
  }
  patternRestrict(event: any, pattern: any) {
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
  IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  dLangPropertyNames(field) {
    const fields = {
      description: 'descriptionId',
      category: 'categoryId',
      displayName: 'displayNameId',
      unitDisplayName: 'unitDisplayNameId',
      values: 'values',
      itemInstanceDescription: 'itemInstanceDescriptionId',
      itemInstanceName: 'itemInstanceDisplayNameId',
      offerDisplayName: 'offerDisplayNameId'
    };
    return fields[field] ? fields[field] : null;
  }

  arraysEqual(a, b) {
    if (a === b) {
      return true;
    }
    if (a == null || b == null) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    a.sort();
    b.sort();
    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }
  arrayIntersects(arr1, arr2) {
    const days = arr1.filter(function(v) {
      return arr2.indexOf(v) > -1;
    });
    return days;
  }
  arrayDiffelements(arr1, arr2) {
      const days1 = arr1.filter(function(v) {
        return arr2.indexOf(v) < 0;
      });
      const days2 = arr2.filter(function(v) {
        return arr1.indexOf(v) < 0;
      });
      return this.arrayUnique(days1.concat(days2));
  }
  arrayUnique(array) {
    const a = array.concat();
    for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) {
                a.splice(j--, 1);
            }
        }
    }
    return a;
  }
  ngOnDestroy() {

  }

  isNoBreakString(value) {
    let reWhiteSpace = new RegExp("\\s");
    if (reWhiteSpace.test(value)) {
      return false;
    } else {
      return true;
    }
  }

  getFieldParams(widget: string, type: string) {
    const fieldParamsObj = {
      offeringProperties: ['displayName', 'description', 'startDate', 'endDate', 'hidden'],
      offeringPermissions: ['userSubscribe', 'userUnsubscribe', 'availableStartDate', 'availableEndDate'],
      offeringExtProperties: ['properties'],
      offeringPIProperties: ['name', 'displayName', 'description'],
      offeringPIUnitDetails: ['displayName'],
      offeringPTUnitDetails: ['unitName', 'unitDisplayName', 'ratingType', 'integral', 'minUnitValue', 'maxUnitValue', 'validEnumValues'],
      subPropertiesDetails: ['category', 'name', 'description', 'specType', 'minValue', 'maxValue', 'userVisible', 'userEditable', 'isRequired', 'value'],
      adjustmentReasons: ['displayName', 'description'],
    }

    switch (type) {
      case 'set':
        return fieldParamsObj[widget];
      case 'string':
        return `?fields=${fieldParamsObj[widget].join()}`;
      case 'params':
        return `${fieldParamsObj[widget].join()}`;
      default:
        return fieldParamsObj;
    }
  }

  enableFilter(event, location) {
    this.eventLocation = location;
    const charCode = (event.which) ? event.which : event.keyCode;
    if (this._util.inValidKeys.indexOf(charCode) > -1) {
      return false;
    } else {
      const date = new Date();
      this.initialTime = date.getTime();
      if (typeof(this.setIntervalValues) === 'undefined') {
        this.setIntervalValues = setInterval(() => {
          this.StartFilteringIfDoneTyping();
        }, 50);
      }
    }
  }

  StartFilteringIfDoneTyping() {
    const date = new Date();
    this.checkTime = date.getTime();
    const limit_ms = Number(this.checkTime) - Number(this.initialTime);
    if (limit_ms > this.timeGap) {
        this._util.checkCallFilterData(this.eventLocation);
        clearInterval(this.setIntervalValues);
        delete this.setIntervalValues;
    }
  }

  getTimeGapDetails() {
    this.getFilteringTimeGap({
      success: (result) => {
        this.timeGap = result.FilteringTimeGap;
      },
      failure: (error) => {
        this.timeGap = this.defaultTimeGap;
      }
    });
  }

  getLatestServiceData(filterKeys, filteredField, filteredValue) {
    if (filterKeys !== undefined || filterKeys !== null) {
      const dLangField = this.dLangPropertyNames(filteredField);
      const fieldType = dLangField ? dLangField : filteredField;
      if(filteredField !== 'loginName'){
        for (let key in filterKeys) {
          if(fieldType === key) {
            if(filteredValue.trim() === filterKeys[key]) {
              return false;
            } else{
              return true;
            }
          }
        }
      } else {
          this.validateLoginName(filterKeys, filteredValue);
      }
    }
  }

  validateLoginName(filterKeys, filteredValue) {
    if(filteredValue != null) {
      let resultObj = filteredValue.trim().split("/");
      if(resultObj[0] !== undefined && resultObj[1] !== undefined) {
        if(resultObj[0].length >= 1 && resultObj[1].length >= 1) {
          if(resultObj[0] === filterKeys[1] && resultObj[1] === filterKeys[0]) {
            return false;
          } else {
            return true;
          }
        }
      } else {
        if(resultObj[0] === filterKeys[0]) {
          return false;
        } else {
          return true;
        }
      }
      }
  }

  calculateLocalizationHeader(localTitle, localLang) {
    if (localTitle !== undefined && localLang  !== undefined) {
      const localHeight = localTitle + localLang;
      this._util.changeLocalizationScrollHeight(localHeight);
    }
  }

  resetPagination(pagination) {
    if(pagination !== undefined) {
      pagination.page = 1;
      pagination.firstPageIndex = 1;
      pagination.centerPageIndex = null;
      pagination.lastPageIndex = null;
      return pagination;
    }
    }

  isStaticString(value: any) {
    if (value !== null && value !== "" && value !== undefined) {
      if(typeof value == 'number'){
        return false;
      }
      else if (value.includes('TEXT_')) {
        return true;
      }
      else {
        return false;
      } 
    } 
    else {
      return false;
    }   
  }

  errorCheck(code, message, type) {
    if (code === 404) {
      this._router.navigate(['/404']);
      return null;
    } else if (code === '' || code === undefined || code === null) {
      this.errorTypeCheckForNetworkFailure(type);
      return `${this.errorType}`;
    } else {
      this.errorTypeCheck(type);
      const serverErrMsg = message;
      return `${this.errorType} ${serverErrMsg}`;
    }
  }
  errorTypeCheckForNetworkFailure(type) {
    switch (type) {
      case 'COPY':
       this.errorType = this._translationService.translate('TEXT_NETWORK_FAILED_WHILE_COPY');
        break;
      case 'CREATE':
      this.errorType = this._translationService.translate('TEXT_NETWORK_FAILED_WHILE_CREATE');
        break;
      case 'ADD':
      this.errorType = this._translationService.translate('TEXT_NETWORK_FAILED_WHILE_ADD');
        break;
      case 'LOAD':
      this.errorType = this._translationService.translate('TEXT_NETWORK_FAILED_WHILE_LOAD');
        break;
      case 'DOWNLOAD':
      this.errorType = this._translationService.translate('TEXT_NETWORK_FAILED_WHILE_DOWNLOAD');
        break;
      case 'UPLOAD':
      this.errorType = this._translationService.translate('TEXT_NETWORK_FAILED_WHILE_UPLOAD');
        break;
      case 'EDIT':
      this.errorType = this._translationService.translate('TEXT_NETWORK_FAILED_WHILE_EDIT');
        break;
      case 'HIDE':
      this.errorType = this._translationService.translate('TEXT_NETWORK_FAILED_WHILE_HIDE');
        break;
      case 'UNHIDE':
      this.errorType = this._translationService.translate('TEXT_NETWORK_FAILED_WHILE_SHOW');
        break;
      case 'DELETE':
      this.errorType = this._translationService.translate('TEXT_NETWORK_FAILED_WHILE_DELETE');
        break;
      case 'REMOVE':
      this.errorType = this._translationService.translate('TEXT_NETWORK_FAILED_WHILE_REMOVE');
        break;
    }
  }
  errorTypeCheck(type) {
    switch (type) {
      case 'COPY':
       this.errorType = this._translationService.translate('TEXT_ERROR_SERVER_MESSAGE_COPY');
        break;
      case 'CREATE':
      this.errorType = this._translationService.translate('TEXT_ERROR_SERVER_MESSAGE_SAVE_CREATE');
        break;
      case 'ADD':
      this.errorType = this._translationService.translate('TEXT_ERROR_SERVER_MESSAGE_ADD_ITEMS');
        break;
      case 'LOAD':
      this.errorType = this._translationService.translate('TEXT_ERROR_SERVER_MESSAGE_LOAD');
        break;
      case 'DOWNLOAD':
      this.errorType = this._translationService.translate('TEXT_ERROR_SERVER_MESSAGE_DOWNLOAD');
        break;
      case 'UPLOAD':
      this.errorType = this._translationService.translate('TEXT_ERROR_SERVER_MESSAGE_UPLOAD');
        break;
      case 'EDIT':
      this.errorType = this._translationService.translate('TEXT_ERROR_SERVER_MESSAGE_SAVE_EDIT');
        break;
      case 'HIDE':
      this.errorType = this._translationService.translate('TEXT_ERROR_SERVER_MESSAGE_HIDE');
        break;
      case 'UNHIDE':
      this.errorType = this._translationService.translate('TEXT_ERROR_SERVER_MESSAGE_UNHIDE');
        break;
      case 'DELETE':
      this.errorType = this._translationService.translate('TEXT_ERROR_SERVER_MESSAGE_DELETE');
        break;
      case 'REMOVE':
      this.errorType = this._translationService.translate('TEXT_ERROR_SERVER_MESSAGE_REMOVE');
    }
  }
  
  adjustHeightOnScroll(textArea) {
    textArea.style.height  =  textArea.scrollHeight  +  'px';
   if  (textArea.clientHeight  ===  textArea.scrollHeight) {
    textArea.style.height  =  '30px';
    }
   this.adjustedHeight  =  Math.max(textArea.scrollHeight,  this.adjustedHeight);
    if  ( this.adjustedHeight  >  textArea.clientHeight){
    textArea.style.height  =  this.adjustedHeight  +  'px';
    }
  }

  removeTextSpace(checkNameValue,checkDisplayValue){
     if(checkNameValue != null && !/\S/.test(checkNameValue.value) && checkNameValue.value.length != 0) {
      checkNameValue.setValue('');
    }else if(checkDisplayValue != null && !/\S/.test(checkDisplayValue.value) && checkDisplayValue.value.length != 0){
      checkDisplayValue.setValue('');
    }
  }

  disableSpaceBar(evt){
    if(evt.keyCode === 32 && evt.target.selectionStart === 0){
      evt.preventDefault();
    }
  }

  isTicketLogin() {
    return !this.isEmpty(sessionStorage.getItem('ticket'));
  }

  // IE polyfill to get the closest element, equivalent to element.closest() method
  getClosestElement() {
    if (Element && !Element.prototype.closest) {
      Element.prototype.closest =
        function (s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i,
            el = this;
          do {
            i = matches.length;
            while (--i >= 0 && matches.item(i) !== el) { };
          } while ((i < 0) && (el = el.parentElement));
          return el;
        };
    }
  }

}
