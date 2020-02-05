// Angular core modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


// Third party modules
import { DataTableModule, SharedModule, CalendarModule, DropdownModule, MultiSelectModule, SelectButtonModule,TreeModule  } from 'primeng/primeng';
import { LocalizationModule, LocaleService, TranslationService } from 'angular-l10n';
import { TooltipModule } from 'ng2-tooltip';
import { NgxAsideModule } from 'ngx-aside';
import { DragulaModule } from 'ng2-dragula';
import { MomentModule } from 'angular2-moment';

// Feature modules
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { WelcomeComponent } from './Welcome.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { SystembarComponent } from './systembar/systembar.component';
import { ContextbarComponent } from './contextbar/contextbar.component';
import { ProductOfferComponent } from './productOffer/productOffer.component';
import { PermissionsComponent } from './productOffer/permissions/permissions.component';
import { PropertiesComponent } from './productOffer/properties/properties.component';
import { ExtendedPropertiesComponent } from './productOffer/extendedProperties/extendedProperties.component';
import { ProductOfferListComponent } from './productOfferList/productOfferList.component';
import { LoginComponent } from './login/login.component';
import { LocaleSelector } from './localeSelector/locale.selector.component';
import { PageNotFoundComponent } from './errorhandler/PageNotFound.component';
import { SubscriptionPropertiesComponent } from './productOffer/subscriptionProperties/subscriptionProperties.component';
import { OnetimeChargesComponent } from './productOffer/priceableItems/onetime-charges/onetime-charges.component';
import { RecurringChargesComponent } from './productOffer/priceableItems/recurring-charges/recurring-charges.component';
import { UsageChargesComponent } from './productOffer/priceableItems/usage-charges/usage-charges.component';
import { PriceableItemsComponent } from './productOffer/priceableItems/priceable-items/priceable-items.component';
import { DiscountChargesComponent } from './productOffer/priceableItems/discount-items/discount-charges.component';
import { showOperatorPipe } from './helpers/showOperator.pipe';
import { KeysPipe } from './helpers/keys.pipe';
import { PriceableItemDetailsComponent } from './priceableItemDetails/priceableItemDetails.component';
import { PIPropertiesComponent } from './priceableItemDetails/piproperties/PIProperties.component';
import { PiBillingComponent } from './priceableItemDetails/piBilling/piBilling.component';
import { PiBillingService } from './priceableItemDetails/piBilling/piBilling.service';
import { PIUnitDetailsComponent } from './priceableItemDetails/pi-unit-details/pi-unit-details.component';
import { RatesComponent } from './rates/rates.component';
import { ErrorTooltipComponent } from './errortooltip/errorTooltip.component';
import { SchedulesComponent } from './rates/schedules/schedules.component';
import { RatesTableComponent } from './rates/rates-table/rates-table.component';
import { AddPriceableItemsComponent } from './productOffer/priceableItems/add-priceable-items/add-priceable-items.component';
import { AddSubscriptionPropertiesComponent } from './productOffer/subscriptionProperties/addSubscriptionProperties/addSubscriptionProperties.component';
import { dateFormatPipe } from './helpers/dateFormat.pipe';
import { PrimeDragulaDirective } from './helpers/primeDragula.directive';
import { AddProductOfferToBundleComponent } from './ProductOfferInBundle/addProductOfferToBundle/addProductOfferToBundle.component';
import { TreeHierarchyComponent } from './treeHierarchy/treeHierarchy.component';
import { ProductOfferInBundleComponent } from './ProductOfferInBundle/productOfferInBundle.component';
import { SecureHtmlPipe } from './helpers/secureHtml.pipe';
import { CommonDialogComponent } from './helpers/common-dialog/common-dialog.component';
import { SharedPricelistComponent } from './sharedPricelist/shared.pricelist.component';
import { RlInUseSubscribersComponent } from './sharedPricelist/inUseSubscribers/inUseSubscribers.component';
import { SharedPricelistInUseInfoComponent } from './sharedPricelist/ratelistInUseInfo/sharedPricelistInUseInfo.component';
import { SharedPricelistExtendedPropertiesComponent } from './sharedPricelist/ratelistExtendedProperties/sharedPricelistExtendedProperties.component';
import { SharedPricelistDetailsComponent } from './sharedPricelist/ratelistDetails/sharedPricelistDetails.component';
import { CreateSharedPricelistComponent } from './sharedPricelist/createRatelist/createSharedPricelist.component';
import { SharedPricelistPropertiesComponent } from './sharedPricelist/ratelistProperties/sharedproperties.component';
import { SubscriptionPropertyDetailsComponent } from './subscriptionPropertyDetails/subscriptionPropertyDetails.component';
import { CreateSubscriptionPropertyComponent } from './subscriptionPropertyDetails/createSubscriptionProperty/createSubscriptionProperty.component';
import { InUseOfferingsModalDialogComponent } from './inUseOfferingsModalDialog/inUseOfferingsModalDialog.component';
import { TextFilterPipe } from './helpers/textFilter.pipe';
import { RatelistMappingsComponent } from './sharedPricelist/ratelistMappings/ratelistMappings.component';
import { ComboboxComponent } from './helpers/combobox/combobox.component';
import { RlAddRateTableComponent } from './sharedPricelist/addRateTable/addRateTable.component';
import { PriceableItemTemplateComponent } from './priceableItemTemplates/priceableItemTemplate.component';
import { InuseSharedRateListComponent } from './inUseSharedRateList/inUseSharedRateList.component';
import { RateChangesComponent } from './auditLog/rate-changes/rate-changes.component';
import { PiTemplateDetailsComponent } from './priceableItemTemplates/piTemplateDetails/piTemplateDetails.component';
import { PriceableItemAdjustmentComponent } from './priceableItemTemplates/priceableItemAdjustments/priceableItemAdjustments.component';
import { CreatePItemplatePopupComponent } from './priceableItemTemplates/createPItemplatePopup/createPItemplatePopup.component';
import { CopyRatesComponent } from './rates/copyRates/copyRates.component';
import { AdjustmentReasonsGridComponent } from './adjustmentReasonsGrid/adjustmentReasonsGrid.component';
import { PItemplateRateTableComponent } from './priceableItemTemplates/piTemplatesRateTable/piTemplatesRateTable.component';
import { InfiniteScrollDirective } from './helpers/InfiniteScroll.directive';
import { DropDownComponent } from './helpers/dropdown/dropdown.component';
import { CalendarListComponent } from './Calendars/calendars-list.component';
import { InUseCalendarsModalDialogComponent } from './Calendars/inUseCalendarsModalDialog/inUseCalendarsModalDialog.component';
import { LoaderComponent } from './helpers/loader/loader.component';
import { NumberDateFilterComponent } from './helpers/numberDateFilter/numberdatefilter.component';
import { CalendarStandardDayComponent } from './Calendars/calendar-standardday/calendar-standardday.component';
import { ObjectToArrayPipe } from './helpers/ObjectToArray.pipe';
import { LowerCasePipe } from './helpers/lowerCase.pipe';
import { OfferingChangesComponent } from './approval/offering-changes/offering-changes.component';

