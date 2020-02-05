import { Component, Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ajaxUtilService } from '../../helpers/ajaxUtil.service';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()

export class PiTemplateDetailsService {

  public isPriceableItemTemplateUpdated = new BehaviorSubject<boolean>(false);

  constructor(private _http: Http, private _ajaxUtil: ajaxUtilService) { }

  getPriceableTemplateDetails(options) {
    const data = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().getPItemplateDetails + data.templateId + '/kind/' + data.kind
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  changeIsPItemplateDetailsUpdated(value) {
    this.isPriceableItemTemplateUpdated.next(value);
  }
}
