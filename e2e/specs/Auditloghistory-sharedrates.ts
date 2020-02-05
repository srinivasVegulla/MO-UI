var testdata = require('../inputs/testdata/Auditloghistory-sharedrates.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {

 it('auditlog from sharedrates schedules', function () {
      

         browser.sleep(2000);

      var auditlog = element(by.xpath("//i[@class='fa fa-history']"));
      auditlog.isPresent().then(function (result) {
           if(result){
            auditlog.click();
            browser.sleep(4000);
            var panel = element(by.xpath("//ecb-schedules/div[1]/ngx-aside[2]/aside/section/div/div[1]/div/div/h2"));
            panel.isPresent().then(function (result) {
        if(result){
           browser.actions().mouseMove(element(by.xpath("//ecb-schedules/div[1]/ngx-aside[2]/aside/section/div/div[1]/div/div/h2"))).perform();
           browser.sleep(3000);
           expect(element(by.xpath("//ecb-auditlog/div/div[1]/h2")).getText()).toEqual(testdata.auditlogheading);
            expect(element(by.xpath("//ecb-auditlog/div/div[1]/h2/span")).getText()).toEqual(testdata.auditlognum);
           var table = element(by.xpath("//span[contains(text(),'No Records')]"));
           table.isPresent().then(function (result) {
        if(result){
           console.log('no records are present in the auditlog history from the schedules'); 
           
      
        } else {
          
          // sorting
          element(by.xpath("//ecb-auditlog/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]")).click();
          browser.sleep(2000);
           element(by.xpath("//ecb-auditlog/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]")).click();
          browser.sleep(2000);
          // filtering
          element(by.xpath("//ecb-auditlog/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/div/input")).click();
          browser.sleep(2000);
         element(by.xpath("//ecb-auditlog/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/div/input")).sendKeys(testdata.usersearch);
         browser.sleep(2000);
         element(by.xpath("//ecb-auditlog/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/div/div/div/i")).click();
         browser.sleep(2000);
         // checking date populating

        var lastcolumn = element(by.xpath("//ecb-auditlog/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[12]/span[1]"));
        lastcolumn.isPresent().then(function (result){
           if(result){
         var widget= element(by.xpath("//ecb-auditlog/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[12]/span[1]"));
           
            browser.executeScript('arguments[0].scrollIntoView()',widget.getWebElement());
           } else {
             console.log('rule set start date column is not present to see the date and time');
           }
        });

         // download
        var download = element(by.xpath("//ecb-auditlog/div/div[1]/div/a[@class='disabled'][2]"));
      download.isPresent().then(function (result){
           if(result){
               console.log('download in auditlog is disabled');
           } else {
            console.log('download icon is enabled');
            browser.sleep(1000);
            element(by.xpath("//ecb-auditlog/div/div[1]/div/a[2]/em")).click();
            browser.sleep(5000);
           }
      });

      // close clicking
        element(by.xpath("//ecb-schedules/div[1]/ngx-aside[2]/aside/section/div/div[1]/div/div/div/button/span")).click();
        browser.sleep(5000);
        }
           });



        } else {
            console.log('auditlog panel not came from the rate schedule');
        }
            });

           } else{
              console.log('audit log icon is not present in the rate schedule widget');
           }
      });

 
});
});
