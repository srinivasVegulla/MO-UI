import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class LoaderService {

    public displayDotLoader = new BehaviorSubject<any>({ show: false });

    constructor() { }

    showDotLoader() {
        this.displayDotLoader.next({ show: true });
    }
    hideDotLoader() {
        this.displayDotLoader.next({ show: false });
    }
}
