import { Component, OnInit, Input, HostListener, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { NgForm, FormsModule, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { utilService } from '../../helpers/util.service';
import { modalService } from '../../helpers/modal-dialog/modal.service';
import { sharedService } from '../../productOffer/sharedService';
import { priceableItemDetailsService } from '../priceableItemDetails.service';
import { ISubscription } from "rxjs/Subscription";
import { Translation, TranslationService } from 'angular-l10n';
import { PiTemplateDetailsService } from '../../priceableItemTemplates/piTemplateDetails/piTemplateDetails.service';
import { CapabilityService } from '../../helpers/capabilities.service';
import { UtilityService } from '../../helpers/utility.service';

@Component({
  selector: 'ecb-unit-details',
  templateUrl: './pi-unit-details.component.html'
})

export class PIUnitDetailsComponent implements OnInit, OnDestroy {

  ratingType;
  priceableItemData;
  enumerationValues;
  PIUnitDetailsForm: FormGroup;
  showCover;
  isValidEnum: boolean;
  httpErrorMessage;
  confirmDialog;
  unitDetailsWidget;
  showInUseOfferings;
  viewPriceableItem = {};
  PIUnitDetailsSubscriptions: ISubscription;
  validEnumValueHeight = 0;
  enumerationValuesDummy;
  UnitDetails_Edit = true;
  saveDisabled: boolean;
  minError: boolean;
  maxError: boolean;

  @Output() isFormDirty = new EventEmitter();
  @Output() isPITemplateUpdated = new EventEmitter();
  @Input() isPItemplate;
  @Input() PIServerError;
  @Input() set PIdata(priceableItemData) {
    if (priceableItemData) {
      this.priceableItemData = priceableItemData;
      this.enumerationValues = (priceableItemData.sortedEnumValues).join(" ");
      this.enumerationValuesDummy = (priceableItemData.validEnumValues);
      this.processGeneralProperties(this.priceableItemData);
    }
    for (const key in this.priceableItemData) {
      if (key) {
        this.viewPriceableItem[key] = this.priceableItemData[key];
      }
    }
  }
  editTooltip: any;
  widgetData = {};
  isValidMinMax = false;
  validEnum;
  showMessage = 'space';
  modalDialogClose;
  unitValueOptions: any[] = [];
  @ViewChild('textarea') textArea: any;
  inUseOfferingsData;
  inUseOfferingsLocation;
  PIUnitDetailsFormValueSubscription: any;

  constructor(private _sharedService: sharedService,
    private _utilService: utilService,
    private _modalService: modalService,
    private _priceableItmeDetailsService: priceableItemDetailsService,
    private _translationService: TranslationService,
    private _piTemplateDetailsService: PiTemplateDetailsService,
    private _formBuilder: FormBuilder,
    private _capabilityService: CapabilityService,
    private _utilityService: UtilityService) {
    this.confirmDialog = 0;
  }

  ngOnInit() {
    this.editTooltip = this._translationService.translate('TEXT_EDIT');
    this.unitValueOptions = [{ label: this._translationService.translate('TEXT_DECIMAL_COMBO'), value: false },
    { label: this._translationService.translate('TEXT_INTEGER_COMBO'), value: true }];
    if ( !this.isPItemplate) {
      this.UnitDetails_Edit = this._capabilityService.findPropertyCapability('UIPIDetailsPage', 'UnitDetails_Edit');
    }
    this.onPropertiesFormChanges();
  }

  toggleSaveStatus() {
    if (this.PIUnitDetailsForm.dirty && this.PIUnitDetailsForm.valid && !this.minError && !this.maxError && this.isValidEnum) {
      this.saveDisabled = false;
    }
    else {
      this.saveDisabled = true;
    }
  }

  removeSpace(){
    let checkNameValue = this.PIUnitDetailsForm.controls.unitName;
    let checkDisplayValue = this.PIUnitDetailsForm.controls.unitDisplayName;
    this._utilityService.removeTextSpace(checkNameValue, checkDisplayValue); 
  }
  
  disableSpace(evt){
    this._utilityService.disableSpaceBar(evt); 
  }

  onPropertiesFormChanges() {
    this.PIUnitDetailsFormValueSubscription = this.PIUnitDetailsForm.valueChanges.subscribe(value => {
      this.toggleSaveStatus();
    });
    this.PIUnitDetailsForm.controls.minUnitValue.valueChanges.subscribe(value => {
      this.onFormFieldChange('minUnitValue');
    });
    this.PIUnitDetailsForm.controls.maxUnitValue.valueChanges.subscribe(value => {
      this.onFormFieldChange('maxUnitValue');
    });
    this.PIUnitDetailsForm.controls.validEnumValues.valueChanges.subscribe(value => {
      this.checkValidEnums();
    });
  }

  displayCoverHandler(unitDetails) {
    this.minError = false;
    this.maxError = false;
    this.saveDisabled = true;
    this.isValidEnum = true;
    this.unitDetailsWidget = unitDetails;
    unitDetails.show();
    this.showCover = true;
    this.httpErrorMessage = undefined;
    this.showMessage = 'space';
    this._utilService.checkNgxSlideModal(true);
    setTimeout(() => {
      this.isPItemplate === true ? document.getElementById("initFocusName").focus() : document.getElementById("initFocusUDName").focus();
    }, 300);
  }
  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === 27 && this._utilityService.isObject(this.unitDetailsWidget) &&
    !this._utilityService.isObject(document.getElementsByTagName('ecb-inuse-offerings-modal-dialog')[0])) {
      if (this.confirmDialog === 0 && this.unitDetailsWidget.visibleStatus) {
        this.cancelCoverHandler();
      } else {
        this.confirmDialog = 0;
      }
    }
  }
  cancelCoverHandler() {
    if (this.PIUnitDetailsForm.dirty) {
      this.confirmDialog = 1;
    } else {
      this.unitDetailsWidget.hide();
      this.showCover = false;
      this._utilService.checkNgxSlideModal(false);
    }
  }

  closeEditPanel() {
    this.unitDetailsWidget.hide();
    this.showCover = false;
    this.processGeneralProperties(this.viewPriceableItem);
    this._utilService.checkNgxSlideModal(false);
    this.isFormDirty.emit(false);
    this.modalDialogClose = false;
  }

  onModalDialogCloseCancel(event) {
    this.onPropertiesFormChanges();
    this.confirmDialog = 0;
    if (event.index === -1 && this.PIUnitDetailsForm.dirty) {
      this.modalDialogClose = !this.modalDialogClose;
      if (this.modalDialogClose) {
        this.confirmDialog = 1;
      }
    }
    if (event.index === 1) {
      this.closeEditPanel();
    }
    if (event.index === 0 || event.index === 2) {
      this.modalDialogClose = !this.modalDialogClose;
    }
  }

  processGeneralProperties(priceableItemData) {
    let choiceListValues = [];
    const choiceListTemp = this.enumerationValuesDummy;
    for (const index in choiceListTemp) {
      if (choiceListTemp.hasOwnProperty(index)) {
        choiceListValues.push(choiceListTemp[index]);
        if ((parseInt(index) + 1) < choiceListTemp.length) {
          choiceListValues.push('\n');
        }
      }
      const enumerationValuesDummyLength = this.enumerationValuesDummy.length * 21;
      this.validEnumValueHeight = enumerationValuesDummyLength;
    }
    if (priceableItemData) {
      this.PIUnitDetailsForm = this._formBuilder.group({
        unitName: [priceableItemData.unitName, [Validators.required]],
        unitDisplayName: [priceableItemData.unitDisplayName, [Validators.required]],
        ratingType: [{ value: priceableItemData.ratingType, disabled: (!this.isPItemplate) }],
        integral: [{ value: priceableItemData.integral, disabled: (!this.isPItemplate) }],
        minUnitValue: [priceableItemData.minUnitValue, [Validators.required]],
        maxUnitValue: [priceableItemData.maxUnitValue, [Validators.required]],
        validEnumValues: [choiceListValues.toString().replace(/\,/g, '')],
      });
      this.onPropertiesFormChanges();
    }
  
  }

  onEnterSavePIunitDetails(event, unitDetails) {
      if (!this.saveDisabled) {
      if (event.keyCode === 13 && !event.shiftKey) {
        this.savePIunitDetails(unitDetails);
      }
    }
  }
  

  savePIunitDetails(unitDetails) {
    this.saveDisabled = true;
    let propertiesObject = this.PIUnitDetailsForm['_value'];
    propertiesObject.unitName = propertiesObject.unitName.trim();
    propertiesObject.unitDisplayName = propertiesObject.unitDisplayName.trim();
    this.widgetData['body'] = this.prepareData(propertiesObject);
    this.widgetData['isPitemplate'] = this.isPItemplate ? true : false;
    this.widgetData['fields'] = this.isPItemplate ? this._utilityService.getFieldParams('offeringPTUnitDetails', 'string') : this._utilityService.getFieldParams('offeringPIUnitDetails', 'string');
    if (this.PIUnitDetailsForm.dirty) {
      this._priceableItmeDetailsService.updatePriceableItem({
        data: this.widgetData,
        success: (result) => {
          this.closeEditPanel();
          if (this.isPItemplate) {
            this.isPITemplateUpdated.emit('PIUnitDetails');
          }
          this.isPItemplate ? (this._piTemplateDetailsService.changeIsPItemplateDetailsUpdated(true)) :
            (this._priceableItmeDetailsService.changeIsPriceableItemUpdated('unitDetails'));
        },
        failure : (errorMsg: string,code: any, error: any) => {
          this.saveDisabled = false;
          this.httpErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'EDIT');
          this.isFormDirty.emit(false);
        }
      });
    }

  }

  prepareData(propertiesObject) {
    if (propertiesObject) {
      for (const key in propertiesObject) {
        if (key === 'validEnumValues') {
          let choiceList = [];
          const tempObj = [];
          choiceList = propertiesObject[key].split(/\n/);
          for (const index in choiceList) {
            if (choiceList.hasOwnProperty(index) && choiceList[index] !== '') {
              tempObj.push(choiceList[index]);
            }
          }
          propertiesObject[key] = tempObj;
          this.priceableItemData[key] = propertiesObject[key];
        } else {
          this.priceableItemData[key] = propertiesObject[key];
        }
      }
    }
    return this.priceableItemData;
  }

  openInUseOfferings() {
    this.showInUseOfferings = true;
    this.inUseOfferingsData = this.priceableItemData;
    this.inUseOfferingsLocation = 'priceableItemTemplateDetails';
  }

  validateMinMax(field) {
    this.minError = false;
    this.maxError = false;
     if (this.PIUnitDetailsForm.controls.maxUnitValue.value !== '' &&
       this.PIUnitDetailsForm.controls.maxUnitValue.value !== null &&
       this.PIUnitDetailsForm.controls.minUnitValue.value !== '' &&
       this.PIUnitDetailsForm.controls.minUnitValue.value !== null) {
       const minUnitValue = this.PIUnitDetailsForm.controls.minUnitValue.value;
       const maxUnitValue = this.PIUnitDetailsForm.controls.maxUnitValue.value;
       if (maxUnitValue <= minUnitValue) {
          if (field === 'minUnitValue') {
            this.minError = true;
          } 
          else
         {
            this.maxError = true;
           }
       this.isValidMinMax = false;
       }
       else{
         this.checkValidEnums();
       }

      }
         else {
           this.minError = false;
           this.maxError = false;
         }
       
     } 
   
 
  disableMathKeys(key) {
    const selectedKeyCode = key.keyCode;
    if(isNaN(key.key) && selectedKeyCode!=8 && selectedKeyCode!=46){
      key.preventDefault();
    }
  }
  checkValidEnums() {
    setTimeout(() => {
    this.validEnum = [];
    this.priceableItemData.validEnumValues = [];
    this.priceableItemData.minUnitValue = this.PIUnitDetailsForm["_value"]['minUnitValue'];
    this.priceableItemData.maxUnitValue = this.PIUnitDetailsForm["_value"]['maxUnitValue'];
    this.showMessage = 'space';
    if (this.PIUnitDetailsForm["_value"].validEnumValues) {
      this.validEnum = (this.PIUnitDetailsForm["_value"].validEnumValues.split('\n'));
      for (const num in this.validEnum) {
        if ((this.validEnum[num]) === '') {
          this.showMessage = 'doubleSpace';
          this.isValidEnum = false;
          break;
        } else if ((this.PIUnitDetailsForm["_value"]['minUnitValue'] <= this.validEnum[num])
          && (this.validEnum[num] <= this.PIUnitDetailsForm["_value"]['maxUnitValue'])) {
          this.priceableItemData.validEnumValues.push(this.validEnum[num]);
          this.showMessage = 'space';
          this.isValidEnum = true;
        } else {
          this.showMessage = 'invalid';
          this.isValidEnum = false;
          break;
        }
      }
    } else {
      this.isValidEnum = true;
      this.showMessage = 'space';
    }
    this.toggleSaveStatus();
    }, 300);
  }

  ngOnDestroy() {
    if (this.PIUnitDetailsSubscriptions) {
      this.PIUnitDetailsSubscriptions.unsubscribe();
    }
  }

  onFormFieldChange(type) {
    this.validateMinMax(type);
     this.toggleSaveStatus();
    
  }
  addTextArea(textarea, event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
    } else {
    textarea.style.height = '30px';
    textarea.style.height = textarea.scrollHeight + 'px';
    event = (event) ? event : window.event;
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
        return false;
    }
    return true;
  }
  }
  hideInUseModalDialog(e) {
    if (e) {
      this.showInUseOfferings = false;
    }
  }

}

