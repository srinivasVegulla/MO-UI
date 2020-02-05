import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, CanDeactivate, NavigationStart, ParamMap } from '@angular/router';
import { PiTemplateDetailsService } from './piTemplateDetails.service';
import { Language, DefaultLocale, Currency, LocaleService } from 'angular-l10n';
import { utilService } from '../../helpers/util.service';
import { PriceableItemTemplateService } from '../../priceableItemTemplates/priceableItemTemplate.service';
import { UtilityService } from '../../helpers/utility.service';

@Component({
  selector: 'ecb-pi-template-details',
  templateUrl: './piTemplateDetails.component.html'
})

export class PiTemplateDetailsComponent implements OnInit, OnDestroy {
  kind;
  currentLocale;
  templateId;
  piTemplateDetailSubscriptions;
  priceableItemsData;
  isExtendedPropertiesAvailable;
  isDeleteError;
  showAdjustments: boolean;
  nextStateUrl: string;
  showLoader:boolean = false;
  showPIProperties:boolean = false;
  showPIRateTables:boolean = false;
  showPIAdjustments:boolean = false;
  showPIUnitDetails:boolean = false;
  showExtProperties:boolean = false;
  showPIBilling:boolean = false;
  isFormUpdated: boolean = false;
  widgetType: any;
  widgetUpdated = false;
  deleteErrorMessage;
  deleteSharedRateSubscribe;
  piTemplateDetailSubscribe;
  showLocalizationPanel: boolean = false;
  onInitCount = false;
  localUpdated: boolean;
  isAdjustestmentsloaded: boolean;
  isPILoadError = false;

  constructor(private _route: ActivatedRoute,
    private _piTemplateDetailsService: PiTemplateDetailsService,
    private locale: LocaleService,
    private _utilService: utilService,
    private _piTemplateService: PriceableItemTemplateService,
    private _utilityService: UtilityService,
    private _router: Router) {
    this._utilService.changeitemInstanceDisplayName("");
    this._utilService.changedisplayName("");
    this.isFormUpdated = false;
    this._route.params.subscribe(params => {
      if (this.onInitCount) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this._utilService.changedynamicSaveBtn('PItemplate');
    this.onInitCount = true;
    this.currentLocale = this.locale.getCurrentLocale();
    this._utilService.updateApplyBodyScroll(true);
    this.templateId = this._route.snapshot.params['templateId'];
    this._utilService.currentView('PriceableItemTemplates');
    this.kind = this._route.snapshot.params['kind'];
    this.getInitalPIdetails();
    this.deleteSharedRateSubscribe = this._utilService.deletePItemplate.subscribe(value => {
      if (value) {
        this.deletePItemplate();
      }
    });
    this.piTemplateDetailSubscribe = this._piTemplateDetailsService.isPriceableItemTemplateUpdated.subscribe(value => {
      if (value) {
        this.localUpdated = value;
        this.getInitalPIdetails();
      }
    });
    this.nextStateUrl = '/ProductCatalog/PriceableItemTemplates';
    /* this._router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe(value => {
        this.nextStateUrl = value['url'];
    }); */
    const localizationFromContextbar = this._utilService.localizationFromContextbar.subscribe(value => {
      if (value) {
        this.showLocalizationPanel = true;
      }
    });
  }
  hidelocalizationWidget(value) {
    if (value) {
      this.showLocalizationPanel = false;
    }
  }

  getInitalPIdetails() {
    let timer: any;
    this.widgetUpdated === true ? this.toggleWidgetSkeleton(this.widgetType) : this.showLoader = true;
    if(this.templateId) {
      this._piTemplateDetailsService.getPriceableTemplateDetails({
      data: {
        templateId: this.templateId,
        kind: this.kind
      },
      success: (result) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
        this.priceableItemsData = result;
        this.showAdjustments = this.priceableItemsData.adjustmetWidget;
        let name = this.priceableItemsData.displayName;
        if (result.extendedProperties !== null || result.extendedProperties !== undefined) {
          this.isExtendedPropertiesAvailable = Object.keys(result['extendedProperties']).length > 0 ? true : false;
        }
        this._utilService.changePItemplateDataTobeDeleted(result);
        if(this._piTemplateDetailsService.isPriceableItemTemplateUpdated.value){
          this._utilService.addNewRecord({
            obj: name
          });
        }
        if (this.localUpdated) {
          if (this.priceableItemsData['chargeType']) {
            name = name + ` (${this.priceableItemsData['chargeType']})`;
            this._utilService.breadCrumbDisplayNameEditorDelete({ pageTitle: name, actionType: 1 });
          }
        }
      }, 300);
      },
      failure: (errorMsg: string, code: any) => {
        this.deleteErrorMessage =  this._utilityService.errorCheck(code, errorMsg, 'LOAD');
        this.isPILoadError = true;
      },
      onComplete: (success) => {
        setTimeout(() => {
          this.isFormUpdated = false;
          this.showLoader = false;
          this.showPIProperties = false;
          this.showExtProperties = false;
          this.showPIAdjustments = false;
          this.showPIBilling = false;
          this.showPIUnitDetails = false;
          this.showPIRateTables = false;
          this.widgetUpdated = false;
        }, 200);
      }
    });
    }
  }

  updatePITemplate(value) {
    if (value) {
      this.widgetUpdated = true;
      this.widgetType = value;
      this.getInitalPIdetails();  
    }
  }

  toggleWidgetSkeleton(widget) {

    switch (widget) {
      case 'PIProperties':
        this.showPIProperties  = true;
        break;
      case 'ExtProperties':
        this.showExtProperties  = true;
        break;
      case 'PIBilling':
        this.showPIBilling = true;
        break;
      case 'PIAdjustments':
        this.showPIAdjustments  = true;
        break;
      case 'PIRateTables':
        this.showPIRateTables  = true;
        break;
      case 'PIUnitDetails':
        this.showPIUnitDetails  = true;
        break;
      default:
        break;
    }
  }

  deletePItemplate() {
    const widgetData = {
      templateId: this.templateId,
    };
    this._piTemplateService.deletePItemplateRecord({
      data: widgetData,
      success: (result) => {
        this._utilService.breadCrumbDisplayNameEditorDelete({ pageTitle: 'TEXT_PI_TEMPLATES', actionType: 2 });
        this._router.navigate(['/ProductCatalog/PriceableItemTemplates']);
      },
      failure: (errorMsg: string, code: any) => {
        this.deleteErrorMessage =  this._utilityService.errorCheck(code, errorMsg, 'DELETE');
        this.isPILoadError = true;
      }
    });
    this._utilService.changeDeletePItemplate(false);
  }

  displayNavoutDialog(value) {
    if (value) {
      this.isFormUpdated = true;
    } else {
      this.isFormUpdated = false;
    }
  }

  canDeactivate() {
    if (this.isFormUpdated) {
      const data = {
        url: this.nextStateUrl
      };
      this._utilService.changePreventUnsaveChange(data);
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    if (this.deleteSharedRateSubscribe) {
      this.deleteSharedRateSubscribe.unsubscribe();
    }
    if (this.piTemplateDetailSubscribe) {
      this.piTemplateDetailSubscribe.unsubscribe();
    }
  }
}
