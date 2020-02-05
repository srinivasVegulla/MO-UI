var testdata = require('../inputs/testdata/deletescheduleandrate.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {

 it('delete  rate widget', function () {

         
          var deleteicon = element(by.xpath("//ecb-rates-table/div[1]/div[2]/div/p-datatable/div/div[1]/table/tbody/tr[1]/td[1]/span/span/a[2]/i"));
        deleteicon.isPresent().then(function (result) {
           if(result){
         var disabled = element(by.xpath("//ecb-rates-table/div[1]/div[2]/div/p-datatable/div/div[1]/table/tbody/tr[1]/td[1]/span/span/a[2]/i[@class='fa fa-times-circle-o fa-disabled']"));
         disabled.isPresent().then(function (result) {
           if(result){
              console.log('deleteicon is disabled in schedules'); 
           } else {
          element(by.xpath("//ecb-rates-table/div[1]/div[2]/div/p-datatable/div/div[1]/table/tbody/tr[1]/td[1]/span/span/a[2]/i")).click();
          browser.sleep(3000);
            var popup = element(by.xpath("//ecb-rates-table/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]/dialog-button-1"));
            popup.isPresent().then(function (result) {
           if(result){
              browser.actions().mouseMove(element(by.xpath("//ecb-rates-table/ecb-modal-dialog[2]/div/div/div/div[1]/div[2]/div[1]/dialog-header"))).perform();
              browser.sleep(3000);
              element(by.xpath("//ecb-rates-table/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[2]/dialog-button-2")).click();
              browser.sleep(2000);
             // edit panel
             var editpanel = element(by.xpath("//ecb-rates-table/ngx-aside/aside/section/div/div/div[1]/div/h3"));
              editpanel.isPresent().then(function (result) {
           if(result){
             browser.actions().mouseMove(element(by.xpath("//ecb-rates-table/ngx-aside/aside/section/div/div/div[1]/div/h3"))).perform();
             browser.sleep(2000);
               element(by.xpath("//ecb-rates-table/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]/span")).click();
               browser.sleep(3000);
           } else {
               console.log('edit panel not came along with the delete rate popup');
           }
              });


              // again clicking 
              element(by.xpath("//ecb-rates-table/div[1]/div[2]/div/p-datatable/div/div[1]/table/tbody/tr[1]/td[1]/span/span/a[2]/i")).click();
              browser.sleep(2000);
               browser.actions().mouseMove(element(by.xpath("//ecb-rates-table/ecb-modal-dialog[2]/div/div/div/div[1]/div[2]/div[1]/dialog-header"))).perform();
              browser.sleep(3000);
              element(by.xpath("//ecb-rates-table/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]/dialog-button-1")).click();
              browser.sleep(2000);
              // edit panel
              var editpanel1 = element(by.xpath("//ecb-rates-table/ngx-aside/aside/section/div/div/div[1]/div/h3"));
              editpanel1.isPresent().then(function (result) {
           if(result){
       browser.actions().mouseMove(element(by.xpath("//ecb-rates-table/ngx-aside/aside/section/div/div/div[1]/div/h3"))).perform();
             browser.sleep(2000);
               element(by.xpath("//ecb-rates-table/ngx-aside/aside/section/div/div/div[1]/div/div/button[1]")).click();
               browser.sleep(3000);
           } else {
               console.log('edit panel not came along with the delete rate popup');
           }
              });

     

           } else {
              console.log('popup is not came while deleting rates');
           }
            });
           }
         });
           } else {
              console.log('delete icon is not there in rate table');
           }
        });
     });

  it('delete  schedule widget', function () {
        browser.sleep(2000);
        var deleteicon = element(by.xpath("//ecb-schedules/div[1]/div[3]/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[2]/span/span/span[3]/i"));
        deleteicon.isPresent().then(function (result) {
           if(result){
         var disabled = element(by.xpath("//ecb-schedules/div[1]/div[3]/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[2]/span/span/span[3]/i[@class='fa fa-times-circle-o fa-disabled']"));
         disabled.isPresent().then(function (result) {
           if(result){
              console.log('deleteicon is disabled in schedules'); 
           } else {
          element(by.xpath("//ecb-schedules/div[1]/div[3]/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[2]/span/span/span[3]/i")).click();
          browser.sleep(3000);
            var popup = element(by.xpath("//ecb-schedules/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]/dialog-button-1"));
            popup.isPresent().then(function (result) {
           if(result){
              browser.actions().mouseMove(element(by.xpath("//ecb-schedules/ecb-modal-dialog[2]/div/div/div/div[1]/div[2]/div[1]/dialog-header"))).perform();
              browser.sleep(3000);
              element(by.xpath("//ecb-schedules/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[2]/dialog-button-2")).click();
              browser.sleep(3000);
              // again clicking 
              element(by.xpath("//ecb-schedules/div[1]/div[3]/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[2]/span/span/span[3]/i")).click();
              browser.sleep(2000);
               browser.actions().mouseMove(element(by.xpath("//ecb-schedules/ecb-modal-dialog[2]/div/div/div/div[1]/div[2]/div[1]/dialog-header"))).perform();
              browser.sleep(3000);
              element(by.xpath("//ecb-schedules/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]/dialog-button-1")).click();
              browser.sleep(3000);



           } else {
              console.log('popup is not came while deleting schedule');
           }
            });
           }
         });
           } else {
              console.log('delete icon is not there in schedules');
           }
        });


  });
    
});
