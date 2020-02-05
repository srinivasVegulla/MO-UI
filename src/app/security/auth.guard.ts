import { Injectable } from '@angular/core';
import { CanActivate , Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { AuthenticationService } from '../security/authentication.service';
import { utilService } from '../helpers/util.service';
import { UtilityService } from '../helpers/utility.service';
import { ScreenMapConfig } from '../../assets/screenMapConfig';
import { CapabilityService } from '../helpers/capabilities.service';

@Injectable()
export class AuthGuard implements CanActivate {
  ticket: string;

  constructor(public router : Router,
    private _authenticationService: AuthenticationService,
    private _utilService: utilService,
    private _utilityService: UtilityService,
    private _capabilityService: CapabilityService) {
  }
  canActivate(route: ActivatedRouteSnapshot) {
      this.ticket = route.queryParams['ticket'];
      if (this.ticket !== undefined) {
        this.ticket = this._utilityService.encode(this.ticket);
        this._utilService.checkTicketLoginObser(true);
        this._authenticationService.getMetranetTicketDetail({
          encodeuri: false,
          data : {
            param : {
              ticket : this.ticket
            }
          },
          success : (result) => {
            this.processToken(result, route.queryParams);
            return true;
          },
          failure : (error) => {
            this._utilService.checkTicketLoginObser(false);
            this.router.navigateByUrl('login');
          }
        });
      }else {
        const hasToken = this.hasAuthToken();
        if (!hasToken) {
          this.router.navigateByUrl('login');
        }
        return hasToken;
      }
  }

  hasAuthToken() {
    let authToken = sessionStorage.getItem('authorizationData');
    if (authToken === null || authToken === undefined) {
      return false;
    }else {
      authToken = JSON.parse(authToken);
      if (authToken['accessToken'] === null || authToken['accessToken'] === undefined) {
        return false;
      }else {
        return true;
      }
    }
  }

  private processToken(tokenData, params) {
    let lang;
    switch (params['lang']) {
      case 'en-us' :
        lang = 'us';
        break;
      case 'en-gb' :
        lang = 'gb';
        break;
      case 'fr-fr' :
        lang = 'fr';
        break;
      case 'de-de' :
        lang = 'de';
        break;
      case 'es-es' :
        lang = 'es';
        break;
      case 'ja-jp' :
        lang = 'jp';
        break;
      case 'it-it' :
        lang = 'it';
        break;
      case 'es-mx' :
        lang = 'es-MX';
        break;
      default:
        lang = params['lang'];
        break;
    }
    const screenMap = ScreenMapConfig.screens;
    let screenId = params['screen'];
    screenId = (this._utilityService.isObject(screen) && screenMap[screenId] !== undefined) ? screenId : 0;
    const userName = params['username'];
    this._authenticationService.processToken({
      data: {
        username: userName
      },
      success : (result) => {
        this.getUserCapabilities(screenMap, screenId);
        this._utilService.checkTicketLoginObser(false);
        if (result[Object.keys(result)[0]] != null) {
            sessionStorage.setItem('userName', userName);
            if (this.ticket !== undefined) {
              sessionStorage.setItem('ticket', this.ticket);
            }
            this._utilService.checkSuccessTicketLoginObser(true);
            if (lang !== undefined) {
              this._utilityService.changeLocale(lang);
            }
        }else {
          this.router.navigateByUrl('login');
        }
      },
      failure: (error) => {
        this._utilService.checkTicketLoginObser(false);
        this.router.navigateByUrl('login');
      }
    }, tokenData);
  }

  getUserCapabilities(screenMap, screenId) {
    this._capabilityService.fetchUserCapabilities({
        success: (result) => {
            if (result != null) {
                sessionStorage.setItem('loggedInUserCapabilities', JSON.stringify(result));
                this._capabilityService.loggedInUserCapabilities = result;
                this.router.navigateByUrl(screenMap[screenId].path);
            }
        },
        failure: (error) => {
          this._utilService.checkTicketLoginObser(false);
          this.router.navigateByUrl('login');
        }
    });
  }
}
