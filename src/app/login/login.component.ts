import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../security/authentication.service';
import { NgForm } from '@angular/forms';
import { Language, LocaleService} from 'angular-l10n';
import { Location } from '@angular/common';
import { Http, Response } from '@angular/http';
import { UtilityService } from '../helpers/utility.service';
import { CapabilityService } from '../helpers/capabilities.service';
import { utilService } from 'app/helpers/util.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
    model: any = {};
    loading = false;
    returnUrl: string;
    responseData;
    @Language() language: string;
    copyRights;
    copyRightsInfo;
    lang;
    error;
    status;
    cookieName;
    cookie;
    decodedCookie;
    cookieArray;
    IsCapsOn;
    loginSubscriptions:any;
    showErrorMessage: boolean;
    httpErrorDescription: string;
    clientId: any;
    clientSecret: any;
    displayLoader = false;
    confirmDialog: number = 0;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _authenticationService: AuthenticationService,
        private _http: Http,
        private _locale: LocaleService,
        private _utilityService: UtilityService,
        private _capabilityService: CapabilityService,
        private _utilService: utilService
        ) {
        this.loginSubscriptions = this._http.get('/static/default/localeConfig/copyRights.json')
                .map(response => response.json())
                .subscribe(data => {
                      this.copyRights = data;
                      this.cookieName = this._locale.getCurrentLocale() == ("us" || "gb") ? "us" : this._locale.getCurrentLocale();
                      this.copyRightsInfo = this.copyRights[this.cookieName];
                      if (this.cookieName === 'he' || this.cookieName === 'ar-sa') {
                        document.getElementById('mainBody').dir = 'RTL';
                      }
        });
    }

    ngOnInit() {
        this._authenticationService.revokeAuthentication();
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
        if (!this._utilityService.isEmpty(sessionStorage.getItem('ticket'))) {
            sessionStorage.removeItem('ticket');
        }
        const sessionTimedoutSubscription = this._utilService.idleTimedout.subscribe((value) => {
            if (value.showTimedoutDialog) {
                this.confirmDialog = 1;
            }
        });
        this.loginSubscriptions.add(sessionTimedoutSubscription);
    }

    getClientIdSecretDetails(loginForm) {
        this.displayLoader = true;
        this._authenticationService.getClientIdSecret({
            success : (result) => {
               if (result != null) {
                   this.clientId = result['client_id'];
                   this.clientSecret = result['client_secret'];
                }
            },
            failure : (error, code, object) => {
              this.logError(object, loginForm, code);
              this.displayLoader = false;
            },
            onComplete: () => {
                this.checkAuthenticationDetails(loginForm);
            }
          });
    }

    login(loginForm:NgForm) {
        this.getClientIdSecretDetails(loginForm);
    }

    checkAuthenticationDetails(loginForm) {
        this._authenticationService.login({
            data : {
              username : this.model.username,
              password : this.model.password,
              client_id : this.clientId,
              client_secret : this.clientSecret
            },
            success : (result) => {
               if (result[Object.keys(result)[0]] != null) {
                   this.getUserCapabilities(loginForm);
                }
            },
            failure : (error, code, object) => {
              this.logError(object, loginForm, code);
              this.displayLoader = false;
            }
        });
    }

    logError(error, loginForm:NgForm, code)
    {
        this.clearFormFields(loginForm);
        let errorDescription;
        if (typeof error.error === 'string' ) {
            errorDescription = JSON.parse(error.error)['error_description'];
        } else {
            errorDescription = error.error.error_description;
        }
        if (code === 404) {
            this.httpErrorDescription = error.error;
        } else {
            this.httpErrorDescription = errorDescription;
        }
        this.setFocusOnInput();
        this.showErrorMessage = true;
    }

    clearFormFields(loginForm:NgForm)
    {
        this.loading = false;
        loginForm.resetForm();
    }
    loginLinkEnable(loginForm) {
         return !(loginForm.username.invalid && loginForm.password.invalid);
    }

    changeLocale(lang){
       this.copyRightsInfo=this.copyRights[lang];
    }

    //handling keydown event throught the document level
    onKeyPressEvent(e: KeyboardEvent) {
        let kc = e.keyCode?e.keyCode:e.which;
        let sk = e.shiftKey?e.shiftKey:((kc == 16)?true:false);
        if(((kc >= 65 && kc <= 90) && !sk)||((kc >= 97 && kc <= 122) && sk))
        {
             this.IsCapsOn = true;}
        else
        {
            this.IsCapsOn = false;}
    }

    //handle onKeyDownEvent
    onKeyDownEvent(e: KeyboardEvent){
        if(e.key == "CapsLock"){
            this.IsCapsOn = !this.IsCapsOn;
        }
    }
    ngOnDestroy() {
        if (this.loginSubscriptions) {
          this.loginSubscriptions.unsubscribe();
        }
    }

    getUserCapabilities(loginForm) {
        this._capabilityService.fetchUserCapabilities({
            success: (result) => {
                if (result != null) {
                    sessionStorage.setItem('loggedInUserCapabilities', JSON.stringify(result));
                    this._capabilityService.loggedInUserCapabilities = result;
                    this._router.navigateByUrl('/ProductCatalog/Offerings');
                }
            },
            failure: (error, code, object) => {
                this.logError(object, loginForm, code);
                this.httpErrorDescription = error;
            },
            onComplete : () => {
                this.displayLoader = false;
            }
        })
    }

    capabilitiesFailure(error, code, object) {
    }

    onModalDialogCloseCancel(event) {
        this.confirmDialog = 0;
        this.setFocusOnInput();
        this._utilService.sessionIdleTimedOut({ 'autoLoggingOff': false, 'showTimedoutDialog': false });
    }

    ngAfterViewInit() {
        const showTimedout = localStorage.getItem('isAutoLoggedOff');
        if (showTimedout == 'true') {
            setTimeout(() => {
                this.confirmDialog = 1;
            }, 100);
            localStorage.setItem('isAutoLoggedOff', 'false');
        } else {
            this.setFocusOnInput();
        }
    }

    setFocusOnInput() {
        if ((<HTMLInputElement>document.getElementById('autoFocus')) != null) {
            (<HTMLInputElement>document.getElementById('autoFocus')).focus();
        }
    }
}
