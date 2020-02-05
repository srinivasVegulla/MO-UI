import { AuthenticationService } from '.../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, TranslationModule,
  utilService, UtilityService, ajaxUtilService, HttpHandler, keyEventData, FormGroup,
  HttpClient, UrlConfigurationService, HttpClientTestingModule, contextBarHandlerService,
  loadData, RouterModule, LocaleService, TranslationService, TranslationConfig, TranslationProvider,
  TranslationHandler, dateFormatPipe, LocaleConfig, LocaleStorage, showHidefunc, ReactiveFormsModule, FormsModule
} from '../../../assets/test/mock';
import { MockLocalService } from '../../../assets/test/mock-local-service';
import { MockTranslationService } from '../../../assets/test/mock-translation-service';
import { CreatePropertyData } from '../../../assets/test/mock-createproperty';

import { NgxAsideModule } from 'ngx-aside';
import { SecureHtmlPipe } from '../../helpers/secureHtml.pipe';
import { PopUpDrag } from '../../helpers/popUpDrag';
import { TextFilterPipe } from '../../helpers/textFilter.pipe';
import { CreateSubscriptionPropertyComponent } from './createSubscriptionProperty.component';
import { ComboboxComponent } from '../../helpers/combobox/combobox.component';
import { CommonDialogComponent } from '../../helpers/common-dialog/common-dialog.component';
import { SubscriptionPropertyDetailsService } from '../subscriptionPropertyDetails.service';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { showOperatorPipe } from '../../helpers/showOperator.pipe';
import { DateFormatPipe } from 'angular2-moment';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

