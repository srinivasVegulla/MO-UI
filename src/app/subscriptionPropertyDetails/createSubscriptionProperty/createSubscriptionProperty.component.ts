import { Component, OnInit, Input, Output, HostListener, EventEmitter, OnDestroy,ViewChild, ElementRef} from '@angular/core';
import { ComboboxComponent } from '../../helpers/combobox/combobox.component';
import { calenderLocaleFeilds } from '../../../assets/calenderLocalization';
import { Language, DefaultLocale, Currency, LocaleService, Translation, TranslationService } from 'angular-l10n';
import { NgForm, FormsModule, FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { SubscriptionPropertyDetailsService } from '../subscriptionPropertyDetails.service';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { dateFormatPipe } from '../../helpers/dateFormat.pipe';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { utilService } from '../../helpers/util.service';
import { DateFormatPipe } from 'angular2-moment';
import { UtilityService } from '../../helpers/utility.service';

@Component({
  selector: 'ecb-create-subscription-property',
  templateUrl: './createSubscriptionProperty.component.html',
  providers: [DateFormatPipe, dateFormatPipe]
})
export class CreateSubscriptionPropertyComponent implements OnInit, OnDestroy {

  comboboxOptions: any[] = [];
  comboboxLabel: string;
  subscriptionPropertiesForm: FormGroup;
  defaultCategory: string;
  defaultName: string;
  propertyTypes: any;
  propertyTypeKeys: any;
  existingCategories: any[] = [];
  subscriptionPropertiesInput: any;
  errorMessage: string;
  selectedCategory: string;
  specId: number;
  defaultSpecType: any;
  showEditingForSubscription: boolean;
  confirmDialog: number;
  showCover: boolean;
  isSaveDisabled: boolean;
  updatedPropertiesForm: any;
  showErrorMessage: boolean;
  httpErrorMessage: string;
  nameExist: boolean;
  selectedSpecType: string;
  resetDefaultOption: boolean;
  isPropertyFocus: boolean;
  validateProcessing: boolean;
  isSaveSubscription: boolean;
  createSPSubscriptions: any;
  calenderLocale: any;
  currentLocale: any;
  localeDateFormat: any;
  defaultValue: any;
  minValue: any;
  maxValue: any;
  listOfChoices: any;
  subscriptionPropertyId: number;
  isUsedInOfferings: boolean;
  defaultChoiceList: any;
  entityCount: number;
  showInUseOfferings: boolean;
  selectedProperty: any;
  propertyChoiceList: any[] = [];
  isNameValidated: boolean;
  isNameEdited: boolean;
  defaultValueinList: any;
  oldPropertyName = '';
  amLocaleDateFormat: any;
  textAreaLine: any;
  enumerationValues;
  propertyChoiceListValues: any[] = [];
  showMessage = 'space';
  pickCategoryName: any;
  columnEntityCount: any;
  Minimum2ChoicesPattern: any = '([\\w |\\W]+\\n+).[^]*';
  choiceListwithValueID: any[] = [];
  displayChoiceError = false;
  @ViewChild('textAreaEdit', { read: ElementRef }) textAreaEdit: ElementRef;
  @Input() createSubscriptionProperty;
  @Input() clickedOnPlusLink;
  subscriptionPropertiesFormName: any;
  subscriptionPropertiesFormCatergory: any;
  showCategoryNameDisplayName: boolean;
  nameId: number;
  descriptionId: number;
  categoryId: number;
  @Input() set pickCategory(data) {
    if (data) {
      this.pickCategoryName = data;
      this.createSubPropertyForm();
      this.onPropertiesFormChanges();
    }
  }
  @Input() set createInputData(data) {
    if (data !== null && data !== undefined && Object.keys(data).length > 0) {
      this.subscriptionPropertiesInput = data;
      this.propertyTypes = this.subscriptionPropertiesInput.specTypes;
      this.propertyTypeKeys = Object.keys(this.subscriptionPropertiesInput.specTypes);
      this.comboboxOptions = this.subscriptionPropertiesInput.categoryNames;
      this.comboboxOptions = JSON.parse(JSON.stringify(this.comboboxOptions));
      this.defaultSpecType = this.propertyTypes['0'];
    }
  };
  @Input() set selectedEntityCount(data){
    if (data) {
      this.columnEntityCount = data.entityCount;
      if (this.columnEntityCount > 0) {
        this.isUsedInOfferings = true;
      } else {
        this.isUsedInOfferings = false;
      }
    }
  }
  @Input() set subscriptionPropertyDetails(data) {
    if (!this.createSubscriptionProperty) {
      this.selectedProperty = data;
      this.oldPropertyName = data.name;
      this.processSubscriptionProperties(data);
      this.isSaveDisabled = true;
    }
  }
  @Output() asidePanelOff = new EventEmitter();
  @Output() isSubscriptionPropertyUpdated = new EventEmitter();
  @Output() isFormDirty = new EventEmitter();
  @Output() displayInUseOfferings = new EventEmitter();
  @ViewChild('propertyName') propertyName: any;
  @ViewChild('textarea') textArea: any;

  constructor(private _translationService: TranslationService,
    private _formBuilder: FormBuilder,
    private _subscriptionPropertyDetailsService: SubscriptionPropertyDetailsService,
    private _locale: LocaleService,
    private _dateFormatPipe: DateFormatPipe,
    private _utilService: utilService,
    private _customDateFormatPipe: dateFormatPipe,
    private _utilityService: UtilityService) {
    this.showEditingForSubscription = false;
    this.specId = -1;
    this.confirmDialog = 0;
    this.showCover = true;
    this.isSaveDisabled = false;
    this.isPropertyFocus = true;
    this.validateProcessing = false;
    this.isSaveSubscription = false;
    this.isUsedInOfferings = false;
    this.isNameValidated = false;
    this.isNameEdited = false;
    this.defaultValueinList = '';
  }

  ngOnInit() {
    this.setLocaleDateFormat();
    if (this.createSubscriptionProperty) {
      this.createSubPropertyForm();
      this.onPropertiesFormChanges();
    } else {
      this.isSaveDisabled = true;
    }
  }

  setLocaleDateFormat() {
    this.currentLocale = this._locale.getCurrentLocale();
    this.calenderLocale = calenderLocaleFeilds[this.currentLocale];
    this.localeDateFormat = this.calenderLocale.localeDateFormat;
    this.amLocaleDateFormat = this.calenderLocale.amLocaleDateFormat;
  }

  createSubPropertyForm() {
    this.showCategoryNameDisplayName = true;
    this.isUsedInOfferings = false;
    this.showInUseOfferings = false;
    this.comboboxLabel = this._translationService.translate('TEXT_CATEGORY');
    const propertyName = this._translationService.translate('TEXT_PROPERTY');
    this.listOfChoices = '';
    this.defaultChoiceList = [''];
    if (this.clickedOnPlusLink && this.pickCategoryName !== 'TEXT_CATEGORY 1') {
      this.defaultCategory = this.pickCategoryName;
    } else {
      this.defaultCategory = '';
    }
    this.defaultName = `${propertyName} 1`;
    const currentDate = new Date();
    const currentLocalizedDate = this._dateFormatPipe.transform(currentDate, this.amLocaleDateFormat);
    this.subscriptionPropertiesForm = this._formBuilder.group({
      category: [this.defaultCategory],
      displayCategory: [''],
      name: ['', [Validators.required]],
      displayName: [''],
      description: [''],
      specType: [this.defaultSpecType],
      list: ['', [Validators.required, Validators.pattern(this.Minimum2ChoicesPattern)]],
      stringValue: [' '],
      stringLength: [''],
      intValue: ['0'],
      intMinValue: ['', [this.validateMinMax('intMinValue', 'isIntValueMinimum')]],
      intMaxValue: ['', [this.validateMinMax('intMaxValue', 'isIntValueMaximum')]],
      decimalValue: ['0',[Validators.required]],
      decimalMinValue: ['', [this.validateMinMax('decimalMinValue', 'isDecimalValueMinimum')]],
      decimalMaxValue: ['', [this.validateMinMax('decimalMaxValue', 'isDecimalValueMaximum')]],
      dateValue: [currentLocalizedDate,[Validators.required]],
      dateMinValue: ['', [this.validateMinMax('dateMinValue', 'isDateValueMinimum')]],
      dateMaxValue: ['', [this.validateMinMax('dateMaxValue', 'isDateValueMaximum')]],
      booleanPropertyType: [false],
      userVisible: [false],
      editingForSubscriptionCode: ['RO'],
      defaultItem: ['',[Validators.required]]
    });
    this.onChoiceListChanges();
    this.selectedSpecType = this.subscriptionPropertiesForm.controls.specType['_value'];
    if (this.propertyName !== undefined) {
      this.propertyName.nativeElement.focus();
    }
  }

  disableMathKeys(key) {
    const selectedKeyCode = key.keyCode;
    if ([107, 109, 69, 189].indexOf(selectedKeyCode) !== -1) {
      key.preventDefault();
    }
  }

  validateForEmptyOrNull() {
    if (this.subscriptionPropertiesForm) {
      const valueType = this.subscriptionPropertiesForm.controls.specType.value;
      switch (valueType) {
        case "String (Text Input)":
          this.resetRequiredValidator();
          break;
        case "Integer (Numeric Input)":
          this.resetRequiredValidator();
          this.subscriptionPropertiesForm.controls['intValue'].setValidators([Validators.required]);
          break;
        case "Decimal (Numeric Input)":
          this.resetRequiredValidator();
          this.subscriptionPropertiesForm.controls['decimalValue'].setValidators([Validators.required]);
          break;
        case "List (Dropdown)":
          this.resetRequiredValidator();
          this.subscriptionPropertiesForm.controls['defaultItem'].setValidators([Validators.required]);
          break;
        case "Date & Time (DateTime Input)":
          this.resetRequiredValidator();
          this.subscriptionPropertiesForm.controls['dateValue'].setValidators([Validators.required]);
          break;
          default: 
          this.resetRequiredValidator();
          break;
      }
    }
  };

  resetRequiredValidator() {

    this.subscriptionPropertiesForm.controls.stringValue.clearValidators();
    this.subscriptionPropertiesForm.controls.intValue.clearValidators();
    this.subscriptionPropertiesForm.controls.decimalValue.clearValidators();
    this.subscriptionPropertiesForm.controls.defaultItem.clearValidators();
    this.subscriptionPropertiesForm.controls.dateValue.clearValidators();
    this.subscriptionPropertiesForm.controls.list.clearValidators();

    if(this.subscriptionPropertiesForm.controls.specType.value !=="String (Text Input)") {
        this.subscriptionPropertiesForm.controls['stringValue'].setErrors(null);
    } 
    if(this.subscriptionPropertiesForm.controls.specType.value !=="Integer (Numeric Input)") {
        this.subscriptionPropertiesForm.controls['intValue'].setErrors(null);
        this.subscriptionPropertiesForm.controls['intMaxValue'].setErrors(null);
        this.subscriptionPropertiesForm.controls['intMinValue'].setErrors(null);
    }
    if(this.subscriptionPropertiesForm.controls.specType.value !=="Decimal (Numeric Input)") {
        this.subscriptionPropertiesForm.controls['decimalValue'].setErrors(null);
        this.subscriptionPropertiesForm.controls['decimalMaxValue'].setErrors(null);
        this.subscriptionPropertiesForm.controls['decimalMinValue'].setErrors(null);
    }
    if(this.subscriptionPropertiesForm.controls.specType.value !=="List (Dropdown)") {
        this.subscriptionPropertiesForm.controls['defaultItem'].setErrors(null);
        this.subscriptionPropertiesForm.controls['list'].setErrors(null);
    }
    if(this.subscriptionPropertiesForm.controls.specType.value !=="Date & Time (DateTime Input)") {
        this.subscriptionPropertiesForm.controls['dateValue'].setErrors(null);
        this.subscriptionPropertiesForm.controls['dateMaxValue'].setErrors(null);
        this.subscriptionPropertiesForm.controls['dateMinValue'].setErrors(null);
    }

  }

  validateMinMax(valueType, errorType) {
    return (input) => {
      if (!input.root || !input.root.controls) {
        return null;
      }
      switch (valueType) {
        case 'intMinValue':
          if (input.root.controls.intMaxValue.value !== '' && input.value !== '' &&
            input.root.controls.intMaxValue.value !== null && input.value !== null) {
            const isValueMinimum = +input.root.controls.intMaxValue.value > +input.value;
            this.subscriptionPropertiesForm.controls['intMaxValue'].setErrors(null);
            return isValueMinimum ? null : { [errorType]: true };
          }
          break;
        case 'intMaxValue':
          if (input.root.controls.intMinValue.value !== '' && input.value !== '' &&
            input.root.controls.intMinValue.value !== null && input.value !== null) {
            const isValueMaximum = +input.root.controls.intMinValue.value < +input.value;
            this.subscriptionPropertiesForm.controls['intMinValue'].setErrors(null);
            return isValueMaximum ? null : { [errorType]: true };
          }
          break;
        case 'decimalMinValue':
          if (input.root.controls.decimalMaxValue.value !== '' && input.value !== '' &&
            input.root.controls.decimalMaxValue.value !== null && input.value !== null) {
            const isValueMinimum = +input.root.controls.decimalMaxValue.value > +input.value;
            this.subscriptionPropertiesForm.controls['decimalMaxValue'].setErrors(null);
            return isValueMinimum ? null : { [errorType]: true };
          }
          break;
        case 'decimalMaxValue':
          if (input.root.controls.decimalMinValue.value !== '' && input.value !== '' &&
            input.root.controls.decimalMinValue.value !== null && input.value !== null) {
            const isValueMaximum = +input.root.controls.decimalMinValue.value < +input.value;
            this.subscriptionPropertiesForm.controls['decimalMinValue'].setErrors(null);
            return isValueMaximum ? null : { [errorType]: true };
          }
          break;
        case 'dateMinValue':
          if (input.root.controls.dateMaxValue.value !== '' && input.value !== '' &&
            input.root.controls.dateMaxValue.value !== null && input.value !== null) {
            const isValueMinimum = new Date(input.root.controls.dateMaxValue.value) > new Date(input.value);
            this.subscriptionPropertiesForm.controls['dateMaxValue'].setErrors(null);
            return isValueMinimum ? null : { [errorType]: true };
          }
          break;
        case 'dateMaxValue':
          if (input.root.controls.dateMinValue.value !== '' && input.value !== '' &&
            input.root.controls.dateMinValue.value !== null && input.value !== null) {
            const isValueMaximum = new Date(input.root.controls.dateMinValue.value) < new Date(input.value);
            this.subscriptionPropertiesForm.controls['dateMinValue'].setErrors(null);
            return isValueMaximum ? null : { [errorType]: true };
          }
          break;
        default:
          break;
      }
    }
  }

  filterListOfChoices(choices) {
    this.listOfChoices = [];
    for (const key of choices) {
      this.listOfChoices.push(key.value);
      if (key.isDefault) {
        this.defaultValueinList = key.value;
      }
    }
    if (this.defaultValueinList === null || this.defaultValueinList === undefined || this.defaultValueinList === "" ) {
      this.defaultValueinList = choices[0].value;
    }
  }

  setEditPropertyDefaults(data) {
    switch (data.specType) {
      case 0:
        this.subscriptionPropertiesForm.patchValue({ stringValue: data.values[0].value, stringLength: data.minValue });
        break;
      case 1:
        this.subscriptionPropertiesForm.patchValue({ intValue: data.values[0].value, intMinValue: data.minValue, intMaxValue: data.maxValue });
        break;
      case 2:
        this.subscriptionPropertiesForm.patchValue({
          decimalValue: data.values[0].value, decimalMinValue: data.minValue, decimalMaxValue: data.maxValue
        });
        break;
      case 3:
        this.filterListOfChoices(data.values);
        this.subscriptionPropertiesForm.patchValue({ defaultItem: this.defaultValueinList });
        break;
      case 4:
        if (data.values[0].value === 'true') {
          this.subscriptionPropertiesForm.patchValue({ booleanPropertyType: true });
        }
        break;
      case 5:
        this.defaultValue = data.values[0].value ? new Date(data.values[0].value) : null;
        this.minValue = data.minValue ? new Date(data.minValue) : null;
        this.maxValue = data.maxValue ? new Date(data.maxValue) : null;
        this.subscriptionPropertiesForm.patchValue({
          dateValue: this.defaultValue, dateMinValue: this.minValue, dateMaxValue: this.maxValue
        });
        break;
      default:
        break;
    }
  }

  updateDefaultChoiceList() {
    this.showMessage = 'space';
    this.defaultChoiceList = [''];
    const tempObj = [];
    let choiceList = [];
    if (this.enumerationValues !== undefined) {
      choiceList = this.enumerationValues;
      this.defaultValueinList = choiceList[0];
      this.subscriptionPropertiesForm.patchValue({ defaultItem: this.defaultValueinList });
      if (choiceList.length <  2) {
            this.showMessage = 'minimumlength';
      }
    } else {
      const choiceListTemp = this.propertyChoiceListValues;
      for (const key in choiceListTemp) {
        if (choiceListTemp.hasOwnProperty(key)) {
          choiceList.push(choiceListTemp[key]);
        }
      }
    }
    for (const key in choiceList) {
      if ((choiceList[key]) === '' && choiceList.length >= 1) {
        if (choiceList.length <= 2) {
          this.showMessage = 'minimumlength';
        } else
        this.showMessage = 'doubleSpace';
      } else if (choiceList.hasOwnProperty(key) && choiceList[key] !== '') {
        tempObj.push(choiceList[key]);
      }
    }
    for (let i = 0; i < tempObj.length; i++) {
      this.defaultChoiceList[i] = tempObj[i];
    }
  }

  onPropertiesFormChanges() {
    const SPFormSubscriptions = this.subscriptionPropertiesForm.valueChanges.subscribe(value => {
      this.isFormDirty.emit(true);
      this.setSaveDisabled();
      this.onFormFieldChange();
      this.validateForEmptyOrNull();
    });
    this.createSPSubscriptions.add(SPFormSubscriptions);
  }

  onChoiceListChanges() {
    this.createSPSubscriptions = this.subscriptionPropertiesForm.controls.list.valueChanges.subscribe(value => {
      this.addTextArea(this.textArea.nativeElement);
      this.updateDefaultChoiceList();
      this.onFormFieldChange();
    });
    this.validateForEmptyOrNull();
  }

  processSubscriptionProperties(data) {
    this.showCategoryNameDisplayName = false;
    this.setLocaleDateFormat();
    if (data !== null && data !== undefined) {
      const choiceListValues = [];
      const choiceListTemp = data.values;
      this.choiceListwithValueID = data.values;
      if(data.specType === 3){
      for (const key in choiceListTemp) {
        if (choiceListTemp.hasOwnProperty(key) && choiceListTemp[key] !== '') {
          choiceListValues.push(choiceListTemp[key].value);
          this.propertyChoiceListValues.push(choiceListTemp[key].value);
          if ((parseInt(key) + 1) !== choiceListTemp.length && !this.isUsedInOfferings) {
                 choiceListValues.push('\n');
          }
        }
      }
    }
      this.comboboxLabel = this._translationService.translate('TEXT_CATEGORY');
      this.defaultCategory = data.category;
      this.subscriptionPropertyId = data.specId;
      this.entityCount = data.entityCount;
      this.nameId = data.nameId;
      this.descriptionId = data.descriptionId;
      this.categoryId = data.categoryId;
      this.listOfChoices = [''];
      this.defaultChoiceList = [''];
      this.propertyChoiceList = choiceListValues;
      if (data.userVisible) {
        this.showEditingForSubscription = true;
      }
      const currentDate = new Date();
      const currentLocalizedDate = this._dateFormatPipe.transform(currentDate, this.amLocaleDateFormat);
      this.subscriptionPropertiesForm = this._formBuilder.group({
        category: [data.category],
        displayCategory: [data.displayCategory],
        name: [data.name, [Validators.required]],
        displayName: [data.displayName],
        description: [data.description],
        specType: [this.propertyTypes[data.specType]],
        list: [choiceListValues.toString().replace(/\,/g, ''), [Validators.required, Validators.pattern(this.Minimum2ChoicesPattern)]],
        stringValue: [''],
        stringLength: [''],
        intValue: ['0',[Validators.required]],
        intMinValue: ['', [this.validateMinMax('intMinValue', 'isIntValueMinimum')]],
        intMaxValue: ['', [this.validateMinMax('intMaxValue', 'isIntValueMaximum')]],
        decimalValue: ['0',[Validators.required]],
        decimalMinValue: ['', [this.validateMinMax('decimalMinValue', 'isDecimalValueMinimum')]],
        decimalMaxValue: ['', [this.validateMinMax('decimalMaxValue', 'isDecimalValueMaximum')]],
        dateValue: [currentLocalizedDate,[Validators.required]],
        dateMinValue: ['', [this.validateMinMax('dateMinValue', 'isDateValueMinimum')]],
        dateMaxValue: ['', [this.validateMinMax('dateMaxValue', 'isDateValueMaximum')]],
        booleanPropertyType: [false],
        userVisible: [data.userVisible],
        editingForSubscriptionCode: [data.editingForSubscriptionCode],
        defaultItem: [data.defaultItem, [Validators.required]]
      });
    }
    this.setEditPropertyDefaults(data);
    this.updateDefaultChoiceList();
    this.onChoiceListChanges();
    this.onPropertiesFormChanges();
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === 27 && this._utilityService.isObject(document.getElementsByTagName('ecb-create-subscription-property')[0]) &&
    !this._utilityService.isObject(document.getElementsByTagName('ecb-inuse-offerings-modal-dialog')[0])) {
      if (this.confirmDialog === 0) {
        this.cancelAsidePanel();
      } else {
        this.confirmDialog = 0;
      }
    }
  }
  onFormFieldChange() {
    if (this.subscriptionPropertiesForm.dirty && !this.nameExist && this.showMessage !== 'doubleSpace') {
      this.isSaveDisabled = false;
    }
  }

  openInUseOfferings(data) {
    this.displayInUseOfferings.emit(data);
  }

  cancelAsidePanel() {
    if (this.subscriptionPropertiesForm.dirty) {
      this.confirmDialog = 1;
    } else {
      this.asidePanelOff.emit(true);
      this.createSubPropertyForm();
      this.showCover = false;
      this._utilService.checkNgxSlideModal(false);
    }
  }

  setSaveDisabled() {
    return this.isSaveDisabled || !this.subscriptionPropertiesForm.valid || !this.subscriptionPropertiesForm.controls.name.value;
  }

  setCategory(option) {
    this.selectedCategory = option;
    this.subscriptionPropertiesForm.controls.category.setValue(option);
    this.subscriptionPropertiesForm.markAsDirty();
    this.enableSaveBUtton();
  }

  hideSubscriptionProperty(value: boolean, event) {
    if (this.isUsedInOfferings) {
      event.preventDefault();
    } else {
      if (value) {
        this.showEditingForSubscription = false;
        this.subscriptionPropertiesForm.controls.userVisible.setValue(false);
        this.subscriptionPropertiesForm.controls.editingForSubscriptionCode.setValue('RO');
      } else {
        this.showEditingForSubscription = true;
        this.subscriptionPropertiesForm.controls.userVisible.setValue(true);
      }
    }
  }

  setComboboxDirty(value) {
    if (value) {
      this.subscriptionPropertiesForm.markAsDirty();
    }
  }

  onModalDialogCloseCancel(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      document.body.classList.remove('ecb-body-modal-dialog');
      this.asidePanelOff.emit(true);
      this.createSubPropertyForm();
      this.resetDefaultOption = true;
    }
  }

  disbaleDefaultAction(e) {
    if (this.isUsedInOfferings) {
      e.preventDefault();
    }
  }

  removeSpace() {
    let checkNameValue = this.subscriptionPropertiesForm.controls.name;
    this._utilityService.removeTextSpace(checkNameValue, null); 
  }
  
  disableSpace(evt) {
    this._utilityService.disableSpaceBar(evt); 
  }

  enableSaveBUtton() {
    if (this.subscriptionPropertiesForm.controls.name.value !== "") {
      this.isSaveDisabled = false;
      this.nameExist = false;
    }
  }

  checkNameAvailability() {
    this.validateProcessing = true;
    this.isNameValidated = true;
    this.subscriptionPropertiesFormName=this.subscriptionPropertiesForm.controls.name.value.trim();
    this.subscriptionPropertiesFormCatergory=this.subscriptionPropertiesForm.controls.category.value.trim();
    if ((this.oldPropertyName != this.subscriptionPropertiesFormName && this.subscriptionPropertiesFormName !== null && this.subscriptionPropertiesFormName !== undefined && this.subscriptionPropertiesFormName !== '') || !this.createSubscriptionProperty) {
      const widget = {
        newPropertyName : this._utilService.fixedEncodeURIComponent(this.subscriptionPropertiesFormName),
        newPropertyCategory : this.subscriptionPropertiesFormCatergory
      }
      this._subscriptionPropertyDetailsService.searchSubscriptionPropertyName({
        data: widget,
        success: (result) => {
          this.validateProcessing = false;
          if (result.records != null && result.records !== undefined && result.records.length > 0) {
            this.nameExist = true;
            this.isSaveDisabled = true;
            this.isSaveSubscription = false;
            this.isNameValidated = false;
          } else {
            this.nameExist = false;
            this.isSaveDisabled = false;
            if (this.isSaveSubscription) {
              this.saveSubscriptionProperties();
            }
          }
        },
        failure: (errorMsg: string, code: any, error: any) => {
          this.validateProcessing = false;
          this.showErrorMessage = true;
          if (this.createSubscriptionProperty) {
            this.httpErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'CREATE');
          } else {
            this.httpErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'EDIT');
          }
          this.isSaveDisabled = false;
        }
      });
      this.updateDefaultChoiceList();
    } else {
      this.nameExist = false;
      this.validateProcessing = false;
      if (this.isSaveSubscription) {
        this.saveSubscriptionProperties();
      }
    }
  }

  onEnterSaveSubscriptionProperties(event) {
    if (this.subscriptionPropertiesForm.valid && (this.showMessage !== 'doubleSpace' && this.showMessage !== 'minimumlength')) {
    if (event.keyCode === 13 && !event.shiftKey) {
      this.saveSubscriptionProperties();
    }
  }
  }

  saveSubscriptionProperties() {
    this.isSaveSubscription = true;
    this.isSaveDisabled = true;
    if (!this.isNameValidated && this.createSubscriptionProperty) {
      this.checkNameAvailability();
    } else {
      if (!this.validateProcessing) {
        setTimeout(() => {
          const propertiesObject = this.subscriptionPropertiesForm['_value'];
          propertiesObject.name = propertiesObject.name.trim();
          propertiesObject['descriptionId'] = this.descriptionId;
          propertiesObject['categoryId'] = this.categoryId;
          propertiesObject['nameId'] = this.nameId;
          this.updatedPropertiesForm = this.createPropertiesForm(propertiesObject);
          if (this.createSubscriptionProperty) {
            this._subscriptionPropertyDetailsService.createSubscriptionProperty({
              data: {
                body: this.updatedPropertiesForm
              },
              success: (result) => {
                this.isSaveDisabled = false;
                this.isSubscriptionPropertyUpdated.emit({"isUpdated": true});
                this.asidePanelOff.emit(true);
                this.createSubPropertyForm();
                this.resetDefaultOption = true;
                this.isFormDirty.emit(false);
                this.isSaveSubscription = false;
              },
              failure: (errorMsg: string, code: any, error: any) => {
                this.apiCallError(code, errorMsg, 'CREATE');
              },
              onComplete: () => {
                this.isNameValidated = false;
                this.isSaveSubscription = false;
              }
            });
          } else {
            if (!this.isNameValidated && !this.createSubscriptionProperty && this.defaultCategory != propertiesObject.category) {
              this.checkNameAvailability();
            }else {
              let subFieldParams =this._utilityService.getFieldParams('subPropertiesDetails', 'string');
              if(this.defaultCategory === propertiesObject.category){
                  subFieldParams = subFieldParams.replace('category,name,', '');
              }
            this._subscriptionPropertyDetailsService.updateSubscriptionProperty({
              data: {
                body: this.updatedPropertiesForm,
                id: this.subscriptionPropertyId,
                fields: subFieldParams
              },
              success: (result) => {
                this.isSaveDisabled = false;
                this.isSubscriptionPropertyUpdated.emit({id: this.subscriptionPropertyId, isUpdated: true});
                this.asidePanelOff.emit(true);
                this.resetDefaultOption = true;
                this.isFormDirty.emit(false);
                this.isSaveSubscription = false;
              },
              failure: (errorMsg: string, code: any, error: any) => {
                this.apiCallError(code, errorMsg, 'EDIT');
              },
              onComplete: () => {
                this.isNameValidated = false;
                this.isSaveSubscription = false;
              }
            });
            }
          }
        }, 100);
      }
    }
  }

  apiCallError(code, errorMsg, type) {
    this.isSaveDisabled = false;
    this.showErrorMessage = true;
    this.httpErrorMessage = this._utilityService.errorCheck(code, errorMsg, type);
    this.isSaveSubscription = false;
  }

  createPropertiesForm(formObject) {
    const tempFormObj = {};
    const tempArray = ['stringValue', 'stringLength', 'intValue', 'intMinValue', 'intMaxValue',
      'decimalValue', 'decimalMinValue', 'decimalMaxValue', 'dateValue', 'dateMinValue', 'dateMaxValue',
      'propertyType', 'booleanPropertyType'];
    if (formObject) {
      if (!this.createSubscriptionProperty) {
        this.isNameEdited = this.selectedProperty.name === formObject['name'] ? false : true;
      }
      for (const key in formObject) {
        if (tempArray.indexOf(key) === -1) {
          tempFormObj[key] = formObject[key];
        }
      }
      if (tempFormObj['userVisible'] === false) {
        tempFormObj['editingForSubscriptionCode'] = '';
      }
      this.updateFormPropertyType(tempFormObj, formObject);
    }
    if (!this.createSubscriptionProperty) {
      tempFormObj['specId'] = this.selectedProperty['specId']
    }
    return tempFormObj;
  }

  resetFormList(tempFormObj) {
    tempFormObj['values'] = [];
    tempFormObj['values'].push(tempFormObj['value']);
  }

  createObject(data, isDefault) {
    const choiceTempObj = {};
    choiceTempObj['value'] = data;
    choiceTempObj['isDefault'] = isDefault;
    return choiceTempObj;
  }

  createObjectForEditChoices(data, isDefault) {
    const choiceTempObj = {};
    choiceTempObj['value'] = data;
    choiceTempObj['isDefault'] = isDefault;
    const indexOfNewChoice = this.defaultChoiceList.indexOf(data);

    if (indexOfNewChoice !== -1 &&
       ( this.choiceListwithValueID[indexOfNewChoice] !== undefined) ) {
      choiceTempObj['valueId'] = this.choiceListwithValueID[indexOfNewChoice].valueId;
      choiceTempObj['scvId'] = this.choiceListwithValueID[indexOfNewChoice].scvId;
    }
    return choiceTempObj;
  }

  updateFormPropertyType(tempFormObj, formObject) {
    let isSpecTypeChanged;
    for (const property in this.propertyTypes) {
      if (tempFormObj['specType'] === this.propertyTypes[property]) {
        tempFormObj['specType'] = property;
      }
    }
    if (this.selectedProperty) {
      isSpecTypeChanged = this.selectedProperty['specType'] != tempFormObj['specType'] ? true : false;
    }
    tempFormObj['values'] = [];
    switch (tempFormObj['specType']) {
      case '0':
        if (this.createSubscriptionProperty) {
          tempFormObj['values'].push(this.createObject(formObject['stringValue'], false));
        } else {
          if (this.selectedProperty) {
            tempFormObj['values'] = this.selectedProperty['values'].slice();
            tempFormObj['values'][0].value = formObject['stringValue'];
          }
        }
        tempFormObj['minValue'] = formObject['stringLength'];
        break;
      case '1':
        if (this.createSubscriptionProperty) {
          tempFormObj['values'].push(this.createObject(formObject['intValue'], false));
        } else {
          if (this.selectedProperty) {
            tempFormObj['values'] = this.selectedProperty['values'].slice();
            tempFormObj['values'][0].value = formObject['intValue'];
          }
        }
        tempFormObj['minValue'] = formObject['intMinValue'];
        tempFormObj['maxValue'] = formObject['intMaxValue'];
        break;
      case '2':
        if (this.createSubscriptionProperty) {
          tempFormObj['values'].push(this.createObject(formObject['decimalValue'], false));
        } else {
          if (this.selectedProperty) {
            tempFormObj['values'] = this.selectedProperty['values'].slice();
            tempFormObj['values'][0].value = formObject['decimalValue'];
          }
        }
        tempFormObj['minValue'] = formObject['decimalMinValue'];
        tempFormObj['maxValue'] = formObject['decimalMaxValue'];
        break;
      case '3':
        if (this.createSubscriptionProperty) {
          let isOptionDefault = false;
          const choiceList = formObject['list'].split('\n');
          for (const key in choiceList) {
            if (choiceList.hasOwnProperty(key)) {
              isOptionDefault = choiceList[key] === formObject['defaultItem'] ? true : false;
              tempFormObj['values'].push(this.createObject(choiceList[key], isOptionDefault));
            }
          }
        } else {
          if (this.selectedProperty) {
            let listOfOldChoices = [];
            let oldChoices;
            if (this.enumerationValues !== null && this.enumerationValues !== undefined) {
              oldChoices = this.enumerationValues.slice();
            } else {
              oldChoices = this.propertyChoiceListValues.slice();
            }
            for (const choice of oldChoices) {
              listOfOldChoices.push(choice.value);
            }
            let choiceListTemp = [];
            choiceListTemp = this.defaultChoiceList;
            for (const key of choiceListTemp) {
              let oldChoiceIndex = listOfOldChoices.indexOf(key);
              if (oldChoiceIndex === -1) {
                tempFormObj['values'].push(this.createObjectForEditChoices(key, false));
              } else {
                tempFormObj['values'].push(oldChoices[oldChoiceIndex]);
              }
            }
          }
        }
        for (const choice of tempFormObj['values']) {
          choice.isDefault = choice.value === formObject['defaultItem'] ? true : false;
        }
        tempFormObj['defaultItem'] = formObject['defaultItem'] || formObject['list'].split('\n')[0];
        break;
      case '4':
        if (this.createSubscriptionProperty) {
          tempFormObj['values'].push(this.createObject(formObject['booleanPropertyType'], false));
        } else {
          if (this.selectedProperty) {
            tempFormObj['values'] = this.selectedProperty['values'].slice();
            tempFormObj['values'][0].value = formObject['booleanPropertyType'];
          }
        }
        break;
      case '5':
        if (this.createSubscriptionProperty) {
          const defaultValue = new Date(formObject['dateValue']);
          tempFormObj['values'].push(this.createObject(this._dateFormatPipe.transform(defaultValue, this.amLocaleDateFormat), false));
        } else {
          if (this.selectedProperty) {
            tempFormObj['values'] = this.selectedProperty['values'].slice();
            const defaultDateValue = new Date(formObject['dateValue']);
            tempFormObj['values'][0].value = this._dateFormatPipe.transform(defaultDateValue, this.amLocaleDateFormat);
          }
        }
        const minDateValue = formObject['dateMinValue'] ? new Date(formObject['dateMinValue']) : null;
        const maxDateValue = formObject['dateMaxValue'] ? new Date(formObject['dateMaxValue']) : null;
        tempFormObj['minValue'] = this._dateFormatPipe.transform(minDateValue, this.amLocaleDateFormat);
        tempFormObj['maxValue'] = this._dateFormatPipe.transform(maxDateValue, this.amLocaleDateFormat);
        break;
      default:
        break;
    }
  }

  ngOnDestroy() {
    if (this.createSPSubscriptions) {
      this.createSPSubscriptions.unsubscribe();
    }
    this.isFormDirty.emit(false);
  }
  addTextArea(textarea) {
    textarea.style.height = '30px';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  enteredValues(info) {
    if (info.keyCode === 13 && !info.shiftKey) {
      info.preventDefault();
    } else {
      this.displayChoiceError = false;
      this.showMessage = 'space';
      this.enumerationValues = info.target.value.split(/\n/);
      this.updateDefaultChoiceList();
    }
  }

  displayErrorIfAny () {
    this.displayChoiceError = true;
    if ( this.showMessage !== 'space') {
      this.isSaveDisabled = true;
    }
    else {
      if (!this.nameExist) {
      this.isSaveDisabled = false;
      }
    }
  }

  isNoBreakString(value) {
    return this._utilityService.isNoBreakString(value);
  }

  autoGrow() {
    if (!this.isUsedInOfferings && this.textAreaEdit !== undefined){
      const textArea = this.textAreaEdit.nativeElement;
      this._utilityService.adjustHeightOnScroll(textArea);
    }
   }
   
  
 
}
