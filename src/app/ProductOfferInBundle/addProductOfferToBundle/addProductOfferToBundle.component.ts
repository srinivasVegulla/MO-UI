import { DropdownModule, SelectItem, AutoComplete, Paginator } from 'primeng/primeng';
import { Component, OnInit, Input, OnDestroy, HostListener } from '@angular/core';
import { AddProductOfferToBundleService } from './addProductOfferToBundle.service';
import { utilService } from '../../helpers/util.service';
import { DatePipe } from '@angular/common';
import { calenderLocaleFeilds } from "../../../assets/calenderLocalization";
import { Language, DefaultLocale, Currency, LocaleService, TranslationService } from 'angular-l10n';
import { ProductOffersListService } from '../../productOfferList/productOfferList.service';
import { ProductService } from "../../productOffer/productOffer.service";
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../../helpers/utility.service';
import { InfiniteScrollCheckService } from '../../helpers/InfiniteScrollCheck.service';

@Component({
  selector: 'ecb-addproductoffertobundle',
  templateUrl: './addProductOfferToBundle.component.html',
  styleUrls: ['./addProductOfferToBundle.component.scss'],
  providers:[AddProductOfferToBundleService]
 })
  export class AddProductOfferToBundleComponent implements OnInit, OnDestroy {
    public visible = false;
    addProductOfferList: any = [];
    currencies: any = [];
    partitions: any = [];
    cols:any[];
    errorMessage: string;
    noTableData: boolean = false;
    noFilteredTableData:boolean = false;
    filterElements: any;
    tableHeaders: any;
    @Language() lang: string;
    @DefaultLocale() defaultLocale: string;
    selectedCurrency: string = '';
    selectedPartition: string = '';
    tableQuery: any;
    convertedDefaultSortOrder;
    columnDef;
    filterFields: any;
    filterDataProcessing: boolean = false;
    filterErrorMessage: any;
    loading: boolean = false;
    sortQuery: any;
    lazyLoad:boolean = false;
    getColumnSortOrder;
    isPOSelected: boolean;
    poContainer: any = [];
    poIndex: number;
    createPOData: any;
    tooltipIndex;
    errorTooltip: boolean = false;
    bundleId: number;
    @Input() selectedBundleData: any;
    failedToAddPoError:boolean = false;
    failedToAddPoErrorMessage:any;
    bundlePartiotionName: string;
    addPOInBundleSubscriptions: any;
    pagination;
    totalPageSize: number;
    currencyFirstItem: string;
    partitionFirstItem: string;
    selectedFilterData: any;
    totalCount: number;
    loadGridData = false;
    calenderLocale;
    localeDateFormat;
    amLocaleDateFormat;
    currentLocale;
    infiniteScrollCheck = '';
    moreDataCalled: boolean;
    moreData;
    lessData;
    totalPages: number;
    isFilterData: boolean;
    removeScrollHeight: any;
    filteredField: any;
    filteredValue: any;
    isFilterCallTrue: boolean;
    filterKeys: any;
    selectedPoCount: number=0;
    showErrorMessage: boolean;
    errorMessageDisplay: any;
    loadError = false;

   constructor(private _addProductOfferToBundleService: AddProductOfferToBundleService,
            private _utilService: utilService,
            private _productOffersListService: ProductOffersListService,
            private _productService: ProductService,
            private _router: Router,
            private _route: ActivatedRoute,
            private readonly _utilityService: UtilityService,
            private locale: LocaleService,
            private _translationService: TranslationService,
            private _infiniteScrollCheckService: InfiniteScrollCheckService) {
    }

  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === 27 && this._utilityService.isObject(document.getElementsByTagName('ecb-addproductoffertobundle')[0])) {
      this.hide();
    }
  }

     public show(): void {
      this.visible = true;
    }

    public hide(): void {
      this.visible = false;
      this.failedToAddPoError = false;
      this.errorMessage = '';
      this.loading = false;
      this.poContainer.length = 0;
      this._utilService.changeOpenAddPOModalPopUp(false);
      this._utilService.checkCallFilterData('');
    }

    ngOnInit() {
      this.getGridConfigData();
      this.showErrorMessage = false;
      this.currentLocale = this.locale.getCurrentLocale();
      this.calenderLocale = calenderLocaleFeilds[this.currentLocale];
      this.localeDateFormat = this.calenderLocale.localeDateFormat;
      this.amLocaleDateFormat = this.calenderLocale.amLocaleDateFormat;
      this.totalCount = 0;
      this.loading = true;
      this.filterFields = {};
      this.sortQuery = {};
      this.tableQuery = {};
      this.getCurrenciesAndPartitions();
      this.bundleId = +this._route.snapshot.params['bundleId'];
      this.addPOInBundleSubscriptions = this._utilService.openAddPOModalPopUp.subscribe(value => {
       if (value) {
          this.show();
        }
       });
       const removeHeight = this._utilService.removeScrollHeight.subscribe(value => {
        if (value !== 0) {
          this.removeScrollHeight = value;
        }
      });
      this.addPOInBundleSubscriptions.add(removeHeight);
      const filterData = this._utilService.callFilterData.subscribe(value => {
        if (value === 'addProductOfferToBundle') {
          this.filterData();
        }
      });
      this.addPOInBundleSubscriptions.add(filterData);
  }

  calculateGridScrollHeight() {
    return {overflow: 'auto', height: 'calc(100vh - ' + `${this.removeScrollHeight}` +'px)'}
  }

  getGridConfigData() {
    this._utilityService.getextdata({
      data: 'addPoColumnDef.json',
      success: (result) => {
        this.columnDef = result;
        this.convertDefaultSortOrder();
        this.cols = this.columnDef.cols;
        this.sortQuery[this.columnDef.defaultSortColumn] = this.columnDef.defaultSortOrder;
        this.loadGridData = true;
      },
      failure: (errorMsg: string, code: any) => {
        this.showErrorMessage = true;
        this.loadError = true;
        this.loading = false;
        this.errorMessageDisplay = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
        this.loadGridData = false;
      }
    });
  }

  getCurrenciesAndPartitions() {
    this._productService.getCurrenciesAndPartitionsList({
      success : (result) => {
        this.createPOData = result;
      },
      failure : (error) => {
        this.errorMessage = error;
      }
    });
  }

  getCurrencies() {
    this.currencies = [];
    if (this.createPOData !== undefined && this.createPOData !== null) {
      const currencyItems = this.createPOData !== (undefined && null) ? this.createPOData['currencies'] : [];
      for (const i in currencyItems) {
        if ((this.selectedBundleData.currency !== null) && (this.selectedBundleData.currency !== undefined)) {
          if (this.selectedBundleData.currency === currencyItems[i].name) {
            if (!(currencyItems[i].name in this.currencies)) {
              this.currencies.push({ label: 'TEXT_SELECT_CRITERIA', value: 'Select' });
              this.currencies.push({ label: '', value: '' });
              this.currencies.push({ label: currencyItems[i].name, value: currencyItems[i].name });
            }
          }
        }
      }
      this.currencyFirstItem = this.currencies[0].value;
    }
  }

  getPartitions() {
    this.partitions = [];
    if (this.createPOData !== undefined && this.createPOData !== null) {
      const partitionItems = this.createPOData !== (undefined && null) ? this.createPOData['partitions'] : [];
      for (const i in this.selectedBundleData.poPartitions) {
        if (this.selectedBundleData.popartitionid === this.selectedBundleData.poPartitions[i].accountId) {
          this.bundlePartiotionName = this.selectedBundleData.poPartitions[i].login;
        }
      }
      for (const j in partitionItems) {
        if (this.bundlePartiotionName === partitionItems[j].login) {
          if (!(partitionItems[j].login in this.partitions)) {
            this.partitions.push({ label: 'TEXT_SELECT_CRITERIA', value: 'Select' });
            this.partitions.push({ label: '', value: '' });
            this.partitions.push({ label: partitionItems[j].login, value: partitionItems[j].accountId });
          }
          this.partitionFirstItem = this.partitions[0].value;
        }
      }
    }
  }

  convertDefaultSortOrder() {
    this.convertedDefaultSortOrder = (this.columnDef.defaultSortOrder === 'asc') ? 1 : -1;
  }

  clearFilters(column) {
    this.filterFields[column] = '';
    this.isFilterData = false;
    this.filterData();
  }

  isFilterText(column) {
    return this.filterFields[column] && this.filterFields[column].length > 0 ? true : false;
  }

  removeFilterFetchingError() {
    return this.filterErrorMessage = '';
  }

  scrollInitialize(pagination) {
    this.pagination = pagination;
    this.getAddProductOfferList(true);
  }
  scrollReset() {
    this.pagination = this.pagination.reset();
  }

  getMoreData() {
    this._utilService.getScrollHeight(true);
    if(this.addProductOfferList !== undefined){
      this.moreData = this._infiniteScrollCheckService.getMoreScrollData(!this.loading,this.addProductOfferList.length,this.pagination,this.totalPageSize,this.totalPages);
       if (this.moreData !== undefined) {
         this.infiniteScrollCheck = this.moreData.infiniteScrollCheck;
         this.moreDataCalled = this.moreData.moreDataCalled;
         this.getAddProductOfferList(false);
      }
    }
  }

  getLessData() {
     if(this.addProductOfferList !== undefined){
    this.lessData = this._infiniteScrollCheckService.getLessScrollData(!this.loading,this.addProductOfferList.length,this.pagination,this.moreDataCalled);
     if (this.lessData !== null) {
         this.infiniteScrollCheck = this.lessData.infiniteScrollCheck;
         this.moreDataCalled = this.lessData.moreDataCalled;
         this.getAddProductOfferList(false);
     }
    }
  }

  getAddProductOfferList(firstCall) {
    this.loading = true;
    this.failedToAddPoError = false;
    const widgetData = {
      param : {
        page: this.pagination.page,
        size: this.pagination.scrollPageSize
      },
      bundleId : this.bundleId
    };
    if (Object.keys(this.sortQuery).length > 0) {
      widgetData.param['sort'] = this.sortQuery;
    }
    if (Object.keys(this.tableQuery).length > 0) {
      widgetData.param['query'] = this.tableQuery;
    }

    this._addProductOfferToBundleService.getProductOffersInBundleList({
      data : widgetData,
      success : (result) => {
       this.loading = false;
       result.filter ? this.filterKeys = result.filter : this.filterKeys = undefined;
        if (this.filterKeys !== undefined) {
            this.isFilterCallTrue = this._utilityService.getLatestServiceData(this.filterKeys, this.filteredField, this.filteredValue);
        }
        if(!this.isFilterCallTrue) {
          this.processProductOfferResult(result.records, firstCall);
        }
       this.totalPageSize = result.totalPageSize;
       this.totalCount = result.totalCount;
       this.totalPages = result.totalPages;
       this._infiniteScrollCheckService.totalPages = this.totalPages;
        if (this.filterErrorMessage) {
          this.filterErrorMessage = '';
        }
      },
      failure : (errorMsg: string, code: number, error: any) => {
          this.showErrorMessage = false;
          this.loadError = false;
          this.addProductOfferList = [];
          this.errorMessage = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
          this.loading = false;
      },
      onComplete: () => {
        this.loading = false;
      }
    });
  }

  public refreshGrid(records) {
    this.addProductOfferList = this._infiniteScrollCheckService.infiniteScrollData(records, this.infiniteScrollCheck, this.pagination,this.totalPageSize);
    if (this.poContainer.length > 0) {
      this.addProductOfferList.filter(addPoList => {
        this.poContainer.filter(poList => {
            if (addPoList.offerId === poList) {
                addPoList['checkboxFlag'] = true;
            }
        });
      });
      }
  }

  processProductOfferResult(productOffers, firstCall) {
    this.loading = false;
    this.noTableData = false;
    this.noFilteredTableData = false;
    if (this.isFilterData) {
      if (this.pagination.page === 1) {
        this.addProductOfferList = [];
        this.addProductOfferList = productOffers;
     }
     this.refreshGrid(productOffers);
     
    } else {
      this.refreshGrid(productOffers);
    }
    if (this.addProductOfferList !== null && this.addProductOfferList !== undefined) {
      if (Object.keys(this.tableQuery).length > 0) {
        this.noFilteredTableData = this.addProductOfferList.length > 0 ? false : true;
      }else {
        this.noTableData = this.addProductOfferList.length > 0 ? false : true;
      }
    } else {
      if (Object.keys(this.tableQuery).length > 0) {
        this.noFilteredTableData = true;
      }else {
        this.noTableData = true;
      }
    }
    if (firstCall) {
      this.getCurrencies();
    }
    this.getPartitions();
  }

  dateFieldConfig(field){
  const fields = {
    startDate : "startDate",
    endDate : "endDate",
    availableStartDate : "availableStartDate",
    availableEndDate : "availableEndDate",
    effStartDate: 'startDate',
    effEndDate: 'endDate',
    availStartDate: 'availableStartDate',
    availEndDate: 'availableEndDate'
  };
  return fields[field] ? fields[field] : null;
}

