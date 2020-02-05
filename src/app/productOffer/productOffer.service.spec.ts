import { AuthenticationService } from '../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, TestBed,
  BaseRequestOptions, Http, utilService, ajaxUtilService,
  HttpClient, UrlConfigurationService, inject, HttpClientTestingModule
} from '../../assets/test/mock';

import { ProductService } from './productOffer.service';

describe('ProductOfferService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [ProductService, MockBackend, BaseRequestOptions,
        ajaxUtilService, UrlConfigurationService, utilService, HttpClient, AuthenticationService,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should call ProductOfferService...', inject([ProductService], (service: ProductService) => {
    expect(service).toBeTruthy('');
  }));
});