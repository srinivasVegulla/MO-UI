import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { ajaxUtilService } from '../../helpers/ajaxUtil.service';

@Injectable()
export class PItemplatesRateTableService {

  constructor(private _ajaxUtil: ajaxUtilService) { }

  getRateTableData(options) {
    const data = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().getPItemplatesRateTable + data.piId
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
}
