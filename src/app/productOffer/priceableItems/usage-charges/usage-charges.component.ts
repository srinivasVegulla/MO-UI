import { Component, OnInit,Input, Output, EventEmitter,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { cardService} from '../priceable-items/priceableService';
import { utilService } from '../../../helpers/util.service';
import { UtilityService } from '../../../helpers/utility.service';
import { CapabilityService } from '../../../helpers/capabilities.service';



@Component({
  selector: 'ecb-usage-charges',
  templateUrl: './usage-charges.component.html',
  styleUrls: ['./usage-charges.component.scss']
})
export class UsageChargesComponent implements OnInit,OnDestroy {
  usageChargeCardsType = [];
  childs=[];
  showChildTitle;
  @Input() set usageChargeCards(usageChargeCardsType){
    if (this._utilityService.isObject(usageChargeCardsType)) {
     this.usageChargeCardsType = usageChargeCardsType;
    } else {
      this.usageChargeCardsType = [];
    }
  }
  @Input() productOfferId: number;
  @Input() PIType: string;
  @Output() isCardDeleted = new EventEmitter();
  removePIInstance: boolean;
  disableDeletePi: boolean;
  removePIInstanceID;
  usageChargeArray = [];
  isDeletePOError: boolean;
  deletePOError: String = '';
  height: any;
  cards;
  usageChargesSubscriptions: any;
  child = 'Child';
  bodyHeight;
  piInstanceUnderDeletion = [];
  removePICapability = true;
  showSkeleton = false;

  constructor(private _router: Router,private _cardService: cardService,
              private _utilService: utilService,
            private _utilityService: UtilityService,
            private _capabilityService: CapabilityService) { }

  ngOnInit() {
    this.usageChargesSubscriptions = this._utilService.checkToAddOrDeletePI.subscribe(value => {
        this.disableDeletePi = value;
    });
    this.removePICapability = this._capabilityService.findPropertyCapability('UIPoDetailsPage', 'PIs_Add');
  }
  redirectToPIDetailsPage(productOfferId, PIObj, PIType) {
    this._utilService.changeBreadCrumbApplicationLevelEvents({
      offerId: productOfferId,
      path: '/ProductCatalog/PriceableItem/' + productOfferId + '/' + PIObj.itemInstanceId + '/' + PIType,
      POObj: {},
      PIObj: PIObj,
      CPIObj: {},
      Level: 'PI',
      PIType: PIType
    });
    this._router.navigate(['/ProductCatalog/PriceableItem/', productOfferId, PIObj.itemInstanceId, PIType]);
    localStorage.setItem('PIChildItem', JSON.stringify({parent: true, child: false}));
    this._utilService.changePiInstanceChildShow({parent: true, child: false});
  }
  redirectToPIChildDetailsPage(productOfferId, CPIObj, PIType, PIObj){
    this._utilService.changeBreadCrumbApplicationLevelEvents({
      offerId: productOfferId,
      path: '/ProductCatalog/PriceableItem/' + productOfferId + '/' + CPIObj.itemInstanceId + '/' + PIType + '/' + this.child,
      POObj: {},
      PIObj: PIObj,
      CPIObj: CPIObj,
      Level: 'CHILD_PI',
      PIType: PIType
    });
    this._router.navigate(['/ProductCatalog/PriceableItem/', productOfferId, CPIObj.itemInstanceId, PIType, this.child]);
    localStorage.setItem('PIChildItem', JSON.stringify({parent: false, child: true}));
    this._utilService.changePiInstanceChildShow({parent: false, child: true});
  }

  removePIInstanceCard(itemInstanceId) {
    this.showSkeleton = true;
    this.piInstanceUnderDeletion.push(itemInstanceId);
    this._cardService.removePICard({
      data : {
        offerId : this.productOfferId ,
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
  removePIInstanceIcon(itemInstanceId, index) {
    this.removePIInstanceID = itemInstanceId;
    this.height = document.getElementById('cardTotalHeightUsage-' + index).clientHeight;
    this.bodyHeight = document.getElementById('cardBodyUsage-' + index).clientHeight;
  }
  cancelPIInstanceCard() {
    this.removePIInstanceID = -1;
  }
  showChildTitleName(info) {
    this.showChildTitle = false;
    if (info.childs !== null && info.childs.length > 0) {
      for (const child of info.childs) {
        if (child.paramtableId == null) {
          this.showChildTitle = true;
          break;
        }
      }
    }
   return this.showChildTitle;
  }
  showConfirmationDialogue(itemInstanceId) {
    return ((this.removePIInstanceID === itemInstanceId) && (this.piInstanceUnderDeletion.indexOf(itemInstanceId) <= -1));
  }
  showPiCard(itemInstanceId) {
    return ((this.removePIInstanceID !== itemInstanceId) && (this.piInstanceUnderDeletion.indexOf(itemInstanceId) <= -1));
  }
  ngOnDestroy() {
    if (this.usageChargesSubscriptions) {
      this.usageChargesSubscriptions.unsubscribe();
    }
    this.piInstanceUnderDeletion = [];
  }
}
