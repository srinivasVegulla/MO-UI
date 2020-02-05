var testdata = require('../inputs/testdata/auditloggrid.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {

      it('auditlog  widget', function() {
        browser.sleep(5000);

      element(by.xpath("//span[@id='breadcrumbExpDivs']")).click();
          browser.sleep(2000);
          element(by.xpath("//a[contains(text(),'Audit Log')]")).click();
          browser.sleep(10000);

        var auditlogpage = element(by.xpath("//ecb-breadcrumb/div[3]/h1"));
         auditlogpage.isPresent().then(function (result) {
      if (result) {
          expect(element(by.xpath("//ecb-breadcrumb/div[3]/h1")).getText()).toEqual(testdata.auditlogheading);
          
          expect(element(by.xpath("//ecb-auditlog/div/div[1]/h2")).getText()).toEqual(testdata.auditlogtableheading);
          
          var noofrecords = element(by.xpath("//ecb-auditlog/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/span"));
          noofrecords.isPresent().then(function(result) {
              if (result) {
            var second = element(by.xpath("//ecb-auditlog/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[2]/td[1]/span/span"));
            second.isPresent().then(function(result) {
              if (result) {
             // sorting
             element(by.xpath("//ecb-auditlog/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]")).click();
             browser.sleep(10000);
             element(by.xpath("//ecb-auditlog/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]")).click();
                browser.sleep(10000);
                // refresh
                element(by.xpath("//ecb-auditlog/div/div[1]/div/span[2]/em")).click();
                browser.sleep(10000);
                // filtering
                element(by.xpath("//ecb-auditlog/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/div/input")).click();
                browser.sleep(10000);
                element(by.xpath("//ecb-auditlog/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/div/input")).sendKeys(testdata.usersearch);
                 browser.sleep(10000);
               
                 var recordsnotfound =  element(by.xpath("//span[contains(text(),'No Records')]"));
                 recordsnotfound.isPresent().then(function(result) {
              if (result) {
                  console.log('no records are there with the search');
                    element(by.xpath("//ecb-auditlog/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/div/div/div/i")).click();
                 browser.sleep(10000);
              } else {

             
                 element(by.xpath("//ecb-auditlog/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/div/div/div/i")).click();
                 browser.sleep(10000);
                  }
                 });
              }
              else{
            console.log('only one record is present so unable to sort and filter');
              }
            });
          } else {
        console.log('  records are not  present  audit log ');
          }
          });
      } else {
       console.log('audit log page is not loaded');
      }
         });
      });
});