import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, HostListener, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { RatesService } from './rates.service';
import { ActivatedRoute } from '@angular/router';
import { utilService } from '../helpers/util.service';
import { UtilityService } from '../helpers/utility.service';
import { NgForm, FormsModule, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { modalService } from '../helpers/modal-dialog/modal.service';
import { Language, DefaultLocale, Currency, LocaleService, TranslationService } from 'angular-l10n';
import { sharedService } from '../productOffer/sharedService';
import { ISubscription } from "rxjs/Subscription";
import { CapabilityService } from '../helpers/capabilities.service';

@Component({
  selector: 'ecb-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.scss']
})
export class RatesComponent implements OnInit {

  @Language() lang: string;
  paramTables;
  showErrorMessage;
  rates;
  expandIndex;
  rateSchedules;
  ratesLoading:boolean;	  
  schedulesLoading:boolean;	
  schedulesOnLoading:boolean;	
  showRatesSkeleton:boolean;
  isRatesTableOnLoading : boolean = false;
  isEditRateSource: boolean = false;
  EditRate: FormGroup;
  rateDefault;
  showCover: boolean = false;
  isSaveEnabled: boolean = false;
  saveBtn: string = "ebBtn";
  paramtableId;
  isDropDownOpen;
  isICB;
  sharedPriceLists = [];
  selectedPriceList;
  persistSelectedPriceList;
  editRatesourceSubscription: ISubscription;
  saveRateSourceSubscription: ISubscription;
  priceListId;
  editableRate;
  httpErrorMessage;
  initialRate;
  finalRate;
  arrayTobeSent = [];
  expandedIndex;
  nonSharedPriceListId;
  isDropdownDisabled;
  productOffer;
  confirmDialog;
  editRateSourceComponent;
  onInitCount = false;
  ratesCapability: any = {};
  element: HTMLElement;
  properties: any;
  itemTemplateId;
  @ViewChild('editRateSource') editRateSource;

  @Input() set defaultRate(defaultRate) {
    if (defaultRate) {
      this.rateDefault = defaultRate.rates[0].pricelistName;
    }
  }

