import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild, ViewChildren, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { AdjustmentReasonsGridService } from './adjustmentReasonsGrid.service';
import { CanDeactivate, Router, NavigationStart } from '@angular/router';
import { utilService } from '../helpers/util.service';
import { DropdownModule, SelectItem, AutoComplete } from 'primeng/primeng';
import { Language, DefaultLocale, Currency, LocaleService, TranslationService } from 'angular-l10n';
import { NgForm, FormsModule, FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { UtilityService } from '../helpers/utility.service';
import { InfiniteScrollCheckService } from '../helpers/InfiniteScrollCheck.service';

@Component({
  selector: 'ecb-adjustment-reasons',
  templateUrl: './adjustmentReasonsGrid.component.html',
})
export class AdjustmentReasonsGridComponent implements AfterViewInit, OnInit, OnDestroy {
  _adjustmentReasonsList: any[];
  cols: any[];
  errorMessage: string;
  noTableData = false;
  noFilteredTableData: boolean;
  filterElements: any;
  @Language() lang: string;
  tableQuery: any;
  @ViewChild(AutoComplete) private autoComplete: AutoComplete;
  filterFields: any;
  filterDataProcessing = false;
  filterErrorMessage: any;
  loading: boolean;
  @DefaultLocale() defaultLocale: string;
  getDefaultColumnName;
  getDefaultColumnOrder;
  sortQuery: any;
  defaultSort:boolean = true;
  lazyLoad:boolean = false;
  getColumnSortOrder;
  columnDef;
  convertedDefaultSortOrder;
  adjustmentReasonsLength: number;
  showCover: boolean;
  isFAPlusClicked: boolean;
  selectedAdj: any;
  showAdjEditMessage: boolean;
  adjustmentReasonForm: FormGroup;
  confirmDialog: number;
  validateProcessing: boolean;
  isNameValidated: boolean;
  nameExist: boolean;
  isSaveAdjustment: boolean;
  showErrorMessage: boolean;
  httpErrorMessage: string;
  updatedAdjReasonPropertiesForm: any;
  adjName: string;
  propertyName: any;
  isSaveDisabled: boolean;
  nextStateUrl: string;
  @ViewChild('createAdjustmentReasonAside') createAdjustmentReasonAside: any;
  @ViewChildren('defaultName') defaultName: any = '';
  createAdjustmentReason: boolean;
  @ViewChild('displayNameField') displayNameField: any;
  loadGridData = false;
  isReasonsUpdated = false;
  pagination: any;
  adjustmentListFetching: boolean;
  totalPageSize: number;
  infiniteScrollCheck: string = '';
  moreDataCalled: boolean;
  moreData;
  lessData;
  totalPages;
  refreshDataCheck = false;
  isFilterData:boolean;
  removeScrollHeight: any;
  @ViewChild('textArea', { read: ElementRef }) textArea: ElementRef;
  filteredField: any;
  filteredValue: any;
  isFilterCallTrue: boolean;
  filterKeys: any;
  showAdjustmentReasonsPropSkeleton = false;
  adjustmentErrorMsg = '';

  constructor(private _utilService: utilService,
    private _adjustmentReasonsGridService: AdjustmentReasonsGridService,
    private _router: Router,
    private _translationService: TranslationService,
    private _formBuilder: FormBuilder,
    private readonly _utilityService: UtilityService,
    private _infiniteScrollCheckService: InfiniteScrollCheckService) {
      this.isFAPlusClicked = false;
      this.confirmDialog = 0;
      this.validateProcessing = false;
      this.isNameValidated = false;
      this.isSaveAdjustment = false;
      this.selectedAdj = {};
      this.isSaveDisabled = true;
      this.isFilterCallTrue = false;
  }

  ngOnInit() {
    this.getGridConfigData();
    this.createAdjReasonForm();
    this._utilService.updateApplyBodyScroll(false);
    this._utilService.removeScrollHeight.subscribe(value => {
      if (value !== 0) {
        this.removeScrollHeight = value;
      }
    });
    this._utilService.callFilterData.subscribe(value => {
      if (value === 'adjustmentReasonsGrid') {
        this.filterData();
      }
    });
  }

  calculateGridScrollHeight() {
    if (this._utilityService.isTicketLogin()) {
      return { overflow: 'auto', height: 'calc(92vh - ' + `${this.removeScrollHeight}` + 'px)' }
    } else {
      return { overflow: 'auto', height: 'calc(100vh - ' + `${this.removeScrollHeight}` + 'px)' }
    }
  }

  activate() {
    this._utilService.changedynamicSaveBtn('adjustmentReasons');
    this.nextStateUrl = '/ProductCatalog';
    this._router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe(value => {
        this.nextStateUrl = value['url'];
    });
  }

  scrollInitialize(pagination) {
    this.pagination = pagination;
    this.getAdjustmentReasons();
  }

  getMoreData() {
    this._utilService.getScrollHeight(true);
    if(this._adjustmentReasonsList !== undefined  && !this.refreshDataCheck){
      this.moreData = this._infiniteScrollCheckService.getMoreScrollData(!this.loading,this._adjustmentReasonsList.length,this.pagination,this.totalPageSize,this.totalPages);
       if (this.moreData !== undefined) {
         this.infiniteScrollCheck = this.moreData.infiniteScrollCheck;
         this.moreDataCalled = this.moreData.moreDataCalled;
         this.getAdjustmentReasons();
      }
    } else {
      this.refreshDataCheck = false;
    }
  }

  getLessData() {
     if(this._adjustmentReasonsList !== undefined){
    this.lessData = this._infiniteScrollCheckService.getLessScrollData(!this.loading,this._adjustmentReasonsList.length,this.pagination,this.moreDataCalled);
     if (this.lessData !== null) {
         this.infiniteScrollCheck = this.lessData.infiniteScrollCheck;
         this.moreDataCalled = this.lessData.moreDataCalled;
         this.getAdjustmentReasons();
     }
    }
  }

  getGridConfigData() {
    this._utilityService.getextdata({
      data: 'adjustmentReasonsColumnDef.json',
      success: (result) => {
       this.columnDef = result;
       this.cols = this.columnDef.cols;
       this.convertDefaultSortOrder();
       this.initializeFields();
       this.activate();
       this.loadGridData = true;
      },
      failure: (errorMsg: string, code: any, error: any) => {
       this.loading = false;
       this.adjustmentErrorMsg = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
       this.loadGridData = false;
      }
    });
  }

  convertDefaultSortOrder() {
    this.convertedDefaultSortOrder = (this.columnDef.defaultSortOrder === 'asc') ? 1 : -1;
  }

  clearFilters(column) {
    this.noFilteredTableData = false;
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

  getAdjustmentReasons() {
    this.errorMessage = '';
    this.loading = true;
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
    this._adjustmentReasonsGridService.getAllAdjustmentReasons({
      data: widgetData,
      success: (result) => {
        this.totalPageSize = result.totalPageSize;
        this.totalPages = result.totalPages;
        this._infiniteScrollCheckService.totalPages = this.totalPages;
        clearTimeout(timer);
        this._infiniteScrollCheckService.totalPages = this.totalPages;
        result.filter ? this.filterKeys = result.filter : this.filterKeys = undefined;
        if (this.filterKeys !== undefined) {
          this.isFilterCallTrue = this._utilityService.getLatestServiceData(this.filterKeys, this.filteredField, this.filteredValue);
        }
        timer = setTimeout(() => {
          if (!this.isFilterCallTrue) {
            this.processSubscriptionResult(result);
          }
          if (this.filterErrorMessage) {
            this.filterErrorMessage = '';
          }
          if (this.errorMessage) {
            this.errorMessage = '';
          }
        }, 100);
        this.adjustmentListFetching = false;
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this._adjustmentReasonsList = [];
       if (Object.keys(this.tableQuery).length > 0){
          this.filterErrorMessage = error;
        }
        this.errorMessage = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
      },
      onComplete: () => {
        setTimeout(() => {
          this.loading = false;
          this.isReasonsUpdated = false;
          this.showAdjustmentReasonsPropSkeleton = false;
        }, 500);
      }
    });
  }

  public refreshGrid(records) {
    this._adjustmentReasonsList = this._infiniteScrollCheckService.infiniteScrollData(records, this.infiniteScrollCheck, this.pagination,this.totalPageSize);
  }

  refreshData() {
    this.refreshDataCheck = true;
    this._utilityService.resetPagination(this.pagination);
    this.loadGridData = false;
    this.lazyLoad = false;
    this.getGridConfigData();
    this.initializeFields();
    this._utilService.updateChangeScrollposition('refresh');
  }

  processSubscriptionResult(reasons) {
    this.adjustmentReasonsLength = reasons['totalCount'];
    if (this.isFilterData) {
      if (this.pagination.page === 1) {
        this._adjustmentReasonsList = [];
        this._adjustmentReasonsList = reasons.records;
       }
       this.refreshGrid(reasons.records);
    } else {
      this.refreshGrid(reasons.records);
    }
    if (this._adjustmentReasonsList !== null && this._adjustmentReasonsList !== undefined) {
      if (Object.keys(this.tableQuery).length > 0) {
        this.noFilteredTableData = this._adjustmentReasonsList.length > 0 ? false : true;
      } else {
        this.noTableData = this._adjustmentReasonsList.length > 0 ? false : true;
      }
    } else {
      if (Object.keys(this.tableQuery).length > 0) {
        this.noFilteredTableData = true;
      } else {
        this.noTableData = true;
      }
    }
  }

  loadData(event: any) {
    if (this.lazyLoad) {
      this._utilityService.resetPagination(this.pagination);
      this.sortQuery = {};
      this.getColumnSortOrder = (event.sortOrder === 1) ? 'asc' : 'desc';
      const dLangProperty = this._utilityService.dLangPropertyNames(event.sortField);
      this.sortQuery[dLangProperty ? dLangProperty : event.sortField] = this.getColumnSortOrder;
      this.getAdjustmentReasons();
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
        if (dLangProperty) {
          this.tableQuery[dLangProperty] = this.filterFields[key].trim();
        } else {
          this.tableQuery[key] = `'%${this.filterFields[key].trim()}%'|like`;
        }
      }
    }
    this.getAdjustmentReasons();
  }
  filterDataKeys(event, field, value) {
    this.filteredField = field;
    this.filteredValue = value;
    this._utilityService.enableFilter(event,'adjustmentReasonsGrid');
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

  initializeFields(){
    this.filterFields = {};
    this.sortQuery = {};
    this.tableQuery = {};
    this.httpErrorMessage = '';
    this.showErrorMessage = false;
    this.sortQuery[this.columnDef.defaultSortColumn] = this.columnDef.defaultSortOrder;
  }

  /*Create and Edit Adjustment Reasons*/

  showCreateAdjustmentReason(value, adjName) {
    if (value) {
      this.isFAPlusClicked = true;
      this.selectedAdj = adjName;
      this.createAdjustmentReason = false;
      setTimeout(() => {
        document.getElementById('initDisplayNameFocus').focus();
      }, 300);
    } else {
      this.isFAPlusClicked = false;
      this.createAdjustmentReason = true;
      setTimeout(() => {
        document.getElementById('initFocus').focus();
      }, 300);
    }
    this.createAdjustmentReasonAside.show();
    this._utilService.checkNgxSlideModal(true);
    this.showCover = true;
    this.nameExist = false;
    this.createAdjReasonForm();
   
  }

  createAdjReasonForm() {
      if (!this.isFAPlusClicked) {
        const adjName = this._translationService.translate('TEXT_ADJUSTMENTS_REASON');
        this.defaultName = `${adjName}1`;
        this.showAdjEditMessage = false;
        this.adjustmentReasonForm = this._formBuilder.group({
          name: ['', [Validators.required]],
          displayName: ['', [Validators.required]],
          description: ['']
        });
     } else {
        this.showAdjEditMessage = true;
        this.isSaveDisabled = true;
        this.adjustmentReasonForm = this._formBuilder.group({
          name: [this.selectedAdj.name],
          displayName: [this.selectedAdj.displayName, [Validators.required]],
          description: [this.selectedAdj.description]
        });
        this.displayNameField.nativeElement.autofocus = true;
      }
      this.adjustmentReasonForm.controls.name.valueChanges.subscribe(value => {
        this.adjustmentReasonForm.patchValue({displayName: value});
      });
  }

  checkNameAvailability() {
    this.validateProcessing = true;
    this.isNameValidated = true;
    const newPOName = this._utilService.fixedEncodeURIComponent(this.adjustmentReasonForm.controls.name.value);
    if (newPOName !== null && newPOName !== undefined && newPOName !== '') {
      this._adjustmentReasonsGridService.searchAdjustmentReason({
        data: {
          name: newPOName
        },
        success: (result) => {
          this.validateProcessing = false;
          if (result.records != null && result.records !== undefined && result.records.length > 0) {
            if (this.showAdjEditMessage) {
              this.nameExist = false;
            } else {
              this.nameExist = true;
              this.isSaveDisabled = true;
            }
            this.isSaveAdjustment = false;
          } else {
            this.nameExist = false;
            if (this.isSaveAdjustment) {
              this.saveAdjustmentReason();
            }
          }
        },
        failure: (errorMsg: string, code: any, error: any) => {
          this.validateProcessing = false;
          this.showErrorMessage = true;
          this.isSaveDisabled = false;
          this.httpErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'CREATE');
        }
      });
    }
  }

  onEnterSaveAdjustmentReason(event) {
    if ( this.adjustmentReasonForm.valid && !this.isSaveDisabled ) {
      if (event.keyCode === 13 && !event.shiftKey) {
        this.saveAdjustmentReason();
      }
    }
  }
   
  removeSpace(){
    let checkNameValue = this.adjustmentReasonForm.controls.name;
    let checkDisplayValue = this.adjustmentReasonForm.controls.displayName;
    this._utilityService.removeTextSpace(checkNameValue, checkDisplayValue);
    if((checkDisplayValue.value === '' && !/\S/.test(checkDisplayValue.value)) || (checkNameValue.value === '' && !/\S/.test(checkNameValue.value))){
        this.isSaveDisabled = true;
    }else{
        this.isSaveDisabled = false;
    }
  }
  
  disableSpace(evt){
    this._utilityService.disableSpaceBar(evt); 
  }

  resetFlags() {
    this.isNameValidated = false;
    this.isSaveAdjustment = false;
    this.isSaveDisabled = true;
  }

  saveAdjustmentReason() {
    this.isSaveAdjustment = true;
    this.isSaveDisabled = true;
    this.showErrorMessage = false;
    if (!this.isNameValidated && this.createAdjustmentReason) {
       this.checkNameAvailability();
       this.nameExist = false;
    } else {
      if (!this.validateProcessing) {
        setTimeout(() => {
            const propertiesObject = this.adjustmentReasonForm['_value'];
            propertiesObject.displayName = propertiesObject.displayName.trim();
            propertiesObject.name = propertiesObject.name.trim();
            propertiesObject['propId'] = this.selectedAdj.propId;
            propertiesObject['descriptionId'] = this.selectedAdj.descriptionId;
            propertiesObject['displayNameId'] = this.selectedAdj.displayNameId;
            propertiesObject['nameId'] = this.selectedAdj.nameId;
            this.updatedAdjReasonPropertiesForm = propertiesObject;
            if (this.createAdjustmentReason) {
              this._adjustmentReasonsGridService.createAdjustmentReason({
                data: {
                  body: this.updatedAdjReasonPropertiesForm
                },
                success: (result) => {
                  this.isReasonsUpdated = true;
                  this.isSaveDisabled = false;
                  this.getAdjustmentReasons();
                  this.createAdjReasonForm();
                  this.createAdjustmentReasonAside.hide();
                  this.showCover = false;
                },
                failure: (errorMsg: string, code: any, error: any) => {
                  this.showErrorMessage = true;
                  this.httpErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'CREATE');
                  this.isSaveDisabled = false;
                },
                onComplete: () => {
                  this.resetFlags();
                }
              });
            } else {
              this._adjustmentReasonsGridService.updateAdjustmentReason({
                data: {
                  body: this.updatedAdjReasonPropertiesForm,
                  id: this.selectedAdj.propId,
                  param: {
                    fields: `${this._utilityService.getFieldParams('adjustmentReasons', 'params')}`,
                  }
                },
                success: (result) => {
                  this.isReasonsUpdated = true;
                  this.showAdjustmentReasonsPropSkeleton = true;
                  this.isSaveDisabled = false;
                  this.getAdjustmentReasons();
                  this.createAdjReasonForm();
                  this.createAdjustmentReasonAside.hide();
                  this.showCover = false;
                },
                failure: (errorMsg: string, code: any, error: any) => {
                  this.isSaveDisabled = false;
                  this.showErrorMessage = true;
                  this.httpErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'EDIT');
                },
                onComplete: () => {
                  this.resetFlags();
                }
              });
            }
        }, 100);
      }
    }
  }

  setSaveDisabled() {
    return this.isSaveDisabled || !this.adjustmentReasonForm.valid;
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyBoardEvent(event) {
    if (event.keyCode === 27 && this._utilityService.isObject(this.createAdjustmentReasonAside)) {
      if (this.confirmDialog === 0 && this.createAdjustmentReasonAside.visibleStatus) {
        this.cancelAsidePanel();
      } else {
        this.confirmDialog = 0;
      }
    }
    if ((this.adjustmentReasonForm.controls.name.value !== '' &&
    this.adjustmentReasonForm.controls.displayName.value !== '' && !this.nameExist) &&
    (this.adjustmentReasonForm.dirty) ) {
      this.isSaveDisabled = false;
    } else {
      this.isSaveDisabled = true;
    }
  }

  cancelAsidePanel() {
    if (this.adjustmentReasonForm.dirty) {
      this.confirmDialog = 1;
    } else {
      this.nameExist = false;
      this.createAdjustmentReasonAside.hide();
      this.createAdjReasonForm();
      this.showCover = false;
    }
    this.showErrorMessage = false;
    this._utilService.checkNgxSlideModal(false);
  }

  canDeactivate() {
    if (this.adjustmentReasonForm.dirty) {
      const data = {
        url: this.nextStateUrl
      };
      this._utilService.changePreventUnsaveChange(data);
      return false;
    } else {
      return true;
    }
  }

  fadeAsidePanel() {
    this.createAdjustmentReasonAside.hide();
    this.showCover = false;
  }

  onModalDialogCloseCancel(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this.createAdjustmentReasonAside.hide();
      this.showCover = false;
      this.createAdjReasonForm();
    }
  }

  ngOnDestroy() {
    this._infiniteScrollCheckService.totalPages = 0;
    this._utilService.checkCallFilterData('');
  }

  ngAfterViewInit() {
    this.defaultName.first.nativeElement.focus();
  }

  getErrorMessageType() {
    const filterCriteriaLength = !this._utilityService.isObject(this.tableQuery) ? 0 : Object.keys(this.tableQuery).length;
    if (this.loading) {
        return 0;
    }
    if (this.errorMessage) {
        return 1;
    } else if (this._adjustmentReasonsList!=undefined && this._adjustmentReasonsList.length === 0 && filterCriteriaLength === 0 && this.errorMessage === '') {
        return 2;
    } else if (this._adjustmentReasonsList!=undefined && this._adjustmentReasonsList.length === 0 && filterCriteriaLength > 0 && this.errorMessage === '') {
        return 3;
    }
    return 0;
}
autoGrow() {
  const textArea = this.textArea.nativeElement;
  this._utilityService.adjustHeightOnScroll(textArea);
 }

}
