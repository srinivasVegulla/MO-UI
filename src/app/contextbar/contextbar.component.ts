import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { contextBarHandlerService } from '../helpers/contextbarHandler.service';
import { utilService } from '../helpers/util.service';
import { modalService } from '../helpers/modal-dialog/modal.service';
import { ISubscription } from 'rxjs/Subscription';
import { SharedPricelistService } from '../sharedPricelist/shared.pricelist.service';
import { ProductService } from '../productOffer/productOffer.service';
import { UtilityService } from '../helpers/utility.service';
import { CapabilityService } from '../helpers/capabilities.service';

@Component({
  selector: 'ecb-contextBar',
  templateUrl: './contextbar.component.html',
  styleUrls: ['./contextbar.component.scss']
})
export class ContextbarComponent implements OnInit, OnDestroy {
  disableSaveBtn: boolean;
  saveProperties = false;
  savePermissions = false;
  deletePOPData: any = '';
  hidePOPData: any = '';
  unHidePOPData: any = '';
  deleteScheduleData: any = '';
  deletePO: any = '';
  deleteRateData: any = '';
  deleteSubscriptionData: any;
  showContextBar = false;
  SaveBtnType;
  visibilityContextBar = false;
  contextbarSubscriptions: any;
  isDeletePoEnable: boolean;
  isDeleteBundleEnable: boolean;
  confirmDialog;
  deleteBundleBoolean = false;
  deleteSRData: any;
  isDeleteSREnable: boolean;
  isPOConfigResult;
  offeringName;
  isDeletePItemplateEnable;
  deletePItemplateData;
  configLoading: boolean;
  systemBarConfiguration;
  topListMenu;
  isMobileDevice;
  mobileLocalization;
  mobileCheckConfig;
  disableDeletePoSubscribe;
  disableDeleteBundleSubscribe;
  isCancelEnable: boolean;
  deleteCalenderData;
  isDeleteCalendar: boolean;
  displayDeleteBtn: any;
  sharedRateDetailsDelete = true;
  showAprrovalBtn = false;

  constructor(private _contextBarHandlerService: contextBarHandlerService,
    private _utilService: utilService,
    private _modalService: modalService,
    private _sharedPricelistService: SharedPricelistService,
    private _productService: ProductService,
    private _utilityService: UtilityService,
    private _capabilityService: CapabilityService) {
    this.confirmDialog = 0;
  }
  ngOnInit() {
    this.showAprrovalBtn = false;
    this.isDeleteSREnable = false;
    this.isDeleteCalendar = false;
    this.isDeletePItemplateEnable = false;
    this.isCancelEnable = false;
    this.contextbarSubscriptions = this._utilService.deletePOPData.subscribe(deletePOPData => {
      if (Object.keys(deletePOPData).length > 0) {
        this.deletePOPData = deletePOPData;
      }
    });
    const contextbarSaveButtonSubscribe = this._contextBarHandlerService.observableContextbarSaveButton.subscribe(disableSaveBtn => {
      this.disableSaveBtn = disableSaveBtn;
    });
    this.contextbarSubscriptions.add(contextbarSaveButtonSubscribe);
    const showContextBarSubscribe = this._contextBarHandlerService.observableShowContextBar.subscribe(showContextBar => {
      this.showContextBar = showContextBar;
    });
    this.contextbarSubscriptions.add(showContextBarSubscribe);
    const dynamicSaveBtnSubscribe = this._utilService.dynamicSaveBtn.subscribe(dynamicSaveBtn => {
      setTimeout(() => {
        this.SaveBtnType = dynamicSaveBtn;
        if (dynamicSaveBtn === 'adjustmentReasons') {
          this.SaveBtnType = "";
        }
        this._utilService.calculateInnerWidthHeight(this.SaveBtnType);
      }, 100);
    });
    this.contextbarSubscriptions.add(dynamicSaveBtnSubscribe);
    this.disableDeletePoSubscribe = this._utilService.disableDeletePo.subscribe(disableDeletePo => {
      if (disableDeletePo['delete']) {
        this.isDeletePoEnable = disableDeletePo['delete'];
      } else {
        this.isDeletePoEnable = false;
      }
    });
    const displayApprovalCheck = this._utilService.approvalBtnShow.subscribe(approvalCheck => {
        if (approvalCheck['approval']['hasPendingApprovals'] === true && approvalCheck['Capabilities']['View_Approvals'] === true) {
          this.showAprrovalBtn = true;
        } else {
          this.showAprrovalBtn = false;
        }
    });
    this.contextbarSubscriptions.add(displayApprovalCheck);
    this.disableDeleteBundleSubscribe = this._utilService.disableDeleteBundle.subscribe(disableDeleteBundle => {
      if (disableDeleteBundle['delete']) {
        this.isDeleteBundleEnable = disableDeleteBundle['delete'];
      } else {
        this.isDeleteBundleEnable = false;
      }
    });
    this.contextbarSubscriptions.add(this.disableDeletePoSubscribe);

    const displayDeleteSRData = this._utilService.deleteSRData.subscribe(deleteSRData => {
      if (Object.keys(deleteSRData).length > 0) {
        this.deleteSRData = deleteSRData;
      }
    });
    this.contextbarSubscriptions.add(displayDeleteSRData);

    const deletePItemplateData = this._utilService.deleteablePItemplateData.subscribe(data => {
      if (data) {
        this.deletePItemplateData = data;
        this.isDeletePItemplateEnable = data['delete'];
      }
    });
    this.contextbarSubscriptions.add(deletePItemplateData);

    const isDeleteSRData = this._sharedPricelistService.selectedSharedListBreadcrumbData.subscribe(obj => {
      if (obj != null) {
        this.isDeleteSREnable = obj['useAccCount'] > 0 || obj['offeringsCount'] > 0 ? false : true;
      }
    });
    this.contextbarSubscriptions.add(isDeleteSRData);

    /*click localization link from mobile view breadcrumb*/
    this.mobileLocalization = this._utilService.showLocalizationInMobileBreadcrumbObs.subscribe(val => {
      if (val) {
        this.displayCoverHandlerPO();
      }
    });

    this.mobileCheckConfig = this._utilService.showConfigurationInMobileBreadcrumbObs.subscribe(val => {
      if (val) {
        this.checkConfigurationDetails();
      }
    });
    this._utilService.localizationChanges.subscribe(value => {
      if (value) {
        this.isCancelEnable = true;
      } else {
        this.isCancelEnable = false;
      }
    });
    const deleteCalenderData = this._utilService.deleteableCalendarData.subscribe(data => {
      if (data !== null ) {
        this.deleteCalenderData = data;
        this.isDeleteCalendar = this.deleteCalenderData['usageCount'] > 0;
      }
    });
    this.contextbarSubscriptions.add(deleteCalenderData);

    const showDeleteButtonSubscription = this._utilService.showDeleteButton.subscribe(data => {
      setTimeout(() => {
        this.displayDeleteBtn = data;
      }, 100);
    });
    this.contextbarSubscriptions.add(showDeleteButtonSubscription);

    const showRatesDeleteButton = this._utilService.showDeleteButton.subscribe(data => {
      setTimeout(() => {
        this.displayDeleteBtn = data;
      }, 100);
    });
  }

