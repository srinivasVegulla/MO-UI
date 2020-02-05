var testdata = require('../inputs/testdata/schedules.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {
   
   browser.sleep(5000);
 
         it('schedules widget edit icon', function () {

             var schedulehead = element(by.xpath("//ecb-schedules/div[1]/div[2]/div[1]/div/h3/span[1]"));
           schedulehead.isPresent().then(function (result){
              if(result){ 

           expect(element(by.xpath("//ecb-schedules/div[1]/div[2]/div[1]/div/h3/span[1]")).getText()).toEqual(testdata.schedule);
           expect(element(by.xpath("//ecb-schedules/div[1]/div[2]/div[2]/div/span/span[1]")).getText()).toEqual(testdata.notification);
  expect(element(by.xpath("//ecb-schedules/div[1]/div[2]/div[2]/div/span/span[2]")).getText()).toEqual(testdata.subscribers);

  
     
          var editicon = element(by.xpath("//ecb-schedules/div[1]/div[2]/div[1]/div/h3/span[2]/span[@class='disableAction']/a"));
          editicon.isPresent().then(function (result){
         if(result){ 
             console.log('edit icon is in disable state to click');
           
         } else {
            element(by.xpath("//ecb-schedules/div[1]/div[2]/div[1]/div/h3/span[2]/span/a")).click();
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
            browser.sleep(4000);
           // edit clicking
            
             element(by.xpath("//ecb-schedules/div[1]/div[2]/div[1]/div/h3/span[2]/span/a")).click();
            browser.sleep(4000);
                  browser.actions().mouseMove(element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[1]/div/div/h2"))).perform();
           browser.sleep(4000);
          // plus icon clicking
          element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr/td[1]/span/span/a[1]/em")).click();
          browser.sleep(2000);


           
            element(by.xpath("//input[@id='des-0']")).click();
            browser.sleep(3000);
            element(by.xpath("//input[@id='des-0']")).sendKeys(testdata.inputdescription);
            // selecting options
        /*     browser.actions().mouseMove(element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[4]/span/div/p-dropdown/div/label"))).perform();
              browser.sleep(3000);
              element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[4]/span/div/p-dropdown/div/div[3]/span")).click();
              browser.sleep(3000);
              element(by.xpath("//body[@id='mainBody']/div[6]/div/ul/li[4]/span")).click();
              browser.sleep(3000);
*/

             browser.sleep(3000);
               element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[4]/span/ecb-dropdown/select")).click();
           browser.sleep(3000);
           element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[4]/span/ecb-dropdown/select/option[4]")).click();
           browser.sleep(3000);
              // values of start and end
              element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[5]/span/div/input")).click();
              browser.sleep(2000);
               element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[5]/span/div/input")).clear();
              browser.sleep(2000);
              element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[5]/span/div/input")).sendKeys(testdata.copystartvalue1);
              browser.sleep(2000);
              element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[7]/span/div/input")).click();
              browser.sleep(2000);
              element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[7]/span/div/input")).clear();
              browser.sleep(2000);
               element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[7]/span/div/input")).sendKeys(testdata.copyendvalue1);
              browser.sleep(2000);
            element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[1]/div/div/div/button[1]")).click();
            browser.sleep(6000);
           
           // edit clicking
            element(by.xpath("//ecb-schedules/div[1]/div[2]/div[1]/div/h3/span[2]/span/a")).click();
            browser.sleep(4000);
                  browser.actions().mouseMove(element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[1]/div/div/h2"))).perform();
           browser.sleep(4000);
          
             element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/span/a[3]/em")).click();
             browser.sleep(3000);
             //delpopup
              var delpoup = element(by.xpath("//ecb-schedules/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]/dialog-button-1"));
            delpoup.isPresent().then(function (result){
         if(result){ 
           browser.actions().mouseMove(element(by.xpath("//ecb-schedules/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]/dialog-button-1"))).perform();
           browser.sleep(4000);
           element(by.xpath("//ecb-schedules/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[2]/dialog-button-2")).click();
           browser.sleep(4000);
             element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/span/a[3]/em")).click();
             browser.sleep(4000);
              browser.actions().mouseMove(element(by.xpath("//ecb-schedules/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]/dialog-button-1"))).perform();
           browser.sleep(4000);
           element(by.xpath("//ecb-schedules/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]/dialog-button-1")).click();
           browser.sleep(3000);
           // save 
           element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[1]/div/div/div/button[1]")).click();
            browser.sleep(4000);
         } else {
           console.log('delete popup not came when we click on the delete schedule');
         }
            });
        // copy validation
        element(by.xpath("//ecb-schedules/div[1]/div[2]/div[1]/div/h3/span[2]/span/a")).click();
            browser.sleep(4000);
         browser.actions().mouseMove(element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[1]/div/div/h2"))).perform();
           browser.sleep(4000);
           // copy clicking
           element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/span/a[2]/em")).click();

           browser.sleep(3000);
               element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[4]/span/ecb-dropdown/select")).click();
           browser.sleep(3000);
           element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[4]/span/ecb-dropdown/select/option[4]")).click();
           browser.sleep(3000);
            // values of start and end
              element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[5]/span/div/input")).click();
              browser.sleep(2000);
               element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[5]/span/div/input")).clear();
              browser.sleep(2000);
              element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[5]/span/div/input")).sendKeys(testdata.copystartvalue2);
              browser.sleep(2000);
              element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[7]/span/div/input")).click();
              browser.sleep(2000);
              element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[7]/span/div/input")).clear();
              browser.sleep(2000);
               element(by.xpath("//div[@id='ecb-schedulesTableEdit']/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[7]/span/div/input")).sendKeys(testdata.copyendvalue2);
              browser.sleep(2000);
          
             // save 
           element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[1]/div/div/div/button[1]")).click();
            browser.sleep(4000);

      
    } else {
            console.log('edit schedule panel not came when we click on the edit icon');
         }
            });
         }
          });


    

         }

         else {

          console.log('schedule heading is not there');
         }
           });
         
         });

});