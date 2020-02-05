import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { utilService } from '../../helpers/util.service';
import { SharedPricelistService } from '../shared.pricelist.service';
import { DefaultLocale } from 'angular-l10n';
import { UtilityService } from '../../helpers/utility.service';
import { InfiniteScrollCheckService } from '../../helpers/InfiniteScrollCheck.service';

@Component({
  selector: 'ecb-ratelist-inusesubscribers',
  templateUrl: './inUseSubscribers.component.html',
  styleUrls: ['./inUseSubscribers.component.scss']
})

export class RlInUseSubscribersComponent implements OnInit, OnDestroy {
  inUseSubscribersColumnDef;
  inUseSubscribersCols: any[];
  filterFields: any;
  sortQuery: any;
  tableQuery: any;
  inUseSubscribers = [];
  getColumnSortOrder: any;
  lazyLoad: boolean;
  confirmDialog: number;
  @DefaultLocale() defaultLocale: string;
  filterPiDataProcessing: boolean;
  priceListId: number;
  selectedSharedPricelist: any;
  inUseSubscribersError: any;
  inUseSubscribersGridConfigError: any;
  inUseSubscribersFetching = false;
  selectedFilterData: any;
  convertedInUseDefaultSortOrder;
  loadGridData = false;
  filteredField: any;
  filteredValue: any;
  isFilterCallTrue: boolean;
  filterKeys: any;
  pagination: any;
  totalPageSize: any;
  totalPages: any;
  moreData;
  lessData;
  moreDataCalled: boolean;
  isFilterData: boolean;
  removeScrollHeight: any;
  infiniteScrollCheck: string = '';
  totalCount;
  inUseSubscriptions;

  @Output() onClose = new EventEmitter<any>();

  @Input() set priceListIdVal(value) {
    if (value != null) {
      this.priceListId = value.pricelistId;
      this.selectedSharedPricelist = value;
    }
  }

  constructor(private _sharedPricelistService: SharedPricelistService,
              private _utilityService: UtilityService,
              private _utilService: utilService,
            private _infiniteScrollCheckService: InfiniteScrollCheckService) {
  }

  ngOnInit() {
    this.getGridConfigData();
    this.filterFields = {};
    this.sortQuery = {};
    this.tableQuery = {};
    this.confirmDialog = 1;
    this.lazyLoad = false;
    this.filterPiDataProcessing = false;
    this.inUseSubscriptions = this._utilService.removeScrollHeight.subscribe(value => {
      if (value !== 0) {
        this.removeScrollHeight = value;
      }
    });
    const filterData = this._utilService.callFilterData.subscribe(value => {
      if (value === 'inUseSubscribers') {
        this.filterData();
      }
    });
    this.inUseSubscriptions.add(filterData);
  }

  scrollInitialize(pagination) {
    this.pagination = pagination;
  }

  scrollReset() {
    this.pagination = this.pagination.reset();
  }

  getMoreData() {
    this._utilService.getScrollHeight(true);
      if(this.inUseSubscribers !== undefined){
        this.moreData = this._infiniteScrollCheckService.getMoreScrollData(!this.inUseSubscribersFetching,this.inUseSubscribers.length,this.pagination,this.totalPageSize,this.totalPages);
         if (this.moreData !== undefined) {
           this.infiniteScrollCheck = this.moreData.infiniteScrollCheck;
           this.moreDataCalled = this.moreData.moreDataCalled;
           this._utilService.getScrollHeight(true);
           this._utilService.updateChangeScrollposition('modified');
           this.showInUseSubscribersDetails();
        }
      }
    }

  getLessData() {
    if(this.inUseSubscribers !== undefined){
      this.lessData = this._infiniteScrollCheckService.getLessScrollData(!this.inUseSubscribersFetching,this.inUseSubscribers.length,this.pagination,this.moreDataCalled);
    if (this.lessData !== null) {
      this.infiniteScrollCheck = this.lessData.infiniteScrollCheck;
      this.moreDataCalled = this.lessData.moreDataCalled;
      this.showInUseSubscribersDetails();
      }
    }
  }

  calculateGridScrollHeight() {
    return {overflow: 'auto', height: 'calc(100vh - ' + `${this.removeScrollHeight}` +'px)'}
  }

  getGridConfigData() {
    this._utilityService.getextdata({
      data: 'inUseSubscribersColumnDef.json',
      success: (result) => {
        this.inUseSubscribersColumnDef = result;
        this.inUseSubscribersCols = this.inUseSubscribersColumnDef.cols;
        this.sortQuery[this.inUseSubscribersColumnDef.defaultSortColumn]  =  this.inUseSubscribersColumnDef.defaultSortOrder;
        this.loadGridData = true;
        this.showInUseSubscribersDetails();
      },
      failure: (errorMsg:string, code: any, error: any) => {
        this.inUseSubscribersGridConfigError = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
        this.loadGridData = false;
      }
    });
  }

