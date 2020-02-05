import { AuthenticationService } from '../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, inject,
  utilService, UtilityService, ajaxUtilService,
  HttpClient, UrlConfigurationService, HttpClientTestingModule,
  svcData
} from '../../assets/test/mock';

import { localizationService } from './localization.service';

describe('LocalizationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [localizationService, MockBackend, BaseRequestOptions,
        ajaxUtilService, UrlConfigurationService, utilService, HttpClient, AuthenticationService,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should call LocalizationService...', inject([localizationService], (service: localizationService) => {
    expect(service).toBeTruthy('');
    service.saveLocalizationData(svcData);
    service.localizationData(svcData);
    svcData.data.type = 'Bundle';
    service.localizationData(svcData);
    svcData.data.type = 'PriceableItemTemplates';
    service.localizationData(svcData);
    svcData.data.type = 'Subscription';
    service.localizationData(svcData);
    svcData.data.type = 'Localization';
    service.localizationData(svcData);
    svcData.data.type = 'Offering';
    service.localizationData(svcData);
    svcData.data.type = 'PIDetais';
    service.localizationData(svcData);
    service.getPropertyKindData({});
  }));
});