import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, HostListener } from '@angular/core';
import { AvailableFilterTypes } from '../../../assets/numberDateFilterDef';
import { Language, TranslationService, LocaleService } from 'angular-l10n';
import { NgForm, FormGroup, FormBuilder, FormControl, Validators, FormsModule } from '@angular/forms';
import { DateFormatPipe } from 'angular2-moment';
import { calenderLocaleFeilds } from '../../../assets/calenderLocalization';
import { utilService } from '../util.service';

@Component({
    selector: 'ecb-number-date-filter',
    templateUrl: 'numberdatefilter.component.html',
    styleUrls: ['./numberdatefilter.component.scss'],
    providers: [DateFormatPipe]
})

export class NumberDateFilterComponent implements OnInit, OnDestroy {
    FilterTypes: any[];
    @Language() lang: string;
    selectedFilter: any;
    showRange: boolean = false;
    @Input() filterKind;
    defaultCategory: string;
    filterDirectiveForm: FormGroup;
    @Output() selectedUserFilter = new EventEmitter();
    selectedSymbol: any;
    numberDateFilterSubscriptions: any;
    @Input() selectedColumnToFilter;
    calenderLocale: any;
    dateFormat: any;
    currentLocale: any;
    @Input() columnPlacement: any;
    validFromToValues: any;
    filterDefaultSelection: any;
    translateFilterName: any;
    columnFilterName: any;
    refreshFilter: any;
    refreshInUseOfferings: any;

    constructor(private _formBuilder: FormBuilder,
        private _translationService: TranslationService,
        private _amDatePipe: DateFormatPipe,
        private readonly _locale: LocaleService,
        private _utilService: utilService) {}

    ngOnInit() {
        sessionStorage.setItem(this.selectedColumnToFilter, '');
        this.setLocaleDateFormat();
        this.FilterTypes = AvailableFilterTypes.cols;
        this.createFilterForm();
        this.numberDateFilterSubscriptions = this.filterDirectiveForm.controls.filterType.valueChanges.subscribe(value => {
            if (value !== undefined && value !== 'TEXT_NO_FILTER') {
                this.showRange = true;
                this.translateFilterName = value;
                this.FilterTypes.filter(filterKey => {
                     if(this.translateFilterName === filterKey.key){
                        this.selectedFilter = filterKey.field;
                    }
                });
                this.clearValues();
            } else if (value === 'TEXT_NO_FILTER') {
                this.selectedUserFilter.emit({ selectedColumn: this.selectedColumnToFilter, selectedValue: '' });
                this.defaultCategory = this._translationService.translate('TEXT_SELECT_CRITERIA');
                this.filterDirectiveForm.patchValue({ filterType: this.defaultCategory });
                sessionStorage.setItem(this.selectedColumnToFilter, this.defaultCategory);
                this.showRange = false;
            }
        });
        this.refreshFilter = this._utilService.refreshNumberDateFilter.subscribe(value => {
            if (value) {
            this.defaultCategory = this._translationService.translate('TEXT_SELECT_CRITERIA');
            this.filterDirectiveForm.patchValue({ filterType: this.defaultCategory });
            sessionStorage.setItem(this.selectedColumnToFilter, '');
            this.showRange = false;
            }
        });
        this.numberDateFilterSubscriptions.add(this.refreshFilter);
        this.refreshInUseOfferings = this._utilService.refreshInUseOfferingsModal.subscribe(value => {
            if (value) {
                sessionStorage.setItem(this.selectedColumnToFilter, '');
            }
        });
        this.numberDateFilterSubscriptions.add(this.refreshInUseOfferings);
    }

    changeColumnPlacement() {
        if (this.columnPlacement === 'last') {
            return 'ecb-columnPlacementRight';
        } else if (this.columnPlacement === 'first') {
            return 'ecb-columnPlacementLeft';
        } else {
            return '';
        }
    }

    onDatePickerClick(event)
    {
        const e = event;
        if (e.target.className.includes('ecb-filterContainer') || e.target.className.includes('ecb-filterInput') || e.target.className.includes('ecb-showFilter') || e.target.className.includes('ui-datepicker') || e.target.className.includes('ecbFilter-dropdown') || e.target.className.includes('ecb-subscriptionproperties') ||
        e.target.className.includes('ecbFilter-commandBtns') || e.target.className.includes('ecb-filterOptions') ||  e.target.className.includes('ebInput') || e.target.className.includes('ecb-filterButton')|| e.target.className.includes('ecb-filterLabel') || e.target.className.includes('ecb-calendarFilter') || e.target.className.includes('ui-datepicker-trigger') || e.target.className.includes('ui-button-icon-left') || e.target.className.includes('form-group') ||e.target.className.includes('ecbFormNested-addMargin') || e.target.className.includes('ecb-loaderWidgetContainer') || e.target.className.includes('errorText')) {
            e.stopPropagation();
        }
        else if(e.target.className.includes('ui-state-default')){
        //To calendar in date filter 
        }else{
             this.columnFilterName = sessionStorage.getItem(this.selectedColumnToFilter);
                if (this.columnFilterName === 'Enter Filter Criteria' || this.columnFilterName === '') {
                    this.defaultCategory = `${this._translationService.translate('TEXT_SELECT_CRITERIA')}`;
                    this.filterDirectiveForm.patchValue({ filterType: this.defaultCategory });
                    this.showRange = false;
                } else{
                    this.closeRange();
                }
        }
    }
    
