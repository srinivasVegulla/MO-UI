var testdata = require('../inputs/testdata/adjustmentreasonsgrid.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {
    it('adjustment reasons grid page', function() {

        element(by.xpath("//span[@id='breadcrumbExpDivs']")).click();
         browser.sleep(2000);
          element(by.xpath("//a[contains(text(),'Adjustment Reasons')]")).click();
          browser.sleep(6000); 
    
     var adjustments = element(by.xpath("//h1[contains(text(),'Adjustment Reasons')]"));
         adjustments.isPresent().then(function (result) {
          if (result) {
            expect(element(by.xpath("//ecb-adjustment-reasons/div[1]/div/h2")).getText()).toEqual(testdata.heading); 
           
           var filtering = element(by.xpath("//ecb-adjustment-reasons/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input"));
           filtering.isPresent().then(function (result) {
          if (result) {
             filtering.click();
             browser.sleep(3000);
             filtering.sendKeys(testdata.usersearch);
             browser.sleep(3000);
               element(by.xpath("//ecb-adjustment-reasons/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/div/div/em")).click();
               browser.sleep(3000);
           var sorting = element(by.xpath("//ecb-adjustment-reasons/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]"));
           sorting.isPresent().then(function (result) {
          if (result) {
              sorting.click();
              browser.sleep(3000);
              sorting.click();
              browser.sleep(3000);
          } else {
            console.log('sorting icon is not there to sort');
          }
           });
          } else {
              console.log('enter search criteria is not there');
          }
           });
          } else {
         console.log('adjustment reasons page is not there');
          }
         });

    });
});
