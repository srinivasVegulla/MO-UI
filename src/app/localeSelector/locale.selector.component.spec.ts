import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, inject,
  AuthenticationService, utilService, UtilityService, ajaxUtilService,
  HttpClient, UrlConfigurationService, RouterModule, TranslationModule,
  LocaleConfig, LocaleStorage, dateFormatPipe, HttpHandler, LocaleService
} from '../../assets/test/mock';
import {
  MockLocalService
} from '../../assets/test/mock-local-service';
import { LocaleSelector } from './locale.selector.component';

describe('LocaleSelector', () => {
  let component: LocaleSelector;
  let fixture: ComponentFixture<LocaleSelector>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, RouterModule, TranslationModule.forRoot()],
      declarations: [LocaleSelector],
      providers: [BaseRequestOptions, MockBackend, LocaleConfig, LocaleStorage, utilService,
        ajaxUtilService, UrlConfigurationService, HttpClient, HttpHandler,
        dateFormatPipe,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: LocaleService, useValue: MockLocalService },
        { provide: UtilityService, useValue: MockLocalService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocaleSelector);
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
    component.changeLocale('gb');
    expect(component.isSelected('us')).toBe(false);
  });
});