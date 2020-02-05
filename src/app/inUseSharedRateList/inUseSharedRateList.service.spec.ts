import { AuthenticationService } from '../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, inject,
  utilService, UtilityService, ajaxUtilService,
  HttpClient, UrlConfigurationService, svcData, HttpClientTestingModule,
} from '../../assets/test/mock';

import { InuseSharedRatelistService } from './inUseSharedRateList.service';


describe('InuseSharedRatelistService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [MockBackend, BaseRequestOptions, InuseSharedRatelistService,
         ajaxUtilService, UrlConfigurationService, utilService, HttpClient, AuthenticationService,
        {
        provide: Http,
        useFactory: (backend, options) => new Http(backend, options),
        deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should call InuseSharedRatelistService ...', inject([InuseSharedRatelistService],
                            (service: InuseSharedRatelistService) => {
    expect(service).toBeTruthy('');
    svcData.data.offeringLocation = 'priceableItemTemplateGrid';
    service.getInUseSharedRatelist(svcData);
  }));
});
