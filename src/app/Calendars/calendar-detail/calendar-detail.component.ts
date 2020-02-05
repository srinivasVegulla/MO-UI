import { Component, OnInit, Input, Output, ViewChild, OnDestroy } from '@angular/core';
import { utilService } from '../../helpers/util.service';
import { NgForm, FormsModule, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Language, DefaultLocale, Currency, LocaleService, Translation, TranslationService } from 'angular-l10n';
import { CalendarsService } from '../calendars-list.service';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { UtilityService } from '../../helpers/utility.service';

@Component({
  selector: 'app-calendar-detail',
  templateUrl: './calendar-detail.component.html',
  styleUrls: ['./calendar-detail.component.scss']
})
export class DetailCalendarComponent implements OnInit, OnDestroy {
  editTooltip;
  calenderID;
  propertiesList;
  errorMessage;
  calendarDeleteFromContextbar;
  openInUseDetailsWidget = false;
  nextStateUrl: string;
  isEdited: boolean;
  isIntervalContinue;
  showLoader: boolean;
  showCalPropSkeleton: boolean;
  showCalStdSkeleton: boolean;
  showCalHolSkeleton: boolean;
  widgetType: any;
  deleteErrorMessage;
  isDeleteError= false

  constructor(private _utilService: utilService,
    private _translationService: TranslationService,
    private readonly _calendarsService: CalendarsService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _utilityService: UtilityService,
    private readonly _formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this._utilService.changedynamicSaveBtn('calendar');
    this.editTooltip = this._translationService.translate('TEXT_EDIT');
    this.calenderID = +this._route.snapshot.params['calendarId'];
    this._utilService.updateApplyBodyScroll(true);
    this.intervalEvent();
    this.getCalender();
    this.calendarDeleteFromContextbar = this._utilService.deleteCalendar.subscribe(value => {
      if (value) {
        this.deleteCalendarFromDetail();
      }
    });
    this.nextStateUrl = this._calendarsService.calendarDetailsPath;
    this._router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe(value => {
        this.nextStateUrl = value['url'];
      });
  }

  toggleWidgetSkeleton(widget) {
    switch (widget) {
     case 'calProperties':
       this.showCalPropSkeleton  = true;
       break;
     case 'std':
       this.showCalStdSkeleton  = true;
       break;
     case 'hol':
       this.showCalHolSkeleton = true;
       break;
     default:
       break;
     }
   }

  getCalender() {
    this.isEdited === true ? this.toggleWidgetSkeleton(this.widgetType) : this.showLoader = true;
    this._calendarsService.getCalendarDetails({
      data: {
        calendarId : this.calenderID
      },
      success: (result) => {
        this.propertiesList = result;
        this._utilService.changeDeleteableCalendarData(result);
      },
      failure: (errorMsg: string, code: any) => {
          this.errorMessage = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
      },
      onComplete: () => {
        this.showLoader = false;
        this.showCalPropSkeleton = false;
        this.showCalStdSkeleton = false;
        this.showCalHolSkeleton = false;
        this.isEdited = false;

      }
    });
  }
  deleteCalendarFromDetail() {
    const widgetData = {
        calendarId: this.calenderID
    };
    this._calendarsService.deleteCalendar({
      data: widgetData,
      success: (result) => {
        this._utilService.breadCrumbDisplayNameEditorDelete({ pageTitle: '', actionType: 2 });
        this._router.navigate([this._calendarsService.calendarDetailsPath]);
      },
      failure: (errorMsg: string, code: any) => {
        this.deleteErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'DELETE');
        this.isDeleteError = true;
      }
    });
    this._utilService.changeDeleteCalendar(false);
  }
  clearErrorMessage(){
    this.isDeleteError = false;
    this.deleteErrorMessage = null;
  }
  openInUseDetails() {
    this.openInUseDetailsWidget = true;
  }
  hideInUseCalendarModalDialog(e){
    if (e) {
      this.openInUseDetailsWidget = false;
    }
  }
  ngOnDestroy() {
    if (this.calendarDeleteFromContextbar) {
      this.calendarDeleteFromContextbar.unsubscribe();
    }
    this._utilService.changedynamicSaveBtn('calendar');
  }

  dataEdited(value) {
    this.isEdited = value;
  }

  getWidgetType(value) {
    this.isEdited = true;
    this.widgetType = value;
    this.getCalender();
  }
  
  canDeactivate() {
    if (this.isEdited) {
      const data = {
        url: this.nextStateUrl
      };
      this._utilService.changePreventUnsaveChange(data);
      return false;
    } else {
      return true;
    }
  }

  intervalEvent() {
    this.isIntervalContinue = setInterval(() => {
      this._utilService.changeprodOfferSkeletonLoader(true);
    }, 3000);
  }
 
}
