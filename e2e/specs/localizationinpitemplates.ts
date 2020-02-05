var testdata = require('../inputs/testdata/localization-pitemplates.json');

import { browser, by, element } from 'protractor';


describe('widget', function () {
    

  it('pitemplates  details page localization', function () {
     
    
     browser.sleep(5000);
         
    var localization = element(by.xpath("//body[@id='mainBody']/app-root/welcome/div[2]/div[2]/ecb-contextbar/div/div/div/div[1]/div/a"));
    localization.isPresent().then(function (result){
             if(result){
                localization.click();
                browser.sleep(6000);
                 var page = element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[1]/div/div/div[1]/div[2]/label/input"));
                 page.isPresent().then(function (result){
             if(result){
var table = element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[1]/ecb-dropdown/select"));
                table.isPresent().then(function (result){
             if(result){
              browser.actions().mouseMove(element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[1]/div/div/div[1]/div[2]/label/input"))).perform();
            browser.sleep(2000);  
            element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[1]/div/div/div[1]/div[2]/label/input")).click();
            browser.sleep(1000);
            element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[1]/div/div/div[1]/div[3]/label/input")).click();
             browser.sleep(1000);
            element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[1]/div/div/div[1]/div[4]/label/input")).click();
              browser.sleep(1000);
               element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[1]/div/div/div[1]/div[4]/label/input")).click();
              browser.sleep(1000);
              browser.actions().mouseMove(element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[1]/ecb-dropdown/select"))).perform();
              browser.sleep(1000);
              element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[1]/ecb-dropdown/select")).click();
              browser.sleep(2000); 
              element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[1]/ecb-dropdown/select/option[3]")).click();
              browser.sleep(1000);
              element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input")).click();
              browser.sleep(1000);
              element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input")).sendKeys(testdata.objectname);
              browser.sleep(1000);
              element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[2]/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/div/div/i")).click();
              browser.sleep(3000);
          
            element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[1]/div/div/button[1]")).click();
            browser.sleep(3000);
            element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[1]/div/div/button[2]")).click();
            browser.sleep(5000);
     
             }
             else {
              console.log('table not loading in localization page in bundle details page');
                 element(by.xpath("//ecb-localization/div[1]/ngx-aside/aside/section/div/div[1]/div/div/button[2]")).click();
            browser.sleep(5000);
            
             }
                });

             } else {
              console.log('localization page is not came when clicking');
             }
                });
             }
              else {
               console.log('localization link is not there in pi templates detail page');
              }
    });

  });
});
