import { Injectable } from '@angular/core';
import {Headers,Http,Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ajaxUtilService } from '../helpers/ajaxUtil.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class ProductOffersListService {

public _productOfferUrl : any;
private _allCurrencyUrl : any;
public _productOfferUrlpage50 : any;

  constructor(private _http:Http, private _ajaxUtil: ajaxUtilService) {

  }
   public hidePOFromList =  new BehaviorSubject<boolean>(false);
      observableHidePOFromListCheck = this.hidePOFromList.asObservable();
      changeHidePOFromList(value:boolean){
      this.hidePOFromList.next(value);
     }
    public unHidePOFromList = new BehaviorSubject<boolean>(false);
      observableUnHidePOFromListCheck = this.unHidePOFromList.asObservable();
      changeUnHidePOFromList(value:boolean){
      this.unHidePOFromList.next(value);
     }
  //call and extraction of currencies from a service call
  //this should send all currencies

  getProductOffers(options){
    var defaults = {
      url : this._ajaxUtil.actionUrls().productOffer
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  private extractData(res:Response){
      let bo = res.json().data.records; //for external urls
      return bo||[];
  }

  getProductOffersCurrencies(options){
    var defaults = {
      url : this._ajaxUtil.actionUrls().currencies
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  private extractDataForCurrencies(res:Response){
  let bo = res.json().data;
  return bo||[];
  }

  getFilteredProductOffers(query:string):Observable<any>{
    const url = `${this._productOfferUrl}${query}`;
      return this._http.get(url)
              .map(this.extractFilteredData)
              .catch(this.handleError);
  }

  private extractFilteredData(res:Response){
    let bo = res.json().data.records;
    return bo||[];
  }

  private handleError(error:Response|any){
    let errMsg  : string;
    if(error instanceof Response){
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    }
    else{
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }
  hidePO(options){
      var data = options.data;
      var defaults = {
        url : this._ajaxUtil.actionUrls().productOffer + '/' + data.productOfferId + '/' +'hide?hide=true',
        type : 'PUT'
      };
      this._ajaxUtil.processRequest(defaults, options);
    }

    hideData(res: Response){
      let result = res.json();
      return result;
    }
  unHidePO(options){
      var data = options.data;
      var defaults = {
        url : this._ajaxUtil.actionUrls().productOffer + '/' + data.productOfferId + '/' +'hide?hide=false',
        type : 'PUT'
      };
      this._ajaxUtil.processRequest(defaults, options);
    }

    unHideData(res: Response){
      let result = res.json();
      return result;
    }

    exportToCSV(options) {
      const defaults = {
          contentType: 'text/csv',
          responseType: 'blob',
          url: this._ajaxUtil.actionUrls().exportToCSVPO,
          type: 'POST'
      };
      return this._ajaxUtil.processRequest(defaults, options);
  }

  }
