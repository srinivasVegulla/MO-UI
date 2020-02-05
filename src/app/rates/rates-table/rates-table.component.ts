import { Component, OnInit, OnDestroy, Input, HostListener, ViewChild } from '@angular/core';
import { utilService } from '../../helpers/util.service';
import { RatesService } from '../rates.service';
import { showOperatorPipe } from '../../helpers/showOperator.pipe';
import { ISubscription } from 'rxjs/Subscription';
import { modalService } from '../../helpers/modal-dialog/modal.service';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Translation, TranslationService, LocaleService } from 'angular-l10n';
import { calenderLocaleFeilds } from '../../../assets/calenderLocalization';
import { UtilityService } from '../../helpers/utility.service';
import { HttpClient } from '@angular/common/http';
import { NullTemplateVisitor } from '@angular/compiler';
import { CalendarsService } from '../../Calendars/calendars-list.service';
import { CapabilityService } from '../../helpers/capabilities.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'ecb-rates-table',
  templateUrl: './rates-table.component.html',
  styleUrls: ['./rates-table.component.scss'],
  providers: [showOperatorPipe]
})
export class RatesTableComponent implements OnInit, OnDestroy {
    pricelistId: () => any;
  showApprovalPanel: boolean;
    param(): any {
        throw new Error("Method not implemented.");
    }

  selectedSchedule: any;
  rateTableData: any[];
  rateTableCols: any[] = [];
  rateTableEditCols: any[] = [];
  rateTableDataList: any[] = [];
  rateTableEditDataList: any[] = [];
  rateTableDataListPrior: any[] = [];
  rateTableEditDataListImport: any[] = [];
  rateTableEditDataListPrior: any[] = [];
  rateTableDataListBeforeDrag: any[] = [];
  showIfBlock = false;
  rateTableLoading = false;
  rateTableFetchError: string = '';
  loading : boolean;
  showEmptyMessage = false;
  rulesCount = 1;
  rateTableSubscriptions: ISubscription;
  tooltipIndex;
  finalQuery = '';
  rateId: any;
  rowIndex: any;
  showAuditColumn = false;
  errorMessage: string;
  delteRateObj: any;
  deleteRowIndex: any;
  widgetEvents: any[] = [];
  parameterTableMetaData: any;
  conditions: any[];
  editCondtions: any[];
  actions: any[];
  rateTableInfo: any;
  properties: any;
  showCover = false;
  metaDataAsPerRuleName: any = {};
  columnOperators: any = {};
  isSaveEnabled = false;
  conditionOpsList: any[] = [];
  isRulesSaving = false;
  saveRulesError = '';
  tableCellError = null;
  rateTableErrorCol: any = null;
  rateTableToolTipIndex: any = null;
  editRateTable: any;
  disableEdit;
  staticLocalizedCols: any[] = ['TEXT_IF', 'TEXT_THEN', 'TEXT_OPERATOR', 'TEXT_ACTIONS'];
  ruleMiscproperties: any[] = ['order', 'error', 'default', 'drag'];
  staticColumns: any = {
    'IF': this.staticLocalizedCols[0],
    'THEN': this.staticLocalizedCols[1],
    'OPERATOR': this.staticLocalizedCols[2],
    'ACTIONS': this.staticLocalizedCols[3],
    'MOVE': ' '
  };
  actionsList: any[] = [];
  conditionsList: any[] = [];
  hasDefaultRate: boolean = false;
  hasDefaultRateEdit:boolean = false;
  showErrorMsg: boolean = false;
  showErrorMsgForDelete: boolean = false;
  addTooltip;
  deleteTooltip;
  editTooltip;
  moveTooltip;
  localeDateFormat: any;
  calenderLocale;
  currentLocale;
  isdraggedHighlightRecord = false;
  confirmDialog: number;
  copyRateSchedules: boolean;
  rateTitle: string;
  isDefaultRateAllowed = true;
  xmlResultJson: string;
  existingRuleCount: number;
  importRuleCount: number;
  @ViewChild('btnUpload') btnUpload: any;
  @Input() type;
  calendarOptions: any[];
  ratesCapabilities = {};
  sharedRatesTableCapabilities = {};
  editRatesCapability = false;
  deleteRatesCapability = true;
  download_View = true;
  upload_View = true;
  deleteFromEditScreen = false;
  showRateTableSkeleton = false;
  deleteTabIndex = 0;
  isRatesFormDirty: boolean = false;
  loadProperties;
  rulesManditoryCheck: any;
  isHavingConditionColumn = false;
  hasDefaultRatePrior: boolean;
  isSaveClicked = false;
  isAddClicked = false;
  defaultRateRecords: any[];
  showErrorMessage: boolean;
  approvalMapping:any = {};
  warningMessage: string = '';
  isRatesUpdateApproval: boolean = false;
  enableApprovalsEdit: boolean = false;
  warningStyle: string = '';
  isPendingApproval: boolean = false;
  currentView: string = 'PIRates';
  isApprovalEdited: boolean = false;
  nextStateUrl: string = '';

  constructor(private _utilService: utilService,
    private _ratesService: RatesService,
    private _showOperator: showOperatorPipe,
    private _modalService: modalService,
    private _dragulaService: DragulaService,
    private _translationService: TranslationService,
    private locale: LocaleService,
    private _UtilityService: UtilityService,
    private _http: HttpClient,
    private _calendarService: CalendarsService,
    private _capabilityService: CapabilityService,
    private _router: Router) {
    this.confirmDialog = 0;
    _dragulaService.drop.subscribe((value) => {
      const [el, record] = value;
      const isReverted = this.onRowMove();
      this.clearDrag();
      if (!isReverted) {
        this.isdraggedHighlightRecord = true;
        this.rateTableEditDataList[record.rowIndex - 1]['drag'] = true;
      }
    });
    _dragulaService.drag.subscribe((value) => {
      this.rateTableDataListBeforeDrag = JSON.parse(JSON.stringify(this.rateTableEditDataList));
    });

    this.widgetEvents = [];
    this.showRateTable();
    this.addTooltip = this._translationService.translate('TEXT_ADD');
    this.deleteTooltip = this._translationService.translate('TEXT_DELETE');
    this.editTooltip = this._translationService.translate('TEXT_EDIT');
    this.moveTooltip = this._translationService.translate('TEXT_MOVE');
  }

  @Input() set rateInfo(rateTable) {
    this.disableEdit = (rateTable.pricelistType === 'REGULAR');
    if (rateTable != null) {
      this.rateTableInfo = rateTable;
    }
  }

  @Input() set loadRateProperties(properties) {
    this.loadProperties = properties;
  }

  @Input() set editRateSource(value) {	
    if (value === true) {    	
      this.rateTableLoading = true;	
     }  	
    this.loading = false; 	
  } 	

  @Input() set ratesTableOnLoading(value) {	
    if (value === true && !this.rateTableLoading) {    	
      this.loading = true;	
    }   	
   } 

