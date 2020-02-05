import { AuthenticationService } from '../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, CapabilityService,
    utilService, UtilityService, ajaxUtilService, HttpHandler,
    HttpClient, UrlConfigurationService, HttpClientTestingModule, contextBarHandlerService,
    loadData, ProductService, RouterModule, modalService, LocaleService, TranslatePipe,
    TranslationService, TranslationConfig, Language, TranslationProvider, TranslationHandler, dateFormatPipe,
    LocaleConfig, LocaleStorage, showHidefunc, FormsModule, ReactiveFormsModule, sharedService
} from '../../assets/test/mock';

import { MockLocalService } from '../../assets/test/mock-local-service';
import { scheduleInfo } from '.../../assets/test/mock-schedule';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

import { RatesComponent } from './rates.component';
import { RatesTableComponent } from './rates-table/rates-table.component';

import { RatesService } from './rates.service';


describe('RatesComponent', () => {
    let component: RatesComponent;
    let fixture: ComponentFixture<RatesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
            declarations: [RatesComponent, TranslatePipe],
            providers: [MockBackend, BaseRequestOptions, RatesService,
                ajaxUtilService, UrlConfigurationService, utilService, UtilityService,
                modalService, sharedService, HttpClient, TranslationService, Language,
                TranslationConfig, TranslationProvider, TranslationHandler,
                LocaleConfig, LocaleStorage, HttpHandler, AuthenticationService, CapabilityService,
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                },
                { provide: LocaleService, useValue: MockLocalService },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        const fixtureBody = `<div class= 'priceableItemsSkeleton'></div>`;
        document.body.insertAdjacentHTML(
            'afterbegin',
            fixtureBody);
        fixture = TestBed.createComponent(RatesComponent);
        component = fixture.componentInstance;
        component.properties = scheduleInfo;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should be initialized', () => {
        expect(fixture).toBeDefined();
        expect(component).toBeDefined();
    });
    it('should initialize values', () => {
        component.defaultRate = ProductOfferData.rateTables.defRates;
        expect(component.rateDefault).toEqual('Sample PI');
        component.processRateSource(ProductOfferData.rateTables.defRates);
        component.local(ProductOfferData.rateTables.defRates);
        expect(component.editableRate).toEqual(ProductOfferData.rateTables.defRates);
        expect(component.isSaveEnabled).toBe(true);
        component.handleRowSelect({name: 'TEXT_LOCAL' }, scheduleInfo.schedule);
        expect(component.isICB).toBe(false);
        expect(component.selectedPriceList).toEqual('TEXT_LOCAL');
        component.customICB(ProductOfferData.rateTables.defRates);
        expect(component.editableRate).toEqual(ProductOfferData.rateTables.defRates);
        expect(component.isICB).toBe(true);
        expect(component.selectedPriceList).toEqual('TEXT_CUSTOM_ICB_ONLY');
    });
    it('should check rates and schedules', () => {
        component.getSchedules(ProductOfferData.ratesData.rates[0].paramTableId,
        ProductOfferData.ratesData.rates[0].itemTemplateId, ProductOfferData.ratesData.rates[0].pricelistId);
        expect(component.schedulesLoading).toBe(false);
        component.showSchedules(0, ProductOfferData.ratesData.rates[0].paramTableId,
        ProductOfferData.ratesData.rates[0].itemTemplateId, ProductOfferData.ratesData.rates[0].pricelistId, false);
        expect(component.expandedIndex).toEqual(0);
        component.showSchedules(0,  ProductOfferData.ratesData.rates[0].paramTableId,
        ProductOfferData.ratesData.rates[0].itemTemplateId, ProductOfferData.ratesData.rates[0].pricelistId, false);
        expect(component.expandedIndex).toEqual(0);
        component.showSchedules(0, ProductOfferData.ratesData.rates[0].paramTableId,
        ProductOfferData.ratesData.rates[0].itemTemplateId, ProductOfferData.ratesData.rates[0].pricelistId, false);
        expect(component.schedulesLoading).toBe(false);
        component.processRateSource(ProductOfferData.rateTables.defRates);
        component.isFormValid();
        component.expandPanelBody(0);
        component.cancelCoverHandler(showHidefunc, {});
        component.handleRowSelect(scheduleInfo.schedule, scheduleInfo.schedule);
        component.editRateSourceComponent = showHidefunc;
        component.onModalDialogCloseCancel(loadData);
        component.onModalDialogCloseSave(loadData);
        expect(component.confirmDialog).toEqual(0);
        component.executeSaveOfRateSource([]);
        component.saveRateSource([]);
        expect(component.isSaveEnabled).toBe(false);
        component.displayCoverHandler(showHidefunc, scheduleInfo.schedule, 0);
        expect(component.isSaveEnabled).toBe(false);
        component.saveRateSource(showHidefunc);
        expect(component.editRateSourceComponent).toEqual(showHidefunc); 
    });
});
