import { Component ,Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http, Response } from '@angular/http';
import { Language } from 'angular-l10n';

@Injectable()
export class modalService {
  constructor() {}
  
  public deleteMessage = new BehaviorSubject<string>("");
  observableDeleteMessage = this.deleteMessage.asObservable();
        changeDeleteMessage(value:string){
        this.deleteMessage.next(value);
     }

     /*public editMessage = new BehaviorSubject<string>("");
  observableEditMessage = this.editMessage.asObservable();
        changeEditMessage(value:string){
        this.editMessage.next(value);
     }*/

  public editRateSource = new BehaviorSubject<boolean>(false);
  editRateSourceObservable = this.editRateSource.asObservable();
  changeEditRateSourcePopup(value){
    this.editRateSource.next(value);
  }
}
