import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ProductService } from './productOffer.service';
import { sharedService } from './sharedService';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { contextBarHandlerService } from '../helpers/contextbarHandler.service';
import { utilService } from '../helpers/util.service';
import { InUseOfferingsModalDialogService } from '../inUseOfferingsModalDialog/inUseOfferingsModalDialog.service';
import { CapabilityService } from '../helpers/capabilities.service';
import { UtilityService } from '../helpers/utility.service';
import { TranslationService } from 'angular-l10n';
import { SubscriptionPropertyDetailsService } from '../subscriptionPropertyDetails/subscriptionPropertyDetails.service';


@Component({
  selector: 'ecb-product-offer',
  templateUrl: './productOffer.component.html',
  styleUrls: ['./productOffer.component.scss'],
  providers: [ProductService]
})
export class ProductOfferComponent implements OnInit, OnDestroy {

  breadcrumb = []
  errorMessage: string;
  createPOErrorMessage: boolean;
  isDeletePOError: boolean = false;
  productList: any = {};
  productOfferFormData: any;
  userSubscribefromTS: any;
  userUnSubscribefromTS: any;
  labels: any = [];
  productOfferId: number;
  widgetType: any;
  currencies: any;
  selectedCurrency: any;
  partitions: any;
  selectedPartition: any;
  createPOData: any;
  createPODataconfig: any;
  name: string;
  offerings = "TEXT_SUBSCRIBABLE_ITEMS";
  errorMessagePOP: any;
  productOfferForm: any;
  displayNameChanges: any;
  public isPOFormValid: boolean = false;
  public isPOFormUpdated: boolean = false;
  deletePOError: string = '';
  @Input() generalPropertiesList;
  createPOPUPHeadMsg: string = 'TEXT_UNSAVED_CHANGES';
  createPOPUPBodyMsg: string = 'TEXT_POPUP_CHANGES';
  canProductOfferDeleted: boolean = false;
  isIntervalContinue;
  hideWidget = false;
  showLocalizationPanel: boolean = false;
  showApprovalPanel: boolean = false;
  poSubscriptions: any;
  subscriptionList: any;
  subscriptionListLength: any;
  addSubscriptionList: any;
  addSubscriptionListLength: any;
  bundleId: any;
  showComponent = false;
  poUsedLocationsLength: number;
  poUsedLocations: any;
  openOfferingUsedLocations = false;
  onInitCount = false;
  poUsedLocationsTest: any;
  offeringsDetailCapabilities: any = {};
  deleteOfferingCapability = true;
  showLoader = false;
  showSkeleton = false;
  widgetUpdated = false;
  showPropertiesSkeleton = false;
  showSubSettingsSkeleton = false;
  showExtPropertiesSkeleton = false;
  inUseOfferingsData;
  inUseOfferingsLocation;
  showFailureMessage;
  isPOFailure = false;
  showAprrovalMsg:boolean = false;
  showAprrovalWarningMsg:boolean = false;
  approvalCheck: any;
  currentView: string = 'offering';
  isApprovalEdited: boolean = false;
  nextStateUrl: string = '/ProductCatalog/Offerings';

