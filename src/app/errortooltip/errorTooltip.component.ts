import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector : 'ecb-errortooltip',
  templateUrl: './errorTooltip.component.html',
  styleUrls: ['./errorTooltip.component.scss']
})

export class ErrorTooltipComponent {
	closeError:boolean = false;
	isCloseIcon:boolean = true;
	@Input('isWarning') isWarning: boolean;
	@Input('isColumnPosition') isColumnPosition: string;

	@Input('text')
   	errorMessage: string;

   @Output('onClose') 
		onClose = new EventEmitter<boolean>();

	@Input() set closeMe(value) {
		if(value == true || value == "true")
			this.closeErrorTooltip();
	}
	
	@Input() set closeIcon(value) {
		value = value == 'true' ? true : (value == 'false' ? false : value);
		this.isCloseIcon = value;
	}
	
	closeErrorTooltip(){
		this.closeError = true;
		this.onClose.emit(this.closeError);
	}
	changeColumnPlacement() {
		if (this.isColumnPosition === 'left') {
            return 'ecb-WarnColumnLeft';
        } else if (this.isColumnPosition === 'right') {
            return 'ecb-WarnColumnRight';
        } else {
            return '';
        }
	}
}
