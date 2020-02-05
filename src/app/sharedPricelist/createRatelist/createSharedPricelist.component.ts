import { Component, EventEmitter, ViewChild, OnInit, Input, Output, HostListener, ElementRef } from '@angular/core';
import { SharedPricelistService } from '../shared.pricelist.service';
import { NgForm, FormsModule, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilityService } from '../../helpers/utility.service';
import { TranslationService } from 'angular-l10n';
import { utilService } from '../../helpers/util.service';

@Component({
    selector: 'ecb-createShared-pricelist',
    templateUrl: './createSharedPricelist.component.html',
    styleUrls: ['./createSharedPricelist.component.scss'],
    providers: []
})

export class CreateSharedPricelistComponent implements OnInit {
sharedPricelist: FormGroup;
isSaveEnabled = false;
spcurrencies: any;
sppartitions: any;
nameExist = false;
showErrorMessage: Boolean = false;
httpErrorMessage: any;
sharedPricelistInfo: any[];
confirmDialog: number;
spCreateSubscriptions: any;
isSaveDisabled: boolean;
selectedPartition: any;
selectedpartitionId: any;
modalDialogClose;
isCreateRateList: boolean;
isCopyRates: boolean;
copyRateProperties: any;
rateName: any;
rateDescription: any;
copyOfRateName: any;
defaultName: any;
rateCurrency: any;
loadPLUrl: string = '';
sharedPriceListForm: any;
@Output() isFormDirty = new EventEmitter();
@Input() set copyPricelist(rateProperties) {
    if (this._utilityService.isObject(rateProperties)) {
      this.copyRateProperties = rateProperties;
    }
}
@Input() set createRateList(value){
    if (value) {
      this.isCopyRates = false;
      this.isCreateRateList = true;
      setTimeout(() => {
        document.getElementById('initFocus').focus();
      }, 300);
    } else {
       this.isSaveDisabled = false;
       this.isCopyRates = true;
     }
 }
 @ViewChild('textArea', { read: ElementRef }) textArea: ElementRef;
 typeOfAction: any;


constructor(private _sharedPricelistService: SharedPricelistService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _utilityService: UtilityService,
    private _utilService: utilService,
    private _translationService:TranslationService) {
    this.isSaveEnabled = false;
    this.nameExist = false;
    this.showErrorMessage = false;
    this.isSaveDisabled = false;
    this.confirmDialog = 0;
}

ngOnInit() {
    this.isSaveEnabled = false;
    if(this.isCopyRates) {
        this.isSaveEnabled = true;
    }
    setTimeout(() => {
        document.getElementById("initFocus").focus();
      }, 300);
   
    this.getCurrenciesAndPartitions();
    this.setSharedPricelistFormBuilder();
    this.onFormFieldChange();
    this.processRateList(this.copyRateProperties);
}

getCurrenciesAndPartitions() {
    this._utilityService.getCurrenciesAndPartitionsList({
        success: (result) => {
            this.spcurrencies = result['currencies'];
            this.sppartitions = result['partitions'];
            this.selectedPartition  = this.sppartitions[0];
        },
        failure: (error) => {
        }
    });
}
cancelCoverHandler() {
    if (this.sharedPricelist.dirty || this.isCopyRates) {
        this.confirmDialog = 1;
    } else {
        this.closeEditPanel();
    }
}
closeEditPanel() {
    this._sharedPricelistService.changehideSharedPricelist(true);
    this.nameExist = false;
}

@HostListener('window:keyup', ['$event'])
handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === 27) {
        if (this.confirmDialog === 0) {
            this.cancelCoverHandler();
        } else {
            this.confirmDialog = 0;
        }
    }
}

onFormFieldChange() {
    this.sharedPriceListForm = this.sharedPricelist.valueChanges.subscribe(value => {
    if (this.sharedPricelist.dirty) {
        this.isFormDirty.emit(true);
        this.isSaveEnabled = true;
        if (this.sharedPricelist.controls.name.hasError('required') || !this.sharedPricelist.controls.name.value) {
            this.nameExist = false;
            this.isSaveEnabled = false;
        }
    }
 });
}

changeDropdown() {
    this.onFormFieldChange();
}
onModalDialogCloseCancel(event) {
    this.confirmDialog = 0;
    if (event.index === -1 && this.sharedPricelist.dirty) {
      this.modalDialogClose = !this.modalDialogClose;
      if (this.modalDialogClose) {
        this.confirmDialog = 1;
      }
    }
    if (event.index === 1) {
        this.closeEditPanel();
        this.setSharedPricelistFormBuilder();
        this.nameExist = false;
        this.showErrorMessage = false;
    }
    if (event.index === 0 || event.index === 2) {
      this.modalDialogClose = !this.modalDialogClose;
    }
    this.isFormDirty.emit(false);
}
setSharedPricelistFormBuilder() {
    this.sharedPricelist = this._formBuilder.group({
        name: ['', [Validators.required]],
        description: [''],
        currency: ['USD'],
        sppartitionid: [this.selectedpartitionId]
    });
    
}

