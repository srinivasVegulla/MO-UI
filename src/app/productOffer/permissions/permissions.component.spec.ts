import { AuthenticationService } from '.../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, DebugElement,
  utilService, ajaxUtilService, dateFormatPipe,
  HttpClient, UrlConfigurationService,  loadData, By, CapabilityService,
  TranslationService, TranslationProvider, TranslationHandler, ProductService, approvals, approvalData,
  LocaleConfig, LocaleStorage, TranslationConfig, contextBarHandlerService,
  NgxAsideModule, ReactiveFormsModule, FormsModule, sharedService,
  RouterModule, LocaleService, HttpClientTestingModule, modalService, UtilityService, inject
} from '../../../assets/test/mock';
import { MockAuthenticationService } from '../../../assets/test/mock-authentication-service';
import { MockLocalService } from '../../../assets/test/mock-local-service';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

import { PermissionsComponent } from './permissions.component';
import { MomentModule } from 'angular2-moment';
import { calenderLocaleFeilds } from '../../../assets/calenderLocalization';
import { CalendarModule } from 'primeng/primeng';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('PermissionsComponent', () => {
  let component: PermissionsComponent;
  let fixture: ComponentFixture<PermissionsComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxAsideModule, RouterTestingModule, FormsModule, MomentModule,
        HttpClientTestingModule, ReactiveFormsModule, CalendarModule, BrowserAnimationsModule],
      declarations: [PermissionsComponent, dateFormatPipe],
      providers: [LocaleService, LocaleConfig, LocaleStorage, contextBarHandlerService, ProductService,
        MockBackend, BaseRequestOptions, ajaxUtilService, UrlConfigurationService, utilService, dateFormatPipe, 
        sharedService, modalService, HttpClient, TranslationService, TranslationConfig, UtilityService,
        TranslationProvider, TranslationHandler, AuthenticationService, CapabilityService,
        { provide: LocaleService, useValue: MockLocalService },
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
    _capabilityService.loggedInUserCapabilities = {UIPoDetailsPage: {SubsSettings_Edit: true}};
    fixture = TestBed.createComponent(PermissionsComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('h2'));
    el = de.nativeElement;
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
  });
  it('should check initial values', () => {
    component.defaultPartitions = '123456';
    component.isClassVisible = false;
    expect(component.isClassVisible).toEqual(false);
    component.isPartitionIdVisible = false;
    expect(component.isPartitionIdVisible).toEqual(false);
    component.showCover = false;
    expect(component.showCover).toEqual(false);
    component.showPermissions = false;
    expect(component.showPermissions).toEqual(false);
    component.showErrorMessage = false;
    expect(component.showErrorMessage).toEqual(false);
    expect(component.showPermissions).toEqual(false);
  });

  it('should check default partitions', () => {
    component.defaultpartitions = ProductOfferData.permissions;
    expect(component.defaultPartitions).toEqual(1);
    component.partitionsIDs = ProductOfferData.permissions;
    expect(component.partitions).toEqual(ProductOfferData.permissions.partitions);
  });
  it('should check save and close functionality', () => {
    const contextBarHandService = fixture.debugElement.injector.get(contextBarHandlerService);
    contextBarHandService.changeContextSaveButton(false);
    component.permissions = ProductOfferData.permissions;
    expect(component.permissionstList).toEqual(ProductOfferData.permissions);
    component.accEligibilityChange([]);
    component.changeDropdown('par');
    expect(component.selectedPartition).toEqual('par');
    component.isFormValid();
    component.savePOPermissions(ProductOfferData.permissions);
    component.displayCoverHandler(ProductOfferData.permissions);
    component.cancelCoverHandler(ProductOfferData.permissions);
    component.onFormFieldChange('startDate');
    component.closeEditPanel();
    component.processAccTypeList([]);
    component.onModalDialogCloseCancel(loadData);
    expect(component.confirmDialog).toEqual(0);
    component.POPermissions.controls['userSubscribe'].setValue(true);
    component.POPermissions.controls['userUnsubscribe'].setValue(false);
    expect(component.POPermissions.valid).toBeTruthy();
    // Subscribe to the Observable and store the permissionstList in a local variable.
    contextBarHandService.savePermissions.subscribe((value) => component.permissionstList = value);
  });
  it('should display changed title', () => {
    const updateTitle = 'UPDATE_TEXT_PERMISSIONS';
    el.textContent = updateTitle;
    expect(el.textContent).toBe(updateTitle);
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
