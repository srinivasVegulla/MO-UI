var testdata = require('../inputs/testdata/localizationinbundledetailpage.json');

import { browser, by, element } from 'protractor';


describe('widget', function () {
    

  it('PO details page localization', function () {
     browser.sleep(5000);
    

    var localization = element(by.xpath("//div[@class='control-bar visible-md-up hidden-sm hidden-xs']/ecb-contextbar/div/div/div/div[2]/div/a"));
    localization.isPresent().then(function (result){
             if(result){
                element(by.xpath("//div[@class='control-bar visible-md-up hidden-sm hidden-xs']/ecb-contextbar/div/div/div/div[2]/div/a")).click();
                browser.sleep(4000);
                // cancel
                element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[1]/div/div/button[2]")).click();
                browser.sleep(4000);
                 element(by.xpath("//div[@class='control-bar visible-md-up hidden-sm hidden-xs']/ecb-contextbar/div/div/div/div[2]/div/a")).click();
                browser.sleep(4000);
                 var page = element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[1]/div/h2"));
                 page.isPresent().then(function (result){
             if(result){
                 expect(element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[1]/div/h2")).getText()).toEqual(testdata.localizationheading);
          var table = element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input"));
                table.isPresent().then(function (result){
             if(result){
            browser.actions().mouseMove(element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[1]/div/h2"))).perform();
            browser.sleep(2000);
            element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[1]/div/div/div[1]/div[2]/label/input")).click();
            browser.sleep(2000);
            element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[1]/div/div/div[1]/div[3]/label/input")).click();
             browser.sleep(2000);
            element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[1]/div/div/div[1]/div[4]/label/input")).click();
              browser.sleep(2000);
               element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[1]/div/div/div[1]/div[5]/label/input")).click();
              browser.sleep(2000);
              element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[1]/div/div/div[1]/div[5]/label/input")).click();
              browser.sleep(2000);
               var entervalue = element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[2]/td[6]"));
              entervalue.isPresent().then(function (result) {
      if (result) {
        element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[2]/td[6]")).click();
        browser.sleep(2000);
         element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[2]/td[6]/div/input")).clear();
         browser.sleep(2000);
        element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[2]/td[6]/div/input")).sendKeys(testdata.entervalue);
       
        browser.actions().mouseMove(element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[1]/div/div/div[1]/div[3]/label/input"))).perform();
        browser.sleep(2000);
        element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[1]/div/div/div[1]/div[3]/label/input")).click();
          browser.sleep(2000);
           var popup = element(by.xpath("//ecb-localization/div/ecb-modal-dialog/div/div/div/div[2]/div/button[2]/dialog-button-2"));
           popup.isPresent().then(function (result) {
      if (result) {
        browser.actions().mouseMove(element(by.xpath("//ecb-localization/div/ecb-modal-dialog/div/div/div/div[1]/div[2]/div[1]/dialog-header"))).perform();
          browser.sleep(2000);
          element(by.xpath("//ecb-localization/div/ecb-modal-dialog/div/div/div/div[2]/div/button[2]/dialog-button-2")).click();
          browser.sleep(2000);
         
           } else {
         console.log('save the edits popup is not came');
      }
           });
      /*
          var entervalue1 = element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[2]/td[7]"));
entervalue1.isPresent().then(function (result) {
      if (result) {
           element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[2]/td[7]")).click();
        browser.sleep(2000);
         element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[2]/td[7]/div/input")).clear();
         browser.sleep(2000);
        element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[2]/td[7]/div/input")).sendKeys(testdata.entervalue1);
     browser.actions().mouseMove(element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[1]/div/div/div[1]/div[4]/label/input"))).perform();
        browser.sleep(2000);
        element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[1]/div/div/div[1]/div[4]/label/input")).click();
          browser.sleep(2000);
          var popup1 = element(by.xpath("//ecb-localization/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]/dialog-button-1"));
           popup1.isPresent().then(function (result) {
      if (result) {
          browser.actions().mouseMove(element(by.xpath("//ecb-localization/div/ecb-modal-dialog/div/div/div/div[1]/div[2]/div[1]/dialog-header"))).perform();
          browser.sleep(2000);
          element(by.xpath("//ecb-localization/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]/dialog-button-1")).click();
          browser.sleep(2000);
          } else {
         console.log('save the edits popup is not came');
      }
           });
            } else {
         console.log('placeholder is not there to enter values');
      }
              });*/
      
     } else {
         console.log('placeholder is not there to enter values');
      }
              });
             // browser.actions().mouseMove(element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[1]/p-dropdown/div/label"))).perform();
             // browser.sleep(2000);
             // element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[1]/p-dropdown/div/div[3]/span")).click();
             // browser.sleep(2000); 
             // element(by.xpath("//body[@id='mainBody']/div[1]/div/ul/li[2]/span")).click();
             // browser.sleep(2000);
              element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input")).click();
              browser.sleep(2000);
              element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input")).sendKeys(testdata.objectname);
              browser.sleep(2000);
              element(by.xpath("//i[@class='fa fa-times-circle fa-lg']")).click();
              browser.sleep(3000);
           // browser.actions().mouseMove(element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/p-dropdown/div/label"))).perform();
            //browser.sleep(2000);
           // element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/p-dropdown/div/div[3]/span")).click();
            //browser.sleep(2000);
            //element(by.xpath("//body[@id='mainBody']/div[2]/div/ul/li[2]/span")).click();
            //browser.sleep(2000);
            element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[1]/div/div/button[1]")).click();
            browser.sleep(2000);
          
             }
             else {
              console.log('table not loading in localization page in bundle details page');
                 element(by.xpath("//ecb-localization/div/ngx-aside/aside/section/div/div[1]/div/div/button[2]")).click();
            browser.sleep(3000);
          
             }
                });

             } else {
              console.log('localization page is not came when clicking');
             }
                });
             }
              else {
               console.log('localization link is not there in bundle detail page');
              }
    });

  });
});