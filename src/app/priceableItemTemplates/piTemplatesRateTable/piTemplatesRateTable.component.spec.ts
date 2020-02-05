import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
    AuthenticationService, utilService, UtilityService, ajaxUtilService,
    HttpClient, UrlConfigurationService, PriceableItemTemplateService, HttpHandler,
    RouterModule, TranslationService, LocaleService, TranslationProvider, TranslationHandler,
    LocaleConfig, LocaleStorage, TranslationConfig, dateFormatPipe, TranslatePipe
} from '../../../assets/test/mock';
import { MockAuthenticationService } from '../../../assets/test/mock-authentication-service';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';


import { PItemplateRateTableComponent } from './piTemplatesRateTable.component';
import { PItemplatesRateTableService } from './piTemplatesRateTable.service';
import { PIPropertiesComponent } from '../../priceableItemDetails/piproperties/PIProperties.component';

describe('PItemplateRateTableComponent', () => {
    let component: PItemplateRateTableComponent;
    let fixture: ComponentFixture<PItemplateRateTableComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule, RouterTestingModule],
            declarations: [PItemplateRateTableComponent, TranslatePipe],
            providers: [MockBackend, BaseRequestOptions, ajaxUtilService, PriceableItemTemplateService,
                utilService, UrlConfigurationService, UtilityService, HttpClient, HttpHandler, dateFormatPipe,
                TranslationService, LocaleService, TranslationProvider, TranslationHandler,
                LocaleConfig, LocaleStorage, TranslationConfig,
                { provide: AuthenticationService, useValue: MockAuthenticationService }, PItemplatesRateTableService,
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
        fixture = TestBed.createComponent(PItemplateRateTableComponent);
        component = fixture.componentInstance;
        component.templateData = ProductOfferData.piDetails;
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
