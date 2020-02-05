var testdata = require('../inputs/testdata/addanddeleteadjustments.json');

import { browser, by, element } from 'protractor';


describe('widget', function () {
 

   it('add adjustments ', function () {
     browser.sleep(5000);
     var items;
    var startCountadjustments;

    var adjustmentsheading = element(by.xpath("//h2[contains(text(),'Adjustments')]"));
                adjustmentsheading.isPresent().then (function (result) {
            if (result) {
                    items =element.all(by.xpath("//div[@class='ecb-displayAdjName']"));
      
      startCountadjustments = items.count();
      console.log(startCountadjustments);
       browser.sleep(3000);
       
                var editicon = element(by.xpath("//ecb-priceableitem-adjustments/div[1]/div/div/a"));
                editicon.isPresent().then (function (result) {
            if (result) {
              browser.sleep(3000);
              element(by.xpath("//ecb-priceableitem-adjustments/div[1]/div/div/a")).click();
               browser.sleep(4000);
              var editpanel = element(by.xpath("//h3[contains(text(),'Edit Adjustments')]"));
               editpanel.isPresent().then (function (result) {
            if (result) {
             browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Edit Adjustments')]"))).perform();
             browser.sleep(3000);
            element(by.xpath("//span[contains(text(),'Changes to this Priceable Item template will only impact new PI instances. Existing PI instances will not be changed.')]")).isPresent();
            browser.sleep(2000);
            // cancel clicking
            element(by.xpath("//ecb-priceableitem-adjustments/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]/span")).click();
          browser.sleep(3000);
            var editicon = element(by.xpath("//ecb-priceableitem-adjustments/div[1]/div/div/a"));
                editicon.isPresent().then (function (result) {
            if (result) {
              element(by.xpath("//ecb-priceableitem-adjustments/div[1]/div/div/a")).click();
               browser.sleep(4000);
               browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Edit Adjustments')]"))).perform();
             browser.sleep(3000);
             element(by.xpath("//span[contains(text(),'Adjustment List')]")).isPresent();
            
           browser.actions().mouseMove(element(by.xpath("//div[@id='ecb-adjustment']/p-datatable/div/div[1]/table/tbody/tr/td[2]/span/div/p-dropdown/div/label"))).perform();
             browser.sleep(3000);
            element(by.xpath("//div[@id='ecb-adjustment']/p-datatable/div/div[1]/table/tbody/tr/td[2]/span/div/p-dropdown/div/div[3]/span")).click();
             browser.sleep(3000);
            var drpdown = element(by.xpath("//body[@id='mainBody']/div/div/ul/li[2]/span"));
            drpdown.isPresent().then (function (result) {
            if (result) {
             drpdown.click();
             browser.sleep(3000);
             browser.actions().mouseMove(element(by.xpath("//textarea[@class='ebComboMultiSelect-textarea ebTextArea ecb-droplisttextarea ecb-adjustmentsdroplistarea']"))).perform();
             browser.sleep(3000);
         var adjustreasons = element(by.xpath("//textarea[@class='ebComboMultiSelect-textarea ebTextArea ecb-droplisttextarea ecb-adjustmentsdroplistarea']"));
           adjustreasons.isPresent().then (function (result) {
            if (result) {
           var list = element(by.xpath("//div[@id='ecb-adjustment']/p-datatable/div/div[1]/table/tbody/tr/td[5]/span/div/span[2]/div/span"));
           list.click();
           browser.sleep(3000);
           var inputs = element(by.xpath("//div[@id='ecb-adjustment']/p-datatable/div/div[1]/table/tbody/tr/td[5]/span/div/div[2]/ul/li[1]/input"));
           inputs.isPresent().then (function (result) {
            if (result) {
            browser.actions().mouseMove(element(by.xpath("//div[@id='ecb-adjustment']/p-datatable/div/div[1]/table/tbody/tr/td[5]/span/div/div[2]/ul/li[1]/input"))).perform();
            browser.sleep(2000);
            element(by.xpath("//div[@id='ecb-adjustment']/p-datatable/div/div[1]/table/tbody/tr/td[5]/span/div/div[2]/ul/li[1]/input")).click();

            browser.sleep(3000);
             list.click();
             browser.sleep(4000);

             // cancel clicking
             element(by.xpath("//ecb-priceableitem-adjustments/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]/span")).click();
             browser.sleep(3000);
             // cancel-return
             var returnpopup = element(by.xpath("//ecb-priceableitem-adjustments/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]"));
             returnpopup.isPresent().then (function (result) {
            if (result) {
            browser.actions().mouseMove(element(by.xpath("//ecb-priceableitem-adjustments/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]"))).perform();
            browser.sleep(3000);
            element(by.xpath("//ecb-priceableitem-adjustments/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[2]")).click();
            browser.sleep(3000);
            } else {
            console.log('return popup not came when we click on cancel after editing adjustments ');
            }
             });
             browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Edit Adjustments')]"))).perform();
             browser.sleep(3000);
             // save clicking
             element(by.xpath("//ecb-priceableitem-adjustments/ngx-aside/aside/section/div/div/div[1]/div/div/button[1]")).click();
             browser.sleep(6000);
             browser.navigate().back();
             browser.sleep(6000);

            } else {
            console.log('inputs are not there in adjustments  to select');
            // cancel without save
              var returnpopup = element(by.xpath("//ecb-priceableitem-adjustments/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]"));
             returnpopup.isPresent().then (function (result) {
            if (result) {
            browser.actions().mouseMove(element(by.xpath("//ecb-priceableitem-adjustments/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]"))).perform();
            browser.sleep(3000);
            element(by.xpath("//ecb-priceableitem-adjustments/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]")).click();
            browser.sleep(3000);
            } else {
             console.log('return popup not came when we click on cancel after editing adjustments ');
             
            }
             });
            }
           });
            } else {
             console.log('adjustments  dropdown icon is not there to click');
             // cancel without save
               var returnpopup = element(by.xpath("//ecb-priceableitem-adjustments/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]"));
             returnpopup.isPresent().then (function (result) {
            if (result) {
            browser.actions().mouseMove(element(by.xpath("//ecb-priceableitem-adjustments/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]"))).perform();
            browser.sleep(3000);
            element(by.xpath("//ecb-priceableitem-adjustments/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]")).click();
            browser.sleep(3000);
            } else {
           console.log('return popup not came when we click on cancel after editing adjustments ');
           
            }
             });
            }
           });
            } else {
                console.log('list is not present to select adjustment ');
            // cancel 
               element(by.xpath("//ecb-priceableitem-adjustments/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]/span")).click();
               browser.sleep(4000);
               browser.navigate().back();
               browser.sleep(6000);
            }
             });
           
          
            } else {
                  console.log('edit icon is not there in adjustments of  charges pi template');
                 
            }
                });
            } else {
              console.log('edit panel is not there in adjustments of  charges pi template');
         
            }
               });


            } else {
               console.log('edit icon is not there in adjustments of  charges pi template');
               browser.navigate().back();
               browser.sleep(6000);
            }
                });



            } else {
                console.log('adjustments heading not present in pi templates detail page');
                browser.navigate().back();
                browser.sleep(6000);
            }
                });
      


  });

  
   it('delete adjustments  from details page', function () {
     browser.sleep(3000);
     var items;
  var startCountadjustments;

     var deletelink = element(by.xpath("//a[@title='linkDelete'][1]"));
deletelink.isPresent().then(function (result){
             if(result){
     browser.actions().mouseMove(element(by.xpath("//a[@title='linkDelete'][1]"))).perform();
     browser.sleep(3000);
     element(by.xpath("//a[@title='linkDelete'][1]/em")).click();
     browser.sleep(3000);
     var deletetext = element(by.xpath("//h2[contains(text(),'Delete Adjustment')]"));
     deletetext.isPresent().then(function (result){
             if(result){
      browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Delete Adjustment')]"))).perform();
      browser.sleep(3000);
      element(by.xpath("//ecb-priceableitem-adjustments/div[2]/div/div[1]/div/div[2]/button[2]")).click();
      browser.sleep(4000);
      element(by.xpath("//a[@title='linkDelete'][1]/em")).click();
     browser.sleep(3000);
      browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Delete Adjustment')]"))).perform();
      browser.sleep(3000);
      element(by.xpath("//ecb-priceableitem-adjustments/div[2]/div/div[1]/div/div[2]/button[1]")).click();
      browser.sleep(4000);
      browser.navigate().back();
      browser.sleep(6000);
             } else {
         console.log('delete adjustment overlay not came when we click on delete');
        
             }
     });
    
       browser.sleep(3000);

             } else {
           console.log('delete link is no there in adjustment  widget');
          
             }
});

  });  
});