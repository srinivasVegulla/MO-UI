import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { SubscriptionPropertyDetailsService } from './subscriptionPropertyDetails.service';
import { CanDeactivate, Router, NavigationStart } from '@angular/router';
import { utilService } from '../helpers/util.service';
import { DropdownModule, SelectItem, AutoComplete } from 'primeng/primeng';
import { Language, DefaultLocale, Currency, LocaleService, TranslationService } from 'angular-l10n';
import { ErrorTooltipComponent } from '../errortooltip/errorTooltip.component';
import { contextBarHandlerService } from '../helpers/contextbarHandler.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { UtilityService } from '../helpers/utility.service';
import { CapabilityService } from '../helpers/capabilities.service';
import { InfiniteScrollCheckService } from '../helpers/InfiniteScrollCheck.service';


@Component({
  selector: 'ecb-subscription-property-details',
  templateUrl: './subscriptionPropertyDetails.component.html',
  host: {
    '(document:click)': 'onClick($event)',
  }
})
export class SubscriptionPropertyDetailsComponent implements OnInit, OnDestroy {
  _subscriptionList: any[] = [];
  cols: any[];
  tableConfig: any;
  createProperty: boolean;
  subscriptionPropertiesInput: any;
  errorMessage: string;
  noTableData = false;
  noFilteredTableData = false;
  filterElements: any;
  tableHeaders: any;
  @Language() lang: string;
  tableQuery: any;
  @ViewChild(AutoComplete) private autoComplete: AutoComplete;
  filterFields: any;
  filterDataProcessing = false;
  filterErrorMessage: any;
  currentLocale;
  @DefaultLocale() defaultLocale: string;
  getDefaultColumnName;
  getDefaultColumnOrder;
  sortQuery: any;
  defaultSort = true;
  lazyLoad = false;
  getColumnSortOrder;
  columnDef;
  confirmDialog: number = 0;
  convertedDefaultSortOrder;
  subscriptionDetailsLength: number;
  subscriptionTypes: any[];
  subscriptionTypesList: any[];
  editingForSubscriptionList: any[];
  editingTypes: any[];
  selectedType: any;
  editingType: any;
  editTypeOptionValues: any;
  visibleType: any;
  visibilityTypes: any;
  visibleTypesList: any[];
  deletingSubscriptionDetails: any;
  showInUseOfferings = false;
  tooltipIndex: number;
  errorTooltip = false;
  deleteSubscriptionIndex: number;
  deleteErrorMessage: string;
  loadCreateSubProperty: boolean;
  specId: number;
  showCover: boolean;
  subscriptionPropertyFormDirty: boolean;
  nextStateUrl: string;
  isFAPlusClicked: boolean;
  categoryName: string;
  selectedCategory: string;
  subscriptionPropertyDetails: any;
  showLocalizationPanel: boolean = false;
  subscriptionPropertiesObservables : any;
  propertyIndex: number;
  isGridRefreshed: boolean;
  subscriptionDefault: string;
  editSubscriptionDefault: string;
  visibleTypeDefault: string;
  selectedFilterData: any;
  selectedEntityCount: any;
  subscriptionPropertyCapabilities = {};
  editSubscriptionPropertyCapability = true;
  deleteSubscriptionPropertyCapability = true;
  createSubscriptionPropertyCapability = true;
  loadGridData = false;
  localeErrorMessage: string = '';
  pagination: any;
  subscriptionListFetching: boolean;
  totalPageSize: number;
  infiniteScrollCheck: string = '';
  moreDataCalled: boolean;
  inUseOfferingsData;
  inUseOfferingsLocation;
  moreData;
  lessData;
  totalPages;
  isDeleteOrHide = false;
  showSubPropSkeleton = false;
  refreshDataCheck = false;
  isFilterData: boolean;
  removeScrollHeight: any;
  loadingDots: any;
  filteredField: any;
  filteredValue: any;
  isFilterCallTrue: boolean;
  filterKeys: any;
  contextbarHeight = 50;

