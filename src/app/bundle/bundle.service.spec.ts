import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed, inject,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
  utilService, UtilityService, ajaxUtilService, RouterModule, HttpClient, HttpHandler, loadData,
  TranslationModule, UrlConfigurationService, svcData, dateFormatPipe,
  sharedService, contextBarHandlerService, getWindow,
} from '../../assets/test/mock';
import { MockAuthenticationService, AuthenticationService } from '../../assets/test/mock-authentication-service';
import { BundleService } from './bundle.service';

const MockAuthService = {
  login: () => { return true; }
};

describe('BundleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule, RouterTestingModule, HttpClientTestingModule],
      providers: [BundleService, MockBackend, BaseRequestOptions,
        ajaxUtilService, UrlConfigurationService, utilService, HttpClient,
        { provide: AuthenticationService, useValue: MockAuthService },
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should call BundleService...', inject([BundleService], (service: BundleService) => {
    expect(service).toBeTruthy('');
    const bundleInf = { data: { displayName: 'bundle', bundleId: 1 } };
    service.getBundleData(bundleInf);
    service.changeSelectedBundleCheckPo(bundleInf);
    service.deleteBundle(bundleInf);
  }));
});
