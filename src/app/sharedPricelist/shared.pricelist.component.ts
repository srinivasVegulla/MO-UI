import { Component, EventEmitter, ViewChild, OnInit, Input, Output, HostListener} from '@angular/core';
import { SharedPricelistService } from './shared.pricelist.service';
import { UtilityService } from '../helpers/utility.service';
import { Language } from 'angular-l10n';
import { utilService } from '../helpers/util.service';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { TooltipModule } from 'ng2-tooltip';
import { ErrorTooltipComponent } from '../errortooltip/errorTooltip.component';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { CapabilityService } from '../helpers/capabilities.service';
import { InfiniteScrollCheckService } from '../helpers/InfiniteScrollCheck.service';

@Component({
  selector: 'ecb-shared-pricelist',
  templateUrl: './shared.pricelist.component.html',
  styleUrls: ['./shared.pricelist.component.scss'],
  providers: []
})

export class SharedPricelistComponent implements OnInit, OnDestroy {
  sharedPricelistError: string = '';
  sharedPricelist: any = [];
  sharedPricelistCols: any;
  @ViewChild('sharedPricelists') sharedPricelists: any;
  filterFields: any;
  showCover = false;
  sharedPricelistAsidePanel: any;
  selectedSharedPricelistOfferings: any;
  selectedSharedPricelistSubscribers: any;
  partitionsByAccountId: any[];
  isFilterCriterialProcessing: boolean;
  currency: string;
  partition: any;
  filterQuery: any;
  sortQuery: any;
  currencies: any[];
  @Language() lang: string;
  partitions: any[];
  @ViewChild('sharedPricelistDatatable') sharedPricelistDatatable: any;
  pricelistFetching: boolean;
  confirmDialog: number;
  deletePriceListData: any;
  deletePriceListDataIndex: number;
  selectedPriceListId: number;
  deletePlError: any;
  errorTooltip: boolean;
  tooltipIndex;
  showInuseSubscribersInfo: boolean;
  showInuseOfferingsInfo: boolean;
  hideSharedPricelistSubscriptions: any;
  initCall: boolean;
  totalCount: number;
  totalPageSize: number;
  pagination: any;
  currencyFirstItem: string;
  partitionFirstItem: string;
  closeOnEsc: boolean;
  selectedFilterData: any;
  getInUseColumnSortOrder: any;
  columnDef;
  loadGridData = false;
  errorMessage;
  sharedRatesCapabilities = {};
  editSharedRateCapability = true;
  deleteSharedRateCapability = true;
  createSharedRateCapability = true;
  convertedDefaultSortOrder;
  infiniteScrollCheck: String = '';
  moreDataCalled: boolean;
  inUseOfferingsData;
  inUseOfferingsLocation;
  moreData;
  lessData;
  totalPages;
  isDeleteOrHide = false;
  refreshDataCheck = false;
  isFilterData: boolean;
  isCreateRateList:boolean;
  priceListData: any;
  removeScrollHeight: any;
  nextStateUrl: string = '';
  copySharedRateCapability = true;
  filteredField: any;
  filteredValue: any;
  isFilterCallTrue: boolean;
  filterKeys: any;
  callFilter: any;

  constructor(private _sharedPricelistService: SharedPricelistService,
    private _utilityService: UtilityService,
    private _router: Router,
    private _utilService: utilService,
    private _capabilityService: CapabilityService,
    private _infiniteScrollCheckService: InfiniteScrollCheckService) {
    this.reset();
    this.showCover = false;
    this._utilService.checkNgxSlideModal(false);
    this._utilService.changedynamicSaveBtn('');
    this.isFilterCallTrue = false;
  }

  scrollInitialize(pagination) {
    this.pagination = pagination;
    this.getSharedPricelists();
  }

  scrollReset() {
    this.pagination = this.pagination.reset();
  }

  getMoreData() {
    this._utilService.getScrollHeight(true);
    if(this.sharedPricelist !== undefined  && !this.refreshDataCheck && !this.isDeleteOrHide){
      this.moreData = this._infiniteScrollCheckService.getMoreScrollData(!this.pricelistFetching,this.sharedPricelist.length,this.pagination,this.totalPageSize,this.totalPages);
       if (this.moreData !== undefined) {
         this.infiniteScrollCheck = this.moreData.infiniteScrollCheck;
         this.moreDataCalled = this.moreData.moreDataCalled;
         this.getSharedPricelists();
      }
    } else {
      this.refreshDataCheck = false;
    }
  }

