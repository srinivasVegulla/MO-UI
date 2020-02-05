import { AuthenticationService } from '../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, TestBed, modalService,
  BaseRequestOptions, Http, utilService, ajaxUtilService,
  HttpClient, UrlConfigurationService, inject, HttpClientTestingModule, svcData
} from '../../assets/test/mock';

import { RatesService } from './rates.service';


describe('RatesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [RatesService, MockBackend, BaseRequestOptions,
        ajaxUtilService, UrlConfigurationService, utilService, modalService, HttpClient, AuthenticationService,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should call RatesService ...', inject([RatesService], (service: RatesService) => {
    expect(service).toBeTruthy('');
    service.changeNextStateURL('rate');
    service.savePIRateSchedules([]);
    service.deleteRateDetail(svcData);
    service.deleteScheduleDetail(svcData);
    service.editRules(svcData);
    service.changeRateSourceCancelHandler(true);
    service.getPricelist(svcData);
    service.updatePricelistMappings(svcData);
    service.getParamTablesMetaData(svcData);
    service.copyRateSchedule(svcData);
  }));
});