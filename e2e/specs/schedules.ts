var testdata = require('../inputs/testdata/schedules.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {
   
   
 
         it('schedules widget plus icon', function () {

browser.sleep(5000);
             var schedulehead = element(by.xpath("//ecb-schedules/div[1]/div[2]/div[1]/div/h3/span[1]"));
           schedulehead.isPresent().then(function (result){
              if(result){ 
browser.sleep(4000);
           expect(element(by.xpath("//ecb-schedules/div[1]/div[2]/div[1]/div/h3/span[1]")).getText()).toEqual(testdata.schedule);
           expect(element(by.xpath("//ecb-schedules/div[1]/div[2]/div[2]/div/span/span[1]")).getText()).toEqual(testdata.notification);
  expect(element(by.xpath("//ecb-schedules/div[1]/div[2]/div[2]/div/span/span[2]")).getText()).toEqual(testdata.subscribers);

  //var attr = element(by.xpath("//ecb-schedules/div[1]/div[2]/div[2]/div/span/img")).getAttribute('src');
        //expect(attr).toEqual(testdata.img1);
        var table = element(by.xpath("//ecb-schedules/div[1]/div[3]/form/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span/div/span"));
        table.isPresent().then(function (result){
         if(result){
             expect(element(by.xpath("//ecb-schedules/div[1]/div[3]/form/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span/div/span")).getText()).toEqual(testdata.actions);
          expect(element(by.xpath("//ecb-schedules/div[1]/div[3]/form/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/span")).getText()).toEqual(testdata.name);
          expect(element(by.xpath("//ecb-schedules/div[1]/div[3]/form/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[4]/span")).getText()).toEqual(testdata.ofRates);
          expect(element(by.xpath("//ecb-schedules/div[1]/div[3]/form/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[5]/span")).getText()).toEqual(testdata.starttype);
        
          var selection = element(by.xpath("//input[@class='ebRadioBtn_noText']"));
        selection.isPresent().then(function (result){
         if(result){ 
           
            var rows = element(by.xpath("//ecb-schedules/div[1]/div[3]/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr/td[2]/span/span/a/em"));
          rows.isPresent().then(function (result){
         if(result){                      
             console.log('rows are present');
               element(by.xpath("//ecb-schedules/div[1]/div[3]/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr/td[2]/span/span/a/em")).click();
               browser.sleep(4000);
          
            var editschedulepanel = element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[1]/div/div/h2"));
            editschedulepanel.isPresent().then(function (result){
         if(result){ 
           expect(element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[1]/div/div/h2")).getText()).toEqual(testdata.editschedulestext);
           browser.actions().mouseMove(element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[1]/div/div/h2"))).perform();
           browser.sleep(4000);
           expect(element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[3]/div/div/span/span[1]")).getText()).toEqual(testdata.notification);
           // cancel clicking
           element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[1]/div/div/div/button[2]/span")).click();
            browser.sleep(3000);
            var cancelwithoutsave = element(by.xpath("//ecb-schedules/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"));
            cancelwithoutsave.isPresent().then(function (result){
         if(result){ 
           browser.actions().mouseMove(element(by.xpath("//ecb-schedules/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"))).perform();
           browser.sleep(3000);
           element(by.xpath("//ecb-schedules/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]")).click();
           browser.sleep(3000);
         } else {
           console.log('cancel without save popup not came when we click on the cancel in edit schedules panel');
         }
            });
            element(by.xpath("//ecb-schedules/div[1]/div[3]/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr/td[2]/span/span/a/em")).click();
               browser.sleep(4000);
                  browser.actions().mouseMove(element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[1]/div/div/h2"))).perform();
           browser.sleep(4000);
           var plusicon = element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr/td[1]/span/span/a[1]/em"));
             plusicon.isPresent().then(function (result){
         if(result){ 
           browser.sleep(2000);
           element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr/td[1]/span/span/a[1]/em")).click();
           browser.sleep(3000);
            element(by.xpath("//input[@id='des-0']")).click();
            browser.sleep(3000);
            element(by.xpath("//input[@id='des-0']")).sendKeys(testdata.inputdescription);
            element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[1]/div/div/div/button[1]")).click();
            browser.sleep(6000);
            
             element(by.xpath("//ecb-schedules/div[1]/div[3]/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[2]/span/span/a[3]/em")).click();
             browser.sleep(3000);
             //delpopup
              var delpoup = element(by.xpath("//ecb-schedules/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]/dialog-button-1"));
            delpoup.isPresent().then(function (result){
         if(result){ 
           browser.actions().mouseMove(element(by.xpath("//ecb-schedules/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]/dialog-button-1"))).perform();
           browser.sleep(3000);
           element(by.xpath("//ecb-schedules/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[2]/dialog-button-2")).click();
           browser.sleep(3000);
             element(by.xpath("//ecb-schedules/div[1]/div[3]/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[2]/span/span/a[3]/em")).click();
             browser.sleep(3000);
              browser.actions().mouseMove(element(by.xpath("//ecb-schedules/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]/dialog-button-1"))).perform();
           browser.sleep(3000);
           element(by.xpath("//ecb-schedules/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]/dialog-button-1")).click();
           browser.sleep(3000);
          
         } else {
           console.log('delete popup not came when we click on the delete schedule');
         }
            });
        // copy validation
        element(by.xpath("//ecb-schedules/div[1]/div[3]/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr/td[2]/span/span/a[2]/em")).click();
        browser.sleep(3000);
         browser.actions().mouseMove(element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[1]/div/div/h2"))).perform();
           browser.sleep(4000);
           element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[4]/span/ecb-dropdown/select")).click();
           browser.sleep(3000);
           element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[4]/span/ecb-dropdown/select/option[4]")).click();
           browser.sleep(3000);
          /*  // selecting options
             browser.actions().mouseMove(element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[4]/span/div/p-dropdown/div/label"))).perform();
              browser.sleep(3000);
              element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[4]/span/div/p-dropdown/div/div[3]/span")).click();
              browser.sleep(3000);
              element(by.xpath("//body[@id='mainBody']/div[6]/div/ul/li[4]/span")).click();
              browser.sleep(3000);
    */
              // values of start and end
              element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[5]/span/div/input")).click();
              browser.sleep(2000);
               element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[5]/span/div/input")).clear();
              browser.sleep(2000);
              element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[5]/span/div/input")).sendKeys(testdata.copystartvalue);
              browser.sleep(2000);
              element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[7]/span/div/input")).click();
              browser.sleep(2000);
              element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[7]/span/div/input")).clear();
              browser.sleep(2000);
               element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[7]/span/div/input")).sendKeys(testdata.copyendvalue);
              browser.sleep(2000);
           
             // save 
           element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[1]/div/div/div/button[1]")).click();
            browser.sleep(4000);

         } else {
             console.log('plus icon is not there to add a row');
         }
             });
      
    } else {
            console.log('edit schedule panel not came when we click on the edit icon');
         }
            });


         } else {
            console.log('plus icon is in the disable condition');
         }
          });

         } else {
           console.log('the first schedule radio button selection is not there');
         }
        });
        
            
           
           
       

         }
         else {
           console.log('schedules are not present');
         }
        });

         }

         else {

          console.log('schedule heading is not there');
         }
           });
         
         });

});