  ngOnInit() {
    this.currentLocale = this.locale.getCurrentLocale();
    this.calenderLocale = calenderLocaleFeilds[this.currentLocale];
    this.localeDateFormat = this.calenderLocale.localeDateFormat;
    this._ratesService.isCopyRates.subscribe(value => {
      if (value) {
        this.getAllRules();
      }
    });
    this.getCalendarLists();
    if (this.type === 'Ratedetails') {
      this.ratesCapabilities = this._capabilityService.getWidgetCapabilities('UIPIDetailsPage');
    } else if (this.type === 'SharedPriceDetails') {
      this.ratesCapabilities = this._capabilityService.getWidgetCapabilities('UISharedRateDetailsPage');
    }
    this.editRatesCapability = this.isCapableOf(this.ratesCapabilities, 'Rates_Edit');
    this.download_View = this.isCapableOf(this.ratesCapabilities, 'download_View');
    this.upload_View = this.isCapableOf(this.ratesCapabilities, 'upload_View');
    this.currentView = (this.type === 'SharedPriceDetails') ? 'sharedRates' : 'PIRates';
    this._router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(value => {
        this.nextStateUrl = value['url'];
      });
  }  
  isCapableOf(capability, item) {
    if (Object.keys(capability).length > 0) {
      return capability.hasOwnProperty(item) ?
        (capability[item] === null && this._UtilityService.isObject(item) ? true : capability[item]) : false;
    }
  }


