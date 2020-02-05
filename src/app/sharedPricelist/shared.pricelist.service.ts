import { Component, Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { ajaxUtilService } from '../helpers/ajaxUtil.service';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SharedPricelistService {

  public rateTableMapped = new BehaviorSubject<boolean>(false);
  isRateTableMapped(value: boolean) {
    this.rateTableMapped.next(value);
  }

  // Observable to hide / unhide create shared Pricelist widget
  public hideSharedPricelist = new BehaviorSubject<boolean>(false);
  changehideSharedPricelist(value) {
    this.hideSharedPricelist.next(value);
  }

    // selected sharedPricelist sending to breadcrumb
  public selectedSharedListBreadcrumbData = new BehaviorSubject<object>({ obj: {}, path: '', Level: '' });
  observableSharedListBreadcrumbData = this.selectedSharedListBreadcrumbData.asObservable();
  changeSelectedSharedListBreadcrumbData(value: object) {
    this.selectedSharedListBreadcrumbData.next(value);
  }

  // Displaying Title
  public displayName = new BehaviorSubject<string>('');
  currentDisplayName = this.displayName.asObservable();
  changedisplayName(message: string) {
    this.displayName.next(message);
  }
  constructor(private _ajaxUtil: ajaxUtilService) { }

  getSharedPricelists(options) {
    const defaults = {
      url: this._ajaxUtil.actionUrls().getSharedPricelist
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  SearchSharedRateName(options) {
    const data = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().SearchRateListName + "'" + data.name + "'"
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
  
  getSharedPricelist(options) {
    const data = options.data;
    const defaults = {
      url: `${this._ajaxUtil.actionUrls().getSharedPricelist}` + `/` + `${data.pricelistId}`
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
  createSharedPricelist(options) {
    const defaults = {
      url: this._ajaxUtil.actionUrls().getAllSharedPricelist,
      type: 'POST'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
  copySharedPricelist(options) {
    const pricelistId = options.data.priceListId
    const defaults = {
      url: this._ajaxUtil.actionUrls().getAllSharedPricelist + '/' + pricelistId,
      type: 'POST'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
  deleteSharedPricelist(options) {
    const data = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().getAllSharedPricelist + '/' + data.pricelistId,
      type: 'DELETE'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
  showInUseOfferings(options) {
    const data = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().getAllSharedPricelist + '/offerings/' + data.pricelistId,
      type: 'GET'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
  showInUseSubscribers(options) {
    const data = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().getAllSharedPricelist + '/subscribers',
      type: 'GET'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
  updateSharedPricelist(options) {
    const data = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().getAllSharedPricelist,
      type: 'PUT'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
  getPricelistExtendedProps(options) {
    const data = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().getAllSharedPricelist + '/' + data.pricelistId,
      type: 'GET'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
  getSharedRatesItem(options) {
    const data = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().getSharedRatesItem + '/' + data.pricelistId,
      type: 'GET'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
  getptMappings(options) {
    const data = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().paramTableMappings + '/' + data.pricelistId,
      type: 'GET'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
  addRateTables(options) {
    const data = options.data;
    const defaults = {
      url : this._ajaxUtil.actionUrls().addParamTables,
      type : 'POST'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
  getPricelistInUseInfo(options) {
    const data = options.data;
    const defaults = {
      url: `${this._ajaxUtil.actionUrls().getPricelist}` + '/inUseInfo/' + `${data.pricelistId}`,
      type: 'GET'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
}
