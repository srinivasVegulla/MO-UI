var testdata = require('../inputs/testdata/editsubscriptionproperties.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {

      it('subscriptionproperties edit  widget', function() {
          
          browser.sleep(5000);
            

        var editicon = element(by.xpath("//em[@class='fa fa-pencil'][1]"));
      editicon.isPresent().then(function (result) {
      if (result) {
      editicon.click();
      browser.sleep(4000);
      var panelheading = element(by.xpath("//h3[contains(text(),'Edit Subscription Property')]"));
      panelheading.isPresent().then(function (result) {
      if (result) {
       browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Edit Subscription Property')]"))).perform();
       browser.sleep(3000);
       //clicking cancel
       element(by.xpath("//ecb-create-subscription-property/div/div[1]/div/div/button[2]")).click();
       browser.sleep(3000);
       editicon.click();
      browser.sleep(4000);
      browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Edit Subscription Property')]"))).perform();
       browser.sleep(3000);
      var offerings = element(by.xpath("//span[contains(text(),'This property is a part of')]"));
       offerings.isPresent().then(function (result) {
      if (result) {
          browser.sleep(2000);
          console.log('offerings are present for this subscription properties');
          console.log('so it cannot be edited');
          element(by.xpath("//ecb-create-subscription-property/div/div[2]/div/span/a")).click();
          browser.sleep(3000);
          var popup = element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[1]/h2"));
      popup.isPresent().then(function (result) {
      if (result) {        
       browser.actions().mouseMove(element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[1]/h2"))).perform();
       browser.sleep(2000);
       
                 var second = element(by.xpath("//ecb-subscription-property-details/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[2]/td[2]/span/span"));
                 second.isPresent().then(function(result) {
             if (result) {                       
           // filtering
           element(by.xpath("//ecb-subscription-property-details/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]")).click();
           browser.sleep(2000);
           element(by.xpath("//ecb-subscription-property-details/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]")).click();
           browser.sleep(1000);
           // sorting
           element(by.xpath("//ecb-subscription-property-details/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input")).click();
           element(by.xpath("//ecb-subscription-property-details/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input")).sendKeys(testdata.searchinuseoffering);
           browser.sleep(2000);
           element(by.xpath("//ecb-subscription-property-details/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/div/div/em")).click();
           browser.sleep(2000);
       
         

          // clicking cross icon
          element(by.xpath("//ecb-subscription-property-details/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[1]/button/span[1]")).click();
          browser.sleep(3000);
           browser.actions().mouseMove(element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[1]/h2"))).perform();
       browser.sleep(2000);
          element(by.xpath("//ecb-create-subscription-property/div/div[1]/div/div/button[2]")).click();
          browser.sleep(4000);
             } else {
                console.log('second row is not present nop need to sort and filter');
                browser.sleep(1000);
                // clicking cross icon
          element(by.xpath("//ecb-subscription-property-details/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[1]/button/span[1]")).click();
          browser.sleep(3000);
           browser.actions().mouseMove(element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[1]/h2"))).perform();
       browser.sleep(2000);
         element(by.xpath("//ecb-create-subscription-property/div/div[1]/div/div/button[2]")).click();
          browser.sleep(4000);
             }
                 });
         
      } else {
         console.log('when we click on inuse offerings popup is not came with details');
      }
      });
      } else {
          // for editing 
           browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Edit Subscription Property')]"))).perform();
       browser.sleep(3000);
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
      element(by.xpath("//ecb-subscription-property-details/div[1]/div/div/div/a[2]/span")).click();
       browser.actions().mouseMove(element(by.xpath("//ecb-create-subscription-property/div/div[1]/div/h3"))).perform();
       browser.sleep(1000);
       // clicking on cancel
       element(by.xpath("//ecb-create-subscription-property/div/div[1]/div/div/button[2]")).click();
       browser.sleep(2000);
       element(by.xpath("//ecb-subscription-property-details/div[1]/div/div/div/a[2]/span")).click();
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
       browser.sleep(1000);
       element(by.xpath("//ecb-create-subscription-property/div/form/div/div[2]/textarea")).click();
       element(by.xpath("//ecb-create-subscription-property/div/form/div/div[2]/textarea")).sendKeys(testdata.description);
      
         element(by.xpath("//select[@id='test']")).click();
        element(by.xpath("//select[@id='test']/option[1]")).click();
      browser.actions().mouseMove(element(by.xpath("//ecb-create-subscription-property/div/form/div/div[4]/div[2]/input"))).perform();
       browser.sleep(1000);
       element(by.xpath("//ecb-create-subscription-property/div/form/div/div[4]/div[2]/input")).click();
        browser.sleep(1000);
       element(by.xpath("//div[@class='ebRadioBtn_last']/label/input")).click();
       browser.sleep(1000);
       element(by.xpath("//input[@value='ENR']")).click();
       browser.sleep(2000);
       // save 
       element(by.xpath("//ecb-create-subscription-property/div/div[1]/div/div/button[1]")).click();
       browser.sleep(3000);
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


      }
       });
      } else {
         console.log('edit subscription properties panel is not came');
      }
      });
      } else {
        console.log('edit icon is not there');
      }
      });
      });
});
