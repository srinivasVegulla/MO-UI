import {
  MockBackend, RouterTestingModule, async, inject, TestBed, RouterModule, HttpHandler,
  BaseRequestOptions, Http, AuthenticationService, utilService, UtilityService, ajaxUtilService,
  HttpClient, UrlConfigurationService, HttpClientTestingModule, modalService, TranslationModule
} from '../../../../assets/test/mock';
import { MockAuthenticationService } from '../../../../assets/test/mock-authentication-service';

import { AddPriceableItemService } from './add-priceable-items.service';

describe('AddPriceableItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, RouterModule, HttpClientTestingModule, TranslationModule.forRoot()],
      providers: [AddPriceableItemService, HttpClientTestingModule, MockBackend,
        BaseRequestOptions, ajaxUtilService, UrlConfigurationService, utilService, HttpClient, HttpHandler,
        { provide: AuthenticationService, useValue: MockAuthenticationService},
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should call addPriceableItemService...', inject([AddPriceableItemService], (service: AddPriceableItemService) => {
    expect(service).toBeTruthy('');
    service.changeSendingFailedPiType([]);
  }));
});