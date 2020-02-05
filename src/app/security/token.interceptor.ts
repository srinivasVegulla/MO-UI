import {Injectable, Injector} from '@angular/core';
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpEvent, HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse,
    HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { AppInjector } from '../helpers/service.injector';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import { debug } from 'util';
import { empty } from 'rxjs/Observer';
import { UtilityService } from '../helpers/utility.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    authToken: any;
    tokenHeaderString: string;
    refreshTokenInProgress = false;
    tokenDetails: any;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    tokenRefreshedSource = new Subject();
    tokenRefreshed$ = this.tokenRefreshedSource.asObservable();
    constructor(private _injector: Injector) { }

    addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
        return request.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const _authService = this._injector.get(AuthenticationService);
        this.authToken = JSON.parse(sessionStorage.getItem('authorizationData'));
        if (this.authToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.authToken.accessToken}`,
                    'X-Frame-Options': 'SAMEORIGIN',
                    'X-Content-Type-Options': 'nosniff'
                }
            });
        } else {
            request = request.clone({
                setHeaders: {
                    'X-Frame-Options': 'SAMEORIGIN',
                    'X-Content-Type-Options': 'nosniff'
                }
            });
        }
        return next.handle(request).catch((err: any) => {
            // This is added only to mitigate the issue of polyfills issue(IE11) while handling JSON string response. Once Angular updates to 5.x this should be removed.
            const httpError = err.error;
            const _UtilityService = this._injector.get(UtilityService);
            _UtilityService.jsonParsedError.next(httpError);
            // End of polyfills issue
            if (err instanceof HttpErrorResponse) {
                const error  =  typeof(err.error)  ===  'string' ? JSON.parse(err.error) : err.error;
                const message: string = error.message || '';
                if (err.status === 500 && message !== undefined && message.includes('401')) {
                    _authService.collectFailedRequests(request);
                    if (_authService.requestCounter < 1) {
                        _authService.requestCounter = 1;
                        return _authService.refreshToken().flatMap((value) => {
                          this.tokenDetails = JSON.parse(value);
                            sessionStorage.setItem('authorizationData', JSON.stringify({
                                accessToken: this.tokenDetails.access_token,
                                refreshToken: this.tokenDetails.refresh_token,
                                tokenExpireDate: new Date(new Date().getTime() + (1000 * this.tokenDetails.expires_in)),
                            }));
                            _authService.fillAuthData();
                            _authService.requestCounter = 0;
                            this.retryFailedRequests(next, this.tokenDetails.access_token);
                            return next.handle(this.addToken(request, this.tokenDetails.access_token));
                        });
                    } else {
                        _authService.collectFailedRequests(request);
                    }
                } else {
                    return Observable.throw(err);
                }
            }
        });
    }

    retryFailedRequests(next, newToken): Observable<any> {
        const _authService = this._injector.get(AuthenticationService);
        const failedRequests: Array<HttpRequest<any>> = _authService.getFailedRequest();
        if (failedRequests !== null && failedRequests !== undefined && failedRequests.length > 0) {
            for (const request of failedRequests) {
                return next.handle(this.addToken(request, newToken));
            }
            _authService.clearFailedRequests();
        } else {
            return Observable.of();
        }
    }
}
