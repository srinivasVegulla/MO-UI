import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuditLogService } from '../auditLog.service';
import { utilService } from '../../helpers/util.service';
import { UtilityService } from '../../helpers/utility.service';
import { showOperatorPipe } from '../../helpers/showOperator.pipe';
import { dateFormatPipe } from '../../helpers/dateFormat.pipe';
import { calenderLocaleFeilds } from '../../../assets/calenderLocalization';
import { TranslationService } from 'angular-l10n';
import { DateFormatPipe } from 'angular2-moment';
import { InfiniteScrollCheckService } from '../../helpers/InfiniteScrollCheck.service';
import { ApprovalService } from '../../approval/approval.service';

@Component({
  selector: 'ecb-rate-changes',
  templateUrl: './rate-changes.component.html',
  styleUrls: ['./rate-changes.component.scss'],
  providers: [showOperatorPipe, dateFormatPipe, DateFormatPipe]
})
export class RateChangesComponent implements OnInit, OnDestroy {

  rateChangeError: string;
  rateChangeFetching: boolean = false;
  selectedAuditRecord: any;
  rateChangeConfig: any;
  rateChanges: any;
  rateChangeItems: any = [];
  pagination: any;
  totalPageSize: number;
  totalPages: number;
  totalCount: number = 0;
  infiniteScrollCheck = '';
  moreDataCalled: boolean;
  moreData;
  lessData;
  /**MetaData vars */
  metaDataAsPerRuleName: any = {};
  rateChangeGridData: any = [];
  holdRateChangeData: any = [];
  rateChangeColDef: any = {};
  rateTableCols: any[] = [];
  loadGridData: boolean = false;
  staticLocalizedCols: any[] = ['TEXT_IF', 'TEXT_THEN', 'TEXT_CHANGE'];
  ruleMiscproperties: any[] = ['type', 'order'];
  staticColumns: any = {
    'IF' : this.staticLocalizedCols[0],
    'THEN' : this.staticLocalizedCols[1],
    'CHANGE' : this.staticLocalizedCols[2]
  };
  lazyLoad: boolean = false;
  conditionOpsList: any[] = [];
  conditions = [];
  actions = [];
  conditionsList = [];
  actionsList = [];
  showIfBlock = false;
  originalItems = {};
  currentLocale: any;
  calenderLocale: any;
  scheduleHeader: string;
  @Input() showRateChangesOnApproval: boolean;
  @Input() pendingRecord: any;
  rateMetaData: any;
  approvalPendingInfoSubscribe: any;
  rateResultTimer: number = 0;
  /** end */

  @Output() onClose = new EventEmitter<any>();
  constructor(private _auditLogService: AuditLogService,
  private _utilityService: UtilityService,
  private _showOperator: showOperatorPipe,
  private _dateFormatPipe: dateFormatPipe,
  private _translationService: TranslationService,
  private _amDatePipe: DateFormatPipe,
  private _utilService: utilService,
  private _infiniteScrollCheckService: InfiniteScrollCheckService,
  private _approvalService: ApprovalService) {}

  @Input() set param(data){
    if (this._utilityService.isObject(data)) {
      if (this.showRateChangesOnApproval) {
        this.rateMetaData = data;
      } else {
        this.selectedAuditRecord = data;
      }
      this.reset();
    }
  }


  ngOnInit() {
   this.approvalPendingInfoSubscribe = this._utilService.approvalPendingInfo.subscribe( (pendingRecordInfo) => {
      if (this._utilityService.isObject(pendingRecordInfo) && pendingRecordInfo.changeType === 'RateUpdate') {
          this.pendingRecord = pendingRecordInfo;
          this.getRuleChanges();
      }
    });
  }

