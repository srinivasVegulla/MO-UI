var testdata = require('../inputs/testdata/editadjustmentreasons.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {
    it('edit adjustment reasons', function() {
        
        browser.sleep(5000);
      var edit = element(by.xpath("//em[@class='fa fa-pencil'][1]"));
      edit.isPresent().then(function (result) {
          if (result) {
               edit.click();
               browser.sleep(3000);
               var editpopup = element(by.xpath("//h3[contains(text(),'Edit Adjustment Reason')]"));
                editpopup.isPresent().then(function (result) {
          if (result) {
              browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Edit Adjustment Reason')]"))).perform();
              browser.sleep(3000);
              var bluetext = element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/div/div[2]/div/span/span"));
              bluetext.isPresent().then(function (result) {
          if (result) {
               expect(element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/div/div[2]/div/span/span")).getText()).toEqual(testdata.text);
         browser.sleep(2000);
         } else {
             console.log('blue colour text in edit adjustment reasons panel is not there');
          }
              });
              // cancel clicking
              element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]")).click();
              browser.sleep(3000);
               edit.click();
               browser.sleep(3000);
                browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Edit Adjustment Reason')]"))).perform();
              browser.sleep(3000);
              // inputs
            
               element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/div/form/div/div[3]/textarea")).click();
              browser.sleep(1000);
              element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/div/form/div/div[3]/textarea")).sendKeys(testdata.description);
             
              // cancel clicking
               element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]")).click();
              browser.sleep(3000);
              var cancelpopup = element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"));
                cancelpopup.isPresent().then(function (result) {
          if (result) {
             browser.actions().mouseMove(element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
              browser.sleep(2000);
              element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]")).click();
              browser.sleep(3000);
            var edit = element(by.xpath("//em[@class='fa fa-pencil'][1]"));
      edit.isPresent().then(function (result) {
          if (result) {
              //again editing

               edit.click();
               browser.sleep(3000);
                browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Edit Adjustment Reason')]"))).perform();
              browser.sleep(3000);
              // inputs
            
               element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/div/form/div/div[3]/textarea")).click();
              browser.sleep(1000);
              element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/div/form/div/div[3]/textarea")).sendKeys(testdata.description);
              // cancel clicking
               element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]")).click();
              browser.sleep(3000);
              var returnpopup = element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/ecb-modal-dialog/div/div/div/div[2]/div/button[2]"));
                returnpopup.isPresent().then(function (result) {
          if (result) {
             browser.actions().mouseMove(element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/ecb-modal-dialog/div/div/div/div[2]/div/button[2]"))).perform();
              browser.sleep(2000);
              element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/ecb-modal-dialog/div/div/div/div[2]/div/button[2]")).click();
              browser.sleep(3000);
               var editlink = element(by.xpath("//h3[contains(text(),'Edit Adjustment Reason')]"));
      editlink.isPresent().then(function (result) {
          if (result) {
               browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Edit Adjustment Reason')]"))).perform();
              browser.sleep(3000);
              // save clicking
              element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/div/div[1]/div/div/button[1]")).click();
             browser.sleep(4000);

          } else {
              console.log('edit popup is not came when clicking on return in edit adjustment reasons');
          }
                });
          } else {
              console.log('cancel without save and return popup not came when clicking on cancel in adjustment reasons');
          }
                });
          } else {
               console.log('edit link is not there when we click on cancel without save in creating adjustment seasons');
          }
      });
          } else {
               console.log('cancel without save popup not came while creating adjustment reasons');
          }
      });
                } else {
                    console.log('edit adjustment popup not came');
                }
         
                });
          } else {
               console.log('edit adjustment reasons link is not there');
          }
      });
      
    });
});