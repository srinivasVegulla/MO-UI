import { AuthenticationService } from '../../app/security/authentication.service';
import {
    MockBackend, RouterTestingModule, TestBed,
    BaseRequestOptions, Http, utilService, ajaxUtilService,
    HttpClient, UrlConfigurationService, inject, HttpClientTestingModule, svcData
} from '../../assets/test/mock';
import { CalendarsService } from './calendars-list.service';

describe('CalendarsService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientTestingModule],
            providers: [CalendarsService, MockBackend, BaseRequestOptions, ajaxUtilService,
                UrlConfigurationService, utilService, HttpClient, AuthenticationService,
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }
            ]
        });
    });
    it('should call CalendarsService ...', inject([CalendarsService], (service: CalendarsService) => {
        expect(service).toBeTruthy('');
        service.getCalendarLists('');
        service.createCalendars('');
        const options = {data: {calendarID : '123', name: 'abc'}};
        service.saveCopyCalendar(options);
        service.getCalendarDetails(options);
        service.getCalendarNameAvailability(options);
        service.deleteCalendar(options);
        service.getInUsePriceableItems(options);
    }));
});