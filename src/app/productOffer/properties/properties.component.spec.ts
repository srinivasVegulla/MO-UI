
import { AuthenticationService } from '.../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
    utilService, UtilityService, ajaxUtilService, CapabilityService,
    HttpClient, UrlConfigurationService, Router, HttpClientTestingModule,
    dateFormatPipe, LocaleConfig, LocaleStorage, ReactiveFormsModule, FormsModule, FormGroup,
    contextBarHandlerService, ProductService, sharedService, modalService, LocaleService,
    TranslationService, TranslationConfig, TranslationProvider, TranslationHandler, keyEventData,
    loadData, showHidefunc, approvals, approvalData
} from '../../../assets/test/mock';
import { MockLocalService } from '../../../assets/test/mock-local-service';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

import { PropertiesComponent } from './properties.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxAsideModule } from 'ngx-aside';
import { CalendarModule, InputTextModule } from 'primeng/primeng';
import { MomentModule } from 'angular2-moment';

const MockCapabilitiesService = {
    loggedInUserCapabilities: () => { return {UIPoDetailsPage: {Properties_Edit: true}}; },
    findPropertyCapability: () => { return 'UIPoDetailsPage'; },
    getWidgetCapabilities: () => {}
};

describe('PropertiesComponent', () => {
    let component: PropertiesComponent;
    let fixture: ComponentFixture<PropertiesComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PropertiesComponent, dateFormatPipe],
            imports: [BrowserAnimationsModule, FormsModule, HttpClientTestingModule, RouterTestingModule,
                NgxAsideModule, CalendarModule, InputTextModule, ReactiveFormsModule, MomentModule],
            providers: [utilService, sharedService, modalService, contextBarHandlerService, ProductService,
                LocaleConfig, LocaleStorage, BaseRequestOptions, MockBackend,
                HttpClient, ajaxUtilService, UrlConfigurationService, TranslationService,
                TranslationConfig, TranslationProvider, TranslationHandler, UtilityService, dateFormatPipe,
                AuthenticationService,
                { provide: LocaleService, useValue: MockLocalService },
                { provide: CapabilityService, useValue: MockCapabilitiesService },
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        const fixtureBody = `<div id="initFocus"></div><div id="initFocus"></div>`;
        document.body.insertAdjacentHTML(
          'afterbegin',
          fixtureBody);
        fixture = TestBed.createComponent(PropertiesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should be initialized', () => {
        expect(fixture).toBeDefined();
        expect(component).toBeDefined();
    });
    it('should call ngOnInit', () => {
        component.ngOnInit();
        expect(component.POProperties instanceof FormGroup).toBe(true);
        component.POProperties.controls['name'].setValue(ProductOfferData.properties.name);
        component.POProperties.controls['displayName'].setValue(ProductOfferData.properties.displayName);
        component.savePOProperties();
        expect(component.isSaveClicked).toBe(true);
    });
    it('should check po configration', () => {
        component.createPOConfig = ProductOfferData.properties.defaultCurrency;
        expect(component.currencyDefault).toEqual('USD');
        expect(component.partitionDefault).toEqual('root');
    });
    it('should check currency and partition list', () => {
        component.currencyAndPartitionList = ProductOfferData.properties.defaultCurrency;
        expect(component.currencies[0].name).toEqual('USD');
        expect(component.partitions[0].login).toEqual('root');
    });
    it('should check properties initial value', () => {
        const poProperties = ProductOfferData.properties;
        component.properties = poProperties;
        component.errorMessage = 'sample error';
        expect(component.POLoadError).toBe(true);
        component.createOffering = 'productOffer';
        expect(component.isCreateOffering).toEqual(true);
        expect(component.createPO).toEqual(true);
        component.createOffering = 'sample po';
        expect(component.createPO).toEqual(true);
        expect(component.generalProperties).toEqual(component.generalPropertiesList);
        expect(component.POName).toEqual(component.generalProperties.name);
        expect(component.PODescription).toEqual(component.generalProperties.description);
        expect(component.currencies).toEqual(component.generalProperties.currencies);
        expect(component.selectedCurrency.name).toEqual(component.generalProperties.currency);
        component.copyOfferings = component.generalProperties;
        component.createOffering = 'bundle';
        expect(component.createBundle).toBe(true);
        component.createOffering = 'copyPO';
        expect(component.isCopyPO).toBe(true);
        component.createOffering = 'copyBundle';
        expect(component.isCopyBundle).toBe(true);
        component.changeDropdown('usd');
        component.checkNameAvailability();
        expect(component.validateProcessing).toBe(true);
        component.createOfferings();
        component.updateProperties();
        keyEventData.keyCode = 13;
        component.onEnterSavePOProperties(keyEventData);
        component.propertiesForm = poProperties.displayName;
        expect(component.showCover).toBe(true);
        component.apiCallError('error', '404', '', 'create');
        expect(component.showErrorMessage).toBe(true);
        component.displayCoverHandler(showHidefunc);
        expect(component.nameExist).toBe(false);
        component.onModalDialogCloseCancel(loadData);
        component.closeEditPanel();
        component.onModalDialogCloseHide(loadData);
        component.onModalDialogCloseShow(loadData);
        component.saveCopyOfferings();
        component.reDirectionSuccessCall(ProductOfferData.productOffer);
        component.createPropertiesForm(poProperties);
        component.cancelCoverHandler();
        component.removeSpace();
    });
    it('should create a `FormGroup` comprised of `FormControl`s', () => {
        expect(component.POProperties instanceof FormGroup).toBe(true);
        component.POProperties.controls['name'].setValue(component.POName);
        expect(component.POProperties['_value'].name).toEqual(component.POName);
    });
    it('should check autoGrow', () => {
        component.autoGrow();
    });
    it('Should not allow spaces', () => {
        keyEventData.keyCode = 32;
        component.disableSpace(keyEventData);
    });
    it('should check approvalFlag', () => {
        component.approvalFlag = approvals;
        expect(approvals.Capabilities.Properties_Edit).toEqual(true);
        expect(approvals.approval.enableApprovalsEdit).toEqual(true);
        component.approvalFlag = approvalData;
        expect(approvals.approval.enableApprovalsEdit).toEqual(false);
        expect(approvals.Capabilities.Properties_Edit).toEqual(false);
    });


});