  reset() {
    this.rateChanges = [];
    this.rateChangeItems = [];
    this.rateChangeConfig = {};
    this.rateChangeColDef = {};
    this.rateChangeGridData = [];
    this.currentLocale = this.currentLocale == null ? 'us' : this.currentLocale;
    this.calenderLocale = calenderLocaleFeilds[this.currentLocale];
    if (this._utilityService.isObject(this.selectedAuditRecord)) {
      this.getRateChangesMetaData();
    }
  }

  scrollInitialize(pagination) {
    this.pagination = pagination;
    this.getRuleChanges();    
  }
  
  getMoreData() {
    this._utilService.getScrollHeight(true);
    if(this.rateChangeConfig !== undefined && this.rateChangeGridData !== undefined) {
      this.moreData = this._infiniteScrollCheckService.getMoreScrollData(!this.rateChangeFetching, this.rateChangeGridData.length, this.pagination, this.totalPageSize, this.totalPages); 
      if (this.moreData !== undefined) {
         this.infiniteScrollCheck = this.moreData.infiniteScrollCheck;
         this.moreDataCalled = this.moreData.moreDataCalled;
         this.getRuleChanges();
      }
    }
  }

  getLessData() {
     if(this.rateChangeConfig !== undefined && this.rateChangeGridData !== undefined) {
    this.lessData = this._infiniteScrollCheckService.getLessScrollData(!this.rateChangeFetching, this.rateChangeGridData.length,this.pagination,this.moreDataCalled);
     if (this.lessData !== null) {
         this.infiniteScrollCheck = this.lessData.infiniteScrollCheck;
         this.moreDataCalled = this.lessData.moreDataCalled;
         this.getRuleChanges();
     }
    }
  }

  getRateChangesMetaData() {
    this.rateChangeFetching = true;
    this.rateChangeError = undefined;
    if (!this.showRateChangesOnApproval) {
      this._auditLogService.getRateChangeMetaData({
        data: {
          entityId: this.selectedAuditRecord.entityId,
          param: {
            scheduleAndMetadataInfo : !this.hasConfigData()
          }
        },
        success: (result) => {
          if (!this.hasConfigData()) {
            this.rateChangeConfig = {
              'metaData': result['tableMetadata'],
              'schedule': result['rateSchedule'],
              'pricelist': result['pricelist']
            };
            this.scheduleHeader = this.getScheduleHeader();
          }
          if (this.hasConfigData() && this.rateChangeConfig !== undefined) {
            this.showRateChanges();
          }else {
            this.rateChangeError = this._translationService.translate('TEXT_FILTERED_DATA_FETCHING_ERROR');
          }
          this.settingRateChanges();
        },
        failure: (errorMsg: string, code: number, error: any) => {
          this.rateChangeError = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
          this.loadGridData = false;
        },
        onComplete: () => {
          this.rateChangeFetching = false;
        }
      });
    }
  }

  public refreshGrid(records) {
    if (records !== undefined && this.totalPageSize !== undefined) {
      this.rateChangeGridData = this._infiniteScrollCheckService.infiniteScrollModalData(records, this.infiniteScrollCheck, this.pagination, this.totalPageSize);
    }
  }

