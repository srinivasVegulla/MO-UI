import { AuthenticationService } from '.../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, TestBed,
  BaseRequestOptions, Http, utilService, ajaxUtilService,
  HttpClient, UrlConfigurationService, inject, HttpClientTestingModule
} from '../../../assets/test/mock';

import { SubscriptionpropertiesService } from './SubscriptionProperties.services';

describe('SubscriptionpropertiesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [SubscriptionpropertiesService, MockBackend, BaseRequestOptions, ajaxUtilService,
        UrlConfigurationService, utilService, HttpClient, AuthenticationService,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });
  it('should call SubscriptionpropertiesService...', inject([SubscriptionpropertiesService], (service: SubscriptionpropertiesService) => {
    expect(service).toBeTruthy('');
  }));
});