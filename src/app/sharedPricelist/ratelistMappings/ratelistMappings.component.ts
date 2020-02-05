import { Component, OnInit, Input, HostListener, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { SharedPricelistService } from '../shared.pricelist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../../helpers/utility.service';
import { TreeModule, TreeNode, Tree } from 'primeng/primeng';
import { RatesService } from '../../rates/rates.service';
import { Language } from 'angular-l10n';
import { CapabilityService } from '../../helpers/capabilities.service';
import { utilService } from "../../helpers/util.service";

@Component({
    selector: 'ecb-ratelist-mappings',
    templateUrl: './ratelistMappings.component.html',
    providers: []
})

export class RatelistMappingsComponent implements OnInit, OnDestroy {

  ratelistData: any[];
  pricelistId: any;
  firstParamTable: any;
  sharedRateItemFetching = false;
  sharedItemError = null;
  currentParameterTable;
  addRateTableCapability = true;
  checkUpdateData: any;
  @Language() lang;
  @ViewChild('sharedRateTree') sharedRateTree: Tree;
  @Output() onRateTableResponse = new EventEmitter<any>();
  @Output() onRateTableLoad = new EventEmitter<any>();
  @Output() onAddRateTableClick = new EventEmitter<any>();
  @Output() onLoadErrors = new EventEmitter<any>();
  reloadSubscribe;

  @Input() set pricelistIdParam(value) {
    this.pricelistId = value;
     this.initialize();
  }
  isLowerResolution = false;
  MEDIUM_RESOLUTION = 992;

  constructor(private _sharedPricelistService: SharedPricelistService,
    private _ratesService: RatesService,
    private _utilityService: UtilityService,
    private _capabilityService: CapabilityService,
    private  _utilService: utilService) {
  }

  ngOnInit() {
    this.resetResolution();
    this.reset();
    this.addRateTableCapability = this._capabilityService.findPropertyCapability('UISharedRateDetailsPage', 'RateTables_Add');
    this.reloadSubscribe = this._sharedPricelistService.rateTableMapped.subscribe(value => {
      if (value) {
        this.initialize();
      }
    });
  }

  reset() {
    this._utilService.checkIfDataUpdateMethod({});
    this.ratelistData = [];
    this.sharedItemError = null;
  }

  initialize() {
    this.getSharedRatesItem();
  }

  getSharedRatesItem() {
    this.sharedRateItemFetching = true;
    this.sharedItemError = null;
    this.checkUpdateData = this._utilService.checkIfDataUpdate.value;

    const widgetData = {
      pricelistId: this.pricelistId,
      param: {}
    };
    if (Object.keys(this.checkUpdateData).length !== 0) {
      if (this.checkUpdateData.templateParentId === null) {
        delete widgetData.param['selectedParentTemplateId'];
       } else {
         widgetData.param['selectedParentTemplateId'] =  this.checkUpdateData.templateParentId;
       }
      widgetData.param['selectedTemplatedId'] = this.checkUpdateData.itemTemplateId;
      widgetData.param['selectedParameterTableId'] = this.checkUpdateData.ptId;
    }
    this._sharedPricelistService.getSharedRatesItem({
      data: widgetData,
      success: (result) => {
        this.ratelistData = result.treeNodes;
        if (Object.keys(result.selectedIndex).length > 0 ) {
        if (result.selectedIndex['parent'] !== null) {
          if (result.selectedIndex['subChild'] !== null) {
            this.firstParamTable = this.ratelistData[result.selectedIndex['parent']].
                              children[result.selectedIndex['child']].children[result.selectedIndex['subChild']];
          } else {
            this.firstParamTable = this.ratelistData[result.selectedIndex['parent']].children[result.selectedIndex['child']];
          }
        }
      }
      this.manipulateAllNode('expanded', true);
      this.showSchedules(this.firstParamTable);
      },
      failure: (errorMsg: string, code: any) => {
        this.ratelistData = [];
        this.sharedItemError = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
        this.onLoadErrors.emit({'showError' : true, 'message' : this.sharedItemError});
      },
      onComplete: () => {
        this.sharedRateItemFetching = false;
      }
    });
  }


  getParameterTableMetaData(paramTableId, callback) {
    this.onRateTableLoad.emit(true);
    this._ratesService.getParamTablesMetaData({
      data : {
        id : paramTableId
      },
      success : (metaData) => {
        callback(metaData);
      },
      failure : (error) => {
        this.handleError(error);
      },
      onComplete : () => {
        this.onRateTableLoad.emit(false);
      }
    });
  }

  getSchedules(paramTableId, itemTemplateId, pricelistId, callback, complete) {
      this.onRateTableLoad.emit(true);
      this._ratesService.getRateSchedules({
      data : {
        paramTableId : paramTableId,
        itemTemplateId: itemTemplateId,
        pricelistId: pricelistId
      },
      success : (schedules) => {
        this.getParameterTableMetaData(paramTableId, (metaData) => {
          callback(schedules.rates[0].rateSchedules, metaData);
        });
      },
      failure : (error) => {
        this.handleError(error);
      }
    });
  }

  showSchedules(paramTable) {
    if (this._utilityService.isObject(paramTable) && paramTable['selected'] !== true) {
      this.manipulateAllNode('selected', false);
      paramTable['selected'] = true;
      this.currentParameterTable = paramTable;
      this.getSchedules(paramTable.id, paramTable.parentId, this.pricelistId,
        (schedules, metaData) => {
        const rate = {
          properties: metaData,
          schedules: schedules,
          paramtableDisplayName: paramTable.displayName,
          subscriptionCount: 0,
          itemTemplateId: paramTable.parentId,
          paramtableId: paramTable.id,
          pricelistId: this.pricelistId
        };
        this.onRateTableResponse.emit(rate);
        this.onRateTableLoad.emit(false);
      }, () => {
      });
    }
  }

  manipulateAllNode(property: string, value) {
    this.ratelistData.forEach( node => {
        this.manipulateNodeRecursive(node, value, property);
    });
  }

  private manipulateNodeRecursive(node, value, property: string) {
    node[property] = value;
    if (node.children) {
      node.children.forEach( childNode => {
          this.manipulateNodeRecursive(childNode, value, property);
      });
      if (node.children.length === 0 && this.firstParamTable === undefined) {
        this.firstParamTable = node;
      }
    }
  }

  showPIRatesTables(node) {
    this.onAddRateTableClick.emit({'templateId' : node.id, 'displayName' : node.displayName});
  }

  private handleError (error: Response) {
  }

  private resetResolution() {
    this.isLowerResolution = window.innerWidth < this.MEDIUM_RESOLUTION;
  }

  @HostListener('window:resize')
  toggleResolution() {
    this.resetResolution();
  }
  ngOnDestroy() {
    this._sharedPricelistService.isRateTableMapped(false);
    if (this.reloadSubscribe) {
      this.reloadSubscribe.unsubscribe();
    }
  }
}
