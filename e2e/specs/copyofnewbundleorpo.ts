var testdata = require('../inputs/testdata/copyofnewbundleorpo.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {
    it('copy bundle or po ', function() {
        browser.sleep(2000);
      
      var productoffers = element(by.xpath("//ecb-product-offer-list/div/div[2]/div/div/div/p"));
    productoffers.isPresent().then(function (result) {
      if (result) {
        console.log('productoffers are not there');
       
      } else {
       console.log('productoffers are present');

     var copyicon =  element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/a/em"));
     copyicon.isPresent().then(function (result) {
      if (result) {
          copyicon.click();
      browser.sleep(3000);
       var copypopup = element(by.xpath("//h2[contains(text(),'Copy Product Offer')]"));
       copypopup.isPresent().then(function (result) {
           if (result) {
              browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Copy Product Offer')]"))).perform();
              browser.sleep(3000);
              // cancel clicking
               element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
             browser.sleep(3000);
              // clicking again on copy
                copyicon.click();
                browser.sleep(3000);
              browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Copy Product Offer')]"))).perform();
              browser.sleep(2000);
              //description editing
              element(by.xpath("//textarea[@name='description']")).click();
              element(by.xpath("//textarea[@name='description']")).clear();
              browser.sleep(2000)
              element(by.xpath("//textarea[@name='description']")).sendKeys(testdata.podescription);
              //cancel clicking
               element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
             browser.sleep(3000);
             // return functionality
             var cancelwithoutsavepo = element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"));
             cancelwithoutsavepo.isPresent().then(function (result) {
           if (result) {
               browser.actions().mouseMove(element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"))).perform();
               browser.sleep(2000);
               element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]")).click();
               browser.sleep(4000);
                           
           } else {
              console.log('cancel without save popup not came while cancelling copy of po');
           }
             });
             copyicon.click();
                browser.sleep(3000);
              browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Copy Product Offer')]"))).perform();
              browser.sleep(2000);
                element(by.xpath("//textarea[@name='description']")).click();
              element(by.xpath("//textarea[@name='description']")).clear();
              browser.sleep(2000)
              element(by.xpath("//textarea[@name='description']")).sendKeys(testdata.podescription);
              // cancel
                element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
             browser.sleep(3000);
                var cancelreturnpo = element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"));
             cancelreturnpo.isPresent().then(function (result) {
           if (result) {
               browser.actions().mouseMove(element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"))).perform();
               browser.sleep(2000);
               element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[2]")).click();
               browser.sleep(4000);
                           
           } else {
              console.log('cancel without save popup not came while cancelling copy of po');
           }
             });
             browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Copy Product Offer')]"))).perform();
              browser.sleep(2000);
              var namealreadyexistinpo = element(by.xpath("//span[contains(text(), 'This name is already in use')]"));
              namealreadyexistinpo.isPresent().then(function (result) {
           if (result) {
               browser.sleep(1000);
             element(by.xpath("//input[@name='name']")).click();
   
              element(by.xpath("//input[@name='name']")).clear();
             browser.sleep(2000);
            element(by.xpath("//input[@name='name']")).sendKeys(testdata.pocreatename);

              
           } else {
             console.log('name already exist error is not present in copy of po while saving ');
           }
              });
              // saving
              element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[1]")).click();
              browser.sleep(6000);
               var nameusedpo = element(by.xpath("//span[contains(text(), 'This name is already in use')]"));
              nameusedpo.isPresent().then(function (result) {
           if (result) {
                 // cancel clicking
             element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
             browser.sleep(3000);
             var cancelwithoutsavebundle = element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"));
             cancelwithoutsavebundle.isPresent().then(function (result) {
           if (result) {
               browser.actions().mouseMove(element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"))).perform();
               browser.sleep(2000);
               element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]")).click();
               browser.sleep(4000);
                           
           } else {
              console.log('cancel without save popup not came while cancelling copy of po');
           } 
             });
           } else {
             var saveerrorinpo = element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div[2]/p"));
             saveerrorinpo.isPresent().then(function (result) {
           if (result) {
             browser.actions().mouseMove(element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div[2]/p"))).perform();
             browser.sleep(2000);
             element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div[2]/button/span[1]")).click();
             browser.sleep(2000);
             // cancel clicking
             element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
             browser.sleep(3000);
             var cancelwithoutsavepo = element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"));
             cancelwithoutsavepo.isPresent().then(function (result) {
           if (result) {
               browser.actions().mouseMove(element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"))).perform();
               browser.sleep(2000);
               element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]")).click();
               browser.sleep(4000);
                           
           } else {
              console.log('cancel without save popup not came while cancelling copy of po');
           }
             });
           } else {
             console.log('error not came while saving copy of po');
           }
             });
           }
              });

           } else {
               console.log('copy po popup not came for po');
           var copybundlepopup = element(by.xpath("//h2[contains(text(),'Copy Bundle')]"));
           copybundlepopup.isPresent().then(function (result) {
           if (result) {
                 browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Copy Bundle')]"))).perform();
              browser.sleep(2000);
               // cancel clicking
               element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
             browser.sleep(3000);
              // clicking again on copy
                copyicon.click();
                browser.sleep(3000);
              browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Copy Bundle')]"))).perform();
              browser.sleep(2000);
              //description editing
              element(by.xpath("//textarea[@name='description']")).click();
              element(by.xpath("//textarea[@name='description']")).clear();
              browser.sleep(2000);
              element(by.xpath("//textarea[@name='description']")).sendKeys(testdata.bundledescription);
                  //cancel clicking
               element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
             browser.sleep(3000);
             // return functionality
             var cancelwithoutsavebundle = element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"));
             cancelwithoutsavebundle.isPresent().then(function (result) {
           if (result) {
               browser.actions().mouseMove(element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"))).perform();
               browser.sleep(2000);
               element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]")).click();
               browser.sleep(4000);
                           
           } else {
              console.log('cancel without save popup not came while cancelling copy of bunlde');
           }
             });
             copyicon.click();
                browser.sleep(3000);
              browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Copy Bundle')]"))).perform();
              browser.sleep(2000);
                element(by.xpath("//textarea[@name='description']")).click();
              element(by.xpath("//textarea[@name='description']")).clear();
              browser.sleep(2000)
              element(by.xpath("//textarea[@name='description']")).sendKeys(testdata.bundledescription);
              //cancel
                element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
             browser.sleep(3000);
                var cancelreturnbundle = element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"));
             cancelreturnbundle.isPresent().then(function (result) {
           if (result) {
               browser.actions().mouseMove(element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"))).perform();
               browser.sleep(2000);
               element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[2]")).click();
               browser.sleep(4000);
                           
           } else {
              console.log('cancel without save popup not came while cancelling copy of bundle');
           }
             });
             browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Copy Bundle')]"))).perform();
              browser.sleep(2000);
              var namealreadyexistinbundle = element(by.xpath("//span[contains(text(), 'This name is already in use')]"));
              namealreadyexistinbundle.isPresent().then(function (result) {
           if (result) {
               browser.sleep(1000);
             element(by.xpath("//input[@name='name']")).click();
   
              element(by.xpath("//input[@name='name']")).clear();
             browser.sleep(2000);
            element(by.xpath("//input[@name='name']")).sendKeys(testdata.bundlecreatename);

              
           } else {
             console.log('name already exist error is not present in copy of bundle popup while saving');
           }
              });
              // saving
              element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[1]")).click();
              browser.sleep(6000);
              var nameusedbundle = element(by.xpath("//span[contains(text(), 'This name is already in use')]"));
              nameusedbundle.isPresent().then(function (result) {
           if (result) {
                 // cancel clicking
             element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
             browser.sleep(3000);
             var cancelwithoutsavebundle = element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"));
             cancelwithoutsavebundle.isPresent().then(function (result) {
           if (result) {
               browser.actions().mouseMove(element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"))).perform();
               browser.sleep(2000);
               element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]")).click();
               browser.sleep(4000);
                           
           } else {
              console.log('cancel without save popup not came while cancelling copy of bundle');
           } 
             });

           } else {
             var saveerrorinbundle = element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div[2]/p"));
             saveerrorinbundle.isPresent().then(function (result) {
           if (result) {
             browser.actions().mouseMove(element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div[2]/p"))).perform();
             browser.sleep(2000);
             element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div[2]/button/span[1]")).click();
             browser.sleep(2000);
             // cancel clicking
             element(by.xpath("//ecb-properties/div[1]/ngx-aside/aside/section/div/div[1]/div/div/div/button[2]")).click();
             browser.sleep(3000);
             var cancelwithoutsavebundle = element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"));
             cancelwithoutsavebundle.isPresent().then(function (result) {
           if (result) {
               browser.actions().mouseMove(element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]"))).perform();
               browser.sleep(2000);
               element(by.xpath("//ecb-properties/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]")).click();
               browser.sleep(4000);
                           
           } else {
              console.log('cancel without save popup not came while cancelling copy of bundle');
           } 
             });
           } else {
             console.log('error not came while saving copy of bundle');
           }
             });
           }
              }); 
           } else {
              console.log('copy bundle popup not came for bundle also');
           }
           });
           } 
       });
      } else {
          console.log('copy icon is not there in the grid to click');
      }
     });

      }
    });
    
    });
});
