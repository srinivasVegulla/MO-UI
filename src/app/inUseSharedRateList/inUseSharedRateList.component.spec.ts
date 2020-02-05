import { AuthenticationService } from '../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
    utilService, UtilityService, ajaxUtilService, TranslatePipe,
    HttpClient, UrlConfigurationService, RouterModule, PriceableItemTemplateService, 
    HttpHandler, dateFormatPipe, TranslationService, TranslationProvider, TranslationHandler,
    LocaleConfig, LocaleStorage, TranslationConfig, LocaleService,
    ProductService, TranslationModule, loadData, pagination
} from '../../assets/test/mock';
import { MockLocalService } from '../../assets/test/mock-local-service';
import { InuseSharedRateListComponent } from './inUseSharedRateList.component';
import { InuseSharedRatelistService } from './inUseSharedRateList.service';
import { InfiniteScrollCheckService } from '../helpers/InfiniteScrollCheck.service';

describe('InuseSharedRateListComponent', () => {
    let component: InuseSharedRateListComponent;
    let fixture: ComponentFixture<InuseSharedRateListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule, RouterTestingModule],
            declarations: [InuseSharedRateListComponent, TranslatePipe],
            providers: [MockBackend, BaseRequestOptions, ajaxUtilService, dateFormatPipe,
                utilService, UrlConfigurationService, UtilityService, InuseSharedRatelistService, InfiniteScrollCheckService,
                HttpClient, HttpHandler, TranslationService, TranslationProvider, TranslationHandler,
                LocaleConfig, LocaleStorage, TranslationConfig,
                AuthenticationService,
                { provide: LocaleService, useValue: MockLocalService },
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
        fixture = TestBed.createComponent(InuseSharedRateListComponent);
        component = fixture.componentInstance;
        component.sharedRatesData = {templateId: 1};
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should be initialized', () => {
        expect(fixture).toBeDefined();
        expect(component).toBeDefined();
    });
    it('should call filterDataKeys', () => {
        component.filterDataKeys('event','displayName','result');
    });
    it('should check filter, load event ', () => {
        component.pagination = pagination;
        component.getGridConfigData();
        component.clearFilters('name');
        component.filterFields['name'] = '';
        component.pagination = pagination;
        component.prepareFilterQuery();
        component.onLazyLoad = true;
        component.filterQuery = {name :"'%sd%'|like"};
        component.sortQuery = {name:'asc'};
        component.childNames = [541,654];
        component.loadData(loadData);
    });
});
