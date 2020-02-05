import { AuthenticationService } from '../../app/security/authentication.service';
import {
  MockBackend, async, ComponentFixture, TestBed, inject, RouterTestingModule,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, TranslationModule,
  utilService, UtilityService, ajaxUtilService, HttpClientTestingModule,
  HttpClient, HttpHandler, TranslatePipe, LocaleService, TranslationService, TranslationConfig, TranslationHandler, TranslationProvider, Router,
  UrlConfigurationService, LowerCasePipe, dateFormatPipe,
    sharedService, contextBarHandlerService,pagination, showHidefunc, loadData, CapabilityService
} from '../../assets/test/mock';
import { ApprovalComponent } from './approval.component';
import { MockLocalService } from 'assets/test/mock-local-service';
import { MockRouter } from 'assets/test/mock-router';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MomentModule } from 'angular2-moment';
import { ApprovalService } from './approval.service';

describe('ApprovalComponent', () => {
  let component: ApprovalComponent;
  let fixture: ComponentFixture<ApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MomentModule],
      declarations: [ApprovalComponent, TranslatePipe, LowerCasePipe],
      providers: [ApprovalService, ajaxUtilService, UtilityService, dateFormatPipe,
          BaseRequestOptions, HttpClient, HttpHandler, TranslationService, TranslationConfig, TranslationHandler, TranslationProvider, UrlConfigurationService, MockBackend, sharedService, contextBarHandlerService, utilService, AuthenticationService, CapabilityService,
        { provide: LocaleService, useValue: MockLocalService },
        { provide: Router, useValue: MockRouter },
        { provide: ActivatedRoute, useValue: MockRouter },
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
      ], schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalComponent);
    component = fixture.componentInstance;
    component.pagination = pagination;
    component.approvalSidePanel = showHidefunc;
    component.schedId = 9867;
    component.approvalList = [{ changeType: 'OfferingUpdate',approvalId:166 }];
    component.pendingRecord = component.approvalList[0];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be initialized', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
  });

  it('should call ngOnInit', () => {
      const _utilSvc = fixture.debugElement.injector.get(utilService);
    component.pagination = pagination;
      component.ngOnInit();
      component.getApprovalCapabilities();
      component.getLoggedInUserName();
      _utilSvc.changeApprovalFromContextbar(true);
    component.initialize();
      component.getGridConfigData();
      _utilSvc.checkCallFilterData('approval');
  });

    it('should call getApprovalCapabilities', () => {
      const _capService = fixture.debugElement.injector.get(CapabilityService);
      _capService.loggedInUserCapabilities = {
        UIPoDetailsPage: { View_Approvals: true, manage_Approvals: true},
        UIPIDetailsPage: { View_Approvals: true, manage_Approvals: true},
        UISharedRateDetailsPage: { View_Approvals: true, manage_Approvals: true}
      };
      component.isLoadedFrom = 'offering';
      component.getApprovalCapabilities();
      component.isLoadedFrom = 'PIRates';
      component.getApprovalCapabilities();
      component.isLoadedFrom = 'sharedRates';
      component.getApprovalCapabilities();
    });

    it('should call alterColumnDefJson', () => {
      let colDef = { cols: [
        { field: "actions", key: "TEXT_ACTIONS", sortable: false, filter: false, editable: false },
        { field: "comment", header: "comment", key: "TEXT_COMMENT", filter: true, sortable: true },
        { field: "approvalId", header: "Modified Item ID", key: "TEXT_MODIFIED_ITEM_ID", filter: true}
      ]};
      component.alterColumnDefJson(colDef);
    });

  it('should call scrollInitialize', () => {
    component.scrollInitialize(pagination);
    });

    it('should call getDeviceWidth', () => {
      component.getDeviceWidth();
    });

    it('should call getApprovalInOfferingUpdate', () => {
      component.isApprovalRequestOn = true;
      component.schedID = 23;
      component.getApprovalInOfferingUpdate();
    });

    it('should call isUserSubmittedRequest', () => {
      component.loggedInUser = 'admin';
      component.isUserSubmittedRequest('Admin');
      component.loggedInUser = 'admin2';
      component.isUserSubmittedRequest('Admin');
    });

    it('should call prepareDisabledInputList', () => {
      component.disabledStatusList = [false, false];
      component.prepareDisabledInputList(2);
    });

  it('should check default sort order', () => {
    component.convertDefaultSortOrder();
    expect(component.convertedDefaultSortOrder).toEqual(-1);
    component.columnDef = { defaultSortOrder: 'asc' };
    component.convertDefaultSortOrder();
    component.convertDefaultItemSortOrder();
    component.itemHistoryColumnDef = {defaultSortOrder: 'asc'};
    expect(component.convertedDefaultSortOrder).toEqual(1);
    });

    it('should check filter column', () => {
      component.pagination = pagination;
      component.sortQuery = 'itemDisplayName|asc';
      component.tableQuery = 'descriptionId=%bun%';
      component.filterFields = ['itemDisplayName'];
      component.approvalFieldConfig("approvalId");
      component.clearFilters('itemDisplayName');
      expect(component.filterFields['itemDisplayName']).toEqual('');
    });

    it('should check loadData',()=>{
      component.loadData(loadData);
    });

    it('should call filterDataKeys', () => {
      component.filterDataKeys('event','itemDisplayName','result');
      component.filterFields = 'itemDisplayName';
      component.isFilterText('itemDisplayName');
    });

    it('should call fetchDateValues', () => {
      component.filterFields = ['submittedDate,changeLastModifiedDate'];
      component.fetchDateValues({selectedColumn: 'submittedDate', selectedValue: 'submittedDate' });
      expect(component.filterFields['submittedDate']).toEqual('submittedDate');
      component.pagination = pagination; 
      component.sortQuery = 'changeLastModifiedDate|asc';
      component.tableQuery = 'changeLastModifiedDate=%20/12/13%';
      component.fetchDateValues({selectedColumn: 'changeLastModifiedDate', selectedValue: 'changeLastModifiedDate' });
      expect(component.filterFields['changeLastModifiedDate']).toEqual('changeLastModifiedDate');
      component.pagination = pagination; 
      component.fetchDateValues({selectedColumn: '', selectedValue: '' });
    });

    it('should call fetchNumberFilter',()=>{
      component.filterFields = {};
      component.fetchNumberFilter({selectedColumn: 'approvalId', selectedValue: 'approvalId' });
      component.pagination = pagination;
      component.fetchNumberFilter({selectedColumn: '',selectedValue: ''});
    });

    it('should call getErrorMessageType', () => {
      component.loading = true;
      component.getErrorMessageType();
      component.filterErrorMessage = 'could not find service';
      component.loading = false;
      component.getErrorMessageType();
      component.filterErrorMessage = '';
      component.loading = false;
      component.getErrorMessageType();
      component.approvalList = [];
      component.getErrorMessageType();
      component.tableQuery = 'changeLastModifiedDate=%20/12/13%';
      component.getErrorMessageType();
    });

    it('should call cancelCoverHandler', () => {
      component.initialize();
      component.isSaveDisabled = false;
      component.cancelCoverHandler();
      component.isSaveDisabled = true;
      component.cancelCoverHandler();
    });

    it('should call onModalDialogCloseCancel', () => {
      component.initialize();
      component.onModalDialogCloseCancel({index: 1});
      component.onModalDialogCloseCancel({index: 0});
    });

    it('should call hideAsidePanel', () => {
      component.initialize();
      component.hideAsidePanel();
    });
  it('should check selected pending change to be displayed', () => {
    component.selectedListItem(0);
    expect(component.rowIndex).toEqual(0);
  });
  it('should call get item history changes', () => {
    component.getItemHistoryData();
    component.itemHistorySortQuery = 'submittedDate|desc'
    component.getItemHistoryChanges();
  });
  it('should call sortFields function',() =>{
    component.sortFields(loadData);
  });
  it('should call getErrorMessageTypeList', () => {
    component.loading = true;
    component.getErrorMessageTypeList();
    component.sortErrorMessage = 'could not find service';
    component.loading = false;
    component.getErrorMessageTypeList();
    component.sortErrorMessage = '';
    component.loading = false;
    component.getErrorMessageTypeList();
    component.itemHistoryChangesList = [];
    component.getErrorMessageTypeList();
    component.itemHistoryChangesList = [];
    component.sortQuery = 'submittedDate|desc';
    component.getErrorMessageTypeList();
  });
});
