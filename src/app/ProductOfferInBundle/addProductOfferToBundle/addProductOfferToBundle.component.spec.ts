import { AuthenticationService } from '.../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, TranslationModule,
    utilService, UtilityService, ajaxUtilService, inject, pagination,
    HttpClient, UrlConfigurationService, HttpClientTestingModule,
    loadData, ProductService, dateFormatPipe, LocaleService, Observable
} from '../../../assets/test/mock';

import { ProductOfferData } from '.../../assets/test/mock-productoffer';

import { MomentModule } from 'angular2-moment';

import { AddProductOfferToBundleComponent } from './addProductOfferToBundle.component';
import { ProductOffersListService } from '../../productOfferList/productOfferList.service';
import { InfiniteScrollDirective } from '../../helpers/InfiniteScroll.directive';
import { InfiniteScrollCheckService } from '../../helpers/InfiniteScrollCheck.service';
import { MockLocalService } from '../../../assets/test/mock-local-service';
const MockUtilSerivice = {
    openAddPOModalPopUp: () => {}
};

describe('AddProductOfferToBundleComponent', () => {
    let component: AddProductOfferToBundleComponent;
    let fixture: ComponentFixture<AddProductOfferToBundleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientTestingModule, TranslationModule.forRoot(), MomentModule],
            declarations: [AddProductOfferToBundleComponent],
            providers: [MockBackend, BaseRequestOptions, ajaxUtilService, UtilityService,
                ProductService, dateFormatPipe, UrlConfigurationService, utilService, ProductOffersListService,
                ProductService, HttpClient, InfiniteScrollCheckService, AuthenticationService,
                { provide: LocaleService, useValue: MockLocalService },
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        })
            .compileComponents();
        spyOn(MockUtilSerivice, 'openAddPOModalPopUp').and.returnValue({ subscribe: () => { return true; } });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddProductOfferToBundleComponent);
        component = fixture.componentInstance;
        component.pagination = pagination;
        component.columnDef = { defaultSortOrder: 'desc' };
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should be initialized', () => {
        expect(fixture).toBeDefined();
        expect(component).toBeDefined();
    });
    it('should check component hide and show', () => {
       component.pagination = pagination;
        component.getGridConfigData();
        component.getCurrenciesAndPartitions();
        component.show();
        expect(component.visible).toBe(true);
        component.hide();
        expect(component.visible).toBe(false);
        expect(component.failedToAddPoError).toBe(false);
        expect(component.errorMessage).toEqual('');
        expect(component.loading).toBe(false);
    });
    it('should check default sort order', () => {
        component.convertDefaultSortOrder();
        expect(component.convertedDefaultSortOrder).toEqual(-1);
        component.columnDef = { defaultSortOrder: 'asc' };
        component.convertDefaultSortOrder();
        expect(component.convertedDefaultSortOrder).toEqual(1);
    });
    it('should check filter column', () => {
        component.pagination = pagination;
        component.sortQuery = 'name|asc';
        component.tableQuery = 'descriptionId=%bun%';
        component.filterFields = ['name'];
        component.clearFilters('name');
        expect(component.filterFields['name']).toEqual('');
    });
    it('should process product offer result with currencies and partitions', () => {
        component.sortQuery = 'name|asc';
        component.tableQuery = 'descriptionId=%bun%';
       component.pagination = InfiniteScrollDirective;
        component.createPOData = ProductOfferData.properties;
        component.selectedBundleData = ProductOfferData.properties;
        component.getCurrencies();
        expect(component.currencies.length).toEqual(3);
        component.getPartitions();
        expect(component.partitions.length).toEqual(0);
        component.processProductOfferResult([{ 'name': 'offer1' }], false);
    });
    it('should check loading', () => {
       component.pagination = pagination;
        component.lazyLoad = true;
        component.sortQuery = 'name|asc';
        component.tableQuery = 'descriptionId=%bun%';
        component.loadData(loadData);
        expect(component.getColumnSortOrder).toEqual('asc');
        component.removeFilterFetchingError();
        expect(component.filterErrorMessage).toEqual('');
    });
    it('should check filter and scrool in grid', () => {
       component.pagination = pagination;
        component.sortQuery = 'name|asc';
        component.tableQuery = 'descriptionId=%bun%';
       component.scrollInitialize(component.pagination);
        component.getMoreData();
        component.getDeviceWidth();
        component.filterFields = 'name';
        component.isFilterText('name');
        component.pagination =  pagination;
        component.filterDataProcessing = false;
        component.filterDataDelay();
        expect(component.filterDataProcessing).toBe(true);
        component.handleFailedToAddPoError('Sample Error');
        expect(component.failedToAddPoError).toBe(true);
        expect(component.failedToAddPoErrorMessage).toEqual('Sample Error');
        component.deleteErrorMessage();
        expect(component.failedToAddPoError).toBe(false);
    });
    it('should check selectPO with true value', () => {
      component.selectPO(1, {target: {checked: true}});
      component.addPoToBundle();
      component.selectPO(1, {target: {checked: false}});
    });
    it('should check any PO selected', () => {
        expect(component.checkAnyPOSelected()).toBe(true);
        component.loading = true;
        expect(component.checkAnyPOSelected()).toBe(true);
    });
    it('should check change currency and partition', () => {
       component.pagination = pagination;
        component.sortQuery = 'name|asc';
        component.tableQuery = 'descriptionId=%bun%';
        component.changeCurrencyItem('USD');
        expect(component.selectedCurrency).toEqual('USD');
        component.pagination = pagination;
        component.changePartitionItem('root');
        expect(component.selectedPartition).toEqual('root');
    });
    it('should check selected filter dates', () => {
        component.pagination = pagination;
        component.sortQuery = 'startDate|asc';
        component.tableQuery = 'startDate=%20/12/13%';
        component.filterFields = ['startDate,availableStartDate,endDate,availableEndDate'];
        component.fetchDateValues({selectedColumn: 'startDate', selectedValue: 'startDate' });
        expect(component.filterFields['startDate']).toEqual('startDate');
        component.pagination = pagination; 
        component.sortQuery = 'avaStartDate|asc';
        component.tableQuery = 'avaStartDate=%20/12/13%';
        component.fetchDateValues({selectedColumn: 'availableStartDate', selectedValue: 'avaStartDate' });
        expect(component.filterFields['availableStartDate']).toEqual('avaStartDate');
        component.pagination = pagination; 
        component.sortQuery = 'endDate|asc';
        component.tableQuery = 'endDate=%20/12/13%';
        component.fetchDateValues({selectedColumn: 'endDate', selectedValue: 'endDate' });
        expect(component.filterFields['endDate']).toEqual('endDate');
        component.pagination = pagination; 
        component.sortQuery = 'avlEndDate|asc';
        component.tableQuery = 'avlEndDate=%20/12/13%';
        component.fetchDateValues({selectedColumn: 'availableEndDate', selectedValue: 'avlEndDate' });
        expect(component.filterFields['availableEndDate']).toEqual('avlEndDate');
        component.pagination = pagination; 
        component.fetchDateValues({selectedColumn: 'startDate', selectedValue: ''});
    });
    it('should call filterDataKeys', () => {
        component.filterDataKeys('event','displayName','result');
    });
});
