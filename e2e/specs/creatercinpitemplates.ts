var testdata = require('../inputs/testdata/creatercinpitemplates.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {
    it('pitemplates  create recurring charges ', function() {


      browser.sleep(6000);
    

      var create = element(by.xpath("//ecb-priceableitem-template/div[1]/div[1]/div/a/span"));
      create.isPresent().then(function (result) {
          if (result) {
          create.click();
          browser.sleep(4000);
          var popup = element(by.xpath("//ecb-create-pitemplate/ecb-modal-dialog/div/div/div/div/div[1]/dialog-body-template/div[1]/div[1]/div/h2"));
                popup.isPresent().then(function (result) {
          if (result) {
             
               expect(element(by.xpath("//ecb-create-pitemplate/ecb-modal-dialog/div/div/div/div/div[1]/dialog-body-template/div[1]/div[2]/h3")).getText()).toEqual(testdata.num);
              browser.sleep(2000);
              var table = element(by.xpath("//ecb-create-pitemplate/ecb-modal-dialog/div/div/div/div/div[1]/dialog-body-template/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/ecb-dropdown/select"));
             table.isPresent().then(function (result) {
                 if (result) {
              browser.actions().mouseMove(element(by.xpath("//ecb-create-pitemplate/ecb-modal-dialog/div/div/div/div/div[1]/dialog-body-template/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/ecb-dropdown/select"))).perform();
           
           browser.sleep(3000);
            element(by.xpath("//ecb-create-pitemplate/ecb-modal-dialog/div/div/div/div/div[1]/dialog-body-template/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/ecb-dropdown/select")).click();
            browser.sleep(5000);
            
           element(by.xpath("//option[contains(text()'Recurring')]")).click();
            browser.sleep(3000);
           
            var recurring = element(by.xpath("//ecb-create-pitemplate/ecb-modal-dialog/div/div/div/div/div[1]/dialog-body-template/div[2]/div/div/div/div/p/strong"));
            recurring.isPresent().then(function (result) {
                 if (result) {
                     console.log('results are not found related to your search');
                     browser.sleep(2000);
                     browser.actions().mouseMove(element(by.xpath("//ecb-create-pitemplate/ecb-modal-dialog/div/div/div/div/div[1]/dialog-body-template/div[2]/div/div/div/div/p/strong"))).perform();
                     browser.sleep(2000);
                     element(by.xpath("//ecb-create-pitemplate/ecb-modal-dialog/div/div/div/div/div[1]/dialog-body-template/div[2]/div/div/div/div/button/span[1]")).click();
                     browser.sleep(3000);
                     element(by.xpath("//ecb-create-pitemplate/ecb-modal-dialog/div/div/div/div/div[1]/dialog-body-template/div[1]/div[1]/div/div/button[2]")).click();
                     browser.sleep(3000);

                 } else {
                element(by.xpath("//ecb-create-pitemplate/ecb-modal-dialog/div/div/div/div/div[1]/dialog-body-template/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr/td[1]/span/span/input")).click();
                browser.sleep(2000);
                element(by.xpath("//ecb-create-pitemplate/ecb-modal-dialog/div/div/div/div/div[1]/dialog-body-template/div[1]/div[1]/div/div/button[1]")).click();
                browser.sleep(4000);

                var createpopup = element(by.xpath("//ecb-priceableitem-template/ngx-aside/aside/section/div/div/div[1]/div/div/h3"));
                 createpopup.isPresent().then(function (result) {
                 if (result) {
                browser.actions().mouseMove(element(by.xpath("//ecb-priceableitem-template/ngx-aside/aside/section/div/div/div[1]/div/div/h3"))).perform();
                 browser.sleep(2000);
                 element(by.xpath("//ecb-priceableitem-template/ngx-aside/aside/section/div/div/div[1]/form/div[1]/div[1]/input")).click();
                 browser.sleep(1000);
                 element(by.xpath("//ecb-priceableitem-template/ngx-aside/aside/section/div/div/div[1]/form/div[1]/div[1]/input")).clear();
                 browser.sleep(1000);
                 element(by.xpath("//ecb-priceableitem-template/ngx-aside/aside/section/div/div/div[1]/form/div[1]/div[1]/input")).sendKeys(testdata.createname);
                   element(by.xpath("//ecb-priceableitem-template/ngx-aside/aside/section/div/div/div[1]/form/div[3]/div/textarea")).click();
                   browser.sleep(2000);
                  var alreadyuse = element(by.xpath("//ecb-priceableitem-template/ngx-aside/aside/section/div/div/div[1]/form/div[1]/div[2]/span[2]"));
                  alreadyuse.isPresent().then(function (result) {
                 if (result) {
                      element(by.xpath("//ecb-priceableitem-template/ngx-aside/aside/section/div/div/div[1]/form/div[1]/div[1]/input")).click();
                 browser.sleep(1000);
                 element(by.xpath("//ecb-priceableitem-template/ngx-aside/aside/section/div/div/div[1]/form/div[1]/div[1]/input")).clear();
                 browser.sleep(1000);
                 element(by.xpath("//ecb-priceableitem-template/ngx-aside/aside/section/div/div/div[1]/form/div[1]/div[1]/input")).sendKeys(testdata.createnameanother);
                   element(by.xpath("//ecb-priceableitem-template/ngx-aside/aside/section/div/div/div[1]/form/div[3]/div/textarea")).click();
                   browser.sleep(2000);
                   element(by.xpath("//ecb-priceableitem-template/ngx-aside/aside/section/div/div/div[1]/form/div[3]/div/textarea")).sendKeys(testdata.description);
                   browser.sleep(1000);
                   element(by.xpath("//ecb-priceableitem-template/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[2]")).click();
                   browser.sleep(3000);
                   var modalpopup = element(by.xpath("//ecb-priceableitem-template/ecb-modal-dialog[1]/div/div/div/div[1]/div[2]/div[1]/dialog-header"));
                   modalpopup.isPresent().then(function (result) {
                 if (result) {
                   browser.actions().mouseMove(element(by.xpath("//ecb-priceableitem-template/ecb-modal-dialog[1]/div/div/div/div[1]/div[2]/div[1]/dialog-header"))).perform();
                   browser.sleep(2000);
                   element(by.xpath("//ecb-priceableitem-template/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[2]")).click();
                   browser.sleep(4000);
                   browser.actions().mouseMove(element(by.xpath("//ecb-priceableitem-template/ngx-aside/aside/section/div/div/div[1]/div/div/h3"))).perform();
                   browser.sleep(2000);
                   var alreadyuse1 = element(by.xpath("//ecb-priceableitem-template/ngx-aside/aside/section/div/div/div[1]/form/div[1]/div[2]/span[2]"));
                   alreadyuse1.isPresent().then(function (result) {
                  if (result) {
                    element(by.xpath("//ecb-priceableitem-template/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[2]")).click();
                    browser.sleep(3000);
                    var modalpopup = element(by.xpath("//ecb-priceableitem-template/ecb-modal-dialog[1]/div/div/div/div[1]/div[2]/div[1]/dialog-header"));
                    modalpopup.isPresent().then(function (result) {
                  if (result) {
                    browser.actions().mouseMove(element(by.xpath("//ecb-priceableitem-template/ecb-modal-dialog[1]/div/div/div/div[1]/div[2]/div[1]/dialog-header"))).perform();
                    browser.sleep(2000);
                    element(by.xpath("//ecb-priceableitem-template/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]")).click();
                    browser.sleep(4000);
 
                  } else {
                       console.log('modalpopup not came on clicking cancel while creating pi templates');
                  }
                    });


                  } else {
                        console.log('Name already used text not came second time');
                         // save clicking
                     element(by.xpath("//ecb-priceableitem-template/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[1]")).click();
                     browser.sleep(4000);
                  }
                });
          
                    


                 } else {
                      console.log('modalpopup not came on clicking cancel while creating pi templates');
                 }
                   });

                 } else {
                  element(by.xpath("//ecb-priceableitem-template/ngx-aside/aside/section/div/div/div[1]/form/div[3]/div/textarea")).sendKeys(testdata.description);
                   browser.sleep(3000);
                     // save clicking
                     element(by.xpath("//ecb-priceableitem-template/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[1]")).click();
                     browser.sleep(4000);
                
                 }
                  });
                  
                 } else {
                console.log('popup is not came for create pi');
                 }
                 });
                 }
            });
                 }
                 else {
                    console.log('table is not present to create recurring charge'); 
                 }
             });

          } else {
            console.log('popup not came when clicking on create pi templates');
          }
                });
          } else {
          console.log('create pi template link is not present');
          }
      });



    });
});