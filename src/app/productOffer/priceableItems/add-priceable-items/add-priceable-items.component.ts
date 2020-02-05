import { Component, OnInit, Input, OnDestroy, HostListener } from '@angular/core';
import { utilService } from '../../../helpers/util.service';
import { AddPriceableItemService } from '../add-priceable-items/add-priceable-items.service';
import { Language, TranslationService } from 'angular-l10n';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownModule, SelectItem } from 'primeng/primeng';
import { UtilityService } from '../../../helpers/utility.service';
import { InfiniteScrollCheckService } from '../../../helpers/InfiniteScrollCheck.service';

@Component({
  selector : 'ecb-addpriceableitem',
  templateUrl: './add-priceable-items.component.html',
  styleUrls: ['./add-priceable-items.component.scss']
})

export class AddPriceableItemsComponent implements OnInit, OnDestroy {
 public visible = false;
 priceableItemsList: any[];
 piItem: number;
 piContainer: any[] = [];
 isPiSelected: boolean;
 piIndex: number;
 piCheckIndex: any;
 result: any;
 piToBeAdded: any = [];
 loading: boolean;
 errorMessage: string = '';
 exisitingPiList: any;
 matchingPi: any = [];
 @Language() lang: string;
 @Input() productOfferId:number;
 priceableItemUpdatedList:any;
 piTempaltes: number;
 infoMessage: boolean = false;
 addedPIList: any;
 errorTemplateIds = [];
 addingFailedPiContainer = [];
 addPiColumnDef;
 cols: any[];
 lazyLoad: boolean = false;
 filterPiFields: any;
 filterPiDataProcessing: boolean = false;
 priceableItemsListRecords: any;
 sortQuery: any;
 tableQuery: any;
 getColumnSortOrder: any;
 noTableData: boolean = false;
 noFilteredTableData: boolean = false;
 filterErrorMessage: any;
 selectedUsageType: string = "";
 usageTypes: SelectItem[];
 isDeletePIError: boolean = false;
 deletePIError: string = '';
 addPISubscriptions: any;
 pagination: any;
 totalPageSize: number;
 usageFirstName: string;
 totalCount: number;
 convertedDefaultSortOrder;
 loadGridData = false;
 infiniteScrollCheck = '';
 moreDataCalled: boolean;
 moreData;
 @Input() isBundle: boolean;
 lessData;
 totalPages: number;
 isFilterData: boolean;
 element: HTMLElement;
 removeScrollHeight: any;
 filteredField: any;
 filteredValue: any;
 isFilterCallTrue: boolean;
 filterKeys: any;
 selectedPiCount: number=0;
 showErrorMessage: boolean;
 errorMessageDisplay: any;
 loadError = false;

