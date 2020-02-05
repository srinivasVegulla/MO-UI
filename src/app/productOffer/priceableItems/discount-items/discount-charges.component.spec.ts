import { AuthenticationService } from '.../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, DebugElement,
  utilService, UtilityService, ajaxUtilService, dateFormatPipe, TranslatePipe,
  HttpClient, UrlConfigurationService, Router, HttpClientTestingModule, CapabilityService,
  TranslationService, TranslationConfig, TranslationProvider, TranslationHandler,
  LocaleService, LocaleConfig, LocaleStorage, inject
} from '../../../../assets/test/mock';
import { MockRouter } from '../../../../assets/test/mock-router';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

import { DiscountChargesComponent } from './discount-charges.component';
import { cardService } from '../priceable-items/priceableService';


describe('DiscountChargesComponent', () => {

  let component: DiscountChargesComponent;
  let fixture: ComponentFixture<DiscountChargesComponent>;
  let element: HTMLElement;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DiscountChargesComponent, TranslatePipe],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [UrlConfigurationService, ajaxUtilService, cardService, HttpClientTestingModule,
        utilService, MockBackend, BaseRequestOptions, HttpClient, UtilityService, dateFormatPipe,
        TranslationService, TranslationConfig, TranslationProvider, TranslationHandler,
        LocaleService, LocaleConfig, LocaleStorage, AuthenticationService, CapabilityService,
        { provide: Router, useValue: MockRouter },
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
    const fixtureBody = `<div id="cardTotalHeightDiscount-0"></div>
    <div id="cardBodyDiscount-0"></div>`;
    document.body.insertAdjacentHTML(
      'afterbegin',
      fixtureBody);
    fixture = TestBed.createComponent(DiscountChargesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    de = fixture.debugElement;
  }));

  it('should create DiscountCharges Component ', () => {
    expect(component).toBeTruthy();
  });

  it('should be initialized', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
  });

  it('should call ngOnInit', () => {
    component.ngOnInit();
  });
  it('should call cancelPIInstanceCard', () => {
    component.cancelPIInstanceCard();
  });
  it('should call funcitons', () => {
    component.redirectToPIDetailsPage(1, ProductOfferData.cardController, 'RC');
    component.removePIInstanceIcon(1, 0);
    expect(component.removePIInstanceID).toEqual(1);
    component.removePIInstanceCard(1);
    component.handleErrorPIInstanceID('error');
    expect(component.isDeletePOError).toBe(true);
    component.deleteErrorMessage();
    expect(component.isDeletePOError).toBe(false);
  });
});