import { Injectable } from '@angular/core';
import { Headers,Http,Response } from '@angular/http';
import { ajaxUtilService } from '../helpers/ajaxUtil.service';

@Injectable()

export class InUseOfferingsModalDialogService {

  constructor(private _http: Http, private _ajaxUtil: ajaxUtilService) {

  }

  getInUseOfferings(options) {
    const specId = options.data.Id;
    const offeringLocations = options.data.offeringLocation;
    let updateOfferings;
    switch (offeringLocations) {
      case 'subscriptionProperty':
      updateOfferings = this._ajaxUtil.actionUrls().subscriptionInUseOfferings;
        break;
      case 'productOfferList':
      updateOfferings = this._ajaxUtil.actionUrls().poUsedLocations;
        break;
      case 'priceableItemTemplateGrid':
        updateOfferings = this._ajaxUtil.actionUrls().getPiTemplatesInUseOffers;
        break;
      case 'priceableItemTemplateDetails':
        updateOfferings = this._ajaxUtil.actionUrls().getPiTemplatesInUseOffers;
        break;
      case 'extendedProperties':
        updateOfferings = this._ajaxUtil.actionUrls().findInUseOfferingsExtendedProp;
        break;
      case 'sharedPriceList':
        updateOfferings = this._ajaxUtil.actionUrls().getSharedPLInuseOffering;
        break;
      default:
        break;
    }
    const defaults = {
      url : updateOfferings + specId
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  getPoUsedLocations(options) {
    const offerId = options.data;
    const defaults = {
      url: this._ajaxUtil.actionUrls().poUsedLocations + offerId
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
}
