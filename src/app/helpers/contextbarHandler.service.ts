import { Component ,Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http, Response } from '@angular/http';
import { Language } from 'angular-l10n';

@Injectable()
export class contextBarHandlerService {
	constructor() {}

	/*enable disable save button in the context bar from create-properties.component.ts flie*/
	private contextbarSaveButton = new BehaviorSubject<boolean>(true);
	observableContextbarSaveButton = this.contextbarSaveButton.asObservable();
	changeContextSaveButton(value:boolean){
    	this.contextbarSaveButton.next(value);
  }
  /*Handling contextbar hidding*/
  private showContextBar = new BehaviorSubject<boolean>(false);
  observableShowContextBar = this.showContextBar.asObservable();
  changeContextBarVisibility(value:boolean){
      this.showContextBar.next(value);
  }
  	/* A message variable to pass on information to create PO components that user submitted the form */
  	public saveProperties = new BehaviorSubject<boolean>(false);
  	public savePermissions = new BehaviorSubject<boolean>(false);
   // public deleteProductOffer = new BehaviorSubject<boolean>(false);
}
