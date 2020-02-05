import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, TranslatePipe,
    utilService, UtilityService, ajaxUtilService, dateFormatPipe, CapabilityService,
    HttpClient, UrlConfigurationService, LocaleConfig, LocaleStorage, LocaleService,
    svcData, HttpClientTestingModule, FormsModule, ReactiveFormsModule, NgForm,
    TranslationService, TranslationConfig, TranslationProvider, TranslationHandler, Observable
} from '../../assets/test/mock';
import { MockLocalService } from '../../assets/test/mock-local-service';
import { MockAuthenticationService, AuthenticationService } from '../../assets/test/mock-authentication-service';

import { LoginComponent } from './login.component';
import { of } from 'rxjs/observable/of';
import { CombineLatestOperator } from 'rxjs/operators/combineLatest';


describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
            declarations: [LoginComponent, TranslatePipe],
            providers: [MockBackend, BaseRequestOptions, ajaxUtilService,
                UrlConfigurationService, utilService, LocaleConfig, LocaleStorage,
                HttpClient, NgForm, UtilityService, TranslationService, TranslationConfig,
                TranslationProvider, TranslationHandler, dateFormatPipe,
                 AuthenticationService , CapabilityService,
                 { provide: LocaleService, useValue: MockLocalService },
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA] // service is mentioned to whom component is interacting
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
    });
    it('should check capabilityservice details', () => {
        component.getUserCapabilities({});
    })
    it('should create login component', () => {
        expect(component).toBeTruthy();
    });
    it('should be initialized', () => {
        expect(fixture).toBeDefined();
        expect(component).toBeDefined();
    });
    it('should check user authenticated', async() => {
        component.model = {username: 'admin', password: 123};
        component.clientId = 'jyothCLI';
        component.clientSecret = 'jyothCLISecreaet';
        const authenticationService = fixture.debugElement.injector.get(AuthenticationService);
        component.checkAuthenticationDetails({});
        expect(authenticationService.clientId).toEqual(component.clientId);
        expect(authenticationService.clientSecret).toEqual(component.clientSecret);
        authenticationService.processToken({success: () => { return component.model; },
        data: {username: component.model.username}}, {access_token: 'access', refresh_token: 'refresh'});
        expect(sessionStorage.getItem('userName')).toEqual(component.model.username);
        expect(authenticationService.getAuthentication()).toEqual(authenticationService._authentication);
        authenticationService.isAuthenticated();
        expect(authenticationService._authentication.isAuthenticated).toBe(true);
        authenticationService.getAccessToken();
        expect(authenticationService._authentication.accessToken).toEqual('access');
        authenticationService.getRefreshToken();
        expect(authenticationService._authentication.refreshToken).toEqual('refresh');
        authenticationService.getMetranetTicketDetail({data: component.model.username});
        authenticationService.refreshToken();
        expect(authenticationService._authentication.refreshToken).toEqual('refresh');
        authenticationService.changeIsRefreshTokenCalled(false);
        expect(authenticationService.isRefreshTokenCalled.closed).toBe(false);
        authenticationService.getFailedRequest();
        expect(authenticationService.cachedRequests.length).toEqual(0);
        authenticationService.clearFailedRequests();
        expect(authenticationService.cachedRequests.length).toEqual(0);
        authenticationService.collectFailedRequests(['error']);
        expect(authenticationService.cachedRequests.length).toEqual(1);
    });
    it('should call functions', () => {
        const _ngForm = fixture.debugElement.injector.get(NgForm);
        component.login(_ngForm);
        component.logError(svcData, _ngForm, 404);
        component.clearFormFields(_ngForm);
        component.setFocusOnInput();
        component.onModalDialogCloseCancel({index: 0});
    });
    it('should check caps on and keydown event', () => {
        const e = new KeyboardEvent('keydown', {});
        component.IsCapsOn = true;
        component.loginLinkEnable(svcData.loginInfo);
        component.copyRights = svcData.loginInfo;
        component.changeLocale('us');
        component.onKeyPressEvent(e);
        component.onKeyDownEvent(e);
        expect(component.IsCapsOn).toBe(false);
    });
});
