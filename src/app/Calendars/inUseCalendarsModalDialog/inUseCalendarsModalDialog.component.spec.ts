import { AuthenticationService } from '.../../app/security/authentication.service';
import {
    MockBackend, RouterTestingModule, TestBed, BaseRequestOptions, Http, utilService,
    ajaxUtilService, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA,
    HttpClient, UrlConfigurationService, HttpClientTestingModule, ComponentFixture, async,
    UtilityService, TranslationService, LocaleService, LocaleConfig, LocaleStorage, TranslationConfig,
    TranslationProvider, TranslationHandler, dateFormatPipe, TranslatePipe, loadCalData, caldata, calendarPropertiesList, pagination
} from '../../../assets/test/mock';
import { InUseCalendarsModalDialogComponent } from './inUseCalendarsModalDialog.component';

import { CalendarsService } from '../calendars-list.service';
import { MockAuthenticationService } from '.././../../assets/test/mock-authentication-service';
import { InfiniteScrollCheckService } from '../../helpers/InfiniteScrollCheck.service';

describe('InUseCalendarComponent', () => {
    let component: InUseCalendarsModalDialogComponent;
    let fixture: ComponentFixture<InUseCalendarsModalDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientTestingModule],
            declarations: [InUseCalendarsModalDialogComponent, TranslatePipe],
            providers: [CalendarsService, MockBackend, BaseRequestOptions, ajaxUtilService, LocaleService,
                UrlConfigurationService, utilService, HttpClient, UtilityService, TranslationService, LocaleConfig, LocaleStorage,
                TranslationConfig, TranslationProvider, TranslationHandler, dateFormatPipe,InfiniteScrollCheckService,
                { provide: AuthenticationService, useValue: MockAuthenticationService },
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }
            ], schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        const fixtureBody = `<div id="datatable"></div>`;
        document.body.insertAdjacentHTML(
            'afterbegin',
            fixtureBody);
        fixture = TestBed.createComponent(InUseCalendarsModalDialogComponent);
        component = fixture.componentInstance;
        component.inUseColumnDef = {defaultSortColumn: 'itemInstanceName', defaultSortOrder: 'asc'};
        component.pagination = pagination;
        component.filterInUseFields = { offerDisplayName: "pr" };
        component.inUsePIData = { calendarId: 549, description: null, name: "Calendar1" };
        component.inUseSortQuery = 'itemInstanceName|asc';
        component.inUseTableQuery = 'itemInstanceName=%bun%';
    });
    it('should create', () => {
        expect(fixture).toBeTruthy();
        expect(component).toBeTruthy();
    });
    it('should be initialized', () => {
        expect(fixture).toBeDefined();
        expect(component).toBeDefined();
    });
    it('should call filterDataKeys', () => {
        component.filterDataKeys('event', 'displayName', 'result');
    });
    it('should call clearInUseFilters', () => {
        component.inUseSortQuery = 'desc';
        component.loading = false;
        component.clearInUseFilters('offerDisplayName');
    });
    it('should call removeInUseFilterFetchingError', () => {
        component.offeringsTypesList = [{ label: 'TEXT_SELECT_CRITERIA', value: 'Select' }];
        component.removeInUseFilterFetchingError();
    });
    it('should call filterInUseData', () => {
        component.inUseSortQuery = 'desc';
        component.loading = false;
        component.filterInUseData();
    });
    it('should call scrollInitialize', () => {
        component.scrollInitialize(1);
    });
    it('should call scrollReset', () => {
        component.scrollReset();
    });
    it('should call getDeviceWidth', () => {
        component.getDeviceWidth();
    });
    it('should call getGridConfigData', () => {
        component.inUseSortQuery = 'desc';
        component.inUseTableQuery = 'itemInstanceName=%bun%';
        component.loading = false;
        component.getGridConfigData();
        component.scrollInitialize(1);
    });
    it('should call filterInUseDataDelay', () => {
        component.filterInUseDataDelay();
    });
    it('should call getLessData', () => {
        component.getLessData();
    });
    it('should check filter, sort and close dialog', () => {
         component.offeringsTypesList = [{}, {label: 'Bundle', value: 'Bundle'}];
         component.inUseSortQuery = 'itemInstanceName|asc';
        component.inUseTableQuery = 'itemInstanceName=%bun%';
          component.filterInUseFields = ['itemInstanceName'];
          component.inUseColumnDef = {defaultSortColumn: 'itemInstanceName', defaultSortOrder: 'asc'};
          component.inUsePIData = {calendarPropertiesList};
          component.pagination = pagination;
          component.clearInUseFilters('itemInstanceName');
          expect(component.isFilterData).toBe(true);
          component.clearfilters();
          expect(component.noInUseFilteredTableData).toBe(false);
          component.openInUseOfferings(calendarPropertiesList);
         component.processInUsePi(caldata.records);
         component.inUseLazyLoad = true;
         component.loadInUseData(loadCalData);
         expect(component.getInUseColumnSortOrder).toEqual('asc');
         component.removeInUseFilterFetchingError();
         expect(component.filterInUseErrorMessage).toEqual('');
         expect(component.isInUseFilterText('itemInstanceName')).toBe(false);
         component.filterInUseDataProcessing = false;
         expect(component.filterInUseDataProcessing).toBe(false);
          component.onModalDialogClose();
          expect(component.confirmDialog).toEqual(0);
          component.getDeviceWidth();
          component.offeringsTypesList = [];
          component.inUseColumnDef = { cols: { itemInstanceName: 'bundle' } };
          component.convertInUseDefaultSortOrder();
    });
});
