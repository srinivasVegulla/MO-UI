import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { utilService } from '../util.service';
import { PriceableItemTemplateService } from '../../priceableItemTemplates/priceableItemTemplate.service';

@Component({
  selector: 'ecb-card-controller',
  templateUrl: './card-controller.component.html',
  styleUrls: ['./card-controller.component.scss']
})
export class CardControllerComponent implements OnInit {
childPriceableItemsDataType;
child = "Child";
  ChildPItemplateInfo;

@Input() PIType: string;
@Input() set childPIInstance(childPriceableItemsDataType){
  this.childPriceableItemsDataType = childPriceableItemsDataType;
  }
@Input() productOfferId;
@Input() set ChildPItemplate(obj) {
  if (obj) {
    this.ChildPItemplateInfo = obj;
  }
}
@Input() templateId;
  Level = 'CHILD_PI_OUT';
  constructor(private _router: Router,
    private _utilService: utilService,
    private _piTemplateService: PriceableItemTemplateService) {}

  ngOnInit() {
  }
  redirectToPIDetailsPage(PIObj) {
   this._utilService.changeBreadCrumbApplicationLevelEvents({
     offerId: this.productOfferId,
     path: '/ProductCatalog/PriceableItem/' + this.productOfferId + "/" +PIObj.itemInstanceId+"/"+this.PIType+"/"+this.child,
     POObj: {},
     PIObj: PIObj,
     CPIObj: {},
     Level: this.Level,
     PIType: this.PIType
    });
    this._router.navigate(['/ProductCatalog/PriceableItem/', this.productOfferId, PIObj.itemInstanceId,this.PIType, this.child]);
    localStorage.setItem('PIChildItem',JSON.stringify({parent:false,child:true}));
    this._utilService.changePiInstanceChildShow({parent:false,child:true});
  }
  openChildPItemplate (result, index) {
    this._utilService.addNewRecord({
      obj: this.ChildPItemplateInfo,
      path: '/ProductCatalog/PriceableItemTemplates/' + result['templateId'] + '/USAGE/child',
      Level: this.Level,
      index: index
    });
    this._router.navigate(['/ProductCatalog/PriceableItemTemplates/', result['templateId'], 'USAGE', 'child']);
  }
}