  calculateGridScrollHeight() {
    if (this._utilityService.isTicketLogin()) {
      return { overflow: 'auto', height: 'calc(92vh - ' + `${this.removeScrollHeight}` + 'px)' }
    } else {
      return { overflow: 'auto', height: 'calc(100vh - ' + `${this.removeScrollHeight}` + 'px)' }
    }
  }

  getLessData() {
     if(this.sharedPricelist !== undefined && !this.isDeleteOrHide){
    this.lessData = this._infiniteScrollCheckService.getLessScrollData(!this.pricelistFetching,this.sharedPricelist.length,this.pagination,this.moreDataCalled);
     if (this.lessData !== null) {
         this.infiniteScrollCheck = this.lessData.infiniteScrollCheck;
         this.moreDataCalled = this.lessData.moreDataCalled;
         this.getSharedPricelists();
     }
    }
  }

  public reset() {
    this.sharedPricelistCols = [];
    this.currencies = [];
    this.partitions = [];
    this.partitionsByAccountId = [];
    this.sharedPricelistError = '';
    this.sharedPricelist = [];
    this.initializeFields();
    this.isFilterCriterialProcessing = false;
    this.pricelistFetching = false;
    this.showInuseSubscribersInfo = false;
    this.showInuseOfferingsInfo = false;
    this.errorTooltip = false;
    this.showCover = false;
    this._utilService.checkNgxSlideModal(false);
    this.initCall = true;
    this.totalCount = 0;
    this.totalPageSize = 0;
  }

  fetchRateListCount(value) {
    this.selectedFilterData = value;
    if (this.selectedFilterData.selectedValue !== '' && this.selectedFilterData.selectedValue !== null) {
      if (this.selectedFilterData.selectedColumn === 'useAccCount') {
        this.filterFields['useAccCount'] = [this.selectedFilterData.selectedValue, '0|!='];
      } else {
        this.filterFields['offeringsCount'] = [this.selectedFilterData.selectedValue, '0|!='];
      }
       this.prepareFilterQuery();
      } else {
        this.clearFilters(this.selectedFilterData.selectedColumn);
     }
  }

  ngOnInit() {
    this.getGridConfigData();
    this.getCurrenciesAndPartitions();
    this._utilService.updateApplyBodyScroll(false);
    this.sharedPricelistAsidePanel = this.sharedPricelists;
    this.hideSharedPricelistSubscriptions = this._sharedPricelistService.hideSharedPricelist.subscribe(value => {
      if (value && this._utilityService.isObject(this.sharedPricelistAsidePanel)) {
        this.closeEditPanel();
      }
    });
  this.errorTooltip = false;
  this._utilService.removeScrollHeight.subscribe(value => {
    if (value !== 0) {
      this.removeScrollHeight = value;
    }
  });
  this.nextStateUrl = '/ProductCatalog/SharedRatelist/';
    this._router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe(value => {
        this.nextStateUrl = value['url'];
      });
     this._utilService.callFilterData.subscribe(value => {
        if (value === 'sharedPriceList') {
          this.prepareFilterQuery();
        }
      });
      this.hideSharedPricelistSubscriptions.add(this.callFilter);
  }
  processCapability() {
    this.sharedRatesCapabilities = this._capabilityService.getWidgetCapabilities('UISharedRates');
    this.createSharedRateCapability = this._capabilityService.findPropertyCapability('UISharedRates', 'SharedRates_Add');
    this.editSharedRateCapability = this._capabilityService.findPropertyCapability('UISharedRates', 'SharedRates_Edit');
    this.deleteSharedRateCapability = this._capabilityService.findPropertyCapability('UISharedRates', 'SharedRates_Delete');
    this.copySharedRateCapability = this._capabilityService.findPropertyCapability('UISharedRates', 'SharedRates_Copy');
    const columnDefFile = JSON.parse(JSON.stringify(this.columnDef));
    if (!this.deleteSharedRateCapability && !this.copySharedRateCapability) {
          const columns = columnDefFile['cols'];
          if (columns.length > 0) {
            for (let index = 0; index < columns.length; index++) {
              const element = columns[index];
              if (element.field == 'actions') {
                this.columnDef['cols'].splice(index, 1);
              }
            }
          }
      } else if (this.deleteSharedRateCapability) {
        this.columnDef['cols'][0]['style'].width = '90px';
      } else {
         this.columnDef = columnDefFile;
      }
  }