  @ViewChild('createSubscriptionProperties') createSubscriptionProperties: any;

  @ViewChild('subscriptionHeaderCount') subHeaderCount: any;

  constructor(private _utilService: utilService,
    private _subscriptionPropertyDetailsService: SubscriptionPropertyDetailsService,
    private _router: Router,
    private _contextBarHandlerService: contextBarHandlerService,
    private _translationService: TranslationService,
    private readonly _utilityService: UtilityService,
    private _capabilityService: CapabilityService,
    private _infiniteScrollCheckService: InfiniteScrollCheckService) {
    this.confirmDialog = 0;
    this.isFAPlusClicked = false;
    this.isGridRefreshed = false;
    this.isFilterCallTrue = false;
  }

  ngOnInit() {
    this.getGridConfigData();
    this._contextBarHandlerService.changeContextBarVisibility(true);
    this._utilService.currentView('Subscription');
    const categoryName = this._translationService.translate('TEXT_CATEGORY');
    this.categoryName = `${categoryName} 1`;
    this._utilService.changedynamicSaveBtn('');
    this.specId = -1;
    this.createProperty = true;
    this.showCover = false;
    this._utilService.checkNgxSlideModal(false);
    this.subscriptionPropertyFormDirty = false;
    this.nextStateUrl = '/ProductCatalog';
    this._utilService.updateApplyBodyScroll(false);
    this._router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe(value => {
        this.nextStateUrl = value['url'];
      });
    this.subscriptionPropertiesObservables = this._utilService.isSubsciptionPropertiesChange.subscribe(value => {
      if (value) {
        this.getAllSubscription();
      }
    });
    const removeHeight = this._utilService.removeScrollHeight.subscribe(value => {
      if (value !== 0) {
        this.removeScrollHeight = value - this.contextbarHeight;
      }
    });
    this.subscriptionPropertiesObservables.add(removeHeight);
    const updateBodyScroll = this._utilService.gridScrollStatus.subscribe(value => {
      if(value){
        this._utilService.updateApplyBodyScroll(false);
      }
    });
    this.subscriptionPropertiesObservables.add(updateBodyScroll);
    const filterData = this._utilService.callFilterData.subscribe(value => {
      if (value === 'subscriptionPropertyDetails') {
        this.filterData();
      }
    });
    this.subscriptionPropertiesObservables.add(filterData);
  }

  scrollInitialize(pagination) {
    this.pagination = pagination;
    this.getAllSubscription();
  }

  scrollReset() {
    this.pagination = this.pagination.reset();
  }

  getMoreData() {
    this._utilService.getScrollHeight(true);
    if(this._subscriptionList !== undefined && !this.refreshDataCheck && !this.isDeleteOrHide){
      this.moreData = this._infiniteScrollCheckService.getMoreScrollData(!this.subscriptionListFetching,this._subscriptionList.length,this.pagination,this.totalPageSize,this.totalPages);
       if (this.moreData !== undefined) {
         this.infiniteScrollCheck = this.moreData.infiniteScrollCheck;
         this.moreDataCalled = this.moreData.moreDataCalled;
         this.getAllSubscription();
      }
    } else {
      this.refreshDataCheck = false;
    }
  }

  calculateGridScrollHeight() {
    const subHeaderHeight = this.subHeaderCount.nativeElement.offsetHeight ;
    if  (subHeaderHeight !== null && subHeaderHeight !== undefined) {
      if (this._utilityService.isTicketLogin()) {
        return { overflow: 'auto', height: 'calc(92vh - ' + `${this.removeScrollHeight + this.subHeaderCount.nativeElement.offsetHeight}` + 'px)' }
      } else {
        return { overflow: 'auto', height: 'calc(100vh - ' + `${this.removeScrollHeight + this.subHeaderCount.nativeElement.offsetHeight}` + 'px)' }
      }
    }
  }

