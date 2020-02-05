import { AuthenticationService } from '.../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, FormGroup,
    utilService, UtilityService, ajaxUtilService, HttpHandler,
    HttpClient, UrlConfigurationService, HttpClientTestingModule, contextBarHandlerService,
    loadData, RouterModule, FormBuilder, dateFormatPipe,
    LocaleConfig, LocaleStorage, showHidefunc, FormsModule, ReactiveFormsModule
} from '../../../assets/test/mock';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

import { SharedPricelistInUseInfoComponent } from './sharedPricelistInUseInfo.component';
import { SharedPricelistService } from '../shared.pricelist.service';

describe('SharedPricelistInUseInfoComponent', () => {
    let component: SharedPricelistInUseInfoComponent;
    let fixture: ComponentFixture<SharedPricelistInUseInfoComponent>;

    // This test code is written for giving compiler enough to read external templates
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule, RouterTestingModule],
            declarations: [SharedPricelistInUseInfoComponent],
            providers: [SharedPricelistService, UtilityService, ajaxUtilService,
                HttpClient, HttpHandler, UrlConfigurationService, utilService,
                MockBackend, BaseRequestOptions, FormBuilder, AuthenticationService,
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
        fixture = TestBed.createComponent(SharedPricelistInUseInfoComponent);
        component = fixture.componentInstance;
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
    it('should check inuseData', () => {
        component.inUseData = ProductOfferData.ratelist;
        component.sharedPricelist = ProductOfferData.ratelist;
        component.inUseProductOffers = ProductOfferData.ratelist.inUseProductOffersSize;
        component.inUseSubscribers = ProductOfferData.ratelist.inUseSubscribers;
        component.sharedPricelistId = ProductOfferData.ratelist.pricelistId;
    });
    it('should check errorMessage', () => {
        component.errorMessage = ProductOfferData.ratelist.error;
        expect(component.errorMsg).toEqual(ProductOfferData.ratelist.error);
    });
    it('should call openInuseSubscribers', () => {
        component.openInuseSubscribers();
    });
    it('should call openInuseOfferings', () => {
        component.openInuseOfferings();
    });
    it('should call onSubscriberClosed', () => {
        component.onSubscriberClosed();
    });
    it('should call onOfferingsClosed', () => {
        component.onOfferingsClosed();
    });
});
