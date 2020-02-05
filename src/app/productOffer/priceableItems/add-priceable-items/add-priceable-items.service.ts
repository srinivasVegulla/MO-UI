import { Injectable } from '@angular/core';
import {Headers,Http,Response,RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ajaxUtilService } from '../../../helpers/ajaxUtil.service';

@Injectable()

export class AddPriceableItemService {
  public sendingFailedPiType = new BehaviorSubject<object>({});
  observableSendingFailedPiType = this.sendingFailedPiType.asObservable();

constructor(private _http: Http, private _ajaxUtil: ajaxUtilService) { }

  getPriceableItems(options){
    var data = options.data;
    var defaults = {
      url : this._ajaxUtil.actionUrls().priceableItemTemplate + 'offering-id/' + data.offerId,
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  addPriceableItems(options) {
    var data = options.data;
      var defaults = {
        url : this._ajaxUtil.actionUrls().priceableItems + data.offerId,
        type : 'POST'
      };
      this._ajaxUtil.processRequest(defaults, options);
  }

  //sending the Priceable items details which failed to add

    changeSendingFailedPiType(value: object) {
    this.sendingFailedPiType.next(value);
  }
}
