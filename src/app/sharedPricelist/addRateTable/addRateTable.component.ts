import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SharedPricelistService } from '../shared.pricelist.service';
import { UtilityService } from '../../helpers/utility.service';
import { utilService } from '../../helpers/util.service';
import { InfiniteScrollCheckService } from '../../helpers/InfiniteScrollCheck.service';
import { Language, TranslationService } from 'angular-l10n';

@Component({
  selector: 'ecb-ratelist-addRateTable',
  templateUrl: './addRateTable.component.html',
  styleUrls: ['./addRateTable.component.scss']
})

export class RlAddRateTableComponent implements OnInit, OnDestroy {
  ratelistAddptMappingsColDef;
  ptMappingsCols: any[];
  filterFields: any;
  sortQuery: any;
  filterQuery: any;
  ptMappings = [];
  lazyLoad: boolean;
  confirmDialog: number;
  ptMappingsError: any;
  getColumnSortOrder: any;
  filterptMappingsFetching = false;
  totalCount: number;
  totalPageSize: number;
  initCall = true;
  isFilterCriterialProcessing: boolean;
  usageTypes = [];
  selectedUsageType: any;
  selectedPt: any;
  pricelistId: number;
  addRateTableError: string;
  addingRateTable: boolean;
  rateTableAdded: boolean;
  templateId: number;
  piDisplayName: number;
  widgetDialog: number;
  pagination: any;
  usageDefault: string;
  convertedDefaultSortOrder;
  loadGridData = false;
  loading: boolean = false;
  filterErrorMessage = false;
  infiniteScrollCheck: string = '';
  moreDataCalled: boolean;
  paramTableNo;
  moreData;
  lessData;
  totalPages;
  isFilterData: boolean;
  filteredField: any;
  filteredValue: any;
  isFilterCallTrue: boolean;
  filterKeys: any;
  showErrorMessage: boolean;
  errorMessageDisplay: any;
  loadError: boolean;
 
  @Output() onClose = new EventEmitter<any>();

  @Input() set param(data) {
    if (data) {
      this.pricelistId = data.pricelistId;
      if (data.templateId !== undefined) {
        this.templateId = data.templateId;
        this.piDisplayName = data.displayName;
      }
    }
  }

  constructor(private _sharedPricelistService: SharedPricelistService,
    private _utilityService: UtilityService,
    private _utilService: utilService,
    private _translationService: TranslationService,
    private _infiniteScrollCheckService: InfiniteScrollCheckService) {
    this.setUsageTypes();
  }

  scrollInitialize(pagination) {
    this.pagination = pagination;
    this.getptMappings();
  }
  scrollReset() {
    this.pagination = this.pagination.reset();
  }

   getMoreData() {
    this._utilService.getScrollHeight(true);
    if(this.ptMappings !== undefined){
      this.moreData = this._infiniteScrollCheckService.getMoreScrollData(!this.loading,this.ptMappings.length,this.pagination,this.totalPageSize,this.totalPages);
       if (this.moreData !== undefined) {
         this.infiniteScrollCheck = this.moreData.infiniteScrollCheck;
         this.moreDataCalled = this.moreData.moreDataCalled;
         this.getptMappings();
      }
    }
  }

  getLessData() {
     if(this.ptMappings !== undefined){
    this.lessData = this._infiniteScrollCheckService.getLessScrollData(!this.loading, this.ptMappings.length,this.pagination,this.moreDataCalled);
     if (this.lessData !== null) {
         this.infiniteScrollCheck = this.lessData.infiniteScrollCheck;
         this.moreDataCalled = this.lessData.moreDataCalled;
         this.getptMappings();
     }
    }
  }

  ngOnInit() {
    this.showErrorMessage = false;
    this.getGridConfigData();
    this.reset();
    this._utilService.callFilterData.subscribe(value => {
      if (value === 'addRateTable') {
        this.prepareFilterQuery();
      }
    });
  }

  getGridConfigData() {
    this._utilityService.getextdata({
      data: 'addRateTableColumnDef.json',
      success: (result) => {
        this.ratelistAddptMappingsColDef = result;
        this.ptMappingsCols = this.ratelistAddptMappingsColDef.cols;
        this.convertDefaultSortOrder();
        const defaultSortColumn = this.ratelistAddptMappingsColDef.defaultSortColumn;
        const dLangProperty = this._utilityService.dLangPropertyNames(defaultSortColumn);
        if (dLangProperty) {
          this.sortQuery[dLangProperty] = this.ratelistAddptMappingsColDef.defaultSortOrder;
        }
        else if (defaultSortColumn !== undefined && defaultSortColumn !== null) {
          this.sortQuery[defaultSortColumn] = this.ratelistAddptMappingsColDef.defaultSortOrder;
        }
        this.loadGridData = true;
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this.showErrorMessage = true;
        this.loadError = false;
       this.filterErrorMessage = true;
       this.loadGridData = false;
       this.loading = false;
       this.errorMessageDisplay = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
      }
    });
  }

