import { AuthenticationService } from '.../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, Observable,
  utilService, UtilityService, ajaxUtilService, inject,
  HttpClient, TranslationModule, contextBarHandlerService, CapabilityService,
  UrlConfigurationService, LocaleService, HttpClientTestingModule, sharedService,
  SharedPricelistService, PriceableItemTemplateService, dateFormatPipe,
  keyEventData, showHidefunc
} from '../../assets/test/mock';
import { breadCrumbData } from '../../assets/test/mock-breadcrumb';

import { MockAuthenticationService } from '../../assets/test/mock-authentication-service';

import { BreadcrumbsComponent } from './breadcrumbs.component';
import { BreadcrumbService } from './breadcrumbs-mock-data';
import { TreeHierarchyService } from '../treeHierarchy/treeHierarchy.service';
import { Router } from "@angular/router";

const MockRouter = {
  url:'/ProductCatalog/Offerings'
}

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;
  const title = 'updated title';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BreadcrumbsComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, TranslationModule.forRoot()],
      providers: [CapabilityService,sharedService, utilService,
        MockBackend, BaseRequestOptions, BreadcrumbService, contextBarHandlerService,
        TreeHierarchyService, ajaxUtilService, UrlConfigurationService, HttpClient,
        SharedPricelistService, PriceableItemTemplateService, UtilityService, dateFormatPipe,
        AuthenticationService,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(inject([CapabilityService], _capabilityService  => {
    _capabilityService.loggedInUserCapabilities = {UIBreadCrumb: {AdjustmentReasons: true, AuditLog: true, Calendars: true
      ,Localization: true, Offerings: true, PriceableItemTemplate: true, SharedRates: true, SubscriptionProperties: true}};
    fixture = TestBed.createComponent(BreadcrumbsComponent);
    component = fixture.componentInstance;
    localStorage.setItem('browserObject', JSON.stringify(
      [{'path': "/ProductCatalog",'data':[{'path': "/ProductCatalog", 'type': "dropdown", 'displayName': "TEXT_PRODUCT_CATALOG", 'id': 0, 'imageType': ""}]}]));
    localStorage.setItem('displayInfo', breadCrumbData.displayInfo);
    localStorage.setItem('offerId', '1');
  }));

  it('should check for setUserCapabilities', () => {
    const _capabilityService = fixture.debugElement.injector.get(CapabilityService);
    _capabilityService.loggedInUserCapabilities = {};
    _capabilityService.setUserCapabilities();
  });
  it('should be initialized', () => {
    const breadcrumbService = fixture.debugElement.injector.get(BreadcrumbService);
    breadcrumbService.getbreadcrumbData();
    localStorage.setItem('breadcrumbObject', JSON.stringify([{'path': '/ProductCatalog', 'type': 'dropdown'}]));
    expect(component).toBeTruthy();
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
    component.ngOnInit();
  });
  it('should check navigation text and breadcrumb', () => {
    expect(component.showNavigationText).toBe(false);
    component.breadcrumbHeaderClick(title, 1);
    expect(component.dropdownOpen).toBe(false);
  });
  it('should check breadcrumblist ', () => {
    const breadCrumbService = fixture.debugElement.injector.get(BreadcrumbService);
    expect(breadCrumbService.getbreadcrumbData).toBeDefined();
    expect(component.breadcrumblist.length).toEqual(2);
    component.selectedBreadcrumbDropdown(0);
    component.selectedBreadcrumbDropdown(1);
    expect(component.breadcrumbIndex).toEqual(1);
    component.showChildOffersInTree();
    component.toggleTreeBreadcrumb = 0;
    expect(component.dropdownOpen).toEqual(false);
    expect(component.showTreeHierarchy).toEqual(true);
    expect(component.rowindex).toEqual(-1);
  });
  it('should check po and pi items for bundle ', () => {
    component.addTextToBreadcrumb(
      breadCrumbData.svcData, 'linkpath', 'linkType', 'RC');
    breadCrumbData.svcData.chargeType = '';
    component.addTextToBreadcrumb(
      breadCrumbData.svcData, 'linkpath', 'linkType', 'RC');
    component.addTextToBreadcrumb(
      breadCrumbData.svcData, 'linkpath', 'linkType', 'RC');
    component.clickPOInBundle(breadCrumbData.svcData);
    component.clickPIInBundlePO(breadCrumbData.svcData);
    component.clickPI(breadCrumbData.svcData);
    component.clickChildPIfromPIDetails(breadCrumbData.svcData);
    component.clickChildPI(breadCrumbData.svcData);
    breadCrumbData.svcData.chargeType = 'RC';
    component.handlingMobileBreadcrumb(breadCrumbData.svcData, 1, 'RC');
    component.countAvailableNodes(breadCrumbData.svcData);
    component.renderToMainPage('mainPath');
    component.nextAvailableNodes(breadCrumbData.svcData, 1);
    component.desktopbreadcrumbDropdownClick();
    component.togglebreadcrumb = 1;
    component.desktopbreadcrumbDropdownClick();
    // check productOfferClickEventHandler
    component.selectMobileDevDefaultOptions(breadCrumbData.svcData, 'Audit');
    component.selectedObject = breadCrumbData.svcData;
    component.backToPreviousPage();
    component.reCreateBreadcrumb();
    breadCrumbData.svcData.children = { 0: { 'children': 1, 'displayName': 'name' } };
    component.resetMobileTreeBreadcrumb(breadCrumbData.svcData, 0);
    component.bundleClickEventHandler(breadCrumbData.svcData);
    const prodOfferEvent = breadCrumbData.svcData;
    component.selectedOfferingsChildren = [];
    component.selectedOfferingsChildren[0] = { nodeType: 'Bundle' };
    component.widget['Bundle'] = 'Bundle1';
    component.prodOfferClickEventHandler(prodOfferEvent);
    component.selectedOfferingsChildren[0] = { nodeType: 'Bundle' };
    component.widget['Bundle'] = 'Bundle';
    component.prodOfferClickEventHandler(prodOfferEvent);
    component.updateBreadcrumbsList({});
    // checking piClickEventHandler
    const piClickEvent = { offerId: 1, parent: 'Po', id: 1, kind: 'kind' };
    component.PIClickEventHandler(piClickEvent);
    const childClickEvent = { offerId: 1, parent: { parent: { nodeType: 'Bundle' } }, id: 1, kind: 'kind' };
    component.ChildPIClickEventHandler(childClickEvent);
    childClickEvent.parent.parent.nodeType = 'Bundle1';
    component.ChildPIClickEventHandler(childClickEvent);
    component.getSelectedOffer(0);
    // checking mobile application level data
    component.instanceId = 1;
    component.selectedObject.offerId = 1;
    const mobileResult = { children: [] };
    mobileResult.children[0] = { id: 1, children: [] };
    mobileResult.children[0].children[0] = { id: 2 };
    component.mobileApplicationLevelData(mobileResult);
    component.Level = 'Bundle';
    component.widget['Bundle'] = 'Bundle';
    component.mobileApplicationLevelData(mobileResult);
    component.Level = 'BundlePo';
    component.widget['BundlePo'] = 'BundlePo';
    component.mobileApplicationLevelData(mobileResult);
    component.Level = 'PiInBundle';
    component.widget['PiInBundle'] = 'PiInBundle';
    component.mobileApplicationLevelData(mobileResult);
    component.Level = 'Pi';
    component.widget['Pi'] = 'Pi';
    component.isBundle = 'Bundle';
    component.widget['Bundle'] = 'Bundle';
    component.mobileApplicationLevelData(mobileResult);
    component.instanceId = 2;
    const childData = { children: [] };
    childData.children[0] = { id: 1, children: [] };
    childData.children[0].children[0] = { id: 2 };
    component.mobileApplicationLevelData(childData);
    component.isBundle = 'Bundle';
    component.widget['Bundle'] = 'NBundle';
    component.mobileApplicationLevelData(mobileResult);
    component.Level = 'childPi';
    component.widget['Pi'] = 'NPi';
    component.widget['childPi'] = 'childPi';
    component.instanceId = 1;
    childData.children[0] = { id: 1, children: [] };
    component.mobileApplicationLevelData(childData);
    component.Level = 'outSideChildPi';
    component.widget['outSideChildPi'] = 'outSideChildPi';
    childData.children[0].children[0] = { id: 1 };
    component.mobileApplicationLevelData(childData);
    mobileResult.children = null;
    component.mobileApplicationLevelData(mobileResult);
    // check logout and checkConfiguration
    component.logout();
    component.loadLocalization();
    component.loadCheckConfiguration();
    component.showBreadcrumbList();
    component.onPopState(breadCrumbData.svcData.onPopState);
    component.createDefaultBreadCrumb();
    localStorage.setItem('mainRoot', 'TEXT_SUBSCRIBABLE_ITEMS');
    component.selectedObject = breadCrumbData.svcData;
    component.previousAvailableNodes();
    component.backNavigationName = 'TEXT_SUBSCRIBABLE_ITEMS';
    localStorage.setItem('mainRoot', 'TEXT_PI_TEMPLATES');
    component.previousAvailableNodes();
    // check keyboardEvent and destory
    breadCrumbData.svcData.templateParentId = 1;
    component.selectedObject = breadCrumbData.svcData;
    component.previousAvailableNodes();
    component.handleKeyboardEvent(keyEventData);
    component.isTicketLogin();
    component.formateName(breadCrumbData.svcData);
    breadCrumbData.svcData.displayName = null;
    component.formateName(breadCrumbData.svcData);
    component.appLevelObservable = showHidefunc;
    component.piTempleteObservable = showHidefunc;
    component.updateTreeNode = showHidefunc;
    component.ngOnDestroy();
  });
  it('should remove scroll bar from breadcrumb Nav Drop down  ', () => {
    component.calculateSideGridScrollHeight();
    component.calculateExtraSmallScrollHeight();
  });
});
