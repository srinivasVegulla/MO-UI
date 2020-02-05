import { AuthenticationService } from '../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, TranslationModule,
  utilService, UtilityService, ajaxUtilService, HttpClient, UrlConfigurationService, HttpClientTestingModule,
  ProductService, RouterModule, sharedService, contextBarHandlerService, dateFormatPipe, DebugElement,
  getWindow, Router, By, CapabilityService, LocaleService, pagination, svcData, loadData
} from '../../assets/test/mock';
import { MockRouter } from '../../assets/test/mock-router';
import { MockLocalService } from '../../assets/test/mock-local-service';
import { ProductOffersListService } from './productOfferList.service';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';
import { InfiniteScrollCheckService } from '../helpers/InfiniteScrollCheck.service';

import { MomentModule } from 'angular2-moment';

import { ProductOfferListComponent } from './productOfferList.component';

// const MockCapabilitiesService = {
//   loggedInUserCapabilities: () => { return {UIPOGrid: {Create: true}}; },
//   getWidgetCapabilities: () => { return 'UIPOGrid'; }
// };

describe('ProductOfferListComponent', () => {
  let component: ProductOfferListComponent;
  let fixture: ComponentFixture<ProductOfferListComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let spy1: any;
  let spy2: any;
  const testProductOffers = '';
  const testCurrency = '';

  let productOffersListService: ProductOffersListService;

  // This test code is written for giving compiler enough to read external templates 
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule, RouterTestingModule, TranslationModule.forRoot(), HttpClientTestingModule, MomentModule],
      declarations: [ProductOfferListComponent],
      providers: [ProductOffersListService, ajaxUtilService, utilService, UtilityService, sharedService, ProductService,
        contextBarHandlerService, UrlConfigurationService, MockBackend, BaseRequestOptions, HttpClient, dateFormatPipe,
        InfiniteScrollCheckService, AuthenticationService, CapabilityService,
        { provide: 'Window', useFactory: getWindow },
        { provide: Router, useValue: MockRouter },
        // { provide: CapabilityService},
        { provide: LocaleService, useValue: MockLocalService },
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA] // service is mentioned to whom component is interacting
    })
      .compileComponents();  // compiles external template and css
  }));

  // synchronous beforeEach
  // This before each waits till the time first async beforeEach completes
  beforeEach(() => {
    fixture = TestBed.createComponent(ProductOfferListComponent);
    component = fixture.componentInstance;
    // Two ways of getting productOffersList service
    productOffersListService = fixture.debugElement.injector.get(ProductOffersListService);
    // Setup spy on the `getProductOffers` method
    spy1 = spyOn(productOffersListService, 'getProductOffers')
      .and.returnValues(Promise.resolve(testProductOffers));
    spy2 = spyOn(productOffersListService, 'getProductOffersCurrencies')
      .and.returnValues(Promise.resolve(testCurrency));

    // Get the datatable ProductOffers element by CSS selector (e.g., by class name)
    de = fixture.debugElement.query(By.css('h2'));
    el = de.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should be initialized', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
  });
  it('should display changed title', () => {
    const updateTitle = 'UPDATE_TEXT_SUBSCRIBABLE_ITEMS_LIST';
    el.textContent = updateTitle;
    expect(el.textContent).toBe(updateTitle);
  });
  it('should check currenies and partitions using po data', () => {
    component.createPOData = ProductOfferData.properties;
    component.getCurrencies();
    expect(component.currencies.length).toEqual(3);
    component.getPartitions();
    expect(component.partitions.length).toEqual(2);
    component.copyOfferingsHandler(ProductOfferData.properties);
  });
  it('should getCurrenciesAndPartitions', () => {
    component.columnDef = {defaultSortColumn: 'displayName', defaultSortOrder: 'asc', cols: [{field: 'displayName'}]};
    component._productOffersList = [0];
    component._productOffersList[0] = svcData.data;
    component.getCurrenciesAndPartitions();
    component.getOfferingDetails(svcData.data);
    svcData.data.bundle = true;
    component.getOfferingDetails(svcData.data);
    component.pagination = pagination;
    component.sortQuery = {name: 'asc'};
    component.tableQuery = {name: 'samplePO'};
    component.refreshData();
    expect(component.loadGridData).toBe(false);
    expect(component.pagination.page).toEqual(1);
    component.offeringsTypes = {label: 'Bundle', value: 'Bundle'};
    component.processProductOfferResult({}, true);
    component.refreshGrid([]);
    component.dateFieldConfig('effStartDate');
    component.deleteHideUnhidePoData = svcData.data;
    component.pagination = pagination;
    component.lazyLoad = true;
    component.loadData(loadData);
    component.pagination = pagination;
    component.filterData();
    component.filterDataProcessing = false;
    component.getDeviceWidth();
    component.onModalDialogCloseDelete(loadData);
    component.onModalDialogCloseHide(loadData);
    component.onModalDialogCloseUnhide(loadData);
    component.onModalDialogCloseCreatePO([]);
    component.filterDataKeys(loadData, 'displayName', 'result');
    expect(component.confirmDialog).toEqual(0);
    component.deletePO([], 1);
    component.deleteProductFromList(1, 1);
    ProductOfferData.subsciptions.error[0].error = 'errorDeleteSchedule';
    component.getRowClass(ProductOfferData.subsciptions.error[0], 1);
    component.OnTooltipClose(false);
    component.onClick([]);
    component.exportToCSV();
    expect(component.isDownload).toBe(true);
    component.pagination = pagination;
    component.filterFields = {column: 'displayName'};
    component.clearFilters('displayName');
    expect(component.isFilterData).toBe(true);
    component.isFilterText(component.columnDef.cols[0].field);
    component._productOffersList = [{error: 'sample'}];
    component.handleErrorDeletePO('error', 0);
     expect(component.errorTooltip).toBe(true);
    component.openCreateOfferingPanel();
     expect(component.confirmDialog).toEqual(4);
    component.hidePropertiesWidget(true);
    component.handleErrorHIdePO('error', 0);
    component.handleErrorUnHIdePO('error', 0);
    component.pagination = pagination;
    component.showVisiblePOs();
    expect(component.isVisiblePO).toBe(true);
    component.pagination = pagination;
    component.sortQuery = {name: 'asc'};
    component.tableQuery = {name: 'samplePO'};
    component.getAllHiddenPo();
    expect(component.makeHidden).toBe(true);
    component.hidePO([], 0);
    expect(component.confirmDialog).toEqual(2);
    component.unHidePO([], 0);
    expect(component.confirmDialog).toEqual(3);
    component.triggerOffering('bundle');
    component.triggerOffering('productOffer');
    component.triggerOffering('');
  });
});
