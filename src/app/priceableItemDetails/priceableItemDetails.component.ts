import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { priceableItemDetailsService } from './priceableItemDetails.service';
import { Language, DefaultLocale, Currency, LocaleService } from 'angular-l10n';
import { utilService } from '../helpers/util.service';
import { contextBarHandlerService } from '../helpers/contextbarHandler.service';
import { CapabilityService } from '../helpers/capabilities.service';
import { UtilityService } from './../helpers/utility.service';

@Component({
  selector: 'ecb-priceable-item-details',
  templateUrl: './priceableItemDetails.component.html',
  styleUrls: ['./priceableItemDetails.component.scss'],
  providers: [priceableItemDetailsService]
})

export class PriceableItemDetailsComponent implements OnInit,OnDestroy {
  productOfferId: number;
  itemInstanceId: number;
  piinstanceParentId: number;
  PIType;
  priceableItemsData;
  PIServerError;
  currentLocale;
  childPriceableItemsData: any;
  showingChildNameinTitle = false;
  showingParentNameinTitle = false;
  piDetailSubscriptions: any;
  onInitCount = false;
  showAdjustments: boolean;
  nextStateUrl: string;
  isFormUpdated: boolean;
  showLocalizationPanel;
  localizationFromContextbar;
  PIDetailsCapabilities: any = {};
  showLoader = false;
  showPropertiesSkeleton = false;
  showExtPropertiesSkeleton = false;
  showBillingSkeleton = false;
  showUnitDetailsSkeleton = false;
  isPIUpdated = false;
  widgetType: any;
  PIErrorMessage;
  isApprovalUpdated: boolean = false;

