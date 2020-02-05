import { AuthenticationService } from '.../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, TestBed,
  BaseRequestOptions, Http, utilService, ajaxUtilService,
  HttpClient, UrlConfigurationService, inject, HttpClientTestingModule
} from '../../../../assets/test/mock';
import { cardService } from './priceableService';

describe('PriceableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule,],
      providers: [cardService, MockBackend, BaseRequestOptions, ajaxUtilService, UrlConfigurationService, utilService,
        HttpClient, AuthenticationService,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });
  it('should call priceableService...', inject([cardService], (service: cardService) => {
    expect(service).toBeTruthy('');
  }));
});