  getRuleChanges() {
    this.rateChangeFetching = true;
    this.rateChangeError = undefined;
    this.rateResultTimer = this.rateResultTimer + 1;
    if (!this._utilityService.isObject(this.pendingRecord)) {
      this.rateChanges = [];
      this._auditLogService.getRateChanges({
        data: {
          entityId: this.selectedAuditRecord.entityId,
          createDate: this.selectedAuditRecord.createDt,
          param: {
            page: this.pagination.page,
            size: this.pagination.scrollPageSize
          }
        },
        success: (result) => {
          this.totalCount = result.totalCount;
          this.totalPages = result.totalPages;
          this.totalPageSize = result.totalPageSize;
          this._infiniteScrollCheckService.totalPages = this.totalPages;
          this.rateChangeColDef = {
            cols: this.rateTableCols,
            lazy: true,
            loading: true,
            scrollable: true
          };
          this.scheduleHeader = this.getScheduleHeader();
          this.rateChanges = result.records == null ? [] : result.records;
          this.prepareRateChangeItems();
          this.settingRateChanges();
        },
        failure: (errorMsg: string, code: number, error: any) => {
          this.rateChangeError = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
        },
        onComplete: () => {
          this.rateChangeFetching = false;
        }
      });
    } else {
        this._approvalService.getPendingRateChanges({
          data: {
            'approvalId' : this.pendingRecord.approvalId,
            'scheduleId': this.pendingRecord.uniqueItemId
          },
          success: (result) => {
            this.rateChangeColDef = {
              cols: this.rateTableCols,
              lazy: true,
              loading: true,
              scrollable: true
            };
            this.rateChanges = result == null ? [] : result;
            this.prepareRateMetaData(result);
            this.prepareApprovalRateChangeItems();
            this.settingRateChanges();
          },
          failure: (errorMsg: string, code: number, error: any) => {
            this.rateChangeError = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
          },
          onComplete: () => {
            this.rateResultTimer = this.rateResultTimer - 1;
            if (this.rateResultTimer === 0) {
              this.rateChangeFetching = false;
            }
          }
        });
    }
  }

  settingRateChanges() {
    if (this.rateChangeItems !== undefined && this.rateChangeConfig['metaData'] !== undefined) {
      this.setRatesChangesTableData(this.rateChangeItems, this.rateChangeConfig['metaData']);
    }
  }

  hasConfigData() {
    return this._utilityService.isObject(this.rateChangeConfig['metaData']);
  }
  onAddRateTableClose(event) {
    this._infiniteScrollCheckService.totalPages = 0;
    this.onClose.emit(true);
  }

  getScheduleHeader() {
    if(this.rateChangeConfig !== null && this.rateChangeConfig !== undefined && this.totalCount > 0){
    const schedule = this.rateChangeConfig['schedule'];
    let text = '';
    const rates = this._translationService.translate('TEXT_RATES');
    if (schedule) {
      text = ` ${schedule.description} : ${this._utilityService.getDateDescription(this.rateChangeConfig['schedule'])} `;
    }
    return ` ${text} (${this.totalCount} ${rates})`;
  }
  }

  getRateSourceHeader1() {
    if (!this.hasConfigData()) {
      return ' ';
    }
    const schedule = this.rateChangeConfig['schedule'];
    let text = this._translationService.translate('TEXT_RATE_SOURCE') + ': '
    + this.rateChangeConfig['pricelist']['name'] + ' ' + this._translationService.translate('TEXT_RATE_TABLE_FOR') + ' ';
    if (schedule) {
      text += (this.showRateChangesOnApproval) ?  schedule.ptDisplayName + ' (' + schedule.ptName + ') ' : schedule.ptDisplayName + ' ';
    }
    return text;
  }
  getRateSourceHeader2() {
    return 'Modified by ' + this.selectedAuditRecord.user + ' at ' + this.getLocaleDate(this.selectedAuditRecord.createDt);
  }

  getLocaleDate(date) {
    if (!this._utilityService.isObject(date)) {
      return '';
    }
    return this._amDatePipe.transform(date, this.calenderLocale.dateAndTimeFormat);
  }

  getRowClass(data, index) {
    return data.type === 'Added' ? 'ecb-rateChangeAdd' : 
    (data.type === 'Changed' ? 'ecb-rateChangeModify' : 
    (data.type === 'Removed' ? 'ecb-rateChangeDelete' : ''));
  }

  isStaticColumn(key) {
    return (this.staticLocalizedCols).indexOf(key) >= 0 ? true : false;
  }

  getTableHeaderName(col) {
    const colName = col.field.split('|')[0];
    const property = this.metaDataAsPerRuleName[colName];
    const isPerColumn = !property['_opParameterTableMetadata'] && property['columnoperator'];
    const displayName = col.key ? col.key : col.header;
    return isPerColumn ? displayName + '(' + this.getOperator(property.operator) + ')' : displayName;
  }

