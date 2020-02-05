var testdata = require('../inputs/testdata/subscriptioninuseofferings.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {

      it('subscriptionproperties in use offerings  widget', function() {
          browser.sleep(5000);
          

     var inuse = element(by.xpath("//div[@class='text-right ecb-cursorPointer'][1]"));
     inuse.isPresent().then(function (result) {
      if (result) {  
           browser.sleep(3000);
           element(by.xpath("//div[@class='text-right ecb-cursorPointer'][1]/a")).click();
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
             } else {
                console.log('second row is not present nop need to sort and filter');
                 browser.sleep(1000);
                // clicking cross icon
          element(by.xpath("//ecb-subscription-property-details/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[1]/button/span[1]")).click();
          browser.sleep(3000);
             }
                 });
         
      } else {
         console.log('when we click on inuse offerings popup is not came with details');
      }
      });
      } else {
       console.log('in use offerings are not there');
      }
     });
      });
});