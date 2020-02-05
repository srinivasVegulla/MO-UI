import { AuthenticationService } from '../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed, keyEventData,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, inject,
    utilService, UtilityService, ajaxUtilService, dateFormatPipe, HttpClient, UrlConfigurationService, loadData,
    RouterModule, HttpHandler, ProductService, TranslationModule, svcData, LocaleService
} from '../../assets/test/mock';
import { MomentModule } from 'angular2-moment';

import { InUseOfferingsModalDialogComponent } from './inUseOfferingsModalDialog.component';
import { InUseOfferingsModalDialogService } from './inUseOfferingsModalDialog.service';
import { InfiniteScrollCheckService } from '../helpers/InfiniteScrollCheck.service';
import { pagination } from 'assets/test/mock';

describe('InUseOfferingsModalDialogComponent', () => {
    let component: InUseOfferingsModalDialogComponent;
    let fixture: ComponentFixture<InUseOfferingsModalDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule, RouterTestingModule, TranslationModule.forRoot(), MomentModule ],
            declarations: [InUseOfferingsModalDialogComponent],
            providers: [MockBackend, BaseRequestOptions, ajaxUtilService, ProductService, dateFormatPipe,
                UrlConfigurationService, UtilityService, InUseOfferingsModalDialogService,
                HttpClient, HttpHandler, utilService, InfiniteScrollCheckService,
                AuthenticationService, LocaleService,
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(inject([LocaleService], _LocaleService  => {
        spyOn(_LocaleService, 'getCurrentLocale').and.returnValue('us');
        fixture = TestBed.createComponent(InUseOfferingsModalDialogComponent);
        component = fixture.componentInstance;
        component.isSubscription = true;
        component.pagination = pagination;
        component.inUseSortQuery = 'displayName|asc';
        component.inUseTableQuery = 'displayName=%bun%';
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should be initialized', () => {
        expect(fixture).toBeDefined();
        expect(component).toBeDefined();
    });
    it('should check initials values', () => {
        const _utilService = fixture.debugElement.injector.get(utilService);
        _utilService.changeRemoveScrollHeight(20);
        component.ngOnInit();
        expect(component.removeScrollHeight).toEqual(20);
        component.calculateGridScrollHeight();
    });
    it('should check scroll and keydown event', () => {
        const e = new KeyboardEvent('keydown');
        Object.defineProperty(e, 'key', keyEventData);
        component.handleKeyboardEvent(e);
        component.inUseOfferingsList = [{records: {offerId: 1}}];
        component.getMoreData();
        component.getLessData();
        component.inUseOfferingsList = undefined;
        component.getMoreData();
        expect(component.refreshDataCheck).toBe(false);
    });
    it('should check offering types', () => {
        component.partitions = [{},{label: 'root', value: 'roort'}];
        component.offeringsTypesList = [{}, {label: 'Bundle', value: 'Bundle'}];
        component.offeringsData = {offerId: 1};
         component.filterInUseFields = ['displayName'];
         component.clearInUseFilters('displayName');
        component.filterInUseData();
        component.processInUseOfferings(svcData.reasons);
        component.inUseLazyLoad = true;
        component.loadInUseData(loadData);
        expect(component.getInUseColumnSortOrder).toEqual('asc');
        component.removeInUseFilterFetchingError();
        expect(component.filterInUseErrorMessage).toEqual('');
        expect(component.isInUseFilterText('displayName')).toBe(false);
        component.filterInUseDataProcessing = false;
        component.filterInUseDataDelay();
        expect(component.filterInUseDataProcessing).toBe(true);
        component.inUseColumnDef = {defaultSortColumn: 'displayName', defaultSortOrder: 'asc'};
        component.onModalDialogClose(loadData);
        expect(component.confirmDialog).toEqual(0);
        component.getDeviceWidth();
        component.offeringsTypesList = [];
        component.getCurrenciesAndPartitions();
        component.inUseColumnDef = { cols: { displayName: 'bundle' } };
        component.convertInUseDefaultSortOrder();
        expect(component.convertedInUseDefaultSortOrder).toEqual(1);
    });
    it('should check offering types and partion dropdown', () => {
        component.offeringsTypes = [{'bundle': true}];
        component.offeringsData = {offerId: 1};
        component.offeringType();
        expect(component.offeringFirstItem).toEqual('Select');
        expect(component.filterInUseDataProcessing).toBe(false);
        component.changePartitionItem('root');
        expect(component.selectedPartition).toBe('root');
        component.changeOfferingType('bundle');
        expect(component.selectedOfferingType).toBe('bundle');
    });
    it('should check date filter and error message', () => {
        component.offeringsData = {offerId: 1};
        component.filterInUseFields = {availableStartDate: '25091993'};
        component.fetchDateValues({selectedColumn: 'availableStartDate', selectedValue: '25091993'});
        expect(component.filterInUseFields['availableStartDate']).toEqual('25091993');
        component.filterInUseFields = {availableStartDate: '25091993'};
        component.fetchDateValues({selectedColumn: 'availableEndDate', selectedValue: '25091993'});
        expect(component.filterInUseFields['availableEndDate']).toEqual('25091993');
        component.fetchDateValues({selectedColumn: 'availableStartDate', selectedValue: ''});
        expect(component.filterInUseFields['availableStartDate']).toEqual('');
        expect(component.getErrorMessageType()).toEqual(3);
        component.scrollReset();
        component.loading = true;
        expect(component.getErrorMessageType()).toEqual(0);
    });
    it('should call filterDataKeys', () => {
        component.filterDataKeys('event','displayName','result');
    });
});
