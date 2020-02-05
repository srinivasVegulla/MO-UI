import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { TextFilterPipe } from '../textFilter.pipe';

@Component({
    selector: 'ecb-combobox',
    templateUrl: './combobox.component.html',
    providers: [TextFilterPipe]
})

export class ComboboxComponent implements OnInit {

    selectedOption: any;
    primaryOption: any;
    filteredOptions: any;
    optionsList: any[];
    filteredList: boolean;
    showOptions: boolean;
    isChevronClicked: boolean;
    isHeightDefined: boolean;
    setOptionsHeight: string;
    isWidthDefined: boolean;
    setOptionsWidth: string;
    setAutoHeight: boolean;

    @Input() label;
    @Input() options;
    @Input() ReadonlyMode;
    @Input() MaximumLength;
    @Input() set setDefaultOption(defaultOption) {
        this.selectedOption = defaultOption;
        this.primaryOption = defaultOption;
    };
    @Input() set height(value) {
        if (value && value !== null && value !== undefined) {
            this.isHeightDefined = true;
            this.setOptionsHeight = `${value}px`;
        }
    }
    @Input() set width(value) {
        if (value && value !== null && value !== undefined) {
            this.isWidthDefined = true;
            this.setOptionsWidth = `${value}px`;
        }
    }
    @Input() set resetCombobox(value) {
        if (value) {
            this.selectedOption = this.primaryOption;
        }
    }
    @Output() optionSelected = new EventEmitter();
    @Output() isFormDirty = new EventEmitter();
    @ViewChild('comboboxOptions') comboboxOptions: any;
    @ViewChild('chevron') chevron: any;

    constructor(private _textFilterPipe: TextFilterPipe) {
        this.isHeightDefined = false;
        this.isWidthDefined = false;
     }

    ngOnInit() {
        this.filteredList = false;
        this.showOptions = false;
        this.isChevronClicked = false;
        this.optionsList = this.options;
        setTimeout(() => {
            const categoryElement = document.getElementById("initFocus");
            if (categoryElement !== null && categoryElement !== undefined) {
                document.getElementById("initFocus").focus();
            }
          }, 300);
    }

    @HostListener('document:click', ['$event.target']) handleClick(targetElement) {
        if (this.chevron !== undefined && this.chevron !== null) {
            if (this.chevron.nativeElement.contains(targetElement)) {
                this.displayFullList();
                if (this.isChevronClicked && this.options.length > 0) {
                    this.showOptions = true;
                } else {
                    this.showOptions = false;
                }
            } else {
                this.showOptions = false;
                this.isChevronClicked = false;
            }
        }
    }

    setOption(option) {
        this.selectedOption = option;
        this.showOptions = false;
        this.isChevronClicked = false;
        this.optionSelected.emit(option);
        this.isFormDirty.emit(true);
    }

    setSelectedOption() {
        this.showOptions = false;
        this.isChevronClicked = false;
        this.optionSelected.emit(this.selectedOption);
    }

    showFilteredOptions(filterValue) {
        if (filterValue !== null && filterValue.length > 0 ) {
            this.filteredOptions = [];
            this.filteredOptions = this._textFilterPipe.transform(this.optionsList, filterValue);
            if (this.filteredOptions !== null && this.filteredOptions !== undefined && this.filteredOptions.length > 0) {
                this.options = this.filteredOptions;
                this.showOptions = true;
                this.filteredList = true;
                this.setAutoHeight = true;
            } else {
                this.filteredOptions = [];
                this.filteredList = false;
                this.showOptions = false;
                this.setAutoHeight = false;
            }
        } else {
            this.filteredOptions = [];
            this.filteredList = false;
            this.showOptions = false;
            this.setAutoHeight = false;
        }
        this.isFormDirty.emit(true);
    }

    displayFullList() {
        this.isChevronClicked = this.isChevronClicked ? false : true;
        this.filteredList = false;
        this.options = this.optionsList;
        this.setAutoHeight = false;
    }
}
