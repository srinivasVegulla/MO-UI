import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { Router,ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';
import { utilService } from './helpers/util.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls:  ['./app.component.scss'],
 })

export class AppComponent implements OnInit {
    title: string;
    navigationTitle: string;
    height: number;
    currentLang;
    appEvents: any;
    preventUnsaveChange: any;
    confirmDialog: any;
    unsaveChangeData: any;
    ticketLoginLoading = false;
    isAutoLoggingOff: boolean = false;
    toggleTimedoutDialog: boolean = false;

    constructor(private _location: Location ,
                private _router: Router,
                private _utilService: utilService
               ) {
        this.confirmDialog = 0;
        this.appEvents = [];
        this.unsaveChangeData = {};
        this.title = 'Product Offer Catalog';
        this.navigationTitle = '';
        this.navigationTitle = 'TEXT_PRODUCT_CATALOG';
        this.currentLang = (localStorage.getItem('currentLang') === null || localStorage.getItem('currentLang') === 'null')
                             ? 'us' : localStorage.getItem('currentLang');
        localStorage.setItem('currentLang', this.currentLang);
    }

    ngOnInit() {
        const sessionTimedoutSubscription = this._utilService.idleTimedout.subscribe((value) => {
            this.isAutoLoggingOff = value.autoLoggingOff;
            this.toggleTimedoutDialog = value.showTimedoutDialog;
        })
        this.appEvents.push(sessionTimedoutSubscription);
        this.preventUnsaveChange =  this._utilService.preventUnsaveChange.subscribe(value => {
            if (value !== undefined && value['url'] !== undefined) {
                this.unsaveChangeData = value;
                if (!this.isAutoLoggingOff) {
                    this.confirmDialog = 1;
                } else {
                    if (this.toggleTimedoutDialog) {
                        localStorage.setItem('isAutoLoggedOff', 'true');
                    }
                    this.onModalDialogCloseCancel({index: 0});
                    this._utilService.callautoLogout(false);
                    window.location.href = '/login';
                }
            }
        });
          this.appEvents.push(this.preventUnsaveChange);
      this._utilService.ticketLoginObser.subscribe(val => {
        this.ticketLoginLoading = false;
        if (val) {
          this.ticketLoginLoading = val;
        }
      });
     }

     onModalDialogCloseCancel(event) {
        this.confirmDialog = 0;
        this.isAutoLoggingOff = false;
        this.toggleTimedoutDialog = false;
        if (event.index === 1) {
            window.location.href = this.unsaveChangeData.url;
        }
    }

    ngOnDestroy() {
        if (this.appEvents) {
            this.appEvents.unsubscribe();
        }
    }
}