// Providers
import { ProductService } from './productOffer/productOffer.service';
import { ProductOffersListService } from './productOfferList/productOfferList.service';
import { AuthGuard } from './security/auth.guard';
import { AuthenticationService } from './security/authentication.service';
import { TokenInterceptor } from './security/token.interceptor';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { utilService } from './helpers/util.service';
import { Ng2DragDropModule } from 'ng2-drag-drop';
import { SubscriptionpropertiesService } from './productOffer/subscriptionProperties/subscriptionProperties.services';
import { sharedService } from './productOffer/sharedService';
import { cardService } from './productOffer/priceableItems/priceable-items/priceableService';
import { preventUnsavedChangesGuard } from './productOffer/prevent-unsaved-changes.gaurd';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { contextBarHandlerService } from './helpers/contextbarHandler.service';
import { priceableItemDetailsService } from './priceableItemDetails/priceableItemDetails.service';
import { RatesService } from './rates/rates.service';
import { ModalDialogComponent } from './helpers/modal-dialog/modal-dialog.component';
import { priceableItemDetailsUnsavedChangesGuard } from './priceableItemDetails/priceableItemDetails-unsaved-changes.guard';
import { ajaxUtilService } from './helpers/ajaxUtil.service';
import { modalService } from './helpers/modal-dialog/modal.service';
import { UrlConfigurationService } from './helpers/url.configuration.service';
import { AddPriceableItemService } from './productOffer/priceableItems/add-priceable-items/add-priceable-items.service';
import { CardControllerComponent } from './helpers/card-controller/card-controller.component';
import { AddSubscriptionPropertiesService } from './productOffer/subscriptionProperties/addSubscriptionProperties/addSubscriptionProperties.services';
import { TreeHierarchyService } from './treeHierarchy/treeHierarchy.service';
import { AccessGuard } from './productOffer/access-guard';
import { LocalizationComponent } from './localization/localization.component';
import { ApprovalComponent } from './approval/approval.component';
import { BundleComponent } from './bundle/bundle.component';
import { AddProductOfferToBundleService } from './ProductOfferInBundle/addProductOfferToBundle/addProductOfferToBundle.service';
import { ProductOfferInBundleService } from './ProductOfferInBundle/productOfferInBundle.service';
import { setAppInjector } from './helpers/service.injector';
import { SharedPricelistService } from './sharedPricelist/shared.pricelist.service';
import { UtilityService } from './helpers/utility.service';
import { SubscriptionPropertyDetailsService } from './subscriptionPropertyDetails/subscriptionPropertyDetails.service';
import { AuditLogComponent } from './auditLog/auditLog.component';
import { AuditLogService } from './auditLog/auditLog.service';
import { InUseOfferingsModalDialogService } from './inUseOfferingsModalDialog/inUseOfferingsModalDialog.service';
import { UnsavedChangesGuard } from './helpers/unsaved-changes-guard.service';
export function getWindow() { return window; }
import { PriceableItemTemplateService } from './priceableItemTemplates/priceableItemTemplate.service';
import { InuseSharedRatelistService } from './inUseSharedRateList/inUseSharedRateList.service';
import { PiTemplateDetailsService } from './priceableItemTemplates/piTemplateDetails/piTemplateDetails.service';
import { PriceableItemAdjustmentsService } from './priceableItemTemplates/priceableItemAdjustments/priceableItemAdjustments.service';
import { AdjustmentReasonsGridService } from './adjustmentReasonsGrid/adjustmentReasonsGrid.service';
import { ApprovalService } from './approval/approval.service';
import { PItemplatesRateTableService } from './priceableItemTemplates/piTemplatesRateTable/piTemplatesRateTable.service';
import { SetHeightDirective } from './helpers/auto-size.directive';
import { CalendarsService } from './Calendars/calendars-list.service';
import { CalendarStdHolGenericService } from './Calendars/calendar-stdholday.service';
import { CreateCalendarComponent } from './Calendars/calender-properties/calendar-properties.component';
import { DetailCalendarComponent } from './Calendars/calendar-detail/calendar-detail.component';
import { LoaderService } from './helpers/loader/loader.service';
import { CalendarHolidayComponent } from './Calendars/calender-holiday/calendar-holiday.component';
import { CapabilityService } from './helpers/capabilities.service';
import { InfiniteScrollCheckService } from './helpers/InfiniteScrollCheck.service';

