import { Component, OnInit, Input, Output, EventEmitter, HostListener, OnDestroy, ViewChild, ElementRef, AfterViewInit, Renderer } from '@angular/core';
import { sharedService } from '../sharedService';
import { modalService } from '../../helpers/modal-dialog/modal.service';
import { utilService } from '../../helpers/util.service';
import { NgForm, FormsModule, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../productOffer.service';
import { priceableItemDetailsService } from '../../priceableItemDetails/priceableItemDetails.service';
import { Translation, TranslationService } from 'angular-l10n';
import { PiTemplateDetailsService } from '../../priceableItemTemplates/piTemplateDetails/piTemplateDetails.service';
import { CapabilityService } from '../../helpers/capabilities.service';
import { UtilityService } from '../../helpers/utility.service';

@Component({
  selector: 'ecb-extended-properties',
  templateUrl: './extendedProperties.component.html',
  styleUrls: ['./extendedProperties.component.scss']

})

export class ExtendedPropertiesComponent implements OnInit, OnDestroy {

  extendedProperty: any;
  keys;
  isDisabled = false;
  isDataAvailable = false;
  isProductOffer = false;
  showCover: boolean = false;
  showErrorMessage: boolean = false;
  httpErrorMessage: any;
  extendedPropertiesForm: FormGroup;
  isSaveEnabled;
  objectData;
  isBundle;
  extendedPropertiesSubscriptions: any;
  confirmDialog;
  extendedProps;
  isPItemplate;
  widgetData = {};
  showInUseOfferings:boolean;
  editTooltip: any;
  modalDialogClose;
  showAprrovalEditBtn:boolean = false;
  initialExtProperties: {} = {};
  @Input() serverError;
  @Input() set PIType(priceableItemType) {
    ((priceableItemType === 'Usage') || (priceableItemType === 'Discount')) ? (this.isDisabled = true) : (this.isDisabled = false);
  }
  @Input() set type(value) {
    if (value) {
      (value === 'PO') ? (this.isProductOffer = true) : (this.isProductOffer = false);
      (value === 'Bundle') ? (this.isBundle = true) : (this.isBundle = false);
      (value === 'PItemplate') ? (this.isPItemplate = true) : (this.isPItemplate = false);
    }
  }
  @Input() set approvalFlag(value) {
    if (value && value['Capabilities']['Properties_Edit'] === true && value['approval']['enableApprovalsEdit'] === true) {
      this.showAprrovalEditBtn = false;
    } else {
      this.showAprrovalEditBtn = true;
    }
  }
  @Input() set extendedProperties(value) {
    if (value !== undefined && value !== null) {
      if (this.isProductOffer || this.isBundle) {
        this.extendedProperty = value.extendedProperties;
        this.initialExtProperties = JSON.parse(JSON.stringify(value));
        this.objectData = value;
      } else if (this.isPItemplate) {
        this.extendedProperty = value.extendedProperties;
        this.objectData = value;
      } else {
        this.extendedProperty = value.extendedProps;
        this.objectData = value;
      }
      if (this.extendedProperty) {
        this.createExtPropertiesForm();
        this.isDataAvailable = true;
      }
    }
  }
  @Input() productOfferId;
  @Output() isPOUpdated = new EventEmitter();
  @Output() isPITemplateUpdated= new EventEmitter();
  @Output() isOfferingUpdated = new EventEmitter();
  @ViewChild('firstInput') firstInput: any;
  @Output() isFormDirty = new EventEmitter();
  editExtPropCapability = true;
  inUseOfferingsData;
  inUseOfferingsLocation;

  constructor(
    private _sharedService: sharedService,
    private _modalService: modalService,
    private _utilService: utilService,
    private _formBuilder: FormBuilder,
    private _productService: ProductService,
    private _priceableItmeDetailsService: priceableItemDetailsService,
    private _translationService: TranslationService,
    private _piTemplateDetailsService: PiTemplateDetailsService,
    private _renderer: Renderer,
    private _capabilityService: CapabilityService,
    private _UtilityService: UtilityService
  ) {
    this.confirmDialog = 0;
   }
  
  ngOnInit() {
    this.editTooltip = this._translationService.translate ('TEXT_EDIT');
    this.extendedPropertiesForm = new FormGroup({});
      if (this.extendedProperty) {
      this.createExtPropertiesForm();
    }
    if (!this.isPItemplate) {
      this.editExtPropCapability = this._capabilityService.findPropertyCapability('UIPoDetailsPage', 'ExtProps_Edit');
    }
  }

  createGroup() {
    const group = new FormGroup({});
    this.extendedProperty.forEach((extProperties) => {
        let control: FormControl = new FormControl(extProperties.value, Validators.required);
        group.addControl(extProperties.dn, control);
    });
    return group;
  }

  createExtPropertiesForm() {
    this.extendedPropertiesForm = this.createGroup();
    this.onExtPropertiesFormChanges();
  }

  onExtPropertiesFormChanges() {
    if (this.isProductOffer || this.isBundle) {
      this.extendedPropertiesSubscriptions = this.extendedPropertiesForm.valueChanges.subscribe(value => {
        if (this.extendedPropertiesForm.dirty) {
          this._utilService.checkIsExtPropertiesFormUpdated(true);
          this._utilService.changeIsProductOfferUpdated(false);
        }
      });
    }
  }

  onEnterSavePOExtProperties(extendedProps, event) {
    if (this.isSaveEnabled) {
      if (event.keyCode === 13 && !event.shiftKey) {
        this.savePOExtProperties(extendedProps);
      }
    }
  }

  savePOExtProperties(extendedProps) {
    this.isSaveEnabled = false;
    let finalFormObj = { oldEntity: {}, newEntity: {} };
    if (this.extendedPropertiesForm.dirty) {
      const  extPropertiesFormObject = this.extendedPropertiesForm["_value"];
      for (const item in extPropertiesFormObject) {
        if (extPropertiesFormObject[item] !== null) {
          this.objectData.properties[item] = extPropertiesFormObject[item];
        }
      }
      finalFormObj['oldEntity'] = JSON.parse(JSON.stringify(this.initialExtProperties));
      finalFormObj['newEntity'] = JSON.parse(JSON.stringify(this.objectData));
      if (this.isProductOffer || this.isBundle) {
          this._productService.updateProductOffer({
          data : {
            type: this.isProductOffer ? 'PO' : 'BUNDLE',
            productOfferId : this.productOfferId,
            body: finalFormObj,
            fields: this._UtilityService.getFieldParams('offeringExtProperties', 'string')
          },
          success : (result) => {
            this.closeEditPanel();
            this.isBundle ? this.isOfferingUpdated.emit('extProperties') : this.isPOUpdated.emit('extProperties');
            this._utilService.changeIsProductOfferUpdated(true);
          },
          failure : (errorMsg: string, code: any, error: any) => {
            this.showErrorMessage = true;
            this.isSaveEnabled = true;
            this.httpErrorMessage = this._UtilityService.errorCheck(code, errorMsg, 'EDIT');
            this._utilService.changeIsProductOfferUpdated(false);
            this.isFormDirty.emit(false);
          }
        });
      }
      if (!this.isProductOffer && !this.isBundle) {
        this.widgetData['body'] = this.objectData;
        this.widgetData['isPitemplate'] = this.isPItemplate ? true : false;
        this.widgetData['fields'] = this._UtilityService.getFieldParams('offeringExtProperties', 'string');
        this._priceableItmeDetailsService.updatePriceableItem({
          data: this.widgetData,
          success : (result) => {
            this.closeEditPanel();
            if(this.isPItemplate) {	
              this.isPITemplateUpdated.emit('ExtProperties');	
            }
            this._utilService.changeIsProductOfferUpdated(true);
            this.confirmDialog = 0;
            this.isPItemplate ? (this._piTemplateDetailsService.changeIsPItemplateDetailsUpdated(true)) :
              (this._priceableItmeDetailsService.changeIsPriceableItemUpdated('extProperties'));
          },
          failure : (errorMsg: string, code: any, error: any) => {
            this.showErrorMessage = true;
            this.isSaveEnabled = true;
            this.httpErrorMessage = this._UtilityService.errorCheck(code, errorMsg, 'EDIT');
            this.isFormDirty.emit(false);
          }
        });
      }
    }
  }

  displayCoverHandler(extendedProps, value) {
    if(!this.showAprrovalEditBtn){
      this.extendedProps = extendedProps;
      extendedProps.show();
      this.showCover = true;
      this.showErrorMessage = false;
      this.isSaveEnabled = false;
      this._utilService.checkNgxSlideModal(true);
      setTimeout(() => {
        document.getElementById("initFocus").focus();
      }, 300);
    }
  }

  cancelCoverHandler() {
    if (this.extendedPropertiesForm.dirty) {
      this.confirmDialog = 1;
    } else {
      this.extendedProps.hide();
      this.showCover = false;
      this._utilService.checkNgxSlideModal(false);
    }
  }

  onCheckboxSelect(event, extProperty, index) {
    this.isSaveEnabled = true;
    if (extProperty.value === '1') {
      this.extendedPropertiesForm["_value"][extProperty.dn] = '0';
      extProperty.value = '0';
      this.extendedProperty[index] = extProperty;
    } else if (extProperty.value === '0') {
      this.extendedPropertiesForm["_value"][extProperty.dn] = '1';
       extProperty.value = '1';
       this.extendedProperty[index] = extProperty;
    }
    this.objectData.properties[extProperty.dn] = this.extendedPropertiesForm["_value"][extProperty.dn];
  }

  checkAnySelected(extProperty) {
    return !(this.extendedPropertiesForm['_value'][extProperty.dn] === 'N' || this.extendedPropertiesForm['_value'][extProperty.dn] === null);
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === 27 && this._UtilityService.isObject(this.extendedProps) &&
    !this._UtilityService.isObject(document.getElementsByTagName('ecb-inuse-offerings-modal-dialog')[0])) {
      if (this.confirmDialog === 0 && this.extendedProps.visibleStatus) {
        this.cancelCoverHandler();
      } else {
        this.confirmDialog = 0;
      }
    }
    if (this.extendedPropertiesForm.dirty) {
      this.isSaveEnabled = true;
    }
  }

  closeEditPanel() {
    this.createExtPropertiesForm();
    this.extendedProps.hide();
    this.showCover = false;
    this._utilService.checkNgxSlideModal(false);
    this._utilService.checkIsExtPropertiesFormUpdated(false);
    this.isFormDirty.emit(false);
  }

  onModalDialogCloseCancel(event) {
    this.confirmDialog = 0;
    if (event.index === -1 && this.extendedPropertiesForm.dirty) {
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

  openInUseOfferings() {
    this.showInUseOfferings = true;
    this.inUseOfferingsData = this.objectData;
    this.inUseOfferingsLocation = 'priceableItemTemplateDetails';
  }
 hideInUseModalDialog(e) {
    if (e) {
      this.showInUseOfferings = false;
    }
  }
  isReadonlyElement(extProperty) {
    if (this.isPItemplate) {
      return false;
    } else {
      return (extProperty.overrideable === 'false');
    }
  }

  ngOnDestroy() {
    if (this.extendedPropertiesSubscriptions) {
      this.extendedPropertiesSubscriptions.unsubscribe();
    }
  }

  isNoBreakString(value) {
    return this._UtilityService.isNoBreakString(value);
  }
}