loadData(event: any) {
 if (this.lazyLoad) {
   this.sortQuery = {};
   this._utilityService.resetPagination(this.pagination);
   this.getColumnSortOrder = (event.sortOrder === 1) ? 'asc' : 'desc';
   const configField = this.dateFieldConfig(event.sortField);
   this.sortQuery[configField ? configField : event.sortField] = this.getColumnSortOrder;
   this.scrollReset();
   this.getAddProductOfferList(false);
 }
 this.lazyLoad = true;
}

filterData() {
  this._utilityService.resetPagination(this.pagination);
  this.tableQuery = {};
  this.isFilterData = true;
  for (const key in this.filterFields) {
    const dLangProperty = this._utilityService.dLangPropertyNames(key);
    if (this.filterFields[key] !== '' && this.filterFields[key] !== null) {
      if (this.dateFieldConfig(key)) {
        this.tableQuery[key] = this.filterFields[key].trim();
      } else if (dLangProperty) {
        this.tableQuery[dLangProperty] = this.filterFields[key].trim();
      } else {
        this.tableQuery[key] = `'%${this.filterFields[key].trim()}%'|like`;
      }
    }
  }
  if (this.selectedCurrency) {
    this.tableQuery['currency'] = this.selectedCurrency;
  }
  if (this.selectedPartition) {
    this.tableQuery['popartitionid'] = this.selectedPartition;
  }
  this.scrollReset();
  this.getAddProductOfferList(true);
}
filterDataKeys(event, field, value) {
  this.filteredField = field;
  this.filteredValue = value;
  this._utilityService.enableFilter(event, 'addProductOfferToBundle');
}

