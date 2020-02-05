import { Component, Injectable} from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ajaxUtilService } from '../helpers/ajaxUtil.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { modalService } from '../helpers/modal-dialog/modal.service';

@Injectable()
export class RatesService {

     public nextStateURL = new BehaviorSubject<string>("");
    changeNextStateURL(value:string){
        this.nextStateURL.next(value);
     }

    constructor(private _http: Http, private _ajaxUtil: ajaxUtilService,
      private _modalService: modalService) {}
       public _deleteRateUrl = "";
    
     getRateSchedules(options) {
      const data = options.data;
      const defaults = {
        url : this._ajaxUtil.actionUrls().rateSchedule+"/"+ data.paramTableId + "/" +data.itemTemplateId + "/" +data.pricelistId
      };
      this._ajaxUtil.processRequest(defaults, options);
    }

    getParamTables(options) {
      const data = options.data;
      const defaults = {
        url : this._ajaxUtil.actionUrls().getRates+"/"+ data.offerId + "/"+ data.piInstanceId
      };
      this._ajaxUtil.processRequest(defaults, options);
    }

    savePIRateSchedules(options){
        const defaults = {
        url : this._ajaxUtil.actionUrls().editRateSchedule,
        type : 'PUT'
      };
      this._ajaxUtil.processRequest(defaults, options);
    }

    getRateTables(options) {
      const data = options.data;
      const defaults = {
        url : this._ajaxUtil.actionUrls().rule+"/"+ data.selectedScheduleId
      };
      this._ajaxUtil.processRequest(defaults, options);
    }

   deleteRateDetail(options){
    const data = options.data;
    const defaults = {
        url : this._ajaxUtil.actionUrls().rule +"/"+ data.scheduleId +"/current/" + data.order,
        type : 'DELETE'
      };
      this._ajaxUtil.processRequest(defaults, options);
    }

    private  handleError(error:Response|any) {
      return Observable.throw(error);
    }

    deleteScheduleDetail(options){
      const data = options.data;
      const defaults = {
          url : this._ajaxUtil.actionUrls().rateSchedule+"/"+ data.scheduleID,
          type : 'DELETE'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  editRules(options) {
    const data = options.data;
    const defaults = {
      url : this._ajaxUtil.actionUrls().rule+"/"+ data.scheduleId,
      type : 'POST'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

    public editRateSourceUnsavedChangesHandler = new BehaviorSubject<string>("");
     public editUnsavedCancelButtonHandler = new BehaviorSubject<boolean>(false);
    changeRateSourceCancelHandler(value) {
        this.editUnsavedCancelButtonHandler.next(value);
    }

    getPricelist(options){
      const defaults = {
        url : this._ajaxUtil.actionUrls().getAllSharedPricelist,
        type : 'GET'
      };
      this._ajaxUtil.processRequest(defaults, options);
    }

    getRqrdPricelist(options){
      const data = options.data;
      const defaults = {
        url : this._ajaxUtil.actionUrls().getRqrdPricelist + data.itemtemplateid + '/' + data.itemTemplateId + '/' + data.paramtableid + '/' + data.paramtableId,
        type : 'GET'
      };
      this._ajaxUtil.processRequest(defaults, options);
    }

    updatePricelistMappings(options){
      const defaults = {
      url : this._ajaxUtil.actionUrls().updatePricelistMappings,
      type : 'PUT'
        };
        this._ajaxUtil.processRequest(defaults, options);
    }

    getParamTablesMetaData(options) {
      const data = options.data;
      const defaults = {
        url : this._ajaxUtil.actionUrls().paramTablesMetaData + '/' + data.id,
        type : 'GET'
      };
      this._ajaxUtil.processRequest(defaults, options);
    }
   
  
    getRateSchedulesByParameterTable(options) {
      const data = options.data;
      const defaults = {
        url : this._ajaxUtil.actionUrls().getRateSchedulesByPT + data.paramTableId + '/schedule-id/' + data.toScheduleId
      };
      this._ajaxUtil.processRequest(defaults, options);
    }

    copyRateSchedule(options) {
        const data = options.data;
        const defaults = {
          url : this._ajaxUtil.actionUrls().copyRateSchedule + data.fromScheduleId + '/to/' + data.toScheduelId,
          type : 'POST'
        };
        this._ajaxUtil.processRequest(defaults, options);
    }

    // send boolean after copy rates to rule set
    public isCopyRates = new BehaviorSubject<boolean>(false);
    copyRates(value: boolean) {
      this.isCopyRates.next(value);
    }

    exportToXML(options) {
      const data = options.data;
      const defaults = {
          contentType: 'text/xml',
          responseType: 'blob',
          url: this._ajaxUtil.actionUrls().rule + '/' + data.scheduleId + '/' + 'exportToXml',
          type: 'POST'
      };
      return this._ajaxUtil.processRequest(defaults, options);
  }
  importToXML(options) {
    const defaults = {
        contentType: 'application/json',
        url: this._ajaxUtil.actionUrls().rule + '/convertXmlToJson',
        type: 'POST'
    };
    return this._ajaxUtil.processRequest(defaults, options);
  }
}
