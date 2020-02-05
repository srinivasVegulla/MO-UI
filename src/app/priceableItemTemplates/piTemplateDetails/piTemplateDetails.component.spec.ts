import { AuthenticationService } from '.../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
    utilService, UtilityService, ajaxUtilService,
    HttpClient, UrlConfigurationService, LocaleConfig, LocaleStorage, LocaleService,
    PriceableItemTemplateService, HttpHandler, dateFormatPipe, PiTemplateDetailsService,
    TranslationService, TranslationConfig, TranslationProvider, TranslationHandler,
    RouterModule, ReactiveFormsModule, FormsModule
} from '../../../assets/test/mock';
import { PiTemplateDetailsComponent } from './piTemplateDetails.component';
import { PIPropertiesComponent } from '../../priceableItemDetails/piproperties/PIProperties.component';

describe('PiTemplateDetailsComponent', () => {
    let component: PiTemplateDetailsComponent;
    let fixture: ComponentFixture<PiTemplateDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule, RouterTestingModule, ReactiveFormsModule, FormsModule],
            declarations: [PiTemplateDetailsComponent, PIPropertiesComponent],
            providers: [MockBackend, BaseRequestOptions, ajaxUtilService, PriceableItemTemplateService,
                utilService, UrlConfigurationService, UtilityService, HttpClient, HttpHandler,
                TranslationService, TranslationConfig, TranslationProvider, TranslationHandler,
                AuthenticationService, LocaleService,
                LocaleConfig, LocaleStorage, PiTemplateDetailsService, dateFormatPipe,
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PiTemplateDetailsComponent);
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
        const _piTemplateService = fixture.debugElement.injector.get(PriceableItemTemplateService);
        spyOn(_piTemplateService, 'deletePItemplateRecord').and.returnValue({ failure: [] });
        const _piTemplateDetailService = fixture.debugElement.injector.get(PiTemplateDetailsService);
        spyOn(_piTemplateDetailService, 'getPriceableTemplateDetails').and.returnValue(
            { success: { adjustmetWidget: true, kindType: 'RC', extendedProperties: [] } });
        component.ngOnInit();
        component.hidelocalizationWidget(true);
        expect(component.showLocalizationPanel).toBe(false);
        component.deletePItemplate();
        component.displayNavoutDialog(true);
        expect(component.isFormUpdated).toBe(true);
        component.displayNavoutDialog(false);
        expect(component.isFormUpdated).toBe(false);
        const _utilService = fixture.debugElement.injector.get(utilService);
        _utilService.changePreventUnsaveChange([]);
        component.canDeactivate();
        component.isFormUpdated = false;
        component.canDeactivate();
    });
});