filterDataDelay() {
  if (this.filterDataProcessing === false) {
    this.filterDataProcessing = true;
    setTimeout(() => {
        this.filterDataProcessing = false;
        this.filterData();
     }, 300);
  }
}

  getDeviceWidth() {
    return window.innerWidth + 'px';
  }

  checkAnyPOSelected() {
    if (this.loading) {
      return true;
    } else {
      return (this.poContainer.length > 0) ? false : true;
    }
  }

  selectPO(specId, event) {
    this.isPOSelected = event.target.checked;
    if (this.isPOSelected) {
      this.poContainer.push(specId);
      this.selectedPoCount = this.poContainer.length;
    } else if (!this.isPOSelected && this.poContainer.length > 0) {
        this.poIndex = this.poContainer.indexOf(specId);
        this.poContainer.splice(this.poIndex, 1);
        this.selectedPoCount = this.poContainer.length;
    }
  }

  addPoToBundle() {
    this.loading = true;
    this._addProductOfferToBundleService.addProductOffersToBundle({
      data : {
        offerId : this.bundleId,
        body : this.poContainer
      },
      success : (result) => {
        this._utilService.changeCallPoInBundleListAfterAddingNew(true);
        this.hide();
        this.poContainer = [];
        this._utilService.changeOpenAddPOModalPopUp(false);
      },
      failure: (errorMsg: string, code: any) => {
        this.showErrorMessage = true;
        this.loadError = false;
        this.errorMessageDisplay = this._utilityService.errorCheck(code, errorMsg, 'ADD');
        this.handleFailedToAddPoError(errorMsg);
        this._utilService.changeCallPoInBundleListAfterAddingNew(false);
      },
      onComplete: () => {
        this.loading = false;
      }
    });
  }

  handleFailedToAddPoError(error) {
    this.failedToAddPoError = true;
    this.failedToAddPoErrorMessage = error;
  }
  deleteErrorMessage() {
    this.failedToAddPoError = false;
  }
  ngOnDestroy() {
    this._infiniteScrollCheckService.totalPages = 0;
    if (this.addPOInBundleSubscriptions) {
      this.addPOInBundleSubscriptions.unsubscribe();
    }
  }
  changeCurrencyItem(selectedCurrency) {
    this.selectedCurrency = selectedCurrency;
    this.filterData();
  }
  changePartitionItem(selectedPartition) {
    this.selectedPartition = selectedPartition;
    this.filterData();
  }
  fetchDateValues(value) {
    this.selectedFilterData = value;
    if (this.selectedFilterData.selectedValue !== '' && this.selectedFilterData.selectedValue !== null) {
      switch (this.selectedFilterData.selectedColumn) {
        case 'startDate': this.filterFields['startDate'] = this.selectedFilterData.selectedValue;
          break;
        case 'availableStartDate': this.filterFields['availableStartDate'] = this.selectedFilterData.selectedValue;
          break;
        case 'endDate': this.filterFields['endDate'] = this.selectedFilterData.selectedValue;
          break;
        case 'availableEndDate': this.filterFields['availableEndDate'] = this.selectedFilterData.selectedValue;
          break;
      }
      this.filterData();
    } else {
      this.clearFilters(this.selectedFilterData.selectedColumn);
    }
  }
}
