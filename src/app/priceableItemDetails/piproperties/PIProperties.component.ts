import { Component, OnInit, Input, Output, EventEmitter, HostListener, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { utilService } from '../../helpers/util.service';
import { modalService } from '../../helpers/modal-dialog/modal.service';
import { sharedService } from '../../productOffer/sharedService';
import { NgForm, FormsModule, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ISubscription } from "rxjs/Subscription";
import { priceableItemDetailsService } from '../priceableItemDetails.service';
import { Translation, TranslationService } from 'angular-l10n';
import { UtilityService } from '../../helpers/utility.service';
import { PiTemplateDetailsService } from '../../priceableItemTemplates/piTemplateDetails/piTemplateDetails.service';
import { PriceableItemTemplateService } from '../../priceableItemTemplates/priceableItemTemplate.service';
import { CapabilityService } from '../../helpers/capabilities.service';

@Component({
  selector: 'ecb-piproperties',
  templateUrl: './PIProperties.component.html',
  styleUrls: ['./PIProperties.component.scss']
})
export class PIPropertiesComponent implements OnInit, OnDestroy {
  priceableItem;
  eventType;
  piEventTypes;
  showCover: boolean = false;
  PIPropertiesForm: FormGroup;
  PIPropertiesSubscriptions: ISubscription;
  isSaveEnabled;
  httpErrorMessage;
  confirmDialog;
  PIPropertiesWidget;
  viewPriceableItem: any;
  fields = [];
  modalDialogClose;
  Props_Edit = true;
  showLoader: any;
  @ViewChild('textArea', { read: ElementRef }) textArea: ElementRef;
  @Input() priceableItemType;
  @Input() PIType;
  @Input() PIServerError;
  @Input() isPItemplate;
  @Output() isFormDirty = new EventEmitter();
  @Output() isPITemplateUpdated = new EventEmitter();
  @Input() set oneTimeCharges(val) {
    this.viewPriceableItem = {};
    this.priceableItem = val;
    if (this.priceableItem) {
      this.processGeneralProperties(this.priceableItem);
      if (this.priceableItem.unsubscription == true && (this.priceableItem.onsubscription == null || this.priceableItem.onsubscription == false)) {
        this.eventType = false;
      }
      else if (this.priceableItem.onsubscription == true && (this.priceableItem.unsubscription == null || this.priceableItem.unsubscription == false)) {
        this.eventType = true;
      }
    }
    for (const key in this.priceableItem){
      if (key) {
        this.viewPriceableItem[key] = this.priceableItem[key];
      }
    }
  }
  editTooltip: any;

  constructor(private _sharedService: sharedService,
    private _utilService: utilService,
    private _modalService: modalService,
    private _priceableItmeDetailsService: priceableItemDetailsService,
    private _translationService: TranslationService,
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _piTemplateDetailsService: PiTemplateDetailsService,
    private _piTemplateService: PriceableItemTemplateService,
    private _capabilityService: CapabilityService) {
    this.confirmDialog = 0;
    this.piEventTypes = [
      { key: "Unsubscription", value: false },
      { key: "Subscription", value: true }
    ];
   this._utilityService.hideSkeleton('propertiesSkeleton');
  }

  ngOnInit() {
    this.editTooltip = this._translationService.translate ('TEXT_EDIT');
    if (!this.isPItemplate) {
      this.Props_Edit = this._capabilityService.findPropertyCapability('UIPIDetailsPage', 'Props_Edit');
    }
  }
  OnEnterSavePIProperties(PIProperties, event) {
    if (this.PIPropertiesForm.valid) {
      if (event.keyCode === 13 && !event.shiftKey) {
        this.savePIProperties(PIProperties);
      }
    }
  }
  savePIProperties(PIProperties) {
    this.isSaveEnabled = false;
    let propertiesObject = this.PIPropertiesForm["_value"];
    propertiesObject.itemInstanceDisplayName = propertiesObject.itemInstanceDisplayName.trim();
    propertiesObject.itemInstanceName = propertiesObject.itemInstanceName.trim();
    let name = propertiesObject['itemInstanceDisplayName'];
    this.priceableItem.displayName = propertiesObject.itemInstanceDisplayName;
    this.priceableItem.description = propertiesObject.itemInstanceDescription;
    if (this.isPItemplate) {
      if (this.priceableItem.kindType === 'NON_RECURRING') {
        this.priceableItem.eventType = propertiesObject.eventType;
      }
    }
    const widgetData = {};
    widgetData['body'] = this.priceableItem;
    widgetData['isPitemplate'] = this.isPItemplate ? true : false;
    widgetData['fields'] = this._utilityService.getFieldParams('offeringPIProperties', 'string');
    if (this.PIPropertiesForm.dirty) {
      this._priceableItmeDetailsService.updatePriceableItem({
        data: widgetData,
        success : (result) => {
          this.closeEditPanel();
          if(this.isPItemplate) {
            this.isPITemplateUpdated.emit('PIProperties');
          }
          this.isPItemplate ? (this._piTemplateDetailsService.changeIsPItemplateDetailsUpdated(true)) :
            (this._priceableItmeDetailsService.changeIsPriceableItemUpdated('PIProperties')) ;
          if (this.priceableItem['chargeType']) {
            name = name + ` (${this.priceableItem['chargeType']})`;
          }
          this._utilService.breadCrumbDisplayNameEditorDelete({ pageTitle: name, actionType: 1 });
          this._utilService.addNewRecord({
            obj: name
          });
          this._utilService.changeBreadCrumbApplicationLevelEvents({
            PIObj: name
          });
        },
        failure : (errorMsg: string, code: any, error: any) => {
          this.isSaveEnabled = true;
          this.httpErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'EDIT');
          this.isFormDirty.emit(false);
        }
      });
    }
  }

  displayEditPanel(PIProperties) {
    this.PIPropertiesWidget = PIProperties;
    PIProperties.show();
    this.showCover = true;
    this._utilService.checkNgxSlideModal(true);
    this.httpErrorMessage = undefined;
    this.isSaveEnabled = false;
    setTimeout(() => {
      document.getElementById("initFocus").focus();
    }, 300);
  }

 @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === 27 && this._utilityService.isObject(this.PIPropertiesWidget)) {
      if (this.confirmDialog === 0 && this.PIPropertiesWidget.visibleStatus) {
        this.cancelCoverHandler();
      } else {
        this.confirmDialog = 0;
      }
    }
    if (this.PIPropertiesForm.dirty && this.PIPropertiesForm.controls.itemInstanceDisplayName.value !== '') { this.isSaveEnabled = true;
      this.isFormDirty.emit(true);
    } else {
      this.isSaveEnabled = false;
    }
  }

  removeSpace(){
    let checkNameValue = this.PIPropertiesForm.controls.itemInstanceName;
    let checkDisplayValue = this.PIPropertiesForm.controls.itemInstanceDisplayName;
    this._utilityService.removeTextSpace(checkNameValue, checkDisplayValue);
    if((checkDisplayValue.value === '' && !/\S/.test(checkDisplayValue.value)) || (checkNameValue.value === '' && !/\S/.test(checkNameValue.value))){
      this.isSaveEnabled = false;
    }else{
      this.isSaveEnabled = true;
    }
  }
  
  disableSpace(evt){
    this._utilityService.disableSpaceBar(evt); 
  }

  closeEditPanel() {
    this.PIPropertiesWidget.hide();
    this.isSaveEnabled = false;
    this.showCover = false;
    this._utilService.checkNgxSlideModal(false);
    this.processGeneralProperties(this.viewPriceableItem);
    this.isFormDirty.emit(false);
    this.modalDialogClose = false;
  }
  cancelCoverHandler() {
    if (this.PIPropertiesForm.dirty) {
      this.confirmDialog = 1;
    } else {
      this.closeEditPanel();
    }
  }
  onModalDialogCloseCancel(event) {
    this.confirmDialog = 0;
    if (event.index === -1 && this.PIPropertiesForm.dirty) {
      this.modalDialogClose = !this.modalDialogClose;
      if (this.modalDialogClose) {
        this.confirmDialog = 1;
      }
    }
    if (event.index === 1) {
      this.closeEditPanel();
      this.isSaveEnabled = false;
    }
    if (event.index === 0 || event.index === 2) {
      this.modalDialogClose = !this.modalDialogClose;
    }
  }
  processGeneralProperties(priceableItem) {
    if (priceableItem) {
      if (this.isPItemplate) {
        if (this.priceableItem.kindType === 'NON_RECURRING') {
          this.eventType = priceableItem.eventType;
        }
      }
      this.PIPropertiesForm = this._formBuilder.group({
        itemInstanceId: [priceableItem.itemInstanceId],
        itemInstanceName: [priceableItem.name],
        itemInstanceDisplayName: [priceableItem.displayName, [Validators.required]],
        itemInstanceDescription: [priceableItem.description],
        eventType: [this.eventType]
      });
    }
  }
  onRadioButtonClick(index) {
    this.isSaveEnabled = true;
    this.isFormDirty.emit(true);
  }

  ngOnDestroy() {
    if (this.PIPropertiesSubscriptions) {
      this.PIPropertiesSubscriptions.unsubscribe();
    }
  }

  isNoBreakString(value) {
    return this._utilityService.isNoBreakString(value);
  }
  autoGrow() {
    const textArea = this.textArea.nativeElement;
    this._utilityService.adjustHeightOnScroll(textArea);
   }
}
