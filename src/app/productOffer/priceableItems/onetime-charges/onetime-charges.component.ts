import { Component, OnInit, Input, Output, EventEmitter,  OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { cardService} from '../priceable-items/priceableService';
import { utilService } from '../../../helpers/util.service';
import { UtilityService } from '../../../helpers/utility.service';
import { CapabilityService } from '../../../helpers/capabilities.service';

@Component({
  selector: 'ecb-onetime-charges',
  templateUrl: './onetime-charges.component.html',
  styleUrls: ['./onetime-charges.component.scss']
})
export class OnetimeChargesComponent implements OnInit,OnDestroy {
  oneTimeChargeCardsType:any;
  itemInstanceId:any;
  @Input() set oneTimeChargeCards(oneTimeChargeCardsType){
    if (this._utilityService.isObject(oneTimeChargeCardsType)) {
      this.oneTimeChargeCardsType = oneTimeChargeCardsType;
    } else {
      this.oneTimeChargeCardsType = [];
    }
  }
  @Input() productOfferId:number;
  @Input() PIType:string;
  @Output() isCardDeleted = new EventEmitter();
  removePIInstance:boolean = false;
  disableDeletePi:boolean = false;
  removePIInstanceID;
  isDeletePOError:boolean = false;
  deletePOError: string = '';
  height:any;
  cards;
  PiInstanceChildShow:boolean=false;
  oneTimeChargesSubscriptions:any;
  bodyHeight;
  piInstanceUnderDeletion = [];
  removePICapability = true;
  showSkeleton = false;

 constructor(private _router: Router,
             private _cardService: cardService,
             private _utilService: utilService,
            private _utilityService: UtilityService,
            private _capabilityService: CapabilityService) { }

  ngOnInit() {
    this.oneTimeChargesSubscriptions = this._utilService.checkToAddOrDeletePI.subscribe(value => {
      this.disableDeletePi = value;
    });
    this.removePICapability = this._capabilityService.findPropertyCapability('UIPoDetailsPage', 'PIs_Add');
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
    this._router.navigate(['/ProductCatalog/PriceableItem/', productOfferId, PIObj.itemInstanceId, PIType]);
  }
  removePIInstanceIcon(itemInstanceId, index) {
    this.removePIInstanceID = itemInstanceId;
    this.height = document.getElementById('cardTotalHeightNRC-' + index).clientHeight;
    this.bodyHeight = document.getElementById('cardBodyNRC-' + index).clientHeight;
  }
  cancelPIInstanceCard() {
    this.removePIInstanceID = -1;
  }
  removePIInstanceCard(itemInstanceId) {
    this.showSkeleton = true;
    this.piInstanceUnderDeletion.push(itemInstanceId);
    this._cardService.removePICard({
      data : {
        offerId :  this.productOfferId,
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
      onComplete : () => {
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
    if (this.oneTimeChargesSubscriptions) {
      this.oneTimeChargesSubscriptions.unsubscribe();
    }
    this.piInstanceUnderDeletion = [];
  }
}
