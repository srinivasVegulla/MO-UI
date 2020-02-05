import { Component ,Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()

export class POMessageBusService {
	public showUnsavePOModal = new BehaviorSubject<boolean>(false);
	constructor() {}

	
}
