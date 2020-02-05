import { AuthenticationService } from '../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, TranslationModule,
    utilService, ajaxUtilService, CapabilityService, UtilityService, TranslationService,
    HttpClient, UrlConfigurationService, HttpClientTestingModule, TranslatePipe,
    svcData, RouterModule, LocaleService, LocaleConfig, LocaleStorage, TranslationConfig,
    TranslationProvider, TranslationHandler, dateFormatPipe, FormBuilder
} from '../../assets/test/mock';

import { ProductOfferInBundleComponent } from './productOfferInBundle.component';
import { BundleService } from '../bundle/bundle.service';

const MockCapabilitiesService = {
    loggedInUserCapabilities: () => { return { UIPoDetailsPage: {POs_Add: true}}; },
    findPropertyCapability: () => { return 'UIPoDetailsPage'; }
};

describe('ProductOfferInBundleComponent', () => {
    let component: ProductOfferInBundleComponent;
    let fixture: ComponentFixture<ProductOfferInBundleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule, RouterTestingModule, HttpClientTestingModule],
            declarations: [ProductOfferInBundleComponent,TranslatePipe],
            providers: [MockBackend, BaseRequestOptions, ajaxUtilService, TranslationService,
                UrlConfigurationService, utilService, BundleService, HttpClient, AuthenticationService, LocaleService, LocaleConfig, LocaleStorage, TranslationConfig,
                TranslationProvider, TranslationHandler, dateFormatPipe, FormBuilder, UtilityService,
                { provide: CapabilityService, useValue: MockCapabilitiesService },
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        const fixtureBody = `<div class="propertiesInBundle"></div>
        <div id="cardTotalHeightPO-0"></div>
        <div id="cardBodyPO-0"></div>`;
        document.body.insertAdjacentHTML(
            'afterbegin',
            fixtureBody);
        fixture = TestBed.createComponent(ProductOfferInBundleComponent);
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
    });
    it('should check Add PO disabled', () => {
        component.selectedBundle(svcData.data);
        expect(component.bundleList).toEqual(svcData.data);
        expect(component.disableAddPo).toBe(true);
        component.selectedBundle({addRemovePoPi : false});
        expect(component.disableAddPo).toBe(false);
    });
    it('should check PO cancel panel ', () => {
        component.cancelPOInstanceCard();
        expect(component.removePOInstanceID).toEqual(-1);
    });
        it('should check functions handleErrorPOInstanceID', () => {
        component.handleErrorPOInstanceID('error');
        expect(component.deletePOError).toEqual('error');
    });
    it('should check functions PO isDeleteError', () => {
        expect(component.isDeletePOError).toBe(false);
        component.deleteErrorMessage();
    });
        it('should check function PO cancel Instance card', () => {
            component.cancelPOInstanceCard();
        expect(component.removePOInstanceID).toEqual(-1);
        component.removePoFromBundle(1001);
        component.getAllPoInBundle();
        component.redirectToPiDetailsPage(968, 968, 'RC', svcData.data, svcData.data);
        component.redirectToPoDetailsPage(svcData.data);
        component.openAddPoListInBundle();
        component.removePOInstanceIcon(1, 0);
        component.height = 200;
    });
});
