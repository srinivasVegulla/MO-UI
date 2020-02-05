import { AuthenticationService } from '.../../app/security/authentication.service';

import {
    MockBackend, Keepalive, RouterTestingModule,
    FormsModule, ReactiveFormsModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, HttpHandler,
    LocaleService, LocaleConfig, LocaleStorage, utilService, Router,
    keyEventData, UtilityService, ajaxUtilService, HttpClient,
    UrlConfigurationService, TranslationService, TranslationConfig,
    TranslationProvider, TranslationHandler, dateFormatPipe, TranslatePipe, MockExpiry
} from '../assets/test/mock';
import { welcomeComponentData } from '../assets/test/mock-welcome-component';

import { MockRouter } from '../assets/test/mock-router';
import { MockIdle } from '../assets/test/mock-idle';
import { MockLocalService } from '../assets/test/mock-local-service';
import { Idle, DEFAULT_INTERRUPTSOURCES, IdleExpiry } from '@ng-idle/core';

import { WelcomeComponent } from './Welcome.component';
import { LoginComponent } from './login/login.component';

describe('WelcomeComponent', () => {
    let component: WelcomeComponent;
    let fixture: ComponentFixture<WelcomeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, FormsModule, ReactiveFormsModule],
            declarations: [WelcomeComponent, LoginComponent, TranslatePipe],
            providers: [MockBackend, BaseRequestOptions, Keepalive, UtilityService,
                LocaleService, LocaleConfig, LocaleStorage, utilService, ajaxUtilService,
                HttpClient, HttpHandler, UrlConfigurationService, TranslationService, TranslationConfig,
                TranslationProvider, TranslationHandler, dateFormatPipe, AuthenticationService,
                { provide: Router, useValue: MockRouter }, Idle,
                { provide: IdleExpiry, useClass: MockExpiry },
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                },
                { provide: LocaleService, useValue: MockLocalService },
              
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA] //  service is mentioned to whom component is interacting
        })
            .compileComponents();
    }));

    beforeEach(() => {
        const fixtureBody = `<div id="mainBody"></div>`;
        document.body.insertAdjacentHTML(
            'afterbegin',
            fixtureBody);
        fixture = TestBed.createComponent(WelcomeComponent);
        component = fixture.componentInstance;
        const _utilService = fixture.debugElement.injector.get(utilService);
        _utilService.checkSuccessTicketLoginObser(true);
        _utilService.checkNgxSlideModal(true);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should be initialized', () => {
        expect(fixture).toBeDefined();
        expect(component).toBeDefined();
    });
    it('should call init', () => {
        component.ngOnInit();
    });
    it('should check functions', () => {
        component.IdleTimeout();
        component.handleContextBarView(true);
        expect(component.isMobileDevice).toBe(true);
        const e = new KeyboardEvent('keydown');
        Object.defineProperty(e, 'key', keyEventData);
        component.handleKeyboardEvent(e);
        document.dispatchEvent(e);
        component.isTicketLogin();
        component.reset();
        component.startTimer();
        component.stopTimer();
        component.timeConverter(60);
        component.emitMessageToParent();
        component.onModalDialogCloseCancel({index: 0});
    });
});