@NgModule({

    declarations: [
        AppComponent,
        WelcomeComponent,
        BreadcrumbsComponent,
        SystembarComponent,
        ContextbarComponent,
        ProductOfferListComponent,
        ProductOfferComponent,
        PermissionsComponent,
        PropertiesComponent,
        ExtendedPropertiesComponent,
        LoginComponent,
        LocaleSelector,
        SubscriptionPropertiesComponent,
        PageNotFoundComponent,
        OnetimeChargesComponent,
        RecurringChargesComponent,
        UsageChargesComponent,
        DiscountChargesComponent,
        PriceableItemsComponent,
        PriceableItemDetailsComponent,
        ModalDialogComponent,
        PIPropertiesComponent,
        PiBillingComponent,
        PIUnitDetailsComponent,
        RatesComponent,
        ErrorTooltipComponent,
        SchedulesComponent,
        RatesTableComponent,
        showOperatorPipe,
        KeysPipe,
        CardControllerComponent,
        AddPriceableItemsComponent,
        AddSubscriptionPropertiesComponent,
        dateFormatPipe,
        PrimeDragulaDirective,
        BundleComponent,
        TreeHierarchyComponent,
        LocalizationComponent,
        ApprovalComponent,
        AddProductOfferToBundleComponent,
        ProductOfferInBundleComponent,
        SecureHtmlPipe,
        CommonDialogComponent,
        SharedPricelistComponent,
        AuditLogComponent,
        CreateSharedPricelistComponent,
        SharedPricelistPropertiesComponent,
        RlInUseSubscribersComponent,
        SharedPricelistInUseInfoComponent,
        SharedPricelistExtendedPropertiesComponent,
        SharedPricelistDetailsComponent,
        SubscriptionPropertyDetailsComponent,
        CreateSubscriptionPropertyComponent,
        InUseOfferingsModalDialogComponent,
        CreateSubscriptionPropertyComponent,
        RatelistMappingsComponent,
        TextFilterPipe,
        LowerCasePipe,
        ComboboxComponent,
        RlAddRateTableComponent,
        PriceableItemTemplateComponent,
        InuseSharedRateListComponent,
        RateChangesComponent,
        PiTemplateDetailsComponent,
        PriceableItemAdjustmentComponent,
        CreatePItemplatePopupComponent,
        CopyRatesComponent,
        AdjustmentReasonsGridComponent,
        PItemplateRateTableComponent,
        InfiniteScrollDirective,
        SetHeightDirective,
        CalendarListComponent,
        DropDownComponent,
        CreateCalendarComponent,
        DetailCalendarComponent,
        InUseCalendarsModalDialogComponent,
        CalendarHolidayComponent,
        LoaderComponent,
        NumberDateFilterComponent,
        CalendarStandardDayComponent,
        ObjectToArrayPipe,
        OfferingChangesComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        DataTableModule,
        DropdownModule,
        TreeModule,
        SharedModule,
        AppRoutingModule,
        Ng2DragDropModule,
        LocalizationModule.forRoot(),
        NgIdleKeepaliveModule.forRoot(),
        TooltipModule,
        NgxAsideModule,
        CalendarModule,
        BrowserAnimationsModule,
        DragulaModule,
        MultiSelectModule,
        SelectButtonModule,
        HttpClientModule,
        MomentModule
    ],
    providers: [
        ProductService,
        ProductOffersListService,
        AuthGuard,
        sharedService,
        AuthenticationService,
        utilService,
        contextBarHandlerService,
        priceableItemDetailsService,
        RatesService,
        modalService,
        ajaxUtilService,
        UrlConfigurationService,
        preventUnsavedChangesGuard,
        priceableItemDetailsUnsavedChangesGuard,
        AddPriceableItemService,
        AddSubscriptionPropertiesService,
        TreeHierarchyService,
        AccessGuard,
        AddProductOfferToBundleService,
        SharedPricelistService,
        UtilityService,
        ProductOfferInBundleService,
        AuditLogService,
        SubscriptionPropertyDetailsService,
        InUseOfferingsModalDialogService,
        UnsavedChangesGuard,
        PriceableItemTemplateService,
        InuseSharedRatelistService,
        PiTemplateDetailsService,
        PiBillingService,
        PriceableItemAdjustmentsService,
        AdjustmentReasonsGridService,
        ApprovalService,
        dateFormatPipe,
        PItemplatesRateTableService,
        CalendarStdHolGenericService,
        CalendarsService,
        LoaderService,
        CapabilityService,
        InfiniteScrollCheckService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        { provide: 'Window', useFactory: getWindow }
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})

export class AppModule {

    // added for angular-l10n
    constructor(public locale: LocaleService, public translation: TranslationService, public injector: Injector) {

        this.locale.addConfiguration()
            .addLanguages(['de', 'gb', 'us', 'es-MX', 'es', 'it', 'jp', 'pt-br', 'fr', 'he', 'ar-sa', 'sv-se'])
            .setCookieExpiration(30)
                       .defineDefaultLocale('us','');

        this.translation.addConfiguration()
            .addProvider('/static/default/localeConfig/Localization/locale-')
            .useLocaleAsLanguage();

        this.translation.init();
        setAppInjector(injector);
    }
}

