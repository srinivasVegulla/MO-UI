import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { BundleService } from './bundle.service';
import { utilService } from '../helpers/util.service';
import { contextBarHandlerService } from '../helpers/contextbarHandler.service';
import { ProductService } from '../productOffer/productOffer.service';
import { CapabilityService } from '../helpers/capabilities.service';
import { UtilityService } from '../helpers/utility.service';
import { TranslationService } from 'angular-l10n';
import { SubscriptionPropertyDetailsService } from '../subscriptionPropertyDetails/subscriptionPropertyDetails.service';

@Component({
  selector: 'ecb-bundle',
  templateUrl: './bundle.component.html',
  styleUrls: ['./bundle.component.scss'],
  providers: [BundleService]
})
export class BundleComponent implements OnInit, OnDestroy {

  bundleId: number;
  bundleData: any = {};
  labels: any = [];
  errorMessage: string;
  loadBundleData = false;
  showErrorMessage = false;
  isIntervalContinue;
  hideWidget:boolean;
  bundleSubscriptions:any;
  subscriptionList: any;
  subscriptionListLength: any;
  addSubscriptionList: any;
  addSubscriptionListLength: any;
  deletePOError: string;
  isDeletePOError: boolean;
  disableDeleteBundle: boolean;
  localizationUpdated: boolean;
  offeringsDetailCapabilities = {};
  deleteOfferingCapability = true;
  showLocalizationPanel: boolean;
  widgetType: any = '';
  showLoader = false;
  widgetUpdated = false;
  showPropertiesSkeleton = false;
  showSubSettingsSkeleton = false;
  showExtPropertiesSkeleton = false;
  offerings = "TEXT_SUBSCRIBABLE_ITEMS";
  showAprrovalMsg: boolean = false;
  showAprrovalWarningMsg: boolean = false;
  approvalCheck: any;
  showApprovalPanel: boolean = false;
  currentView: string = 'offering';
  nextStateUrl: string = '/ProductCatalog/Offerings';
  isApprovalEdited: boolean = false;

  constructor(private _router: Router,
              private _route: ActivatedRoute,
              private _bundleService: BundleService,
              private readonly _translationService: TranslationService,
              private _utilService: utilService,
              private _utilityService: UtilityService,
              private _contextBarHandlerService: contextBarHandlerService,
              private _productService: ProductService,
              private _capabilityService: CapabilityService,
              private _subscriptionPropertyDetailsService: SubscriptionPropertyDetailsService) {}

  ngOnInit() {
    this.isDeletePOError = false;
    this.bundleId = +this._route.snapshot.params['bundleId'];
    this._utilService.updateApplyBodyScroll(true);
    localStorage.setItem('offerId', JSON.stringify(this.bundleId));
    this._utilService.currentView('Bundle');
    this.intervalEvent();
    this.getBundleDetails();
    this.getSubscriptionProperties();

    this.bundleSubscriptions = this._utilService.deleteProductOffer.subscribe(value => {
      const widgetData = {
        bundleId: this.bundleId,
      };
      if (value) {
        this._bundleService.deleteBundle({
          data: widgetData,
          success:  (result) => {
            this._router.navigateByUrl('/ProductCatalog/Offerings');
            this._utilService.breadCrumbDisplayNameEditorDelete({ pageTitle: this.offerings, actionType: 2 });
          },
          failure: (errorMsg: string, code: any) => {
            let bundleCntxtDelete = this._utilityService.errorCheck(code, errorMsg, 'DELETE');
                this.handleErrorDeletePO(bundleCntxtDelete);
              }
        });
        this._utilService.changedeleteProductOffer(false);
      }
    });
    const localizationFromContextbar = this._utilService.localizationFromContextbar.subscribe(value => {
      if (value) {
       this.showLocalizationPanel = value;
      }
    });
    this.bundleSubscriptions.add(localizationFromContextbar);
    const approvalsFromContextbar = this._utilService.approvalsFromContextbar.subscribe(value => {
      if (value) {
        this.showApprovalPanel = value;
      }
    });
    this.bundleSubscriptions.add(approvalsFromContextbar);
    this._utilService.changedynamicSaveBtn('bundle');
    this._contextBarHandlerService.changeContextBarVisibility(true);
    this._utilService.isPropertiesChange.subscribe(value => {
      if (value['isBundle'] === true) {
        this.localizationUpdated = value['isBundle'];
        this.getBundleDetails();
      }
    });
    this.offeringsDetailCapabilities = this._capabilityService.getWidgetCapabilities('UIPoDetailsPage');
    this.deleteOfferingCapability = this._capabilityService.findPropertyCapability('UIPoDetailsPage', 'Delete');
    if (this.deleteOfferingCapability) {
      this._utilService.updateShowDeleteButton(true);
    } else {
      this._utilService.updateShowDeleteButton(false);
    }
    this._router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(value => {
        this.nextStateUrl = value['url'];
      });
  }