  getGridConfigData() {
    this._utilityService.getextdata({
      data: 'sharedPricelistColumnDef.json',
      success: (result) => {
        this.columnDef = result;
        this.processCapability();
        const defaultSortColumn = this.columnDef.defaultSortColumn;
        if (defaultSortColumn !== undefined) {
          this.sortQuery[defaultSortColumn] = this.columnDef.defaultSortOrder;
        }
        this.sharedPricelistCols = JSON.parse(JSON.stringify(this.columnDef)).cols;
        this.loadGridData = true;
      },
      failure: (errorMsg: string, code: any,error: any) => {
        this.errorMessage = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
        this.loadGridData = false;
      }
    });
  }

  convertDefaultSortOrder() {
    this.convertedDefaultSortOrder = (this.columnDef.defaultSortOrder == 'asc') ? 1 : -1;
  }

  private prepareSharedPricelistCols() {
    this.sharedPricelistCols = [];
    this.columnDef.cols.forEach(col => {
      this.sharedPricelistCols.push(col);
    });
  }
  closeEditPanel() {
    this.sharedPricelistAsidePanel.hide();
    this.showCover = false;
    this._utilService.checkNgxSlideModal(false);
  }
  public getSharedPricelists() {
    this.sharedPricelistError = '';
    this.convertDefaultSortOrder();
    this.pricelistFetching = true;
    const criteria = {
      param: {
         page: this.pagination.page,
        size: this.pagination.scrollPageSize
      }
    };
    if (!this._utilityService.isEmpty(this.partition) && this.partition !== 'TEXT_ENTER_FILTER_CRITERIA') {
      criteria['param']['partitionId'] = this.partition;
    }
    if (Object.keys(this.sortQuery).length > 0) {
      criteria.param['sort'] = this.sortQuery;
    }
    if (Object.keys(this.filterQuery).length > 0) {
      criteria.param['query'] = this.filterQuery;
    }
    this._sharedPricelistService.getSharedPricelists({
      data: criteria,
      success: (result) => {
      result.filter ? this.filterKeys = result.filter : this.filterKeys = undefined;
      this.totalCount = result.totalCount;
      this.totalPageSize = result.totalPageSize;
      this.totalPages = result.totalPages;
        this._infiniteScrollCheckService.totalPages = this.totalPages;
      if (this.filterKeys !== undefined) {
        this.isFilterCallTrue = this._utilityService.getLatestServiceData(this.filterKeys, this.filteredField, this.filteredValue);
      }
      if(!this.isFilterCallTrue) {
        this.processGridData(result.records);
      }
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this.sharedPricelist = [];
        this.sharedPricelistError = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
      },
      onComplete: () => {
        this.pricelistFetching = false;
        this.initCall = false;
        this.isFilterCallTrue = false;
      }
    });
  }

  public processGridData(records) {
    if(this.isDeleteOrHide) {
      if (this.pagination.page > 1) {
        this.sharedPricelist = this._infiniteScrollCheckService.callProductDelete(this.sharedPricelist, this.tooltipIndex, this.pagination);
      }
      this.refreshGrid(records);
      setTimeout(() => {
        this._utilService.updateChangeScrollposition('modified');
        this.isDeleteOrHide = false;
      }, 300);
    } else {
      this.refreshGrid(records);
    }
    if (this.refreshDataCheck) {
      this.refreshDataCheck = false;
    }
  }

  public refreshGrid(records) {
    if (this.pagination.page === 1 && this.isFilterData) {
      this.sharedPricelist = [];
    }
    this.sharedPricelist = this._infiniteScrollCheckService.infiniteScrollData(records, this.infiniteScrollCheck, this.pagination,this.totalPageSize);
  }

  private getCurrenciesAndPartitions() {
    this._utilityService.getCurrenciesAndPartitionsList({
      success: (result) => {
        this.setCurrencies(result['currencies']);
        this.setPartitions(result['partitions']);
      },
      failure: (error) => {
      }
    });
  }

  setCurrencies(data) {
    this.currencies = [];
    this.currencies.push({ label: 'TEXT_SELECT_CRITERIA', value: 'Select' });
    this.currencies.push({ label: '', value: '' });
    for (const i in data) {
      if (data !== undefined) {
        this.currencies.push({ label: data[i].name, value: data[i].name });
      }
    }
    this.currencyFirstItem =  this.currencies[0].value;
  }

