var testdata = require('../../../inputs/testdata/POdetails.json');

import { browser, by, element } from 'protractor';


describe('widget', function () {
    

  it('PO details page', function () {
      //browser.get('https://10.200.166.70:8074/ProductCatalog/ProductOffer/7366');
      //browser.sleep(1000);
      //browser.driver.manage().window().maximize(); 
     expect(element(by.xpath("//ecb-breadcrumb/div[2]/h1")).isDisplayed()).toBe(true);
           
           browser.sleep(500);
           expect(element(by.xpath("//ecb-breadcrumb/div[2]/h1")).isDisplayed()).toBe(true);
          
         var properties =  element(by.xpath("//app-properties/div[2]/div[2]/form/div/div[1]/label"));
          properties.isPresent().then(function (result){
         if(result){
           expect(element(by.xpath("//app-properties/div[2]/div[1]/div/h2")).getText()).toEqual('Properties');
           expect(element(by.xpath("//app-properties/div[2]/div[2]/form/div/div[1]/label")).getText()).toEqual('Name');
           expect(element(by.xpath("//app-properties/div[2]/div[2]/form/div/div[1]/div/input")).isDisplayed()).toBe(true);
         
          
           expect(element(by.xpath("//app-properties/div[2]/div[2]/form/div/div[2]/label")).getText()).toEqual('Display Name');
           expect(element(by.xpath("//app-properties/div[2]/div[2]/form/div/div[2]/div/input")).isDisplayed()).toBe(true);
          
           expect(element(by.xpath("//app-properties/div[2]/div[2]/form/div/div[3]/label")).getText()).toEqual('Description');
           expect(element(by.xpath("//app-properties/div[2]/div[2]/form/div/div[3]/input")).isDisplayed()).toBe(true);
          
           expect(element(by.xpath("//app-properties/div[2]/div[2]/form/div/div[4]/label")).getText()).toEqual('Currency');
           expect(element(by.xpath("//app-properties/div[2]/div[2]/form/div/div[4]/input")).isDisplayed()).toBe(true);
          
           expect(element(by.xpath("//app-properties/div[2]/div[2]/form/div/div[5]/label")).getText()).toEqual('Effective Start Date');
           expect(element(by.xpath("//app-properties/div[2]/div[2]/form/div/div[5]/input")).isDisplayed()).toBe(true);
       
           expect(element(by.xpath("//app-properties/div[2]/div[2]/form/div/div[6]/label")).getText()).toEqual('Effective End Date');
           expect(element(by.xpath("//app-properties/div[2]/div[2]/form/div/div[6]/input")).isDisplayed()).toBe(true);
           expect(element(by.xpath("//app-properties/div[2]/div[2]/form/div/div[7]/label")).isDisplayed()).toBe(true);
           expect(element(by.xpath("//app-properties/div[2]/div[2]/form/div/div[7]/div/label[1]/span")).isDisplayed()).toBe(true);
           expect(element(by.xpath("//app-properties/div[2]/div[2]/form/div/div[7]/div/label[2]/span")).isDisplayed()).toBe(true);
           expect(element(by.xpath("//app-properties/div[2]/div[2]/form/div/div[8]/label")).isDisplayed()).toBe(true);
           expect(element(by.xpath("//app-properties/div[2]/div[2]/form/div/div[8]/input")).isDisplayed()).toBe(true);
           var edit = element(by.xpath("//app-properties/div[2]/div[1]/div/div/a"));
           edit.isPresent().then(function (result){
               if(result){
            edit.click();
            browser.actions().mouseMove(element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/div[1]/div/h3"))).perform();
         
            expect(element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/form/div/div[1]/div/span")).isDisplayed()).toBe(true);
            element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/form/div/div[1]/div/input")).click();
             element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/form/div/div[1]/div/input")).clear();
             element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/form/div/div[1]/div/input")).sendKeys(testdata.editname);
             expect(element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/form/div/div[2]/div/span")).isDisplayed()).toBe(true);
             element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/form/div/div[2]/div/input")).click();
              element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/form/div/div[2]/div/input")).clear();
             element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/form/div/div[2]/div/input")).sendKeys(testdata.displayname);
           element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/form/div/div[3]/textarea")).click();
           element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/form/div/div[3]/textarea")).clear();
           element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/form/div/div[3]/textarea")).sendKeys(testdata.description); 
           element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/form/div/div[5]/p-calendar/span/input")).click();
           element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/form/div/div[5]/p-calendar/span/div/table/tbody/tr[3]/td[4]/a")).click();
           expect(element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/div[2]/div/span[1]")).isDisplayed()).toBe(true); 
           element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]")).click();
           browser.sleep(500);
           var modaldialog = element(by.xpath("//app-modal-dialog/div/div/div/div[1]/div[1]/div[2]/div"));
           modaldialog.isPresent().then(function (result) {
           if(result){
       browser.actions().mouseMove(element(by.xpath("//app-modal-dialog/div/div/div/div[1]/div[1]/div[2]/div"))).perform();
       //expect(element(by.xpath("//app-modal-dialog/div/div/div/div[1]/div/div[2]/div")).getText()).toEqual(testdata.discardtext);
       element(by.xpath("//app-modal-dialog/div/div/div/div[2]/div/div/button[1]")).click();
       browser.sleep(500);
       element(by.xpath("//app-properties/div[2]/div[1]/div/div/a")).click();
       browser.actions().mouseMove(element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/div[1]/div/h3"))).perform();
     
         element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]")).click();
         browser.sleep(500);
        element(by.xpath("//app-properties/div[2]/div[1]/div/div/a")).click();
          browser.actions().mouseMove(element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/div[1]/div/h3"))).perform();
          
          
        element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/form/div/div[1]/div/input")).click();
        
             element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/form/div/div[1]/div/input")).clear();
             element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/form/div/div[1]/div/input")).sendKeys(testdata.editname);
             //cancel
       element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]")).click();
            browser.actions().mouseMove(element(by.xpath("//app-modal-dialog/div/div/div/div[1]/div[1]/div[2]/div"))).perform();
            element(by.xpath("//app-modal-dialog/div/div/div/div[2]/div/div/button[2]")).click();
           //save
            browser.actions().mouseMove(element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/div[1]/div/h3"))).perform();
            var shown = element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/form/div/div[8]/div/label[1]/input[@ng-reflect-value='true']"));
            shown.isPresent().then(function (result) {
           if(result){
               console.log('po is shown');
           element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/form/div/div[8]/div/label[2]/input")).click();
           var hidepop = element(by.xpath("//app-modal-dialog/div/div/div/div[1]/div/div[2]/div"));
           hidepop.isPresent().then(function (result) {
           if(result){
          browser.actions().mouseMove(element(by.xpath("//app-modal-dialog/div/div/div/div[1]/div/div[2]/div"))).perform();
          element(by.xpath("//app-modal-dialog/div/div/div/div[2]/div/button[1]")).click();     
           }
           else {
             console.log('popup is not came to hide');
           }
           });
           }
           else {
               console.log('po is hidden');
         element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/form/div/div[8]/div/label[1]/input")).click();      
           }
            });
            element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/button[1]")).click();
              browser.sleep(500);
             var error = element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/div[2]/p"));
             error.isPresent().then(function (result) {
           if(result){
               element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/div[2]/button/span[1]")).click();
          browser.sleep(500);
          element(by.xpath("//app-properties/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]")).click();
           browser.sleep(500);
           var modaldialog = element(by.xpath("//app-modal-dialog/div/div/div/div[1]/div[1]/div[2]/div"));
           modaldialog.isPresent().then(function (result) {
           if(result){
       browser.actions().mouseMove(element(by.xpath("//app-modal-dialog/div/div/div/div[1]/div[1]/div[2]/div"))).perform();
       //expect(element(by.xpath("//app-modal-dialog/div/div/div/div[1]/div/div[2]/div")).getText()).toEqual(testdata.discardtext);
       element(by.xpath("//app-modal-dialog/div/div/div/div[2]/div/div/button[1]")).click();
       browser.sleep(500);
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
 
 
    
      
       it('permissionswidget', function() {  
            
           var permissions =   element(by.xpath("//app-permissions/div/div/div[2]/label"));
           permissions.isPresent().then(function (result){
               if(result){
          var widget= element(by.xpath("//h2[contains(text(),'Permissions')]"));
           
          browser.executeScript('arguments[0].scrollIntoView()',widget.getWebElement());
             expect(element(by.xpath("//h2[contains(text(),'Permissions')]")).isDisplayed()).toBe(true);
             expect(element(by.xpath("//app-permissions/div/div/div[2]/label")).getText()).toEqual('Self-Service');
             expect(element(by.xpath("//div[@id='ecb-subscribe'][1]")).isDisplayed()).toBe(true);
       expect(element(by.xpath("//app-permissions/div/div/div[2]/form/div[2]/label/div")).isDisplayed()).toBe(true);
       var editper = element(by.xpath("//app-permissions/div/div/div[1]/div/div/a"));
       editper.isPresent().then(function (result){
           if(result){
               editper.click();
               browser.actions().mouseMove(element(by.xpath("//app-permissions/div/ngx-aside/aside/section/div/div/div[1]/div/h3"))).perform();
       element(by.xpath("//app-permissions/div/ngx-aside/aside/section/div/div/div[2]/form/div[3]/div/p-calendar/span/button/span[1]")).click();
       element(by.xpath("//app-permissions/div/ngx-aside/aside/section/div/div/div[2]/form/div[3]/div/p-calendar/span/button/span[1]")).click();
       //element(by.xpath("//a[@class='ui-state-default ng-tns-c14-239'][1]")).click();
       element(by.xpath("//app-permissions/div/ngx-aside/aside/section/div/div/div[2]/form/div[1]/label/input")).click();
       browser.sleep(500);
       element(by.xpath("//app-permissions/div/ngx-aside/aside/section/div/div/div[2]/form/div[2]/label/input")).click();
       element(by.xpath("//app-permissions/div/ngx-aside/aside/section/div/div/div[2]/form/div[2]/label/input")).click();
      
       element(by.xpath("//app-permissions/div/ngx-aside/aside/section/div/div/div[2]/form/div[1]/label/input")).click();
       element(by.xpath("//app-permissions/div/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]")).click();
        var modaldialogper = element(by.xpath("//app-modal-dialog/div/div/div/div[1]/div[1]/div[2]/div"));
           modaldialogper.isPresent().then(function (result) {
           if(result){
       browser.actions().mouseMove(element(by.xpath("//app-modal-dialog/div/div/div/div[1]/div[1]/div[2]/div"))).perform();
   //expect(element(by.xpath("//app-modal-dialog/div/div/div/div[1]/div/div[2]/div")).getText()).toEqual(testdata.discardtext);
       element(by.xpath("//app-modal-dialog/div/div/div/div[2]/div/div/button[1]")).click();
      
       //element(by.xpath("//app-permissions/div/div/div[1]/div/div/a")).click();
       // browser.actions().mouseMove(element(by.xpath("//app-permissions/div/ngx-aside/aside/section/div/div/div[1]/div/h3"))).perform();
       //element(by.xpath("//app-permissions/div/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]")).click();
       browser.sleep(500);
       element(by.xpath("//app-permissions/div/div/div[1]/div/div/a")).click();
     
       browser.actions().mouseMove(element(by.xpath("//app-permissions/div/ngx-aside/aside/section/div/div/div[1]/div/h3"))).perform();
     
       element(by.xpath("//app-permissions/div/ngx-aside/aside/section/div/div/div[2]/form/div[1]/label/input")).click();
       
       element(by.xpath("//app-permissions/div/ngx-aside/aside/section/div/div/div[2]/form/div[2]/label/input")).click();
   
       element(by.xpath("//app-permissions/div/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]")).click();
         browser.actions().mouseMove(element(by.xpath("//app-modal-dialog/div/div/div/div[1]/div[1]/div[2]/div"))).perform();
       element(by.xpath("//app-modal-dialog/div/div/div/div[2]/div/div/button[2]")).click();
        browser.actions().mouseMove(element(by.xpath("//app-permissions/div/ngx-aside/aside/section/div/div/div[1]/div/h3"))).perform();
        //save
         element(by.xpath("//app-permissions/div/ngx-aside/aside/section/div/div/div[1]/div/div/button[1]")).click();
           browser.sleep(500);
           var error1= element(by.xpath("//app-permissions/div/ngx-aside/aside/section/div/div/div[2]/p"));
           error1.isPresent().then(function (result) {
           if(result){
            
              element(by.xpath("//app-permissions/div/ngx-aside/aside/section/div/div/div[2]/button/span[1]")).click();
              element(by.xpath("//app-permissions/div/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]")).click();
            var modaldialog1 = element(by.xpath("//app-modal-dialog/div/div/div/div[1]/div[1]/div[2]/div"));
           modaldialog1.isPresent().then(function (result) {
           if(result){
       browser.actions().mouseMove(element(by.xpath("//app-modal-dialog/div/div/div/div[1]/div[1]/div[2]/div"))).perform();
   //expect(element(by.xpath("//app-modal-dialog/div/div/div/div[1]/div/div[2]/div")).getText()).toEqual(testdata.discardtext);
       element(by.xpath("//app-modal-dialog/div/div/div/div[2]/div/div/button[1]")).click();
       browser.sleep(500);
           } else {
               console.log('modal dialog is not there');
           }   
           });
           }
           else {
              console.log('no error is present while saving');
           }
           });
           } else {
    console.log('Modaldialog popup is not present');
           }
           });  
       }
       else {
          console.log('edit is not present for permissions widget');
       }
               });
           } else {
        console.log('error in loading permissions widget');
           }
           });
});

       it('extendedpropertiesswidget', function() {
           
        
          var extendedproperties = element(by.xpath("//ecb-extended-properties/div/div[1]/div[2]/div/form/div[1]/label"));
          extendedproperties.isPresent().then(function (result){
              if(result){
        var widget= element(by.xpath("//h2[contains(text(),'Extended Properties')]"));
           
        browser.executeScript('arguments[0].scrollIntoView()',widget.getWebElement());
        expect(element(by.xpath("//h2[contains(text(),'Extended Properties')]")).isDisplayed()).toBe(true);
        expect(element(by.xpath("//ecb-extended-properties/div/div[1]/div[2]/div/form/div[1]/label")).isDisplayed()).toBe(true);
        expect(element(by.xpath("//ecb-extended-properties/div/div[1]/div[2]/div/form/div[2]/label")).isDisplayed()).toBe(true);
        expect(element(by.xpath("//ecb-extended-properties/div/div[1]/div[2]/div/form/div[3]/label")).isDisplayed()).toBe(true);
        var editextended = element(by.xpath("//ecb-extended-properties/div/div[1]/div[1]/div/div/div/a"));
        editextended.isPresent().then(function(result){
            if(result){
   editextended.click();
   browser.actions().mouseMove(element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[1]/div/div/h3"))).perform();
   element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[2]/div/form/div[1]/input")).click();
   element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[2]/div/form/div[1]/input")).clear();
   element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[2]/div/form/div[1]/input")).sendKeys(testdata.glcode);
  element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
   var modaldialogext = element(by.xpath("//app-modal-dialog/div/div/div/div[1]/div[1]/div[2]/div"));
           modaldialogext.isPresent().then(function (result) {
           if(result){
       browser.actions().mouseMove(element(by.xpath("//app-modal-dialog/div/div/div/div[1]/div[1]/div[2]/div"))).perform();
 //expect(element(by.xpath("//app-modal-dialog/div/div/div/div[1]/div[1]/div[2]/div")).getText()).toEqual(testdata.discardtext);
       element(by.xpath("//app-modal-dialog/div/div/div/div[2]/div/div/button[1]")).click();
       browser.sleep(500);
       element(by.xpath("//ecb-extended-properties/div/div[1]/div[1]/div/div/div/a")).click();
       browser.actions().mouseMove(element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[1]/div/div/h3"))).perform();
       element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
       element(by.xpath("//ecb-extended-properties/div/div[1]/div[1]/div/div/div/a")).click();
       browser.sleep(500);
       browser.actions().mouseMove(element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[1]/div/div/h3"))).perform();
       element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[2]/div/form/div[1]/input")).click();
   element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[2]/div/form/div[1]/input")).clear();
   element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[2]/div/form/div[1]/input")).sendKeys(testdata.glcode);
    element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
    browser.actions().mouseMove(element(by.xpath("//app-modal-dialog/div/div/div/div[1]/div[1]/div[2]/div"))).perform();
    element(by.xpath("//app-modal-dialog/div/div/div/div[2]/div/div/button[2]")).click();
    browser.actions().mouseMove(element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[1]/div/div/h3"))).perform();
    element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[1]/div/div/div/button[1]")).click();
          browser.sleep(500);
  var errorext = element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[2]/div/div/p"));
  errorext.isPresent().then(function (result) {
           if(result){
               browser.sleep(500);
     element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[2]/div/div/button/span[1]")).click();
     element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
   var modaldialogexte = element(by.xpath("//app-modal-dialog/div/div/div/div[1]/div[1]/div[2]/div"));
           modaldialogexte.isPresent().then(function (result) {
           if(result){
       browser.actions().mouseMove(element(by.xpath("//app-modal-dialog/div/div/div/div[1]/div[1]/div[2]/div"))).perform();
 //expect(element(by.xpath("//app-modal-dialog/div/div/div/div[1]/div[1]/div[2]/div")).getText()).toEqual(testdata.discardtext);
       element(by.xpath("//app-modal-dialog/div/div/div/div[2]/div/div/button[1]")).click();
       browser.sleep(500);
           } else {
              console.log('modal dialog is not present');
           }
           });
           } else {
              console.log('error is not present while saving');
           }
  });
           } else {
    console.log('Modaldialog popup is not present');
           }
           });  
            } else {
           console.log('Edit option is not there for extended properties');
            }
        });
              } else {
              console.log('no data is populating in extended properties widget');
              }
          });
        }); 
      
    
       
}); 

