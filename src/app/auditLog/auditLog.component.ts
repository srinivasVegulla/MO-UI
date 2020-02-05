import { DropdownModule, SelectItem, AutoComplete } from 'primeng/primeng';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Inject, HostListener, Input } from '@angular/core';
import { AuditLogService } from './auditLog.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { DatePipe } from '@angular/common';
import { calenderLocaleFeilds } from '../../assets/calenderLocalization';
import { Language, DefaultLocale, Currency, LocaleService } from 'angular-l10n';
import { utilService } from '../helpers/util.service';
import { contextBarHandlerService } from '../helpers/contextbarHandler.service';
import { UtilityService } from '../helpers/utility.service';
import { Http, Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DateFormatPipe } from 'angular2-moment';
import { InfiniteScrollCheckService } from '../helpers/InfiniteScrollCheck.service';


@Component({
  selector: 'ecb-auditLog',
  templateUrl: './auditLog.component.html',
  styleUrls: ['./auditLog.component.scss'],
  providers: [DateFormatPipe]
})
export class AuditLogComponent implements OnInit, OnDestroy {

  auditLogList;
  cols: any[];
  errorMessage: string;
  noTableData: boolean = false;
  noFilteredTableData: boolean = false;
  @Language() lang: string;
  @ViewChild(AutoComplete) private autoComplete: AutoComplete;
  filterDataProcessing: boolean = false;
  auditLogGridErrMsg: string = '';
  loading = false;
  currentLocale;
  @DefaultLocale() defaultLocale: string;
  tableQuery: any;
  filterFields: any;
  sortQuery: any;
  defaultSort: boolean = true;
  lazyLoad: boolean = false;
  getColumnSortOrder;
  columnDef;
  convertedDefaultSortOrder;
  logListLength;
  redirectionPageIs;
  calenderLocale;
  rateParamsData;
  isScheduleAuditCall = false;
  auditLogSubscription;
  isDownload = false;
  showRateChanges: boolean = false;
  totalCount: number;
  totalPageSize: number;
  selectedRateChange: any;
  pagination: any;
  selectedFilterData: any;
  clearRuleSetStartDate: any;
  loadGridData = false;
  infiniteScrollCheck: string = '';
  moreDataCalled: boolean;
  moreData;
  lessData;
  totalPages;
  refreshDataCheck = false;
  isFilterData:boolean;
  removeScrollHeight: any;
  filteredField: any;
  filteredValue: any;
  @Input() isRateHistory: boolean;
  @Input() rateParamsInfo: any;
  isFilterCallTrue: boolean;
  filterKeys: any;
  auditConfigDataError: string = '';
  loadError: boolean = false;

  constructor(private _auditLogService: AuditLogService,
    private locale: LocaleService,
    private _utilService: utilService,
    private _contextBarHandlerService: contextBarHandlerService,
    private _http: Http,
    private _router: Router,
    private _utilityService: UtilityService,
    private _infiniteScrollCheckService: InfiniteScrollCheckService) {
    this._utilService.changedisplayName('');
    this._utilService.changeitemInstanceDisplayName('');
    this.isFilterCallTrue = false;
  }

  fetchNumberFilter(value) {
    this.selectedFilterData = value;
    if (this.selectedFilterData.selectedValue !== '' && this.selectedFilterData.selectedValue !== null) {
      switch (true) {
        case this.selectedFilterData.selectedColumn === 'auditId':
          this.filterFields['auditId'] = this.selectedFilterData.selectedValue;
          break;
        case this.selectedFilterData.selectedColumn === 'eventId':
          this.filterFields['eventId'] = this.selectedFilterData.selectedValue;
          break;
        case this.selectedFilterData.selectedColumn === 'entityId':
          this.filterFields['entityId'] = this.selectedFilterData.selectedValue;
          break;
      }
      this.filterData();
    } else {
      this.clearFilters(this.selectedFilterData.selectedColumn);
    }
  }

  scrollInitialize(pagination) {
    this.pagination = pagination;
    this.activate();
  }

  scrollReset() {
    this.pagination = this.pagination.reset();
  }

  getMoreData() {
    this._utilService.getScrollHeight(true);
    if(this.auditLogList !== undefined  && !this.refreshDataCheck ){
      this.moreData = this._infiniteScrollCheckService.getMoreScrollData(!this.loading,this.auditLogList.length,this.pagination,this.totalPageSize,this.totalPages);
       if (this.moreData !== undefined) {
         this.infiniteScrollCheck = this.moreData.infiniteScrollCheck;
         this.moreDataCalled = this.moreData.moreDataCalled;
         this.toggleFunctions();
      }
    } else {
      this.refreshDataCheck = false;
    }
  }