onEnterSaveRates(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      this.checkNameAvailability(true);
    }
  }

  processRateList(copyRateProperties) {
    if (copyRateProperties !== undefined && copyRateProperties !== null && Object.keys(copyRateProperties).length > 0) {
      this.rateName = copyRateProperties.name;
      this.rateDescription = copyRateProperties.description;
      this.selectedpartitionId = copyRateProperties.plpartitionid;
      this.rateCurrency = copyRateProperties.currency;
 
      /*copy  condition checking for adding copy of text before name*/
      if(this.isCopyRates) {
        this.copyOfRateName = this._translationService.translate('TEXT_COPY_OF');
        this.isSaveDisabled = false;
        const copyRateName = (this.copyOfRateName + this.rateName).substring(0, 255);
        this.sharedPricelist = this._formBuilder.group({
            name: [copyRateName, [Validators.required]],
            description: [this.rateDescription],
            currency: [this.rateCurrency],
            sppartitionid: [this.selectedpartitionId]
          });
       this.onFormFieldChange();
     }
    }
  }
  
  removeSpace(){
    let checkNameValue = this.sharedPricelist.controls.name;
    this._utilityService.removeTextSpace(checkNameValue, null); 
  }
  
  disableSpace(evt){
    this._utilityService.disableSpaceBar(evt); 
  }

checkNameAvailability(save) {
    this.showErrorMessage = false;
    if (save || (this.sharedPricelist.controls.name.hasError('required') && this.sharedPricelist.controls.name.touched)) {
        this.isSaveEnabled = false;
    }
    const sharedPricelistObject = this.sharedPricelist['_value'];
    this.nameExist = false;
    if (sharedPricelistObject.name != null && sharedPricelistObject.name !== undefined && sharedPricelistObject.name !== '') {
        const widgetData = {
            name: this._utilService.fixedEncodeURIComponent(this.sharedPricelist.controls.name.value)
          };
        this._sharedPricelistService.SearchSharedRateName({
           data : widgetData,
            success: (result) => {
                    if ( result.totalCount === 0 ) {
                        this.nameExist = false;
                        this.isSaveEnabled = true;
                    } else {
                        this.nameExist = true;
                        this.isSaveEnabled = false;
                    }
                  if (save && result.totalCount === 0) {
                    this.isSaveEnabled = false;
                   this.saveSharedPricelist(sharedPricelistObject);
                }
            },
            failure: (errorMsg: string, code: any, error: any) => {
                if(this.isCopyRates) {
                    this.typeOfAction = 'COPY';
                } else {
                    this.typeOfAction = 'CREATE';
                }
                this.isSaveEnabled = true;
                this.httpErrorMessage = this._utilityService.errorCheck(code, errorMsg, this.typeOfAction);
                this.showErrorMessage = true;
                this.isSaveEnabled = true;
            }
        });
    }
}
onDestroy() {
    if (this.sharedPriceListForm) {
      this.sharedPriceListForm.unsubscribe();
    }
  }

    saveSharedPricelist(sharedPricelistObject) {
    const partitionId = parseInt(sharedPricelistObject.sppartitionid, 10);
    const sharedPricelistForm = {
        name: sharedPricelistObject.name.trim(),
        description: sharedPricelistObject.description,
        currency: {
            value: sharedPricelistObject.currency
        },
        plpartitionid: partitionId,
        type: 'REGULAR'
    };
    if(!this.isCopyRates) {
        this._sharedPricelistService.createSharedPricelist({
            data: {
                body: sharedPricelistForm
            },
            success: (result) => {
                this.successHandler(result);
                },
            failure: (errorMsg: string, code: any, error: any) => {
                this.errorHandler(errorMsg, code, error, 'create');
            }
        });
    }
     else {
            this._sharedPricelistService.copySharedPricelist({
                data: {
                    body: sharedPricelistForm,
                    priceListId: this.copyRateProperties.pricelistId
                },
                success: (result) => {
                   this.successHandler(result);
                    },
                failure: (errorMsg: string, code: any, error: any) => {
                   this.errorHandler(errorMsg, code, error, 'copy');
                }
            });
        }
    }
    successHandler(result){
        const response = result;
        this.loadPLUrl = '/ProductCatalog/ratelistDetails/' + response.pricelistId;
        this._utilService.addNewRecord({
            obj: response,
            path: this.loadPLUrl,
            Level: 'Grid'
        });
        this._router.navigateByUrl(this.loadPLUrl);
        this.isFormDirty.emit(false);
    }

    errorHandler(errorMsg: string, code: any, error: any, type) {
        if (type === 'create') {
         this.httpErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'CREATE');
        } else {
         this.httpErrorMessage = this._utilityService.errorCheck(code, errorMsg, 'COPY');
        }
        this.showErrorMessage = true;
        this.isSaveEnabled = true;
        this.isFormDirty.emit(true);
    }

    ngOnDestroy() {
        if (this.spCreateSubscriptions) {
            this.spCreateSubscriptions.unsubscribe();
        }
    }
    autoGrow() {
        const textArea = this.textArea.nativeElement;
        this._utilityService.adjustHeightOnScroll(textArea);
       }
       

}