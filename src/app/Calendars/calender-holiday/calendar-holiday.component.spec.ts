import { AuthenticationService } from '.../../app/security/authentication.service';
import { MockLocalService, } from '.././../../assets/test/mock-local-service';
import { CalendarHolidayComponent } from './calendar-holiday.component';
import {
    MockBackend, RouterTestingModule, TestBed,
    BaseRequestOptions, Http, utilService, ajaxUtilService, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA,
    HttpClient, UrlConfigurationService, inject, HttpClientTestingModule, showHidefunc, ComponentFixture, async,
    UtilityService, TranslationService, LocaleService, LocaleConfig, LocaleStorage, TranslationConfig,
    TranslationProvider, TranslationHandler, dateFormatPipe, TranslatePipe
} from 'assets/test/mock';
import { CalendarsService } from '../calendars-list.service';
import { MomentModule } from 'angular2-moment';
import { CopyRatesComponent } from 'app/rates/copyRates/copyRates.component';

describe('CalendarHolidayComponent', () => {
    let component: CalendarHolidayComponent;
    let fixture: ComponentFixture<CalendarHolidayComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientTestingModule, MomentModule],
            declarations: [CalendarHolidayComponent, TranslatePipe],
            providers: [CalendarsService, MockBackend, BaseRequestOptions, ajaxUtilService,
                UrlConfigurationService, utilService, HttpClient, UtilityService, TranslationService, LocaleConfig, LocaleStorage,
                TranslationConfig, TranslationProvider, TranslationHandler, dateFormatPipe, AuthenticationService,
                { provide: LocaleService, useValue: MockLocalService },
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }
            ], schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CalendarHolidayComponent);
        component = fixture.componentInstance;
        component.calDefEditRecords = [{day: 13, dayId: 1409 , holidayId: 1086, holidayLocaleDate: new Date('Sat Sep 25 1993'),
        month: 2, name: 'sample', periodCount: null, weekofmonth: null, year: 2019}];
        component.calDefaultColDef = {defaultSortColumn: 'name', defaultSortOrder: 'asc'};
        component.calDefViewRecords = [{day: 11,dayId: 1031,holidayId: 1015,holidayLocaleDate: new Date('Sat Sep 25 1993')}, 
                                       {day: 13, dayId: 1409 , holidayId: 1086, holidayLocaleDate: new Date('Wed Feb 27 2019')}
                                      ];
    });
    it('should create', () => {
        expect(fixture).toBeTruthy();
        expect(component).toBeTruthy();
    });
    it('should be initialized', () => {
        expect(fixture).toBeDefined();
        expect(component).toBeDefined();
        component.selectedCalendarId = 1;
        component.ngOnInit();
        expect(component.currentLocale).toEqual('us');
    });
    it('should set holiday names and add holiday', () => {
        component.setHolidayNames();
        expect(component.holidayNames[1].value).toEqual('sample');
        component.addDefFromView(showHidefunc, {holidayId: 1086}, 1);
        expect(component.showCover).toBe(true);
    });
    it('should close delete dialog', () => {
        component.delSelectedPeriodRecord = {periodId: 1};
        component.onModalDialogCloseDeletePeriod({index: 1});
        expect(component.confirmDialog).toEqual(0);
        component.onModalDialogCloseDeleteDefault({index: 1});
        expect(component.confirmDialog).toEqual(0);
        component.showCover = true;
        component.calPeriodEditRecords = [{periodId: 1}];
        component.onModalDialogCloseDeletePeriod({index: 1});
        expect(component.delSelectedPeriodRecord.periodId).toEqual(1);
        component.delSelectedDefaultRecord = {holidayId: 1086};
        component.onModalDialogCloseDeleteDefault({index: 1});
        expect(component.delSelectedDefaultRecord.holidayId).toEqual(1086);
    });

    it('should check GridconfigData', () => {
        component.getDefaultGridConfigData();
        component.getPeriodGridConfigData();
        component.validatePostAssignCalDate();
        component.saveEnableStatus();
        component.showOverrideTimePeriod();
        component.validateDefEditWidget(name);
        component.getPeriodRecordCountOfHolidays(name);
        component.deleteAllPeriods(name);
        component.OnDefaultTooltipCloseEdit();
        expect(component.newHoliday()).toEqual({holidayId: null,  holidayLocaleDate: null});
        component.OnDefaultTooltipCloseView();
        component.checkEnableSaveButton();
        component.isSaveEnabled();
    });
    it('should assign local date', () =>{
        component.assignLocaleDate(0);
        expect(component.calDefEditRecords[0]['day']).toEqual(25);
        expect(component.calDefEditRecords[0]['month']).toEqual(9);
        expect(component.calDefEditRecords[0]['year']).toEqual(1993);
        expect(component.calDefEditRecords[0]['holidayLocaleDate']).toEqual('1993-09-25T00:00:00-04:00');
    });
    it('should check processPeriodNameChange', () => {
        component.calPeriodEditRecords= [{day: 11,dayId: 1031,holidayId: 1015,holidayLocaleDate: new Date('Sat Sep 25 1993')}, 
                                         {day: 13, dayId: 1409 , holidayId: 1086, holidayLocaleDate: new Date('Wed Feb 27 2019')}
                                       ];
        component.processPeriodNameChange();
    });
});