  getLessData() {
     if(this.auditLogList !== undefined){
    this.lessData = this._infiniteScrollCheckService.getLessScrollData(!this.loading,this.auditLogList.length,this.pagination,this.moreDataCalled);
     if (this.lessData !== null) {
         this.infiniteScrollCheck = this.lessData.infiniteScrollCheck;
         this.moreDataCalled = this.lessData.moreDataCalled;
         this.toggleFunctions();
     }
    }
  }

  ngOnInit() {
    this.getGridConfigData();
    this.currentLocale = this.locale.getCurrentLocale();
    this._contextBarHandlerService.changeContextBarVisibility(false);
    this.loading = true;
    this.currentLocale = this.currentLocale == null ? 'us' : this.currentLocale;
    this.calenderLocale = calenderLocaleFeilds[this.currentLocale];
    this._utilService.removeScrollHeight.subscribe(value => {
      if (value !== 0) {
        this.removeScrollHeight = value;
      }
    });
    this._utilService.checkRateHistoryCalled.subscribe(value => {
      if (value) {
        this.pagination.page = 1;
        this.pagination.firstPageIndex = 1;
        this.pagination.centerPageIndex = null;
        this.pagination.lastPageIndex = null;
        this._utilService.changeCheckRateHistoryCalled(false);
      }
    });
    this._utilService.callFilterData.subscribe(value => {
      if (value === 'auditLog') {
        this.filterData();
      }
    });
  }

  calculateGridScrollHeight() {
    if (this._utilityService.isTicketLogin()) {
      return { overflow: 'auto', height: 'calc(92vh - ' + `${this.removeScrollHeight}` + 'px)' };
    } else {
      return { overflow: 'auto', height: 'calc(100vh - ' + `${this.removeScrollHeight}` + 'px)' };
    }
  }

  activate() {
    if (this.isRateHistory) {
      this.rateParamsData = this.rateParamsInfo;
      this.isScheduleAuditCall = true;
      this.getRateScheduleHistory();
    } else {
      this._utilService.changedynamicSaveBtn('');
      this._utilService.updateApplyBodyScroll(false);
      this.getAuditLogList();
    }
  }

  getGridConfigData() {
    this._utilityService.getextdata({
      data: 'auditLogColumnDef.json',
      success: (result) => {
        this.columnDef = result;
        this.cols = this.columnDef.cols;
        this.convertDefaultSortOrder();
        this.initializeFields();
        this.loadGridData = true;
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this.auditConfigDataError = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
        this.loadGridData = false;
        this.loadError = true;
        this.loading = false;
      }
    });
  }

  convertDefaultSortOrder() {
    this.convertedDefaultSortOrder = (this.columnDef.defaultSortOrder == 'asc') ? 1 : -1;
  }

  clearFilters(column) {
    if (column.length > 1) {
      this.filterFields[column] = '';
      if (this.clearRuleSetStartDate !== undefined) {
        this.clearRuleSetStartDate.filter(value => delete this.filterFields[value]);
        this.clearRuleSetStartDate.length = 0;
      }
    } else {
      delete this.filterFields[column];
    }
    this.isFilterData = false;
    this.filterData();
  }

  isFilterText(column) {
    return this.filterFields[column] && this.filterFields[column].length > 0 ? true : false;
  }

  removeFilterFetchingError() {
    return this.auditLogGridErrMsg = '';
  }

  setSortandTableQuery() {
    const widgetData = {
      rateParams: this.rateParamsData,
      param: {
      }
    };
    if (!this.isScheduleAuditCall) {
      delete widgetData.param['paramtableId'];
      delete widgetData.param['templateId'];
      delete widgetData.param['pricelistId'];
    } else {
      widgetData.param = {
        'paramtableId': this.rateParamsData.paramtableId,
        'templateId': this.rateParamsData.itemTemplateId,
        'pricelistId': this.rateParamsData.pricelistId,
      };
    }
    if (!this.isDownload) {
      widgetData.param = {
        page: this.pagination.page,
        size: this.pagination.scrollPageSize,
      };
    } else {
      delete widgetData.param['page'];
      delete widgetData.param['scrollPageSize'];
    }
    if (Object.keys(this.sortQuery).length > 0) {
      widgetData.param['sort'] = this.sortQuery;
    }
    if (Object.keys(this.tableQuery).length > 0) {
      widgetData.param['query'] = this.tableQuery;
    }
    return widgetData;
  }

  getAuditLogList() {
    this.auditLogGridErrMsg = '';
    this.loading = true;
    this._auditLogService.getAuditLogList({
      data: this.setSortandTableQuery(),
      success: (result) => {
        this.callSuccess(result);
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this.auditConfigDataError = '';
        this.callFailure(this._utilityService.errorCheck(code, errorMsg, 'LOAD'));
      },
      onComplete: () => {
        this.loading = false;
      }
    });
  }

