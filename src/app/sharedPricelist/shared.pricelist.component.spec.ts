import { AuthenticationService } from '../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, FormGroup,
  utilService, UtilityService, ajaxUtilService, HttpHandler,
  HttpClient, UrlConfigurationService, HttpClientTestingModule, contextBarHandlerService,
  TranslationService, LocaleService, TranslationProvider, CapabilityService,
  TranslationHandler, loadData, RouterModule, FormBuilder, dateFormatPipe, TranslationConfig,
  LocaleConfig, LocaleStorage, showHidefunc, getWindow, TranslatePipe, inject
} from '../../assets/test/mock';
import { MockAuthenticationService } from '../../assets/test/mock-authentication-service';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';
import { SharedPricelistComponent } from './shared.pricelist.component';
import { SharedPricelistService } from './shared.pricelist.service';
import { InfiniteScrollCheckService } from '../helpers/InfiniteScrollCheck.service';


describe('SharedPricelistComponent', () => {
  let component: SharedPricelistComponent;
  let fixture: ComponentFixture<SharedPricelistComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [SharedPricelistComponent, TranslatePipe],
      providers: [MockBackend, BaseRequestOptions, SharedPricelistService, UtilityService, utilService, ajaxUtilService,
        UrlConfigurationService, HttpClient, HttpHandler, TranslationService, LocaleService, TranslationProvider,
        TranslationHandler, LocaleConfig, LocaleStorage, TranslationConfig, dateFormatPipe, InfiniteScrollCheckService, 
        CapabilityService, AuthenticationService,
        { provide: 'Window', useFactory: getWindow },
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(inject([CapabilityService], _capabilityService  => {
    _capabilityService.loggedInUserCapabilities = {UISharedRates: {SharedRates_Add: true}};
    fixture = TestBed.createComponent(SharedPricelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should be initialized', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
  });
  it('should set initial values', () => {
    component.ngOnInit();
    component.redirectToDetailPage(ProductOfferData.ratelist);
    component.openCreatePricelistPanel(showHidefunc);
    expect(component.showCover).toBe(true);
    component.deletePriceListData = ProductOfferData.ratelist;
    component.deletePriceListDataIndex = 0;
    component.sharedPricelist = ProductOfferData.subsciptions.error;
    component.onModalDialogCloseDelete(loadData);
    expect(component.confirmDialog).toEqual(0);
    ProductOfferData.subsciptions.error[0].error = 'errorDeleteSchedule';
    component.getRowClass(ProductOfferData.subsciptions.error[0], 0);
    ProductOfferData.subsciptions.error[0].error = 'noErrorDeleteSchedule';
    component.getRowClass(ProductOfferData.subsciptions.error[0], 0);
    component.deltePriceList(1, 0);
  });
  it('should call reset', () => {
    component.reset();
  });
  it('should call setCurrencies', () => {
    component.setCurrencies(ProductOfferData.properties.defaultCurrency.currencies);
  });
  it('should call setPartitions', () => {
    component.setPartitions(ProductOfferData.properties.defaultCurrency.partitions);
  });
  it('should call isDeleteSharedList', () => {
    component.isDeleteSharedList(ProductOfferData.ratelist);
  });
  it('should call getPartitionNameById', () => {
    component.getPartitionNameById(1);
  });
  it('should call onSubscriberClosed', () => {
    component.onSubscriberClosed();
  });
  it('should call copyPricelist', () => {
   component.sharedPricelists = showHidefunc;

    component.copyPricelist(loadData, 2);
  });
  it('should call OnTooltipClose', () => {
    component.OnTooltipClose();
  });
  it('should call filterDataKeys', () => {
    component.filterDataKeys('event','displayName','result');
  });
});