  getLessData() {
     if(this._subscriptionList !== undefined && !this.isDeleteOrHide){
    this.lessData = this._infiniteScrollCheckService.getLessScrollData(!this.subscriptionListFetching,this._subscriptionList.length,this.pagination,this.moreDataCalled);
     if (this.lessData !== null) {
         this.infiniteScrollCheck = this.lessData.infiniteScrollCheck;
         this.moreDataCalled = this.lessData.moreDataCalled;
         this.getAllSubscription();
     }
    }
  }

  getGridConfigData() {
    this._utilityService.getextdata({
      data: 'subscriptionDetailsColumnDef.json',
      success: (result) => {
       this.columnDef = result;
       this.editTypeOptionValues = this.columnDef.editTypeOptionValues;
       this.visibilityTypes = this.columnDef.visibilityTypes;
       this.processCapability();
       this.cols = JSON.parse(JSON.stringify(this.columnDef)).cols;
       this.convertDefaultSortOrder();
       this.initializeFields();
       this.getVisiblitiyForSubscription();
       this.loadGridData = true;
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this.localeErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
        this.loadGridData = false;
        this.subscriptionListFetching = false;
      }
    });
  }
  processCapability() {
    this.subscriptionPropertyCapabilities = this._capabilityService.getWidgetCapabilities('UISubsProperties');
    this.createSubscriptionPropertyCapability = this._capabilityService.findPropertyCapability('UISubsProperties', 'SubsProperties_Add');
    this.editSubscriptionPropertyCapability = this._capabilityService.findPropertyCapability('UISubsProperties', 'SubsProperties_Edit');
    this.deleteSubscriptionPropertyCapability = this._capabilityService.findPropertyCapability('UISubsProperties', 'SubsProperties_Delete'); 
    const columnDefFile = JSON.parse(JSON.stringify(this.columnDef));
       if (!this.editSubscriptionPropertyCapability && !this.deleteSubscriptionPropertyCapability) {
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
      } else if (this.editSubscriptionPropertyCapability && !this.deleteSubscriptionPropertyCapability) {
        this.columnDef['cols'][0]['style'].width = '130px';
      } else if (!this.editSubscriptionPropertyCapability && this.deleteSubscriptionPropertyCapability) {
        this.columnDef['cols'][0]['style'].width = '80px';
      } else {
        this.columnDef = columnDefFile;
      }
  }

  fetchEntityCount(value) {
    this.selectedFilterData = value;
    if (this.selectedFilterData.selectedValue !== '' && this.selectedFilterData.selectedValue !== null) {
       this.filterFields['entityCount'] = [this.selectedFilterData.selectedValue, '0|!='];
       this.filterData();
      } else {
        this.clearFilters(this.selectedFilterData.selectedColumn);
     }
  }

  hidelocalizationWidget(value) {
    if (value) {
      this.showLocalizationPanel = false;
    }
  }
  loadSubpropertiesLocalization(row) {
    this._utilService.changeLocalizationFromContextbar(true);
    this.showLocalizationPanel = true;
    this._utilService.changeSubscriptionLocalization(row);
  }
  convertDefaultSortOrder() {
    this.convertedDefaultSortOrder = (this.columnDef.defaultSortOrder === 'asc') ? 1 : -1;
  }

  showCreateSubscriptionProperty(value, category) {
    if (value) {
      this.isFAPlusClicked = true;
    } else {
      this.isFAPlusClicked = false;
    }
    this.createProperty = true;
    this.createSubscriptionProperties.show();
    this.showCover = true;
    this._utilService.checkNgxSlideModal(true);
    this.loadSubscriptionPropertyConfig();
    this.loadingDots = true;
    this.selectedCategory = category;
  }

  clearFilters(column) {
    this.filterFields[column] = '';
    this.isFilterData = false;
    this.filterData();
  }

  fadeAsidePanel(value) {
    if (value) {
      this.createSubscriptionProperties.hide();
      this.showCover = false;
      this.loadCreateSubProperty = false;
      this._utilService.checkNgxSlideModal(false)
    }
  }

  isFilterText(column) {
    return this.filterFields[column] && this.filterFields[column].length > 0 ? true : false;
  }

