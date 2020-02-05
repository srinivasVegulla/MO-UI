import { Injectable } from '@angular/core';
import { Http, Headers, Response,RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ajaxUtilService } from '../helpers/ajaxUtil.service';
import 'rxjs/add/operator/map';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthenticationService {
  _authentication: any;
  cachedRequests: Array<HttpRequest<any>> = [];
  public isRefreshTokenCalled = new BehaviorSubject<boolean>(false);
  public requestCounter = 0;
  tokenDetails: any;
  clientId: any;
  clientSecret: any;

  constructor(private http: HttpClient,
    private _ajaxUtil: ajaxUtilService
    ) {}

    createSearchParams(username: string, password: string, clientId, clientSecret) {
      return `username=${username}&password=${password}&response_type=${'token'}&client_id=${clientId}&scope=read write&grant_type=${'password'}&client_secret=${clientSecret}`;
    }


    login(options){
      const data = options.data;
      const body = this.createSearchParams(data.username, data.password, data.client_id, data.client_secret);
      this.clientId = data.client_id;
      this.clientSecret = data.client_secret;
      const defaults = {
        url : '/uaa/oauth/token',
        type : 'POST',
        contentType : 'application/x-www-form-urlencoded',
        stringifyRequest : false,
        data : {
          body : body
        },
        success : (result) => {
          this.processToken(options, result);
        },
        failure : (error, code, object) => {
          options.failure(error, code, object);
        }
      };
      this._ajaxUtil.processRequest(defaults, {});
    }

    processToken(options, user) {
      const data = options.data;
      this.setAuthData(user);
      this.fillAuthData();
      options.success(user);
      sessionStorage.setItem('userName', data.username);
    }

    public setAuthData(user) {
      sessionStorage.setItem('authorizationData', JSON.stringify({
        accessToken: user.access_token,
        refreshToken: user.refresh_token,
        tokenExpireDate: new Date(new Date().getTime() + (1000 * user.expires_in))
      }));
    }

    public handleError(error: Response) {
        return Observable.throw(error || 'Server error');
    }

    revokeAuthentication() {
        sessionStorage.clear();
    }

    fillAuthData() {
      const authData = JSON.parse(sessionStorage.getItem('authorizationData'));
      if (authData) {
        this._authentication = {
          isAuthenticated: true,
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          userName: authData.userName,
          tokenExpireDate: authData.tokenExpireDate,
          userInfo: authData.userInfo,
          namespace: authData.namespace,
        };
        return this._authentication;
      }
    }

    getAuthentication() {
      return this._authentication;
    }

    isAuthenticated() {
      if (this._authentication !== undefined && this._authentication !== null) {
        return this._authentication.isAuthenticated;
      } else {
        return false;
      }
    }

    getAccessToken() {
      if (this._authentication) {
        return this._authentication.accessToken;
      } else {
        return '';
      }
    }

  refreshToken(): Observable<any> {
    const refreshingToken = this.getRefreshToken();
    const ticket = sessionStorage.getItem('ticket');
    if (refreshingToken !== undefined && refreshingToken !== null && refreshingToken !== '') {
      const body = `client_id=${this.clientId}&client_secret=${this.clientSecret}
      &grant_type=${'refresh_token'}&refresh_token=${refreshingToken}`;
      const refreshHeaders = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      const options = { headers: refreshHeaders };
      return this.http.post('/uaa/oauth/token', body, options);
    }else if (ticket !== undefined && ticket !== null && ticket !== '') {
      const url = this._ajaxUtil.actionUrls().ticketLogin + '?ticket=' + ticket + '&tokenExpired=true';
      return this.http.get(url, {});
    } else {
      this.revokeAuthentication();
      return Observable.of('');
    }
  }

  getRefreshToken() {
    if (this._authentication) {
      return this._authentication.refreshToken;
    } else {
      return '';
    }
  }

  clearFailedRequests() {
    this.cachedRequests.length = 0;
  }

  collectFailedRequests(req) {
    this.cachedRequests.push(req);
  }

  getFailedRequest() {
    return this.cachedRequests;
  }

  changeIsRefreshTokenCalled(value: boolean) {
    this.isRefreshTokenCalled.next(value);
  }

  getMetranetTicketDetail(options) {
    const data = options.data;
    const defaults = {
      url : this._ajaxUtil.actionUrls().ticketLogin
    };
    this._ajaxUtil.processRequest(defaults, options);
  }

  getClientIdSecret(options) {
    const defaults = {
      url : '/ext/OauthClientInfo/legacy',
      type : 'GET'
    };
    this._ajaxUtil.processRequest(defaults, options);
  }
}