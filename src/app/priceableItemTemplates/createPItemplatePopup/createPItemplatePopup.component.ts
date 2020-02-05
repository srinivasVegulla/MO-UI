import { Component, EventEmitter, ViewChild, OnInit, Input, Output, OnDestroy } from '@angular/core';
import { PriceableItemTemplateService } from '../../priceableItemTemplates/priceableItemTemplate.service';
import { UtilityService } from '../../helpers/utility.service';
import { Language } from 'angular-l10n';
import { DropdownModule, SelectItem } from 'primeng/primeng';
import { utilService } from '../../helpers/util.service';

@Component({
  selector: 'ecb-create-pitemplate',
  templateUrl: './createPItemplatePopup.component.html',
  providers: []
})

export class CreatePItemplatePopupComponent implements OnInit, OnDestroy {

  @Language() lang: string;
  piTemplateColumns;
  piTemplateError;
  filterFields;
  filterQuery;
  sortQuery;
  isFilterCriterialProcessing;
  showErrorMessage;
  inUseOffers;
  showInUseOfferings;
  createPiColumnDef;
  loading: boolean;
  availableChargeTypes = [];
  confirmDialog;
  inUseOfferingsSubscribe: any;
  selectedOfferings;
  offeringLocation;
  isPItemplate;
  templateId;
  availableChargeTypesFetching;
  availableChargeTypesErrorMessage;
  availableChargeTypesCount;
  selectedType;
  rowIndex;
  isSaveEnabled;
  selectedUsageType;
  usageTypes;
  PItypeKeys;
  usageFirstName: string;
  loadGridData = false;
  getColumnSortOrder;
  filteredField: any;
  filteredValue: any;
  isFilterCallTrue: boolean;
  filterKeys: any;

  @Output() isCreatePopupClosed = new EventEmitter();
  @Output() OpenCreatePanel = new EventEmitter();

  constructor(private _piTemplateService: PriceableItemTemplateService,
    private _utilityService: UtilityService,
    private _utilService: utilService) {
    this.reset();
    this.confirmDialog = 1;
  }

  ngOnInit() {
    this.getGridConfigData();
    this.loading = true;
    this.availableChargeTypesCount = 0;
    this.getTypes();
    this._utilService.callFilterData.subscribe(value => {
      if (value === 'createPItemplate') {
        this.prepareFilterQuery();
      }
    });
  }

  getGridConfigData() {
    this._utilityService.getextdata({
      data: 'createPItemplateColumnDef.json',
      success: (result) => {
        this.createPiColumnDef = result;
        this.piTemplateColumns = this.createPiColumnDef.cols;
        this.sortQuery[this.createPiColumnDef.defaultSortColumn] = this.createPiColumnDef.defaultSortOrder;
        this.getPriceableItemTypes();
        this.loadGridData = true;
      },
      failure: (error) => {
        this.availableChargeTypesErrorMessage = error;
        this.loadGridData = false;
        this.loading = false;
      }
    });
  }

  getTypes() {
    this._piTemplateService.createPItemplateTypes({
      data: '',
      success: (result) => {
        this.PItypeKeys = Object.keys(result);
        this.usageTypes = [];
        this.usageTypes.push({ label: 'TEXT_SELECT_CRITERIA', value: 'Select' });
        this.usageTypes.push({ label: '', value: '' });
        for (let key of this.PItypeKeys) {
          this.usageTypes.push({ label: result[key], value: key });
        }
        this.usageFirstName =  this.usageTypes[0].value;
      },
      failure: (error) => {
        this.usageTypes = [];
      }
    });
  }

  setSelectedType(idx) {
    this.rowIndex = idx;
    this.selectedType = this.availableChargeTypes[idx];
    this.isSaveEnabled = true;
  }

  openCreateForm() {
    document.body.classList.remove('ecb-body-modal-dialog');
    this.isCreatePopupClosed.emit(true);
    this.OpenCreatePanel.emit(this.selectedType);
  }

  closeCreateForm() {
    document.body.classList.remove('ecb-body-modal-dialog');
    this.isCreatePopupClosed.emit(true);
    this.isSaveEnabled = false;
    this._utilService.checkCallFilterData('');
  }

  public reset() {
    this.availableChargeTypes = [];
    this.availableChargeTypesErrorMessage = null;
    this.filterFields = {};
    this.filterQuery = {};
    this.sortQuery = {};
    this.isFilterCriterialProcessing = false;
    this.availableChargeTypesFetching = false;
  }

