import { Component, OnInit,Input, Output, EventEmitter,OnDestroy } from '@angular/core';
import { cardService}  from './priceableService';
import { utilService } from '../../../helpers/util.service';
import { ProductService } from '../../productOffer.service';
import { AddPriceableItemService } from '../add-priceable-items/add-priceable-items.service';
import { Language } from 'angular-l10n';
import { ActivatedRoute, Router } from '@angular/router';
import { CapabilityService } from '../../../helpers/capabilities.service';

@Component({
  selector: 'ecb-priceable-items',
  templateUrl: './priceable-items.component.html',
  styleUrls: ['./priceable-items.component.scss'],
  providers:[cardService],
  host: {
    '(document:click)': 'onClick($event)',
  }
})
export class PriceableItemsComponent implements OnInit,OnDestroy {
  cards: any;
  errorMessage: string;
  isEmpty: boolean = true;
  @Input() productOfferId: number;
  noPriceableItems: boolean = false;
  cardsArray;
  selectedPiList:any = [];
  disableAddPi: boolean = false;
  productOffersList: any;
  existingPis: any = [];
  showUsageError = false;
  showNonRecurringError = false;
  showRecurringError = false;
  showDiscountError = false;
  usageName: any = [];
  nonRecurringName: any = [];
  recurringName: any = [];
  discountName: any = [];
  addingFailedPi: any = [];
  child: any = [];
  piSubscriptions:any;
  @Input() isBundle: boolean;
  onInitCount = false;
  initializeAddPriceableItem: boolean;
  addPICapability: boolean;
  showLoader = false;
  showSkeleton = false;
  piListUpdated = false;
  piRemoved = false;
  @Language() lang: string;


  constructor(private _cardService : cardService,
              private _utilService: utilService,
              private _addPriceableItemService: AddPriceableItemService,
              private _productService: ProductService,
              private _route: ActivatedRoute,
              private _capabilityService: CapabilityService) {
      this._route.params.subscribe(params => {
        if (this.onInitCount) {
          this.ngOnInit();
        }
    });
              }

  ngOnInit( ) {
    this.onInitCount = true;
    this.getPIItems();
    this.piSubscriptions = this._utilService.callPiListAfterAddingNewPi.subscribe(value => {
      if (value) {
        this.piListUpdated = true;
        this.getPIItems();
      }
    });
    this.piSubscriptions = this._utilService.isPropertiesChange.subscribe(value => {
      if (value['isPO'] === true || value['isBundle'] === true) {
        this.getPIItems();
      }
    });
    this.addPICapability = this._capabilityService.findPropertyCapability('UIPoDetailsPage', 'POs_Add');
    const sendingFailedPiTypeSubscribe = this._addPriceableItemService.sendingFailedPiType.subscribe(value => {
      this.addingFailedPi = value;
      if (this.addingFailedPi.length > 0) {
        for (let i in this.addingFailedPi) {
          if (this.addingFailedPi[i].kind === 'Usage Charges') {
            this.showUsageError = true;
            this.usageName.push(this.addingFailedPi[i].displayName + ' ');
          }else if (this.addingFailedPi[i].kind === 'One Time Charges') {
            this.showNonRecurringError = true;
            this.nonRecurringName.push(this.addingFailedPi[i].displayName + ' ');
          }else if (this.addingFailedPi[i].kind === 'Recurring Charges' || this.addingFailedPi[i].kind === 'Unit Dependent Charges') {
            this.showRecurringError = true;
            this.recurringName.push(this.addingFailedPi[i].displayName + ' ');
          }else if (this.addingFailedPi[i].kind === 'Discount') {
            this.showDiscountError = true;
            this.discountName.push(this.addingFailedPi[i].displayName + ' ');
          }
        }
      }
    });
    this.piSubscriptions.add(sendingFailedPiTypeSubscribe);

    const selectedPiToBeAddedSubscribe = this._utilService.selectedPiToBeAdded.subscribe(value => {
         if (value) {
           this.selectedPiList = value;
           for (let i in this.selectedPiList) {
             if (this.selectedPiList[i].kind === "USAGE") {
                this.cardsArray['USAGE'].push(this.selectedPiList[i]);
             }else if (this.selectedPiList[i].kind === "NON_RECURRING"){
               this.cardsArray['NON_RECURRING'].push(this.selectedPiList[i]);
             }else if (this.selectedPiList[i].kind === "RECURRING"){
                this.cardsArray['RECURRING'].push(this.selectedPiList[i]);
             }else if (this.selectedPiList[i].kind === "UNIT_DEPENDENT_RECURRING") {
                this.cardsArray['UNIT_DEPENDENT_RECURRING'].push(this.selectedPiList[i]);
             }
           }
         }
     });
     this.piSubscriptions.add(selectedPiToBeAddedSubscribe);
    const selectedPoCheckPiSubscribe = this._productService.selectedPoCheckPi.subscribe(selectedPoData => {
      if(Object.keys(selectedPoData).length > 0){
        this.selectedProductOffer(selectedPoData);
      }
    });
    this.piSubscriptions.add(selectedPoCheckPiSubscribe);

    const addPriceableItemToPO = this._utilService.addPriceableItemToPO.subscribe(value => {
         if (!value) {
           this.initializeAddPriceableItem = false;
         }
     });
     this.piSubscriptions.add(addPriceableItemToPO);
    }