  // Save RateSchedule information into database from PIdetails Page.
  SavePIRateScheduleDetails() {
    this._utilService.SavePIRateSchedules.next(true);
  }

  addProductOfferDetails() {
    this._contextBarHandlerService.saveProperties.next(true);
    this._contextBarHandlerService.savePermissions.next(true);
  }

  deleteProductOfferDetails() {
    this.confirmDialog = 1;
  }

  deleteCalendarDetails() {
    this.confirmDialog = 5;
  }
  onCloseDeleteCalendar(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this._utilService.changeDeleteCalendar(true);
    }
  }

  onModalDialogCloseCancel(event) {
    this.confirmDialog = 0;
    this.deleteBundleBoolean = false;
    if (event.index === 1) {
      this._utilService.changedeleteProductOffer(true);
    }
  }

  deleteSubscription() {
    this._modalService.changeDeleteMessage('deleteSubscription');
  }

  deleteBundle() {
    this.confirmDialog = 1;
    this.deleteBundleBoolean = true;
  }
  ngOnDestroy() {
    if (this.contextbarSubscriptions) {
      this._utilService.changeApprovalBtn({ approval: ''});
      this.contextbarSubscriptions.unsubscribe();
    }

    if (this.systemBarConfiguration) {
      this.systemBarConfiguration.unsubscribe();
    }

    if (this.mobileLocalization) {
      this._utilService.showLocalizationInMobileBreadcrumb(false);
      this.mobileLocalization.unsubscribe();
    }

    if (this.mobileCheckConfig) {
      this._utilService.showConfigurationInMobileBreadcrumb(false);
      this.mobileCheckConfig.unsubscribe();
    }
    if (this.disableDeletePoSubscribe) {
      this.disableDeletePoSubscribe.unsubscribe();
    }
  }
  displayCoverHandlerPO() {
    this._utilService.changeLocalizationFromContextbar(true);
  }
  displayApprovalPanel() {
    this._utilService.changeApprovalFromContextbar(true);
  }
  SaveLocalizationUpdate() {
    this._utilService.checkIsSaveButtonClickedLocalization(true);
  }
  cancelLocalization() {
    this._utilService.checkCancelLocalization(true);
  }

  deleteSharedRatelist() {
    this.confirmDialog = 2;
  }

  onCloseDeleteSharedRate(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this._utilService.changedeleteSharedRate(true);
    }
  }

  deletePItemplateRecord() {
    this.confirmDialog = 4;
  }

  onCloseDeletePItemplate(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this._utilService.changeDeletePItemplate(true);
    }
  }

  onModelConfigDialogClose(event) {
    this.confirmDialog = 0;
  }

  checkConfigurationDetails() {
    this.offeringName = JSON.parse(localStorage.getItem('displayInfo'));
    this.configLoading = true;

      this._productService.getPOConfiguration({
        data : {
          productOfferId : localStorage.getItem('offerId')
        },
        success : (result) => {
          this.isPOConfigResult = result;
        },
        failure : (error, errorCode, errorMessage) => {
          const errorMsg = typeof errorMessage.error === 'string' ? JSON.parse(errorMessage.error) : errorMessage.error;
          this.isPOConfigResult = errorMsg.message;
        },
        onComplete : () => {
          this.configLoading = false;
          this.confirmDialog = 3;
        }
      });

  }

  isTicketLogin() {
    return !this._utilityService.isEmpty(sessionStorage.getItem('ticket'));
  }
  cancelPopUP() {
    this.confirmDialog = 6;
  }
  onModalDialogLocalizationCancel(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this.cancelLocalization();
      this.isCancelEnable = false;
    } else {
      this.isCancelEnable = true;
    }
  }

}