  setPartitions(data) {
    this.partitionsByAccountId = [];
    this.partitions = [];
    this.partitions.push({ label: 'TEXT_SELECT_CRITERIA', value: 'Select' });
    this.partitions.push({ label: '', value: '' });
    for (const i in data) {
      if (data !== undefined) {
        this.partitions.push({ label: data[i].login, value: data[i].accountId });
        this.partitionsByAccountId[data[i].accountId] = data[i];
      }
    }
    this.partitionFirstItem =  this.partitions[0].value;
  }

  numberFieldConfig(field){
    const fields = {
      useAccCount: 'useAccCount',
      offeringsCount: 'offeringsCount'
    };
    return fields[field] ? fields[field] : null;
  }

  private prepareFilterQuery() {
    this._utilityService.resetPagination(this.pagination);
    this.filterQuery = {};
    this.isFilterData = true;
    for (const key in this.filterFields) {
      if (this.filterFields[key] !== '' && this.filterFields[key] !== null) {
        const dLangProperty = this._utilityService.dLangPropertyNames(key);
        if (dLangProperty) {
          this.filterQuery[dLangProperty] = this.filterFields[key].trim();
        }  else if (this.numberFieldConfig(key)) {
          this.filterQuery[key] = this.filterFields[key];
        } else if (this.filterFields[key].trim() !== '') {
          this.filterQuery[key] = `'%${this.filterFields[key].trim()}%'|like`;
        }
      }
    }
    if (this.currency !== '' && this.currency !== null && this.currency !== 'Select') {
      this.filterQuery['currency'] = this.currency;
    }
    if (this.partition !== '' && this.partition !== null && this.partition !== 'Select') {
      this.filterQuery['plpartitionid'] = this.partition;
    }
    this.scrollReset();
    this.getSharedPricelists();
  }

  filterDataKeys(event, field, value) {
    this.filteredField = field;
    this.filteredValue = value;
    this._utilityService.enableFilter(event, 'sharedPriceList');
  }

  public getPricelistFilterData() {
    if (this.isFilterCriterialProcessing === false) {
      this.isFilterCriterialProcessing = true;
      setTimeout(() => {
        this.isFilterCriterialProcessing = false;
        this.prepareFilterQuery();
      }, 300);
    }
  }

  public loadData(event) {
    if (!this.initCall) {
      this._utilityService.resetPagination(this.pagination);
      this.sortQuery = {};
      if (event.sortField !== undefined) {
        this.getInUseColumnSortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
      }
      const dLangProperty = this._utilityService.dLangPropertyNames(event.sortField);
      this.sortQuery[dLangProperty ? dLangProperty : event.sortField] = this.getInUseColumnSortOrder;
      this.scrollReset();
      this.getSharedPricelists();
    }
  }

  canDeactivate() {
    if (this.closeOnEsc) {
      const data = {
        url: this.nextStateUrl
      };
      this._utilService.changePreventUnsaveChange(data);
      return false;
    } else {
      return true;
    }
  }

  public copyPricelist(record, index) {
    this.priceListData = record;
    this.sharedPricelists.show();
    this.showCover = true;
    this.isCreateRateList = false;
    this._utilService.checkNgxSlideModal(true)
  }

  public deletePricelist(record, index) {
     if (this.isDeleteSharedList(record)) {
      this.deletePriceListData = record;
      this.deletePriceListDataIndex = index;
      this.confirmDialog = 1;
    }
  }
  public openInuseSubscribers(i) {
    this.showInuseSubscribersInfo = true;
    this.selectedSharedPricelistSubscribers = this.sharedPricelist[i];
  }

  public clearFilters(column) {
    this.filterFields[column] = '';
    this.isFilterData = false;
    this.prepareFilterQuery();
  }

  public isFilterText(column) {
    return this.filterFields[column] && this.filterFields[column].length > 0 ? true : false;
  }

  public isDeleteSharedList(record) {
    return record.useAccCount > 0 || record.offeringsCount > 0 ? false : true;
  }

  public redirectToDetailPage(data) {
    this._sharedPricelistService.changeSelectedSharedListBreadcrumbData(data);
    const loadPOUrl = '/ProductCatalog/ratelistDetails/' + data.pricelistId;
    this._utilService.addNewRecord({
      obj: data,
      path: loadPOUrl,
      Level: 'Grid'
    });
    this._router.navigateByUrl(loadPOUrl);
  }

