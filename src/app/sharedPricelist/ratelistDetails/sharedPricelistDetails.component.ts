import { Component, OnInit, Input, HostListener, OnDestroy } from '@angular/core';
import { SharedPricelistService } from '../shared.pricelist.service';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { contextBarHandlerService } from '../../helpers/contextbarHandler.service';
import { utilService } from '../../helpers/util.service';
import { UtilityService } from '../../helpers/utility.service';
import { CapabilityService } from '../../helpers/capabilities.service';

@Component({
    selector: 'ecb-sharedPricelist-details',
    templateUrl: './sharedPricelistDetails.component.html',
    styleUrls: ['./sharedPricelistDetails.component.scss'],
    providers: []
})

export class SharedPricelistDetailsComponent implements OnInit, OnDestroy {

    pricelistId: number;
    createSPErrorMessage: boolean;
    selectedSharedPricelist: any;
    isIntervalContinue;
    showLocalizationPanel = false;
    errorMessage: string;
    spcurrencies: any;
    sppartitions: any;
    spDetailsSubscriptions: any;
    selectedPartition: any;
    deleteSRError: string;
    isDeleteSRError: boolean;
    rateTableInfoLoading = false;
    paramTableInfo = {};
    isAddRateTable = false;
    addRateTableParam;
    priceListInUseInfo: any;
    sharedRatesDeleteCapabilities = {};
    widgetType: any;
    showLoader = false;
    showSkeleton = false;
    widgetUpdated = false;
    showSPPropertiesSkeleton:boolean = false;
    showInUseSkeleton:boolean = false;
    showSPExtPropertiesSkeleton = false;
    showRateListMappings = false;
    addRatesTableCapability = false;
    rateDetailsFetchError: any;
    isRatelistMappingError = false;
    isApprovalUpdated: boolean = false;
    nextStateUrl: string = '/ProductCatalog/PriceableItemTemplates';

    constructor(private _sharedPricelistService: SharedPricelistService,
        private _utilService: utilService,
        private _route: ActivatedRoute,
        private _contextBarHandlerService: contextBarHandlerService,
        private _router: Router,
        private _utilityService: UtilityService,
        private _capabilityService: CapabilityService) {
    }

    ngOnInit() {
      this._utilService.updateApplyBodyScroll(true);
      this.sharedRatesDeleteCapabilities = this._capabilityService.findPropertyCapability('UISharedRateDetailsPage' , 'SharedRatesDetails_Delete');
      this.addRatesTableCapability = this._capabilityService.findPropertyCapability('UISharedRateDetailsPage', 'RateTables_Add'); 
      if (this.sharedRatesDeleteCapabilities) {
        this._utilService.updateShowDeleteButton(true);
      } else {
        this._utilService.updateShowDeleteButton(false);
      }
      this.pricelistId = +this._route.snapshot.params['pricelistId'];
      this.intervalEvent();
      this.getProductOfferDetails();
      this.getPriceListUseInfo();
      this.deleteSRError = '';
      this.isDeleteSRError = false;
      this._utilService.changedynamicSaveBtn('sharedRatelist');
      this._router.events
        .filter(event => event instanceof NavigationStart)
        .subscribe(value => {
          this.nextStateUrl = value['url'];
        });

      this.spDetailsSubscriptions = this._utilService.localizationFromContextbar.subscribe(value => {
          if (value) {
              this.showLocalizationPanel = true;
          }
      });

      const deleteSharedRateSubscribe = this._utilService.deleteSharedRate.subscribe(value => {
          const widgetData = {
              pricelistId: this.pricelistId,
          };
          if (value) {
              this._sharedPricelistService.deleteSharedPricelist({
                  data: widgetData,
                  success: (result) => {
                        const loadPOUrl = '/ProductCatalog/SharedRatelist';
                        this._router.navigateByUrl(loadPOUrl);
                        this._utilService.breadCrumbDisplayNameEditorDelete({ pageTitle: 'TEXT_SHARED_RATES', actionType: 2 });
                  },
                  failure: (errorMsg: string, code: any) => {
                      this.deleteSRError = this._utilityService.errorCheck(code, errorMsg, 'DELETE');
                      this.isDeleteSRError = true;
                  }
              });
              this._utilService.changedeleteSharedRate(false);
          }
      });
      this.spDetailsSubscriptions.add(deleteSharedRateSubscribe);
      const approvalSubscription = this._utilService.isApprovalEdited.subscribe(value => {
        this.isApprovalUpdated = value;
      });
      this.spDetailsSubscriptions.add(approvalSubscription);
    } 
    hidePropertiesWidget(value) {
        if (value) {
            this.showLocalizationPanel = false;
        }
    }

