var testdata = require('../inputs/testdata/productoffer.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {

  it('usagecharges widget', function () {

   
     var priceableitems = element(by.xpath("//ecb-usage-charges/div/div/div[@id='piCard']"));
    priceableitems.isPresent().then(function (result) {
          if (result) {
          element(by.xpath("//ecb-usage-charges/div/div/div[@id='piCard']/div[1]/div[1]/div")).click();
            browser.sleep(3000);
             var unitdetails = element(by.xpath("//ecb-unit-details/div/div[1]/div/h3"));
           unitdetails.isPresent().then(function (result) {
              if (result) {
                expect(element(by.xpath("//ecb-unit-details[@ng-reflect--p-idata='[object Object]']/div/div/div/h3")).getText()).toEqual(testdata.unitdetailsname);

             var edit = element(by.xpath("//ecb-unit-details/div/div[1]/div/a"));
             edit.isPresent().then(function (result) {
              if (result) {
                edit.click();
                browser.sleep(2000);
                var editpage = element(by.xpath("//ecb-unit-details/div/ngx-aside/aside/section/div/div/div/div/h3"));
                editpage.isPresent().then(function (result) {
              if (result) {
              browser.actions().mouseMove(element(by.xpath("//ecb-unit-details/div/ngx-aside/aside/section/div/div/div/div/h3"))).perform();
              browser.sleep(2000);
              element(by.xpath("//ecb-unit-details/div/ngx-aside/aside/section/div/div/form/div[2]/div/input")).click();
              element(by.xpath("//ecb-unit-details/div/ngx-aside/aside/section/div/div/form/div[2]/div/input")).clear();
              element(by.xpath("//ecb-unit-details/div/ngx-aside/aside/section/div/div/form/div[2]/div/input")).sendKeys(testdata.sendingudrcdata);
              element(by.xpath("//ecb-unit-details/div/ngx-aside/aside/section/div/div/div[1]/div/div/button[1]")).click();
              browser.sleep(2000);
               var error = element(by.xpath("//ecb-unit-details/div/ngx-aside/aside/section/div/div/div[2]/p"));
                error.isPresent().then(function (result) {
              if (result) {
            browser.actions().mouseMove(element(by.xpath("//ecb-unit-details/div/ngx-aside/aside/section/div/div/div[2]/p"))).perform();
          browser.sleep(2000);
          element(by.xpath("//ecb-unit-details/div/ngx-aside/aside/section/div/div/div[2]/button/span[1]")).click();
          element(by.xpath("//ecb-unit-details/div/ngx-aside/aside/section/div/div/div/div/div/button[2]")).click();
           browser.actions().mouseMove(element(by.xpath("//ecb-modal-dialog/div/div/div/div[1]/div/div[2]/div"))).perform();
                //browser.sleep(2000);
                element(by.xpath("//ecb-modal-dialog/div/div/div/div[2]/div/div[2]/button[1]")).click();

              } else {
                 console.log('error is not present');
              }
                });
              } else {
               console.log('edit page is not available for unit details');
              }
                });
              } else {
                 console.log('edit icon is not present for unit details');
              }
             });
              } else {
                console.log('No unitdetails');
               

           }
           });

            var billingdetails = element(by.xpath("//ecb-pi-billing[@ng-reflect-billing-information='[object Object]']"))
           billingdetails.isPresent().then(function (result) {
              if (result) {
                expect(element(by.xpath("//ecb-pi-billing[@ng-reflect-billing-information='[object Object]']/div/div/h3")).getText()).toEqual(testdata.billingdetailsname);
                
               


              } else {
                console.log('No billing details ');

              }
           });

            var properties = element(by.xpath("//ecb-piproperties/div[2]/div[1]/div/h3"));
          properties.isPresent().then(function (result) {
              if (result) {
                
                expect(element(by.xpath("//ecb-piproperties/div[2]/div[1]/div/a")).getText()).toEqual(testdata.edittext);
                element(by.xpath("//ecb-piproperties/div[2]/div[1]/div/a")).click();
                expect(element(by.xpath("//div[@class='col-xs-12 col-sm-12 col-md-12 col-lg-12 ecb-ngxAsideMargin']")).isDisplayed()).toBe(true);
                expect(element(by.xpath("//ecb-piproperties/div[2]/ngx-aside/aside/section/div/div/div/div/div/button[1]")).isDisplayed()).toBe(true);
                expect(element(by.xpath("//ecb-piproperties/div[2]/ngx-aside/aside/section/div/div/div/div/div/button[1]")).getText()).toEqual(testdata.savetext);
                expect(element(by.xpath("//ecb-piproperties/div[2]/ngx-aside/aside/section/div/div/div/div/div/button[2]")).isDisplayed()).toBe(true);
                expect(element(by.xpath("//ecb-piproperties/div[2]/ngx-aside/aside/section/div/div/div/div/div/button[2]")).getText()).toEqual(testdata.canceltext);

                element(by.xpath("//input[@name='piDisplayName']")).clear();
   
                element(by.xpath("//input[@name='piDisplayName']")).sendKeys(testdata.sendingdata);
                element(by.xpath("//ecb-piproperties/div[2]/ngx-aside/aside/section/div/div/div/div/div/button[1]")).click();
                browser.sleep(2000);
                var error = element(by.xpath("//ecb-piproperties/div[2]/ngx-aside/aside/section/div/div/div[2]/p"));
                error.isPresent().then(function (result) {
              if (result) {
                browser.actions().mouseMove(element(by.xpath("//ecb-piproperties/div[2]/ngx-aside/aside/section/div/div/div[2]/p"))).perform();
                element(by.xpath("//ecb-piproperties/div[2]/ngx-aside/aside/section/div/div/div[2]/button/span[1]")).click();
                element(by.xpath("//ecb-piproperties/div[2]/ngx-aside/aside/section/div/div/div/div/div/button[2]")).click();
                browser.actions().mouseMove(element(by.xpath("//ecb-modal-dialog/div/div/div/div[1]/div/div[2]/div"))).perform();
               // browser.sleep(2000);
                element(by.xpath("//ecb-modal-dialog/div/div/div/div[2]/div/div[2]/button[1]")).click();

              }
              else {
                 console.log('error is not present');
              }
                });
              
                browser.sleep(2000);

              } else {
                console.log('No properties ');

              }
            });

        var extendedproperties = element(by.xpath("//ecb-extended-properties/div/div[1]/div[1]/div/div/h3"));
           extendedproperties.isPresent().then(function (result) {
              if (result) {
                var edit = element(by.xpath("//ecb-extended-properties/div/div[1]/div[1]/div/div/div/a"));
                edit.isPresent().then(function (result) {
              if (result) {
                edit.click();
                browser.sleep(2000);
                var editpage = element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[1]/div/div/h3"));
                editpage.isPresent().then(function (result) {
              if (result) {
                browser.actions().mouseMove(element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[1]/div/div/h3"))).perform();
                browser.sleep(2000);
                element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[2]/form/div[1]/div/input")).clear();
                element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[2]/form/div[1]/div/input")).sendKeys(testdata.sendingdata1);
                element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[2]/form/div[1]/div/input")).click();

                browser.sleep(1000);
                // save
                element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[1]/div/div/div/button[1]")).click();
                browser.sleep(2000);
                var error = element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[2]/div/p"));
                 error.isPresent().then(function (result) {
              if (result) {
                browser.actions().mouseMove(element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[2]/div/p"))).perform();
                    element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[2]/div/button/span[1]")).click();
                    element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
                   browser.actions().mouseMove(element(by.xpath("//ecb-modal-dialog/div/div/div/div[1]/div/div[2]/div"))).perform();
                   
                element(by.xpath("//ecb-modal-dialog/div/div/div/div[2]/div/div[2]/button[1]")).click();
 
              } else {
                 console.log('error is not present');
              }
                 });

              } else {
                  console.log('page is not came for editing');
              }
                });
              } else {
                console.log('editbutton is not present');

              }
                });
              } else {
                  console.log('extended properties are not present for this pi');
              }
           });

            

           
          } else {
           
            
            console.log('there are no pis for this po or there is any error while loading pis');
            browser.sleep(2000);


          }
        });

     

        
  });
});

  