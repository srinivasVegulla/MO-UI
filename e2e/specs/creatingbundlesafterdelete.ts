import { browser, by, element } from 'protractor';

var testdata = require('../inputs/testdata/creatingbundlesafterdelete.json');


describe('widget', function () {
  it('creating product offer ', function () {
   
browser.sleep(2000);
    expect(element(by.xpath("//ecb-breadcrumb/div[3]/h1")).getText()).toEqual(testdata.itemsheading);
   
    var productoffers = element(by.xpath("//ecb-product-offer-list/div/div[2]/div/div/div/p"));
    productoffers.isPresent().then(function (result) {
      if (result) {
        console.log('productoffers are not there');
       var error = element(by.xpath("//ecb-product-offer-list/div/div[2]/div/div/div/p"));
        error.isPresent().then(function (result) {
      if (result) {
          console.log('error occured while loading pos');
          var createlink = element(by.xpath("//ecb-product-offer-list/div/div[1]/div/a"));
    createlink.isPresent().then(function (result) {
        if(result) {

    expect(element(by.xpath("//ecb-product-offer-list/div/div[1]/div/a")).getText()).toEqual(testdata.createlink);
    element(by.xpath("//ecb-product-offer-list/div/div[1]/div/a")).click();
    browser.sleep(3000);
     var popup1 = element(by.xpath("//ecb-product-offer-list/div/div[2]/ecb-modal-dialog[4]/div/div/div/div/dialog-body-template/div/h2"));
    popup1.isPresent().then(function (result) {
      if (result) { 
     browser.actions().mouseMove(element(by.xpath("//ecb-product-offer-list/div/div[2]/ecb-modal-dialog[4]/div/div/div/div/dialog-body-template/div/h2"))).perform();
     browser.sleep(1000);
     
     element(by.xpath("//ecb-product-offer-list/div/div[2]/ecb-modal-dialog[4]/div/div/div/div/dialog-body-template/div/ul/li[1]/a")).click();
     browser.sleep(3000);
    var popup = element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/h3"));
    popup.isPresent().then(function (result){
              if(result){
        browser.actions().mouseMove(element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/h3"))).perform();
       
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div/input")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div/input")).clear();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div/input")).sendKeys(testdata.poname);
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
        browser.sleep(1000);
        var cancelwithoutsave = element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[1]/div/div[2]"));
        cancelwithoutsave.isPresent().then(function (result) {
            if(result){
          browser.actions().mouseMove(element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[1]/div/div[2]"))).perform();
          element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]")).click(); 
               element(by.xpath("//ecb-product-offer-list/div/div[1]/div/a")).click();

               browser.sleep(1000);
               browser.actions().mouseMove(element(by.xpath("//ecb-product-offer-list/div/div[2]/ecb-modal-dialog[4]/div/div/div/div/dialog-body-template/div/h2"))).perform();
     browser.sleep(1000);
     
     element(by.xpath("//ecb-product-offer-list/div/div[2]/ecb-modal-dialog[4]/div/div/div/div/dialog-body-template/div/ul/li[1]/a")).click();
     browser.sleep(3000);
              browser.actions().mouseMove(element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/h3"))).perform();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div/input")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div/input")).clear();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div/input")).sendKeys(testdata.poname);
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
           browser.actions().mouseMove(element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[1]/div/div[2]"))).perform();
          element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[2]")).click();
            }
            else {
             console.log('cancel without save popup is not present');
            }
        });
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div/input")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div/input")).clear();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div/input")).sendKeys(testdata.displayname);
        
        var namealreadyused = element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div[2]/span[2]"));
        namealreadyused.isPresent().then(function (result) {
            if(result){
                element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div/input")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div/input")).clear();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div/input")).sendKeys(testdata.anotherponame);
         element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[3]/textarea")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[3]/textarea")).clear();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[3]/textarea")).sendKeys(testdata.description);

         element(by.xpath("//select[@id='test']")).click();  
                element(by.xpath("//select[@id='test']/option[170]")).click();  
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[5]/p-calendar/span/input")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[5]/p-calendar/span/div/table/tbody/tr[4]/td[3]/a")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[6]/p-calendar/span/input")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[6]/p-calendar/span/div/table/tbody/tr[5]/td[3]/a")).click();
          element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[7]/div/select")).click();
          element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[7]/div/select/option[2]")).click();
          //hiding
    var selectionhide =  element(by.xpath("//input[@ng-reflect-value='true']"));  
    selectionhide.isPresent().then(function (result) {
        if(result){
         selectionhide.click();
         var reallyhide = element(by.xpath("//ecb-properties/ecb-modal-dialog[2]/div/div/div/div[1]/div/div[2]"));
         reallyhide.isPresent().then(function (result){
             if(result){
                 browser.actions().mouseMove(element(by.xpath("//ecb-properties/ecb-modal-dialog[2]/div/div/div/div[1]/div/div[2]"))).perform();
                 element(by.xpath("//ecb-properties/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[2]/dialog-button-2")).click();
         } else {
            console.log('popup is not present');
         }
         });
        } else {
          console.log('already hide is selected');
        }
    });
    expect(element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[2]/div/span[1]")).isDisplayed()).toBe(true);
    // clicking on save
    element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[1]")).click();
    browser.sleep(2000);
            } else {
          
     element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[3]/textarea")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[3]/textarea")).clear();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[3]/textarea")).sendKeys(testdata.description);

         element(by.xpath("//select[@id='test']")).click();  
                element(by.xpath("//select[@id='test']/option[170]")).click();  
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[5]/p-calendar/span/input")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[5]/p-calendar/span/div/table/tbody/tr[4]/td[3]/a")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[6]/p-calendar/span/input")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[6]/p-calendar/span/div/table/tbody/tr[5]/td[3]/a")).click();
          element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[7]/div/select")).click();
          element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[7]/div/select/option[2]")).click();
          //hiding
    var selectionhide =  element(by.xpath("//input[@ng-reflect-value='true']"));  
    selectionhide.isPresent().then(function (result) {
        if(result){
         selectionhide.click();
         var reallyhide = element(by.xpath("//ecb-properties/ecb-modal-dialog[2]/div/div/div/div[1]/div/div[2]"));
         reallyhide.isPresent().then(function (result){
             if(result){
                 browser.actions().mouseMove(element(by.xpath("//ecb-properties/ecb-modal-dialog[2]/div/div/div/div[1]/div/div[2]"))).perform();
                 element(by.xpath("//ecb-properties/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[2]/dialog-button-2")).click();
         } else {
            console.log('popup is not present');
         }
         });
        } else {
          console.log('already hide is selected');
        }
    });
    expect(element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[2]/div/span[1]")).isDisplayed()).toBe(true);
    // clicking on save
    element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[1]")).click();
    browser.sleep(2000);
            }
            });
              }
              else {
               console.log('create po popup is not present');
              }
    });
      } else{
         console.log('popup for createbundle or create po not came');
      }
    });
        } else {
        console.log('create subscribable item link is not there');
        }
    });
      }
      else {
         console.log('productoffers are loading');
      }
        });
      } else {
       console.log('productoffers are present');
    
         var createlink = element(by.xpath("//ecb-product-offer-list/div/div[1]/div/a"));
    createlink.isPresent().then(function (result) {
        if(result) {
  
    expect(element(by.xpath("//ecb-product-offer-list/div/div[1]/div/a")).getText()).toEqual(testdata.createlink);
    element(by.xpath("//ecb-product-offer-list/div/div[1]/div/a")).click();
    browser.sleep(3000);
     var popup1 = element(by.xpath("//ecb-product-offer-list/div/div[2]/ecb-modal-dialog[4]/div/div/div/div/dialog-body-template/div/h2"));
    popup1.isPresent().then(function (result) {
      if (result) { 
     browser.actions().mouseMove(element(by.xpath("//ecb-product-offer-list/div/div[2]/ecb-modal-dialog[4]/div/div/div/div/dialog-body-template/div/h2"))).perform();
     browser.sleep(1000);  
     
     element(by.xpath("//ecb-product-offer-list/div/div[2]/ecb-modal-dialog[4]/div/div/div/div/dialog-body-template/div/ul/li[1]/a")).click();
     browser.sleep(3000);  
    var popup = element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/h3"));
    popup.isPresent().then(function (result){
              if(result){
                  browser.actions().mouseMove(element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/h3"))).perform();
        
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div/input")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div/input")).clear();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div/input")).sendKeys(testdata.poname);
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
        browser.sleep(500);
        var cancelwithoutsave = element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[1]/div/div[2]"));
        cancelwithoutsave.isPresent().then(function (result) {
            if(result){
          browser.actions().mouseMove(element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[1]/div/div[2]"))).perform();
          element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]")).click(); 
               element(by.xpath("//ecb-product-offer-list/div/div[1]/div/a")).click();

               browser.sleep(1000);
               browser.actions().mouseMove(element(by.xpath("//ecb-product-offer-list/div/div[2]/ecb-modal-dialog[4]/div/div/div/div/dialog-body-template/div/h2"))).perform();
     browser.sleep(1000);
     
     element(by.xpath("//ecb-product-offer-list/div/div[2]/ecb-modal-dialog[4]/div/div/div/div/dialog-body-template/div/ul/li[1]/a")).click();
     browser.sleep(3000);
              browser.actions().mouseMove(element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/h3"))).perform();
             element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div/input")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div/input")).clear();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div/input")).sendKeys(testdata.poname);
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
           browser.actions().mouseMove(element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[1]/div/div[2]"))).perform();
          element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[2]")).click();
            }
            else {
             console.log('cancel without save popup is not present');
            }
        });
         element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div/input")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div/input")).clear();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div/input")).sendKeys(testdata.displayname);
         var namealreadyused = element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div[2]/span[2]"));
        namealreadyused.isPresent().then(function (result) {
            if(result){
                element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div/input")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div/input")).clear();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[1]/div/input")).sendKeys(testdata.anotherponame);
          element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[3]/textarea")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[3]/textarea")).clear();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[3]/textarea")).sendKeys(testdata.description);

         element(by.xpath("//select[@id='test']")).click();  
                element(by.xpath("//select[@id='test']/option[170]")).click();  
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[5]/p-calendar/span/input")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[5]/p-calendar/span/div/table/tbody/tr[4]/td[3]/a")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[6]/p-calendar/span/input")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[6]/p-calendar/span/div/table/tbody/tr[5]/td[3]/a")).click();
          element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[7]/div/select")).click();
          element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[7]/div/select/option[2]")).click();
          //hiding
    var selectionhide =  element(by.xpath("//input[@ng-reflect-value='true']"));  
    selectionhide.isPresent().then(function (result) {
        if(result){
         selectionhide.click();
         var reallyhide = element(by.xpath("//ecb-properties/ecb-modal-dialog[2]/div/div/div/div[1]/div/div[2]"));
         reallyhide.isPresent().then(function (result){
             if(result){
                 browser.actions().mouseMove(element(by.xpath("//ecb-properties/ecb-modal-dialog[2]/div/div/div/div[1]/div/div[2]"))).perform();
                 element(by.xpath("//ecb-properties/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[2]/dialog-button-2")).click();
         } else {
            console.log('popup is not present');
         }
         });
        } else {
          console.log('already hide is selected');
        }
    });
    expect(element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[2]/div/span[1]")).isDisplayed()).toBe(true);
    // clicking on save
    element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[1]")).click();
    browser.sleep(2000);
    
    var error = element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div[2]/p"));
    error.isPresent().then(function (result) {
        if(result){
            browser.actions().mouseMove(element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div[2]/p"))).perform();
            element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div[2]/button/span[1]")).click();
            browser.sleep(1000);
            element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
        browser.sleep(1000);
        var cancelwithoutsave = element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[1]/div/div[2]"));
        cancelwithoutsave.isPresent().then(function (result) {
            if(result){
          browser.actions().mouseMove(element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[1]/div/div[2]"))).perform();
          element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]")).click();

            } else {
                console.log('popup is not present');
            }
        });
        }
        else {
             console.log('error is not present');
        }
    });
    
          
            } else {
            element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[3]/textarea")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[3]/textarea")).clear();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[3]/textarea")).sendKeys(testdata.description);

         element(by.xpath("//select[@id='test']")).click();  
                element(by.xpath("//select[@id='test']/option[170]")).click();  
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[5]/p-calendar/span/input")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[5]/p-calendar/span/div/table/tbody/tr[4]/td[3]/a")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[6]/p-calendar/span/input")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[6]/p-calendar/span/div/table/tbody/tr[5]/td[3]/a")).click();
          element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[7]/div/select")).click();
          element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div[7]/div/select/option")).click();
          //hiding
    var selectionhide =  element(by.xpath("//input[@ng-reflect-value='true']"));  
    selectionhide.isPresent().then(function (result) {
        if(result){
         selectionhide.click();
         var reallyhide = element(by.xpath("//ecb-properties/ecb-modal-dialog[2]/div/div/div/div[1]/div/div[2]"));
         reallyhide.isPresent().then(function (result){
             if(result){
                 browser.actions().mouseMove(element(by.xpath("//ecb-properties/ecb-modal-dialog[2]/div/div/div/div[1]/div/div[2]"))).perform();
                 element(by.xpath("//ecb-properties/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[2]/dialog-button-2")).click();
         } else {
            console.log('popup is not present');
         }
         });
        } else {
          console.log('already hide is selected');
        }
    });
    expect(element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[2]/div/span[1]")).isDisplayed()).toBe(true);
    // clicking on save
    element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[1]")).click();
    browser.sleep(2000);
    
    var error = element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div[2]/p"));
    error.isPresent().then(function (result) {
        if(result){
            browser.actions().mouseMove(element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div[2]/p"))).perform();
            element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div[2]/button/span[1]")).click();
            browser.sleep(1000);
            element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
        browser.sleep(1000);
        var cancelwithoutsave = element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[1]/div/div[2]"));
        cancelwithoutsave.isPresent().then(function (result) {
            if(result){
          browser.actions().mouseMove(element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[1]/div/div[2]"))).perform();
          element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]")).click();

            } else {
                console.log('popup is not present');
            }
        });
        }
        else {
             console.log('error is not present');
        }
    });
            }
        });
                   } else {
            console.log('popup for createbundle or create po not came');
              }
    });
         }
              else {
               console.log('create po popup is not present');
              }
    });
        } else {
        console.log('create subscribable item link is not there');
        }
    });
      }
    });
  });
});
            