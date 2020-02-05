import { AuthenticationService } from '.../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, TranslationModule,
    utilService, UtilityService, ajaxUtilService, HttpHandler,
    HttpClient, UrlConfigurationService, HttpClientTestingModule, contextBarHandlerService,
    loadData, ProductService, RouterModule, modalService, LocaleService, FormGroup,
    TranslationService, TranslationConfig, TranslationProvider, TranslationHandler, dateFormatPipe,
    LocaleConfig, LocaleStorage, showHidefunc, FormBuilder, keyEventData, ReactiveFormsModule
} from '../../../assets/test/mock';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

import { CreateSharedPricelistComponent } from './createSharedPricelist.component';
import { SharedPricelistService } from '../shared.pricelist.service';
import { CopyRatesComponent } from 'app/rates/copyRates/copyRates.component';
import { COMPONENT_VARIABLE } from '@angular/platform-browser/src/dom/dom_renderer';

describe('CreateSharedPricelistComponent', () => {
    let component: CreateSharedPricelistComponent;
    let fixture: ComponentFixture<CreateSharedPricelistComponent>;

    // This test code is written for giving compiler enough to read external templates
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule, RouterTestingModule],
            declarations: [CreateSharedPricelistComponent],
            providers: [SharedPricelistService, UtilityService, ajaxUtilService,
                HttpClient, HttpHandler, UrlConfigurationService, utilService,
                MockBackend, BaseRequestOptions, FormBuilder,
                TranslationService, LocaleService, LocaleConfig, LocaleStorage,
                TranslationConfig, TranslationProvider, TranslationHandler, dateFormatPipe, AuthenticationService,
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
        fixture = TestBed.createComponent(CreateSharedPricelistComponent);
        component = fixture.componentInstance;
        component.copyPricelist = [{name: 'sample', description: 'sample desc', plpartitionid: 1, currency: 'USD'}];
        component.createRateList = [{name: 'sample', description: 'sample desc', plpartitionid: 1, currency: 'USD'}];
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should be initialized', () => {
        expect(fixture).toBeDefined();
        expect(component).toBeDefined();
    });
    it('should call ngOnInit', () => {
        component.createRateList = '';
        component.ngOnInit();
        component.isSaveEnabled = true;
        expect(component.isSaveEnabled).toBe(true);
        component.cancelCoverHandler();
        component.changeDropdown();
        component.checkNameAvailability(true);
        expect(component.sharedPricelist instanceof FormGroup).toBe(true);
        component.sharedPricelist.controls['name'].setValue(ProductOfferData.properties.name);
        component.saveSharedPricelist(ProductOfferData.ratelist);
        component.removeSpace();
    });
    it('should call closeEditPanel', () => {
        component.closeEditPanel();
    });
    it('should call setSharedPricelistFormBuilder', () => {
        component.setSharedPricelistFormBuilder();
    });
    it('should call getCurrenciesAndPartitions', () => {
        component.getCurrenciesAndPartitions();
        component.spcurrencies = ProductOfferData.properties.currencies;
        component.sppartitions = ProductOfferData.properties.defaultCurrency.partitions;
        expect(component.spcurrencies).toEqual(ProductOfferData.properties.currencies);
        expect(component.sppartitions).toEqual(ProductOfferData.properties.defaultCurrency.partitions);
    });
    it('should call onModalDialogCloseCancel', () => {
        component.onModalDialogCloseCancel(loadData);
    });
    it('should call ngOnDestroy', () => {
        component.ngOnDestroy();
    });
    it('should check autoGrow', () => {
        component.autoGrow();
    });
    it('Should not allow spaces', () => {
        keyEventData.keyCode = 32;
        component.disableSpace(keyEventData);
    });

      
});