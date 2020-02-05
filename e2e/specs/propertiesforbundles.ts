var testdata = require('../inputs/testdata/propertiesforbundles.json');

import { browser, by, element } from 'protractor';


describe('widget', function () {
    

  it('PO details page', function () {
     browser.sleep(5000);

     
    var properties =  element(by.xpath("//ecb-properties/div[2]/div[2]/form/div/div[1]/label"));
          properties.isPresent().then(function (result){
         if(result){ 
           expect(element(by.xpath("//ecb-properties/div[2]/div[1]/div/h2")).getText()).toEqual(testdata.propertiesheading);
           expect(element(by.xpath("//ecb-properties/div[2]/div[2]/form/div[1]/label")).getText()).toEqual(testdata.name);
          

          
           expect(element(by.xpath("//ecb-properties/div[2]/div[2]/form/div[2]/label")).getText()).toEqual(testdata.displaynametext);
          
          
           expect(element(by.xpath("//ecb-properties/div[2]/div[2]/form/div[3]/label")).getText()).toEqual(testdata.descriptiontext);
       
          
           expect(element(by.xpath("//ecb-properties/div[2]/div[2]/form/div[4]/label")).getText()).toEqual(testdata.currency);
          
          
           expect(element(by.xpath("//ecb-properties/div[2]/div[2]/form/div[5]/label")).getText()).toEqual(testdata.effstartdate);
        
       
           expect(element(by.xpath("//ecb-properties/div[2]/div[2]/form/div[6]/label")).getText()).toEqual(testdata.effenddate);
           
           expect(element(by.xpath("//ecb-properties/div[2]/div[2]/form/div[7]/label")).isDisplayed()).toBe(true);
        
           expect(element(by.xpath("//ecb-properties/div[2]/div[2]/form/div[8]/label")).isDisplayed()).toBe(true);
       
           var edit = element(by.xpath("//ecb-properties/div[2]/div[1]/div/div/a"));
           edit.isPresent().then(function (result){
               if(result){
            edit.click();
            browser.actions().mouseMove(element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/h2"))).perform();
         

           
             expect(element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div/span")).isDisplayed()).toBe(true);
             element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div/div[2]/div/input")).click();
              element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div/div[2]/div/input")).clear();
             element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div/div[2]/div/input")).sendKeys(testdata.displayname);
           element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div/div[3]/textarea")).click();
           element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div/div[3]/textarea")).clear();
           element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div/div[3]/textarea")).sendKeys(testdata.description); 
    
          
           element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
           browser.sleep(3000);
           var modaldialog = element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"));
           modaldialog.isPresent().then(function (result) {
           if(result){
       browser.actions().mouseMove(element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"))).perform();
      
       element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]")).click();
       browser.sleep(3000);
       element(by.xpath("//ecb-properties/div[2]/div[1]/div/div/a")).click();
       browser.actions().mouseMove(element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/h2"))).perform();
         browser.sleep(2000);
         element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
         browser.sleep(3000);
        element(by.xpath("//ecb-properties/div[2]/div[1]/div/div/a")).click();
          browser.actions().mouseMove(element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/h2"))).perform();
          
          
       // display name
          element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div/div[2]/div/input")).click();
              element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div/div[2]/div/input")).clear();
             element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div/div[2]/div/input")).sendKeys(testdata.displayname);
             //cancel
       element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
            browser.actions().mouseMove(element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"))).perform();
            element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[2]")).click();
            browser.sleep(3000);
           //save
            browser.actions().mouseMove(element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/h2"))).perform();
           browser.sleep(2000);
       
            element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[1]")).click();
              browser.sleep(5000);
             var error = element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div/div[2]/p"));
             error.isPresent().then(function (result) {
           if(result){
               element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div/div[2]/button/span[1]")).click();
          browser.sleep(3000);
          element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
           browser.sleep(3000);
           var modaldialog = element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"));
           modaldialog.isPresent().then(function (result) {
           if(result){
       browser.actions().mouseMove(element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"))).perform();
      
       element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]")).click();
       browser.sleep(5000);
           }
   else {
        console.log('modal popup is not came');
   }
           });
           }
           else {
             console.log('error not came');
           }
             });
           } else {
    console.log('Modaldialog popup is not present');
           }
           });
               }else {
                console.log('Edit option is not there for properties');
               }
           });
         } else {
             console.log(' error in loading properties widget');
         }
           });
 }); 
 
});