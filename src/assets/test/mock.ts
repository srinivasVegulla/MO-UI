import { IdleExpiry } from '@ng-idle/core';

export { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
export { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, DebugElement, ChangeDetectorRef, ElementRef } from '@angular/core';
export { Idle, IdleExpiry } from '@ng-idle/core';
export { MockBackend } from '@angular/http/testing';
export { Keepalive } from '@ng-idle/keepalive';
export { RouterTestingModule } from '@angular/router/testing';
export { FormsModule, ReactiveFormsModule, FormBuilder, NgForm, FormGroup, FormControl } from '@angular/forms';
export { NgxAsideModule } from 'ngx-aside';
export { Router, RouterModule, ActivatedRoute } from '@angular/router';
export { BaseRequestOptions, Http } from '@angular/http';
export { By } from '@angular/platform-browser';
export {
    Language, LocaleService, LocaleConfig, LocaleStorage, TranslationModule, TranslationService,
    TranslationProvider, TranslationHandler, TranslationConfig, TranslatePipe,
} from 'angular-l10n';
export { HttpClient, HttpHandler } from '@angular/common/http';
export { HttpClientTestingModule } from '@angular/common/http/testing';

export { AuthenticationService } from './../../app/security/authentication.service';
export { utilService } from './../../app/helpers/util.service';
export { UtilityService } from './../../app/helpers/utility.service';
export { ajaxUtilService } from './../../app/helpers/ajaxUtil.service';
export { UrlConfigurationService } from './../../app/helpers/url.configuration.service';
export { sharedService } from './../../app/productOffer/sharedService';
export { contextBarHandlerService } from './../../app/helpers/contextbarHandler.service';
export { TreeHierarchyService } from './../../app/treeHierarchy/treeHierarchy.service';
export { SharedPricelistService } from './../../app/sharedPricelist/shared.pricelist.service';
export { PriceableItemTemplateService } from './../../app/priceableItemTemplates/priceableItemTemplate.service';
export { dateFormatPipe } from './../../app/helpers/dateFormat.pipe';
export { KeysPipe } from './../../app/helpers/keys.pipe';
export { showOperatorPipe } from './../../app/helpers/showOperator.pipe';
export { LowerCasePipe } from './../../app/helpers/lowerCase.pipe';
export { AddSubscriptionPropertiesService } from
    './../../app/productOffer/subscriptionProperties/addSubscriptionProperties/addSubscriptionProperties.services';
export { ProductService } from './../../app/productOffer/productOffer.service';
export { ApprovalService } from '../../app/approval/approval.service';
export { SubscriptionpropertiesService } from './../../app/productOffer/subscriptionProperties/subscriptionProperties.services';
export { BundleService } from './../../app/bundle/bundle.service';
export { Observable } from 'rxjs/Observable';
export { modalService } from './../../app/helpers/modal-dialog/modal.service';
export { ProductOffersListService } from './../../app/productOfferList/productOfferList.service';
export { RatesService } from './../../app/rates/rates.service';
export { priceableItemDetailsService } from './../../app/priceableItemDetails/priceableItemDetails.service';
export { PiTemplateDetailsService } from './../../app/priceableItemTemplates/piTemplateDetails/piTemplateDetails.service';
export { CapabilityService } from './../../app/helpers/capabilities.service';
export { ObjectToArrayPipe } from './../../app/helpers/ObjectToArray.pipe';
export function getWindow() { return window; }

const fixtureBody = `<div class="offeringsSkeleton"></div>    
                    <div id="piCard"></div> 
                    <div id="sample"></div>`;
document.body.insertAdjacentHTML(
    'afterbegin',
    fixtureBody);
export const svcData = {
    data: {
        name: 'Adjustment Reason 1', id: 1, entityId: 1, auditId: 1, param: true, addRemovePoPi: true,
        offeringLocation: 'subscriptionProperty', type: 'ProductOffer', productOfferId: 1, offerId: 1, effDateId: 1,
        productSpecId: 1, productOfferName: 'Sample PO', productOfferDisplayName: 'Sample PO', pricelistId: 1,
        scrollable: false, error: 'error', bundle: false, scheduleId: 1, order: 1, scheduleID: 1, fromScheduleId: 1, toScheduelId: 1
    },
    reasons: { records: { totalCount: 0 } },
    error: { message: 'sample error' },
    loginInfo: { username: 'admin', password: 123, us: '? Ericsson Enterprise and Cloud Billing, 2017 All rights reserved' },
    authentication: { data: { username: 'admin', password: 123, access_token: true, refresh_token: true }, 
    success: () => {
    } }
};
export const keyEventData = { value: 'Escape', keyCode: 27, preventDefault: () => { }, key: 1, target: {selectionStart: 0}};
export const loadData = { first: 0, sortOrder: 1, index: 1, sortField: 'name', order: 1, type: 'ok', defaultSortColumn: 'displayName'};
export const showHidefunc = { show: () => { }, hide: () => { }, unsubscribe: () => { } };
export const pagination = { page: 1, reset: () => { return {page: 1,scrollPageSize:2}; }, scrollPageSize: 2, next: () => { } };
export const calendarPropertiesList = {calendarId: 11231, combinedweekend: false, description: "test", descriptionId: 29852, displayName: "", displayNameId: 29851, name: "Calendar1", nameId: 29850, timezoneoffset: 0, usageCount: 1
};
export const calendarInfoRec = {currentPage: 1, filter: {name: "Calendar1"}, queryString: "query=name=='Calendar1'&loggedInLangCode=us", records:{calendarId: 11231, combinedweekend: false,description: "test", descriptionId: 29852, displayNameId: 29851, name: "Calendar1", nameId: 29850,timezoneoffset: 0, usageCount: 1}, totalCount: 1, totalPageSize: 1, totalPages: 1}
export const loadCalData = { first: 0, sortOrder: 1, index: 1, sortField: 'name', order: 1, type: 'ok', defaultSortColumn: 'itemInstanceName'};
export const caldata = { 
    records: 
    { calendarId: 16389,itemInstanceDescription: null,itemInstanceDescriptionId: 49508,itemInstanceDisplayName: null,itemInstanceDisplayNameId: 49510,itemInstanceName: "AudioConfConn",itemInstanceNameId: 49509,offerDescription: null, offerDescriptionId: 49438,offerDisplayName: "sss",offerDisplayNameId: 49437,offerName: "Copy of abc 12121212",offerNameId: 49436} 
};
export const loadAuditData = { first: 0, sortOrder: 1, index: 1, sortField: 'name', order: 1, type: 'ok', defaultSortColumn: 'createDt'};
export const loadRateTableData = { first: 0, sortOrder: 1, index: 1, sortField: 'name', order: 1, type: 'ok', defaultSortColumn: 'ptDisplayName'};
export class MockExpiry extends IdleExpiry {
    public lastDate: Date;
    public mockNow: Date;
    last(value?: Date): Date {
      if (value !== void 0) {
        this.lastDate = value;
      }
      return this.lastDate;
    }
    now(): Date {
      return this.mockNow || new Date();
    }
  }
  export const approvals = { Capabilities: {Properties_Edit : true}, approval: {enableApprovalsEdit: true, }};
  export const approvalData = { Capabilities: {Properties_Edit : false}, approval: {enableApprovalsEdit: false, }};
