import { AuthenticationService } from '.../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, TranslationModule,
    utilService, UtilityService, ajaxUtilService, HttpHandler,
    HttpClient, UrlConfigurationService, RouterModule, LocaleService, modalService,
    TranslationService, TranslationConfig, TranslationProvider, TranslationHandler,
    LocaleConfig, LocaleStorage, dateFormatPipe, CapabilityService, TranslatePipe,
} from '../../../assets/test/mock';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

import { RatelistMappingsComponent } from './ratelistMappings.component';
import { RatesService } from '../../rates/rates.service';
import { SharedPricelistService } from '../shared.pricelist.service';
import { MockAuthenticationService } from '../../../assets/test/mock-authentication-service';

const MockCapabilitiesService = {
    loggedInUserCapabilities: () => { return {UISharedRateDetailsPage: {RateTables_Add: true}}; },
    findPropertyCapability: () => { return 'UISharedRateDetailsPage'; }
};

describe('RatelistMappingsComponent', () => {
    let component: RatelistMappingsComponent;
    let fixture: ComponentFixture<RatelistMappingsComponent>;

    // This test code is written for giving compiler enough to read external templates
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule, RouterTestingModule],
            declarations: [RatelistMappingsComponent, TranslatePipe],
            providers: [SharedPricelistService, UtilityService, ajaxUtilService,
                HttpClient, HttpHandler, UrlConfigurationService, utilService,
                MockBackend, BaseRequestOptions, modalService,
                TranslationService, LocaleService, LocaleConfig, LocaleStorage, dateFormatPipe,
                TranslationConfig, TranslationProvider, TranslationHandler, RatesService, AuthenticationService,
                { provide: CapabilityService, useValue: MockCapabilitiesService },
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
    beforeEach(() => {
        fixture = TestBed.createComponent(RatelistMappingsComponent);
        component = fixture.componentInstance;
        const _sharedPricelistService = fixture.debugElement.injector.get(SharedPricelistService);
        _sharedPricelistService.isRateTableMapped(true);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should be initialized', () => {
        expect(fixture).toBeDefined();
        expect(component).toBeDefined();
    });
    it('should call functions', () => {
        component.pricelistIdParam = ProductOfferData.ratelist;
        component.ngOnInit();
        component.getParameterTableMetaData(ProductOfferData.ratesData.rates[0].paramTableId, true);
        component.getSchedules(ProductOfferData.ratesData.rates[0].paramTableId,
            ProductOfferData.ratesData.rates[0].itemTemplateId, ProductOfferData.ratesData.rates[0].pricelistId,
            {}, {});
        component.showSchedules(ProductOfferData.ratesData.paramTable);
        component.ratelistData =  [0];
        component.ratelistData[0] = ProductOfferData.ratelist;
        component.manipulateAllNode('sample', {});
        component.showPIRatesTables(ProductOfferData.ratelist);
    });
});
