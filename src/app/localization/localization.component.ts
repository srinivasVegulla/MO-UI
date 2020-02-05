import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy, ViewChild, Inject, HostListener, Output , EventEmitter} from '@angular/core';
import { contextBarHandlerService } from '../helpers/contextbarHandler.service';
import { utilService } from '../helpers/util.service';
import { LocaleService, TranslationService } from 'angular-l10n';
import { Response } from '@angular/http';
import { UpperCasePipe } from '@angular/common';
import { localizationService } from './localization.service';
import { UtilityService } from '../helpers/utility.service';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { priceableItemDetailsService } from '../priceableItemDetails/priceableItemDetails.service';
import { PiTemplateDetailsService } from '../priceableItemTemplates/piTemplateDetails/piTemplateDetails.service';
import { LoaderService } from '../helpers/loader/loader.service';
import { CapabilityService } from '../helpers/capabilities.service';
import { InfiniteScrollCheckService } from '../helpers/InfiniteScrollCheck.service';
import { ObjectToArrayPipe } from '../helpers/ObjectToArray.pipe';
import { EmitterVisitorContext } from '@angular/compiler';

@Component({
  selector: 'ecb-localization',
  templateUrl: './localization.component.html',
  providers: [UpperCasePipe, localizationService, ObjectToArrayPipe]
})
export class LocalizationComponent implements OnInit, AfterViewInit, OnDestroy {
  cols: any = [];
  checkboxSelector: string = '';
  localeFlagData: any = [];
  lables;
  lang: string;
  copyRights;
  cookieName;
  copyRightsInfo;
  initial;
  checkBoxFields = {
    'English(UK)': false,
    'English(US)': false,
    'French': false,
    'German': false,
    'Spanish': false,
    'Japanese': false,
    'Portuguese-Brazil': false,
    'Italian': false,
    'Spanish-Mexican': false,
    'Hebrew': false,
    'Danish': false,
    'Swedish': false,
    'Arabic': false
  };
  count = 1;
  dynamicArray: any[] = [];
  inital;
  labels: any;
  localeData: any;
  localizationViewData: any;
  filterFields: any;
  filterErrorMessage: any;
  tableQuery: any;
  sortQuery: any;
  objectTypes: any = [];
  disable;
  lazyLoad: boolean;
  localizationSubscriptions: any;
  getColumnSortOrder;
  noTableData;
  noFilteredTableData;
  loading;
  loadFlagData: boolean = false;
  disableDownloadBtn: boolean = false;
  editedRows: any = {};
  editedData: any = [];
  fieldName: string = '';
  localizationData: any;
  productOfferId: number;
  @ViewChild('localizationPanel') LocalizationAsidePanel: any;
  displayName: string;
  showCover;
  isAllProductOfferPage;
  dropDownData: any = {};
  check;
  confirmDialog;
  currentPage: any;
  ProductOffer: any;
  Bundle: any;
  isDisabled;
  editDataInfo: any;
  languageCodeMap: any = {
    'English(US)': 'us',
    'English(UK)': 'gb',
    'French': 'fr',
    'German': 'de',
    'Spanish': 'es',
    'Japanese': 'jp',
    'Portuguese-Brazil': 'pt-br',
    'Italian': 'it',
    'Spanish-Mexican': 'es-MX',
    'Hebrew': 'he',
    'Danish': 'da',
    'Swedish': 'sv-se',
    'Arabic': 'ar-sa'
  };
  langCode: '';
  loadNgxAside: boolean = false;
  totalCount: number;
  totalPageSize: number;
  localizationFromContextbar;
  isDonotSavePopupLocalization;
  currentDisplayName;
  piTemplate;
  typeLocalization;
  Subscription;
  piTempleteObservable;
  Localization;
  currentpagestatus;
  saveErrorMsg;
  isEdited = false;
  nextStateUrl;
  savelocalization: boolean;
  width;
  pagination : any;
  gridColumnOrder = {};
  langCodeId;
  isDownload = false;
  csvDefaultColumns = [];
  confirmDialogDownload;
  orderLanguages = {};
  uploadedFileName: string;
  selectedFile: any;
  uploadError: any = {};
  Object = Object;
  recordsUpdated: number;
  isHeadersError = false;
  displayErrorProperties: any[] = ['ObjectType', 'ObjectName', 'Property', 'errorMsg'];
  uploadErrObj: any = {};
  @ViewChild('csvUploadElement') csvUploadElement: any;
  @ViewChild('dt') dt: any;
  localizedUnSavedEdit: any;
  enableLocalizationEdit = true;
  columnDef: any = {};
  loadGridData = false;
  convertedDefaultSortOrder: any;
  isCancelLocalization;
  setIntervalValues: any;
  checkTime: any;
  initialTime: any;
  _localisedList = [];
  errorMessageOnLoad: string;
  showlocalizationSkeleton: boolean;
  removeScrollHeight: any;
  sortColumnName;
  totalPages: any;
  callGetLabels: boolean;
  langHeaderHeight: any;
  localeTotalHeight: any;
  localePopTotalHeight: any;
  @ViewChild('selectLangHeader') langHeader: any;
  @ViewChild('popupHeading') popupHeader: any;
  filterKeys: any;
  filteredField: any;
  filteredValue: any;
  isFilterCallTrue: boolean;
  @ViewChild('selectGridCount') langGridCount: any;
  counter: number = 0;
  currentFocusedLanguage: any = "English(US)";
  isOnLoad: boolean = true;
  uploadErrorCount: any;
  partialErrorObj: any;
  duplicateErrorObj: any;
  localizationErrMsg: string = '';
  showErrorMessage: boolean;
  loadError:boolean;
  @Output() closeLocalisationAsidePanel = new EventEmitter();
  loadNetworkError:boolean = false;
  