  removeFilterFetchingError() {
    return this.filterErrorMessage = '';
  }

  getAllSubscriptionPropertyTypes() {
    this.subscriptionTypesList = [];
    this._subscriptionPropertyDetailsService.getSubscriptionPropertyTypes({
      success: (result) => {
        this.subscriptionTypes = result;
        this.subscriptionTypesList.push({ label: 'TEXT_SELECT_CRITERIA', value: 'Select' });
        this.subscriptionTypesList.push({ label: '', value: '' });
        Object.keys(this.subscriptionTypes).forEach(element => {
          const type = {
            label: this.subscriptionTypes[element],
            value: element
          }
          this.subscriptionTypesList.push(type);
          this.subscriptionDefault = this.subscriptionTypesList[0].value;
        });
      },
      failure: (error) => {
        this.errorMessage = error;
      }
    });
  }

  getEditingForSubscription() {
    this.editingForSubscriptionList = [];
    this._subscriptionPropertyDetailsService.getAllEditingForSubscriptions({
      success: (result) => {
        this.editingTypes = result;
        this.editingForSubscriptionList.push({ label: 'TEXT_SELECT_CRITERIA', value: 'Select' });
        this.editingForSubscriptionList.push({ label: '', value: '' });
        Object.keys(this.editingTypes).forEach(element => {
          const edit = {
            label: element,
            value: element
          };
          this.editingForSubscriptionList.push(edit);
          this.editSubscriptionDefault = this.editingForSubscriptionList[0].value;
        });
      },
      failure: (error) => {
        this.errorMessage = error;
      }
    });
  }

  getVisiblitiyForSubscription() {
    this.visibleTypesList = [];
    this.visibleTypesList.push({ label: 'TEXT_SELECT_CRITERIA', value: 'Select' });
    Object.keys(this.visibilityTypes).forEach(element => {
      const visible = {
        label: element,
        value: element
      };
      this.visibleTypesList.push(visible);
      this.visibleTypeDefault = this.visibleTypesList[0].value;
    });
  }

  getAllSubscription() {
    this.errorMessage = '';
    this.subscriptionListFetching = true;
    let timer;
    const widgetData = {
      param: {
        page: this.pagination.page,
        size: this.pagination.scrollPageSize
      }
    };
    if (Object.keys(this.sortQuery).length > 0) {
      widgetData.param['sort'] = this.sortQuery;
    }
    if (Object.keys(this.tableQuery).length > 0) {
      widgetData.param['query'] = this.tableQuery;
    }
    this._subscriptionPropertyDetailsService.getSubscriptionProperties({
      data: widgetData,
      success: (result) => {
      this.totalPageSize = result.totalPageSize;
      this.totalPages = result.totalPages;
      this._infiniteScrollCheckService.totalPages = this.totalPages;
      clearTimeout(timer);
      result.filter ? this.filterKeys = result.filter : this.filterKeys = undefined;
      if (this.filterKeys !== undefined) {
        this.isFilterCallTrue = this._utilityService.getLatestServiceData(this.filterKeys, this.filteredField, this.filteredValue);
      }
      if (!this.isFilterCallTrue) {
        this.processSubscriptionResult(result);
      }
        timer = setTimeout(() => {
          if (this.filterErrorMessage) {
            this.filterErrorMessage = '';
          }
        }, 100);
        this.subscriptionListFetching = false;
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this._subscriptionList = [];
        if (Object.keys(this.tableQuery).length > 0) {
          this.filterErrorMessage = error;
        }
        this.errorMessage = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
      },
      onComplete: () => {
        this.subscriptionListFetching = false;
        this.showSubPropSkeleton = false;
      }
    });
  }

  loadSubscriptionPropertyConfig() {
    this._subscriptionPropertyDetailsService.getSubscriptionPropertiesConfig({
      data: {
        body: this.specId
      },
      success: (result) => {
        this.subscriptionPropertiesInput = result;
        this.loadCreateSubProperty = true;
      },
      failure: (errorMsg: string, code: any, error: any) => { 
        this.createSubscriptionProperties.hide();
        this.showCover = false;
        this.filterErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
      },
      onComplete: () => {
        this.loadingDots = false;
      }
    });
  }