  constructor(private _productService: ProductService,
    private _sharedService: sharedService,
    private _route: ActivatedRoute,
    private _contextBarHandlerService: contextBarHandlerService,
    private _router: Router,
    private readonly _translationService: TranslationService,
    private _utilityService: UtilityService,
    private _utilService: utilService,
    private _inUseOfferingsModalDialogService: InUseOfferingsModalDialogService,
    private _capabilityService: CapabilityService,
    private _subscriptionPropertyDetailsService: SubscriptionPropertyDetailsService) {
    this._utilService.changeitemInstanceDisplayName("");
    this._contextBarHandlerService.changeContextBarVisibility(true);
    this._utilService.changePiInstanceChildShow({ parent: false, child: false });

    this._route.params.subscribe(params => {
      if (this.onInitCount) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this.onInitCount = true;
    this._utilService.changedynamicSaveBtn('ProductOffer');
    this._utilService.currentView('ProductOffer');
    this._utilService.updateApplyBodyScroll(true);
    this._contextBarHandlerService.changeContextBarVisibility(true);
    localStorage.setItem('PIChildItem', JSON.stringify({ parent: false, child: false }));
    this.productOfferId = +this._route.snapshot.params['productOfferId'];
    this.bundleId = +this._route.snapshot.params['bundleId'];
    localStorage.setItem('offerId', JSON.stringify(this.productOfferId));
    if (this.bundleId !== null && this.bundleId !== undefined && isNaN(this.bundleId) === false) {
      if (this.productOfferId !== null && this.productOfferId !== undefined && isNaN(this.productOfferId) === false) {
        this.showComponent = false;
      }
    }
     else {
      this.showComponent = true;
    }
  
    this.offeringsDetailCapabilities = this._capabilityService.getWidgetCapabilities('UIPoDetailsPage');
    this.deleteOfferingCapability = this._capabilityService.findPropertyCapability('UIPoDetailsPage', 'Delete');
    if (this.deleteOfferingCapability) {
      this._utilService.updateShowDeleteButton(true);
    } else {
      this._utilService.updateShowDeleteButton(false);
    }
    this.getPOLocations();
    this.intervalEvent();
    this.getProductOfferDetails();
    this.getSubscriptionProperties();

    this.poSubscriptions = this._productService.saveProductOffer.subscribe(value => {
      if (value) {
        this._productService.createProductOffer({
          success: (result) => {
            this._router.navigateByUrl('/ProductCatalog/ProductOffer');
          },
          failure: (error) => {
            this.createPOErrorMessage = error;
          }
        });
      }
    });
    const deleteProductOfferSubscribe = this._utilService.deleteProductOffer.subscribe(value => {
      this.canProductOfferDeleted = true;
      var widgetData = {
        productOfferId: this.productOfferId,
      };
      if (value && this.canProductOfferDeleted) {
        this._productService.deletePODetail({
          data: widgetData,
          success: (result) => {
            this._router.navigateByUrl('/ProductCatalog/Offerings');
           this._utilService.breadCrumbDisplayNameEditorDelete({ pageTitle: this.offerings, actionType: 2 });
          },
          failure: (errorMsg: string, code: any) => {
        let poCntxtDelete = this._utilityService.errorCheck(code, errorMsg, 'DELETE');
            this.handleErrorDeletePO(poCntxtDelete)
          }
        });
        this._utilService.changedeleteProductOffer(false);
      }
      this.canProductOfferDeleted = false;
    });
    this.poSubscriptions.add(deleteProductOfferSubscribe);
    const localizationFromContextbar = this._utilService.localizationFromContextbar.subscribe(value => {
      if (value) {
        this.showLocalizationPanel = true;
      }
    });
    this.poSubscriptions.add(localizationFromContextbar);
    const approvalsFromContextbar = this._utilService.approvalsFromContextbar.subscribe(value => {
      if (value) {
        this.showApprovalPanel = true;
      }
    });
    this.poSubscriptions.add(approvalsFromContextbar);
    if (this.poUsedLocationsLength > 0) {
      this.poUsedLocationsTest = true;
    } else {
      this.poUsedLocationsTest = false;
    }
    this._utilService.isPropertiesChange.subscribe(value => {
      if (value['isPO'] === true) {
        this.getProductOfferDetails();
      }
    });
    const updateBodyScroll = this._utilService.gridScrollStatus.subscribe(value => {
      if(value){
        this._utilService.updateApplyBodyScroll(true);
      }
    });
    this.poSubscriptions.add(updateBodyScroll);
    this._router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(value => {
        this.nextStateUrl = value['url'];
      });
  }

  isCapableOf(item) {
    return this.offeringsDetailCapabilities.hasOwnProperty(item) ? (this.offeringsDetailCapabilities[item] === null ? true : this.offeringsDetailCapabilities[item]) : true
  }

  hidePropertiesWidget(value) {
    if (value) {
      this.showLocalizationPanel = false;
    }
  }

  handleErrorDeletePO(error) {
    this.deletePOError = error;
    this.isDeletePOError = true;
  }

  removeError() {
    return this.createPOErrorMessage = false;
  }

  deleteErrorMessage() {
    this.isDeletePOError = false;
  }

  toggleWidgetSkeleton(widget) {
    switch (widget) {
      case 'properties':
        this.showPropertiesSkeleton = true;
        break;
      case 'subSettings':
        this.showSubSettingsSkeleton = true;
        break;
      case 'extProperties':
        this.showExtPropertiesSkeleton = true;
        break;
      default:
        break;
    }
  }

  getProductOfferDetails() {
    let timer;
    if (this.productOfferId) {
      this.widgetUpdated === true ? this.toggleWidgetSkeleton(this.widgetType) : this.showLoader = true;
      this._productService.getProduct({
        data: {
          productOfferId: this.productOfferId
        },
        success: (result) => {
          clearTimeout(timer);
          timer = setTimeout(() => {
            this.productList = result;
            this._utilService.changedisplayName(this.productList.displayName);
            this.labels = Object.keys(this.productList.properties);
            this._productService.changeSelectedPoCheckPi(this.productList);
            this._utilService.changeDeletePOPData({ name: this.productList.displayName, description: this.productList.description });
            this._utilService.changeDisableDeletePo({ delete: this.productList.delete });
            this.updatingDisplayName(result);
            this.setLocalStorageValues(result);
            this._utilService.changeApprovalBtn({ approval: this.productList.approvalDetailsMap, Capabilities: this.offeringsDetailCapabilities});
            this.approvalCheck = { approval: this.productList.approvalDetailsMap, Capabilities: this.offeringsDetailCapabilities};
            if (this.approvalCheck['approval']['approvalsWarningMsg'] === 'allowMoreThanOneTrue' ) {
              this.showAprrovalMsg = true;
              this.showAprrovalWarningMsg = this._translationService.translate('TEXT_MULTI_APPROVAL_OFFERING_MESSAGE');
            } else if(this.approvalCheck['approval']['approvalsWarningMsg'] === 'allowMoreThanOneFalse') {
              this.showAprrovalMsg = true;
              this.showAprrovalWarningMsg = this._translationService.translate('TEXT_SINGLE_APPROVAL_OFFERING_MESSAGE');
            } else{
              this.showAprrovalMsg = false;
              this.showAprrovalWarningMsg = false;
            }
          }, 300);
        },
        failure: (errorMsg: string, code: any, error: any) => {
          this.errorMessage = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
          this.showFailureMessage = this.errorMessage;
          this.isPOFailure = true;
        },
        onComplete: () => {
          setTimeout(() => {
            this.showLoader = false;
            this.showSkeleton = false;
            this.showPropertiesSkeleton = false;
            this.showSubSettingsSkeleton = false;
            this.showExtPropertiesSkeleton = false;
            this.widgetUpdated = false;
          }, 200);
        }
      });
    }
  }

  updatingDisplayName(result) {
    const displayName = result.displayName;
    if (displayName !== undefined && displayName !== null && displayName !== "") {
      this._utilService.breadCrumbDisplayNameEditorDelete({ pageTitle: displayName, actionType: 1 });
    }
  }

  intervalEvent() {
    this.isIntervalContinue = setInterval(() => {
      this._utilService.changeprodOfferSkeletonLoader(true);
    }, 3000);
  }

  updateProductOffer(value) {
    if (value) {
      this.widgetUpdated = true;
      this.widgetType = value;
      this.getProductOfferDetails();
    }
  }

  getSubscriptionProperties() {
    const widgetData = {
      param: {
        page: 1,
        size: 25
      }
    }
    this._subscriptionPropertyDetailsService.getSubscriptionProperties({
      data: widgetData,
      success: (result: any) => {
        this.subscriptionList = result.totalCount;
        if (this.subscriptionList != undefined && this.subscriptionList != null && this.subscriptionList > 0 ) {
          this.hideWidget = true;
        } else {
          this.hideWidget = false;
        }
      },
      failure: (error: any) => {
      },
    });
  }

  getPOLocations() {
    this._inUseOfferingsModalDialogService.getPoUsedLocations({
      data: this.productOfferId,
      success: (result) => {
        this.poUsedLocations = result;
        this.poUsedLocationsLength = this.poUsedLocations.totalCount;
      },
      failure: (error) => {
      }
    });
  }

  openPOLocations() {
    this.openOfferingUsedLocations = true;
    this.inUseOfferingsData = this.productList;
    this.inUseOfferingsLocation = 'productOfferList';
  }

  hideInUseModalDialog(e) {
    if (e) {
      this.openOfferingUsedLocations = false;
    }
  }

  ngOnDestroy() {
    if (this.poSubscriptions) {
      this.poSubscriptions.unsubscribe();
    }
  }

  setLocalStorageValues(productOffer) {
    const result = {};
    result['nonsharedPlId'] = productOffer.nonsharedPlId;
    result['offerId'] = productOffer.offerId;
    result['isStartDateAvailable'] = (productOffer.availableStartDate === null) ? false : true;
    localStorage.setItem('ProductOffer', JSON.stringify(result));
  }


  hidelocalizationWidget(event){
    if(event){
      this.showLocalizationPanel = false;
    }
  }

  hideApprovalWidget(event) {
    if(event){
      this.showApprovalPanel = false;
    }
  }

  updateOffering(event) {
    if (event) {
      this.getProductOfferDetails();
    }
  }
  updateDeactivationState(event) {
    if (event) {
      this.isApprovalEdited = true;
    } else {
      this.isApprovalEdited = false;
    }
  }

  canDeactivate() {
    if (this.isApprovalEdited) {
      const data = {
        url: this.nextStateUrl
      };
      this._utilService.changePreventUnsaveChange(data);
      return false;
    } else {
      return true;
    }
  }

}