    toggleWidgetSkeleton(widget) {
      switch (widget) {
        case 'properties':
          this.showSPPropertiesSkeleton = true;
          break;
        case 'subSettings':
          this.showInUseSkeleton = true;
          break;
        case 'extProperties':
          this.showSPExtPropertiesSkeleton = true;
          break;
        default:
          break;
      }
    }

    removeError() {
      return this.createSPErrorMessage = false;
    }

    getProductOfferDetails() {
      let timer;
      if (this.pricelistId) {
        this.widgetUpdated === true ? this.toggleWidgetSkeleton(this.widgetType) : this.showLoader = true;
          this._sharedPricelistService.getSharedPricelist({
          data: {
            pricelistId: this.pricelistId
          },
          success: (result) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                        this.selectedSharedPricelist = result;
              this._sharedPricelistService.changedisplayName(this.selectedSharedPricelist.displayName);
                        this._utilService.displayDeleteSRData({
                            name: this.selectedSharedPricelist.name, description: this.selectedSharedPricelist.description});
              this.getCurrenciesAndPartitions();
            }, 300);
          },
          failure: (errorMsg: string, code: any) => {
            this.errorMessage = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
          },
          onComplete: () => {
            setTimeout(() => {
              this.showLoader = false;
              this.showSPPropertiesSkeleton = false;
              this.showInUseSkeleton = false;
              this.showSPExtPropertiesSkeleton = false;
              this.showRateListMappings = false;
              this.widgetUpdated = false;
            }, 200);
          }
        });
      }
    }

    intervalEvent() {
      this.isIntervalContinue = setInterval(() => {
          this._utilService.changeprodOfferSkeletonLoader(true);
      }, 3000);
    }

    updateProductOffer(value) {
      this.widgetUpdated = true;
      this.widgetType = value;
      this.getProductOfferDetails();
    }

  private getCurrenciesAndPartitions() {
    this._utilityService.getCurrenciesAndPartitionsList({
      success: (result) => {
        this.spcurrencies = result['currencies'];
        this.sppartitions = result['partitions'];
        if (this.sppartitions != null && this.selectedSharedPricelist != null) {
          for (let i = 0; i < this.sppartitions.length; i++) {
            if (parseInt(this.sppartitions[i].accountId, 10) ===
              parseInt(this.selectedSharedPricelist.plpartitionid, 10)) {
              this.selectedPartition = this.sppartitions[i].login;
              break;
            }
          }
        }
      },
      failure: (error) => {
      }
    });
    }

    deleteErrorMessage() {
        this.isDeleteSRError = false;
    }

  onRateTableInfoLoad(value) {
    this.rateTableInfoLoading = value;
    if (value) {
      this.paramTableInfo = {};
    }
  }

  onRateTableInfoResponse(value) {
    this.paramTableInfo = value;
  }

  isParamTableInfo() {
    return this.paramTableInfo !== undefined && Object.keys(this.paramTableInfo).length > 0;
  }

  showAddRateTable() {
    this.addRateTableParam = {
      pricelistId : this.pricelistId
    };
    this.isAddRateTable = true;
  }

  onAddRateTableClick(event) {
    this.addRateTableParam = {
      pricelistId : this.pricelistId,
      templateId : event.templateId,
      displayName : event.displayName
    };
    this.isAddRateTable = true;
  }

  displayHttpErrors(event) {
    if(event){
      this.isRatelistMappingError = event.showError;
      this.rateDetailsFetchError = event.message;
    }
  }

  onAddRateTableClose(rateTableMapped) {
    this.isAddRateTable = false;
    this._sharedPricelistService.isRateTableMapped(rateTableMapped);
  }

  getSubscriptionCount() {
    if (this._utilityService.isObject(this.selectedSharedPricelist)) {
      const subscriptionCount = this.selectedSharedPricelist['inUseSubscribersSize'];
      return this._utilityService.isObject(subscriptionCount) ? subscriptionCount : 0;
    }
    return 0;
  }
  getPriceListUseInfo() {
    this.showLoader = true;
      let timer;
      if (this.pricelistId) {
          this._sharedPricelistService.getPricelistInUseInfo({
          data: {
            pricelistId: this.pricelistId
          },
          success: (result) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                        this.priceListInUseInfo = result;
            }, 300);
          },
          failure: (errorMsg: string, code: any) => {
            this.errorMessage =  this._utilityService.errorCheck(code, errorMsg, 'LOAD');
          },
          
          onComplete: () => {
            setTimeout(() => {
              this.showLoader = false;
              this.showSPPropertiesSkeleton = false;
              this.widgetUpdated = false;
            }, 200);
          }
        });
      }
    }

  canDeactivate() {
    if (this.isApprovalUpdated) {
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
    if (this.spDetailsSubscriptions) {
        this.spDetailsSubscriptions.unsubscribe();
    }
    this._utilService.checkIfDataUpdateMethod({});
  }
}
