export const  TileConfigurations  =[  
	
	{	
	   "type": "productOffer",
	   "imageName": "productOffer",
	   "barColor": "productOffer",
	   "menuList": [{"key" :"TEXT_EDIT_AVAILABILITY", "name" : "editAvailability"}],
	   "displayFeildsList": [ "displayName", "availStartDate", "availEndDate"]
    },
    {
    	"type": "bundle",
		"imageName": "bundle",
		"barColor": "bundle",
		"menuList": [{"key" :"TEXT_EDIT_AVAILABILITY", "name" : "editAvailability"}],
		"displayFeildsList": [ "displayName", "availStartDate", "availEndDate"]
    },
    {
    	"type": "priceableItem",
		"imageName": "priceableItem",
		"barColor": "priceableItem",
		"menuList": [{"key" :"TEXT_EDIT_AVAILABILITY", "name" : "editAvailability"}],
		"displayFeildsList": [ "displayName", "availStartDate", "availEndDate"]
    },
   
];

export const  data = [
	{
		"type": "productOffer",
		"displayValues": ["Product Offer","21-03-2017 - "],
		"displayName": "Copy Of Revenue Share",
		"availStartDate": "21-03-2017",
		"availEndDate": null,
		"isChildElement": false,
		"childElementsNumber": 100,
		"id": 1,
		"isEditable": false							
	},
	{
		"type": "productOffer",
		"displayValues": ["Product Offer","21-03-2017 - "],
		"displayName": "Copy Of Revenue Share Revenue Share",
		"availStartDate": null,
		"availEndDate": null,
		"isChildElement": true,
		"childElementsNumber": 100,		
		"id": 31,
		"isEditable": true
							
	},
	{
		"type": "priceableItem",
		"displayValues": ["Product Offer","21-03-2017 - "],
		"displayName": "Copy Of Revenue Share ty",
		"availStartDate":  "21-03-2017",
		"availEndDate":  "21-09-2017",
		"isChildElement": true,
		"childElementsNumber": 100,		
		"startDate": "",
		"endDate":	"31-12-2017",
		"id": 32,
	    "isEditable": true							
	},
	{
		"type": "productOffer",
		"displayValues": ["Product Offer","21-03-2017 - "],
		"displayName": "Copy Of Revenue Share",
		"availStartDate": null,
		"availEndDate": null,
		"isChildElement": true,
		"childElementsNumber": 100,				
		"startDate": "21-09-2017",
		"endDate":	"31-12-2017",
		"id": 33,
		"isEditable": true
							
	},
	{	
		"type": "bundle",
		"displayValues": ["Product Offer","21-03-2017 - "],
		"displayName": "Copy Of Revenue Share",
		"availStartDate":  "21-03-2017",
		"availEndDate": null,
		"childElementsNumber": 1000,
		"editable": false,
		"id": 2,
		"isEditable": true		
	}
];