  constructor(private readonly _contextBarHandlerService: contextBarHandlerService,
    private readonly _utilService: utilService,
    public _locale: LocaleService,
    private readonly _UpperCasePipe: UpperCasePipe,
    private readonly _localizationService: localizationService,
    private readonly _route: ActivatedRoute,
    private readonly _translationService: TranslationService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    @Inject('Window') private readonly window: Window,
    private readonly _router: Router,
    private readonly _utilityService: UtilityService,
    private readonly _priceableItemDetailsService: priceableItemDetailsService,
    private readonly _piTemplateDetailsService: PiTemplateDetailsService,
    private readonly _loaderService: LoaderService,
    private _capabilityService: CapabilityService,
    private _infiniteService: InfiniteScrollCheckService) {
    this.confirmDialog = 0;
    this.editDataInfo = {};
    this._utilService.changeIsDisplayName(true);
    this.uploadedFileName = 'localizations.csv';
    this.isFilterCallTrue = false;
  }

  @HostListener('document:keydown.esc', ['$event'])
  handleEscape() {
    if (this._utilityService.isObject(this.LocalizationAsidePanel)) {
      if (this.confirmDialog === 0 && this.LocalizationAsidePanel.visibleStatus) {
          this.cancelCoverHandler();
        } else {
          this.confirmDialog = 0;
        }
    }
  }

  calculateBreadCrumHeight() {
    if (this.isAllProductOfferPage !== undefined && this.isAllProductOfferPage) {
      this._utilityService.calculateLocalizationHeader(this.langHeader.nativeElement.offsetHeight, this.langGridCount.nativeElement.offsetHeight);
    } else if(!this.isAllProductOfferPage && this.isAllProductOfferPage !== undefined){
      this._utilityService.calculateLocalizationHeader(this.langHeader.nativeElement.offsetHeight, this.langGridCount.nativeElement.offsetHeight);
    }
  }

  ngOnInit() {
    this._infiniteService.totalPages = undefined;
    this.showErrorMessage = false;
    this.getGridConfigData();
    this._utilService.updateApplyBodyScroll(false);
    this.totalCount = 0;
    this._utilService.removeScrollHeight.subscribe(value => {
      if (value !== 0) {
        this.removeScrollHeight = value;
      }
    });
    this._utilService.calcLocalizationHeader.subscribe(value => {
      if (value !== 0 && value !== undefined) {
        this.langHeaderHeight = value;
      } else {
        this.langHeaderHeight = 100;
      }
    });
    this._utilService.callFilterData.subscribe(value => {
      if (value === 'localization') {
        this.filterData();
      }
    });
  }

  calculateGridScrollHeight() {
    if (!this.loadNgxAside) {
      const extraPadding = 40;
      this.localeTotalHeight = this.removeScrollHeight + this.langHeaderHeight + extraPadding;
      if (this._utilityService.isTicketLogin()) {
        return { overflow: 'auto', height: 'calc(92vh - ' + `${this.localeTotalHeight}` + 'px)' }
      } else {
        return { overflow: 'auto', height: 'calc(100vh - ' + `${this.localeTotalHeight}` + 'px)' }
      }
    } else {
      const extraPadding = 50;
      this.localePopTotalHeight = this.langHeaderHeight + this.popupHeader.nativeElement.offsetHeight + extraPadding;
      if (this._utilityService.isTicketLogin()) {
        return { overflow: 'auto', height: 'calc(90vh - ' + `${this.localePopTotalHeight}` + 'px)' }
      } else {
        return { overflow: 'auto', height: 'calc(96vh - ' + `${this.localePopTotalHeight}` + 'px)' }
      } 
    }
  }

  triggerLocalizationData() {
    setTimeout(() => {
      this._utilService.checkNgxSlideModal(true);
      this.getLocalizationDataType();
    }, 100);
  }

  initialize() {
    this.isDisabled = false;
    this.showCover = false;
    this._contextBarHandlerService.changeContextBarVisibility(true);
    this._utilService.changedynamicSaveBtn('localization');
    this.getlables();
    this.lazyLoad = true;
    this.nextStateUrl = '/ProductCatalog';
    this._router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe(value => {
        this.nextStateUrl = value['url'];
      });
    this.cookieName = this._locale.getCurrentLocale() === ('us' || 'gb') ? 'us' : this._locale.getCurrentLocale();
    if (window.location.href.includes('Localization')) {
      this.typeLocalization = 'Localization';
    }
    // for save button clicked from localization
    this._utilService.isSaveButtonClickedLocalization.subscribe(value => {
      if (value) {
        this.saveGlobalLocalization();
      }
    });
    // for cancel button clicked from localization
    this.isCancelLocalization = this._utilService.isCancelLocalization.subscribe(value => {
      if (value) {
        this.resetLocalizedData();
      }
    });
    // fordonot save button clicked from Popup localization
    this.isDonotSavePopupLocalization = this._utilService.isDonotSavePopupLocalization.subscribe(value => {
      if (value) {
        const langCode = this.languageCodeMap[this.fieldName];
        for (const i in this.localizationData) {
          this.localizationData[i].localizationMap[langCode] = this.localizationViewData[i].localizationMap[langCode]
        }
        this.removeColumn(this.fieldName);
      }
    });
  }

