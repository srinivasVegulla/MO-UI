var testdata = require('../inputs/testdata/sharedrates-rates.json');
var dragAndDropFn = require('../draganddrop/dragNDrop/drag.js');

import { browser, by, element } from 'protractor';

describe('widget', function () {

      it('sharedrates rates plus widget', function() {
   browser.sleep(2000);

var rates = element(by.xpath("//ecb-rates-table/div[1]/div[2]/div/p-datatable/div/div[1]/table/tbody/tr[1]/td[1]/span/span/a[1]/i"));
     rates.isPresent().then(function (result){
         if(result){
             console.log('rate table is present for this selected schedule');
      var table = element(by.xpath("//ecb-rates-table/div[1]/div[2]/div/p-datatable/div/div[1]/table/thead/tr/th[1]/span/span"));
      table.isPresent().then(function (result){
         if(result){
             var rate = element(by.xpath("//ecb-rates-table/div[1]/div[2]/div/p-datatable/div/div[1]/table/tbody/tr[1]/td[1]/span/span/a[1]/i"));
             rate.isPresent().then(function (result){
             if(result){

        element(by.xpath("//ecb-rates-table/div[1]/div[2]/div/p-datatable/div/div[1]/table/tbody/tr[1]/td[1]/span/span/a[1]/i")).click();
         browser.sleep(2000);
         var popup = element(by.xpath("//ecb-rates-table/ngx-aside/aside/section/div/div/div[1]/div/h3"));
         popup.isPresent().then(function (result){
         if(result){
           browser.actions().mouseMove(element(by.xpath("//ecb-rates-table/ngx-aside/aside/section/div/div/div[1]/div/h3"))).perform();
         var tableedit = element(by.xpath("//div[@id='ecb-rateTableEdit']/p-datatable/div/div[1]/table/tbody/tr[1]/td[2]/span/span/a[1]/i"));
         tableedit.isPresent().then(function (result){
          if(result){
          tableedit.click();
         browser.sleep(2000);
          
          element(by.xpath("//ecb-rates-table/ngx-aside/aside/section/div/div/div[1]/div/div/button[1]")).click();
          browser.sleep(2000);  
           // cancel validation
         var error = element(by.xpath("//ecb-rates-table/ngx-aside/aside/section/div/div/div[2]/div/div/div/p"));
           error.isPresent().then(function (result){
         if(result){
           browser.sleep(500);
           element(by.xpath("//ecb-rates-table/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]/span")).click();
           browser.sleep(1000);
         } else {
             console.log('error is not present while saving');
         }
           });

          }
          else {
          console.log('table is absent for edit');
          element(by.xpath("//ecb-rates-table/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]/span")).click();
          browser.sleep(2000);
           
          }
         });
         
         } else {
           console.log('edit rates popup is not came');
         }   
        }); 
        } else {
             console.log('rate is not there to click plus icon');
         }
         }); 
         } else {
         console.log('table associated with rates is not present');
         }   
      });   
         }
         else {
               console.log('rate table is not present');
         }
     });


  });

   it('ratesedit widget', function () { 
      
       var editicon = element(by.xpath("//ecb-rates-table/div[1]/div[1]/div/div/span/a[@class='ecb-pointer disabled']"));
       editicon.isPresent().then(function (result){
         if(result){
             console.log('edit icon is disabled');
         } else {
         var edit =  element(by.xpath("//ecb-rates-table/div[1]/div[1]/div/div/span/a"));
         edit.isPresent().then(function (result){
         if(result){
           element(by.xpath("//ecb-rates-table/div[1]/div[1]/div/div/span/a")).click();
             browser.sleep(2000);
        
             var popup = element(by.xpath("//ecb-rates-table/ngx-aside/aside/section/div/div/div[1]/div/h3"));
         popup.isPresent().then(function (result){
         if(result){
           browser.actions().mouseMove(element(by.xpath("//ecb-rates-table/ngx-aside/aside/section/div/div/div[1]/div/h3"))).perform();
           var tableedit = element(by.xpath("//div[@id='ecb-rateTableEdit']/p-datatable/div/div[1]/table/tbody/tr[1]/td[2]/span/span/a[1]/i"));
         tableedit.isPresent().then(function (result){
          if(result){     
              var icon = element(by.xpath("//div[@id='ecb-rateTableEdit']/p-datatable/div/div[1]/table/tbody/tr[1]/td[2]/span/span/a[1]/i"));
                icon.isPresent().then(function (result){
              if(result){
              
              icon.click();
           browser.sleep(1000); 
          
      var draganddrop = element(by.xpath("//div[@id='ecb-rateTableEdit']/p-datatable/div/div[1]/table/tbody/tr[2]/td[1]/span/span/a/i"));
    draganddrop.isPresent().then(function (result) {
      if (result) {
        var source = element(by.xpath("//div[@id='ecb-rateTableEdit']/p-datatable/div/div[1]/table/tbody/tr[2]/td[1]/span/span/a/i"));
        browser.sleep(2000);
        var target = element(by.xpath("//div[@id='ecb-rateTableEdit']/p-datatable/div/div[1]/table/tbody/tr[1]/td[1]/span/span/a/i"));
        browser.executeScript(dragAndDropFn, source.getWebElement(), target.getWebElement());
        browser.sleep(2000);
        console.log('drag and drop worked');
      }
      else {
        console.log('unable to drag the element');
      }
    });
    // default rate
           var defaultrate = element(by.xpath("//span[contains(text(),'The default rate value is')]"));
           defaultrate.isPresent().then(function (result) {
          if (result) {
          expect(element(by.xpath("//div[@id='ecb-rateTableEdit']/p-datatable/div/div[1]/table/tbody/tr[2]/td[5]/span/span/div/li[1]/label/div/span")).getText()).toEqual(testdata.displayerrortext);
           expect(element(by.xpath("//div[@id='ecb-rateTableEdit']/p-datatable/div/div[1]/table/tbody/tr[2]/td[5]/span/span/div/li[2]/label/div/span")).getText()).toEqual(testdata.entervaluestext);
          element(by.xpath("//div[@id='ecb-rateTableEdit']/p-datatable/div/div[1]/table/tbody/tr[2]/td[5]/span/span/div/li[2]/label/input")).click();
          browser.sleep(1000);
          element(by.xpath("//div[@id='ecb-rateTableEdit']/p-datatable/div/div[1]/table/tbody/tr[2]/td[5]/span/span/div/li[1]/label/input")).click();
          browser.sleep(1000);
        } else {
           console.log('default rate is not present');
          }

           });


          // save clicking
          element(by.xpath("//ecb-rates-table/ngx-aside/aside/section/div/div/div[1]/div/div/button[1]")).click();
          browser.sleep(2000);
          
          // cancel validation if error is present
          var error = element(by.xpath("//ecb-rates-table/ngx-aside/aside/section/div/div/div[2]/div/div/div/p"));
           error.isPresent().then(function (result){
         if(result){
           browser.sleep(1000);
           element(by.xpath("//ecb-rates-table/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]/span")).click();
           browser.sleep(1000);
         } else {
             console.log('error is not present while saving');
         }
           });
              } else {
                  console.log('icon is not present');
              }   
                });
          }else {
            console.log('table is not present');
          }
         });
         }else {
            console.log('popup not came');
         }
        });
         } else {
           console.log('rate table is not there , edit icon is not there');
         }
         });
         }
       });
        
       

      });
});