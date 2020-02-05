import {
  MockBackend, RouterTestingModule, TestBed,
  BaseRequestOptions, Http, utilService, ajaxUtilService,
  HttpClient, UrlConfigurationService, inject, HttpClientTestingModule
} from '../../../assets/test/mock';
import { MockAuthenticationService, AuthenticationService } from '../../../assets/test/mock-authentication-service';

import { AddProductOfferToBundleService } from './addProductOfferToBundle.service';

describe('AddProductOfferToBundleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [AddProductOfferToBundleService, MockBackend, BaseRequestOptions,
        ajaxUtilService, UrlConfigurationService, utilService, HttpClient, AuthenticationService,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should call AddProductOfferToBundleService...',
    inject([AddProductOfferToBundleService], (service: AddProductOfferToBundleService) => {
      expect(service).toBeTruthy('');
    }));
});