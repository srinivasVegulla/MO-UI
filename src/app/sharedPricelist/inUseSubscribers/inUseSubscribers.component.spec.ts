import { AuthenticationService } from '.../../app/security/authentication.service';
import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, TranslationModule,
    utilService, UtilityService, ajaxUtilService, HttpHandler,
    HttpClient, UrlConfigurationService, HttpClientTestingModule, contextBarHandlerService,
    loadData, ProductService, RouterModule, modalService, LocaleService,
    TranslationService, TranslationConfig, TranslationProvider, TranslationHandler, dateFormatPipe,
    LocaleConfig, LocaleStorage, TranslatePipe, pagination
} from '../../../assets/test/mock';
import { MockAuthenticationService } from '../../../assets/test/mock-authentication-service';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

import { RlInUseSubscribersComponent } from './inUseSubscribers.component';
import { SharedPricelistService } from '../shared.pricelist.service';
import { Column } from 'primeng/primeng';
import { InfiniteScrollCheckService } from '../../helpers/InfiniteScrollCheck.service';
describe('RlInUseSubscribersComponent', () => {
    let component: RlInUseSubscribersComponent;
    let fixture: ComponentFixture<RlInUseSubscribersComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule, HttpClientTestingModule, RouterTestingModule],
            declarations: [RlInUseSubscribersComponent, TranslatePipe],
            providers: [MockBackend, BaseRequestOptions, SharedPricelistService, ajaxUtilService,
                utilService, UrlConfigurationService, HttpClient, HttpHandler, UtilityService,
                TranslationService, LocaleService, LocaleConfig, LocaleStorage, TranslationConfig,
                TranslationProvider, TranslationHandler, dateFormatPipe, AuthenticationService, InfiniteScrollCheckService,
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
        fixture = TestBed.createComponent(RlInUseSubscribersComponent);
        component = fixture.componentInstance;
        component.pagination = pagination;
        component.priceListIdVal = ProductOfferData.ratelist;
        component.sortQuery = Object.keys({name: "asc"});
        component.tableQuery = Object.keys({accountType: "%CoreSubscriber%|like"})
        component.showInUseSubscribersDetails();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        
    });
    it('should be initialized', () => {
        expect(fixture).toBeDefined();
        expect(component).toBeDefined();
    });
    it('should call ngOnInit', () => {
        component.inUseSubscribersError = false;
        component.getErrorMessageType();
    });
    it('should call loadData', () => {
        component.lazyLoad = true;
        component.pagination = pagination;
        component.loadData(loadData);
    });
    it('should check fetching account id', () => {
        component.filterFields= {'name': 'ss'};
        component.fetchAccountId({selectedColumn:'name', selectedValue: ''});
        component.isFilterText(component.selectedFilterData.selectedColumn);
    });
    it('should call filterDataDelay', () => {
        component.filterDataDelay();
    });
    it('should call onModalDialogCloseDelete', () => {
        component.onModalDialogCloseDelete();
    });
    it('should call filterDataKeys', () => {
        component.filterDataKeys('event','displayName','result');
    });
});