  showRateChanges() { 
    const metaData = this.rateChangeConfig['metaData'];
    this.metaDataAsPerRuleName = this.setMetaDataAsperColName(metaData);
    this.loadGridData = true;
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
                  'label' : property.enumData[i].name,
                  'value' : property.enumData[i].name
                };
                enums.push(obj);
              }
            }
          property['enumData'] = enums;
        }else if (property.dataType === 'char' || property.dataType === 'boolean') {
          enums.push({ 'label' : 'false', 'value' : false});
          enums.push({ 'label' : 'true', 'value' : true});
          property['enumData'] = enums;
        }
        metaDataAsPerRuleName[parameterTableMetaData[index]['name']] = property;
      }
    }
    return metaDataAsPerRuleName;
  }

  prepareRateChangeItems() {  
    this.rateChangeItems.length = 0; 
    for (const index in this.rateChanges) {
      if(this.rateChanges[index] !== undefined) {
        const rateChange: any = this.rateChanges[index];
        const revisedItem = rateChange['revisedItem'];      
         if(revisedItem !== null) {
          let item:any = {};
          item = revisedItem;
          if(rateChange['originalItem'] !== null)
          {
              item['originalItem'] =  rateChange['originalItem'];
          }
          item['type'] = rateChange['type'];
          (this.rateChangeItems).push(item);
         }  
           
        if (rateChange['type'] === 'Removed') {
          const item: any = {};
          const originalitem = rateChange['originalItem'];
            if (originalitem !== undefined) {
              const item: any = originalitem;
              item['type'] = rateChange['type'];
              item['originalItem'] = null;
              (this.rateChangeItems).push(item);
            }
          }
        }
      }
  }

  setRatesChangesTableData(data, metaData) {
    this.rateChangeGridData = [];
    this.holdRateChangeData = [];
    if (metaData !== undefined && data) {
      for (let i = 0; i < data.length; i++) {
          const rateRecord: any = this.configRateTableRecord(data[i], metaData, true);
          if(data[i]['originalItem'] !== null) {
            const originalRateRecord: any = this.configRateTableRecord(data[i]['originalItem'], metaData, true);
            this.originalItems[originalRateRecord.view['order']] = originalRateRecord.view;
          }
          this.holdRateChangeData.push(rateRecord.view);
      }
      this.processMetaData(metaData);
      this.createRateTable(metaData);
      if (this.pagination.page === 1) {
        this.rateChangeGridData = [];
        this.rateChangeGridData = this.holdRateChangeData;
      }
      this.refreshGrid(this.holdRateChangeData);
      setTimeout(function() {
        this.rateChangeFetching = false;
      }, 10);
    }
  }

  scrollReset() {
    this.pagination = this.pagination.reset();
  }

  loadData(event: any) {
    if (this.lazyLoad) {    
      this.scrollReset();
      this.getRuleChanges(); 
    }
    this.lazyLoad = true;
 }

  configRateTableRecord(rowData, metaData, isPersistRecord) {
    const ruleViewCols = {};   
    if( metaData !== undefined && rowData !== undefined) {
      const rules = rowData.conditions;
      const actions = rowData.actions;
      if (rules !== undefined && rules !== null && Object.keys(rules).length > 0) {
        for (const rule in rules) {
            if (rule !== undefined) {
            const property = this.getRateData(metaData)[rule];
            const isPerColumn = !property['_opParameterTableMetadata'] && property['columnoperator'];
            this.storeOperators(property.enumData !== null ? 'enum' : property.dataType);
            const operator = this.getOperator(rules[rule].operator);
            const columnText = (rules[rule].value && rules[rule].value !== 'null') || rules[rule].value == 0 ? rules[rule].value : '';
            const viewColumnText = this.getBooleanTextForViewMode(property.dataType, columnText);
            ruleViewCols[rule] = isPerColumn ? viewColumnText : operator + viewColumnText;
          }
        }
        ruleViewCols['TEXT_THEN'] = 'TEXT_THEN';
        for (const act in actions) {
          if (actions[act] !== undefined) {
            ruleViewCols[act] = this.getBooleanTextForViewMode(this.getRateData(metaData)[act].dataType, actions[act]);
          }
        }
      } else {
        for (const act in actions) {
          if (actions[act] !== undefined) {    
            ruleViewCols[act] = this.getBooleanTextForViewMode(this.getRateData(metaData)[act].dataType, actions[act]);
          }
        }
      }
      ruleViewCols['type'] = rowData.type;
      ruleViewCols['order'] = rowData.order;     
    }
    return {
      view : ruleViewCols
    };
   
  }

  processMetaData(metaData) {
    const conditionSet = [];
    const actionSet = [];
    const metaDataObjects = this.getRateData(metaData);
    this.rateTableCols = [];
    this.conditions = [];
    this.actions = [];
    if (this.rateChangeGridData.length === 0) {
      for (const index in metaData) {
        if (metaData[index] !== undefined) {
          const columnProperty = metaData[index];
          if (columnProperty.conditionColumn) {
            this.conditions.push(metaData[index]);
          }else {
            this.actions.push(metaData[index]);
          }
        }
      }
    }else {
      const record = this.rateChangeGridData[0];
      const conditionExist = record['TEXT_THEN'];
      let isConditions = false;
        for (const property in record) {
          if (!this.isRuleMiscproperties(property)) {
            if (!conditionExist) {
              this.actions.push(metaDataObjects[property]);
            }else {
              if (property === 'TEXT_THEN') {
                isConditions = true;
              }else if (!isConditions) {
                this.conditions.push(metaDataObjects[property]);
              }else {
                this.actions.push(metaDataObjects[property]);
              }
            }
          }
      }
    }
    for (const index in this.conditions) {
      if (this.conditions[index] !== undefined) {
        conditionSet.push(this.conditions[index].name);
      }
    }
    for (const index in this.actions) {
      if (this.actions[index] !== undefined) {
        actionSet.push(this.actions[index].name);
      }
    }
    this.conditionsList = conditionSet;
    this.actionsList = actionSet;
  }

  createRateTable(metaData) {
    this.setRateTableColumns(this.staticColumns.CHANGE, this.staticColumns.CHANGE, metaData);
    if (this.conditions.length > 0) {
      this.showIfBlock = true;
      this.setRateTableColumns(this.staticColumns.IF, this.staticColumns.IF, metaData);
    }
    for (const index in this.conditions) {
      if (this.conditions[index] !== undefined) {
        const displayName = this.conditions[index].displayName ? this.conditions[index].displayName : this.conditions[index].name;
        this.setRateTableColumns(this.conditions[index].name, displayName, metaData);
      }
    }
    if (this.conditions.length > 0) {
      this.setRateTableColumns('TEXT_THEN', 'TEXT_THEN', metaData);
    }
    for (const index in this.actions) {
      if (this.actions[index] !== undefined) {
        const action = this.actions[index];
        const displayName = action.displayName ? action.displayName : action.name;
        this.setRateTableColumns(this.actions[index].name, displayName, metaData);
      }
    }
  }

  setRateTableColumns(field, displayName, metaData) {
    const keyObj = {};
    keyObj['field'] = field;
    keyObj['key'] = displayName;
    if (!(this.isStaticColumn(displayName))) {
      keyObj['sortable'] = 'false';
      metaData.forEach((ele, index) => {
        if (ele.name === keyObj['field'] && ele.displayName === keyObj['key']) {
          keyObj['style'] = { 'width': '209px', 'required': ele.required, 'enum': ele.enumData, 'datatype': ele.dataType };
        }
      });
    }else if (displayName === this.staticColumns.CHANGE) {
      keyObj['style'] = {'width': '110px'};
    }else {
      keyObj['style'] = {'width': '50px'};
    }
    this.rateTableCols.push(keyObj);
  };

  isRuleMiscproperties(key) {
    return (this.ruleMiscproperties).indexOf(key) >= 0;
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

  getBooleanTextForViewMode(dataType, columnText) {
    return ['char', 'boolean'].indexOf(dataType) >= 0 ? {false : false, true : true}[columnText] : columnText;
  }

  getOperator(text) {
    return this._showOperator.transform(text);
  }
  
  getTextFieldClass(col) {
    const colName = col.field.split('|')[0];
    const property = this.metaDataAsPerRuleName[colName];
    return property.dataType === 'int' && !this.hasEnumData(col.field) || property.dataType === 'decimal' ? 'text-right' : "";
  }

  hasEnumData(field) {
    if (!this.metaDataAsPerRuleName[field]) {
      return false;
    }else {
      return this.metaDataAsPerRuleName[field].enumData ? true : false;
    }
  }

  getChangeTextByType(data) {
    return data.type === 'Added' ? 'TEXT_ADDED' : 
    (data.type === 'Changed' ? 'TEXT_MODIFIED' : 
    (data.type === 'Removed' ? 'TEXT_DELETED' : ''));
  }

  hasOriginalItems(data) {
    return this.getChangeTextByType(data) === 'TEXT_MODIFIED' && this.originalItems[data.order] != undefined;
  }

  isRuleChanged(data, col) {
    return this.originalItems[data.order][col.field] !== data[col.field];
  }
  prepareApprovalRateChangeItems() {
    this.rateChangeItems.length = 0;
    for (const index in this.rateChanges['changeDetails']) {
      if (this.rateChanges['changeDetails'][index] !== undefined) {
        const rateChange: any = this.rateChanges['changeDetails'][index];
        for (const revisedIndex in rateChange['revisedItems']) {
          if (rateChange['revisedItems'][revisedIndex] !== undefined) {
            const revisedItem = rateChange['revisedItems'][revisedIndex];
            if (revisedItem !== null) {
              let item: any = {};
              item = revisedItem;
              if (this._utilityService.isObject(rateChange['originalItems'])) {
                item['originalItem'] = rateChange['originalItems'][revisedIndex];
              }
              item['type'] = rateChange['type'];
              (this.rateChangeItems).push(item);
            }
          }
        }
        if (rateChange['type'] === 'Removed') {
          for (const originalIndex in rateChange['originalItems']) {
            if (rateChange['originalItems'][originalIndex] !== undefined) {
              const originalItem = rateChange['originalItems'][originalIndex];
              if (originalItem !== null) {
                originalItem['type'] = rateChange['type'];
                originalItem['originalItems'] = null;
                (this.rateChangeItems).push(originalItem);
              }
            }
          }
        }
      }
    }
    this.totalCount = this.rateChangeItems.length;
    this.scheduleHeader = this.getScheduleHeader();
  }
  prepareRateMetaData(result) {
    if (!this.hasConfigData()) {
      this.rateChangeConfig = {
        'metaData': this.rateMetaData,
        'schedule': result['rateSchedule'],
        'pricelist': result['pricelist']
      };
    }
    if (this.hasConfigData() && this.rateChangeConfig !== undefined) {
      this.showRateChanges();
    }else {
      this.rateChangeError = this._translationService.translate('TEXT_FILTERED_DATA_FETCHING_ERROR');
    }
  }
  getIntegerValue(col) {
    return col.style.enum === null && (col.style.datatype === 'int'|| col.style.datatype === 'decimal') ? 'integerValue' : '';
  }
  ngOnDestroy() {
    this.showRateChangesOnApproval = false;
    this.pendingRecord = {};
    this._utilService.changeApprovalPending({});
    if (this.approvalPendingInfoSubscribe) {
      this.approvalPendingInfoSubscribe.unsubscribe();
    }
  }
}
