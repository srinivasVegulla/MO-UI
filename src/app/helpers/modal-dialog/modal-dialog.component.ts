import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { utilService } from '../util.service';
import { Router } from '@angular/router';
import { ProductService } from '../../productOffer/productOffer.service';
import { contextBarHandlerService } from '../contextbarHandler.service';
import { modalService } from './modal.service';
import { Language, LocaleService } from 'angular-l10n';
import { ProductOffersListService } from '../../productOfferList/productOfferList.service';
import { sharedService } from '../../productOffer/sharedService';
import { RatesService } from '../../rates/rates.service';
import { calenderLocaleFeilds } from '../../../assets/calenderLocalization';

@Component({
  selector: 'ecb-dialog',
  templateUrl: './modal-dialog.component.html',
})
export class ModalDialogComponent implements OnInit,OnDestroy {
  disableSaveBtn: boolean;
  saveProperties: boolean = false;
  savePermissions: boolean = false;
  public visible = false;
  private redirectUrl: string;
  SaveBtnType;
  popupHeaderName: string = '';
  //popupBodyName:string = '';
  /* createPOPUPHeadMsg: string = ''; */
  createPOPUPBodyMsg: string = '';
  deleteContainer:boolean =  false;
  deleteMessage: boolean = false;
  deleteModalPOFromList: boolean;
  deletePOFromDetails: boolean;
  deleteModalRateFromList: boolean = false;
  popupHeader : boolean = false;
  widgetHandler: string = "";
  saveUnsave: boolean = false;
  rateIndex: number;
  deleteScheduleMessage: boolean = false;
  ratesLength: number = 0;
  popupBodyName: any;
  rateData: object;
  deletePODetails:boolean= false;
  deleteSubscription:boolean= false;
  hidePO:boolean= false;
  deleteSubscriptionDetails:boolean = false;
  unHidePO:boolean = false;
  poListUrl:string = "/ProductCatalog/Offerings";
  editRateSourcePopup;
  createOffering: boolean = false;
  deleteBundleFromDetails: boolean = false;
  modalDialogSubscriptions:any;
  localeDateFormat: any;
  calenderLocale;
  currentLocale;

