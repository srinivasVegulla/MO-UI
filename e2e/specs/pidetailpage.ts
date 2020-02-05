var testdata = require('../inputs/testdata/productoffer.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {

  it('productoffer widget', function () {

    browser.sleep(6000);
        var priceableitems = element(by.xpath("//div[@class='ecbClickableCard-heading']"));
    priceableitems.isPresent().then(function (result) {
          if (result) {
            element(by.xpath("//div[@class='ecbClickableCard-heading']")).click();
            browser.sleep(6000);
           
            var unitdetailsheading = element(by.xpath("//h2[contains(text(),'Unit Details')]"));
            unitdetailsheading.isPresent().then(function (result) {
              if (result) {
                 expect(element(by.xpath("//ecb-unit-details/div[1]/div[1]/div/h2")).getText()).toEqual(testdata.unitdetailsname);
            var unitdetails = element(by.xpath("//ecb-unit-details/div[1]/div[2]/form/div[1]/label"));
           unitdetails.isPresent().then(function (result) {
              if (result) {
               
             var edit = element(by.xpath("//ecb-unit-details/div[1]/div[1]/div/a"));
             edit.isPresent().then(function (result) {
              if (result) {
                edit.click();
                browser.sleep(3000);
                var editpage = element(by.xpath("//ecb-unit-details/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/h3"));
                editpage.isPresent().then(function (result) {
              if (result) {
              browser.actions().mouseMove(element(by.xpath("//ecb-unit-details/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/h3"))).perform();
              browser.sleep(2000);
              // cancel clicking
              element(by.xpath("//ecb-unit-details/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[2]")).click();
              browser.sleep(3000);
              // edit clicking
              element(by.xpath("//ecb-unit-details/div[1]/div[1]/div/a")).click();
              browser.sleep(3000);
               browser.actions().mouseMove(element(by.xpath("//ecb-unit-details/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/h3"))).perform();

              element(by.xpath("//input[@name='unitDisplayName']")).click();
              element(by.xpath("//input[@name='unitDisplayName']")).clear();
              element(by.xpath("//input[@name='unitDisplayName']")).sendKeys(testdata.sendingudrcdata);
              browser.sleep(2000);
              // cancel clicking
              element(by.xpath("//ecb-unit-details/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[2]")).click();
              browser.sleep(3000);
               var cancelpopup = element(by.xpath("//ecb-unit-details/div[1]/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"));
                 cancelpopup.isPresent().then(function (result) {
              if (result) {
            browser.actions().mouseMove(element(by.xpath("//ecb-unit-details/div[1]/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
             browser.sleep(3000);
             element(by.xpath("//ecb-unit-details/div[1]/ecb-modal-dialog/div/div/div/div[2]/div/button[1]")).click();
             browser.sleep(3000);
              } else {
               console.log('cancel without save popup not came');
              }
                 });
                // edit clicking
               element(by.xpath("//ecb-unit-details/div[1]/div[1]/div/a")).click();
               browser.sleep(3000);
               browser.actions().mouseMove(element(by.xpath("//ecb-unit-details/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/h3"))).perform();
               element(by.xpath("//ecb-unit-details/div[1]/ngx-aside/aside/section/div/div/div[1]/form/div[2]/div/input")).click();
              element(by.xpath("//input[@name='unitDisplayName']")).clear();
              element(by.xpath("//input[@name='unitDisplayName']")).sendKeys(testdata.sendingudrcdata);
              // cancel clicking
              element(by.xpath("//ecb-unit-details/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[2]")).click();
              browser.sleep(3000);
              var returnpopup = element(by.xpath("//ecb-unit-details/div[1]/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"));
                returnpopup.isPresent().then(function (result) {
              if (result) {
            browser.actions().mouseMove(element(by.xpath("//ecb-unit-details/div[1]/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
             browser.sleep(3000);
             element(by.xpath("//ecb-unit-details/div[1]/ecb-modal-dialog/div/div/div/div[2]/div/button[2]")).click();
             browser.sleep(3000);
              } else {
               console.log('cancel without save popup not came');
              }
                 });
                browser.actions().mouseMove(element(by.xpath("//ecb-unit-details/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/h3"))).perform();
                browser.sleep(2000);
              // save
              element(by.xpath("//ecb-unit-details/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[1]")).click();
              browser.sleep(3000);
               var error = element(by.xpath("//ecb-unit-details/div[1]/ngx-aside/aside/section/div/div/div[1]/div[2]/p"));
                error.isPresent().then(function (result) {
              if (result) {
            browser.actions().mouseMove(element(by.xpath("//ecb-unit-details/div[1]/ngx-aside/aside/section/div/div/div[1]/div[2]/p"))).perform();
          browser.sleep(2000);
          element(by.xpath("//ecb-unit-details/div[1]/ngx-aside/aside/section/div/div/div[1]/div[2]/button/span[1]")).click();
          element(by.xpath("//ecb-unit-details/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[2]")).click();
         var cancelpopup = element(by.xpath("//ecb-unit-details/div[1]/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"));
                 cancelpopup.isPresent().then(function (result) {
              if (result) {
            browser.actions().mouseMove(element(by.xpath("//ecb-unit-details/div[1]/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
             browser.sleep(3000);
             element(by.xpath("//ecb-unit-details/div[1]/ecb-modal-dialog/div/div/div/div[2]/div/button[1]")).click();
             browser.sleep(3000);
              } else {
               console.log('cancel without save popup not came');
              }
                 });
              } else {
                 console.log('error is not present while saving unit details in pi detail page');
              }
                });
              } else {
               console.log('edit page is not available for unit details in pi detail page');
              }
                });
              } else {
                 console.log('edit icon is not present for unit details in pi detail page');
              }
             });
              } else {
                console.log('No unitdetails are present in pi detail page');
               

           }
          });
              } else {
             console.log('unit details heading is not present in pi details page');
              }
            });

             
                var billingheading = element(by.xpath("//h2[contains(text(),'Billing')]"));
                billingheading.isPresent().then(function (result) {
              if (result) {
             expect(element(by.xpath("//ecb-pi-billing/div[1]/div[1]/div/h2")).getText()).toEqual(testdata.billingdetailsname);
            var billingdetails = element(by.xpath("//ecb-pi-billing/div[1]/div[2]/div/form/div[1]/label"));
           billingdetails.isPresent().then(function (result) {
              if (result) {
               } else {
                console.log('No billing details are there for this pi ');
                   }
           });
              } else {
                  console.log('billing details heading is not there in pi detail page');
              }
                });
             var propertiesheading = element(by.xpath("//h2[contains(text(),'Properties')]"));
           propertiesheading.isPresent().then(function (result) {
              if (result) {
                expect(element(by.xpath("//ecb-piproperties/div[1]/div[1]/div/h2")).getText()).toEqual(testdata.propertiesdetailsname);
            var properties = element(by.xpath("//ecb-piproperties/div[1]/div[2]/div/form/div[1]/label"));
          properties.isPresent().then(function (result) {
              if (result) {
                
                expect(element(by.xpath("//ecb-piproperties/div[1]/div[1]/div/a")).getText()).toEqual(testdata.edittext);
                browser.sleep(2000);
                element(by.xpath("//ecb-piproperties/div[1]/div[1]/div/a")).click();
                browser.sleep(3000);
                expect(element(by.xpath("//div[@class='col-xs-12 col-sm-12 col-md-12 col-lg-12 ecb-ngxAsideMargin']")).isDisplayed()).toBe(true);
                //hovering
                browser.actions().mouseMove(element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/h3"))).perform();
                 browser.sleep(2000);
                // cancel clicking
                element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[2]")).click();
                browser.sleep(3000);
                // again edit clicking
                element(by.xpath("//ecb-piproperties/div[1]/div[1]/div/a")).click();
                browser.sleep(3000);
                //hovering
                browser.actions().mouseMove(element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/h3"))).perform();
                 browser.sleep(2000);
                 element(by.xpath("//input[@name='piDisplayName']")).click();
   
                element(by.xpath("//input[@name='piDisplayName']")).sendKeys(testdata.sendingdata);
                // cancel clicking 
                element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[2]")).click();
                browser.sleep(3000);
                // cancel without save
                 var cancelpopup = element(by.xpath("//ecb-piproperties/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"));
                 cancelpopup.isPresent().then(function (result) {
              if (result) {
            browser.actions().mouseMove(element(by.xpath("//ecb-piproperties/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
             browser.sleep(3000);
             element(by.xpath("//ecb-piproperties/ecb-modal-dialog/div/div/div/div[2]/div/button[1]")).click();
             browser.sleep(3000);
              } else {
               console.log('cancel without save popup not came');
              }
                 });
                // again edit clicking 
                 element(by.xpath("//ecb-piproperties/div[1]/div[1]/div/a")).click();
                browser.sleep(3000);

                 // hovering
                 browser.actions().mouseMove(element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/h3"))).perform();
                 browser.sleep(2000);
                  element(by.xpath("//input[@name='piDisplayName']")).click();
   
                element(by.xpath("//input[@name='piDisplayName']")).sendKeys(testdata.sendingdata);
                // cancel clicking 
                 element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[2]")).click();
                browser.sleep(3000);
                //return clicking- cancel withoyt save popup
                var returnpopup = element(by.xpath("//ecb-piproperties/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"));
                 returnpopup.isPresent().then(function (result) {
              if (result) {
            browser.actions().mouseMove(element(by.xpath("//ecb-piproperties/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
             browser.sleep(3000);
             element(by.xpath("//ecb-piproperties/ecb-modal-dialog/div/div/div/div[2]/div/button[2]")).click();
             browser.sleep(3000);
              } else {
               console.log('return popup not came');
              }
                 });
                 // hovering
                 browser.actions().mouseMove(element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/h3"))).perform();
                 browser.sleep(2000);
                // save
                element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[1]")).click();
                browser.sleep(2000);
                var error = element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/div[2]/p"));
                error.isPresent().then(function (result) {
              if (result) {
                browser.actions().mouseMove(element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/div[2]/p"))).perform();
                element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/div[2]/button/span[1]")).click();
                element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[2]")).click();
                browser.sleep(3000);
                var cancelpopup = element(by.xpath("//ecb-piproperties/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"));
                 cancelpopup.isPresent().then(function (result) {
              if (result) {
            browser.actions().mouseMove(element(by.xpath("//ecb-piproperties/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
             browser.sleep(3000);
             element(by.xpath("//ecb-piproperties/ecb-modal-dialog/div/div/div/div[2]/div/button[1]")).click();
             browser.sleep(3000);
              } else {
               console.log('cancel without save popup not came');
              }
                 });
              }
              else {
                 console.log('error is not present while saving properties in pi detail page');
              }
                });
              
               

              } else {
                console.log('No elements are present in  properties widget  in pi detail page ');

              }
            });
            } else {
                  console.log('properties details heading is not there in pi detail page');
              }
                });
             var extendedheading = element(by.xpath("//h2[contains(text(),'Extended Properties')]"));
             extendedheading.isPresent().then(function (result) {
              if (result) {
                expect(element(by.xpath("//ecb-extended-properties/div/div[1]/div[1]/div/div/h2")).getText()).toEqual(testdata.extendedpropheading);
         var extendedproperties = element(by.xpath("//ecb-extended-properties/div/div[1]/div[2]/form/div[1]/div/label"));
           extendedproperties.isPresent().then(function (result) {
              if (result) {
                var edit = element(by.xpath("//ecb-extended-properties/div/div[1]/div[1]/div/div/div/a"));
                edit.isPresent().then(function (result) {
              if (result) {
                edit.click();
                browser.sleep(2000);
                var editpage = element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[1]/div/div/h2"));
                editpage.isPresent().then(function (result) {
              if (result) {
                browser.actions().mouseMove(element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[1]/div/div/h2"))).perform();
                browser.sleep(2000);
                //cancel clicking
                 element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[2]")).click();
                browser.sleep(3000);
                // edit clicking
                element(by.xpath("//ecb-extended-properties/div/div[1]/div[1]/div/div/div/a")).click();
                browser.sleep(3000);
                 browser.actions().mouseMove(element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[1]/div/div/h2"))).perform();
                 browser.sleep(2000);
                element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[2]/form/div[1]/div/input")).click();
                element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[2]/form/div[1]/div/input")).sendKeys(testdata.sendingdata1);
                element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[2]/form/div[1]/div/input")).click();

                browser.sleep(2000);
                // cancel clicking
                 element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[2]")).click();
                browser.sleep(3000);
                // cancel without save
                var cancelpopup = element(by.xpath("//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"));
                 cancelpopup.isPresent().then(function (result) {
              if (result) {
            browser.actions().mouseMove(element(by.xpath("//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
             browser.sleep(3000);
             element(by.xpath("//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]")).click();
             browser.sleep(3000);
              } else {
               console.log('cancel without save popup not came');
              }
                 });
                 // edit clicking
                element(by.xpath("//ecb-extended-properties/div/div[1]/div[1]/div/div/div/a")).click();
                browser.sleep(3000);
                 browser.actions().mouseMove(element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[1]/div/div/h2"))).perform();
                 browser.sleep(2000);
                  element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[2]/form/div[1]/div/input")).click();
                element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[2]/form/div[1]/div/input")).sendKeys(testdata.sendingdata1);
                element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[2]/form/div[1]/div/input")).click();

                browser.sleep(2000);
                 // cancel clicking
                 element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[2]")).click();
                browser.sleep(3000);
                // cancel without save
                var returnpopup = element(by.xpath("//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"));
                 returnpopup.isPresent().then(function (result) {
              if (result) {
            browser.actions().mouseMove(element(by.xpath("//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
             browser.sleep(3000);
             element(by.xpath("//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[2]")).click();
             browser.sleep(3000);
              } else {
               console.log('cancel without save popup not came');
              }
                 });
                  browser.actions().mouseMove(element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[1]/div/div/h2"))).perform();
                 browser.sleep(2000);
                // save
                element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[1]")).click();
                browser.sleep(2000);
                var error = element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[2]/div/p"));
                 error.isPresent().then(function (result) {
              if (result) {
                browser.actions().mouseMove(element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[2]/div/p"))).perform();
                    element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[2]/div/button/span[1]")).click();
                    element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[2]")).click();
                      browser.sleep(3000);
                     var cancelpopup = element(by.xpath("//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"));
                 cancelpopup.isPresent().then(function (result) {
              if (result) {
            browser.actions().mouseMove(element(by.xpath("//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
             browser.sleep(3000);
             element(by.xpath("//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]")).click();
             browser.sleep(3000);
              } else {
               console.log('cancel without save popup not came');
              }
                 });
 
              } else {
                 console.log('error is not present while saving extended properties in pi detail page');
              }
                 });

              } else {
                  console.log('page is not came for editing extended properties in pi detail page');
              }
                });
              } else {
                console.log('editbutton is not present for extended properties in pi detail page');

              }
                });
              } else {
                  console.log('extended properties are not present for this pi');
              }
           });
           } else {
                  console.log('extended properties details heading is not there in pi detail page');
              }
                });

                // adjustments
              var adjustmentsheading = element(by.xpath("//h2[contains(text(),'Adjustments')]"));
                adjustmentsheading.isPresent().then (function (result) {
            if (result) {
             var editicon = element(by.xpath("//ecb-priceableitem-adjustments/div[1]/div/div/a"));
                editicon.isPresent().then (function (result) {
            if (result) {
               editicon.click();
               browser.sleep(4000);
              var editpanel = element(by.xpath("//h3[contains(text(),'Edit Adjustments')]"));
               editpanel.isPresent().then (function (result) {
            if (result) {
             browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Edit Adjustments')]"))).perform();
             browser.sleep(3000);
             // cancel clicking
            element(by.xpath("//ecb-priceableitem-adjustments/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]/span")).click();
             browser.sleep(4000);
               editicon.click();
               browser.sleep(4000);
                browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Edit Adjustments')]"))).perform();
             browser.sleep(3000);
           var displayname = element(by.xpath("//div[@id='ecb-adjustment']/p-datatable/div/div[1]/table/tbody/tr[1]/td[3]/span/textarea"));
            displayname.isPresent().then (function (result) {
            if (result) {
             browser.actions().mouseMove(element(by.xpath("//div[@id='ecb-adjustment']/p-datatable/div/div[1]/table/tbody/tr[1]/td[3]/span/textarea"))).perform();
             browser.sleep(3000);
            displayname.click();
            displayname.sendKeys(testdata.displaynameadj);
            browser.sleep(3000);
           // save
           element(by.xpath("//ecb-priceableitem-adjustments/ngx-aside/aside/section/div/div/div[1]/div/div/button[1]")).click();
           browser.sleep(4000);
            } else {
              console.log('display name column is not ther to edit');
            }
            });
            } else {
                console.log('edit panel not came when clicking on adjustment widget');
            }
               });
            } else {
               console.log('edit icon is not present in adjustment widget');
            }
                });
            } else {
               console.log('adjustments widget is not present');
            }
                });
        
          } else {
              console.log('priceable items are not there to click');

          }
    });
        
  });
});