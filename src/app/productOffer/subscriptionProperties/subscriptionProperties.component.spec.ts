import { AuthenticationService } from '.../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, TranslationModule,
  utilService, UtilityService, ajaxUtilService, CapabilityService,
  HttpClient, UrlConfigurationService, HttpClientTestingModule, TranslationService,
  LocaleService, LocaleConfig, LocaleStorage, TranslationConfig, TranslationProvider, TranslationHandler,
  loadData, AddSubscriptionPropertiesService, svcData, TranslatePipe
} from '../../../assets/test/mock';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

import { SubscriptionPropertiesComponent } from './subscriptionProperties.component';
import { SubscriptionpropertiesService } from './subscriptionProperties.services';

const MockCapabilitiesService = {
  loggedInUserCapabilities: () => { return {UIPoDetailsPage: {SubsProps_Add: true}}; },
  findPropertyCapability: () => { return 'UIPoDetailsPage'; },
  getWidgetCapabilities: () => {}
};

describe('SubscriptionPropertiesComponent', () => {
  let component: SubscriptionPropertiesComponent;
  let fixture: ComponentFixture<SubscriptionPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [SubscriptionPropertiesComponent, TranslatePipe],
      providers: [MockBackend, BaseRequestOptions, ajaxUtilService, UrlConfigurationService,
        utilService, AddSubscriptionPropertiesService, HttpClient, SubscriptionpropertiesService,
        AuthenticationService, TranslationService, LocaleService, LocaleConfig, LocaleStorage, TranslationConfig,
        TranslationProvider, TranslationHandler, UtilityService,
        { provide: CapabilityService, useValue: MockCapabilitiesService },
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionPropertiesComponent);
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
    const _subscriptionpropertiesService = fixture.debugElement.injector.get(SubscriptionpropertiesService);
    _subscriptionpropertiesService.getShared(svcData);
    _subscriptionpropertiesService.deleteSubscription(svcData);
    component.ngOnInit();
    component.onToolTipClose(true);
    component.checkDate('03/14/2018');
    component.openAddSubscriptionItem();
    component.deleteSubscription(ProductOfferData.subsciptions, 1);
    expect(component.confirmDialog).toEqual(1);
    component.deleteSelectedSubscription();
    expect(component.errorTooltip).toBe(false);
    component.subscriptionList = ProductOfferData.subsciptions.error;
    component.handleErrorDeleteSubscription(ProductOfferData.subsciptions, 1);
    expect(component.errorTooltip).toBe(true);
    component.clearHighlight();
    ProductOfferData.subsciptions.error[0].error = 'errorDeleteSchedule';
    component.getRowClass(ProductOfferData.subsciptions.error[0], 1);
    component.onClick([]);
    component.onModalDialogCloseDelete(loadData);
    expect(component.confirmDialog).toEqual(0);
  });
});