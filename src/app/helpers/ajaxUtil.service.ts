/**
 Use Case :
 Component :
	this.serviceInstance.serviceMethodName({
      data : {
      	x : 2, y : 3, // Keys will be used for url path variable in service layer
        body : pp, // Object will be passed as request body ( For POST, PUT , DELETE request)
        param : {  // Will be used for filter querys
          xxx : "pp",
          yyy : "tt",
          sort : {
            name : 'desc',
            subject : null,
            slNo : 'asc'
          },
          query : {
            name : 'Keshab',
            lastName : 'Gantayat',
            salaray : '1000|>',
	    company : '%TCS%|like',
	    amount : '1,2|between'
          }
        }
      },
      success : function(result){
        // TO DO
      },
      failure : function(error){
        // TO DO
      }
    });
----------------------------
 Service :

 serviceMethodName(options){
      var data = options.data;
      var defaults = {
        url : this._ajaxUtil.actionUrls().baseUrl+"/"+ data.x + "/"+ data.y, // Url is Mandatory
        type : 'GET', // Optional. By default its a GET request (GET, POST, PUT, DELETE)
        contentType : 'text/html' // Optional. By default 'application/json'. can pass('text/html',...)
      };
      this._ajaxUtil.processRequest(defaults, options);
    }
------------------------------
UrlConfigurationService

Add your URL : urlName : "/svc/getResult",
**/

import { Injectable, OnInit, OnDestroy, Injector } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { utilService } from '../helpers/util.service';
import { UrlConfigurationService } from '../helpers/url.configuration.service';
import { AuthenticationService } from '../security/authentication.service';
import { Router } from '@angular/router';


@Injectable()
export class ajaxUtilService implements OnInit, OnDestroy {
	constructor(private _http: HttpClient, private _urlConfig: UrlConfigurationService, private _util: utilService, private _router: Router, private _injector: Injector) {
		this.initialize();
	}

	isMethod: any;
	syncCall: any[];
	requestURL;
	
	ngOnInit() {

	};

	ngOnDestroy() {
		for (var index in this.syncCall) {
			if (this.syncCall[index])
				this.syncCall[index].unsubscribe();
		}
		this.syncCall = [];
	};

	public actionUrls() {
		return this._urlConfig.myrestUrls();
	}

	public server() {
		return this._urlConfig.server;
	}
	public processRequest(defaults, options) {
		var settings = this._util.extend({}, defaults, options);
		this.ajax(settings);
	}

	private getHeaders(options) {
		let contentType = this.getContentType(options);
		// I included these headers because otherwise browser will request text/html
		contentType = contentType ? contentType : 'application/json';
		// This is added to remove headers in case of CSV upload as it has to set headers on its own
		if (options.data !== undefined && options.data.sendFormData !== undefined && options.data.sendFormData) {
			return new HttpHeaders().delete('Content-Type');
		} else {
			return new HttpHeaders().set('Content-Type', contentType);
		}
	}

	private getContentType(options) {
		if (options.contentType) {
			return options.contentType;
		} else {
			if (!options.type || options.type == 'GET')
				return 'text/html';
			else
				return 'application/json';
		}
	}
	
	  readBlobFileError(error, request) {
		let reader = new FileReader;
		reader.addEventListener("load", () => {
			error.error = JSON.parse(reader.result);
			if (error.error === undefined && error.error === "" || error.error === null) {
				error.error = {'code': '', 'meessage': ''};
			} 
			this.handleErrorResponse(error, request);
		   }, false);
		reader.readAsText(error.error);
	  }

	private ajax(options: any) {
		const _authService = this._injector.get(AuthenticationService);
		let isTokenExpired;
		let defaults = {
			encodeuri: true,
			data: {},
			type: 'GET',
			header: this.getHeaders(options),
			stringifyRequest: true
		};

		var request = this._util.extend({}, defaults, options);
		if (this.isMethod(request.onStart)) {
			request.onStart(true);
		}
		if (sessionStorage.getItem('authorizationData') !== null) {
			const currentDateTime = new Date().toISOString();
			const authData = JSON.parse(sessionStorage.getItem('authorizationData'));
			const tokenExpireDate = authData.tokenExpireDate;
			isTokenExpired = currentDateTime > tokenExpireDate ? true : false;
		} else {
			isTokenExpired = false;
		}
		if (!isTokenExpired) {
			this.httpCall(request);
		} else {
			_authService.collectFailedRequests(request);
			if (_authService.requestCounter < 1) {
				_authService.requestCounter = 1;
				_authService.refreshToken().subscribe(value => {
					_authService.requestCounter = 0;
					_authService.setAuthData(value);
					this.retryFailedRequests();
				}, error => {
					this._router.navigateByUrl('/login');
				});
			}
		}
	}