  @HostListener('document:click', ['$event'])
  function(event) {
    if (this.isdraggedHighlightRecord) {
      this.clearDrag();
      this.isRatesFormDirty = true;
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event): void {
      if (event.keyCode === 32 && this._UtilityService.isObject(document.getElementById('ecb-rateTableEdit'))) {
        if (event.target.className.includes('fa-plus')) {
          this.addRateRow(event.target.id, null, false);
        } else if (event.target.className.includes('fa-times-circle')) {
          const index = Number(event.target.id);
          this.deleteRateModel(this.rateTableEditDataList[index], index);
        }
      } else if (event.keyCode === 27) {
        if (this.confirmDialog === 0 && this._UtilityService.isObject(document.getElementById('ecb-rateTableEdit'))) {
          this.cancelCoverHandler();
        } else {
          this.confirmDialog = 0;
        }
      }
  }

  getRowClass(data, index) {
    if (data !== undefined && data['default'] !== undefined) {
      let rowClass = data['default'] ? ' ecb-rateDefaultRow' : '';
      if (data['drag'] === true) {
        rowClass += ' gu-transit-f';
      }
      return data.error ? 'errorDeleteRates' + rowClass : rowClass;
    }   
  }

  deleteRateFromList(order, rowIndex) {
    this.removeRecordFromView(rowIndex - 1);
    this.setFocusColumn(order - 1);
  }

  clearDrag() {
    this.isdraggedHighlightRecord = false;
    for (const i in this.rateTableEditDataList) {
      if (this.rateTableDataList[i] !== undefined) {
        this.rateTableEditDataList[i].drag = false;
      }
    }
    this.rateTableEditDataList = JSON.parse(JSON.stringify(this.rateTableEditDataList));
  }

  showRateTable() {
    this.rateTableSubscriptions = this._utilService.rateSchedulerID.skip(1).subscribe(value => {
      if (value && value['schedule']) {
        this.rateTableInfo = value;
        this.getAllRules();
      }
      this.rateTitle = this._UtilityService.getDateDescription(this.selectedSchedule);
    });
    this.widgetEvents.push(this.rateTableSubscriptions);
  }

  getAllRules() {
    if (this.loadProperties != null) {
      this.parameterTableMetaData = this.loadProperties;
    } else {
      this.parameterTableMetaData = this.rateTableInfo['parameterTableMetaData'];
    }
    this.metaDataAsPerRuleName = this.setMetaDataAsperColName(this.parameterTableMetaData);
    this.showEmptyMessage = false;
    this.selectedSchedule = this.rateTableInfo['schedule'];
    if(!this.loading) {	   
      this.rateTableLoading = true;	
    }
    const widgetData = {
      selectedScheduleId: this.selectedSchedule['schedId'],
      param: {}
    };
    if (this.selectedSchedule['ptName'] !== null && this.selectedSchedule['ptName'] !== undefined) {
      widgetData.param['ptName'] =  this.selectedSchedule['ptName'];
    }
    else {
      widgetData.param['ptName'] =  this.rateTableInfo['ptName'];
    }
    this._ratesService.getRateTables({
      data: widgetData,
      success: (result) => {
        if (Object.keys(result.utilityMap).length > 0) {
          this.approvalMapping = result.utilityMap;
          this.enableApprovalsEdit = !this.approvalMapping['enableApprovalsEdit'];
          this.isRatesUpdateApproval = ((this.isCapableOf(this.ratesCapabilities, 'View_Approvals')) 
                                        && this.approvalMapping['hasPendingApprovals']);
          this.isPendingApproval = this.approvalMapping['hasPendingApprovals'];
          if (this.approvalMapping['approvalsWarningMsg'] === 'allowMoreThanOneTrue') {
            this.warningMessage = this._translationService.translate('TEXT_MULTI_APPROVAL_RATE_MESSAGE');
            this.warningStyle = 'col-md-offset-3 col-md-6';
          } else {
            this.warningMessage = this._translationService.translate('TEXT_SINGLE_APPROVAL_RATE_MESSAGE');
            this.warningStyle = 'col-md-offset-1 col-md-10';
          }
        }
        this.rateTableData = result.records;
        if (result.records) {
          this.rateTableInfo['schedule'].rulesCount = (result.records).length;
          this.existingRuleCount = (result.records).length;
          this.importRuleCount = (result.records).length;
        }
        for (let index = 0; index < this.rateTableData.length; index++) {
          this.rateTableData[index]['removeRateCapability'] = false;
        }
        JSON.parse(JSON.stringify(this.rateTableData));
        if (this.rateTableData !== undefined && (this.rateTableData === null || this.rateTableData.length === 0)) {
          this.showEmptyMessage = true;
        }
        this.setRateTableColsDef(this.rateTableData, this.parameterTableMetaData);
      },
      failure: (errorMsg: string, code: any) => {
        this.setRateTableColsDef([], this.parameterTableMetaData);
        let errorMessage = this._UtilityService.errorCheck(code, errorMsg, 'LOAD');
        this.handleError(errorMessage);
        this.showErrorMsg = true;
      },
      onComplete: () => {
        this.rateTableLoading = false;
        this.loading = false;
      }
    });
  }

  handleError(err) {
    this.rateTableFetchError = err;
  }

  setMetaDataAsperColName(parameterTableMetaData) {
    const metaDataAsPerRuleName = [];
    for (const index in parameterTableMetaData) {
      if (parameterTableMetaData[index]) {
        const property = Object.assign({}, parameterTableMetaData[index]);
        const enums = [];
        if (property.enumData) {
          for (const i in property.enumData) {
            if (property.enumData[i] !== undefined) {
              const obj = {
                'label': property.enumData[i].name,
                'value': property.enumData[i].name
              };
              enums.push(obj);
            }
          }
          property['enumData'] = enums;
        } else if (property.dataType === 'char' || property.dataType === 'boolean') {
          enums.push({ 'label': 'false', 'value': false });
          enums.push({ 'label': 'true', 'value': true });
          property['enumData'] = enums;
        }
        metaDataAsPerRuleName[parameterTableMetaData[index]['name']] = property;
      }
    }
    return metaDataAsPerRuleName;
  }

  getOperator(text) {
    return this._showOperator.transform(text);
  }

  // This function will return metadata of condition or action
  getRateData(data) {
    const dataObject = {};
    for (const index in data) {
      if (data[index] !== undefined) {
        dataObject[data[index].name] = data[index];
      }
    }
    return dataObject;
  }

  storeOperators(dataType) {
    if (!this.conditionOpsList[dataType]) {
      this.conditionOpsList[dataType] = this.getOperator(dataType + '|dataType');
    }
  }

  setRateTableColsDef(data, metaData) {
    this.rateTableDataList = [];
    this.rateTableEditDataList = [];
    this.hasDefaultRate = false;
    this.hasDefaultRateEdit = false;
    if (data) {
      for (let i = 0; i < data.length; i++) {
        const rateRecord: any = this.configRateTableRecord(data[i], metaData, true);
        this.rateTableDataList.push(rateRecord.view);
        this.rateTableEditDataList.push(rateRecord.edit);
      }
    }
    this.processMetaData(metaData);

    // Add a empty row if no record
    if (this.isRateListEmptyOrOnlyDefault()) {
      const position = 0;
      const emptyRecord: any = this.configRateTableRecord(this.getNewRecord(false), metaData, false);
      // empty row for edit mode
      this.addRateRow(position, emptyRecord.edit, false);
      // empty row for view mode
      this.rateTableDataList.splice(position, 0, this.addaRowForViewMode(emptyRecord.view));
    }
    this.isDefaultRateAllowed = this.checkDefaultRateAllowed();
    // Create default rate record if no default rate configured
    if (!this.hasDefaultRate && this.conditions.length > 0) {
      const defaultRateRecord: any = this.configRateTableRecord(this.getNewRecord(true), metaData, false);
      this.rateTableDataList.push(defaultRateRecord.view);
      this.rateTableEditDataList.push(defaultRateRecord.edit);
    }
    this.createRateTable();
    this.rateTableEditDataListPrior = JSON.parse(JSON.stringify(this.rateTableEditDataList));
    if (this.xmlResultJson == null) {
      this.rateTableDataListPrior = JSON.parse(JSON.stringify(this.rateTableDataList));
      this.rateTableEditDataListImport = JSON.parse(JSON.stringify(this.rateTableEditDataList));
    }
  }

  isRateListEmptyOrOnlyDefault() {
    return (this.rateTableDataList.length === 0 || (this.rateTableDataList.length === 1 && this.hasDefaultRate));
  }

  addaRowForViewMode(record) {
    for (const field in record) {
      if ((this.actionsList).indexOf(field) >= 0 || (this.conditionsList).indexOf(field) >= 0) {
        record[field] = '';
      }
    }
    return record;
  }

  getBooleanTextForViewMode(dataType, columnText) {
    return ['char', 'boolean'].indexOf(dataType) >= 0 ? { false: false, true: true }[columnText] : columnText;
  }

  isRowTypeDefault(rules, emptyConditions, noOfConditions){
    if (rules != undefined) {
    return ((emptyConditions > 0 && emptyConditions === noOfConditions)
         || (Object.keys(rules).length === 0) && this.isHavingConditionColumn);
    }
   }

  configRateTableRecord(rowData, metaData, isPersistRecord) {
    const ruleViewCols = {};
    const ruleUpdateCols = {};
    const rules = rowData.conditions;
    let noOfConditions = 0;
    const actions = rowData.actions;
    let emptyConditions = 0;
    if (rules !== undefined && rules !== null && Object.keys(rules).length > 0) {
      this.isHavingConditionColumn = true;
      for (const rule in rules) {
        if (rule !== undefined) {
          noOfConditions += 1;
          const property = this.getRateData(metaData)[rule];
          const isPerColumn = !property['_opParameterTableMetadata'] && property['columnoperator'];
          if ((!rules[rule].operator || rules[rule].operator == null || isPerColumn) && rules[rule].value == null) {
            emptyConditions += 1;
          }
          const operator = this.getOperator(rules[rule].operator);
          const columnText = (rules[rule].value && rules[rule].value !== 'null') || rules[rule].value == 0 ? rules[rule].value : '';
          const viewColumnText = this.getBooleanTextForViewMode(property.dataType, columnText);
          ruleViewCols[rule] = isPerColumn ? viewColumnText : operator + viewColumnText;
          // cols for update rates. For operator key will be 'rulename|condOperator'
          if (operator && !isPerColumn) {
            ruleUpdateCols[rule + '|condOperator'] = rules[rule].operator;
          }
          ruleUpdateCols[rule] = columnText;
        }
      }
      ruleViewCols['TEXT_THEN'] = ruleUpdateCols['TEXT_THEN'] = 'TEXT_THEN';
      for (const act in actions) {
        if (actions[act] !== undefined) {
          ruleUpdateCols[act] = actions[act];
          ruleViewCols[act] = this.getBooleanTextForViewMode(this.getRateData(metaData)[act].dataType, actions[act]);
        }
      }

    } else {
      for (const act in actions) {
        if (actions[act] !== undefined) {
          ruleUpdateCols[act] = actions[act];
          ruleViewCols[act] = this.getBooleanTextForViewMode(this.getRateData(metaData)[act].dataType, actions[act]);
        }
      }
    }
    // if value and operator is null for all conditions then record is considered as default.
    if (!this.hasDefaultRate && isPersistRecord) {
      this.hasDefaultRateEdit = this.hasDefaultRate = this.isRowTypeDefault(rules, emptyConditions, noOfConditions);
    }
    ruleViewCols['default'] = ruleUpdateCols['default'] = this.isRowTypeDefault(rules, emptyConditions, noOfConditions);
    ruleViewCols['order'] = ruleUpdateCols['order'] = rowData.order;
    return {
      view: ruleViewCols,
      edit: ruleUpdateCols
    };
  }

  processMetaData(metaData) {
    const conditionSet = [];
    const actionSet = [];
    this.rulesManditoryCheck = [];
    const metaDataObjects = this.getRateData(metaData);
    this.rulesManditoryCheck = metaData;
    this.rateTableCols = [];
    this.rateTableEditCols = [];
    this.editCondtions = [];
    this.conditions = [];
    this.actions = [];
    if (this.isRateListEmptyOrOnlyDefault()) {
      for (const index in metaData) {
        if (metaData[index] !== undefined) {
          const columnProperty = metaData[index];
          if (columnProperty.conditionColumn) {
            if (columnProperty._opParameterTableMetadata) {
              this.editCondtions.push(columnProperty.name + '|condOperator');
            }
            this.editCondtions.push(metaData[index]);
            this.conditions.push(metaData[index]);
          } else {
            this.actions.push(metaData[index]);
          }
        }
      }
    } else {
      const record = this.rateTableEditDataList[0];
      const conditionExist = record['TEXT_THEN'];
      let isConditions = false;
      for (const property in record) {
        if (!this.isRuleMiscproperties(property)) {
          if (!conditionExist) {
            this.actions.push(metaDataObjects[property]);
          } else {
            if (property === 'TEXT_THEN') {
              isConditions = true;
            } else if (!isConditions) {
              const _opCheck = property.split('|');
              if (_opCheck.length > 1 && _opCheck[1] === 'condOperator') {
                this.editCondtions.push(property);
              } else {
                this.editCondtions.push(metaDataObjects[property]);
                this.conditions.push(metaDataObjects[property]);
              }
            } else {
              this.actions.push(metaDataObjects[property]);
            }
          }
        }
      }
    }
    for (const index in this.conditions) {
      if (this.conditions[index] !== undefined) {
        const property = this.getRateData(metaData)[this.conditions[index].name];
        this.storeOperators(property.enumData !== null ? 'enum' : property.dataType);
        conditionSet.push(this.conditions[index].name);
      }
    }
    for (const index in this.actions) {
      if (this.actions[index] !== undefined) {
        const property = this.getRateData(metaData)[this.actions[index].name];
        this.storeOperators(property.enumData !== null ? 'enum' : property.dataType);
        actionSet.push(this.actions[index].name);
      }
    }
    this.conditionsList = conditionSet;
    this.actionsList = actionSet;
  }

  removeActionColumn() {
    if (this.rateTableCols.length > 0) {
      for (let index = 0; index < this.rateTableCols.length; index++) {
        const element = this.rateTableCols[index];
        if (element.field == 'TEXT_ACTIONS') {
          this.rateTableCols.splice(index, 1);
        }
      }
    }
    this.rateTableCols = JSON.parse(JSON.stringify(this.rateTableCols));
  }
  createRateTable() {
    let columnDefFile = [];
    if (this.conditions.length > 0) {
      this.setRateTableColumns('MOVE', this.staticColumns.MOVE, false, true,this.rulesManditoryCheck);
      this.setRateTableColumns(this.staticColumns.ACTIONS, this.staticColumns.ACTIONS, true, true,this.rulesManditoryCheck);
    }
    if (this.conditions.length > 0) {
      this.showIfBlock = true;
      this.setRateTableColumns(this.staticColumns.IF, this.staticColumns.IF, true, true,this.rulesManditoryCheck);
    }
    for (const index in this.conditions) {
      if (this.conditions[index] !== undefined) {
        const displayName = this.conditions[index].displayName ? this.conditions[index].displayName : this.conditions[index].name;
        this.setRateTableColumns(this.conditions[index].name, displayName, true, false,this.rulesManditoryCheck);
      }
    }
    for (const index in this.editCondtions) {
      if (this.editCondtions[index] !== undefined) {
        let _opCheck: any[] = [];
        if (typeof (this.editCondtions[index]) === 'string') {
          _opCheck = this.editCondtions[index].split('|');
        }
        if (_opCheck.length > 1 && _opCheck[1] === 'condOperator') {
          this.setRateTableColumns(this.editCondtions[index], 'TEXT_OPERATOR', false, true,this.rulesManditoryCheck);
        } else {
          const condition = this.editCondtions[index];
          const displayName = condition.displayName ? condition.displayName : condition.name;
          this.setRateTableColumns(this.editCondtions[index].name, displayName, false, true,this.rulesManditoryCheck);
        }
      }
    }
    if (this.conditions.length > 0) {
      this.setRateTableColumns('TEXT_THEN', 'TEXT_THEN', true, true,this.rulesManditoryCheck);
    }
    for (const index in this.actions) {
      if (this.actions[index] !== undefined) {
        const action = this.actions[index];
        const displayName = action.displayName ? action.displayName : action.name;
        this.setRateTableColumns(this.actions[index].name, displayName, true, true,this.rulesManditoryCheck);
      }
    }
    if (!this.editRatesCapability && !this.deleteRatesCapability) {
      this.removeActionColumn();
    } else if (this.editRatesCapability && !this.deleteRatesCapability) {
      this.rateTableCols[0]['style'].width = '90px';
    } else if (!this.editRatesCapability && this.deleteRatesCapability) {
      this.rateTableCols[0]['style'].width = '70px';
    } else {
      this.rateTableCols = JSON.parse(JSON.stringify(this.rateTableCols));
    }
  }

  setRateTableColumns(field, displayName, isViewCols, isEditCols, metaData) {
    const keyObj = {};
    keyObj['field'] = field;
    keyObj['key'] = displayName;
    if (!(this.isStaticColumn(displayName))) {
      keyObj['editable'] = true;
      metaData.forEach((ele,index) => {
        if(ele.name === keyObj['field'] && ele.displayName === keyObj['key']) {
          keyObj['style'] = {'width': '100%', 'required': ele.required,'enum':ele.enumData,'datatype':ele.dataType};
        }
        if(this.rateTableDataList.length >1){
          keyObj['sortable'] = 'custom';
        }
        else {
        const viewRowIndex = Number(index) + 1;
        const widgetid = '.ecb-rateTable thead';
        if(ele.enumData === null && (ele.dataType == 'int' || ele.dataType == 'decimal')){
         setTimeout(() =>{
          document.querySelector(widgetid + ' tr ' +
                                      'th:nth-child(' + viewRowIndex + ') span').classList.add('ecb-rtlLeftView');
        },10);
       }
      }
      });
    } else if (displayName === this.staticColumns.OPERATOR) {
      keyObj['style'] = { 'width': '80px' };
      keyObj['editable'] = true;
    } else if (displayName === this.staticColumns.ACTIONS) {
      keyObj['style'] = { 'width': '110px' };
    } else {
      keyObj['style'] = { 'width': '60px' };
    }
    if (isViewCols) {
      this.rateTableCols.push(keyObj);
    }
    if (isEditCols) {
      this.rateTableEditCols.push(keyObj);
    }
  }

  isStaticColumn(key) {
    return key === ' ' || key === 'MOVE' || (this.staticLocalizedCols).indexOf(key) >= 0 ? true : false;
  }

  isRuleMiscproperties(key) {
    return (this.ruleMiscproperties).indexOf(key) >= 0;
  }
 

  getTableHeaderName(col) {
    const colName = col.field.split('|')[0];
    const property = this.metaDataAsPerRuleName[colName];
    const isPerColumn = !property['_opParameterTableMetadata'] && property['columnoperator'];
    const displayName = col.key ? col.key : col.header;
    return isPerColumn ? displayName + '(' + this.getOperator(property.operator) + ')' : displayName;
  }

  getOpForConditions(field) {
    const colName = field.split('|')[0];
    const property = this.metaDataAsPerRuleName[colName];
    if (!property) {
      return '';
    }
    let dataType = property.dataType;
    if (property.enumData !== null) {
      dataType = 'enum';
    }
    return this.conditionOpsList[dataType];
  }
  hasEnumData(field) {
    if (!this.metaDataAsPerRuleName[field]) {
      return false;
    } else {
      return this.metaDataAsPerRuleName[field].enumData ? true : false;
    }
  }

  datesFormateHandler(schedule) {
    if (this.selectedSchedule !== undefined && this.selectedSchedule !== null) {
      if (this.selectedSchedule['startDate'] !== null) {
        const startDateFormat = new Date(this.selectedSchedule['startDate']);
        this.selectedSchedule['startDate'] = startDateFormat.toLocaleDateString();
      } else {
        this.selectedSchedule['startDate'] = 'TEXT_NO_STARTDATE';
      }
      if (this.selectedSchedule['endDate'] !== null) {
        const endDateFormat = new Date(this.selectedSchedule['endDate']);
        this.selectedSchedule['endDate'] = endDateFormat.toLocaleDateString();
      } else {
        this.selectedSchedule['endDate'] = 'TEXT_NO_ENDDATE';
      }
    }
  }

  ngOnDestroy() {
    this.isRatesFormDirty = false;
    for (const i in this.widgetEvents) {
      if (this.widgetEvents[i]) {
        this.widgetEvents[i].unsubscribe();
      }
    }
    this._ratesService.copyRates(false);
  }

  removeRecordFromView(index) {
    if (this.deleteFromEditScreen) {
      const tableData = JSON.parse(JSON.stringify(this.rateTableEditDataList));
      tableData.splice(index, 1);
      this.rateTableEditDataList = tableData;
      this.onEditCell();
    } else if (!this.deleteFromEditScreen) {
      this.rateTableDataList = this.rateTableEditDataList;
      const tableData = JSON.parse(JSON.stringify(this.rateTableDataList));
      tableData.splice(index, 1);
      this.rateTableDataList = tableData;
    }
  }

  deleteRateModel(data, index) {
    if (!this.disableDeleteIcon()){
    this.deleteFromEditScreen = true;
    if (data.order == null) {
      this.removeRecordFromView(index);
      this.setFocusColumn(index - 1);
      return;
    }
    this.confirmDialog = 2;
    this.displayDataOnModal(data);
    this.deleteRowIndex = index + 1;
    this.isRatesFormDirty = true;
  }
  }

  displayDataOnModal(data){
    let tempObj = {};
    for(var key in data){
      this.parameterTableMetaData.forEach(value =>{
          if(key == value.name) {
            tempObj[value.displayName] = data[key];
          }
         else if(key.includes('|condOperator')){
            let keySet = key.split('|condOperator');
            let resObj = Object.assign({},keySet)
                 if(resObj[0] == value.name)
                 tempObj[value.displayName + '|condOperator'] = data[key];
           }
        });
      }
    this.delteRateObj = tempObj;
  }

  deleteRateFromView(data, index) {
    if (!this.disableExistingDeleteIcon()){
    this.deleteFromEditScreen = false;
    this.confirmDialog = 2;
    this.displayDataOnModal(data);
    this.deleteRowIndex = index + 1;
    }
  }

  deleteRateObjectKeys() {
    return this.delteRateObj !== undefined && this.delteRateObj !== null ? Object.keys(this.delteRateObj) : [];
  }

  isMetaDataColumns(item) {
    const keyOp = item.split('|condOperator');
    return keyOp.length === 1 && !this.isStaticColumn(item) && !this.isRuleMiscproperties(item);
  }

  getRuleRecordDetail(item) {
    const operator = this.delteRateObj[item + '|condOperator'];
    return (operator ? this.getOperator(operator) : '') + this.delteRateObj[item];
  }

  addClickFromView(rateTables, idx) {
    this.onEditCell();
    setTimeout(() => {
      this.displayCoverHandler(rateTables);
    }, 100);
    const data = this.rateTableDataList[idx];
    if (data.order !== null) {
      this.addRateRow(idx, null, false);
    }
    this.isRatesFormDirty = true;
  }

  deleteClickFromView(data, index) {
    this.deleteFromEditScreen = false;
    if (data.order == null) {
      const tableData = JSON.parse(JSON.stringify(this.rateTableEditDataList));
      tableData.splice(index, 1);
      this.rateTableDataList = tableData;
      return;
    }
    this.confirmDialog = 2;
    this.delteRateObj = data;
    this.deleteRowIndex = index + 1;
  }

  displayCoverHandler(rateTables) {
    this.setDefaultCalendarId();
    this.editRateTable = rateTables;
    this.isSaveEnabled = false;
    rateTables.show();
    this.showCover = true;
    this._utilService.checkNgxSlideModal(true);
    this.saveRulesError = '';
    this.showErrorMessage = false;
    this.setFocusColumn(0);
  }

  displayApprovalPanel(){
    this.showApprovalPanel = true;
  }

  closeEditPanel() {
    if(this.hasDefaultRatePrior!== undefined && this.hasDefaultRatePrior !== this.hasDefaultRate){
      this.hasDefaultRateEdit = this.hasDefaultRate = this.hasDefaultRatePrior;
    }
    this.editRateTable.hide();
    this.isRatesFormDirty = false;
    this.showCover = false;
    this.hasDefaultRateEdit = this.hasDefaultRate;
    this._utilService.checkNgxSlideModal(false);
    this.tableCellError = null;
    this.rateTableEditDataList = JSON.parse(JSON.stringify(this.rateTableEditDataListPrior));
    if (this.xmlResultJson != null) {
      this.rateTableDataList = JSON.parse(JSON.stringify(this.rateTableDataListPrior));
      this.rateTableEditDataList = JSON.parse(JSON.stringify(this.rateTableEditDataListImport));
      this.existingRuleCount = this.importRuleCount;
    }
    this.isSaveClicked = false;
    this.isAddClicked = false;
  }

  onModalDialogCloseCancel(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this.closeEditPanel();
    }
  }

