import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { ajaxUtilService } from '../helpers/ajaxUtil.service';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class PriceableItemTemplateService {

  public selectedPItemplateBreadcrumbData = new BehaviorSubject<object>({ obj: {}, path: '', Level: ''});
  public isCreatePopupClose = new BehaviorSubject<boolean>(false);

  constructor(private _ajaxUtil: ajaxUtilService) { }

  getPItemplatelist(options) {
    const defaults = {
      url: this._ajaxUtil.actionUrls().getPiTemplatesList
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  getPItemplateTypes(options) {
    const defaults = {
      url: this._ajaxUtil.actionUrls().getPiTemplatesType
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  createPItemplateTypes(options){
    const defaults = {
      url: this._ajaxUtil.actionUrls().createPiTemplatesType
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  getInUseOffers(options) {
    const data = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().getPiTemplatesInUseOffers + data.templateId
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  getChargeTypes(options) {
    const defaults = {
      url: this._ajaxUtil.actionUrls().getPItemplateCreateTypes
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  getPItemplateNameAvailability(options) {
    const data = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().searchPItemplateName + "'" + data.PItemplateName + "'"
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  createPItemplate(options) {
    const data = options.data;
    const PItemplateType = data.kind;
    let createPiTemplateCall;
    switch (PItemplateType) {
      case 'DISCOUNT':
        createPiTemplateCall = this._ajaxUtil.actionUrls().createDiscount;
        break;
      case 'NON_RECURRING':
        createPiTemplateCall = this._ajaxUtil.actionUrls().createNRC;
        break;
      case 'RECURRING':
        createPiTemplateCall = this._ajaxUtil.actionUrls().createRC;
        break;
      case 'UNIT_DEPENDENT_RECURRING':
        createPiTemplateCall = this._ajaxUtil.actionUrls().createUDRC;
        break;
      default:
        break;
    }
    const defaults = {
      url: createPiTemplateCall,
      type: 'POST',
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
  deletePItemplateRecord(options) {
    const data = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().deletePItemplate + data.templateId,
      type: 'DELETE'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  changePItemplateBreadcrumbData(value: object) {
    this.selectedPItemplateBreadcrumbData.next(value);
  }
}
