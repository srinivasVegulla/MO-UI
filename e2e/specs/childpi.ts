var testdata = require('../inputs/testdata/productoffer.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {

  it('childpi widget', function () {
  
        browser.sleep(5000);
   
    

           var childpi = element(by.xpath("//ecb-card-controller/h2"));
            childpi.isPresent().then(function (result) {
              if (result) {
                console.log('child pis heading is present');
            browser.actions().mouseMove(element(by.xpath("//ecb-card-controller/h2"))).perform();
            browser.sleep(3000);
                var card = element(by.xpath("//div[@class='ecbClickableCard-heading']"));
                card.isPresent().then(function (result) {
              if (result) {
                console.log('pis are present to click');
                card.click();
                browser.sleep(6000);
                browser.navigate().back();
                browser.sleep(6000);
              } else {
                 console.log('child pis are absent');
              }
                });
              } else {
                console.log('child pi heading is absent');
              }
            });
         
    
          });
    });