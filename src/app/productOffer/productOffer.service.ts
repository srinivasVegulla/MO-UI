import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ajaxUtilService } from '../helpers/ajaxUtil.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Injectable()
export class ProductService {

  public _deletePOUrl = "/svc/mo-ProductOffer";
  productOfferForm: Object = {};
  options: RequestOptions;

  public nextStateURL = new BehaviorSubject<string>("");
  changeNextStateURL(value: string) {
    this.nextStateURL.next(value);
  }
  public saveProductOffer = new BehaviorSubject<boolean>(false);
  changeSaveProductOffer(value) {
    this.saveProductOffer.next(value);
  }
  constructor(private _http: Http, private _ajaxUtil: ajaxUtilService) { }

  getProduct(options) {
    const data = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().productOffer + "/" + data.productOfferId
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  getCurrenciesAndPartitionsList(options) {
    const defaults = {
      url: this._ajaxUtil.actionUrls().CurrenciesAndPartitions
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  getCreatePOConfig(options) {
    const defaults = {
      url: this._ajaxUtil.actionUrls().createPOConfig
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  private handleError(error: Response) {
    return Observable.throw(error.json().error || 'Server error');

  }
  createPOForm(obj, isSave, formType) {
    if (obj) {
      for (const key in obj) {
        this.productOfferForm[key] = obj[key];
      }
    }

    if (isSave == true) {
      ;
      this.changeSaveProductOffer(true);
    }
  }
  createProductOffer(options) {
    const formData = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().productOffer,
      type: 'POST'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  deletePODetail(options) {
    const data = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().productOffer + '/' + data.productOfferId,
      type: 'DELETE'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  getPONameAvailability(options) {
    const data = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().searchName + "'" + data.productOfferName + "'"
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  getPODisplayNameAvailability(options) {
    const data = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().searchDisplayName + "'" + data.productOfferDisplayName + "'"
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  deleteData(res: Response) {
    const result = res.json();
    return result;
  }

  updateProductOffer(options) {
    const serviceData = options.data;
    let updateUrl;
      switch (serviceData.type) {
      case 'PO':
          updateUrl = this._ajaxUtil.actionUrls().selectiveUpdateOffering;
        break;
      case 'BUNDLE':
          updateUrl = this._ajaxUtil.actionUrls().selectiveUpdateBundle;
        break;
      default:
        break;
    }
    const defaults = {
      url: updateUrl + serviceData.productOfferId + serviceData.fields,
      type: 'PUT'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  private handleErrorDeletePO(error: Response) {
    return Observable.throw(error.json() || 'Server error');
  }

  //selected PO enabling add and remove buttons if requirements are satisying
  public selectedPoCheckPi = new BehaviorSubject<object>({});
  observableSelectedPoCheckPi = this.selectedPoCheckPi.asObservable();
  changeSelectedPoCheckPi(value: object) {
    this.selectedPoCheckPi.next(value);
  }

  copyOfferingData(options) {
    const offerId = options.data.offerId;
    const defaults = {
      url: this._ajaxUtil.actionUrls().copyOfferings + offerId,
      type: 'POST'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  getPOConfiguration(options) {
    const data = options.data;
    const defaults = {
        url: this._ajaxUtil.actionUrls().getOfferingConfiguration + data.productOfferId
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
}