  fetchAccountId(value) {
    this.selectedFilterData = value;
    if (this.selectedFilterData.selectedValue !== '' && this.selectedFilterData.selectedValue !== null) {
        this.filterFields['accountId'] = this.selectedFilterData.selectedValue;
       this.filterData();
      } else {
        this.clearFilters(this.selectedFilterData.selectedColumn);
     }
  }

  public showInUseSubscribersDetails() {
    this.convertInUseDefaultSortOrder();
    this.inUseSubscribersError = '';
    this.inUseSubscribersFetching = true;
    const widgetData = {
      param: {
        page: this.pagination.page,
        size: this.pagination.scrollPageSize,
        query: {
        }
      }
    };
    if (Object.keys(this.sortQuery).length > 0) {
      widgetData.param['sort'] = this.sortQuery;
    }
    if (Object.keys(this.tableQuery).length > 0) {
      widgetData.param['query'] = this.tableQuery;
    }
    widgetData.param['query']['pricelistId'] = this.priceListId;
    this._sharedPricelistService.showInUseSubscribers({
      data: widgetData,
      success: (result) => {
        this.totalPageSize = result.totalPageSize;
        this.totalPages = result.totalPages;
        this.totalCount = result.totalCount;
        this._infiniteScrollCheckService.totalPages = this.totalPages;
        this.inUseSubscribers = result.records;
        result.filter ? this.filterKeys = result.filter : this.filterKeys = undefined;
        if (this.filterKeys !== undefined) {
          this.isFilterCallTrue = this._utilityService.getLatestServiceData(this.filterKeys, this.filteredField, this.filteredValue);
        }
        if (!this.isFilterCallTrue) {
	if(this.pagination.page === 1) {
            this.inUseSubscribers = [];
            this.inUseSubscribers = result.records;
           }
           this.refreshGrid(result.records);
        } else {
          this.refreshGrid(result.records);
        }
      },
      failure: (errorMsg:string, code: any, error: any) => {
        this.inUseSubscribers = [];
        this.inUseSubscribersError = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
      },
      onComplete: () => {
        this.inUseSubscribersFetching = false;
      }
    });
  }

  public refreshGrid(records) {
    if (this.pagination.page === 1) {
      this.inUseSubscribers = [];
    }
    this.inUseSubscribers = this._infiniteScrollCheckService.infiniteScrollModalData(records, this.infiniteScrollCheck, this.pagination,this.totalPageSize);
  }

  convertInUseDefaultSortOrder() {
    this.convertedInUseDefaultSortOrder = (this.getColumnSortOrder === 'desc') ? -1 : 1;
  }

  loadData(event: any) {
    if (this.lazyLoad) {
      this._utilityService.resetPagination(this.pagination);
      this.sortQuery = {};
      this.getColumnSortOrder = (event.sortOrder === 1) ? 'asc' : 'desc';
      this.sortQuery[event.sortField] = this.getColumnSortOrder;
      this.showInUseSubscribersDetails();
    }
    this.lazyLoad = true;
  }

  clearFilters(column) {
    this.filterFields[column] = '';
    this.isFilterData = false;
    this.filterData();
    this.inUseSubscribersError = null;
  }

  filterData() {
    this._utilityService.resetPagination(this.pagination);
    this.inUseSubscribersError = null;
    this.isFilterData = true;
    this.tableQuery = {};
    for (const key in this.filterFields) {
      if (this.filterFields[key].trim() !== '') {
        if (key === 'accountId') {
          this.tableQuery[key] = this.filterFields[key];
          } else {
          this.tableQuery[key] = `'%${this.filterFields[key].trim()}%'|like`;
          }
      }
    }
    this.showInUseSubscribersDetails();
  }

  filterDataKeys(event, field, value) {
    this.filteredField = field;
    this.filteredValue = value;
    this._utilityService.enableFilter(event, 'inUseSubscribers');
  }

  filterDataDelay() {
    if (this.filterPiDataProcessing === false) {
      this.filterPiDataProcessing = true;
      setTimeout(() => {
        this.filterPiDataProcessing = false;
        this.filterData();
      }, 300);
    }
  }

  isFilterText(column) {
    return this.filterFields[column] && this.filterFields[column].length > 0 ? true : false;
  }

  onModalDialogCloseDelete() {
    this.confirmDialog = 0;
    this._infiniteScrollCheckService.totalPages = 0;
    this._utilService.checkCallFilterData('');
    setTimeout(() => {
       this.onClose.emit();
    }, 100);
    this.getColumnSortOrder = 'asc';
  }

  allowOnlyNumbers(event) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  getErrorMessageType() {
    const filterCriteriaLength = !this._utilityService.isObject(this.tableQuery) ? 0 :  Object.keys(this.tableQuery).length;
    if (this.inUseSubscribersError) {
      return 1;
    } else if (this.inUseSubscribers.length === 0 && filterCriteriaLength > 0) {
      if (this.inUseSubscribersError == ''){
        return 2;
      }
    }
    return 0;
  }

  ngOnDestroy() {
    this._infiniteScrollCheckService.totalPages = 0;
    if (this.inUseSubscriptions) {
      this.inUseSubscriptions.unsubscribe();
    }
  }
}