  openCreatePricelistPanel(sharedPricelists) {
    this.sharedPricelistAsidePanel = sharedPricelists;
    sharedPricelists.show();
    this.showCover = true;
    this.isCreateRateList = true;
    this._utilService.checkNgxSlideModal(true);
  }

  public getPartitionNameById(partitionId) {
    return this.partitionsByAccountId && this.partitionsByAccountId[partitionId] ? this.partitionsByAccountId[partitionId]['login'] : '';
  }

  onModalDialogCloseDelete(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this.deltePriceList(this.deletePriceListData['pricelistId'], this.deletePriceListDataIndex);
    }
  }

  OnTooltipClose() {
    this.errorTooltip = false;
    this.clearHighlight();
  }

  getRowClass(data, index): String {
    return data.error ? 'errorDeleteSchedule' : 'noErrorDeleteSchedule';
  }

  deltePriceList(priceListId, index) {
    this.tooltipIndex = index;
    this._utilService.getScrollHeight(true);
    const widgetData = {
      pricelistId :  priceListId
    };
    if (this.sharedPricelist.length === index) {
      this.tooltipIndex = index - 1;
    }else {
      this.tooltipIndex = index;
    }
    this._sharedPricelistService.deleteSharedPricelist({
      data: widgetData,
      success: (result) => {
        this.sharedPricelist.splice(this.tooltipIndex, 1);
        this.isDeleteOrHide = true;
        if (this.infiniteScrollCheck === 'Less') {
          this.pagination.page += 2;
          this.infiniteScrollCheck = 'More';
        }
        this.getSharedPricelists();
      },
      failure: (errorMsg: string, code: any) => {
        this.deletePlError = this._utilityService.errorCheck(code, errorMsg, 'DELETE');
        this.sharedPricelist[index].error = true;
        this.errorTooltip = true;
      }
    });
  }

  clearHighlight() {
    for (const i in this.sharedPricelist) {
      if (this.sharedPricelist !== undefined) {
        this.sharedPricelist[i].error = false;
      }
    }
  }

  getErrorMessageType() {
    const filterCriteriaLength = !this._utilityService.isObject(this.filterQuery) ? 0 :  Object.keys(this.filterQuery).length;
    if (this.pricelistFetching) {
      return 0;
    }
    if (this.sharedPricelistError) {
      return 1;
    }else if (this.sharedPricelist.length === 0 && filterCriteriaLength === 0) {
      if(this.sharedPricelistError = '') {
        return 2;
      }
    } else if (this.sharedPricelist.length === 0 && filterCriteriaLength > 0) {
      if(this.sharedPricelistError = '') {
        return 3;
      }
    }
    return 0;
  }
  onSubscriberClosed() {
    this.showInuseSubscribersInfo = false;
  }

  openInuseOfferings(obj) {
    this.showInuseOfferingsInfo = true;
    this.inUseOfferingsData = obj;
    this.inUseOfferingsLocation = 'sharedPriceList';
  }
  hideInUseModalDialog(e) {
    if (e) {
      this.showInuseOfferingsInfo = false;
    }
  }
  refreshData() {
    this.loadGridData = false;
    this.initCall = true;
    this.getGridConfigData();
    this.initializeFields();
    this.refreshDataCheck = true;
    this._utilityService.resetPagination(this.pagination);
    this.sortQuery[ this.columnDef.defaultSortColumn] = this.columnDef.defaultSortOrder;
    this._utilService.changedRefreshNumberDateFilter(true);
    this._utilService.updateChangeScrollposition('refresh');
  }

  initializeFields() {
    this.filterFields = {};
    this.filterQuery = {};
    this.sortQuery = {};
    this.currency = '';
    this.partition = '';
    this.currencyFirstItem = '';
    this.partitionFirstItem = '';
  }
  ngOnDestroy() {
    if (this.hideSharedPricelistSubscriptions) {
      this.hideSharedPricelistSubscriptions.unsubscribe();
    }
    this._utilService.checkCallFilterData('');
    this._infiniteScrollCheckService.totalPages = 0;
  }
  changeCurrencyItem(selectedCurrency) {
    this.currency = selectedCurrency;
    this.prepareFilterQuery();
  }
  changePartitionItem(selectedPartition) {
    this.partition = selectedPartition;
    this.prepareFilterQuery();
  }
  displayNavoutDialog(value) {
    this.closeOnEsc = value ? true : false;
  }
}