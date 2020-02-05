 var testdata = require('../inputs/testdata/addanddelsubs.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {

it('subscriptionproperties', function() {
   browser.sleep(2000);
       var items;
       var startCount;
    

         var shared = element(by.xpath("//ecb-subscription-properties/div/div/div[1]/h2"));
         shared.isPresent().then(function (result){
             if(result){
           var widget= element(by.xpath("//ecb-subscription-properties/div/div/div[1]/h2"));
          browser.executeScript('arguments[0].scrollIntoView()',widget.getWebElement());
         
         var subscriptions =  element(by.xpath("//span[@class='ui-rowgroup-header-name'][1]"));
         subscriptions.isPresent().then(function (result){
             if(result){
           items =element.all(by.xpath("//span[@class='ui-rowgroup-header-name']"));
      
      startCount = items.count();
     
      expect(startCount).toEqual(testdata.subsbeforeadd); 
             }
             else {
               console.log('subscription properties are not there before adding');
             }
         });
          var addsubsc = element(by.xpath("//ecb-subscription-properties/div/div/div[1]/a"));
          addsubsc.isPresent().then(function (result){
              if(result){
            addsubsc.click();
            browser.sleep(3000);
            var addpage = element(by.xpath("//ecb-addsubscription-properties/div/div/div/div[1]/div[1]/div[1]/h1"));
             addpage.isPresent().then(function (result){
              if(result){
            browser.actions().mouseMove(element(by.xpath("//ecb-addsubscription-properties/div/div/div/div[1]/div[1]/div[1]/h1"))).perform();
            element(by.xpath("//ecb-addsubscription-properties/div/div/div/div[1]/div[1]/div[2]/button/span[1]")).click();
            element(by.xpath("//ecb-subscription-properties/div/div/div[1]/a")).click();
            browser.actions().mouseMove(element(by.xpath("//ecb-addsubscription-properties/div/div/div/div[1]/div[1]/div[1]/h1"))).perform();
            var table = element(by.xpath("//ecb-addsubscription-properties/div/div/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/input"));
            table.isPresent().then(function (result) {
           if(result){
            
            element(by.xpath("//ecb-addsubscription-properties/div/div/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]")).click();
            element(by.xpath("//ecb-addsubscription-properties/div/div/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input")).click();
            element(by.xpath("//ecb-addsubscription-properties/div/div/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input")).sendKeys(testdata.searchsubs);
            browser.sleep(3000);
            element(by.xpath("//ecb-addsubscription-properties/div/div/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/div/div/i")).click();
            browser.sleep(3000);
            //clicking on add button
            element(by.xpath("//ecb-addsubscription-properties/div/div/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/input")).click();
            
            browser.sleep(3000);
            element(by.xpath("//ecb-addsubscription-properties/div/div/div/div[1]/div[2]/button")).click();
           browser.sleep(3000);
            items =element.all(by.xpath("//span[@class='ui-rowgroup-header-name']"));
      
      startCount = items.count();
     
      expect(startCount).toEqual(testdata.subsafteradd); 
           } else {
               console.log('table of subscriptions are not present');
               element(by.xpath("//ecb-addsubscription-properties/div/div/div/div[1]/div[1]/div[2]/button/span[1]")).click();
               browser.sleep(3000);
           }
            });
              } else {
                console.log('list of  subscriptions page is not available');
              }
             });
              } else {
               console.log('Add option is not there for subscriptions to add');
              }
          });
             } else {
          console.log('subscriptionsproperties widget is absent for this po');
             }   
        });   
 
      });

it('deletesubscriptionswidget', function() {
    var items;
       var startCount;
var shared = element(by.xpath("//ecb-subscription-properties/div/div/div[1]/h2"));
         shared.isPresent().then(function (result){
             if(result){
           var widget= element(by.xpath("//ecb-subscription-properties/div/div/div[1]/h2"));
          browser.executeScript('arguments[0].scrollIntoView()',widget.getWebElement());
          items =element.all(by.xpath("//span[@class='ui-rowgroup-header-name']"));
      
      startCount = items.count();
     
      expect(startCount).toEqual(testdata.subsbeforedel);  
       var subs = element(by.xpath("//ecb-subscription-properties/div/div/div[2]/p-datatable/div/div[1]/table/tbody/tr[2]/td[2]/span"));
       subs.isPresent().then(function (result){
              if(result){
                  //browser.actions().mouseMove(element(by.xpath("//ecb-subscription-properties/div/div/div[2]/p-datatable/div/div[1]/table/tbody/tr[2]/td[1]/span/span/a/i"))).perform();
                  element(by.xpath("//ecb-subscription-properties/div/div/div[2]/p-datatable/div/div[1]/table/tbody/tr[2]/td[1]/span/span/a")).click();
                  browser.sleep(3000);
                  var pop = element(by.xpath("//ecb-subscription-properties/div/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]/dialog-button-1"));
                  pop.isPresent().then(function (result){
              if(result){
                  browser.actions().mouseMove(element(by.xpath("//ecb-subscription-properties/div/div/ecb-modal-dialog/div/div/div/div[1]/div[2]/div[1]/dialog-header"))).perform(); 
              browser.sleep(2000);
             element(by.xpath("//ecb-subscription-properties/div/div/ecb-modal-dialog/div/div/div/div[2]/div/button[2]/dialog-button-2")).click();
              browser.sleep(2000);
          //browser.actions().mouseMove(element(by.xpath("//ecb-subscription-properties/div/div/div[2]/p-datatable/div/div[1]/table/tbody/tr[2]/td[1]/span/span/a/i"))).click();
    element(by.xpath("//ecb-subscription-properties/div/div/div[2]/p-datatable/div/div[1]/table/tbody/tr[2]/td[1]/span/span/a")).click();
                               browser.actions().mouseMove(element(by.xpath("//ecb-subscription-properties/div/div/ecb-modal-dialog/div/div/div/div[1]/div[2]/div[1]/dialog-header"))).perform();  
             element(by.xpath("//ecb-subscription-properties/div/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]/dialog-button-1")).click();
                  browser.sleep(2000);
           
        
              items =element.all(by.xpath("//span[@class='ui-rowgroup-header-name']"));
      
      startCount = items.count();
     
      expect(startCount).toEqual(testdata.subsafterdel); 
              } else {

               console.log('popup is not came to remove');
              
              }
                  });
              }
              else {
                 console.log('No subscriptions are there to del');
              }
       });
            } else {
          console.log('subscriptionsproperties widget is absent for this po');
             }   
        });   
});
});