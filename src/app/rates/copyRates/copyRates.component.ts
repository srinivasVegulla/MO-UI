import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Language, DefaultLocale, Currency, LocaleService, TranslationService } from 'angular-l10n';

import { calenderLocaleFeilds } from '../../../assets/calenderLocalization';
import { DatePipe } from '@angular/common';

import { UtilityService } from '../../helpers/utility.service';
import { RatesService } from '../rates.service';
import { utilService } from '../../helpers/util.service';
import { InfiniteScrollCheckService } from '../../helpers/InfiniteScrollCheck.service';

@Component({
  selector: 'ecb-copyRates',
  templateUrl: './copyRates.component.html',
  styleUrls: ['./copyRates.component.scss']
})

export class CopyRatesComponent implements OnInit, OnDestroy {
  copyRatesCols;
  filterFields;
  sortQuery;
  confirmDialog: number;
  lazyLoad: boolean;
  tableQuery;
  copyRatesError;
  getColumnSortOrder;
  filterPiDataProcessing;
  paramTableId: number;
  paramTableName: string;
  rateSchedules = [];
  fromScheduleId: number;
  toScheduleId: number;
  isCopyEnabled: boolean;
  calenderLocale;
  currentLocale;
  isRateScheduleError;
  rateScheduleListCount: number;
  startValue;
  endValue;
  convertedDefaultSortOrder;
  showErrorMessage: boolean;
  httpErrorMessage;
  columnDef;
  copyRatesLoading: boolean;
  confirmDialog2: number;
  loadGridData = false;
  pagination: any;
  infiniteScrollCheck: string = '';
  moreDataCalled: boolean;
  totalPageSize: number;
  moreData;
  lessData;
  totalPages;
  isFilterData: boolean;
  filteredField: any;
  filteredValue: any;
  isFilterCallTrue: boolean;
  filterKeys: any;
  errorMessageDisplay: any;

  @Output() onClose = new EventEmitter<any>();
  @Output() val = new EventEmitter<boolean>();

  @Input() set rateTableVal(value) {
    if (value != null) {
      this.paramTableId = value.schedule.ptId;
      this.paramTableName = value.schedule.ptName;
      this.toScheduleId = value.schedule.schedId;
    }
  }

  constructor(private _ratesService: RatesService,
    private _utilityService: UtilityService,
    private locale: LocaleService,
    private _utilService: utilService,
    private _translationService: TranslationService,
    private _infiniteScrollCheckService: InfiniteScrollCheckService) {
    this.startValue = this._translationService.translate('TEXT_START_DATE').split(' ', 1);
    this.endValue   = this._translationService.translate('TEXT_END_DATE').split(' ', 1);
    this.reset();
   }

   public reset() {
    this.totalPageSize = 0;
   }

  scrollInitialize(pagination) {
    this.pagination = pagination;
  }

  scrollReset() {
    this.pagination = this.pagination.reset();
  }

   getMoreData() {
    this._utilService.getScrollHeight(true);
    if(this.rateSchedules !== undefined){
      this.moreData = this._infiniteScrollCheckService.getMoreScrollData(!this.copyRatesLoading,this.rateSchedules.length,this.pagination,this.totalPageSize,this.totalPages);
       if (this.moreData !== undefined) {
         this.infiniteScrollCheck = this.moreData.infiniteScrollCheck;
         this.moreDataCalled = this.moreData.moreDataCalled;
         this.showRateSchedules();
      }
    }
  }

  getLessData() {
     if(this.rateSchedules !== undefined){
    this.lessData = this._infiniteScrollCheckService.getLessScrollData(!this.copyRatesLoading,this.rateSchedules.length,this.pagination,this.moreDataCalled);
     if (this.lessData !== null) {
         this.infiniteScrollCheck = this.lessData.infiniteScrollCheck;
         this.moreDataCalled = this.lessData.moreDataCalled;
         this.showRateSchedules();
     }
    }
  }

  ngOnInit() {
    this.showErrorMessage = false;
    this.getGridConfigData();
    this.currentLocale = this.locale.getCurrentLocale();
    this.currentLocale = this.currentLocale == null ? 'us' : this.currentLocale;
    this.calenderLocale = calenderLocaleFeilds[this.currentLocale];
    this.confirmDialog = 1;
    this.filterFields = {};
    this.sortQuery = {};
    this.tableQuery = {};
    this.lazyLoad = false;
    this.filterPiDataProcessing = false;
    this.isCopyEnabled = false;
    this._utilService.changeRateSchedulerID(this.rateTableVal);
    this._utilService.callFilterData.subscribe(value => {
      if (value === 'copyRates') {
        this.filterData();
      }
    });
  }

  getGridConfigData() {
    this._utilityService.getextdata({
      data: 'copyRatesColumnDef.json',
      success: (result) => {
        this.columnDef = result;
        this.copyRatesCols = this.columnDef.cols;
        this.sortQuery[this.columnDef.defaultSortColumn] = this.columnDef.defaultSortOrder;
        this.showRateSchedules();
        this.loadGridData = true;
      },
      failure: (error) => {
       this.loadGridData = false;
      }
    });
  }

  onModalDialogClose() {
    this.confirmDialog = 0;
    this.setCopyRateSchedules();
    this._utilService.checkCallFilterData('');
  }

