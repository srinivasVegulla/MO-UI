import { Injectable } from '@angular/core';
import {Headers,Http,Response } from '@angular/http';
import { ajaxUtilService } from '../helpers/ajaxUtil.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()

export class TreeHierarchyService {

  constructor(private _http:Http, private _ajaxUtil: ajaxUtilService) {

  }

  getSelectedOfferData(options){
  	var paramData = options.data;
    var defaults = {
      url : this._ajaxUtil.actionUrls().breadcrumb+"/"+paramData.id
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
}