  initLocalizationInAside() {
    this.localizationFromContextbar = this._utilService.localizationFromContextbar.subscribe(value => {
      if (value === true) {
        this._utilService.updateApplyBodyScroll(true);
        this.loadNgxAside = true;
        this.isEdited = false;
        this.isAllProductOfferPage = false;
        this.currentpagestatus = this._utilService.localizationcurrentPage.subscribe(value => {
          this.currentPage = value;
        });
        if (this.currentPage === 'ProductOffer') {
          this.productOfferId = +this._route.snapshot.params['productOfferId'];
          this.typeLocalization = 'Offering';
          this.enableLocalizationEdit = this._capabilityService.findPropertyCapability('UIPOGrid', 'Create');
          this.currentDisplayName = this._utilService.currentDisplayName.subscribe(displayName => {
            this.displayName = displayName;
          });
        } else if (this.currentPage === 'Bundle') {
          this.productOfferId = +this._route.snapshot.params['bundleId'];
          this.typeLocalization = 'Offering';
          this.enableLocalizationEdit = this._capabilityService.findPropertyCapability('UIPOGrid', 'Create');
          this.currentDisplayName = this._utilService.currentDisplayName.subscribe(displayName => {
            this.displayName = displayName;
          });
        } else if (this.currentPage === 'PriceableItemTemplates') {
          this.productOfferId = this._route.snapshot.params['templateId'];
          this.typeLocalization = 'PriceableItemTemplates';
          this.piTempleteObservable = this._utilService.newRecord.subscribe(obj => {
            if (obj['Level'] === 'CHILD_PI_OUT') {
              const childItems = obj['obj'].childs;
              for (const item of childItems) {
                if (item.templateId === Number(this.productOfferId)) {
                  this.displayName = item.displayName;
                }
              }
            } else {
              this.displayName = obj['obj'].displayName!==undefined ? obj['obj'].displayName : obj['obj'];
            }
          });
        } else if (this.currentPage === 'Subscription') {
          this.localizationData = [];
          this.totalCount = 0;
          if(this.columnDef !== undefined && this.columnDef !== '' && this.columnDef !== null){
          this.sortColumnName = this.columnDef.subscriptionSortColumn;
          this.sortQuery = {};
          this.sortQuery[this.columnDef.subscriptionSortColumn] = this.columnDef.defaultSortOrder;
          }
          this.typeLocalization = 'Subscription';
          this.enableLocalizationEdit = this._capabilityService.findPropertyCapability('UISubsProperties', 'SubsProperties_Edit');
          this._utilService.subscriptionLocalization.subscribe(value => {
            if (value !== undefined && value !== null) {
              this.displayName = value['category'];
              this.productOfferId = value['specId'];
            }
          });
        } else if (this.currentPage === 'LOPIDetails') {
          this.productOfferId = this._route.snapshot.params['itemInstanceId'];
          this.enableLocalizationEdit = this._capabilityService.findPropertyCapability('UIPOGrid', 'Create');
          this.typeLocalization = 'PIDetails';
          this.piTempleteObservable = this._utilService.observeBreadCrumbApplicationLevelEvents.subscribe(obj => {
            this.displayName =  obj['PIObj'].displayName!==undefined ? obj['PIObj'].displayName : obj['PIObj'];
          });
        }
        this._infiniteService.totalPages = 0;
        this.LocalizationAsidePanel.show();
        this.showCover = true;
        this.triggerLocalizationData();
      }
    });
  }

  getGridConfigData() {
    this._utilityService.getextdata({
      data: 'localizationColumnDef.json',
      success: (result) => {
        this.columnDef = result;
        this.cols = this.columnDef.cols;
        this.loadGridData = true;
        this.loadNetworkError = false;
        this.initialize();
        this.initializeFields();
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this.loadError = true;
        this.showErrorMessage = true;
        this.loadGridData = false;
        this.loadNetworkError = true;
        this.localizationErrMsg = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
      },
      onComplete: () =>{
        this.isAllProductOfferPage = true;
        if (this.isOnLoad) {
          this.initLocalizationInAside();
          this.isOnLoad = false;
        } else if (this.loadNgxAside === true) {
          this.triggerLocalizationData();
        }
      }
    });
  }

  scrollInitialize(pagination) {
    this._infiniteService.totalPages = undefined;
    this.pagination = pagination;
  }
  scrollReset() {
    if(this.pagination !== undefined && this.pagination !== '' && this.pagination !== null){
    this.pagination = this.pagination.reset();
    }
  }

  getMoreData() {
    this._infiniteService.totalPages = undefined;
    if (!this.loading && this.localizationData !== undefined && this.pagination.scrollPageSize === this.totalPageSize) {
     this.pagination.next();
     this.getLocalizationDataType();
    }
  }

  getLocalizationDataType() {
    this.counter = this.counter < 0 ? 0 : this.counter;
    this.counter++;
    this.savelocalization === true ? this.showlocalizationSkeleton = true : this.loading = true;
    this.convertDefaultSortOrder();
    this._localizationService.localizationData({
      data: this.setSortandTableQuery(),
      success: (result) => {
        result.filter ? this.filterKeys = result.filter : this.filterKeys = undefined;
        if (this.filterKeys !== undefined) {
          this.isFilterCallTrue = this._utilityService.getLatestServiceData(this.filterKeys, this.filteredField, this.filteredValue);
        }
        if(!this.isFilterCallTrue) {
          this.localizationViewData = JSON.parse(JSON.stringify(result.records));
          this.dataSuccess(result);
          this.totalCount = result.totalCount;
          this.totalPageSize = result.totalPageSize;
          this.totalPages = result.totalPages;
          if (this.totalCount > 0) {
            this.noTableData = false;
          } else {
            this.noTableData = true;
          }
          this.refreshLocalizationDataTypeGrid(result);
        }
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this._localisedList.length = 0;
        this.filterErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
      },
      onComplete: () => {
        this.counter--;
        if (this.counter <= 0) {
          this.loading = false;
        }
        this.lazyLoad = false;
        this.calculateBreadCrumHeight();
        this.showlocalizationSkeleton = false;
        this.savelocalization = false;
        this.isFilterCallTrue = false;
      }
    });
  }
  // ngx-aside onclicking cancel button
  cancelCoverHandler() {
    if (this.isEdited) {
      this.confirmDialog = 2;
    } else {
      this.closeEditPanel(this.LocalizationAsidePanel);
    }
    this._utilService.changeGridScrollStatus(true);
  }

