import { AuthenticationService } from '.../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
  utilService, UtilityService, ajaxUtilService,
  HttpClient, UrlConfigurationService, HttpHandler, loadData, priceableItemDetailsService,
  TranslationService, TranslationProvider, TranslationHandler, ProductService,
  LocaleConfig, LocaleStorage, TranslationConfig, showHidefunc, PiTemplateDetailsService,
  NgxAsideModule, ReactiveFormsModule, FormsModule, TranslationModule, sharedService, approvals, approvalData,
  RouterModule, LocaleService, HttpClientTestingModule, modalService, CapabilityService, dateFormatPipe
} from '../../../assets/test/mock';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

import { ExtendedPropertiesComponent } from './extendedProperties.component';

const MockCapabilitiesService = {
  loggedInUserCapabilities: () => { return {UIPoDetailsPage: {ExtProps_Edit: true}}; },
  getWidgetCapabilities: () => { return 'UIPoDetailsPage'; },
  findPropertyCapability: () => {}
};

describe('ExtendedPropertiesComponent', () => {
  let component: ExtendedPropertiesComponent;
  let fixture: ComponentFixture<ExtendedPropertiesComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExtendedPropertiesComponent],
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
      providers: [utilService, sharedService, modalService, BaseRequestOptions, HttpClient,
        LocaleService, LocaleConfig, LocaleStorage, TranslationService,
        TranslationConfig, TranslationProvider, TranslationHandler, UtilityService, dateFormatPipe,
        { provide: CapabilityService, useValue: MockCapabilitiesService },
        MockBackend, ProductService, priceableItemDetailsService, TranslationService,
        ajaxUtilService, UrlConfigurationService, PiTemplateDetailsService,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedPropertiesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create extended component', () => {
    expect(component).toBeTruthy();
  });
  it('should be initialized', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
  });
  it('should call ngOnInit', () => {
    component.ngOnInit();
  });
  it('should check pi type', () => {
    component.PIType = 'Usage';
    expect(component.isDisabled).toBe(true);
    component.PIType = 'Discount';
    expect(component.isDisabled).toBe(true);
    component.PIType = '';
    expect(component.isDisabled).toBe(false);
  });
  it('should check type bundle or po', () => {
    component.type = 'PO';
    expect(component.isProductOffer).toBe(true);
    expect(component.isBundle).toBe(false);
    component.type = 'Bundle';
    expect(component.isProductOffer).toBe(false);
    expect(component.isBundle).toBe(true);
  });
  it('should check functions', () => {
    component.firstInput = ProductOfferData.externdedProps;
    component.extendedProperties = ProductOfferData.externdedProps;
    component.extendedPropertiesSubscriptions = true;
    component.createGroup();
    component.createExtPropertiesForm();
    component.onExtPropertiesFormChanges();
    expect(component.confirmDialog).toEqual(0);
    component.displayCoverHandler(showHidefunc, []);
    expect(component.showCover).toBe(true);
    component.cancelCoverHandler();
    component.closeEditPanel();
    expect(component.showCover).toBe(false);
    component.openInUseOfferings();
    expect(component.showInUseOfferings).toBe(true);
    component.onModalDialogCloseCancel(loadData);
    component.savePOExtProperties([]);
    component.onCheckboxSelect({}, ProductOfferData.externdedProps.values, 1);
  });
  it('should check approvalFlag', () => {
    component.approvalFlag = approvals;
    expect(approvals.Capabilities.Properties_Edit).toEqual(true);
    expect(approvals.approval.enableApprovalsEdit).toEqual(true);
    component.approvalFlag = approvalData;
    expect(approvals.approval.enableApprovalsEdit).toEqual(false);
    expect(approvals.Capabilities.Properties_Edit).toEqual(false);
});
});