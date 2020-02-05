import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ajaxUtilService } from '../../helpers/ajaxUtil.service';

@Injectable()
export class SubscriptionpropertiesService {

    constructor(private _http: Http, private _ajaxUtil: ajaxUtilService) {}

    getShared(options) {
      const data = options.data;
      const defaults = {
        url : this._ajaxUtil.actionUrls().subscriptionProperties + data.offerId
      };
      this._ajaxUtil.processRequest(defaults, options);
    }

    deleteSubscription(options) {
      const data = options.data;
      const defaults = {
        url : this._ajaxUtil.actionUrls().deleteSubscription + data.offerId + '/subscription-property/' + data.productSpecId,
        type : 'DELETE'
      };
      this._ajaxUtil.processRequest(defaults, options);
    }
}

