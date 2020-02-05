import { AuthenticationService } from '../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
  utilService, UtilityService, ajaxUtilService, contextBarHandlerService,
  HttpClient, UrlConfigurationService, LocaleConfig, LocaleStorage, LocaleService,
  FormsModule, ReactiveFormsModule, priceableItemDetailsService,
  HttpClientTestingModule, CapabilityService} from '../../assets/test/mock';

import { PriceableItemDetailsComponent } from './priceableItemDetails.component';
import { PIPropertiesComponent } from './piproperties/PIProperties.component';

import { MockAuthenticationService } from '../../assets/test/mock-authentication-service';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

const MockCapabilitiesService = {
  loggedInUserCapabilities: () => { return {UIPIDetailsPage: {UnitDetails_Edit: true}}; },
  getWidgetCapabilities: () => { return 'UIPIDetailsPage'; }
};

describe('PriceableItemDetailsComponent', () => {
  let component: PriceableItemDetailsComponent;
  let fixture: ComponentFixture<PriceableItemDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule,  HttpClientTestingModule, RouterTestingModule],
      declarations: [ PriceableItemDetailsComponent, PIPropertiesComponent ],
      providers: [ MockBackend, BaseRequestOptions, contextBarHandlerService, priceableItemDetailsService,
        ajaxUtilService, UrlConfigurationService, utilService, LocaleService, LocaleConfig, LocaleStorage,
        HttpClient, AuthenticationService, UtilityService,
        { provide: CapabilityService, useValue: MockCapabilitiesService },
        {
            provide: Http,
            useFactory: (backend, options) => new Http(backend, options),
            deps: [MockBackend, BaseRequestOptions]
        }
    ],
      schemas:[CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    const fixtureBody = `<div class="propertiesSkeleton"></div>
    <div class="extendedPropertiesSkeleton"></div>
    <div class="permissionSkeleton"></div>`;
    document.body.insertAdjacentHTML(
      'afterbegin',
      fixtureBody);
    fixture = TestBed.createComponent(PriceableItemDetailsComponent);
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
  it('should call functions', () => {
    const utilServices = fixture.debugElement.injector.get(utilService);
    spyOn(utilServices, 'piInstanceChildShow');
    expect(utilServices.piInstanceChildShow).toBeDefined();
  });
  it('should call priceableitemDetails', () => {
    component.priceableItemsData = ProductOfferData.piDetails;
    const priceableItemDetailSvc = fixture.debugElement.injector.get(priceableItemDetailsService);
    spyOn(priceableItemDetailSvc, 'getChildPriceableItems').and.returnValues(ProductOfferData.productOffer);
    expect(priceableItemDetailSvc.getChildPriceableItems).toBeDefined();
    priceableItemDetailSvc.changeIsPriceableItemUpdated(true);
    component.displayNavoutDialog(true);
    expect(component.isFormUpdated).toBe(true);
    expect(component.canDeactivate()).toBe(false);
    component.displayNavoutDialog(false);
    expect(component.isFormUpdated).toBe(false);
    expect(component.canDeactivate()).toBe(true);
    component.hideSkeleton();
  });
});