  processSubscriptionResult(subscriptions) {
    if (this.isFilterData) {
      if(this.pagination.page === 1) {
        this._subscriptionList = [];
        this._subscriptionList.length = 0;
        this._subscriptionList = subscriptions.records;
       }
       this.processGridData(subscriptions.records);
    } else {
      this.processGridData(subscriptions.records);
    }

    this.getAllSubscriptionPropertyTypes();
    this.getEditingForSubscription();
    this.getVisiblitiyForSubscription();
    this.subscriptionDetailsLength = subscriptions['totalCount'];
    if (this._subscriptionList !== null && this._subscriptionList !== undefined) {
      if (Object.keys(this.tableQuery).length > 0) {
        this.noFilteredTableData = this._subscriptionList.length > 0 ? false : true;
      } else {
        this.noTableData = this._subscriptionList.length > 0 ? false : true;
      }
    } else {
      if (Object.keys(this.tableQuery).length > 0) {
        this.noFilteredTableData = true;
      } else {
        this.noTableData = true;
      }
    }
    if (this.subscriptionDetailsLength === 0) {
      this.noFilteredTableData = true;
    } else {
      this.noFilteredTableData = false;
    }
    if (this._subscriptionList !== null && this._subscriptionList !== undefined) {
      if (this._subscriptionList.length === 0) {
        this.noTableData = true;
      } else {
        this.noFilteredTableData = false;
      }
    }
    if (this.isGridRefreshed && this.propertyIndex) {
      this._subscriptionList[this.propertyIndex].success = true;
    }
    this.subscriptionListFetching = false;
  }

