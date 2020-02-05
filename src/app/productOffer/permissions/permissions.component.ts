import { Component, OnInit, Input, ViewEncapsulation, HostListener, Output, EventEmitter, OnDestroy } from '@angular/core';
import { calenderLocaleFeilds } from '../../../assets/calenderLocalization';
import { Language, DefaultLocale, Currency, LocaleService, TranslationService } from 'angular-l10n';
import { NgForm, FormsModule, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { contextBarHandlerService } from '../../helpers/contextbarHandler.service';
import { ProductService } from '../productOffer.service';
import { utilService } from '../../helpers/util.service';
import { UtilityService } from '../../helpers/utility.service';
import { modalService } from '../../helpers/modal-dialog/modal.service';
import { sharedService } from '../sharedService';
import { SelectItem } from 'primeng/primeng';
import { forEach } from '@angular/router/src/utils/collection';
import { concat } from 'rxjs/observable/concat';
import { CapabilityService } from '../../helpers/capabilities.service';
import { flattenStyles } from '../../../../node_modules/@angular/platform-browser/src/dom/dom_renderer';

@Component({
  selector: 'ecb-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PermissionsComponent implements OnInit,OnDestroy {
  availableStartDate;
  availableEndDate;
  productList;
  propertyPermissions;
  partitions;
  POPermissions: FormGroup;
  permissionstList: any;
  @Input() errorMessage: string;
  @Input() selectedPartition: any;
  isClassVisible: boolean = false;
  calenderLocale;
  currentLocale;
  isPartitionIdVisible: boolean = false;
  partitionstList: any;
  defaultPartitions;
  showCover: boolean = false;
  showPermissions: boolean = false;
  showErrorMessage: boolean = false;
  httpErrorMessage: any;
  permissionsForm: any;
  loading:boolean = false;
  selectedAccountTypes: any;
  selectedAccountTypesForm: any;
  accountTypeEligibilityList: any;
  selectedTypes: any;
  types: any;
  offerOptions: any = {};
  poNames: any[] = [];
  optionalityMsg: any;
  setAvailableDates = true;
  isSaveEnabled = false;
  confirmDialog;
  permissionsWidget;
  viewPermissionsData = {};
  editPermissionsData = {};
  startDateError: boolean;
  endDateError: boolean;
  selectedProductType = '';
  showAprrovalEditBtn: boolean = false;
  @Input() set defaultpartitions(defaultpartition) {
    if (defaultpartition) {
      this.defaultPartitions = defaultpartition.partitions[0].accountId;
    }
  }

  @Input() set permissions(permissionstList) {
    this.permissionstList = permissionstList;
    for (const key in this.permissionstList) {
      if (key) {
        this.viewPermissionsData[key] = this.permissionstList[key];
      }
    }
    for (const key in permissionstList) {
      if (key) {
        this.editPermissionsData[key] = permissionstList[key];
      }
    }
    this.productPermissions(this.permissionstList);
  }

  @Input() set approvalFlag(value) {
    if (value && value['Capabilities']['Properties_Edit'] === true && value['approval']['enableApprovalsEdit'] === true) {
      this.showAprrovalEditBtn = false;
    } else {
      this.showAprrovalEditBtn = true;
    }
  }

  @Input() set partitionsIDs(partitionstList) {
    if (partitionstList) {
      this.partitions = partitionstList.partitions;
      for (const entry of this.partitions) {
        if (entry.accountId === this.partitions.partition) {
          this.selectedPartition = entry;
        }
      }
      this.productPermissions(this.permissionstList);
    }
  }
  @Input() productOfferId: number;
  @Output() isPOUpdated = new EventEmitter();
  @Output() isOfferingUpdated = new EventEmitter();
  @Input() displayBundle: boolean;
  editTooltip: any;
  savePermissionsSubscribe: any;
  editSubSettingsCapability = true;
  
  constructor(private locale: LocaleService,
    private _contextBarHandlerService: contextBarHandlerService,
    private _formBuilder: FormBuilder,
    private _productService: ProductService,
    private _utilService: utilService,
    private _sharedService: sharedService,
    private _modalService: modalService,
    private _translationService: TranslationService,
    private _capabilityService: CapabilityService,
    private _utilityService: UtilityService) {
    this.confirmDialog = 0;
    this.types = [];
    this.types.push({ label: 'Mandatory', value: false });
    this.types.push({ label: 'Optional', value: true });
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === 27 && this._utilityService.isObject(this.permissionsWidget)) {
      if (this.confirmDialog === 0 && this.permissionsWidget.visibleStatus && this.POPermissions.dirty) {
        this.confirmDialog = 1;
      } else if (!this.POPermissions.dirty) {
        this.closeEditPanel();
      } else {
        this.confirmDialog = 0;
      }
    }
  }
  onFormFieldChange(type) {
    this.validateMinMax(type);
    if (this.POPermissions.dirty && !this.startDateError && !this.endDateError) {
      this.isSaveEnabled = true;
    } else {
      this.isSaveEnabled = false;
    }
  }

  ngOnInit() {
    this.editTooltip = this._translationService.translate ('TEXT_EDIT');
    this.currentLocale = this.locale.getCurrentLocale();
    this.calenderLocale = calenderLocaleFeilds[this.currentLocale];
    this.POPermissions = this._formBuilder.group({
      userSubscribe: [false],
      userUnsubscribe: [false],
      availableStartDate: [''],
      availableEndDate: [''],
      selectedAccountTypeEligibility: [[]],
      poBundleOptionality: this.createGroup()
    });
    this.startDateError = false;
    this.endDateError = false;
     this.savePermissionsSubscribe = this._contextBarHandlerService.savePermissions.subscribe((value) => {
      if (value) {
        const permissions = this.POPermissions['_value'];
        if (permissions.availableStartDate) {
          permissions['availableStartDate'] = new Date(permissions['availableStartDate']).toISOString();
        }
        if (permissions.availableEndDate) {
          permissions['availableEndDate'] = new Date(permissions['availableEndDate']).toISOString();
        }
        this._productService.createPOForm(permissions, true, 'permissions');
      }
    });

    this.onPermissionsFormChanges();
    this.editSubSettingsCapability = this._capabilityService.findPropertyCapability('UIPoDetailsPage', 'SubsSettings_Edit');
  }

  onPermissionsFormChanges() {
    this.POPermissions.valueChanges.subscribe(value => {
      if (this.POPermissions.dirty) {
        this._utilService.checkIsPermissionsFormUpdated(true);
        this._utilService.changeIsProductOfferUpdated(false);
        this.isSaveEnabled = true;
      }
    });
    this.setSaveDisabled();
  }

  createGroup() {
    const group = new FormGroup({});
    if (this.propertyPermissions) {
      this.offerOptions = {};
      const options = this.propertyPermissions.poBundleOptionality;
      for (const key in options) {
        if (key) {
          const obj = options[key];
          const property = obj['poName'];
          const value = obj['optional'];
          this.offerOptions[property] = value;
        }
      }
      this.poNames = Object.keys(this.offerOptions);
      this.poNames.forEach((option) => {
        const control: FormControl = new FormControl(this.offerOptions[option]);
        group.addControl(option, control);
      });
      return group;
    }
  }

  accEligibilityChange(obj) {
    this.POPermissions.markAsDirty();
    this.isSaveEnabled = true;
    this.permissionstList['isAccountTypeEligibilityUpdated'] = true;
  }

  changeDropdown(partition) {
    this.selectedPartition = partition;
  }

  isFormValid() {
    if (this.POPermissions.valid) {
      this._contextBarHandlerService.changeContextSaveButton(false);
    }
  }

  productPermissions(permissionstList) {
    if (permissionstList !== undefined && permissionstList !== null && Object.keys(permissionstList).length > 0) {
      this.propertyPermissions = permissionstList;
      const selectedAccTypes = this.propertyPermissions.selectedAccountTypeEligibility;
      if (selectedAccTypes !== null && selectedAccTypes !== undefined && Object.keys(selectedAccTypes).length > 0) {
        this.selectedAccountTypes = Object.keys(this.propertyPermissions.selectedAccountTypeEligibility);
        this.selectedAccountTypesForm = this.selectedAccountTypes.slice();
      } else {
        this.selectedAccountTypes = [];
        this.selectedAccountTypesForm = null;
      }
      if (this.propertyPermissions.accountTypeEligibilities !== null &&
        this.propertyPermissions.accountTypeEligibilities !== undefined) {
        this.accountTypeEligibilityList = this.processAccTypeList(this.propertyPermissions.accountTypeEligibilities);
      } else {
        this.accountTypeEligibilityList = [];
      }
      this.availableStartDate = permissionstList.availStartDate ? new Date(permissionstList.availStartDate) : null;
      this.availableEndDate = permissionstList.availEndDate ? new Date(permissionstList.availEndDate) : null;
      this.partitions = permissionstList.poPartitions;
      for (const entry of this.partitions) {
        if (entry.accountId === permissionstList.partitionId) {
          this.selectedPartition = entry;
        }
      }
      const totalPOCount = this.propertyPermissions.totalProductOffers;
      const optionalPOCount = this.propertyPermissions.optionalProductOffers;
      const mandatoryPOCount = totalPOCount - optionalPOCount;
      if (totalPOCount >= 1) {
        if (totalPOCount === optionalPOCount) {
          this.optionalityMsg = this._translationService.translate('TEXT_ALL_PRODUCT_ARE_OPTIONAL');
        } else if (optionalPOCount === 0) {
          this.optionalityMsg = this._translationService.translate('TEXT_ALL_PRODUCT_ARE_MANDATORY');
        } else {
          const mandatoryText = this._translationService.translate('TEXT_MANDATORY');
          const optionalText = this._translationService.translate('TEXT_OPTIONAL_PRODUCTS');
          const andText = this._translationService.translate('TEXT_AND');
          this.optionalityMsg = `${mandatoryPOCount}  ${mandatoryText}  ${andText}  ${optionalPOCount}  ${optionalText}`;
        }
      } else {
        this.optionalityMsg = '';
      }
      this.permissionstList.isAccountTypeEligibilityUpdated = false;
      this.showPermissions = true;
      this.POPermissions = this._formBuilder.group({
        userSubscribe: [permissionstList.userSubscribe],
        userUnsubscribe: [permissionstList.userUnsubscribe],
        availableStartDate: [this.availableStartDate],
        availableEndDate: [this.availableEndDate],
        selectedAccountTypeEligibility: [this.selectedAccountTypes],
        poBundleOptionality: this.createGroup()
      });
      this.onPermissionsFormChanges();
    }
  }

  validateMinMax(type) {
      this.startDateError = false;
      this.endDateError = false;
      if (this.POPermissions.controls.availableEndDate.value !== '' &&
        this.POPermissions.controls.availableEndDate.value !== null &&
        this.POPermissions.controls.availableStartDate.value !== '' &&
        this.POPermissions.controls.availableStartDate.value !== null) {
        const startDate = new Date(this.POPermissions.controls.availableStartDate.value);
        const endDate = new Date(this.POPermissions.controls.availableEndDate.value);
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

  processAccTypeList(list) {
    const temp = [];
    for (const key in list) {
      if (list.hasOwnProperty(key)) {
        const element = {};
        element['label'] = list[key];
        element['value'] = key;
        temp.push(element);
      }
    }
    return temp;
  }

  setSaveDisabled() {
    return !this.isSaveEnabled || !this.POPermissions.valid;
  }

  savePOPermissions(permissions) {
    if(!this.setSaveDisabled()){
      this.isSaveEnabled = false;
    const permissionsObject = this.POPermissions['_value'];
    this.permissionsForm = this.createPermissionsForm(permissionsObject);
    if (this.POPermissions.dirty) {
        this.displayBundle ? this.selectedProductType = 'BUNDLE' : this.selectedProductType = 'PO';
        this._productService.updateProductOffer({
          data: {
            type: this.selectedProductType,
            productOfferId: this.productOfferId,
            body: this.permissionsForm,
            fields: this._utilityService.getFieldParams('offeringPermissions', 'string')
          },
          success: (result)  => {
            permissions.hide();
            this.showCover = false;
            this._utilService.checkNgxSlideModal(false);
            this.selectedProductType === 'BUNDLE' ? this.isOfferingUpdated.emit('subSettings') : this.isPOUpdated.emit('subSettings');
            this._utilService.changeIsProductOfferUpdated(true);
            this.isSaveEnabled = false;
          },
          failure: (errorMsg: string, code: any, error: any)  => {
            this.isSaveEnabled = true;
            this.showErrorMessage = true;
            this.httpErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'EDIT');
            this._utilService.changeIsProductOfferUpdated(false);
          }
        });
    }
  }
  }

  createPermissionsForm(permissionsObject) {
    const tempFormObj = {};
    let finalFormObj = { oldEntity: {}, newEntity: {} };
    let offeringProperties = {};
    if (permissionsObject) {
      for (const key in permissionsObject) {
        if (key) {
          tempFormObj[key] = permissionsObject[key];
        }
      }
      if (permissionsObject.availableStartDate) {
        const date = new Date(tempFormObj['availableStartDate']);
        tempFormObj['availableStartDate'] = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
      }
      if (permissionsObject.availableEndDate) {
        const date = new Date(tempFormObj['availableEndDate']);
        tempFormObj['availableEndDate'] = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
      }
      const selectedAccounts = {};
      if (this.selectedAccountTypesForm !== null && this.selectedAccountTypesForm !== undefined &&
        this.selectedAccountTypesForm.length > 0) {
        for (let index = 0; index < this.selectedAccountTypesForm.length; index++) {
          const element = this.selectedAccountTypesForm[index];
          for (const key in this.propertyPermissions.accountTypeEligibilities) {
            if (this.propertyPermissions.accountTypeEligibilities.hasOwnProperty(key)) {
              if (element === key) {
                selectedAccounts[key] = this.propertyPermissions.accountTypeEligibilities[key];
              }
            }
          }
        }
      }
      tempFormObj['selectedAccountTypeEligibility'] = selectedAccounts;
      if (this.permissionstList['isAccountTypeEligibilityUpdated']) {
        tempFormObj['isAccountTypeEligibilityUpdated'] = true;
      } else {
        tempFormObj['isAccountTypeEligibilityUpdated'] = false;
      }
      if (this.displayBundle) {
        const optionalObject = permissionsObject.poBundleOptionality;
        const updatedOptionality = this.propertyPermissions.poBundleOptionality.slice();
        const formOptionality = permissionsObject.poBundleOptionality;
        if (optionalObject !== null && optionalObject !== undefined) {
          const formOptionalityKeys = Object.keys(formOptionality);
          for (let index = 0; index < updatedOptionality.length; index++) {
            const option = updatedOptionality[index];
            option['optional'] = formOptionality[formOptionalityKeys[index]];
          }
        }
        tempFormObj['poBundleOptionality'] = updatedOptionality.slice();
      } else {
        delete tempFormObj['poBundleOptionality'];
      }
    }
    offeringProperties = JSON.parse(JSON.stringify(this.editPermissionsData));
    for (const key in tempFormObj) {
      if (key) {
        offeringProperties[key] = tempFormObj[key];
      }
    }
    finalFormObj['oldEntity'] = JSON.parse(JSON.stringify(this.editPermissionsData));
    finalFormObj['newEntity'] = JSON.parse(JSON.stringify(offeringProperties));
    return finalFormObj;
  }

  displayCoverHandler(permissions) {
    if(!this.showAprrovalEditBtn){
      this.permissionsWidget = permissions;
      this.showCover = true;
      permissions.show();
      this.disableEnableAvailableDates(permissions);
      this.loading = false;
      this.showErrorMessage = false;
    }
  }

  cancelCoverHandler(permissions) {
    if (this.POPermissions.dirty) {
      this.confirmDialog = 1;
    } else {
      permissions.hide();
      this.showCover = false;
      this._utilService.checkNgxSlideModal(false);
    }
  }

  closeEditPanel() {
    this.permissionsWidget.hide();
    this.showCover = false;
    this._utilService.checkNgxSlideModal(false);
    this.productPermissions(this.viewPermissionsData);
    this.isSaveEnabled = false;
    this.startDateError = false;
    this.endDateError = false;
  }

  onModalDialogCloseCancel(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this._utilService.checkIsPermissionsFormUpdated(false);
      this._utilService.changeIsProductOfferUpdated(false);
      this.closeEditPanel();
    }
  }

  disableEnableAvailableDates(permissions) {
    if (this.productOfferId !== (undefined && null)) {
      this.loading = true;
        this._productService.getPOConfiguration({
          data: {
            productOfferId: this.productOfferId
          },
          success: (result) => {
            this.setAvailableDates = false;
            this._utilService.checkNgxSlideModal(true);
          },
          failure: (error, errorCode, errorMessage) => {
            this.setAvailableDates = true;
            this._utilService.checkNgxSlideModal(true);
          },
          onComplete: () => {
            this.loading = false;
            setTimeout(() => {           
              document.getElementById('initFocus').focus();
            }, 300);
          }
        });
      }
    }
  ngOnDestroy() {
    if (this.savePermissionsSubscribe) {
      this.savePermissionsSubscribe.unsubscribe();
    }
  }
}