  constructor(private _ratesService: RatesService,
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _modalService: modalService,
    private _sharedService: sharedService,
    private _utilService: utilService,
    private _UtilityService: UtilityService,
    private _capabilityService: CapabilityService,
    private _translationService: TranslationService) {
    this.confirmDialog = 0;

    this._route.params.subscribe(params => {
      if (this.onInitCount) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this.onInitCount = true;
    this.expandIndex = 0;
    this.getRates(true);
    this.EditRate = this._formBuilder.group({
      rateSource: [],
      customRates: [],
    });
    if (localStorage.getItem('ProductOffer') != null) {
      this.nonSharedPriceListId = JSON.parse(localStorage.getItem('ProductOffer')).nonsharedPlId;
      this.productOffer = JSON.parse(localStorage.getItem('ProductOffer'));
    }
    this.ratesCapability = this._capabilityService.getWidgetCapabilities("UIPIDetailsPage");
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === 27 && this.editRateSource !== undefined) {
      if (this.confirmDialog === 0 && this.editRateSource.visibleStatus) {
        this.cancelCoverHandler(this.editRateSource, '');
      } else {
        this.confirmDialog = 0;
      }
    }
    if (this.isSaveEnabled && this.showCover) {
      if (event.keyCode === 13 && !event.shiftKey) {
        this.element = document.getElementById('saveRates') as HTMLElement;
        this.element.click();
      }
    }
  }
  isCapableOf(item) {
    return this.ratesCapability.hasOwnProperty(item) ? (this.ratesCapability[item] === null ? true : this.ratesCapability[item]) : true
  }

  processRateSource(rate) {
    this.EditRate = this._formBuilder.group({
      rateSource: [rate.pricelistName],
      customRates: [rate.canicb]
    });
  }

  isFormValid() {
    if (this.EditRate.dirty) {
      this.isSaveEnabled = true;
    }
  }

  getRates(isInitialValue) {
    if (!this.showRatesSkeleton) {	 
      this.ratesLoading = true;	
    }
    this._ratesService.getParamTables({
      data: {
        offerId: this._route.snapshot.params['productOfferId'],
        piInstanceId: this._route.snapshot.params['itemInstanceId'],
        param: {
          scheduleFirstIndex: false
        }
      },
      success: (result) => {
        this.processRates(result, isInitialValue);
      },
      failure: (error) => {
        this.handleError(error);
        this.ratesLoading = false;
      },
      onComplete: () => {
        this.setPricelistName(this.expandIndex);
        this.showRatesSkeleton = false;
        this.ratesLoading = false;
      }
    });
  }

  processRates(result, isInitialValue) {
    this._utilService.hidingSkeleton('.priceableItemsSkeleton');
    this.paramTables = result;
    this.rates = (this.paramTables).rates;
    this.rates.forEach((rate, index) => {
      this.expandIndex = this.rates.length - 1;
      if(rate.rateSchedules.length === 0) {	
        this.isRatesTableOnLoading = false;	
      }
      if (rate.rateSchedules && rate.rateSchedules.length > 0) {
        if (!this.priceListId) {
          this.priceListId = rate.pricelistId;
        }
        isInitialValue ? (this.expandIndex = index) : (this.expandIndex = this.expandedIndex);
        if ((index === this.expandedIndex) || isInitialValue) {
          this.rateSchedules = rate.rateSchedules;
        }
        this.processRateSource(rate);
      }
    });
    this.ratesLoading = false;
  }

  showSchedules(index, paramTableId, itemTemplateId, pricelistId, isInitialClick) {
    if (!isInitialClick) {
      this.expandedIndex = index;
      this.expandIndex = index === this.expandIndex && this.expandIndex !== -1 ? -1 : index;
    } else {
      this.expandIndex = this.expandedIndex;
    }
    if (this.expandIndex > -1) {
      this.getSchedules(paramTableId, itemTemplateId, pricelistId);
    }
    this.setPricelistName(index);
  }

  expandPanelBody(index) {
    return (index === this.expandIndex) ? 'in' : '';
  }

  setPricelistName(index) {
    if (this.rates !== undefined) {
      const rate = this.rates[index];
      if (rate.pricelistType === 'PO') {
        this.persistSelectedPriceList = this.local(rate);
      } else {
        this.persistSelectedPriceList = rate.pricelistName;
      }
    }
  }

  getSchedules(paramTableId, itemTemplateId, pricelistId) {
    if (!this.schedulesLoading) {	
      this.schedulesOnLoading = true;	
    } 
    this.rateSchedules = [];
    this.properties = [];
    this.priceListId = pricelistId;
    this._ratesService.getRateSchedules({
      data: {
        paramTableId: paramTableId,
        itemTemplateId: itemTemplateId,
        pricelistId: this.priceListId
      },
      success: (result) => {
        this.rateSchedules = result.rates[0].rateSchedules;
        this.properties = result.rates[0].properties;
        if(!this.isEditRateSource && this.rateSchedules.length >0) {	
          this.isRatesTableOnLoading = true;	
        }
      },
      failure: (error) => {
        this.handleError(error);
      },
      onComplete: () => {	
        this.schedulesLoading = false;	
        this.schedulesOnLoading = false;	
        this.isEditRateSource = false;	

       }
    });
  }


  private handleError(error: Response) {
  }

  cancelCoverHandler(editRateSource, value) {
    if (this.EditRate.dirty || this.isSaveEnabled) {
      this.confirmDialog = 1;
      this.editRateSourceComponent = editRateSource;
    } else {
      editRateSource.hide();
      this.showCover = false;
      this._utilService.checkNgxSlideModal(false);
    }
  }

  displayCoverHandler(editRateSource, rate, index) {
    this.paramtableId = rate.paramtableId;
    this.priceListId = rate.pricelistId;
    this.itemTemplateId = rate.itemTemplateId;
    this.editableRate = rate;
    (rate.pricelistType === 'REGULAR') ? (this.isICB = false) : (this.isICB = rate.canicb);
    editRateSource.show();
    this.showCover = true;
    this._utilService.checkNgxSlideModal(true);
    this.isSaveEnabled = false;
    this.showErrorMessage = false;
    this.initialRate = rate.pricelistName;
    this.expandedIndex = index;
    this.selectedPriceList = this.persistSelectedPriceList;
    this._ratesService.getRqrdPricelist({
      data: {
        itemTemplateId: this.itemTemplateId,
        paramtableId : this.paramtableId,
        itemtemplateid: "item-template-id",
        paramtableid: "paramtable-id"
      },
      success: (result) => {
        this.sharedPriceLists = result.records;
      },
      failure: (error) => {
        this.handleError(error);
      }
    });
  }

  saveRateSource(editRateSource) {
    this.isSaveEnabled = false;
    this.editRateSourceComponent = editRateSource;
    this.executeSaveOfRateSource(editRateSource);
  }

  executeSaveOfRateSource(editRateSource) {
    if (this.EditRate["_value"].customRates != null) {
      this.editableRate.canicb = this.EditRate["_value"].customRates;
    }
    delete this.editableRate.rateSchedules;
    delete this.editableRate.properties;
    this._ratesService.updatePricelistMappings({
      data: {
        body: this.editableRate
      },
      success: (result) => {
        editRateSource.hide();
        this.showRatesSkeleton = true;
        this.showCover = false;
        this._utilService.checkNgxSlideModal(false);
        this.getRates(false);
        this.schedulesLoading = true;	
        if (!this.isRatesTableOnLoading) {	
          this.isEditRateSource = true;	
        }
        this.showSchedules(this.expandIndex, result.paramtableId, result.itemTemplateId, result.pricelistId, true);
      },
      failure: (errorMsg:string,code:any,error:any) => {
        this.isSaveEnabled = true;
        this.showErrorMessage = true;
        this.httpErrorMessage = this._UtilityService.errorCheck(code,errorMsg,'EDIT');
      }
    });
  }

  customICB(rate) {
    this.editableRate = rate;
    this.isICB = true;
    this.selectedPriceList = "TEXT_CUSTOM_ICB_ONLY";
    this.isSaveEnabled = true;
    this.priceListId = this.nonSharedPriceListId;
    this.editableRate.pricelistId = this.priceListId;
    return this.selectedPriceList;
  }

  local(rate) {
    this.editableRate = rate;
    this.isSaveEnabled = true;
    this.isICB = false;
    this.selectedPriceList = "TEXT_LOCAL";
    this.priceListId = this.nonSharedPriceListId;
    this.editableRate.pricelistId = this.priceListId;
    return this.selectedPriceList;
  }
  handleRowSelect(sharedPriceList, rate) {
    this.editableRate = rate;
    this.selectedPriceList = sharedPriceList.name;
    this.priceListId = sharedPriceList.pricelistId;
    this.isICB = false;
    if (this.priceListId !== this.nonSharedPriceListId &&
      this._translationService.translate(this.persistSelectedPriceList) !== sharedPriceList.name) {
      this.finalRate = sharedPriceList.name;
      this.isSaveEnabled = true;
    }
    if (this.initialRate === sharedPriceList.name) {
      this.isSaveEnabled = false;
    }
    this.editableRate.pricelistId = this.priceListId;
  }

  onModalDialogCloseCancel(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this.editRateSourceComponent.hide();
      this.isSaveEnabled = false;
      this.showCover = false;
      this._utilService.checkNgxSlideModal(false);
      this.EditRate = this._formBuilder.group({
        customRates: [false]
      });
    }
  }

  onModalDialogCloseSave(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this.executeSaveOfRateSource(this.editRateSourceComponent);
    } else {
      this.isSaveEnabled = true;
    }
  }

  ngOnDestroy() {
    if (this.editRatesourceSubscription) {
      this.editRatesourceSubscription.unsubscribe();
    }
    if (this.saveRateSourceSubscription) {
      this.saveRateSourceSubscription.unsubscribe();
    }
  }
}
