import { AuthenticationService } from '../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed, svcData,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, TranslationModule,
  utilService, UtilityService, ajaxUtilService, HttpHandler, keyEventData,
  HttpClient, UrlConfigurationService, HttpClientTestingModule, contextBarHandlerService,
  loadData, RouterModule, LocaleService, TranslationService, TranslationConfig, TranslationProvider,
  TranslationHandler, LocaleConfig, LocaleStorage, showHidefunc, Router, dateFormatPipe
} from '../../assets/test/mock';
import { MockAuthenticationService } from '../../assets/test/mock-authentication-service';
import { MockRouter } from '../../assets/test/mock-router';

import { SystembarComponent } from './systembar.component';

describe('SystembarComponent', () => {

  let component: SystembarComponent;
  let fixture: ComponentFixture<SystembarComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SystembarComponent],
      imports: [RouterTestingModule],
      providers: [ajaxUtilService, utilService, MockBackend, BaseRequestOptions, AuthenticationService, HttpClient,
        { provide: Router, useValue: MockRouter }, LocaleService, LocaleConfig, LocaleStorage, UrlConfigurationService,
        TranslationService, TranslationConfig, TranslationProvider, TranslationHandler, HttpHandler, UtilityService, dateFormatPipe,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }], schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })

      .compileComponents();
  }));

  beforeEach(() => {
    const fixtureBody = `<div class="ecb-mobiledefaultMenuDiv"></div>
    <div class="ecb-mobileTreeStructureDiv"></div>
    <div class="ecb-userAccountDropdown"></div>
    <div class="ecb-showDialog"></div>`;
    document.body.insertAdjacentHTML(
      'afterbegin',
      fixtureBody);
    fixture = TestBed.createComponent(SystembarComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    const authService = fixture.debugElement.injector.get(AuthenticationService);
  });

  it('should create systembar component', () => {
    expect(component).toBeTruthy();
  });

  it('should be initialized', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
  });

  it('should show nav bar in the small screens', () => {
    component.ngOnInit();
    component.showbreadcrumbNavbar();
    component.toggleuserAccountDropdown();
    component.systemBarSubscriptions = true;
    component.IsToShowTreeDiv = true;
    component.showbreadcrumbNavbar();
    component.toggleAccoutmenu = 1;
    component.toggleuserAccountDropdown();
    expect(component.showbreadcrumbNavbar).toBeDefined();
  });

  it('should be logged out of the application', () => {
    expect(component.logout).toBeDefined();
    const authService = fixture.debugElement.injector.get(AuthenticationService);
    spyOn(authService, 'revokeAuthentication');
    const mockRouter = fixture.debugElement.injector.get(Router);
    spyOn(mockRouter, 'navigateByUrl');
    component.logout();
    expect(authService.revokeAuthentication).toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).toHaveBeenCalled();
  });

  it('should append Ellipsis to Display Name if exceeds max length', () => {
    component.calculateBreadCrumbEllipsisWidth();
  });
});