describe('CreateSubscriptionPropertyComponent', () => {
  let component: CreateSubscriptionPropertyComponent;
  let fixture: ComponentFixture<CreateSubscriptionPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, RouterTestingModule,
        NgxAsideModule],
      declarations: [CreateSubscriptionPropertyComponent, ComboboxComponent, CommonDialogComponent, dateFormatPipe, DateFormatPipe],
      providers: [ajaxUtilService, UrlConfigurationService, BaseRequestOptions, MockBackend, DragulaService, UtilityService,
        HttpClient, TranslationService, TranslationConfig, TranslationProvider, TranslationHandler, utilService, dateFormatPipe,
        ComboboxComponent, showOperatorPipe, DateFormatPipe, AuthenticationService, SubscriptionPropertyDetailsService,
        { provide: LocaleService, useValue: MockLocalService },
        SecureHtmlPipe, PopUpDrag, TextFilterPipe,
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

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSubscriptionPropertyComponent);
    component = fixture.componentInstance;
    const isCreatingProperty = true;
    component.createSubscriptionProperty = isCreatingProperty;
    component.propertyTypes = CreatePropertyData.specTypes;
    component.propertyTypeKeys = Object.keys(CreatePropertyData.specTypes);
    component.comboboxOptions = CreatePropertyData.categoryNames;
    component.defaultSpecType = CreatePropertyData.categoryNames['0'];
    fixture.detectChanges();
  });

  it('should create CreateSubscriptionPropertyComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should be initialized', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
  });

  it('should call ngOnInit', () => {
    component.clickedOnPlusLink = true;
    component.createSubscriptionProperty = false;
    component.ngOnInit();
  });

  it('should check property initialization in constructor', () => {
    expect(component.showEditingForSubscription).toBe(false);
    expect(component.specId).toEqual(-1);
    expect(component.confirmDialog).toEqual(0);
    expect(component.showCover).toBe(true);
    expect(component.isSaveDisabled).toBe(false);
    expect(component.isPropertyFocus).toBe(true);
    expect(component.validateProcessing).toBe(false);
    expect(component.isSaveSubscription).toBe(false);
  });

  it('should initialize properties in oninit', () => {
    const _translationService = fixture.debugElement.injector.get(TranslationService);
    component.comboboxLabel = _translationService.translate('TEXT_CATEGORY 1');
    expect(component.comboboxLabel).toEqual('TEXT_CATEGORY 1');
    expect(component.defaultName).toEqual('TEXT_PROPERTY 1');
    component.clickedOnPlusLink = true;
    component.createSubPropertyForm();
    component.onPropertiesFormChanges();
  });

  it('should createSubPropertyForm function exists', () => {
    component.createSubscriptionProperty = false;
    component.createInputData = { specTypes: {}, categoryNames: {} };
    component.subscriptionPropertyDetails = CreatePropertyData.sampleValues;
    keyEventData.keyCode = 107;
    component.disableMathKeys(keyEventData);
    component.setEditPropertyDefaults(CreatePropertyData.specDefTypes);
    CreatePropertyData.specDefTypes.specType = 1;
    component.setEditPropertyDefaults(CreatePropertyData.specDefTypes);
    CreatePropertyData.specDefTypes.specType = 2;
    component.setEditPropertyDefaults(CreatePropertyData.specDefTypes);
    CreatePropertyData.specDefTypes.specType = 3;
    component.setEditPropertyDefaults(CreatePropertyData.specDefTypes);
    CreatePropertyData.specDefTypes.specType = 4;
    component.setEditPropertyDefaults(CreatePropertyData.specDefTypes);
    CreatePropertyData.specDefTypes.specType = 5;
    CreatePropertyData.specDefTypes.values[0].value = '03/15/2018';
    component.setEditPropertyDefaults(CreatePropertyData.specDefTypes);
    component.updateDefaultChoiceList();
    component.processSubscriptionProperties(CreatePropertyData.processSubscription);
    expect(component.defaultCategory).toEqual('Sample Category');
    component.onFormFieldChange();
    component.openInUseOfferings({});
    component.cancelAsidePanel();
    component.setCategory('option1');
    component.isUsedInOfferings = true;
    component.hideSubscriptionProperty(true, keyEventData);
    component.isUsedInOfferings = false;
    component.hideSubscriptionProperty(true, keyEventData);
    expect(component.showEditingForSubscription).toBe(false);
    component.hideSubscriptionProperty(false, {});
    expect(component.showEditingForSubscription).toBe(true);
    component.setComboboxDirty(true);
    component.onModalDialogCloseCancel(loadData);
    component.isUsedInOfferings = true;
    component.disbaleDefaultAction(keyEventData);
    expect(component.subscriptionPropertiesForm instanceof FormGroup).toBe(true);
    component.subscriptionPropertiesForm.controls['name'].setValue(ProductOfferData.properties.name);
    component.subscriptionPropertiesForm.controls['category'].setValue(CreatePropertyData.processSubscription.category);
    component.checkNameAvailability();
    component.enableSaveBUtton();
    expect(component.subscriptionPropertiesForm.dirty).toBe(false);
    expect(component.validateProcessing).toBe(true);
    component.isNameValidated = false;
    component.createSubscriptionProperty = true;
    component.saveSubscriptionProperties();
    expect(component.isSaveSubscription).toBe(true);
    component.createPropertiesForm(true);
    component.resetFormList({ list: 'list1', value: 'list1' });
    component.createSubscriptionProperty = true;
    component.updateFormPropertyType(CreatePropertyData.updateProperty, {});
    CreatePropertyData.updateProperty.specType = '1';
    CreatePropertyData.updateProperty.values = '';
    component.updateFormPropertyType(CreatePropertyData.updateProperty, {});
    CreatePropertyData.updateProperty.specType = '2';
    component.updateFormPropertyType(CreatePropertyData.updateProperty, {});
     CreatePropertyData.updateProperty.specType = '3';
    CreatePropertyData.updateProperty.values = '0';
    component.updateFormPropertyType(CreatePropertyData.updateProperty, CreatePropertyData.updateProperty);
    CreatePropertyData.updateProperty.specType = '4';
    component.updateFormPropertyType(CreatePropertyData.updateProperty, {});
    CreatePropertyData.updateProperty.specType = '5';
    component.updateFormPropertyType(CreatePropertyData.updateProperty, CreatePropertyData.updateProperty);
    component.createSubscriptionProperty = false;
    component.updateFormPropertyType(CreatePropertyData.updateProperty, {});
    CreatePropertyData.updateProperty.specType = '1';
    CreatePropertyData.updateProperty.values = '';
    component.updateFormPropertyType(CreatePropertyData.updateProperty, {});
    CreatePropertyData.updateProperty.specType = '2';
    component.updateFormPropertyType(CreatePropertyData.updateProperty, {});
    CreatePropertyData.updateProperty.specType = '3';
    CreatePropertyData.updateProperty.values = '0';
    component.processSubscriptionProperties(CreatePropertyData.processSubscription);
    component.updateFormPropertyType(CreatePropertyData.updateProperty, CreatePropertyData.updateProperty);
    CreatePropertyData.updateProperty.specType = '4';
    component.updateFormPropertyType(CreatePropertyData.updateProperty, {});
    CreatePropertyData.updateProperty.specType = '5';
    component.updateFormPropertyType(CreatePropertyData.updateProperty, CreatePropertyData.updateProperty);
    expect(component.createSubPropertyForm).toBeDefined();
    component.createObject({}, {});
    component.removeSpace();
    component.isNameValidated = true;
    component.validateProcessing = false;
    // should check save if default Category and property catergory are same
    component.subscriptionPropertiesForm.controls['name'].setValue(ProductOfferData.properties.name);
    component.subscriptionPropertiesForm.controls['category'].setValue(CreatePropertyData.processSubscription.category);
    component.saveSubscriptionProperties();
    component.isNameValidated = false;
    component.createSubscriptionProperty = false;
    expect(component.subscriptionPropertiesForm.controls['category'].value).toEqual(component.defaultCategory);
    component.saveSubscriptionProperties();
  });
  it('should check checkNameAvailability inside saveSubscriptionProperties for else condition', () => {
    component.subscriptionPropertiesForm.controls['name'].setValue(ProductOfferData.properties.name);
    component.subscriptionPropertyDetails = CreatePropertyData.sampleValues;
    component.createSubscriptionProperty = false;
    CreatePropertyData.processSubscription.category = 'cat';
    component.processSubscriptionProperties(CreatePropertyData.processSubscription)
    component.defaultCategory = CreatePropertyData.processSubscription.category;
    CreatePropertyData.processSubscription.category = 'cat1';
    component.subscriptionPropertiesForm.controls['category'].setValue(CreatePropertyData.processSubscription.category);
    component.subscriptionPropertiesForm.controls['name'].setValue(ProductOfferData.properties.name);
    component.selectedProperty = ProductOfferData.properties.name;
    component.saveSubscriptionProperties();
    expect(component.subscriptionPropertiesForm.controls['category'].value).not.toEqual(component.defaultCategory);
  });
  it('should check combobox', () => {
    const _comboboxComponent = fixture.debugElement.injector.get(ComboboxComponent);
    _comboboxComponent.filteredOptions = ['item1', 'item2'];
    _comboboxComponent.height = '30px';
    expect(_comboboxComponent.isHeightDefined).toBe(true);
    _comboboxComponent.width = '40px';
    expect(_comboboxComponent.isWidthDefined).toBe(true);
    _comboboxComponent.displayFullList();
    expect(_comboboxComponent.filteredList).toBe(false);
    _comboboxComponent.showFilteredOptions(['sample1', 'sample2']);
    expect(_comboboxComponent.showOptions).toBe(false);
    _comboboxComponent.setOption(['sample']);
    _comboboxComponent.setSelectedOption();
    _comboboxComponent.handleClick(document.getElementById('sample'));
    _comboboxComponent.resetCombobox = true;
    _comboboxComponent.showFilteredOptions({});
  });
  it('should createSubPropertyForm function exists', () => {
    component.autoGrow();
  });
  it('Should not allow spaces', () => {
    keyEventData.keyCode = 32;
    component.disableSpace(keyEventData);
  });


  
});