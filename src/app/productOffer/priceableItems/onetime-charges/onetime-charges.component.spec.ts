import { AuthenticationService } from '.../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, DebugElement,
  utilService, UtilityService, ajaxUtilService, LocaleService, TranslatePipe,
  HttpClient, UrlConfigurationService, Router, HttpClientTestingModule,
  TranslationService, TranslationConfig, TranslationProvider, TranslationHandler,
  LocaleConfig, LocaleStorage, dateFormatPipe, CapabilityService, inject
} from '../../../../assets/test/mock';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

import { MockRouter } from '../../../../assets/test/mock-router';
import { OnetimeChargesComponent } from './onetime-charges.component';
import { cardService } from '../priceable-items/priceableService';


describe('OnetimeChargesComponent', () => {

  let component: OnetimeChargesComponent;
  let fixture: ComponentFixture<OnetimeChargesComponent>;
  let element: HTMLElement;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnetimeChargesComponent, TranslatePipe],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [cardService, HttpClientTestingModule, UtilityService,
        UrlConfigurationService, ajaxUtilService, utilService, MockBackend, BaseRequestOptions,
        TranslationService, TranslationConfig, TranslationProvider, TranslationHandler,
        LocaleService, LocaleConfig, LocaleStorage, dateFormatPipe, AuthenticationService, CapabilityService,
        { provide: Router, useValue: MockRouter }, HttpClient,
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
    const fixtureBody = `<div id="cardTotalHeightNRC-0"></div>
    <div id="cardBodyNRC-0"></div>`;
    document.body.insertAdjacentHTML(
      'afterbegin', fixtureBody);
    fixture = TestBed.createComponent(OnetimeChargesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    de = fixture.debugElement;
  }));

  it('should create ontime charges Component ', () => {
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
    component.redirectToPIDetailsPage(1, ProductOfferData.cardController, 'OTC');
    component.removePIInstanceCard(1);
  });
  it('should call removePIInstanceIcon', () => {
    component.removePIInstanceIcon(1, 0);
    expect(component.removePIInstanceID).toBe(1);
  });
  it('should call handleErrorPIInstanceID', () => {
    component.handleErrorPIInstanceID('error');
    expect(component.isDeletePOError).toBe(true);
  });
  it('should call deleteErrorMessage', () => {
    component.deleteErrorMessage();
    expect(component.isDeletePOError).toBeFalsy();
  });
});