var testdata = require('../inputs/testdata/createsubscriptionproperties.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {

      it(' create subscriptionproperties  widget', function() {
          
          browser.sleep(5000);
        

          var createlink = element(by.xpath("//ecb-subscription-property-details/div[1]/div/div/a/span"));
          createlink.isPresent().then(function (result) {
      if (result) {
     createlink.click();
     browser.sleep(2000);  
     var createpopup = element(by.xpath("//ecb-create-subscription-property/div/div[1]/div/h3"));
     createpopup.isPresent().then(function (result) {
      if (result) {
       browser.actions().mouseMove(element(by.xpath("//ecb-create-subscription-property/div/div[1]/div/h3"))).perform();
       browser.sleep(1000);
      // selection of category
      element(by.xpath("//ecb-create-subscription-property/div/form/div/ecb-combobox/div/div/div/div/button/span")).click();
      browser.sleep(2000);
      element(by.xpath("//ecb-create-subscription-property/div/form/div/ecb-combobox/div/div/div/div/ul/li[1]/a")).click();
      browser.sleep(2000);

       element(by.xpath("//ecb-create-subscription-property/div/form/div/div[1]/div/input")).click();
        element(by.xpath("//ecb-create-subscription-property/div/form/div/div[1]/div/input")).clear();
        element(by.xpath("//ecb-create-subscription-property/div/form/div/div[1]/div/input")).sendKeys(testdata.name);
       // clicking on cancel- cancel without save
       element(by.xpath("//ecb-create-subscription-property/div/div[1]/div/div/button[2]")).click();
       browser.sleep(2000);
       var cancelwithoutsave = element(by.xpath("//ecb-create-subscription-property/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"));
       cancelwithoutsave.isPresent().then(function (result) {
      if (result) {
        browser.actions().mouseMove(element(by.xpath("//ecb-create-subscription-property/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
         browser.sleep(2000);

     element(by.xpath("//ecb-create-subscription-property/ecb-modal-dialog/div/div/div/div[2]/div/button[1]")).click();
     browser.sleep(3000);
      element(by.xpath("//ecb-subscription-property-details/div[1]/div/div/a/span")).click();
       browser.actions().mouseMove(element(by.xpath("//ecb-create-subscription-property/div/div[1]/div/h3"))).perform();
       browser.sleep(1000);
       // clicking on cancel
       element(by.xpath("//ecb-create-subscription-property/div/div[1]/div/div/button[2]")).click();
       browser.sleep(2000);
       element(by.xpath("//ecb-subscription-property-details/div[1]/div/div/a/span")).click();
       browser.actions().mouseMove(element(by.xpath("//ecb-create-subscription-property/div/div[1]/div/h3"))).perform();
       browser.sleep(1000);
       // selection of category
      element(by.xpath("//ecb-create-subscription-property/div/form/div/ecb-combobox/div/div/div/div/button/span")).click();
      browser.sleep(2000);
      element(by.xpath("//ecb-create-subscription-property/div/form/div/ecb-combobox/div/div/div/div/ul/li[1]/a")).click();
      browser.sleep(2000);

       element(by.xpath("//ecb-create-subscription-property/div/form/div/div[1]/div/input")).click();
        element(by.xpath("//ecb-create-subscription-property/div/form/div/div[1]/div/input")).clear();
        element(by.xpath("//ecb-create-subscription-property/div/form/div/div[1]/div/input")).sendKeys(testdata.name);
          // cliking on cancel-  return functionality
          element(by.xpath("//ecb-create-subscription-property/div/div[1]/div/div/button[2]")).click();
       browser.sleep(2000);
       var returnpopup = element(by.xpath("//ecb-create-subscription-property/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"));
       returnpopup.isPresent().then(function (result) {
      if (result) {
        browser.actions().mouseMove(element(by.xpath("//ecb-create-subscription-property/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
         browser.sleep(2000);

     element(by.xpath("//ecb-create-subscription-property/ecb-modal-dialog/div/div/div/div[2]/div/button[2]")).click();
     browser.sleep(3000);
    browser.actions().mouseMove(element(by.xpath("//ecb-create-subscription-property/div/div[1]/div/h3"))).perform();
       browser.sleep(2000);
       element(by.xpath("//ecb-create-subscription-property/div/form/div/div[2]/textarea")).click();
       element(by.xpath("//ecb-create-subscription-property/div/form/div/div[2]/textarea")).sendKeys(testdata.description);
       browser.sleep(1000);
       element(by.xpath("//ecb-create-subscription-property/div/form/div/div[4]/div[1]/input")).click();
       element(by.xpath("//ecb-create-subscription-property/div/form/div/div[4]/div[1]/input")).sendKeys(testdata.defaultvalue);
       browser.sleep(3000);
       
       
         element(by.xpath("//select[@id='test']")).click();
        element(by.xpath("//select[@id='test']/option[1]")).click();
      browser.actions().mouseMove(element(by.xpath("//ecb-create-subscription-property/div/form/div/div[4]/div[2]/input"))).perform();
       browser.sleep(2000);
       element(by.xpath("//ecb-create-subscription-property/div/form/div/div[4]/div[2]/input")).click();
        browser.sleep(2000);
       element(by.xpath("//div[@class='ebRadioBtn_last']/label/input")).click();
       browser.sleep(2000);
       element(by.xpath("//input[@value='ENR']")).click();
       browser.sleep(3000);
      
       // save 
       element(by.xpath("//ecb-create-subscription-property/div/div[1]/div/div/button[1]")).click();
       browser.sleep(4000);
       // error scenario
       var error = element(by.xpath("//ecb-create-subscription-property/div/div[2]/p"));
          error.isPresent().then(function (result){
         if(result){
             browser.actions().mouseMove(element(by.xpath("//ecb-create-subscription-property/div/div[2]/p"))).perform();
             browser.sleep(2000);
             element(by.xpath("//ecb-create-subscription-property/div/div[2]/button/span[1]")).click();
             browser.sleep(1000);
             element(by.xpath("//ecb-create-subscription-property/div/div[1]/div/div/button[2]")).click();
             browser.sleep(2000);
         var cancelsave = element(by.xpath("//ecb-create-subscription-property/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"));
         cancelsave.isPresent().then(function (result){
         if(result){
         browser.actions().mouseMove(element(by.xpath("//ecb-create-subscription-property/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
         browser.sleep(2000);
         element(by.xpath("//ecb-create-subscription-property/ecb-modal-dialog/div/div/div/div[2]/div/button[1]")).click();
         browser.sleep(2000);
         } else {
          console.log('popup is not came for cancel button');
         }
         });
         } else {
          console.log('error is not present while saving');
         }
          }); 



} else {
       console.log('return popup not came');
      }
       });
      } else {
      console.log('cancel without save popup not came');
      }
       });


      } else {
          console.log('create popup not came');
      }
     });
      } else {
        console.log('create link is not there');
      }
          });

      });
});