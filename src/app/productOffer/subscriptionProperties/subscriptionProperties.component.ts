import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SubscriptionpropertiesService } from './subscriptionProperties.services';
import { utilService } from '../../helpers/util.service';
import { AddSubscriptionPropertiesService } from './addSubscriptionProperties/addSubscriptionProperties.services';
import { ActivatedRoute, Router } from '@angular/router';
import { CapabilityService } from '../../helpers/capabilities.service';
import { UtilityService } from './../../helpers/utility.service';

@Component({
  selector: 'ecb-subscription-properties',
  templateUrl: './subscriptionProperties.component.html',
  styleUrls: ['./subscriptionProperties.component.scss'],
  providers:[SubscriptionpropertiesService],
   host: {
    '(document:click)': 'onClick($event)',
  }
 })
  export class SubscriptionPropertiesComponent implements OnInit, OnDestroy {
    errorMessage: string;
    subscriptionList: any = [];
    labels: any = [];
    @Input() productOfferId: number;
    noSubscriptionProperties = false;
    subscriptionAddError = false;
    subscriptionErrorMessage: any;
    isSubscriptionList = false;
    errorTooltip = false;
    subscriptionId: any;
    tooltipIndex: any;
    parseErrorMessage: any;
    deleteErrorMessage: any;
    deleteRowIndex: any;
    subscriptionPropertiesSubscriptions: any;
    confirmDialog: number;
    deleteSubscriptionDetails: any;
    onInitCount = false;
    @Input() isBundle: boolean;
    initializeSubscription: boolean;
    addSubPropCapability = true;
    showSkeleton = false;
    listUpdated = false;
    showLoader = false;

  constructor(private subscriptionpropertiesService: SubscriptionpropertiesService,
              private _utilService: utilService,
              private _addSubscriptionPropertiesService: AddSubscriptionPropertiesService,
              private _route: ActivatedRoute,
              private _capabilityService: CapabilityService,
              private _utilityService: UtilityService) {
                this.confirmDialog = 0;
    this._route.params.subscribe(params => {
      if (this.onInitCount) {
        this.ngOnInit();
      }
    });
              }

  ngOnInit() {
    this.onInitCount = true;
    this.getSubscriptionItems();
    this.subscriptionPropertiesSubscriptions = this._utilService.callSubscriptionListAfterAddingNew.subscribe(value =>{
      if (value) {
        this.listUpdated = true;
        this.getSubscriptionItems();
      } else {
        this.listUpdated = false;
      }
    });
    this.addSubPropCapability = this._capabilityService.findPropertyCapability('UIPoDetailsPage', 'SubsProps_Add');
    const addSubscriptionItemToPO = this._utilService.addSubscriptionItemToPO.subscribe(value => {
      if (!value) {
        this.initializeSubscription = false;
      }
  });
  this.subscriptionPropertiesSubscriptions.add(addSubscriptionItemToPO);
  this._utilService.isPropertiesChange.subscribe(value => {
    if (value['isBundle'] === true || value['isPO'] === true) {
      this.getSubscriptionItems();
    }
  });
  }

  onToolTipClose(value){
    if (value) {
      this.clearHighlight();
    }
  }

  getSubscriptionItems() {
      if (this.productOfferId) {
        if (this.listUpdated !== undefined && this.listUpdated) {
          this.showSkeleton = true;
        }
        else {
          this.showLoader = true;
        }
       this.subscriptionpropertiesService.getShared({
          data : {
            offerId : this.productOfferId
          },
          success : (result) => {
             this.subscriptionList = result.records;
             if (this.subscriptionList !== null && this.subscriptionList !== undefined) {
               this.noSubscriptionProperties = this.subscriptionList.length > 0 ? false : true;
             } else {
               this.noSubscriptionProperties = true;
             }
          },
          failure : (error) => {
            this.errorMessage = error;
          },
          onComplete : () => {
            this.showLoader = false;
            this.listUpdated = false;
            this.fadeSkeleton();
          }
        });
    }
  }

  fadeSkeleton() {
    setTimeout(() => {
      this.showSkeleton = false;
    }, 200);
  }

  checkDate(value): any {
    return new Date(value);
  }

  openAddSubscriptionItem(){
    this.initializeSubscription = true;
    this._utilService.changeAddSubscriptionItemToPO(true);
  }

  deleteSubscription(data, subscriptionIndex) {
    this.deleteSubscriptionDetails = data;
    this.subscriptionId = data.specId;
    this.tooltipIndex = subscriptionIndex + 1;
    this.errorTooltip = false;
    this.confirmDialog = 1;
  }

  deleteSelectedSubscription(){
    this.errorTooltip = false;
    this.showSkeleton = true;
    var widgetData = {
      productSpecId : this.subscriptionId,
      offerId : this.productOfferId
    };
    this.subscriptionpropertiesService.deleteSubscription({
      data : widgetData,
      success : (result) => {
       this.listUpdated = true;
       this.getSubscriptionItems();
      },
      failure : (errorMsg: string, code: any) => {
        let removeError = this._utilityService.errorCheck(code, errorMsg, 'REMOVE');
        this.handleErrorDeleteSubscription(removeError, this.tooltipIndex);
        this.fadeSkeleton();
      }
    });
  }

  handleErrorDeleteSubscription(msg, index) {
    this.tooltipIndex = index-1;
    this.errorTooltip = true;
    this.deleteErrorMessage = msg;
    this.subscriptionList[index - 1].error = true;
  }

  clearHighlight() {
    for(var i in this.subscriptionList){
     this.subscriptionList[i].error = false;
    }
  }

  getRowClass(data, index) {
    return data.error ? 'errorDeleteSchedule' : 'noErrorDeleteSchedule';
  }

   onClick(event) {
     this.clearHighlight();
   }

   onModalDialogCloseDelete(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this.deleteSelectedSubscription();
    }
  }

  ngOnDestroy() {
    if (this.subscriptionPropertiesSubscriptions) {
      this.subscriptionPropertiesSubscriptions.unsubscribe();
    }
  }
}
