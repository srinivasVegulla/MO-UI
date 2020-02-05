var screenshots = require('protractor-take-screenshots-on-demand');
var testdata = require('./inputs/testdata/editproductoffer.json');

import { browser, by, element } from 'protractor';
describe('widget', function() {

  // it('Edit product offer widget', function(){
  //   browser.sleep(1000);
  //   let poElement = element(by.xpath("p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[2]"))
  //   poElement.isPresent().then( (result) =>{
  //   if(result){

  //   }
  //   else{
  //     console.log("Product offers are not present.")
  //   }
  //   })
  // })
    it('propertieswidget', function() {
         
           browser.sleep(1000);
           expect(element(by.xpath("//ecb-breadcrumb/div[2]/h1")).isDisplayed()).toBe(true);
           
           browser.sleep(500);
           expect(element(by.xpath("//ecb-breadcrumb/div[2]/h1")).isDisplayed()).toBe(true);
          
           expect(element(by.xpath("//app-properties/div/h2")).getText()).toEqual('Properties');
           expect(element(by.xpath("//app-properties/div/div/form/div[1]/label")).getText()).toEqual('Name');
           expect(element(by.xpath("//app-properties/div/div/form/div[1]/div/input")).isDisplayed()).toBe(true);
         
           expect(element(by.xpath("//app-properties/div/div/form/div[1]/div/span")).isDisplayed()).toBe(true);
           expect(element(by.xpath("//app-properties/div/div/form/div[2]/label")).getText()).toEqual('Display Name');
           expect(element(by.xpath("//app-properties/div/div/form/div[2]/div/input")).isDisplayed()).toBe(true);
           expect(element(by.xpath("//app-properties/div/div/form/div[2]/div/span")).isDisplayed()).toBe(true);
           expect(element(by.xpath("//app-properties/div/div/form/div[3]/label")).getText()).toEqual('Description');
           expect(element(by.xpath("//app-properties/div/div/form/div[3]/input")).isDisplayed()).toBe(true);
          
           expect(element(by.xpath("//app-properties/div/div/form/div[4]/label")).getText()).toEqual('Currency');
           expect(element(by.xpath("//app-properties/div/div/form/div[4]/div/button")).isDisplayed()).toBe(true);
           screenshots.takeScreenshot('data from the backend in product offers');
           expect(element(by.xpath("//app-properties/div/div/form/div[5]/label")).getText()).toEqual('Effective Start Date');
           expect(element(by.xpath("//app-properties/div/div/form/div[5]/div/p-calendar/span/input")).isDisplayed()).toBe(true);
       
           expect(element(by.xpath("//app-properties/div/div/form/div[6]/label")).getText()).toEqual('Effective End Date');
           expect(element(by.xpath("//app-properties/div/div/form/div[6]/div/p-calendar/span/input")).isDisplayed()).toBe(true);
           });
         
      it('priceableitemswidget', function() {
    
             var widget= element(by.xpath("//app-priceable-items/div/div[1]/h2"));
           
            browser.executeScript('arguments[0].scrollIntoView()',widget.getWebElement());
            expect(element(by.xpath("//app-priceable-items/div/div[1]/h2")).getText()).toEqual('Priceable Items');
            expect(element(by.xpath("//h3[contains(text(),'One Time Charges')]")).isDisplayed()).toBe(true);
             expect(element(by.xpath("//h3[contains(text(),'Recurring Charges')]")).isDisplayed()).toBe(true);
             expect(element(by.xpath("//h3[contains(text(),'Usage Charges')]")).isDisplayed()).toBe(true);
           
            screenshots.takeScreenshot('priceable item displayed');
      });
       it('permissionswidget', function() {      
          var widget= element(by.xpath("//h2[contains(text(),'Permissions')]"));
           
          browser.executeScript('arguments[0].scrollIntoView()',widget.getWebElement());
             expect(element(by.xpath("//h2[contains(text(),'Permissions')]")).isDisplayed()).toBe(true);
             expect(element(by.xpath("//app-permissions/div/div[1]/label")).getText()).toEqual('Self-Service');
             element(by.xpath("//app-permissions/div/div[1]/div[1]/label/input[@name='Subscription']")).click();
             expect(element(by.xpath("//app-permissions/div/div[1]/div[1]/label/div[contains(text(),'Subscribe')]")).isDisplayed()).toBe(true);
             element(by.xpath("//app-permissions/div/div[1]/div[2]/label/input[@name='UnSubscription']")).click();
             expect(element(by.xpath("//app-permissions/div/div[1]/div[2]/label/div[contains(text(),'Unsubscribe')]")).isDisplayed()).toBe(true);
             screenshots.takeScreenshot('permissions widget');
           });
      
       it('extendedpropertiesswidget', function() {
        browser.sleep(500);
          
        var widget= element(by.xpath("//h2[contains(text(),'Extended Properties')]"));
           
        browser.executeScript('arguments[0].scrollIntoView()',widget.getWebElement());
        expect(element(by.xpath("//h2[contains(text(),'Extended Properties')]")).isDisplayed()).toBe(true);
        element(by.xpath("//ecb-extended-properties/div/div[2]/div/form/div[1]/input")).sendKeys(testdata.glCode); 
        element(by.xpath("//ecb-extended-properties/div/div[2]/div/form/div[2]/input")).sendKeys(testdata.externalInfURL); 
        element(by.xpath("//ecb-extended-properties/div/div[2]/div/form/div[3]/input")).sendKeys(testdata.internalInfURL); 
        
        screenshots.takeScreenshot('extended properties widget');
        }); 
        
      it('sharedpropertiesswidget', function() {
         browser.sleep(500);
           var widget= element(by.xpath("//app-shared-properties/div/div/div[1]/h2"));
          browser.executeScript('arguments[0].scrollIntoView()',widget.getWebElement());
          expect(element(by.xpath("//div[contains(text(),'No shared properties associated with this Product Offer.')]")).isDisplayed()).toBe(true);
          browser.sleep(500);
          console.log('No shared properties associated with this Product Offer');
          expect(element(by.xpath("//div[@class='ebPageFooter']/div/div/span")).isDisplayed()).toBe(true);
          expect(element(by.xpath("//div[@class='ebPageFooter']/div/div/input")).isDisplayed()).toBe(true);     
        });   
      
  
      
}); 