  constructor(private _route: ActivatedRoute,
              private _priceableItmeDetailsService: priceableItemDetailsService,
              private locale: LocaleService,
              private _utilService: utilService,
              private _contextBarHandlerService: contextBarHandlerService,
              private _router: Router,
              private _capabilityService: CapabilityService,
              private _utilityService: UtilityService) {
    this._utilService.changedynamicSaveBtn('');
    this._utilService.changeitemInstanceDisplayName('');
    this._utilService.changedisplayName('');
    this._contextBarHandlerService.changeContextBarVisibility(true);
    this._utilService.changedynamicSaveBtn('LOPIDetails');
    this.piDetailSubscriptions = this._priceableItmeDetailsService.isPriceableItemUpdated.subscribe(value => {
      if (value) {
        this.widgetType = value;
        this.isPIUpdated = true;
        this.getInitalPIdetails();
      }
    });

    this._route.params.subscribe(params => {
      if (this.onInitCount) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this._contextBarHandlerService.changeContextBarVisibility(true);
    this._utilService.updateApplyBodyScroll(true);
    this._utilService.changedynamicSaveBtn('LOPIDetails');
    this._utilService.currentView('LOPIDetails');
    this.onInitCount = true;
    this.currentLocale = this.locale.getCurrentLocale();
    this.productOfferId = this._route.snapshot.params['productOfferId'];
    this.itemInstanceId = this._route.snapshot.params['itemInstanceId'];
    this.PIType = this._route.snapshot.params['PIType'];
    this.getInitalPIdetails();
    this.nextStateUrl = '/ProductCatalog/PriceableItemTemplates';
    this._router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe(value => {
        this.nextStateUrl = value['url'];
    });
    this.localizationFromContextbar = this._utilService.localizationFromContextbar.subscribe(value => {
      if (value) {
      this. showLocalizationPanel = true;
      }
    });
    this.PIDetailsCapabilities = this._capabilityService.getWidgetCapabilities('UIPIDetailsPage');
    const approvalSubscription = this._utilService.isApprovalEdited.subscribe(value => {
      this.isApprovalUpdated = value;
    });
    this.piDetailSubscriptions.add(approvalSubscription);
   }

  isCapableOf(item) {
    return this.PIDetailsCapabilities.hasOwnProperty(item) ? (this.PIDetailsCapabilities[item] === null ? true : this.PIDetailsCapabilities[item]) : true
  }

  hidelocalizationWidget(value) {
    if (value) {
      this.showLocalizationPanel = false;
    }
  }
  getInitalPIdetails() {
    this.isPIUpdated === true ? this.displayWidgetSkeleton(this.widgetType) : this.showLoader = true;
    this._priceableItmeDetailsService.getPriceableDetails({
      data: {
        offerId: this.productOfferId,
        piInstanceId: this.itemInstanceId
      },
      success: (result)  => {
        this.priceableItemsData = result;
        this.showAdjustments = this.priceableItemsData.adjustmetWidget;
        this.hideSkeleton();
        if (this.priceableItemsData !== undefined) {
          this._utilService.breadCrumbDisplayNameEditorDelete({ pageTitle: this.priceableItemsData.displayName, actionType: 1 });
        }
        this._utilService.changeBreadCrumbApplicationLevelEvents({
          PIObj: this.priceableItemsData
        });
      },
      failure: (errorMsg: string, code: any) => {
          let piInstanceLoadError = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
          this.handleError(piInstanceLoadError);
          this.hideSkeleton();
      }
    });
    this._priceableItmeDetailsService.getChildPriceableItems({
      data: {
        offerId: this.productOfferId,
        itemInstanceId: this.itemInstanceId
      },
      success: (result) => {
        this.childPriceableItemsData = result;
      },
      failure: (errorMsg: string, code: any) => {
        let piInstanceLoadError = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
        this.handleError(piInstanceLoadError);
      },
      onComplete : () => {
        setTimeout(() => {
          this.showLoader = false;
          this.showPropertiesSkeleton = false;
          this.showExtPropertiesSkeleton = false;
          this.showUnitDetailsSkeleton = false;
          this.isPIUpdated = false;
        }, 200);
      }
    });

    const piInstanceChildShowSubscribe = this._utilService.piInstanceChildShow.subscribe(showChild => {
      var showChilds = JSON.parse(localStorage.getItem('PIChildItem'));
      if (showChilds) {
        if (showChilds['child']) {
          this.showingChildNameinTitle = true;
          this.showingParentNameinTitle = false;
        } else if (showChilds['parent']) {
          this.showingParentNameinTitle = true;
          this.showingChildNameinTitle = false;
        } else {
          this.showingChildNameinTitle = false;
          this.showingParentNameinTitle = false;
        }
      }
    });
    this.piDetailSubscriptions.add(piInstanceChildShowSubscribe);
   }

  displayWidgetSkeleton(item) {
    switch (item) {
      case 'PIProperties':
        this.showPropertiesSkeleton = true;
        break;
      case 'extProperties':
      this.showExtPropertiesSkeleton = true;
        break;
      case 'unitDetails':
        this.showUnitDetailsSkeleton = true;
        break;
      default:
        break;
    }
  }

   private handleError(error) {
      this.PIServerError = true;
      this.PIErrorMessage = error;
   }

  displayNavoutDialog(value) {
    if (value) {
      this.isFormUpdated = true;
    } else {
      this.isFormUpdated = false;
    }
  }

  reloadWidget(value) {
    this.widgetType = value;

  }

  canDeactivate() {
    if (this.isFormUpdated || this.isApprovalUpdated) {
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
    if (this.piDetailSubscriptions) {
      this.piDetailSubscriptions.unsubscribe();
    }
    if (this.localizationFromContextbar) {
      this.localizationFromContextbar.unsubscribe();
    }
  }
  hideSkeleton() {
    let timer;
    clearTimeout(timer);
    timer = setTimeout(() => {
      this._utilService.hidingSkeleton('.propertiesSkeleton');
      this._utilService.hidingSkeleton('.extendedPropertiesSkeleton');
    if (this.priceableItemsData.kind === 'UNIT_DEPENDENT_RECURRING') {
      this._utilService.hidingSkeleton('.permissionSkeleton');
    }
    }, 1000);
  }
}
