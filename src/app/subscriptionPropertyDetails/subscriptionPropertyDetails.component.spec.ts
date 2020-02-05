import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed, svcData,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, dateFormatPipe,
  AuthenticationService, utilService, UtilityService, ajaxUtilService, HttpHandler,
  HttpClient, UrlConfigurationService, loadData, RouterModule, LocaleService,
  TranslationService, TranslationConfig, TranslationProvider, CapabilityService,
  TranslationHandler, LocaleConfig, LocaleStorage, TranslatePipe,
  showHidefunc, contextBarHandlerService, pagination
} from '../../assets/test/mock';
import { MockAuthenticationService } from '../../assets/test/mock-authentication-service';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';
import { SubscriptionPropertyDetailsComponent } from './subscriptionPropertyDetails.component';
import { SubscriptionPropertyDetailsService } from './subscriptionPropertyDetails.service';
import { InfiniteScrollCheckService } from '../helpers/InfiniteScrollCheck.service';
import { CopyRatesComponent } from 'app/rates/copyRates/copyRates.component';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';


describe('SubscriptionPropertyDetailsComponent', () => {
  let component: SubscriptionPropertyDetailsComponent;
  let fixture: ComponentFixture<SubscriptionPropertyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, RouterModule],
      declarations: [ SubscriptionPropertyDetailsComponent, TranslatePipe ],
      providers: [MockBackend, BaseRequestOptions, ajaxUtilService, SubscriptionPropertyDetailsService,
        utilService, UrlConfigurationService, HttpClient, HttpHandler, UtilityService,
        TranslationService, TranslationConfig, TranslationProvider, TranslationHandler, contextBarHandlerService,
        LocaleService, LocaleConfig, LocaleStorage, dateFormatPipe, InfiniteScrollCheckService, CapabilityService,
        { provide: AuthenticationService, useValue: MockAuthenticationService},
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionPropertyDetailsComponent);
    component = fixture.componentInstance;
    component.pagination = pagination;
    component.tableQuery = {name: 'sample'};
    component.visibilityTypes = {label: 'Shown', value: 'Shown'};
    component.columnDef = {defaultSortColumn: 'category', defaultSortOrder: 'asc'};
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should be initialized', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
  });
  it('should call ngOnInit', () => {
    const _subscriptionPropertyDetailsService = fixture.debugElement.injector.get(SubscriptionPropertyDetailsService);
    _subscriptionPropertyDetailsService.getInUseOfferings(svcData);
    _subscriptionPropertyDetailsService.deleteSubscriptionProperty(svcData);
    _subscriptionPropertyDetailsService.deleteSubscriptionProperty(svcData);
    _subscriptionPropertyDetailsService.createSubscriptionProperty({});
    _subscriptionPropertyDetailsService.getPropertyNameAvailability({});
    _subscriptionPropertyDetailsService.updateSubscriptionProperty(svcData);
    component.createSubscriptionProperties = showHidefunc;
    component.isFilterData = true;
    component.processSubscriptionResult({records: ProductOfferData.subsciptions.error});
    component.openDeleteConfirmation(ProductOfferData.subsciptions, 0);
    component.hidelocalizationWidget(true);
    expect(component.showLocalizationPanel).toBe(false);
    component.refreshData();
    component.isDeleteOrHide = true;
    component._subscriptionList = [{error: 'failed'}];
    component.handleErrorDelete('failed', 0);
    expect(component.tooltipIndex).toEqual(0);
    component.errorTooltip = true;
    component.onClick({});
    component.onToolTipClose(true);
    ProductOfferData.subsciptions.error[0].error = 'errorDeleteSchedule';
    component.getRowClass(ProductOfferData.subsciptions.error[0], 0);
    ProductOfferData.subsciptions.error[0].error = 'noErrorDeleteSchedule';
    component.getRowClass(ProductOfferData.subsciptions.error[0], 0);
    component.editSubscriptionProperty(0);
    component.refreshPropertiesList(true);
    component.deletingSubscriptionDetails = { specId: 1};
    component.deleteSubscriptionIndex = 1;
    component.onModalDialogCloseDelete({idex: 0});
    component.editSubscriptionProperty(1);
    component.canDeactivate();
    component.openInUseOfferings({});
    component.getDeviceWidth();
    component.filterDataDelay();
    component.filterData();
    expect(component.isFilterData).toBe(true);
    component.lazyLoad = true;
    component.loadData(loadData);
    component.dateFieldConfig('entityCount');
    component.setSubPropertiesFormDirty(true);
    expect(component.subscriptionPropertyFormDirty).toBe(true);
    component.setSubPropertiesFormDirty(false);
    expect(component.subscriptionPropertyFormDirty).toBe(false);
    component.removeFilterFetchingError();
    expect(component.filterErrorMessage).toBe('');
    component.showCreateSubscriptionProperty({}, {});
    expect(component.showCover).toBe(true);
    component.fadeAsidePanel(true);
    component.showCreateSubscriptionProperty(false, {});
    component.clearFilters('name');
    component.isFilterText('name');
    component.displayInUseOfferingsDialog(true);
    component.getAllSubscription();
    expect(component.subscriptionListFetching).toBe(false);
    component.initializeFields();
    expect(component.editSubscriptionDefault).toBe('');
  });
  it('should call filterDataKeys', () => {
    component.filterDataKeys('event','displayName','result');
  });
  it('should call loadSubpropertiesLocalization', () => {
    component.loadSubpropertiesLocalization({});
  });

});
