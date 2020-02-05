import { Injectable } from '@angular/core';
import { CanDeactivate , Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { PriceableItemDetailsComponent } from './priceableItemDetails.component';
import { contextBarHandlerService } from '../helpers/contextbarHandler.service';
import { utilService } from '../helpers/util.service';
import { modalService } from '../helpers/modal-dialog/modal.service';
import {RatesService} from '../rates/rates.service';

@Injectable()
export class priceableItemDetailsUnsavedChangesGuard implements CanDeactivate<PriceableItemDetailsComponent> {

  public ratesScheduleUnsaveStatus:boolean = false;

  constructor(public _contextBarHandlerService: contextBarHandlerService,
              public _utilService: utilService,
              public _modalService: modalService,
              public _ratesService: RatesService) {
  }
  ngOnInit() {
    this._utilService.priceableItemDetailsUnSavedChanges.subscribe(value =>{
      this.ratesScheduleUnsaveStatus = value;
    });
  }

  canDeactivate( _PriceableItemDetailsComponent: PriceableItemDetailsComponent,
                 route: ActivatedRouteSnapshot,
                 currentState: RouterStateSnapshot,
                 nextState: RouterStateSnapshot){
    this._ratesService.changeNextStateURL(nextState.url);
    let rateStatus = this._utilService.isScheduleFormDirty();

    if (this.ratesScheduleUnsaveStatus || rateStatus) {
        /* this._modalService.changeCreatePOPUPHead("TEXT_LEAVE_DISCARD_UNSAVED_EDITS"); */
        /* this._modalService.changeCreatePOPUPBody("TEXT_CANCELING_WITHOUT_SAVING_DISCARDS_EDITS"); */
        return false;
    } else {
      return true;
    }
  }
}
