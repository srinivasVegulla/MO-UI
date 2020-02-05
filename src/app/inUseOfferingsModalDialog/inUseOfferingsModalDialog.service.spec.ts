import { AuthenticationService } from '../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, inject,
  utilService, ajaxUtilService, HttpClient, UrlConfigurationService, svcData,
  HttpClientTestingModule
} from '../../assets/test/mock';

import { InUseOfferingsModalDialogService } from './inUseOfferingsModalDialog.service';
import { InfiniteScrollCheckService } from '../helpers/InfiniteScrollCheck.service';
describe('InUseOfferingsModalDialogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [MockBackend, BaseRequestOptions, InUseOfferingsModalDialogService,
         ajaxUtilService, UrlConfigurationService, utilService, HttpClient, InfiniteScrollCheckService,
         AuthenticationService,
        {
        provide: Http,
        useFactory: (backend, options) => new Http(backend, options),
        deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should call InUseOfferingsModalDialogService ...', inject([InUseOfferingsModalDialogService], 
                            (service: InUseOfferingsModalDialogService) => {
    expect(service).toBeTruthy('');
    service.getInUseOfferings(svcData);
    svcData.data.offeringLocation = 'productOfferList';
    service.getInUseOfferings(svcData);
    svcData.data.offeringLocation = 'priceableItemTemplateGrid';
    service.getInUseOfferings(svcData);
    svcData.data.offeringLocation = 'priceableItemTemplateDetails';
    service.getInUseOfferings(svcData);
    svcData.data.offeringLocation = 'extendedProperties';
    service.getInUseOfferings(svcData);
  }));
});
