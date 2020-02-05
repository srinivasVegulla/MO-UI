import { AuthenticationService } from '.../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
    utilService, UtilityService, ajaxUtilService,
    HttpClient, UrlConfigurationService, LocaleConfig, LocaleStorage, LocaleService,
    FormsModule, ReactiveFormsModule, HttpHandler, TranslationService, TranslationConfig,
    TranslationProvider, TranslationHandler, priceableItemDetailsService, PiTemplateDetailsService,
    keyEventData, KeysPipe, dateFormatPipe, HttpClientTestingModule,
    loadData, showHidefunc
} from '../../../assets/test/mock';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

import { PiBillingComponent } from './piBilling.component';
import { PiBillingService } from '../piBilling/piBilling.service';

describe('PiBillingComponent', () => {
    let component: PiBillingComponent;
    let fixture: ComponentFixture<PiBillingComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule, FormsModule],
            declarations: [PiBillingComponent, KeysPipe],
            providers: [MockBackend, BaseRequestOptions, PiBillingService, dateFormatPipe,
                TranslationService, LocaleService, TranslationProvider, TranslationHandler,
                LocaleConfig, LocaleStorage, TranslationConfig, UtilityService, ajaxUtilService,
                HttpClient, HttpHandler, UrlConfigurationService, utilService,
                PiTemplateDetailsService, priceableItemDetailsService, AuthenticationService,
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
        const fixtureBody = `<div class="permissionSkeleton"></div>
                                <div id="initFocusBilling"></div>`;
        document.body.insertAdjacentHTML(
            'afterbegin',
            fixtureBody);
        fixture = TestBed.createComponent(PiBillingComponent);
        component = fixture.componentInstance;
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should be initialized', () => {
        expect(fixture).toBeDefined();
        expect(component).toBeDefined();
    });
    it('should check keypipe', () => {
        const keyPipe = new KeysPipe();
        expect(keyPipe.transform('sa', ['sample']).length).toEqual(2);
    });
    it('should call functions', () => {
        component.ngOnInit();
        const _piBillingService = fixture.debugElement.injector.get(PiBillingService);
        _piBillingService.getRecCycles();
        _piBillingService.getInterVals();
        _piBillingService.getEbcrInterVals();
        _piBillingService.getOptions(keyEventData);
        _piBillingService.getFixedCycle();
        _piBillingService.getUsageCycle();
        component.billingInformation = ProductOfferData.billingInformation;
        component.displayCoverHandler(showHidefunc);
        expect(component.showCover).toBe(true);
        component.cancelEditPanel();
        component.closeEditPanel();
        component.onModalDialogCloseCancel(loadData);
        expect(component.confirmDialog).toEqual(0);
        component.initializeEditForm();
        component.setRecurringOptions({});
        component.getSelctedValue(['key', 'key1'], 'k');
        component.setFrequencies();
        component.openInUseOfferings();
        component.saveBillingData();
        expect(component.billingInfoSaving).toBe(false);
        component.getRecCycleData(0);
        component.onOptionSelection('recCycle', ProductOfferData.billingInformation.recCycle);
    });
    it('should call selectOption method', () => {
        component.billingInformation = ProductOfferData.billingInformation;
        component.initializeEditForm();
        const _piBillingService = fixture.debugElement.injector.get(PiBillingService);
        const sourceObj = null;
        let type = 'intervals';
        const selectedObj = { attr: "cycleTypeId", child: {}, key: "DAILY", text: "TEXT_DAILY"};
        component.selectOption(sourceObj, type, selectedObj);
        expect(component.isBillingFormDirty).toBe(true);
        if (type === 'intervals' || type === 'periods') {
            expect(component.billingForm['parent']).toEqual({ attr: 'cycleMode', key: 'FIXED' });
            if (type === 'intervals') {
                expect(component.billingForm['parent']).toEqual(_piBillingService.getFixedCycle());
            }
            type = 'recCycle';
        }
        if (selectedObj['attr'] !== undefined) {
            expect(component.billingForm[type]).toEqual(selectedObj);
        } else {
            expect(sourceObj['key']).toEqual(selectedObj['key']);
            expect(sourceObj['text']).toEqual(selectedObj['text']);
            expect(component.billingForm[type]).toEqual(sourceObj);
        }
        if (selectedObj['key'] === 'DAILY') {
            expect(component.billingForm['prorateOnActivate']).toBe(false);
            expect(component.billingForm['prorateOnDeactivate']).toBe(false);
            expect(component.billingForm['fixedProrationLength']).toBe(false);
            expect(component.disableProrate).toBe(true);
        } else {
            expect(component.disableProrate).toBe(false);
        }
        if (type === 'recCycle') {
            expect(component.billingForm['chargeFrequency1']).toEqual({});
            expect(component.billingForm['chargeFrequency2']).toEqual({});
            expect(component.recurringCycleOptions1).toEqual(component.getRecCycleData(0));
            expect(component.recurringCycleOptions2).toEqual(component.getRecCycleData(1));
        } else if (type === 'chargeFrequency1') {
            expect(component.billingForm['chargeFrequency2']).toEqual({});
            expect(component.recurringCycleOptions2).toEqual(component.getRecCycleData(1));
        }
        component.setDefaultValues();
        component.isValidForm();
    });
});