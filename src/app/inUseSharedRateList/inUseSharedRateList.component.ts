import { Component, EventEmitter, ViewChild, OnInit, Input, Output, OnDestroy } from '@angular/core';
import { InuseSharedRatelistService } from '../inUseSharedRateList/inUseSharedRateList.service';
import { UtilityService } from '../helpers/utility.service';
import { Language } from 'angular-l10n';
import { DropdownModule, SelectItem } from 'primeng/primeng';
import { utilService } from '../helpers/util.service';
import { InfiniteScrollCheckService } from '../helpers/InfiniteScrollCheck.service';

@Component({
  selector: 'ecb-inuse-shared-ratelist',
  templateUrl: './inUseSharedRateList.component.html',
  styleUrls: ['./inUseSharedRateList.component.scss']
})

export class InuseSharedRateListComponent implements OnInit, OnDestroy {

  @Language() lang: string;
  piTemplateColumns;
  piTemplateError;
  filterFields;
  filterQuery;
  sortQuery;
  isFilterCriterialProcessing;
  showErrorMessage;
  inUseOffers;
  showInUseOfferings;
  sharedRatelist = [];
  confirmDialog:number;
  inUseSharedRateSubscribe: any;
  isPItemplate;
  templateId;
  sharedRateListFetching;
  inUseSharedRatelistErrorMessage;
  sharedRatelistCount;
  convertedInUseDefaultSortOrder;
  getInUseColumnSortOrder;
  columnDef;
  loadGridData = false;
  pagination;
  infiniteScrollCheck: string = '';
  moreDataCalled: boolean;
  totalPageSize;
  moreData;
  lessData;
  totalPages;
  isFilterData: boolean;
  @Input() sharedRatesData: any;
  @Input() sharedRatesLocation: any;
  @Output() inUseSharedRatesClose = new EventEmitter();
  onLazyLoad = false;
  removeScrollHeight: any;
  filteredField: any;
  filteredValue: any;
  isFilterCallTrue: boolean;
  filterKeys: any;
  childNames: any;
  inUseGridConfigError: string = '';

  constructor(private _inUseSharedRatelist: InuseSharedRatelistService,
    private _utilityService: UtilityService,
    private _utilService: utilService,
    private _infiniteScrollCheckService: InfiniteScrollCheckService) {
    this.reset();
    this.confirmDialog = 0;
  }

  scrollInitialize(pagination) {
    this.pagination = pagination;
    this.openInUseSharedRatelist();
  }
  scrollReset() {
    this.pagination = this.pagination.reset();
  }

getMoreData() {
  this._utilService.getScrollHeight(true);
    if(this.sharedRatelist !== undefined){
      this.moreData = this._infiniteScrollCheckService.getMoreScrollData(!this.sharedRateListFetching,this.sharedRatelist.length,this.pagination,this.totalPageSize,this.totalPages);
       if (this.moreData !== undefined) {
         this.infiniteScrollCheck = this.moreData.infiniteScrollCheck;
         this.moreDataCalled = this.moreData.moreDataCalled;
        this.openInUseSharedRatelist();
      }
    }
  }

  getLessData() {
     if(this.sharedRatelist !== undefined){
    this.lessData = this._infiniteScrollCheckService.getLessScrollData(!this.sharedRateListFetching,this.sharedRatelist.length,this.pagination,this.moreDataCalled);
     if (this.lessData !== null) {
         this.infiniteScrollCheck = this.lessData.infiniteScrollCheck;
         this.moreDataCalled = this.lessData.moreDataCalled;
         this.openInUseSharedRatelist();
     }
    }
  }

  ngOnInit() {
    this.getGridConfigData();
    this.templateId = this.sharedRatesData['templateId'];
    this.inUseSharedRateSubscribe = this._utilService.removeScrollHeight.subscribe(value => {
      if (value !== 0) {
        this.removeScrollHeight = value;
      }
    });
    const filterData = this._utilService.callFilterData.subscribe(value => {
      if (value === 'inUseSharedRate') {
        this.prepareFilterQuery();
      }
    });
    this.inUseSharedRateSubscribe.add(filterData);
  }

  calculateGridScrollHeight() {
    return {overflow: 'auto', height: 'calc(100vh - ' + `${this.removeScrollHeight}` +'px)'}
  }
  getGridConfigData() {
    setTimeout(() => {
      this.confirmDialog = 1;
      this.sharedRateListFetching = true;
    }, 100);
    this._utilityService.getextdata({
      data: 'inUseSharedRatelistColumnDef.json',
      success: (result) => {
        this.columnDef = result;
        if(!this._utilityService.isEmpty(this.sharedRatesData.childs)){
           this.childNames = [];
           this.piTemplateColumns = this.columnDef.cols;
            this.sharedRatesData.childs.forEach(e => {
              this.childNames.push(e.templateId);
            });
         }
         else {
          let columnDef = this.columnDef.cols.filter(e => e.key !== 'TEXT_PI_TEMPLATE');
          this.piTemplateColumns = columnDef;
         }
        this.sortQuery[this.columnDef.defaultSortColumn] = this.columnDef.defaultSortOrder;
        this.loadGridData = true;
        if (this.sharedRatesLocation === 'priceableItemTemplateGrid') {
          this.isPItemplate = true;
          if (this.columnDef) {
            this.inUseSharedRatelistErrorMessage = null;
          }
        }
      },
      failure: (errorMsg:string, code: any, error: any) => {
        this.confirmDialog = 1;
        this.inUseGridConfigError = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
        this.loadGridData = false;
      },
      onComplete: ()=>{
        this.sharedRateListFetching = false;
      }
    });
  }

