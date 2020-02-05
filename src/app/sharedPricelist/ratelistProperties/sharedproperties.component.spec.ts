import { AuthenticationService } from '.../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
    utilService, UtilityService, ajaxUtilService, HttpHandler,
    HttpClient, UrlConfigurationService, CapabilityService, LocaleService, TranslationProvider,
    loadData, RouterModule, FormBuilder, TranslationHandler, TranslationService,
    LocaleConfig, LocaleStorage, showHidefunc, TranslationConfig, ReactiveFormsModule, dateFormatPipe, inject
} from '../../../assets/test/mock';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

import { SharedPricelistPropertiesComponent } from './sharedproperties.component';
import { SharedPricelistService } from '../shared.pricelist.service';


describe('SharedPricelistPropertiesComponent', () => {
    let component: SharedPricelistPropertiesComponent;
    let fixture: ComponentFixture<SharedPricelistPropertiesComponent>;

    // This test code is written for giving compiler enough to read external templates
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule, RouterTestingModule],
            declarations: [SharedPricelistPropertiesComponent],
            providers: [SharedPricelistService, UtilityService, ajaxUtilService,
                HttpClient, HttpHandler, UrlConfigurationService, utilService, dateFormatPipe, 
                MockBackend, BaseRequestOptions, FormBuilder, TranslationService, LocaleService, TranslationProvider,
                TranslationHandler, LocaleConfig, LocaleStorage, TranslationConfig, AuthenticationService, CapabilityService,
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
        _capabilityService.loggedInUserCapabilities = {UISharedRateDetailsPage: {Props_Edit: true}};
        fixture = TestBed.createComponent(SharedPricelistPropertiesComponent);
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
    it('should initialize values', () => {
        component.properties = ProductOfferData.ratelist;
        component.selectedSp = ProductOfferData.ratelist;
        component.errorMessage = ProductOfferData.ratelist.error;
        expect(component.errorMsg).toEqual(ProductOfferData.ratelist.error);
        component.selectedPartition = ProductOfferData.ratelist.error;
        expect(component.selectedParitionLogin).toEqual(ProductOfferData.ratelist.error);
        component.displayCoverHandler(showHidefunc);
        expect(component.showCover).toBe(true);
        component.selectedSp =   ProductOfferData.ratelist;
        ProductOfferData.ratelist.value = 'desc';
        component.enableSave( ProductOfferData.ratelist);
        component.saveSharedPricelist(ProductOfferData.ratelist);
        component.onModalDialogCloseCancel(loadData);
        component.cancelCoverHandler();
        expect(component.showCover).toBe(false);
        component.isSaveEnabled = true;
        component.cancelCoverHandler();
        expect(component.confirmDialog).toEqual(1);
        component.selectedSp.description = 'desc1';
        ProductOfferData.ratelist.value = 'desc1';
        component.enableSave(ProductOfferData.ratelist.value);
        expect(component.isSaveEnabled).toBe(false);
    });

    it('should check autoGrow', () => {
        component.autoGrow();
    });





});
