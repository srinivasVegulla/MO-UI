import { Injectable } from '@angular/core';
import { Headers,Http,Response,RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ajaxUtilService } from '../../helpers/ajaxUtil.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AddProductOfferToBundleService {

    constructor(private _http: Http, private _ajaxUtil: ajaxUtilService) {}

    getProductOffersInBundleList(options){
      var data = options.data;
      var defaults = {
        url : this._ajaxUtil.actionUrls().getPoForSelectedBundle + data.bundleId
      };
      this._ajaxUtil.processRequest(defaults, options);
    }

    addProductOffersToBundle(options){
      var data = options.data;
      var defaults = {
        url : this._ajaxUtil.actionUrls().addPoToBundle+ data.offerId,
        type : 'POST'
      };
      this._ajaxUtil.processRequest(defaults, options);
    }
}