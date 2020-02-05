import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()

export class sharedService {

    public displayName = new BehaviorSubject<string>("");
    currentDisplayName = this.displayName.asObservable();


    changedisplayName(message: string) {
        this.displayName.next(message)
    }

    /*this observable is used to show buttons  in modal popup and handle save and cancel button events
   in localization widget*/
    public localizationUnsavedChangesHandler = new BehaviorSubject<string>("");
    public localizationUnsavedCancelButtonHandler = new BehaviorSubject<boolean>(false);
    changeLocalizationDiscardHandler(value) {
        this.localizationUnsavedCancelButtonHandler.next(value);
    }
}
