import { DropdownModule, SelectItem, AutoComplete } from 'primeng/primeng';
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ProductOfferInBundleService } from './productOfferInBundle.service';
import { utilService } from '../helpers/util.service';
import { Language, DefaultLocale, Currency, LocaleService } from 'angular-l10n';
import { ActivatedRoute, Router } from '@angular/router';
import { BundleService } from '../bundle/bundle.service';
import { CapabilityService } from '../helpers/capabilities.service';
import { UtilityService } from '../helpers/utility.service';

@Component({
  selector: 'ecb-productofferinbundle',
  templateUrl: './productOfferInBundle.component.html',
  styleUrls: ['./productOfferInBundle.component.scss'],
  providers:[ProductOfferInBundleService]
 })
  export class ProductOfferInBundleComponent implements OnInit,OnDestroy {
    productOfferCards: any = [];
    bundleId: number;
    @Input() selectedBundleData: any;
    removePOInstanceID;
    height: any;
    disableAddPo: boolean = false;
    bundleList: any;
    noProductOffers: boolean = false;
    productOfferCardsLength: any;
    deletePOError: string = '';
    isDeletePOError: boolean = false;
    addPOCapability: boolean = true;
    showLocalizationPanel;
    poInBundleSubscriptions: any;
    @Output() isOfferingUpdated = new EventEmitter();
    bodyHeight;
    poInstanceUnderDeletion = [];
    initializePOtoBundle: boolean;
    loaderStyle = '{"margin-top": "5px"}';
    showSkeleton = false;
    isListUpdated = false;
    showLoader = false;
    @Language() lang: string;

   constructor(private _productOfferToBundleService: ProductOfferInBundleService,
            private _utilService: utilService,
            private _router: Router,
            private _route: ActivatedRoute,
            private _bundleService: BundleService,
            private _capabilityService: CapabilityService,
            private _utilityService: UtilityService) {
    }

    ngOnInit() {
      this.bundleId = +this._route.snapshot.params['bundleId'];
      this._utilService.changeOpenAddPOModalPopUp(false);
      this.getAllPoInBundle();
      this.addPOCapability = this._capabilityService.findPropertyCapability('UIPoDetailsPage', 'POs_Add');
      this.poInBundleSubscriptions = this._utilService.callPoInBundleListAfterAddingNew.subscribe(value => {
       if (value) {
          this.isListUpdated = true;
          this.getAllPoInBundle();
          this.isOfferingUpdated.emit(true);
        }
       });
       this.poInBundleSubscriptions = this._utilService.isPropertiesChange.subscribe(value => {
        if (value['isBundle'] === true) {
          this.getAllPoInBundle();
        }
      });
      const selectedBundleCheckPoSubscribe = this._bundleService.selectedBundleCheckPo.subscribe(selectedBundleData => {
        if (Object.keys(selectedBundleData).length > 0) {
          this.selectedBundle(selectedBundleData);
        }
      });
      this.poInBundleSubscriptions.add(selectedBundleCheckPoSubscribe);

      const openAddPOModalPopUp = this._utilService.openAddPOModalPopUp.subscribe(value => {
        if (!value) {
          this.initializePOtoBundle = false;
        }
    });
    this.poInBundleSubscriptions.add(openAddPOModalPopUp);
  }

  openAddPoListInBundle(){
    this.initializePOtoBundle = true;
    this._utilService.changeOpenAddPOModalPopUp(true);
  }

  getAllPoInBundle() {
    let timer;
    this.isListUpdated === true ? this.showSkeleton = true : this.showLoader = true;
    this._productOfferToBundleService.getProductOffersInBundle({
      data : {
        offerId : this.bundleId
      },
      success : (result) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
        this.productOfferCards = result;
        this.productOfferCardsLength = this.productOfferCards.length;
        if (this.productOfferCards !== (undefined && null) && this.productOfferCardsLength > 0) {
          this.noProductOffers = false;
        } else {
          this.noProductOffers = true;
        }
        this.removePOInstanceID = -1;
        this.poInstanceUnderDeletion =[];
        }, 300);
      },
      failure : (error) => {
        this.handleErrorPOInstanceID(error);
      },
      onComplete : () => {
        this.resetLoaders();
      }
    });
  }

  resetLoaders() {
    setTimeout(() => {
      this.isListUpdated = false;
      this.showSkeleton = false;
      this.showLoader = false;
      this._utilService.changeCallPoInBundleListAfterAddingNew(false); 
    }, 100);
  }

  selectedBundle(bundleList) {
    this.bundleList = bundleList;
    if (this.bundleList['addRemovePoPi'] === false) {
      this.disableAddPo = false;
    } else {
      this.disableAddPo = true;
    }
  }

  removePoFromBundle(offerId) {
    this.poInstanceUnderDeletion.push(offerId);
    this.showSkeleton = true;
    this._productOfferToBundleService.removePoFromBundle({
      data : {
        bundleId : this.bundleId,
        offerId : offerId
      },
      success : (result) => {
        this.isListUpdated = true;
        this.getAllPoInBundle();
        this.isOfferingUpdated.emit(true);
      },
      failure : (errorMsg: string, code: any) => {
        let poCardRemoveError = this._utilityService.errorCheck(code, errorMsg, 'DELETE');
        this.handleErrorPOInstanceID(poCardRemoveError);
        const index = this.poInstanceUnderDeletion.indexOf(offerId);
        if (index > -1) {
          this.poInstanceUnderDeletion.splice(index, 1);
        }
      },
      onComplete : () => {
        this.showSkeleton = false;
      }
    });
  }

  redirectToPiDetailsPage(productOfferId, itemInstanceId, PIType, POObj, PIObj){
    this._router.navigate( ['/ProductCatalog/PriceableItem/', productOfferId, itemInstanceId, PIType]);
    this._utilService.changeBreadCrumbApplicationLevelEvents({
      offerId: productOfferId,
      path: '/ProductCatalog/PriceableItem/' + productOfferId + '/' + itemInstanceId + '/' + PIType,
      POObj: POObj,
      PIObj: PIObj,
      CPIObj: {},
      Level: 'BUNDLE_PO_PI',
      PIType: PIType
    });
  }

  redirectToPoDetailsPage(POObj) {
    this._router.navigate(['/ProductCatalog/BundleProductOffer', this.bundleId, POObj.offerId]);
    this._utilService.changeBreadCrumbApplicationLevelEvents({
      offerId: POObj.offerId,
      path: '/ProductCatalog/BundleProductOffer/' + this.bundleId + '/' + POObj.offerId,
      POObj: POObj,
      PIObj: {},
      CPIObj: {},
      Level: 'BUNDLE_PO',
      PIType: ''
    });
  }

  removePOInstanceIcon(itemInstanceId, index) {
    this.removePOInstanceID = itemInstanceId;
    this.height = document.getElementById('cardTotalHeightPO-' + index).clientHeight;
    this.bodyHeight = document.getElementById('cardBodyPO-' + index).clientHeight;
  }
  cancelPOInstanceCard() {
    this.removePOInstanceID = -1;
  }
  handleErrorPOInstanceID(error) {
    this.deletePOError = error;
    this.isDeletePOError = true;
  }
  deleteErrorMessage() {
    this.isDeletePOError = false;
    this.removePOInstanceID = -1;
  }
  showConfirmationDialogue(itemInstanceId) {
    return ((this.removePOInstanceID === itemInstanceId) && (this.poInstanceUnderDeletion.indexOf(itemInstanceId) <= -1)
      && !this.isDeletePOError);
  }
  showPoCard(itemInstanceId) {
    return ((this.removePOInstanceID !== itemInstanceId) && (this.poInstanceUnderDeletion.indexOf(itemInstanceId) <= -1)
     && !this.isDeletePOError);
  }
  ngOnDestroy() {
    if (this.poInBundleSubscriptions) {
      this.poInBundleSubscriptions.unsubscribe();
    }
    this.poInstanceUnderDeletion = [];
  }
}

