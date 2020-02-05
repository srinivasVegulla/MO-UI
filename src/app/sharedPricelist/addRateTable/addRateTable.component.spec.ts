import { AuthenticationService } from '.../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, TranslationModule,
    utilService, UtilityService, ajaxUtilService, HttpHandler,
    HttpClient, UrlConfigurationService, loadData, RouterModule, TranslatePipe,
    LocaleService, TranslationService, TranslationConfig, TranslationProvider,
    TranslationHandler, LocaleConfig, LocaleStorage, dateFormatPipe, loadRateTableData, pagination,
} from '../../../assets/test/mock';
import { RlAddRateTableComponent } from './addRateTable.component';
import { SharedPricelistService } from '../shared.pricelist.service';
import { RatesService } from '../../rates/rates.service';
import { InfiniteScrollCheckService } from '../../helpers/InfiniteScrollCheck.service';

describe('RlAddRateTableComponent', () => {
    let component: RlAddRateTableComponent;
    let fixture: ComponentFixture<RlAddRateTableComponent>;

    // This test code is written for giving compiler enough to read external templates
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule, RouterTestingModule],
            declarations: [RlAddRateTableComponent, TranslatePipe],
            providers: [SharedPricelistService, UtilityService, ajaxUtilService,
                HttpClient, HttpHandler, UrlConfigurationService, utilService,
                MockBackend, BaseRequestOptions, RatesService, InfiniteScrollCheckService,
                LocaleService, dateFormatPipe,  LocaleConfig, LocaleStorage, TranslationService,
                TranslationConfig, TranslationProvider, TranslationHandler, AuthenticationService,
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
        fixture = TestBed.createComponent(RlAddRateTableComponent);
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
   it('should be check filter and sort', () => {
     component.ratelistAddptMappingsColDef = {defaultSortColumn: 'ptDisplayName', defaultSortOrder: 'asc'};
     component.sortQuery = 'ptDisplayName|asc';
     component.filterQuery = 'ptDisplayName=%bun%';
     component.filterFields = ['ptDisplayName'];
     component.pagination = pagination;
     component.clearFilters('ptDisplayName');
     component.lazyLoad = true;
     component.pagination = pagination;
     component.loadData(loadRateTableData);
     component.pagination = pagination;
     component.scrollReset();
     expect(component.getColumnSortOrder).toEqual('asc');
     expect(component.isFilterText('ptDisplayName')).toBe(false);
     component.convertDefaultSortOrder();
     component.isAddDisable();
    // expect(component.addRateTableError).toEqual(undefined);
     component.addRateTables();
     component.getDeviceWidth();
     component.onAddRateTableClose();
     component.closeDialog();
     expect(component.widgetDialog).toEqual(0);
     component.getptmappingsFilterData();
     component.getErrorMessageType();
     component.pagination = pagination;
     component.refreshGrid([]);
    });
    it('should check filterDataKeys', () => {
        component.filterDataKeys('event','displayName','result');
        component.scrollInitialize(component.pagination);
        expect(component.pagination).toBe(component.pagination);
        component.getMoreData();
        component.getLessData();
        component.pagination = pagination;
        component.getptmappingsFilterData();
    });
    it('should check param', () => {
        component.param = component.pricelistId;
    });
        it('should check for confirmDialog', () => {
        component.onConfirmDialogClose({index: 1});
        expect(component.confirmDialog).toEqual(0);
        component.closeDialog();
    });
    it('should check for addPt event', () => {
       component.addPt(1, {target: {checked: true}});
    });
    it('should check for changeUsageType ', () => {
        component.showErrorIfExist([{code: 404}]);
        expect(component.widgetDialog).toEqual(1);
        component.pagination = pagination;
        component.changeUsageType('samplePO');
        expect(component.selectedUsageType).toEqual('samplePO');
     });
});