  onModalDialogCloseDelete(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this.deleteRateFromList(this.delteRateObj.order, this.deleteRowIndex);
      if (!this.deleteFromEditScreen) {
        this._ratesService.editRules({
          data: {
            scheduleId: this.selectedSchedule['schedId'],
            body: this.prepareRulesToPersist()
          },
          success: (result) => {
            this.getAllRules();
            this.removeRateCapabilityFromUI();
            this.rateTableDataList = JSON.parse(JSON.stringify(this.rateTableEditDataList));
          },
          failure: (errorMsg:string,code:any) => {
            let ratesDeleteError = this._UtilityService.errorCheck(code,errorMsg,'DELETE');
            this.handleError(ratesDeleteError);
            this.showErrorMsgForDelete = true;
          },
          onComplete: () => {
            this.isRulesSaving = false;
          }
        });
      }
    } else {
      this.setFocusColumn(this.deleteRowIndex - 1);
    }
  }
  cancelCoverHandler() {
    if (this.isRatesFormDirty === true || this.hasDefaultRate !== this.hasDefaultRateEdit) {
      this.confirmDialog = 1;
    } else {
      this.tableCellError = null;
      this.closeEditPanel();
    }
  }

  onToolTipClose(value) {
    if (value) {
      this.tableCellError = null;
      this.clearHighlight();
      this.isAddClicked = false;
      this.onEditCell();
    }
  }

  verifyRatesTableForNulls() {
    let initialLength = this.rateTableEditDataList.length;
    if (initialLength >= 0) {
      if (initialLength >= 2) {
        initialLength = initialLength - 1;
      }
      const rules = Object.keys(this.rateTableEditDataList[0]);
      for (let rate = 0; rate < initialLength; rate++) {
        for (const key in rules) {
          if (this.rateTableEditDataList[rate][rules[key]] === "") {
            for (const index in this.parameterTableMetaData) {
             if (this.parameterTableMetaData[index]['name'] === rules[key]
             && this.parameterTableMetaData[index]['required'] === true ) {
                this.isSaveEnabled = false;
                this.rateTableToolTipIndex = rate;
                this.rateTableErrorCol = rules[key];
                this.tableCellError = this.parameterTableMetaData[index]['displayName'] + " can not be blank !";
                return;
              }
            }
          } else {
            this.saveRulesError = '';
            this.tableCellError = null;
            this.rateTableToolTipIndex = null;
            this.rateTableErrorCol = null;
            this.isSaveEnabled = true;
          }
        }
      }
    }
  }


  setErrorForRules (error) {
    if (error) {
          this.isSaveEnabled = false;
          return;
    } else {
      this.clearHighlight();
      this.isSaveEnabled = true;
      this.rateTableToolTipIndex = null;
      this.rateTableErrorCol = null;
      this.tableCellError = null;
    }
}

