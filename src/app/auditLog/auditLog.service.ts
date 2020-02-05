import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ajaxUtilService } from '../helpers/ajaxUtil.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class AuditLogService {

    public _productOfferUrl: any;
    private _allCurrencyUrl: any;
    public _productOfferUrlpage50: any;

    constructor(private _ajaxUtil: ajaxUtilService) {}

    getAuditLogList(options) {
        const defaults = {
            url: this._ajaxUtil.actionUrls().getAuditLogList
        };
        this._ajaxUtil.processRequest(defaults, options);
    };

    exportToCSV(options) {
        const defaults = {
            contentType: 'text/csv',
            responseType: 'blob',
            url: this._ajaxUtil.actionUrls().exportToCSV,
            type: 'POST'
        };
        return this._ajaxUtil.processRequest(defaults, options);
    }

    getRateScheduleHistory(options) {
        const param = options.data.rateParams;
        const extUrl = '/param-table/' + param.paramtableId + '/template/' + param.itemTemplateId + '/pricelist/' + param.pricelistId ;
        const defaults = {
            url: this._ajaxUtil.actionUrls().getRateScheduleHistory + extUrl
        };
        this._ajaxUtil.processRequest(defaults, options);
    }

    getRateChangeMetaData(options) {
      const param = options.data;
      const defaults = {
          url: this._ajaxUtil.actionUrls().rateChanges + param.entityId 
      };
      this._ajaxUtil.processRequest(defaults, options);
  }
  getRateChanges(options) {
    const param = options.data;
    const defaults = {
        url: this._ajaxUtil.actionUrls().rateChanges + param.entityId + '/' + param.createDate
    };
    this._ajaxUtil.processRequest(defaults, options);
}
}