  reset() {
    this.widgetDialog = 1;
    this.filterFields = {};
    this.sortQuery = {};
    this.filterQuery = {};
    this.lazyLoad = false;
    this.confirmDialog = 0;
    this.ptMappings = [];
    this.totalCount = 0;
    this.totalPageSize = 0;
    this.isFilterCriterialProcessing = false;
    this.selectedUsageType = null;
    this.selectedPt = {};
    this.addRateTableError = undefined;
    this.addingRateTable = false;
    this.rateTableAdded = false;
    this.pagination = {};
  }

  convertDefaultSortOrder() {
    this.convertedDefaultSortOrder = (this.ratelistAddptMappingsColDef.defaultSortOrder === 'asc') ? 1 : -1;
  }

  setUsageTypes() {
    this.usageTypes = [
      { label: 'TEXT_SELECT_CRITERIA', value: 'Select' },
      { label: '', value: '' },
      { label: 'Unit Dependent Recurring', value: 'UNIT_DEPENDENT_RECURRING' },
      { label: 'Usage Charges', value: 'USAGE' },
      { label: 'Discount', value: 'DISCOUNT' },
      { label: 'One Time Charges', value: 'NON_RECURRING' },
      { label: 'Recurring Charges', value: 'RECURRING' }
    ];
    this.usageDefault = this.usageTypes[0].value;
  }

  public getptMappings() {
    this.loading = true;
    const criteria = {
      pricelistId: this.pricelistId,
      param: {
        page: this.pagination.page,
        size: this.pagination.scrollPageSize
      }
    };
    if (this.templateId !== undefined) {
      criteria.param['templateId'] = this.templateId;
    }
    if (Object.keys(this.sortQuery).length > 0) {
      criteria.param['sort'] = this.sortQuery;
    }
    if (Object.keys(this.filterQuery).length > 0) {
      criteria.param['query'] = this.filterQuery;
    }
    this._sharedPricelistService.getptMappings({
      data: criteria,
      success: (result) => {
      result.filter ? this.filterKeys = result.filter : this.filterKeys = undefined;
      if (this.filterKeys !== undefined) {
          this.isFilterCallTrue = this._utilityService.getLatestServiceData(this.filterKeys, this.filteredField, this.filteredValue);
      }
      if(!this.isFilterCallTrue) {
        this.processRequest(result);
      }
        this.totalCount = result.totalCount;
        this.totalPageSize = result.totalPageSize;
        this.totalPages = result.totalPages;
        this._infiniteScrollCheckService.totalPages = this.totalPages;
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this.ptMappings = [];
        this.ptMappingsError = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
      },
      onComplete: () => {
        this.loading = false;
        this.initCall = false;
      }
    });
  }

  processRequest(result) {
    if (this.isFilterData) {
      if (this.pagination.page === 1) {
        this.ptMappings = [];
        this.ptMappings = result.records;
       }
       this.refreshGrid(result.records);
    } else {
      this.refreshGrid(result.records);
    }
  }

  clearFilters(column) {
    this.filterFields[column] = '';
    this.isFilterData = false;
    this.prepareFilterQuery();
  }

  private prepareFilterQuery() {
    this._utilityService.resetPagination(this.pagination);
    this.filterQuery = {};
    this.isFilterData = true;
    this.pagination.page = 1;
    this.pagination.centerPageIndex = null;
    this.pagination.lastPageIndex = null;
    for (const key in this.filterFields) {
      const dLangProperty = this._utilityService.dLangPropertyNames(key);
      if (dLangProperty) {
        if (!this._utilityService.isEmpty(this.filterFields[key])) {
          this.filterQuery[dLangProperty] = this.filterFields[key].trim();
        }
      } else {
        if (!this._utilityService.isEmpty(this.filterFields[key])) {
         this.filterQuery[key] = `'%${this.filterFields[key].trim()}%'|like`;
        }
      }
    }
    if (!this._utilityService.isEmpty(this.selectedUsageType)) {
      this.filterQuery['kind'] = this.selectedUsageType;
    }
    this.getptMappings();
    this.scrollReset();
  }

  filterDataKeys(event, field, value) {
    this.filteredField = field;
    this.filteredValue = value;
    this._utilityService.enableFilter(event, 'addRateTable');
  }

  public getptmappingsFilterData() {
    if (this.isFilterCriterialProcessing === false) {
      this.isFilterCriterialProcessing = true;
      setTimeout(() => {
        this.isFilterCriterialProcessing = false;
        this.prepareFilterQuery();
      }, 700);
    }
  }

  kindConfig(field) {
    const fields = {
      piKind: 'kind',
    };
    return fields[field] ? fields[field] : field;
  }

