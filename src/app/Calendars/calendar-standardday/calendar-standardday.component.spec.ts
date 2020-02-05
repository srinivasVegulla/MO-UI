import { AuthenticationService } from '.../../app/security/authentication.service';

import { CalendarStandardDayComponent } from './calendar-standardday.component';
import {
    MockBackend, RouterTestingModule, TestBed,
    BaseRequestOptions, Http, utilService, ajaxUtilService, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA,
    HttpClient, UrlConfigurationService, inject, HttpClientTestingModule, svcData, ComponentFixture, async,
    UtilityService, TranslationService, LocaleService, LocaleConfig, LocaleStorage, TranslationConfig,
    TranslationProvider, TranslationHandler, dateFormatPipe, TranslatePipe
} from 'assets/test/mock';
import { CalendarsService } from '../calendars-list.service';
import { MockLocalService } from 'assets/test/mock-local-service';

describe('CalendarStandardDayComponent', () => {
    let component: CalendarStandardDayComponent;
    let fixture: ComponentFixture<CalendarStandardDayComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientTestingModule],
            declarations: [CalendarStandardDayComponent, TranslatePipe],
            providers: [CalendarsService, MockBackend, BaseRequestOptions, ajaxUtilService,
                { provide: LocaleService, useValue: MockLocalService },
                UrlConfigurationService, utilService, HttpClient, UtilityService, TranslationService, LocaleConfig, LocaleStorage,
                TranslationConfig, TranslationProvider, TranslationHandler, dateFormatPipe,
                AuthenticationService,
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
        fixture = TestBed.createComponent(CalendarStandardDayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(fixture).toBeTruthy();
        expect(component).toBeTruthy();
    });
    it('should check calendar id from selected calender', () => {
        component.selectedCalendarId = 1;
        expect(component.calendarId).toEqual(1);
    });
    it('should check process Standard Days and delete period', () => {
        component.calPeriodEditRecords = [{name: 'sample'}];
        component.calDefEditRecords = [{error: 'server error', pauseErrorCheck: 0}];
        component.ngOnInit();
        component.setDefaultDays({weekday: 'sunday', calendarId: 1 });
        component.onModalDialogCloseDeletePeriod({});
        component.deleteEditDefault({holidayId: 1}, 1);
        component.deleteAllPeriods('sample');
        expect(component.calPeriodEditRecords.length).toEqual(0);
    });
    it('should check add Remove Std Periods', () => {
        component.calPeriodEditRecords = [{name: 'sample'}];
        component.addRemoveStdPeriods({weekdays: ['sunday']}, 'sunday');
        expect(component.isDaySelected('sunday', 'sunday')).toEqual(true);
        expect(component.isDaySelected('sunday', 'Monday')).toEqual(false);
    });
    it('should get all periods', () => {
        const listPeriodId = component.getAllPeriods([{weekdays: ['THURSDAY', 'FRIDAY'], 
        weekDayPeriods: ['THURSDAY-1248', 'FRIDAY-1250']}]);
        expect(listPeriodId[0].periodId).toEqual('1248');
    });
    it('should delete periods', () => {
        const listPeriodId = component.getDeletePeriods([{weekdays: ['THURSDAY'], weekDayPeriods: ['THURSDAY-1248']}]);
        expect(listPeriodId.length).toEqual(0);
    });
    it('should process Sav eCalRecords', () => {
        component.calDefEditRecords = [{name: 'sample'}];
        component.calPeriodEditRecords = [{name: 'sampleperiod'}];
        component.processSaveCalRecords();
    });
});
