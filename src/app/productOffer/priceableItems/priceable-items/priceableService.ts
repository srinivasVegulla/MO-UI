import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ajaxUtilService } from '../../../helpers/ajaxUtil.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { card } from './cardInterface';

@Injectable()
export class cardService {

    constructor(private _http: Http, private _ajaxUtil: ajaxUtilService) {}

    getCardinfo(options) {
      var data = options.data;
      var defaults = {
        url : this._ajaxUtil.actionUrls().pricelistMapping + "/" + data.offerId
      };
      this._ajaxUtil.processRequest(defaults, options);
    }
    removePICard(options) {
      var data = options.data;
      var defaults = {
        url : this._ajaxUtil.actionUrls().priceableItems + data.offerId + "/pi-instance/" + data.piInstanceId,
        type : 'DELETE'
      };
      this._ajaxUtil.processRequest(defaults, options);
    }
}
