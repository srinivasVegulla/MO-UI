import { AuthenticationService } from '.../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, TestBed,
  BaseRequestOptions, Http, utilService, ajaxUtilService,
  HttpClient, UrlConfigurationService, inject, HttpClientTestingModule
} from '../../../../assets/test/mock';
import { AddSubscriptionPropertiesService } from './addSubscriptionProperties.services';

describe('AddSubscriptionPropertiesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [AddSubscriptionPropertiesService, MockBackend, BaseRequestOptions,
        ajaxUtilService, UrlConfigurationService, utilService, HttpClient, AuthenticationService,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should call addSubsciptionProperties...', inject([AddSubscriptionPropertiesService], (service: AddSubscriptionPropertiesService) => {
    expect(service).toBeTruthy('');
  }));
});