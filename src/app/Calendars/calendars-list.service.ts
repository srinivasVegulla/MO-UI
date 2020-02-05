import { Component, Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { ajaxUtilService } from '../helpers/ajaxUtil.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UtilityService } from '../helpers/utility.service';

@Injectable()

export class CalendarsService {

  calendarDetailsPath = '/ProductCatalog/Calendars/';
  public openInUseCalWidget = new BehaviorSubject<Object>({});
  changeOpenInUseCalWidget(value) {
    this.openInUseCalWidget.next(value);
  }
  constructor(private _ajaxUtil: ajaxUtilService) { }
  getCalendarLists(options) {
      const defaults = {
        url: this._ajaxUtil.actionUrls().calendars,
        type: 'GET'
      };
    this._ajaxUtil.processRequest(defaults, options);
  }
  createCalendars(options) {
      const defaults = {
        url: this._ajaxUtil.actionUrls().calendars,
        type: 'POST'
      };
      this._ajaxUtil.processRequest(defaults, options);
  }
  saveCopyCalendar(options) {
      const calendarId = options.data.calendarID;
      const defaults = {
        url: this._ajaxUtil.actionUrls().calendars + '/' + calendarId,
        type: 'POST'
      };
      this._ajaxUtil.processRequest(defaults, options);
  }
  getCalendarDetails(options) {
      const calendarId = options.data.calendarId;
      const defaults = {
        url: this._ajaxUtil.actionUrls().calendars + '/' + calendarId,
        type: 'GET'
      };
      this._ajaxUtil.processRequest(defaults, options);
  }
  getCalendarNameAvailability(options) {
      const defaults = {
        url: this._ajaxUtil.actionUrls().calendars,
      };
      this._ajaxUtil.processRequest(defaults, options);
  }
  searchCalendarNameAvailability(options) {
    const data = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().searchCalendarName + "'" + data.calendarName + "'",
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
  deleteCalendar(options) {
    const data = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().calendars + '/' + data.calendarId,
      type: 'DELETE'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
  getHolidays(options) {
    const data = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().calendarHoliday + data.calendarId,
      type: 'GET'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
  calendarCode(options) {
    const defaults = {
      url: this._ajaxUtil.actionUrls().calendarCode,
      type: 'GET'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
  deleteHoliday(options) {
    const data = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().calendarHoliday + data.calendarId,
      type: 'DELETE'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
  deleteHolPeriod(options) {
    const data = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().calendarHolPeriod + data.periodId,
      type: 'DELETE'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
  deleteStdPeriods(options) {
    const defaults = {
      url: this._ajaxUtil.actionUrls().deleteStandardPeriod,
      type: 'PUT'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
  saveHoliday(options) {
    const data = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().calendarHoliday + data.calendarId,
      type: 'PUT'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
  saveStandardDay(options) {
    const defaults = {
      url: this._ajaxUtil.actionUrls().calendarStandardDay,
      type: 'PUT'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
  getInUsePriceableItems(options) {
    const calendarId = options.data.Id;
    const defaults = {
      url: this._ajaxUtil.actionUrls().getCalInusePi + calendarId,
      type: 'GET'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
  getStandardDays(options) {
    const defaults = {
      url: this._ajaxUtil.actionUrls().calendarStandardDay + options.data.calendarId,
      type: 'GET'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
  saveProperties(options) {
    const id = options.data.calendarID;
    const defaults = {
      url: this._ajaxUtil.actionUrls().calendars + '/' + id,
      type: 'PUT'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

}
