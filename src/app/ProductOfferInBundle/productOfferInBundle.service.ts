import { Injectable } from '@angular/core';
import { Headers,Http,Response,RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ajaxUtilService } from '../helpers/ajaxUtil.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ProductOfferInBundleService {

    constructor(private _http: Http, private _ajaxUtil: ajaxUtilService) {}

    getProductOffersInBundle(options){
      var data = options.data;
      var defaults = {
        url : this._ajaxUtil.actionUrls().getExisitingPoInBundle+ data.offerId
      };
      this._ajaxUtil.processRequest(defaults, options);
    }

    removePoFromBundle(options){
      var data = options.data;
      var defaults = {
        url : this._ajaxUtil.actionUrls().removePoFromBundle+ data.bundleId +'/offerId/'+ data.offerId,
        type: 'DELETE'
      };
      this._ajaxUtil.processRequest(defaults, options);
    }
}