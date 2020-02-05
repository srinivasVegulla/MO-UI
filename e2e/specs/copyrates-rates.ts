var testdata = require('../inputs/testdata/copyrates-rates.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {
    it('sharedrates  copyrates ', function() {
        browser.sleep(5000);

    var copyratesicon =  element(by.xpath("//ecb-rates-table/div[1]/div[1]/div/span[1]/span/button/span"));
  copyratesicon.isPresent().then(function (result) {
          if (result) {
         copyratesicon.click();
         browser.sleep(3000);
         

       var popup = element(by.xpath("//ecb-copyrates/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-header-template/div/h2"));
        popup.isPresent().then(function (result) {
 if (result) {
     browser.actions().mouseMove(element(by.xpath("//ecb-copyrates/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-header-template/div/h2"))).perform();
     browser.sleep(3000);
        expect(element(by.xpath("//ecb-copyrates/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-header-template/div/h3")).getText()).toEqual(testdata.copyratelistheading);
        browser.sleep(3000);
        element(by.xpath("//ecb-copyrates/ecb-modal-dialog[1]/div/div/div/div/div[1]/button/span[1]")).click();
        browser.sleep(3000);
        element(by.xpath("//ecb-rates-table/div[1]/div[1]/div/span[1]/span/button/span")).click();
         browser.actions().mouseMove(element(by.xpath("//ecb-copyrates/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-header-template/div/h2"))).perform();
     browser.sleep(3000);
        element(by.xpath("//ecb-copyrates/ecb-modal-dialog[1]/div/div/div/div/div[3]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[4]/div/input")).click();
        element(by.xpath("//ecb-copyrates/ecb-modal-dialog[1]/div/div/div/div/div[3]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[4]/div/input")).sendKeys(testdata.usersearch);
        browser.sleep(2000);
        element(by.xpath("//ecb-copyrates/ecb-modal-dialog[1]/div/div/div/div/div[3]/dialog-body-template/div[1]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[4]/div/div/div/em")).click();
        browser.sleep(4000);
        // selection of input
        element(by.xpath("//ecb-copyrates/ecb-modal-dialog[1]/div/div/div/div/div[3]/dialog-body-template/div/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/span/input")).click();
        browser.sleep(3000);
        //copy icon clicking
        element(by.xpath("//ecb-copyrates/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-header-template/div/div/button")).click();
        browser.sleep(4000);
        var popup1 = element(by.xpath("//ecb-copyrates/ecb-modal-dialog[2]/div/div/div/dialog-footer-template/div/button[1]"));
        popup1.isPresent().then(function (result) {
 if (result) {
          browser.actions().mouseMove(element(by.xpath("//ecb-copyrates/ecb-modal-dialog[2]/div/div/div/dialog-footer-template/div/button[1]"))).perform();
          browser.sleep(3000);
          element(by.xpath("//ecb-copyrates/ecb-modal-dialog[2]/div/div/div/dialog-footer-template/div/button[2]")).click();
          browser.sleep(3000);
           browser.actions().mouseMove(element(by.xpath("//ecb-copyrates/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-header-template/div/h2"))).perform();
     browser.sleep(3000);
     element(by.xpath("//ecb-copyrates/ecb-modal-dialog[1]/div/div/div/div/div[1]/button/span[1]")).click();
        browser.sleep(3000);

 } else {
       console.log('do not copy  popup not came');
 }
        });
          element(by.xpath("//ecb-rates-table/div[1]/div[1]/div/span[1]/span/button/span")).click();
         browser.actions().mouseMove(element(by.xpath("//ecb-copyrates/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-header-template/div/h2"))).perform();
     browser.sleep(3000);
       // selection of input
        element(by.xpath("//ecb-copyrates/ecb-modal-dialog[1]/div/div/div/div/div[3]/dialog-body-template/div/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/span/input")).click();
        browser.sleep(3000);
        //copy icon clicking
        element(by.xpath("//ecb-copyrates/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-header-template/div/div/button")).click();
        browser.sleep(4000);
        var popup2 = element(by.xpath("//ecb-copyrates/ecb-modal-dialog[2]/div/div/div/dialog-footer-template/div/button[1]"));
        popup2.isPresent().then(function (result) {
 if (result) {
          browser.actions().mouseMove(element(by.xpath("//ecb-copyrates/ecb-modal-dialog[2]/div/div/div/dialog-footer-template/div/button[1]"))).perform();
          browser.sleep(3000);
          element(by.xpath("//ecb-copyrates/ecb-modal-dialog[2]/div/div/div/dialog-footer-template/div/button[1]")).click();
          browser.sleep(5000);
          browser.navigate().back();
          browser.sleep(6000);
       
        

 } else {
        console.log('copy and replace rates popup not came');
 }
        });


      

  } else {
     console.log('poup is not came on clicking copyrates icon');
  }
          });
          } else {
               console.log('copyrates icon is not present');
               browser.navigate().back();
          browser.sleep(6000);
         
          }
  });

    });
});
