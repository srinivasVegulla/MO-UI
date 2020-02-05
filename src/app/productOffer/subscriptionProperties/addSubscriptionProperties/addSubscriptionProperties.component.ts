import { Component, OnInit, Input, OnDestroy, HostListener } from '@angular/core';
import { AddSubscriptionPropertiesService } from './addSubscriptionProperties.services';
import { utilService } from '../../../helpers/util.service';
import { Language, TranslationService } from 'angular-l10n';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionPropertyDetailsService } from '../../../subscriptionPropertyDetails/subscriptionPropertyDetails.service';
import { UtilityService } from '../../../helpers/utility.service';
import { InfiniteScrollCheckService } from '../../../helpers/InfiniteScrollCheck.service';

@Component({
  selector: 'ecb-addsubscription-properties',
  templateUrl: './addSubscriptionProperties.component.html',
  styleUrls: ['./addSubscriptionProperties.component.scss'],
  providers: [AddSubscriptionPropertiesService]
})
export class AddSubscriptionPropertiesComponent implements OnInit, OnDestroy {
  public visible = false;
  isSubSelected: boolean;
  @Language() lang: string;
  subscriptionContainer: any = [];
  subscriptionIndex: number;
  @Input() productOfferId: number;
  addSubscriptionColumnDef;
  cols: any[];
  lazyLoad: boolean = false;
  filterSubscriptionFields: any;
  sortQuery: any;
  tableQuery: any;
  loading: boolean;
  errorMessage: any;
  subscriptionList: any = [];
  addedSubscriptions: any = [];
  filterSubscriptionDataProcessing: boolean = false;
  noFilteredTableData: boolean = false;
  getColumnSortOrder: any;
  noTableData: boolean = false;
  filterErrorMessage: any;
  errorTemplateIds: any = [];
  addingFailedSubContainer: any = [];
  addSubscriptionPropertiesSubscriptions: any;
  subscriptionTypesList: any;
  subscriptionTypes: any;
  editingForSubscriptionList: any;
  editingTypes: any;
  visibleTypesList: any;
  visibilityTypes: any;
  selectedType: any;
  editingType: any;
  editTypeOptionValues: any;
  visibleType: any;
  convertedDefaultSortOrder;
  subscriptionDefault: string;
  editSubscriptionDefault: string;
  visibleTypeDefault: string;
  totalCount: number;
  pagination: any;
  totalPageSize: number;
  loadGridData = false;
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
  showErrorMessage: boolean;
  errorMessageDisplay: any;
  loadError = false;

  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === 27 && this._utilityService.isObject(document.getElementsByTagName('ecb-addsubscription-properties')[0])) {
      this.hide();
    }
  }
  constructor(private _addSubscriptionPropertiesService: AddSubscriptionPropertiesService,
    private _utilService: utilService,
    private _route: ActivatedRoute,
    private _subscriptionPropertyDetailsService: SubscriptionPropertyDetailsService,
    private readonly _utilityService: UtilityService,
    private _translationService: TranslationService,
    private _infiniteScrollCheckService: InfiniteScrollCheckService) {
  }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
    this.subscriptionContainer.length = 0;
    this._utilService.changeAddSubscriptionItemToPO(false);
    this._utilService.checkCallFilterData('');
  }

  ngOnInit() {
    this.getGridConfigData();
    this.showErrorMessage = false;
    this.totalCount = 0;
    this.filterSubscriptionFields = {};
    this.sortQuery = {};
    this.tableQuery = {};
    this.filterSubscriptionFields = {};
    this.loading = true;
    this.getAllSubscriptionPropertyTypes();
    this.addSubscriptionPropertiesSubscriptions = this._utilService.addSubscriptionItemToPO.subscribe(value => {
      if (value) {
        //set sortQuery to asc
        this.tableQuery = {};
        this.visibleType = 'TEXT_ENTER_FILTER_CRITERIA';
        this.editingType = 'TEXT_ENTER_FILTER_CRITERIA';
        this.selectedType = 'TEXT_ENTER_FILTER_CRITERIA';
        this.filterSubscriptionFields = {};
        this.show();
      }
    });
    const removeHeight = this._utilService.removeScrollHeight.subscribe(value => {
      if (value !== 0) {
        this.removeScrollHeight = value;
      }
    });
    this.addSubscriptionPropertiesSubscriptions.add(removeHeight);
    const filterData = this._utilService.callFilterData.subscribe(value => {
      if (value === 'addSubscriptionProperties') {
        this.filterData();
      }
    });
    this.addSubscriptionPropertiesSubscriptions.add(filterData);
  }

  calculateGridScrollHeight() {
    return {overflow: 'auto', height: 'calc(100vh - ' + `${this.removeScrollHeight}` +'px)'}
  }

  getGridConfigData() {
    this._utilityService.getextdata({
      data: 'addSubscriptionColumnDef.json',
      success: (result) => {
        this.addSubscriptionColumnDef = result;
        this.cols = this.addSubscriptionColumnDef.cols;
        this.editTypeOptionValues = this.addSubscriptionColumnDef.editTypeOptionValues;
        this.visibilityTypes = this.addSubscriptionColumnDef.visibilityTypes;
        this.getEditingForSubscription();
        this.getVisiblitiyForSubscription();
        this.sortQuery[this.addSubscriptionColumnDef.defaultSortColumn] = this.addSubscriptionColumnDef.defaultSortOrder;
        this.convertDefaultSortOrder();
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
      }
    });
  }

  convertDefaultSortOrder() {
    this.convertedDefaultSortOrder = (this.addSubscriptionColumnDef.defaultSortOrder === 'asc') ? 1 : -1;
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

  getAllSubscriptionItems() {
    this.errorMessage = '';
    this.noFilteredTableData = false;
    this.loading = true;
    var widgetData = {
      offerId: this.productOfferId,
      param: {
        page: this.pagination.page,
        size: this.pagination.scrollPageSize
      }
    };
    if (Object.keys(this.sortQuery).length > 0)
      widgetData.param["sort"] = this.sortQuery;
    if (Object.keys(this.tableQuery).length > 0)
      widgetData.param["query"] = this.tableQuery;
    this._addSubscriptionPropertiesService.getSubscriptionsList({
      data: widgetData,
      success: (result) => {
        this.loading = false;
        result.filter ? this.filterKeys = result.filter : this.filterKeys = undefined;
        if (this.filterKeys !== undefined) {
            this.isFilterCallTrue = this._utilityService.getLatestServiceData(this.filterKeys, this.filteredField, this.filteredValue);
        }
        if (!this.isFilterCallTrue) {
          this.processRequest(result);
        }
        this.totalCount = result.totalCount;
        this.totalPageSize = result.totalPageSize;
        this.totalPages = result.totalPages;
        this._infiniteScrollCheckService.totalPages = this.totalPages;
        //added for filter error msg and no table data
        if (this.subscriptionList !== null && this.subscriptionList !== undefined) {
          if (Object.keys(this.tableQuery).length > 0) {
            this.noFilteredTableData = this.subscriptionList.length > 0 ? false : true;
          } else {
            this.noTableData = this.subscriptionList.length > 0 ? false : true;
          }
        }
        else {
          if (Object.keys(this.tableQuery).length > 0) {
            this.noFilteredTableData = true;
          } else {
            this.noTableData = true;
          }
        }
        //added for filter error msg and no table data

        if (this.filterErrorMessage) {
          this.filterErrorMessage = "";
        }
      },
      failure: (errorMsg: string, code: any) => {
          this.showErrorMessage = false;
          this.loadError = false;
          this.subscriptionList = [];
          this.errorMessage =  this._utilityService.errorCheck(code, errorMsg, 'LOAD');
          this.loading = false;
      }
    });
  }

  processRequest(result) {
    if (this.isFilterData) {
      if (this.pagination.page === 1) {
        this.subscriptionList = [];
        this.subscriptionList = result.records;
     }
     this.refreshGrid(result.records);
    } else {
      this.refreshGrid(result.records);
    }
  }

  public refreshGrid(records) {
    this.subscriptionList = this._infiniteScrollCheckService.infiniteScrollData(records, this.infiniteScrollCheck, this.pagination,this.totalPageSize);
    if (this.subscriptionContainer.length > 0) {
      this.subscriptionList.filter(addSubscriptionList => {
        this.subscriptionContainer.filter(subscriptionList => {
          if (addSubscriptionList.specId === subscriptionList) {
            addSubscriptionList['checkboxFlag'] = true;
          }
        });
      });
    }
  }

  selectSubscription(specId, event) {
    this.isSubSelected = event.target.checked;
    if (this.isSubSelected) {
      this.subscriptionContainer.push(specId);
    } else if (!this.isSubSelected && this.subscriptionContainer.length > 0) {
      this.subscriptionIndex = this.subscriptionContainer.indexOf(specId);
      this.subscriptionContainer.splice(this.subscriptionIndex, 1);
    }
  }

  scrollInitialize(pagination) {
    this.pagination = pagination;
    this.getAllSubscriptionItems();
  }
  scrollReset() {
    this.pagination = this.pagination.reset();
  }

   getMoreData() {
    this._utilService.getScrollHeight(true);
    if(this.subscriptionList !== undefined){
      this.moreData = this._infiniteScrollCheckService.getMoreScrollData(!this.loading,this.subscriptionList.length,this.pagination,this.totalPageSize,this.totalPages);
       if (this.moreData !== undefined) {
         this.infiniteScrollCheck = this.moreData.infiniteScrollCheck;
         this.moreDataCalled = this.moreData.moreDataCalled;
         this.getAllSubscriptionItems();
      }
    }
  }

  getLessData() {
     if(this.subscriptionList !== undefined){
    this.lessData = this._infiniteScrollCheckService.getLessScrollData(!this.loading,this.subscriptionList.length,this.pagination,this.moreDataCalled);
     if (this.lessData !== null) {
         this.infiniteScrollCheck = this.lessData.infiniteScrollCheck;
         this.moreDataCalled = this.lessData.moreDataCalled;
         this.getAllSubscriptionItems();
     }
    }
  }

  addSubscription() {
    this.showErrorMessage = false;
    if(!this.checkAnySubscriptionSelected()){
    this._addSubscriptionPropertiesService.addSubscriptionItems({
      data: {
        offerId: this.productOfferId,
        body: this.subscriptionContainer
      },
      success: (result) => {
        this.processSubscriptionResponse(result);
        this._utilService.changeCallSubscriptionListAfterAddingNew(true);
        this._utilService.changeAddSubscriptionItemToPO(false);
        this.subscriptionContainer = [];
      },
      failure: (errorMsg: string, code: any) => {
        this.showErrorMessage = true;
        this.loadError = false;
        this.errorMessageDisplay = this._utilityService.errorCheck(code, errorMsg, 'ADD');
      },
      onComplete: () => {
        this._utilService.changeCallSubscriptionListAfterAddingNew(false);
      }
    });
  }
  }

  processSubscriptionResponse(addSubscriptionItems) {
    this.addedSubscriptions = addSubscriptionItems;
    this.subscriptionContainer = [];
    this.errorTemplateIds = [];
    this.addingFailedSubContainer = [];
    for (let i in this.addedSubscriptions) {
      if (this.addedSubscriptions[i] != null && this.addedSubscriptions[i]['code'] == 500) {
        for (let j in this.subscriptionList) {
          if (this.addedSubscriptions[i]['data'] == this.subscriptionList[j].specId) {
            if (this.errorTemplateIds.indexOf(this.subscriptionList[j].specId) == -1) {
              this.errorTemplateIds.push(this.subscriptionList[j].specId);
              this.addingFailedSubContainer.push(this.subscriptionList[j].name);
            }
          }
        }
      }
    }
  }

  checkAnySubscriptionSelected() {
    return this.subscriptionContainer.length > 0 ? false : true;
  }

  clearFilters(column) {
    this.filterSubscriptionFields[column] = "";
    this.isFilterData = false;
    this.filterData();
  }

  loadData(event: any) {
    if (this.lazyLoad) {
      this.sortQuery = {};
      this._utilityService.resetPagination(this.pagination);
      this.getColumnSortOrder = (event.sortOrder == 1) ? "asc" : "desc";
      const dLangProperty = this._utilityService.dLangPropertyNames(event.sortField);
      if (dLangProperty !== null) {
        this.sortQuery[dLangProperty ? dLangProperty : event.sortField] = this.getColumnSortOrder;
      } else if (event.sortField === 'name'){
        this.sortQuery['nameId'] = this.getColumnSortOrder;
      } else {
        this.sortQuery[event.sortField] = this.getColumnSortOrder;
      }
      this.scrollReset();
      this.getAllSubscriptionItems();
    }
    this.lazyLoad = true;
  }

  filterData() {
    this._utilityService.resetPagination(this.pagination);
    this.tableQuery = {};
    this.isFilterData = true;
    for (var key in this.filterSubscriptionFields) {
      const dLangProperty = this._utilityService.dLangPropertyNames(key);
      if (dLangProperty) {
        if (this.filterSubscriptionFields[key].trim() != '') {
          this.tableQuery[dLangProperty] = this.filterSubscriptionFields[key].trim();
        }
      } else if (key === 'name') {
        if (this.filterSubscriptionFields[key].trim() != '') {
          this.tableQuery['nameId'] = this.filterSubscriptionFields[key].trim();
        }
      } else {
        this.tableQuery[key] = '%' + this.filterSubscriptionFields[key].trim() + '%' + '|like';
      }
      
    }
    if (this.selectedType !== '' && this.selectedType !== null && this.selectedType !== 'Enter filter critira' && this.selectedType !== 'TEXT_ENTER_FILTER_CRITERIA') {
      this.tableQuery['specType'] = this.selectedType;
    }
    if (this.selectedType === 'Enter filter critira' || this.selectedType === '') {
      this.selectedType = 'TEXT_ENTER_FILTER_CRITERIA';
    }
    if (this.editingType !== null && this.editingType !== 'Enter filter critira' && this.editingType !== 'TEXT_ENTER_FILTER_CRITERIA') {
      const parameters = this.editTypeOptionValues[this.editingType];
      for (const key in parameters) {
        if (parameters.hasOwnProperty(key)) {
          this.tableQuery[key] = parameters[key];
        }
      }
    }
    if (this.editingType === 'Enter filter critira' || this.editingType === '') {
      this.editingType = 'TEXT_ENTER_FILTER_CRITERIA';
    }
    if (this.visibleType !== null && this.visibleType !== 'Enter filter critira' && this.visibleType !== 'TEXT_ENTER_FILTER_CRITERIA') {
      const visibleParameters = this.visibilityTypes[this.visibleType];
      for (const key in visibleParameters) {
        if (visibleParameters.hasOwnProperty(key)) {
          this.tableQuery[key] = visibleParameters[key];
        }
      }
    }
    if (this.visibleType === 'Enter filter critira' || this.visibleType === '') {
      this.visibleType = 'TEXT_ENTER_FILTER_CRITERIA';
    }
    this.getAllSubscriptionItems();
  }

  filterDataKeys(event, field, value) {
    this.filteredField = field;
    this.filteredValue = value;
    this._utilityService.enableFilter(event, 'addSubscriptionProperties');
  }

  filterDataDelay() {
    if (this.filterSubscriptionDataProcessing == false) {
      this.filterSubscriptionDataProcessing = true;
      setTimeout(() => {
        this.filterSubscriptionDataProcessing = false;
        this.filterData();
      }, 300);
    }
  }

  isFilterText(column) {
    return this.filterSubscriptionFields[column] && this.filterSubscriptionFields[column].length > 0 ? true : false;
  }

  ngOnDestroy() {
    this._infiniteScrollCheckService.totalPages = 0;
    if (this.addSubscriptionPropertiesSubscriptions) {
      this.addSubscriptionPropertiesSubscriptions.unsubscribe();
    }
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
    if (this.loading) {
      return 0;
    }
    if (this.errorMessage) {
      return 1;
    } else if (this.subscriptionList.length === 0 && filterCriteriaLength === 0) {
      if(this.errorMessage === ''){
      return 2;
      }
    } else if (this.subscriptionList.length === 0 && filterCriteriaLength > 0) {
      if(this.errorMessage === ''){
        return 3;
      }
    }
    return 0;
  }
}