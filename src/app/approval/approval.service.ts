import { Injectable } from '@angular/core';
import { Headers,Http,Response,RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ajaxUtilService } from '../helpers/ajaxUtil.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ApprovalService {

    constructor(private _http: Http, private _ajaxUtil: ajaxUtilService) {}

    getApprovalList(options){
      var data = options.data;
      var defaults = {};
      if(!isNaN(data.productOfferId)){
        defaults['url'] = this._ajaxUtil.actionUrls().getApprovals + data.productOfferId
      }
      else {
        defaults['url'] = this._ajaxUtil.actionUrls().getRateApprovals + data.schedId
      }
      this._ajaxUtil.processRequest(defaults, options);
    }

    getPendingRateChanges(options) {
      const defaults = {
          url: this._ajaxUtil.actionUrls().getPendingRateChanges + options.data.scheduleId + '/' + options.data.approvalId
      };
      this._ajaxUtil.processRequest(defaults, options);
    }
    getPendingOfferingChanges(options) {
      const defaults = {
          url: this._ajaxUtil.actionUrls().getPendingOfferingChanges + options.data.approvalId
      };
      this._ajaxUtil.processRequest(defaults, options);
    }
    saveApprovalList(options) {
      const defaults = {
        url: this._ajaxUtil.actionUrls().saveApprovals,
        type: 'POST'
      };
      this._ajaxUtil.processRequest(defaults, options);
    }

    getSortFields(options) {
      const defaults = {
        url: this._ajaxUtil.actionUrls().getSortFieldChanges + options.data.approvalId
    };
    this._ajaxUtil.processRequest(defaults, options);
    }
}
