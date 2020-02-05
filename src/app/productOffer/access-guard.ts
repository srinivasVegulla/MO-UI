import { Injectable } from '@angular/core';
import { CanActivate , Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { priceableItemDetailsService } from '../priceableItemDetails/priceableItemDetails.service';
import { utilService } from '../helpers/util.service';
import { Language, DefaultLocale, Currency, LocaleService } from 'angular-l10n';
import { Component, OnInit } from '@angular/core';

@Injectable()
export class AccessGuard implements CanActivate {
  pathVariables: any = [];
  productOfferId: any;
  itemInstanceId: any;

  constructor(public _router : Router,
              private _priceableItmeDetailsService: priceableItemDetailsService,
              private locale:LocaleService,
              private _utilService: utilService,) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) {
    this.pathVariables = state.url.split("/");
    this.productOfferId = this.pathVariables[3];
    this.itemInstanceId = this.pathVariables[4];

  if (this.pathVariables[2]=='PriceableItem'){
    if (isNaN(this.productOfferId) || isNaN(this.itemInstanceId)) {
      this._router.navigateByUrl('/404');
      return false;
    }
  } else {
    if (isNaN(this.productOfferId)) {
      this._router.navigateByUrl('/404');
      return false;
    }
    else {
      return true;
    }
  }
  return true;
}
}
