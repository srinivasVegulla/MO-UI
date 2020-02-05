import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ajaxUtilService } from '../helpers/ajaxUtil.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Injectable()
export class BundleService {

    constructor(private _ajaxUtil: ajaxUtilService) { }

    getBundleData(options) {
        const data = options.data;
        const defaults = {
            url: this._ajaxUtil.actionUrls().bundle + '/' + data.bundleId
        };
        this._ajaxUtil.processRequest(defaults, options);
    }

    deleteBundle(options) {
        const data = options.data;
        const defaults = {
            url: this._ajaxUtil.actionUrls().productOffer + '/' + data.bundleId,
            type: 'DELETE'
        };
        this._ajaxUtil.processRequest(defaults, options);
    }

//selected Bundle enabling add and remove buttons in PO if requirements are satisying
  public selectedBundleCheckPo = new BehaviorSubject<object>({});
  observableSelectedBundleCheckPo = this.selectedBundleCheckPo.asObservable();
  changeSelectedBundleCheckPo(value: object) {
    this.selectedBundleCheckPo.next(value);
  }

}