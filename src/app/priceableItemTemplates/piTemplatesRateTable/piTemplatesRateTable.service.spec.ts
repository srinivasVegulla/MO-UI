import { AuthenticationService } from '.../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, inject, TestBed,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
  utilService, UtilityService, ajaxUtilService,
  HttpClient, UrlConfigurationService, HttpClientTestingModule
} from '../../../assets/test/mock';

import { PItemplatesRateTableService } from './piTemplatesRateTable.service';

describe('PItemplatesRateTableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [PItemplatesRateTableService, MockBackend, BaseRequestOptions,
        ajaxUtilService, UrlConfigurationService, utilService, HttpClient, AuthenticationService,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should call PItemplatesRateTableService...', inject([PItemplatesRateTableService], (service: PItemplatesRateTableService) => {
    expect(service).toBeTruthy('');
  }));
});