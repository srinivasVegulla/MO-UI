import { Injectable } from '@angular/core';
import { Headers,Http,Response,RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ajaxUtilService } from '../../../helpers/ajaxUtil.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AddSubscriptionPropertiesService {

    constructor(private _http: Http, private _ajaxUtil: ajaxUtilService) {}

    getSubscriptionsList(options){
      const data = options.data;
      const defaults = {
        url : this._ajaxUtil.actionUrls().getSubscriptionProperties + data.offerId
      };
      this._ajaxUtil.processRequest(defaults, options);
    }

    addSubscriptionItems(options){
    const data = options.data;
      const defaults = {
        url : this._ajaxUtil.actionUrls().addSubscriptions + data.offerId,
        type : 'POST'
      };
      this._ajaxUtil.processRequest(defaults, options);
    }
}

