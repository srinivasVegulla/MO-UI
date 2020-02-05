import { browser, by, element } from 'protractor';

var testdata = require('../inputs/testdata/createpo.json');


describe('widget', function () {
  it('creating product offer ', function () {
  
  browser.sleep(4000);
  var offeringspage = element(by.xpath("//a[@class='ecb-createPOLink']"));
  offeringspage.isPresent().then(function(result){
      if (result) {
     console.log('already it is in the offerings page');
  } else {
     browser.sleep(2000);
     element(by.xpath("//span[@id='breadcrumbExpDivs']")).click();
     browser.sleep(3000);


 element(by.xpath("//ul[@class='ebComponentList ecb-ComponentList']/li[1]/a")).click();
  browser.sleep(5000);
  }
});
/*
var leavepopup = element(by.xpath("//body[@id='mainBody']/app-root/ecb-modal-dialog/div/div/div/div[2]/div/button[1]/dialog-button-1"));
 leavepopup.isPresent().then(function (result) {
      if (result) {
  browser.actions().mouseMove(element(by.xpath("//body[@id='mainBody']/app-root/ecb-modal-dialog/div/div/div/div[2]/div/button[1]/dialog-button-1"))).perform();
  browser.sleep(3000);
  element(by.xpath("//body[@id='mainBody']/app-root/ecb-modal-dialog/div/div/div/div[2]/div/button[1]/dialog-button-1")).click();
  browser.sleep(2000);

      } else {
       console.log('leave the page popup not came');
      }
 });
 */
    var productoffers = element(by.xpath("//ecb-product-offer-list/div/div[2]/div/div/div/p"));
    productoffers.isPresent().then(function (result) {
      if (result) {
        console.log('productoffers are not there');
       var error = element(by.xpath("//ecb-product-offer-list/div/div[2]/div/div/div/p"));
        error.isPresent().then(function (result) {
      if (result) {
          console.log('error occured while loading pos');
          var createlink = element(by.xpath("//a[@class='ecb-createPOLink']"));
    createlink.isPresent().then(function (result) {
        if(result) {

    expect(element(by.xpath("//a[@class='ecb-createPOLink']")).getText()).toEqual(testdata.createlink);
    element(by.xpath("//a[@class='ecb-createPOLink']")).click();
    browser.sleep(3000);
     var popup1 = element(by.xpath("//h2[contains(text(),'Create Offering')]"));
    popup1.isPresent().then(function (result) {
      if (result) { 
     browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Create Offering')]"))).perform();
     browser.sleep(1000);  
     
     element(by.xpath("//a[contains(text(),'Create Product')]")).click();
     browser.sleep(3000);  
    var popup = element(by.xpath("//ecb-product-offer-list/div/ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/h2"));
    popup.isPresent().then(function (result){
              if(result){
        browser.actions().mouseMove(element(by.xpath("//ecb-product-offer-list/div/ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/h2"))).perform();
        
        element(by.xpath("//input[@name='name']")).click();
        element(by.xpath("//input[@name='name']")).clear();
        element(by.xpath("//input[@name='name']")).sendKeys(testdata.poname);
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
        browser.sleep(500);
        var cancelwithoutsave = element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[1]/div/div[2]"));
        cancelwithoutsave.isPresent().then(function (result) {
            if(result){
          browser.actions().mouseMove(element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[1]/div/div[2]"))).perform();
          element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]")).click(); 
               element(by.xpath("//a[@class='ecb-createPOLink']")).click();

               browser.sleep(1000);
               browser.actions().mouseMove(element(by.xpath("//ecb-product-offer-list/div/ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/h2"))).perform();
     browser.sleep(1000);
     
     element(by.xpath("//a[contains(text(),'Create Product')]")).click();
     browser.sleep(3000);
              browser.actions().mouseMove(element(by.xpath("//ecb-product-offer-list/div/ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/h2"))).perform();
             element(by.xpath("//input[@name='name']")).click();
        element(by.xpath("//input[@name='name']")).clear();
        element(by.xpath("//input[@name='name']")).sendKeys(testdata.poname);
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
           browser.actions().mouseMove(element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[1]/div/div[2]"))).perform();
          element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[2]")).click();
            }
            else {
             console.log('cancel without save popup is not present');
            }
        });
        element(by.xpath("//input[@name='name']")).click();
        element(by.xpath("//input[@name='name']")).clear();
        element(by.xpath("//input[@name='name']")).sendKeys(testdata.displayname);
   
        var namealreadyused = element(by.xpath("//span[contains(text(),'This name is already in use']"));
        namealreadyused.isPresent().then(function (result) {
            if(result){
                element(by.xpath("//input[@name='name']")).click();
        element(by.xpath("//input[@name='name']")).clear();
        element(by.xpath("//input[@name='name']")).sendKeys(testdata.anotherponame);
         element(by.xpath("//textarea[@name='description']")).click();
        element(by.xpath("//textarea[@name='description']")).clear();
        element(by.xpath("//textarea[@name='description']")).sendKeys(testdata.description);

        
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div/div[5]/p-calendar/span/input")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div/div[5]/p-calendar/span/div/table/tbody/tr[2]/td[2]/a")).click();
         // enddate selection
         element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div/div[6]/p-calendar/span/input")).click();
         element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div/div[6]/p-calendar/span/div/table/tbody/tr[3]/td[2]/a")).click();

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
    browser.sleep(5000);
            } else {
          
     element(by.xpath("//textarea[@name='description']")).click();
        element(by.xpath("//textarea[@name='description']")).clear();
        element(by.xpath("//textarea[@name='description']")).sendKeys(testdata.description);

         
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div/div[5]/p-calendar/span/input")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div/div[5]/p-calendar/span/div/table/tbody/tr[2]/td[2]/a")).click();
          // enddate selection
         element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div/div[6]/p-calendar/span/input")).click();
         element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div/div[6]/p-calendar/span/div/table/tbody/tr[3]/td[2]/a")).click();
         
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
    browser.sleep(5000);
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
    
         var createlink = element(by.xpath("//a[@class='ecb-createPOLink']"));
    createlink.isPresent().then(function (result) {
        if(result) {
  
  
    element(by.xpath("//a[@class='ecb-createPOLink']")).click();
    browser.sleep(3000);
     var popup1 = element(by.xpath("//h2[contains(text(),'Create Offering')]"));
    popup1.isPresent().then(function (result) {
      if (result) { 
     browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Create Offering')]"))).perform();
     browser.sleep(1000);  
     
element(by.xpath("//a[contains(text(),'Create Product')]")).click();
     browser.sleep(3000);  
    var popup = element(by.xpath("//ecb-product-offer-list/div/ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/h2"));
    popup.isPresent().then(function (result){
              if(result){
                  browser.actions().mouseMove(element(by.xpath("//ecb-product-offer-list/div/ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/h2"))).perform();
        
        element(by.xpath("//input[@name='name']")).click();
        element(by.xpath("//input[@name='name']")).clear();
        element(by.xpath("//input[@name='name']")).sendKeys(testdata.poname);
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
        browser.sleep(1000);
        var cancelwithoutsave = element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[1]/div/div[2]"));
        cancelwithoutsave.isPresent().then(function (result) {
            if(result){
          browser.actions().mouseMove(element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[1]/div/div[2]"))).perform();
          element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]")).click(); 
               element(by.xpath("//a[@class='ecb-createPOLink']")).click();

               browser.sleep(1000);
               browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Create Offering')]"))).perform();
     browser.sleep(1000);
     
     element(by.xpath("//a[contains(text(),'Create Product')]")).click();
     browser.sleep(3000);
              browser.actions().mouseMove(element(by.xpath("//ecb-product-offer-list/div/ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/h2"))).perform();
             element(by.xpath("//input[@name='name']")).click();
        element(by.xpath("//input[@name='name']")).clear();
        element(by.xpath("//input[@name='name']")).sendKeys(testdata.poname);
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
           browser.actions().mouseMove(element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[1]/div/div[2]"))).perform();
          element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[2]")).click();
            }
            else {
             console.log('cancel without save popup is not present');
            }
        });
       browser.sleep(4000);
         var namealreadyused = element(by.xpath("//span[contains(text(),'This name is already in use')]"));
        namealreadyused.isPresent().then(function (result) {
            if(result){
                element(by.xpath("//input[@name='name']")).click();
        element(by.xpath("//input[@name='name']")).clear();
        element(by.xpath("//input[@name='name']")).sendKeys(testdata.anotherponame);
          element(by.xpath("//textarea[@name='description']")).click();
        element(by.xpath("//textarea[@name='description']")).clear();
        element(by.xpath("//textarea[@name='description']")).sendKeys(testdata.description);

         
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div/div[5]/p-calendar/span/input")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div/div[5]/p-calendar/span/div/table/tbody/tr[2]/td[2]/a")).click();
          // enddate selection
         element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div/div[6]/p-calendar/span/input")).click();
         element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div/div[6]/p-calendar/span/div/table/tbody/tr[3]/td[2]/a")).click();
          
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
 
    // clicking on save
    element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[1]")).click();
    browser.sleep(5000);
    
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
            element(by.xpath("//textarea[@name='description']")).click();
        element(by.xpath("//textarea[@name='description']")).clear();
        element(by.xpath("//textarea[@name='description']")).sendKeys(testdata.description);

         
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div/div[5]/p-calendar/span/input")).click();
        element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div/div[5]/p-calendar/span/div/table/tbody/tr[2]/td[2]/a")).click();
        // enddate selection
         element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div/div[6]/p-calendar/span/input")).click();
         element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/form/div/div/div[6]/p-calendar/span/div/table/tbody/tr[3]/td[2]/a")).click();
          
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
  
    // clicking on save
    element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[1]")).click();
    browser.sleep(5000);
    
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