clearHighlight() {
  for (let i in this.rateTableEditDataList) {
    this.rateTableEditDataList[i].error = false;
  }
}
  createADefaultRateRecord() {
    let defaultEditRecord: any[] = [];
    let normalRule: any = this.configRateTableRecord(this.getNewRecord(false), this.parameterTableMetaData, false)
   let newRate = JSON.parse(JSON.stringify(normalRule.edit));
    newRate['order'] = null;
    newRate['scheduleId'] = this.selectedSchedule['schedId'];
    newRate['removeRateCapability'] = true;
    for (const attribute in newRate) {
      if (newRate[attribute] !== undefined) {
        const keyOp = attribute.split('|condOperator');
        if (keyOp.length > 1) {
          newRate[attribute] = this.getOpForConditions(attribute)[0].value;
        } else if (this.metaDataAsPerRuleName[attribute]) {
          newRate[attribute] = (this.metaDataAsPerRuleName[attribute].defaultValue !== null) ?
            this.metaDataAsPerRuleName[attribute].defaultValue : ((this.metaDataAsPerRuleName[attribute].required === true
              && this.hasEnumData(attribute)) ? this.metaDataAsPerRuleName[attribute].enumData[0].value :
              (this.metaDataAsPerRuleName[attribute].defaultValue === null) ? '' : this.metaDataAsPerRuleName[attribute].defaultValue);

        }
      }
    } 
    newRate.error = false;
    defaultEditRecord.push(newRate);
    let defaultRule: any = this.configRateTableRecord(this.getNewRecord(true), this.parameterTableMetaData, false);
    defaultRule.error = false;
    defaultEditRecord.push( defaultRule.edit );
    this.defaultRateRecords = defaultEditRecord;
  }
    checkIfRatesTableisDirty(){
      this.createADefaultRateRecord();
      let ratesToValidate = this.rateTableEditDataList;
    if(ratesToValidate.length != this.defaultRateRecords.length){
      return true;
    } else if ( this.isAddClicked){
      return true;
    } else if ( !this.hasDefaultRateEdit){
      return true
    }
    else{
      if(ratesToValidate.length > 0){
        var rules = Object.keys(ratesToValidate[0]);
          for(var key in rules){
            if (ratesToValidate[0][rules[key]]== "null"){
              ratesToValidate[0][rules[key]]= "";
            } else if (ratesToValidate[0].order >= 0) {
              ratesToValidate[0].order = null;
            }
            if(ratesToValidate[0][rules[key]] != this.defaultRateRecords[0][rules[key]]) {
              return  true;
          }
        }
      }
      else {
        return false;
      }
  }
  }

  onEditCell() {
    for (const index in this.rateTableEditDataList) {
      if (this.rateTableEditDataList[index] !== undefined) {
      let invalidconditions = 0;
      const record = this.rateTableEditDataList[index];
          for (const colmn in record) {
            if ( record[colmn] === "" || record[colmn] === null || record[colmn] === "null" ) {
              for (const mdata in this.parameterTableMetaData) {
                if ((this.parameterTableMetaData[mdata]['name'] === colmn || this.parameterTableMetaData[mdata]['displayName'] === colmn)
                && this.parameterTableMetaData[mdata]['required'] === true) {
                  if (!record['default'] && this.checkIfRatesTableisDirty()) {
                    this.setErrorForRules(true);
                    return;
                  } else if ( record['default'] && this.hasDefaultRateEdit === true ) {
                    for (const action in this.actions) {
                      if (this.actions[action] !== undefined) {
                      const Aname = this.actions[action]['name'];
                          if (colmn === Aname) {
                          this.setErrorForRules(true);
                          return;
                        }
                      }
                    }
                  }
                }
              }
              if ( this.metaDataAsPerRuleName[colmn] !== undefined) {
              if ( this.metaDataAsPerRuleName[colmn].conditionColumn && !record['default'] && this.checkIfRatesTableisDirty()) {
                invalidconditions++;
                if (invalidconditions === this.conditions.length && (this.isSaveClicked || this.isAddClicked)){
                  this.isSaveEnabled = false;
                  this.isSaveClicked = false;
                  this.isAddClicked = false;
                  this.rateTableToolTipIndex = index;
                  this.rateTableErrorCol = "TEXT_ACTIONS" ;
                  this.tableCellError = this._translationService.translate('TEXT_ATLEAST_ONE_CONDITION');
                  this.rateTableEditDataList[index].error = true;
                  return;
                }
              }
            }
            } else {
               this.setErrorForRules(false);
            }
          }
      }
    }
}

  saveRateTables() {
    this.isSaveClicked = true;
    this.showRateTableSkeleton = true;
    this.onEditCell();
    this.deleteFromEditScreen = true;
    if (this.isSaveEnabled) {
      this.isRulesSaving = true;
      this.saveRulesError = '';
      this.isSaveEnabled = false;
      this._ratesService.editRules({
        data: {
          scheduleId: this.selectedSchedule['schedId'],
          body: this.prepareRulesToPersist()
        },
        success: (result) => {
          this.getAllRules();
          this.closeEditPanel();
          this.rateTableDataList = JSON.parse(JSON.stringify(this.rateTableEditDataList));
        },
        failure: (errorMsg:string,code:any,error:any) => {
          this.isSaveEnabled = false;
          this.saveRulesError = this._UtilityService.errorCheck(code,errorMsg,'EDIT');
          
        },
        onComplete: () => {
          this.isSaveEnabled = true;
          this.isRulesSaving = false;
        }
      });
      this.removeRateCapabilityFromUI();
    }
    this.showRateTableSkeleton = false;
  }

  prepareRulesToPersist() {
    let allowedRow = false;
    const rules = [];
    if (this.deleteFromEditScreen) {
      for (const index in this.rateTableEditDataList) {
        if (this.rateTableEditDataList[index] !== undefined) {
          const record = this.rateTableEditDataList[index];
          if (!record['default'] || (record['default'] && this.hasDefaultRateEdit)) {
            const rule = {
              scheduleId: this.selectedSchedule['schedId'],
              order: index,
              conditions: {},
              actions: {}
            };
            if (!record['default'] && this.checkIfRatesTableisDirty()) {
              for (const index in this.conditions) {
                if (this.conditions[index] !== undefined) {
                  const name = this.conditions[index]['name'];
                  const displayName = this.conditions[index]['displayName'];
                  const operator = record[name + '|condOperator'];
                  const property = this.metaDataAsPerRuleName[name];
                  if (record[displayName] === ""){
                    record[displayName] = property.defaultValue;
                  }
                  const col = {
                    'value': this.isNullEmpty(record[displayName]) || this.isNullEmpty(record[name])
                  };
                  if (operator) {
                    col['operator'] = operator;
                  } else {
                    const isPerColumn = !property['_opParameterTableMetadata'] && property['columnoperator'];
                    if (isPerColumn) {
                      col['operator'] = this.getOperator(property.operator + '|metaDataOperator');
                    }
                    // If no operator and data type is numeric then default value is zero
                    if ((['int', 'number', 'decimal'].indexOf(property.dataType) >= 0) && record[displayName] === '') {
                      col['value'] = property.defaultValue;
                    }
                  }
                  rule['conditions'][name] = col;
                  allowedRow = true;
                }
              }
            }
            if ( (record['default'] && this.hasDefaultRateEdit === true )
            || ( !record['default'] && this.checkIfRatesTableisDirty()) ) {
              for (const index in this.actions) {
                if (this.actions[index] !== undefined) {
                  const name = this.actions[index]['name'];
                  const displayName = this.actions[index]['displayName'];
                  const property = this.metaDataAsPerRuleName[name];
                  if ((['int', 'number', 'decimal'].indexOf(property.dataType) >= 0) && record[displayName] === '') {
                    record[displayName] = property.defaultValue;
                  }
                  rule['actions'][name] = this.isNullEmpty(record[displayName]) || this.isNullEmpty(record[name]);
                  allowedRow = true;
                }
              }
          }
            if(allowedRow)
            rules.push(rule);
          }
        }
      }
    }
    else if (!this.deleteFromEditScreen) {
      for (const index in this.rateTableDataList) {
        if (this.rateTableDataList[index] !== undefined) {
          const record = this.rateTableDataList[index];
          if (!record['default'] || (record['default'] && this.hasDefaultRate)) {
            const rule = {
              scheduleId: this.selectedSchedule['schedId'],
              order: index,
              conditions: {},
              actions: {}
            };
            if (!record['default']) {
              for (const index in this.conditions) {
                if (this.conditions[index] !== undefined) {
                  const name = this.conditions[index]['name'];
                  const displayName = this.conditions[index]['displayName'];
                  const operator = record[name + '|condOperator'];
                  const property = this.metaDataAsPerRuleName[name];
                  if (record[displayName] === ""){
                    record[displayName] = property.defaultValue;
                  }
                  const col = {
                    'value': this.isNullEmpty(record[displayName]) || this.isNullEmpty(record[name])
                  };
                  if (operator) {
                    col['operator'] = operator;
                  } else {
                    const isPerColumn = !property['_opParameterTableMetadata'] && property['columnoperator'];
                    if (isPerColumn) {
                      col['operator'] = this.getOperator(property.operator + '|metaDataOperator');
                    }
                    // If no operator and data type is numeric then default value is zero
                    if ((['int', 'number', 'decimal'].indexOf(property.dataType) >= 0) && record[displayName] === '') {
                      col['value'] = property.defaultValue;
                    }
                  }
                  rule['conditions'][name] = col;
                  allowedRow = true;
                }
              }
            }
            for (const index in this.actions) {
              if (this.actions[index] !== undefined) {
                const name = this.actions[index]['name'];
                const displayName = this.actions[index]['displayName'];
                const property = this.metaDataAsPerRuleName[name];
                if ((['int', 'number', 'decimal'].indexOf(property.dataType) >= 0) && record[displayName] === '') {
                  record[displayName] = property.defaultValue;
                }
                rule['actions'][name] = this.isNullEmpty(record[displayName]) || this.isNullEmpty(record[name]);
                allowedRow = true;
              }
            }
          if(allowedRow)
            rules.push(rule);
          }
        }
      }
    }
    return rules;
}

  removeRateCapabilityFromUI() {
    for (const index in this.rateTableData) {
      delete this.rateTableData[index]['removeRateCapability'];
    }
    JSON.parse(JSON.stringify(this.rateTableData));
  }

  hideApprovalWidget(event) {
    if(event){
      this.showApprovalPanel = false;
    }
  }

  addRateRow(position, record, addBtnClkd) {
    this.isAddClicked = addBtnClkd;
    let newRate = {};
    // From Existing list if record is null; else it will push param record
    if (!record) {
      this.onEditCell();
      if (this.isSaveEnabled) {
      record = this.rateTableEditDataList[position];
      this.isRatesFormDirty = true;
      } else {
        return;
      }
    }
    newRate = JSON.parse(JSON.stringify(record));
    newRate['order'] = null;
    newRate['scheduleId'] = this.selectedSchedule['schedId'];
    newRate['removeRateCapability'] = true;
    const tableData = JSON.parse(JSON.stringify(this.rateTableEditDataList));
    for (const attribute in newRate) {
      if (newRate[attribute] !== undefined) {
        const keyOp = attribute.split('|condOperator');
        if (keyOp.length > 1) {
          newRate[attribute] = this.getOpForConditions(attribute)[0].value;
        } else if (this.metaDataAsPerRuleName[attribute]) {
          newRate[attribute] = (this.metaDataAsPerRuleName[attribute].defaultValue !== null) ?
            this.metaDataAsPerRuleName[attribute].defaultValue : ((this.metaDataAsPerRuleName[attribute].required === true
              && this.hasEnumData(attribute)) ? this.metaDataAsPerRuleName[attribute].enumData[0].value :
              (this.metaDataAsPerRuleName[attribute].defaultValue === null) ? '' : this.metaDataAsPerRuleName[attribute].defaultValue);

        }
      }
    } 
    tableData.splice(position, 0, newRate);
    this.rateTableEditDataList = tableData;
    this.setFocusColumn(position);
    this.isAddClicked = false;
    this.onEditCell();
  }

  getNewRecord(isDefault) {
    const newRecord: any = {
      scheduleId: this.selectedSchedule['schedId'],
      conditions: {},
      actions: {},
      order: null,
    };
    this.conditions.forEach(condition => {
      const conditionName = condition['name'];
      if (isDefault) {
        newRecord.conditions[conditionName] = {
          operator: null,
          value: null
        };
      } else {
        const operatorList = this.getOpForConditions(conditionName);
        newRecord.conditions[conditionName] = {
          operator: operatorList ? operatorList[0].value : null,
          value: (this.metaDataAsPerRuleName[conditionName].defaultValue !== null) ? this.metaDataAsPerRuleName[conditionName].defaultValue
            : ((this.metaDataAsPerRuleName[conditionName].required === true && this.hasEnumData(conditionName)) ?
              this.metaDataAsPerRuleName[conditionName].enumData[0].value :
              (this.metaDataAsPerRuleName[conditionName].defaultValue === null) ? '' : this.metaDataAsPerRuleName[conditionName].defaultValue)
        };
      }
    });
    this.actions.forEach(action => {
      const property = this.metaDataAsPerRuleName[action['name']];
      if (['int', 'number', 'decimal', 'char', 'boolean'].indexOf(property.dataType) >= 0 ) {
      newRecord.actions[action['name']] =  null;
      }
    });
    return newRecord;
  }

  validateInputField(event, col, index) {
    const colName = col.field.split('|')[0];
    const property = this.metaDataAsPerRuleName[colName];
    if (['int', 'number'].indexOf(property.dataType) >= 0) {
      this.rateTableEditDataList[index][col.field] = String(this.rateTableEditDataList[index][col.field]).replace(/[^0-9]/g, '');
    } else if (property.dataType === 'decimal') {
      this.rateTableEditDataList[index][col.field] = String(this.rateTableEditDataList[index][col.field]).replace(/[^0-9\.]/g, '');
    }
    this.onEditCell();
    if (this.rateTableEditDataList.length === this.rateTableEditDataListPrior.length) {
      if ((String(this.rateTableEditDataList[index][col.field]) !== String(this.rateTableEditDataListPrior[index][col.field]))) {
      this.isRatesFormDirty = true;
    } else {
      this.isRatesFormDirty = false;
      }
    }
  }

  getTextFieldClass(col) {
    const colName = col.field.split('|')[0];
    const property = this.metaDataAsPerRuleName[colName];
    return ['int', 'number', 'decimal', 'int32'].indexOf(property.dataType) >= 0
      && !this.hasEnumData(col.field) ? 'text-right' : '';
  }

  onRowMove() {
    let isReverted = false;
    const lastRecordBeforeDrag = this.rateTableDataListBeforeDrag[this.rateTableDataListBeforeDrag.length - 1];
    const currentLastRecord = this.rateTableEditDataList[this.rateTableEditDataList.length - 1];
    if (lastRecordBeforeDrag['default'] && !currentLastRecord['default']) {
      this.rateTableEditDataList = JSON.parse(JSON.stringify(this.rateTableDataListBeforeDrag));
      isReverted = true;
    } else {
      this.rateTableEditDataList = JSON.parse(JSON.stringify(this.rateTableEditDataList));
    }
    this.onEditCell();
    return isReverted;
  }

  isVisibleForEditDefaultRate(index, field) {
    const obj = this.rateTableEditDataList[index];
    if (!obj['default']) {
      return true;
    } else {
      return this.hasDefaultRateEdit && (this.actionsList).indexOf(field) >= 0 ? true : false;
    }
  }
  setHasDefaultRate(value) {
    this.hasDefaultRateEdit = value;
    this.onEditCell();
  }

  displayCopyRateSchedules() {
    this.copyRateSchedules = true;
  }

  onModalDialogCopyCancel(event) {
    this.confirmDialog = 0;
    this.copyRateSchedules = false;
  }

  checkDefaultRateAllowed() {
    let isAllowed = true;
    for (const index in this.parameterTableMetaData) {
      if (this.parameterTableMetaData[index].conditionColumn && this.parameterTableMetaData[index]['required']) {
        isAllowed = false;
      }
    }
    return isAllowed;
  }

  setCopyRateSchedules(val: boolean) {
    this.copyRateSchedules = val;
  }

  openUploadDialog() {
    this.btnUpload.nativeElement.click();
  }

  exportToXML() {
      this._ratesService.exportToXML({
        data: { scheduleId: this.selectedSchedule['schedId'] },
        success: (result) => {
          this._UtilityService.downloadFile(result, 'export.xml');
        },
        failure: (errMsg: string, code: any, error: any) => {
          this.showErrorMsg = true;
          this.rateTableFetchError = this._UtilityService.errorCheck(code, errMsg, 'DOWNLOAD');
        },
        onComplete: () => {
          this.loading = false;
        }
      });
  }

  setValue(value, col, rowIndex) {
    if (this.rateTableEditDataList[rowIndex][col.field] !== undefined && this.rateTableEditDataList[rowIndex][col.field] != null) {
      if (value != null && value !== undefined) {
        this.rateTableEditDataList[rowIndex][col.field] = value;
      }
    }
    this.onEditCell();
  }

  importToXML(event: any, rateTables) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const ptName = this.rateTableInfo.schedule.ptName;
      reader.readAsText(file);
      this.displayCoverHandler(rateTables);
      reader.onload = () => {
        this.xmlResultJson = reader.result;
        if (this.xmlResultJson != null) {
          this.isSaveEnabled = true;
          this.rateTableDataListPrior = JSON.parse(JSON.stringify(this.rateTableDataList));
          this.rateTableEditDataListImport = JSON.parse(JSON.stringify(this.rateTableEditDataList));
        }
        const lines = this.xmlResultJson.split('?>');
        const subline = lines[1];
        this._ratesService.importToXML({
          data: {
            param: {
              paramtableName : ptName
            },
            body: subline
          },
          success: (result) => {
            this.rateTableData = result;
            this.hasDefaultRatePrior = this.hasDefaultRate;
            if (result) {
              this.existingRuleCount = (result).length;
            }
            if (this.rateTableData !== undefined && (this.rateTableData === null || this.rateTableData.length === 0)) {
              this.showEmptyMessage = true;
            }
            this.setRateTableColsDef(this.rateTableData, this.parameterTableMetaData);
            this.isRatesFormDirty = true;
          },
          failure: (errorMsg:string,code:any) => {
            this.setRateTableColsDef([], this.parameterTableMetaData);
            this.isSaveEnabled = false;
            this.showErrorMessage = true;
            this.errorMessage = this._UtilityService.errorCheck(code,errorMsg,'UPLOAD');
          },
          onComplete: () => {
            this.rateTableLoading = false;
          }
        });
        this.btnUpload.nativeElement.value = '';
      };
    }
  };

  disableDeleteIcon() {
    if (this.rateTableEditDataList.length === 2) {
      this.deleteTabIndex = -1;
      return true;
    } else {
      this.deleteTabIndex = 0;
      return false;
    }
  }

  disableMoveIcon() {
    if (this.rateTableEditDataList.length === 2) {
      return true;
    } else {
      return false;
    }
  }

  disableExistingDeleteIcon() {
    if (this.rateTableDataList.length === 2) {
      return true;
    } else {
      return false;
    }
  }

  public getCalendarLists() {
    this.calendarOptions = [];
    const criteria = {
      param: {
        page: 1,
        size: 2147483647
      }
    };
    this._calendarService.getCalendarLists({
      data: criteria,
      success: (result) => {
        const calendars = result.records;
        if (calendars) {
          this.calendarOptions.push({ label: 'Select Calendar', value: 0 });
          for (let i = 0; i < calendars.length; i++) {
            this.calendarOptions.push({ label: calendars[i].name + '-' + calendars[i].calendarId, value: calendars[i].calendarId });
          }
        }
      },
      failure: (error) => {
        this.handleError(error);
      }
    });
  }
  setDefaultCalendarId() {
    for (let col = 0; col < this.rateTableEditDataList.length; col++) {
      if ((this.rateTableEditDataList[col].Calendar_ID == null || this.rateTableEditDataList[col].Calendar_ID === '') && this.rateTableEditDataList[col].Calendar_ID !== undefined) {
        this.rateTableEditDataList[col].Calendar_ID = 0;
      }
    }
  }
  setFocusColumn(index) {
    index = (index < 0) === true ? 0 : index;
    const viewRowIndex = Number(index) + 1;
    setTimeout(() => {
      if (document.getElementById('ecb-rateTableEdit') !== null) {
        const widgetHead = '#ecb-rateTableEdit thead';
        const widgetBody = '#ecb-rateTableEdit tbody';
        let firstElement;
        let secondElement;
        if(this.rateTableEditDataList.length == 1){
        this.rateTableEditCols.forEach((ele,index) =>{
          const viewIndex = Number(index) + 1;
         if(ele.style.enum ===  null && (ele.style.datatype == 'int' || ele.style.datatype == 'decimal')){
          document.querySelector(widgetHead + ' tr ' +
          'th:nth-child(' + viewIndex +') span').classList.add('ecb-rtlLeftView');
         }
        });
       }
        for (let i = 1; i <= document.querySelector(widgetBody + ' tr:nth-child(' + viewRowIndex).childElementCount; i++) {
          firstElement = document.querySelector(widgetBody + ' tr:nth-child(' + viewRowIndex + ') ' +
                                    'td:nth-child(' + i + ') select');
          secondElement = document.querySelector(widgetBody + ' tr:nth-child(' + viewRowIndex + ') ' +
                                    'td:nth-child(' + i + ') input');
          if (firstElement !== null || secondElement !== null) {
            if (firstElement === null) {
              firstElement = <HTMLElement>secondElement;
            }
            firstElement.focus();
            break;
          }
        }
      }
    }, 100);
  }


  rateTableSort(event, type) {
    setTimeout(() =>{
    let rateTableBackup = type === 'view' ? this.rateTableDataList : this.rateTableEditDataList;
    let length = rateTableBackup.length;
    let lastElement;
    for (let i = 0; i < rateTableBackup.length; i++) {
      if (rateTableBackup[i]['default'] === true) {
        lastElement = rateTableBackup[i];
        rateTableBackup.pop();
      }else if (!rateTableBackup[i]['default'] && length === 1 ) { 
        lastElement = rateTableBackup[i];
         rateTableBackup.pop(); 
      }
    }
    rateTableBackup.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null)
          result = -1;
      else if (value1 != null && value2 == null)
          result = 1;
      else if (value1 == null && value2 == null)
          result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
          result = value1.localeCompare(value2);
      else
          result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return (event.order * result);
  });
    const tmp = rateTableBackup;
    rateTableBackup = [];
    tmp.forEach(function (row: any) {
      rateTableBackup.push(row);
    });
    rateTableBackup.splice(length, 0 , lastElement);
    if ( type === 'view' ) {
      this.rateTableDataList = rateTableBackup;
    } else {
      this.rateTableEditDataList = rateTableBackup;
    }
    },10);
}

isNullEmpty(value) {
  return value === 'null' ||  value  ===  ''  ? null : value;
}

  refreshRates(event) {
    if (event) {
      this.getAllRules();
    }
  }

}
