const testdata = require('../inputs/testdata/pitemplates.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {

      it('pitemplates widget', function() {
            browser.sleep(5000);
          element(by.xpath('//span[@id="breadcrumbExpDivs"]')).click();
          browser.sleep(2000);
          element(by.xpath('//a[contains(text(),"Priceable Item Templates")]')).click();
          browser.sleep(6000);

         const pitemplates = element(by.xpath("//h1[contains(text(),'Priceable Item Templates')]"));
         pitemplates.isPresent().then(function (result) {
          if (result) {
            expect(element(by.xpath("//ecb-priceableitem-template/div[1]/div[1]/h2")).getText()).toEqual(testdata.heading);
          
            
        const second = element(by.xpath("//ecb-priceableitem-template/div[1]/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[2]/td[2]/span/span/a"));
        second.isPresent().then (function (result) {
            if (result) {
               // sorting
               element(by.xpath("//ecb-priceableitem-template/div[1]/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input")).click();
               browser.sleep(1000);
               element(by.xpath("//ecb-priceableitem-template/div[1]/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input")).sendKeys(testdata.usersearch);
               browser.sleep(2000);
               element(by.xpath("//ecb-priceableitem-template/div[1]/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/div/div/em")).click();
               browser.sleep(4000);
                // refresh icon
                element(by.xpath("//ecb-priceableitem-template/div[1]/div[1]/div/span/em")).click();
                browser.sleep(4000);
               // charge type
               element(by.xpath("//ecb-priceableitem-template/div[1]/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[4]/ecb-dropdown/select")).click();
               browser.sleep(3000);
               element(by.xpath("//option[contains(text(),'Usage')]")).click();
               browser.sleep(5000);
               
                const copyicon = element(by.xpath("//em[@class='fa fa-clone']"));
                copyicon.isPresent().then (function (result) {
            if (result) {
            } else {
               console.log('usage charges copy icon should not present'); 
            }
                });
              const deleteicon = element(by.xpath("//em[@class='fa fa-times-circle']"));
              deleteicon.isPresent().then (function (result) {
            if (result) {
            } else {
              console.log('usage charges delete icon should not present');
            } 
              });
              /*
            var usagecharges = element(by.xpath("//ecb-priceableitem-template/div[1]/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[2]/span/span/a"));
            usagecharges.isPresent().then (function (result) {
              if (result) {
                usagecharges.click();
                browser.sleep(6000);

              } else {
              console.log('no usage charges are present');
               // refresh icon
               element(by.xpath("//ecb-priceableitem-template/div[1]/div[1]/div/span/em")).click();
               browser.sleep(4000);
              }
            });
           */
                 
           } else {
             console.log('second row is not present so, no need to sort and filter');
           }
          });


        
          } else {
           console.log('pi  templates heading is not present ');
          }
         });



      });
});
