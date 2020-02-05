import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { utilService } from '../helpers/util.service';
import { DropdownModule, SelectItem, AutoComplete } from 'primeng/primeng';
import { Language, DefaultLocale, Currency, LocaleService } from 'angular-l10n';
import { ProductService } from '../productOffer/productOffer.service';
import { InUseOfferingsModalDialogService } from './inUseOfferingsModalDialog.service';
import { calenderLocaleFeilds } from '../../assets/calenderLocalization';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { UtilityService } from '../helpers/utility.service';
import { InfiniteScrollCheckService } from '../helpers/InfiniteScrollCheck.service';

@Component({
  selector: 'ecb-inuse-offerings-modal-dialog',
  templateUrl: './inUseOfferingsModalDialog.component.html',
  styleUrls: ['./inUseOfferingsModalDialog.component.scss']
})
export class InUseOfferingsModalDialogComponent implements OnInit, OnDestroy {
  inUseCols: any[];
  inUseTableConfig: any;
  errorMessage: string;
  inUseErrorMessage: string;
  noInUseTableData = false;
  noInUseFilteredTableData = false;
  filterElements: any;
  tableHeaders: any;
  @Language() lang: string;
  @ViewChild(AutoComplete) private autoComplete: AutoComplete;
  filterInUseFields: any;
  filterInUseDataProcessing = false;
  filterInUseErrorMessage: any;
  loading: boolean;
  currentLocale;
  @DefaultLocale() defaultLocale: string;
  inUseLazyLoad = false;
  getInUseColumnSortOrder;
  inUseColumnDef;
  convertedInUseDefaultSortOrder;
  inUseOfferingsList: any[] = [];
  confirmDialog: number = 0;
  inUseOfferingsCount: number;
  inUseSortQuery: any;
  inUseTableQuery: any;
  partitions: any;
  selectedPartition: any;
  offeringsTypes: any;
  offeringsTypesList: any[];
  selectedOfferingType: any;
  isFilterClear = false;
  inUseOfferingsSubscribe: any;
  offeringId;
  isSubscription = false;
  isProductOffer = false;
  isPItemplate;
  loaderHeight;
  partitionFirstItem: string;
  offeringFirstItem: string;
  selectedFilterData: any;
  inUseOfferingPopup: any;
  loadGridData = false;
  calenderLocale;
  localeDateFormat;
  amLocaleDateFormat;
  infiniteScrollCheck: string = '';
  moreDataCalled: boolean;
  pagination: any;
  totalPageSize: number;
  @Input() offeringsLocation;
  @Input() offeringsData;
  moreData;
  lessData;
  totalPages;
  refreshDataCheck = false;
  isFilterData: boolean;
  @Output() inUseModalDialogClose = new EventEmitter();
  removeScrollHeight: any;
  filteredField: any;
  filteredValue: any;
  isFilterCallTrue: boolean;
  filterKeys: any;
  loadGridError: string = '';

  constructor(private _utilService: utilService,
              private _productService: ProductService,
              private readonly _InUseOfferingsService: InUseOfferingsModalDialogService,
              private readonly _utilityService: UtilityService,
              private locale: LocaleService,
              private _infiniteScrollCheckService: InfiniteScrollCheckService) {
              }
  ngOnInit() {
    this.getGridConfigData();
    this.loading = true;
    this.currentLocale = this.locale.getCurrentLocale();
    this.calenderLocale = calenderLocaleFeilds[this.currentLocale];
    this.localeDateFormat = this.calenderLocale.localeDateFormat;
    this.amLocaleDateFormat = this.calenderLocale.amLocaleDateFormat;
    this.getCurrenciesAndPartitions();
    this.filterInUseFields = {};
    this.inUseSortQuery = {};
    this.inUseTableQuery = {};
    this.loaderHeight = 50;
    this._utilService.removeScrollHeight.subscribe(value => {
      if (value !== 0) {
        this.removeScrollHeight = value;
      }
    });
    this._utilService.callFilterData.subscribe(value => {
      if (value === 'inUseOfferingsDialog') {
        this.filterInUseData();
      }
    });
}

@HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === 27 &&
    this._utilityService.isObject(document.getElementsByTagName('ecb-inuse-offerings-modal-dialog')[0])) {
      this.onModalDialogClose({});
    }
}

