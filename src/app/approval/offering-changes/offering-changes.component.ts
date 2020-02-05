import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UtilityService } from '../../helpers/utility.service';
import { ApprovalService } from '.././approval.service';
import { utilService } from 'assets/test/mock';

@Component({
  selector: 'ecb-offering-changes',
  templateUrl: './offering-changes.component.html',
})

export class OfferingChangesComponent implements OnInit, OnDestroy {
  loadError: boolean;
  showErrorMessage: boolean;
  loading: boolean;
  showCover: boolean;
  lazyLoad: boolean;
  sortQuery: any = {};
  showOfferChanges: boolean;
  pendingOfferingChangesList = [];
  pendingOfferingColumnDef: any = {};
  pendingOfferingSortQuery = {};
  convertedDefaultSortOrder;
  loadGridData: boolean;
  approvalErrMsg: string;
  @Input() pendingRecord: any;
  getColumnSortOrder: any;
  approvalPendingInfoSubscribe: any;

  constructor(
    private readonly _utilityService: UtilityService,
    private readonly _approvalService: ApprovalService,
    private readonly _utilService: utilService,
  ) { }

  ngOnInit() {
    this.showErrorMessage = false;
    this.getOfferingPendingConfigData();
    this.approvalPendingInfoSubscribe = this._utilService.approvalPendingInfo.subscribe((pendingRecordInfo) => {
      if (this._utilityService.isObject(pendingRecordInfo)) {
        if (pendingRecordInfo.changeType === 'OfferingUpdate') {
          this.pendingRecord = pendingRecordInfo;
          this.getPendingOfferingChanges();
        }
      }
    });
  }

  getErrorMessageType() {
    if (this.pendingOfferingChangesList.length === 0 && this.pendingOfferingChangesList !== undefined) {
      return 0;
    }
  }

  getOfferingPendingConfigData() {
    this._utilityService.getextdata({
      data: 'offeringChangesColumnDef.json',
      success: (result) => {
        this.pendingOfferingColumnDef = result;
        this.pendingOfferingSortQuery[this.pendingOfferingColumnDef.defaultSortColumn] = this.pendingOfferingColumnDef.defaultSortOrder;
        this.loadGridData = true;
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this.loadError = true;
        this.showErrorMessage = true;
        this.approvalErrMsg = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
      },
      onComplete: () => {
        this.loadGridData = false;
        this.getPendingOfferingChanges();
      }
    });
  }

  getPendingOfferingChanges() {
    this.loading = true;
    const widgetData = {
      param: { page: 1, size: 9999 },
      approvalId: this.pendingRecord.approvalId
    };
    if (Object.keys(this.pendingOfferingSortQuery).length > 0) {
      widgetData.param['sort'] = this.pendingOfferingSortQuery;
    }
    this._approvalService.getPendingOfferingChanges({
      data: widgetData,
      success: (result) => {
        this.pendingOfferingChangesList = result.changeDetails;
      },
      failure: (errorMsg: string, code: number, error: any) => {
        this.pendingOfferingChangesList = [];
        this.approvalErrMsg = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
      },
      onComplete: () => {
        this.loading = false;
        this.lazyLoad = false;
      }
    });
  }
  ngOnDestroy() {
    this.showOfferChanges = false;
    this.pendingRecord = {};
    this._utilService.changeApprovalPending({});
    if (this.approvalPendingInfoSubscribe) {
      this.approvalPendingInfoSubscribe.unsubscribe();
    }
  }
}
