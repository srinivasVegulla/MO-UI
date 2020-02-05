/**
 Use Case :

 Input Properties :

 1. open : true/ false - to show/hide popup.
 2. header : true/false - to show/hide header
 3. body : true/false - to show/hide body
 4. footer : true/false - to show/hide footer
 5. noOfFooterButton : max value 5, default value 2 - You can pass Integer value for no of buttons
 6. defaultFooterButtons : true/false -By default it will show two button( cancel without saving, return).
    In case you want to give your own text for button make it false.
 7. closeOnEscape : true/false - close on escape
 8. styleClass : 'Your class name' - ex. "'ecb-myClass'"
 9. closeIcon : true // default true
 10.drag : true // default false
 11.primaryButtons: [1]
 12. ContentType: 'Icon to display - warning/success/error' // default warning

 Callbacks :
  OnClose : function({index : -1(escape), 0(for close button) /1/2/3, type : ok/cancel/button3}){}

ChileComponents :
  Defaut design :
    dialog-header, dialog-body, dialog-footer
  Own templates :
    dialog-header-template, dialog-body-template, dialog-footer-template
  Button :
    dialog-button-1, dialog-button-2, dialog-button-3

 */
import { Component, EventEmitter, HostListener, Input, Output, ViewChild,ElementRef } from '@angular/core';
import { SecureHtmlPipe } from '../../helpers/secureHtml.pipe';
import { DropdownModule, SelectItem, AutoComplete } from 'primeng/primeng';
import { PopUpDrag } from '../../helpers/popUpDrag';
import { UtilityService } from '../../helpers/utility.service';
import { setTimeout } from 'timers';

@Component({
  selector : 'ecb-modal-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.scss'],
  providers: [SecureHtmlPipe, PopUpDrag]
})

export class CommonDialogComponent {
  visible: boolean;
  contentHtml: string;
  dialogHeader: boolean;
  dialogBody: boolean;
  dialogFooter: boolean;
  contentHtmlTemplate;
  footerButtonCount: 2;
  isDefaultFooterButtons: boolean;
  isCloseOnEscape: boolean;
  dialogStyleClass: string;
  visibleAnimate: boolean;
  primaryButtonSet: any;
  isCloseIcon: any;
  draggable: boolean;
  popupId: string;
  isModal: boolean;
  setContentType: string;
  @ViewChild('btnFocus') btnFocus:ElementRef;

  @Output() onClose = new EventEmitter<any>();

  constructor(private _secureHtmlPipe: SecureHtmlPipe,
  private _popUpDrag: PopUpDrag,
  private _utilityService: UtilityService) {
    this.initialize();
    this.activeDrag();
  }

  initialize() {
    this.visible = true;
    this.dialogHeader = true;
    this.dialogBody = true;
    this.dialogFooter = true;
    this.isCloseOnEscape = true;
    this.footerButtonCount = 2;
    this.isDefaultFooterButtons = true;
    this.contentHtmlTemplate = this.contentHtml !== undefined ? this.safeHtml(this.contentHtml) : undefined;
    this.dialogStyleClass = null;
    this.visibleAnimate = false;
    this.primaryButtonSet = [];
    this.isCloseIcon = true;
    this.draggable = false;
    this.popupId = 'dialog-' + new Date().getTime();
    this.isModal = true;
    this.setContentType = 'warning';
  }

  @Input() set open(value) {
    if (value === true || value === 'true') {
      this.show();
      setTimeout(() => {
        if (this.isModal) {
          document.body.classList.add('ecb-body-modal-dialog');
          if(this.isCloseIcon) {
            this.btnFocus.nativeElement.focus();
          }
        }
      }, 200);
    }else {
      this.hide();
      if (this.isModal) {
        document.body.classList.remove('ecb-body-modal-dialog');
      }
    }
  }

  @Input() set header(p) {
    this.dialogHeader = p;
  }

  @Input() set body(p) {
    this.dialogBody = p;
  }

  @Input() set footer(p) {
    this.dialogFooter = p;
  }

  @Input() set noOfFooterButton(p) {
    this.footerButtonCount = p;
  }

  @Input() set defaultFooterButtons(p) {
    this.isDefaultFooterButtons = p;
  }

  @Input() set closeOnEscape(p) {
    this.isCloseOnEscape = p;
  }

  @Input() set styleClass(value) {
    this.dialogStyleClass = value;
  }

  @Input() set primaryButtons(value) {
    this.primaryButtonSet = value;
  }

  @Input() set closeIcon(value) {
    this.isCloseIcon = value;
  }

  @Input() set drag(p) {
    this.draggable = p;
  }

  @Input() set modal(p) {
    this.isModal = p;
  }

  @Input() set contentType(p) {
    this.setContentType = p;
  }

  @Input() set isVisibleAnimate(value) {
    this.visibleAnimate = value;
  }
  
  @HostListener('document:keydown', ['$event'])
  function(event) {
    if (this.isCloseOnEscape && event.key === 'Escape') {
        this.escapeClose();
    }
  }

  getStyleClasses() {
    const styleClass = this.isModal ? 'modal-dialog ' : '';
    return styleClass + (this.dialogStyleClass !== null && this.dialogStyleClass !== undefined 
        && !this.visibleAnimate ? this.dialogStyleClass : '');
  }

  footerButtonClick(buttonIndex) {
    this.hide();
    const buttonType = buttonIndex === 1 ? 'ok' : (buttonIndex === 2 ? 'cancel' : 'button-' + buttonIndex);
    this.onClose.emit({index : buttonIndex, type : buttonType});
  }

  escapeClose() {
    this.hide();
    this.onClose.emit({index : -1, type : 'escape'});
  }

  closeDialog() {
    this.hide();
    this.onClose.emit({index : 0, type : 'closeIcon'});
  }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
  }

  public hasPrimaryBtn(index) {
    return this.primaryButtonSet.indexOf(index) >= 0 ? 'ebBtn-primary' : '';
  }

  activeDrag() {
    setTimeout(() => {
      if (this.draggable) {
          const element = document.getElementById(this.popupId);
        if (this._utilityService.isObject(element)) {
          this._popUpDrag.dragElement(document.getElementById(this.popupId));
        }
      }
    }, 2000);
  }

  safeHtml(text) {
    return this._secureHtmlPipe.transform(text);
  }
}
