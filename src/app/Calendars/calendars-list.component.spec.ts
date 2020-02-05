import { AuthenticationService } from '.../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, TestBed, loadData, calendarPropertiesList,
    BaseRequestOptions, Http, utilService, ajaxUtilService, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA,
    HttpClient, UrlConfigurationService, HttpClientTestingModule, ComponentFixture, async,
    UtilityService, TranslationService, LocaleService, LocaleConfig, LocaleStorage, TranslationConfig,
    TranslationProvider, TranslationHandler, dateFormatPipe, TranslatePipe, pagination, HttpHandler
} from '../../assets/test/mock';
import { CalendarListComponent } from './calendars-list.component';
import { CalendarsService } from './calendars-list.service';
import { InfiniteScrollCheckService } from 'app/helpers/InfiniteScrollCheck.service';

describe('CalendarListComponent', () => {
    let component: CalendarListComponent;
    let fixture: ComponentFixture<CalendarListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [CalendarListComponent, TranslatePipe],
            providers: [ajaxUtilService, AuthenticationService, LocaleService, CalendarsService, MockBackend, BaseRequestOptions,
                UrlConfigurationService, TranslationService, utilService, UtilityService, LocaleConfig, LocaleStorage, HttpHandler,
                TranslationConfig, TranslationProvider, HttpClient, TranslationHandler, dateFormatPipe, InfiniteScrollCheckService,
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }
            ], schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CalendarListComponent);
        component = fixture.componentInstance;
        component.showCreateCalendarPanel = false;
        component.scrollInitialize(pagination);
        component.calendarsColumnDef = {defaultSortColumn: 'name', defaultSortOrder: 'asc', 'cols': [{ 'field': 'name'}]};
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should be initialized', () => {
        expect(fixture).toBeDefined();
        expect(component).toBeDefined();
        expect(component.copyTooltip).toEqual('TEXT_COPY');
    });
    it('should check reset fields', () => {
        component.reset();
        expect(component.totalCount).toEqual(0);
    });
    it('should check column def with default sort order', () => {
        component.getGridConfigData();
        component.calendarsColumnDef = {name: 'name', defaultSortOrder: 'asc'};
        component.convertDefaultSortOrder();
        expect(component.convertedDefaultSortOrder).toEqual(1);
        component.calendarsColumnDef.defaultSortOrder = 'desc';
        component.convertDefaultSortOrder();
        expect(component.convertedDefaultSortOrder).toEqual(-1);
        component.getCalendarLists();
        expect(component.calendarlistFetching).toBe(false);
    });
    it('should check fetch Usage Count value', () => {
        component.fetchUsageCount({selectedValue: 'RC', selectedColumn: 'RC'});
        expect(component.selectedFilterData.selectedValue).toEqual('RC');
        component.pagination = pagination;
        component.fetchUsageCount({selectedValue: '', selectedColumn: 'RC'});
        expect(component.isFilterData).toBe(true);
    });
    it('should check calendarPanel', () => {
        component.openCreateCalendarPanel();
        expect(component.propertiesPanel).toBe(true);
        component.copyCalendarsHandler({name: 'sample'});
        expect(component.isCopyCalendar).toBe(true);
        component.hidePropertiesWidget(true);
        expect(component.showCreateCalendarPanel).toBe(false);
        component.isFormDirty(true);
        expect(component.isCalendarFormDirty).toBe(true);
        component.isFormDirty(false);
        expect(component.isCalendarFormDirty).toBe(false);
    });
    it('should process grid records', () => {
        component.processGridData({totalCount: 0, name: 'sample', inUsePriceItemListSize: 0});
        expect(component.isDeleteOrHide).toBe(false);
        component.loadData({});
        expect(component.isFilterText('name')).toBe(false);
        component.refreshData();
        expect(component.loadGridData).toBe(false);
        expect(component.getErrorMessageType()).toEqual(0);
        expect(component.isDeleteCalendarList({inUsePriceItemListSize: 0})).toBe(true);
        component.redirectToDetailPage({calendarId: 1});
    });
    it('should process openInuseOfferings', () => {
        component.openInuseOfferings({});
    });
    it('should process hideInUseCalendarModalDialog', () => {
        component.hideInUseCalendarModalDialog('e');
    });
    it('should process getCalenderListData', () => {
        component.getCalenderListData();
    });
    it('should process deleteCalendar', () => {
        component.deleteCalendar({}, 1);
    });
    it('should process onModalDialogCloseDelete', () => {
       component.calendarList = [{'Server error': 'failure request'}];
       component.calendarId = calendarPropertiesList.calendarId;
       component.deleteCalendarData = [{calendarId: 1}];
       component.deletecalendarErrorIndex  = 0;
        component.onModalDialogCloseDelete(loadData);
        expect(component.canPODeleted).toBe(false)
        });
     it('should process isDeleteCalendar', () => {
         component.isDeleteCalendar({});
     });
     it('should call filterDataKeys', () => {
         component.filterDataKeys('event','displayName','result');
     });
});
