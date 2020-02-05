import { Component, OnInit, OnDestroy, Input, OnChanges, ViewChild, HostListener, ViewEncapsulation } from '@angular/core';
import { RatesService } from '../rates.service';
import { Language, DefaultLocale, LocaleService, Translation, TranslationService } from 'angular-l10n';
import { utilService } from '../../helpers/util.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormsModule, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { modalService } from '../../helpers/modal-dialog/modal.service';
import { ISubscription } from 'rxjs/Subscription';
import { calenderLocaleFeilds } from '../../../assets/calenderLocalization';
import { CalendarModule } from 'primeng/primeng';
import { contextBarHandlerService } from '../../helpers/contextbarHandler.service';
import { element } from 'protractor';
import { DateFormatPipe } from 'angular2-moment';
import { CapabilityService } from '../../helpers/capabilities.service';
import { UtilityService } from '../../helpers/utility.service';

@Component({
  selector: 'ecb-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss'],
  providers: [RatesService, DateFormatPipe],
  encapsulation: ViewEncapsulation.None,
  host: {
    '(document:click)': 'onClick($event)'
  }
})
export class SchedulesComponent implements OnInit, OnDestroy {
  rateSchedules;
  rateSchedulesExisting;
  subscriptionsCount;
  scheduleCols;
  noOfSubscriber;
  schedulesLoading: boolean;
  loading: boolean;
  @Language() lang: string;
  scheduleIndex = 0;
  selectedSchedule;
  newSchedule;
  itemInstanceId;
  setRateScheduleData;
  rowIndex = 0;
  itemTemplateId;
  parameterTableId;
  showErrorMessage:boolean = false;
  pricelistId;
  schedId: number = -1;
  errorstatusText;
  EndDateFieldError = true;
  startDateFieldError = true;
  Obj;
  errorColumn = -1;
  deleteActionStatus = false;
  scheduleId: any;
  errorMessage: string;
  errorTooltip = false;
  tooltipIndex = -1;
  delteScheduleObj: any;
  deleteRowIndex: any;
  subscribeEvents: any[];
  selectedParametrTableMetaData: any[];
  isdisabled = true;
  schedulesSubscriptions: ISubscription;
  saveBtnCls: String = 'ebBtn';
  rateDispName: any;
  showCover = false;
  calenderLocale;
  currentLocale;
  rateRow;
  localeDateFormat: any;
  dateRangeError = false;
  deleteFromEditScreen: boolean;
  deleteScheduleError: String;
  addRows: any[] = [];
  editRows: any[] = [];
  deleteRows: any[] = [];
  copyRows: any[] = [];
  existingScheduleIdsList: any[] = [];
  nonSharedPriceListID;
  disableEdit;
  disableHistory = true;
  previousRowId = 0;
  dataSaveError = true;
  rateSchedulesStartDateOptions: any[] = [];
  rateSchedulesEndDateOptions: any[] = [];
  addTooltip;
  deleteTooltip;
  copyTooltip;
  editTooltip;
  startOffsetFormatError = true;
  endOffsetFormatError = true;
  startOffsetError = false;
  endOffsetError = false;
  startDateFuture = true;
  confirmDialog: number;
  editSchedules: any;
  defaultRowId: number;
  partiallySavedScheduleIdsList: any[] = [];
  auditlogHistoryAside;
  toggleAuditlog;
  rateParamsInfo;
  amLocaleDateFormat: any;
  editSchedulesCapability = false;
  loadGridData: any;
  deleteSchedulesCapability = true;
  sharedRateSchedulesCapability: any = {};
  @ViewChild('startDateType') startDateType: any;
  @ViewChild('endDateType') endDateType: any;
  @Input() type;
  scheduleCapabilities: any = {};
  showSchedulesSkeleton = false;
  deleteTabIndex = 0;
  @ViewChild('schedules') schedules: any;
  isSaveClicked = false;
  enableWidgetCheck = false;
  endDateFuture: boolean;

  @Input() set rateScheduleData(value) {
    if(!this.loading) {
      this.schedulesLoading = true;
    }
    this.rateSchedulesExisting = value;
    setTimeout(() => {
     
      if (this.rateSchedulesExisting !== undefined && this.rateSchedulesExisting != null && (this.rateSchedulesExisting).length > 0) {
        this.disableHistory = false;
        this.datesFormateHandler(this.rateSchedulesExisting);
        this.getRatesTable(this.scheduleIndex);
      } else {
        this.addDefaultRow();
        this.schedulesLoading = false;
      }
      for (let index = 0 ; index < this.rateSchedulesExisting.length; index++) {
        this.rateSchedulesExisting[index]['removeScheduleCapability'] = false;
      }
      JSON.parse(JSON.stringify( this.rateSchedulesExisting));
    }, 200);
    this.schedulesLoading = false;	
    this.loading = false;
  }

  @Input() set selectedRate(rate) {
    this.selectedParametrTableMetaData = rate.properties;
    this.itemTemplateId = rate.itemTemplateId;
    this.parameterTableId = rate.paramtableId;
    this.pricelistId = rate.pricelistId;
    this.rateDispName = rate.paramtableDisplayName;
    this.rateParamsInfo = rate;
    this.disableEdit = (rate.pricelistType === 'REGULAR');
  }

  @Input() set subscriptionCount(value) {
    this.noOfSubscriber = value;
  }

  @Input() set schedulesLoadingInfo(value) {
    if(value) {	   
      this.schedulesLoading = value;	
    }
  }

  @Input() set schedulesOnLoading(value) {	
    if(value === true) {	
      this.loading = value;	
    }	
  }

  constructor(private _ratesService: RatesService,
    private _utilService: utilService,
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _modalService: modalService,
    private locale: LocaleService,
    private _contextBarHandlerService: contextBarHandlerService,
    private _translationService: TranslationService,
    private _dateFormatPipe: DateFormatPipe,
    private _capabilityService: CapabilityService,
    private _utilityService: UtilityService) {
    this.confirmDialog = 0;
    this.itemInstanceId = this._route.snapshot.params['itemInstanceId'];
    this.addTooltip = this._translationService.translate('TEXT_ADD');
    this.deleteTooltip = this._translationService.translate('TEXT_DELETE');
    this.copyTooltip = this._translationService.translate('TEXT_COPY');
    this.editTooltip = this._translationService.translate('TEXT_EDIT');
  }

  ngOnInit() {
    this.getGridConfigData();
    if(this.schedulesOnLoading) {
      this.loading = true;	
    }
    this.currentLocale = this.locale.getCurrentLocale();
    this.calenderLocale = calenderLocaleFeilds[this.currentLocale];
    this.localeDateFormat = this.calenderLocale.localeDateFormat;
    this.amLocaleDateFormat = this.calenderLocale.amLocaleDateFormat;
    this.rateSchedulesStartDateOptions = [
    { label: this._translationService.translate('TEXT_NO_STARTDATE'), value: 'NOT_SET' },
    { label: this._translationService.translate('TEXT_SPECIFIC_STARTDATE'), value: 'EXPLICIT_DATE' },
    { label: this._translationService.translate('TEXT_NEXT_BILLING_CYCLE'), value: 'NEXT_BILL_PERIOD' },
    { label: this._translationService.translate('TEXT_DAYS_AFTER_SUB'), value: 'SUBSCRIPTION_RELATIVE' }];
    this.rateSchedulesEndDateOptions = [{ label: this._translationService.translate('TEXT_NO_ENDDATE'), value: 'NOT_SET' },
    { label: this._translationService.translate('TEXT_SPECIFIC_ENDDATE'), value: 'EXPLICIT_DATE' },
    { label: this._translationService.translate('TEXT_NEXT_BILLING_CYCLE'), value: 'NEXT_BILL_PERIOD' },
    { label: this._translationService.translate('TEXT_DAYS_AFTER_SUB'), value: 'SUBSCRIPTION_RELATIVE' }];
    // observe if user want to save data in DB
    const savePIRateSchedules = this._utilService.SavePIRateSchedules.subscribe(value => {
      if (value) {
        this.setRateSchedule();
      }
    });
    this.subscribeEvents = [];
    this.subscribeEvents.push(savePIRateSchedules);
  }

