import { AuthenticationService } from '.../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
    utilService, UtilityService, ajaxUtilService, RouterModule, HttpClient, HttpHandler,
    TranslationModule, UrlConfigurationService, LocaleService, dateFormatPipe
} from '../../../assets/test/mock';
import { MockLocalService } from '../../../assets/test/mock-local-service';

import { OfferingChangesComponent } from './offering-changes.component';
import { ApprovalService } from './../approval.service';

describe('OfferingChangesComponent', () => {
    let component: OfferingChangesComponent;
    let fixture: ComponentFixture<OfferingChangesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule, RouterTestingModule, TranslationModule.forRoot()],
            declarations: [OfferingChangesComponent],
            providers: [ApprovalService, ajaxUtilService, UtilityService, UrlConfigurationService,
                MockBackend, BaseRequestOptions, HttpClient, HttpHandler, utilService,
                AuthenticationService, dateFormatPipe,
                { provide: LocaleService, useValue: MockLocalService },
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }
            ], schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        })
            .compileComponents().then(() => {
                fixture = TestBed.createComponent(OfferingChangesComponent);
                component = fixture.componentInstance;
            });
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should be initialized', () => {
        expect(fixture).toBeDefined();
        expect(component).toBeDefined();
        component.ngOnInit();
        expect(component.showErrorMessage).toBe(false);
    });
    it('should check pending record', () => {
        const _utilSvc = fixture.debugElement.injector.get(utilService);
        _utilSvc.changeApprovalPending({changeType: 'OfferingUpdate'});
        component.pendingRecord = {changeType: 'OfferingUpdate'};
        expect(component.getErrorMessageType()).toEqual(0);
        component.getPendingOfferingChanges();
    });
});
