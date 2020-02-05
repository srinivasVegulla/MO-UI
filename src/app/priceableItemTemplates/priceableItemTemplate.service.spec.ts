import { AuthenticationService } from '../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, inject, TestBed,
  BaseRequestOptions, Http, utilService, UtilityService, ajaxUtilService,
  HttpClient, UrlConfigurationService, HttpClientTestingModule, modalService,
} from '../../assets/test/mock';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

import { PriceableItemTemplateService } from '../priceableItemTemplates/priceableItemTemplate.service';

describe('RatesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [PriceableItemTemplateService, MockBackend, BaseRequestOptions,
        ajaxUtilService, UrlConfigurationService, utilService, modalService, HttpClient,
        AuthenticationService,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should call PriceableItemTemplateService ...', inject([PriceableItemTemplateService], (service: PriceableItemTemplateService) => {
    expect(service).toBeTruthy('');
    ProductOfferData.piTemplateForm.selectedPItemplate.data.kind = 'DISCOUNT';
    service.getInUseOffers(ProductOfferData.piTemplateForm.selectedPItemplate);
    service.getChargeTypes(ProductOfferData.piTemplateForm.selectedPItemplate);
    service.getPItemplateNameAvailability(ProductOfferData.piTemplateForm.selectedPItemplate);
    service.deletePItemplateRecord(ProductOfferData.piTemplateForm.selectedPItemplate);
    service.createPItemplate(ProductOfferData.piTemplateForm.selectedPItemplate);
    ProductOfferData.piTemplateForm.selectedPItemplate.data.kind = 'NON_RECURRING';
    service.createPItemplate(ProductOfferData.piTemplateForm.selectedPItemplate);
    ProductOfferData.piTemplateForm.selectedPItemplate.data.kind = 'RECURRING';
    service.createPItemplate(ProductOfferData.piTemplateForm.selectedPItemplate);
    ProductOfferData.piTemplateForm.selectedPItemplate.data.kind = 'UNIT_DEPENDENT_RECURRING';
    service.createPItemplate(ProductOfferData.piTemplateForm.selectedPItemplate);
    ProductOfferData.piTemplateForm.selectedPItemplate.data.kind = '';
    service.createPItemplate(ProductOfferData.piTemplateForm.selectedPItemplate);
  }));
});