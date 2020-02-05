import { AuthenticationService } from '.../../app/security/authentication.service';

import { DetailCalendarComponent } from './calendar-detail.component';
import { InUseCalendarsModalDialogComponent } from './../inUseCalendarsModalDialog/inUseCalendarsModalDialog.component';
import { CalendarStandardDayComponent } from './../calendar-standardday/calendar-standardday.component';
import { CreateCalendarComponent } from './../calender-properties/calendar-properties.component';

import {
  MockBackend, RouterTestingModule, TestBed,
  BaseRequestOptions, Http, utilService, ajaxUtilService, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA,
  HttpClient, UrlConfigurationService, inject, HttpClientTestingModule, ComponentFixture, async,
  UtilityService, TranslationService, LocaleService, LocaleConfig, LocaleStorage, TranslationConfig,
  TranslationProvider, TranslationHandler, dateFormatPipe, FormBuilder, TranslatePipe
} from '../../../assets/test/mock';

import { CalendarsService } from '../calendars-list.service';

describe('DetailCalendarComponent', () => {
  let component: DetailCalendarComponent;
  let fixture: ComponentFixture<DetailCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [DetailCalendarComponent, InUseCalendarsModalDialogComponent,
        CalendarStandardDayComponent, CreateCalendarComponent, TranslatePipe],
      providers: [ajaxUtilService, CalendarsService, MockBackend, BaseRequestOptions, LocaleService,
        UrlConfigurationService, utilService, HttpClient, UtilityService, TranslationService, LocaleConfig, LocaleStorage,
        TranslationConfig, TranslationProvider, TranslationHandler, dateFormatPipe, FormBuilder, AuthenticationService,
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
    fixture = TestBed.createComponent(DetailCalendarComponent);
    component = fixture.componentInstance;
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
  it('should call getcalendardata', () => {
    component.getCalender();
  });
  it('should call deletecalendar', () => {
    component.deleteCalendarFromDetail();
  });
});
