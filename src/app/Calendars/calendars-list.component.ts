import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Language, TranslationService } from 'angular-l10n';
import { utilService } from '../helpers/util.service';
import { UtilityService } from '../helpers/utility.service';
import { CalendarsService } from './calendars-list.service';
import { Router, NavigationStart } from '@angular/router';
import {Headers,Http,Response } from '@angular/http';
import { InfiniteScrollCheckService } from '../helpers/InfiniteScrollCheck.service';

@Component({
    selector: 'ecb-calendars',
    templateUrl: './calendars-list.component.html',
    styleUrls: ['./calendars-list.component.scss'],
    providers: []
})

export class CalendarListComponent implements OnInit, OnDestroy {
    @Language() lang: string;
    calendarListError: any;
    calendarList: any = [];
    calendarlistCols: any;
    filterFields: any;
    isFilterCriterialProcessing: boolean;
    filterQuery: any;
    sortQuery: any;
    calendarlistFetching: boolean;
    initCall: boolean;
    totalCount: number;
    totalPageSize: number;
    pagination: any;
    confirmDialog: number;
    showCreateCalendarPanel = false;
    calenderData;
    isCopyCalendar: boolean;
    propertiesPanel;
    calendarsColumnDef: any;
    convertedDefaultSortOrder: any;
    deleteTooltip;
    copyTooltip;
    isCalendarFormDirty: boolean;
    nextStateUrl: string;
    createTooltip;
    deleteCalendarData: any;
    deletecalendarErrorIndex: any;
    errorTooltip: boolean;
    canPODeleted: boolean;
    calendarId: any;
    deleteCalendarError: any;
    tooltipIndex;
    openInUseDetailsWidget = false;
    selectedFilterData: any;
    getColumnSortOrder: any;
    loadGridData:boolean = false;
    filterErrorMessage:boolean = false;
    infiniteScrollCheck: string = '';
    moreDataCalled: boolean;
    moreData;
    lessData;
    totalPages;
    isDeleteOrHide:boolean = false;
    refreshDataCheck:boolean = false;
    isFilterData: boolean;
    inUsePiData: any;
    removeScrollHeight: any;
    filteredField: any;
    filteredValue: any;
    filterKeys: any;
    isFilterCallTrue: boolean;
    showErrorMsg: boolean = false;
    calendarGridListError: string;
    
    @ViewChild('calListHead') calHeader: any;

    constructor(private _calendarService: CalendarsService,
        private _utilityService: UtilityService,
        private _utilService: utilService,
        private _router: Router,
        private _translationService: TranslationService,
        private _http: Http,
        private _infiniteScrollCheckService: InfiniteScrollCheckService) {
            this.copyTooltip = this._translationService.translate('TEXT_COPY');
            this.deleteTooltip = this._translationService.translate('TEXT_DELETE');
            this.createTooltip = this._translationService.translate('TEXT_CREATE_CALENDAR');
            this.reset();
            this.isFilterCallTrue = false;
    }

    scrollInitialize(pagination) {
        this.pagination = pagination;
    }

    scrollReset() {
        this.pagination = this.pagination.reset();
    }

    getMoreData() {
        this._utilService.getScrollHeight(true);
        if (this.calendarList !== undefined && !this.refreshDataCheck && !this.isDeleteOrHide) {
        this.moreData = 
        this._infiniteScrollCheckService.getMoreScrollData(!this.calendarlistFetching,this.calendarList.length,this.pagination,this.totalPageSize,this.totalPages);
        if (this.moreData !== undefined) {
            this.infiniteScrollCheck = this.moreData.infiniteScrollCheck;
            this.moreDataCalled = this.moreData.moreDataCalled;
            this.getCalendarLists();
        }
        } else {
            this.refreshDataCheck = false;
        }
    }

