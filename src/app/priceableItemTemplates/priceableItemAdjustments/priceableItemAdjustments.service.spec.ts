import { AuthenticationService } from '.../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, inject, TestBed,
  BaseRequestOptions, Http, utilService, UtilityService, ajaxUtilService,
  HttpClient, UrlConfigurationService, HttpClientTestingModule
} from '../../../assets/test/mock';

import { PriceableItemAdjustmentsService } from './priceableItemAdjustments.service';

describe('PriceableItemAdjustmentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [PriceableItemAdjustmentsService, MockBackend, BaseRequestOptions,
        ajaxUtilService, UrlConfigurationService, utilService, HttpClient, AuthenticationService,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should call PriceableItemAdjustmentsService...',
    inject([PriceableItemAdjustmentsService], (service: PriceableItemAdjustmentsService) => {
      expect(service).toBeTruthy('');
    }));
});