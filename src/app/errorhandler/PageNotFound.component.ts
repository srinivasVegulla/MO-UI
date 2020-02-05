import { Component } from '@angular/core';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../security/authentication.service';
import { utilService } from '../helpers/util.service';
import { breadcrumbsConfig } from '../../assets/breadcrumbsConfig';

@Component({
  selector: 'fournotfour',
  templateUrl: './PageNotFound.html',
})

export class PageNotFoundComponent {

  checkAuth: boolean;
  currentUrl = '';
  childData;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _AuthenticationService: AuthenticationService,
    private _utilService: utilService, ) {
    const authData = JSON.parse(sessionStorage.getItem('authorizationData'));
    this.checkAuth = authData;
    this.currentUrl = this.router.url;
    let navItems = breadcrumbsConfig.defaultData[0]['children'];
    this.childData = navItems.filter((item) => { return item.path !== false;});
  }

  back() {
    history.go(-2);
  }

  updateBreadcrumbsList(obj) {
    this._utilService.errorRedirection(obj);
  }
}
