import { AuthenticationService } from '../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
    utilService, Router
} from '../assets/test/mock';
import { MockRouter } from '../assets/test/mock-router';

import { AppComponent } from './app.component';
import { ExpectedConditions } from 'protractor';

describe('AppComponent', () => {

    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            imports: [RouterTestingModule],
            providers: [utilService, MockBackend, BaseRequestOptions, AuthenticationService,
                { provide: Router, useValue: MockRouter },
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }], schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
    });

    it('should create the app', async(() => {
        expect(component).toBeTruthy();
    }));

    it(`should have as title `, async(() => {
        expect(component.title).toEqual('Product Offer Catalog');
        const _utilService = fixture.debugElement.injector.get(utilService);
        _utilService.checkTicketLoginObser(true);
        component.ngOnInit();
    }));

    it(`should subscribe to idleTimeout in oninit `, async(() => {
        expect(component.title).toEqual('Product Offer Catalog');
        const _utilService = fixture.debugElement.injector.get(utilService);
        _utilService.checkTicketLoginObser(true);
        component.ngOnInit();
        _utilService.idleTimedout.subscribe((state) => {
            expect(state.autoLoggingOff).toEqual(false);
            expect(this.toggleTimedoutDialog).toEqual(undefined);
        });
        _utilService.preventUnsaveChange.subscribe((value) => {
            expect(this.unsaveChangeData).toEqual(undefined);
            if (!this.isAutoLoggingOff) {
                expect(this.confirmDialog).toEqual(undefined);
            } else {
                expect(this.onModalDialogCloseCancel({ index: 0 })).toHaveBeenCalled();
            }
        });
    }));
});
