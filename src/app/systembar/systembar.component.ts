import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router} from '@angular/router';
import { AuthenticationService } from '../security/authentication.service';
import { utilService  } from '../helpers/util.service';
import { UtilityService } from "../helpers/utility.service";
import { Location } from '@angular/common';
import { LocaleService } from 'angular-l10n';
//import { window } from 'rxjs/operators/window';

@Component({
  selector: 'ecb-systemBar',
  templateUrl: './systembar.component.html',
  styleUrls:  ['./systembar.component.scss','../app.component.scss']
})
export class SystembarComponent implements OnInit, OnDestroy {

  userName;
  toggleAccoutmenu:number=0;
  pageTitle;
  IsToShowTreeDiv;
  systemBarSubscriptions:any;
  toggleCount= 0;
  topListMenu;
  menuType;
  currentLocale;
  @Inject('Window') private window: Window;
  logOutSubs;

  constructor(
    //private _location :Location,
        private router: Router,
        private authenticationService: AuthenticationService,
        private utilService: utilService,
        private _locale: LocaleService,
        private _utilityService: UtilityService
        ) {
      this.userName = sessionStorage.getItem('userName') == null? this.userName : sessionStorage.getItem('userName');
      this.topListMenu = this.utilService.showHideTopMenuList.subscribe(val => {
        this.menuType = val;
      });
  }

  ngOnInit() {
    this.currentLocale = this._locale.getCurrentLocale();
    this.utilService.observablePageTitle.subscribe(pageTitle => {
      this.pageTitle = pageTitle;
    });

    this.pageTitle = JSON.parse(localStorage.getItem('displayInfo')) !== (null && undefined) ?
      JSON.parse(localStorage.getItem('displayInfo')).currentPage : 'TEXT_SUBSCRIBABLE_ITEMS';

    this.utilService.resetToggle.subscribe(value => {
      this.toggleCount = value;
      document.getElementsByClassName("ecb-mobiledefaultMenuDiv").item(0).classList.remove("ecb-showDialog");
      document.getElementsByClassName("ecb-mobileTreeStructureDiv").item(0).classList.remove("ecb-showDialog");
    });

    // autologout after 20 minutes idle time.
    this.logOutSubs = this.utilService.autoLogout.subscribe(v => {
      if (v) {
        this.logout();
      }
    });
  };

  showbreadcrumbNavbar() {
    this.IsToShowTreeDiv = (localStorage.getItem('mobileMenuType') !== (null && undefined)) ?
      JSON.parse(localStorage.getItem('mobileMenuType')).IsMobileDefaultMenuShow : false;
    if (this.IsToShowTreeDiv) {
        if (this.toggleCount === 0) {
          document.getElementsByClassName("ecb-mobileTreeStructureDiv").item(0).className += " ecb-showDialog";
          this.toggleCount += 1;
        } else {
          document.getElementsByClassName("ecb-mobileTreeStructureDiv").item(0).classList.remove("ecb-showDialog");
          this.toggleCount = 0;
        }
    } else {
        if(this.toggleCount === 0) {
          document.getElementsByClassName("ecb-mobiledefaultMenuDiv").item(0).className += " ecb-showDialog";
          this.toggleCount += 1;
        } else {
          document.getElementsByClassName("ecb-mobiledefaultMenuDiv").item(0).classList.remove("ecb-showDialog");
          this.toggleCount = 0;
        }
    }
  }

  /*show hide user account tooltip*/
  toggleuserAccountDropdown(): void {
    if (this.toggleAccoutmenu === 0) {
      document.getElementsByClassName("ecb-userAccountDropdown").item(0).className += " ecb-showDialog";
      this.toggleAccoutmenu = 1;
    } else {
      document.getElementsByClassName("ecb-userAccountDropdown").item(0).classList.remove("ecb-showDialog");
      this.toggleAccoutmenu = 0;
    }
  }

  logout() {
    this.authenticationService.revokeAuthentication();
    localStorage.clear();
    this.removeLocalStoreItems();
    this.utilService.callautoLogout(false);
    this.router.navigateByUrl('/login');
  }

  removeLocalStoreItems() {
    Object.keys(localStorage).forEach(function (key) {
      localStorage.removeItem(key);
    });
  }

  calculateBreadCrumbEllipsisWidth() {
    return { maxWidth: 'calc(100vw - 160px)'}
  }

  isTranslateText(value: any) {
    return this._utilityService.isStaticString(value);
  }

  ngOnDestroy() {
    if (this.systemBarSubscriptions) {
      this.systemBarSubscriptions.unsubscribe();
    }
    if (this.topListMenu) {
      this.topListMenu.unsubscribe();
    }

    if (this.logOutSubs) {
      this.logOutSubs.unsubscribe();
    }
  }
}
