var testdata = require('../inputs/testdata/addanddelpi.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {

      it('priceableitemswidget', function() {
        
         
           browser.sleep(5000);
           
      var    items;
        var startCount;
      var priceableitems = element(by.xpath("//h2[contains(text(),'Priceable Items')]"));
       priceableitems.isPresent().then(function (result){
         if(result){
             var widget= element(by.xpath("//h2[contains(text(),'Priceable Items')]"));
           
            browser.executeScript('arguments[0].scrollIntoView()',widget.getWebElement());
            

            expect(element(by.xpath("//h3[contains(text(),'One Time Charges')]")).isDisplayed()).toBe(true);
             expect(element(by.xpath("//h3[contains(text(),'Recurring Charges')]")).isDisplayed()).toBe(true);
             expect(element(by.xpath("//h3[contains(text(),'Usage Charges')]")).isDisplayed()).toBe(true);
            
             expect(element(by.xpath("//h3[contains(text(),'Discount')]")).isDisplayed()).toBe(true);
           var cardspresent = element(by.xpath("//div[@class='ecbClickableCard-heading']"));
              cardspresent.isPresent().then(function (result){
         if(result){
         items =element.all(by.xpath("//div[@class='ecbClickableCard-heading']"));
      
      startCount = items.count();
     
      expect(startCount).toEqual(testdata.pisbeforeadd);
         } else {
          console.log('no cards are present before adding');
         }
              });
            
             
            var addpi = element(by.xpath("//ecb-priceable-items/div/div[1]/a[@class='ecb-addPriceableItem ecb-disablePiAdd']"));
  addpi.isPresent().then(function (result) {
      if(result){
          console.log('add is disabled');
      } else {
      
       
       element(by.xpath("//ecb-priceable-items/div/div[1]/a")).click();
       browser.sleep(2000);
       var addpage = element(by.xpath("//ecb-addpriceableitem/div/div/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input"));
       addpage.isPresent().then(function (result) {
           if(result){
      
       var table = element(by.xpath("//ecb-addpriceableitem/div/div/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/input"));
       table.isPresent().then(function (result){
           if(result){
       element(by.xpath("//ecb-addpriceableitem/div/div/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]")).click();
       browser.sleep(2000);
       element(by.xpath("//ecb-addpriceableitem/div/div/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input")).click();
       element(by.xpath("//ecb-addpriceableitem/div/div/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input")).sendKeys(testdata.addpisearch);
       browser.sleep(2000);
       element(by.xpath("//ecb-addpriceableitem/div/div/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/div/div/i")).click();
       browser.sleep(2000);
       // types of pis selection

       element(by.xpath("//ecb-addpriceableitem/div[2]/div/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[4]/ecb-dropdown/select")).click();
       browser.sleep(3000);
       element(by.xpath("//ecb-addpriceableitem/div[2]/div/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[4]/ecb-dropdown/select/option[2]")).click();
       browser.sleep(2000);
     element(by.xpath("//ecb-addpriceableitem/div/div/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/input")).click();
     browser.sleep(2000);
     element(by.xpath("//ecb-addpriceableitem/div/div/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[2]/td[1]/span/input")).click();
     browser.sleep(2000);
     element(by.xpath("//ecb-addpriceableitem/div/div/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[3]/td[1]/span/input")).click();
    
     // clicking on adding

     element(by.xpath("//ecb-addpriceableitem/div/div/div/div[1]/div[2]/button")).click();
     browser.sleep(8000);
    
     items =element.all(by.xpath("//div[@class='ecbClickableCard-heading']"));
      
      startCount = items.count();
     
      expect(startCount).toEqual(testdata.pisafteradd);
       } else {
         console.log('table of pis are not present to add pis');
         element(by.xpath("//ecb-addpriceableitem/div/div/div/div[1]/div[1]/div[2]/button/span[1]"));
         browser.sleep(2000);
       }
           });
          
           }
           else {
           console.log('add page is not available');
           }
       });
      }
      
  });
  
         } else {
            console.log('priceable items widget is absent for this po');
         }   
       });
          
      });
      
    it('deletepiwidget', function() {
        var items;
        var startCount;

        browser.sleep(4000);
      var priceableitems1 = element(by.xpath("//ecb-priceable-items/div/div[1]/h2"));
       priceableitems1.isPresent().then(function (result){
         if(result){
             var widget= element(by.xpath("//ecb-priceable-items/div/div[1]/h2"));
           
            browser.executeScript('arguments[0].scrollIntoView()',widget.getWebElement());
           
            var cards = element(by.xpath("//div[@class='ecbClickableCard-heading'][1]"));
            cards.isPresent().then(function (result){
         if(result){
             browser.actions().mouseMove(element(by.xpath("//div[@class='ecbClickableCard-heading'][1]"))).perform();
             browser.sleep(4000);
             var del = element(by.xpath("//i[@class='fa fa-minus-circle fa-disabled'][1]"));
             del.isPresent().then(function (result){
         if(result){   
             console.log('del icon is disabled for this pi may be po is having available dates');
         } else {
           console.log('del icon is enabled for this pi');
           
           element(by.xpath("//i[@class='fa fa-minus-circle'][1]")).click();
           browser.sleep(3000);
           var textremove = element(by.xpath("//div[@class='ecbClickableCard-heading']/div/span"));
           textremove.isPresent().then(function (result){
         if(result){
             browser.actions().mouseMove(element(by.xpath("//div[@class='ecbClickableCard-heading']/div/span"))).perform();
             browser.sleep(3000);
             //cancel clicking
            element(by.xpath("//div[@class='ecbClickableCard-footer ecb-height100percent ecb-buttons']/button[2]")).click();
            browser.sleep(3000);
             element(by.xpath("//i[@class='fa fa-minus-circle'][1]")).click();
             //remove clicking
            element(by.xpath("//div[@class='ecbClickableCard-footer ecb-height100percent ecb-buttons']/button[1]")).click();
            browser.sleep(3000);
         
      
         } else {
            console.log('textremove is not present');
         }
             });
       
         } 
             
             });
         } else {
         console.log('no cards are present to delete');
         }
            });
               } else {
            console.log('priceable items widget is absent for this po');
         }   
       });
    }); 
    
      
});
      