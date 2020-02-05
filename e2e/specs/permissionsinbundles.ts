var testdata = require('../inputs/testdata/permissionsinbundles.json');

import { browser, by, element } from 'protractor';


describe('widget', function () {
   
    it('permissionswidget', function() { 
             browser.sleep(3000);
              browser.refresh();

              browser.sleep(6000);
           var permissions =   element(by.xpath("//ecb-permissions/div[2]/div[2]/label"));
           permissions.isPresent().then(function (result){
               if(result){   
          var widget= element(by.xpath("//ecb-permissions/div[2]/div[1]/div/h2"));
     
          browser.executeScript('arguments[0].scrollIntoView()',widget.getWebElement());
             
             expect(element(by.xpath("//ecb-permissions/div[2]/div[2]/label")).getText()).toEqual(testdata.selfservicetext);
            
      
       var editper = element(by.xpath("//ecb-permissions/div[2]/div[1]/div/div/a"));
       editper.isPresent().then(function (result){   
           if(result){   
               editper.click();
               browser.sleep(2000);
     browser.actions().mouseMove(element(by.xpath("//ecb-permissions/div[1]/ngx-aside/aside/section/div/div/div[1]/div/h2"))).perform();
       
       element(by.xpath("//input[@id='initFocus']")).click();
       browser.sleep(2000);
       element(by.xpath("//ecb-permissions/div[1]/ngx-aside/aside/section/div/div/div[2]/form/div[2]/label/input")).click();
       element(by.xpath("//ecb-permissions/div[1]/ngx-aside/aside/section/div/div/div[2]/form/div[2]/label/input")).click();
      
       element(by.xpath("//input[@id='initFocus']")).click();
       element(by.xpath("//div[@class='panel panel-default ecb-ngxAsideMargin']/div[1]/div/div/button[2]")).click();
       browser.sleep(2000);  
        var modaldialogper = element(by.xpath("//ecb-permissions/div[2]/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"));
           modaldialogper.isPresent().then(function (result) {
           if(result){
       browser.actions().mouseMove(element(by.xpath("//ecb-permissions/div[2]/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
        browser.sleep(2000);
       element(by.xpath("//ecb-permissions/div[2]/ecb-modal-dialog/div/div/div/div[2]/div/button[1]")).click();
      
      
       browser.sleep(2000);
       element(by.xpath("//ecb-permissions/div[2]/div[1]/div/div/a")).click();
       browser.sleep(2000);
       browser.actions().mouseMove(element(by.xpath("//ecb-permissions/div[1]/ngx-aside/aside/section/div/div/div[1]/div/h2"))).perform();
  
       element(by.xpath("//input[@id='initFocus']")).click();
       browser.sleep(2000);
      
   
       element(by.xpath("//div[@class='panel panel-default ecb-ngxAsideMargin']/div[1]/div/div/button[2]")).click();
       browser.sleep(4000);
         browser.actions().mouseMove(element(by.xpath("//ecb-permissions/div[2]/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
       element(by.xpath("//ecb-permissions/div[2]/ecb-modal-dialog/div/div/div/div[2]/div/button[2]")).click(); // return
       browser.sleep(2000);
        browser.actions().mouseMove(element(by.xpath("//ecb-permissions/div[1]/ngx-aside/aside/section/div/div/div[1]/div/h2"))).perform();
       
      var accounttype =  element(by.xpath("//ecb-permissions/div/ngx-aside/aside/section/div/div/div[2]/form/div[5]/div/p-multiselect/div/div[3]/span"));
      accounttype.isPresent().then(function (result) {
           if(result){
       element(by.xpath("//ecb-permissions/div/ngx-aside/aside/section/div/div/div[2]/form/div[5]/div/p-multiselect/div/div[3]/span")).click();
        browser.sleep(1000);
        element(by.xpath("//ecb-permissions/div/ngx-aside/aside/section/div/div/div[2]/form/div[5]/div/p-multiselect/div/div[4]/div[1]/div[2]/input")).click();
        element(by.xpath("//ecb-permissions/div/ngx-aside/aside/section/div/div/div[2]/form/div[5]/div/p-multiselect/div/div[4]/div[1]/div[2]/input")).sendKeys(testdata.searchaccounttype);
        var selection = element(by.xpath("//ecb-permissions/div/ngx-aside/aside/section/div/div/div[2]/form/div[5]/div/p-multiselect/div/div[4]/div[2]/ul/li[5]/div/div[2]"));
        selection.isPresent().then(function (result) {
           if(result){
             element(by.xpath("//ecb-permissions/div/ngx-aside/aside/section/div/div/div[2]/form/div[5]/div/p-multiselect/div/div[4]/div[2]/ul/li[5]/div/div[2]")).click();
             browser.sleep(1000);
              element(by.xpath("//ecb-permissions/div/ngx-aside/aside/section/div/div/div[2]/form/div[5]/div/p-multiselect/div/div[4]/div[2]/ul/li[6]/div/div[2]")).click();
             browser.sleep(1000);
             element(by.xpath("//ecb-permissions/div/ngx-aside/aside/section/div/div/div[2]/form/div[5]/div/p-multiselect/div/div[4]/div[1]/a/span")).click();
             browser.sleep(1000);
           } else {
             console.log('checkboxes are not there for selection');
           }
        });
           } else {
             console.log('account type is not there');
           }
      });
      var optionality = element(by.xpath("//ecb-permissions/div/ngx-aside/aside/section/div/div/div[2]/form/div[6]/div/div[1]/p-selectbutton/div/div[@class='ui-button ui-widget ui-state-default ui-button-text-only ui-state-active'][1]"));
      optionality.isPresent().then(function (result) {
           if(result){
        element(by.xpath("//ecb-permissions/div/ngx-aside/aside/section/div/div/div[2]/form/div[6]/div/div[1]/p-selectbutton/div/div[2]/span")).click();
        browser.sleep(2000);
           } else {
             console.log('optionality is disable may be the condition is not satisfied');
           }
      });
        element(by.xpath("//input[@id='initFocus']")).click();
        element(by.xpath("//input[@id='initFocus']")).click();
      /*  // date selection need to edit
        element(by.xpath("//ecb-permissions/div[1]/ngx-aside/aside/section/div/div/div[2]/form/div[3]/div/p-calendar/span/input")).click();
        browser.sleep(1000);
        browser.actions().mouseMove(element(by.xpath("//ecb-permissions/div[1]/ngx-aside/aside/section/div/div/div[2]/form/div[3]/div/p-calendar/span/div/table/tbody/tr[3]/td[3]/a"))).perform();
        element(by.xpath("//ecb-permissions/div[1]/ngx-aside/aside/section/div/div/div[2]/form/div[3]/div/p-calendar/span/div/table/tbody/tr[3]/td[3]/a")).click();
        browser.sleep(2000);  */
        // save
         element(by.xpath("//div[@class='panel panel-default ecb-ngxAsideMargin']/div[1]/div/div/button[1]")).click();
           browser.sleep(4000);
           var error1= element(by.xpath("//ecb-permissions/div/ngx-aside/aside/section/div/div/div[2]/p"));
           error1.isPresent().then(function (result) {
           if(result){
            
              element(by.xpath("//ecb-permissions/div/ngx-aside/aside/section/div/div/div[2]/button/span[1]")).click();
              element(by.xpath("//div[@class='panel panel-default ecb-ngxAsideMargin']/div[1]/div/div/button[2]")).click();
            var modaldialog1 = element(by.xpath("//ecb-permissions/div[2]/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"));
           modaldialog1.isPresent().then(function (result) {
           if(result){
       browser.actions().mouseMove(element(by.xpath("//ecb-permissions/div[2]/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
  
       element(by.xpath("//ecb-permissions/div/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]")).click(); // cancel without save
       browser.sleep(2000);
           } else {
               console.log('modal dialog is not there');
           }   
           });
           }
           else {
              console.log('no error is present while saving');
           }
           });
           } else {
    console.log('Modaldialog popup is not present');
           }
           });  
       }
       else {
          console.log('edit is not present for permissions widget');
       }
               });
           } else {
        console.log('error in loading permissions widget');
           }
           });
});
});