  constructor(private _utilService: utilService,
              private _addPriceableItemService: AddPriceableItemService,
              private _route: ActivatedRoute,
              private _utilityService: UtilityService,
              private _translationService: TranslationService,
              private _infiniteScrollCheckService: InfiniteScrollCheckService) {
    this.usageTypes  = [];
    this.usageTypes.push({label : 'TEXT_SELECT_CRITERIA', value: 'Select' });
    this.usageTypes.push({label : '', value: '' });
    this.usageTypes.push({label : "Unit Dependent Recurring", value: "UNIT_DEPENDENT_RECURRING" });
    this.usageTypes.push({label : "Usage Charges", value: "USAGE" });
    this.usageTypes.push({label : "Discount", value: "DISCOUNT" });
    this.usageTypes.push({label : "One Time Charges", value: "NON_RECURRING" });
    this.usageTypes.push({label : "Recurring Charges", value: "RECURRING" });
    this.usageFirstName = this.usageTypes[0].value;
  }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
    this.selectedUsageType = '';
    this.piContainer.length = 0;
    this._utilService.changeAddPriceableItemToPO(false);
    this._utilService.checkCallFilterData('');
  }

  ngOnInit() {
    this.getGridConfigData();
    this.showErrorMessage = false;
    this.visible = true;
    this.totalCount = 0;
    this.filterPiFields = {};
    this.sortQuery = {};
    this.tableQuery = {};
    this.priceableItemsList = [];
    //this.productOfferId = this._route.snapshot.params['productOfferId'];
    this.loading = true;
    this.addPISubscriptions = this._utilService.existingPiList.subscribe(value => {
         this.exisitingPiList  = value;
     });
    const removeHeight =  this._utilService.removeScrollHeight.subscribe(value => {
      if (value !== 0) {
        this.removeScrollHeight = value;
      }
    });
    this.addPISubscriptions.add(removeHeight);
    const filterData = this._utilService.callFilterData.subscribe(value => {
      if (value === 'addPriceableItems') {
        this.filterData();
      }
    });
    this.addPISubscriptions.add(filterData);
  }


  calculateGridScrollHeight() {
    return {overflow: 'auto', height: 'calc(100vh - ' + `${this.removeScrollHeight}` +'px)'}
  }

  getGridConfigData() {
    this._utilityService.getextdata({
      data: 'addPiColumnDef.json',
      success: (result) => {
        this.addPiColumnDef = result;
        this.cols = this.addPiColumnDef.cols;
        this.sortQuery[this.addPiColumnDef.defaultSortColumn] = this.addPiColumnDef.defaultSortOrder;
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

  getAllPriceableItems() {
    this.loading = true;
    this.errorMessage = '';
    this.showErrorMessage = false;
    this.isDeletePIError = false;
    const widgetData = {
      param : {
        page: this.pagination.page,
        size: this.pagination.scrollPageSize,
        isBundle: this.isBundle
      },
      offerId : this.productOfferId
    };
    if (Object.keys(this.sortQuery).length > 0) {
      widgetData.param['sort'] = this.sortQuery;
    }
    if (Object.keys(this.tableQuery).length > 0){
      widgetData.param['query'] = this.tableQuery;
    }

    this._addPriceableItemService.getPriceableItems({
      data : widgetData,
      success : (result) => {
        this.loading = false;
        result.filter ? this.filterKeys = result.filter : this.filterKeys = undefined;
        if (this.filterKeys !== undefined) {
            this.isFilterCallTrue = this._utilityService.getLatestServiceData(this.filterKeys, this.filteredField, this.filteredValue);
        }
        if (!this.isFilterCallTrue) {
          this.processRequest(result);
        }
        this.totalPageSize = result.totalPageSize;
        this.totalCount = result.totalCount;
        this.totalPages = result.totalPages;
        this._infiniteScrollCheckService.totalPages = this.totalPages;
      },
      failure: (errorMsg: string, code: any) => {
          this.priceableItemsList = [];
          this.showErrorMessage = false;
          this.loadError = false;
          this.errorMessage = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
          this.loading = false;
      }
    });
  }

  processRequest(result) {
    if (this.isFilterData) {
      if (this.pagination.page === 1) {
          this.priceableItemsList = [];
          this.priceableItemsList = result.records;
       }
       this.refreshGrid(result.records);
    } else {
      this.refreshGrid(result.records);
    }
  }

  getDeviceWidth() {
    return window.innerWidth + 'px';
  }

  convertDefaultSortOrder() {
    this.convertedDefaultSortOrder = (this.addPiColumnDef.defaultSortOrder === 'asc') ? 1 : -1;
  }

  scrollInitialize(pagination) {
    this.pagination = pagination;
    this.getAllPriceableItems();
  }
  scrollReset() {
    this.pagination = this.pagination.reset();
  }

  getMoreData() {
    this._utilService.getScrollHeight(true);
    if(this.priceableItemsList !== undefined) {
      this.moreData = this._infiniteScrollCheckService.getMoreScrollData(!this.loading,this.priceableItemsList.length,this.pagination,this.totalPageSize,this.totalPages);
       if (this.moreData !== undefined) {
         this.infiniteScrollCheck = this.moreData.infiniteScrollCheck;
         this.moreDataCalled = this.moreData.moreDataCalled;
         this.getAllPriceableItems();
      }
    }
  }

  getLessData() {
     if(this.priceableItemsList !== undefined){
    this.lessData = this._infiniteScrollCheckService.getLessScrollData(!this.loading,this.priceableItemsList.length,this.pagination,this.moreDataCalled);
     if (this.lessData !== null) {
         this.infiniteScrollCheck = this.lessData.infiniteScrollCheck;
         this.moreDataCalled = this.lessData.moreDataCalled;
         this.getAllPriceableItems();
     }
    }
  }

  public refreshGrid(records) {
    this.priceableItemsList = this._infiniteScrollCheckService.infiniteScrollData(records, this.infiniteScrollCheck, this.pagination,this.totalPageSize);
    if (this.piContainer.length > 0) {
      this.priceableItemsList.filter(addPiList => {
        this.piContainer.filter(piList => {
          if (addPiList.templateId === piList) {
            addPiList['checkboxFlag'] = true;
          }
        });
      });
    }

    this.processpriceableItemsList();

    //added for filter error msg and no table data
    if (this.priceableItemsList !== null && this.priceableItemsList !== undefined) {
      this.noFilteredTableData = false;
      this.noTableData = false;
      if (Object.keys(this.tableQuery).length > 0) {
        this.noFilteredTableData = this.priceableItemsList.length > 0 ? false : true;
      } else {
        this.noTableData = this.priceableItemsList.length > 0 ? false : true;
      }
    } else {
      if (Object.keys(this.tableQuery).length > 0) {
        this.noFilteredTableData = true;
      } else {
        this.noTableData = true;
      }
    }
    //added for filter error msg and no table data

    if (this.filterErrorMessage) {
      this.filterErrorMessage = '';
    }
  }

  selectPI(templateId, event) {
    this.isPiSelected = event.target.checked;
    if (this.isPiSelected) {
      this.piContainer.push(templateId);
      this.selectedPiCount = this.piContainer.length;
    } else if (!this.isPiSelected && this.piContainer.length > 0) {
        this.piIndex = this.piContainer.indexOf(templateId);
        this.piContainer.splice(this.piIndex, 1);
        this.selectedPiCount = this.piContainer.length;
    }
  }

  processPIResponse(addPriceableItems) {
    this.addedPIList = addPriceableItems;
    this.piContainer = [];
    this.errorTemplateIds = [];
    this.addingFailedPiContainer = [];
    for (let i in this.addedPIList) {
      if (this.addedPIList[i] != null && this.addedPIList[i]['code'] !== 200) {
        for (let j in this.priceableItemsList) {
          if (this.addedPIList[i]['data'] === this.priceableItemsList[j].templateId) {
            if (this.errorTemplateIds.indexOf(this.priceableItemsList[j].templateId) === -1) {
              this.errorTemplateIds.push(this.priceableItemsList[j].templateId);
              this.addingFailedPiContainer.push(this.priceableItemsList[j]);
            }
          }
        }
      }else {
        this.handleError(this.addedPIList[i]['message']);
      }
    }
    if (addPriceableItems) {
      this._addPriceableItemService.changeSendingFailedPiType(this.addingFailedPiContainer);
      this._utilService.changeCallPiListAfterAddingNewPi(true);
      this._utilService.changeOfferingsChildrens(true);
    }else {
      this._utilService.changeCallPiListAfterAddingNewPi(false);
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === 27 && this._utilityService.isObject(document.getElementsByTagName('ecb-addpriceableitem')[0])) {
      this.hide();
    }
    if (!this.checkAnyPISelected() && this.visible) {
      if (event.keyCode === 13 && !event.shiftKey) {
        this.element = document.getElementById('addPI');
        this.element.click();
      }
    }
  }
  addPI() {
    this.loading = true;
    this.showErrorMessage = false;
    this._addPriceableItemService.addPriceableItems({
      data : {
        offerId : this.productOfferId,
        body : this.piContainer
      },
      success : (result) => {
        this.processPIResponse(result);
        this.hide();
        this.piContainer.length = 0;
        this.selectedUsageType = '';
        this.priceableItemsList.length = 0;
        this._utilService.changeAddPriceableItemToPO(false);
      },
      failure: (errorMsg: string, code: any) => {
        this.showErrorMessage = true;
        this.loadError = false;
        this.errorMessageDisplay = this._utilityService.errorCheck(code, errorMsg, 'ADD');
        this.handleError(errorMsg);
      },
      onComplete: () => {
        this.loading = false;
        this._utilityService.hideSkeleton('localizationSkeleton');
      }
    });
  }

  checkAnyPISelected() {
    if (this.loading) {
      return true;
    } else {
      return (this.piContainer.length > 0) ? false : true;
    }
  }

  clearFilters(column) {
    this.filterPiFields[column] = '';
    this.isFilterData = false;
    this.filterData();
  }

 loadData(event: any) {
     if (this.lazyLoad) {
       this.sortQuery = {};
       this._utilityService.resetPagination(this.pagination);
       this.getColumnSortOrder = (event.sortOrder === 1) ? 'asc' : 'desc';
       const dLangProperty = this._utilityService.dLangPropertyNames(event.sortField);
       if (dLangProperty !== null) {
         this.sortQuery[dLangProperty] = this.getColumnSortOrder;
       } else {
        this.sortQuery[event.sortField] = this.getColumnSortOrder;
       }
       this.scrollReset();
       this.getAllPriceableItems();
     }
     this.lazyLoad = true;
  }

  filterData() {
    this._utilityService.resetPagination(this.pagination);
    this.tableQuery = {};
    this.isFilterData = true;
    for(var key in this.filterPiFields) {
      if (this.filterPiFields[key] !== '' && this.filterPiFields[key] !== undefined) {
        const dLangProperty = this._utilityService.dLangPropertyNames(key);
        if (dLangProperty) {
          this.tableQuery[dLangProperty] = this.filterPiFields[key].trim();
        } else {
          this.tableQuery[key] = `'%${this.filterPiFields[key].trim()}%'|like`;
        }
      }
    }
    if (this.selectedUsageType){
      this.tableQuery['kind'] = this.selectedUsageType;
    }
    this.scrollReset();
    this.getAllPriceableItems();
  }
  filterDataKeys(event, field, value) {
    this.filteredField = field;
    this.filteredValue = value;
    this._utilityService.enableFilter(event, 'addPriceableItems');
  }

  filterDataDelay() {
  if (this.filterPiDataProcessing === false) {
      this.filterPiDataProcessing = true;
      setTimeout(() =>  {
          this.filterPiDataProcessing = false;
          this.filterData();
       }, 300);
    }
  }

  isFilterText(column) {
    return this.filterPiFields[column] && this.filterPiFields[column].length > 0 ? true : false;
  }

  handleError(error) {
    this.isDeletePIError = true;
    this.deletePIError = error;
  }
  deleteErrorMessage(){
    this.isDeletePIError = false;
  }

  processpriceableItemsList() {
    for (let i = 0; i < this.priceableItemsList.length; i++) {
      switch (this.priceableItemsList[i].kind) {
        case 'USAGE':  this.priceableItemsList[i].kind = 'Usage Charges';
        break;
        case 'DISCOUNT':  this.priceableItemsList[i].kind = 'Discount';
        break;
        case 'NON_RECURRING':  this.priceableItemsList[i].kind = 'One Time Charges';
        break;
        case 'RECURRING':  this.priceableItemsList[i].kind = 'Recurring Charges';
        break;
        case 'UNIT_DEPENDENT_RECURRING':  this.priceableItemsList[i].kind = 'Unit Dependent Charges';
        break;
      }
    }
  }

  ngOnDestroy() {
    this._infiniteScrollCheckService.totalPages = 0;
    this.addPISubscriptions.unsubscribe();
  }
  changeUsageType(selectedPI) {
    this.selectedUsageType = selectedPI;
    this.filterData();
  }

  getErrorMessageType() {
    const filterCriteriaLength = !this._utilityService.isObject(this.tableQuery) ? 0 : Object.keys(this.tableQuery).length;
    if (this.loading) {
      return 0;
    }
    if (this.errorMessage) {
      return 1;
    } else if (this.priceableItemsList.length === 0 && filterCriteriaLength === 0) {
      if (this.errorMessage === '') {
        return 2;
      }
    } else if (this.priceableItemsList.length === 0 && filterCriteriaLength > 0) {
      if (this.errorMessage === '') {
        return 3;
      }
    }
    return 0;
  }
}
