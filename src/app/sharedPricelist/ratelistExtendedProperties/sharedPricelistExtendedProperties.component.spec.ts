import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed, TranslationConfig,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, FormGroup, dateFormatPipe,
    utilService, UtilityService, ajaxUtilService, HttpHandler, LocaleService, TranslationProvider,
    HttpClient, UrlConfigurationService, contextBarHandlerService, TranslationService,
    loadData, RouterModule, FormBuilder, TranslationHandler, LocaleConfig, LocaleStorage, showHidefunc, FormsModule, ReactiveFormsModule
} from '../../../assets/test/mock';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

import { SharedPricelistExtendedPropertiesComponent } from './sharedPricelistExtendedProperties.component';

import { SharedPricelistService } from '../shared.pricelist.service';
import { MockAuthenticationService, AuthenticationService } from '../../../assets/test/mock-authentication-service';

describe('SharedPricelistExtendedPropertiesComponent', () => {
    let component: SharedPricelistExtendedPropertiesComponent;
    let fixture: ComponentFixture<SharedPricelistExtendedPropertiesComponent>;
    let element: HTMLElement;

    // This test code is written for giving compiler enough to read external templates
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule, RouterTestingModule, FormsModule, ReactiveFormsModule],
            declarations: [SharedPricelistExtendedPropertiesComponent],
            providers: [SharedPricelistService, UtilityService, ajaxUtilService, dateFormatPipe,
                HttpClient, HttpHandler, UrlConfigurationService, utilService, TranslationService, LocaleService, TranslationProvider,
                TranslationHandler, LocaleConfig, LocaleStorage, TranslationConfig,
                MockBackend, BaseRequestOptions, FormBuilder, contextBarHandlerService, AuthenticationService,
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
        fixture = TestBed.createComponent(SharedPricelistExtendedPropertiesComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });
    it('should Initialize values', () => {
        component.isSaveEnabled = false;
        component.extendedProperty = [];
        component.isDisabled = false;
        component.showCover = false;
        component.showErrorMessage = false;
        component.extendedProperties = ProductOfferData.ratelist;
        component.sharedPricelistId = ProductOfferData.ratelist.pricelistId;
        expect(component.sharedPricelistId).toEqual(5);
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
    });
    it('should check form group', () => {
        expect(component.extendedPropertiesForm instanceof FormGroup).toBe(true);
        expect(component.extendedPropertiesForm.dirty).toEqual(false);
    });
    it('should call setExtendedProperties', () => {
        component.setExtendedProperties();
    });
    it('should call createGroup', () => {
        component.createGroup();
    });
    it('should call saveExtProperties', () => {
        component.saveExtProperties();
    });
    it('should call onCheckboxSelect', () => {
        component.onCheckboxSelect(loadData, ProductOfferData.ratelist, 0);
        ProductOfferData.ratelist.value = '0';
        ProductOfferData.ratelist.dn = 1;
        component.onCheckboxSelect(loadData, ProductOfferData.ratelist, 0);
    });
    it('should call functions', () => {
        component.onFormFieldChange();
        component.displayCoverHandler(showHidefunc);
        expect(component.showCover).toBe(true);
        component.closeEditPanel();
        expect(component.showCover).toBe(false);
        component.onModalDialogCloseCancel(loadData);
        expect(component.confirmDialog).toEqual(0);
        component.cancelCoverHandler();
        expect(component.showCover).toBe(false);
    });
});