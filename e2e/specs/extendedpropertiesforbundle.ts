var testdata = require('../inputs/testdata/extendedpropertiesforbundle.json');

import { browser, by, element } from 'protractor';


describe('widget', function () {

     it('extendedpropertiesswidget', function() {
          
          


       browser.sleep(5000);
          var extendedproperties = element(by.xpath("//ecb-extended-properties/div/div[1]/div[2]/form/div[1]/div/label"));
          extendedproperties.isPresent().then(function (result){
              if(result){
                   browser.sleep(4000);
        var widget= element(by.xpath("//ecb-extended-properties/div/div[1]/div[2]/form/div[1]/div/label"));
     browser.executeScript('arguments[0].scrollIntoView()',widget.getWebElement());
       
        browser.sleep(3000);
        var editextended = element(by.xpath("//ecb-extended-properties/div/div[1]/div[1]/div/div/div/a"));
        editextended.isPresent().then(function(result){
            if(result){  
   element(by.xpath("//ecb-extended-properties/div/div[1]/div[1]/div/div/div/a")).click(); 
   browser.sleep(4000);
   browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Edit Extended Properties')]"))).perform();
   element(by.xpath("// ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[2]/form/div[1]/div/input")).click();
   element(by.xpath("// ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[2]/form/div[1]/div/input")).clear();
   element(by.xpath("// ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[2]/form/div[1]/div/input")).sendKeys(testdata.glcode);
  element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[2]")).click();
   var modaldialogext = element(by.xpath("//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"));
           modaldialogext.isPresent().then(function (result) {
           if(result){
       browser.actions().mouseMove(element(by.xpath("//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
 
       element(by.xpath("//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]")).click();// cancel without
       browser.sleep(3000);
       
       element(by.xpath("//ecb-extended-properties/div/div[1]/div[1]/div/div/div/a")).click();
       browser.sleep(3000);
       browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Edit Extended Properties')]"))).perform();
       element(by.xpath("// ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[2]/form/div[1]/div/input")).click();
   element(by.xpath("// ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[2]/form/div[1]/div/input")).clear();
   element(by.xpath("// ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[2]/form/div[1]/div/input")).sendKeys(testdata.glcode);
    browser.sleep(2000);
    element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[2]")).click();
    browser.actions().mouseMove(element(by.xpath("//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
    element(by.xpath("//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[2]")).click();// return
    browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Edit Extended Properties')]"))).perform();
    element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[1]")).click();
          browser.sleep(2000);   
  var errorext = element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[2]/div/div/p"));
  errorext.isPresent().then(function (result) {
           if(result){
               browser.sleep(2000);
     element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[2]/div/div/button/span[1]")).click();
     element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[2]")).click();
   var modaldialogexte = element(by.xpath("//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"));
           modaldialogexte.isPresent().then(function (result) {
           if(result){
       browser.actions().mouseMove(element(by.xpath("//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
 
       element(by.xpath("//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]")).click();// cancel without
       browser.sleep(2000);
           } else {
              console.log('modal dialog is not present');
           }
           });
           } else {
              console.log('error is not present while saving');
           }
  });
           } else {
    console.log('Modaldialog popup is not present');
           }
           });  
            } else {
           console.log('Edit option is not there for extended properties');
            }
        });
              } else {
              console.log('no data is populating in extended properties widget');
              }
          });
        }); 
      
});