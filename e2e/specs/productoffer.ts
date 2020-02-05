var testdata = require('../inputs/testdata/productoffer.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {

  it('productoffer widget', function () {
    
    
   
  browser.sleep(5000);

 
    var productoffers = element(by.xpath("//ecb-product-offer-list/div/div[2]/div/div/div/p"));
    productoffers.isPresent().then(function (result) {
      if (result) {
        console.log('productoffers are not there');
       
      } else {
       console.log('productoffers are present');
       
        //filtering of po
        var filter = element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/span[2]"));
        filter.isPresent().then(function (result) {
      if (result) {
        element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/span[2]")).click();
        browser.sleep(2000);
        element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/span[2]")).click();
        browser.sleep(2000);
      }else {
               console.log('unable to filter as product offers are not present');
      }
        });

       
        //searching po
       var search = element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/div/input"));
       search.isPresent().then(function (result){
 if(result){
          
        element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/div/input")).click();
        browser.sleep(2000);
        element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/div/input")).sendKeys(testdata.searchname);
        browser.sleep(5000);
        element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/div/div/div/i")).click();
        browser.sleep(2000);

        var popresent = element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[3]/span/span/a"));
        popresent.isPresent().then(function (result){
 if(result){
   browser.sleep(2000);
    element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[3]/span/span/a")).click(); // first po to click
   
     browser.sleep(5000);
 } else {
       console.log('product offers are not there to click');
 } 
        });       
        
 } else {
   console.log('product offers are not there');
 }
       });
       
      
              
      }
    });
  });
}); 