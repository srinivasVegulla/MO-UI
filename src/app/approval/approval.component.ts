import { Component, OnInit, OnDestroy, ViewChild, Output , EventEmitter, Input, HostListener} from '@angular/core';
import { utilService } from '../helpers/util.service';
import { UtilityService } from '../helpers/utility.service';
import { ApprovalService } from './approval.service';
import { ActivatedRoute } from '@angular/router';
import { calenderLocaleFeilds } from '../../assets/calenderLocalization';
import { LocaleService } from 'angular-l10n';
import { LowerCasePipe } from '../helpers/lowerCase.pipe';
import { CapabilityService } from '../helpers/capabilities.service';
import { TranslationService } from 'angular-l10n';

@Component({
    selector: 'ecb-approval',
    templateUrl: './approval.component.html',
    providers:[LowerCasePipe]
  })
  export class ApprovalComponent implements OnInit,OnDestroy {
    columnDef:any ={};
    cols: any =[];
    loadGridData: boolean = false;
    pagination: any;
    approvalPanel: any;
    loadError: boolean;
    showErrorMessage: boolean;
    approvalErrMsg: string;
    filterFields: any ={};
    isFilterData: boolean;
    productOfferId: number;
    loading: boolean;
    approvalList = [];
    totalPageSize: any;
    showCover:boolean;
    lazyLoad: boolean;
    sortQuery: any ={};
    getColumnSortOrder: string;
    tableQuery: any ={};
    totalCount: number;
    convertedDefaultSortOrder: number;
    filterErrorMessage: string = '';
    sortErrorMessage: string = '';
    approvalFromContextbar: any;
    filteredField: any;
    filteredValue: any;
    rowIndex: any;
    schedID: any;
    bundleId: number;
    currentLocale: string;
    calenderLocale: any;
    totalPages: any;
    selectedFilterData: any;
    showRateChanges: boolean;
    showOfferChanges: boolean;
    pendingRecord: any;
    disabledStatusList: any[] = [];
    viewApprovals: boolean = false;
    manageApprovals: boolean = false;
    loggedInUser: string = '';
    editedRows: any[] = [];
    isSaveDisabled: boolean = true;
    isUpdateFailed: boolean = false;
    loadEvent: object = { sortField: "itemDisplayName", sortOrder: "1" };
    confirmDialog: number = 0;
    showSkeleton: boolean = false;
    isApprovalRequestOn: boolean = false;
    nextStateUrl: string = '';
    approvalErrObj: object = {};
    objectKeys = Object.keys;
    approveTooltip: string = '';
    denyTooltip: string = '';
    dismissTooltip: string = '';
    itemHistoryColumnDef: any = {};
    itemHistorySortQuery: any = {};
    itemHistoryChangesList: any = [];
    pendingHistoryloading: boolean = false;
    convertedDefaultItemSortOrder: number = 0;
    pendingItemLoading: boolean = false;
    errorMessage: boolean = false;
    approvalID: number = 0;
    @ViewChild('ApprovalPanel') approvalSidePanel:any

    // outputs
    @Output() closeApprovalAsidePanel = new EventEmitter();
    @Output() reloadSource = new EventEmitter();
    @Output() unsavedChanges = new EventEmitter();

    // inputs
    @Input() set schedId(value){
      if (value) {
        this.schedID = value.schedId;
      }
    }
    @Input() rateMetaData: any;
    @Input() isLoadedFrom: string;

    constructor(private readonly _utilService: utilService,
        private locale: LocaleService,
        private readonly _utilityService: UtilityService,
        private readonly _approvalService: ApprovalService,
        private readonly _route: ActivatedRoute,
        private _capabilityService: CapabilityService,
        private _translationService: TranslationService) {
          this.approveTooltip = this._translationService.translate('TEXT_APPROVE');
          this.denyTooltip = this._translationService.translate('TEXT_DENY');
          this.dismissTooltip = this._translationService.translate('TEXT_DISMISS');
    }

    ngOnInit() {
      this.showErrorMessage = false;
      this.totalCount = 0;
      this.currentLocale = this.locale.getCurrentLocale();
      this.currentLocale = this.currentLocale == null ? 'us' : this.currentLocale;
      this.calenderLocale = calenderLocaleFeilds[this.currentLocale];
      this.filterFields = {};
      this.sortQuery = {};
      this.tableQuery = {};
      this.showCover = false;
      this.getApprovalCapabilities();
      this.getLoggedInUserName();
      this.initialize();
      this.getGridConfigData();
      this.productOfferId = +this._route.snapshot.params['productOfferId'];
      this.bundleId = +this._route.snapshot.params['bundleId'];
      this.approvalPanel = this._utilService.callFilterData.subscribe(value => {
        if (value === 'approval') {
          this.filterData();
        }
      });
      this._utilityService.getClosestElement();
    }

    @HostListener('document:keydown.esc', ['$event'])
    handleEscape() {
      if (this._utilityService.isObject(this.approvalSidePanel)) {
        if (this.confirmDialog === 0 && this.approvalSidePanel.visibleStatus) {
            this.cancelCoverHandler();
          } else {
            this.confirmDialog = 0;
          }
      }
    }

    getApprovalCapabilities() {
      if (this.isLoadedFrom !== undefined && this.isLoadedFrom !== null) {
        switch (this.isLoadedFrom) {
          case 'offering':
            this.viewApprovals = this._capabilityService.findPropertyCapability('UIPoDetailsPage', 'View_Approvals');
            this.manageApprovals = this._capabilityService.findPropertyCapability('UIPoDetailsPage', 'Manage_Approvals');
            break;
          case 'PIRates':
            this.viewApprovals = this._capabilityService.findPropertyCapability('UIPIDetailsPage', 'View_Approvals');
            this.manageApprovals = this._capabilityService.findPropertyCapability('UIPIDetailsPage', 'Manage_Approvals');
            break;
          case 'sharedRates':
            this.viewApprovals = this._capabilityService.findPropertyCapability('UISharedRateDetailsPage', 'View_Approvals');
            this.manageApprovals = this._capabilityService.findPropertyCapability('UISharedRateDetailsPage', 'Manage_Approvals');
            break;
        }
      }
    }

    getLoggedInUserName() {
      this.loggedInUser = sessionStorage.getItem('userName');
    }

    initialize() {
      this.approvalFromContextbar = this._utilService.approvalsFromContextbar.subscribe(value => {
          if(value) {
          this.approvalSidePanel.show();
          }
      });
      this.approvalSidePanel.show();
      this.showCover = true;
      this.lazyLoad = true;
    }

    alterColumnDefJson(colDef) {
      colDef.cols.forEach((element: object, index: number) => {
        if (element['field'] === 'actions' || element['field'] === 'comment') {
          colDef.cols.splice(index, 1);
        }
      });
      return colDef;
    }

    getGridConfigData() {
      this.loading = true;
      this._utilityService.getextdata({
        data: 'approvalColumnDef.json',
        success: (result) => {
          if(this.viewApprovals && this.manageApprovals) {
            this.columnDef = result;
          } else {
            this.columnDef = this.alterColumnDefJson(result);
          }
          this.convertDefaultSortOrder();
          this.cols = this.columnDef.cols;
          this.sortQuery[this.columnDef.defaultSortColumn] = this.columnDef.defaultSortOrder;
          this.loadGridData = true;
        },
        failure: (errorMsg: string, code: any, error: any) => {
          this.loadError = true;
          this.loading = false;
          this.showSkeleton = false;
          this.displayError(code, errorMsg, 'LOAD');
        }
      });
    }

    getItemHistoryData() {
      this._utilityService.getextdata({
        data: 'itemHistoryColumnDef.json',
        success: (result) => {
          this.itemHistoryColumnDef = result;
          this.convertDefaultItemSortOrder();
          this.itemHistorySortQuery[this.itemHistoryColumnDef.defaultSortColumn] = this.itemHistoryColumnDef.defaultSortOrder;
          this.pendingHistoryloading = true;
        },
        failure: (errorMsg: string, code: any, error: any) => {
          this.loadError = true;
          this.errorMessage = true;
          this.approvalErrMsg = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
        },
        onComplete:()=>{
          this.getItemHistoryChanges();
        }
      });
    }

    convertDefaultSortOrder() {
      this.convertedDefaultSortOrder = (this.columnDef.defaultSortOrder === 'asc') ? 1 : -1;
    }

    convertDefaultItemSortOrder() {
      this.convertedDefaultItemSortOrder = (this.itemHistoryColumnDef.defaultSortOrder === 'asc') ? 1 : -1;
    }

    clearFilters(column) {
      this.filterFields[column] = '';
      this.isFilterData = false;
      this.filterData();
    }
  
    isFilterText(column) {
        return this.filterFields[column] && this.filterFields[column].length > 0;
    }

    scrollInitialize(pagination) {
      if(this.pagination !== null && this.pagination !== undefined){
      this.pagination = pagination;
      }
      this.getApprovalInOfferingUpdate();
    }

    scrollReset() {
      if(this.pagination !== null && this.pagination !== undefined){
      this.pagination = this.pagination.reset();
      }
    }
  
    getDeviceWidth() {
      return window.innerWidth + 'px';
    }
 
  getApprovalInOfferingUpdate(){
    if (this.isApprovalRequestOn) {
      this.showSkeleton = true;
    } else {
      this.loading = true;
    }
    const widgetData = {
    param : {
      page: 1,
      size: 9999
    },
  };
  if (!isNaN(this.schedID)) {
    widgetData['schedId'] = this.schedID;
  }  else {
    widgetData['productOfferId'] = isNaN(this.productOfferId) ? this.bundleId : this.productOfferId;
  }
  if (Object.keys(this.sortQuery).length > 0) {
    widgetData.param['sort'] = this.sortQuery;
  }
  if (Object.keys(this.tableQuery).length > 0) {
    widgetData.param['query'] = this.tableQuery;
  }
  this._approvalService.getApprovalList({
    data : widgetData,
    success : (result) => {
      this.showRateChanges = this._utilityService.isObject(this.schedID);
      this.showOfferChanges = this._utilityService.isObject(widgetData['productOfferId']);
      this.loading = false;
      this.rowIndex = 0;
      this.totalCount = result.totalCount;
      this.prepareDisabledInputList(this.totalCount);
      this.approvalList = result.records;
      this.totalPageSize = result.totalPageSize;
      this.totalPages = result.totalPages;
      if(this.filterErrorMessage){
        this.filterErrorMessage = '';
      }
      this.pendingRecord = this.approvalList[0];
    },
    failure : (errorMsg: string, code: number, error: any) => {
      this.approvalList = [];
      this.filterErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
  },
    onComplete: () => {
      this.loading = false;
      this.showSkeleton = false;
      this.isApprovalRequestOn = false;
      this.lazyLoad = false;
      this.unsavedChanges.emit(false);
      this._utilService.changeIsApprovalEdited(false);
      this.errorMessage = false;
      this.getItemHistoryData();
    }
    });
  }

  getItemHistoryChanges() {
    this.sortErrorMessage = '';
    this.pendingItemLoading = true;
    if(this.pendingRecord !== null && this.pendingRecord !== undefined){
       this.approvalID = this.pendingRecord.approvalId;
    }
    const widgetData = {
      param: { page: 1, size: 9999 },
      approvalId: this.approvalID
    };
    if (Object.keys(this.itemHistorySortQuery).length > 0) {
      widgetData.param['sort'] = this.itemHistorySortQuery;
    }
    if(!this._utilityService.isObject(this.schedID)) {
    this._approvalService.getPendingOfferingChanges({
      data: widgetData,
      success: (result) => {
       this.successData(result);
      },
      failure: (errorMsg: string, code: number, error: any) => {
        this.itemHistoryChangesList = [];
        this.sortErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
      },
      onComplete: () => {
        this.pendingItemLoading = false;
        this.lazyLoad = false;
      }
    });
  } else {
    widgetData['scheduleId'] = this.pendingRecord.uniqueItemId;
    this._approvalService.getPendingRateChanges({
      data: widgetData,
      success: (result) => {
        this.successData(result);
      },
      failure: (errorMsg: string, code: number, error: any) => {
        this.itemHistoryChangesList = [];
        this.sortErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
      },
      onComplete: () => {
        this.pendingItemLoading = false;
        this.lazyLoad = false;
      }
    });
  }
 
}

successData(result){
  this.itemHistoryChangesList = result.changeHistory.records;
  if(this.sortErrorMessage){
    this.sortErrorMessage = '';
  }
}

getSortField() {
  this.pendingItemLoading = true;
  const widgetData = {
    param: { page: 1, size: 9999 },
    approvalId: this.pendingRecord.approvalId
  };
  if (Object.keys(this.itemHistorySortQuery).length > 0) {
    widgetData.param['sort'] = this.itemHistorySortQuery;
  }
  this._approvalService.getSortFields({
    data: widgetData,
    success: (result) => {
      this.itemHistoryChangesList = result.records;
      if(this.sortErrorMessage){
        this.sortErrorMessage = '';
      }
    },
    failure: (errorMsg: string, code: number, error: any) => {
      this.itemHistoryChangesList = [];
      this.sortErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
    },
    onComplete: () => {
      this.pendingItemLoading = false;
      this.lazyLoad = false;
    }
  });
}

sortFields(event: any){
  if (!this.lazyLoad) {
    this.itemHistorySortQuery = {};
    this.getColumnSortOrder = (event.order === 1) ? 'asc' : 'desc';
    this.itemHistorySortQuery[event.field] = this.getColumnSortOrder;
    this.scrollReset();
    this.getSortField();
  }
}

  isUserSubmittedRequest(submitterName) {
    if (this.loggedInUser !== '' && this.loggedInUser.toLowerCase() === submitterName.toLowerCase()) {
      return true;
    } else {
      return false;
    }
  }

  prepareDisabledInputList(count: number) {
    for (let index = 0; index < count; index++) {
      this.disabledStatusList[index] = true;
    }
  }

  loadData(event: any) {
    if (!this.lazyLoad) {
      this.sortQuery = {};
      this._utilityService.resetPagination(this.pagination);
      this.getColumnSortOrder = (event.sortOrder === 1) ? 'asc' : 'desc';
      const configField = this.approvalFieldConfig(event.sortField);
      this.sortQuery[configField ? configField : event.sortField] = this.getColumnSortOrder;
      this.scrollReset();
      this.getApprovalInOfferingUpdate();
    }
   }

   approvalFieldConfig(field) {
    const fields = {
      submittedDate : "submittedDate",
      changeLastModifiedDate: 'changeLastModifiedDate',
    };
    return fields[field] ? fields[field] : null;
  }

  numberConfigFields(field) {
    const fields = {
      approvalId : "approvalId",
    };
    return fields[field] ? fields[field] : null;
  }

   filterData() {
    this.tableQuery = {};
    this.isFilterData = true;
    for (const key in this.filterFields) {
      const dLangProperty = this._utilityService.dLangPropertyNames(key);
      if (this.filterFields[key] !== '' && this.filterFields[key] !== null) {
        const configField = this.approvalFieldConfig(key)
        if (configField) {
          this.tableQuery[key] = this.filterFields[key].trim();
        } else if (this.numberConfigFields(key)) {
          this.tableQuery[key] = this.filterFields[key].trim();
        }else if (dLangProperty) {
          this.tableQuery[dLangProperty] = this.filterFields[key].trim();
        } else {
          this.tableQuery[key] = `'%${this.filterFields[key].trim()}%'|like`;
        }
      }
    }
    this.scrollReset();
    this.getApprovalInOfferingUpdate();
  }

  filterDataKeys(event, field, value) {
    this.filteredField = field;
    this.filteredValue = value;
    this._utilityService.enableFilter(event, 'approval');
  }
    
  cancelCoverHandler(){
    if (!this.isSaveDisabled) {
      this.confirmDialog = 1;
    } else {
      this.hideAsidePanel();
    }
  }

  onModalDialogCloseCancel(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this.hideAsidePanel();
    }
  }

  hideAsidePanel() {
    this.approvalFromContextbar.unsubscribe();
    this.closeApprovalAsidePanel.emit(true);
    this.approvalSidePanel.hide();
    this.showCover = false;
    this.scrollReset();
    this._utilService.changeApprovalFromContextbar(false);
    this.unsavedChanges.emit(false);
    this._utilService.changeIsApprovalEdited(false);
  }

  getErrorMessageType() {
    const filterCriteriaLength = !this._utilityService.isObject(this.tableQuery) ? 0 : Object.keys(this.tableQuery).length;
    if (this.loading) {
      return 0;
    }
    if (this.filterErrorMessage !== '') {
      return 1;
    } else if (this.approvalList.length === 0 && this.approvalList !== undefined && filterCriteriaLength === 0) {
      if (this.filterErrorMessage === '') {
        return 2;
      }
      } else if (this.approvalList.length === 0 && this.approvalList !== undefined && filterCriteriaLength > 0) {
        return 3;
      }
    return 0;
  }

  getErrorMessageTypeList() {
    const sortCriteriaLength = !this._utilityService.isObject(this.sortQuery) ? 0 : Object.keys(this.sortQuery).length;
    if (this.loading) {
      return 0;
    }
    if (this.sortErrorMessage !== '') {
      return 1;
    } else if (this.itemHistoryChangesList.length === 0 && this.itemHistoryChangesList !== undefined && sortCriteriaLength === 0) {
      if (this.sortErrorMessage === '') {
        return 2;
      }
      } 
    return 0;
  }

  selectedListItem(index) {
    this.rowIndex = index;
    this.pendingRecord = this.approvalList[index];
    this._utilService.changeApprovalPending(this.pendingRecord);
    this.getItemHistoryChanges();
  }
  fetchDateValues(value) {
    this.selectedFilterData = value;
    if (this.selectedFilterData.selectedValue !== '' && this.selectedFilterData.selectedValue !== null) {
      switch (this.selectedFilterData.selectedColumn) {
        case 'submittedDate': this.filterFields['submittedDate'] = this.selectedFilterData.selectedValue;
          break;
        case 'changeLastModifiedDate': this.filterFields['changeLastModifiedDate'] = this.selectedFilterData.selectedValue;
          break;
      }
      this.filterData();
    } else {
      this.clearFilters(this.selectedFilterData.selectedColumn);
    }
  }

  fetchNumberFilter(value) {
    this.selectedFilterData = value;
    if (this.selectedFilterData.selectedValue !== '' && this.selectedFilterData.selectedValue !== null && this.selectedFilterData.selectedColumn === 'approvalId') { 
        this.filterFields['approvalId'] = this.selectedFilterData.selectedValue;
        this.filterData();
    } else {
      this.clearFilters(this.selectedFilterData.selectedColumn);
    }
  }

  changeRequestStatus(type, index, event) {
    this._utilService.changeIsApprovalEdited(true);
    this.disabledStatusList[index] = false;
    this.approvalList[index].currentState = type;
    this.updateStatusColor(this.approvalList[index].currentState);
    document.getElementById(`actionKeys-${index}`).style.display = 'none';
    this.setBgColorToInput(event);
    this.editedRows.push(this.approvalList[index]);
    this.isSaveDisabled = false;
    this.isUpdateFailed = false;
    this.unsavedChanges.emit(true);
  }

  setBgColorToInput(event) {
    let selectedCell = event.srcElement.closest('tr').children[6];
    selectedCell.style.background = '#fff';
  }

  updateStatusColor(status: string) {
    switch (status) {
      case 'APPROVED':
        return 'ecb-requestApproved';
      case 'DENIED':
        return 'ecb-requestDenied';
      case 'PENDING':
        return 'ecb-requestPending';
      case 'DISMISSED':
        return 'ecb-requestDenied';
    }
  }

  saveApprovals() {
    this.isApprovalRequestOn = true;
    this._approvalService.saveApprovalList({
      data: {
        body: this.editedRows
      },
      success: (result) => {
        this.reloadSource.emit(true);
        this.resetFlags();
        this.cancelCoverHandler();
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this.displayError(code, errorMsg, 'EDIT');
        this.isUpdateFailed = true;
        this.resetFlags();
      }
    });
  }

  resetFlags() {
    this.isSaveDisabled = true;
    this.editedRows = [];
  }

  displayError(code, errorMsg, type) {
    this.approvalErrObj = {};
    this.approvalErrMsg = '';
    if (code === undefined || code === null) {
      this.approvalErrMsg = this._utilityService.errorCheck(code, errorMsg, type);
    } else if (errorMsg !== undefined && errorMsg !== '' && errorMsg.indexOf('{') === 0) {
      this.approvalErrObj = JSON.parse(errorMsg);
      this.loadData(this.loadEvent);
    } else {
      this.approvalErrMsg = this._utilityService.errorCheck(code, errorMsg, type);
      this.loadData(this.loadEvent);
    }
    this.showErrorMessage = true;
  }

  ngOnDestroy() {
    if(this.approvalFromContextbar){
    this.approvalFromContextbar.unsubscribe();
    }
    if (this.approvalPanel) {
      this.approvalPanel.unsubscribe();
    }
    this._utilService.changeApprovalPending({});
  }
}
