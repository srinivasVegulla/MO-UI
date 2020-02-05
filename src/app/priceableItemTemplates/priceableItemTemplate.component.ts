import { Component, EventEmitter, ViewChild, OnInit, Input, Output, HostListener, OnDestroy, ElementRef } from '@angular/core';
import { PriceableItemTemplateService } from '../priceableItemTemplates/priceableItemTemplate.service';
import { UtilityService } from '../helpers/utility.service';
import { Language, TranslationService } from 'angular-l10n';
import { DropdownModule, SelectItem } from 'primeng/primeng';
import { utilService } from '../helpers/util.service';
import { Router } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';
import { contextBarHandlerService } from '../helpers/contextbarHandler.service';
import { NgForm, FormsModule, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ErrorTooltipComponent } from '../errortooltip/errorTooltip.component';
import { InfiniteScrollCheckService } from '../helpers/InfiniteScrollCheck.service';

@Component({
  selector: 'ecb-priceableItem-template',
  templateUrl: './priceableItemTemplate.component.html',
  providers: []
})

export class PriceableItemTemplateComponent implements OnInit, OnDestroy {

  @Language() lang: string;
  piTemplatelist = [];
  piTemplatelistError;
  piTemplateColumns;
  piTemplateError;
  filterFields;
  filterQuery;
  sortQuery;
  isFilterCriterialProcessing;
  selectedKindInFilter;
  usageTypes: SelectItem[];
  keys;
  priceableItemFetching;
  inUseOffers;
  showInUseOfferings;
  showInUseSharedRatelist;
  isLazyloaded;
  isCreatePItemplate;
  createPopupSubscriptions: any = [];
  selectedPItemplate;
  CreatePanelWidget;
  isSaveEnabled = false;
  showCover;
  createPItemplateForm: any;
  nameExist;
  selectedTypeRecords;
  showDuplicateNameError;
  piTemplateForm;
  confirmDialog;
  deleteablePitemplateData;
  deleteablePitemplateDataIndex;
  tooltipIndex;
  deletePItemplateError;
  errorTooltip;
  breadCrumbData;
  totalCount: number;
  totalPageSize: number;
  pagination: any;
  usageFirstName: string;
  selectedFilterData: any;
  getInUseColumnSortOrder: any;
  loadGridData = false;
  errorMessage: string = '';
  convertedDefaultSortOrder;
  infiniteScrollCheck: string = '';
  moreDataCalled: boolean;
  inUseOfferingsData;
  inUseOfferingsLocation;
  moreData;
  lessData;
  totalPages;
  isDeleteOrHide = false;
  refreshDataCheck = false;
  isFilterData:boolean;
  removeScrollHeight: any;
  filteredField: any;
  filteredValue: any;
  isFilterCallTrue: boolean;
  filterKeys: any;
  showDuplicateName = false;
  udrChargeName = 'UNIT_DEPENDENT_RECURRING';
  @ViewChild('defaultName') defaultName: any = '';
  @ViewChild('textArea', { read: ElementRef }) textArea: ElementRef;

  constructor(private _piTemplateService: PriceableItemTemplateService,
    private _utilityService: UtilityService,
    private _utilService: utilService,
    private _contextBarHandlerService: contextBarHandlerService,
    private _router: Router,
    private _translationService: TranslationService,
    private _formBuilder: FormBuilder,
    private _infiniteScrollCheckService: InfiniteScrollCheckService) {
    this.reset();
    this.isFilterCallTrue = false;
  }

  scrollInitialize(pagination) {
    this.pagination = pagination;
    this.getPItemplatelist();
  }
  scrollReset() {
    this.pagination = this.pagination.reset();
  }

