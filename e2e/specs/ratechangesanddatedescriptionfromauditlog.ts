var testdata = require('../inputs/testdata/ratechangesanddatedescriptionfromauditlog.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {
    it('ratechanges and date description from auditlog ', function() {
     
    var items;
    var startCountmodified;
    var startCountadded;
   var startCountdeleted;
   var startCountrulesupdate;

     browser.sleep(2000);
     var rulesupdatetext = element(by.xpath("//a[contains(text(),'Rate Schedule Rules Update')]"));
     rulesupdatetext.isPresent().then(function (result) {
          if (result) {
                 
          items =element.all(by.xpath("//a[contains(text(),'Rate Schedule Rules Update')]"));
      
      startCountrulesupdate = items.count();
      console.log(startCountrulesupdate);
     
   
           rulesupdatetext.click();
           browser.sleep(3000);
           
           var ratechanges = element(by.xpath("//span[contains(text(),'Rate Changes')]"));
           ratechanges.isPresent().then(function (result) {
          if (result) {
             browser.actions().mouseMove(element(by.xpath("//span[contains(text(),'Rate Changes')]"))).perform();
             browser.sleep(3000);
            expect(element(by.xpath("//ecb-rate-changes/ecb-modal-dialog/div/div/div/div/div[1]/dialog-header-template/div/span")).getText()).toEqual(testdata.ratesfortext);
              expect(element(by.xpath("//ecb-rate-changes/ecb-modal-dialog/div/div/div/div/div[1]/dialog-header-template/div/big")).getText()).toEqual(testdata.startandenddates);
           expect(element(by.xpath("//ecb-rate-changes/ecb-modal-dialog/div/div/div/div/div[1]/dialog-header-template/div/p[3]")).getText()).toEqual(testdata.ratesourcetext);
            
           var deleted = element(by.xpath("//tr[@class='ui-datatable-even ui-widget-content ecb-rateChangeDelete']"));
           deleted.isPresent().then(function (result) {
               if (result) {
              
                items =element.all(by.xpath("//tr[@class='ui-datatable-even ui-widget-content ecb-rateChangeDelete']"));
           
           startCountdeleted = items.count();
          
          console.log(startCountdeleted);
          browser.sleep(2000);
          browser.actions().mouseMove(element(by.xpath("//tr[@class='ui-datatable-even ui-widget-content ecb-rateChangeDelete']"))).perform();
          browser.sleep(3000);
               var redcolour = element(by.xpath("//tr[@class='ui-datatable-even ui-widget-content ecb-rateChangeDelete']")).getAttribute('background-color');
             expect(redcolour).toEqual(testdata.redcolourcode);
     
               } else {
                         console.log('deleted records are not there');
                          var modified = element(by.xpath("//tr[@class='ui-datatable-even ui-widget-content ecb-rateChangeModify']"));
           modified.isPresent().then(function (result) {
               if (result) {
              items =element.all(by.xpath("//tr[@class='ui-datatable-even ui-widget-content ecb-rateChangeModify']"));
           
           startCountmodified = items.count();
          
          console.log(startCountmodified);
          browser.sleep(2000);
          browser.actions().mouseMove(element(by.xpath("//tr[@class='ui-datatable-even ui-widget-content ecb-rateChangeModify']"))).perform();
          browser.sleep(3000);
               var yellowcolour = element(by.xpath("//tr[@class='ui-datatable-even ui-widget-content ecb-rateChangeModify']")).getAttribute('background-color');
             expect(yellowcolour).toEqual(testdata.yellowcolourcode);
     
           } else {
                  console.log('modified records are not there');
                    var added = element(by.xpath("//tr[@class='ui-datatable-even ui-widget-content ecb-rateChangeAdd']"));
               added.isPresent().then(function (result) {
               if (result) {
                      items =element.all(by.xpath("//tr[@class='ui-datatable-even ui-widget-content ecb-rateChangeAdd']"));
           
           startCountadded = items.count();
          
          console.log(startCountadded);
          browser.sleep(2000);
          browser.actions().mouseMove(element(by.xpath("//tr[@class='ui-datatable-even ui-widget-content ecb-rateChangeAdd']"))).perform();
          browser.sleep(3000);
               var greencolour = element(by.xpath("//tr[@class='ui-datatable-even ui-widget-content ecb-rateChangeAdd']")).getAttribute('background-color');
             expect(greencolour).toEqual(testdata.greencolourcode);
             element(by.xpath("//ecb-rate-changes/ecb-modal-dialog/div/div/div/div/div[1]/dialog-header-template/div/h2/button/span")).click();
             browser.sleep(3000);
               } else {    
                   console.log('added records are not there');
                   element(by.xpath("//ecb-rate-changes/ecb-modal-dialog/div/div/div/div/div[1]/dialog-header-template/div/h2/button/span")).click();
                   browser.sleep(3000);
                  
               }
             });
           }
               });
               }
           });
        
          } else {
             console.log('rate changes is not there');
          }
           });
          } else {
             console.log('Rate Schedule Rules Update is not there');
          }
     });
     
    });

});
