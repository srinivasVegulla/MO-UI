import { AuthenticationService } from '../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, TestBed,
  BaseRequestOptions, Http, utilService, ajaxUtilService,
  HttpClient, UrlConfigurationService, inject, HttpClientTestingModule, svcData
} from '../../assets/test/mock';

import { ProductOffersListService } from './productOfferList.service';

describe('ProductOffersListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [ProductOffersListService, MockBackend, BaseRequestOptions, ajaxUtilService,
        UrlConfigurationService, utilService, HttpClient, AuthenticationService,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });
  it('should call productOffersListService ...', inject([ProductOffersListService], (service: ProductOffersListService) => {
    expect(service).toBeTruthy('');
    service.changeHidePOFromList(true);
    service.changeUnHidePOFromList(true);
    service.getProductOffers([]);
    service.getProductOffersCurrencies([]);
    service.getFilteredProductOffers('');
    service.hidePO(svcData);
    service.unHidePO(svcData);
    service.exportToCSV([]);
  }));
});
