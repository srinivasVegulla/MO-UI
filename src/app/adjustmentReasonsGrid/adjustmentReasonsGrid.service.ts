import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { ajaxUtilService } from '../helpers/ajaxUtil.service';

@Injectable()

export class AdjustmentReasonsGridService {

    constructor(private _http: Http, private _ajaxUtil: ajaxUtilService) {

    }

    getAllAdjustmentReasons(options) {
    const defaults = {
            url: this._ajaxUtil.actionUrls().getAdjustmentsReasons
        };
        this._ajaxUtil.processRequest(defaults, options);
    }
    
    searchAdjustmentReason(options) {
        const data = options.data;
        const defaults = {
                url: this._ajaxUtil.actionUrls().searchAdjustmentName + "'" + data.name + "'"
            };
            this._ajaxUtil.processRequest(defaults, options);
        }

    createAdjustmentReason(options) {
        const defaults = {
            url: this._ajaxUtil.actionUrls().createAdjustmentReason,
            type: 'POST'
        };
        this._ajaxUtil.processRequest(defaults, options);
    }

    updateAdjustmentReason(options) {
        const specId = options.data.id;
        const defaults = {
            url: this._ajaxUtil.actionUrls().createAdjustmentReason + '/' + specId,
            type: 'PUT'
        };
        this._ajaxUtil.processRequest(defaults, options);
    }
}
