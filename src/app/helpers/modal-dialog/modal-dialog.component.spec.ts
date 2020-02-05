import { AuthenticationService } from '.../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
    utilService, UtilityService, ajaxUtilService,
    HttpClient, contextBarHandlerService, UrlConfigurationService,
    HttpClientTestingModule, RouterModule, Router, dateFormatPipe,
    modalService, LocaleService, ProductOffersListService, sharedService,
    RatesService, ProductService
  } from '../../../assets/test/mock';
import { MockLocalService } from '../../../assets/test/mock-local-service';

import { ModalDialogComponent } from './modal-dialog.component';

describe('ModalDialogComponent', () => {
    let component: ModalDialogComponent;
    let fixture: ComponentFixture<ModalDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, RouterModule,HttpClientTestingModule],
            declarations: [ModalDialogComponent, dateFormatPipe],
            providers: [utilService, MockBackend, BaseRequestOptions, ProductService,
                ajaxUtilService, UrlConfigurationService, contextBarHandlerService,
                modalService, ProductOffersListService, sharedService, RatesService, HttpClient,
                AuthenticationService,
                {
                    provide: LocaleService, useValue: MockLocalService
                },
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalDialogComponent);
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
    });
});