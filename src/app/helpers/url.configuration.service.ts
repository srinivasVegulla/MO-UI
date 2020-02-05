import { Component, Injectable, OnInit, OnDestroy } from '@angular/core';

@Injectable()
export class UrlConfigurationService implements OnInit, OnDestroy {
  public server: String;
  private prefix: String;
  private extPrefix: String;
  private staticPrefix: String;
  public actionUrls: any;
  public externalUrls: any;
  public staticUrls: any;

  constructor() {
    this.server = '';
    this.prefix = '/api/';
    this.extPrefix = '/ext/';
    this.staticPrefix = '/static/';
    this.setUrls();
    this.appendAppContext();
  };

  ngOnInit() {
  };

  ngOnDestroy() {
  };

  private setUrls() {
    this.actionUrls = {
      userDetails: 'User',
      productOffer: 'ProductOffer',
      bundle: 'ProductOfferBundle',
      priceableItems: 'PriceableItemInstance/',
      pricelistMapping: 'PricelistMapping',
      subscriptionProperties: 'SubscriptionProperty/product-offer/',
      POWithoutAvailableDates: 'ProductOffer/WithNoAvailableDates',
      POWithAvailableDates: 'ProductOffer/WithAvailableDates',
      rule: 'RuleSet',
      rateSchedule: 'RateSchedule',
      editRateSchedule: 'RateSchedule/all',
      getRates: 'RateSchedule/Rates',
      CurrenciesAndPartitions: 'MasterData/CurrenciesAndPartitions',
      currencies: 'MasterData/Currencies',
      priceableItemTemplate: 'PriceableItemTemplate/',
      getSubscriptionProperties: 'SubscriptionProperty/',
      addSubscriptions: 'SubscriptionProperty/addSubscriptionPropertyToOfferings/product-offer/',
      deleteSubscription: 'SubscriptionProperty/product-offer/',
      searchName: 'ProductOffer?query=name==',
      searchDisplayName: 'ProductOffer?query=displayName==',
      updatePriceableItemInstance: 'PriceableItemInstance/',
      getAllSharedPricelist: 'Pricelist',
      breadcrumb: 'Hierarchy',
      localization: 'Localization',
      getPricelist: 'Pricelist',
      getRqrdPricelist: 'Pricelist/rqrdSharedPricelist/',
      getSharedRatesItem: 'Pricelist/mapped-param-tables',
      updatePricelistMappings: 'PricelistMapping',
      getExisitingPoInBundle: 'ProductOfferBundle/ProductOffers/',
      addPoToBundle: 'ProductOfferBundle/',
      removePoFromBundle: 'ProductOfferBundle/',
      getPoForSelectedBundle: 'ProductOfferBundle/FindProductOffers/',
      getApprovals: 'Approvals/offerings/pending-approvals/',
      getRateApprovals: 'Approvals/rates/pending-approvals/',
      saveApprovals: 'Approvals/approve-approvals',
      getSharedPricelist: 'Pricelist/shared',
      SearchRateListName:'Pricelist/shared?query=name==',
      getAuditLogList: 'AuditLog',
      exportToCSV: 'AuditLog/exportToCsv',
      exportToCSVPO: 'ProductOffer/exportToCsv',
      subscriptionPropertyDetails: 'SubscriptionProperty',
      getRateScheduleHistory:'AuditLog',
      subscriptionPropertyTypes: 'SubscriptionProperty/Type',
      subscriptionInUseOfferings: 'SubscriptionProperty/InUseOfferings/subscription-property/',
      editingForSubscription: 'SubscriptionProperty/EditingSubscriptionFilter',
      subscriptionPropertyType: 'SubscriptionProperty/subscription-property/details/',
      paramTablesMetaData: 'ParameterTable/metadata',
      paramTableMappings: 'Pricelist/param-table-mapping',
      addParamTables: 'Pricelist/add-param-tables',
      deleteSubscriptionProperty: 'SubscriptionProperty/subscription-property/',
      updateSubscriptionProperty: 'SubscriptionProperty/',
      createSubscriptionProperty: 'SubscriptionProperty',
      SearchSubPropertyName:'SubscriptionProperty?query=name==',
      poUsedLocations: 'ProductOffer/Locations/',
      getPiTemplatesList: 'PriceableItemTemplate/GridView',
      getPiTemplatesType: 'PriceableItemTemplate/view-type',
      createPiTemplatesType: 'PriceableItemTemplate/create-type',
      getPiTemplatesInUseOffers: 'PriceableItemTemplate/InUseOfferings/priceable-item-template/',
      getPiTemplatesSharedRatelist: 'PriceableItemTemplate/InUseSharedRateList/priceable-item-template/',
      getPItemplateDetails: 'PriceableItemTemplate/priceable-item-template/',
      copyOfferings: 'ProductOffer/',
      getPItemplateCreateTypes: 'PriceableItemType',
      searchPItemplateName: 'PriceableItemTemplate?query=name==',
      createDiscount: 'Discount',
      getOfferingConfiguration: 'ProductOffer/checkConfig/',
      getPiAdjustmentsType: 'AdjustmentType/',
      getAdjustmentsReasons: 'AdjustmentsReasonCode',
      searchAdjustmentName: 'AdjustmentsReasonCode?query=name==',
      getPiTemplateAdjustments: 'Adjustment/adjustment-reason-code/pi-template/',
      getPiInstanceAdjustments: 'Adjustment/adjustment-reason-code/pi-instance/',
      createNRC: 'NonRecurring',
      getRateSchedulesByPT: 'RateSchedule/param-table-id/',
      deleteAdjustment: 'Adjustment/',
      copyRateSchedule: 'RuleSet/copy-rates/',
      deletePItemplate: 'PriceableItemTemplate/priceable-item-template/',
      rateChanges: 'AuditLog/rate-changes/',
      createRC: 'Recurring',
      createAdjustmentReason: 'AdjustmentsReasonCode',
      updateRC: 'Recurring/update-fields/',
      createUDRC: 'UnitDependentRecurring',
      updateUDRC: 'UnitDependentRecurring/update-fields/',
      updateDiscount: 'Discount/update-fields/',
      updateNRC: 'NonRecurring/update-fields/',
      updateUsageTemplate: 'Usage/update-fields/',
      findInUseOfferingsExtendedProp : 'PriceableItemTemplate/kind/',
      getPItemplatesRateTable: 'PriceableItemTemplate/rate-table/',
      updateOffering: 'ProductOffer/update-fields/',
      createAdjustmentsTemplate: 'Adjustment/adjustment-reason-code/',
      createAdjustmentInstance: 'Adjustment/pi-instance/',
      updateBundle: 'ProductOfferBundle/update-fields/',
      getSharedPLInuseOffering: 'Pricelist/offerings/',
      calendars: 'Calendar',
      searchCalendarName: 'Calendar?query=name==',
      getCalInusePi: 'Calendar/in-use-info/',
      calendarHoliday: 'Calendar/holiday/',
      calendarHolPeriod: 'Calendar/period/',
      calendarCode: 'Calendar/calendar-code/',
      localizationUpload: 'Localization/uploadFromCsv',
      calendarStandardDay: 'Calendar/standard-day/',
      deleteStandardPeriod: 'Calendar/standard-day/period/',
      saveCalendarStandardDefault: 'Calendar/standard-day',
      capabilities: 'UserCapabilties',
      selectiveUpdateOffering: 'ProductOffer/selective-update/',
      selectiveUpdateBundle: 'ProductOfferBundle/selective-update/',
      getPendingRateChanges: 'Approvals/rates/view-change-details/',
      getPendingOfferingChanges: 'Approvals/offering/view-change-details/',
      getSortFieldChanges: 'Approvals/change-history/'
    };
    this.externalUrls = {
      ticketLogin : 'MetranetTicket/encrypted-jwt'
    };

    this.staticUrls = {
      columnDef : 'default/gridViewConfig/',
      createPOConfig: 'default/gridViewConfig/createPOConfig.json',
      filteringTimeGap: 'default/MOProperties/FilterTimeGap.json'
    };
  }

  public myrestUrls() {
    const actionWithExt = Object.assign({}, this.actionUrls, this.externalUrls);
    return Object.assign({}, actionWithExt, this.staticUrls);
  }
  private appendAppContext() {
    for (const index in this.actionUrls) {
      if (this.actionUrls[index] !== undefined) {
        this.actionUrls[index] = this.server + '' + this.prefix + this.actionUrls[index];
      }
    }
    for (const index in this.externalUrls) {
      if (this.externalUrls[index] !== undefined) {
        this.externalUrls[index] = this.server + '' + this.extPrefix + this.externalUrls[index];
      }
    }
    for (const index in this.staticUrls) {
      if (this.staticUrls[index] !== undefined) {
        this.staticUrls[index] = this.server + '' + this.staticPrefix + this.staticUrls[index];
      }
    }
  }
}