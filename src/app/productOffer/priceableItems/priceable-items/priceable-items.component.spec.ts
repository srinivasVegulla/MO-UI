import { AuthenticationService } from '.../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, DebugElement,
    utilService, UtilityService, ajaxUtilService, ProductService,
    HttpClient, UrlConfigurationService, CapabilityService, HttpClientTestingModule,
    TranslationService, TranslationConfig, TranslationProvider, TranslationHandler,
    LocaleService, LocaleConfig, LocaleStorage, dateFormatPipe, TranslatePipe
} from '../../../../assets/test/mock';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

import { PriceableItemsComponent } from './priceable-items.component';
import { OnetimeChargesComponent } from '../onetime-charges/onetime-charges.component';
import { AddPriceableItemService } from '../add-priceable-items/add-priceable-items.service';

const MockCapabilitiesService = {
    loggedInUserCapabilities: () => { return {UIPoDetailsPage: {POs_Add: true}}; },
    findPropertyCapability: () => { return 'UIPoDetailsPage'; },
};

describe('PriceableItemsComponent', () => {
    let component: PriceableItemsComponent;
    let fixture: ComponentFixture<PriceableItemsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientTestingModule],
            declarations: [PriceableItemsComponent, OnetimeChargesComponent, TranslatePipe],
            providers: [MockBackend, BaseRequestOptions, ajaxUtilService, UrlConfigurationService,
                utilService, AddPriceableItemService, ProductService, HttpClient, UtilityService,
                TranslationService, TranslationConfig, TranslationProvider, TranslationHandler,
                LocaleService, LocaleConfig, LocaleStorage, dateFormatPipe, AuthenticationService,
                { provide: CapabilityService, useValue: MockCapabilitiesService },
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        const fixtureBody = `<div class= 'priceableItemsSkeleton'></div>`;
        document.body.insertAdjacentHTML(
            'afterbegin',
            fixtureBody);
        fixture = TestBed.createComponent(PriceableItemsComponent);
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
        component.addingFailedPi = [0];
        ProductOfferData.piDetails.kind = 'USAGE';
        component.addingFailedPi[0] = ProductOfferData.piDetails;
        component.selectedProductOffer(ProductOfferData.piDetails);
        ProductOfferData.piDetails.addRemovePoPi = true;
        component.selectedProductOffer(ProductOfferData.piDetails);
        component.openAddPriceableItem();
        expect(component.usageName).toEqual([]);
        component.hideSkeleton();
        component.onClick([]);
        expect(component.showUsageError).toBe(false);
    });
    it('should check closed errors', () => {
        component.closeaddErrors();
        expect(component.showDiscountError).toEqual(false);
        expect(component.showNonRecurringError).toEqual(false);
        expect(component.showRecurringError).toEqual(false);
        expect(component.showUsageError).toEqual(false);
    });
});