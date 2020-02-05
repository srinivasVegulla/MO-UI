var testdata = require('../inputs/testdata/subscriptionpropertiesgrid.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {

      it('subscriptionproperties grid  widget', function() {
    
         browser.sleep(2000);
         element(by.xpath("//span[@id='breadcrumbExpDivs']")).click();
         browser.sleep(2000);
          element(by.xpath("//a[contains(text(),'Subscription Properties')]")).click();
          browser.sleep(10000);
         
  var table = element(by.xpath("//em[@class='fa fa-plus']"));
  table.isPresent().then(function (result) {
      if (result) {
      
   table.click();
   browser.sleep(3000);
   var createpopup = element(by.xpath("//ecb-create-subscription-property/div/div[1]/div/h3"));
     createpopup.isPresent().then(function (result) {
      if (result) {
       browser.actions().mouseMove(element(by.xpath("//ecb-create-subscription-property/div/div[1]/div/h3"))).perform();
       browser.sleep(1000);
      // selection of category
         element(by.xpath("//ecb-create-subscription-property/div/form/div/ecb-combobox/div/div/div/div/button/span")).click();
     browser.sleep(2000);
element(by.xpath("//ecb-create-subscription-property/div/form/div/ecb-combobox/div/div/div/div/ul/li[2]/a")).click();
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
     browser.sleep(4000);
     table.click();
     browser.sleep(2000);
       browser.actions().mouseMove(element(by.xpath("//ecb-create-subscription-property/div/div[1]/div/h3"))).perform();
       browser.sleep(1000);
       // clicking on cancel
       element(by.xpath("//ecb-create-subscription-property/div/div[1]/div/div/button[2]")).click();
       browser.sleep(2000);
      table.click();
      browser.sleep(2000);
       browser.actions().mouseMove(element(by.xpath("//ecb-create-subscription-property/div/div[1]/div/h3"))).perform();
       browser.sleep(1000);
        // selection of category
         element(by.xpath("//ecb-create-subscription-property/div/form/div/ecb-combobox/div/div/div/div/button/span")).click();
     browser.sleep(2000);
element(by.xpath("//ecb-create-subscription-property/div/form/div/ecb-combobox/div/div/div/div/ul/li[2]/a")).click();
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
       // name already exist
       var already = element(by.xpath("//span[contains(text(),'This name is already in use')]"));
        already.isPresent().then(function (result) {
      if (result) {
         element(by.xpath("//ecb-create-subscription-property/div/form/div/div[1]/div/input")).click();
        element(by.xpath("//ecb-create-subscription-property/div/form/div/div[1]/div/input")).clear();
        element(by.xpath("//ecb-create-subscription-property/div/form/div/div[1]/div/input")).sendKeys(testdata.anothername);
          browser.sleep(2000);
    }
      else {
        console.log('name already exist text is not came');
      }
      });
        element(by.xpath("//select[@id='test']")).click();
        element(by.xpath("//select[@id='test']/option[1]")).click();
      browser.actions().mouseMove(element(by.xpath("//ecb-create-subscription-property/div/form/div/div[4]/div[2]/input"))).perform();
       browser.sleep(1000);
       element(by.xpath("//ecb-create-subscription-property/div/form/div/div[4]/div[2]/input")).click();
        browser.sleep(1000);
       element(by.xpath("//ecb-create-subscription-property/div/div[1]/div/div/button[1]")).click();
       browser.sleep(4000);
     var error = element(by.xpath("//ecb-create-subscription-property/div/div[2]/p"));
      error.isPresent().then(function (result) {
      if (result) {
       browser.actions().mouseMove(element(by.xpath("//ecb-create-subscription-property/div/div[2]/p"))).perform();
       browser.sleep(3000);
       element(by.xpath("//ecb-create-subscription-property/div/div[2]/button/span[1]")).click();
       browser.sleep(2000);
       // cancel
         element(by.xpath("//ecb-create-subscription-property/div/div[1]/div/div/button[2]")).click();
       browser.sleep(2000);
        var cancelwithoutsave = element(by.xpath("//ecb-create-subscription-property/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"));
       cancelwithoutsave.isPresent().then(function (result) {
      if (result) {
        browser.actions().mouseMove(element(by.xpath("//ecb-create-subscription-property/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
         browser.sleep(2000);
        
     element(by.xpath("//ecb-create-subscription-property/ecb-modal-dialog/div/div/div/div[2]/div/button[1]")).click();
     browser.sleep(4000);
      } else {
       console.log('cancel without save popup not came while canceling');
      }
       });
      } else {
       console.log('error not came while saving subscription properties');
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

      // filtering
       element(by.xpath("//ecb-subscription-property-details/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]")).click();
       browser.sleep(1000);
        element(by.xpath("//ecb-subscription-property-details/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]")).click();
        // sorting
        element(by.xpath("//ecb-subscription-property-details/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input")).click();
        element(by.xpath("//ecb-subscription-property-details/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input")).sendKeys(testdata.searchcategory);
       browser.sleep(2000);
     element(by.xpath("//ecb-subscription-property-details/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/div/div/em")).click();
     browser.sleep(2000);
    // browser.actions().mouseMove(element(by.xpath("//ecb-subscription-property-details/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[5]/p-dropdown/div/label"))).perform();
       // browser.sleep(2000);
        element(by.xpath("//ecb-subscription-property-details/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[5]/ecb-dropdown/select")).click();
        browser.sleep(2000);
        var typedropdown = element(by.xpath("//ecb-subscription-property-details/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[5]/ecb-dropdown/select/option[3]"));
        typedropdown.isPresent().then(function (result) {
      if (result) {
         element(by.xpath("//ecb-subscription-property-details/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[5]/ecb-dropdown/select/option[3]")).click();
         browser.sleep(3000);


       } else {
       console.log(' options are not present in the dropdown to select type ');
      }
        });  
      //  browser.actions().mouseMove(element(by.xpath("//ecb-subscription-property-details/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[6]/p-dropdown/div/label"))).perform();
       // browser.sleep(2000);
        element(by.xpath("//ecb-subscription-property-details/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[6]/ecb-dropdown/select")).click();
        browser.sleep(2000);
        var visibilitydropdown = element(by.xpath("//ecb-subscription-property-details/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[6]/ecb-dropdown/select/option[4]"));
        visibilitydropdown.isPresent().then(function (result) {
      if (result) {
        element(by.xpath("//ecb-subscription-property-details/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[6]/ecb-dropdown/select/option[4]")).click();
        browser.sleep(3000);
      } else {
        console.log('options are not present in the dropdown to select visibility');
      }
  });
  //browser.actions().mouseMove(element(by.xpath("//ecb-subscription-property-details/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[7]/p-dropdown/div/label"))).perform();
 // browser.sleep(2000);
  element(by.xpath("//ecb-subscription-property-details/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[7]/ecb-dropdown/select")).click();
  browser.sleep(2000);
  var editingdropdown = element(by.xpath("//ecb-subscription-property-details/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[7]/ecb-dropdown/select/option[3]"));
        editingdropdown.isPresent().then(function (result) {
      if (result) {
        element(by.xpath("//ecb-subscription-property-details/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[7]/ecb-dropdown/select/option[3]")).click();
        browser.sleep(3000);
      } else {  
        console.log('options are not present in the dropdown to select ');
      }
  });  
       // refresh icon ingrid
       element(by.xpath("//ecb-subscription-property-details/div[1]/div/div/span/em")).click();
       browser.sleep(5000);
   
      } else {
       console.log('table is not present, so could not sort or filter');
      }
  });

      });
});