calculateGridScrollHeight() {
    return {overflow: 'auto', height: 'calc(100vh - ' + `${this.removeScrollHeight}` +'px)'}
  }

locationCheck() {
  switch (this.offeringsLocation) {
    case 'subscriptionProperty':
      this.isSubscription = true;
      this.offeringId = parseInt(this.offeringsData['specId']);
      break;
    case 'priceableItemTemplateGrid':
      this.isSubscription = true;
      this.offeringId = parseInt(this.offeringsData['templateId']);
      break;
    case 'priceableItemTemplateDetails':
      this.isSubscription = true;
      this.offeringId = parseInt(this.offeringsData['propId']);
      break;
    case 'sharedPriceList':
      this.isSubscription = true;
      this.offeringId = parseInt(this.offeringsData['pricelistId']);
      break;
    default:
      this.isProductOffer = true;
      this.offeringId = parseInt(this.offeringsData['offerId']);
      break;
  }
}

getGridConfigData() {
  this.confirmDialog = 1;
  this._utilityService.getextdata({
    data: 'inUseOfferingsColumnDef.json',
    success: (result) => {
      this.offeringsTypes = result.offeringsTypes;
      this.inUseColumnDef = result;
      this.inUseCols = this.inUseColumnDef.cols;
      const dLangProperty = this._utilityService.dLangPropertyNames(this.inUseColumnDef.defaultSortColumn);
      this.inUseSortQuery[dLangProperty] = this.inUseColumnDef.defaultSortOrder;
      this.convertInUseDefaultSortOrder();
      this.offeringType();
      this.loadGridData = true;
    },
    failure: (errorMsg: string, code: any, error: any) => {
      this.loadGridData = false;
      this.loading = false;
      this.loadGridError = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
    }
  });
}

scrollInitialize(pagination) {
  this.pagination = pagination;
  this.openInUseOfferings();
}
scrollReset() {
  this.pagination = this.pagination.reset();
}

getMoreData() {
  this._utilService.getScrollHeight(true);
    if(this.inUseOfferingsList !== undefined && !this.refreshDataCheck){
      this.moreData = this._infiniteScrollCheckService.getMoreScrollData(!this.loading,this.inUseOfferingsList.length,this.pagination,this.totalPageSize,this.totalPages);
       if (this.moreData !== undefined) {
         this.infiniteScrollCheck = this.moreData.infiniteScrollCheck;
         this.moreDataCalled = this.moreData.moreDataCalled;
         this._utilService.getScrollHeight(true);
         this._utilService.updateChangeScrollposition('modified');
         this.openInUseOfferings();
      }
    } else {
      this.refreshDataCheck = false;
    }
  }

