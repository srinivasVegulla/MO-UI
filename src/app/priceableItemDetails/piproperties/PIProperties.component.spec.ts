import { AuthenticationService } from '.../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, CapabilityService,
  utilService, UtilityService, ajaxUtilService, sharedService, FormGroup,
  HttpClient, UrlConfigurationService, LocaleConfig, LocaleStorage, LocaleService,
  FormsModule, ReactiveFormsModule, TranslationService, TranslationConfig, dateFormatPipe,
  TranslationProvider, TranslationHandler, priceableItemDetailsService, PiTemplateDetailsService,
  HttpClientTestingModule, loadData, showHidefunc, modalService, PriceableItemTemplateService, keyEventData, inject,
} from '../../../assets/test/mock';
import { MockLocalService } from '../../../assets/test/mock-local-service';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

import { PIPropertiesComponent } from './PIProperties.component';

describe('PIPropertiesComponent', () => {
  let component: PIPropertiesComponent;
  let fixture: ComponentFixture<PIPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[ FormsModule, ReactiveFormsModule, RouterTestingModule,  HttpClientTestingModule],
      declarations: [ PIPropertiesComponent ],
      providers:[sharedService, utilService, BaseRequestOptions, MockBackend, UtilityService,
        modalService, priceableItemDetailsService, ajaxUtilService, UrlConfigurationService, HttpClient,
        TranslationService, LocaleConfig, LocaleStorage, TranslationConfig, TranslationProvider, TranslationHandler,
        PiTemplateDetailsService, PriceableItemTemplateService, dateFormatPipe,
        { provide: LocaleService, useValue: MockLocalService}, AuthenticationService, CapabilityService,
        
          {
              provide: Http,
              useFactory: (backend, options) => new Http(backend, options),
              deps: [MockBackend, BaseRequestOptions]
          },
        ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(inject([CapabilityService], _capabilityService  => {
    _capabilityService.loggedInUserCapabilities = {UIPIDetailsPage: {Adjustments_Edit: true,Adjustments_View: true,Billing_Edit: true,Billing_View: true,ChildPI_Edit: true,ChildPI_View: true,ExtProps_Edit: true,ExtProps_View: true,Name_Edit: true,Permission_View: true,Props_Edit: true}};
    fixture = TestBed.createComponent(PIPropertiesComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should be initialized', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
  });
  it('should call ngOnInit', () => {
    component.ngOnInit();
    component.oneTimeCharges = ProductOfferData.oneTimeCharges;
    expect(component.eventType).toBe(false);
    ProductOfferData.oneTimeCharges.onsubscription = true;
    ProductOfferData.oneTimeCharges.unsubscription = null;
    component.oneTimeCharges = ProductOfferData.oneTimeCharges;
    expect(component.eventType).toBe(true);
    component.onRadioButtonClick([]);
    expect(component.isSaveEnabled).toBe(true);
    component.displayEditPanel(showHidefunc);
    expect(component.showCover).toBe(true);
    expect(component.isSaveEnabled).toBe(false);
    component.PIPropertiesWidget = showHidefunc;
    component.closeEditPanel();
    expect(component.isSaveEnabled).toBe(false);
    component.cancelCoverHandler();
    component.onModalDialogCloseCancel(loadData);
    expect(component.confirmDialog).toEqual(0);
    expect(component.piEventTypes.length).toEqual(2);
    expect(component.PIPropertiesForm instanceof FormGroup).toBe(true);
    component.PIPropertiesForm.controls['itemInstanceName'].setValue(ProductOfferData.properties.name);
    component.PIPropertiesForm.controls['itemInstanceDisplayName'].setValue(ProductOfferData.properties.displayName);
    component.savePIProperties(ProductOfferData.oneTimeCharges);
    component.removeSpace();
  });

  it('should check autoGrow', () => {
    component.autoGrow();
  });

  it('Should not allow spaces', () => {
    keyEventData.keyCode = 32;
    component.disableSpace(keyEventData);
  });


});