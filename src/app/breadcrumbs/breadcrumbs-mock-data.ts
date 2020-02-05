import { Injectable } from '@angular/core';

@Injectable()

export class BreadcrumbService {
	Dashboard: string = 'dahboard';
	breadcrumb: Array<any> =
		[
			/*{
				'path': '/ProductCatalog',
				'type': 'link',
				'name': 'TEXT_DASHBOARD',
				'pId':1,
				'children':[]
			},*/
		{
				'path': '/ProductCatalog',
				'type': 'dropdown',
				'displayName': 'TEXT_PRODUCT_CATALOG',
				'pId': 2,
				'id': 0,
				'children': [
					/*{
						'type': 'link',
						'name': 'TEXT_PACKAGING_WORKSPACE',
						  'active':false,
						  'path': 'PackagingWorkspace',
						  'childId':1,
						  'pId':3,
						  'id':0,
					},*/
					{
						'type': 'link',
						'displayName': 'TEXT_SUBSCRIBABLE_ITEMS',
						'active': false,
						'path': 'Offerings',
						'id': 0,
						'imageType': ''
					},
					{
						'type': 'link',
						'displayName': 'TEXT_LOCALIZATION',
						'active': false,
						'path': 'Localization',
						'id': 0,
						'imageType': ''
					},
					{
						'type': 'link',
						'displayName': 'TEXT_SHARED_RATES',
						'active': false,
						'path': 'SharedRatelist',
						'id': 0,
						'imageType': ''
					},
					{
						'type': 'link',
						'displayName': 'TEXT_SUBSCRIPTION_PROPERTIES',
						'active': false,
						'path': 'SubscriptionProperties',
						'id': 0,
						'imageType': ''
					},
					{
						"type": "link",
						"displayName": "TEXT_AUDIT_LOG",
						"active": false,
						"path": "AuditLog",
						"id": 0,
						"imageType": ''
					},
					{
						"type": "link",
						"displayName": "TEXT_PI_TEMPLATES",
						"active": false,
						"path": "PriceableItemTemplates",
						"id": 0,
						"imageType": ''
					},
					{
						"type": "link",
						"displayName": "TEXT_MORE_ADJUSTMENTS_REASONS",
						"active": false,
						"path": "AdjustmentReasonsGrid",
						"id": 0,
						"imageType": ''
					},
					{
						'type': 'link',
						'displayName': 'TEXT_CALENDARS',
						'active': false,
						'path': 'Calendars',
						'id': 0,
						'imageType': ''
					}
					]
				},
			{
				"type": "link",
				"displayName": "TEXT_SUBSCRIBABLE_ITEMS",
				"active": false,
				"path": "Offerings",
				"id": 0,
				"imageType": ''
			}];
	constructor() { }

	getbreadcrumbData() {
		return this.breadcrumb;
	}
}

  /*getChildList(){
  	console.log('getChildList');
  	return this._http.get('/assets/extdata/finalList.json')
      .map(response => response.json())
      .subscribe(
        (result) => {
          console.log('final');
          console.log(result.offerings);
          this.finaljson = result.offerings;
        },
        (error) => {
       	  this.error = error;
        }
    );
  }
}*/
