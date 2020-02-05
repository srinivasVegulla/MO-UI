import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, HostListener } from '@angular/core';
import { TranslationService } from 'angular-l10n';
import { KeysPipe } from '../../helpers/keys.pipe';
import { UtilityService } from '../../helpers/utility.service';
import { PiBillingService } from '../piBilling/piBilling.service';
import { utilService } from '../../helpers/util.service';
import { PiTemplateDetailsService } from '../../priceableItemTemplates/piTemplateDetails/piTemplateDetails.service';
import { priceableItemDetailsService } from '../priceableItemDetails.service';
import { setTimeout } from 'timers';

@Component({
  selector: 'ecb-pi-billing',
  templateUrl: './piBilling.component.html',
  styleUrls: ['./piBilling.component.scss'],
  providers: [KeysPipe]
})
export class PiBillingComponent implements OnInit, OnDestroy {
  billingDetails;
  keys;
  showCover = false;
  piBillingEditPanel: any;
  editTooltip: any;
  billingForm: any;
  isSaveEnabled = true;
  recurringCycles: any;
  recurringCycleOptions1 = {};
  recurringCycleOptions2 = {};
  showInUseOfferings = false;
  showErrorMessage: any;
  updateFields = [];
  viewBillingForm = {};
  viewRecurringCycleOptions1 = {};
  viewRecurringCycleOptions2 = {};
  isBillingFormDirty: boolean;
  confirmDialog = 0;
  billingInfoSaving = false;
  isFormValidationError = false;
  modalDialogClose = false;
  biWeeklyInterval: any;
  isBiWeekly = false;
  @Output() isFormDirty = new EventEmitter();
  @Output() isPITemplateUpdated = new EventEmitter();
  @Input() isPItemplate;
  @Input() PIServerError;
  @Input() set billingInformation(value) {
    if (value && value !== undefined) {
      this.billingDetails = value;
      this._billService.setDatainService(this.billingDetails);
      this._utilService.hidingSkeleton('.permissionSkeleton');
      this.setFrequencies();
      this.initializeEditForm();
      this.updateFormViewMode();
    }
  }
  inUseOfferingsData;
  inUseOfferingsLocation;
  disableProrate: boolean = false;
  regularIntervals: any;
  proRateIntervals: any;

  constructor(private _translationService: TranslationService,
    private _utilityService: UtilityService,
    private _billService: PiBillingService,
    private _utilService: utilService,
    private _priceableItmeDetailsService: priceableItemDetailsService,
    private _piTemplateDetailsService: PiTemplateDetailsService) {
    this.editTooltip = this._translationService.translate('TEXT_EDIT');
  }

  ngOnInit() { }
  ngOnDestroy() { }