  getMoreData() {
    this._utilService.getScrollHeight(true);
    if(this.piTemplatelist !== undefined  && !this.refreshDataCheck && !this.isDeleteOrHide){
      this.moreData = this._infiniteScrollCheckService.getMoreScrollData(!this.priceableItemFetching,this.piTemplatelist.length,this.pagination,this.totalPageSize,this.totalPages);
       if (this.moreData !== undefined) {
         this.infiniteScrollCheck = this.moreData.infiniteScrollCheck;
         this.moreDataCalled = this.moreData.moreDataCalled;
         this.getPItemplatelist();
      }
    } else {
      this.refreshDataCheck = false;
    }
  }

  getLessData() {
     if(this.piTemplatelist !== undefined && !this.isDeleteOrHide){
    this.lessData = this._infiniteScrollCheckService.getLessScrollData(!this.priceableItemFetching,this.piTemplatelist.length,this.pagination,this.moreDataCalled);
     if (this.lessData !== null) {
         this.infiniteScrollCheck = this.lessData.infiniteScrollCheck;
         this.moreDataCalled = this.lessData.moreDataCalled;
         this.getPItemplatelist();
     }
    }
  }

  fetchInUserOfferings(value) {
    this.selectedFilterData = value;
     if (this.selectedFilterData.selectedValue !== '' && this.selectedFilterData.selectedValue !== null)  {
       if (this.selectedFilterData.selectedColumn === 'offeringsCount') {
        this.filterFields['offeringsCount'] = [this.selectedFilterData.selectedValue, '0|!='];
       } else {
        this.filterFields['sharedRateListCount'] = [this.selectedFilterData.selectedValue, '0|!='];
       }
       this.prepareFilterQuery();
    }else {
      this.clearFilters(this.selectedFilterData.selectedColumn);
     }
  }

