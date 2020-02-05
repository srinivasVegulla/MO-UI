import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
     BaseRequestOptions, Http,  utilService,  ajaxUtilService,
    UrlConfigurationService, RouterModule
} from '../../assets/test/mock';

import { ErrorTooltipComponent } from './errorTooltip.component';

describe('ErrorTooltipComponent', () => {
    let component: ErrorTooltipComponent;
    let fixture: ComponentFixture<ErrorTooltipComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, RouterModule],
            declarations: [ErrorTooltipComponent],
            providers: [ MockBackend, BaseRequestOptions,
                ajaxUtilService, UrlConfigurationService, utilService,
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
        fixture = TestBed.createComponent(ErrorTooltipComponent);
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
    it('should call functions', () => {
        component.closeMe = true;
        expect(component.closeError).toBe(true);
        component.closeIcon = true;
        expect(component.isCloseIcon).toBe(true);
        component.closeIcon = false;
        expect(component.isCloseIcon).toBe(false);
    });
});