  getRateScheduleHistory() {
    this.loading = true;
    this._auditLogService.getRateScheduleHistory({
      data: this.setSortandTableQuery(),
      success: (result) => {
        this.callSuccess(result);
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this.callFailure(this._utilityService.errorCheck(code, errorMsg, 'LOAD'));
      },
      onComplete:  () => {
        this.loading = false;
      }
    });
  }

  public refreshGrid(records) {
    this.auditLogList = this._infiniteScrollCheckService.infiniteScrollData(records, this.infiniteScrollCheck, this.pagination,this.totalPageSize);
  }

  callSuccess(result) {
    let timer;
    clearTimeout(timer);
    timer = setTimeout(() => {
      result.filter ? this.filterKeys = result.filter : this.filterKeys = undefined;
      if (this.filterKeys !== undefined) {
        this.isFilterCallTrue = this._utilityService.getLatestServiceData(this.filterKeys, this.filteredField, this.filteredValue);
      }
      if(!this.isFilterCallTrue) {
      this.processProductOfferResult(result);
      }
      this.auditLogGridErrMsg = '';
      this.loading = false;
    }, 100);
  }

  callFailure(error) {
    this.auditLogList = [];
    this.auditLogGridErrMsg = error;
    this.loading = false;
    this.loadError = false;
    this.logListLength = undefined;
  }

  processProductOfferResult(auditLogData) {
    this.loading = false;
    this.logListLength = auditLogData.totalCount == 0 ? undefined : auditLogData.totalCount;
    this.noTableData = auditLogData.totalCount > 0 ? false : true;
    if (this.auditLogList !== null && this.auditLogList !== undefined) {
      if (Object.keys(this.tableQuery).length > 0) {
        this.noFilteredTableData = this.auditLogList.length > 0 ? false : true;
      }
    } else {
      if (Object.keys(this.tableQuery).length > 0) {
        this.noFilteredTableData = true;
      } else {
        this.noTableData = true;
      }
    }
    if (this.isFilterData) {
      if(this.pagination.page === 1) {
        this.auditLogList = [];
        this.auditLogList = auditLogData.records;
       }
       this.refreshGrid(auditLogData.records);
    } else {
      this.refreshGrid(auditLogData.records);
    }
    this.totalCount = auditLogData.totalCount;
    this.totalPageSize = auditLogData.totalPageSize;
    this.totalPages = auditLogData.totalPages;
    this._infiniteScrollCheckService.totalPages = this.totalPages;
    this.noTableData = this.totalCount > 0 ? false : true;
    if (this.refreshDataCheck) {
      this.refreshDataCheck = false;
    }
  }

  dateFieldConfig(field) {
    const fields = {
      createDt: 'createDt'
    };
    return fields[field] ? fields[field] : null;
  }

  fetchCreateDtValues(value) {
    this.selectedFilterData = value;
    if (this.selectedFilterData.selectedValue !== '' && this.selectedFilterData.selectedValue !== null) {
      if (this.selectedFilterData.selectedColumn !== 'ruleSetStartDate') {
        this.filterFields['createDt'] = this.selectedFilterData.selectedValue;
      } else {
        this.filterFields['createDt'] = this.selectedFilterData.selectedValue;
        this.filterFields['eventId'] = '(1400,1402)|in';
      }
      this.filterData();
    } else {
      if (this.selectedFilterData.selectedColumn === 'ruleSetStartDate') {
        this.clearRuleSetStartDate = ['createDt', 'eventId'];
        this.clearFilters(this.clearRuleSetStartDate);
      } else {
        this.clearFilters(this.selectedFilterData.selectedColumn);
      }
    }
  }

  aliasFields(field) {
    const fields = {
      user: 'loginName',
      ruleSetStartDate: 'createDt'
    };
    return fields[field] ? fields[field] : field;
  }

  numberConfigFields(field) {
    const fields = {
      auditId: 'auditId',
      eventId: 'eventId',
      entityId: 'entityId'
    };
    return fields[field] ? fields[field] : null;
  }

  loadData(event: any) {
    if (this.lazyLoad) {
      this._utilityService.resetPagination(this.pagination);
      this.sortQuery = {};
      this.getColumnSortOrder = (event.sortOrder === 1) ? 'asc' : 'desc';
      const configField = this.dateFieldConfig(event.sortField);
      event.sortField = this.aliasFields(event.sortField);
      if(event.sortField === 'loginName') {
        this.sortQuery[event.sortField] = this.getColumnSortOrder;
        this.sortQuery['space'] = this.getColumnSortOrder;
      } else {
        this.sortQuery[configField ? configField : event.sortField] = this.getColumnSortOrder;
      }
      this.scrollReset();
      this.toggleFunctions();
    }
    this.lazyLoad = true;
  }