  constructor(private _utilService: utilService,
    private _productService: ProductService,
    private _router: Router,
    private _contextBarHandlerService: contextBarHandlerService,
    private _modalService: modalService,
    private _productOffersListService: ProductOffersListService,
    private _sharedService: sharedService,
    private _ratesService: RatesService,
    private locale: LocaleService) { }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
    if (this.widgetHandler == "schedules")
    this._utilService.changedynamicSaveBtn("EditSchedules");
  }

  ngOnInit() {
    this.currentLocale = this.locale.getCurrentLocale();
    this.calenderLocale = calenderLocaleFeilds[this.currentLocale];
    this.localeDateFormat = this.calenderLocale.localeDateFormat;
    this.modalDialogSubscriptions = this._contextBarHandlerService.observableContextbarSaveButton.subscribe(disableSaveBtn => {
      this.disableSaveBtn = disableSaveBtn;
    });
    
    
    const editRateSourceObservableSubscribe = this._modalService.editRateSourceObservable.subscribe(editRateSourcePopup => {
      this.editRateSourcePopup = editRateSourcePopup;
      this.saveUnsave = false;
       this.deleteContainer = false;
       this.deletePODetails = false;
       this.deleteScheduleMessage = false;
       this.deleteModalRateFromList = false;
       this.deleteModalPOFromList = false;
       this.deletePOFromDetails = false;
       this.deleteSubscription = false;
       this.hidePO = false;
       this.unHidePO = false;
    });
    this.modalDialogSubscriptions.add(editRateSourceObservableSubscribe);
    /* const observablePOPUPHeadTextSubscribe = this._modalService.observablePOPUPHeadText.subscribe(headText => {
      this.popupHeaderName = headText;
    }); */
    /* this.modalDialogSubscriptions.add(observablePOPUPHeadTextSubscribe); */
    /* const observablecreatePOPUPBodyTextSubscribe = this._modalService.observablecreatePOPUPBodyText.subscribe(bodyText => {
      this.popupBodyName = bodyText;
    }); */
    /* this.modalDialogSubscriptions.add(observablecreatePOPUPBodyTextSubscribe); */
    const observableDeleteMessageSubscribe = this._modalService.observableDeleteMessage.subscribe(Msg => {
        this.popupHeader=true;
        this.deleteContainer = true;
        this.editRateSourcePopup = false;
     if(Msg== "deletePOPUPDetails")
     {
        this.deletePODetails = true;
        this.deletePOFromDetails = true;
        this.deleteModalPOFromList = false;
        this.deleteScheduleMessage = false;
        this.saveUnsave = false;
        this.deleteModalRateFromList = false;
        this.deleteSubscription = false;
        this.deleteSubscriptionDetails = false;
        this.widgetHandler = "";
        this._utilService.changeDeletePOPData({});
        this.hidePO = false;
        this.unHidePO = false;
      }
      else if (Msg == "deleteRatePOPUP") {
       this.deleteModalRateFromList = true;
       this.deletePODetails = false;
       this.deleteScheduleMessage = false;
       this.saveUnsave = false;
       this.deleteModalPOFromList = false;
       this.deletePOFromDetails = false;
       this.deleteSubscription = false;
       this.deleteSubscriptionDetails = false;
       this.widgetHandler = "";
       this.hidePO = false;
       this.unHidePO = false;
      }
      else if (Msg == "deletePOPUPScedule") {
       this.deletePODetails = false;
        this.deleteScheduleMessage = true;
       this.deleteModalRateFromList = false;
        this.saveUnsave = false;
       this.deleteModalPOFromList = false;
       this.deletePOFromDetails = false;
       this.deleteSubscription = false;
       this.deleteSubscriptionDetails = false;
       this.hidePO = false;
       this.widgetHandler = "";
       this.unHidePO = false;
     }
     else if(Msg== "deleteSubscription")
     {
       this.deleteSubscription = true;
       this.deleteSubscriptionDetails = true;
       this.deletePODetails = false;
       this.deleteScheduleMessage = false;
       this.deleteModalRateFromList = false;
       this.deleteModalPOFromList = false;
       this.deletePOFromDetails = false;
       this.saveUnsave = false;
       this.hidePO = false;
       this.widgetHandler = "";
       this.unHidePO = false;
      }
      else if (Msg == "hidePOPUP"){
        this.popupHeader=true;
        this.deleteContainer = true;
        this.deletePODetails = false;
        this.deleteModalPOFromList = false;
        this.deletePOFromDetails = false;
        this.deleteScheduleMessage = false;
        this.saveUnsave = false;
        this.deleteModalRateFromList = false;
        this.hidePO = true;
        this.unHidePO = false; 
      }
      else if (Msg == "unHidePOPUP"){
        this.popupHeader=true;
        this.deleteContainer = true;
        this.deletePODetails = false;
        this.deleteModalPOFromList = false;
        this.deletePOFromDetails = false;
        this.deleteScheduleMessage = false;
        this.saveUnsave = false;
        this.deleteModalRateFromList = false;
        this.hidePO = false;
        this.unHidePO = true;
     } else if (Msg == "deleteBundle") {
       this.deletePODetails = true;
       this.deleteBundleFromDetails = true;
       this.deleteModalPOFromList = false;
       this.deleteScheduleMessage = false;
       this.saveUnsave = false;
       this.deleteModalRateFromList = false;
       this.deleteSubscription = false;
       this.deleteSubscriptionDetails = false;
       this.widgetHandler = "";
       this._utilService.changeDeletePOPData({});
       this.hidePO = false;
       this.unHidePO = false;
     }
      else {
       this.saveUnsave = true;
       this.deleteContainer = false;
       this.deletePODetails = false;
       this.deleteScheduleMessage = false;
       this.deleteModalRateFromList = false;
       this.deleteModalPOFromList = false;
       this.deletePOFromDetails = false;
       this.deleteSubscription = false;
       this.hidePO = false;
       this.unHidePO = false;
      this.editRateSourcePopup = false;
      }
  });
    this.modalDialogSubscriptions.add(observableDeleteMessageSubscribe);
  const dynamicSaveBtnSubscribe = this._utilService.dynamicSaveBtn.subscribe(dynamicSaveBtn => {
      this.SaveBtnType = dynamicSaveBtn;
      this.widgetHandler = "";
      this.saveUnsave = true;
      this.popupHeader = true;
      this.deleteContainer = false;
      this.deletePODetails = false;
      this.deleteScheduleMessage = false;
      this.deleteModalRateFromList = false;
      this.deleteModalPOFromList = false;
      this.deletePOFromDetails = false;
      this.deleteSubscription = false;
      this.deleteSubscriptionDetails = false;
      this.unHidePO = false;
      this.hidePO = false;
    });
    this.modalDialogSubscriptions.add(dynamicSaveBtnSubscribe);
    //propoerties unsaved changes buttons handler
    /* const propertiesUnsavedChangesHandlerSubscribe = this._sharedService.propertiesUnsavedChangesHandler.subscribe(value => { */
      /* this.widgetHandler = value;
      if (value === "hideProductOffer" || value === "showProductOffer") {
        this.saveUnsave = false;
      } else {
        this.saveUnsave = true;
      } */
      /* this.deletePODetails = false;
      this.deleteModalPOFromList = false;
      this.deletePOFromDetails = false;
      this.deleteScheduleMessage = false;
      this.deleteModalRateFromList = false;
      this.deleteSubscription = false;
      this.deleteSubscriptionDetails = false;
      this.deleteContainer = false;
      this.editRateSourcePopup = false;
    }); */
    /* this.modalDialogSubscriptions.add(propertiesUnsavedChangesHandlerSubscribe); */
    const localizationUnsavedChangesHandler = this._sharedService.localizationUnsavedChangesHandler.subscribe(value => {
      this.widgetHandler = value;
      if (value == "save localization changes") {
        this.saveUnsave = false;
      } else {
        this.saveUnsave = true;
      }
      this.deletePODetails = false;
      this.deleteModalPOFromList = false;
      this.deletePOFromDetails = false;
      this.deleteScheduleMessage = false;
      this.deleteModalRateFromList = false;
      this.deleteSubscription = false;
      this.deleteSubscriptionDetails = false;
      this.deleteContainer = false;
    });
    this.modalDialogSubscriptions.add(localizationUnsavedChangesHandler);
    const schedulesUnsavedChangesHandlerSubscribe = this._utilService.schedulesUnsavedChangesHandler.subscribe(value =>{
      this.widgetHandler = value;
      this.saveUnsave = true;
      this.popupHeader = true;
      this.deleteContainer = false;
      this.deletePODetails = false;
      this.deleteScheduleMessage = false;
      this.deleteModalRateFromList = false;
      this.deleteModalPOFromList = false;
      this.deletePOFromDetails = false;
      this.deleteSubscription = false;
      this.deleteSubscriptionDetails = false;
      this.unHidePO = false;
      this.hidePO = false;
      this.editRateSourcePopup = false;
   });
   this.modalDialogSubscriptions.add(schedulesUnsavedChangesHandlerSubscribe);
   const ratesUnsavedChangesHandlerSubscribe = this._utilService.ratesUnsavedChangesHandler.subscribe(value =>{ 
    this.widgetHandler = value;
    this.saveUnsave = false;
    this.popupHeader = true;
    this.deleteContainer = false;
    this.deletePODetails = false;
    this.deleteScheduleMessage = false;
    this.deleteModalRateFromList = false;
    this.deleteModalPOFromList = false;
    this.deletePOFromDetails = false;
    this.deleteSubscription = false;
    this.deleteSubscriptionDetails = false; 
  });
   this.modalDialogSubscriptions.add(ratesUnsavedChangesHandlerSubscribe);
   const editRateSourceUnsavedChangesHandlerSubscribe = this._ratesService.editRateSourceUnsavedChangesHandler.subscribe(value => {
    //this.editRateSourceHandler = value;
    this.widgetHandler = value;
    this.saveUnsave = true;
    this.popupHeader = true;
    this.deleteContainer = false;
    this.deletePODetails = false;
    this.deleteScheduleMessage = false;
    this.deleteModalRateFromList = false;
    this.deleteModalPOFromList = false;
    this.deletePOFromDetails = false;
    this.deleteSubscription = false;
    this.deleteSubscriptionDetails = false;
    this.unHidePO = false;
    this.hidePO = false;
    this.editRateSourcePopup = false;
  });
  this.modalDialogSubscriptions.add(editRateSourceUnsavedChangesHandlerSubscribe);
  const deleteRateScheduleErrorSubscribe = this._utilService.deleteRateScheduleError.subscribe(value => {
    if (value['modalStatus']) {
      this.ratesLength = value['len'];
      this.deleteScheduleMessage = true;
      this.show();
    }
  });
  this.modalDialogSubscriptions.add(deleteRateScheduleErrorSubscribe);
  const isSchedulesFormUpdatedSubscribe = this._utilService.isSchedulesFormUpdated.subscribe(value => {
  });
  this.modalDialogSubscriptions.add(isSchedulesFormUpdatedSubscribe);
  const createOfferingListSUbscribe = this._utilService.createOfferingList.subscribe(value => {
    if (value) {
      this.createOffering = true;
      this.show();
    } else {
      this.createOffering = false;
    }
  });
  this.modalDialogSubscriptions.add(createOfferingListSUbscribe);
  }

  leaveDoNotSave() {
    this._productService.nextStateURL.subscribe(value => {
      this.redirectUrl = value;
    });
    this.hide();
    window.location.href = this.redirectUrl;
  }

  addProductOfferDetails() {
    this._contextBarHandlerService.saveProperties.next(true);
    this._contextBarHandlerService.savePermissions.next(true);
    this._productService.nextStateURL.subscribe(value => {
      this.redirectUrl = value;
    });
    this.hide();
    window.location.href = this.redirectUrl;
  }

  //Save RateSchedule information into database from PIdetails Page.
  SavePIRateScheduleDetails() {
    this._utilService.SavePIRateSchedules.next(true);
    this.hide();
  }

  /* deleteProductOfferDetails() {
    alert("hello");
    this._utilService.changedeleteProductOffer(true);
    this.hide();
  } */

  deleteBundle() {
    this._utilService.changedeleteProductOffer(true);
    this.hide();
  }


  deletePOPUPCancel() {
    this.hide();
  }


  /*Properties widget unsaved changes buttons handler start*/
  updatePropertiesWidgetDetails() {
  }

  navigateToPOList() {
    this.hide();
    window.location.href = this.poListUrl;
  }

  leavePropertiesWidget() {
    this.hide();
  }

  hideProductOffer() {
    this._utilService.changeHideProductOfferFlag(true);
    this.hide();
  }
  showProductOffer() {
    this._utilService.changeShowProductOfferFlag(true);
    this.hide();
  }
  cancelHidingPO() {
    this.hide();
  }
  
  unHideProductOffer(){
   this._productOffersListService.changeUnHidePOFromList(true);
   this.hide(); 
  }

  /* @HostListener('document:keydown', ['$event'])
  function(event) {
  if(event.key=="Escape"){
       this.hide();
  }
} */
     
  leaveSchedulesWidget(){
    this.hide();
     this._utilService.changedynamicSaveBtn("EditSchedules");
  }

    leaveDoNotSaveSchedules() {
    this._ratesService.nextStateURL.subscribe(value => {
      this.redirectUrl = value;
    });
    this.hide();
    window.location.href = this.redirectUrl;
  }

  cancelRateSourceWidget(){
    this.hide();
    this._ratesService.changeRateSourceCancelHandler(true);

  }

  CopyAndReplacerates(){
    this.hide();
    this.widgetHandler = "";
  }
  cancelCopyOfRateSource(){
    this.hide();
    this.widgetHandler = "";
  }

  SaveLocalizationChanges(){
    this._utilService.checkIsChangesSavedPopupLocalization(true);
    this.hide();
  }

  hidePopupLocalization(){
    this._utilService.checkIsDonotSavePopupLocalization(true);
    this.hide();
  }

  triggerOffering(item) {
    switch (item) {
      case 'bundle':
        this._utilService.changeCreateOffering('bundle');
        break;
      case 'productOffer':
        this._utilService.changeCreateOffering('productOffer');
        break;
      default:
        this._utilService.changeCreateOffering('');
        break;
    }
    this.hide();
    this._utilService.showCreateOfferingList(false);
  }

  ngOnDestroy() {
    if (this.modalDialogSubscriptions) {
      this.modalDialogSubscriptions.unsubscribe();
    }
  }
}
