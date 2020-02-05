var testdata = require('../inputs/testdata/createadjustmentreasons.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {
    it('create adjustment reasons', function() {
   
      var create = element(by.xpath("//span[contains(text(),'Create Adjustment Reason')]"));
      create.isPresent().then(function (result) {
          if (result) {
               create.click();
               browser.sleep(3000);
               var createpopup = element(by.xpath("//h3[contains(text(),'Create Adjustment Reason')]"));
                createpopup.isPresent().then(function (result) {
          if (result) {
              browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Create Adjustment Reason')]"))).perform();
              browser.sleep(3000);
              // cancel clicking
              element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]")).click();
              browser.sleep(3000);
               create.click();
               browser.sleep(3000);
                browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Create Adjustment Reason')]"))).perform();
              browser.sleep(3000);
              // inputs
              element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/div/form/div/div[1]/div/input")).click();
              browser.sleep(1000);
              element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/div/form/div/div[1]/div/input")).clear();
              browser.sleep(1000);
              element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/div/form/div/div[1]/div/input")).sendKeys(testdata.name);
            
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
              var createlink = element(by.xpath("//span[contains(text(),'Create Adjustment Reason')]"));
      createlink.isPresent().then(function (result) {
          if (result) {
              
         // creating again
               create.click();
               browser.sleep(3000);
                browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Create Adjustment Reason')]"))).perform();
              browser.sleep(3000);
              // inputs
              element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/div/form/div/div[1]/div/input")).click();
              browser.sleep(1000);
              element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/div/form/div/div[1]/div/input")).clear();
              browser.sleep(1000);
              element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/div/form/div/div[1]/div/input")).sendKeys(testdata.name);
            
               element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/div/form/div/div[3]/textarea")).click();
              browser.sleep(1000);
              element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/div/form/div/div[3]/textarea")).sendKeys(testdata.description);
                 // name is already in use 
               var namealready = element(by.xpath("//span[contains(text(),'This name is already in use')]"));
               namealready.isPresent().then(function (result) {
          if (result) {
               element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/div/form/div/div[1]/div/input")).click();
              browser.sleep(1000);
              element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/div/form/div/div[1]/div/input")).clear();
              browser.sleep(1000);
              element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/div/form/div/div[1]/div/input")).sendKeys(testdata.anothername);
          } else {
            console.log('name is already in use text not came for the first time');
          }
               });
             
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
               var createlink = element(by.xpath("//h3[contains(text(),'Create Adjustment Reason')]"));
      createlink.isPresent().then(function (result) {
          if (result) {
               browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Create Adjustment Reason')]"))).perform();
              browser.sleep(3000);
                // name is already in use 
               var namealready = element(by.xpath("//span[contains(text(),'This name is already in use')]"));
               namealready.isPresent().then(function (result) {
          if (result) {
             element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]")).click();
              browser.sleep(3000);
                browser.actions().mouseMove(element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/ecb-modal-dialog/div/div/div/div[2]/div/button[2]"))).perform();
              browser.sleep(2000);
              element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]")).click();
              browser.sleep(3000);
          } else {
            console.log('name is already in use text not came second time');
             // save clicking
              element(by.xpath("//ecb-adjustment-reasons/div[3]/ngx-aside/aside/section/div/div/div[1]/div/div/button[1]")).click();
             browser.sleep(4000);
          }
               });
             

          } else {
              console.log('create popup is not came when clicking on return in create adjustment reasons');
          }
                });
          } else {
              console.log('cancel without save and return popup not came when clicking on cancel in adjustment reasons');
          }
                });
          } else {
               console.log('create link is not there when we click on cancel without save in creating adjustment seasons');
          }
      });
          } else {
               console.log('cancel without save popup not came while creating adjustment reasons');
          }
      });
                } else {
                    console.log('create adjustment popup not came');
                }
         
                });
          } else {
               console.log('create adjustment reasons link is not there');
          }
      });
      
    });
});