  getGridConfigData() {
    this._utilityService.getextdata({
      data: 'scheduleWidgetColumnDef.json',
      success: (result) => {
        this.scheduleCols = result.cols;
        this.configureCapabilities();
        this.loadGridData = true;
      },
      failure: (errorMsg: string, code: any) => {
        this.showErrorMessage = true;
        this.errorstatusText = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
        this.loadGridData = false;
        this.loading = false;
      }
      
    });
  }

  
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event): void {
    if (event.keyCode === 32 && this._utilityService.isObject(document.getElementById('ecb-schedulesTableEdit'))) {
      if (event.target.className.includes('fa-plus')) {
        this.addNewSchedule(this.schedules, event.target.id, false, false);
      } else if (event.target.className.includes('fa-clone')) {
        this.addNewSchedule(this.schedules, event.target.id, false, true);
      } else if (event.target.className.includes('fa-times-circle')) {
        const index = Number(event.target.id);
        this.deleteSchedule(this.rateSchedules[index], index, true)
      }
    }
    if (event.keyCode  ===  27) {
      if (this.confirmDialog  ===  0 && this._utilityService.isObject(document.getElementById('ecb-schedulesTableEdit'))) {
        this.cancelCoverHandler();
      }  else  {
        this.confirmDialog  =  0;
      }
      if (this._utilityService.isObject(this.auditlogHistoryAside)) {
        if (this._utilityService.isObject(document.getElementsByTagName('ecb-rate-changes')[0])) {
          this.confirmDialog  =  0;
        }  else if (this.confirmDialog === 0 && this.auditlogHistoryAside.visibleStatus) {
          this.closeAduitLogAside();
        }
      }
    }
  }

  configureCapabilities() {
    const scheduleCols = this.scheduleCols;
    if (this.type === 'Ratedetails') {
      this.scheduleCapabilities = this._capabilityService.getWidgetCapabilities('UIPIDetailsPage');
    } else if (this.type === 'SharedPriceDetails') {
      this.scheduleCapabilities = this._capabilityService.getWidgetCapabilities('UISharedRateDetailsPage');
    }
      this.editSchedulesCapability = this.isCapableOf( this.scheduleCapabilities, 'Schedules_Edit');
      this.deleteSchedulesCapability = this.isCapableOf(this.scheduleCapabilities, 'Schedules_Delete');
      if (!this.editSchedulesCapability && !this.deleteSchedulesCapability) {
        if (scheduleCols.length > 0) {
          for (let index = 0; index < scheduleCols.length; index++) {
            const element = scheduleCols[index];
            if (element.field == 'actions') {
              scheduleCols.splice(index, 1);
            }
          }
        }
        this.scheduleCols = scheduleCols;
      } else if (this.editSchedulesCapability  && !this.deleteSchedulesCapability) {
          scheduleCols[0]['style'].width = '160px';
      } else if (!this.editSchedulesCapability && this.deleteSchedulesCapability) {
          scheduleCols[0]['style'].width = '70px';
      } else {
          this.scheduleCols = scheduleCols;
      }
    }
  

  isCapableOf(capability, item) {
    if (Object.keys(capability).length > 0) {
      return capability.hasOwnProperty(item) ?
      (capability[item] === null && this._utilityService.isObject(item)? true : capability[item]) : true;
    }
  }

  removeScheduleFromUI(){
    for (const index in this.rateSchedulesExisting) {
      delete this.rateSchedulesExisting[index]['removeScheduleCapability'];
     }
     JSON.parse(JSON.stringify(this.rateSchedulesExisting));
  }

  onToolTipClose(value) {
    if (value) {
      this.errorColumn = null;
      this.clearHighlight();
    }
  }
  

  addNewSchedule(schedules, selectedRowIndex, enableWidget, isCopy) {
    this.previousRowId = -1;
    this.dateRangeError = false;
    this.startOffsetFormatError = true;
    this.startOffsetError = false;
    this.endOffsetFormatError = true;
    this.endOffsetError = false;
    this.startDateFieldError = true;
    this.startDateFuture = true;
    this.endDateFuture = true;
    this.EndDateFieldError = true;
    this.dataSaveError = true;
    this.saveBtnCls = 'ebBtn ebBtn-primary';
    this.isdisabled = false;
    this._utilService.checkIsSchedulesFormUpdated(true);
    this.errorColumn = -1;
    this.rowIndex = selectedRowIndex;
    this.enableWidgetCheck = enableWidget;
    if (enableWidget === true) {
      this.displayCoverHandler(schedules);
    }
    const selectedSchedule = this.rateSchedules[selectedRowIndex];
    this.itemTemplateId = this.rateSchedules[this.rowIndex].itemTemplateId;
    this.parameterTableId = this.rateSchedules[this.rowIndex].ptId;
    this.pricelistId = this.rateSchedules[this.rowIndex].pricelistId;
    if ((this.rateSchedules[0].schedId !== this.defaultRowId) || (enableWidget !== true)) {
      this.isdisabled = false;
      this.saveBtnCls = 'ebBtn ebBtn-primary';
      const rateSchedules = [];
      const uniqueNumber = -(Math.floor((Math.random() * 100000000) + 1));
      this.newSchedule = {
        schedId: uniqueNumber,
        timeLines: null,
        description: '',
        startDateType: 'EXPLICIT_DATE',
        startDateOffset: 0,
        startDate: new Date(),
        endDateType: 'NOT_SET',
        endDateOffset: 0,
        endDate: null,
        itemTemplateId: this.itemTemplateId,
        ptId: this.parameterTableId,
        pricelistId: this.pricelistId,
        removeScheduleCapability: true,
        rulesCount: ''
      };
      if (isCopy) {
        this.newSchedule['copyScheduleId'] = selectedSchedule.copyScheduleId ? selectedSchedule.copyScheduleId : selectedSchedule.schedId;
        this.newSchedule['description'] = 'Copy of ' + selectedSchedule.description;
        this.newSchedule['rulesCount'] = selectedSchedule.rulesCount;
        this.newSchedule['startDate'] = new Date();
        this.newSchedule['startDateType'] = 'EXPLICIT_DATE';
        this.newSchedule['startDateOffset'] = selectedSchedule.startDateOffset;
        this.newSchedule['endDate'] = null;
        this.newSchedule['endDateType'] = 'NOT_SET';
        this.newSchedule['endDateOffset'] = selectedSchedule.endDateOffset;
      }
      for (let index in this.rateSchedules) {
        if (parseInt(index, 10) === parseInt(selectedRowIndex, 10)) {
          rateSchedules.push(this.newSchedule);
        }
        rateSchedules.push(this.rateSchedules[index]);
      }
      this.rateSchedules = rateSchedules;
    }
    this._utilService.changePIDetailsUnsaveStatus(true);
    setTimeout(() => {
      if ((<HTMLInputElement>document.getElementById('des-' + selectedRowIndex)) != null) {
        (<HTMLInputElement>document.getElementById('des-' + selectedRowIndex)).focus();
      }
      if(this.rateSchedules[selectedRowIndex].startDateType === "NOT_SET") {
      this.startDateValidations(this.rateSchedules[selectedRowIndex].startDate, this.rateSchedules[selectedRowIndex], selectedRowIndex,false);
      }
       }, 300);
  }


  datesFormateHandler(rateSchedules) {
    if (rateSchedules !== undefined && rateSchedules != null && (rateSchedules).length > 0) {
      for (let i = 0; i < rateSchedules.length; i++) {
        if (rateSchedules[i].startDate != null && (rateSchedules[i].startDateType === 'EXPLICIT_DATE') || (rateSchedules[i].startDateType === 'NEXT_BILL_PERIOD')) {
          let startDateFormat;
          if (rateSchedules[i].startDateMillisec) {
            startDateFormat = new Date(rateSchedules[i].startDateMillisec);
          } else {
            const startDate = (new Date(rateSchedules[i].startDate).getMonth() + 1) + '/' + (new Date(rateSchedules[i].startDate).getDate()) + '/' + (new Date(rateSchedules[i].startDate).getFullYear());
            startDateFormat = new Date(startDate);
          }
          rateSchedules[i].startDate = startDateFormat;
        } else if (rateSchedules[i].startDateType === 'NOT_SET' || rateSchedules[i].startDateType === 'SUBSCRIPTION_RELATIVE') {
          rateSchedules[i].startDate = null;
        }
        if (rateSchedules[i].endDate != null && (rateSchedules[i].endDateType === 'EXPLICIT_DATE') || (rateSchedules[i].endDateType === 'NEXT_BILL_PERIOD')) {
          let endDateFormat;
          if (rateSchedules[i].endDateMillisec) {
            endDateFormat = new Date(rateSchedules[i].endDateMillisec);
          } else {
            const endDate = (new Date(rateSchedules[i].endDate).getMonth() + 1) + '/' + (new Date(rateSchedules[i].endDate).getDate()) + '/' + (new Date(rateSchedules[i].endDate).getFullYear());
            endDateFormat = new Date(endDate);
          }
          rateSchedules[i].endDate = endDateFormat;
        } else if (rateSchedules[i].endDateType === 'NOT_SET' || rateSchedules[i].endDateType === 'SUBSCRIPTION_RELATIVE') {
          rateSchedules[i].endDate = null;
        }
      }
    }
  }

  setRateSchedule() {
    if (this.rateRow != null) {
      this.Obj = this.rateRow;
      const idExists = this.checkIfExistingRow(this.Obj.schedId);
      const idSaved = this.checkIfSavedRow(this.Obj.schedId);
      if (idExists || idSaved) {
        this.setRateScheduleData = this.Obj;
        delete this.setRateScheduleData._$visited;
      } else {
        this.setRateScheduleData = {
          name: this.Obj.description,
          description: this.Obj.description,
          itemTemplateId: this.Obj.itemTemplateId,
          ptId: this.Obj.ptId,
          endDateOffset: 0,
          startDateOffset: 0,
          pricelistId: this.Obj.pricelistId,
          schedId: this.Obj.schedId,
          startDateType: this.Obj.startDateType,
          endDateType: this.Obj.endDateType,
          copyScheduleId: this.Obj.copyScheduleId
        }
      };
      if ((this.Obj.startDate != null && this.Obj.startDateType === 'EXPLICIT_DATE') || (this.Obj.startDateType === 'NEXT_BILL_PERIOD')) {
        this.setRateScheduleData.startDate = this.toIsoStringStartDate(new Date(this.Obj.startDate));
        this.setRateScheduleData.startDateOffset = 0;
      } else if (this.Obj.startDateType === 'NOT_SET') {
        this.setRateScheduleData.startDate = null;
      } else if (this.Obj.startDateType === 'SUBSCRIPTION_RELATIVE') {
        if (this.Obj.startDateOffset != null) {
          this.setRateScheduleData.startDateOffset = parseInt(this.Obj.startDateOffset, 10);
        }
        this.setRateScheduleData.startDate = null;
      }
      if ((this.Obj.endDate != null && this.Obj.endDateType === 'EXPLICIT_DATE') || (this.Obj.endDateType === 'NEXT_BILL_PERIOD')) {
        this.setRateScheduleData.endDate = this.toIsoStringStartDate(new Date(this.Obj.endDate));
        this.setRateScheduleData.endDateOffset = 0;
      } else if (this.Obj.endDateType === 'NOT_SET') {
        this.setRateScheduleData.endDate = null;
      } else if (this.Obj.endDateType === 'SUBSCRIPTION_RELATIVE') {
        if (this.Obj.endDateOffset != null) {
          this.setRateScheduleData.endDateOffset = parseInt(this.Obj.endDateOffset, 10);
        }
        this.setRateScheduleData.endDate = null;
      }

      // Save the rateschedule information into the database.
      if (this.startDateFieldError === true && this.EndDateFieldError === true) {
        if (this.setRateScheduleData.copyScheduleId !== undefined && this.setRateScheduleData.copyScheduleId != null) {
          this.copyRows.push(this.setRateScheduleData);
        } else if (!idExists && !idSaved) {
          this.addRows.push(this.setRateScheduleData);
        } else {
          let markedForDelete = false;
          for (let i = 0; i < this.deleteRows.length; i++) {
            if (this.deleteRows[i] === this.Obj.schedId) {
              markedForDelete = true;
            }
          }
          if (markedForDelete === false) {
            this.editRows.push(this.setRateScheduleData);
          }
        }
      }
    }
  }

  toIsoStringStartDate(date) {
    return date.getFullYear() + '-' + this.min2Digit((date.getMonth() + 1)) + '-' + this.min2Digit(date.getDate()) + 'T12:00:00Z';
  }
  toIsoStringEndDate(date) {
    return date.getFullYear() + '-' + this.min2Digit((date.getMonth() + 1)) + '-' + this.min2Digit(date.getDate()) + 'T23:59:59Z';
  }
  min2Digit(no) {
    return no < 10 ? '0' + no : no;
  }

  saveSchedules(schedules, editScheduleData) {
    this._ratesService.savePIRateSchedules({
      data: {
        body: editScheduleData
      },
      success: (result) => {
        let i, j;
        let count = 0;
        for (i = 0; i < result.length; i++) {
          if (parseInt(result[i].code, 10) !== 200) {
            count++;
          }
        }
        this.disableHistory = false;
        if (count <= 0) {
          this.partiallySavedScheduleIdsList = [];
          this.reLoadRateSchedules();
          this._utilService.SavePIRateSchedules.next(false);
          this._utilService.changePIDetailsUnsaveStatus(false);
          this._utilService.checkIsSchedulesFormUpdated(false);
          schedules.hide();
          this.showCover = false;
          this._utilService.checkNgxSlideModal(false);
          this.isdisabled = true;
          this.saveBtnCls = 'ebBtn';
        } else {
          if (count > 1) {
            this.showErrorMessage = true;
          }
          for (let k = 0; k < result.length; k++) {
            for (j = 0; j < this.rateSchedules.length; j++) {
              if (this.rateSchedules[j].schedId === parseInt(result[k].message, 10)) {
                if (result[k].code !== 200) {
                  this.errorColumn = j;
                  this.rateSchedules[j].error = true;
                  if (count === 1) {
                    this.dataSaveError = false;
                  }
                } else {
                  this.rateSchedules[j].schedId = result[k].data.schedId;
                  this.rateSchedules[j].effDateId = result[k].data.effDateId;
                  this.partiallySavedScheduleIdsList.push(result[k].data.schedId);
                }
              }
            }
          }
        }
      },
      failure: (errorMsg:string,code:any,error:any) => {
        this.handleError(error);
        this.errorMessage = this._utilityService.errorCheck(code,errorMsg,'CREATE');
        this.isdisabled = false;
        this.saveBtnCls = 'ebBtn ebBtn-primary';
      }
    });
  }

  reLoadRateSchedules() {
    this.errorTooltip = false;
    if (!this.loading) {
      this.schedulesLoading = true;
    }
    this.rowIndex = 0;
    this.errorColumn = -1;
    this.schedId = -1;
    this.rateSchedules = [];
    this.rateSchedulesExisting = [];
    this._ratesService.getRateSchedules({
      data: {
        paramTableId: this.parameterTableId,
        itemTemplateId: this.itemTemplateId,
        pricelistId: this.pricelistId
      },
      success: (result) => {
        this.rateSchedulesExisting = result.rates[0].rateSchedules;
        this.datesFormateHandler(result.rates[0].rateSchedules);
        this.updateExistingScheduleIdsList();
        const checkIfPreviousRowIdExists = this.checkIfExistingRow(this.previousRowId);
        if (checkIfPreviousRowIdExists) {
          for (let i = 0; i < this.rateSchedulesExisting.length; i++) {
            if (this.rateSchedulesExisting[i].schedId === this.previousRowId) {
              this.rowIndex = i;
              break;
            }
          }
        }
        this.getRatesTable(this.rowIndex);
        this.previousRowId = 0;
        this.focusOnElement(this.rowIndex);
      },
      failure: (errorMsg: string, code: any) => {
        this.schedulesLoading = false;
        this.loading = false;
        const scheduleLoadError = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
        this.handleError(scheduleLoadError);
      }
    });
  }

  private handleError(error) {
    this.showErrorMessage = true;
    this.errorstatusText = error;
  }

  startDateValidations(event, data, rowIndex, saveClicked) {
    this.isSaveClicked = saveClicked;
    if (this.rateSchedules[rowIndex].startDateType !== 'SUBSCRIPTION_RELATIVE' && this.rateSchedules[rowIndex].endDateType !== 'SUBSCRIPTION_RELATIVE') {
      this.dateRangeError = false;
      this.startOffsetFormatError = true;
      this.startOffsetError = false;
      this.endOffsetFormatError = true;
      this.endOffsetError = false;
      this.startDateFieldError = true;
      this.startDateFuture = true;
      this.endDateFuture = true;
      this.EndDateFieldError = true;
      this.dataSaveError = true;
      this.isdisabled = false;
      this.saveBtnCls = 'ebBtn ebBtn-primary';
      this._utilService.checkIsSchedulesFormUpdated(true);
      let startDate;
      if (event != null && event !== 'TEXT_NO_STARTDATE' && event !== '') {
        startDate = (new Date(event).getMonth() + 1) + '/' + (new Date(event).getDate()) + '/' + (new Date(event).getFullYear());
        const today = (new Date().getMonth() + 1) + '/' + (new Date().getDate()) + '/' + (new Date().getFullYear());
        this.rateSchedules[rowIndex].startDate = new Date(event);
        if ((this.rateSchedules[rowIndex].startDateType === 'EXPLICIT_DATE' ||
        this.rateSchedules[rowIndex].startDateType === 'NEXT_BILL_PERIOD') && !this.isSaveClicked) {
          if ((new Date(startDate).toISOString() < new Date(today).toISOString()) && this.startDateFieldError) {
            this.startDateFuture = false;
            this.errorColumn = rowIndex;
            this.rateSchedules[rowIndex].error = true;
            this.focusOnWarningStartEndDate(rowIndex, 'onSelect', 'Start');
          }
        }
        if (data.endDate != null && data.endDate !== 'TEXT_NO_STARTDATE' && data.endDate !== '' && this.isSaveClicked) {
          const endDate = (new Date(data.endDate).getMonth() + 1) + '/' + (new Date(data.endDate).getDate()) + '/' + (new Date(data.endDate).getFullYear());
          if ((new Date(endDate).toISOString() <= new Date(startDate).toISOString()) && this.endDateFuture && this.startDateFuture) {
            this.startDateFieldError = false;
            this.errorColumn = rowIndex;
            this.rateSchedules[rowIndex].error = true;
            this.focusOnWarningStartEndDate(rowIndex, 'blur', 'Start');
          }
        }
      }
      if (this.startDateFieldError && this.startDateFuture && event == null && this.rateSchedules[rowIndex].startDate == null && (this.rateSchedules[rowIndex].startDateType === 'EXPLICIT_DATE' || this.rateSchedules[rowIndex].startDateType === 'NEXT_BILL_PERIOD')) {
        this.errorColumn = rowIndex;
        this.startOffsetFormatError = false;
        this.rateSchedules[rowIndex].error = true;
      }
      if (this.startDateFieldError && this.startDateFuture && this.startOffsetFormatError) {
        let startdate1;
        let startdate2;
        let enddate1;
        let enddate2;
        for (let i = 0; i < this.rateSchedules.length; i++) {
          if (this.rateSchedules[i].startDateType !== 'SUBSCRIPTION_RELATIVE' && this.rateSchedules[i].endDateType !== 'SUBSCRIPTION_RELATIVE') {
            if (this.rateSchedules[i].startDate != null) {
            startdate1 = (new Date(this.rateSchedules[i].startDate).getMonth() + 1) + '/' + (new Date(this.rateSchedules[i].startDate).getDate()) + '/' + (new Date(this.rateSchedules[i].startDate).getFullYear());
            }
            if (this.rateSchedules[rowIndex].startDate != null) {
              startdate2 = (new Date(this.rateSchedules[rowIndex].startDate).getMonth() + 1) + '/' + (new Date(this.rateSchedules[rowIndex].startDate).getDate()) + '/' + (new Date(this.rateSchedules[rowIndex].startDate).getFullYear());
            }
            if (this.rateSchedules[i].endDate != null) {
              enddate1 = (new Date(this.rateSchedules[i].endDate).getMonth() + 1) + '/' + (new Date(this.rateSchedules[i].endDate).getDate()) + '/' + (new Date(this.rateSchedules[i].endDate).getFullYear());
            }
            if (this.rateSchedules[rowIndex].endDate != null) {
              enddate2 = (new Date(this.rateSchedules[rowIndex].endDate).getMonth() + 1) + '/' + (new Date(this.rateSchedules[rowIndex].endDate).getDate()) + '/' + (new Date(this.rateSchedules[rowIndex].endDate).getFullYear());
            }
            if (this.rateSchedules[i].startDateType !== 'NOT_SET' && this.rateSchedules[i].endDateType !== 'NOT_SET' && this.rateSchedules[rowIndex].startDateType !== 'NOT_SET' && this.rateSchedules[rowIndex].endDateType !== 'NOT_SET' && i !== rowIndex) {
              if (startdate1 === startdate2 && enddate1 === enddate2) {
                this.errorColumn = rowIndex;
                this.dateRangeError = true;
                this.rateSchedules[rowIndex].error = true;
                break;
              }
            }
             else if (this.rateSchedules[i].startDateType === 'NOT_SET' && this.rateSchedules[i].endDateType === 'NOT_SET' && this.rateSchedules[rowIndex].startDateType === 'NOT_SET' && this.rateSchedules[rowIndex].endDateType === 'NOT_SET' && i !== rowIndex) {
              this.errorColumn = rowIndex;
              this.dateRangeError = true;
              this.rateSchedules[rowIndex].error = true;
              break;
            }
            else if (this.rateSchedules[i].startDateType === 'NOT_SET' && this.rateSchedules[i].endDateType !== 'NOT_SET' && this.rateSchedules[rowIndex].startDateType === 'NOT_SET' && this.rateSchedules[rowIndex].endDateType !== 'NOT_SET' && i !== rowIndex) {
              if (enddate1 === enddate2) {
                this.errorColumn = rowIndex;
                this.dateRangeError = true;
                this.rateSchedules[rowIndex].error = true;
                break;
              }
            }
            else if (this.rateSchedules[i].startDateType !== 'NOT_SET' && this.rateSchedules[i].endDateType === 'NOT_SET' && this.rateSchedules[rowIndex].startDateType !== 'NOT_SET' && this.rateSchedules[rowIndex].endDateType === 'NOT_SET' && i !== rowIndex) {
              if (startdate1 === startdate2) {
                this.errorColumn = rowIndex;
                this.dateRangeError = true;
                this.rateSchedules[rowIndex].error = true;
                break;
              }
            }
          }
        }
      }
    }
  }

  endDateValidations(event, data, rowIndex, saveClick) {
    this.isSaveClicked = saveClick;
    if (this.rateSchedules[rowIndex].startDateType !== 'SUBSCRIPTION_RELATIVE' && this.rateSchedules[rowIndex].endDateType !== 'SUBSCRIPTION_RELATIVE') {
      this.dateRangeError = false;
      this.startOffsetFormatError = true;
      this.startOffsetError = false;
      this.endOffsetFormatError = true;
      this.endOffsetError = false;
      this.startDateFieldError = true;
      this.endDateFuture = true;
      this.EndDateFieldError = true;
      this.dataSaveError = true;
      this.isdisabled = false;
      this.saveBtnCls = 'ebBtn ebBtn-primary';
      this._utilService.checkIsSchedulesFormUpdated(true);
      let endDate;
      if (event != null && event !== 'TEXT_NO_ENDDATE' && event !== '') {
        endDate = (new Date(event).getMonth() + 1) + '/' + (new Date(event).getDate()) + '/' + (new Date(event).getFullYear());
        const today = (new Date().getMonth() + 1) + '/' + (new Date().getDate()) + '/' + (new Date().getFullYear());
        this.rateSchedules[rowIndex].endDate = new Date(event);
        if ((this.rateSchedules[rowIndex].endDateType === 'EXPLICIT_DATE' ||
        this.rateSchedules[rowIndex].endDateType === 'NEXT_BILL_PERIOD') && !this.isSaveClicked) {
          if ((new Date(endDate).toISOString() < new Date(today).toISOString()) && this.startDateFieldError) {
            this.endDateFuture = false;
            this.errorColumn = rowIndex;
            this.focusOnWarningStartEndDate(rowIndex, 'onSelect', 'End');
          }
        }
        if (data.startDate != null && data.startDate !== 'TEXT_NO_STARTDATE' && data.startDate != '' && this.isSaveClicked) {
          const startDate = (new Date(data.startDate).getMonth() + 1) + '/' + (new Date(data.startDate).getDate()) + '/' + (new Date(data.startDate).getFullYear());
          if ((new Date(startDate).toISOString() >= new Date(endDate).toISOString()) && this.endDateFuture && this.startDateFuture) {
            this.startDateFieldError = false;
            this.errorColumn = rowIndex;
            this.focusOnWarningStartEndDate(rowIndex, 'blur', 'End');
          }
        }
      }
      if (this.startDateFieldError && event == null && this.rateSchedules[rowIndex].endDate == null && (this.rateSchedules[rowIndex].endDateType === 'EXPLICIT_DATE' || this.rateSchedules[rowIndex].endDateType === 'NEXT_BILL_PERIOD')) {
        this.errorColumn = rowIndex;
        this.endOffsetFormatError = false;
      }
      if (this.startDateFieldError && this.endOffsetFormatError) {
        let startdate1;
        let startdate2;
        let enddate1;
        let enddate2;
        for (let i = 0; i < this.rateSchedules.length; i++) {
          if (this.rateSchedules[i].startDateType !== 'SUBSCRIPTION_RELATIVE' && this.rateSchedules[i].endDateType !== 'SUBSCRIPTION_RELATIVE') {
            if (this.rateSchedules[i].startDate != null) {
              startdate1 = (new Date(this.rateSchedules[i].startDate).getMonth() + 1) + '/' + (new Date(this.rateSchedules[i].startDate).getDate()) + '/' + (new Date(this.rateSchedules[i].startDate).getFullYear());
            }
             if (this.rateSchedules[rowIndex].startDate != null) {
              startdate2 = (new Date(this.rateSchedules[rowIndex].startDate).getMonth() + 1) + '/' + (new Date(this.rateSchedules[rowIndex].startDate).getDate()) + '/' + (new Date(this.rateSchedules[rowIndex].startDate).getFullYear());
             }
            if (this.rateSchedules[i].endDate != null) {
              enddate1 = (new Date(this.rateSchedules[i].endDate).getMonth() + 1) + '/' + (new Date(this.rateSchedules[i].endDate).getDate()) + '/' + (new Date(this.rateSchedules[i].endDate).getFullYear());
            }
            if (this.rateSchedules[rowIndex].endDate != null) {
              enddate2 = (new Date(this.rateSchedules[rowIndex].endDate).getMonth() + 1) + '/' + (new Date(this.rateSchedules[rowIndex].endDate).getDate()) + '/' + (new Date(this.rateSchedules[rowIndex].endDate).getFullYear());
            }
            if (this.rateSchedules[i].startDateType !== 'NOT_SET' && this.rateSchedules[i].endDateType !== 'NOT_SET' && this.rateSchedules[rowIndex].startDateType !== 'NOT_SET' && this.rateSchedules[rowIndex].endDateType !== 'NOT_SET' && i !== rowIndex) {
              if (startdate1 === startdate2 && enddate1 === enddate2) {
                this.errorColumn = rowIndex;
                this.dateRangeError = true;
                this.rateSchedules[rowIndex].error = true;
                break;
              }
            }
            else if (this.rateSchedules[i].startDateType === 'NOT_SET' && this.rateSchedules[i].endDateType !== 'NOT_SET' && this.rateSchedules[rowIndex].startDateType === 'NOT_SET' && this.rateSchedules[rowIndex].endDateType !== 'NOT_SET' && i !== rowIndex) {
              if (enddate1 === enddate2) {
                this.errorColumn = rowIndex;
                this.dateRangeError = true;
                this.rateSchedules[rowIndex].error = true;
                break;
              }
            }
          }
        }
      }
    }
  }

  getRatesTable(idx) {
    if (this.rateSchedulesExisting !== undefined && this.rateSchedulesExisting != null && (this.rateSchedulesExisting).length > 0) {
      this.selectedSchedule = this.rateSchedulesExisting[idx];
      if (this.previousRowId !== -1) {
        this.previousRowId = this.rateSchedulesExisting[idx].schedId;
      }
      const rateInfo = {
        parameterTableMetaData: this.selectedParametrTableMetaData,
        schedule: this.selectedSchedule,
        ptName: this.rateParamsInfo.paramtableName
      };
      this._utilService.changeRateSchedulerID(rateInfo);
    }
  }

  ngOnDestroy(): void {
    for (const index in this.subscribeEvents) {
      if (this.subscribeEvents[index]) {
        this.subscribeEvents[index].unsubscribe();
      }
    }

    if (this.schedulesSubscriptions) {
      this.schedulesSubscriptions.unsubscribe();
    }
    this._utilService.launchScheduleAuditLogHistory({ auditLog: true, schedulAuditLog: false, obj: {} });
  }

  getRowClass(data, index): String {
    return data.error ? 'errorDeleteSchedule' : 'noErrorDeleteSchedule';
  }

  deleteSchedule(scheduleData, index, editScreenEnabled) {
    this.previousRowId = -1;
    this.delteScheduleObj = null;
    if (editScreenEnabled) {
      if (this.rateSchedules.length > 1) {
        if (!(this.checkIfExistingRow(scheduleData.schedId)) && !(this.checkIfSavedRow(scheduleData.schedId))) {
          this.EndDateFieldError = true;
          this.startDateFieldError = true;
          this.startDateFuture = true;
          this.endDateFuture = true;
          this.dateRangeError = false;
          this.startOffsetFormatError = true;
          this.startOffsetError = false;
          this.endOffsetFormatError = true;
          this.endOffsetError = false;
          const tableData = JSON.parse(JSON.stringify(this.rateSchedules));
          tableData.splice(index, 1);
          this.rateSchedules = tableData;
          this.datesFormateHandler(this.rateSchedules);
          this.focusOnElement(index - 1);
        } else {
          this.isdisabled = false;
          this.saveBtnCls = 'ebBtn ebBtn-primary';
          this.deleteFromEditScreen = true;
          this.delteScheduleObj = scheduleData;
          this.deleteRowIndex = index + 1;
          this.errorTooltip = false;
          this.confirmDialog = 2;
        }
      }
    } else if (this.rateSchedulesExisting.length > 1) {
      this.deleteFromEditScreen = false;
      this.delteScheduleObj = scheduleData;
      this.deleteRowIndex = index + 1;
      this.deleteActionStatus = true;
      this.errorTooltip = false;
      this.confirmDialog = 2;
    }
    this.previousRowId = 0;
  }

  focusOnElement(index){
    index = (index < 0) === true ? 0 : index;
    const viewRowIndex = Number(index);
    setTimeout(() => {
      const firstElement = <HTMLInputElement>document.getElementById('des-'+viewRowIndex);
      if (firstElement != null) {
        firstElement.focus();
      }
      }, 100);    
  }

  disableExistingDeleteIcon() {
    return (this.rateSchedulesExisting.length < 2) ? true : false;
  }
  disableDeleteIcon() {
    if(this.rateSchedules.length < 2){
      this.deleteTabIndex = -1;
      return true;
    }
    else{
      this.deleteTabIndex = 0;
      return false;
    }
  }

  deleteScheduleFromList(scheduleID, deleteRowIndex) {
    if (!scheduleID) {
      this.reLoadRateSchedules();
      return;
    }
    if (this.rateSchedulesExisting.length === deleteRowIndex) {
      this.tooltipIndex = deleteRowIndex - 1;
    } else {
      this.tooltipIndex = deleteRowIndex;
    }
    this.errorTooltip = false;
    this._utilService.changeShowDeleteScheduleModal({ modalStatus: false, deleteRowIndex: -1, scheduleData: {} });
    this._ratesService.deleteScheduleDetail({
      data: {
        scheduleID: scheduleID
      },
      success: (result) => {
        this.reLoadRateSchedules();
      },
      failure: (errorMsg: string, code: any) => {
        this.errorTooltip = true;
        this.rateSchedulesExisting[deleteRowIndex - 1].error = true;
        this.deleteScheduleError = this._utilityService.errorCheck(code, errorMsg, 'DELETE');
      }
    });
  }

  clearHighlight() {
    for (let i in this.rateSchedules) {
      this.rateSchedules[i].error = false;
    }
    for (let i in this.rateSchedulesExisting) {
      this.rateSchedulesExisting[i].error = false;
    }
  }

  displayCoverHandler(schedules) {
    this.enableWidgetCheck = true;
    this.editSchedules = schedules;
    if (this.rateSchedulesExisting.length > 0) {
      if ((parseInt(this.rateSchedulesExisting[0].schedId, 10) === this.defaultRowId) && (this.enableWidgetCheck)) {
        this.rateSchedulesExisting[0].startDateType = 'NOT_SET';
        this.rateSchedulesExisting[0].endDateType = 'NOT_SET';
        this.rateSchedulesExisting[0].rulesCount = '';
        this.isdisabled = false;
        this.saveBtnCls = 'ebBtn ebBtn-primary';
      } else {
        this.isdisabled = true;
        this.saveBtnCls = 'ebBtn';
      }
    }    
    this.updateExistingScheduleIdsList();
    this.rateSchedules = JSON.parse(JSON.stringify(this.rateSchedulesExisting));
    this.datesFormateHandler(this.rateSchedules);
    this.showCover = true;
    this._utilService.checkNgxSlideModal(true);
    schedules.show();
    this.focusOnElement(0);
    this.enableWidgetCheck = false;
  }

  updateExistingScheduleIdsList() {
    this.existingScheduleIdsList = [];
    for (let i = 0; i < this.rateSchedulesExisting.length; i++) {
      this.existingScheduleIdsList.push(this.rateSchedulesExisting[i].schedId);
    }
    setTimeout(() => {
      this.schedulesLoading = false;
    }, 200);
  }

  closeEditPanel() {
    if (this.editSchedules !== undefined) {
      this.editSchedules.hide();
    }
    if (this.auditlogHistoryAside !== undefined) {
      this.auditlogHistoryAside.hide();
      this.toggleAuditlog = false;
    }
    this.showCover = false;
    this._utilService.checkNgxSlideModal(false);
    this._utilService.checkIsSchedulesFormUpdated(false);
    this.addRows = [];
    this.editRows = [];
    this.deleteRows = [];
    this.showErrorMessage = false;
    this.isdisabled = true;
    this.saveBtnCls = 'ebBtn';
    this.dateRangeError = false;
    this.startOffsetFormatError = true;
    this.startOffsetError = false;
    this.endOffsetFormatError = true;
    this.endOffsetError = false;
    this.startDateFieldError = true;
    this.startDateFuture = true;
    this.endDateFuture = true;
    this.EndDateFieldError = true;
    this.dataSaveError = true;
    if (this.partiallySavedScheduleIdsList.length > 0) {
      this.partiallySavedScheduleIdsList = [];
      this.reLoadRateSchedules();
    }
    if (this.rateSchedulesExisting.length > 0) {
      if (parseInt(this.rateSchedulesExisting[0].schedId, 10) === this.defaultRowId) {
        this.rateSchedulesExisting[0].startDateType = null;
        this.rateSchedulesExisting[0].endDateType = null;
        this.rateSchedulesExisting[0].rulesCount = '';
      }
    }
}

  onModalDialogCloseDelete(event) {
    this.confirmDialog = 0;
    this.focusOnElement(this.deleteRowIndex - 1);
    if (event.index === 1) {
      if (this.delteScheduleObj) {
        if (!this.deleteFromEditScreen) {
          this.deleteScheduleFromList(this.delteScheduleObj.schedId, this.deleteRowIndex);
        } else {
          this.deleteRows.push(this.delteScheduleObj.schedId);
          this.removeRecordFromView(this.deleteRowIndex - 1);
        }
      }
    }
  }
  removeRecordFromView(index) {
    if (this.deleteFromEditScreen) {
      const tableData = JSON.parse(JSON.stringify(this.rateSchedules));
      tableData.splice(index, 1);
      this.rateSchedules = tableData;
      this.focusOnElement(index - 1);
    } 
  }

  onModalDialogCloseCancel(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this.closeEditPanel();
    }
  }

  cancelCoverHandler() {
    if (this.isdisabled === false) {
      this.confirmDialog = 1;
    } else {
      this.closeEditPanel();
    }
    this._utilService.launchScheduleAuditLogHistory({ auditLog: false, schedulAuditLog: false, obj: {} });
  }

  processSchedules(schedules) {
    this.isSaveClicked = true;
    this.showSchedulesSkeleton = true;
    this.dateRangeError = false;
    this.dataSaveError = true;
    this.showErrorMessage = false;
    for (let i = 0; i < this.rateSchedules.length; i++) {
      if (this.rateSchedules[i].startDateType === 'SUBSCRIPTION_RELATIVE' && this.rateSchedules[i].endDateType === 'SUBSCRIPTION_RELATIVE') {
        this.setStartDateOffset(this.rateSchedules[i].startDateOffset, i, true);
        if (this.startOffsetError || !this.startOffsetFormatError) {
          this.rateSchedules[i].error = true;
          break;
        }
      } else {
        this.startDateValidations(this.rateSchedules[i].startDate, this.rateSchedules[i], i, true);
        if (this.dateRangeError || !this.startDateFieldError || !this.startOffsetFormatError) {
          break;
        }
      }
    }
    this.startDateFuture = true;
    this.endDateFuture = true;
    this.saveSchedulesAfterValidation(schedules);
    this.removeScheduleFromUI();
    this.showSchedulesSkeleton = false;
  }

  saveSchedulesAfterValidation(schedules) {
    if (!this.dateRangeError && this.startDateFieldError && this.EndDateFieldError && !this.startOffsetError && !this.endOffsetError && this.startOffsetFormatError && this.endOffsetFormatError) {
      this.isdisabled = true;
      this.saveBtnCls = 'ebBtn';
      for (let i = 0; i < this.rateSchedules.length; i++) {
        let addToEdit = false;
        const idExists = this.checkIfExistingRow(this.rateSchedules[i].schedId);
        const idSaved = this.checkIfSavedRow(this.rateSchedules[i].schedId);
        if (idSaved) {
          this.rateRow = this.rateSchedules[i];
          this.setRateSchedule();
        }
        if (idExists) {
          for (let j = 0; j < this.rateSchedulesExisting.length; j++) {
            if (this.rateSchedules[i].schedId === this.rateSchedulesExisting[j].schedId) {
              if (!(this.rateSchedules[i].description === this.rateSchedulesExisting[j].description &&
                this.rateSchedules[i].endDateOffset === this.rateSchedulesExisting[j].endDateOffset &&
                this.rateSchedules[i].startDateOffset === this.rateSchedulesExisting[j].startDateOffset &&
                this.rateSchedules[i].startDateType === this.rateSchedulesExisting[j].startDateType &&
                this.rateSchedules[i].endDateType === this.rateSchedulesExisting[j].endDateType)) {
                addToEdit = true;
                break;
              } else if (((this.rateSchedules[i].startDateType === 'NOT_SET' && this.rateSchedulesExisting[j].startDateType === 'NOT_SET') || (this.rateSchedules[i].startDateType !== 'NOT_SET' && this.rateSchedulesExisting[j].startDateType !== 'NOT_SET'))
                && ((this.rateSchedules[i].endDateType === 'NOT_SET' && this.rateSchedulesExisting[j].endDateType === 'NOT_SET') || (this.rateSchedules[i].endDateType !== 'NOT_SET' && this.rateSchedulesExisting[j].endDateType !== 'NOT_SET'))) {
                if (this.rateSchedules[i].startDateType !== 'NOT_SET' && this.rateSchedulesExisting[j].startDateType !== 'NOT_SET' && this.rateSchedules[i].startDateType !== 'SUBSCRIPTION_RELATIVE' && this.rateSchedulesExisting[j].startDateType !== 'SUBSCRIPTION_RELATIVE') {
                  if (this.rateSchedules[i].startDate.toISOString() !== new Date(this.rateSchedulesExisting[j].startDateMillisec).toISOString()) {
                    addToEdit = true;
                    break;
                  }
                }
                if (this.rateSchedules[i].endDateType !== 'NOT_SET' && this.rateSchedulesExisting[j].endDateType !== 'NOT_SET' && this.rateSchedules[i].endDateType !== 'SUBSCRIPTION_RELATIVE' && this.rateSchedulesExisting[j].endDateType !== 'SUBSCRIPTION_RELATIVE') {
                  if (this.rateSchedules[i].endDate.toISOString() !== new Date(this.rateSchedulesExisting[j].endDateMillisec).toISOString()) {
                    addToEdit = true;
                    break;
                  }
                }
              } else {
                addToEdit = true;
                break;
              }
            }
          }
          if (addToEdit) {
            addToEdit = false;
            this.rateRow = this.rateSchedules[i];
            this.setRateSchedule();
          }
        } else if (!idSaved) {
          this.rateRow = this.rateSchedules[i];
          this.setRateSchedule();
        }
      }
      const editScheduleData = {
        'createSet': this.addRows,
        'updateSet': this.editRows,
        'deleteIds': this.deleteRows,
        'copySet': this.copyRows
      };
      this.saveSchedules(schedules, editScheduleData);
      this.addRows = [];
      this.editRows = [];
      this.deleteRows = [];
      this.copyRows = [];
    }
  }

  setDesc(event, data, rowIndex) {
    this._utilService.checkIsSchedulesFormUpdated(true);
    this.isdisabled = false;
    this.saveBtnCls = 'ebBtn ebBtn-primary';
    this.rateSchedules[rowIndex].description = event;
  }

  checkIfExistingRow(schedId) {
    let exists = false;
    if (schedId === this.defaultRowId) {
      exists = false;
    } else {
      for (let k = 0; k < this.existingScheduleIdsList.length; k++) {
        if (schedId === this.existingScheduleIdsList[k]) {
          exists = true;
          break;
        }
      }
    }
    return exists;
  }

  checkIfSavedRow(schedId) {
    let exists = false;
    if (schedId === this.defaultRowId) {
      exists = false;
    } else {
      for (let k = 0; k < this.partiallySavedScheduleIdsList.length; k++) {
        if (schedId === this.partiallySavedScheduleIdsList[k]) {
          exists = true;
          break;
        }
      }
    }
    return exists;
  }

  onClick(event) {
  }

  validateStartType(value, rowIndex) {
    this._utilService.checkIsSchedulesFormUpdated(true);
    this.isdisabled = false;
    this.saveBtnCls = 'ebBtn ebBtn-primary';
    this.dateRangeError = false;
    this.startOffsetFormatError = true;
    this.startOffsetError = false;
    this.endOffsetFormatError = true;
    this.endOffsetError = false;
    this.startDateFieldError = true;
    this.startDateFuture = true;
    this.endDateFuture = true;
    this.EndDateFieldError = true;

    if (value != null && value === 'SUBSCRIPTION_RELATIVE') {
      this.rateSchedules[rowIndex].startDateType = value;
      this.rateSchedules[rowIndex].startDate = null;
      if (this.rateSchedules[rowIndex].endDateType !== 'SUBSCRIPTION_RELATIVE') {
      this.rateSchedules[rowIndex].endDateType = value;
      this.rateSchedules[rowIndex].endDate = null;
      }
    }
    if (value != null && value !== 'SUBSCRIPTION_RELATIVE') {
      this.rateSchedules[rowIndex].startDateType = value;
      this.rateSchedules[rowIndex].startDateOffset = 0;
      if (this.rateSchedules[rowIndex].endDateType === 'SUBSCRIPTION_RELATIVE') {
        this.rateSchedules[rowIndex].endDateType = 'NOT_SET';
        this.rateSchedules[rowIndex].endDate = null;
      }
    }
    if (value != null && value === 'NOT_SET') {
      this.rateSchedules[rowIndex].startDate = null;
      this.rateSchedules[rowIndex].startDateOffset = 0;
    }
  }

  validateEndType(value, rowIndex) {
    this._utilService.checkIsSchedulesFormUpdated(true);
    this.isdisabled = false;
    this.saveBtnCls = 'ebBtn ebBtn-primary';
    this.dateRangeError = false;
    this.startOffsetFormatError = true;
    this.startOffsetError = false;
    this.endOffsetFormatError = true;
    this.endOffsetError = false;
    this.startDateFieldError = true;
    this.startDateFuture = true;
    this.EndDateFieldError = true;
    this.endDateFuture = true;

    if (value != null && value === 'SUBSCRIPTION_RELATIVE') {
      this.rateSchedules[rowIndex].endDateType = value;
      this.rateSchedules[rowIndex].endDate = null;
      if (this.rateSchedules[rowIndex].startDateType !== 'SUBSCRIPTION_RELATIVE')
      {
      this.rateSchedules[rowIndex].startDateType = value;
      this.rateSchedules[rowIndex].startDate = null;
      }
    }
    if (value != null && value !== 'SUBSCRIPTION_RELATIVE') {
      this.rateSchedules[rowIndex].endDateType = value;
      this.rateSchedules[rowIndex].endDateOffset = 0;
      if (this.rateSchedules[rowIndex].startDateType === 'SUBSCRIPTION_RELATIVE') {
        this.rateSchedules[rowIndex].startDateType = 'NOT_SET';
        this.rateSchedules[rowIndex].startDate = null;
      }
    }
    if (value != null && value === 'NOT_SET') {
      this.rateSchedules[rowIndex].endDate = null;
      this.rateSchedules[rowIndex].endDateOffset = 0;
    }
  }

  setStartDateOffset(value, rowIndex, saveClick) {
    this.isSaveClicked = saveClick;
    this.dateRangeError = false;
    this.startOffsetFormatError = true;
    this.startOffsetError = false;
    this.endOffsetFormatError = true;
    this.endOffsetError = false;
    this.startDateFieldError = true;
    this.startDateFuture = true;
    this.endDateFuture = true;
    this.EndDateFieldError = true;
    this.dataSaveError = true;
    this.errorColumn = rowIndex;
    this.isdisabled = false;
    this.saveBtnCls = 'ebBtn ebBtn-primary';
    this._utilService.checkIsSchedulesFormUpdated(true);
    if (value != null) {
      this.rateSchedules[rowIndex].startDateOffset = value;
      const dateRegex = /^[0-9]\d*$/;
      this.startOffsetFormatError = dateRegex.test(value);
      if (parseInt(this.rateSchedules[rowIndex].startDateOffset, 10) > parseInt(this.rateSchedules[rowIndex].endDateOffset) && this.startOffsetFormatError) {
        this.startOffsetError = true;
      } 
      if (!this.startOffsetError && this.startOffsetFormatError) {
        for (let i = 0; i < this.rateSchedules.length; i++) {
          if (this.rateSchedules[i].startDateType === 'SUBSCRIPTION_RELATIVE' && this.rateSchedules[i].endDateType === 'SUBSCRIPTION_RELATIVE' && i !== rowIndex) {
            if (parseInt(this.rateSchedules[rowIndex].endDateOffset, 10) === parseInt(this.rateSchedules[i].endDateOffset, 10) && parseInt(this.rateSchedules[rowIndex].startDateOffset) === parseInt(this.rateSchedules[i].startDateOffset)) {
              this.dateRangeError = true;
              this.rateSchedules[rowIndex].error = true;
              break;
            }
          }
        }
      }
    } else {
      this.startOffsetFormatError = false;
    }
  }

  setEndDateOffset(value, rowIndex, saveClick) {
    this.isSaveClicked = saveClick;
    this.dateRangeError = false;
    this.startOffsetFormatError = true;
    this.startOffsetError = false;
    this.endOffsetFormatError = true;
    this.endOffsetError = false;
    this.startDateFieldError = true;
    this.startDateFuture = true;
    this.endDateFuture = true;
    this.EndDateFieldError = true;
    this.dataSaveError = true;
    this.errorColumn = rowIndex;
    this.isdisabled = false;
    this.saveBtnCls = 'ebBtn ebBtn-primary';
    this._utilService.checkIsSchedulesFormUpdated(true);
    if (value != null) {
      this.rateSchedules[rowIndex].endDateOffset = value;
      const dateRegex = /^[0-9]\d*$/;
      this.endOffsetFormatError = dateRegex.test(value);
      if (parseInt(this.rateSchedules[rowIndex].endDateOffset, 10) < parseInt(this.rateSchedules[rowIndex].startDateOffset, 10) && this.endOffsetFormatError) {
       this.endOffsetError = true;
      }
      
      if (!this.endOffsetError && this.endOffsetFormatError) {
        for (let i = 0; i < this.rateSchedules.length; i++) {
          if (this.rateSchedules[i].startDateType === 'SUBSCRIPTION_RELATIVE' && this.rateSchedules[i].endDateType === 'SUBSCRIPTION_RELATIVE' && i !== rowIndex) {
            if (parseInt(this.rateSchedules[rowIndex].endDateOffset, 10) === parseInt(this.rateSchedules[i].endDateOffset, 10) && parseInt(this.rateSchedules[rowIndex].startDateOffset, 10) === parseInt(this.rateSchedules[i].startDateOffset, 10)) {
              this.dateRangeError = true;
              this.rateSchedules[rowIndex].error = true;
              break;
            }
          }
        }
      }
    } else {
      this.endOffsetFormatError = false;
    }
  }

  addDefaultRow() {
    this.defaultRowId = -(Math.floor((Math.random() * 100000000) + 1));
    const defaultRow = {
      schedId: this.defaultRowId,
      timeLines: null,
      description: '',
      startDateType: 'null',
      startDateOffset: 0,
      startDate: null,
      endDateType: 'null',
      endDateOffset: 0,
      endDate: null,
      itemTemplateId: this.itemTemplateId,
      ptId: this.parameterTableId,
      pricelistId: this.pricelistId,
      rulesCount: ''
    };
    this.rateSchedulesExisting = [];
    this.rateSchedulesExisting.push(defaultRow);
  }

  launchAuditLogWidget(auditlogAside) {
    this.toggleAuditlog = true;
    this._utilService.launchScheduleAuditLogHistory({ auditLog: false, schedulAuditLog: true, obj: this.rateParamsInfo});
    this.auditlogHistoryAside = auditlogAside;
    this.showCover = true;
    this._utilService.checkNgxSlideModal(true);
    auditlogAside.show();
  }

  closeAduitLogAside() {
    this.toggleAuditlog = false;
    this.auditlogHistoryAside.hide();
    this.showCover = false;
    this._utilService.checkNgxSlideModal(false);
    this._utilService.changeCheckRateHistoryCalled(true);
  }
  changeStartDatetype(event, rowindex) {
      this.validateStartType(event, rowindex);
  }
  changeEndDateType(event, rowindex) {
    this.validateEndType(event, rowindex);
  }
  closeWarningTooltip(event, rowIndex) {
    if (!this.startDateFuture) {
      this.focusOnWarningStartEndDate(rowIndex, 'blur', 'Start');
      this.startDateFuture = true;
    } else if (!this.endDateFuture) {
      this.focusOnWarningStartEndDate(rowIndex, 'blur', 'End');
      this.endDateFuture = true;
    }
    this.onToolTipClose(event);
  }
  focusOnWarningStartEndDate(rowIndex, eventType, warningType) {
    let firstElement, secondElement;
    const commonSelector = '#ecb-schedulesTableEdit p-calendar[name=';
    if (warningType === 'Start') {
      firstElement = document.querySelector(commonSelector + 'startDateExplicit] input[id="' + rowIndex + '"]');
      secondElement = document.querySelector(commonSelector + 'startDateNextBill] input[id="' + rowIndex + '"]');
    } else if (warningType === 'End') {
      firstElement = document.querySelector(commonSelector + 'endDateExplicit] input[id="' + rowIndex + '"]');
      secondElement = document.querySelector(commonSelector + 'endDateNextBill] input[id="' + rowIndex + '"]');
    }
    if (firstElement !== null || secondElement !== null) {
      if (firstElement === null) {
        firstElement = <HTMLElement>secondElement;
      }
      if (eventType === 'blur') {
        firstElement.classList.remove('ecb-WarningInput');
      } else {
        firstElement.focus();
        firstElement.classList.add('ecb-WarningInput');
      }
    }
  }
}
