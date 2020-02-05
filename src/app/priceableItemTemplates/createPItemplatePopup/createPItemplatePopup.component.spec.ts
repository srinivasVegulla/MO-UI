import { AuthenticationService } from '.../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
    utilService, UtilityService, ajaxUtilService, contextBarHandlerService,
    HttpClient, UrlConfigurationService, LocaleConfig, LocaleStorage, LocaleService,
    PriceableItemTemplateService, HttpHandler, dateFormatPipe,
    TranslationService, TranslationConfig, TranslationProvider, TranslationHandler,
    RouterModule, TranslatePipe
} from '../../../assets/test/mock';
import { CreatePItemplatePopupComponent } from './createPItemplatePopup.component';

describe('CreatePItemplatePopupComponent', () => {
    let component: CreatePItemplatePopupComponent;
    let fixture: ComponentFixture<CreatePItemplatePopupComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule, RouterTestingModule],
            declarations: [CreatePItemplatePopupComponent, TranslatePipe],
            providers: [MockBackend, BaseRequestOptions, ajaxUtilService, PriceableItemTemplateService,
                utilService, UrlConfigurationService, UtilityService, HttpClient, HttpHandler, dateFormatPipe,
                TranslationService, TranslationConfig, TranslationProvider, TranslationHandler,
                AuthenticationService, LocaleService,
                LocaleConfig, LocaleStorage,
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
        fixture = TestBed.createComponent(CreatePItemplatePopupComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should be initialized', () => {
        expect(fixture).toBeDefined();
        expect(component).toBeDefined();
    });
    it('should call functions', () => {
        component.ngOnInit();
        component.setSelectedType(0);
        component.openCreateForm();
        component.closeCreateForm();
        expect(component.isSaveEnabled).toBe(false);
        component.prepareFilterQuery();
        component.getPriceableItemtFilterData();
        component.clearFilters('name');
        component.isFilterText('name');
        component.loadData({ sortField: true });
        component.getDeviceWidth();
        component.onModalDialogClose([]);
        expect(component.confirmDialog).toEqual(0);
        component.getErrorMessageType();
        expect(component.showErrorMessage).toBe(true);
        component.availableChargeTypesFetching = true;
        expect(component.getErrorMessageType()).toEqual(0);
        component.availableChargeTypesErrorMessage = false;
        expect(component.getErrorMessageType()).toEqual(0);
        component.availableChargeTypesErrorMessage = true;
        expect(component.getErrorMessageType()).toEqual(0);
        component.inUseOfferingsSubscribe = true;
    });
    it('should call filterDataKeys', () => {
        component.filterDataKeys('event','displayName','result');
    });
});