  onModalDialogCloseCancel(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this.cancelWithOutSaving();
      this.closeEditPanel(this.LocalizationAsidePanel);
    }
  }

  closeEditPanel(localizationPanel) {
    this.localizationFromContextbar.unsubscribe();
    this._infiniteService.totalPages =0;
    this.callGetLabels = false;
    this.isEdited = false;
    this.confirmDialog = 0;
    this.closeLocalisationAsidePanel.emit(true);
    localizationPanel.hide();
    this.showCover = false;
    this.scrollReset();
    this._utilService.checkNgxSlideModal(false);
    this.isAllProductOfferPage = false;
    this._utilService.changeLocalizationFromContextbar(false);
    if (this.currentPage === 'ProductOffer') {
      this._utilService.changedynamicSaveBtn('ProductOffer');
    } else if (this.currentPage === 'PriceableItemTemplates') {
      this._utilService.changedynamicSaveBtn('PItemplate');
    } else if (this.currentPage === 'Subscription') {
      this._utilService.changedynamicSaveBtn('subscriptionProperties');
    } else if (this.currentPage === 'LOPIDetails') {
      this._utilService.changedynamicSaveBtn('LOPIDetails');
    } else if (this.currentPage === 'Bundle') {
      this._utilService.changedynamicSaveBtn('bundle');
    }
    this._contextBarHandlerService.changeContextBarVisibility(true);
    this.checkDefaultLocale();
    if(this.columnDef !== undefined && this.columnDef !== '' && this.columnDef !== null){
      this.cols = this.columnDef.cols;
      for (const key in this.checkBoxFields) {
        if (key) {
          this.langCode = this.getLanguageCode(key);
          this.checkChange(key, this.langCode, this.checkBoxFields[key]);
        }
      }
      this.initializeFields();
    } 
    this.isDisabled = false;
    this._utilService.checkNgxSlideModal(false);
  }
  getlables() {
    this._localizationService.getLocaleLable({
      data: {},
      success: (result) => {
        this.localeFlagData = result;
        this.checkDefaultLocale();
        if (!this.changeDetectorRef['destroyed']) {
          this.changeDetectorRef.detectChanges();
        }
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this.localizationData = [];
         this.filterErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
      },
      onComplete: () => {
        this.loading = false;
        if (this.loadNgxAside === false) {
          this.getLocalizationDataType();
        } 
        this.loadFlagData = true;
      }
    });
  }
  convertDefaultSortOrder() {
    if(this.columnDef !== undefined && this.columnDef !== '' && this.columnDef !== null){
    this.convertedDefaultSortOrder = (this.columnDef.defaultSortOrder === 'asc') ? 1 : -1;
    }
  }

  clearFilters(column) {
    this.filterFields[column] = '';
    this.tableQuery[column] = '';
    this.filterData();
  }

  CaptureFocusedColumn(focusedColumn) {
    this.currentFocusedLanguage = focusedColumn;
  }

  getLanguageFilterFieldsLength() {
    let filteredLanguages = Object.keys(this.filterFields).length > 0 ? Object.keys(this.filterFields) : [];
    let numberOfFilteredLanguages = 0;

    for( let i=0; i< filteredLanguages.length; i++ ) {
      let languageFilter = filteredLanguages[i].replace('_','-');
      let languageToCheck = this._utilService.listOfLanguageFilters.indexOf(languageFilter);
      if (languageToCheck !== -1 && this.filterFields[filteredLanguages[i]] !== "" && this.filterFields[filteredLanguages[i]] !== null && this.filterFields[filteredLanguages[i]] !== undefined) {
        numberOfFilteredLanguages ++;
      }
    }
    return numberOfFilteredLanguages;
  }

  showFilterForInfo(columns, focusedColumn) {
    focusedColumn.replace('-','_');
    if ( Object.keys(this.filterFields).length > 0 ) {
      if (this.getLanguageFilterFieldsLength() > 0) {
        return (columns.length > 4 && (
        this.filterFields[focusedColumn] === '' || 
        this.filterFields[focusedColumn] === undefined || 
        this.filterFields[focusedColumn] === null));
      }
    } else {
      return false;
    }
  }

  isFilterText(column) {
    return this.filterFields[column] && this.filterFields[column].length > 0 ? true : false;
  }
  removeFilterFetchingError() {
    return this.filterErrorMessage = '';
  }
  ClearOtherLanguageFilters() {
    this._utilService.listOfLanguageFilters.forEach((language)=>{
      const mLanguage = language.replace('-','_');
       if (mLanguage !== this.currentFocusedLanguage) {
         if (this.filterFields[mLanguage] )
         delete this.filterFields[mLanguage];
       }
   });
  }

  filterData() {
    this.tableQuery = {};
    const queries = [];
    this.ClearOtherLanguageFilters();
    // tslint:disable-next-line:forin
    for (const key in this.filterFields) {
      if (this.filterFields[key] !== '' && this.filterFields[key] !== null) {
        const configField = this.FieldConfig(key);
        if (configField === null) {
          this.checkFilterLocalizedFields(queries, key, false);
        } else {
          this.tableQuery[configField] = `'%${this.filterFields[key].trim()}%'|like`;
        }
      }
    }
    this.scrollReset();
    this.getLocalizationDataType();
  }
  filterDataKeys(event, field, value) {
    this.filteredField = field;
    this.filteredValue = value;
    this._utilityService.enableFilter(event, 'localization');
  }

  setSortandTableQuery() {
    if(this.pagination !== undefined && this.pagination !== '' && this.pagination !== null){
    const widgetData = {
      param: {
        page: this.pagination.page,
        size: this.pagination.scrollPageSize
      },
      productOfferId: this.productOfferId,
      type: this.typeLocalization,
    };
    if (Object.keys(this.sortQuery).length > 0) {
      widgetData.param['sort'] = this.sortQuery;
    }
    if (Object.keys(this.tableQuery).length > 0) {
      widgetData.param['query'] = this.tableQuery;
    }
    if (this.typeLocalization !== 'Localization') {
      widgetData.param.size = this.pagination.scrollPageSize;
    }
    return widgetData;
    }
  }

  
  dataSuccess(localeData) {
    this._localisedList = localeData.records;
    if (localeData !== null && localeData !== undefined) {
      if (Object.keys(this.tableQuery).length > 0) {
        this.noFilteredTableData = localeData.totalCount > 0 ? false : true;
      } else {
        this.noTableData = localeData.totalCount > 0 ? false : true;
      }
      this.totalCount = localeData.totalCount;
    }
    if (this.filterErrorMessage) {
      this.filterErrorMessage = '';
    }
  }
  public refreshLocalizationDataTypeGrid(result) {
    if (result.totalCount > 0) {
      if (this.pagination.page === 1) {
        this.localizationData = new Array();
        this.localizedUnSavedEdit = new Array();
      }
      this.setPageProperties(result);
      this.localizationData = this.localizationData.concat(JSON.parse(JSON.stringify(result.records)));
      this.localizedUnSavedEdit = this.localizedUnSavedEdit.concat(JSON.parse(JSON.stringify(result.records)));
    } else {
      this.localizationData = [];
      this.localizedUnSavedEdit = [];
    }
  }

  setPageProperties(result) {
    this.totalCount = result.totalCount;
    this.totalPageSize = result.totalPageSize;
    this.noTableData = this.totalCount > 0 ? false : true;
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }

  checkDefaultLocale() {
    this.gridColumnOrder = {};
    for (let i = 0; i <= 2; i++) {
      if(this.cols[i] !== undefined && this.cols[i] !== '' && this.cols[i] !== null){
        this.gridColumnOrder[this.cols[i]['header']] = this._translationService.translate(this.cols[i]['key']);
      }
    }
    if(this.localeFlagData !== undefined && this.localeFlagData !== '' && this.localeFlagData !== null){
      for (const obj of this.localeFlagData) {
        if (obj['langCode']) {
          if(!this.callGetLabels){
            this.checkBoxFields[obj['description']] = (obj['langCode'] === this.cookieName) ? true : false;
          }
          if (this.cookieName === obj['langCode']) {
            this.gridColumnOrder[obj['langCode']] = this._translationService.translate(obj['description']);
          }
          if (this.checkBoxFields[obj['description']]) {
            this.dynamicArray = [];
            this.addColumn(obj['description']);
            this.inital = true;
            this.isDisabled = false;
          }
        }
      }
    }
    this.columnsOrderLanguages();
  }
  public checkChange(description, langCode, checked) {
    this.getColumnOrder(checked, langCode, description);
    this.fieldName = description;
    this.dynamicArray = (this.inital === true) ? [] : this.dynamicArray;
    //below code is added as hebrew is not coming from API,starts
    if (this.cookieName === 'he') {
      this.dynamicArray = [];
    }
    //Above code is added as hebrew is not coming from API,ends
    if (this.checkBoxFields[description]) {
      this.addColumn(description);
    }
    if (!this.checkBoxFields[description]) {
      const lngCode = this.languageCodeMap[description];
      let isDisplayPopup = false;
      if (this.editDataInfo[lngCode] !== undefined) {
        for (const key in this.editDataInfo[lngCode]) {
          if (this.editDataInfo[lngCode][key]) {
            isDisplayPopup = true;
          }
        }
      }
      if (isDisplayPopup) {
        this.displayPOPup();
      } else {
        this.removeColumn(description);
      }
    }
  }

  removeColumn(description) {
    const langCode = this.languageCodeMap[description];
    this.editDataInfo[langCode] = {};
    for (const col of this.cols) {
      const arr = description.split('-');
      if (arr.length > 1) {
        description = `${arr[0]}_${arr[1]}`;
      }
      if (col.field === description) {
        const ObjectIndex = this.cols.indexOf(col);
        this.cols.splice(ObjectIndex, 1);
        return '';
      }
    }
    this.isDisabled = false;
  }

  FieldConfig(field) {
    const fields = {
      kindType: 'kindType',
      propName: 'propName',
      property: 'property',
      desc: 'desc'
    };
    return fields[field] ? fields[field] : null;
  }

  public addColumn(name) {
    const arr = name.split('-');
    if (arr.length > 1) {
      name = `${arr[0]}_${arr[1]}`;
    }
    if (this.dynamicArray.length == 0){
    this.dynamicArrayCreation(name);
  } else {
    this.dynamicArray.forEach(element => {
      if(element.field !== name){
        this.dynamicArrayCreation(name);
      }
    });
  }
    this.dynamicArray.forEach( (element) => {
      element.style['text-align'] = (name === 'Hebrew' || name === 'Arabic')  ? 'right' : 'left';
      element.style['direction'] = (name === 'Hebrew' || name === 'Arabic')  ? 'rtl' : 'ltr';
    });
    this.cols = this.cols.concat(this.dynamicArray);
  }

  dynamicArrayCreation(name) {
    this.dynamicArray.push({
      field: name,
      header: name,
      key: 'TEXT_' + this._UpperCasePipe.transform(name),
      editable: 'true',
      filter: true,
      sortable: true,
      style: {
        'width': '190px',
        'word-wrap': 'break-word',
        'overflow': 'visible',
        'background-color': '#f2f2f2',
      }
    });
  }

  loadData(event: any) {
    if (!this.lazyLoad) {
      this.sortQuery = {};
      const queries = [];
      this.getColumnSortOrder = (event.sortOrder === 1) ? 'asc' : 'desc';
      const sortFiled = this.devideSubStrings(event.sortField);
      let configField = this.FieldConfig(sortFiled);
      if (configField === null) {
        this.checkFilterLocalizedFields(queries, sortFiled, true);
        configField = this.FieldConfig('desc');
      }
      const columnName = configField ? configField : event.sortField;
      if (columnName) {
        this.sortQuery[columnName] = this.getColumnSortOrder;
      }
      if(this._utilService.listOfLanguageFilters.indexOf(event.sortField.replace('_','-')) !== -1 && event.sortField !== this.currentFocusedLanguage){
        this.currentFocusedLanguage = event.sortField;
        this.ClearOtherLanguageFilters();
      }
      this.scrollReset();
      this.getLocalizationDataType();
    }
  }

  dataTableOnBlur(col, rowData, rowIndex, dt) {
    this.langCode = this.getLanguageCode(col.field);
    let editData = this.editDataInfo[this.langCode];
    editData = editData === null || editData === undefined ? {} : editData;
    const viewData = this.localizedUnSavedEdit[rowIndex];
    editData[rowIndex] = ((viewData.localizationMap[this.langCode] === null) ? '' : viewData.localizationMap[this.langCode]) !==
      rowData.localizationMap[this.langCode];
    this.editDataInfo[this.langCode] = editData;
    dt.onEditComplete.emit({ column: col, data: rowData, index: rowIndex });
    const i = rowData.descId + rowData.propId;
    this.editedRows[i] = rowData;
    this.disableSaveOnEdit();
  }

  processEditedData() {
    this.editedData = [];
    for (const i in this.editedRows) {
      this.editedData.push(this.editedRows[i])
    }
    if (this.editedData.length > 0) {
      this.isDisabled = true;
    }
    this.isDisabled = false;
  }

  saveLocalizationData() {
    this.processEditedData();
    if (this.editedData.length > 0) {
      this.showlocalizationSkeleton = true;
      this._utilService.changeGridScrollStatus(true);
      setTimeout(() => { this.persistLocalizationData(this.editedData, true), 10 });
    }
  }

  saveGlobalLocalization() {
    this.savelocalization = true;
    this.processEditedData();
    if (this.editedData.length > 0) {
      setTimeout(() => { this.persistLocalizationData(this.editedData, false), 10 });
    }
  }

  persistLocalizationData(data, isSaveable) {
    this.checkIsEdited(false);
    this._localizationService.saveLocalizationData({
      data: {
        body: data,
        param: { selectedLangs: Object.keys(this.orderLanguages) }
      },
      success: (result) => {
        this.scrollReset();
        if (this.loadNgxAside === false) {
          this.getLocalizationDataType();
        }
        this.editedRows = {};
        this.editedData = [];
        this.editDataInfo = {};
        this._utilService.checkNgxSlideModal(false);
        this.checkIsEdited(false);
      },
      failure: (error) => {
      },
      onComplete: () => {
        if (isSaveable) {
          this.showlocalizationSkeleton = false;
          if (this.currentPage === 'ProductOffer') {
            this._utilService.changeProperties({isPO: true, isBundle: false});
          } else if (this.currentPage === 'PriceableItemTemplates') {
            this._piTemplateDetailsService.changeIsPItemplateDetailsUpdated(true);
          } else if (this.currentPage === 'Subscription') {
            this._utilService.changedynamicSaveBtn('subscriptionProperties');
            this._utilService.changeSubsciptionProperties(true);
          } else if (this.currentPage === 'LOPIDetails') {
            this._priceableItemDetailsService.changeIsPriceableItemUpdated(true);
          } else if (this.currentPage === 'Bundle') {
            this._utilService.changeProperties({isPO: false, isBundle: true});
          }
          this.removeColumn(this.fieldName);
          this.closeEditPanel(this.LocalizationAsidePanel);
        }
      }
    });
  }

  displayPOPup() {
    this.confirmDialog = 1;
  }

  getDeviceWidth() {
    return window.innerWidth + 'px';
  }

  onModalDialogCloseCancelSave(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this.deSelectWithOutSaving();
    } else if (event.index === 2) {
      this.checkBoxFields[this.fieldName] = true;
    }
  }

  ngAfterViewInit() {
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }
  refreshData() {
    this.callGetLabels = true;
    this.loadGridData = false;
    this.showErrorMessage = false;
    this.getGridConfigData();
    this.setSubscriptionSort();
  }

  setSubscriptionSort() {
    if (this.currentPage === 'Subscription') {
      this.sortColumnName = this.columnDef.subscriptionSortColumn;
      this.sortQuery = {};
      this.sortQuery[this.columnDef.subscriptionSortColumn] = this.columnDef.defaultSortOrder;
   }
  }

  initializeFields() {
    this.editedData = [];
    this.filterFields = {};
    this.sortQuery = {};
    this.tableQuery = {};
    this.editDataInfo = {};
    this.noTableData = false;
    this.noFilteredTableData = false;
    this.convertedDefaultSortOrder = this.columnDef.defaultSortOrder;
    this.sortQuery[this.columnDef.defaultSortColumn] =  this.columnDef.defaultSortOrder;
    this.sortColumnName = this.columnDef.defaultSortColumn;
    this.checkIsEdited(false);
    this.setSubscriptionSort();
  }

  canDeactivate() {
    if (this.isEdited && (!this.savelocalization)) {
      const data = {
        url: this.nextStateUrl,
      };
      this._utilService.changePreventUnsaveChange(data);
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    if (this.localizationSubscriptions) {
      this.localizationSubscriptions.unsubscribe();
    }
    if (this.localizationFromContextbar) {
      this.localizationFromContextbar.unsubscribe();
    }
    if (this.isDonotSavePopupLocalization) {
      this.isDonotSavePopupLocalization.unsubscribe();
    }
    if (this.currentDisplayName) {
      this.currentDisplayName.unsubscribe();
    }
    if (this.currentpagestatus) {
      this.currentpagestatus.unsubscribe();
    }
    if (this.piTempleteObservable) {
      this.piTempleteObservable.unsubscribe();
    }
    if (this.isCancelLocalization) {
      this._utilService.checkCancelLocalization(false);
    }
    this._utilService.checkIsSaveButtonClickedLocalization(false);
    this.changeDetectorRef.detach();
    this._utilService.changeProperties({isPO: false, isBundle: false});
    this._utilService.changeSubsciptionProperties(false);
    this._priceableItemDetailsService.changeIsPriceableItemUpdated(false);
    this._utilService.checkCallFilterData('');
  }
  exportToCSV() {
    this.loading = true;
    this.confirmDialog = 0;
    this.confirmDialogDownload = 0;
    this._localizationService.exportToCSV({
      data: this.setExportSortTableQuery(),
      success: (result) => {
        this._utilityService.downloadFile(result, 'export.csv');
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this.loadError = false;
        this.showErrorMessage = true;
        this.localizationErrMsg = this._utilityService.errorCheck(code, errorMsg, 'DOWNLOAD');
      },
      onComplete: () => {
        this.loading = false;
      }
    });
  }
  getColumnOrder(checked, langCode, description) {
    if (checked) {
      this.gridColumnOrder[langCode] = this._translationService.translate(this._translationService.translate(description));
    } else {
      delete this.gridColumnOrder[langCode];
      delete this.orderLanguages[langCode];
    }
    this.columnsOrderLanguages();
  }
  checkFilterLocalizedFields(queries, key, isSorting) {
    key = this.devideSubStrings(key);
    for (const obj of this.localeFlagData) {
      if (obj['description'] === key) {
        this.langCodeId = obj['langCodeId'];
        const selectedColumn = key.replace('-', '_');
        this.filterFields.hasOwnProperty(selectedColumn) && this.filterFields[key] !== '' ?
        queries.push({ langCodeId: `${this.langCodeId}`, desc: `'%${this.filterFields[selectedColumn].trim()}%'|like` }) :
        queries.push({ langCodeId: `${this.langCodeId}`});
        if (this.filterFields[key] === '') {
          let index;
          for (const item of queries) {
            if (Number(item.langCodeId) === this.langCodeId && !isSorting) {
              index = queries.indexOf(item);
              queries.splice(index, 1);
            }
          }
        }
      }
    }
    if (queries.length > 0) {
      this.tableQuery['query'] = queries;
    }
  }
  languageClick() {
    return true;
  }
  displayDownload() {
        this.isDownload = true;
        if (this.isEdited === undefined || this.isEdited === null || this.isEdited === false) {
          this.confirmDialog = 3;
        } else {
          this.confirmDialogDownload = 1;
        }
        this.getCsvColumns();
  }
  onModalDialogDownloadClose(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this.exportToCSV();
    }
  }
  onModalDialogDownloadSaveClose(event) {
    this.confirmDialogDownload = 0;
    if (event.index === 1) {
      this.SaveLocalizationUpdate();
    }
  }
  SaveLocalizationUpdate() {
    this._utilService.checkIsSaveButtonClickedLocalization(true);
    this.confirmDialog = 3;
    if (this.isDownload === true && this.isEdited === true) {
      this.checkIsEdited(false);
    }
  }
  getCsvColumns() {
    this.csvDefaultColumns = [];
    this.csvDefaultColumns.push(this._translationService.translate('TEXT_OBJECT_TYPE'));
    this.csvDefaultColumns.push(this._translationService.translate('TEXT_OBJECT_NAME'));
    this.csvDefaultColumns.push(this._translationService.translate('TEXT_PROPERTY_NAME'));
    this.csvDefaultColumns.push(this._translationService.translate('TEXT_DESC_ID'));
  }
  // set empty for page and size while export
  setExportSortTableQuery() {
    const widgetData = {
      param: {},
      productOfferId: this.productOfferId,
      type: this.typeLocalization,
      body: this.gridColumnOrder
    };
    if (Object.keys(this.sortQuery).length > 0) {
      widgetData.param['sort'] = this.sortQuery;
    }
    if (Object.keys(this.tableQuery).length > 0) {
      widgetData.param['query'] = this.tableQuery;
    }
    return widgetData;
  }
  deSelectWithOutSaving() {
    this.removeColumn(this.fieldName);
    const langCode = this.getLanguageCode(this.fieldName);
    for (const i in this.localizedUnSavedEdit) {
      if (this.localizedUnSavedEdit[i]) {
        this.localizationData[i].localizationMap[langCode] = this.localizedUnSavedEdit[i].localizationMap[langCode];
      }
    }
    this.dt.onEditComplete.emit({ column: langCode, data: this.localizationData });
    this.disableSaveOnEdit();
  }
  cancelWithOutSaving() {
    this.editDataInfo = {};
    this.reinstateLocaleData();
  }
  devideSubStrings(name) {
    let arr = name.split('_');
    if (arr.length > 1) {
      arr = `${arr[0]}-${arr[1]}`;
      return arr;
    } else {
      return name;
    }
  }

  openUploadDialog() {
    if (this.isEdited) {
      this.confirmDialog = 4;
    } else {
      this.showFileSelectDialog();
    }
  }

  showFileSelectDialog() {
    this.csvUploadElement.nativeElement.click();
  }

  uploadWithoutSaving(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this.showFileSelectDialog();
      this.getLocalizationDataType();
    }
  }

  confirmUpload(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this.uploadLocalizationCSV();
    } else {
      this.resetUploadInput();
    }
  }

  onUploadComplete(event) {
    this.confirmDialog = 0;
  }

  initiateUpload(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.selectedFile = fileList[0];
      this.uploadedFileName = this.selectedFile.name;
      this.confirmDialog = 5;
    }
  }

  uploadLocalizationCSV() {
    this.loading = true;
    this._localizationService.importToCSV({
      data: {
        body: this.selectedFile,
        sendFormData: true
      },
      success: (result) => {
        this.recordsUpdated = result;
        if (typeof result === 'object' && result !== null) {
          this.uploadError = JSON.parse(result.message);
          this.partialErrorObj = this.uploadError.errorJsonData['row-n_descId'];
          this.confirmDialog = 8;
        } else {
          this.getLocalizationDataType();
          this.confirmDialog = 7;
        }
      },
      failure: (error, code) => {
        if(code === 400 || code === '' || code === undefined || code === null){
          this.loadError = false;
        this.showErrorMessage = true;
        this.localizationErrMsg = this._utilityService.errorCheck(code, error, 'UPLOAD');
        }
        else {
        this.recordsUpdated = 0;
        // This is added only to mitigate the issue of polyfills issue(IE11) while handling JSON string response. Once Angular updates to 5.x this should be removed. This is a temporary fix
        if (error.includes('Server')) {
          this._utilityService.jsonParsedError.subscribe(value => {
            if (value) {
              error = JSON.parse(value);
            }
            this.uploadError = JSON.parse(error.message);
            if (this.uploadError !== undefined && typeof this.uploadError === 'object') {
              this.handleUploadErrorResponse(this.uploadError);
            } else {
              this.handleErrorString(this.uploadError);
            }
          }) // End of polyfills issue
        } else if (this._utilityService.IsJsonString(error)) {
          this.uploadError = JSON.parse(error);
          if (this.uploadError !== undefined && typeof this.uploadError === 'object') {
            this.handleUploadErrorResponse(this.uploadError);
          }
        } else {
          this.handleErrorString(this.uploadError);
        }
        if (JSON.stringify(error).indexOf('DUPLICATE_ROW_ERROR') !== -1) {
          this.duplicateErrorObj = this.uploadError.errorJsonData['descId-row-count'];
          this.uploadErrorCount = Object.keys(this.uploadError.errorJsonData['descId-row-count']).length;
          this.confirmDialog = 8;
        } else {
          this.confirmDialog = 6;
        }
      }
      },
      onComplete: () => {
        this.loading = false;
        this.resetUploadInput();
      }
    });
  }

  handleUploadErrorResponse(errorObject) {
    if (errorObject.errorJsonData.hasOwnProperty('ObjectType')) {
      this.uploadErrObj = this.filterObjectProperties(errorObject.errorJsonData, this.displayErrorProperties);
      this.isHeadersError = false;
    } else {
      this.handleErrorString(errorObject);
    }
  }

  handleErrorString(errorObject) {
    this.isHeadersError = true;
    this.uploadError.ErrorMessage = errorObject.errorJsonData.errorMsg;
  }

  filterObjectProperties(errObj, propertyList) {
    const filteredObj = {};
    propertyList.forEach(element => {
      filteredObj[element] = errObj[element];
    });
    return filteredObj;
  }

  resetUploadInput() {
    if (this.csvUploadElement !== undefined) {
      this.csvUploadElement.nativeElement.value = null;
    }
  }
  columnsOrderLanguages() {
    this.orderLanguages = {};
    const keys = Object.keys(this.gridColumnOrder);
    for (let i = 3; i < keys.length; i++) {
      this.orderLanguages[keys[i]] = keys[i];
    }
  }
  getLanguageCode(fieldName) {
    let languageCode;
    switch (fieldName) {
      case 'Spanish_Mexican':
        languageCode = this.languageCodeMap['Spanish-Mexican'];
        break;
      case 'Portuguese_Brazil':
        languageCode = this.languageCodeMap['Portuguese-Brazil'];
        break;
      default:
        languageCode = this.languageCodeMap[fieldName];
    }
    return languageCode;
  }
  resetLocalizedData() {
    this.editDataInfo = {};
    for (const obj of this.localeFlagData) {
      if (obj['langCode']) {
        let checked: boolean;
        if (obj['langCode'] === this.cookieName) {
          checked = true;
        } else {
          Boolean(checked);
          this.removeColumn(obj['description']);
        }
        this.checkBoxFields[obj['description']] = checked;
      }
    }
    this.reinstateLocaleData();
    this.checkIsEdited(false);
  }
  checkIsEdited(value) {
    this.isDisabled = value;
    this.isEdited = value;
    this._utilService.changelocalizationChanges(value);
  }
  disableSaveOnEdit() {
    let identified = false;
    for (const key in this.editDataInfo) {
      if (this.editDataInfo[key] && !identified) {
        for (const reqKey in this.editDataInfo[key]) {
          if (this.editDataInfo[key][reqKey]) {
            identified = true;
            this.checkIsEdited(true);
            break;
          }
        }
      }
    }
    if (!identified) {
      this.checkIsEdited(false);
    }
  }

  getErrorMessageType() {
    const filterCriteriaLength = !this._utilityService.isObject(this.tableQuery) ? 0 : Object.keys(this.tableQuery).length;
    if (this.loading) {
      return 0;
    }
    if (this.filterErrorMessage) {
      return 1;
    } else if (this._localisedList.length === 0 && this._localisedList !== undefined && filterCriteriaLength === 0) {
      if (this.filterErrorMessage === '') {
        return 2;
      }
      } else if(this._localisedList.length === 0 && this._localisedList !== undefined && filterCriteriaLength > 0){
        return 3;
      }
    return 0;
  }

  reinstateLocaleData() {
    this.localizationData.length = 0;
    this.localizationData = this.localizationData.concat(JSON.parse(JSON.stringify(this.localizedUnSavedEdit)));
  }
}
