import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  HostListener,
  AfterViewInit,
  ElementRef,
  ViewChild
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { BreadcrumbService } from "./breadcrumbs-mock-data";
import { Location, PlatformLocation } from "@angular/common";
import { sharedService } from "../productOffer/sharedService";
import { utilService } from "../helpers/util.service";
import { TreeHierarchyService } from "../treeHierarchy/treeHierarchy.service";
import { TreeModule, TreeNode } from "primeng/primeng";
import { AuthenticationService } from "../security/authentication.service";
import { LocaleStorage } from "angular-l10n/src/services/locale-storage";
import { contextBarHandlerService } from "../helpers/contextbarHandler.service";
import { SharedPricelistService } from "../sharedPricelist/shared.pricelist.service";
import { PriceableItemTemplateService } from "../priceableItemTemplates/priceableItemTemplate.service";
import { breadcrumbsConfig } from "../../assets/breadcrumbsConfig";
import { LocaleService } from "angular-l10n";
import { forEach } from "@angular/router/src/utils/collection";
import { UtilityService } from "../helpers/utility.service";
import { CapabilityService } from "../helpers/capabilities.service";

@Component({
  selector: "ecb-breadcrumb",
  templateUrl: "./breadcrumbs.component.html",
  styleUrls: ["./breadcrumbs.component.scss"],
  providers: [BreadcrumbService]
})
export class BreadcrumbsComponent implements OnInit, OnDestroy, AfterViewInit {
  breadcrumb = [];
  public supportedLanguages: any[];
  showNavigationText: boolean = false;
  dropdownOpen: boolean = false;
  breadcrumbIndex: number;
  breadcrumblist = [];
  finalList: any = {};
  height: number;
  rowindex: number = -1;
  togglebreadcrumb: number;
  displayName: string = "";
  itemInstanceDisplayName: string;
  showingChildNameinTitle: boolean = false;
  showingParentNameinTitle: boolean = false;
  PIType;
  isDisplayName;
  isItemInstanceDisplayValue;
  offeringType: string = "";
  showTreeHierarchy: boolean = false;
  showTreeDropdown: boolean = false;
  toggleTreeBreadcrumb = 0;
  selectedOfferingsChildren = [];
  prodOfferAddingCount: number = 0;
  piAddingCount: number = 0;
  tempPOid: number = 0;
  temporaryBreadcrumbList = [];
  IsLatChildDisabled: boolean = true;
  IsprodCatalogChildOpen: boolean = false;
  pageTitle: string = "";
  IsMobileDefaultMenuShow;
  selectedOption;
  mobileTreeDivStatus;
  mobileTreeBreadCrumb = [];
  backNavigationName;
  handleBackEventArray = [];
  selectedObject;
  path: string = "";
  breadCrumbChildrens = [];
  backNavigationPath;
  bundleId: number;
  isBundle;
  child = "Child";
  bundlePath = "/ProductCatalog/Bundle/";
  poPath = "/ProductCatalog/ProductOffer/";
  piPath = "/ProductCatalog/PriceableItem/";
  BundlePo = "/ProductCatalog/BundleProductOffer/";
  piTemplatePath = "/ProductCatalog/PriceableItemTemplates/";
  sharedRatesPath = "/ProductCatalog/SharedRatelist/";
  calendarsPath = "/ProductCatalog/Calendars/";
  offeringsPath = "/ProductCatalog/Offerings/";
  userName;
  imageType;
  widget = {};
  currentIsDisplayName;
  piInstanceChildShow;
  currentitemInstanceDisplayName;
  observabletogglebreadcrumb;
  selectedOfferBreadcrumbData;
  appLevelObservable;
  emptyBreadcrumbList;
  displayNameEditOrDelete;
  @Inject("Window")
  private window: Window;
  piTempleteObservable;
  handleSaveBtn;
  localizationLink;
  checkConfigLink;
  currentLocale;
  mainRoot;
  appRootPath = /ProductCatalog/;
  updateTreeNode;
  browserObject;
  test;
  browserArray = [];
  instanceId;
  Level;
  isNodeClick = true;
  piTemplates = "TEXT_PI_TEMPLATES";
  offerings = "TEXT_SUBSCRIBABLE_ITEMS";
  sharedRates = "TEXT_SHARED_RATES";
  calendars = "TEXT_CALENDARS";
  newRecordObs;
  errorRedirectionObs;
  currentPage;
  allowToGoBack:boolean = false;
  allowBrowserBack;
  uiBreadCrumbCapabilities: any = {};
  showLoader:boolean;
  systembarHeight = 42;
  contextbarHeight = 60;
  headerHeight: number;
  extraPadding = 14;
  nodeId:any;

  /* This will execute when browser back/forward buttons are clicked by user */
  @HostListener("window:popstate", ["$event"])
  onPopState(event) {
    setTimeout(() => {
      if (!this.allowToGoBack) {
        this.calculateBreadCrumTextHeight();
        this.isNodeClick = false;
        this.autoClickSpanTag();
        this.hiddenChildMenu();
        this.resetToggleValues();
        let pathname = "";
        let isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
        if (isIEOrEdge){
          pathname = document.location.pathname;
        }
        else {
          pathname =  event.path[0].location.pathname;
        }
        this.browserRefreshHandling(pathname);
      }
    }, 300);
  }

  /* This will execute when click event raised on complete document level */
  @HostListener("document:click", ["$event"])
  function(event) {
    const e = event;
    if (!(
      e.target.id === "mobileNavIcon" ||
      e.target.id === "mobileExpandForwardIcon" ||
      e.target.id === "mobileExpandBackIcon" ||
      e.target.id === "breadcrumbExpDivs" ||
      e.target.id === "treeHierarchyComponent" ||
      e.target.className.includes("ui-tree-toggler")
    )) {
      this.documentEvents();
    } 
  }

