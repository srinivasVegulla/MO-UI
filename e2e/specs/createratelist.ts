 var testdata = require('../inputs/testdata/createratelist.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {
    it('create shared rates', function() {

        browser.sleep(5000);
         var createlink = element(by.xpath("//span[contains(text(),'Create Ratelist')]"));
          createlink.isPresent().then(function (result){
         if(result){
             createlink.click();
             browser.sleep(2000);
             var popup = element(by.xpath("//h3[contains(text(),'Create Ratelist')]"));
             popup.isPresent().then(function (result){
         if(result){
          browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Create Ratelist')]"))).perform();
          browser.sleep(2000);
          //cancel validation
          element(by.xpath("//ecb-createshared-pricelist/div/div/div[1]/div/div/button[2]")).click();
          browser.sleep(2000);
          createlink.click();
             browser.sleep(2000);
             browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Create Ratelist')]"))).perform();
             element(by.xpath("//ecb-createshared-pricelist/div/div/form/div/div[1]/div/input")).click();
             element(by.xpath("//ecb-createshared-pricelist/div/div/form/div/div[1]/div/input")).clear();
             element(by.xpath("//ecb-createshared-pricelist/div/div/form/div/div[1]/div/input")).sendKeys(testdata.createname);
             element(by.xpath("//ecb-createshared-pricelist/div/div/form/div/div[2]/textarea")).click();
             browser.sleep(2000);
           

                
             element(by.xpath("//ecb-createshared-pricelist/div/div/form/div/div[2]/textarea")).sendKeys(testdata.description);
         
             // cancel without save
             element(by.xpath("//ecb-createshared-pricelist/div/div/div[1]/div/div/button[2]")).click();
             var popupcancel = element(by.xpath("//ecb-createshared-pricelist/div/ecb-modal-dialog/div/div/div/div[1]/div[2]/div[1]/dialog-header"));
             popupcancel.isPresent().then(function (result){
         if(result){
             browser.actions().mouseMove(element(by.xpath("//ecb-createshared-pricelist/div/ecb-modal-dialog/div/div/div/div[1]/div[2]/div[1]/dialog-header"))).perform();
             browser.sleep(2000);
             element(by.xpath("//ecb-createshared-pricelist/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]")).click();
             browser.sleep(2000);
             createlink.click();
             browser.sleep(2000);
             browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Create Ratelist')]"))).perform();
             element(by.xpath("//ecb-createshared-pricelist/div/div/form/div/div[1]/div/input")).click();
             element(by.xpath("//ecb-createshared-pricelist/div/div/form/div/div[1]/div/input")).clear();
             element(by.xpath("//ecb-createshared-pricelist/div/div/form/div/div[1]/div/input")).sendKeys(testdata.createname);
             element(by.xpath("//ecb-createshared-pricelist/div/div/form/div/div[2]/textarea")).click();
             browser.sleep(1000);

             
             element(by.xpath("//ecb-createshared-pricelist/div/div/form/div/div[2]/textarea")).sendKeys(testdata.description);
             element(by.xpath("//select[@id='test']")).click();
             browser.sleep(1000);
             element(by.xpath("//select[@id='test']/option[170]")).click();
             
             element(by.xpath("//select[@name='Partition']")).click();
             element(by.xpath("//ecb-createshared-pricelist/div/div/form/div/div[4]/div/select/option")).click();
             browser.sleep(1000);
               // if the name is already in use
               var correction = element(by.xpath("//span[contains(text(),'This name is already in use')]"));
               correction.isPresent().then(function (result){
           if(result){
                element(by.xpath("//ecb-createshared-pricelist/div/div/form/div/div[1]/div/input")).click();
               element(by.xpath("//ecb-createshared-pricelist/div/div/form/div/div[1]/div/input")).clear();
               element(by.xpath("//ecb-createshared-pricelist/div/div/form/div/div[1]/div/input")).sendKeys(testdata.anothercreatename);
               browser.sleep(3000);
              element(by.xpath("//ecb-createshared-pricelist/div/div/div[1]/div/div/button[2]")).click();
              browser.actions().mouseMove(element(by.xpath("//ecb-createshared-pricelist/div/ecb-modal-dialog/div/div/div/div[1]/div[2]/div[1]/dialog-header"))).perform();
             browser.sleep(2000);
             // return
             element(by.xpath("//ecb-createshared-pricelist/div/ecb-modal-dialog/div/div/div/div[2]/div/button[2]")).click();
             browser.sleep(2000);
              browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Create Ratelist')]"))).perform();
              var correction1 = element(by.xpath("//span[contains(text(),'This name is already in use')]"));
              correction1.isPresent().then(function (result){
          if(result){
             element(by.xpath("//ecb-createshared-pricelist/div/div/div[1]/div/div/button[2]")).click();
             var popupcancel = element(by.xpath("//ecb-createshared-pricelist/div/ecb-modal-dialog/div/div/div/div[1]/div[2]/div[1]/dialog-header"));
             popupcancel.isPresent().then(function (result){
         if(result){
             browser.actions().mouseMove(element(by.xpath("//ecb-createshared-pricelist/div/ecb-modal-dialog/div/div/div/div[1]/div[2]/div[1]/dialog-header"))).perform();
             browser.sleep(2000);
             element(by.xpath("//ecb-createshared-pricelist/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]")).click();
             browser.sleep(2000);
             
         } else {
             console.log('popup is not came for cancel');
         }
     });
          } else {
             console.log('name already exist text not came for the second time');
           //save 
           element(by.xpath("//ecb-createshared-pricelist/div/div/div[1]/div/div/button[1]")).click();
           browser.sleep(6000);
          }
         });
              
           } else {
                  console.log('popup is not came for correct of name already in use');
                 //save 
           element(by.xpath("//ecb-createshared-pricelist/div/div/div[1]/div/div/button[1]")).click();
           browser.sleep(6000);
           }
        });
             
         } else{
            console.log('popup is not came for cancel');
         }
             });

            

         }  else {
           console.log('popup is came for create ');
         }
             });
         } else {
          console.log('create link is not there')
         } 
          });
     }); 
});