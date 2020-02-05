import { Component, Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { ajaxUtilService } from '../helpers/ajaxUtil.service';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class InuseSharedRatelistService {

  constructor(private _ajaxUtil: ajaxUtilService) { }

  getInUseSharedRatelist(options) {
    const templateId = options.data.Id;
    const offeringLocations = options.data.offeringLocation;
    let updatedSharedRatelist;
    switch (offeringLocations) {
      case 'priceableItemTemplateGrid':
        updatedSharedRatelist = this._ajaxUtil.actionUrls().getPiTemplatesSharedRatelist;
        break;
      default:
        break;
    }
    const defaults = {
      url: updatedSharedRatelist + templateId
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
}
