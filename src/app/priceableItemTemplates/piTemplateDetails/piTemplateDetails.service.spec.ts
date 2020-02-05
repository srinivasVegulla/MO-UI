import { AuthenticationService } from '.../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, inject, TestBed,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
  utilService, UtilityService, ajaxUtilService,
  HttpClient, UrlConfigurationService, HttpClientTestingModule
} from '../../../assets/test/mock';

import { PiTemplateDetailsService } from './piTemplateDetails.service';

describe('PiTemplateDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [PiTemplateDetailsService, MockBackend, BaseRequestOptions,
        ajaxUtilService, UrlConfigurationService, utilService, HttpClient, AuthenticationService,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should call PiTemplateDetailsService...', inject([PiTemplateDetailsService], (service: PiTemplateDetailsService) => {
    expect(service).toBeTruthy('');
    service.changeIsPItemplateDetailsUpdated(true);
  }));
});