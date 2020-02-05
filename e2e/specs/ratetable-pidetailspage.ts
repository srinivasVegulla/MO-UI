import { browser, by, element } from 'protractor';

var testdata = require('../inputs/testdata/ratetable-pidetailspage.json');


describe('widget', function () {
  it('ratetable pi details page', function () {
     
     browser.sleep(5000);
   var ratetablehead = element(by.xpath("//ecb-rates/div[1]/div/div/div[2]/div[1]/div[1]/h2"));
   ratetablehead.isPresent().then(function (result){
              if(result){
                    browser.sleep(3000);
         expect(element(by.xpath("//ecb-rates/div[1]/div/div/div[2]/div[1]/div[1]/h2")).getText()).toEqual(testdata.ratetablename);
            browser.sleep(2000);
            // opening and closing of rate table
            var open = element(by.xpath("//i[@class='fa fa-chevron-circle-up ecbRateSourceAccordian']"));
            open.isPresent().then(function (result){
              if(result){
                  console.log('rate table is already in open state');
                  element(by.xpath("//i[@class='fa fa-chevron-circle-up ecbRateSourceAccordian']")).click();
                  browser.sleep(3000);
                  element(by.xpath("//i[@class='fa fa-chevron-circle-down ecbRateSourceAccordian']")).click();
                  browser.sleep(3000);
              } else {
              console.log('rate table is not in open state');
              element(by.xpath("//i[@class='fa fa-chevron-circle-down ecbRateSourceAccordian']")).click();
              browser.sleep(3000);
              }
            });
            
            expect(element(by.xpath("//span[contains(text(),'Rate Source')]")).isDisplayed()).toBe(true);
            expect(element(by.xpath("//span[contains(text(),'Allow Custom Rate (ICB)')]")).isDisplayed()).toBe(true);
        // editing rate table
         var editicon = element(by.xpath("//a[@class='ecb-rateTable']"));
         editicon.isPresent().then(function (result){
              if(result){
           editicon.click();
           browser.sleep(4000);
          var editpanel = element(by.xpath("//h2[contains(text(),'Edit Rate Table')]"));
          editpanel.isPresent().then(function (result){
              if(result){
              browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Edit Rate Table')]"))).perform();
              browser.sleep(3000);
              // cancel clicking
              element(by.xpath("//ecb-rates/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[2]")).click();
              browser.sleep(3000);
              element(by.xpath("//a[@class='ecb-rateTable']")).click();
              browser.sleep(3000);
              browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Edit Rate Table')]"))).perform();
              browser.sleep(3000);
              element(by.xpath("//span[@class='chevron down']")).click();
              browser.sleep(3000);
              // selecting ratesource
              element(by.xpath("//ecb-rates/div[1]/ngx-aside/aside/section/div/div/div[2]/form/div[1]/div/ul/li[1]")).click();
              browser.sleep(2000);
             expect(element(by.xpath("//span[contains(text(),'Allow Custom Rate (ICB)')]")).isDisplayed()).toBe(true);
              // cancel clicking
              element(by.xpath("//ecb-rates/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[2]")).click();
              browser.sleep(3000);
              // cancel withoutsave popup 
              var cancel = element(by.xpath("//ecb-rates/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"));
              cancel.isPresent().then(function (result){
              if(result){
              browser.actions().mouseMove(element(by.xpath("//ecb-rates/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"))).perform();
              browser.sleep(3000);
              element(by.xpath("//ecb-rates/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]")).click();
              browser.sleep(3000);
              } else {
               console.log('cancel without save popup not came');
              }
            });
                     element(by.xpath("//a[@class='ecb-rateTable']")).click();
              browser.sleep(3000);
              browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Edit Rate Table')]"))).perform();
              browser.sleep(3000);
              element(by.xpath("//span[@class='chevron down']")).click();
              browser.sleep(3000);
              // selecting ratesource
              element(by.xpath("//ecb-rates/div[1]/ngx-aside/aside/section/div/div/div[2]/form/div[1]/div/ul/li[1]")).click();
              browser.sleep(2000);
              // cancel clicking
              element(by.xpath("//ecb-rates/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[2]")).click();
              browser.sleep(3000);
              var returnpopup = element(by.xpath("//ecb-rates/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"));
              returnpopup.isPresent().then(function (result){
              if(result){
              browser.actions().mouseMove(element(by.xpath("//ecb-rates/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"))).perform();
              browser.sleep(3000);
              element(by.xpath("//ecb-rates/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[2]")).click();
              browser.sleep(3000);
              } else {
               console.log('cancel without save popup not came');
              }
            });
             browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Edit Rate Table')]"))).perform();
              browser.sleep(3000);
              // save
               element(by.xpath("//ecb-rates/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[1]")).click();
              browser.sleep(3000);
               var error = element(by.xpath("//ecb-rates/div[1]/ngx-aside/aside/section/div/div/div[2]/div/div"));
              error.isPresent().then(function (result){
         if(result){  
               browser.actions().mouseMove(element(by.xpath("//ecb-rates/div[1]/ngx-aside/aside/section/div/div/div[2]/div/div"))).perform();
                browser.sleep(2000);
                element(by.xpath("//ecb-rates/div[1]/ngx-aside/aside/section/div/div/div[2]/div/div/button/span[1]")).click();
                browser.sleep(2000);

                // clicking on cancel
                element(by.xpath("//ecb-rates/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]")).click();
                var popup = element(by.xpath("//ecb-rates/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"));
         popup.isPresent().then(function (result){
         if(result){  
             browser.actions().mouseMove(element(by.xpath("//ecb-rates/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"))).perform();
             element(by.xpath("//ecb-rates/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]")).click();
             browser.sleep(2000);
         } else {
               console.log('modalpoup for cancel is not present while editing ratetable');
         }
         });
         } else {
            console.log('error is not present while saving the ratetable');
         }
        });
        
        var continuewithnewsource = element(by.xpath("//ecb-rates/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]/dialog-button-1"));
        continuewithnewsource.isPresent().then(function (result){
         if(result){
           browser.actions().mouseMove(element(by.xpath("//ecb-rates/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]/dialog-button-1"))).perform();
           browser.sleep(4000);
           //return
           element(by.xpath("//ecb-rates/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[2]/dialog-button-2")).click();
           browser.sleep(3000);
             browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Edit Rate Table')]"))).perform();
              browser.sleep(3000);
              // save
               element(by.xpath("//ecb-rates/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[1]")).click();
              browser.sleep(3000);
               browser.actions().mouseMove(element(by.xpath("//ecb-rates/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]/dialog-button-1"))).perform();
           browser.sleep(4000);
           //continue with the new source
           element(by.xpath("//ecb-rates/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]/dialog-button-1")).click();
            browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Edit Rate Table')]"))).perform();
              browser.sleep(3000);
              // save
               element(by.xpath("//ecb-rates/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[1]")).click();
              browser.sleep(3000);
         } else {
           console.log('continue with new source pop up not came while clicking on saving the rate source');
         }
        });
              } else {
             console.log('edit panel not came when we click on the rate table edit');
              }
          });
              } else {
            console.log('edit icon is not present to edit rate table');
              }
         });

         } else {
           console.log('rate tables are not present for this pi');
              }
   });

  });
});