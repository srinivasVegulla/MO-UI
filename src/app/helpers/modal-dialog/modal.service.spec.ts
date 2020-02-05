import {
  MockBackend, inject, TestBed,
  BaseRequestOptions, Http, modalService
} from '../../../assets/test/mock';

describe('ModalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [modalService, MockBackend, BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should call ModalService...', inject([modalService], (service: modalService) => {
    expect(service).toBeTruthy('');
  }));
});