import { Component, Injectable, OnInit, OnDestroy } from '@angular/core';
import { ajaxUtilService } from '../helpers/ajaxUtil.service';

@Injectable()
export class CapabilityService {
    loggedInUserCapabilities:any = {};

    constructor(private _ajaxUtil: ajaxUtilService) {}

    fetchUserCapabilities(options) {
        const defaults = {
            url: this._ajaxUtil.actionUrls().capabilities
        };
        this._ajaxUtil.processRequest(defaults, options);
    }

    getWidgetCapabilities(view) {
        if (Object.keys(this.loggedInUserCapabilities).length === 0) {
            this.setUserCapabilities();
        }
        if (this.loggedInUserCapabilities.hasOwnProperty(view)) {
            return this.loggedInUserCapabilities[view];
        } else {
            return true;
        }
    }

    isDefined(value) { return typeof value !== 'undefined'; }

    findPropertyCapability(widget, property) {
        if (Object.keys(this.loggedInUserCapabilities).length === 0) {
            this.setUserCapabilities();
        }
        if (this.loggedInUserCapabilities.hasOwnProperty(widget)) {
            const widgetCapabilities = this.loggedInUserCapabilities[widget];
            if (widgetCapabilities.hasOwnProperty(property) && this.isDefined(property)) {
                return (widgetCapabilities[property] === null ? false : widgetCapabilities[property]);
            } else {
                return false;
            }
        }
    }

    setUserCapabilities() {
        if (sessionStorage.getItem('loggedInUserCapabilities') !== undefined) {
            this.loggedInUserCapabilities = JSON.parse(sessionStorage.getItem('loggedInUserCapabilities'));
        }
    }
}