	retryFailedRequests() {
		const _authService = this._injector.get(AuthenticationService);
		const failedRequests = _authService.getFailedRequest();
		if (failedRequests !== null && failedRequests !== undefined && failedRequests.length > 0) {
			for (const request of failedRequests) {
				this.httpCall(request);
			}
			_authService.clearFailedRequests();
		}
	}

	httpCall(request) {
		let httpCall = this.handleRequest(request)
			.subscribe(
				result => {
					if (this.isMethod(request.success))
						request.success(result);
					if (this.isMethod(request.onComplete))
						request.onComplete(true);
				}, (err: Response) => {
					if (err['error'] !== undefined) {
						if (err['error']['size'] !== undefined && err['error']['size'] > 0) {
							this.readBlobFileError(err, request);
						} else {
							this.handleErrorResponse(err, request);
						}
					}
				});
		if (!this.syncCall)
			this.syncCall = [];
		this.syncCall.push(httpCall);
	}

	handleErrorResponse (err, request) {
		let	errorObj = this.processError(err);
		if (this.isMethod(request.failure)) {
			request.failure(errorObj.message, errorObj.code, errorObj.error);
		}
		if (this.isMethod(request.error)) {
			request.error(errorObj.message, errorObj.code, errorObj.error);
		}
		if (this.isMethod(request.onComplete))
			request.onComplete(true);
	}

	private buildParams(multiConditions, param, requestParam, cond) {
		let filters = [];
		let queryVal = param[requestParam][cond];
		if (typeof (queryVal) !== 'object') {
			filters.push(queryVal);
		} else {
			filters = queryVal;
		}
		filters.forEach((element, index) => {
			multiConditions += (index > 0 ? ' and ' : '') + cond;
			const filterValues = (element + '').split("|");
			if (filterValues.length > 1) {
				let filterType = filterValues[filterValues.length - 1];
				let eachFilterValue = "";
				for (let i = 0; i < filterValues.length - 1; i++) {
					eachFilterValue += filterValues[i];
				}
				if (filterType == 'like') {
					multiConditions += `=like=${eachFilterValue}`;
			        } else if (filterType == 'in' || filterType == 'out') {
					multiConditions += `=${filterType}=${eachFilterValue}`;
				} else if (filterType == 'between') {
					multiConditions += `=between= ${eachFilterValue} `;
				} else {
					multiConditions += filterValues[filterValues.length - 1] + eachFilterValue;
				}
			} else {
				multiConditions += '==' + param[requestParam][cond];
			}
		});
		return multiConditions;
	}

	getCurrentLocale() {
		if (localStorage !== undefined && localStorage.length > 0) {
			return localStorage.getItem('currentLang');
		} else {
			return 'us';
		}
	}