getLessData() {
  if(this.inUseOfferingsList !== undefined){
    this.lessData = this._infiniteScrollCheckService.getLessScrollData(!this.loading,this.inUseOfferingsList.length,this.pagination,this.moreDataCalled);
  if (this.lessData !== null) {
    this.infiniteScrollCheck = this.lessData.infiniteScrollCheck;
    this.moreDataCalled = this.lessData.moreDataCalled;
    this.openInUseOfferings();
    }
  }
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

getCurrenciesAndPartitions() {
  this._productService.getCurrenciesAndPartitionsList({
    success: (result) => {
      this.partitions = [];
      const partitionItems = result['partitions'];
      this.partitions.push({ label: 'TEXT_SELECT_CRITERIA', value: 'Select' });
      this.partitions.push({ label: '', value: '' });
      for (let i in partitionItems) {
        this.partitions.push({ label: partitionItems[i].login, value: partitionItems[i].accountId });
      }
      this.partitionFirstItem =  this.partitions[0].value;
    },
    failure: (error) => {
      //this.errorMessage = error;
    }
  });
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
    return this.filterInUseFields[column] && this.filterInUseFields[column].length > 0 ? true : false;
  }

  removeInUseFilterFetchingError() {
    return this.filterInUseErrorMessage = '';
  }

  dateInUseFieldConfig(field) {
    const fields = {
      availableStartDate: 'availableStartDate',
      availableEndDate: 'availableEndDate'
    };
    return fields[field] ? fields[field] : null;
  }

  sortDateInUseFieldConfig(field) {
    const fields = {
      availStartDate: 'availableStartDate',
      availEndDate: 'availableEndDate'
    };
    return fields[field] ? fields[field] : null;
  }
  getDeviceWidth() {
    return window.innerWidth + 'px';
  }

  loadInUseData(event: any) {
     if (this.inUseLazyLoad) {
      this._utilityService.resetPagination(this.pagination);
      this.inUseSortQuery = {};
      this.getInUseColumnSortOrder = (event.sortOrder === 1) ? 'asc' : 'desc';
      const dLangProperty = this._utilityService.dLangPropertyNames(event.sortField);
      const inUseConfigField = this.sortDateInUseFieldConfig(event.sortField);
      if (dLangProperty !== null) {
        this.inUseSortQuery[dLangProperty ? dLangProperty : event.sortField] = this.getInUseColumnSortOrder;
      } else {
        this.inUseSortQuery[inUseConfigField ? inUseConfigField : event.sortField] = this.getInUseColumnSortOrder;
      }
      this.openInUseOfferings();
     }
     this.inUseLazyLoad = true;
  }

  filterInUseData() {
    this._utilityService.resetPagination(this.pagination);
    this.inUseTableQuery = {};
    this.isFilterData = true;
    for (const key in this.filterInUseFields) {
      if (this.filterInUseFields[key] !== '' && this.filterInUseFields[key] !== null) {
        const dLangProperty = this._utilityService.dLangPropertyNames(key);
        if (this.dateInUseFieldConfig(key)) {
          this.inUseTableQuery[key] = `${this.filterInUseFields[key].trim()}`;
        } else if (dLangProperty) {
          this.inUseTableQuery[dLangProperty] = this.filterInUseFields[key].trim();
        }else {
          this.inUseTableQuery[key] = `%${this.filterInUseFields[key].trim()}%|like`;
        }
      }
    }
    if (this.selectedPartition && this.selectedPartition != 'Select') {
      this.inUseTableQuery['popartitionid'] = this.selectedPartition;
    }
    if (this.selectedOfferingType) {
      const offeringsParameters = this.offeringsTypes[this.selectedOfferingType];
      for (const key in offeringsParameters) {
        this.inUseTableQuery[key] = offeringsParameters[key];
      }
    }
    this.openInUseOfferings();
  }

  filterDataKeys(event, field, value) {
    this.filteredField = field;
    this.filteredValue = value;
    this._utilityService.enableFilter(event, 'inUseOfferingsDialog');
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

  openInUseOfferings() {
    this.loading = true;
    this.locationCheck();
    this.convertInUseDefaultSortOrder();
    let timer;
    this.inUseErrorMessage = '';
    const widgetData = {
        param: {
          page: this.pagination.page,
          size: this.pagination.scrollPageSize
        },
        Id: this.offeringId,
        offeringLocation: this.offeringsLocation
      };
    if (Object.keys(this.inUseSortQuery).length > 0) {
        widgetData.param['sort'] = this.inUseSortQuery;
    }
    if (Object.keys(this.inUseTableQuery).length > 0) {
      widgetData.param['query'] = this.inUseTableQuery;
    }
    this._InUseOfferingsService.getInUseOfferings({
      data: widgetData,
      success: (result) => {
      this.totalPageSize = result.totalPageSize;
      this.totalPages = result.totalPages;
      this._infiniteScrollCheckService.totalPages = this.totalPages;
      this.inUseOfferingsCount = result.totalCount;
      clearTimeout(timer);
      timer = setTimeout(() => {
      result.filter ? this.filterKeys = result.filter : this.filterKeys = undefined;
        if (this.filterKeys !== undefined) {
            this.isFilterCallTrue = this._utilityService.getLatestServiceData(this.filterKeys, this.filteredField, this.filteredValue);
        }
        if (!this.isFilterCallTrue) {
          this.processInUseOfferings(result);
        }
        if (this.filterInUseErrorMessage) {
          this.filterInUseErrorMessage = '';
        }
      }, 100);
      },
      failure: (errorMsg: string,code: any, error: any) => {
        this.inUseOfferingsList = [];
       if (Object.keys(this.inUseTableQuery).length > 0){
          this.filterInUseErrorMessage = error;
      }
      this.inUseErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
      this.loading = false;
      }
    });
  }

  processInUseOfferings(offerings) {
    this.noInUseFilteredTableData = false;
    this.refreshGrid(offerings.records);
    this.inUseOfferingsCount = offerings['totalCount'];
    if (this.inUseOfferingsList !== null && this.inUseOfferingsList !== undefined) {
      if (Object.keys(this.inUseTableQuery).length > 0) {
        this.noInUseFilteredTableData = this.inUseOfferingsList.length > 0 ? false : true;
      } else {
        this.noInUseTableData = this.inUseOfferingsList.length > 0 ? false : true;
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
      this.inUseOfferingsList = [];
    }
    this.inUseOfferingsList = this._infiniteScrollCheckService.infiniteScrollModalData(records, this.infiniteScrollCheck, this.pagination,this.totalPageSize);
  }

  ngOnDestroy() {
      if (this.inUseOfferingsSubscribe) {
        this.inUseOfferingsSubscribe.unsubscribe();
      }
  }

  onModalDialogClose(event) {
    this.confirmDialog = 0;
    this.inUseTableQuery = {};
    this.inUseSortQuery = {};
    this.filterInUseFields = {};
    this._infiniteScrollCheckService.totalPages = 0;
    this.partitionFirstItem = this.partitions[1].value;
    this.offeringFirstItem = this.offeringsTypesList[1].value;
    this.inUseSortQuery[this.inUseColumnDef.defaultSortColumn] = this.inUseColumnDef.defaultSortOrder;
    this.inUseOfferingsList = [];
    this.selectedPartition = '';
    this.selectedOfferingType = '';
    if (this.selectedFilterData !== '' && this.selectedFilterData !== undefined) {
      this.filterInUseFields[this.selectedFilterData.selectedColumn] = '';
      this._utilService.changedRefreshInUseOfferingsModal(true);
    }
    this.getInUseColumnSortOrder = 'asc';
    this.inUseModalDialogClose.emit(true);
    this._utilService.checkCallFilterData('');
  }
  changePartitionItem(selectedPartition) {
    this.selectedPartition = selectedPartition;
    this.filterInUseData();
  }
  changeOfferingType(selectedOffering) {
    this.selectedOfferingType = selectedOffering;
    this.filterInUseData();
  }
  fetchDateValues(value) {
    this.selectedFilterData = value;
    if (this.selectedFilterData.selectedValue !== '' && this.selectedFilterData.selectedValue !== null) {
      switch (this.selectedFilterData.selectedColumn) {
        case 'availableStartDate' : this.filterInUseFields['availableStartDate'] = this.selectedFilterData.selectedValue;
        break;
        case 'availableEndDate'   : this.filterInUseFields['availableEndDate'] = this.selectedFilterData.selectedValue;
        break;
      }
      this.filterInUseData();
    } else {
      this.clearInUseFilters(this.selectedFilterData.selectedColumn);
    }
  }

  getErrorMessageType() {
    const filterCriteriaLength = !this._utilityService.isObject(this.inUseTableQuery) ? 0 : Object.keys(this.inUseTableQuery).length;
    if (this.loading) {
      return 0;
    }
    if (this.inUseErrorMessage) {
      return 1;
    } else if (this.inUseOfferingsList !== undefined && this.inUseOfferingsList.length === 0 && filterCriteriaLength > 0) {
      if (this.inUseErrorMessage === '') {
        return 3;
      }
    }
    return 0;
  }
}
