var testdata = require('../inputs/testdata/rates.json');
var dragAndDropFn = require('../draganddrop/dragNDrop/drag.js');

import { browser, by, element } from 'protractor';

describe('widget', function () {

  it('rates widget', function () {
   

      browser.sleep(5000);
   
    
     var rates = element(by.xpath("//ecb-rates-table/div[1]/div[1]/h3"));
     rates.isPresent().then(function (result){
         if(result){
             console.log('rate table is present for this selected schedule');
             expect(element(by.xpath("//ecb-rates-table/div[1]/div[1]/h3")).getText()).toEqual(testdata.ratesanddates);
           
      var ratetable = element(by.xpath("//div[@class='ui-datatable-tablewrapper']"));
      ratetable.isPresent().then(function (result){
        if(result){
       browser.sleep(2000);
       var editicon = element(by.xpath("//a[@class='ecb-pointer']"));
       editicon.isPresent().then(function (result){
        if(result){
          browser.sleep(2000);
          editicon.click();
          browser.sleep(3000);
          var editpanel = element(by.xpath("//ecb-rates-table/ngx-aside/aside/section/div/div/div[1]/div/div/h2"));
          editpanel.isPresent().then(function (result){
            if(result){
         browser.actions().mouseMove(element(by.xpath("//ecb-rates-table/ngx-aside/aside/section/div/div/div[1]/div/div/h2"))).perform();
         browser.sleep(3000);
          element(by.xpath("//ecb-rates-table/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[2]/span")).click();
          browser.sleep(4000);
          
        
            } else {
              console.log('edit panel not came when we click on edit in rates widget');
            }
          });
        } else {
          console.log('edit icon is not present in rates widget');
        }
      });
        } else {
          console.log('rate table is present');
        }
      });
    } else {
      console.log('rate table heading is not there with dates');
    }
    });
  });
});