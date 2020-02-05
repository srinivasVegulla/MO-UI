import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
  utilService, UtilityService, ajaxUtilService,
  HttpClient, contextBarHandlerService, UrlConfigurationService,
  HttpClientTestingModule, RouterModule, PriceableItemTemplateService,
  HttpHandler, Router
} from '../../../assets/test/mock';
import { MockAuthenticationService, AuthenticationService} from '../../../assets/test/mock-authentication-service';
import { MockRouter } from '../../../assets/test/mock-router';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

import { CardControllerComponent } from './card-controller.component';

describe('CardControllerComponent', () => {

  let component: CardControllerComponent;
  let fixture: ComponentFixture<CardControllerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ CardControllerComponent ],
      imports: [ RouterTestingModule ],
      providers: [utilService, MockBackend, BaseRequestOptions, PriceableItemTemplateService,
                  ajaxUtilService, HttpClient, HttpHandler, UrlConfigurationService,
                    { provide: AuthenticationService, useValue: MockAuthenticationService},
                    { provide: Router, useValue: MockRouter },
                    {
                      provide: Http,
                      useFactory: (backend, options) => new Http(backend, options),
                      deps: [MockBackend, BaseRequestOptions]
                    } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardControllerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should create DiscountCharges Component ', () => {
    expect(component).toBeTruthy();
  });

  it('should be initialized', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
  });

  it('should call productoffer with pi and card controler', () => {
    component.ngOnInit();
    component.childPIInstance = ProductOfferData.cardController.pIInstance;
    component.ChildPItemplate = ProductOfferData.cardController.pIInstance;
    component.productOfferId = 1;
    component.redirectToPIDetailsPage(ProductOfferData.cardController);
    component.openChildPItemplate(ProductOfferData.cardController, 0);
  });
});