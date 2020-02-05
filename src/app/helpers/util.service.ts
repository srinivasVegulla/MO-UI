import { Component, Injectable, Inject} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http, Response } from '@angular/http';
import { Language } from 'angular-l10n';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class utilService {
  copyRights;
  @Language() language: string;
  private isPropertiesFormDirty: boolean = false;
  private isPermissionsFormDirty: boolean = false;
  private isExtPropFormDirty: boolean = false;
  private isProductOfferModified = false;
   private isSchedulesFormDirty:boolean = false;
  private copyRightsInfo = new BehaviorSubject<string>('');
  public extend: any;
  private isCalendarFormDirty: Boolean = false;
  observableCopyRights = this.copyRightsInfo.asObservable();
  @Inject('Window') private window: Window;
  public listOfLanguageFilters = ["English(UK)",
  "English(US)",
  "French",
  "German",
  "Spanish",
  "Japanese",
  "Portuguese-Brazil",
  "Italian",
  "Spanish-Mexican",
  "Hebrew",
  "Danish",
  "Swedish",
  "Arabic"
]
  public fixedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!()*]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }
  // Update PO - verifies whether Properties form updated
  public isPropertiesFormUpdated = new BehaviorSubject<boolean>(false);
  public isPermissionsFormUpdated = new BehaviorSubject<boolean>(false);
  public isExtPropertiesFormUpdated = new BehaviorSubject<boolean>(false);
  public isProductOfferUpdated = new BehaviorSubject<boolean>(false);

  public inValidKeys: number[];
  checkIsPropertiesFormUpdated(value) {
      this.isPropertiesFormUpdated.next(value);
  }
  // Update PO - verifies whether Permissions form updated
  checkIsPermissionsFormUpdated(value) {
      this.isPermissionsFormUpdated.next(value);
  }
  // Update PO - verifies whether Extended Properties form updated
  checkIsExtPropertiesFormUpdated(value) {
      this.isExtPropertiesFormUpdated.next(value);
  }
  // Update PO - verifies whether Product Offer is updated
  changeIsProductOfferUpdated(value) {
    this.isProductOfferUpdated.next(value);
  }
  //Update Schedules - verifies whether schedules  form updated
  public isSchedulesFormUpdated = new BehaviorSubject<boolean>(false);
  checkIsSchedulesFormUpdated(value) {
      this.isSchedulesFormUpdated.next(value);
  }

  //savechanges is clicked from localization popup
  public isChangesSavedPopupLocalization = new BehaviorSubject<boolean>(false);
  checkIsChangesSavedPopupLocalization(value) {
    this.isChangesSavedPopupLocalization.next(value);
  }

  //donot save is clicked from localization popup
  public isDonotSavePopupLocalization = new BehaviorSubject<boolean>(false);
  checkIsDonotSavePopupLocalization(value) {
    this.isDonotSavePopupLocalization.next(value);
  }

  //context bar save button is clicked from localization
  public isSaveButtonClickedLocalization = new BehaviorSubject<boolean>(false);
  checkIsSaveButtonClickedLocalization(value) {
    this.isSaveButtonClickedLocalization.next(value);
  }
  public isCancelLocalization = new BehaviorSubject<boolean>(false);
  checkCancelLocalization(value) {
    this.isCancelLocalization.next(value);
  }

  //context bar save button is clicked from localization
  public isDataChangedLocalization = new BehaviorSubject<boolean>(false);
  checkIsDataChangedLocalization(value) {
    this.isDataChangedLocalization.next(value);
  }
  constructor(private http: Http) {
    this.inValidKeys = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 
      31, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 91, 92, 93, 112, 113, 114, 115, 116, 117, 118, 119, 
      120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141,
      142, 143, 144, 145 ];
    this.http.get('/static/default/localeConfig/copyRights.json')
                .map(response => response.json())
                .subscribe(data => {
                      this.copyRights = data;
    });
    this.init();
  }

  changeCopyRightsInfo(lang:string){
  	this.copyRightsInfo.next(this.copyRights[lang]);
  }

  //display user name in systembar
  private userName = new BehaviorSubject<string>("");
  observableuserName = this.userName.asObservable();
  changeUserName(user:string){
    this.userName.next(user);
  }

  private showScroll = new BehaviorSubject<Boolean>(true);
  observableShowScroll = this.showScroll.asObservable();
  changeScrollOption(value: boolean){
    this.showScroll.next(value);
  }

  //update page title in mobile device
  public observablePageTitle = new BehaviorSubject<string>('TEXT_SUBSCRIBABLE_ITEMS');
  changePageTitle(title: string) {
    this.observablePageTitle.next(title);
  }

   //Holds the rate schedule to display the corresponding rate table
  public rateSchedulerID = new BehaviorSubject<object>({});
  changeRateSchedulerID(value) {
    this.rateSchedulerID.next(value);
  }

  public deleteProductOffer = new BehaviorSubject<boolean>(false);
    observabledeleteProductOffer = this.deleteProductOffer.asObservable();
    changedeleteProductOffer(value:boolean){
    this.deleteProductOffer.next(value);
  }

  //opening modalpopup of addpriceableitems in productofferdetails
  public addPriceableItemToPO = new BehaviorSubject<boolean>(true);
  //observableAddPriceableItemToPO = this.addPriceableItemToPO.asObservable();
    changeAddPriceableItemToPO(value: boolean){
    this.addPriceableItemToPO.next(value);
    }
    
  public deleteRateScheduleError = new BehaviorSubject<string>("");
  observableDeleteRateScheduleError = this.deleteRateScheduleError.asObservable();
  changeDeleteRateScheduleError(title: string){
    this.deleteRateScheduleError.next(title);
   }

  //selected Pi to be added to the PO
  public selectedPiToBeAdded = new BehaviorSubject<object>({});
  observableSelectedPiToBeAdded = this.selectedPiToBeAdded.asObservable();
    changeSelectedPiToBeAdded(value: object){
    this.selectedPiToBeAdded.next(value);
  }

  //Exisiting PriceableItems in PO to be checked in PI list
  public existingPiList = new BehaviorSubject<object>({});
  observableExistingPiList = this.existingPiList.asObservable();
    changeExistingPiList(value: object){
    this.existingPiList.next(value);
  }

  //Check to know to add or delete PI in the selected PO
  public checkToAddOrDeletePI = new BehaviorSubject<boolean>(false);
  observableCheckToAddOrDeletePI = this.checkToAddOrDeletePI.asObservable();
    changeCheckToAddOrDeletePI(value: boolean){
    this.checkToAddOrDeletePI.next(value);
  }

  // CreatePOForm Validation
  isFormDirty() {
        this.isPropertiesFormUpdated.subscribe(value => {
            this.isPropertiesFormDirty = value ? true : false;
        });
        this.isPermissionsFormUpdated.subscribe(value => {
            this.isPermissionsFormDirty = value ? true : false;
        });
        this.isExtPropertiesFormUpdated.subscribe(value => {
            this.isExtPropFormDirty = value ? true : false;
        });
        this.isProductOfferUpdated.subscribe(value => {
          this.isProductOfferModified = value ? true : false;
        });
        return (this.isPropertiesFormDirty || this.isPermissionsFormDirty || this.isExtPropFormDirty ) && !this.isProductOfferModified;
    }
    init(){
      this.extend = (this && this.extend) || Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
      }
    }

    // sending name and discription to POP while deleting PO
   public deletePOPData = new BehaviorSubject<object>({name:"",description:""});
    obeservableDeletePOPData = this.deletePOPData.asObservable();    
    changeDeletePOPData(message:object) {
      this.deletePOPData.next(message)
    }

  /*This is used to display Save button in Context bar as well as in Model popup
   to Save different Forms in different Components*/
  public SavePIRateSchedules = new BehaviorSubject<boolean>(false);
  public dynamicSaveBtn = new BehaviorSubject<string>("");
  changedynamicSaveBtn(value){
    this.dynamicSaveBtn.next(value);
  }

  //find unsaved changes status in priceableItemDetails page
  public priceableItemDetailsUnSavedChanges = new BehaviorSubject<boolean>(false);
  changePIDetailsUnsaveStatus(value){
    this.priceableItemDetailsUnSavedChanges.next(value);
  }

  //calling the PI function again after new PI's are added to the List
  public callPiListAfterAddingNewPi = new BehaviorSubject<boolean>(false);
    observableCallPiListAfterAddingNewPi = this.callPiListAfterAddingNewPi.asObservable();
    changeCallPiListAfterAddingNewPi(message:boolean){
      this.callPiListAfterAddingNewPi.next(message);
    }

  //opening modalpopup of addsubscriptionitems in productofferdetails
  public addSubscriptionItemToPO = new BehaviorSubject<boolean>(false);
  observableAddSubscriptionItemToPO = this.addSubscriptionItemToPO.asObservable();
    changeAddSubscriptionItemToPO(value: boolean){
    this.addSubscriptionItemToPO.next(value);
   }

   public addSubscriptionItemToPO1 = new BehaviorSubject<boolean>(true);
     changeAddSubscriptionItemToPO1(value: boolean){
     this.addSubscriptionItemToPO1.next(value);
    }

  //display whether it is child or parent
   public piInstanceChildShow = new BehaviorSubject<object>({parent:false,child:false});
   observablePiInstanceChildShow= this.piInstanceChildShow.asObservable();
  changePiInstanceChildShow(value:object){
    this.piInstanceChildShow.next(value);
  }

  //calling the Subscription function again after new Subscription's are added to the List
  public callSubscriptionListAfterAddingNew = new BehaviorSubject<boolean>(false);
    observableCallSubscriptionListAfterAddingNew = this.callSubscriptionListAfterAddingNew.asObservable();
    changeCallSubscriptionListAfterAddingNew(value:boolean){
      this.callSubscriptionListAfterAddingNew.next(value);
  }

  //open modal pop up to delete rate schedule
  public showDeleteScheduleModal = new BehaviorSubject<object>({modalStatus:false,deleteRowIndex:-1,scheduleData:{}});
  observableShowDeleteScheduleModal = this.showDeleteScheduleModal.asObservable();
  changeShowDeleteScheduleModal(value: object){
    this.showDeleteScheduleModal.next(value);
  }

  //Displaying Title in Child PI Detail Pages
  public itemInstanceDisplayName = new BehaviorSubject<string>("");
    currentitemInstanceDisplayName = this.itemInstanceDisplayName.asObservable();
    changeitemInstanceDisplayName(message:string){
      this.itemInstanceDisplayName.next(message)
    }
  //Displaying Title

    public displayName = new BehaviorSubject<string>("");
    currentDisplayName = this.displayName.asObservable();
    changedisplayName(message:string){
      this.displayName.next(message)
    }

    public isDisplayName = new BehaviorSubject<boolean>(false);
    currentIsDisplayName = this.isDisplayName.asObservable();
    changeIsDisplayName(message:boolean){
      this.isDisplayName.next(message);
    }

  //hideing product offer from list when clicking inside modalpopup
  public hidePOFromList = new BehaviorSubject<object>({modalStatus: false,errorIndex: -1,offerData: {}});
  //below line commented by RC
  
    changeHidePOFromList(value: object){
    this.hidePOFromList.next(value);
    }
    //open delete modal popup with the selected subscription properties
    public deleteSubscription = new BehaviorSubject<object>({modalStatus: false,errorIndex: -1,subscriptionData: {}});
    observableDeleteSubscription = this.deleteSubscription.asObservable();
    changeDeleteSubscription(value: object){
      this.deleteSubscription.next(value);
    }
  //delete the selected rate schedule by calling the REST API
  public hideProductOfferFlag = new BehaviorSubject<boolean>(false);
  changeHideProductOfferFlag(value: boolean){
    this.hideProductOfferFlag.next(value);
  }

  public showProductOfferFlag = new BehaviorSubject<boolean>(false);
  changeShowProductOfferFlag(value: boolean) {
    this.showProductOfferFlag.next(value);
  }
  public schedulesUnsavedChangesHandler = new BehaviorSubject<string>("");
  public ratesUnsavedChangesHandler = new BehaviorSubject<string>("");
  public rateTableUnsavedCancelButtonHandler = new BehaviorSubject<boolean>(false);

  public hidePOError = new BehaviorSubject<string>("");
  observableHidePOError = this.hidePOError.asObservable();
  changeHidePOError(title: string){
    this.hidePOError.next(title);
   }
  public observabletogglebreadcrumb = new BehaviorSubject<number>(0);
  changetoggleBreadCrumb(value){
    this.observabletogglebreadcrumb.next(value);
  }
  public deleteSelectedSubscription = new BehaviorSubject<boolean>(false);
  observableDeleteSelectedSubscription = this.deleteSelectedSubscription.asObservable();
  changeDeleteSelectedSubscription(value: boolean){
    this.deleteSelectedSubscription.next(value);
  }
  //selected Offer sending to breadcrumb
  public selectedOfferBreadcrumbData = new BehaviorSubject<object>({});
  changeSelectedOfferBreadcrumbData(value: object) {
    this.selectedOfferBreadcrumbData.next(value);
  }
  
   public unHidePOFromList = new BehaviorSubject<object>({modalStatus: false,errorIndex: -1,offerData: {}})
    changeUnHidePOFromList(value: object){
    this.unHidePOFromList.next(value);
  }
  public unHidePOError = new BehaviorSubject<string>("");
  observableunHidePOError = this. unHidePOError.asObservable();
  changeunHidePOError(title: string){
    this.unHidePOError.next(title);
  }
    // CreatePOForm Validation
  isScheduleFormDirty() {

    this.isSchedulesFormUpdated.subscribe(value => {
            this.isSchedulesFormDirty = value ? true : false;
        });
        return this.isSchedulesFormDirty;
      }

  //show hide ericsson blue color loader
  public prodOfferSkeletonLoader = new BehaviorSubject<boolean>(false);
  changeprodOfferSkeletonLoader(value){
    this.prodOfferSkeletonLoader.next(value);
  }

  public createOfferingList = new BehaviorSubject<boolean>(false);
  showCreateOfferingList(value) {
    this.createOfferingList.next(value);
  }

  public createOffering = new BehaviorSubject<string>('');
  changeCreateOffering(value) {
    this.createOffering.next(value);
  }

  public subNavigation = new BehaviorSubject<string>('');
  changeSubNavigation(value) {
    this.subNavigation.next(value);
    }
    
  //Open AddProductOfferFromList modal popup
  public openAddPOModalPopUp = new BehaviorSubject<boolean>(false);
  changeOpenAddPOModalPopUp(value){
    this.openAddPOModalPopUp.next(value);
  }

  //Call PoInBundle to show the newly added PO
  public callPoInBundleListAfterAddingNew = new BehaviorSubject<boolean>(false);
  changeCallPoInBundleListAfterAddingNew(value){
    this.callPoInBundleListAfterAddingNew.next(value);
  }

  //toggle functionality to show defaultmenu and tree menu for mobile devices
  public mobileBreadcrumbMenuEvents = new BehaviorSubject<object>({IsMobileDefaultMenuShow:false});
  showMobileBreadcrumbMenus(value){
    this.mobileBreadcrumbMenuEvents.next(value);
  }
   public localizationFromContextbar = new BehaviorSubject<boolean>(false);
  changeLocalizationFromContextbar(value) {
    this.localizationFromContextbar.next(value);
   }
   public approvalsFromContextbar = new BehaviorSubject<boolean>(false);
   changeApprovalFromContextbar(value) {
    this.approvalsFromContextbar.next(value);
   }
   public localizationcurrentPage = new BehaviorSubject<string>('');
   currentView(value) {
     this.localizationcurrentPage.next(value);
     }

  //this will help to handle application level events and made changes in teh breadcrumb list.
  public observeBreadCrumbApplicationLevelEvents = new BehaviorSubject<object>({
    offerId:0,
    path:'',
    POObj:{},
    PIObj:{},
    CPIObj:{},
    Level:'',
    PIType:''
  });
  changeBreadCrumbApplicationLevelEvents(value){
    this.observeBreadCrumbApplicationLevelEvents.next(value);
  };

  public emptyBreadcrumbList = new BehaviorSubject<boolean>(false);
  clearBreadcrumbListEvent(value){
    this.emptyBreadcrumbList.next(value);
  }
  public disableLocalizationsave = new BehaviorSubject<boolean>(false);
    changeDisableLocalizationsave(value) {
    this.disableLocalizationsave.next(value);
  }
  public localizationChanges = new BehaviorSubject<boolean>(false);
  changelocalizationChanges(value) {
  this.localizationChanges.next(value);
  }
  public approvalBtnShow = new BehaviorSubject<Object>({approval: {}});
  changeApprovalBtn(value) {
  this.approvalBtnShow.next(value);
  }
  public calenderChanges = new BehaviorSubject<boolean>(false);
  changecalenderChanges(value) {
  this.calenderChanges.next(value);
  }
  public resetToggle = new BehaviorSubject<number>(0);
  changeTogglevalue(value){
    this.resetToggle.next(value);
  }

  //check to disable the PO and bundle deelte button in context bar
  public disableDeletePo = new BehaviorSubject<object>({});
  changeDisableDeletePo(value){
    this.disableDeletePo.next(value);
  }
  public disableDeleteBundle = new BehaviorSubject<object>({});
  changeDisableDeleteBundle(value){
    this.disableDeleteBundle.next(value);
  }

  /* prevent unsavedChanges */
  public preventUnsaveChange = new BehaviorSubject<Object>({});
    changePreventUnsaveChange(value) {
    this.preventUnsaveChange.next(value);
  }

  //open Inuse Shared Ratelist component
  public openInUseSharedRatelist = new BehaviorSubject<Object>({});
  changeOpenInUseSharedRatelist(value) {
    this.openInUseSharedRatelist.next(value);
  }

  public loadAuditlogHistory = new BehaviorSubject<Object>({ auditLog: true, schedulAuditLog: false, obj: {} });
  launchScheduleAuditLogHistory(value) {
    this.loadAuditlogHistory.next(value);
  }
  public deleteSharedRate = new BehaviorSubject<boolean>(false);
  changedeleteSharedRate(value: boolean) {
    this.deleteSharedRate.next(value);
  }
  
  // sending name and discription to POP while deleting SR
  public deleteSRData = new BehaviorSubject<object>({ name: "", description: "" });
  displayDeleteSRData(message: object) {
    this.deleteSRData.next(message);
  }

  public displayNameEditOrDelete = new BehaviorSubject<object>({pageTitle: '', actionType: 0});
  breadCrumbDisplayNameEditorDelete(value) {
    this.displayNameEditOrDelete.next(value);
  }

  public nameChecking = new BehaviorSubject<object>({name: true, dispName: true});
  changenameChecking(value) {
    this.nameChecking.next(value);
  }
  // To know call happened in Context bar and make delete call in Pi templat details page
  public deletePItemplate = new BehaviorSubject<boolean>(false);
  changeDeletePItemplate(value: boolean) {
    this.deletePItemplate.next(value);
  }
  // To know call happened in Context bar and make delete call in calendar details page
  public deleteCalendar = new BehaviorSubject<boolean>(false);
  changeDeleteCalendar(value: boolean) {
    this.deleteCalendar.next(value);
  }

  // sending response object to POPUP while deleting PI template in details page
  public deleteablePItemplateData = new BehaviorSubject<Object>({});
  changePItemplateDataTobeDeleted(data) {
    this.deleteablePItemplateData.next(data);
  }
  // sending response object to POPUP while deleting PI template in details page
  public deleteableCalendarData = new BehaviorSubject<Object>({});
  changeDeleteableCalendarData(data) {
    this.deleteableCalendarData.next(data);
  }

  /*handling context bar for mobile devices*/
  calculateInnerWidthHeight(pageType) {
      const number = pageType == '' ? 1 : 2;
      this.changeshowHideTopMenuList(number);
  }

  public showHideTopMenuList = new BehaviorSubject<number>(1);
  changeshowHideTopMenuList(value) {
    this.showHideTopMenuList.next(value);
  }

  /*click localization from mobile dev breadcrumb*/
  public showLocalizationInMobileBreadcrumbObs = new BehaviorSubject<boolean>(false);
  showLocalizationInMobileBreadcrumb(value) {
    this.showLocalizationInMobileBreadcrumbObs.next(value);
  }

  public showConfigurationInMobileBreadcrumbObs = new BehaviorSubject<boolean>(false);
  showConfigurationInMobileBreadcrumb(value) {
    this.showConfigurationInMobileBreadcrumbObs.next(value);
  }

  public ticketLoginObser = new BehaviorSubject<boolean>(false);
  checkTicketLoginObser(value) {
    this.ticketLoginObser.next(value);
  }

  public removeDeletedPO = new BehaviorSubject<number>(0);
  checkremoveDeletedPO(value) {
    this.removeDeletedPO.next(value);
  }

  public successTicketLoginObser = new BehaviorSubject<boolean>(false);
  checkSuccessTicketLoginObser(value) {
    this.successTicketLoginObser.next(value);
  }

  public ngxSlideModal = new BehaviorSubject<boolean>(false);
  checkNgxSlideModal(value) {
    this.ngxSlideModal.next(value);
  }

  public autoLogout = new BehaviorSubject<boolean>(false);
  callautoLogout(value) {
    this.autoLogout.next(value);
  }

  /* refresh childrens in mobile tree structure */
  public updateOfferingsChildrens = new BehaviorSubject(false);
  changeOfferingsChildrens(value) {
    this.updateOfferingsChildrens.next(value);
  }

  public newRecord = new BehaviorSubject<object>({ obj: {}, path: '', Level: '' });
  addNewRecord(value) {
    this.newRecord.next(value);
  }

  public setHeight = new BehaviorSubject<any>({0: [45, 45, 45, 45]});
  changeHeight(value) {
    this.setHeight.next(value);
  }

  hidingSkeleton(className) {
    const dom = document.querySelector(className);
    if (dom) {
      dom.innerHTML = ' ';
    }
  }

  public errorRedirectionObs = new BehaviorSubject<object>({});
  errorRedirection(value) {
    this.errorRedirectionObs.next(value);
  }

  // handling property refresh events for localization
  isPropertiesChange = new BehaviorSubject<object>({isPO: false, isBundle: false});
  changeProperties(data) {
    this.isPropertiesChange.next(data);
  }

  public refreshNumberDateFilter = new BehaviorSubject<boolean>(false);
  changedRefreshNumberDateFilter(data){
    this.refreshNumberDateFilter.next(data);
  }

  public refreshInUseOfferingsModal = new BehaviorSubject<boolean>(false);
  changedRefreshInUseOfferingsModal(data){
    this.refreshInUseOfferingsModal.next(data);
  }

  public showDeleteButton = new BehaviorSubject<boolean>(true);
  updateShowDeleteButton(data) {
    this.showDeleteButton.next(data);
  }

  public checkIfDataUpdate = new BehaviorSubject<object>({});
  checkIfDataUpdateMethod(value) {
    this.checkIfDataUpdate.next(value);
  }
  
  public applyBodyScroll = new BehaviorSubject<boolean>(false);
  updateApplyBodyScroll(data) {
    this.applyBodyScroll.next(data);
   }

  isSubsciptionPropertiesChange = new BehaviorSubject<boolean>(false);
  changeSubsciptionProperties(data) {
    this.isSubsciptionPropertiesChange.next(data);
  }

  public changeScrollPosition = new BehaviorSubject<any>('');
  updateChangeScrollposition(data) {
    this.changeScrollPosition.next(data);
  }

  public scrollHeight = new BehaviorSubject<boolean>(false);
  getScrollHeight(data) {
    this.scrollHeight.next(data);
  }

  public removeScrollHeight = new BehaviorSubject<number>(0);
  changeRemoveScrollHeight(data) {
    this.removeScrollHeight.next(data);
  }

  public gridScrollStatus = new BehaviorSubject<boolean>(false);
  changeGridScrollStatus(data) {
    this.gridScrollStatus.next(data);
  }
  
   public calcLocalizationHeader = new BehaviorSubject<number>(0);
  changeLocalizationScrollHeight(data) {
    this.calcLocalizationHeader.next(data);
  }

  public checkRateHistoryCalled = new BehaviorSubject<boolean>(false);
  changeCheckRateHistoryCalled(data) {
    this.checkRateHistoryCalled.next(data);
  }

  public idleTimedout = new BehaviorSubject<any>({'autoLoggingOff': false, 'showTimedoutDialog': false});
  sessionIdleTimedOut(data) {
    this.idleTimedout.next(data);
  }
  
  public callFilterData = new BehaviorSubject<string>('');
  checkCallFilterData(data) {
    this.callFilterData.next(data);
  }
  public allowRouteChange = new BehaviorSubject<boolean>(false);
  resetAllowRouteChange(data) {
    this.allowRouteChange.next(data);
  }

  public subscriptionLocalization = new BehaviorSubject<Object>({});
  changeSubscriptionLocalization(data) {
    this.subscriptionLocalization.next(data);
  }
  public approvalPendingInfo = new BehaviorSubject<any>({});
  changeApprovalPending(data) {
    this.approvalPendingInfo.next(data);
  };
  public isApprovalEdited = new BehaviorSubject<boolean>(false);
  changeIsApprovalEdited(data) {
    this.isApprovalEdited.next(data);
  }
}