  ngOnInit() {
    this.getGridConfigData();
    this.inUseOfferingsLocation = 'priceableItemTemplateGrid';
    this._utilService.changedynamicSaveBtn('');
    this._utilService.updateApplyBodyScroll(false);
    this._contextBarHandlerService.changeContextBarVisibility(true);
    this.createPItemplateForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      displayName: ['', [Validators.required]],
      description: [''],
      valueType: [0],
      eventType: [1],
      piId: [''],
      kind: ['']
    });
    this.updateName();
    this.errorTooltip = false;
    this._utilService.removeScrollHeight.subscribe(value => {
      if (value !== 0) {
        this.removeScrollHeight = value;
      }
    });
    this._utilService.callFilterData.subscribe(value => {
      if (value === 'priceableitemTemplate') {
        this.prepareFilterQuery();
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

  getGridConfigData() {
    this._utilityService.getextdata({
      data: 'priceableItemTemplateColumnDef.json',
      success: (result) => {
        this.piTemplateColumns = result;
        this.sortQuery[this.piTemplateColumns.defaultSortColumn] = this.piTemplateColumns.defaultSortOrder;
        this.convertDefaultSortOrder();
        this.loadGridData = true;
      },
      failure: (errorMsg: string, code: any, error: any) => {
       this.errorMessage = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
       this.loadGridData = false;
       this.priceableItemFetching = false;
      }
    });
  }

  convertDefaultSortOrder() { 
    this.convertedDefaultSortOrder = (this.piTemplateColumns.defaultSortOrder === 'asc') ? 1 : -1;
  }

  getTypes() {
    this._piTemplateService.getPItemplateTypes({
      data: '',
      success: (result) => {
        this.keys = Object.keys(result);
        this.usageTypes = [];
        this.usageTypes.push({ label: 'TEXT_SELECT_CRITERIA', value: 'Select' });
        this.usageTypes.push({ label: '', value: '' });
        for (const key of this.keys) {
          this.usageTypes.push({ label: result[key], value: key });
        }
        this.usageFirstName =  this.usageTypes[0].value;
      },
      failure: (error) => {
        this.usageTypes = [];
        this.piTemplatelistError = error;
      }
    });
  }

  updateName() {
    this.createPItemplateForm.controls.name.valueChanges.subscribe(value => {
      const displayName = value.length > 250 && this.selectedPItemplate.kind === this.udrChargeName  ?
                  value.slice(0, 250 - Number(value.length)) : value;
      this.createPItemplateForm.controls.displayName.setValue(displayName);
    });
  }

  numberFieldConfig(field) {
    const fields = {
      offeringsCount: 'offeringsCount',
      sharedRateListCount: 'sharedRateListCount'
    };
    return fields[field] ? fields[field] : null;
  }

  public reset() {
    this.piTemplatelist = [];
    this.piTemplateError = null;
    this.initializeFields();
    this.isFilterCriterialProcessing = false;
    this.priceableItemFetching = false;
    this.isCreatePItemplate = false;
    this.confirmDialog = 0;
    this.errorTooltip = false;
    this.totalCount = 0;
    this.totalPageSize = 0;
  }

  public prepareFilterQuery() {
    this._utilityService.resetPagination(this.pagination);
    this.filterQuery = {};
    this.isFilterData = true;
    for (const key in this.filterFields) {
      if (this.filterFields[key] !== '' && this.filterFields[key] !== null) {
        const dLangProperty = this._utilityService.dLangPropertyNames(key);
        if (dLangProperty) {
          this.filterQuery[dLangProperty] = this.filterFields[key].trim();
        } else if (this.numberFieldConfig(key)) {
        this.filterQuery[key] = this.filterFields[key];
      	} else if (this.filterFields[key].trim() !== '') {
          this.filterQuery[key] = `'%${this.filterFields[key].trim()}%'|like`;
        }
      }
    }
    if (this.selectedKindInFilter !== '' && this.selectedKindInFilter !== null && this.selectedKindInFilter !== 'Enter filter critira') {
      this.filterQuery['kind'] = this.selectedKindInFilter;
    }
    if (this.selectedKindInFilter === 'Enter filter critira') {
      this.selectedKindInFilter = 'TEXT_ENTER_FILTER_CRITERIA';
    }
    this.scrollReset();
    this.getPItemplatelist();
  }
  filterDataKeys(event, field, value) {
    this.filteredField = field;
    this.filteredValue = value;
    this._utilityService.enableFilter(event, 'priceableitemTemplate');
  }
  getPriceableItemtFilterData() {
    if (this.isFilterCriterialProcessing === false) {
      this.isFilterCriterialProcessing = true;
      setTimeout(() => {
        this.isFilterCriterialProcessing = false;
        this.prepareFilterQuery();
      }, 300);
    }
  }

  clearFilters(column) {
    this.filterFields[column] = '';
    this.isFilterData = false;
    this.prepareFilterQuery();
  }

  isFilterText(column) {
    return this.filterFields[column] && this.filterFields[column].length > 0 ? true : false;
  }

  loadData(event) {
    if (this.isLazyloaded) {
        this._utilityService.resetPagination(this.pagination);
        this.sortQuery = {};
      if (event.sortField !== undefined) {       
        this.getInUseColumnSortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
        }
      const dLangProperty = this._utilityService.dLangPropertyNames(event.sortField);
      this.sortQuery[dLangProperty ? dLangProperty : event.sortField] = this.getInUseColumnSortOrder;
      this.scrollReset();
      this.getPItemplatelist();
    }
    this.isLazyloaded = true;
  }

  public getPItemplatelist() {
    this.piTemplatelistError = '';
    this.priceableItemFetching = true;
    const criteria = {
      param: {
        page: this.pagination.page,
        size: this.pagination.scrollPageSize
      }
    };
    if (Object.keys(this.sortQuery).length > 0) {
      criteria.param['sort'] = this.sortQuery;
    }
    if (Object.keys(this.filterQuery).length > 0) {
      criteria.param['query'] = this.filterQuery;
    }
    this._piTemplateService.getPItemplatelist({
      data: criteria,
      success: (result) => {
      result.filter ? this.filterKeys = result.filter : this.filterKeys = undefined;
        if (this.filterKeys !== undefined) {
          this.isFilterCallTrue = this._utilityService.getLatestServiceData(this.filterKeys, this.filteredField, this.filteredValue);
        }
        if(!this.isFilterCallTrue) {
          this.processGridData(result.records);
        }
        this.piTemplatelistError = '';
        this.totalCount = result.totalCount;
        this.totalPageSize = result.totalPageSize;
        this.totalPages = result.totalPages;
        this._infiniteScrollCheckService.totalPages = this.totalPages;
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this.piTemplatelist = [];
        this.piTemplatelistError = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
      },
      onComplete: () => {
        this.priceableItemFetching = false;
      }
    });
  }

  public processGridData(records) {
    if(this.isDeleteOrHide) {
      if (this.pagination.page > 1) {
        this.piTemplatelist = this._infiniteScrollCheckService.callProductDelete(this.piTemplatelist, this.tooltipIndex, this.pagination);
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
      this.piTemplatelist = [];
    }
    this.piTemplatelist = this._infiniteScrollCheckService.infiniteScrollData(records, this.infiniteScrollCheck, this.pagination,this.totalPageSize);
  }

  getDeviceWidth() {
    return window.innerWidth + 'px';
  }

  getErrorMessageType() {
    const filterCriteriaLength = !this._utilityService.isObject(this.filterQuery) ? 0 : Object.keys(this.filterQuery).length;
    if (this.priceableItemFetching) {
      return 0;
    }
    if (this.piTemplatelistError) {
      return 1;
    } else if (this.piTemplatelist !== undefined && this.piTemplatelist.length === 0 && filterCriteriaLength > 0) {
      if (this.piTemplatelistError === '') {
        return 3;
      }
    } else if (this.piTemplatelist !== undefined && this.piTemplatelist.length === 0 && filterCriteriaLength === 0) {
      if (this.piTemplatelistError === '') {
        return 2;
      }
    }
      return 0;
  }

  openInuseOfferings(obj) {
    this.showInUseOfferings = true;
    this.inUseOfferingsData = obj;
  }
  hideInUseModalDialog(e) {
    if (e) {
      this.showInUseOfferings = false;
      this.showInUseSharedRatelist = false;
    }
  }
  openInuseSharedRatelist(obj) {
    this.showInUseSharedRatelist = true;
    this.inUseOfferingsData = obj;
  }

  removeFilterFetchingError() {
    this.piTemplatelistError = '';
  }

  refreshData() {
    this.loadGridData = false;
    this.isLazyloaded = false;
    this.initializeFields();
    this.getGridConfigData();   
    this.refreshDataCheck = true;
    this._utilityService.resetPagination(this.pagination);
    this.sortQuery[this.piTemplateColumns.defaultSortColumn] = this.piTemplateColumns.defaultSortOrder;
    this._utilService.changedRefreshNumberDateFilter(true);
    this._utilService.updateChangeScrollposition('refresh');
  }

  initializeFields() {
    this.getTypes();
    this.filterFields = {};
    this.filterQuery = {};
    this.sortQuery = {};
    this.selectedKindInFilter = '';
    this.usageFirstName = '';
  }

  redirectToDetailPage(data) {
    this._utilService.addNewRecord({
      obj: data,
      path: '/ProductCatalog/PriceableItemTemplates/' + data.templateId + '/' + data.kind,
      Level: 'Grid'
    });
    this._router.navigate(['/ProductCatalog/PriceableItemTemplates/', data.templateId, data.kind]);
  }

  isDeleteableTemplate(data) {
    return data['delete'];
  }
  deletePricelistRecord(data, index) {
    if (data.delete) {
    this.deleteablePitemplateData = data;
    this.deleteablePitemplateDataIndex = index;
    this.confirmDialog = 2;
    }
  }
  onModalDialogCloseDelete(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this.deltePItemplate(this.deleteablePitemplateData['templateId'], this.deleteablePitemplateDataIndex);
    }
  }
  deltePItemplate(templateId, index) {
    this.tooltipIndex = index;
    this._utilService.getScrollHeight(true);
    this.priceableItemFetching = true;
    const widgetData = {
      templateId: templateId
    };
    if (this.piTemplatelist.length === index) {
      this.tooltipIndex = index - 1;
    } else {
      this.tooltipIndex = index;
    }
    this._piTemplateService.deletePItemplateRecord({
      data: widgetData,
      success: (result) => {
        this.piTemplatelist.splice(this.tooltipIndex, 1);
        this.isDeleteOrHide = true;
        if (this.infiniteScrollCheck === 'Less') {
          this.pagination.page += 2;
          this.infiniteScrollCheck = 'More';
        }
        this.getPItemplatelist();
      },
      failure: (errorMsg: string, code: any) => {
        this.deletePItemplateError = this._utilityService.errorCheck(code, errorMsg, 'DELETE');
        this.piTemplatelist[index].error = true;
        this.errorTooltip = true;
      },
      onComplete: () => {
        this.priceableItemFetching = false;
      }
    });
  }
  OnTooltipClose() {
    this.errorTooltip = false;
    this.clearHighlight();
  }
  clearHighlight() {
    for (const i in this.piTemplatelist) {
      if (this.piTemplatelist !== undefined) {
        this.piTemplatelist[i].error = false;
      }
    }
  }
  openTypesPopup() {
    this.isCreatePItemplate = true;
  }
  closeCreatePopup(event) {
    this.isCreatePItemplate = false;
  }
  openCreatePanel(event, CreateProperties) {
    this.selectedPItemplate = event;
    if(CreateProperties !== undefined) {
      this.CreatePanelWidget = CreateProperties;
      this.CreatePanelWidget.show();
      this.showCover = true;
      this.defaultName = this._translationService.translate('TEXT_DEFAULT_PITEMPLATE_NAME');
      this.nameExist = false;
      this.isSaveEnabled = false;
      this.processForm();
      this._utilService.checkNgxSlideModal(true);
      const maxLength = (this.selectedPItemplate.kind === this.udrChargeName ? '250' : '255');
      setTimeout(() => {
        document.getElementsByTagName('input')['displayName'].setAttribute('maxLength', maxLength);
      }, 100);
    }
  }

  onEnterCreatePItemplate(event) {
    if(this.isSaveEnabled) {
      if (event.keyCode === 13 && !event.shiftKey) {
        this.createPItemplate();
      }
    }
  }

  createPItemplate() {
    this.isSaveEnabled = false;
    const propertiesObject = this.createPItemplateForm['_value'];
    propertiesObject.displayName = propertiesObject.displayName.trim();
    propertiesObject.name = propertiesObject.name.trim();
    this.piTemplateForm = this.createPropertiesForm(propertiesObject);
    if (!this.nameExist) {
      this._piTemplateService.createPItemplate({
        data: {
          body: this.piTemplateForm,
          kind: this.selectedPItemplate.kind
        },
        success: (result) => {
          this.isSaveEnabled = true;
          this.CreatePanelWidget.hide();
          this.showCover = false;
          this._utilService.checkNgxSlideModal(false);
          this._utilService.addNewRecord({
            obj: result,
            path: '/ProductCatalog/PriceableItemTemplates/' + result.propId + '/' + this.selectedPItemplate.kind,
            Level: 'Grid'
          });
          this._router.navigate(['/ProductCatalog/PriceableItemTemplates/', result.propId, this.selectedPItemplate.kind]);
        },
        failure: (errorMsg: string, code: any, error: any) => {
          this.isSaveEnabled = true;
          this.showDuplicateName = true;
          this.showDuplicateNameError = this._utilityService.errorCheck(code, errorMsg, 'CREATE');
        }
      });
    }
  }
  closeCreatePItemplatePanel() {
    this.showDuplicateName = false;
    if(this.createPItemplateForm.dirty){
      this.confirmDialog = 1;
    } else {
      this.closeEditPanel();
    }
  }
  onModalDialogCloseCancel(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this.closeEditPanel();
    }
  }
  closeEditPanel() {
    this.CreatePanelWidget.hide();
    this.showCover = false;
    this._utilService.checkNgxSlideModal(false);
  }
  processForm() {
    this.createPItemplateForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      displayName: ['', [Validators.required]],
      description: [''],
      valueType: [0],
      eventType: [1],
      piId: [this.selectedPItemplate.piId],
      kind: [this.selectedPItemplate.kind]
    });
    this.updateName();
  }

  createPropertiesForm(propertiesObject) {
    const tempFormObj = {};
    if (propertiesObject) {
      for (const key in propertiesObject) {
        if (key) {
          tempFormObj[key] = propertiesObject[key];
        }
      }
    }
    if (this.selectedPItemplate.kind === 'NON_RECURRING') {
      tempFormObj['properties'] = { "IsLiabilityProduct": "N" };
    }
    return tempFormObj;
  }

  removeSpace(){
    let checkNameValue = this.createPItemplateForm.controls.name;
    let checkDisplayValue = this.createPItemplateForm.controls.displayName;
    this._utilityService.removeTextSpace(checkNameValue, checkDisplayValue);
    if((checkDisplayValue.value === '' && !/\S/.test(checkDisplayValue.value)) || (checkNameValue.value === '' && !/\S/.test(checkNameValue.value))){
      this.isSaveEnabled = false;
    }else{
      this.isSaveEnabled = true;
    }
  }
  
  disableSpace(evt){
    this._utilityService.disableSpaceBar(evt); 
  }

  checkNameAvailability() {
    const widgetData = {
      PItemplateName: this._utilService.fixedEncodeURIComponent(this.createPItemplateForm.controls.name.value),
    };
    this._piTemplateService.getPItemplateNameAvailability({
        data: widgetData,
        success: (result) => {
          this.selectedTypeRecords = result.records;
          if (this.selectedTypeRecords.length > 0 && this.selectedTypeRecords != null && this.selectedTypeRecords != undefined) {
            this.nameExist = true;
            this.isSaveEnabled = false;
          }  else if (this.createPItemplateForm.controls.name.value === '') {
            this.nameExist = false;
            this.isSaveEnabled = false;
          }  else {
            this.nameExist = false;
            this.isSaveEnabled = true;
          }
        },
        failure: (errorMsg: string, code: any, error: any) => {
          this.showDuplicateName = true;
          this.showDuplicateNameError = this._utilityService.errorCheck(code, errorMsg, 'CREATE');
        }
      });
    }

  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event) {
    if (event.keyCode === 27 && this._utilityService.isObject(this.CreatePanelWidget)) {
      if (this.confirmDialog === 0  && this.CreatePanelWidget.visibleStatus) {
        this.closeCreatePItemplatePanel();
      } else {
        this.confirmDialog = 0;
      }
    }
    this.onFormFieldChange();
  }

  onFormFieldChange() {
    if (this.createPItemplateForm.dirty && this.createPItemplateForm.controls.name.value != '' && this.createPItemplateForm.controls.displayName.value != '' && !this.nameExist) {
      this.isSaveEnabled = true;
      return true;
    } else {
      this.isSaveEnabled = false;
      return false;
    }
  }

  ngOnDestroy() {
    this._infiniteScrollCheckService.totalPages = 0;
    this._utilService.checkCallFilterData('');
  }
  changeUsageType(selectedPI) {
    this.selectedKindInFilter = selectedPI;
    this.prepareFilterQuery();
  }
  autoGrow() {
    const textArea = this.textArea.nativeElement;
    this._utilityService.adjustHeightOnScroll(textArea);
   }

   
}