  getPIItems() {
    let timer;
    this.noPriceableItems = false;
    if (!this.piRemoved) {
      this.piListUpdated === true ? this.showSkeleton = true : this.showLoader = true;
    }
    if (this.productOfferId !== (undefined && null)) {
        this._cardService.getCardinfo({
          data : {
            offerId : this.productOfferId
          },
          success : (result) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
              this.cards = result;
              this.hideSkeleton();
              this.cardsArray = this.cards.pricelistMappingVO;
              if (this.cardsArray !== null && this.cardsArray !== undefined) {
                this.noPriceableItems = (this.cardsArray.USAGE !== (undefined && null) ||
                                          this.cardsArray.NON_RECURRING !== (undefined && null) ||
                                          this.cardsArray.RECURRING !== (undefined && null) ||
                                          this.cardsArray.DISCOUNT !== (undefined && null) ||
                                          this.cardsArray.UNIT_DEPENDENT_RECURRING !== (undefined && null)) ? false : true;

              } else {
                this.noPriceableItems = true;
              }
            }, 300);
          },
          failure : (error) => {
            this.hideSkeleton();
            this.errorMessage = error;
          },
          onComplete : () => {
            setTimeout(() => {
              this.piListUpdated = false;
              this.showSkeleton = false;
              this.showLoader = false;
              this.piRemoved = false;
            }, 200);
          }
        });
      }
}

  selectedProductOffer(productList) {
  this.productOffersList = productList;
    if(this.productOffersList['addRemovePoPi'] == false){
        this._utilService.changeCheckToAddOrDeletePI(false);
        this.disableAddPi = false;
        }else {
        this._utilService.changeCheckToAddOrDeletePI(true);
        this.disableAddPi = true;
      }
}

  openAddPriceableItem() {
    this.initializeAddPriceableItem = true;
    this.usageName = [];
    this.nonRecurringName = [];
    this.recurringName = [];
    this.discountName = [];
    this.closeaddErrors();
  }


  removeUsage() {
    this.showUsageError = false;
  }

  removeRecurring() {
    this.showRecurringError = false;
  }

  removeNonRecurring() {
  this.showNonRecurringError = false;
  }

  removeDiscount() {
  this.showDiscountError = false;
  }

  closeaddErrors() {
    this.removeUsage();
    this.removeRecurring();
    this.removeNonRecurring();
    this.removeDiscount();
  }

  onClick(event) {
    this.showUsageError = false;
    this.showDiscountError = false;
    this.showRecurringError = false;
    this.showNonRecurringError = false;
  }
 
  ngOnDestroy() {
    if (this.piSubscriptions) {
      this.piSubscriptions.unsubscribe();
    }
  }
  hideSkeleton() {
    setTimeout(() => {
      this._utilService.hidingSkeleton('.priceableItemsSkeleton');
    }, 1000);
  }

  updatePIItems(value) {
    this.piRemoved = true;
    this.getPIItems();
  }
}
