import { Component, Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { ajaxUtilService } from '../../helpers/ajaxUtil.service';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class PriceableItemAdjustmentsService {
  Piurl: any;
  CreatePiUrl: any;

  constructor(private _ajaxUtil: ajaxUtilService) { }

  getAdjustmentsReasons(options) {
    const defaults = {
      url: this._ajaxUtil.actionUrls().getAdjustmentsReasons
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  getPiAdjustmentsTypesToBeAdded(options){
    const piId = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().getPiAdjustmentsType
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  getPiAdjustments(options){
    const piId = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().getPiAdjustmentsType + piId
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  getDefaultAdjustments(options) {
    const defaultData = options.data;
    if (defaultData.isPIInstance) {
      this.Piurl = this._ajaxUtil.actionUrls().getPiInstanceAdjustments + defaultData.TemplateId;
    } else {
      this.Piurl = this._ajaxUtil.actionUrls().getPiTemplateAdjustments + defaultData.TemplateId;
    }
    const defaults = {
        url: this.Piurl
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  deleteAdjustments(options) {
    const propId = options.data;
    const defaults = {
       type : 'DELETE',
      url: this._ajaxUtil.actionUrls().deleteAdjustment + propId
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  createNewAdjustments(options) {
    const defaultData = options.data;
    if (defaultData.isPIInstance) {
      this.CreatePiUrl = this._ajaxUtil.actionUrls().createAdjustmentInstance + defaultData.ItemTemplateId;
    } else {
      this.CreatePiUrl = this._ajaxUtil.actionUrls().createAdjustmentsTemplate + defaultData.ItemTemplateId;
    }
    const defaults = {
       type : 'POST',
      url: this.CreatePiUrl
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

}
