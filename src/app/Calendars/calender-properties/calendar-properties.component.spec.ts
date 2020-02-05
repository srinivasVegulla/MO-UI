import { AuthenticationService } from '.../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, TestBed, BaseRequestOptions, Http,ReactiveFormsModule,FormsModule,FormGroup,FormControl,utilService, ajaxUtilService, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA,
  HttpClient, UrlConfigurationService, inject, HttpClientTestingModule, svcData, ComponentFixture, async,
  UtilityService, TranslationService, LocaleService, LocaleConfig, LocaleStorage, TranslationConfig,
  TranslationProvider, TranslationHandler, dateFormatPipe, FormBuilder, TranslatePipe,calendarPropertiesList,keyEventData,showHidefunc, loadData,calendarInfoRec
} from '../../../assets/test/mock';
import { CreateCalendarComponent } from './calendar-properties.component';
import { CalendarsService } from '../calendars-list.service';
import { By } from 'selenium-webdriver';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

describe('CreateCalendarComponent', () => {
  let component: CreateCalendarComponent;
  let fixture: ComponentFixture<CreateCalendarComponent>;
  let calendarInfo: any;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,FormsModule,RouterTestingModule, HttpClientTestingModule],
      declarations: [CreateCalendarComponent, TranslatePipe],
      providers: [CalendarsService, MockBackend, BaseRequestOptions, ajaxUtilService, LocaleService,
        UrlConfigurationService, utilService, HttpClient, UtilityService, TranslationService, LocaleConfig, LocaleStorage,
        TranslationConfig, TranslationProvider, TranslationHandler, dateFormatPipe, FormBuilder, 
        AuthenticationService,
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
    fixture = TestBed.createComponent(CreateCalendarComponent);
    component = fixture.componentInstance;
    component.createcalendarAsidePanel = showHidefunc;
    component.calendarProperties = new FormGroup({
      name: new FormControl('name'),
      description: new FormControl()
  });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should be initialized', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
  });
  it('should call functions', () => {
    component.showPropertiesPanel = true;
    component.copyCalendardata = calendarPropertiesList;
    component.copyCalendar = false;
    expect(component.isCopyCalendar).toBe(false);
    component.copyCalendar = true;
    component.properties = calendarPropertiesList;
    component.defaultName = 'TEXT_DEFAULT_CALENDER_NAME';
  });
  it('should call handleKeyBoard event method', () => {
    const e = new KeyboardEvent('keydown');
    Object.defineProperty(e, 'key', keyEventData);
    component.handleKeyboardEvent(e);
  });
  it('should call cancelCoverHandler', () => {
    expect(component.calendarProperties instanceof FormGroup).toBe(true);
    component.cancelCoverHandler();
    expect(component.calendarProperties.dirty).toBe(false);
    component.calPropertiesAsidePanel = showHidefunc;
    component.onModalDialogCloseCancel(loadData);
    expect(component.confirmDialog).toEqual(0);
  });
  it('should call checkNameAvailability', () => {
    component.checkNameAvailability();
    component.validateProcessing = false;
    calendarInfo = calendarInfoRec.records;
    component.createCalendarForm();
    component.onEnterSaveCalendarProperties({keyCode :13});
    expect(component.calendarProperties instanceof FormGroup).toBe(true);
    component.calendarProperties.controls['name'].setValue(ProductOfferData.properties.name);
    component.saveCalendar();
    component.createNewCalendar();
    component.cancelPropCoverHandler();
    component.removeSpace();
  });
  it('should check autoGrow', () => {
    component.autoGrow();
  });
  it('Should not allow spaces', () => {
    keyEventData.keyCode = 32;
    component.disableSpace(keyEventData);
  });

});