  public reset() {
    this.sharedRatelist = [];
    this.inUseSharedRatelistErrorMessage = null;
    this.filterFields = {};
    this.filterQuery = {};
    this.sortQuery = {};
    this.isFilterCriterialProcessing = false;
    this.sharedRateListFetching = false;
  }

  public prepareFilterQuery() {
    this._utilityService.resetPagination(this.pagination);
    this.filterQuery = {};
    this.isFilterData = true;
    for (const key in this.filterFields) {
      if (this.filterFields[key].trim() !== '') {
        this.filterQuery[key] = `'%${this.filterFields[key].trim()}%'|like`;
      }
    }
    this.openInUseSharedRatelist();
  }
  filterDataKeys(event, field, value) {
    this.filteredField = field;
    this.filteredValue = value;
    this._utilityService.enableFilter(event, 'inUseSharedRate');
  }

  getPriceableItemtFilterData() {
    if (this.isFilterCriterialProcessing === false) {
      this.isFilterCriterialProcessing = true;
      setTimeout(() => {
        this.isFilterCriterialProcessing = false;
        this.prepareFilterQuery();
      }, 300);
    }
  }

  clearFilters(column) {
    this.filterFields[column] = '';
    this.isFilterData = false;
    this.prepareFilterQuery();
  }

  isFilterText(column) {
    return this.filterFields[column] && this.filterFields[column].length > 0 ? true : false;
  }

  convertInUseDefaultSortOrder() {
    this.convertedInUseDefaultSortOrder = (this.getInUseColumnSortOrder === 'desc') ? -1 : 1;
  }

  loadData(event) {
    if (this.onLazyLoad) {
    this.sortQuery = {};
      this._utilityService.resetPagination(this.pagination);
      if (event.sortField !== undefined) {
        this.getInUseColumnSortOrder = (parseInt(event.sortOrder) === 1) ? 'asc' : 'desc';
        this.sortQuery[event.sortField] = this.getInUseColumnSortOrder;
      }
      this.openInUseSharedRatelist();
    }
    this.onLazyLoad = true;
  }

  openInUseSharedRatelist() {
    this.convertInUseDefaultSortOrder();
    const widgetData = {
      param: {
        page: this.pagination.page,
        size: this.pagination.scrollPageSize
      },
      Id: this.templateId,
      offeringLocation: this.sharedRatesLocation
    };
    if(!this._utilityService.isEmpty(this.childNames)){
      widgetData.param['childPiTemplate'] = this.childNames.join();
    }
    if (Object.keys(this.sortQuery).length > 0) {
      widgetData.param['sort'] = this.sortQuery;
    }
    if (Object.keys(this.filterQuery).length > 0) {
      widgetData.param['query'] = this.filterQuery;
    }
    this._inUseSharedRatelist.getInUseSharedRatelist({
      data: widgetData,
      success: (result) => {
        result.filter ? this.filterKeys = result.filter : this.filterKeys = undefined;
        if (this.filterKeys !== undefined) {
            this.isFilterCallTrue = this._utilityService.getLatestServiceData(this.filterKeys, this.filteredField, this.filteredValue);
        }
        if (!this.isFilterCallTrue) {
          this.refreshGrid(result.records);
        }
        this.sharedRatelistCount = result.totalCount;
        this.totalPageSize = result.totalPageSize;
        this.totalPages = result.totalPages;
        this._infiniteScrollCheckService.totalPages = this.totalPages;
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this.sharedRatelist = [];
        this.inUseSharedRatelistErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
      },
      onComplete: () => {
        this.sharedRateListFetching = false;
      }
    });
  }

  public refreshGrid(records) {
    if (this.pagination.page === 1 && this.isFilterData) {
      this.sharedRatelist = [];
    }
    this.sharedRatelist = this._infiniteScrollCheckService.infiniteScrollModalData(records, this.infiniteScrollCheck, this.pagination,this.totalPageSize);
  }

  getDeviceWidth() {
    return window.innerWidth + 'px';
  }

  getErrorMessageType() {
    const filterCriteriaLength = !this._utilityService.isObject(this.filterQuery) ? 0 : Object.keys(this.filterQuery).length;
    this.showErrorMessage = true;
    if (this.sharedRateListFetching) {
      return 0;
    }
    if (this.inUseSharedRatelistErrorMessage) {
      return 1;
    } else if (this.sharedRatelist.length === 0 && filterCriteriaLength === 0) {
      if(this.inUseSharedRatelistErrorMessage == ''){
      return 2;
      }
    } else if (this.sharedRatelist.length === 0 && filterCriteriaLength > 0) {
      if(this.inUseSharedRatelistErrorMessage == ''){
        return 3;
      }
    }
    return 0;
  }

  ngOnDestroy() {
    if(this.inUseSharedRateSubscribe){
      this.inUseSharedRateSubscribe.unsubscribe();
    }
  }

  onModalDialogClose(event) {
    this.confirmDialog = 0;
    this.sharedRatelist = [];
    this._infiniteScrollCheckService.totalPages = 0;
    this.inUseSharedRatelistErrorMessage = null;
    this.filterFields = {};
    this.filterQuery = {};
    this.sortQuery = {};
    this.isFilterCriterialProcessing = false;
    this.sharedRateListFetching = false;
    this.getInUseColumnSortOrder = 'asc';
    this.inUseSharedRatesClose.emit(true);
    this._utilService.checkCallFilterData('');
  }
}
