import { Component, OnInit,Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { utilService } from '../../../helpers/util.service';
import { cardService}  from '../priceable-items/priceableService';
import { UtilityService } from '../../../helpers/utility.service';
import { CapabilityService } from '../../../helpers/capabilities.service';

@Component({
  selector: 'ecb-discount-charges',
  templateUrl: './discount-charges.component.html',
  styleUrls: ['./discount-charges.component.scss']
})
export class DiscountChargesComponent implements OnInit, OnDestroy {
  discountChargeCardstype: any;
  @Input() set discountChargeCards(discountChargeCardsType){
    if (this._utilityService.isObject(discountChargeCardsType)) {
      this.discountChargeCardstype = discountChargeCardsType;
    } else {
      this.discountChargeCardstype = [];
    }
  }
  @Input() productOfferId: number;
  @Input() PIType: string;
  @Input() selectedProductOffer: any;
  @Output() isCardDeleted = new EventEmitter();
  PiInstanceChildShow: boolean;
  disableDeletePi: boolean;
  discountCharges: any;
  itemInstanceId: any;
  removePIInstanceID;
  isDeletePOError: boolean ;
  deletePOError: string = '';
  height: any;
  cards;
  discountSubscriptions:any;
  bodyHeight;
  piInstanceUnderDeletion = [];
  removePICapability = true;
  showSkeleton = false;

  constructor(private _router: Router,
              private _utilService: utilService,
              private _cardService: cardService,
              private _utilityService: UtilityService,
              private _capabilityService: CapabilityService) { }

  ngOnInit() {
     this.discountSubscriptions = this._utilService.checkToAddOrDeletePI.subscribe(value => {
        this.disableDeletePi = value;
    });
    this.removePICapability = this._capabilityService.findPropertyCapability('UIPoDetailsPage', 'PIs_Add');
  }

  redirectToPIDetailsPage(productOfferId, PIObj, PIType) {
    this._router.navigate( ['/ProductCatalog/PriceableItem/', productOfferId, PIObj.itemInstanceId, PIType]);
    this._utilService.changeBreadCrumbApplicationLevelEvents({ 
      offerId: productOfferId,
      path: '/ProductCatalog/PriceableItem/' + productOfferId + "/" + PIObj.itemInstanceId + "/" + PIType, 
      POObj: {},
      PIObj: PIObj,
      CPIObj: {},
      Level: 'PI',
      PIType: PIType
    });
  }

  removePIInstanceIcon(itemInstanceId, index) {
    this.removePIInstanceID = itemInstanceId;
    this.height = document.getElementById('cardTotalHeightDiscount-' + index).clientHeight;
    this.bodyHeight = document.getElementById('cardBodyDiscount-' + index).clientHeight;
  }

  cancelPIInstanceCard() {
    this.removePIInstanceID = -1;
  }
  removePIInstanceCard(itemInstanceId) {
    this.showSkeleton = true;
    this.piInstanceUnderDeletion.push(itemInstanceId);
    this._cardService.removePICard({
      data : {
        offerId : this.productOfferId,
        piInstanceId : itemInstanceId
      },
      success : (result) => {
        this.isCardDeleted.emit(true);
      },
      failure : (errorMsg: string, code: any) => {
        let removeError = this._utilityService.errorCheck(code, errorMsg, 'REMOVE');
        this.handleErrorPIInstanceID(removeError);
        const index = this.piInstanceUnderDeletion.indexOf(itemInstanceId);
        if (index > -1) {
          this.piInstanceUnderDeletion.splice(index, 1);
        }
      },
      onComplete: () => {
        this.showSkeleton = false;
      }
    });
  }
  handleErrorPIInstanceID(error) {
    this.deletePOError = error;
    this.isDeletePOError = true;
  }
  deleteErrorMessage() {
    this.isDeletePOError = false;
    this.removePIInstanceID = -1;
  }
  showConfirmationDialogue(itemInstanceId) {
    return ((this.removePIInstanceID === itemInstanceId) && (this.piInstanceUnderDeletion.indexOf(itemInstanceId) <= -1));
  }
  showPiCard(itemInstanceId) {
    return ((this.removePIInstanceID !== itemInstanceId) && (this.piInstanceUnderDeletion.indexOf(itemInstanceId) <= -1));
  }
  ngOnDestroy() {
    if (this.discountSubscriptions) {
      this.discountSubscriptions.unsubscribe();
    }
    this.piInstanceUnderDeletion = [];
  }
}
