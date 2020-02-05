import { DropdownModule, SelectItem, AutoComplete } from 'primeng/primeng';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit} from '@angular/core';
import { ProductOffersListService } from './productOfferList.service';
import { sharedService } from '../productOffer/sharedService';
import { UtilityService } from '../helpers/utility.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { DatePipe } from '@angular/common';
import { calenderLocaleFeilds } from '../../assets/calenderLocalization';
import { Language, DefaultLocale, Currency, LocaleService } from 'angular-l10n';
import { TooltipModule } from 'ng2-tooltip';
import { ErrorTooltipComponent } from '../errortooltip/errorTooltip.component';
import { utilService } from '../helpers/util.service';
import { ProductService } from '../productOffer/productOffer.service';
import { Http, Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { DataGrid } from '../helpers/dataGridUtil';
import { CSVFormat } from '../helpers/csvFormat';
import { SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG } from 'constants';
import { CapabilityService } from '../helpers/capabilities.service';
import { InfiniteScrollCheckService } from '../helpers/InfiniteScrollCheck.service';
import { pagination } from 'assets/test/mock';

@Component({
  selector: 'ecb-product-offer-list',
  templateUrl: './productOfferList.component.html',
  styleUrls: ['./productOfferList.component.scss'],
  host: {
    '(document:click)': 'onClick($event)',
  }
})
export class ProductOfferListComponent implements OnInit, OnDestroy {
  _productOffersList: any[];
  cols: any[];
  errorMessage: string = '';
  noTableData: boolean = false;
  noFilteredTableData: boolean = false;
  filterElements: any;
  tableHeaders: any;
  // availableCurrencies:SelectItem[];
  @Language() lang: string;
  currenciesFromService: any[];
  currencies: SelectItem[];
  partitions: SelectItem[];
  selectedCurrency: string;
  selectedPartition: string;
  tableQuery: any;
  @ViewChild(AutoComplete) private autoComplete: AutoComplete;
  counter: number = 0;
  totalRecords: number;
  datasource: any;
  filterFields: any;
  filterDataProcessing: boolean = false;
  offeringsGridErrMsg: string = '';
  showErrorMsg: boolean = false;
  loading: boolean;
  currentLocale;
  @DefaultLocale() defaultLocale: string;
  getDefaultColumnName;
  getDefaultColumnOrder;
  sortQuery: any;
  defaultSort: boolean = true;
  lazyLoad: boolean = false;
  getColumnSortOrder;
  columnDef;
  convertedDefaultSortOrder;
  unableToDeleteMessage;
  isHighlight: boolean = true;
  errorTooltip: boolean = false;
  tooltipIndex;
  productOfferId: any;
  canPODeleted: boolean = false;
  finalQuery: string = '';
  holdAllProductOffers: any = [];
  canPOHide: boolean = false;
  visible: boolean = true;
  showCreatePOPanel: boolean = false;
  poListLength: number;
  createPOData: any;
  createPODataconfig: any;
  isVisiblePO: boolean = false;
  canPOUnHide: boolean = false;
  isHiddenListEmpty: boolean = true;
  makeHidden: boolean = false;
  deletePoError: any;
  offeringType = '';
  redirectionPageIs;
  poListSubscriptions: any;
  confirmDialog: number;
  deleteHideUnhidePoData: any;
  deleteHideUnhideErrorIndex: any;
  totalCount: number;
  totalPageSize: number;
  offeringData;
  isDownload = false;
  flag;
  pagination: any;
  currencyFirstItem;
  partitionFirstItem;
  selectedOfferingType;
  offeringTypes: SelectItem[];
  offeringsTypes: any;
  offeringFirstItem: string;
  selectedFilterData;
  offeringsViewCapabilities: any = {};
  loadGridData: boolean = false;
  calenderLocale;
  amLocaleDateFormat;
  infiniteScrollCheck = '';
  inlineStyles: any;
  moreDataCalled: boolean;
  localeDateFormat;
  moreData;
  lessData;
  refreshDataCheck = false;
  isDeleteOrHide = false;
  totalPages: number;
  isFilterData: boolean;
  removeScrollHeight: any;
  @ViewChild('productOfferHead')  poListHead: any;
  filteredField: any;
  filteredValue: any;
  isFilterCallTrue: boolean;
  filterKeys: any;
  loadError = false;
  


  constructor(private _productOffersListService: ProductOffersListService,
    private _sharedService: sharedService,
    private locale: LocaleService,
    private _utilService: utilService,
    private _productService: ProductService,
    private _http: Http,
    private _router: Router,
    private _utilityService: UtilityService,
    private _capabilityService: CapabilityService,
    private _infiniteScrollCheckService: InfiniteScrollCheckService) {
    this.confirmDialog = 0;
    this.currencies = [];
    this.partitions = [];
    this.offeringTypes = [];
    this.poListSubscriptions = [];
    this.isFilterCallTrue = false;
  }

  scrollInitialize(pagination) {
    this.pagination = pagination;
    this.getAllProductOffers(true, this.makeHidden);
  }
  scrollReset() {
    this.pagination = this.pagination.reset();
  }
  getMoreData() {
    this._utilService.getScrollHeight(true);
    if (this._productOffersList !== undefined && !this.refreshDataCheck && !this.isDeleteOrHide){
      this.moreData = this._infiniteScrollCheckService.getMoreScrollData(!this.loading,this._productOffersList.length,this.pagination,this.totalPageSize,this.totalPages);
       if (this.moreData !== undefined) {
         this.infiniteScrollCheck = this.moreData.infiniteScrollCheck;
         this.moreDataCalled = this.moreData.moreDataCalled;
         this.getAllProductOffers(true, this.makeHidden);
      }
    } else {
      this.refreshDataCheck = false;
    }
  }

  calculateGridScrollHeight() {
    if (window.innerWidth <= 991) {
      const systembarHeight = 42;
      this.removeScrollHeight = systembarHeight + this.poListHead.nativeElement.clientHeight + 25;
    }
    if (this._utilityService.isTicketLogin()) {
      return { overflow: 'auto', height: 'calc(92vh - ' + `${this.removeScrollHeight}` + 'px)' };
    } else {
      return { overflow: 'auto', height: 'calc(100vh - ' + `${this.removeScrollHeight}` + 'px)' };
    }
  }

  getLessData() {
    if (this._productOffersList !== undefined && !this.isDeleteOrHide){
    this.lessData = this._infiniteScrollCheckService.getLessScrollData(!this.loading,this._productOffersList.length,this.pagination,this.moreDataCalled);
     if (this.lessData !== null) {
         this.infiniteScrollCheck = this.lessData.infiniteScrollCheck;
         this.moreDataCalled = this.lessData.moreDataCalled;
         this.getAllProductOffers(true, this.makeHidden);
     }
    }
  }

  ngOnInit() {
    this.currentLocale = this.locale.getCurrentLocale();
    this.calenderLocale = calenderLocaleFeilds[this.currentLocale];
    this.localeDateFormat = this.calenderLocale.localeDateFormat;
    this.amLocaleDateFormat = this.calenderLocale.amLocaleDateFormat;
    let columnDefFile = {};
    this.showErrorMsg = false;
    this.getGridConfigData();
    this._utilService.updateApplyBodyScroll(false);
    localStorage.setItem('mainRoot', 'TEXT_SUBSCRIBABLE_ITEMS');
    this._utilService.changedynamicSaveBtn('');
    this.showCreatePOPanel = false;
    this.loading = true;
    this.totalCount = 0;
    this.getCurrenciesAndPartitions();
    this.isVisiblePO = true;
    this.getCreatePOConfig();
    this._utilService.showCreateOfferingList(false);
    this.poListSubscriptions = this._utilService.createOffering.subscribe(value => {
      switch (value) {
        case 'bundle':
          this.offeringType = 'bundle';
          this.showCreatePOPanel = true;
          break;
        case 'productOffer':
          this.offeringType = 'productOffer';
          this.showCreatePOPanel = true;
          break;
        default:
          this.showCreatePOPanel = false;
          break;
      }
    });
    const removeHeight = this._utilService.removeScrollHeight.subscribe(value => {
      if (value !== 0) {
        this.removeScrollHeight = value;
      }
    });
    this.poListSubscriptions.add(removeHeight);
    const callFilterData = this._utilService.callFilterData.subscribe(value => {
      if (value === 'productOfferList') {
        this.filterData();
      }
    });
    this.poListSubscriptions.add(callFilterData);
  }

  isDefined(value) { return typeof value !== 'undefined'; }

  isCapableOf(item) {
    if (Object.keys(this.offeringsViewCapabilities).length > 0) {
      return this.offeringsViewCapabilities.hasOwnProperty(item) && this.isDefined(item) ? (this.offeringsViewCapabilities[item] === null ? true : this.offeringsViewCapabilities[item]) : true
    }
  }

  getGridConfigData() {
    this._utilityService.getextdata({
      data: 'columnDef.json',
      success: (result) => {
        this.columnDef = result;
        this.offeringsTypes = this.columnDef.offeringsTypes;
        this.loadGridData = true;
        this.convertDefaultSortOrder();
        this.processCapability();
        this.cols = JSON.parse(JSON.stringify(this.columnDef)).cols;
        this.reInitializeFields();
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this.showErrorMsg = true;
        this.loadError = true;
        this.offeringsGridErrMsg = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
        this.loadGridData = false;
        this.loading = false;
      }
    });
  }

  processCapability() {
    this.offeringsViewCapabilities = this._capabilityService.getWidgetCapabilities('UIPOGrid');
        let columnDefFile = JSON.parse(JSON.stringify(this.columnDef));
        if (!this.offeringsViewCapabilities['hide_column_(un)hide'] && !this.offeringsViewCapabilities['copy_column_(un)hide'] && !this.offeringsViewCapabilities['Delete_Column_(un)hide']) {
          const columns = columnDefFile['cols'];
        if (columns.length > 0) {
          for (let index = 0; index < columns.length; index++) {
            const element = columns[index];
            if (element.field == 'actions') {
              columnDefFile['cols'].splice(index, 1);
            }
          }
        }
      this.columnDef = columnDefFile;
    } else if (this.offeringsViewCapabilities['hide_column_(un)hide'] && !this.offeringsViewCapabilities['Delete_Column_(un)hide']) {
      columnDefFile['cols'][0]['style'].width = '130px';
      this.columnDef = columnDefFile;
    } else if (!this.offeringsViewCapabilities['hide_column_(un)hide'] && this.offeringsViewCapabilities['Delete_Column_(un)hide']) {
      columnDefFile['cols'][0]['style'].width = '70px';
      this.columnDef = columnDefFile;
    } else {
      this.columnDef =  columnDefFile;
    }
  }

  getOfferingDetails(offering) {
    this._utilService.changeSelectedOfferBreadcrumbData(offering);
    if (offering.bundle) {
      this._utilService.changeSubNavigation('TEXT_BUNDLE');
      this.redirectionPageIs = ['/ProductCatalog/Bundle', offering.offerId];
    } else {
      this._utilService.changeSubNavigation('TEXT_PRODUCT_OFFER');
      this.redirectionPageIs = ['/ProductCatalog/ProductOffer', offering.offerId];
    }
    this._router.navigate(this.redirectionPageIs);
  }

  getCurrenciesAndPartitions() {
    this._utilityService.getCurrenciesAndPartitionsList({
      success: (result) => {
        this.createPOData = result;
      },
      failure: (error) => {
      }
    });
  }

  getCurrencies() {
    this.currencies = [];
    var currencyItems = this.createPOData != (undefined && null) ? this.createPOData['currencies'] : [];
    this.currencies.push({ label: 'TEXT_SELECT_CRITERIA', value: 'Select' });
    this.currencies.push({ label: '', value: '' });
    for (var i in currencyItems) {
      this.currencies.push({ label: currencyItems[i].name, value: currencyItems[i].name });
    }
    this.currencyFirstItem = this.currencies[0].value;
  }

  getPartitions() {
    this.partitions = [];
    var partitionItems = this.createPOData != (undefined && null) ? this.createPOData['partitions'] : [];
    this.partitions.push({ label: 'TEXT_SELECT_CRITERIA', value: 'Select' });
    this.partitions.push({ label: '', value: '' });
    for (var i in partitionItems) {
      this.partitions.push({ label: partitionItems[i].login, value: partitionItems[i].accountId });
    }
    this.partitionFirstItem = this.partitions[0].value;
  }

  convertDefaultSortOrder() {
    this.convertedDefaultSortOrder = (this.columnDef.defaultSortOrder == 'asc') ? 1 : -1;
  }

  clearFilters(column) {
    this.filterFields[column] = '';
    this.isFilterData = false;
    this.filterData();
  }


  isFilterText(column) {
    return this.filterFields[column] && this.filterFields[column].length > 0 ? true : false;
  }


  exportToCSV() {
      this.isDownload = true;
      this.getAllProductOffers(true, this.makeHidden);
  }

  refreshData() {
    this.loading = true;
    this.loadGridData = false;
    this.lazyLoad = false;
    this.showErrorMsg = false;
    this.loadError = false;
    this.getGridConfigData();
    this.refreshDataCheck = true;
    this._utilService.changedRefreshNumberDateFilter(true);
   this._utilService.updateChangeScrollposition('refresh');
  }

  setSortandTableQuery() {
    const widgetData = {
      param: {
        page: (this.isDownload) ? '' : this.pagination.page,
        size: (this.isDownload) ? '' : this.pagination.scrollPageSize,
        hidden: this.flag
      }
    };
    if (Object.keys(this.sortQuery).length > 0) {
      widgetData.param['sort'] = this.sortQuery;
    }
    if (Object.keys(this.tableQuery).length > 0) {
      widgetData.param['query'] = this.tableQuery;
    }
    if (this.isDownload) {
      this.tableQuery['hidden'] = this.flag;
      widgetData.param['query'] = this.tableQuery;
    }
    return widgetData;
  }

  getAllProductOffers(firstCall, flag) {
    this.errorMessage = '';
    this.loading = true;
    this.flag = flag;
    let timer;
    this._utilService.getScrollHeight(true);
    if (this.isDownload) {
      this._productOffersListService.exportToCSV({
        data: this.setSortandTableQuery(),
        success: (result) => {
          this._utilityService.downloadFile(result, 'Export.csv');
          this.isDownload = false;
          this.tableQuery = {};
        },
        failure: (errorMsg: string, code: any, error: any) => {
          this.showErrorMsg = true;
          this.loadError = false;
          this.offeringsGridErrMsg = this._utilityService.errorCheck(code, errorMsg, 'DOWNLOAD');
        },
        onComplete: () => {
          this.loading = false;
        }
      });
    } else {
      this._productOffersListService.getProductOffers({
        data: this.setSortandTableQuery(),
        success: (result) => {
          clearTimeout(timer);
          timer = setTimeout(() => {
            result.filter ? this.filterKeys = result.filter : this.filterKeys = undefined;
            if (this.filterKeys !== undefined) {
              this.isFilterCallTrue = this._utilityService.getLatestServiceData(this.filterKeys, this.filteredField, this.filteredValue);
            }
            if(!this.isFilterCallTrue) {
              this.counter++;
              this.processProductOfferResult(result, firstCall);
            }
          }, 300);
          this.isFilterCallTrue = false;
        },
        failure: (errorMsg: string, code: any, error: any) => {
          this.showErrorMsg = false;
          this._productOffersList = [];
          this.errorMessage = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
        },
        onComplete: () => {
          this.loading = false;
        }
      });
    }
  }

  processProductOfferResult(productOffers, firstCall) {
    this.isHiddenListEmpty = !productOffers['utilityMap'].visibilityFlag;
    this.poListLength = productOffers.totalCount === 0 ? undefined : productOffers.totalCount;
    this._infiniteScrollCheckService.totalPages = productOffers.totalPages;
    if (firstCall) {
      this.getCurrencies();
      this.getPartitions();
      this.POTypes();
    }
    this.errorTooltip = false;
     if (this.isFilterData) {
       if(this.pagination.page === 1) {
        this._productOffersList = [];
        this._productOffersList = productOffers.records;
       }
       this.processGridData(productOffers.records);
     } else {
       this.processGridData(productOffers.records);
     }
    this.totalCount = productOffers.totalCount;
    this.totalPageSize = productOffers.totalPageSize;
    this.totalPages = productOffers.totalPages;
    this.noTableData = this.totalCount > 0 ? false : true;
  }

  public processGridData(records) {
    if(this.isDeleteOrHide) {
      if (this.pagination.page > 1) {
        this._productOffersList = this._infiniteScrollCheckService.callProductDelete(this._productOffersList, this.tooltipIndex, this.pagination);
      }
      this.refreshGrid(records);
      setTimeout(() => {
        this._utilService.updateChangeScrollposition('modified');
        this.isDeleteOrHide = false;
      }, 200);
    } else {
      this.refreshGrid(records);
    }
    if (this.refreshDataCheck) {
      this.refreshDataCheck = false;
    }
  }

  public refreshGrid(records) {
    this._productOffersList = this._infiniteScrollCheckService.infiniteScrollData(records, this.infiniteScrollCheck, this.pagination,this.totalPageSize);
    this.errorMessage = '';
  }

  sortDateFieldConfig(field) {
    let fields = {
      effStartDate: 'startDate',
      effEndDate: 'endDate',
      availStartDate: 'availableStartDate',
      availEndDate: 'availableEndDate'
    }
    return fields[field] ? fields[field] : null;
  }

  dateFieldConfig(field) {
    const fields = {
      startDate: 'startDate',
      endDate: 'endDate',
      availableStartDate: 'availableStartDate',
      availableEndDate: 'availableEndDate'
    };
    return fields[field] ? fields[field] : null;
  }

  loadData(event: any) {
    if (this.lazyLoad && !this.refreshDataCheck) {
      this.sortQuery = {};
      this.getColumnSortOrder = (event.sortOrder == 1) ? 'asc' : 'desc';
      const dLangProperty = this._utilityService.dLangPropertyNames(event.sortField);
      const configField = this.sortDateFieldConfig(event.sortField);
      if (dLangProperty !== null) {
        this.sortQuery[dLangProperty ? dLangProperty : event.sortField] = this.getColumnSortOrder;
      } else {
        this.sortQuery[configField ? configField : event.sortField] = this.getColumnSortOrder;
      }
      this.scrollReset();
      this.getAllProductOffers(true, this.makeHidden);
    }
    this.lazyLoad = true;
  }

  filterData() {
    this.isFilterData = true;
    this.tableQuery = {};
    for (const key in this.filterFields) {
      if (this.filterFields[key] !== '' && this.filterFields[key] !== null) {
        const filterValue = this.filterFields[key];
        const dLangProperty = this._utilityService.dLangPropertyNames(key);
        if (!this._utilityService.isEmpty(filterValue)) {
          if (this.dateFieldConfig(key)) {
            this.tableQuery[key] = this.filterFields[key].trim();
          } else if (dLangProperty) {
            this.tableQuery[dLangProperty] = this.filterFields[key].trim();
          } else {
            this.tableQuery[key] = `'%${this.filterFields[key].trim()}%'|like`;
          }
        }
      }
    }
    if (this.selectedCurrency !== '' && this.selectedCurrency !== null && this.selectedCurrency !== 'Enter filter critira') {
      this.tableQuery['currency'] = this.selectedCurrency;
    }
    if (this.selectedCurrency === 'Enter filter critira') {
      this.selectedCurrency = 'TEXT_ENTER_FILTER_CRITERIA';
    }
    if (this.selectedPartition !== '' && this.selectedPartition !== null && this.selectedPartition !== 'Enter filter critira') {
      this.tableQuery['popartitionid'] = this.selectedPartition;
    }
    if (this.selectedPartition === 'Enter filter critira') {
      this.selectedPartition = 'TEXT_ENTER_FILTER_CRITERIA';
    }
    if (this.selectedOfferingType) {
      const offeringsParameters = this.offeringsTypes[this.selectedOfferingType];
      for (const key in offeringsParameters) {
        if (offeringsParameters[key] !== '' && offeringsParameters[key] !== undefined) {
          this.tableQuery[key] = offeringsParameters[key];
        }
      }
    }
    this.scrollReset();
    this.getAllProductOffers(true, this.makeHidden);
  }

  filterDataKeys(event, field, value) {
    this.filteredField = field;
    this.filteredValue = value;
    this._utilityService.enableFilter(event, 'productOfferList');
  }

  getDeviceWidth() {
    return window.innerWidth + 'px';
  }

  onModalDialogCloseDelete(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this.canPODeleted = true;
      this.deleteProductFromList(this.deleteHideUnhidePoData['offerId'], this.deleteHideUnhideErrorIndex);
      this.canPODeleted = false;
    }
  }

  onModalDialogCloseHide(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this.canPOHide = true;
      this.hidePOFromList(this.deleteHideUnhidePoData['offerId'], this.deleteHideUnhideErrorIndex);
      this.canPOHide = false;
    }
  }

  onModalDialogCloseUnhide(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this.canPOUnHide = true;
      this.unHidePOFromList(this.deleteHideUnhidePoData['offerId'], this.deleteHideUnhideErrorIndex);
      this.canPOUnHide = false;
    }
  }

  onModalDialogCloseCreatePO(event) {
    this.confirmDialog = 0;
  }

  deletePO(data, index) {
    if (data.delete) {
    this.deleteHideUnhidePoData = data;
    this.deleteHideUnhideErrorIndex = index;
    this.errorTooltip = false;
    this.confirmDialog = 1;
    }
  }

  deleteProductFromList(offerId, index) {
    this.productOfferId = offerId;
    this.tooltipIndex = index;
    this._utilService.getScrollHeight(true);
    var widgetData = {
      productOfferId: offerId
    };
    this._productService.deletePODetail({
      data: widgetData,
      success: (result) => {
        this._productOffersList.splice(this.tooltipIndex, 1);
        this.isDeleteOrHide = true;
        if (this.infiniteScrollCheck === 'Less') {
          this.pagination.page += 2;
          this.infiniteScrollCheck = 'More';
        }
        this.getAllProductOffers(true, this.makeHidden);
      },
      failure: (errorMsg: string, code: any) => {
        let deleteError = this._utilityService.errorCheck(code, errorMsg, 'DELETE');
        this.handleErrorDeletePO(deleteError, index);
      }
    });
  }

  getRowClass(data, index): String {
    return data.error ? 'errorDeleteSchedule' : 'noErrorDeleteSchedule';
  }

  clearHighlight() {
    Object.keys(this._productOffersList).forEach(element => {
      this._productOffersList[element].error = false;
    });
  }

  OnTooltipClose(value) {
    if (value) {
      this.clearHighlight();
    }
  }

  onClick(event) {
    if (this.errorTooltip) {
      this.clearHighlight();
    }
  }

  handleErrorDeletePO(error, index) {
    this.tooltipIndex = index;
    this._productOffersList[index].error = true;
    this.errorTooltip = true;
    this.deletePoError = error;
  }

  openCreateOfferingPanel() {
    //this._utilService.showCreateOfferingList(true);
    this.confirmDialog = 4;
  }

  hidePropertiesWidget(value) {
    if (value) {
      this.showCreatePOPanel = false;
    }
  }

  getCreatePOConfig() {
    return this._http.get('/static/default/gridViewConfig/createPOConfig.json')
      .map(response => response.json())
      .subscribe(
        (result) => { this.createPODataconfig = result.data },
        (error) => { }
      );
  }

  hidePOFromList(offerId, index) {
    this.tooltipIndex = index;
    this._utilService.getScrollHeight(true);
    const widgetData = {
      productOfferId: offerId
    };
    this._productOffersListService.hidePO({
      data: widgetData,
      success: (result) => {
        this._productOffersList.splice(this.tooltipIndex, 1);
        this.makeHidden = false;
        this.isDeleteOrHide = true;
        if (this.infiniteScrollCheck === 'Less') {
          this.pagination.page += 2;
          this.infiniteScrollCheck = 'More';
        }
        this.getAllProductOffers(true, this.makeHidden);
      },
      failure: (errorMsg: string, code: any) => {
        let poHideError = this._utilityService.errorCheck(code, errorMsg,'HIDE');
        this.handleErrorHIdePO(poHideError, index);
      }
    });
  }
  handleErrorHIdePO(error, index) {
    this.tooltipIndex = index;
    this.errorTooltip = true;
    this.deletePoError = error;
    this._utilService.changeHidePOError(error);
  }
  unHidePOFromList(offerId, index) {
    this.productOfferId = offerId;
    this.tooltipIndex = index;
    this._utilService.getScrollHeight(true);
    let widgetData = {
      productOfferId: offerId
    };
    this._productOffersListService.unHidePO({
      data: widgetData,
      success: (result) => {
        this._productOffersList.splice(this.tooltipIndex, 1);
        this.makeHidden = true;
        this.isDeleteOrHide = true;
        if (this.infiniteScrollCheck === 'Less') {
          this.pagination.page += 2;
          this.infiniteScrollCheck = 'More';
        }
        this.getAllProductOffers(true, this.makeHidden);
      },
      failure: (errorMsg: string, code: any) => {
        let poUnhideError = this._utilityService.errorCheck(code, errorMsg,'UNHIDE');
        this.handleErrorUnHIdePO(poUnhideError, index);
      }
    });
  }
  handleErrorUnHIdePO(error, index) {
    this.tooltipIndex = index;
    this.errorTooltip = true;
    this.deletePoError = error;
    this._utilService.changeHidePOError(error);
  }
  showVisiblePOs() {
    this._productOffersList = [];
    this.scrollReset();
    this.makeHidden = false;
    this.isVisiblePO = true;
    this.getAllProductOffers(true, this.makeHidden);
  }
  getAllHiddenPo() {
    this._productOffersList = [];
    this.scrollReset();
    this.makeHidden = true;
    this.isVisiblePO = false;
    this.getAllProductOffers(true, this.makeHidden);
  }

  hidePO(data, index) {
    this.deleteHideUnhidePoData = data;
    this.deleteHideUnhideErrorIndex = index;
    this.errorTooltip = false;
    //this._utilService.changeHidePOFromList({modalStatus: true,errorIndex: index,offerData: data});
    this.confirmDialog = 2;
  }
  unHidePO(data, index) {
    this.deleteHideUnhidePoData = data;
    this.deleteHideUnhideErrorIndex = index;
    this.errorTooltip = false;
    //this._utilService.changeUnHidePOFromList({modalStatus: true,errorIndex: index,offerData: data});
    this.confirmDialog = 3;
  }

  triggerOffering(item) {
    this.confirmDialog = 0;
    switch (item) {
      case 'bundle':
        this._utilService.changeCreateOffering('bundle');
        break;
      case 'productOffer':
        this._utilService.changeCreateOffering('productOffer');
        break;
      default:
        this._utilService.changeCreateOffering('');
        break;
    }
    this._utilService.showCreateOfferingList(false);
  }

  ngOnDestroy() {
    this.showCreatePOPanel = false;
    this._utilService.showCreateOfferingList(false);
    this._utilService.changeCreateOffering('');
    this._utilService.checkCallFilterData('');
    if (this.poListSubscriptions) {
      this.poListSubscriptions.unsubscribe();
    }
    this._infiniteScrollCheckService.totalPages = 0;
  }

  reInitializeFields() {
    this.filterFields = {};
    this.sortQuery = {};
    this.tableQuery = {};
    this.selectedCurrency = '';
    this.selectedPartition = '';
    this.currencyFirstItem = '';
    this.partitionFirstItem = '';
    this.selectedOfferingType = '';
    this.offeringFirstItem = '';
    this.sortQuery[this.columnDef.defaultSortColumn] = this.columnDef.defaultSortOrder;
  }

  copyOfferingsHandler(data) {
    this.offeringData = data;
    if (data.currencies == '') {
      this.offeringData.currencies = this.createPOData['currencies'];
    }
    if (data.poPartitions == '') {
      this.offeringData.poPartitions = this.createPOData['partitions'];
    }
    this.offeringData = data;
    this.offeringType = data.bundle ? 'copyBundle' : 'copyPO';
    this.showCreatePOPanel = true;
  }
  changeCurrencyItem(selectedCurrency) {
    this.selectedCurrency = selectedCurrency;
    this.filterData();
  }
  changePartitionItem(selectedPartition) {
    this.selectedPartition = selectedPartition;
    this.filterData();
  }
  changeOfferingType(selectedOffering) {
    this.selectedOfferingType = selectedOffering;
    this.filterData();
  }
  POTypes() {
    this.offeringTypes = [];
    this.offeringTypes.push({ label: 'TEXT_SELECT_CRITERIA', value: 'Select' });
    Object.keys(this.offeringsTypes).forEach(element => {
      const offerings = {
        label: element,
        value: element
      };
      this.offeringTypes.push(offerings);
    });
    this.offeringFirstItem = this.offeringTypes[0].value;
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

  getErrorMessageType() {
    const filterCriteriaLength = !this._utilityService.isObject(this.tableQuery) ? 0 : Object.keys(this.tableQuery).length;
    if (this.loading) {
      return 0;
    }
    if (this.errorMessage) {
      return 1;
    } else if (this._productOffersList != undefined && this._productOffersList.length === 0 && filterCriteriaLength === 0) {
      if(this.errorMessage == ''){
        return 2;
      }
    } else if (this._productOffersList != undefined && this._productOffersList.length === 0 && filterCriteriaLength > 0) {
      if(this.errorMessage == ''){
        return 3;
      }
    }
    return 0;
  }
}