  showRateSchedules() {
    this.convertDefaultSortOrder();
    const widgetData = {
      param: {
        ptName: this.paramTableName,
        page: this.pagination.page,
        size: this.pagination.scrollPageSize
      },
      paramTableId: this.paramTableId,
      toScheduleId: this.toScheduleId
    };
    if (Object.keys(this.sortQuery).length > 0) {
      widgetData.param['sort'] = this.sortQuery;
    }
    if (Object.keys(this.tableQuery).length > 0) {
      widgetData.param['query'] = this.tableQuery;
    }
    this.copyRatesLoading = true;
    this._ratesService.getRateSchedulesByParameterTable({
      data: widgetData,
      success: (result) => {
        this.totalPageSize = result.totalPageSize;
        this.totalPages = result.totalPages;
        this._infiniteScrollCheckService.totalPages = this.totalPages;
        result.filter ? this.filterKeys = result.filter : this.filterKeys = undefined;
            if (this.filterKeys !== undefined) {
                this.isFilterCallTrue = this._utilityService.getLatestServiceData(this.filterKeys, this.filteredField, this.filteredValue);
            }
            if(!this.isFilterCallTrue) {
              this.processRequest(result);
            }
        this.rateScheduleListCount = Number(result.totalCount);
        if (this.rateScheduleListCount === 0 || this.rateScheduleListCount === undefined) {
          this.isCopyEnabled = false;
        }
        this.copyRatesLoading = false;
      },
      failure: (error) => {
        this.rateSchedules = [];
        this.showErrorMessage = true;
        this.httpErrorMessage = error;
        this.copyRatesLoading = false;
      }
    });
  }

  processRequest(result) {
    if (this.isFilterData) {
      if(this.pagination.page === 1) {
        this.rateSchedules = [];
        this.rateSchedules = result.records;
       }
       this.refreshGrid(result.records);
    } else {
      this.refreshGrid(result.records);
    }
  }

  public refreshGrid(records) {
    this.rateSchedules = this._infiniteScrollCheckService.infiniteScrollData(records, this.infiniteScrollCheck, this.pagination,this.totalPageSize);
  }

  loadData(event: any) {
    if (this.lazyLoad) {
      this.sortQuery = {};
      this._utilityService.resetPagination(this.pagination);
      this.getColumnSortOrder = (event.sortOrder === 1) ? 'asc' : 'desc';
      this.sortQuery[event.sortField] = this.getColumnSortOrder;
      this.showRateSchedules();
      this.scrollReset();
    }
    this.lazyLoad = true;
  }
  filterDataKeys(event, field, value) {
    this.filteredField = field;
    this.filteredValue = value;
    this._utilityService.enableFilter(event, 'copyRates');
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

  private filterData() {
    this._utilityService.resetPagination(this.pagination);
    this.tableQuery = {};
    this.isFilterData = true;
    for (const key in this.filterFields) {
      if (this.filterFields[key].trim() !== '') {
        this.tableQuery[key] = `'%${this.filterFields[key].trim()}%'|like`; 
      }
    }
    this.showRateSchedules();
  }

  clearFilters(column) {
    this.filterFields[column] = '';
    this.isFilterData = false;
    this.filterData();
  }

  isFilterText(column) {
    return this.filterFields[column] && this.filterFields[column].length > 0 ? true : false;
  }

  getRatesTable(idx) {
    if (this.rateSchedules !== undefined && this.rateSchedules != null && (this.rateSchedules).length > 0) {
      this.fromScheduleId = this.rateSchedules[idx].schedId;
    }
    if (idx !== undefined  && idx != null) {
      this.isCopyEnabled = true;
    } else {
      this.isCopyEnabled = false;
    }
  }

  copyRateSchedule() {
    this.showErrorMessage = false;
    this.confirmDialog2 = 0;
    this._ratesService.copyRateSchedule({
      data : {
        fromScheduleId : this.fromScheduleId,
        toScheduelId : this.toScheduleId
      },
      success : (result) => {
        this.onModalDialogClose();
        this._ratesService.copyRates(true);
        this.setCopyRateSchedules();
      },
      failure : (errorMsg: string, code: any) => {
        this.showErrorMessage = true;
        this.errorMessageDisplay = this._utilityService.errorCheck(code, errorMsg, 'ADD');
        this.httpErrorMessage = errorMsg;
      },
      onComplete : () => {
        this.isCopyEnabled = true;
      }
    });
  }

  getDeviceWidth() {
    return window.innerWidth + 'px';
  }
  convertDefaultSortOrder() {
    this.convertedDefaultSortOrder = (this.columnDef.defaultSortOrder === 'asc') ? 1 : -1;
  }
  displayCopyRateSchedules() {
    this.isCopyEnabled = false;
    this.confirmDialog2 = 1;
  }

  onModalDialogCopyCancel(){
    this.isCopyEnabled = true;
    this.confirmDialog2 = 0;
  }

  setCopyRateSchedules() {
    this.val.emit(false);
  }

  getErrorMessageType() {
        const filterCriteriaLength = !this._utilityService.isObject(this.tableQuery) ? 0 : Object.keys(this.tableQuery).length;
        if (this.copyRatesLoading) {
          return 0;
        }
        if (this.showErrorMessage) {
            return 1;
        }
         else if (this.rateScheduleListCount === 0 && filterCriteriaLength === 0) {
            return 2;
      } 
        else if (this.rateSchedules === null && filterCriteriaLength > 0)  {
            return 3;
        }
        return 0;
    }
  ngOnDestroy() {
    this._infiniteScrollCheckService.totalPages = 0;
    this._ratesService.copyRates(false);
  }
}
