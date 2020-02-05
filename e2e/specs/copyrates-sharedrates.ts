var testdata = require('../inputs/testdata/copyrates-sharedrates.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {
    it('sharedrates  copyrates ', function() {
        browser.sleep(2000);
    var copyratesicon =  element(by.xpath("//span[contains(text(),'Copy Rates')]"));
  copyratesicon.isPresent().then(function (result) {
          if (result) {
         copyratesicon.click();
         browser.sleep(3000);
          var copyratesicon =  element(by.xpath("//button[contains(text(),'Copy and replace rates')]"));
  copyratesicon.isPresent().then(function (result) {
 if (result) {
       browser.actions().mouseMove(element(by.xpath("//button[contains(text(),'Copy and replace rates')]"))).perform();
       browser.sleep(2000);
       element(by.xpath("//button[contains(text(),'Do not copy')]")).click();
       browser.sleep(3000);
        copyratesicon.click();
         browser.sleep(3000);
         var copyratesicon1 =  element(by.xpath("//button[contains(text(),'Copy and replace rates')]"));
  copyratesicon1.isPresent().then(function (result) {
 if (result) {
     browser.actions().mouseMove(element(by.xpath("//button[contains(text(),'Copy and replace rates')]"))).perform();
       browser.sleep(2000);
       element(by.xpath("//button[contains(text(),'Copy and replace rates')]")).click();
       browser.sleep(3000);

       var popup = element(by.xpath("//h2[contains(text(),'Copy Rates')]"));
        popup.isPresent().then(function (result) {
 if (result) {
     browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Copy Rates')]"))).perform();
     browser.sleep(3000);
        expect(element(by.xpath("//ecb-rates-table/div[3]/ecb-copyrates/ecb-modal-dialog/div/div/div/div/div[2]/dialog-header-template/div/h3")).getText()).toEqual(testdata.copyratelistheading);
        var input = element(by.xpath("//ecb-copyrates/ecb-modal-dialog/div/div/div/div/div[3]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[4]/div/input"));
        input.isPresent().then(function (result) {
 if (result) {
      element(by.xpath("//ecb-copyrates/ecb-modal-dialog/div/div/div/div/div[3]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[4]/div/input")).click();
      browser.sleep(1000);
      element(by.xpath("//ecb-copyrates/ecb-modal-dialog/div/div/div/div/div[3]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[4]/div/input")).sendKeys(testdata.usersearch);
      browser.sleep(3000);
      element(by.xpath("//ecb-copyrates/ecb-modal-dialog/div/div/div/div/div[3]/dialog-body-template/div[1]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[4]/div/div/div/em")).click();
      browser.sleep(3000);
      // sorting
      element(by.xpath("//ecb-copyrates/ecb-modal-dialog/div/div/div/div/div[3]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[4]/span[2]")).click();
      browser.sleep(3000);
      element(by.xpath("//ecb-copyrates/ecb-modal-dialog/div/div/div/div/div[3]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[4]/span[2]")).click();
      browser.sleep(3000);
      var selection = element(by.xpath("//ecb-copyrates/ecb-modal-dialog/div/div/div/div/div[3]/dialog-body-template/div/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/span/input"));
        selection.isPresent().then(function (result) {
            if(result) {
            element(by.xpath("//ecb-copyrates/ecb-modal-dialog/div/div/div/div/div[3]/dialog-body-template/div/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/span/input")).click();
            browser.sleep(2000);
        // cross icon
        element(by.xpath("//ecb-copyrates/ecb-modal-dialog/div/div/div/div/div[1]/button/span[1]")).click();
        browser.sleep(3000);
        element(by.xpath("//span[contains(text(),'Copy Rates')]")).click();
        browser.sleep(3000);
      browser.actions().mouseMove(element(by.xpath("//button[contains(text(),'Copy and replace rates')]"))).perform();
       browser.sleep(2000);
       element(by.xpath("//button[contains(text(),'Copy and replace rates')]")).click();
       browser.sleep(3000);
       browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Copy Rates')]"))).perform();
     browser.sleep(3000);
      element(by.xpath("//ecb-copyrates/ecb-modal-dialog/div/div/div/div/div[3]/dialog-body-template/div/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/span/input")).click();
            browser.sleep(2000);
            element(by.xpath("//ecb-copyrates/ecb-modal-dialog/div/div/div/div/div[2]/dialog-header-template/div/div/button")).click();
            browser.sleep(4000);
            } else {
          console.log('rates are not there  to select');
            }
        });

} else {
     console.log('table input is not present to filter');
 }
        });
 } else {
    console.log('copy rates poup not came');
 }
        });
 } else {
      console.log('poup is not came on clicking copyrates icon');
 }
  });

  } else {
     console.log('poup is not came on clicking copyrates icon');
  }
          });
          } else {
               console.log('copyrates icon is not present');
          }
  });

    });
});
