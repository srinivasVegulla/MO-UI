import { AuthenticationService } from '../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed, inject,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
  utilService, UtilityService, ajaxUtilService,
  RouterModule, HttpClient, HttpHandler, loadData,
  TranslationModule, UrlConfigurationService, svcData, dateFormatPipe,
  sharedService, contextBarHandlerService, getWindow, loadAuditData, pagination,
} from '../../assets/test/mock';
import { AuditLogComponent } from './auditLog.component';
import { AuditLogService } from './auditLog.service';

import { MomentModule } from 'angular2-moment';
import { InfiniteScrollCheckService } from '../helpers/InfiniteScrollCheck.service';
import { ExtendedPropertiesComponent } from 'app/productOffer/extendedProperties/extendedProperties.component';

describe('AuditLogComponent', () => {
  let component: AuditLogComponent;
  let fixture: ComponentFixture<AuditLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule, RouterTestingModule, TranslationModule.forRoot(), MomentModule],
      declarations: [AuditLogComponent],
      providers: [AuditLogService, ajaxUtilService, UtilityService, UrlConfigurationService,
        MockBackend, BaseRequestOptions, HttpClient, HttpHandler,
        sharedService, contextBarHandlerService, utilService, dateFormatPipe, InfiniteScrollCheckService,
        AuthenticationService,
        { provide: 'Window', useFactory: getWindow },
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ], schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.pagination = pagination;
    component.sortQuery = 'createDt|asc';
    component.tableQuery = 'createDt=%bun%';
    component.filterFields = {'auditId': 1};
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should be initialized', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
  });
  it('should check filter and sort', () => {
    component.columnDef = { defaultSortColumn: 'createDt', defaultSortOrder: 'desc' };
    component.convertDefaultSortOrder();
    expect(component.convertedDefaultSortOrder).toEqual(-1);
    component.columnDef = { defaultSortColumn: 'createDt', defaultSortOrder: 'asc' };
    component.convertDefaultSortOrder();
    expect(component.convertedDefaultSortOrder).toEqual(1);
    component.pagination = pagination;
    component.clearFilters('auditId');
    component.pagination = pagination;
    component.filterData();
    component.getAuditLogList();
    component.lazyLoad = true;
    component.pagination = pagination;
    component.loadData(loadAuditData);
    component.pagination = pagination;
    component.scrollReset();
    expect(component.getColumnSortOrder).toEqual('asc');
    component.removeFilterFetchingError();
    expect(component.isFilterText('createDt')).toBe(false);
  });
  it('should check filterDataKeys', () => {
    component.auditLogList = [{ auditId: 1 }];
    component.scrollInitialize(component.pagination);
    expect(component.loading).toBe(true);
    component.getMoreData();
    component.getLessData();
    component.auditLogList = undefined;
    component.getMoreData();
    expect(component.refreshDataCheck).toBe(false);
  });
  it('should test fetch number filter', () => {
    // check audit id filter
    component.fetchNumberFilter({selectedValue: '1', selectedColumn: 'auditId' });
    expect(component.filterFields['auditId']).toEqual('1');
    // check event id filter
    component.filterFields = {'eventId': 1};
    component.pagination = pagination;
    component.fetchNumberFilter({selectedValue: '2', selectedColumn: 'eventId' });
    expect(component.filterFields['eventId']).toEqual('2');
    // check event id filter
    component.filterFields = {'entityId': 1};
    component.pagination = pagination;
    component.fetchNumberFilter({selectedValue: '3', selectedColumn: 'entityId' });
    expect(component.filterFields['entityId']).toEqual('3');
    component.pagination = pagination;
    component.fetchNumberFilter({selectedValue: '', selectedColumn: 'auditId' });
  });
  it('should check rate schedule history ', () => {
    component.rateParamsData = {paramtableId: 1, itemTemplateId: 2, pricelistId: 3}
    component.activate();
    component.getRateScheduleHistory();
    component.pagination = pagination;
    component.getRateSchedulesAuditLogInfo(component.rateParamsData);
    expect(component.showRateChanges).toBe(true);
    component.onRateChangeClose({});
    expect(component.showRateChanges).toBe(false);
  });
  it('should check audit grid refresh ', () => {
    component.columnDef = { defaultSortColumn: 'createDt', defaultSortOrder: 'desc' };
    component.refreshData();
    expect(component.loadGridData).toBe(false);
    component.refreshGrid({});
    component.callSuccess({totalCount: 1, records: { auditId: 1 }});
    component.processProductOfferResult({totalCount: 1, records: { auditId: 1 }});
  });
  it('should check audit log date filters', () => {
    component.filterFields = {'ruleSetStartDate': '25/09/1993'};
    component.fetchCreateDtValues({selectedColumn : 'createDt', selectedValue : '25/09/1993'});
    component.pagination = pagination;
    component.fetchCreateDtValues({selectedColumn : 'ruleSetStartDate', selectedValue : '25/09/1993'});
    expect(component.filterFields['ruleSetStartDate']).toEqual('25/09/1993');
    component.pagination = pagination;
    component.fetchCreateDtValues({selectedColumn : 'ruleSetStartDate', selectedValue : ''});
    expect(component.clearRuleSetStartDate.length).toEqual(0);
    component.pagination = pagination;
    component.fetchCreateDtValues({selectedColumn : '', selectedValue : ''});
    component.pagination = pagination;
    component.filterDataDelay();
    expect(component.filterDataProcessing).toBe(true);
    component.getDeviceWidth();
  });
  it('should check audit log export to CSV & check validate event name ', () => {
    component.exportToCSV();
    expect(component.isDownload).toBe(false);
    expect(component.validateEventName(1402)).toBe(false);
    expect(component.validateEventName(1403)).toBe(true);
    component.errorMessage = 'Server error';
    expect(component.getErrorMessageType()).toEqual(1);
    component.errorMessage = '';
    component.auditLogList = [{ auditId: 1 }];
    expect(component.getErrorMessageType()).toEqual(0);
  });
  it('should call filterDataKeys', () => {
    component.filterDataKeys('event','displayName','result');
  });
});
