import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'ecb-inuse',
  templateUrl: './sharedPricelistInUseInfo.component.html',
  styleUrls: ['./sharedPricelistInUseInfo.component.scss']
})
export class SharedPricelistInUseInfoComponent implements OnInit {
  selectedSp: any;
  errorMsg: any;
  inUseProductOffers: any;
  inUseSubscribers: any;
  sharedPricelistId: any;
  sharedPricelist: any;
  showInuseSubscribersInfo: boolean;
  showInuseOfferingsInfo: boolean;
  inUseOfferingsLocation;


  @Input() set inUseData(value) {
  if (value) {
    this.sharedPricelist = value;
    this.inUseProductOffers = value.offeringsCount;
    this.inUseSubscribers = value.useAccCount;
    this.sharedPricelistId = value.pricelistId;
  }
}

@Input() set errorMessage(value) {
  if (value) {
    this.errorMsg = value;
  }
}

  constructor() {
    this.showInuseSubscribersInfo = false;
    this.showInuseOfferingsInfo = false;
  }
  ngOnInit() {
  }
  openInuseSubscribers() {
    this.showInuseSubscribersInfo = true;
  }

  openInuseOfferings() {
    this.showInuseOfferingsInfo = true;
    this.inUseOfferingsLocation = 'sharedPriceList';
  }
  onSubscriberClosed() {
    this.showInuseSubscribersInfo = false;
  }
  onOfferingsClosed() {
    this.showInuseOfferingsInfo = false;
  }
}


