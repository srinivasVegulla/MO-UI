import { AuthenticationService } from '../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed, inject,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
  utilService, UtilityService,ajaxUtilService, dateFormatPipe,
  RouterModule, HttpClient, HttpHandler, FormBuilder, loadData, showHidefunc,
  TranslationModule, UrlConfigurationService, svcData, keyEventData, pagination
} from '../../assets/test/mock';
import { AdjustmentReasonsGridComponent } from './adjustmentReasonsGrid.component';

import { AdjustmentReasonsGridService } from './adjustmentReasonsGrid.service';
import { InfiniteScrollCheckService } from './../../app/helpers/InfiniteScrollCheck.service';

describe('AdjustmentReasonsGridComponent', () => {
  let component: AdjustmentReasonsGridComponent;
  let fixture: ComponentFixture<AdjustmentReasonsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule, RouterTestingModule, TranslationModule.forRoot()],
      declarations: [AdjustmentReasonsGridComponent],
      providers: [AdjustmentReasonsGridService, ajaxUtilService, UtilityService, UrlConfigurationService,
        MockBackend, BaseRequestOptions, HttpClient, HttpHandler, utilService, dateFormatPipe, InfiniteScrollCheckService,
        AdjustmentReasonsGridComponent, FormBuilder, AuthenticationService,
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
    const fixtureBody = `<div id="initDisplayNameFocus"></div>
    <div id="initFocus"></div>`;
    document.body.insertAdjacentHTML(
      'afterbegin',
      fixtureBody);
    fixture = TestBed.createComponent(AdjustmentReasonsGridComponent);
    component = fixture.componentInstance;
    component.columnDef = {cols: {field: {displayName: 'name'}}};
    fixture.detectChanges();
  });

  it('should call AdjustmentReasonsGridComponent service...',
    inject([AdjustmentReasonsGridService], (service: AdjustmentReasonsGridService) => {
      expect(service).toBeTruthy('');
      service.createAdjustmentReason(svcData);
      service.updateAdjustmentReason(svcData);
    })
  );
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should be initialized', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
  });
  // it('should check loadData', () => {
  //      component.columnDef = {defaultSortColumn: 'name', defaultSortOrder: 'asc'};
  //     component.lazyLoad = true;
  //     component.pagination = pagination;
  //     component.filterFields = ['name'];
  //     component.pagination = pagination;
  //     component.clearFilters('name');
  //     component.loadData(loadData);
  //     component.convertDefaultSortOrder()
  //     expect(component.getColumnSortOrder).toEqual('asc');
  //     expect(component.isFilterText('ptDisplayName')).toBe(false);
  //     component.pagination = pagination;
  //     component.filterData();
  //     expect(component.isFilterData).toBe(true);
  //     component.pagination = pagination;
  //     component.removeFilterFetchingError();
  //     expect(component.filterErrorMessage).toEqual('');
  //      component.saveAdjustmentReason();
  //   expect(component.isSaveAdjustment).toBe(true);
  //   });
  
  it('should check adjustment reason aside with cancel and close events', () => {
    component.createAdjustmentReasonAside = showHidefunc;
    component.showCreateAdjustmentReason(true, 'adj');
    expect(component.showCover).toBe(true);

    it('should check adjustment showCreateAdjustmentReason', () => {
    component.showCreateAdjustmentReason(false, 'adj');
    expect(component.isFAPlusClicked).toBe(false);
  });
  it('should check adjustment cancelAsidePanel', () => {
    component.cancelAsidePanel();
    expect(component.showCover).toBe(false);
  });
  it('should check adjustment onModalDialogCloseCancel', () => {
    component.onModalDialogCloseCancel(loadData);
    expect(component.confirmDialog).toEqual(0);
  });
});

it('should check sort and filter', () => {
  component.columnDef = {defaultSortColumn: 'name', defaultSortOrder: 'asc'};
  component.sortQuery = 'name|asc';
  component.tableQuery = 'name=%bun%';
  component.filterFields = ['name'];
  component.pagination = pagination;
  component.clearFilters('name');
  component.lazyLoad = true;
  component.pagination = pagination;
  component.loadData(loadData);
  component.pagination = pagination;
  expect(component.getColumnSortOrder).toEqual('asc');
  expect(component.isFilterText('name')).toBe(false);
  component.convertDefaultSortOrder();
  component.removeFilterFetchingError();
  expect(component.filterErrorMessage).toEqual('');
  component.pagination = pagination;
  component.scrollInitialize(component.pagination);
  expect(component.loading).toBe(true);
  component.getMoreData();
  component.getLessData();
  component.filterDataDelay();
  component.processSubscriptionResult(svcData.reasons);
});

  it('should check checkNameAvailability', () => {
  component.checkNameAvailability();
  });
  it('should call filterDataKeys', () => {
    component.filterDataKeys('event','displayName','result');
  });
  it('should check SaveAdjustmentReason', () => {
    component.onEnterSaveAdjustmentReason({keyCode :13})
    component.handleKeyBoardEvent({keyCode:27})
  });
  it('should check save', () => {
    component.setSaveDisabled();
  });
  it('should check cancelAsidePanel', () => {
    component.createAdjustmentReasonAside = showHidefunc;
    component.cancelAsidePanel();
   });
  it('should check closeDialog', () => {
    component.createAdjustmentReasonAside = showHidefunc;
    component.onModalDialogCloseCancel({index: 1});
    expect(component.confirmDialog).toEqual(0);
  });
  it('should check ErrorMessageType', () => {
   component.getErrorMessageType();
   component.pagination = pagination;
   component.refreshGrid([]);
  });
  it('should check functions ', () => {
    component.pagination = pagination;
    component.createAdjustmentReasonAside = showHidefunc;
    component.calculateGridScrollHeight();
    component.activate();
    component.canDeactivate();
    component.fadeAsidePanel();
    component.getDeviceWidth();
    component.refreshData();
  });
  it('should check autoGrow', () => {
    component.autoGrow();
  });
  it('Should not allow spaces', () => {
    component.removeSpace();
    keyEventData.keyCode = 32;
    component.disableSpace(keyEventData);
  });


});