  updateFormViewMode() {
    this.viewBillingForm = JSON.parse(JSON.stringify(this.billingForm));
    this.viewRecurringCycleOptions1 = JSON.parse(JSON.stringify(this.recurringCycleOptions1));
    this.viewRecurringCycleOptions2 = JSON.parse(JSON.stringify(this.recurringCycleOptions2));
    if (this.billingDetails['cycleTypeId'] == "BI_WEEKLY" && this.billingDetails['cycleMode'] == "FIXED") {
      this.isBiWeekly = true;
      for (let i = 0; i < this.billingDetails['biWeeklyIntervals'].length; i++) {
        if (this.billingDetails['biWeeklyIntervals'][i].startDayId === this.billingDetails.startDay) {
          this.biWeeklyInterval = this.billingDetails['biWeeklyIntervals'][i].dayInterval;

        }
      }
    } else if (this.billingDetails['cycleTypeId'] == "BI_WEEKLY" && this.billingDetails['cycleMode'] !== "FIXED") {
      this.isBiWeekly = true;
      this.biWeeklyInterval = 'TEXT_BI_WEEKLY';
    }
  }


  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === 27 && this._utilityService.isObject(this.piBillingEditPanel) &&
    !this._utilityService.isObject(document.getElementsByTagName('ecb-inuse-offerings-modal-dialog')[0])) {
      if (this.confirmDialog === 0 && this.piBillingEditPanel.visibleStatus) {
        this.cancelEditPanel();
      } else {
        this.confirmDialog = 0;
      }
    }
  }

  displayCoverHandler(pBillingEditPanel) {
    this.piBillingEditPanel = pBillingEditPanel;
    this.piBillingEditPanel.show();
    this.showCover = true;
    this.initializeEditForm();
    this.isBillingFormDirty = false;
    this._utilService.checkNgxSlideModal(true);
    setTimeout(() => {
      document.getElementById("initFocusBilling").focus();
    }, 300);
  }

  cancelEditPanel() {
    if (this.isBillingFormDirty) {
      this.confirmDialog = 1;
    } else {
      this.closeEditPanel();
    }
  }

  closeEditPanel() {
    this.piBillingEditPanel.hide();
    this.showCover = false;
    this._utilService.checkNgxSlideModal(false);
    this.isFormDirty.emit(false);
    this.isBillingFormDirty = false;
    this.modalDialogClose = false;
  }

  onModalDialogCloseCancel(event) {
    this.confirmDialog = 0;
    if (event.index === -1 && this.isBillingFormDirty && this.showCover) {
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

  initializeEditForm() {
    const billData = JSON.parse(JSON.stringify(this.billingDetails));
    this.billingForm = {
      'advance': billData.advance,
      'prorateOnActivate': billData.prorateOnActivate,
      'prorateOnDeactivate': billData.prorateOnDeactivate,
      'fixedProrationLength': billData.fixedProrationLength,
      'chargePerParticipant': billData.chargePerParticipant,
      'recCycle': {},
      'chargeFrequency1': {},
      'chargeFrequency2': {}
    };
    this.setRecurringOptions(billData);
    this.showErrorMessage = undefined;
    this.isSaveEnabled = false;
  }

  setRecurringOptions(billData) {
    this.setPersistedDropdownValue(billData, this.recurringCycles['periods'], 'recCycle');
    if (this._utilityService.isEmpty(this.billingForm['recCycle'])) {
      this.billingForm['parent'] = this._billService.getFixedCycle();
      this.setPersistedDropdownValue(billData, this.recurringCycles['intervals'], 'recCycle');
    }
    const recycle = this.billingForm['recCycle'];
    if (!this._utilityService.isEmpty(recycle)) {
      this.selectOption(null, 'recCycle', recycle);
    }
    if (this.getRechargePeriodChildCount(this.billingForm['recCycle']) >= 1) {
      this.setPersistedDropdownValue(billData, this.recurringCycleOptions1, 'chargeFrequency1');
      const chargeFrequency1 = this.billingForm['chargeFrequency1'];
      this.selectOption(this.recurringCycleOptions1, 'chargeFrequency1', this.billingForm['chargeFrequency1']);

      if (this.billingDetails['cycleTypeId']=="BI_WEEKLY") {
        this.billingForm.chargeFrequency1['text'] = this.biWeeklyInterval;
      }
    }
    if (this.getRechargePeriodChildCount(this.billingForm['recCycle']) >= 2) {
      this.setPersistedDropdownValue(billData, this.recurringCycleOptions2, 'chargeFrequency2');
      const chargeFrequency2 = this.billingForm['chargeFrequency2'];
      this.selectOption(this.recurringCycleOptions2, 'chargeFrequency2', chargeFrequency2);
    }
  }

  getSelctedValue(options, selectedKey) {
    let option = undefined;
    if (options !== undefined) {
      for (const index in options) {
        if (index !== undefined) {
          if (options[index]['key'] + '' === selectedKey + '') {
            option = options[index];
          }
        }
      }
    }
    return option;
  }

  setPersistedDropdownValue(billData, sourceJson, formAttr) {
    const optionAttr = sourceJson['attr'];
    if (optionAttr !== undefined) {
      const sourceValue = sourceJson['value'];
      this.billingForm[formAttr] = this.getSelctedValue(sourceValue, billData[optionAttr]);
    } else {
      const sourceValue = sourceJson['value'];
      if (sourceValue !== undefined) {
        sourceJson = sourceValue;
      }
      for (const key in sourceJson) {
        if (key !== undefined) {
          const option = sourceJson[key];
          if (billData[option.attr] + '' === option.key + '') {
            this.billingForm[formAttr] = option;
          }
        }
      }
    }
  }

  toggleRCOptionsOnProrateEdit() {
    setTimeout(() => {
      if (this.billingForm['prorateOnActivate'] || this.billingForm['prorateOnDeactivate']) {
        this.recurringCycles['intervals'] = JSON.parse(JSON.stringify(this.proRateIntervals));
        if (this.billingForm.recCycle['attr'] === "cycleMode") {
          this.recurringCycleOptions1['value'] = JSON.parse(JSON.stringify(this.proRateIntervals));
        }
      } else if (this.billingForm.recCycle['attr'] === "cycleMode") {
        this.recurringCycles['intervals'] = JSON.parse(JSON.stringify(this.regularIntervals));
        this.recurringCycleOptions1['value'] = JSON.parse(JSON.stringify(this.regularIntervals));
      } else {
        this.recurringCycles['intervals'] = JSON.parse(JSON.stringify(this.regularIntervals));
      }
    }, 100);
  }

  onOptionSelection(field, value) {
    this.toggleRCOptionsOnProrateEdit();
    this.billingForm[field] = value;
    this.isBillingFormDirty = true;
    this.isValidForm();
    this.isFormDirty.emit(true);
  }

  selectOption(source, attrType, selectedValue) {
    this.toggleRCOptionsOnProrateEdit();
    this.isBillingFormDirty = true;
    const sourceObj = JSON.parse(JSON.stringify(source));
    let type = JSON.parse(JSON.stringify(attrType));
    if (type === 'intervals' || type === 'periods') {
      this.billingForm['parent'] = {};
      if (type === 'intervals') {
        this.billingForm['parent'] = this._billService.getFixedCycle();
      }
      type = 'recCycle';
    }
    if (selectedValue['attr'] !== undefined) {
      this.billingForm[type] = selectedValue;
    } else {
      sourceObj['key'] = selectedValue['key'];
      sourceObj['text'] = selectedValue['text'];
      this.billingForm[type] = sourceObj;
    }
    if (selectedValue['key'] === 'DAILY') {
      this.billingForm['prorateOnActivate'] = false;
      this.billingForm['prorateOnDeactivate'] = false;
      this.billingForm['fixedProrationLength'] = false;
      this.disableProrate = true;
    } else {
      this.disableProrate = false;
    }
    if (type === 'recCycle') {
      this.billingForm['chargeFrequency1'] = {};
      this.billingForm['chargeFrequency2'] = {};
      this.recurringCycleOptions1 = this.getRecCycleData(0);
      this.recurringCycleOptions2 = this.getRecCycleData(1);
    } else if (type === 'chargeFrequency1') {
      this.billingForm['chargeFrequency2'] = {};
      this.recurringCycleOptions2 = this.getRecCycleData(1);
    }
    this.setDefaultValues();
    this.isValidForm();
  }

  setFrequencies() {
    const cycles = {
      periods: this._billService.getRecCycles(),
      intervals: this._billService.getInterVals()
    };
    this.recurringCycles = JSON.parse(JSON.stringify(cycles));
    this.regularIntervals = this._billService.getInterVals();
    const tempObj = JSON.parse(JSON.stringify(this.regularIntervals));
    let testData = Object.keys(tempObj).filter((item) => {
      return tempObj[item]['key'] === 'DAILY';
    });
    delete tempObj[testData[0]];
    this.proRateIntervals = JSON.parse(JSON.stringify(tempObj));
  };

  isRchargePeriodSelected(recycle) {
    return !this._utilityService.isEmpty(recycle);
  }

  getRechargePeriodChildCount(recycle) {
    return this.isRchargePeriodSelected(recycle) ? Object.keys(recycle.child).length : 0;
  }

  getRecCycleData(index) {
    if (!this.isRchargePeriodSelected(this.billingForm['recCycle'])) {
      return {
        0: {
          'text': '',
          'key': ''
        }
      };
    }
    const option = this.billingForm['recCycle'].child[index];
    if (option !== undefined && option['type'] !== undefined) {
      option.value = {};
      if (option.type.indexOf('daysInMonth') >= 0) {
        const chargeFrequency1 = this.billingForm['chargeFrequency1']['key'];
        const monthIndex = index == 1 && option.type.indexOf('depend') >= 0 && chargeFrequency1 !== undefined ? chargeFrequency1 : 1;
        for (let i = 1; i <= this._utilityService.getDaysInMonth(monthIndex, new Date().getFullYear); i++) {
          option.value[Object.keys(option.value).length] = {
            'text': i,
            'key': i
          };
        }
      } else {
        option.value = {
          0: {
            'text': '',
            'key': ''
          }
        };
      }
    }
    return option !== undefined ? JSON.parse(JSON.stringify(option)) : {};
  }

  openInUseOfferings() {
    this.showInUseOfferings = true;
    this.inUseOfferingsData = this.billingDetails;
    this.inUseOfferingsLocation = 'priceableItemTemplateDetails';
  }

  onEnterSaveBillingData (event) {
    if (event.keyCode === 13 && !event.shiftKey && this.isSaveEnabled) {
      this.saveBillingData();
  }
  }

  saveBillingData() {
    this.isBiWeekly = false;
    this.billingInfoSaving = true;
    const widgetData = {};
    widgetData['body'] = this.prepareData(this.billingForm);
    widgetData['isPitemplate'] = this.isPItemplate ? true : false;
    widgetData['fields'] = '?fields=' + this.updateFields.join(', ');
    this.isSaveEnabled = false;
    this._priceableItmeDetailsService.updatePriceableItem({
      data: widgetData,
      success: (result) => {
        this.billingDetails = result;
        this.closeEditPanel();
        if(this.isPItemplate) {
          this.isPITemplateUpdated.emit('PIBilling');
        }
        this.isPItemplate ? (this._piTemplateDetailsService.changeIsPItemplateDetailsUpdated(true)) :
          (this._priceableItmeDetailsService.changeIsPriceableItemUpdated(true));
      },
      failure : (errorMsg: string,code: any, error: any) => {
        this.isSaveEnabled = true;
        this.showErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'EDIT');
        this.isFormDirty.emit(false);
      },
      onComplete: () => {
        this.billingInfoSaving = false;
        this.isFormDirty.emit(false);
      }
    });
  }

  prepareData(billingForm) {
    const billData = JSON.parse(JSON.stringify(this.billingDetails));
    const fixedCycles = this._billService.FIXEDCYCLEKEYS;
    for (const key in fixedCycles) {
      if (key !== undefined) {
        billData[fixedCycles[key]] = null;
      }
    }
    this.updateFields = ['advance', 'prorateOnActivate', 'prorateOnDeactivate', 'fixedProrationLength', 'chargePerParticipant'];
    this.updateFields.forEach(field => {
      billData[field] = billingForm[field];
    });
    const fixedCycle = this.billingForm['parent'];
    const recycle = this.billingForm['recCycle'];
    const chargeFrequency1 = this.billingForm['chargeFrequency1'];
    const chargeFrequency2 = this.billingForm['chargeFrequency2'];

    if (!this._utilityService.isEmpty(fixedCycle)) {
      billData[fixedCycle.attr] = fixedCycle.key;
      this.updateFields.push(fixedCycle.attr);
      billData[this._billService.USAGECYCLEID] = this._billService.getUsageCycle()[recycle.key];
      this.updateFields.push(this._billService.USAGECYCLEID);
    }
    if (!this._utilityService.isEmpty(recycle)) {
      billData[recycle.attr] = recycle.key;
      this.updateFields.push(recycle.attr);
    }
    if (!this._utilityService.isEmpty(chargeFrequency1)) {
      billData[chargeFrequency1.attr] = chargeFrequency1['key'];
      if (chargeFrequency1.attr === 'startDay') {
        let str = chargeFrequency1.text.trim().split("/").join("-");
        str = str.split("-", 3);
        billData.startDay = str[1];
        billData.startMonth = str[0];
        billData.startYear = str[2];

      }
      else this.updateFields.push(chargeFrequency1.attr);
      this.updateFields.push(chargeFrequency1.attr);
    }
    if (!this._utilityService.isEmpty(chargeFrequency2)) {
      billData[chargeFrequency2.attr] = chargeFrequency2['key'];
      this.updateFields.push(chargeFrequency2.attr);
    }
    return billData;
  }

  isValidForm() {
    const recycle = this.billingForm['recCycle'];
    const chargeFrequency1 = this.billingForm['chargeFrequency1'];
    const chargeFrequency2 = this.billingForm['chargeFrequency2'];
    this.isFormValidationError = false;
    if (!this._utilityService.isEmpty(chargeFrequency1) && !this._utilityService.isEmpty(chargeFrequency2)) {
      if (recycle['key'] === this._billService.SEMIMONTHLY && chargeFrequency2['key'] <= chargeFrequency1['key']) {
        this.isFormValidationError = true;
        this.billingForm['chargeFrequency2'] = {};
      }
    }
    let isValid = true;
    if (!this.isRchargePeriodSelected(recycle)) {
      isValid = false;
    }
    if (this.getRechargePeriodChildCount(recycle) > 0 && this._utilityService.isEmpty(this.billingForm['chargeFrequency1'])) {
      isValid = false;
    }
    if (this.getRechargePeriodChildCount(recycle) > 1 && this._utilityService.isEmpty(this.billingForm['chargeFrequency2'])) {
      isValid = false;
    }
    this.isSaveEnabled = isValid;
  }

  setDefaultValues() {
    const recycle = this.billingForm['recCycle'];
    const chargeFrequency1 = this.billingForm['chargeFrequency1'];
    const chargeFrequency2 = this.billingForm['chargeFrequency2'];
    if (!this.isRchargePeriodSelected(recycle)) {
      this.selectOption(null, 'periods', this.recurringCycles.periods['value'][0]);
    }
    if (this.getRechargePeriodChildCount(recycle) > 0 && this._utilityService.isEmpty(this.billingForm['chargeFrequency1'])
      && this.recurringCycleOptions1['value'] !== undefined) {
      this.selectOption(this.recurringCycleOptions1, 'chargeFrequency1', this.recurringCycleOptions1['value'][0]);
    }
    setTimeout(() => {
      if (this.getRechargePeriodChildCount(recycle) > 1 && this._utilityService.isEmpty(this.billingForm['chargeFrequency2'])
        && this.recurringCycleOptions2['value'] !== undefined) {
        this.selectOption(this.recurringCycleOptions2, 'chargeFrequency2', this.recurringCycleOptions2['value'][0]);
      }
    }, 100);
  }
 
  hideInUseModalDialog(e) {
    if (e) {
      this.showInUseOfferings = false;
    }
  }

  isTranslateText(value){
    return this._utilityService.isStaticString(value);
   }
}
