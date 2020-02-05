import { Component, OnInit, Input, EventEmitter, Output, ViewChild, HostListener, ElementRef} from '@angular/core';
import { utilService } from '../../helpers/util.service';
import { NgForm, FormsModule, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Language, DefaultLocale, Currency, LocaleService, Translation, TranslationService } from 'angular-l10n';
import { CalendarsService } from '../calendars-list.service';
import { ActivatedRoute, Router, NavigationStart, CanDeactivate, UrlSegment } from '@angular/router';
import { UtilityService } from '../../helpers/utility.service';

@Component({
  selector: 'ecb-calendar-properties',
  templateUrl: './calendar-properties.component.html',
  styleUrls: ['./calendar-properties.component.scss']
})
export class CreateCalendarComponent implements  OnInit {

@ViewChild('createcalendar') createcalendarAsidePanel: any;
calendarProperties: FormGroup;
defaultName;
editTooltip;
confirmDialog;
showCover: Boolean = false;
propertiesForm: any;
createCalendar: boolean = false;
isCopyCalendar: boolean = false;
loadCalendarUrl: string = '';
createCalendarPropertiesForm: any;
isSaveDisabled: boolean;
calendarPropertiesFormValue: any;
isSaveClicked = false;
httpErrorMessage: any;
showErrorMessage: Boolean = false;
copyCalendarProperties: any;
validateProcessing: boolean = false;
isNameValidated: boolean = false;
nameExist: Boolean = false;
calendarInfo: any[];
modalDialogClose;
@Input() set showPropertiesPanel(value) {
 if (value) {
  this.createView = false;
  this.createcalendarAsidePanel.show();
  this.showCover = true;
 }
}
@Output() hideCreateCalendarPanel = new EventEmitter();
@Output() isGetWidgetType = new EventEmitter();
@Output() isCalendarFormDirty = new EventEmitter();
@Input() set copyCalendardata(calendarProperties) {
  if (this._utilityService.isObject(calendarProperties)) {
    this.copyCalendarProperties = calendarProperties;
  }
}
propertyName;
nextStateUrl ;
propertyDescription;
copyOfPropertyName;
viewPropertiesList: any;
POLoadError: Boolean = false;
calenderLoadMessage: any;
createView: Boolean = true;
updateProperties: boolean;
isDisabled: boolean;
propDescription: string;
calPropertiesAsidePanel: any;
@Language() lang: string;
@Input() set copyCalendar(value){
  if (value) {
    this.isSaveDisabled = false;
    this.createView = false;
    this.createcalendarAsidePanel.show();
    this.isCopyCalendar = true;
    this.showCover = true;
    setTimeout(() => {
      document.getElementById('initFocus').focus();
    }, 300);
    this.processProperties(this.copyCalendarProperties);
  } else {
    this.isCopyCalendar = false;
    this.generateCalendar();
  }
}
@Input() set errorMessage(msg) {
  if (msg) {
    this.POLoadError = true;
    this.calenderLoadMessage = msg;
  }
}
@Input() set properties(calendarPropertiesList) {
  if (calendarPropertiesList) {
    for (const key in calendarPropertiesList) {
      if (key) {
        this.viewPropertiesList[key] = calendarPropertiesList[key];
      }
    }
    this.createView = true;
  }
}
@ViewChild('textArea', { read: ElementRef }) textArea: ElementRef;
@ViewChild('textAreaEdit', { read: ElementRef }) textAreaEdit: ElementRef;
typeOfAction: any;

  constructor(private _utilService: utilService,
              private _translationService: TranslationService,
              private _CalendarsService: CalendarsService,
              private _Router: Router,
              private _utilityService: UtilityService,
              private _formBuilder: FormBuilder ) {
                this.confirmDialog = 0;
                this.viewPropertiesList = {};
               }

