import { Component, OnInit, HostListener,OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthenticationService } from './security/authentication.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { LocaleService, Language, DefaultLocale } from 'angular-l10n';
import { utilService } from './helpers/util.service';
import { UtilityService } from './helpers/utility.service';

@Component({
  selector: 'welcome',
  templateUrl: './Welcome.component.html',
  host: {
    '(document:keydown)': 'handleKeyboardEvent($event)'
  }
})

export class WelcomeComponent implements OnDestroy{
  public pageTitle: string = 'TEXT_DASHBOARD';
  showScrollbar;
  lang;
  documentObject;
  welcomeSubscriptions:any;
  contextBar;
  isMobileDevice;
  applyScroll: boolean;
  removeHeight: any;
  confirmDialog: number = 0;
  idleTimeObj = {minutes: '', seconds: ''};
  currentTime: number = 120;
  isTimerInProgress: boolean = true;
  clearTimer: any;
  removeScrollHeight: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private idle: Idle,
    private keepalive: Keepalive,
    private _locale: LocaleService,
    private _utilService: utilService,
    private _utilityService: UtilityService
  ) {
    // Password based login. Idle timeout 20 minutes which includes 2 minutes of timout for displaying a warning message.
    idle.setIdle(18 * 60);

    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    // idle.setInterrupts([new EventTargetInterruptSource(this.element.nativeElement, 'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll')]);

    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    // sets a timeout period of 120 seconds. after 18 minutes of inactivity, the user will be considered timed out.
    idle.setTimeout(5);

    this.welcomeSubscriptions = idle.onTimeout.subscribe(() => {
      this.startTimer();
    });

    const successTicketLoginObser = this._utilService.successTicketLoginObser.subscribe((v) => {
      if (v) {
        // Ticket based login. Idle timeout 20 mins which includes 2 minutes of timout for displaying a warning message.
        idle.setIdle(18 * 60);
      }
    });
    this.welcomeSubscriptions.add(successTicketLoginObser);
    const ngxSlideModal = this._utilService.ngxSlideModal.subscribe((val) => {
      if (val) {
        document.body.classList.add('ecb-body-modal');
      }else {
        document.body.classList.remove('ecb-body-modal');
      }
    });
    this.welcomeSubscriptions.add(ngxSlideModal);
    this.reset();
    const observableShowScrollSubscribe = this._utilService.observableShowScroll.subscribe(showScrollbar => 
      this.showScrollbar = showScrollbar);
    this.welcomeSubscriptions.add(observableShowScrollSubscribe);

    // Resetting window scroll position after route change
    const viewChangeSubscription = router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        window.scroll(0, 0);
      });
    this.welcomeSubscriptions.add(viewChangeSubscription);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event){
     let winWidth = event.target.innerWidth;
     if(winWidth <= 992) {
       const headerHeight = 42;
       this._utilService.changeRemoveScrollHeight(headerHeight);
     }
  }

  IdleTimeout() {
    if (this.isTicketLogin) {
      this.emitMessageToParent();
    }
    this._utilService.callautoLogout(true);
  }

  reset() {
    this.idle.watch();
  }

  ngOnInit() {
    this.lang = this._locale.getCurrentLocale();
    this.documentObject = document.getElementById("mainBody");
    this.documentObject.dir = (this.lang ==="he" || this.lang ==="ar-sa") ? "RTL" : "LTR";
    const bodyScrollChanges = this._utilService.applyBodyScroll.subscribe(value => {
        setTimeout(() => {
        if (value) {
        this.applyScroll = true;
        } else {
        this.applyScroll = false;
        }
        }, 300);
    });
    this.welcomeSubscriptions.add(bodyScrollChanges);
    const removeScrollHeight = this._utilService.removeScrollHeight.subscribe(value => {
      if(value !== 0) {
        this.removeHeight = value;
      }
    });
    this.welcomeSubscriptions.add(removeScrollHeight);
    this._utilityService.getTimeGapDetails();
  }

  someKeyboardConfig: any = {
    behaviour: 'drag',
    connect: true,
    start: [0, 5],
    keyboard: true,  // same as [keyboard]="true"
    step: 0.1,
    pageSteps: 10,  // number of page steps, defaults to 10
    range: {
      min: 0,
      max: 5
    },
    pips: {
      mode: 'count',
      density: 2,
      values: 6,
      stepped: true
    }
  };

  getScrollData() {
    if(this.applyScroll){
      return {'overflow-y': 'auto', 'overflow-x': 'hidden', height: 'calc(100vh - ' + `${this.removeHeight}` +'px)'}
    }
  }

  //handling keydown event throught the document level
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key == "Escape") {
      this._utilService.changetoggleBreadCrumb(0);
      this._utilService.changeTogglevalue(0);
      }
    }

    ngOnDestroy() {
      if (this.welcomeSubscriptions) {
        this.welcomeSubscriptions.unsubscribe();
      }
      /* if (this.contextBar) {
        this.contextBar.unsubscribe();
        this.isMobileDevice.unsubscribe();
      } */
  }

  handleContextBarView(value) {
    if (value) {
      this.isMobileDevice = value;
    }
  }

  isTicketLogin() {
    return !this._utilityService.isEmpty(sessionStorage.getItem('ticket'));
  }

  startTimer() {
    if(this.isTimerInProgress) {
      this.confirmDialog = 1;
      this.timeConverter(this.currentTime);
      this.clearTimer = setInterval(() => {
        --this.currentTime;
        if (this.currentTime >= 0) {
          this.timeConverter(this.currentTime);
        }
        if (this.currentTime === 0) {
          this._utilService.sessionIdleTimedOut({ 'autoLoggingOff': true, 'showTimedoutDialog': true });
          this.stopTimer();
          this.IdleTimeout();
        }
      }, 1000);
      this.isTimerInProgress = false;
    }
  }

  stopTimer() {
    clearInterval(this.clearTimer);
  }

  timeConverter(sec) {
    let mins = Math.floor(sec / 60);
    let secs = sec % 60;
    this.idleTimeObj['minutes'] = (mins < 10 ? "0" + mins : mins).toString();
    this.idleTimeObj['seconds'] = (secs < 10 ? "0" + secs : secs).toString();
    return this.idleTimeObj;
  }

  emitMessageToParent() {
    const parentWindow = window.top;
    parentWindow.postMessage('logout', '*');
  }

  onModalDialogCloseCancel(event: any) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this._utilService.sessionIdleTimedOut({ 'autoLoggingOff': true, 'showTimedoutDialog': false });
      this.IdleTimeout();
    }
    this.stopTimer();
    this.currentTime = 120;
    this.isTimerInProgress = true;
    this.reset();
  }
}