  public processGridData(records) {
    if(this.isDeleteOrHide) {
      if (this.pagination.page > 1) {
        this._subscriptionList = this._infiniteScrollCheckService.callProductDelete(this._subscriptionList, this.tooltipIndex, this.pagination);
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
    if (this.pagination.page === 1) {
      this._subscriptionList = [];
    }
    this._subscriptionList = this._infiniteScrollCheckService.infiniteScrollData(records, this.infiniteScrollCheck, this.pagination,this.totalPageSize);
  }

  setSubPropertiesFormDirty(value) {
    if (value) {
      this.subscriptionPropertyFormDirty = true;
    } else {
      this.subscriptionPropertyFormDirty = false;
    }
  }

  dateFieldConfig(field) {
    const fields = {
      entityCount: 'entityCount',
      category: 'category',
      name: 'name'
    };
    return fields[field] ? fields[field] : null;
  }

  numberFieldConfig(field) {
    const fields = {
      entityCount: 'entityCount',
    };
    return fields[field] ? fields[field] : null;
  }

  
  loadData(event: any) {
    if (this.lazyLoad) {
      this.sortQuery = {};
      this._utilityService.resetPagination(this.pagination);
      this.getColumnSortOrder = (event.sortOrder === 1) ? 'asc' : 'desc';
      const configField = this.dateFieldConfig(event.sortField);
     const dLangProperty = this._utilityService.dLangPropertyNames(event.sortField);
     if (configField !== null) {
      this.sortQuery[configField ? configField : event.sortField] = this.getColumnSortOrder;
     } else if (dLangProperty !== null) {
        this.sortQuery[dLangProperty ? dLangProperty : event.sortField] = this.getColumnSortOrder;
      } else {
        this.sortQuery[event.sortField] = this.getColumnSortOrder;
      }
        this.getAllSubscription();
    }
    this.lazyLoad = true;
  }

  filterData() {
    this._utilityService.resetPagination(this.pagination);
    this.tableQuery = {};
    this.isFilterData = true;
    for (const key in this.filterFields) {
      if (this.filterFields[key] !== null && this.filterFields[key] !== '' && this.filterFields[key] !== undefined) {
        const dLangProperty = this._utilityService.dLangPropertyNames(key);
        if (this.numberFieldConfig(key)) {
          this.tableQuery[key] = this.filterFields[key];
        } else if (dLangProperty) {
          this.tableQuery[dLangProperty] = this.filterFields[key].trim();
        } else {
          this.tableQuery[key] = `'%${this.filterFields[key].trim()}%'|like`;
        }
      }
    }
    if (this.selectedType) {
      this.tableQuery['specType'] = this.selectedType;
    }
  
    if (this.editingType) {
      const parameters = this.editTypeOptionValues[this.editingType];
      for (const key in parameters) {
        if (parameters.hasOwnProperty(key)) {
          this.tableQuery[key] = parameters[key];
        }
      }
    }

    if (this.visibleType) {
      const visibleParameters = this.visibilityTypes[this.visibleType];
      for (const key in visibleParameters) {
        if (visibleParameters.hasOwnProperty(key)) {
          this.tableQuery[key] = visibleParameters[key];
        }
      }
    }
    this.getAllSubscription();
  }

  filterDataKeys(event, field, value) {
    this.filteredField = field;
    this.filteredValue = value;
    this._utilityService.enableFilter(event, 'subscriptionPropertyDetails');
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

  openInUseOfferings(data) {
    this.showInUseOfferings = true;
    this.inUseOfferingsData = data;
    this.inUseOfferingsLocation = 'subscriptionProperty';
  }

  displayInUseOfferingsDialog(data) {
    if (data) {
      this.openInUseOfferings(data);
    }
  }

  hideInUseModalDialog(e) {
    if (e) {
      this.showInUseOfferings = false;
    }
  }

  canDeactivate() {
    if (this.subscriptionPropertyFormDirty) {
      const data = {
        url: this.nextStateUrl
      };
      this._utilService.changePreventUnsaveChange(data);
      return false;
    } else {
      return true;
    }
  }

  openDeleteConfirmation(data, index) {
    if (data.entityCount === 0) {
    this.confirmDialog = 1;
    this.deletingSubscriptionDetails = data;
    this.deleteSubscriptionIndex = index;
    this.errorTooltip = false;
    }
  }

  onModalDialogCloseDelete(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this.deleteSubscriptionProperty(this.deletingSubscriptionDetails['specId'],this.deleteSubscriptionIndex);
    }
  }

  getPropertyIndex(value) {
    if (this._subscriptionList !== null && this._subscriptionList !== undefined) {
      for (let index = 0; index < this._subscriptionList.length; index++) {
        if (this._subscriptionList[index].specId === value) {
          this.propertyIndex = index;
        }
      }
    }
  }

  refreshPropertiesList(value) {
    if (!isNaN(value.id)) {
      if (value.isUpdated) {
        this.showSubPropSkeleton = value.isUpdated;
      }
      this.isGridRefreshed = true;
      this.getPropertyIndex(value);
    }
    this.subscriptionListFetching = true;
    this.getAllSubscription();
  }

  getSubscriptionPropertyDetails(id) {
    this._subscriptionPropertyDetailsService.getSubscriptionPropertiesConfig({
      data: {
        body: id
      },
      success: (result) => {
        this._subscriptionList.filter(value => { if (id === value.specId) { this.selectedEntityCount = value; }});
        this.subscriptionPropertyDetails = result;
        this.subscriptionPropertiesInput = result;
        this.createProperty = false;
        this.loadCreateSubProperty = true;
        this.createSubscriptionProperties.show();
        this.showCover = true;
        this._utilService.checkNgxSlideModal(true);
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this.filterErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
      }
    });
  }

  editSubscriptionProperty(id) {
    if (id !== null && id !== undefined) {
      this.getSubscriptionPropertyDetails(id);
    }
  }

  deleteSubscriptionProperty(subscriptionId,subscriptionIndex) {
    this.tooltipIndex = subscriptionIndex;
    this._utilService.getScrollHeight(true);
    this._subscriptionPropertyDetailsService.deleteSubscriptionProperty({
      data: subscriptionId,
      success: (result) => {
        this._subscriptionList.splice(this.tooltipIndex, 1);
        this.isDeleteOrHide = true;
        if (this.infiniteScrollCheck === 'Less') {
          this.pagination.page += 2;
          this.infiniteScrollCheck = 'More';
        }
        this.getAllSubscription();
      },
      failure: (errorMsg: string, code: any) => {
        let deleteSubError = this._utilityService.errorCheck(code, errorMsg, 'DELETE');
        this.handleErrorDelete(deleteSubError, this.deleteSubscriptionIndex);
      }
    });
  }

  getRowClass(data, index): String {
    if (data.error) {
      return data.error ? 'errorDeleteSchedule' : 'noErrorDeleteSchedule';
    } else if (data.success) {
      return data.success ? 'showSuccessHighlight' : 'noErrorDeleteSchedule';
    }
  }

  handleErrorDelete(error, index) {
    this._subscriptionList[index].error = true;
    this.tooltipIndex = index;
    this.errorTooltip = true;
    this.deleteErrorMessage = error;
  }

  clearHighlight() {
    Object.keys(this._subscriptionList).forEach(element => {
      if (this._subscriptionList[element].error !== undefined || this._subscriptionList[element].success !== undefined) {
        this._subscriptionList[element].error = false;
        this._subscriptionList[element].success = false;
      }
    });
  }

  onToolTipClose(value) {
    if (value) {
      this.clearHighlight();
    }
  }

  onClick(event) {
    if (this.errorTooltip || this.isGridRefreshed) {
      this.clearHighlight();
    }
  }

  refreshData() {
   this.loadGridData = false;
   this.lazyLoad = false;
   this.getGridConfigData();
    this.initializeFields();
    this._utilityService.resetPagination(this.pagination);
    this._utilService.changedRefreshNumberDateFilter(true);
    this._utilService.updateChangeScrollposition('refresh');
  }

  initializeFields() {
    this.filterFields = {};
    this.sortQuery = {};
    this.tableQuery = {};
    this.selectedType = '';
    this.editingType = '';
    this.visibleType = '';
    this.editSubscriptionDefault = '';
    this.visibleTypeDefault = '';
    this.subscriptionDefault = '';
    const configField = this.dateFieldConfig(this.columnDef.defaultSortColumn);
    if (configField) {
      this.sortQuery[configField] = this.columnDef.defaultSortOrder;
    } else {
      this.sortQuery[this.columnDef.defaultSortColumn] = this.columnDef.defaultSortOrder;
    }
     }

  ngOnDestroy() {
    if (this.subscriptionPropertiesObservables) {
      this.subscriptionPropertiesObservables.unsubscribe();
    }
    this._utilService.changeSubsciptionProperties(false);
    this._infiniteScrollCheckService.totalPages = 0;
    this._utilService.checkCallFilterData('');
  }
  changeSubScriptionType(selectedSubType) {
    this.selectedType = selectedSubType;
    this.filterData();
  }
  changeEditSubScriptionType(selectedEditSubType) {
    this.editingType = selectedEditSubType;
    this.filterData();
  }
  changeVisibleType(selectedVisibleType) {
    this.visibleType = selectedVisibleType;
    this.filterData();
  }
  
  getErrorMessageType() {
    const filterCriteriaLength = !this._utilityService.isObject(this.tableQuery) ? 0 : Object.keys(this.tableQuery).length;
    if (this.subscriptionListFetching) {
      return 0;
    }
    if (this.errorMessage) {
      return 1;
    } else if (this._subscriptionList != undefined && this._subscriptionList.length === 0 && filterCriteriaLength === 0) {
      if (this.errorMessage === '') {
         return 2;
        }
    } else if (this._subscriptionList != undefined && this._subscriptionList.length === 0 && filterCriteriaLength > 0) {
      if (this.errorMessage === '') {
        return 3;
      }
    }
    return 0;
  }
}
