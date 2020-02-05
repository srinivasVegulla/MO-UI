import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';

@Component({
    selector: 'ecb-dropdown',
    templateUrl: './dropdown.component.html'
})

export class DropDownComponent implements OnInit {
    optionsList: any[];
    selectedItem: string;

    @Input() options;
    @Input() primaryOption: string;
    @Input() dropDownListType: string;
    @Input() modelValue;

    @Output() changeItem = new EventEmitter();

    @ViewChild('dropdownSelected') dropdownSelected: any;

    constructor() {
     }
    ngOnInit() {
    }
    changeDropdown() {
        this.selectedItem =  this.dropdownSelected.nativeElement.value;
        this.changeItem.emit(this.selectedItem);
    }

    isPlaceholderOption(value){
        if(this.primaryOption && value === this.primaryOption){
            return true;
        }
        else{
            return false;
        }
    }
    
}
