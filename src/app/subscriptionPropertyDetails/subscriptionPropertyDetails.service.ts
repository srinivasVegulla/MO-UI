import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { ajaxUtilService } from '../helpers/ajaxUtil.service';

@Injectable()

export class SubscriptionPropertyDetailsService {

    constructor(private _http: Http, private _ajaxUtil: ajaxUtilService) {

    }

    getSubscriptionProperties(options) {
    const defaults = {
            url: this._ajaxUtil.actionUrls().subscriptionPropertyDetails
        };
        this._ajaxUtil.processRequest(defaults, options);
    }

    getSubscriptionPropertyTypes(options) {
    const defaults = {
            url: this._ajaxUtil.actionUrls().subscriptionPropertyTypes
        };
        this._ajaxUtil.processRequest(defaults, options);
    }

    getInUseOfferings(options) {
        const specId = options.data.Id;
    const defaults = {
            url: this._ajaxUtil.actionUrls().subscriptionInUseOfferings + specId
        };
        this._ajaxUtil.processRequest(defaults, options);
    }

    getAllEditingForSubscriptions(options) {
    const defaults = {
            url: this._ajaxUtil.actionUrls().editingForSubscription
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  deleteSubscriptionProperty(options){
    const specId = options.data;
    const defaults = {
      type : 'DELETE',
      url : this._ajaxUtil.actionUrls().deleteSubscriptionProperty + specId
        };
        this._ajaxUtil.processRequest(defaults, options);
    }

    getSubscriptionPropertiesConfig(options) {
        const specId = options.data.body;
        const defaults = {
            url: this._ajaxUtil.actionUrls().subscriptionPropertyType + specId
        };
        this._ajaxUtil.processRequest(defaults, options);
    }

    createSubscriptionProperty(options) {
        const defaults = {
            url: this._ajaxUtil.actionUrls().createSubscriptionProperty,
            type: 'POST'
        };
        this._ajaxUtil.processRequest(defaults, options);
    }

    getPropertyNameAvailability(options) {
        const defaults = {
            url: this._ajaxUtil.actionUrls().createSubscriptionProperty,
            type: 'GET'
        };
        this._ajaxUtil.processRequest(defaults, options);
    }

    searchSubscriptionPropertyName(options){
        const data = options.data;
        const defaults = {
            url: this._ajaxUtil.actionUrls().SearchSubPropertyName + "'" + data.newPropertyName + "' and category=='" + data.newPropertyCategory + "'" ,
        };
        this._ajaxUtil.processRequest(defaults, options);
    }

    updateSubscriptionProperty(options) {
        const specId = options.data.id;
        const defaults = {
            url: this._ajaxUtil.actionUrls().updateSubscriptionProperty + specId + options.data.fields,
            type: 'PUT'
        };
        this._ajaxUtil.processRequest(defaults, options);
    }
}
