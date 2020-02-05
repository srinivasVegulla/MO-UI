import { AuthenticationService } from '.../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, TranslationModule,
  utilService, UtilityService, ajaxUtilService, dateFormatPipe,
  HttpClient, UrlConfigurationService, HttpClientTestingModule,
  loadData, AddSubscriptionPropertiesService, svcData, pagination
} from '../../../../assets/test/mock';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

import { AddSubscriptionPropertiesComponent } from './addSubscriptionProperties.component';
import { SubscriptionPropertyDetailsService } from '../../../subscriptionPropertyDetails/subscriptionPropertyDetails.service';
import { InfiniteScrollCheckService } from '../../../helpers/InfiniteScrollCheck.service';

describe('AddSubscriptionPropertiesComponent', () => {
  let component: AddSubscriptionPropertiesComponent;
  let fixture: ComponentFixture<AddSubscriptionPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslationModule.forRoot(), HttpClientTestingModule],
      declarations: [AddSubscriptionPropertiesComponent],
      providers: [MockBackend, BaseRequestOptions, ajaxUtilService, UrlConfigurationService, UtilityService,
        utilService, AddSubscriptionPropertiesService, HttpClient, SubscriptionPropertyDetailsService,
        dateFormatPipe, InfiniteScrollCheckService, AuthenticationService,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
      ]
      ,
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    const fixtureBody = `<div class="subscriptionSkeleton"></div>`;
    document.body.insertAdjacentHTML(
      'afterbegin',
      fixtureBody);
    fixture = TestBed.createComponent(AddSubscriptionPropertiesComponent);
    component = fixture.componentInstance;
    const _utilService = fixture.debugElement.injector.get(utilService);
    _utilService.changeAddSubscriptionItemToPO(true);
    fixture.detectChanges();
    component.addSubscriptionColumnDef = {defaultSortColumn: 'category', defaultSortOrder: 'asc'};
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should be initialized', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
  });
  it('should call ngOnInit', () => {
    component.ngOnInit();
  });
  it('should intialize values', () => {
    component.selectedType = true;
    component.editingType = true;
    component.visibleType = true;
    const _addSubscriptionPropertiesService = fixture.debugElement.injector.get(AddSubscriptionPropertiesService);
    _addSubscriptionPropertiesService.addSubscriptionItems(svcData);
    component.show();
    expect(component.visible).toBe(true);
    component.hide();
    expect(component.visible).toBe(false);
    component.selectSubscription(1, ProductOfferData.priceableItemAdj.data);
    expect(component.isSubSelected).toBe(true);
    component.addSubscription();
    expect(component.subscriptionContainer).toEqual([1]);
    ProductOfferData.piTemplateForm.selectedPItemplate.data[0].code = 500;
    component.processSubscriptionResponse(ProductOfferData.piTemplateForm.selectedPItemplate);
    component.filterSubscriptionFields = ['category'];
    component.editTypeOptionValues = 'Read Only';
    component.visibilityTypes = 'shown';
    component.pagination = pagination;
    component.clearFilters('category');
    component.lazyLoad = true;
    component.loadData(loadData);
    component.pagination = pagination;
    component.filterData();
    expect(component.isFilterData).toBe(true);
    component.filterDataDelay();
    component.isFilterText('category');
    expect(component.getColumnSortOrder).toEqual('asc');
    expect(component.isFilterText('category')).toBe(false);
    component.processSubscriptionResponse([]);
    component.getAllSubscriptionItems();
    expect(component.noFilteredTableData).toBe(false);
  });
  it('should call filterDataKeys', () => {
    component.filterDataKeys('event','displayName','result');
  });
   
});
