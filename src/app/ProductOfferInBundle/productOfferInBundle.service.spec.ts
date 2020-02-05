import { AuthenticationService } from '../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, TestBed,
  BaseRequestOptions, Http, utilService, ajaxUtilService,
  HttpClient, UrlConfigurationService, inject, HttpClientTestingModule, RouterModule
} from '../../assets/test/mock';

import { ProductOfferInBundleService } from './productOfferInBundle.service';

describe('ProductOfferInBundleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule, RouterTestingModule, HttpClientTestingModule],
      providers: [ProductOfferInBundleService, MockBackend, BaseRequestOptions,
        ajaxUtilService, UrlConfigurationService, utilService, HttpClient, AuthenticationService,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should call ProductOfferInBundleService...', inject([ProductOfferInBundleService], (service: ProductOfferInBundleService) => {
    expect(service).toBeTruthy('');
  }));
});