  getLessData() {
     if(this.calendarList !== undefined && !this.isDeleteOrHide){
    this.lessData = this._infiniteScrollCheckService.getLessScrollData(!this.calendarlistFetching,this.calendarList.length,this.pagination,this.moreDataCalled);
     if (this.lessData !== null) {
         this.infiniteScrollCheck = this.lessData.infiniteScrollCheck;
         this.moreDataCalled = this.lessData.moreDataCalled;
         this.getCalendarLists();
     }
    }
  }

    public reset() {
        this.calendarlistCols = [];
        this.calendarListError = null;
        this.calendarList = [];
        this.initializeFields();
        this.isFilterCriterialProcessing = false;
        this.calendarlistFetching = true;
        this.initCall = true;
        this.totalCount = 0;
        this.totalPageSize = 0;
        this.showErrorMsg = false;
    }

    ngOnInit() {
        this.getGridConfigData();
        this._utilService.changedynamicSaveBtn('');
        this._utilService.checkNgxSlideModal(false);
        this._utilService.updateApplyBodyScroll(false);
        this.nextStateUrl = this._calendarService.calendarDetailsPath;
        this._router.events
          .filter(event => event instanceof NavigationStart)
          .subscribe(value => {
            this.nextStateUrl = value['url'];
          });
        this._utilService.removeScrollHeight.subscribe(value => {
            if (value !== 0) {
                this.removeScrollHeight = value;
            }
        });
        this._utilService.callFilterData.subscribe(value => {
          if (value === 'calendars') {
            this.prepareFilterQuery();
          }
        });
    }

      calculateGridScrollHeight() {
        if (window.innerWidth <= 991) {
            const systembarHeight = 42;
            const extraPadding = 25;
            this.removeScrollHeight = systembarHeight + this.calHeader.nativeElement.clientHeight + extraPadding;
        }
        if (this._utilityService.isTicketLogin()) {
            return { overflow: 'auto', height: 'calc(92vh - ' + `${this.removeScrollHeight}` + 'px)' }
        } else {
            return { overflow: 'auto', height: 'calc(100vh - ' + `${this.removeScrollHeight}` + 'px)' }
        }
      }

    getGridConfigData() {
       this._utilityService.getextdata({
          data: 'calendarsColumnDef.json',
          success: (result) => {
           this.calendarsColumnDef = result;
           this.convertDefaultSortOrder();
           this.sortQuery[this.calendarsColumnDef.defaultSortColumn] = this.calendarsColumnDef.defaultSortOrder;
           this.calendarlistCols = this.calendarsColumnDef.cols;
           this.loadGridData = true;
           this.getCalendarLists();
          },
          failure: (errorMsg: string, code: any, error: any) => {
            this.calendarlistFetching = false;
            this.showErrorMsg = true;
            this.calendarGridListError = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
          }
        });
      }

    fetchUsageCount(value){
     this.selectedFilterData = value;
     if (this.selectedFilterData.selectedValue !== '' && this.selectedFilterData.selectedValue !== null) {
        this.filterFields['usageCount'] = [this.selectedFilterData.selectedValue, '0|!='];
        this.prepareFilterQuery();
        } else {
        this.clearFilters(this.selectedFilterData.selectedColumn);
      }
    }

    convertDefaultSortOrder() {
        this.convertedDefaultSortOrder = (this.calendarsColumnDef.defaultSortOrder === 'asc') ? 1 : -1;
    }
    openCreateCalendarPanel() {
      this.propertiesPanel = true;
      this.isCopyCalendar = false;
      this.showCreateCalendarPanel = true;
    }
    copyCalendarsHandler(data){
      this.calenderData = data;
      this.isCopyCalendar = true;
      this.propertiesPanel = true;
      this.showCreateCalendarPanel = true;
    }
    hidePropertiesWidget(value) {
      if (value) {
        this.showCreateCalendarPanel = false;
      }
    }
    isFormDirty(value) {
        this.isCalendarFormDirty = value ? true : false;
    }
    canDeactivate() {
        if (this.isCalendarFormDirty) {
          const data = {
            url: this.nextStateUrl
          };
          this._utilService.changePreventUnsaveChange(data);
          return false;
        } else {
          return true;
        }
      }

