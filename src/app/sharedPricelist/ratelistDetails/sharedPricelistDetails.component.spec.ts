import { AuthenticationService } from '.../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, TranslationModule,
    utilService, UtilityService, ajaxUtilService, HttpHandler,
    HttpClient, UrlConfigurationService, HttpClientTestingModule, contextBarHandlerService,
    loadData, RouterModule, LocaleService, TranslationService, TranslationConfig, TranslationProvider,
    TranslationHandler, dateFormatPipe, LocaleConfig, LocaleStorage, showHidefunc, FormBuilder, CapabilityService, inject
} from '../../../assets/test/mock';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

import { SharedPricelistDetailsComponent } from './sharedPricelistDetails.component';
import { SharedPricelistService } from '../shared.pricelist.service';
import { MockAuthenticationService } from '.../../assets/test/mock-authentication-service';


describe('SharedPricelistDetailsComponent', () => {
    let component: SharedPricelistDetailsComponent;
    let fixture: ComponentFixture<SharedPricelistDetailsComponent>;

    // This test code is written for giving compiler enough to read external templates
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule, RouterTestingModule],
            declarations: [SharedPricelistDetailsComponent],
            providers: [SharedPricelistService, UtilityService, ajaxUtilService,
                HttpClient, HttpHandler, UrlConfigurationService, utilService,
                MockBackend, BaseRequestOptions, FormBuilder, contextBarHandlerService,
                TranslationService, LocaleService, LocaleConfig, LocaleStorage, TranslationConfig,
                TranslationProvider, TranslationHandler, dateFormatPipe, AuthenticationService, CapabilityService,
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA] // service is mentioned to whom component is interacting
        })
            .compileComponents();  // compiles external template and css
    }));


    // synchronous beforeEach
    // This before each waits till the time first async beforeEach completes
    beforeEach(inject([CapabilityService], _capabilityService  => {
        _capabilityService.loggedInUserCapabilities = {UISharedRateDetailsPage: {RateTables_Add: true}}
        const fixtureBody = `<div class="propertiesSkeleton"></div>
        <div class="extendedPropertiesSkeleton"></div>
        <div class="permissionSkeleton"></div>`;
        document.body.insertAdjacentHTML(
            'afterbegin',
            fixtureBody);
        fixture = TestBed.createComponent(SharedPricelistDetailsComponent);
        component = fixture.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should be initialized', () => {
        expect(fixture).toBeDefined();
        expect(component).toBeDefined();
    });
    it('should call ngOnInit', () => {
        component.ngOnInit();
    });
    it('should call removeError', () => {
        component.removeError();
    });
    it('should call functions', () => {
        component.selectedSharedPricelist = ProductOfferData.ratelist;
        component.pricelistId = 1;
        component.getProductOfferDetails();
        component.updateProductOffer(true);
        component.deleteErrorMessage();
        expect(component.isDeleteSRError).toBe(false);
        component.onRateTableInfoResponse({});
        component.showAddRateTable();
        expect(component.isAddRateTable).toBe(true);
        component.onAddRateTableClick(ProductOfferData.ratelist);
        component.onAddRateTableClose({});
        component.getSubscriptionCount();
        component.hidePropertiesWidget(true);
        expect(component.showLocalizationPanel).toBe(false);
        component.onRateTableInfoLoad(true);
        expect(component.rateTableInfoLoading).toBe(true);
        component.isParamTableInfo();
    });
});