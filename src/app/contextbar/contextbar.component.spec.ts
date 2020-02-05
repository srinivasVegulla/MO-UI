import { AuthenticationService } from '.../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed, CapabilityService,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
  utilService, UtilityService, ajaxUtilService, loadData, dateFormatPipe,
  HttpClient, contextBarHandlerService, UrlConfigurationService, HttpClientTestingModule,
  ProductService, modalService, SharedPricelistService, TranslationService, LocaleService,
  LocaleConfig, LocaleStorage, TranslationConfig, TranslationProvider, TranslationHandler
} from '../../assets/test/mock';
import { InfiniteScrollCheckService } from '../helpers/InfiniteScrollCheck.service';

import { ContextbarComponent } from './contextbar.component';

describe('ContextbarComponent', () => {
  let component: ContextbarComponent;
  let fixture: ComponentFixture<ContextbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContextbarComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [contextBarHandlerService, utilService, CapabilityService,
        MockBackend, BaseRequestOptions, modalService, HttpClient, SharedPricelistService,
        ajaxUtilService, UrlConfigurationService, ProductService, UtilityService,
        TranslationService, LocaleService, LocaleConfig, LocaleStorage, TranslationConfig,
        TranslationProvider, TranslationHandler, dateFormatPipe, InfiniteScrollCheckService,
        AuthenticationService,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextbarComponent);
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
  it('should check delete bundle', () => {
    component.deleteProductOfferDetails();
    expect(component.confirmDialog).toEqual(1);
    component.deleteSubscription();
    component.deleteBundle();
    expect(component.deleteBundleBoolean).toBe(true);
  });
  it('should check display cover for po and bundle', () => {
    component.displayCoverHandlerPO();
    component.SaveLocalizationUpdate();
    component.deleteSharedRatelist();
    expect(component.confirmDialog).toEqual(2);
    component.deletePItemplateRecord();
    expect(component.confirmDialog).toEqual(4);
  });
  it('should check confirm dialog', () => {
    component.SavePIRateScheduleDetails();
    component.addProductOfferDetails();
    component.checkConfigurationDetails();
    expect(component.configLoading).toBe(true);
    component.onModelConfigDialogClose(loadData);
    expect(component.confirmDialog).toEqual(0);
    component.onCloseDeletePItemplate(loadData);
    expect(component.confirmDialog).toEqual(0);
    component.onCloseDeleteSharedRate(loadData);
    expect(component.confirmDialog).toEqual(0);
  });
});
