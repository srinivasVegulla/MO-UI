import { AuthenticationService } from '../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, inject,
  utilService, UtilityService, ajaxUtilService, contextBarHandlerService,
  HttpClient, UrlConfigurationService, LocaleConfig, LocaleStorage, LocaleService,
  FormsModule, ReactiveFormsModule, HttpClientTestingModule
} from '../../assets/test/mock';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

import { priceableItemDetailsService } from './priceableItemDetails.service';


describe('PriceableItemDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [priceableItemDetailsService, MockBackend, BaseRequestOptions,
        UrlConfigurationService, utilService, HttpClient, ajaxUtilService, AuthenticationService,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should call PriceableItemDetailsService...', 
  inject([priceableItemDetailsService], (service: priceableItemDetailsService) => {
    expect(service).toBeTruthy('');
    service.changeIsPriceableItemUpdated(true);
    service.updatePriceableItem(ProductOfferData.piDetails);
    ProductOfferData.piDetails.data.body.kindType = 'USAGE';
    service.updatePriceableItem(ProductOfferData.piDetails);
    ProductOfferData.piDetails.data.body.kindType = 'NON_RECURRING';
    service.updatePriceableItem(ProductOfferData.piDetails);
    ProductOfferData.piDetails.data.body.kindType = 'RECURRING';
    service.updatePriceableItem(ProductOfferData.piDetails);
    ProductOfferData.piDetails.data.body.kindType = 'UNIT_DEPENDENT_RECURRING';
    service.updatePriceableItem(ProductOfferData.piDetails);
  }));
});
