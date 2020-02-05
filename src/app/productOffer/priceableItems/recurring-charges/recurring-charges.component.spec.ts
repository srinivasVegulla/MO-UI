import { AuthenticationService } from '.../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
  BaseRequestOptions, Http, DebugElement, CapabilityService,
  utilService, UtilityService, ajaxUtilService, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA,
  HttpClient, UrlConfigurationService, Router, HttpClientTestingModule,
  TranslationService, TranslationConfig, TranslationProvider, TranslationHandler,
  LocaleService, LocaleConfig, LocaleStorage, dateFormatPipe, inject, TranslatePipe
} from '../../../../assets/test/mock';
import { MockRouter } from '../../../../assets/test/mock-router';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

import { RecurringChargesComponent } from './recurring-charges.component';
import { cardService } from '../priceable-items/priceableService';


describe('RecurringChargesComponent', () => {

  let component: RecurringChargesComponent;
  let fixture: ComponentFixture<RecurringChargesComponent>;
  let element: HTMLElement;
  let de: DebugElement;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [RecurringChargesComponent, TranslatePipe],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [cardService, UrlConfigurationService, ajaxUtilService,
        utilService, MockBackend, BaseRequestOptions, HttpClient, UtilityService, LocaleService,
        TranslationService, TranslationConfig, TranslationProvider, TranslationHandler,
        LocaleConfig, LocaleStorage, dateFormatPipe, AuthenticationService, CapabilityService,
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
    const fixtureBody = `<div id="cardTotalHeightRC-0"></div>
    <div id="cardBodyRC-0"></div>`;
    document.body.insertAdjacentHTML(
      'afterbegin',
      fixtureBody);
    fixture = TestBed.createComponent(RecurringChargesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    de = fixture.debugElement;
  }));
  it('should create recurring charges Component ', () => {
    expect(component).toBeTruthy();
  });
  it('should be initialized', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
  });
  it('should call ngOnInit', () => {
    component.ngOnInit();
    component.recurringChargeCards = ProductOfferData.recurringCharges;
    component.removePIInstanceIcon(1, 0);
    component.cancelPIInstanceCard();
    expect(component.removePIInstanceID).toEqual(-1);
    component.removePIInstanceCard(1);
  });

  it('should redirect to priceable items details page', () => {
    component.redirectToPIDetailsPage(1, ProductOfferData.cardController, 'RC');
  }); 
  it('should call handleErrorPIInstanceID', () => {
    component.handleErrorPIInstanceID('error');
    expect(component.isDeletePOError).toBe(true);
  });
  it('should call deleteErrorMessage', () => {
    component.deleteErrorMessage(1);
    expect(component.isDeletePOError).toBe(false);
  });
});