  hidelocalizationWidget(value) {
    if (value) {
      this.showLocalizationPanel = false;
    }
  }

  hideApprovalWidget(value) {
    if (value) {
      this.showApprovalPanel = false;
    }
  }

  isCapableOf(item) {
    return this.offeringsDetailCapabilities.hasOwnProperty(item) ? (this.offeringsDetailCapabilities[item] === null ? true : this.offeringsDetailCapabilities[item]) : true
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

  getBundleDetails() {
    let timer: any;
    if (this.bundleId) {
      this.widgetUpdated === true ? this.toggleWidgetSkeleton(this.widgetType) : this.showLoader = true;
      this.loadBundleData = true;
      this._bundleService.getBundleData({
        data: {
          bundleId: this.bundleId
        },
        success: (result) => {
          clearTimeout(timer);
          timer = setTimeout(() => {
            this.bundleData = result;
            this._utilService.changedisplayName(this.bundleData.displayName);
            this.labels = Object.keys(this.bundleData.properties);
            this._productService.changeSelectedPoCheckPi(this.bundleData);
            this._bundleService.changeSelectedBundleCheckPo(this.bundleData);
            this._utilService.changeDeletePOPData({ name: this.bundleData.displayName, description: this.bundleData.description });
            this._utilService.changeDisableDeleteBundle({ delete: this.bundleData.delete });
            this.updatingDisplayName(result);
            this.setLocalStorageValues(result);
            this._utilService.changeApprovalBtn({ approval: this.bundleData.approvalDetailsMap, Capabilities: this.offeringsDetailCapabilities});
            this.approvalCheck = { approval: this.bundleData.approvalDetailsMap, Capabilities: this.offeringsDetailCapabilities};
            if (this.approvalCheck['approval']['approvalsWarningMsg'] === 'allowMoreThanOneTrue' ) {
              this.showAprrovalMsg = true;
              this.showAprrovalWarningMsg = this._translationService.translate('TEXT_MULTI_APPROVAL_BUNDLE_MESSAGE');
            } else if(this.approvalCheck['approval']['approvalsWarningMsg'] === 'allowMoreThanOneFalse') {
              this.showAprrovalMsg = true;
              this.showAprrovalWarningMsg = this._translationService.translate('TEXT_SINGLE_APPROVAL_BUNDLE_MESSAGE');
            } else{
              this.showAprrovalMsg = false;
              this.showAprrovalWarningMsg = false;
            }
            if (this.localizationUpdated) {
              this._utilService.breadCrumbDisplayNameEditorDelete({ pageTitle: this.bundleData.displayName, actionType: 1 });
            }
          }, 300);
        },
        failure: (errorMsg: string, code: any) => {
          this.errorMessage =  this._utilityService.errorCheck(code, errorMsg, 'LOAD');
          this.showErrorMessage = true;
        },
        onComplete: () => {
          setTimeout(() => {
            this.showLoader = false;
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
    const dispalyName = result.displayName;
    if (dispalyName !== undefined) {
      this._utilService.breadCrumbDisplayNameEditorDelete({ pageTitle: dispalyName, actionType: 1 });
    }
  }

  intervalEvent() {
    this.isIntervalContinue = setInterval(() => {
      this._utilService.changeprodOfferSkeletonLoader(true);
    }, 3000);
  }

  discardError() {
    this.showErrorMessage = false;
  }

  handleErrorDeletePO(error) {
    this.deletePOError = error;
    this.isDeletePOError = true;
  }

  updateOffering(value) {
    if (value) {
      this.widgetUpdated = true;
      this.widgetType = value;
      this.getBundleDetails();
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
        if (this.subscriptionList != undefined && this.subscriptionList != null && this.subscriptionList > 0) {
          this.hideWidget = true;
        } else {
          this.hideWidget = false;
        }
      },
      failure: (error: any) => {
      },
    });
  }
  setLocalStorageValues(productOffer) {
    const result = {};
    result['nonsharedPlId'] = productOffer.nonsharedPlId;
    result['offerId'] = productOffer.offerId;
    result['isStartDateAvailable'] = (productOffer.availableStartDate === null) ? false : true;
    localStorage.setItem('ProductOffer', JSON.stringify(result));
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
  ngOnDestroy() {
    if (this.bundleSubscriptions) {
      this.bundleSubscriptions.unsubscribe();
    }
  }
}
