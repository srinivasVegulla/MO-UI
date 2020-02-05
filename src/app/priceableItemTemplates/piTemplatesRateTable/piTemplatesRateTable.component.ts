import { Component, EventEmitter, ViewChild, OnInit, Input, Output, HostListener } from '@angular/core';
import { PItemplatesRateTableService } from './piTemplatesRateTable.service';
import { UtilityService } from '../../helpers/utility.service';

@Component({
  selector: 'ecb-pt-ratetable',
  templateUrl: './piTemplatesRateTable.component.html',
  providers: []
})

export class PItemplateRateTableComponent implements OnInit {
  @Input() type;
  @Input() templateData;
  @Output() isPITemplateUpdated = new EventEmitter();
  rateTableData: any = [];
  piRateTableCols: any;
  httpErrorMessage: any;
  loadGridData = false;
  localeErrorMessage = false;
  isRateTableLoadError = false;

  constructor(private _piTemplateRatetableService: PItemplatesRateTableService,
    private _utilityService: UtilityService
   ) {
  }

  ngOnInit() {
    this.getGridConfigData();
  }

  getGridConfigData() {
    this._utilityService.getextdata({
      data: 'piTemplateRateTableColumnDef.json',
      success: (result) => {
        this.piRateTableCols = result.cols;
        this.getRateTableData();
        this.loadGridData = true;
      },
      failure: (error) => {
        this.localeErrorMessage = true;
        this.loadGridData = false;
      }
    });
  }

  getRateTableData() {
    this._piTemplateRatetableService.getRateTableData({
      data: {
        piId: this.templateData['piId'],
      },
      success: (result) => {
        this.rateTableData = result;
      },
      failure: (errorMsg: string, code: any) => {
        this.isRateTableLoadError = true;
        this.httpErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
      },
      onComplete: (success) => {
      }
    });
  }
}
