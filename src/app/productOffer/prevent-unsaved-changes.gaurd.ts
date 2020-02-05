import { Injectable } from '@angular/core';
import { CanDeactivate , Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ProductOfferComponent } from './productOffer.component';
import { contextBarHandlerService } from '../helpers/contextbarHandler.service';
import { utilService } from '../helpers/util.service';
import { ProductService } from './productOffer.service';
import { modalService } from '../helpers/modal-dialog/modal.service';
import { sharedService } from './sharedService';

@Injectable()
export class preventUnsavedChangesGuard implements CanDeactivate<ProductOfferComponent> {
  public isPOFormValid:boolean = false;
  public isPOFormUpdated:boolean = false;

  constructor(public _contextBarHandlerService: contextBarHandlerService,
  			      public _utilService: utilService,
              public _productService: ProductService,
              public _modalService: modalService,
              public _sharedService: sharedService) {

  }
  canDeactivate( _ProductOfferComponent: ProductOfferComponent, route: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot, nextState: RouterStateSnapshot ): Observable<boolean> | Promise<boolean> | boolean {
  	/*this._productService.changeNextStateURL(nextState.url);
    this.isPOFormUpdated = this._utilService.isFormDirty();
    /*this._contextBarHandlerService.observableContextbarSaveButton.subscribe(value => {
     if(value == false) {
        this.isPOFormValid = true;
      }
    });*/
    /*if(this.isPOFormUpdated) {
      this._contextBarHandlerService.saveProperties.subscribe(value => {
        if(!value) {
          this._utilService.changeShowUnsavePOModal(true);
          this._sharedService.propertiesUnsavedChangesHandler.next("updatePONavOut");
          this._modalService.changeCreatePOPUPHead("TEXT_LEAVE_DISCARD_UNSAVED_EDITS");
          this._modalService.changeCreatePOPUPBody("TEXT_CANCELING_WITHOUT_SAVING_DISCARDS_EDITS");
        }
      });
      return false;
    } else {
      return true;
    }
    */
    this.isPOFormUpdated = this._utilService.isFormDirty();
    if (this.isPOFormUpdated) {
      const data = {
        url: nextState.url
      };
      this._utilService.changePreventUnsaveChange(data);
      return false;
    }
    return true;
  }
}
