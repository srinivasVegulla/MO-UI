var testdata = require('../inputs/testdata/productoffer.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {

  it('productoffer widget', function () {
  
     browser.sleep(1000);
    var productoffers = element(by.xpath("//ecb-product-offer-list/div/div[2]/div/div/div/p"));
    productoffers.isPresent().then(function (result) {
      if (result) {
        console.log('productoffers are not there');
       
      } else {
       console.log('productoffers are present');
       browser.sleep(2000);
      var hideicon = element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/a[3]/em"));
      hideicon.isPresent().then(function (result) {
      if (result) {
          hideicon.click();
      browser.sleep(3000);
                          
          var modalpopup = element(by.xpath("//ecb-product-offer-list/div/div[2]/ecb-modal-dialog[2]/div/div/div/div[1]/div/div[2]"));
          modalpopup.isPresent().then(function (result) {
      if (result) {
         browser.actions().mouseMove(element(by.xpath("//ecb-product-offer-list/div/div[2]/ecb-modal-dialog[2]/div/div/div/div[1]/div/div[2]"))).perform();
         element(by.xpath("//ecb-product-offer-list/div/div[2]/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]/dialog-button-1")).click();
         browser.sleep(2000); 
         element(by.xpath("//ecb-product-offer-list/div/div[1]/div/div[2]/div/button[2]/a/em")).click();
         browser.sleep(2000);  
         var hidepage = element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/a[2]/em"));
          hidepage.isPresent().then(function (result) {
      if (result) {
        hidepage.click();
      browser.sleep(3000);
                           
      var modalpopup1 = element(by.xpath("//ecb-product-offer-list/div/div[2]/ecb-modal-dialog[3]/div/div/div/div[1]/div/div[2]"));
          modalpopup1.isPresent().then(function (result) {
      if (result) {
         browser.actions().mouseMove(element(by.xpath("//ecb-product-offer-list/div/div[2]/ecb-modal-dialog[3]/div/div/div/div[1]/div/div[2]"))).perform();
         element(by.xpath("//ecb-product-offer-list/div/div[2]/ecb-modal-dialog[3]/div/div/div/div[2]/div/button[1]/dialog-button-1")).click();
         browser.sleep(2000);
         element(by.xpath("//ecb-product-offer-list/div/div[1]/div/div[2]/div/button[1]/a/em")).click();
         browser.sleep(2000); 
      } else {
        console.log('modal popup are not present');
      }
          });
      }
      else {
          console.log('hide page is not present to click unhide icon');
      }
          });
      } else {
          console.log('modal popup are not present');
      }
          });
      } else {
            console.log('hideicon is not present to click');
      }
      });

      }
      });
    });
  });