  public loadData(event) {
    if (!this.initCall) {
      this.sortQuery = {};
      this._utilityService.resetPagination(this.pagination);
      if (event.sortField !== undefined && event.sortField !== null) {
        this.getColumnSortOrder = (event.sortOrder === 1) ? 'asc' : 'desc';
        const dLangProperty = this._utilityService.dLangPropertyNames(event.sortField);
        if (dLangProperty !== null) {
            this.sortQuery[dLangProperty ? dLangProperty : event.sortField] = this.getColumnSortOrder;
         } else {
            this.sortQuery[this.kindConfig(event.sortField)] = this.getColumnSortOrder;
         }
      }
      this.getptMappings();
      this.scrollReset();
    }
  }

  isFilterText(column) {
    return this.filterFields[column] && this.filterFields[column].length > 0 ? true : false;
  }

  getErrorMessageType() {
    const filterCriteriaLength = !this._utilityService.isObject(this.filterQuery) ? 0 : Object.keys(this.filterQuery).length;
    if (this.loading) {
      return 0;
    }
    if (this.ptMappingsError) {
      return 1;
    } else if (this.ptMappings.length === 0 && filterCriteriaLength === 0) {
      if(this.ptMappingsError == ''){
        return 2;
      }
    } else if (this.ptMappings.length === 0 && filterCriteriaLength > 0) {
      if(this.ptMappingsError == ''){
        return 3;
      }
    }
    return 0;
  }

  addPt(record, event) {
    const paramTable = record.templateId + '-' + record.ptId;
    this.paramTableNo = paramTable;
    if (event.target.checked) {
      this.selectedPt[paramTable] = {
        'templateId': record.templateId,
        'ptId': record.ptId,
        'pricelistId': this.pricelistId,
        'templateParentId': record.templateParentId,
        'refId': (Math.floor((Math.random() * 1000000) + 1)) + record.ptId + record.templateId
      };
    } else if (this._utilityService.isObject(this.selectedPt[paramTable])) {
      delete this.selectedPt[paramTable];
    }
  }

  public refreshGrid(records) {
    const rateRecords = [];
    this.ptMappings = this._infiniteScrollCheckService.infiniteScrollData(records, this.infiniteScrollCheck, this.pagination,this.totalPageSize);
    for (const index in this.selectedPt) {
      if (this.selectedPt[index] !== undefined) {
        rateRecords.push(this.selectedPt[index]);
      }
    }
    if (Object.keys(this.selectedPt).length > 0) {
      this.ptMappings.forEach(addRateList => {
        rateRecords.forEach(rateList => {
          if (addRateList.templateId === rateList.templateId) {
            addRateList['checkboxFlag'] = true;
          }
        });
      });
    }
  }

  addRateTables() {
    this.showErrorMessage = false;
    if(!this.isAddDisable()){
    this.addRateTableError = undefined;
    const records = [];
    const selectedPtTables = this.selectedPt;
    this.selectedPt = [];
    for (const index in selectedPtTables) {
      if (selectedPtTables[index] !== undefined) {
        records.push(selectedPtTables[index]);
      }
    }
    this.addingRateTable = true;
    this._sharedPricelistService.addRateTables({
      data: {
        body: records
      },
      success: (result) => {
        this.selectedPt = selectedPtTables;
        this.showErrorIfExist(result);
        const data = result[result.length-1].data;
        this._utilService.checkIfDataUpdateMethod(data);
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this.showErrorMessage = true;
        this.loadError = true;
        this.errorMessageDisplay = this._utilityService.errorCheck(code, errorMsg, 'ADD');
        this.selectedPt = selectedPtTables;
      },
      onComplete: () => {
        this.addingRateTable = false;
      }
    });
  }
  }

  getDeviceWidth() {
    return window.innerWidth + 'px';
  }

  showErrorIfExist(result) {
    let isError = false;
    for (const index in result) {
      if (result[index].code !== 200) {
        isError = true;
        this.showErrorMessage = true;
        this.errorMessageDisplay = this._utilityService.errorCheck(result[index].code, result[index].data, 'ADD');
      }
    }
    if (isError) {
      this.getptMappings();
      this.addRateTableError = 'Error while adding parameter tables';
    } else {
      this.rateTableAdded = true;
      this.selectedPt = {};
      this.onAddRateTableClose();
    }
  }

  isAddDisable() {
    return Object.keys(this.selectedPt).length === 0;
  }

  onAddRateTableClose() {
    this.closeDialog();
    this._utilService.checkCallFilterData('');
  }

  closeDialog() {
    this.widgetDialog = 0;
    setTimeout(() => {
      this.onClose.emit(this.rateTableAdded);
    }, 100);
  }

  onConfirmDialogClose(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this.closeDialog();
    }
  }

  ngOnDestroy() {
    this._infiniteScrollCheckService.totalPages = 0;
  }

  changeUsageType(selectedPI) {
    this.selectedUsageType = selectedPI;
    this.prepareFilterQuery();
  }
}
