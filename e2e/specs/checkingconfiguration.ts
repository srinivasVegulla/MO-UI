var testdata = require('../inputs/testdata/checkingconfiguration.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {

  it('checking configuration widget', function () {
                                                                                                                                                                    
       browser.sleep(6000);  

       browser.refresh();

        browser.sleep(10000);
        
                                                                                    
       var confbutton = element(by.xpath("//body[@id='mainBody']/app-root/welcome/div[2]/div[2]/ecb-contextbar/div/div/div/div[1]/div[1]/button"));
        confbutton.isPresent().then(function (result) {
      if (result) {
        browser.sleep(5000);
          element(by.xpath("//body[@id='mainBody']/app-root/welcome/div[2]/div[2]/ecb-contextbar/div/div/div/div[1]/div[1]/button")).click();
          browser.sleep(5000);
          var popup = element(by.xpath("//dialog-header[contains(text(),'Check Configuration')]"));
          popup.isPresent().then(function (result) {
      if (result) {
          browser.actions().mouseMove(element(by.xpath("//dialog-header[contains(text(),'Check Configuration')]"))).perform();
          browser.sleep(3000);
          var complete = element(by.xpath("//span[contains(text(),'Product Offering is Completely Configured.')]"));
          complete.isPresent().then(function (result) {
      if (result) {
         browser.actions().mouseMove(element(by.xpath("//span[contains(text(),'Product Offering is Completely Configured.')]"))).perform();
         browser.sleep(3000);
        element(by.xpath("//button[contains(text(),'OK')]")).click();
        browser.sleep(3000);
      } else {
          console.log('configuration is complete text is not present');
         var incomplete = element(by.xpath("//span[contains(text(),'Product Offering configuration is incomplete:')]"));
         incomplete.isPresent().then(function (result) {
      if (result) {
        console.log('configuration is incomplete');
        browser.actions().mouseMove(element(by.xpath("//span[contains(text(),'Product Offering configuration is incomplete:')]"))).perform();
         browser.sleep(3000);
       
        element(by.xpath("//div[@class='control-bar visible-md-up hidden-sm hidden-xs']/ecb-contextbar/ecb-modal-dialog[3]/div/div/div/dialog-footer-template/div/button")).click();
        browser.sleep(3000);
      } else {
         console.log('configuration is incomplete text is also not present');
      }
         });

      }
          });
      } else {
       console.log('checking configuration popup is not came');
      }
          });

      } else {
        console.log('checking configuration button is not present in po details page');
      }
        });
  });
});