  public prepareFilterQuery() {
    this.filterQuery = {};
    for (const key in this.filterFields) {
      const dLangProperty = this._utilityService.dLangPropertyNames(key);
      if (dLangProperty) {
      if (this.filterFields[key].trim() !== '') {
        this.filterQuery[dLangProperty] = this.filterFields[key].trim();
       } 
    } else {
      if(this.filterFields[key].trim() !== '') {
        this.filterQuery[key] = `'%${this.filterFields[key].trim()}%'|like`;
      }
    }
  }
    if (this.selectedUsageType) {
      this.filterQuery['kind'] = this.selectedUsageType;
    }
    this.getPriceableItemTypes();
  }
  filterDataKeys(event, field, value) {
    this.filteredField = field;
    this.filteredValue = value;
    this._utilityService.enableFilter(event, 'createPItemplate');
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
    this.prepareFilterQuery();
  }

  isFilterText(column) {
    return this.filterFields[column] && this.filterFields[column].length > 0 ? true : false;
  }

  loadData(event) {
    this.rowIndex = '';
    this.sortQuery = {};
    this.getColumnSortOrder = (event.sortOrder == 1) ? "asc" : "desc";
    const dLangProperty = this._utilityService.dLangPropertyNames(event.sortField);
    if (dLangProperty !== null) {
      this.sortQuery[dLangProperty] = this.getColumnSortOrder;
    } else {
      this.sortQuery[event.sortField] = this.getColumnSortOrder;
    }
    this.getPriceableItemTypes();
  }

  getPriceableItemTypes() {
    this.loading = true;
    this.confirmDialog = 1;
    this.isSaveEnabled = false;
    this.availableChargeTypesFetching = true;
    const widgetData = {
      param: {
        page: 1,
        size: 200
      },
    };
    if (Object.keys(this.sortQuery).length > 0) {
      widgetData.param['sort'] = this.sortQuery;
    }
    if (Object.keys(this.filterQuery).length > 0) {
      widgetData.param['query'] = this.filterQuery;
    }
    this._piTemplateService.getChargeTypes({
      data: widgetData,
      success: (result) => {
        this.loading = true;
        result.filter ? this.filterKeys = result.filter : this.filterKeys = undefined;
        if (this.filterKeys !== undefined) {
            this.isFilterCallTrue = this._utilityService.getLatestServiceData(this.filterKeys, this.filteredField, this.filteredValue);
        }
        if(!this.isFilterCallTrue) {
          this.availableChargeTypes = result.records;
        }
        this.availableChargeTypesCount = result.totalCount;
      },
      failure: (error) => {
        this.loading = false;
        this.availableChargeTypesErrorMessage = error;
      },
      onComplete: () => {
        this.loading = false;
        this.availableChargeTypesFetching = false;
        this._utilityService.hideSkeleton('offeringsSkeleton');
      }
    });
  }

  getDeviceWidth() {
    return window.innerWidth + 'px';
  }

  getErrorMessageType() {
    const filterCriteriaLength = !this._utilityService.isObject(this.filterQuery) ? 0 : Object.keys(this.filterQuery).length;
    this.showErrorMessage = true;
    if (this.availableChargeTypesFetching) {
      return 0;
    }
    if (this.availableChargeTypesErrorMessage) {
      return 1;
    } else if (this.availableChargeTypes.length === 0 && filterCriteriaLength === 0) {
      return 2;
    } else if (this.availableChargeTypes.length === 0 && filterCriteriaLength > 0) {
      return 3;
    }
    return 0;
  }

  ngOnDestroy() {
    if (this.inUseOfferingsSubscribe) {
      this.inUseOfferingsSubscribe.unsubscribe();
    }
  }

  onModalDialogClose(event) {
    this.confirmDialog = 0;
    this.availableChargeTypes = [];
    this.availableChargeTypesErrorMessage = null;
    this.filterFields = {};
    this.filterQuery = {};
    this.sortQuery = {};
    this.isFilterCriterialProcessing = false;
    this.availableChargeTypesFetching = false;
    this.isCreatePopupClosed.emit(true);
  }
  changeUsageType(selectedPI) {
    this.selectedUsageType = selectedPI;
    this.prepareFilterQuery();
  }
}
