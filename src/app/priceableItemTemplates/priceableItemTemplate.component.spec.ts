import { AuthenticationService } from '../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
  utilService, UtilityService, ajaxUtilService,
  HttpClient, UrlConfigurationService, HttpHandler, loadData,
  TranslationService, TranslationProvider, TranslationHandler,
  LocaleConfig, LocaleStorage, TranslationConfig, showHidefunc,
  NgxAsideModule, ReactiveFormsModule, FormsModule, TranslationModule, FormGroup,
  RouterModule, dateFormatPipe, LocaleService, getWindow, keyEventData, pagination
} from '../../assets/test/mock';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';
import { PriceableItemTemplateComponent } from './priceableItemTemplate.component';
import { PriceableItemTemplateService } from './priceableItemTemplate.service';
import { contextBarHandlerService } from '../helpers/contextbarHandler.service';
import { InfiniteScrollCheckService } from '../helpers/InfiniteScrollCheck.service';

describe('PriceableItemTemplateComponent', () => {
  let component: PriceableItemTemplateComponent;
  let fixture: ComponentFixture<PriceableItemTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule, RouterTestingModule, NgxAsideModule, ReactiveFormsModule,
        FormsModule, TranslationModule.forRoot()],
      declarations: [PriceableItemTemplateComponent],
      providers: [PriceableItemTemplateService, UtilityService, ajaxUtilService, UrlConfigurationService, utilService,
        TranslationService, LocaleService, LocaleConfig, LocaleStorage,
        MockBackend, BaseRequestOptions, HttpClient, HttpHandler,
        dateFormatPipe, contextBarHandlerService, InfiniteScrollCheckService, AuthenticationService,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: 'Window', useFactory: getWindow },
      ], schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    const fixtureBody = `<input #displayName name="displayName" formControlName="displayName" maxlength="255">`;
    document.body.insertAdjacentHTML(
      'afterbegin',
      fixtureBody);
    fixture = TestBed.createComponent(PriceableItemTemplateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should be initialized', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
  });
  it('should call ngOnInit', () => {
    component.ngOnInit();
    component.pagination = pagination;
    component.getPItemplatelist();
    component.selectedPItemplate = {kind: 'DISCOUNT'}
    expect(component.createPItemplateForm instanceof FormGroup).toBe(true);
    component.createPItemplateForm.controls['name'].setValue(ProductOfferData.properties.name);
    component.createPItemplateForm.controls['displayName'].setValue(ProductOfferData.properties.displayName);
    component.createPItemplate();
  });
  it('should call functions', () => {
    component.reset();
  });
  it('should call getDeviceWidth', () => {
    component.getDeviceWidth();
  });
  it('should call openInuseOfferings', () => {
    component.openInuseOfferings({});
  });
  it('should call getErrorMessageType', () => {
    component.getErrorMessageType();
  });
  it('should call removeFilterFetchingError', () => {
    component.removeFilterFetchingError();
    expect(component.piTemplatelistError).toEqual('');
  });
  it('should call filterDataKeys', () => {
    component.filterDataKeys('event','displayName','result');
  });
  it('should call functions', () => {
    component.selectedPItemplate = ProductOfferData.piTemplateForm.selectedPItemplate.data;
    component.CreatePanelWidget = showHidefunc;
    component.piTemplatelist = [{error: ''}];
    component.openInuseSharedRatelist({});
    expect(component.showInUseSharedRatelist).toBe(true);
    component.isDeleteableTemplate(ProductOfferData.piTemplateForm.selectedPItemplate.data);
    component.deletePricelistRecord([], 0);
    expect(component.confirmDialog).toEqual(0);
    component.deltePItemplate(1, 0);
    component.OnTooltipClose();
    expect(component.errorTooltip).toBe(false);
    component.openTypesPopup();
    expect(component.isCreatePItemplate).toBe(true);
    component.closeCreatePopup([]);
    expect(component.isCreatePItemplate).toBe(false);
    component.closeCreatePItemplatePanel();
    expect(component.confirmDialog).toEqual(1);
    component.onModalDialogCloseCancel(loadData);
    component.deleteablePitemplateData = { templateId : 1};
    component.deleteablePitemplateDataIndex = 3;
    component.onModalDialogCloseDelete({ index: 0 });
    component.closeEditPanel();
    expect(component.showCover).toBe(false);
    component.openCreatePanel([], showHidefunc);
    expect(component.showCover).toBe(true);
    component.checkNameAvailability();
    component.onFormFieldChange();
    component.redirectToDetailPage(ProductOfferData.piTemplateForm.selectedPItemplate.data);
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