    public getCalendarLists() {
        this.calendarListError = '';
        this.showErrorMsg = false;
        this.calendarlistFetching = true;
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
        this._calendarService.getCalendarLists({
            data: criteria,
            success: (result) => {
            result.filter ? this.filterKeys = result.filter : this.filterKeys = undefined;
            if (this.filterKeys !== undefined) {
                this.isFilterCallTrue = this._utilityService.getLatestServiceData(this.filterKeys, this.filteredField, this.filteredValue);
            }
            if(!this.isFilterCallTrue) {
                this.processGridData(result.records);
            }
                this.totalCount = result.totalCount;
                this.totalPageSize = result.totalPageSize;
                this.totalPages = result.totalPages;
                this._infiniteScrollCheckService.totalPages = this.totalPages;
            },
            failure: (errorMsg: string, code: any, error: any) => {
              this.calendarList = [];
              this.calendarlistFetching = false;
              this.calendarListError = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
            },
            onComplete: () => {
                this.calendarlistFetching = false;
                this.initCall = false;
            }
        });
    }

    public processGridData(records) {
        if(this.isDeleteOrHide) {
          if (this.pagination.page > 1) {
            this.calendarList = this._infiniteScrollCheckService.callProductDelete(this.calendarList, this.tooltipIndex, this.pagination);
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
      if (this.pagination.page === 1 && this.isFilterData) {
        this.calendarList = [];
      }
      this.calendarList = this._infiniteScrollCheckService.infiniteScrollData(records, this.infiniteScrollCheck, this.pagination,this.totalPageSize);
    }

    numberFieldConfig(field) {
        const fields = {
            usageCount: 'usageCount',
        };
        return fields[field] ? fields[field] : null;
    }
    
    private prepareFilterQuery() {
        this._utilityService.resetPagination(this.pagination);
        this.filterQuery = {};
        this.isFilterData = true;
        for (let key of Object.keys(this.filterFields)) {
            if (this.filterFields[key] !== null && this.filterFields[key] !== '' && this.filterFields[key] !== undefined) {
                const dLangProperty = this._utilityService.dLangPropertyNames(key);
                if (dLangProperty) {
                    this.filterQuery[dLangProperty] = this.filterFields[key].trim();
                } else if (this.numberFieldConfig(key)) {
                  this.filterQuery[key] = this.filterFields[key];
                } else {
                  this.filterQuery[key] = `'%${this.filterFields[key].trim()}%'|like`;
                }
              }
        }
        this.scrollReset();
        this.getCalendarLists();
    }
    filterDataKeys(event, field, value) {
      this.filteredField = field;
      this.filteredValue = value;
      this._utilityService.enableFilter(event, 'calendars');
    }
    public getCalenderListData() {
        if (this.isFilterCriterialProcessing === false) {
            this.isFilterCriterialProcessing = true;
            setTimeout(() => {
                this.isFilterCriterialProcessing = false;
                this.prepareFilterQuery();
            }, 300);
        }
    }

    public loadData(event) {
        if (!this.initCall) {
            this._utilityService.resetPagination(this.pagination);
            this.sortQuery = {};
            if (event.sortField !== undefined) {
                this.getColumnSortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
            }
            const dLangProperty = this._utilityService.dLangPropertyNames(event.sortField);
            this.sortQuery[dLangProperty ? dLangProperty : event.sortField] = this.getColumnSortOrder;
            this.scrollReset();
            this.getCalendarLists();
        }
    }

    public clearFilters(column) {
        this.filterFields[column] = '';
        this.isFilterData = false;
        this.prepareFilterQuery();
    }

    public isFilterText(column) {
        return this.filterFields[column] && this.filterFields[column].length > 0 ? true : false;
    }

    public isDeleteCalendarList(record) {
        return record.inUsePriceItemListSize > 0 ? false : true;
    }

    getErrorMessageType() {
        const filterCriteriaLength = !this._utilityService.isObject(this.filterQuery) ? 0 : Object.keys(this.filterQuery).length;
        if (this.calendarlistFetching) {
            return 0;
        }
        if (this.calendarListError) {
            return 1;
        } else if (this.calendarList.length === 0  && filterCriteriaLength === 0) {
            if (this.calendarListError == '') {
              return 2;
            }
        } else if (this.calendarList.length === 0 && filterCriteriaLength > 0) {
            if (this.calendarListError == '') {
              return 3;
            }
        }
        return 0;
    }

    refreshData() {
        this.loadGridData = false;
        this.initCall = true;
        this.showErrorMsg = false;
        this.calendarlistFetching = true;
        this.getGridConfigData();
        this.initializeFields();
        this.refreshDataCheck = true;
        this._utilityService.resetPagination(this.pagination);
        this.sortQuery[this.calendarsColumnDef.defaultSortColumn] = this.calendarsColumnDef.defaultSortOrder;
        this._utilService.changedRefreshNumberDateFilter(true);
        this._utilService.updateChangeScrollposition('refresh');
    }

    initializeFields() {
        this.filterFields = {};
        this.filterQuery = {};
        this.sortQuery = {};
    }
    redirectToDetailPage(data) {
        const loadCalendarUrl = this._calendarService.calendarDetailsPath + data.calendarId;
        this._utilService.addNewRecord({
        obj: data,
        path: loadCalendarUrl,
        Level: 'Grid'
    });
        this._router.navigateByUrl(loadCalendarUrl);
    }
    getDeviceWidth() {
        return window.innerWidth + 'px';
    }
  
    openInuseOfferings(rowData) {
        this.openInUseDetailsWidget = true;
        this.inUsePiData = rowData;
    }
    hideInUseCalendarModalDialog(e) {
        if (e) {
          this.openInUseDetailsWidget = false;
        }
      }
    deleteCalendar(data, index) {
      if (this.isDeleteCalendar(data)) {
        this.deleteCalendarData = data;
        this.deletecalendarErrorIndex = index;
        this.errorTooltip = false;
        this.confirmDialog = 1;
      }
    }
    onModalDialogCloseDelete(event) {
        this.confirmDialog = 0;
        if (event.index === 1) {
          this.canPODeleted = true;
          this.deleteCalendarFromList(this.deleteCalendarData['calendarId'], this.deletecalendarErrorIndex);
          this.canPODeleted = false;
        }
    }
    deleteCalendarFromList(calendarId, index) {
        this.calendarId = calendarId;
        this.tooltipIndex = index;
        this._utilService.getScrollHeight(true);
        const widgetData = {
            calendarId,
        };
        this._calendarService.deleteCalendar({
          data: widgetData,
          success: (result) => {
            this.calendarList.splice(this.tooltipIndex, 1);
            this.isDeleteOrHide = true;
            if (this.infiniteScrollCheck === 'Less') {
              this.pagination.page += 2;
              this.infiniteScrollCheck = 'More';
            }
            this.getCalendarLists();
          },
          failure: (errorMsg: string, code: any) => {
            let deleteCalenderError =  this._utilityService.errorCheck(code, errorMsg, 'DELETE');
            this.handleErrorDeletePO(deleteCalenderError, index);
          }
        });
    }
    handleErrorDeletePO(error, index) {
        this.tooltipIndex = index;
        this.calendarList[index].error = true;
        this.errorTooltip = true;
        this.deleteCalendarError = error;
    }
    public isDeleteCalendar(data) {
        return data.usageCount > 0 ? false : true;
      }
    ngOnDestroy() {
      this._infiniteScrollCheckService.totalPages = 0;
      this._utilService.checkCallFilterData('');
    }
}
