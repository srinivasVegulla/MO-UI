import { Component, OnInit, Input, HostListener } from '@angular/core';
import { NgForm, FormsModule, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedPricelistService } from '../shared.pricelist.service';
import { priceableItemDetailsService } from '../../priceableItemDetails/priceableItemDetails.service';
import { utilService } from '../../helpers/util.service';
import { CapabilityService } from '../../helpers/capabilities.service';
import { UtilityService } from '../../helpers/utility.service';

@Component({
  selector: 'ecb-spextended-properties',
  templateUrl: './sharedPricelistExtendedProperties.component.html',
  styleUrls: ['./sharedPricelistExtendedProperties.component.scss']

})

export class SharedPricelistExtendedPropertiesComponent implements OnInit {

  extendedProperty: any = [];
  isDisabled = false;
  showCover = false;
  showErrorMessage = false;
  httpErrorMessage: any;
  extendedPropertiesForm: FormGroup;
  isSaveEnabled = false;
  confirmDialog;
  extendedProps;
  sharedPricelistId: any;
  selectedSp: any;
  errorMsg: boolean;

  @Input() set extendedProperties(value) {
    if (value) {
      this.sharedPricelistId = value.pricelistId;
      this.setExtendedProperties();
    }
  }

  constructor(private _formBuilder: FormBuilder,
    private _utilService: utilService,
    private _sharedPricelistService: SharedPricelistService,
    private _utilityService: UtilityService) {
    this.confirmDialog = 0;
  }

  ngOnInit() {
    this.extendedPropertiesForm = new FormGroup({});
  }

  setExtendedProperties() {
    this._sharedPricelistService.getPricelistExtendedProps({
      data: {
        param: {
          query: {
            pricelistId: parseInt(this.sharedPricelistId, 10)
          }
        },
        pricelistId: parseInt(this.sharedPricelistId, 10)
      },
      success: (result) => {
        if (result != null) {
          this.selectedSp = result;
          this.extendedProperty = this.selectedSp.extendedProperties;
          if (this.extendedProperty != null || this.extendedProperty !== undefined) {
            this.extendedPropertiesForm = this.createGroup();
          }
        }
      },
      failure: (error) => {
        this.showErrorMessage = true;
        this.httpErrorMessage = error;
      }
    });
  }

  createGroup() {
    const group = new FormGroup({});
    this.extendedProperty.forEach((extProperties) => {
      const control: FormControl = new FormControl(extProperties.value, Validators.required);
      group.addControl(extProperties.dn, control);
    });
    return group;
  }

  onEnterSaveExtProperties(event) {
    if (this.isSaveEnabled) {
      if (event.keyCode === 13 && !event.shiftKey) {
        this.saveExtProperties();
      }
    }
  }

  saveExtProperties() {
    this.isSaveEnabled = false;
    const extPropertiesFormObject = { 'properties': {} };
    if (this.extendedPropertiesForm.dirty) {
      extPropertiesFormObject.properties = this.extendedPropertiesForm['_value'];
      const sharedPricelist = {
        description: this.selectedSp.description,
        currency: this.selectedSp.currency,
        pricelistId: this.sharedPricelistId,
        type: 'REGULAR',
        plpartitionid: this.selectedSp.plpartitionid,
        properties: extPropertiesFormObject.properties
      };
      this._sharedPricelistService.updateSharedPricelist({
        data: {
          body: sharedPricelist
        },
        success: (result) => {
          this.extendedProps.hide();
          this.showCover = false;
          this._utilService.checkNgxSlideModal(false);
          this.setExtendedProperties();
          this.isSaveEnabled = true;
        },
        failure: (error) => {
          this.errorMsg = true;
          this.httpErrorMessage = error;
           this.isSaveEnabled = true;
        }
      });
    }
  }

  displayCoverHandler(extendedProps) {
    this.extendedProps = extendedProps;
    extendedProps.show();
    this.showCover = true;
    this._utilService.checkNgxSlideModal(true);
    this.showErrorMessage = false;
    this.errorMsg = false;
    this.isSaveEnabled = false;
  }

  cancelCoverHandler() {
    if (this.extendedPropertiesForm.dirty) {
      this.confirmDialog = 1;
    } else {
      this.extendedProps.hide();
      this.showCover = false;
      this._utilService.checkNgxSlideModal(false);
    }
  }

  onCheckboxSelect(event, extProperty, index) {
    this.isSaveEnabled = true;
    if (extProperty.value === '1') {
      this.extendedPropertiesForm['_value'][extProperty.dn] = '0';
      extProperty.value = '0';
      this.extendedProperty[index] = extProperty;
    } else if (extProperty.value === '0') {
      this.extendedPropertiesForm['_value'][extProperty.dn] = '1';
      extProperty.value = '1';
      this.extendedProperty[index] = extProperty;
    }
  }

  @HostListener('window:keyup')
  onFormFieldChange() {
    if (this.extendedPropertiesForm.dirty) {
      this.isSaveEnabled = true;
    }
  }

  closeEditPanel() {
    this.extendedPropertiesForm = this.createGroup();
    this.extendedProps.hide();
    this.showCover = false;
    this._utilService.checkNgxSlideModal(false);
  }

  onModalDialogCloseCancel(event) {
    this.confirmDialog = 0;
    if (event.index === 1) {
      this.closeEditPanel();
    }
  }

  isNoBreakString(value) {
    return this._utilityService.isNoBreakString(value);
  }
}
