import { Component, OnInit, Input, Output,EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { AutoComplete } from 'primeng/primeng';
import { Language } from 'angular-l10n';
import { CalendarsService } from '../calendars-list.service';
import { utilService } from '../../helpers/util.service';
import { UtilityService } from '../../helpers/utility.service';
import { InfiniteScrollCheckService } from '../../helpers/InfiniteScrollCheck.service';

@Component({
  selector: 'ecb-calendars-modal-dialog',
  templateUrl: './inUseCalendarsModalDialog.component.html',
  styleUrls: ['./inUseCalendarsModalDialog.component.scss']
})
export class InUseCalendarsModalDialogComponent implements OnInit, OnDestroy {
  inUseCols: any[];
  inUseTableConfig: any;
  inUseErrorMessage: string;
  noInUseTableData = false;
  noInUseFilteredTableData = false;
  @Language() lang: string;
  @ViewChild(AutoComplete) readonly autoComplete: AutoComplete;
  filterInUseFields: any;
  filterInUseDataProcessing = false;
  filterInUseErrorMessage: any;
  loading: boolean;
  inUseLazyLoad = false;
  inUseColumnDef: any;
  convertedInUseDefaultSortOrder: any;
  inUsePiList: any[] = [];
  confirmDialog: number;
  inUseSortQuery: any;
  inUseTableQuery: any;
  offeringsTypes: any;
  offeringsTypesList: any[];
  selectedOfferingType: any;
  selectedOfferings: any;
  loaderHeight: any;
  offeringFirstItem: string;
  getInUseColumnSortOrder;
  inUseCalendarsSubscribe: any;
  isFilterCriterialProcessing: any;
  loadGridData = false;
  infiniteScrollCheck: string = '';
  moreDataCalled: boolean;
  pagination: any;
  totalPageSize: number;
  totalCount: number;
  moreData;
  lessData;
  totalPages;
  isFilterData: boolean;
  @Input() inUsePIData: any;
  @Output() inUseCalendarModalDialogClose = new EventEmitter();
  filteredField: any;
  filteredValue: any;
  isFilterCallTrue: boolean;
  filterKeys: any;
  inUseConfigError: string = '';

  constructor(private _utilService: utilService,
    private _calendarsService: CalendarsService,
    private readonly _utilityService: UtilityService,
    private _infiniteScrollCheckService: InfiniteScrollCheckService) {
    this.confirmDialog = 0;
  }
  ngOnInit() {
    this.getGridConfigData();
    this.filterInUseErrorMessage = '';
    this.inUseErrorMessage = '';
    this.loaderHeight = 10;
    this._utilService.callFilterData.subscribe(value => {
      if (value === 'inUseCalendarsDialog') {
        this.filterInUseData();
      }
    });
  }

  getGridConfigData() {
    this.loading = true;
    this._utilityService.getextdata({
      data: 'inUseCalendarsColumnDef.json',
      success: (result) => {
        this.offeringsTypes = result.offeringsTypes;
        this.inUseColumnDef = result;
        this.inUseCols = this.inUseColumnDef.cols;
        this.offeringType();
        this.convertInUseDefaultSortOrder();
        this.clearfilters();
        this.loadGridData = true;
        const dLangProperty = this._utilityService.dLangPropertyNames(this.inUseColumnDef.defaultSortColumn);
        this.inUseSortQuery[dLangProperty] = this.inUseColumnDef.defaultSortOrder;
        if(this.inUsePIData !== null || this.inUsePIData !== undefined) {
          this.openInUseOfferings(this.inUsePIData);
        }
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this.inUseConfigError = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
        this.confirmDialog = 1;
        this.loadGridData = false;
        this.loading = false;
      }
    });
  }

  offeringType() {
    this.offeringsTypesList = [];
    this.offeringsTypesList.push({ label: 'TEXT_SELECT_CRITERIA', value: 'Select' });
    Object.keys(this.offeringsTypes).forEach(element => {
      const offerings = {
        label: element,
        value: element
      };
      this.offeringsTypesList.push(offerings);
    });
    this.offeringFirstItem = this.offeringsTypesList[0].value;
  }

  convertInUseDefaultSortOrder() {
    this.convertedInUseDefaultSortOrder = (this.getInUseColumnSortOrder === 'desc') ? -1 : 1;
  }

  clearInUseFilters(column) {
    this.filterInUseFields[column] = '';
    this.isFilterData = false;
    this.filterInUseData();
  }

  isInUseFilterText(column) {
    const cond = (this.filterInUseFields[column] && this.filterInUseFields[column].length > 0);
    return cond ? true : false;
  }

  removeInUseFilterFetchingError() {
    this.clearfilters();
    this.filterInUseErrorMessage = '';
    this.inUseErrorMessage = '';
    this.loaderHeight = document.getElementById('datatable').scrollHeight / 1.6;
    this.offeringFirstItem = this.offeringsTypesList[0].value;
    return this.filterInUseErrorMessage = '';
  }

  getDeviceWidth() {
    return window.innerWidth + 'px';
  }

  loadInUseData(event: any) {
    if (this.inUseLazyLoad) {
    this._utilityService.resetPagination(this.pagination);
    this.inUseSortQuery = {};
    this.getInUseColumnSortOrder = (+event.sortOrder === 1) ? 'asc' : 'desc';
    const dLangProperty = this._utilityService.dLangPropertyNames(event.sortField);
    if (dLangProperty !== null) {
      this.inUseSortQuery[dLangProperty ? dLangProperty : event.sortField] = this.getInUseColumnSortOrder;
    } else {
      this.inUseSortQuery[event.sortField] = this.getInUseColumnSortOrder;
    }
    setTimeout(() => {
      if (document.getElementById('datatable')) {
        this.loaderHeight = document.getElementById('datatable').scrollHeight / 1.6;
      }
      this.openInUseOfferings(this.inUsePIData);
    }, 200);
    }
    this.inUseLazyLoad = true;
  }

  filterDataKeys(event, field, value) {
    this.filteredField = field;
    this.filteredValue = value;
    this._utilityService.enableFilter(event, 'inUseCalendarsDialog');
  }

  filterInUseData() {
    this._utilityService.resetPagination(this.pagination);
    this.inUseTableQuery = {};
    this.isFilterData = true;
    for (const key in this.filterInUseFields) {
      if (this.filterInUseFields[key] !== '' && this.filterInUseFields[key] !== undefined) {
        const dLangProperty = this._utilityService.dLangPropertyNames(key);
        const filterInUseFields = this.filterInUseFields[key].trim();
       if (dLangProperty) {
         this.inUseTableQuery[dLangProperty] = filterInUseFields;
        } else {
         this.inUseTableQuery[key] = `'%${filterInUseFields}%'|like`;
        }
      }
    }
    if (this.selectedOfferingType) {
      const offeringsParameters = this.offeringsTypes[this.selectedOfferingType];
      for (const key in offeringsParameters) {
        if (offeringsParameters[key] !== '' && offeringsParameters[key] !== undefined) {
          this.inUseTableQuery[key] = offeringsParameters[key];
        }
      }
    }
    this.loaderHeight = document.getElementById('datatable').scrollHeight / 1.6;
    this.openInUseOfferings(this.inUsePIData);
  }

  filterInUseDataDelay() {
    if (this.filterInUseDataProcessing === false) {
      this.filterInUseDataProcessing = true;
      setTimeout(() => {
        this.filterInUseDataProcessing = false;
        this.filterInUseData();
      }, 300);
    }
  }

  scrollInitialize(pagination) {
  this.pagination = pagination;
  }
scrollReset() {
  this.pagination = this.pagination.reset();
}

getMoreData() {
  this._utilService.getScrollHeight(true);
    if (this.inUsePiList !== undefined) {
       this.moreData = this._infiniteScrollCheckService.getMoreScrollData(!this.loading,this.inUsePiList.length,this.pagination,this.totalPageSize,this.totalPages);
       if (this.moreData !== undefined) {
         this.infiniteScrollCheck = this.moreData.infiniteScrollCheck;
         this.moreDataCalled = this.moreData.moreDataCalled;
         this.openInUseOfferings(this.inUsePIData);
      }
    }
  }

  getLessData() {
     if(this.inUsePiList !== undefined){
    this.lessData = this._infiniteScrollCheckService.getLessScrollData(!this.loading,this.inUsePiList.length,this.pagination,this.moreDataCalled);
     if (this.lessData !== null) {
         this.infiniteScrollCheck = this.lessData.infiniteScrollCheck;
         this.moreDataCalled = this.lessData.moreDataCalled;
         this.openInUseOfferings(this.inUsePIData);
     }
    }
  }

  openInUseOfferings(calendarData) {
    this.convertInUseDefaultSortOrder();
    const calId = parseInt(calendarData.calendarId, 10);
    this.filterInUseErrorMessage = '';
    this.inUseErrorMessage = '';
    this.inUseConfigError = '';
    this.confirmDialog = 1;
    let timer;
    const widgetData = {
      param: {
        page: this.pagination.page,
        size: this.pagination.scrollPageSize
      },
      Id: calId
    };
    if (Object.keys(this.inUseSortQuery).length > 0) {
      widgetData.param['sort'] = this.inUseSortQuery;
    }
    if (Object.keys(this.inUseTableQuery).length > 0) {
      widgetData.param['query'] = this.inUseTableQuery;
    }
    if (this.loading !== undefined && !this.loading) {
      this.loading = true;
    }
    this._calendarsService.getInUsePriceableItems({
      data: widgetData,
      success: (result) => {
        this.totalPageSize = result.totalPageSize;
        this.totalCount  = result.totalCount ;
        this.totalPages = result.totalPages;
        this._infiniteScrollCheckService.totalPages = this.totalPages;
        result.filter ? this.filterKeys = result.filter : this.filterKeys = undefined;
        if (this.filterKeys !== undefined) {
            this.isFilterCallTrue = this._utilityService.getLatestServiceData(this.filterKeys, this.filteredField, this.filteredValue);
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
          if (!this.isFilterCallTrue) {
            this.processInUsePi(result);
          }
          if (this.filterInUseErrorMessage) {
            this.filterInUseErrorMessage = '';
          }
        }, 100);
      },
      failure: (errorMsg: string, code: any, error: any) => {
        if (Object.keys(this.inUseTableQuery).length > 0) {
          this.filterInUseErrorMessage = error;
        }
        this.inUseErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
        this.loading = false;
      }
    });
  }

  processInUsePi(offerings) {
    this.noInUseFilteredTableData = false;
    this.refreshGrid(offerings.records);
    if (this.inUsePiList !== null && this.inUsePiList !== undefined) {
      const cond = this.inUsePiList.length > 0;
      if (Object.keys(this.inUseTableQuery).length > 0) {
        this.noInUseFilteredTableData = cond ? false : true;
      } else {
        this.noInUseTableData = cond ? false : true;
      }
    } else {
      if (Object.keys(this.inUseTableQuery).length > 0) {
        this.noInUseFilteredTableData = true;
      } else {
        this.noInUseTableData = true;
      }
    }
    this.loading = false;
  }

   public refreshGrid(records) {
    if (this.pagination.page === 1 && this.isFilterData) {
        this.inUsePiList = [];
    }
     this.inUsePiList = this._infiniteScrollCheckService.infiniteScrollModalData(records, this.infiniteScrollCheck, this.pagination, this.totalPageSize);
  }

  onModalDialogClose() {
    this.loaderHeight = 10;
    this.confirmDialog = 0;
    this.inUsePiList = [];
    this._infiniteScrollCheckService.totalPages = 0;
    this.offeringFirstItem = this.offeringsTypesList[0].value;
    this.clearfilters();
    this.getInUseColumnSortOrder = 'asc';
    this.isFilterCriterialProcessing = false;
    this.inUseCalendarModalDialogClose.emit(true);
    this._utilService.checkCallFilterData('');
  }

  changeOfferingType(selectedOffering) {
    this.selectedOfferingType = selectedOffering;
    this.filterInUseData();
  }

  clearfilters() {
    this.loading = true;
    this.filterInUseFields = {};
    this.inUseSortQuery = {};
    this.inUseTableQuery = {};
    this.selectedOfferingType = '';
    this.noInUseFilteredTableData = false;
    this.isFilterCriterialProcessing = false;
  }
  ngOnDestroy() {
    if (this.inUseCalendarsSubscribe) {
      this.inUseCalendarsSubscribe.unsubscribe();
    }
  }

  getErrorMessageType() {
    const filterCriteriaLength = !this._utilityService.isObject(this.inUseTableQuery) ? 0 : Object.keys(this.inUseTableQuery).length;
    if (this.loading) {
      return 0;
    }
    if (this.inUseErrorMessage) {
      return 1;
    } else if (this.inUsePiList.length === 0 && filterCriteriaLength > 0) {
      if(this.inUseErrorMessage = '') {
        return 3;
      }
    }
    return 0;
  }
}
