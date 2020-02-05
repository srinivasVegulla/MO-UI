import { AuthenticationService } from '../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, TestBed, modalService, Router,
  BaseRequestOptions, Http, utilService, ajaxUtilService,
  HttpClient, UrlConfigurationService, inject, HttpClientTestingModule, svcData
} from '../../assets/test/mock';

import { SharedPricelistService } from './shared.pricelist.service';

describe('RatesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [SharedPricelistService, MockBackend, BaseRequestOptions,
        ajaxUtilService, UrlConfigurationService, utilService, modalService, HttpClient, AuthenticationService,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should call sharedPricelistService ...', inject([SharedPricelistService], (service: SharedPricelistService) => {
    expect(service).toBeTruthy('');
    service.isRateTableMapped(true);
    service.changeSelectedSharedListBreadcrumbData([]);
    service.changedisplayName('error');
    service.createSharedPricelist({});
    service.deleteSharedPricelist(svcData);
    service.updateSharedPricelist({ data: { body: { pricelistId: 1 } } });
    service.getPricelistExtendedProps(svcData);
    service.getSharedRatesItem(svcData);
    service.getptMappings(svcData);
    service.addRateTables({});
  }));
});
