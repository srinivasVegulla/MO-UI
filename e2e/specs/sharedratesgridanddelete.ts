var testdata = require('../inputs/testdata/sharedratesgridanddelete.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {

      it('sharedrates widget', function() {
         
          browser.sleep(2000);
          element(by.xpath("//span[@id='breadcrumbExpDivs']")).click();
          browser.sleep(2000);
          element(by.xpath("//a[contains(text(),'Shared Rates')]")).click();
          browser.sleep(6000);
        
         expect(element(by.xpath("//ecb-shared-pricelist/div/div[1]/h2")).getText()).toEqual(testdata.ratelistsnumber);
          expect(element(by.xpath("//span[contains(text(),'Ratelists')]")).isDisplayed()).toBe(true); 
            
      });
     /*
         it('in use subs and offerings shared rates', function() {
         var table = element(by.xpath("//ecb-shared-pricelist/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[2]/span/a"));
         table.isPresent().then(function (result){
         if(result){ 
             // sorting
             element(by.xpath("//ecb-shared-pricelist/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]")).click();
             browser.sleep(1000);
              element(by.xpath("//ecb-shared-pricelist/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]")).click();
              browser.sleep(1000);
              // filtering
              element(by.xpath("//ecb-shared-pricelist/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input")).click();
              browser.sleep(1000);
              element(by.xpath("//ecb-shared-pricelist/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input")).sendKeys(testdata.searchsharedlist);
            browser.sleep(3000);
            element(by.xpath("//ecb-shared-pricelist/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/div/div/em")).click();
              browser.sleep(1000);
           // currency and partition id
           browser.actions().mouseMove(element(by.xpath("//ecb-shared-pricelist/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[4]/ecb-dropdown/select"))).perform();
           element(by.xpath("//ecb-shared-pricelist/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[4]/ecb-dropdown/select")).click();
           browser.sleep(2000);
           element(by.xpath("//ecb-shared-pricelist/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[4]/ecb-dropdown/select/option[122]")).click();
           browser.sleep(2000);
         
           // refresh icon
           element(by.xpath("//ecb-shared-pricelist/div/div[1]/div/span/em")).click();
           browser.sleep(5000);
           // inuse subscribers and offerings
           var inusesubs = element(by.xpath("//a[contains(text(),'1')]"));
           inusesubs.isPresent().then(function (result){
         if(result){ 

           element(by.xpath("//a[contains(text(),'1')]")).click();
           var popupsubs = element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[1]/h2"));
           popupsubs.isPresent().then(function (result){
         if(result){ 
         browser.actions().mouseMove(element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[1]/h2"))).perform();
         browser.sleep(3000);
        
          // sorting
          element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]")).click();
          browser.sleep(1000);
          element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]")).click();
          browser.sleep(2000);
          // cross icon
          element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[1]/button/span[1]")).click();
          browser.sleep(3000);
        
         
         } else {
        console.log('popup is not came for inuse subscribers');
        
        
           var popupoff = element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[1]/h2/span"));
           popupoff.isPresent().then(function (result){
         if(result){ 
         browser.actions().mouseMove(element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[1]/h2/span"))).perform();
         browser.sleep(3000);
       
          // sorting
          element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]")).click();
          browser.sleep(1000);
          element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]")).click();
          browser.sleep(2000);
          // cross icon
          element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[1]/button/span[1]")).click();
          browser.sleep(3000);
        
         
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
          }
          else {
          console.log('shared rates are  not present');
          }
          });
        });  
        */
           it('delete from grid shared rates', function() {
           var deleteicon = element(by.xpath("//ecb-shared-pricelist/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/a[2]/em[@class='fa fa-times-circle']"));
           deleteicon.isPresent().then(function (result){
         if(result){ 
             deleteicon.click();
             browser.sleep(2000);
             var modalpopup = element(by.xpath("//ecb-shared-pricelist/div/div[2]/ecb-modal-dialog/div/div/div/div[1]/div[2]/div[1]/dialog-header"));
             modalpopup.isPresent().then(function (result){
         if(result){ 
           browser.actions().mouseMove(element(by.xpath("//ecb-shared-pricelist/div/div[2]/ecb-modal-dialog/div/div/div/div[1]/div[2]/div[1]/dialog-header"))).perform();
    
           browser.sleep(2000);
           element(by.xpath("//ecb-shared-pricelist/div/div[2]/ecb-modal-dialog/div/div/div/div[2]/div/button[2]/dialog-button-2")).click();
             browser.sleep(2000);
             deleteicon.click();
              browser.actions().mouseMove(element(by.xpath("//ecb-shared-pricelist/div/div[2]/ecb-modal-dialog/div/div/div/div[1]/div[2]/div[1]/dialog-header"))).perform();

           browser.sleep(2000);
           element(by.xpath("//ecb-shared-pricelist/div/div[2]/ecb-modal-dialog/div/div/div/div[2]/div/button[1]/dialog-button-1")).click();
           browser.sleep(3000);
         } else {
           console.log('modalpopup is not came for delete')
         }
             });
         } else {
            console.log('delete icon is disabled for the first item in grid');
         }
           });  
        
   
      });
  
    
});