import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Http, Response} from '@angular/http';
import { LocaleService, Language } from 'angular-l10n';
import { UtilityService } from '../helpers/utility.service';

@Component({
  selector:'ecb-locale-selector',
  templateUrl: 'locale.selector.html',
  styleUrls: ['../login/login.component.scss']
})

export class LocaleSelector implements OnInit, OnDestroy {
  localeFlagData;
  lables;
  lang : string;
  copyRights;
  localeSelectorSubscriptions:any;
  @Language() language: string;
  @Output() langCode : EventEmitter<string> = new EventEmitter<string>();

  constructor(
      private _http : Http,
      private _locale: LocaleService,
      private _utilityService: UtilityService){
      this.localeSelectorSubscriptions = this._http.get('/static/default/localeConfig/localeSelector.json')
            .map(response => response.json())
            .subscribe(data => {
                    this.localeFlagData = data;
                    this.lables = Object.keys(data);
                    },(err:Response) => this.handleError(err));
  }

  ngOnInit() {
    if (this.language) {
      localStorage.setItem('currentLang', this.language);
    }
  }

  changeLocale(lang){
    this.langCode.emit(lang);
    this._utilityService.changeLocale(lang);
  }

  isSelected(lang:string){
    return lang == this.language;
  }

  private handleError(error: Response) {
    return error;
  }
  ngOnDestroy() {
    if (this.localeSelectorSubscriptions) {
      this.localeSelectorSubscriptions.unsubscribe();
    }
  }
}
