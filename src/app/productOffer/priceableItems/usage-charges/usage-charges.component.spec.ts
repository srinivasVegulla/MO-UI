import { AuthenticationService } from '.../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
  utilService, UtilityService, ajaxUtilService, HttpHandler,
  HttpClient, UrlConfigurationService, Router, CapabilityService,
  TranslationService, TranslationConfig, TranslationProvider, TranslationHandler,
  LocaleService, LocaleConfig, LocaleStorage, dateFormatPipe, inject, TranslatePipe
} from '../../../../assets/test/mock';
import { breadCrumbData } from '.../../assets/test/mock-breadcrumb';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';
import { MockRouter } from '../../../../assets/test/mock-router';

import { cardService } from '../priceable-items/priceableService';
import { UsageChargesComponent } from './usage-charges.component';


describe('UsageChargesComponent', () => {
  let component: UsageChargesComponent;
  let fixture: ComponentFixture<UsageChargesComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsageChargesComponent, TranslatePipe],
      imports: [RouterTestingModule],
      providers: [cardService, UrlConfigurationService, ajaxUtilService, utilService, MockBackend, BaseRequestOptions,
        HttpClient, HttpHandler, UtilityService, TranslationService, LocaleService, dateFormatPipe,
        TranslationConfig, TranslationProvider, TranslationHandler, LocaleConfig, LocaleStorage,
        { provide: Router, useValue: MockRouter }, AuthenticationService, CapabilityService,
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
    _capabilityService.loggedInUserCapabilities = {UIPoDetailsPage: {PIs_Add: true}};
    const fixtureBody = `<div id="cardTotalHeightUsage-0"></div>
    <div id="cardBodyUsage-0"></div>`;
    document.body.insertAdjacentHTML(
      'afterbegin', fixtureBody);
    fixture = TestBed.createComponent(UsageChargesComponent);
    component = fixture.componentInstance;
  }));

  it('should create usage charges Component ', () => {
    expect(component).toBeTruthy();
  });
  it('should be initialized', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
  });
  it('should call ngOnInit', () => {
    component.ngOnInit();
    component.usageChargeCards = true;
    expect(component.usageChargeCardsType).toBe(true);
  });
  it('should call cancelPIInstanceCard', () => {
    component.cancelPIInstanceCard();
    expect(component.cancelPIInstanceCard).toBeDefined();
  });
  it('should call getCardInfo', () => {
    component.removePIInstanceIcon(ProductOfferData.cardController.itemInstanceId, 0);
    
    component.removePIInstanceCard(ProductOfferData.cardController.itemInstanceId);
    component.deleteErrorMessage(ProductOfferData.cardController.itemInstanceId);
    expect(component.isDeletePOError).toBe(false);
    component.showChildTitleName(breadCrumbData.svcData);
    expect(component.showChildTitle).toBe(false);
  });
  it('should redirect to priceable items details page', () => {
    component.redirectToPIDetailsPage(1, ProductOfferData.cardController, 'USAGE');
    component.redirectToPIChildDetailsPage(1, ProductOfferData.cardController, ProductOfferData.cardController, 'USAGE');
  });
});