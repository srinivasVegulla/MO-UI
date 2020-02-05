import { Component, Injectable} from '@angular/core';
import { Http, Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ajaxUtilService } from '../helpers/ajaxUtil.service';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()

export class priceableItemDetailsService {
  public isPriceableItemUpdated = new BehaviorSubject<boolean>(false);

  constructor(private _http: Http, private _ajaxUtil: ajaxUtilService) {}

    getPriceableDetails(options) {
      var data = options.data;
      var defaults = {
        url : this._ajaxUtil.actionUrls().priceableItems + data.offerId + "/" + data.piInstanceId
      };
      this._ajaxUtil.processRequest(defaults, options);
    }

    private  handleError(error: Response|any) {
      return Observable.throw(error);
    }

    getChildPriceableItems(options) {
      var data = options.data;
      var defaults = {
        url : this._ajaxUtil.actionUrls().pricelistMapping + "/" + data.offerId + "/pi-instanceParentId/"+ data.itemInstanceId
      };
      this._ajaxUtil.processRequest(defaults, options);
    }

    updatePriceableItem(options) {
      const data = options.data;
      let updatePriceableItemUrl;
      const piInstance =  '/pi-instance/';
      if (!data.isPitemplate) {
        updatePriceableItemUrl = this._ajaxUtil.actionUrls().updatePriceableItemInstance +
            data.body['offerId'] + piInstance + data.body['itemInstanceId'];
      } else {
        switch (data.body['kindType']) {
          case 'DISCOUNT':
            updatePriceableItemUrl = this._ajaxUtil.actionUrls().updateDiscount + data.body['propId'];
            break;
          case 'USAGE':
            updatePriceableItemUrl = this._ajaxUtil.actionUrls().updateUsageTemplate + data.body['propId'];
            break;
          case 'NON_RECURRING':
            updatePriceableItemUrl = this._ajaxUtil.actionUrls().updateNRC + data.body['propId'];
            break;
          case 'RECURRING':
            data.body['unitDisplayNameId'] = 0;
            updatePriceableItemUrl = this._ajaxUtil.actionUrls().updateRC + data.body['propId'];
            break;
          case 'UNIT_DEPENDENT_RECURRING':
            updatePriceableItemUrl = this._ajaxUtil.actionUrls().updateUDRC + data.body['propId'];
            break;
          default:
            break;
        }
      }
      const defaults = {
        url: updatePriceableItemUrl + data.fields,
        type : 'PUT'
      };
      this._ajaxUtil.processRequest(defaults, options);
    }


  changeIsPriceableItemUpdated(value) {
    this.isPriceableItemUpdated.next(value);
  }
}