  filterData() {
    this._utilityService.resetPagination(this.pagination);
    this.tableQuery = {};
    this.isFilterData = true;
    for (const key in this.filterFields) {
      const tableKey = this.filterFields[key].trim();
      if (tableKey !== ('' && undefined)) {
        if (this.dateFieldConfig(key)) {
          this.tableQuery[key] = tableKey;
        } else if (this.aliasFields(key)) {
          if (this.numberConfigFields(key)) {
            this.tableQuery[key] = tableKey;
          } else if (this.aliasFields(key) === 'loginName'){
            if(tableKey.trim().indexOf("/") === -1){
               this.tableQuery[this.aliasFields(key)] = `'%${tableKey.trim()}%'|like`;
             } else {
               let userQuery = tableKey.trim().split("/");
               if(userQuery[0].length >= 1 && userQuery[1].length >= 1) {
                 this.tableQuery[this.aliasFields(key)] = `'%${userQuery[0]}'|like`; 
                 this.tableQuery['space'] = `'${userQuery[1]}%'|like`;
               } else if(userQuery[0].length >= 1 && userQuery[1].length <= 1) {
                 this.tableQuery[this.aliasFields(key)] = `'%${userQuery[0]}'|like`;
               } else {
                 this.tableQuery['space'] = `'${userQuery[1]}%'|like`;
               }
             }
          } else {
            this.tableQuery[this.aliasFields(key)] = `'%${tableKey.trim()}%'|like`;
          }
        }
      } else {
        delete this.filterFields[key];
      }
    }
    this.scrollReset();
    this.toggleFunctions();
  }

  filterDataKeys(event, field, value) {
    this.filteredField = this.aliasFields(field) ? this.filteredField = this.aliasFields(field) : this.filteredField = value;
    this.filteredValue = value;
    this._utilityService.enableFilter(event,'auditLog');
  }

  filterDataDelay() {
    if (this.filterDataProcessing == false) {
      this.filterDataProcessing = true;
      setTimeout(() => {
        this.filterDataProcessing = false;
        this.filterData();
      }, 500);
    }
  }

  getDeviceWidth() {
    return window.innerWidth + 'px';
  }

  getRateSchedulesAuditLogInfo(record) {
    this.selectedRateChange = record;
    this.showRateChanges = true;
  }

  exportToCSV() {
      this.loading = true;
      this.isDownload = true;
      this._auditLogService.exportToCSV({
        data: this.setSortandTableQuery(),
        success: (result) => {
          this._utilityService.downloadFile(result, 'Export.csv');
        },
        failure: (errorMsg: string, code: any, error: any) => {
          this.loadError = false;
          this.auditConfigDataError = this._utilityService.errorCheck(code, errorMsg, 'DOWNLOAD');
        },
        onComplete: () => {
          this.loading = false;
          this.isDownload = false;
        }
      });
  }

  toggleFunctions() {
    if (this.isScheduleAuditCall) {
      this.getRateScheduleHistory();
    } else {
      this.getAuditLogList();
    }
  }

  validateEventName(eventId) {
    const eventIdArray = [1402];
    return eventIdArray.indexOf(eventId) === -1 ? true : false;
  }

  refreshData() {
    this.loading = true;
    this._utilityService.resetPagination(this.pagination);
    this.loadGridData = false;
    this.lazyLoad = false;
    this.getGridConfigData();
    this.refreshDataCheck = true;
    this.initializeFields();
    this.scrollReset();
    this._utilService.changedRefreshNumberDateFilter(true);
    this._utilService.updateChangeScrollposition('refresh');
  }

  initializeFields() {
    this.tableQuery = {};
    this.filterFields = {};
    this.sortQuery = {};
    this.sortQuery[this.columnDef.defaultSortColumn] = this.columnDef.defaultSortOrder;
  }

  onRateChangeClose(event) {
    this.showRateChanges = false;
  }

  ngOnDestroy() {
    if (this.auditLogSubscription) {
      this.auditLogSubscription.unsubscribe();
    }
    this._infiniteScrollCheckService.totalPages = 0;
    this._utilService.checkCallFilterData('');
  }

  getErrorMessageType() {
    const filterCriteriaLength = !this._utilityService.isObject(this.tableQuery) ? 0 : Object.keys(this.tableQuery).length;
    if (this.loading) {
        return 0;
    }
    if (this.auditLogGridErrMsg) {
        return 1;
    } else if (this.auditLogList != undefined && this.auditLogList.length === 0 && filterCriteriaLength === 0) {
       if(this.auditLogGridErrMsg === '') {
         return 2;
        }
    } else if (this.auditLogList != undefined && this.auditLogList.length === 0 && filterCriteriaLength > 0) {
      if (this.auditLogGridErrMsg === '') {
        return 3;
      }
    }
    return 0;
}
}