    @HostListener('document:click', ['$event'])
    function(event) {
       this.onDatePickerClick(event);
    }

    setLocaleDateFormat() {
        this.currentLocale = this._locale.getCurrentLocale();
        this.calenderLocale = calenderLocaleFeilds[this.currentLocale];
    }

    createFilterForm() {
        this.defaultCategory = this._translationService.translate('TEXT_SELECT_CRITERIA');
        this.filterDirectiveForm = this._formBuilder.group({
            filterType: [this.defaultCategory],
            fromNumber: ['', [Validators.required, this.validateMinMax('fromNumber', 'isFromNumberValue')]],
            toNumber: ['', [Validators.required, this.validateMinMax('toNumber', 'isToNumberValue')]],
            onlyNumber: ['', [Validators.required]],
            fromDate: ['', [Validators.required, this.validateMinMax('fromDate', 'isFromDateValue')]],
            toDate: ['', [Validators.required, this.validateMinMax('toDate', 'isToDateValue')]],
            onlyDate: ['', [Validators.required]]
        });
    }

    enableFilter() {
        switch (true) {
            case (this.filterDirectiveForm.controls.fromNumber.valid && this.filterDirectiveForm.controls.toNumber.valid) || this.validFromToValues:
                return false;
            case this.filterDirectiveForm.controls.onlyNumber.valid:
                return false;
            case (this.filterDirectiveForm.controls.fromDate.valid && this.filterDirectiveForm.controls.toDate.valid) || this.validFromToValues:
                return false;
            case this.filterDirectiveForm.controls.onlyDate.valid:
                return false;
            default:
                return true;
        }
    }

    validateMinMax(valueType, errorType) {
        return (input) => {
            if (!input.root || !input.root.controls) {
                return null;
            }
            switch (valueType) {
                case 'fromNumber':
                    this.validFromToValues = false;
                    if (input.root.controls.fromNumber.value !== '' && input.value !== '' &&
                        input.root.controls.toNumber.value !== '') {
                        const isFromNumberValue = +input.root.controls.toNumber.value > +input.value;
                        this.validFromToValues = isFromNumberValue ? true : false;
                        return isFromNumberValue ? null : { [errorType]: true };
                    } else if (input.value === '') {
                        const isFromNumberValue = false;
                        return isFromNumberValue ? null : { [errorType]: false };
                    }
                    break;
                case 'toNumber':
                    this.validFromToValues = false;
                    if (input.root.controls.fromNumber.value !== '' && input.value !== '' &&
                        input.root.controls.toNumber.value !== '') {
                        const isToNumberValue = +input.root.controls.fromNumber.value < +input.value;
                        this.validFromToValues = isToNumberValue ? true : false;
                        return isToNumberValue ? null : { [errorType]: true };
                    } else if (input.value === '') {
                        const isToNumberValue = false;
                        return isToNumberValue ? null : { [errorType]: false };
                    }
                    break;
                case 'fromDate':
                    this.validFromToValues = false;
                    if (input.root.controls.fromDate.value !== '' && input.value !== '' &&
                        input.root.controls.toDate.value !== '') {
                        const isFromDateValue = Date.parse(input.root.controls.toDate.value) > Date.parse(input.value);
                        this.validFromToValues = isFromDateValue ? true : false;
                        return isFromDateValue ? null : { [errorType]: true };
                    } else if (input.value === '') {
                        const isFromDateValue = false;
                        return isFromDateValue ? null : { [errorType]: false };
                    }
                    break;
                case 'toDate':
                    this.validFromToValues = false;
                    if (input.root.controls.fromDate.value !== '' && input.value !== '' &&
                        input.root.controls.toDate.value !== '') {
                        const isToDateValue = Date.parse(input.root.controls.fromDate.value) < Date.parse(input.value);
                        this.validFromToValues = isToDateValue ? true : false;
                        return isToDateValue ? null : { [errorType]: true };
                    } else if (input.value === '') {
                        const isToDateValue = false;
                        return isToDateValue ? null : { [errorType]: false };
                    }
                    break;
            }
        }
    }

    selectedFilterSymbol(value) {
        if (value !== null && value !== '') {
            this.FilterTypes.map(items => {
                if (value === items.field) {
                    this.selectedSymbol = items.symbol;
                }
            });
            return this.selectedSymbol;
        }
    }
    toIsoStringStartDate(date) {
        return `${date.getFullYear()}-${this.min2Digit((date.getMonth() + 1))}-${this.min2Digit(date.getDate())}`;
    }
    min2Digit(no) {
        return no < 10 ? '0' + no : no;
    }
 
