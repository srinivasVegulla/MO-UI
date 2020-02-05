import { Component, OnInit, Input, Output, HostListener, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { SharedPricelistService } from '../shared.pricelist.service';
import { utilService } from '../../helpers/util.service';
import { CapabilityService } from '../../helpers/capabilities.service';
import { UtilityService } from '../../helpers/utility.service';

@Component({
  selector: 'ecb-spproperties',
  templateUrl: './sharedproperties.component.html',
  styleUrls: ['./sharedproperties.component.scss'],
})

export class SharedPricelistPropertiesComponent implements OnInit {
  isSaveEnabled = true;
  showErrorMessage: Boolean = false;
  httpErrorMessage: any;
  confirmDialog: number;
  selectedSp: any;
  selectedParitionLogin: any;
  errorMsg: any;
  sharedPropertiesWidget: any;
  spDisName = '';
  showCover: boolean;
  isSaveDisabled: boolean;
  editPropertyCapability = true;
  copyPropertyCapability = true;
  @ViewChild('textArea', { read: ElementRef }) textArea: ElementRef;
  @Output() updateSPList = new EventEmitter<any>();
  @Input() set properties(value) {
    if (value) {
      this.selectedSp = value;
    }
  }

  @Input() set errorMessage(value) {
    if (value) {
      this.errorMsg = value;
    }
  }

  @Input() set selectedPartition(value) {
    if (value) {
      this.selectedParitionLogin = value;
    }
  }

  @HostListener('window:keyup.esc')
  handleKeyboardEvent() {
    if (this._utilityService.isObject(this.sharedPropertiesWidget)) {
      if (this.confirmDialog === 0 && this.sharedPropertiesWidget.visibleStatus) {
        this.cancelCoverHandler();
      } else {
        this.confirmDialog = 0;
      }
    }
  }

  constructor(private _sharedPricelistService: SharedPricelistService,
    private _utilService: utilService,
    private _capabilityService: CapabilityService,
    private _utilityService: UtilityService) {
    this.isSaveEnabled = false;
    this.showErrorMessage = false;
    this.spDisName = '';
    this.showCover = false;
    this._utilService.checkNgxSlideModal(false);
    this.isSaveDisabled = false;
    this.confirmDialog = 0;
  }

  ngOnInit() {
    this.editPropertyCapability = this._capabilityService.findPropertyCapability('UISharedRateDetailsPage', 'Props_Edit');
    this.copyPropertyCapability = this._capabilityService.findPropertyCapability('UISharedRateDetailsPage', 'Props_Copy');
  }

  cancelCoverHandler() {
    if (this.isSaveEnabled) {
      this.confirmDialog = 1;
    } else {
      this.sharedPropertiesWidget.hide();
      this.spDisName = '';
      this.isSaveEnabled = false;
      this.showCover = false;
      this._utilService.checkNgxSlideModal(false);
    }
  }

  onModalDialogCloseCancel(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this.sharedPropertiesWidget.hide();
      this.showErrorMessage = false;
      this.isSaveEnabled = false;
      this.spDisName = '';
      this.showCover = false;
      this._utilService.checkNgxSlideModal(false);
    }
  }

  onEnterSaveSharedPricelist(description,event) {
    if (this.isSaveEnabled) {
      if (event.keyCode === 13 && !event.shiftKey) {
        this.saveSharedPricelist(description);
      }
    }
  }

  saveSharedPricelist(description) {
    const sharedPricelistForm = {
      description: description.value,
      descriptionId: this.selectedSp.descriptionId,
      currency: this.selectedSp.currency,
      pricelistId: this.selectedSp.pricelistId,
      type: 'REGULAR',
      plpartitionid: this.selectedSp.plpartitionid,
      properties: this.selectedSp.properties,
      name: this.selectedSp.name
    };
    if (this.isSaveEnabled) {
      this.isSaveEnabled = false;
      this._sharedPricelistService.updateSharedPricelist({
        data: {
          body: sharedPricelistForm
        },
        success: (result) => {
          this.selectedSp.description = result.description;
          this.sharedPropertiesWidget.hide();
          this.showCover = false;
          this.updateSPList.emit("properties");
          this._utilService.checkNgxSlideModal(false);
        },
        failure: (errorMsg:string,code:any) => {
          this.showErrorMessage = true;
          this.httpErrorMessage = this._utilityService.errorCheck(code,errorMsg,'EDIT');
          this.isSaveEnabled = true;
        }
      });
    }
  }
  displayCoverHandler(sharedPricelists) {
    this.spDisName = this.selectedSp.description == null ? '' : this.selectedSp.description;
    this.isSaveEnabled = false;
    this.showCover = true;
    this._utilService.checkNgxSlideModal(true);
    this.sharedPropertiesWidget = sharedPricelists;
    this.sharedPropertiesWidget.show();
    setTimeout(() => {
      document.getElementById("initFocus").focus();
    }, 300);
  }

  enableSave(description) {
    if (this.selectedSp.description !== description.value && description.value !== '' && description.value != null) {
      this.isSaveEnabled = true;
    } else {
      this.isSaveEnabled = false;
    }
  }

  isNoBreakString(value) {
    return this._utilityService.isNoBreakString(value);
  }
  autoGrow() {
    const textArea = this.textArea.nativeElement;
    this._utilityService.adjustHeightOnScroll(textArea);
   }
   


}