var testdata = require('../inputs/testdata/poexistencelink.json');

import { browser, by, element } from 'protractor';


describe('widget', function () {
    

  it('PO details page poexistence link', function () {
   
   browser.sleep(5000);
     var poexistense = element(by.xpath("//ecb-product-offer/div[1]/div[1]/div/span"));
     poexistense.isPresent().then(function (result) {
           if(result){
               browser.actions().mouseMove(element(by.xpath("//ecb-product-offer/div[1]/div[1]/div/span"))).perform();
               browser.sleep(3000);
               var link = element(by.xpath("//span[contains(text(), '0  Offerings')]"));
               link.isPresent().then(function (result) {
           if(result){
              console.log('there is no existence of offers in this po');
              browser.navigate().back();
              browser.sleep(6000);
           } else {
              element(by.xpath("//ecb-product-offer/div[1]/div[1]/div/span/a")).click();
              browser.sleep(4000);
              var popup = element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[1]/h2"));
              popup.isPresent().then(function (result) {
           if(result){  
           browser.actions().mouseMove(element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[1]/h2"))).perform();
           browser.sleep(2000);  
           expect(element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[2]/h3")).getText()).toEqual(testdata.offeringsnum);
           var table = element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input"));
           table.isPresent().then(function (result) {
           if(result){                      
             
               browser.actions().mouseMove(element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/p-dropdown/div/label"))).perform();
               browser.sleep(2000);
               element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/p-dropdown/div/div[3]/span")).click();
               browser.sleep(2000);
               element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/p-dropdown/div/div[4]/div/ul/li[1]")).click();
               browser.sleep(2000);
               element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input")).click();
               element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input")).sendKeys(testdata.searchname);
               browser.sleep(2000);
               element(by.xpath("//em[@class='fa fa-times-circle-o fa-lg']")).click();
               browser.sleep(2000);
               //browser.actions().mouseMove(element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[1]/p-dropdown/div/label"))).perform();
               //browser.sleep(2000);
               //element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[1]/p-dropdown/div/div[3]/span")).click();
               //browser.sleep(2000);
               //element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[1]/p-dropdown/div/div[4]/div/ul/li[2]")).click();
               //browser.sleep(2000);
               element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[1]/button/span[1]")).click();
               browser.sleep(5000);
              browser.navigate().back();
              browser.sleep(10000);


        
           } else {
             console.log('elements are not present in table');
             element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[1]/button/span[1]")).click();
             browser.sleep(4000);
             browser.navigate().back();
              browser.sleep(10000);
           }
        });
       
           } else {
              console.log('when we click on offerings link popup not came to see the existence');
           }
              });
                 }
                  });
           } else {
             console.log('poexistense link is not there');
           }
     });

  });
});