    selectedInputRange() {
        if ((this.filterKind !== undefined && this.selectedFilter !== undefined)
            && (this.filterKind !== null && this.selectedFilter !== null)) {
            switch (this.filterKind) {
                case 'number':
                    if (this.selectedFilter === 'Between') {
                        this.defaultCategory = `${this._translationService.translate(this.translateFilterName)}
                        ${this.filterDirectiveForm.controls.fromNumber.value} - ${this.filterDirectiveForm.controls.toNumber.value}`;
                        sessionStorage.setItem(this.selectedColumnToFilter, this.defaultCategory);
                        this.selectedUserFilter.emit({selectedColumn:this.selectedColumnToFilter,selectedValue: `(${this.filterDirectiveForm.controls.fromNumber.value},${this.filterDirectiveForm.controls.toNumber.value})|${this.selectedFilterSymbol(this.selectedFilter)}`});
                    } else if(this.selectedFilter !== 'Between' && this.selectedFilter !== 'No Filter'){
                        this.defaultCategory = `${this._translationService.translate(this.translateFilterName)}
                        ${this.filterDirectiveForm.controls.onlyNumber.value}`;
                        sessionStorage.setItem(this.selectedColumnToFilter, this.defaultCategory);
                        this.selectedUserFilter.emit({selectedColumn:this.selectedColumnToFilter,selectedValue: `${this.filterDirectiveForm.controls.onlyNumber.value}|${this.selectedFilterSymbol(this.selectedFilter)}`});
                    }
                    break;
                case 'date':
                if (this.selectedFilter === 'Between') {
                    this.defaultCategory = `${this._translationService.translate(this.translateFilterName)}
                    ${this._amDatePipe.transform(this.toIsoStringStartDate(new Date(this.filterDirectiveForm.controls.fromDate.value)),this.calenderLocale.amLocaleDateFormat)}-${this._amDatePipe.transform(this.toIsoStringStartDate(new Date(this.filterDirectiveForm.controls.toDate.value)),this.calenderLocale.amLocaleDateFormat)}`;
                    this.selectedUserFilter.emit({selectedColumn: this.selectedColumnToFilter,selectedValue: `(${this.toIsoStringStartDate(new Date(this.filterDirectiveForm.controls.fromDate.value))},${this.toIsoStringStartDate(new Date(this.filterDirectiveForm.controls.toDate.value))})|${this.selectedFilterSymbol(this.selectedFilter)}`});
                } else if (this.selectedFilter !== 'Between' && this.selectedFilter !== 'No Filter') {
                    this.defaultCategory = `${this._translationService.translate(this.translateFilterName)}
                    ${this._amDatePipe.transform(this.toIsoStringStartDate(new Date(this.filterDirectiveForm.controls.onlyDate.value)),this.calenderLocale.amLocaleDateFormat)}`;
                    sessionStorage.setItem(this.selectedColumnToFilter, this.defaultCategory);
                    this.selectedUserFilter.emit({selectedColumn: this.selectedColumnToFilter,selectedValue: `${this.toIsoStringStartDate(new Date(this.filterDirectiveForm.controls.onlyDate.value))}|${this.selectedFilterSymbol(this.selectedFilter)}`});
                }
                break;
            }
        }
        this.filterDirectiveForm.patchValue({ filterType: this.defaultCategory });
        this.showRange = false;
        this.clearValues();
    }

    closeRange() {
        this.filterDefaultSelection = sessionStorage.getItem(this.selectedColumnToFilter);
        if (this.filterDefaultSelection) {
            this.defaultCategory = this.filterDefaultSelection;
        } else {
            this.defaultCategory = this._translationService.translate('TEXT_SELECT_CRITERIA');
        }
        this.filterDirectiveForm.patchValue({ filterType: this.defaultCategory });
        this.showRange = false;
        this.clearValues();
    }

    clearValues() {
        this.filterDirectiveForm.patchValue({
            fromNumber: '',
            toNumber: '',
            onlyNumber: '',
            fromDate: '',
            toDate: '',
            onlyDate: '',
        });
    }

    disableInvalidNumbers(event) {
        const selectedKeyCode = event.keyCode;
        const selectedKey = event.key;
        if (!((selectedKey >= 0 && selectedKey <= 9) || selectedKeyCode === 8 || selectedKeyCode === 9 ||
        selectedKeyCode === 46 || selectedKeyCode === 20 || selectedKeyCode === 37 || selectedKeyCode === 39)) {
            event.preventDefault();
            event.Handled = true;
        }
    }

    ngOnDestroy() {
        sessionStorage.removeItem(this.selectedColumnToFilter);
        if (this.numberDateFilterSubscriptions) {
            this.numberDateFilterSubscriptions.unsubscribe();
          }
    }
}
