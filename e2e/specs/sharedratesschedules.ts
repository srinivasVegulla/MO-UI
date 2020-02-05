var testdata = require('../inputs/testdata/sharedratesschedules.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {

      it('sharedrates schedules plusicon widget', function() {
        
        var ratetable = element(by.xpath("//h2[contains(text(),'Rates Table:')]"));
        ratetable.isPresent().then(function (result) {
      if (result) {
          var scheduleheading = element(by.xpath("//span[contains(text(),'Schedule')]"));
          scheduleheading.isPresent().then(function (result) {
      if (result) {
          var plusicon = element(by.xpath("//ecb-schedules/div[1]/div[3]/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr/td[2]/span/span/span[1]/i"));
          plusicon.isPresent().then(function (result) {
      if (result) {
          plusicon.click();
          browser.sleep(4000);
          var popupheading = element(by.xpath("//h3[contains(text(),'Edit Schedules')]"));
          popupheading.isPresent().then(function (result) {
      if (result) {
          browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Edit Schedules')]"))).perform();
          browser.sleep(3000);
          // clicking on cancel
          element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[1]/div/div/button[2]/span")).click();
          browser.sleep(3000);
          var cancelpopup = element(by.xpath("//ecb-schedules/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"));
          cancelpopup.isPresent().then(function (result) {
      if (result) {
           browser.actions().mouseMove(element(by.xpath("//ecb-schedules/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"))).perform();
           browser.sleep(2000);
           element(by.xpath("//ecb-schedules/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]")).click();
           browser.sleep(2000);
      } else {
          console.log('cancel without save popup not came in shared rates schedules');
      }
          });
         plusicon.click();
          browser.sleep(4000);
           browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Edit Schedules')]"))).perform();
          browser.sleep(3000);
          // clicking on cancel
          element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[1]/div/div/button[2]/span")).click();
          browser.sleep(3000);
          var cancelpopup1 = element(by.xpath("//ecb-schedules/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"));
          cancelpopup1.isPresent().then(function (result) {
      if (result) {
           browser.actions().mouseMove(element(by.xpath("//ecb-schedules/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"))).perform();
           browser.sleep(2000);
           element(by.xpath("//ecb-schedules/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[2]")).click();
           browser.sleep(2000);
      } else {
          console.log('cancel without save popup not came in shared rates schedules to return');
      }
          });
          // save
          element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[1]/div/div/button[1]")).click();
          browser.sleep(3000);

      } else {
          console.log('edit schedules heading is not there in sharedrates');
      }
          });

      } else {
          console.log('plusicon is not there in schedules ion shared rates');
      }
          });

      } else {
          console.log('schedule heaing is not ther in shared rates');
      }
        });
      } else {
       console.log('rate table heading is not there in shared rates');
      }
        });
      });
      
      

 it('sharedrates schedules edit widget', function() {
 
 var edit = element(by.xpath("//ecb-schedules/div[1]/div[2]/div[1]/div/h3/span[2]/a[2]"));
 edit.isPresent().then(function (result) {
      if (result) {
       edit.click();
       browser.sleep(4000);
        var popupheading1 = element(by.xpath("//h3[contains(text(),'Edit Schedules')]"));
          popupheading1.isPresent().then(function (result) {
      if (result) {
          browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Edit Schedules')]"))).perform();
          browser.sleep(3000);
          // clicking cancel
          element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[1]/div/div/button[2]/span")).click();
          browser.sleep(3000);
          edit.click();
       browser.sleep(4000);
        browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Edit Schedules')]"))).perform();
          browser.sleep(3000);
        var table = element(by.xpath("//input[@id='des-0']"));
         table.isPresent().then(function (result) {
      if (result) {
        table.click();
        table.sendKeys(testdata.name);
        browser.sleep(1000);
        //cancel
         element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[1]/div/div/button[2]/span")).click();
          browser.sleep(3000);
          // cancel without save
           var cancelpopup = element(by.xpath("//ecb-schedules/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"));
          cancelpopup.isPresent().then(function (result) {
      if (result) {
           browser.actions().mouseMove(element(by.xpath("//ecb-schedules/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"))).perform();
           browser.sleep(2000);
           element(by.xpath("//ecb-schedules/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]")).click();
           browser.sleep(2000);
      } else {
          console.log('cancel without save popup not came in shared rates schedules');
      }
          }); 
          edit.click();
       browser.sleep(4000);
        browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Edit Schedules')]"))).perform();
          browser.sleep(3000);
           table.click();
        table.sendKeys(testdata.name);
        browser.sleep(1000);

        //cancel
         element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[1]/div/div/button[2]/span")).click();
          browser.sleep(3000);
          // cancel without save
           var cancelpopup = element(by.xpath("//ecb-schedules/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"));
          cancelpopup.isPresent().then(function (result) {
      if (result) {
           browser.actions().mouseMove(element(by.xpath("//ecb-schedules/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"))).perform();
           browser.sleep(2000);
           element(by.xpath("//ecb-schedules/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[2]")).click();
           browser.sleep(2000);
      } else {
          console.log('cancel without save popup not came in shared rates schedules to return');
      }
          }); 
          // copy icon
          var copyicon = element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[4]/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/span[2]/i"));
           copyicon.isPresent().then(function (result) {
      if (result) {
          
           copyicon.click();
           browser.sleep(2000);

         browser.actions().mouseMove(element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[4]/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[4]/span/div/p-dropdown/div/label"))).perform();
          browser.sleep(2000);
          element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[4]/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[4]/span/div/p-dropdown/div/div[3]/span")).click();
          browser.sleep(2000);
          element(by.xpath("//span[contains(text(),'# of Days after Subscription')]")).click();
          browser.sleep(2000);
          element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[4]/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[5]/span/div/input")).click();
          element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[4]/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[5]/span/div/input")).clear();
          element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[4]/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[5]/span/div/input")).sendKeys(testdata.startnum);
           var widget= element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[4]/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[7]/span/div/input"));
     browser.executeScript('arguments[0].scrollIntoView()',widget.getWebElement());
      element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[4]/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[7]/span/div/input")).click();
      element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[4]/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[7]/span/div/input")).clear();
      element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[4]/form/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[7]/span/div/input")).sendKeys(testdata.endnum);
       //save
       element(by.xpath("//ecb-schedules/div[1]/ngx-aside[1]/aside/section/div/div/div[1]/div/div/button[1]")).click();
       browser.sleep(4000);
    } else {
                 console.log('copy icon is not present in schdules in sharedrates');
      }
           });
      } else {
             console.log('table is not present in edit panel in schedules in shard rates');
      }
         });
      } else {
           console.log('edit schedule heading is not there in schedules in shared rates ');
      }
          });
      } else {
             console.log('edit icon is not present to edit the schedules in shared rates');
      }
 });
      

 });
            
            });