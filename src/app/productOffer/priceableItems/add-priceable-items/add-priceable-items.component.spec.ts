import { AuthenticationService } from '.../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, pagination, loadData,
    utilService, UtilityService, ajaxUtilService, dateFormatPipe,
    HttpClient, UrlConfigurationService, TranslationService, TranslationConfig, TranslationProvider, TranslationHandler,
    LocaleService, LocaleConfig, LocaleStorage, TranslationModule, RouterModule, HttpClientTestingModule
} from '../../../../assets/test/mock';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

import { AddPriceableItemsComponent } from './add-priceable-items.component';
import { AddPriceableItemService } from '../add-priceable-items/add-priceable-items.service';
import { InfiniteScrollCheckService } from '../../../helpers/InfiniteScrollCheck.service';

describe('AddPriceableItemsComponent', () => {
    let component: AddPriceableItemsComponent;
    let fixture: ComponentFixture<AddPriceableItemsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, RouterModule, HttpClientTestingModule, TranslationModule.forRoot()],
            declarations: [AddPriceableItemsComponent],
            providers: [utilService, ajaxUtilService, AddPriceableItemService, UrlConfigurationService,
                MockBackend, BaseRequestOptions, HttpClient, UtilityService, dateFormatPipe,
                TranslationService, TranslationConfig, TranslationProvider, TranslationHandler,
                LocaleService, LocaleConfig, LocaleStorage, InfiniteScrollCheckService, AuthenticationService,
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA] // service is mentioned to whom component is interacting
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddPriceableItemsComponent);
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
    it('should be check initial values', () => {
        expect(component.usageTypes.length).toEqual(7);
        component.show();
        expect(component.visible).toEqual(true);
        component.pagination = pagination;
        component.getAllPriceableItems();
        component.addPI();
        component.hide();
        expect(component.visible).toEqual(false);
        component.selectPI(1, {target: {checked: true}});
        component.processPIResponse(ProductOfferData.piTemplateForm.selectedPItemplate.data);
        component.piContainer = [101,102]
        component.selectPI(1, {target: {checked: false}});
        expect(component.isPiSelected).toBe(false);
        component.clearFilters('name');
        component.lazyLoad = true;
        component.pagination = pagination;
        component.loadData(loadData);
        component.pagination = pagination;
        component.filterData();
        component.filterPiDataProcessing = false;
        component.pagination = pagination;
        component.filterDataDelay();
        component.isFilterText('name');
        component.handleError('error');
        expect(component.isDeletePIError).toBe(true);
        component.deleteErrorMessage();
        component.priceableItemsList = [0];
        ProductOfferData.piTemplateForm.selectedPItemplate.data.kind = 'USAGE';
        component.priceableItemsList[0] = ProductOfferData.piTemplateForm.selectedPItemplate.data;
        component.processpriceableItemsList();
        ProductOfferData.piTemplateForm.selectedPItemplate.data.kind = 'DISCOUNT';
        component.priceableItemsList[0] = ProductOfferData.piTemplateForm.selectedPItemplate.data;
        component.processpriceableItemsList();
        ProductOfferData.piTemplateForm.selectedPItemplate.data.kind = 'NON_RECURRING';
        component.priceableItemsList[0] = ProductOfferData.piTemplateForm.selectedPItemplate.data;
        component.processpriceableItemsList();
        ProductOfferData.piTemplateForm.selectedPItemplate.data.kind = 'RECURRING';
        component.priceableItemsList[0] = ProductOfferData.piTemplateForm.selectedPItemplate.data;
        component.processpriceableItemsList();
    });
    it('should call filterDataKeys', () => {
        component.filterDataKeys('event','displayName','result');
    });
});