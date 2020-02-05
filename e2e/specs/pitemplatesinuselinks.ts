var testdata = require('../inputs/testdata/pitemplates.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {
    it('pitemplates inuse  widget', function() {
      
       // inuse subscribers and offerings
           var inusesubs = element(by.xpath("//div[@class='text-right']/a"));
           inusesubs.isPresent().then(function (result){
         if(result){ 
           element(by.xpath("//div[@class='text-right']/a")).click();
           var popupsubs = element(by.xpath("//ecb-inuse-shared-ratelist/ecb-modal-dialog/div/div/div/div/dialog-body-template/div[1]/h2"));
           popupsubs.isPresent().then(function (result){
         if(result){ 
         browser.actions().mouseMove(element(by.xpath("//ecb-inuse-shared-ratelist/ecb-modal-dialog/div/div/div/div/dialog-body-template/div[1]/h2"))).perform();
         browser.sleep(3000);
          expect(element(by.xpath("//ecb-priceableitem-template/div[1]/ecb-inuse-shared-ratelist/ecb-modal-dialog/div/div/div/div/dialog-body-template/div[1]/div/h3")).getText()).toEqual(testdata.subsheading);
         expect(element(by.xpath("//ecb-priceableitem-template/div[1]/ecb-inuse-shared-ratelist/ecb-modal-dialog/div/div/div/div/dialog-body-template/div[1]/div/h3/span")).getText()).toEqual(testdata.subsnum);

         var second = element(by.xpath("//ecb-priceableitem-template/div[1]/ecb-inuse-shared-ratelist/ecb-modal-dialog/div/div/div/div/dialog-body-template/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[2]/td[1]/span"));
         second.isPresent().then(function (result){
         if(result){ 
             // filtering
             element(by.xpath("//ecb-inuse-shared-ratelist/ecb-modal-dialog/div/div/div/div/dialog-body-template/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[1]/div/input")).click();
             element(by.xpath("//ecb-inuse-shared-ratelist/ecb-modal-dialog/div/div/div/div/dialog-body-template/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[1]/div/input")).sendKeys(testdata.usersearchsubs);
             browser.sleep(2000);
             element(by.xpath("//ecb-inuse-shared-ratelist/ecb-modal-dialog/div/div/div/div/dialog-body-template/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[1]/div/div/div/em")).click();
             browser.sleep(2000);
          // sorting
          element(by.xpath("//ecb-inuse-shared-ratelist/ecb-modal-dialog/div/div/div/div/dialog-body-template/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[1]/span[2]")).click();
          browser.sleep(1000);
          element(by.xpath("//ecb-inuse-shared-ratelist/ecb-modal-dialog/div/div/div/div/dialog-body-template/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[1]/span[2]")).click();
          browser.sleep(2000);
          // cross icon
          element(by.xpath("//ecb-inuse-shared-ratelist/ecb-modal-dialog/div/div/div/div/div[1]/button/span[1]")).click();
          browser.sleep(3000);
         
         } else {
           console.log('only one row is present in the table so unable to sort');
         }
         });
         
         } else {
        console.log('popup is not came for inuse subscribers');
        
        
           var popupoff = element(by.xpath("//ecb-priceableitem-template/div[1]/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/dialog-body-template/div[1]/h2"));
           popupoff.isPresent().then(function (result){
         if(result){ 
         browser.actions().mouseMove(element(by.xpath("//ecb-priceableitem-template/div[1]/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/dialog-body-template/div[1]/h2"))).perform();
         browser.sleep(3000);
         expect(element(by.xpath("//ecb-priceableitem-template/div[1]/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/dialog-body-template/div[2]/h3")).getText()).toEqual(testdata.offheading);
         expect(element(by.xpath("//ecb-priceableitem-template/div[1]/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/dialog-body-template/div[2]/h3/span")).getText()).toEqual(testdata.offnum);
         var secondone = element(by.xpath("//ecb-priceableitem-template/div[1]/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/dialog-body-template/div[4]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[2]/td[2]/span/span"));
         secondone.isPresent().then(function (result){
         if(result){ 
             //filtering
             element(by.xpath("//ecb-priceableitem-template/div[1]/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/dialog-body-template/div[4]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input")).click();
             browser.sleep(1000);
             element(by.xpath("//ecb-priceableitem-template/div[1]/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/dialog-body-template/div[4]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input")).sendKeys(testdata.usersearchoff);
             browser.sleep(2000);
          // sorting
          element(by.xpath("//ecb-priceableitem-template/div[1]/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/dialog-body-template/div[4]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]")).click();
          browser.sleep(1000);
          element(by.xpath("//ecb-priceableitem-template/div[1]/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/dialog-body-template/div[4]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]")).click();
          browser.sleep(2000);
          // bundle and po sorting
            browser.actions().mouseMove(element(by.xpath("//ecb-priceableitem-template/div[1]/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/dialog-body-template/div[4]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[1]/p-dropdown/div/label"))).perform();
            browser.sleep(2000);
            element(by.xpath("//ecb-priceableitem-template/div[1]/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/dialog-body-template/div[4]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[1]/p-dropdown/div/div[3]/span")).click();
            browser.sleep(2000);
            element(by.xpath("//ecb-priceableitem-template/div[1]/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/dialog-body-template/div[4]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[1]/p-dropdown/div/div[4]/div/ul/li[2]")).click();
            browser.sleep(3000);
          // cross icon
          element(by.xpath("//ecb-priceableitem-template/div[1]/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[1]/button/span[1]")).click();
          browser.sleep(3000);
         } else {
           console.log('only one row is present in the table so unable to sort');
         }
         });
         
         } else {
        console.log('popup is not came for inuse offerings');
         }
           });
            }
           });
          
         } else {
            console.log('there ar no inuse subscribers or offerings to click');
         }
           });

  
    });
});
