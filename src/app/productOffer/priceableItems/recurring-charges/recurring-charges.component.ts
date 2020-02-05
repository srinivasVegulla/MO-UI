import { Component, OnInit,Input, Output, EventEmitter,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { cardService}  from '../priceable-items/priceableService';
import { utilService } from '../../../helpers/util.service';
import { UtilityService } from 'app/helpers/utility.service';
import { CapabilityService } from '../../../helpers/capabilities.service';

@Component({
  selector: 'ecb-recurring-charges',
  templateUrl: './recurring-charges.component.html',
  styleUrls: ['./recurring-charges.component.scss']
})
export class RecurringChargesComponent implements OnInit, OnDestroy {
  dataRC = [];
  dataUDRC = [];
  recurringChargeCardsData = [];
  disableDeletePi:boolean = false;
  height:any;
  deleteIconClicked:boolean = false;
  recurringChargesSubscriptions:any;
  removePICapability: boolean;
  @Input() set recurringChargeCards(pricelistMappingVO){
      if (this._utilityService.isObject(pricelistMappingVO)) {
      this.dataRC = pricelistMappingVO.RECURRING;
      this.dataUDRC = pricelistMappingVO.UNIT_DEPENDENT_RECURRING;
      if (this.dataRC && this.dataUDRC) {
        this.recurringChargeCardsData = this.dataRC.concat(this.dataUDRC);
      } else if (this.dataRC) {
          this.recurringChargeCardsData = this.dataRC;
      } else if (this.dataUDRC) {
          this.recurringChargeCardsData = this.dataUDRC;
      } else if (((this.dataUDRC && this.dataRC ) === null) || ((this.dataUDRC && this.dataRC ) === undefined)){
        this.recurringChargeCardsData = [] ;
      }
    }
  }

  @Input() productOfferId:number;
  @Input() PIType:string;
  @Output() isCardDeleted = new EventEmitter();
  removePIInstanceID;
  dataRCArray=[];
  isDeletePOError: boolean = false;
  deletePOError: string = '';
  ecbClickableCard: any;
  cards;
  cardsArray;
  PiInstanceChildShow: boolean = false;
  bodyHeight;
  piInstanceUnderDeletion = [];
  showSkeleton = false;

  constructor(private _router: Router,
              private _cardService: cardService,
              private _utilService: utilService,
            private _utilityService: UtilityService,
            private _capabilityService: CapabilityService) {}

  ngOnInit() {
    this.recurringChargesSubscriptions = this._utilService.checkToAddOrDeletePI.subscribe(value => {
        this.disableDeletePi = value;
    });
    this.removePICapability = this._capabilityService.findPropertyCapability('UIPoDetailsPage',
      'PIs_Add');
  }
  redirectToPIDetailsPage(productOfferId, PIObj,PIType){
    this._utilService.changeBreadCrumbApplicationLevelEvents({
      offerId: productOfferId,
      path: '/ProductCatalog/PriceableItem/' + productOfferId + "/" + PIObj.itemInstanceId + "/" + PIType,
      POObj: {},
      PIObj: PIObj,
      CPIObj: {},
      Level: 'PI',
      PIType: PIType
    });
    this._router.navigate(['/ProductCatalog/PriceableItem/', productOfferId,PIObj.itemInstanceId, PIType]);
  }
  removePIInstanceIcon(itemInstanceId, index) {
    this.removePIInstanceID = itemInstanceId;
    this.height = document.getElementById('cardTotalHeightRC-' + index).clientHeight;
    this.bodyHeight = document.getElementById('cardBodyRC-' + index).clientHeight;
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
  deleteErrorMessage(itemInstanceId) {
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
    if (this.recurringChargesSubscriptions) {
      this.recurringChargesSubscriptions.unsubscribe();
    }
    this.piInstanceUnderDeletion = [];
  }
}