  ngOnInit() {
    this.editTooltip = this._translationService.translate('TEXT_EDIT');
    this.generateCalendar();
    this.onPropertiesFormChanges();
    this.isSaveDisabled = true;
    this.updateProperties = false;
    this.isDisabled = true;
    this.propDescription = '';
    if (this.isCopyCalendar){
      this.isSaveDisabled = false;
    }
  }
  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      if (this.confirmDialog === 0) {
        if (this._utilityService.isObject(this.createcalendarAsidePanel)) {
          if (this.createcalendarAsidePanel.visibleStatus) {
            this.cancelCoverHandler();
          } else if (this._utilityService.isObject(this.calPropertiesAsidePanel)) {
            if (this.calPropertiesAsidePanel.visibleStatus) {
              this.cancelPropCoverHandler();
            }
          } else {
            this.confirmDialog = 0;
          }
        }
      } else {
        this.confirmDialog = 0;
      }
    }
  }

  createCalendarForm() {
    this.calendarProperties = this._formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
    });
  }

  generateCalendar() {
    if (this.isCopyCalendar === false ) {
      this.createCalendar =  true;
      this.defaultName = this._translationService.translate('TEXT_DEFAULT_CALENDER_NAME');
      this.createCalendarForm();
     }
  }

  cancelCoverHandler() {
    if (this.calendarProperties.dirty || this.isCopyCalendar) {
      this.confirmDialog = 1;
    } else {
      this.closeEditPanel();
    }
  }

  onModalDialogCloseCancel(event) {
    this.confirmDialog = 0;
    if (event.index === -1 && this.calendarProperties.dirty) {
      this.modalDialogClose = !this.modalDialogClose;
      if (this.modalDialogClose) {
        this.confirmDialog = 1;
      }
    }
     if (event.index === 1) {
      this.closeEditPanel();
   }
   if (event.index === 0 || event.index === 2) {
    this.modalDialogClose = !this.modalDialogClose;
  }
  }
  closeEditPanel() {
    if (this.createcalendarAsidePanel) {
      this.createcalendarAsidePanel.hide();
    }
    if (this.calPropertiesAsidePanel) {
      this.calPropertiesAsidePanel.hide();
    }
    this.showCover = false;
    this.isSaveDisabled = true;
    this.isCopyCalendar = false;
    this._utilService.checkNgxSlideModal(false);
    this.hideCreateCalendarPanel.emit(true);
    this.modalDialogClose = false;
    this.isCalendarFormDirty.emit(false);
    this.updateProperties = false;
    this.isDisabled = true;
    this.propDescription = '';
    this.calPropertiesAsidePanel = null;
  }
  autoGrow() {
    const textArea = this.textArea.nativeElement;
    this._utilityService.adjustHeightOnScroll(textArea);
   }
  onEnterSaveCalendarProperties(event) {
    if (this.calendarProperties.valid) {
      if (event.keyCode === 13 && !event.shiftKey) {
        this.saveCalendar();
      }
    }
  }

  removeSpace(){
    let checkNameValue = this.calendarProperties.controls.name;
    this._utilityService.removeTextSpace(checkNameValue, null); 
  }
  
  disableSpace(evt){
    this._utilityService.disableSpaceBar(evt); 
  }

  saveCalendar() {
    this.isSaveDisabled = true;
    this.isSaveClicked = true;
    this.showErrorMessage = false;
    if (!this.isNameValidated) {
      this.checkNameAvailability();
    }  else {
    if (!this.validateProcessing && !this.nameExist) {
    setTimeout(() => {
    const calendarPropertiesObject = this.calendarProperties['_value'];
    calendarPropertiesObject.name = calendarPropertiesObject.name.trim();
    this.propertiesForm = calendarPropertiesObject;
    if (this.isCopyCalendar === true ) {
      this.saveCopyCalendar();
    } else if (this.isCopyCalendar === false) {
      this.createNewCalendar();
     }
    }, 100 );
    }
     }
  }
  createNewCalendar() {
    this._CalendarsService.createCalendars({
      data: {
        body: this.propertiesForm
      },
      success: (result) => {
        this.successHandler(result);
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this.errorHandler(errorMsg, code, 'create');
      }
    });
  }
  saveCopyCalendar() {
    this._CalendarsService.saveCopyCalendar({
      data: {
        body: this.propertiesForm,
        calendarID: this.copyCalendarProperties.calendarId
      },
      success: (result) => {
        this.successHandler(result);
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this.errorHandler(errorMsg, code, 'copy');
      }
    });
  }

  successHandler(result) {
    this.isCalendarFormDirty.emit(false);
    const response = result;
    const newcalendarId = response.calendarId;
    if (this.createCalendar || this.isCopyCalendar) {
      this.loadCalendarUrl = this._CalendarsService.calendarDetailsPath + newcalendarId;
    }
    this._utilService.addNewRecord({
      obj: response,
      path: this.loadCalendarUrl,
      Level: 'Grid'
    });
    this._Router.navigateByUrl(this.loadCalendarUrl);
    this.isSaveClicked = false;
    this.isSaveDisabled = false;
    this.createcalendarAsidePanel.hide();
    this.modalDialogClose = false;
  }
  errorHandler(errorMsg: string, code: any, type) {
    if (type === 'create') {
      this.httpErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'CREATE');
    } else if (type === 'copy') {
      this.httpErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'COPY');
    } else if (type === 'load'){
      this.httpErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
    } else {
      this.httpErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'EDIT');
    }
    this.isCalendarFormDirty.emit(false);
    this.showErrorMessage = true;
    
    this.isSaveClicked = false;
    this.isSaveDisabled = false;
  }
  setSaveDisabled() {
    return this.isSaveDisabled || !this.calendarProperties.valid || !this.calendarProperties.controls.name.value;
  }
  onPropertiesFormChanges() {
    this.calendarPropertiesFormValue = this.calendarProperties.valueChanges.subscribe(value => {
      if (this.calendarProperties.dirty) {
        this.isCalendarFormDirty.emit(true);
        if (!this.nameExist) {
        this.isSaveDisabled = false;
        this.setSaveDisabled();
        }
      }
    });
    this.setSaveDisabled();
  }
  processProperties(copyCalendarProperties) {
    if (copyCalendarProperties !== undefined && copyCalendarProperties !== null && Object.keys(copyCalendarProperties).length > 0) {
      this.propertyName = copyCalendarProperties.name;
      this.propertyDescription = copyCalendarProperties.description;

      /*copy  condition checking for adding copy of text before calendar name*/
      if (this.isCopyCalendar === true ) {
        this.copyOfPropertyName = this._translationService.translate('TEXT_COPY_OF');
        this.isSaveDisabled = false;
      }

      this.calendarProperties = this._formBuilder.group({
        name: [this.copyOfPropertyName + '' + this.propertyName, [Validators.required]],
        description: [this.propertyDescription],
      });
      this.onPropertiesFormChanges();
    }
  }
  checkNameAvailability() {
    this.showErrorMessage = false;
    this.validateProcessing = true;
    this.isNameValidated = true;
    const newCalendarName = this._utilService.fixedEncodeURIComponent(this.calendarProperties.controls.name.value);
    if (this.propertyName !== newCalendarName && newCalendarName != null && newCalendarName !== undefined && newCalendarName != '') {
      this._CalendarsService.searchCalendarNameAvailability({
        data: {
            calendarName: newCalendarName
        },
        success: (result) => {
          this.validateProcessing = false;
          this.calendarInfo = result.records;
          if (this.calendarInfo.length > 0 && this.calendarInfo != null && this.calendarInfo != undefined) {
            this.nameExist = true;
            this.isSaveClicked = false;
            this.isSaveDisabled = true;
          } else {
            this.nameExist = false;
            this.isSaveDisabled = false;
            if (this.isSaveClicked) {
              this.saveCalendar();
            }
          }
        },
        failure: (errorMsg: string, code: any, error: any) => {
          if(this.isCopyCalendar) {
            this.typeOfAction = 'COPY';
          } else {
            this.typeOfAction = 'CREATE';
          }
          this.isSaveDisabled = false;
          this.httpErrorMessage = this._utilityService.errorCheck(code, errorMsg, this.typeOfAction);
          this.validateProcessing = false;
          this.showErrorMessage = true;
        },
      });
    } else {
      this.nameExist = false;
      this.validateProcessing = false;
      if (this.isSaveClicked) {
        this.saveCalendar();
      }
    }
  }
  onDestroy() {
    if (this.calendarPropertiesFormValue) {
      this.calendarPropertiesFormValue.unsubscribe();
    }
  }
  openEditWidget(propertiesList, propertiesEdit) {
    this.isCalendarFormDirty.emit(false);
    this.propDescription = propertiesList.description == null ? '' : propertiesList.description;
    this.updateProperties = true;
    this.calPropertiesAsidePanel = propertiesEdit;
    this.showCover = true;
    this.calPropertiesAsidePanel.show();
    this._utilService.checkNgxSlideModal(true);
    this.isDisabled = true;
    setTimeout(() => {
      const desc = document.getElementById('desc');
      if (desc) {
        desc.style.cssText = 'height:' + 0 + 'px';
        desc.focus();
      }
    }, 300);
  }

  enableSave(description) {
    if (description) {
      this.isDisabled = false;
      this.propDescription = description.value;
      this.isCalendarFormDirty.emit(true);
    }
  }

  cancelPropCoverHandler() {
    if (this.isDisabled) {
      this.closeEditPanel();
    } else {
      this.confirmDialog = 1;
    }
  }

  onEnterSaveProperties(propertiesList, event) {
    if (!this.isDisabled) {
      if (event.keyCode === 13 && !event.shiftKey) {
        this.saveProperties(propertiesList);
      }
    }
  }

  saveProperties(propertiesList) {
    if (propertiesList) {
      const propSave = JSON.parse(JSON.stringify(propertiesList));
      this.isDisabled = true;
      propSave.description = this.propDescription;
      this._CalendarsService.saveProperties({
        data: {
          body: propSave,
          calendarID: propSave.calendarId
        },
        success: (result) => {
          this.closeEditPanel();
          if(this.isCalendarFormDirty) {
            this.isGetWidgetType.emit("calProperties");
          }
          this.getCalender(propertiesList.calendarId);
        },
        failure: (errorMsg: string, code: any, error: any) => {
          this.isDisabled = false;
          this.errorHandler(errorMsg, code, 'edit');
        }
      });
    }
  }
  getCalender(calendarId) {
    this._CalendarsService.getCalendarDetails({
      data: {
        calendarId: calendarId
      },
      success: (result) => {
        if (result) {
          this.viewPropertiesList = result;
          this._utilService.changeDeleteableCalendarData(result);
        }
      },
      failure: (errorMsg: string, code: any, error: any) => {
        this.errorHandler(errorMsg, code, 'load');
      }
    });
  }

  isNoBreakString(value) {
    return this._utilityService.isNoBreakString(value);
  }
  autoGrowEdit() {
    const textArea = this.textAreaEdit.nativeElement;
    this._utilityService.adjustHeightOnScroll(textArea);
   }

}
