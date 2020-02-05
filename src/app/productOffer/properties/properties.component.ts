import {
  Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, HostListener, OnChanges, OnDestroy,
  ViewChild, AfterViewInit, ViewChildren, ElementRef
} from '@angular/core';
import { ProductService } from '../productOffer.service';
import { sharedService } from '../sharedService';
import { calenderLocaleFeilds } from '../../../assets/calenderLocalization';
import { Language, DefaultLocale, Currency, LocaleService, Translation, TranslationService } from 'angular-l10n';
import { contextBarHandlerService } from '../../helpers/contextbarHandler.service';
import { NgForm, FormsModule, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { utilService } from '../../helpers/util.service';
import { modalService } from '../../helpers/modal-dialog/modal.service';
import { ISubscription } from 'rxjs/Subscription';
import { isNumeric } from 'rxjs/util/isNumeric';
import { ActivatedRoute, Router } from '@angular/router';
import { CapabilityService } from '../../helpers/capabilities.service';
import { dateFormatPipe } from '../../helpers/dateFormat.pipe';
import { UtilityService } from '../../helpers/utility.service';

@Component({
  selector: 'ecb-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [dateFormatPipe]
})
export class PropertiesComponent implements AfterViewInit, OnInit, OnDestroy {

  effectiveStartDate;
  effectiveEndDate;
  productList;
  currencies;
  generalProperties;
  propertyName;
  displayName;
  startDate;
  endDate;
  name;
  minDate;
  POProperties: FormGroup;
  POName;
  poDisplayName;
  PODescription;
  generalPropertiesList: any = {};
  defaultProperties: any;
  partitions: any[];
  selectedPartition: any;
  productOfferInfo: any[];
  nameExist: Boolean = false;
  displayNameExist: Boolean = false;
  loading: Boolean = false;
  isSaveDisabled: Boolean = true;
  showErrorMessage: Boolean = false;
  propertiesForm: any;
  httpErrorMessage: any;
  POLoadError: Boolean = false;
  isCreateOffering: Boolean = false;
  POPropertiesSubscriptions: any;
  minEndDate: any;
  maxStartDate: any;
  createPO: boolean = false;
  createBundle: boolean = false;
  loadPOUrl: string = '';
  confirmDialog;
  isSaveEnabled: boolean = true;
  showFormFields;
  isCopyPO = false;
  isCopyBundle = false;
  copyOf = '';
  nameCall;
  dispNameCall;
  subscription;
  isSaveCopyProperties = false;
  saveDisabled: boolean = false;
  isSaveClicked = false;
  validateProcessing = false;
  isUsedInOfferings = false;
  isNameValidated = false;
  viewGeneralPropertiesList = {};
  editGeneralPropertiesList = {};
  offeringType: string;
  showAprrovalEditBtn: boolean = false;
  @ViewChild('textArea', { read: ElementRef }) textArea: ElementRef;
  @Input() set properties(generalPropertiesList) {
    if (generalPropertiesList) {
      for (const key in generalPropertiesList) {
        if (key) {
          this.viewGeneralPropertiesList[key] = generalPropertiesList[key];
        }
      }
      for (const key in generalPropertiesList) {
        if (key) {
          this.editGeneralPropertiesList[key] = generalPropertiesList[key];
        }
      }
      this.processInputData(generalPropertiesList);
      this.processGeneralProperties(generalPropertiesList);
      this.isSaveEnabled = false;
      this.saveDisabled = true;
    }
  }

  @Input() set approvalFlag(value) {
    if (value && value['Capabilities']['Properties_Edit'] === true && value['approval']['enableApprovalsEdit'] === true) {
      this.showAprrovalEditBtn = false;
    } else {
      this.showAprrovalEditBtn = true;
    }
  }

  @Input() set copyOfferings(generalPropertiesList) {
    if (generalPropertiesList) {
      this.processInputData(generalPropertiesList);
    }
  }

  processInputData(generalPropertiesList) {
    this.generalPropertiesList = generalPropertiesList;
    this.defaultProperties = generalPropertiesList;
  }

  @Input() selectedCurrency: any;
  @Input() set errorMessage(msg) {
    if (msg) {
      this.POLoadError = true;
    }
  }
  calenderLocale;
  currentLocale;
  isCurrencyVisible: Boolean = false;
  currencyDefault: any;
  partitionDefault: any;
  showCover: Boolean = false;
  localeDateFormat: any;
  startDateError: boolean;
  endDateError: boolean;
  @Input() set createPOConfig(config) {
    if (config) {
      this.currencyDefault = config.currencies[0].name;
      this.partitionDefault = config.partitions[0].login;
    }
  }

  @Input() set currencyAndPartitionList(datalist) {
    if (datalist) {
      this.currencies = datalist.currencies;
      this.partitions = datalist.partitions;
      if (this.currencies) {
        for (let entry of this.currencies) {
          if (entry.name == datalist.currency) {
            this.selectedCurrency = entry;
          }
        }
      }
      if (this.partitions) {
        this.selectedPartition = this.partitions[0];
        this.partitionDefault = this.selectedPartition.login;
        /* for (let entry of this.partitions) {
          if (entry.login == this.partitionDefault) {
            this.selectedPartition = entry;
          }
        } */
      }
      this.processGeneralProperties(this.generalPropertiesList);
    }
  }
  @Output() nameChanges = new EventEmitter();
  @Output() isPOUpdated = new EventEmitter();
  @DefaultLocale() defaultLocale: string;
  @Input() productOfferId: number;
  @ViewChild('properties') propertiesAsidePanel: any;
  @ViewChild('visibilityShow') visibilityShow: any;
  @ViewChild('visibilityHide') visibilityHide: any;

  @Input() displayBundle: boolean;
  @Input() set createOffering(value) {
    if (value === 'productOffer') {
      this.createPO = true;
      this.displayBundle = false;
    } else if (value === 'bundle') {
      this.createBundle = true;
      this.displayBundle = true;
    } else if (value === 'copyPO') {
      this.isCopyPO = true;
      this.displayBundle = false;
      this.processGeneralProperties(this.generalPropertiesList);
    } else if (value === 'copyBundle') {
      this.isCopyBundle = true;
      this.displayBundle = true;
      this.processGeneralProperties(this.generalPropertiesList);
    } else { }
    this.isCreateOffering = true;
    this.displayCreateOfferingPanel();
  }

  @Output() hideCreatePOPanel = new EventEmitter();
  @ViewChildren('defaultName') defaultName: any = '';
  
  @Output() isOfferingUpdated = new EventEmitter();
  urlBundleId: any;
  urlProductOfferId: any;
  editTooltip: any;
  propertiesFormValueSubscription: any;
  editPropertiesCapability = true;
  typeOfAction: any;

  @HostListener('document:keydown.esc')
  handleEscape() {
    if (this._UtilityService.isObject(this.propertiesAsidePanel)) {
      if (this.confirmDialog === 0 && this.propertiesAsidePanel.visibleStatus) {
          this.cancelCoverHandler();
      } else {
        this.confirmDialog = 0;
      }
    }
  }

  constructor(private _sharedService: sharedService,
    private locale: LocaleService,
    private _contextBarHandlerService: contextBarHandlerService,
    private _formBuilder: FormBuilder,
    private _productService: ProductService,
    private _modalService: modalService,
    private _utilService: utilService,
    private _translationService: TranslationService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _capabilityService: CapabilityService,
    private _dateFormatPipe: dateFormatPipe,
    private _UtilityService: UtilityService) {
    this.confirmDialog = 0;
    this.showFormFields = false;
    this.POPropertiesSubscriptions = this._utilService.prodOfferSkeletonLoader.subscribe(value => {
      this.loading = value;
    });
    this.offeringType = '';
  }
  ngOnInit() {
    this.editTooltip = this._translationService.translate('TEXT_EDIT');
    this.urlBundleId = +this._route.snapshot.params['bundleId'];
    this.urlProductOfferId = +this._route.snapshot.params['productOfferId'];
    if (this.urlBundleId !== null && this.urlBundleId !== undefined && isNaN(this.urlBundleId) === false) {
      if (this.urlProductOfferId !== null && this.urlProductOfferId !== undefined && isNaN(this.urlProductOfferId) === false) {
        this.showFormFields = true;
      }
    }
    this.currentLocale = this.locale.getCurrentLocale();
    this.calenderLocale = calenderLocaleFeilds[this.currentLocale];
    this.localeDateFormat = this.calenderLocale.localeDateFormat;
    this.defaultName = '';

    if (this.isCopyPO === false && this.isCopyBundle === false) {
      this.POProperties = this._formBuilder.group({
        name: ['', [Validators.required]],
        displayName: ['', [Validators.required]],
        description: [''],
        startDate: [''],
        endDate: [''],
        hidden: [false],
        currency: [this.currencyDefault],
        popartitionid: [this.partitionDefault],
      });
    }
    this.startDateError = false;
    this.endDateError = false;
    this.minDate = new Date();

    const nameFieldValueSubscription = this.POProperties.controls.name.valueChanges.subscribe(value => {
      this.isSaveDisabled = false;
      this.isSaveClicked = false;
      this.POProperties.controls.displayName.setValue(value);
    });

    this.POPropertiesSubscriptions.add(nameFieldValueSubscription);
    this.onPropertiesFormChanges();
    this.editPropertiesCapability = this._capabilityService.findPropertyCapability('UIPoDetailsPage', 'Properties_Edit');
  }

  onPropertiesFormChanges() {
    this.propertiesFormValueSubscription = this.POProperties.valueChanges.subscribe(value => {
      setTimeout(() => {
        if (this.POProperties.dirty) {
          this._utilService.checkIsPropertiesFormUpdated(true);
          this._utilService.changeIsProductOfferUpdated(false);
          if (!this.nameExist) {
            this.isSaveEnabled = true;
            this.saveDisabled = false;
          }
          this.propertiesFormValueSubscription.unsubscribe();
        }
      }, 100);
    });
    
    this.POPropertiesSubscriptions.add(this.propertiesFormValueSubscription);
    this.setSaveDisabled();
  }
  
  setSaveDisabled() {
    return this.saveDisabled || this.startDateError || this.endDateError || this.nameExist || !this.POProperties.get('displayName').value || !this.POProperties.get('name').value;
  }

 removeSpace(){
    let checkNameValue = this.POProperties.controls.name;
    let checkDisplayValue = this.POProperties.controls.displayName;
    this._UtilityService.removeTextSpace(checkNameValue, checkDisplayValue); 
  }

  disableSpace(evt){
    this._UtilityService.disableSpaceBar(evt); 
  }

  displayCreateOfferingPanel() {
    this.propertiesAsidePanel.show();
    this.showCover = true;
    this._utilService.checkNgxSlideModal(true);
  }

  processGeneralProperties(generalPropertiesList) {
    if (generalPropertiesList !== undefined && generalPropertiesList !== null && Object.keys(generalPropertiesList).length > 0) {
      this.generalProperties = generalPropertiesList;
      const hiddenValue = generalPropertiesList.hidden;
      this.POName = generalPropertiesList.name;
      this.poDisplayName = generalPropertiesList.displayName;
      this.PODescription = generalPropertiesList.description;
      this.startDate = generalPropertiesList.effStartDate ? new Date(generalPropertiesList.effStartDate) : null;
      this.endDate = generalPropertiesList.effEndDate ? new Date(generalPropertiesList.effEndDate) : null;
      this.currencies = generalPropertiesList.currencies;
      for (let entry of this.currencies) {
        if (entry.name == generalPropertiesList.currency) {
          this.selectedCurrency = entry;
        }
      }
      this.partitions = generalPropertiesList.poPartitions;
      for (let entry of this.partitions) {
        if (entry.accountId == generalPropertiesList.popartitionid) {
          this.selectedPartition = entry;
        }
      }

      /*copy PO/Bundle condition checking for adding copy of text before po/bundle name*/
      if (this.isCopyPO === true || this.isCopyBundle === true) {
        this.isSaveEnabled = true;
        this.saveDisabled = false;
        this.copyOf = this._translationService.translate('TEXT_COPY_OF');
      }

      this.POProperties = this._formBuilder.group({
        name: [this.copyOf + '' + this.POName, [Validators.required]],
        displayName: [this.copyOf + '' + this.poDisplayName, [Validators.required]],
        description: [this.PODescription],
        startDate: [this.startDate],
        endDate: [this.endDate],
        hidden: [generalPropertiesList.hidden],
        currency: [this.selectedCurrency.name],
        popartitionid: [generalPropertiesList.popartitionid, [Validators.required]]
      });
      this.onPropertiesFormChanges();
    }
  }

  changeDropdown(currency) {
    this.selectedCurrency = currency;
  }

  validateMinMax(type) {
    this.startDateError = false;
    this.endDateError = false;
    if (this.POProperties.controls.endDate.value !== '' &&
      this.POProperties.controls.endDate.value !== null &&
      this.POProperties.controls.startDate.value !== '' &&
      this.POProperties.controls.startDate.value !== null) {
      const startDate = new Date(this.POProperties.controls.startDate.value);
      const endDate = new Date(this.POProperties.controls.endDate.value);
      if (endDate <= startDate) {
        if (type === 'startDate') {
          this.startDateError = true;
        } else if (type === 'endDate') {
          this.endDateError = true;
        }
      }
    } else {
      this.startDateError = false;
      this.endDateError = false;
    }
  }

  checkNameAvailability() {
    this.validateProcessing = true;
    this.isNameValidated = true;
    const widgetData = {
      productOfferName: this._utilService.fixedEncodeURIComponent(this.POProperties.controls.name.value)
    };
    let newPOName = this.POProperties.controls.name.value;
    if (this.POName != newPOName && newPOName != null && newPOName != undefined && newPOName != '') {
      this._productService.getPONameAvailability({
        data: widgetData,
        success: (result) => {
          this.validateProcessing = false;
          this.productOfferInfo = result.records;
          if (this.productOfferInfo.length > 0 && this.productOfferInfo != null && this.productOfferInfo != undefined) {
            this.nameExist = true;
            this.isSaveClicked = false;
            this.saveDisabled = true;
            this.isSaveEnabled = false;
          }else {
            this.nameExist = false;
            this.displayNameExist = false;
            if (!this.startDateError && !this.endDateError) {
              this.saveDisabled = false;
              this.isSaveEnabled = true;
            } else {
              this.saveDisabled = true;
              this.isSaveEnabled = false;
            }
            if (this.isSaveClicked) {
              this.savePOProperties();
            }
          }
        },
        failure: (errorMsg: string, code: any, error: any) => {
          if(this.isCopyBundle || this.isCopyPO) {
              this.typeOfAction = 'COPY';
          } else {
            this.typeOfAction = 'CREATE';
          }
          this.saveDisabled = false;
          this.isSaveEnabled = true;
          this.httpErrorMessage = this._UtilityService.errorCheck(code, errorMsg, this.typeOfAction);
          this.validateProcessing = false;
          this.showErrorMessage = true;
        }
      });
    } else {
      this.nameExist = false;
      this.displayNameExist = false;
      this.validateProcessing = false;
      if (this.isSaveClicked) {
        this.savePOProperties();
      }
    }
  }

  createOfferings() {
    this._productService.createProductOffer({
      data: {
        body: this.propertiesForm
      },
      success: (result) => {
        this.reDirectionSuccessCall(result);
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this.apiCallError(errorMsg, code, error, 'create');
      }
    });
  }

  updateProperties() {
    this._productService.updateProductOffer({
      data: {
        type: this.offeringType,
        productOfferId: this.productOfferId,
        body: this.propertiesForm,
        fields: this._UtilityService.getFieldParams('offeringProperties', 'string')
      },
      success: (result) => {
        this.isOfferingUpdated.emit('properties');
        this.isSaveClicked = false;
        this.apiCallSuccess();
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this.isSaveClicked = false;
        this.apiCallError(errorMsg, code, error, 'edit');
      }
    });
  }

  savePOProperties() {
    this.saveDisabled = true;
    this.isSaveEnabled = false;
    this.isSaveClicked = true;
    this.showErrorMessage = false;
    if (!this.isNameValidated) {
      this.checkNameAvailability();
    } else {
      if (!this.validateProcessing && !this.nameExist && !this.displayNameExist) {
        setTimeout(() => {
        let propertiesObject = this.POProperties['_value'];
        propertiesObject.displayName = propertiesObject.displayName.trim();
        propertiesObject.name = propertiesObject.name.trim();
        this.propertiesForm = this.createPropertiesForm(propertiesObject);
        if (this.isCreateOffering) {
          this._utilService.changeIsProductOfferUpdated(true);
          if (this.createPO || this.createBundle) {
            this.createOfferings();
          } else if (this.isCopyPO || this.isCopyBundle) {
            this.saveCopyOfferings();
          }
        } else {
          this.offeringType = this.displayBundle ? 'BUNDLE' : 'PO';
          this.updateProperties();
        }
        }, 100);
      }
    }
  }
  onEnterSavePOProperties(event) {
    if (this.isSaveEnabled && this.POProperties.valid && event.keyCode === 13 && !event.shiftKey) {
      this.savePOProperties();
    }
  }

    apiCallSuccess() {
      this.propertiesAsidePanel.hide();
      this.showCover = false;
      this.saveDisabled = false;
      this.isSaveEnabled = true;
      this._utilService.checkNgxSlideModal(false);
      this._utilService.changeIsProductOfferUpdated(true);
    }

    apiCallError(errorMsg: string, code: any, error: any, type) {
      if (type === 'create') {
        this.httpErrorMessage = this._UtilityService.errorCheck(code, errorMsg, 'CREATE');
      } else {
        this.httpErrorMessage = this._UtilityService.errorCheck(code, errorMsg, 'EDIT');
      }
      this.showErrorMessage = true;
      this._utilService.changeIsProductOfferUpdated(false);
      this.isSaveClicked = false;
      this.saveDisabled = false;
      this.isSaveEnabled = true;
    }

    createPropertiesForm(propertiesObject) {
      const tempFormObj = {};
      let finalFormObj = { oldEntity: {}, newEntity: {}};
      let offeringProperties = {};
      if (propertiesObject) {
        for (const key in propertiesObject) {
          if (key) {
            tempFormObj[key] = propertiesObject[key];
          }
        }
        if (propertiesObject.startDate) {
          const date = new Date(tempFormObj['startDate']);
          tempFormObj['startDate'] = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
        }
        if (propertiesObject.endDate) {
          const date = new Date(tempFormObj['endDate']);
          tempFormObj['endDate'] = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
        }
        if (!isNumeric(propertiesObject.popartitionid)) {
          for (let i = 0; i < this.partitions.length; i++) {
            if (propertiesObject.popartitionid === this.partitions[i].login) {
              tempFormObj['popartitionid'] = this.partitions[i].accountId;
            }
          }
        } else {
          tempFormObj['popartitionid'] = propertiesObject.popartitionid;
        }
        if (this.isCreateOffering) {
          tempFormObj['userSubscribe'] = false;
          tempFormObj['userUnsubscribe'] = false;
          if (this.createPO || this.isCopyPO) {
            tempFormObj['bundle'] = false;
          } else if (this.createBundle || this.isCopyBundle) {
            tempFormObj['bundle'] = true;
          } else { }
        }
      }
      offeringProperties = JSON.parse(JSON.stringify(this.editGeneralPropertiesList));
      for (const key in tempFormObj) {
        if (key) {
          offeringProperties[key] = tempFormObj[key];
        }
      }
      if (this.isCreateOffering) {
        return offeringProperties;
      } else {
        finalFormObj['oldEntity'] = this.editGeneralPropertiesList;
        finalFormObj['newEntity'] = JSON.parse(JSON.stringify(offeringProperties));
        return finalFormObj;
      }
    }

    displayCoverHandler(properties) {
      if(!this.showAprrovalEditBtn){
        this.nameExist = false;
        this.displayNameExist = false;
        this.isSaveEnabled = false;
        this.saveDisabled = true;
        properties.show();
        this.showCover = true;
        this._utilService.checkNgxSlideModal(true);
        this.showErrorMessage = false;
        setTimeout(() => {
          document.getElementById("initFocus").focus();
        }, 300);
      }
    }

    onModalDialogCloseCancel(event) {
      this.confirmDialog = 0;
      if (event.index === 1) {
        this.propertiesAsidePanel.hide();
        this.processGeneralProperties(this.viewGeneralPropertiesList);
        this._utilService.changedisplayName(this.poDisplayName);
        this.showCover = false;
        this._utilService.checkNgxSlideModal(false);
        this._utilService.checkIsPropertiesFormUpdated(false);
        this._utilService.changeIsProductOfferUpdated(false);
        if (this.isCreateOffering) {
          this._utilService.changeCreateOffering('');
          this.hideCreatePOPanel.emit(true);
        }
      }
      this.startDateError = false;
      this.endDateError = false;
    }

    closeEditPanel() {
      this.propertiesAsidePanel.hide();
      this.showCover = false;
      this._utilService.checkNgxSlideModal(false);
      this.hideCreatePOPanel.emit(true);
      this._utilService.changeCreateOffering('');
      this.startDateError = false;
      this.endDateError = false;
    }
    cancelCoverHandler() {
      if (this.POProperties.dirty || this.isCopyPO || this.isCopyBundle) {
        this.confirmDialog = 1;
      } else {
        this.closeEditPanel();
      }
    }
    onModalDialogCloseHide(event) {
      this.confirmDialog = 0;
      this.visibilityShow.nativeElement.focus();
      if (event.index === 1) {
        this.POProperties.controls.hidden.setValue(true);
        this.POProperties.markAsDirty();
        this._utilService.checkIsPropertiesFormUpdated(true);
        this.visibilityHide.nativeElement.focus();
      }
    }
    onModalDialogCloseShow(event) {
      this.confirmDialog = 0;
      this.visibilityHide.nativeElement.focus();
      if (event.index === 1) {
        this.POProperties.controls.hidden.setValue(false);
        this.POProperties.markAsDirty();
        this._utilService.checkIsPropertiesFormUpdated(true);
        this.visibilityShow.nativeElement.focus();
      }
    }

    hideProductOffer(event: any) {
      event.preventDefault();
      this.POProperties.controls.hidden.setValue(false);
      if (this.POProperties.get('hidden').value === false) {
        this.confirmDialog = 2;
      }
    }

    showProductOffer(event: any) {
      event.preventDefault();
	  this.POProperties.controls.hidden.setValue(true);
      if (this.POProperties.get('hidden').value === true) {
        this.confirmDialog = 3;
      }
    }

  autoGrow() {
    const textArea = this.textArea.nativeElement;
    this._UtilityService.adjustHeightOnScroll(textArea);
   }

    ngOnDestroy() {
      if (this.POPropertiesSubscriptions) {
        this.POPropertiesSubscriptions.unsubscribe();
      }
    }

    saveCopyOfferings() {
      this._productService.copyOfferingData({
        data: {
          body: this.propertiesForm,
          offerId: this.generalPropertiesList['offerId']
        },
        success: (result) => {
          this.reDirectionSuccessCall(result);
        },
        failure: (errorMsg: string, code: any, error: any) => {
          this.httpErrorMessage = this._UtilityService.errorCheck(code, errorMsg, 'COPY');
          this._utilService.changeIsProductOfferUpdated(false);
          this.showErrorMessage = true;
          this.httpErrorMessage = error;
          this.saveDisabled = false;
          this.isSaveEnabled = true;
        }
      });
    }

    ngAfterViewInit() {
      this.defaultName.first.nativeElement.focus();
    }
    reDirectionSuccessCall(result) {
      const response = result;
      const newPOId = response.offerId;
      if (this.createPO || this.isCopyPO) {
        this.loadPOUrl = '/ProductCatalog/ProductOffer/' + newPOId;
      } else if (this.createBundle || this.isCopyBundle) {
        this.loadPOUrl = '/ProductCatalog/Bundle/' + newPOId;
      } else { }

      this._utilService.changeCreateOffering('');
      this._router.navigateByUrl(this.loadPOUrl);
      this._utilService.changeSelectedOfferBreadcrumbData(response);
      this.isSaveClicked = false;
      this.saveDisabled = false;
      this.isSaveEnabled = true;
      this._utilService.checkNgxSlideModal(false);
      this._utilService.checkIsPropertiesFormUpdated(false);
    }
  onFormFieldChange(type) {
    this.validateMinMax(type);
    if (this.POProperties.dirty && !this.startDateError && !this.endDateError && !this.nameExist && !this.displayNameExist) {
      this.isSaveEnabled = true;
      this.saveDisabled = false;
    } else {
      this.isSaveEnabled = false;
      this.saveDisabled = true;
    }
  }

  isNoBreakString(value) {
    return this._UtilityService.isNoBreakString(value);
  }
  

}
