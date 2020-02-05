import { AuthenticationService } from '../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, inject,
    utilService, ajaxUtilService, HttpClient, UrlConfigurationService, svcData,
    HttpClientTestingModule
} from '../../assets/test/mock';

import { InfiniteScrollCheckService } from './InfiniteScrollCheck.service';
describe('InfiniteScrollCheckService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientTestingModule],
            providers: [MockBackend, BaseRequestOptions,
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

    it('should call InfiniteScrollCheckService ...', inject([InfiniteScrollCheckService],
        (service: InfiniteScrollCheckService) => {
            expect(service).toBeTruthy('');
    }));
});
