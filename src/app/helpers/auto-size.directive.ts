import { Directive, ElementRef, HostListener, Input, OnInit, OnDestroy } from "@angular/core";
import { utilService } from './util.service';

/* 
####    AutoSize Directive  #####
This is a custom directive to find height of the element and is modified to suit the present requirement. This will calculate height of an element whose content(innerHTML) changes dynamically.

Based on the requirement, the calculated height will be set to an observable which will be utilized wherever required.

DevContact: Yajuteja
*/
@Directive({
    selector: '[autoSize]'
})
export class SetHeightDirective implements OnDestroy {

    observer: any;
    heights: any;
    @Input('autoSize') rowIndex: any;
    @Input() elementNumber: any;

    constructor(public element: ElementRef,
        private _utilService: utilService) { }

    @HostListener('input', ['$event.target'])
    onInput(textArea: HTMLTextAreaElement): void {
        this.adjust();
    }

    ngAfterViewInit() {
        this.heights = {};
        this.adjust();
        if (this.element.nativeElement.localName === 'ul') {
            this.observer = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList') {
                        this.adjust();
                    }
                }
            });
            var config = { attributes: true, childList: true, characterData: true };
            this.observer.observe(this.element.nativeElement, config);
        }
    }

    adjust() {
        setTimeout(() => {
            let tempObj = {};
            let nativeElement = this.element.nativeElement;
            let height = nativeElement.scrollHeight;
            this.heights[this.elementNumber] = height;
            tempObj[this.rowIndex] = this.heights;
            this._utilService.changeHeight(tempObj);
        }, 50);
    }

    ngOnDestroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}