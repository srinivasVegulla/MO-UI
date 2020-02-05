import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ajaxUtilService } from '../helpers/ajaxUtil.service';
import { checkAndUpdateElementInline } from '@angular/core/src/view/element';

@Injectable()
export class localizationService {

    constructor(private _http: Http, private _ajaxUtil: ajaxUtilService) {}

    getLocaleLable(options){
      const defaults = {
        url : this._ajaxUtil.actionUrls().localization + '/' + 'Language' + '?' + 'sort=order%7Casc'
      };
      this._ajaxUtil.processRequest(defaults, options);
    }
    getPropertyKindData(options) {
      const defaults = {
        url : this._ajaxUtil.actionUrls().localization
      };
      this._ajaxUtil.processRequest(defaults, options);
    }
    saveLocalizationData(options) {
    const defaults = {
      url: this._ajaxUtil.actionUrls().localization,
      type: 'PUT'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
  localizationData(options) {
    const serviceData = options.data;
    let updateUrl;
    if(serviceData !== undefined && serviceData !== '' && serviceData !== null){
      switch (serviceData.type) {
      case 'Localization':
        updateUrl = this._ajaxUtil.actionUrls().localization;
        break;
      case 'Offering':
        updateUrl = this._ajaxUtil.actionUrls().localization + '/' + 'subscribable-item' + '/' + serviceData.productOfferId;
        break;
      case 'PriceableItemTemplates':
        updateUrl = this._ajaxUtil.actionUrls().localization + '/' + 'pi-template' + '/' + serviceData.productOfferId;
        break;
        case 'PIDetails':
        updateUrl = this._ajaxUtil.actionUrls().localization + '/' + 'pi-instanceId' + '/' + serviceData.productOfferId;
        break;
      case 'Subscription':
        updateUrl = this._ajaxUtil.actionUrls().localization + '/' + 'subscription-properties' + '/' + serviceData.productOfferId;
        break;
      }
      const defaults = {
        url : updateUrl,
      type: 'GET'
    };
    this._ajaxUtil.processRequest(defaults, options);
    }
    }
    exportToCSV(options) {
      const defaults = {
        contentType: 'application/json',
        responseType: 'blob',
        url: this._ajaxUtil.actionUrls().localization + '/exportToCsv',
        type: 'POST'
      };
      return this._ajaxUtil.processRequest(defaults, options);
    }
    importToCSV(options) {
      const defaults = {
        url: this._ajaxUtil.actionUrls().localizationUpload,
        type: 'POST'
      };
      return this._ajaxUtil.processRequest(defaults, options);
    }
  }