	private handleRequest(request): Observable<any> {
		const dFilterList = ['displayNameId', 'descriptionId', 'unitDisplayNameId', 'categoryId', 'values', 'itemInstanceDescriptionId', 'nameId','itemInstanceDisplayNameId','offerDisplayNameId'];
		let out$;
		let requestBody = {};
		if (request.data.body)
			requestBody = request.data.stringifyRequest ? JSON.stringify(request.data.body) : request.data.body;
		// Request body of CSV upload should be Formdata type
		if (request.data !== undefined && request.data.body && request.data.sendFormData) {
			const formData: FormData = new FormData();
			formData.append('file', request.data.body, request.data.body.name);
			requestBody = formData;
		}
		let param = request.data.param;
		let sort = request.data.sort;
		let queryParam = "";
		let dFilterParam = "";
		let dSortParam = "";
		if (param) {
			if (typeof param == 'object') {
				for (let requestParam in param) {
					if (queryParam)
						queryParam += "&";
					queryParam += requestParam + "=";
					if (requestParam == "sort") {
						if (typeof param[requestParam] == 'object') {
							const filterSortObj = param.sort;
							for (let cond in param[requestParam]) {
								if (dFilterList.indexOf(cond) === -1) {
									let multiSorts = "";
									if (multiSorts)
										multiSorts += ",";
									multiSorts += cond
									if (param[requestParam][cond]) {
										multiSorts += "|" + param[requestParam][cond];
										let requestParamKeys = Object.keys(param[requestParam]);
										if(requestParamKeys.length > 1){
											queryParam += multiSorts + ",";
											if(requestParamKeys[(requestParamKeys.length)-1] === cond)
												queryParam = queryParam.substr(0, queryParam.length-1);
										} else {
											queryParam += multiSorts;
										}
									}
								} else {
									dSortParam += `&dSort=${cond}|${filterSortObj[cond]}`;
								}
							}
							if (dSortParam.includes('dSort') && queryParam['dLang'] === undefined && !(dSortParam.includes('&dLang')||dFilterParam.includes('&dLang'))) {
								dSortParam += `&dLang=${this.getCurrentLocale()}`
							}
						}
						if (dSortParam !== '') {
							queryParam += dSortParam;
						}
					} else if (requestParam == "query") {
						let multiConditions = "";
						if (typeof param[requestParam] == 'object') {
							const filterQueryObj = param.query;
							for (let cond in param[requestParam]) {
								if (dFilterList.indexOf(cond) === -1) {
									if (multiConditions) {
										multiConditions += " and ";
									}
									if (cond === 'query') {
										for (const dependConditions in param[requestParam][cond]) {
											let count = 0;
											multiConditions += (parseInt(dependConditions) > 0 ? ' and ' : '') + ' (';
											for (const dependCond in param[requestParam][cond][dependConditions]) {
												if (count > 0) {
													multiConditions += " and ";
												}
												multiConditions = this.buildParams(multiConditions, param[requestParam][cond], dependConditions, dependCond);
												count++;
											}
											multiConditions += ') ';
										}
									} else {
										multiConditions = this.buildParams(multiConditions, param, requestParam, cond);
									}
								} else {
									dFilterParam += `&dFilter=${cond}=%${filterQueryObj[cond]}%`;
								}
							}
							if (dFilterParam.includes('dFilter') && queryParam['dLang'] === undefined && !(dSortParam.includes('&dLang') || dFilterParam.includes('&dLang'))){
								dFilterParam += `&dLang=${this.getCurrentLocale()}`
							}
							queryParam += multiConditions;
						}
						if (dFilterParam !== '') {
							queryParam += dFilterParam;
						}
					} else {
						queryParam += param[requestParam];
					}
				}
			}
		}
		let requestOption: any;
		requestOption = { headers: request.header };
		if (request.responseType) {
			requestOption['responseType'] = request.responseType;
		}

		// let options = new RequestOptions(requestOption);
		if (queryParam) {
			request.url = request.url + "?" + (request.encodeuri ? this.encodeParams(queryParam) : queryParam);
		}
		this.setLanguageCodeToURL(request);
		let options = requestOption;
		if (request.type == 'GET') {
			out$ = this._http.get(request.url)
				.map((response) => response)
				.catch(this.handleError);
		} else if (request.type === 'POST') {
			out$ = this._http.post(request.url, requestBody, options)
			.map((response) => response)
				.catch(this.handleError);
		} else if (request.type === 'PUT') {
			out$ = this._http.put(request.url, requestBody, options)
				.map((response) => response)
				.catch(this.handleError);
		} else if (request.type === 'DELETE') {
			out$ = this._http.delete(request.url, requestBody)
				.map((response) => response)
				.catch(this.handleError);
		}
		return out$;
	}

	setLanguageCodeToURL(request) {
		if (request.url !== undefined) {
			if (!request.url.includes('static')) {
				const selectedLocale = localStorage.getItem("currentLang");
				request.url = (request.url.includes('?')) ? request.url + `&loggedInLangCode=${selectedLocale}` : request.url + `?loggedInLangCode=${selectedLocale}`;
			}
		}
	}

	getResponse(response) {
		try {
			if (response != null && response != undefined && response != "")
				return response.json();
		} catch (e) {
		}
		return response;
	}

	initialize() {
		this.isMethod = function (t) {
			return typeof t == 'function';
		}
	}

	private processError(error) {
		let errMsg;
		let errErr;
		let errorCode: any;
		try {
			if (error instanceof Response) {
				const body = error.json();
				if (body) {
					errMsg = body.message;
					errorCode = body.code;
				}
			} else {
				errErr = typeof error.error === 'string' ? JSON.parse(error.error) : error.error;
				errMsg = errErr.message;
				errorCode = errErr.code;
			}
		} catch (e) { }
		return {
			message: errMsg,
			code: errorCode,
			error: error
		}
	}
	private handleError(error: Response | any) {
		return Observable.throw(error);
	}
	encodeParams(queryParams) {
		return encodeURI(queryParams).replace('@', '%40').replace(':', '%3A').replace('$', '%24').replace(',', '%2C')
			.replace(';', '%3B').replace('+', '%2B').replace('?', '%3F').replace('/', '%2F').replace('~', '%7E')
			.replace('!', '%21').replace('#', '%23').replace('*', '%2A').replace('(', '%28').replace(')', '%29');
	}
}