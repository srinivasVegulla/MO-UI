import { AuthenticationService } from '.../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
  utilService, UtilityService, ajaxUtilService, CapabilityService,
  HttpClient, contextBarHandlerService, UrlConfigurationService, HttpClientTestingModule,
  ProductService, SubscriptionpropertiesService, Observable,
  RouterModule, AddSubscriptionPropertiesService, BundleService, svcData, TranslationService, LocaleService, LocaleConfig, LocaleStorage, TranslationConfig, TranslationProvider, TranslationHandler, dateFormatPipe, FormBuilder
} from '../../assets/test/mock';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';
import { BundleComponent } from './bundle.component';
import { SubscriptionPropertyDetailsService } from '../subscriptionPropertyDetails/subscriptionPropertyDetails.service';

const MockCapabilitiesService = {
  loggedInUserCapabilities: () => { return {UIPoDetailsPage: {Offerings: true}}; },
  getWidgetCapabilities: () => { return 'UIPoDetailsPage'; },
  findPropertyCapability: () => { return 'UIPoDetailsPage'; }
};

describe('BundleComponent', () => {
  let component: BundleComponent;
  let fixture: ComponentFixture<BundleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [BundleComponent],
      providers: [ajaxUtilService, MockBackend, BaseRequestOptions, UrlConfigurationService,
        utilService, contextBarHandlerService, ProductService, HttpClient,
        SubscriptionpropertiesService, AddSubscriptionPropertiesService, AuthenticationService, SubscriptionPropertyDetailsService, UtilityService, TranslationService, LocaleService, LocaleConfig, LocaleStorage, TranslationConfig, TranslationProvider, TranslationHandler, dateFormatPipe, FormBuilder,
        { provide: CapabilityService, useValue: MockCapabilitiesService},
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
    const fixtureBody = `<div class="propertiesSkeleton"></div>
    <div class="extendedPropertiesSkeleton"></div>
    <div class="subscriptionProperties"></div>
    <div class="permissionSkeleton"></div>`;
    document.body.insertAdjacentHTML(
      'afterbegin',
      fixtureBody);
    fixture = TestBed.createComponent(BundleComponent);
    component = fixture.componentInstance;
    const _utilSvc = fixture.debugElement.injector.get(utilService);
    spyOn(_utilSvc, 'deleteProductOffer').and.returnValue(Observable.of(ProductOfferData.productOffer));
    const _bundleSvc = fixture.debugElement.injector.get(BundleService);
    spyOn(_bundleSvc, 'deleteBundle').and.returnValue(Observable.of(ProductOfferData.productOffer));
    const _subScripSvc = fixture.debugElement.injector.get(SubscriptionpropertiesService);
    spyOn(_subScripSvc, 'getShared').and.returnValue(Observable.of(ProductOfferData.productOffer));
    component.bundleId = 1;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
  it('should be initialized', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
  });
  it('should call ngOnInit', () => {
    component.ngOnInit();
    expect(component.isDeletePOError).toBe(false);
    component.intervalEvent();
  });
  it('should call bundle error handling and local storage values', () => {
    component.getBundleDetails();
    component.discardError();
    expect(component.showErrorMessage).toBe(false);
    component.handleErrorDeletePO(svcData);
    expect(component.isDeletePOError).toBe(true);
    component.updateOffering(true);
    component.bundleData.extendedProperties = true;
    component.hideWidget = true;
    component.getSubscriptionProperties();
    component.setLocalStorageValues(ProductOfferData.productOffer);
  });
});
