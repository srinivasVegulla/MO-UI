import {
    MockBackend, RouterTestingModule, TestBed, modalService, Router,
    BaseRequestOptions, Http, utilService, ajaxUtilService,
    HttpClient, UrlConfigurationService, inject, HttpClientTestingModule, svcData
} from '../../assets/test/mock';
import { MockRouter } from '../../assets/test/mock-router';

import { AuthenticationService } from '../security/authentication.service';
import { MockAuthenticationService } from 'assets/test/mock-authentication-service';

describe('AuthenticationService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [MockBackend, BaseRequestOptions, ajaxUtilService,
                UrlConfigurationService, utilService, HttpClient,
                {provide: Router, useValue: MockRouter }, AuthenticationService,
             
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }
            ]
        });
    });

    it('should call AuthenticationService...', inject([AuthenticationService], (service: AuthenticationService) => {
        expect(service).toBeTruthy('');
        service.login(svcData.authentication);
        service.processToken(svcData.authentication, svcData.authentication.data.username);
        service.getAuthentication();
        service.isAuthenticated();
        service.getAccessToken();
        service.getRefreshToken();
        service.clearFailedRequests();
        expect(service.cachedRequests.length).toEqual(0);
        service.getFailedRequest();
        service.changeIsRefreshTokenCalled(true);
        service.getMetranetTicketDetail({ data: [] });
        service.refreshToken();
        service.collectFailedRequests([]);
        service.getClientIdSecret(svcData.authentication);
    }));

});