  /* This will execute when keydown event raised on complete document level */
  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event) {
    this.documentEvents();
  }
  /* This will execute when keydown event raised on window resize*/
  @HostListener('window:resize', ['$event'])
  onResize(event){
    this.calculateBreadCrumTextHeight();
  }

  constructor(
    private _location: Location,
    private _browser: PlatformLocation,
    private _breadcrumbsService: BreadcrumbService,
    private _router: Router,
    private _sharedService: sharedService,
    private _utilService: utilService,
    private _route: ActivatedRoute,
    private _treeHierarchyService: TreeHierarchyService,
    private authenticationService: AuthenticationService,
    private _contextBarHandlerService: contextBarHandlerService,
    private _sharedPricelistService: SharedPricelistService,
    private _piTemplateService: PriceableItemTemplateService,
    private _locale: LocaleService,
    private _capabilityService: CapabilityService,
    private _utilityService: UtilityService
  ) {
    this.pageTitle = this.offerings;
    this.userName =
      sessionStorage.getItem("userName") == null
        ? this.userName
        : sessionStorage.getItem("userName");

    this.widget = {
      Bundle: "BUNDLE",
      BundlePo: "BUNDLE_PO",
      PiInBundle: "BUNDLE_PO_PI",
      Po: "PO",
      Pi: "PI",
      childPi: "CHILD_PI",
      outSideChildPi: "CHILD_PI_OUT",
      grid: "Grid"
    };
    this.setBreadCrumbListItems();
    this.resetToggleValues();
  }

  calculateBreadCrumHeight() {
    if(window.innerWidth <= 992) {
      this.headerHeight =  this.systembarHeight + this.contextbarHeight + this.extraPadding;
    }
    else {
      this.headerHeight = this.systembarHeight + this.contextbarHeight + this.breadcrum.nativeElement.offsetHeight + this.title.nativeElement.offsetHeight + this.extraPadding;
    }
   this._utilService.changeRemoveScrollHeight(this.headerHeight);
  }

  ngAfterViewInit() {
    this.calculateBreadCrumHeight();
  }

  @ViewChild('breadcrumHeight') breadcrum: ElementRef;
  @ViewChild('breadcrumTitle') title: ElementRef;

  setBreadCrumbListItems() {
    this.breadcrumblist = breadcrumbsConfig.defaultData;

    this.uiBreadCrumbCapabilities = this._capabilityService.getWidgetCapabilities(
      "UIBreadCrumb"
    );

    for (let key in this.uiBreadCrumbCapabilities) {
      for (let listItem of this.breadcrumblist[0].children) {
        if (
          key === "Offerings" &&
          listItem.displayName === "TEXT_SUBSCRIBABLE_ITEMS"
        ) {
          listItem.display = this.uiBreadCrumbCapabilities["Offerings"];
        } else if (
          key === "Localization" &&
          listItem.displayName === "TEXT_LOCALIZATION"
        ) {
          listItem.display = this.uiBreadCrumbCapabilities["Localization"];
        } else if (
          key === "SharedRates" &&
          listItem.displayName === "TEXT_SHARED_RATES"
        ) {
          listItem.display = this.uiBreadCrumbCapabilities["SharedRates"];
        } else if (
          key === "SubscriptionProperties" &&
          listItem.displayName === "TEXT_SUBSCRIPTION_PROPERTIES"
        ) {
          listItem.display = this.uiBreadCrumbCapabilities[
            "SubscriptionProperties"
          ];
        } else if (
          key === "AuditLog" &&
          listItem.displayName === "TEXT_AUDIT_LOG"
        ) {
          listItem.display = this.uiBreadCrumbCapabilities["AuditLog"];
        } else if (
          key === "PriceableItemTemplate" &&
          listItem.displayName === "TEXT_PI_TEMPLATES"
        ) {
          listItem.display = this.uiBreadCrumbCapabilities[
            "PriceableItemTemplate"
          ];
        } else if (
          key === "AdjustmentReasons" &&
          listItem.displayName === "TEXT_MORE_ADJUSTMENTS_REASONS"
        ) {
          listItem.display = this.uiBreadCrumbCapabilities["AdjustmentReasons"];
        } else if (
          key === "Calendars" &&
          listItem.displayName === "TEXT_CALENDARS"
        ) {
          listItem.display = this.uiBreadCrumbCapabilities["Calendars"];
        }
      }
    }

    this.breadCrumbChildrens = this.breadcrumblist[0].children;
  }

  ngOnInit() {
    this.PIType = this._route.snapshot.params["PIType"];
    this.currentLocale = this._locale.getCurrentLocale();
    this._utilService.currentDisplayName.subscribe(displayName => {
      this.displayName = displayName;
      this.isDisplayName =
        displayName === null || displayName === undefined || displayName === ""
          ? false
          : true;
    });
    this.currentIsDisplayName = this._utilService.currentIsDisplayName.subscribe(
      value => {
        this.isDisplayName = false;
      }
    );

    this.piInstanceChildShow = this._utilService.piInstanceChildShow.subscribe(
      showChild => {
        const showChilds = JSON.parse(localStorage.getItem("PIChildItem"));
        if (showChilds) {
          if (showChilds["child"] === true) {
            this.showingChildNameinTitle = true;
            this.showingParentNameinTitle = false;
          } else if (showChilds["parent"] === true) {
            this.showingParentNameinTitle = true;
            this.showingChildNameinTitle = false;
          } else {
            this.showingChildNameinTitle = false;
            this.showingParentNameinTitle = false;
          }
        }
      }
    );
    this.currentitemInstanceDisplayName = this._utilService.currentitemInstanceDisplayName.subscribe(
      itemInstanceDisplayName => {
        this.itemInstanceDisplayName = itemInstanceDisplayName;
        this.isItemInstanceDisplayValue =
          itemInstanceDisplayName == null ||
          itemInstanceDisplayName === "" ||
          itemInstanceDisplayName === undefined
            ? false
            : true;
      }
    );

    this.createDefaultBreadCrumb();

    /* This observable will call when user select product offer from product offer list page */
    this.selectedOfferBreadcrumbData = this._utilService.selectedOfferBreadcrumbData.subscribe(
      obj => {
        this.nodeId = obj["offerId"];
        if (obj["offerId"]) {
          this.backNavigationName = this.offerings;
          let productOfferPath = "";
          const linkType = "dropdown";
          if (obj["offerId"] !== undefined) {
            if (obj["bundle"]) {
              productOfferPath = this.bundlePath + obj["offerId"];
              this.isBundle = this.widget["Bundle"];
              this.bundleId = obj["offerId"];
              this.imageType = this.widget["Bundle"];
            } else {
              productOfferPath = this.poPath + obj["offerId"];
              this.isBundle = this.widget["Po"];
              this.imageType = this.widget["Po"];
            }
            this.addTextToBreadcrumb(obj, productOfferPath, linkType, false);
            this.instanceId = 0;
            this.Level = this.isBundle;
            this.getSelectedOffer(obj["offerId"]);
          }
          this.calculateBreadCrumTextHeight();
          localStorage.setItem("offerTreeId", obj["offerId"]);
          localStorage.setItem(
            "backNavigationName",
            JSON.stringify(this.backNavigationName)
          );
        }
      }
    );

    /*this observable will call when user select any link from grid except product offer list.*/
    this.newRecordObs = this._utilService.newRecord.subscribe(obj => {
      const level = obj["Level"];
      if (level !== "") {
        let data;
        if (level === this.widget["grid"]) {
          data = obj["obj"];
        } else if (level === this.widget["outSideChildPi"]) {
          data = obj["obj"].childs[obj["index"]];
        }
        this.handlingMobileBreadcrumb(obj["obj"], level, true);
        this.addTextToBreadcrumb(data, obj["path"], "link", true);
      }
    });

    /*mobile breadcurmb menu implementation*/
    this._utilService.mobileBreadcrumbMenuEvents.subscribe(obj => {
      if (obj["IsMobileDefaultMenuShow"]) {
        this.backNavigationName = this.mainRoot = localStorage.getItem(
          "mainRoot"
        );
      }
    });

    /*Handling application level events*/
    this.appLevelObservable = this._utilService.observeBreadCrumbApplicationLevelEvents.subscribe(
      obj => {
        if (obj["offerId"] !== undefined) {
          const level = obj["Level"];
          if (level !== "") {
            if (level === this.widget["BundlePo"]) {
              this.reCreateBreadcrumb();
              this.clickPOInBundle(obj);
            } else if (level === this.widget["PiInBundle"]) {
              this.reCreateBreadcrumb();
              this.clickPIInBundlePO(obj);
            } else if (level === this.widget["Pi"]) {
              this.clickPI(obj);
            } else if (level === this.widget["childPi"]) {
              this.reCreateBreadcrumb();
              this.clickChildPI(obj);
            } else if (level === this.widget["outSideChildPi"]) {
              this.clickChildPIfromPIDetails(obj);
            } else {
              this.clickPI(obj);
            }
            this.pageTitle =
              this.selectedObject.displayName === undefined
                ? this.selectedObject.itemInstanceDisplayName
                : this.selectedObject.displayName;
           this.changeDisplayName(this.imageType, this.pageTitle);
            this.calculateBreadCrumTextHeight();
           this.instanceId = obj["PIObj"].itemInstanceId;
            this.Level = level;
            localStorage.setItem("Level", this.Level);
          }
        }
      }
    );

    // To display product offer/Bundle in the sub navigation
    this._utilService.subNavigation.subscribe(value => {
      this.offeringType = value;
    });

    if (this.offeringType === "") {
      if (this._router.url.includes("ProductOffer")) {
        this.offeringType = "TEXT_PRODUCT_OFFER";
      } else {
        this.offeringType = "TEXT_BUNDLE";
      }
    }

    this.displayNameEditOrDelete = this._utilService.displayNameEditOrDelete.subscribe(
      obj => {
        if (obj["actionType"] > 0) {
          const node = this.breadcrumb[this.breadcrumb.length - 1];
          if (obj["actionType"] === 1) {
            this.browserObjectHandling(node.path, obj["actionType"]);
          } else if (obj["actionType"] === 2) {
            this.breadcrumb.pop();
            localStorage.setItem(
              "mobileMenuType",
              JSON.stringify({ IsMobileDefaultMenuShow: false })
            );
          }
          localStorage.setItem(
            "breadcrumbObject",
            JSON.stringify(this.breadcrumb)
          );
          this.breadcrumb[this.breadcrumb.length - 1].displayName = obj["pageTitle"];
          this.changeDisplayName(
            this.breadcrumb[this.breadcrumb.length - 1].imageType,
            this.breadcrumb[this.breadcrumb.length - 1].displayName
          );
        }
      }
    );

    this.handleSaveBtn = this._utilService.dynamicSaveBtn.subscribe(
      dynamicSaveBtn => {
        this.localizationLink =
          breadcrumbsConfig.localizationAllows.indexOf(dynamicSaveBtn) !== -1
            ? true
            : false;
        this.checkConfigLink =
          breadcrumbsConfig.checkConfigAllows.indexOf(dynamicSaveBtn) !== -1
            ? true
            : false;
      }
    );

    this.updateTreeNode = this._utilService.updateOfferingsChildrens.subscribe(
      v => {
        if (v) {
          this.getSelectedOffer(localStorage.getItem("offerId"));
        }
      }
    );

    this.errorRedirectionObs = this._utilService.errorRedirectionObs.subscribe(
      obj => {
        if (obj["type"]) {
          this.updateBreadcrumbsList(obj);
        }
      }
    );

    this.Level = localStorage.getItem("Level");

    this.allowBrowserBack = this._utilService.preventUnsaveChange.subscribe(
      value => {
        if (value !== undefined && value["url"] !== undefined) {
        }
        this.allowToGoBack =
          value !== undefined && value["url"] !== undefined ? true : false;
      }
    );
    this.calculateBreadCrumTextHeight();
  }

  calculateBreadCrumTextHeight() {
    setTimeout(() => {
      if(this.pageTitle !== undefined) {
        this.calculateBreadCrumHeight();
      }
    }, 300);
  }

  calculateSideGridScrollHeight() {
    return {maxHeight: 'calc(100vh - ' + `${this.breadcrum.nativeElement.clientHeight + 42}` + 'px )'};
  }

  calculateExtraSmallScrollHeight() {
    return {maxHeight: 'calc(100vh - 45px)'};
  }

  addTextToBreadcrumb(obj, linkPath, linkType, piType) {
    localStorage.setItem(
      "mobileMenuType",
      JSON.stringify({ IsMobileDefaultMenuShow: true })
    );
    if (obj !==undefined && Object.keys(obj).length > 0) {
      let displayName = 
      obj['displayName'] === null || obj['displayName'] === undefined || obj['displayName'] === '' ? obj['name'] : obj['displayName'];
      if (piType) {
        if (obj["chargeType"]) {
          displayName = displayName + " (" + obj["chargeType"] + ")";
        } else if (obj["kindType"]) {
          displayName = displayName + " (" + obj["kindType"] + ")";
        }
        this.pushObjectToBreadCrumb(
          linkType,
          displayName,
          false,
          linkPath,
          0,
          this.imageType
        );
      } else {
        this.pushObjectToBreadCrumb(
          linkType,
          displayName,
          false,
          linkPath,
          0,
          this.imageType
        );
      }

      this.toggleTreeBreadcrumb = 0;
      localStorage.setItem(
        "tempbreadcrumbObject",
        JSON.stringify(this.breadcrumb)
      );
      this.changeDisplayName(this.imageType, displayName);
    }
  }

  /*This method will call when user click PO in bundle page*/
  clickPOInBundle(obj) {
    this.nodeId = obj["POObj"].offerId;
    this.imageType = "PO";
    this.pushObjectToBreadCrumb(
      "link",
      obj["POObj"].displayName,
      false,
      obj["path"],
      0,
      this.imageType
    );
    this.selectedObject = obj["POObj"];
  }

  /*This method will call when user directly click PI in PO widget*/
  clickPIInBundlePO(obj) {
    this.nodeId = obj["PIObj"].itemInstanceId;
    this.path = this.poPath + obj["offerId"];
    if(obj.PIObj.piInstanceParentId !== null && obj.PIObj.piInstanceParentId !== undefined) {
      this.imageType = "CHILD_PI";
      }
      else{
      this.imageType = "PI";
      }
    this.pushObjectToBreadCrumb(
      "link",
      obj["POObj"].displayName,
      false,
      this.path,
      0,
      "PO"
    );
    this.pushObjectToBreadCrumb(
      "link",
      obj["PIObj"].itemInstanceDisplayName,
      false,
      obj["path"],
      0,
      this.imageType
    );
    this.selectedObject = obj["PIObj"];
  }

  /*This method will call when user click PI Widget*/
  clickPI(obj) {
    this.nodeId = obj["PIObj"].itemInstanceId;
    this.imageType = "PI";
    this.pushObjectToBreadCrumb(
      "link",
      obj["PIObj"].displayName,
      false,
      obj["path"],
      0,
      this.imageType
    );
    this.selectedObject = obj["PIObj"];
  }

  /*This method will call when user directly click Child PI from PI Widget*/
  clickChildPI(obj) {
    this.nodeId = obj["CPIObj"].itemInstanceId;
    this.imageType = this.widget["childPi"];
    this.path =
      this.piPath +
      obj["offerId"] +
      "/" +
      obj["PIObj"].itemInstanceId +
      "/" +
      obj["PIType"];
    this.pushObjectToBreadCrumb(
      "link",
      obj["PIObj"].displayName,
      false,
      this.path,
      0,
      "PI"
    );
    this.pushObjectToBreadCrumb(
      "link",
      obj["CPIObj"].displayName,
      false,
      obj["path"],
      0,
      this.imageType
    );
    this.selectedObject = obj["CPIObj"];
  }

  /*This method will call when user click Child PI from PI Details Page*/
  clickChildPIfromPIDetails(obj) {
    this.nodeId = obj["PIObj"].itemInstanceId;
    this.imageType = this.widget["childPi"];
    this.pushObjectToBreadCrumb(
      "link",
      obj["PIObj"].displayName,
      false,
      obj["path"],
      0,
      this.imageType
    );
    this.selectedObject = obj["PIObj"];
  }

  ssoIntegration() {
    if (this.isTicketLogin()) {
      const url = this._router.url;
      this.breadCrumbChildrens.forEach(element => {
        if (url === element.path) {
          this.updateBreadcrumbsList(element);
          this.selectedOption = element["displayName"];
        }
      });
    }
  }

  createDefaultBreadCrumb() {
    this.ssoIntegration();
    if (JSON.parse(localStorage.getItem("breadcrumbObject")) === null) {
      this.breadcrumb = [];
      for (const node of this.breadcrumblist) {
        this.breadcrumb.push(node);
        localStorage.setItem(
          "breadcrumbObject",
          JSON.stringify(this.breadcrumb)
        );
        this.changeDisplayName(
          this.breadcrumb[this.breadcrumb.length - 1].imageType,
          this.breadcrumb[this.breadcrumb.length - 1].displayName
        );
        this.browserObjectHandling(node.path, 0);
      }
      this.selectedOption = this.breadcrumb[1].displayName;
    } else {
      this.browserRefreshHandling(this._router.url);
    }
    /*Mobile device refresh page handling , restore breadcrumb object*/
    this.refreshHandlingInMobileDevice();
  }

  refreshHandlingInMobileDevice() {
    const displayInfo = JSON.parse(localStorage.getItem("displayInfo"));
    if (displayInfo !== null) {
      this.currentPage = displayInfo.currentPage;
      const obj = localStorage.getItem("mobileselectedObject");
      if (obj !== "undefined" && obj != null) {
        this.selectedObject = JSON.parse(
          localStorage.getItem("mobileselectedObject")
        );
      }
      this.backNavigationName = JSON.parse(
        localStorage.getItem('backNavigationName')
      );
    }

    if (JSON.parse(localStorage.getItem('mobileBreadcurmbData')) !== null) {
      this.mobileTreeBreadCrumb = JSON.parse(
        localStorage.getItem('mobileBreadcurmbData')
      );
    }
  }

  selectedBreadcrumbDropdown(index) {
    this.breadcrumbIndex = index;
    if (index === 0) {
      this.desktopbreadcrumbDropdownClick();
    } else {
      this.showChildOffersInTree();
    }
  }

  showChildOffersInTree() {
    this.togglebreadcrumb = 0;
    if (this.toggleTreeBreadcrumb === 0) {
      this.isNodeClick = true;
      this.dropdownOpen = false;
      this.showTreeHierarchy = true;
      this.toggleTreeBreadcrumb += 1;
      this.getSelectedOffer(localStorage.getItem('offerId'));
    } else {
      this.toggleTreeBreadcrumb = 0;
      this.isNodeClick = false;
    }
    this.autoClickSpanTag();
  }

  private expandRecursive(node:TreeNode){
    node.expanded = true;
    if(node.children) {
        node.children.forEach( childNode => {
            this.expandRecursive(childNode);
        } );
    }
}

  autoClickSpanTag() {
    setTimeout(() => {
      this.executeSpanClick();
    }, 1);
  }

  executeSpanClick() {
    let spanTag;
    const treeNode = document.getElementsByTagName('p-treenode')[0];
    if (treeNode !== undefined) {
      spanTag = treeNode.getElementsByTagName('span')[0];
      if (treeNode.getElementsByTagName('ul').length === 0) {
        spanTag.click();
      }
      if (!this.isNodeClick) {
        this.showTreeHierarchy = false;
        this.showLoader = false;
      }
    }
  }

  hiddenChildMenu() {
    setTimeout(() => {
      this.breadcrumbIndex = -1;
    }, 2);
  }

  showBreadcrumbList() {
    document.getElementsByClassName('ebBreadcrumbs-list').item(0).className +=
      'ecb-navOn';
  }

  breadcrumbHeaderClick(obj, index) {
    this.dropdownOpen = false;
    localStorage.setItem(
      'PIChildItem',
      JSON.stringify({ parent: false, child: false })
    );
    this.breadcrumb.splice(index + 1, this.breadcrumb.length);
    localStorage.setItem('breadcrumbObject', JSON.stringify(this.breadcrumb));
    this.changeDisplayName(obj.imageType, obj.displayName);
    this.calculateBreadCrumTextHeight();
    localStorage.setItem(
      'mobileMenuType',
      JSON.stringify({ IsMobileDefaultMenuShow: false })
    );
  }

  updateBreadcrumbsList(obj) {
    this.selectedOption = obj['displayName'];
    this.togglebreadcrumb = 0;
    this._utilService.changePiInstanceChildShow({
      parent: false,
      child: false
    });
    this.breadcrumb = [];
    this.breadcrumb.push(this.breadcrumblist[0]);
    this.pushObjectToBreadCrumb(
      obj['type'],
      obj['displayName'],
      false,
      obj['path'],
      obj['id'],
      ''
    );
    this.breadcrumbIndex = -1;
    this.changeDisplayName('', obj['displayName']);
    this._utilService.calculateInnerWidthHeight('');
    localStorage.setItem('mainRoot', obj['displayName']);
  }

  desktopbreadcrumbDropdownClick() {
    this.toggleTreeBreadcrumb = 0;
    if (this.togglebreadcrumb === 0) {
      this.dropdownOpen = true;
      this.togglebreadcrumb += 1;
      this.isNodeClick = false;
    } else {
      this.dropdownOpen = false;
      this.togglebreadcrumb = 0;
      this.breadcrumbIndex = -1;
      this.isNodeClick = false;
    }
    this.autoClickSpanTag();
  }

  getSelectedOffer(offerId) {
    this.showLoader = true;
    this.selectedOfferingsChildren = [];
    localStorage.setItem('offerId', offerId);
    const treeId = localStorage.getItem('offerTreeId');
    if(treeId !== undefined && treeId !== null) {
      let queryParams = {
        id: localStorage.getItem('offerTreeId')
      };
      if (offerId !== null && offerId !== undefined) {
        this._treeHierarchyService.getSelectedOfferData({
          data: queryParams,
          success: result => {
            this.selectedOfferingsChildren = [];
            this.mobileTreeBreadCrumb = [];
            this.handleBackEventArray = [];
            this.selectedOfferingsChildren.push(result);
            this.expandRecursive(this.selectedOfferingsChildren[0]);
            this.mobileApplicationLevelData(result);
            this.handleBackEventArray.push(result);
            this.autoClickSpanTag();
          },
          failure: error => {},
          onComplete: () => {
            this.showLoader = false;
          }
        });
      }
    }
  }

  mobileApplicationLevelData(result) {
    const instanceId = this.instanceId;
    localStorage.setItem('Level', this.Level);
    const level = this.Level;
    const res = this.selectedObject;
    if (result.children !== null) {
      for (let i = 0; i < result.children.length; i++) {
        if (level === this.widget['Po'] || level === this.widget['Bundle']) {
          this.mobileTreeBreadCrumb = [];
          this.mobileTreeBreadCrumb.push(result);
        } else if (level === this.widget['BundlePo']) {
          this.mobileTreeBreadCrumb.push(result.children[i]);
        } else if (level === this.widget['PiInBundle']) {
          if (res.offerId === result.children[i].id) {
            this.resetMobileTreeBreadcrumb(result, i);
          }
        } else if (level === this.widget['Pi']) {
          if (this.isBundle === this.widget['Bundle']) {
            if (instanceId === result.children[i].id) {
              this.mobileTreeBreadCrumb = result.children;
              this.backNavigationName = result.displayName;
              this.selectedObject = result.children;
            } else {
              for (let j = 0; j < result.children[i].children.length; j++) {
                if (instanceId === result.children[i].children[j].id) {
                  this.mobileTreeBreadCrumb = [];
                  this.resetMobileTreeBreadcrumb(result, i);
                }
              }
            }
          } else {
            this.mobileTreeBreadCrumb.push(result.children[i]);
            this.backNavigationName = result.name;
            this.selectedObject = result;
          }
        } else if (level === this.widget['childPi']) {
          this.mobileTreeBreadCrumb = [];
          if (instanceId === result.children[i].id) {
            this.mobileTreeBreadCrumb = [];
            this.resetMobileTreeBreadcrumb(result, i);
          }
        } else if (level === this.widget['outSideChildPi']) {
          for (let j = 0; j < result.children[i].children.length; j++) {
            if (instanceId === result.children[i].children[j].id) {
              this.mobileTreeBreadCrumb = [];
              this.resetMobileTreeBreadcrumb(result, i);
            }
          }
        } else {
        }
      }
    } else {
      this.mobileTreeBreadCrumb = [];
      this.mobileTreeBreadCrumb.push(result);
    }
    localStorage.setItem(
      'mobileBreadcurmbData',
      JSON.stringify(this.mobileTreeBreadCrumb)
    );
    localStorage.setItem('mobileBackEventTempData', JSON.stringify(result));
    return false;
  }

  resetMobileTreeBreadcrumb(result, i) {
    this.backNavigationName = result.children[i].displayName;
    this.selectedObject = result.children[i];
    this.mobileTreeBreadCrumb = result.children[i].children;
    localStorage.setItem(
      'mobileselectedObject',
      JSON.stringify(this.selectedObject)
    );
    localStorage.setItem(
      'mobileBreadcurmbData',
      JSON.stringify(this.mobileTreeBreadCrumb)
    );
  }

  nodeClickEventHandler(node: any) {
    if (node['nodeType'] === 'BUNDLE') {
      this.bundleClickEventHandler(node);
    } else if (node['nodeType'] === 'PO') {
      this.prodOfferClickEventHandler(node);
    } else if (node['nodeType'] === 'PI') {
      this.PIClickEventHandler(node);
    } else if (node['nodeType'] === 'CHILD_PI') {
      this.ChildPIClickEventHandler(node);
    }
  }

  bundleClickEventHandler(BObj) {
    this.nodeId = BObj.id;
    this.calculateBreadCrumTextHeight();
    this.reCreateBreadcrumb();
    this._router.navigate([this.bundlePath, BObj.id]);
  }

  prodOfferClickEventHandler(POObj) {
    this.nodeId = POObj.id;
    this.calculateBreadCrumTextHeight();
    this.reCreateBreadcrumb();
    if (POObj.parentId !== null && POObj.parentId !== undefined) {
    if (this.selectedOfferingsChildren[0].nodeType === this.widget['Bundle']) {
      localStorage.setItem('offerId', this.selectedOfferingsChildren[0]['id']);
      this.path = this.poPath + POObj.id;
      this.pushObjectToBreadCrumb(
        'link',
        POObj.displayName,
        false,
        this.path,
        POObj.offerId,
        'PO'
      );
      this._router.navigate([this.BundlePo, POObj.parentId, POObj.id]);
    } 
  } else if (POObj.parentId === null) {
      this._router.navigate([this.poPath, POObj.id]);
    }
    this.changeDisplayName(POObj.nodeType, POObj.displayName);
  }

  PIClickEventHandler(PIObj) {
    this.nodeId = PIObj.id;
    this.calculateBreadCrumTextHeight();
    this.reCreateBreadcrumb();
    if (PIObj.parent !== undefined) {
      if (
        this.selectedOfferingsChildren[0].nodeType === this.widget['Bundle']
      ) {
        if (PIObj.parent && PIObj.parent.nodeType === this.widget['Po']) {
          this.path = this.poPath + PIObj.offerId;
          this.pushObjectToBreadCrumb(
            'link',
            PIObj.parent.displayName,
            false,
            this.path,
            PIObj.parent.offerId,
            'PO'
          );
        }
      }
      this.path =
        this.piPath + PIObj.offerId + '/' + PIObj.id + '/' + PIObj.kind;
      this.pushObjectToBreadCrumb(
        'link',
        PIObj.displayName,
        false,
        this.path,
        PIObj.offerId,
        'PI'
      );
      this._router.navigate([this.piPath, PIObj.offerId, PIObj.id, PIObj.kind]);
    }
    this.changeDisplayName(PIObj.nodeType, PIObj.displayName);
  }

  ChildPIClickEventHandler(CPIObj) {
    this.nodeId = CPIObj.id;
    this.calculateBreadCrumTextHeight();
    this.reCreateBreadcrumb();
    if (CPIObj.parent.parent !== undefined) {
      if (
        this.selectedOfferingsChildren[0].nodeType === this.widget['Bundle']
      ) {
        if (
          CPIObj.parent.parent &&
          CPIObj.parent.parent.nodeType !== this.widget['Bundle']
        ) {
          this.path = this.poPath + CPIObj.offerId;
          this.pushObjectToBreadCrumb(
            'link',
            CPIObj.parent.parent.displayName,
            false,
            this.path,
            CPIObj.parent.parent.offerId,
            'PO'
          );
        }
      }
      this.path =
        this.piPath +
        CPIObj.offerId +
        '/' +
        CPIObj.parentId +
        '/' +
        CPIObj.parent.kind;
      this.pushObjectToBreadCrumb(
        'link',
        CPIObj.parent.displayName,
        false,
        this.path,
        CPIObj.parent.offerId,
        'PI'
      );
      this.path =
        this.piPath +
        CPIObj.offerId +
        '/' +
        CPIObj.id +
        '/' +
        CPIObj.parent.kind +
        '/' +
        this.child;
      this.pushObjectToBreadCrumb(
        'link',
        CPIObj.displayName,
        false,
        this.path,
        CPIObj.offerId,
        'CHILD_PI'
      );
      this._router.navigate([
        this.piPath,
        CPIObj.offerId,
        CPIObj.id,
        CPIObj.kind,
        this.child
      ]);
    }
    this.changeDisplayName(CPIObj.nodeType, CPIObj.displayName);
  }

  reCreateBreadcrumb() {
    this.breadcrumb = [];
    this.temporaryBreadcrumbList = JSON.parse(
      localStorage.getItem('tempbreadcrumbObject')
    );
    for (let i = 0; i < this.temporaryBreadcrumbList.length; i++) {
      this.breadcrumb.push(this.temporaryBreadcrumbList[i]);
    }
  }

  pushObjectToBreadCrumb(linktype, name, IsActive, path, NodeId, imageType) {
    this.breadcrumb.push({
      type: linktype,
      displayName: name,
      active: IsActive,
      path: path,
      id: NodeId,
      imageType: imageType
    });
    localStorage.setItem('breadcrumbObject', JSON.stringify(this.breadcrumb));
    this.browserObjectHandling(path, 0);
  }

  browserObjectHandling(path, actionType) {
    let pathAvail = 0;
    const obj = {
      path: path,
      data: JSON.parse(JSON.stringify(this.breadcrumb))
    };
    const data = JSON.parse(localStorage.getItem('browserObject'));
    this.browserArray = data === null ? [] : data;
    this.browserArray.forEach(element => {
      if (element.path === path) {
        pathAvail = pathAvail + 1;
        if (actionType === 1) {
          element.data = obj.data;
        }
      }
    });

    if (pathAvail === 0) {
      this.browserArray.push(obj);
    }
    localStorage.setItem('browserObject', JSON.stringify(this.browserArray));
  }

  selectMobileDevDefaultOptions(node, selectedOption) {
    this.selectedOption = node['displayName'];
    this._utilService.changeTogglevalue(0);
    this.changeDisplayName('', node['displayName']);
    this.backNavigationName = node.displayName;
    localStorage.setItem(
      'backNavigationName',
      JSON.stringify(this.backNavigationName)
    );
    localStorage.setItem('mainRoot', node['displayName']);
  }

  backToPreviousPage() {
    this.mobileRedirectionEvent(this.selectedObject, 0);
    this.previousAvailableNodes();
  }

  nextAvailableNodes(obj, index) {
    this.backNavigationName = obj.name;
    this.mobileTreeBreadCrumb = [];
    this.mobileTreeBreadCrumb = obj['children'] || obj['childs'];
    this.selectedObject = obj;
    localStorage.setItem(
      'mobileBreadcurmbData',
      JSON.stringify(this.mobileTreeBreadCrumb)
    );
    localStorage.setItem(
      'mobileselectedObject',
      JSON.stringify(this.selectedObject)
    );
    localStorage.setItem(
      'backNavigationName',
      JSON.stringify(this.backNavigationName)
    );
  }

  previousAvailableNodes() {
    localStorage.setItem(
      'mobileMenuType',
      JSON.stringify({ IsMobileDefaultMenuShow: true })
    );
    this.mainRoot = localStorage.getItem('mainRoot');
    this.handleBackEventArray = [];
    const tempObj =
      localStorage.getItem('mobileBackEventTempData') !== (null && undefined)
        ? JSON.parse(localStorage.getItem('mobileBackEventTempData'))
        : null;
    let nodesLength;
    let parentId;
    let obj;
    if (tempObj) {
      this.handleBackEventArray.push(tempObj);
      const arrayObj =
        this.handleBackEventArray[0].children ||
        this.handleBackEventArray[0].childs;
      nodesLength = arrayObj !== (undefined && null) ? arrayObj.length : 0;
      obj = this.selectedObject;
      parentId = obj === undefined ? null : obj['parentId'];
    }
    if (this.mainRoot === this.offerings) {
      if (this.backNavigationName !== this.offerings) {
        for (let i = 0; i < nodesLength; i++) {
          this.mobileTreeBreadCrumb = [];
          /*user viewing po's and want to go to bundle view*/
          if (parentId === null) {
            this.mobileTreeBreadCrumb = this.handleBackEventArray;
            this.selectedObject = this.handleBackEventArray;
            this.backNavigationName = this.offerings;
          }

          /*user viewing PI's and want to go to PO view*/
          if (parentId === this.handleBackEventArray[0].id) {
            this.mobileTreeBreadCrumb = this.handleBackEventArray[0].children;
            this.selectedObject = this.handleBackEventArray[0];
            this.backNavigationName = this.selectedObject.name;
          }

          /*user viewing child PI's and want to go to PI view*/
          if (parentId === this.handleBackEventArray[0].children[i].id) {
            this.mobileTreeBreadCrumb = this.handleBackEventArray[0].children[
              i
            ].children;
            this.selectedObject = this.handleBackEventArray[0].children[i];
            this.backNavigationName = this.selectedObject.name;
          }
        }
      } else {
        this.renderToMainPage(this.offeringsPath);
      }
    } else if (this.mainRoot === this.piTemplates) {
      if (this.backNavigationName !== this.piTemplates) {
        if (obj['templateParentId'] == null) {
          this.mobileTreeBreadCrumb = this.handleBackEventArray;
          this.selectedObject = this.handleBackEventArray[0];
          this.backNavigationName = this.piTemplates;
        }
      } else {
        this.renderToMainPage(this.piTemplatePath);
      }
    } else if (this.mainRoot === this.sharedRates) {
      if (this.backNavigationName === this.sharedRates) {
        this.renderToMainPage(this.sharedRatesPath);
      }
    } else if (this.mainRoot === this.calendars) {
      if (this.backNavigationName === this.calendars) {
        this.renderToMainPage(this.calendarsPath);
      }
    }
    localStorage.setItem(
      'mobileselectedObject',
      JSON.stringify(this.selectedObject)
    );
    localStorage.setItem(
      'mobileBreadcurmbData',
      JSON.stringify(this.mobileTreeBreadCrumb)
    );
    localStorage.setItem(
      'backNavigationName',
      JSON.stringify(this.backNavigationName)
    );
  }

  renderToMainPage(mainPath) {
    this.selectedObject = undefined;
    this.mobileTreeBreadCrumb = [];
    this._router.navigate([mainPath]);
    this._utilService.changeTogglevalue(0);
    localStorage.setItem(
      'mobileMenuType',
      JSON.stringify({ IsMobileDefaultMenuShow: false })
    );
    this.changeDisplayName('', this.backNavigationName);
    this.selectedOption = this.backNavigationName;
  }

  mobileRedirectionEvent(obj, index) {
    this.mainRoot = localStorage.getItem('mainRoot');
    if (obj !== (undefined && null)) {
      this.selectedOption = obj['displayName'];
      if (this.mainRoot === this.offerings) {
        switch (obj.nodeType) {
          case this.widget['Po']:
            this._router.navigate([this.poPath, obj['id']]);
            break;
          case this.widget['Bundle']:
            this._router.navigate([this.bundlePath, obj['id']]);
            break;
          case this.widget['Pi']:
            this._router.navigate([
              this.piPath,
              obj['offerId'],
              obj['id'],
              obj['kind']
            ]);
            break;
          case this.widget['childPi']:
            this._router.navigate([
              this.piPath,
              obj['offerId'],
              obj['id'],
              obj['kind'],
              this.child
            ]);
            break;
          case this.widget['PiInBundle']:
            this._router.navigate([
              this.piPath,
              obj['offerId'],
              obj['id'],
              obj['kind']
            ]);
            break;
          case this.widget['BundlePo']:
            this._router.navigate([
              this.BundlePo,
              this.bundleId,
              obj['offerId']
            ]);
            break;
          default:
            break;
        }
      } else if (this.mainRoot === this.piTemplates) {
        const kind = obj['kind'] || obj['kindType'];
        if (obj['templateParentId'] == null) {
          this._router.navigate([this.piTemplatePath, obj['templateId'], kind]);
        } else {
          this._router.navigate([
            this.piTemplatePath,
            obj['templateId'],
            kind,
            this.child
          ]);
        }
      }
      this._utilService.changeTogglevalue(0);
      this.changeDisplayName(obj['nodeType'], obj['displayName']);
    }
  }

  logout() {
    this._utilService.callautoLogout(true);
  }

  changeDisplayName(imageType, pageTitle) {
    localStorage.setItem(
      'displayInfo',
      JSON.stringify({ imageType: imageType, currentPage: pageTitle })
    );
    this.pageTitle = this.currentPage = pageTitle;
    this.imageType = imageType;
    this._utilService.changePageTitle(this.pageTitle);
  }

  loadLocalization() {
    this._utilService.showLocalizationInMobileBreadcrumb(true);
  }

  loadCheckConfiguration() {
    this._utilService.showConfigurationInMobileBreadcrumb(true);
  }

  handlingMobileBreadcrumb(obj, level, piType) {
    this.mobileTreeBreadCrumb = [];
    let displayName, pageTitle;
    displayName = pageTitle =
      obj['displayName'] == null ? obj['name'] : obj['displayName'];
    if (level === this.widget['grid']) {
      this.mobileTreeBreadCrumb.push(obj);
    } else if (level === this.widget['outSideChildPi']) {
      this.backNavigationName = displayName;
      this.mobileTreeBreadCrumb = obj['childs'];
      this.selectedObject = obj;
    } else {
    }
    if (piType) {
      if (obj['chargeType']) {
        displayName = displayName + ' (' + obj['chargeType'] + ')';
      } else if (obj['kindType']) {
        displayName = displayName + ' (' + obj['kindType'] + ')';
      }
    }
    localStorage.setItem('mobileBackEventTempData', JSON.stringify(obj));
    localStorage.setItem(
      'mobileBreadcurmbData',
      JSON.stringify(this.mobileTreeBreadCrumb)
    );
    this.changeDisplayName('', displayName);
    this.currentPage = pageTitle;
  }

  countAvailableNodes(obj) {
    const query = obj['childs'] || obj['children'];
    return query !== undefined && query !== null && query['length'] > 0
      ? true
      : false;
  }

  isTicketLogin() {
    return !this._utilityService.isEmpty(sessionStorage.getItem('ticket'));
  }

  browserRefreshHandling(pathname) {
    const allowHierarchy = ['ProductOffer', 'Bundle'];
    const url = pathname.split('/');
    if (pathname !== '/login') {
      this.breadcrumb = [];
      this.loopingBrowserObject(pathname);
      /*load breadcrumb tree structure data*/
      if (allowHierarchy.indexOf(url[2]) !== -1) {
        this.getSelectedOffer(url[3]);
      }
    }
  }

  loopingBrowserObject(pathname) {
    const PathName = pathname.replace('%20',' ');
    this.browserObject = JSON.parse(localStorage.getItem('browserObject'));
    let keepGoing = true;
    for (const parent of this.browserObject) {
      if (parent.path === PathName) {
        for (const data of parent['data']) {
          if (keepGoing) {
            if (data.path !== PathName) {
              this.breadcrumb.push(data);
            } else {
              this.breadcrumb.push(data);
              keepGoing = false;
              localStorage.setItem(
                'breadcrumbObject',
                JSON.stringify(this.breadcrumb)
              );
            }
          }
          this.changeDisplayName(
            this.breadcrumb[this.breadcrumb.length - 1].imageType,
            this.breadcrumb[this.breadcrumb.length - 1].displayName
          );
        }
        this.selectedOption = this.breadcrumb[
          this.breadcrumb.length - 1
        ].displayName;
      }
    }
  }

  formateName(obj) {
    return obj['displayName'] === null ? obj['name'] : obj['displayName'];
  }

  resetToggleValues() {
    this.togglebreadcrumb = 0;
    this.toggleTreeBreadcrumb = 0;
  }

  documentEvents() {
    this.isNodeClick = false;
    this.resetToggleValues();
    this.dropdownOpen = false;
    this._utilService.changeTogglevalue(0);
    this.autoClickSpanTag();
    this.hiddenChildMenu();
  }

  ngOnDestroy() {
    if (this.appLevelObservable) {
      this._utilService.changeBreadCrumbApplicationLevelEvents({
        offerId: 0,
        path: '',
        POObj: {},
        PIObj: {},
        CPIObj: {},
        Level: '',
        PIType: ''
      });
      this.appLevelObservable.unsubscribe();
    }
    if (this.piTempleteObservable) {
      this.piTempleteObservable.unsubscribe();
    }

    if (this.updateTreeNode) {
      this.updateTreeNode.unsubscribe();
    }

    if (this.selectedOfferBreadcrumbData) {
      this._utilService.changeSelectedOfferBreadcrumbData({});
      this.selectedOfferBreadcrumbData.unsubscribe();
    }

    if (this.newRecordObs) {
      this._utilService.addNewRecord({ obj: {}, path: '', Level: '' });
      this.newRecordObs.unsubscribe();
    }

    if (this.errorRedirectionObs) {
      this._utilService.errorRedirection({});
      this.errorRedirectionObs.unsubscribe();
    }

    if (this.allowBrowserBack) {
      this.allowBrowserBack.unsubscribe();
    }
    if (this.displayNameEditOrDelete) {
      this._utilService.breadCrumbDisplayNameEditorDelete({
        pageTitle: '',
        actionType: 0
      });
      this.displayNameEditOrDelete.unsubscribe();
    }
  }

  isTranslateText(value: any) {
    return this._utilityService.isStaticString(value);
  }
}
