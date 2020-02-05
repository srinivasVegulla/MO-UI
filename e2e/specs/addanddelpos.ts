var testdata = require('../inputs/testdata/addanddelpos.json');

import { browser, by, element } from 'protractor';
describe('widget', function () {

  it('adding pos', function () {
    browser.sleep(6000);
    
    var widget = element(by.xpath("//ecb-productofferinbundle/div/div[1]/h2"));
    widget.isPresent().then(function (result){
             if(result){
            var widget= element(by.xpath("//ecb-productofferinbundle/div/div[1]/h2"));
     browser.executeScript('arguments[0].scrollIntoView()',widget.getWebElement());
     browser.sleep(3000);     
          var addpo = element(by.xpath("//ecb-productofferinbundle/div/div[1]/a[@class='ecb-addPriceableItem ecb-disablePiAdd']"));
          addpo.isPresent().then(function (result){
             if(result){
               console.log('add icon is disabled'); 
             }
             else {
              element(by.xpath("//ecb-productofferinbundle/div/div[1]/a")).click();
                 browser.sleep(4000);
                 var addpage = element(by.xpath("//ecb-addproductoffertobundle/div/div/div/div[1]/div[1]/div[1]/h1"));
                 addpage.isPresent().then(function (result){
             if(result){
                 browser.actions().mouseMove(element(by.xpath("//ecb-addproductoffertobundle/div/div/div/div[1]/div[1]/div[1]/h1"))).perform();
                 browser.sleep(3000);
                 expect(element(by.xpath("//ecb-addproductoffertobundle/div/div/div/div[1]/div[2]/h2")).isDisplayed()).toBe(true);
                 var table = element(by.xpath("//ecb-addproductoffertobundle/div/div/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/input"));
                 table.isPresent().then(function (result){
             if(result){
              element(by.xpath("//ecb-addproductoffertobundle/div/div/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/div/input")).click();
              browser.sleep(2000);
              element(by.xpath("//ecb-addproductoffertobundle/div/div/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/div/input")).sendKeys(testdata.searchpo);
              browser.sleep(2000);
              element(by.xpath("//ecb-addproductoffertobundle/div/div/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/div/div/div/i")).click();
              browser.sleep(2000);
              element(by.xpath("//ecb-addproductoffertobundle/div/div/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/input")).click();
              browser.sleep(2000);
              element(by.xpath("//ecb-addproductoffertobundle/div/div/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[2]/td[1]/span/input")).click();
             browser.sleep(2000);
            element(by.xpath("//ecb-addproductoffertobundle/div/div/div/div[1]/div[2]/button")).click();
            browser.sleep(10000);
           
         var error =   element(by.xpath("//ecb-addproductoffertobundle/div/div/div/div[2]/div/div/p"));
         error.isPresent().then(function (result){
             if(result){
            browser.actions().mouseMove(element(by.xpath("//ecb-addproductoffertobundle/div/div/div/div[2]/div/div/p"))).perform();
            browser.sleep(2000);
            element(by.xpath("//ecb-addproductoffertobundle/div/div/div/div[2]/div/div/span/i")).click();
            browser.sleep(2000);
            element(by.xpath("//ecb-addproductoffertobundle/div/div/div/div[1]/div[1]/div[2]/button/span[1]")).click();
            browser.sleep(3000);

             } else {
                console.log('error is not came while adding pos to bundle');
             }
         });
             } else {
               console.log('table is not present to add pos');
               // clicking cross icon
               element(by.xpath("//ecb-addproductoffertobundle/div/div/div/div[1]/div[1]/div[2]/button/span[1]")).click();
               browser.sleep(5000);
             }
                 });
             } else {
              console.log('add page is not available to add pos');
             }
                 });
             }
          });

             } else{
              console.log('product offers widget is not present in bundle detail page');
             }
    });


  });

   it('deleting pos', function () {
       browser.sleep(3000);
       var popresent = element(by.xpath("//div[@id='cardTotalHeightPO-0']"));
           popresent.isPresent().then(function (result){
             if(result){
              browser.actions().mouseMove(element(by.xpath("//div[@id='cardTotalHeightPO-0']"))).perform(); 
              browser.sleep(2000);  
           var deleteicon = element(by.xpath("//div[@id='cardTotalHeightPO-0']/div[2]/div/a/i[@class='fa fa-minus-circle ecb-pidDeleteDisable']"));
           deleteicon.isPresent().then(function (result){
               if(result){  
               console.log('delete icon is disabled');
               } else {
           element(by.xpath("//div[@id='cardTotalHeightPO-0']/div[2]/div/a/i")).click();  
           browser.sleep(3000);
          browser.actions().mouseMove(element(by.xpath("//ecb-productofferinbundle/div/div[3]/div/div[1]/div/div"))).perform();
               browser.sleep(2000);     
               element(by.xpath("//ecb-productofferinbundle/div/div[3]/div/div[3]/button[2]")).click();
               browser.sleep(3000); 
                 element(by.xpath("//div[@id='cardTotalHeightPO-0']/div[2]/div/a/i")).click();  
           browser.sleep(3000);
                         browser.actions().mouseMove(element(by.xpath("//ecb-productofferinbundle/div/div[3]/div/div[1]/div/div"))).perform();
               browser.sleep(2000);     
               element(by.xpath("//ecb-productofferinbundle/div/div[3]/div/div[3]/button[1]")).click();
               browser.sleep(3000); 
            }
           });
             
             } else {
             console.log('no pos are present inside the bundle');
             }
           }); 
   });
  
});