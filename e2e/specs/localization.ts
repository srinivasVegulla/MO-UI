var testdata = require('../inputs/testdata/localization.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {

  it('localization widget', function () {
     
       browser.sleep(10000);
       var copypage = element(by.xpath("//ecb-properties/div[2]/div[1]/div/h2"));
       copypage.isPresent().then(function (result) {
      if (result) { 
  browser.navigate().back();
  browser.sleep(10000);

   
       } else{
           console.log('copy page not created');
           element(by.xpath("//span[@id='breadcrumbExpDivs']")).click();
    element(by.xpath("//ecb-breadcrumb/div[1]/ol/li/div[1]/ul/li[2]/a")).click();
    browser.sleep(5000);

    expect(element(by.xpath("//ecb-localization/div[1]/div/div[1]/h2")).getText()).toEqual(testdata.heading);
    expect(element(by.xpath("//ecb-localization/div[1]/div/div[1]/div/div[2]/h2")).getText()).toEqual(testdata.tableheading);
       }
      });
  });
    it('localization widget entering values', function () {

      browser.sleep(4000);
    var table = element(by.xpath("//ecb-localization/div/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span"));
    table.isPresent().then(function (result) {
      if (result) {      
    var inputs = element(by.xpath("//ecb-localization/div/div/div[1]/div/div[1]/div[2]/div/input"));
    inputs.isPresent().then(function (result) {
      if (result) {  
         element(by.xpath("//ecb-localization/div/div/div[1]/div/div[1]/div[2]/div/input")).click();
         browser.sleep(2000);
          element(by.xpath("//ecb-localization/div/div/div[1]/div/div[1]/div[3]/div/input")).click();
          browser.sleep(2000);
          element(by.xpath("//ecb-localization/div/div/div[1]/div/div[1]/div[4]/div/input")).click();
          browser.sleep(2000);
          element(by.xpath("//ecb-localization/div/div/div[1]/div/div[1]/div[5]/div/input")).click();
          browser.sleep(2000);
         element(by.xpath("//ecb-localization/div/div/div[1]/div/div[1]/div[5]/div/input")).click();

          browser.sleep(2000);
          var entervalue = element(by.xpath("//ecb-localization/div/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[6]"));
              entervalue.isPresent().then(function (result) {
      if (result) {
        element(by.xpath("//ecb-localization/div/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[6]")).click();
        browser.sleep(2000);
         element(by.xpath("//ecb-localization/div/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[6]/div/input")).clear();
         browser.sleep(2000);
        element(by.xpath("//ecb-localization/div/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[6]/div/input")).sendKeys(testdata.entervalue);
       
        browser.actions().mouseMove(element(by.xpath("//ecb-localization/div/div/div[1]/div/div[1]/div[3]/div/input"))).perform();
        browser.sleep(4000);
        element(by.xpath("//ecb-localization/div/div/div[1]/div/div[1]/div[3]/div/input")).click();
          browser.sleep(4000);
           var popup = element(by.xpath("//ecb-localization/div/ecb-modal-dialog/div/div/div/div[2]/div/button[2]/dialog-button-2"));
           popup.isPresent().then(function (result) {
      if (result) {
        browser.actions().mouseMove(element(by.xpath("//ecb-localization/div/ecb-modal-dialog/div/div/div/div[2]/div/button[2]/dialog-button-2"))).perform();
          browser.sleep(2000);
          element(by.xpath("//ecb-localization/div/ecb-modal-dialog/div/div/div/div[2]/div/button[2]/dialog-button-2")).click();
          browser.sleep(4000);
          element(by.xpath("//ecb-localization/div/div/div[1]/div/div[1]/div[3]/div/input")).click();
          browser.sleep(4000);
           } else {
         console.log('save the edits popup is not came');
      }
           });
      
         var entervalue1 = element(by.xpath("//ecb-localization/div/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[7]"));
entervalue1.isPresent().then(function (result) {
      if (result) {
           element(by.xpath("//ecb-localization/div/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[7]")).click();
        browser.sleep(2000);
         element(by.xpath("//ecb-localization/div/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[7]/div/input")).clear();
         browser.sleep(2000);
        element(by.xpath("//ecb-localization/div/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[7]/div/input")).sendKeys(testdata.entervalue1);
     browser.actions().mouseMove(element(by.xpath("//ecb-localization/div/div/div[1]/div/div[1]/div[3]/div/input"))).perform();
        browser.sleep(4000);
        element(by.xpath("//ecb-localization/div/div/div[1]/div/div[1]/div[3]/div/input")).click();
          browser.sleep(4000);
          var popup1 = element(by.xpath("//ecb-localization/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]/dialog-button-1"));
           popup1.isPresent().then(function (result) {
      if (result) {
          browser.actions().mouseMove(element(by.xpath("//ecb-localization/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]/dialog-button-1"))).perform();
          browser.sleep(3000);
          element(by.xpath("//ecb-localization/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]/dialog-button-1")).click();
          browser.sleep(3000);
          } else {
         console.log('save the edits popup is not came');
      }
           }); 
            } else {
         console.log('placeholder is not there to enter values');
      }
              }); 
      
     } else {
         console.log('placeholder is not there to enter values');
      }
              });
 } else{
           console.log('checkboxes are not present');
      }
    });
     } else {
         console.log('table is not present');
      }
    });
  });
   it('localization widget filtering and sorting', function () {
     var table1 = element(by.xpath("//ecb-localization/div/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span"));
    table1.isPresent().then(function (result) {
      if (result) {  
         //browser.actions().mouseMove(element(by.xpath("//ecb-localization/div/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[1]/p-dropdown/div/label"))).perform();
          //browser.sleep(2000);
          //element(by.xpath("//ecb-localization/div/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[1]/p-dropdown/div/div[3]/span")).click();
          //browser.sleep(2000);
          //element(by.xpath("//body[@id='mainBody']/div[1]/div/ul/li[2]/span")).click();
          //browser.sleep(2000);
          element(by.xpath("//ecb-localization/div/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input")).click();
          element(by.xpath("//ecb-localization/div/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input")).sendKeys(testdata.objectname);
          browser.sleep(2000);
           element(by.xpath("//ecb-localization/div/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/div/div/i")).click();
           browser.sleep(2000);
          // browser.actions().mouseMove(element(by.xpath("//ecb-localization/div/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/p-dropdown/div/label"))).perform();
          // browser.sleep(2000);
          // element(by.xpath("//ecb-localization/div/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/p-dropdown/div/div[3]/span")).click();
          // browser.sleep(2000);
         // element(by.xpath("//body[@id='mainBody']/div[2]/div/ul/li[2]/span")).click();
         // browser.sleep(3000);
          // refresh
          element(by.xpath("//em[@class='fa fa-refresh  ecb-alignicon']")).click();
          browser.sleep(4000);
           element(by.xpath("//body[@id='mainBody']/app-root/welcome/div[2]/div[2]/ecb-contextbar/div/div/div/div/div/button")).click();
           browser.sleep(6000);  
        } else{
           console.log('table is not present to filter and sort');
      }
    });
     
  });
});