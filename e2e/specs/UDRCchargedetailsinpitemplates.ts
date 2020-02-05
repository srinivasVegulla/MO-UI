var testdata = require('../inputs/testdata/UDRCchargedetailsinpitemplates.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {
    it('pitemplates udrc charges detail page ', function() {
    browser.sleep(5000);
        var items;
        var startCounttables;

                var heading = element(by.xpath("//ecb-breadcrumb/div[3]/h1"));
                heading.isPresent().then (function (result) {
            if (result) {
                 expect(element(by.xpath("//ecb-breadcrumb/div[3]/h1")).getText()).toEqual(testdata.udrcheading); 
                 browser.sleep(2000);
                // billing details 
                var billingheading = element(by.xpath("//h2[contains(text(),'Billing')]"));
                billingheading.isPresent().then (function (result) {
            if (result) {
            var billingdetails = element(by.xpath("//ecb-pi-billing/div[1]/div[2]/div/form/div[1]/label"));
             billingdetails.isPresent().then (function (result) {
            if (result) {
          var editicon = element(by.xpath("//ecb-pi-billing/div[1]/div[1]/div/a"));
           editicon.isPresent().then (function (result) {
            if (result) {
           editicon.click();
           browser.sleep(3000);
           var editpanel = element(by.xpath("//ecb-pi-billing/ngx-aside/aside/section/div/div/div[1]/div/h3"));
           editpanel.isPresent().then (function (result) {
            if (result) {
            browser.actions().mouseMove(element(by.xpath("//ecb-pi-billing/ngx-aside/aside/section/div/div/div[1]/div/h3"))).perform();
            browser.sleep(3000);
            expect(element(by.xpath("//div[@class='ebNotification ebNotification_color_paleBlue ecb-marginbottom']/div/span")).getText()).toEqual(testdata.existingpistext);
           // in-useofferings link
              var link = element(by.xpath("//a[contains(text(),'existing Priceable Item Instances')]"));
           link.isPresent().then (function (result) {
            if (result) {
            element(by.xpath("//a[contains(text(),'existing Priceable Item Instances')]")).click();
            browser.sleep(4000);
            var offeringspopup = element(by.xpath("//ecb-pi-billing/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[1]/h2"));
             offeringspopup.isPresent().then (function (result) {
            if (result) {
            browser.actions().mouseMove(element(by.xpath("//ecb-pi-billing/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[1]/h2"))).perform();
            browser.sleep(3000);
            expect(element(by.xpath("//ecb-pi-billing/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[1]/h2")).getText()).toEqual(testdata.offeringspopupheading);
              var second = element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[2]/td[2]/span/span"));
                 second.isPresent().then(function(result) {
             if (result) {                       
           // filtering
           element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]")).click();
           browser.sleep(2000);
           element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]")).click();
           browser.sleep(1000);
           // sorting
           element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input")).click();
           element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/input")).sendKeys(testdata.searchinuseoffering);
           browser.sleep(2000);
           element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div/div/div/em")).click();
           browser.sleep(2000);
           
          browser.actions().mouseMove(element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[1]/p-dropdown/div/label"))).perform();
          browser.sleep(2000);
          element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[1]/p-dropdown/div/div[3]/span")).click();
          browser.sleep(2000);
          element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[1]/p-dropdown/div/div[4]/div/ul/li[2]/span")).click();
          browser.sleep(3000);

          // clicking cross icon
          element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[1]/button/span[1]")).click();
          browser.sleep(3000);
             } else {
                console.log('second row is not present nop need to sort and filter');
                 browser.sleep(1000);
                // clicking cross icon
          element(by.xpath("//ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[1]/button/span[1]")).click();
          browser.sleep(3000);
             }
                 });
            } else {
             console.log('in-use offerings popup not came in billing details');
            }
             });
            } else {
            console.log('in-use offerings link is not there in billing details');
            }
           });

           // editing

            var editing = element(by.xpath("//button[@id='dropdownMenu1']/span"));
            editing.isPresent().then (function (result) {
            if (result) {
             element(by.xpath("//ecb-pi-billing/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]")).click();
             browser.sleep(3000);
              editicon.click();
           browser.sleep(3000);
            browser.actions().mouseMove(element(by.xpath("//ecb-pi-billing/ngx-aside/aside/section/div/div/div[1]/div/h3"))).perform();
            browser.sleep(3000);
            editing.click();
            browser.sleep(3000);
            var spantext = element(by.xpath("//span[contains(text(),'Monthly')]"));
            spantext.isPresent().then (function (result) {
            if (result) {
            element(by.xpath("//span[contains(text(),'Monthly')]")).click();
            // cancel clicking
             element(by.xpath("//ecb-pi-billing/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]")).click();
             browser.sleep(3000);
             var cancelpopup = element(by.xpath("//ecb-pi-billing/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"));
             cancelpopup.isPresent().then (function (result) {
            if (result) {
            browser.actions().mouseMove(element(by.xpath("//ecb-pi-billing/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
            browser.sleep(3000);
            element(by.xpath("//ecb-pi-billing/ecb-modal-dialog/div/div/div/div[2]/div/button[1]")).click();
            browser.sleep(4000);
              editicon.click();
           browser.sleep(3000);
            browser.actions().mouseMove(element(by.xpath("//ecb-pi-billing/ngx-aside/aside/section/div/div/div[1]/div/h3"))).perform();
            browser.sleep(3000);
            editing.click();
            browser.sleep(3000);
            element(by.xpath("//span[contains(text(),'Monthly')]")).click();
             // cancel clicking
             element(by.xpath("//ecb-pi-billing/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]")).click();
             browser.sleep(3000);
             var returnpopup = element(by.xpath("//ecb-pi-billing/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"));
             returnpopup.isPresent().then (function (result) {
            if (result) {
            browser.actions().mouseMove(element(by.xpath("//ecb-pi-billing/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
            browser.sleep(3000);
            element(by.xpath("//ecb-pi-billing/ecb-modal-dialog/div/div/div/div[2]/div/button[2]")).click();
            browser.sleep(4000);
             browser.actions().mouseMove(element(by.xpath("//ecb-pi-billing/ngx-aside/aside/section/div/div/div[1]/div/h3"))).perform();
            browser.sleep(3000);
            // save clicking
            element(by.xpath("//ecb-pi-billing/ngx-aside/aside/section/div/div/div[1]/div/div/button[1]")).click();
            browser.sleep(3000);
            } else {
             console.log('cancelwithoutsave popup not came while canceling billing details edits');
            }
             });
            } else {
              console.log('cancelwithoutsave popup not came while canceling billing details edits');
            }
             });
            } else {
             console.log('recurring period monthly text is not there to select');
             // clicking cancel
              element(by.xpath("//ecb-pi-billing/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]")).click();
             browser.sleep(3000);
            }
             });
            } else {
             element(by.xpath("//ecb-pi-billing/ngx-aside/aside/section/div/div/div[1]/div/div/button[2]")).click();
             browser.sleep(3000);
            }
            });
            } else {
               console.log('edit panel not came when we click on edit icon of billing details');
            }
           });

            } else {
              console.log('edit icon is not there for billing details ');
            }
           });
            } else {
             console.log('billing details are not there');
            }
             });
            } else {
             console.log('billing details heading is not there');
            }
                });

                  // properties
                  var propertiesheading = element(by.xpath("//h2[contains(text(),'Properties')]"));
                  propertiesheading.isPresent().then (function (result) {
              if (result) {
                  var properties = element(by.xpath("//ecb-piproperties/div[1]/div[2]/div/form/div[1]/label"));
                  properties.isPresent().then (function (result) {
              if (result) {
                 var editiconprop = element(by.xpath("//ecb-piproperties/div[1]/div[1]/div/a"));
                   editiconprop.isPresent().then (function (result) {
              if (result) {
                   editiconprop.click();
                   browser.sleep(3000);
                   var popup = element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/div[1]/div/h3"));
                    popup.isPresent().then (function (result) {
              if (result) {
                  browser.actions().mouseMove(element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/div[1]/div/h3"))).perform();
                  browser.sleep(3000);
                  var text = element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/div[2]/div/span"));
                   text.isPresent().then (function (result) {
              if (result) {
                browser.actions().mouseMove(element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/div[2]/div/span"))).perform();
                expect(element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/div[2]/div/span")).getText()).toEqual(testdata.text);
                browser.sleep(1000);
              } else {
                console.log('In one time charges pi templates properties widget  blue colour text is not present ');
              }
                   });
                  // cancel clicking
                  element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/div[1]/div/div/button[2]")).click();
                  browser.sleep(3000);
                   editiconprop.click();
                    browser.sleep(3000);
                       browser.actions().mouseMove(element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/div[1]/div/h3"))).perform();
                  browser.sleep(3000);
                  element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/form/div[2]/div/input")).click();
                  element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/form/div[2]/div/input")).sendKeys(testdata.displayname);
                  browser.sleep(2000);
                  //cancel clicking
                  element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/div[1]/div/div/button[2]")).click();
                  var cancelpopup = element(by.xpath("//ecb-piproperties/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"));
                    popup.isPresent().then (function (result) {
              if (result) {
                   browser.actions().mouseMove(element(by.xpath("//ecb-piproperties/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
                   browser.sleep(3000);
                    element(by.xpath("//ecb-piproperties/ecb-modal-dialog/div/div/div/div[2]/div/button[1]")).click();
                  browser.sleep(3000);
                     editiconprop.click();
                    browser.sleep(3000);
                       browser.actions().mouseMove(element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/div[1]/div/h3"))).perform();
                  browser.sleep(3000);
                  element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/form/div[2]/div/input")).click();
                  element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/form/div[2]/div/input")).sendKeys(testdata.displayname);
                  browser.sleep(2000);
  
                  //cancel clicking
                  element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/div[1]/div/div/button[2]")).click();
                  var returnpopup = element(by.xpath("//ecb-piproperties/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"));
                    returnpopup.isPresent().then (function (result) {
              if (result) {
                   browser.actions().mouseMove(element(by.xpath("//ecb-piproperties/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
                   browser.sleep(3000);
                    element(by.xpath("//ecb-piproperties/ecb-modal-dialog/div/div/div/div[2]/div/button[2]")).click();
                  browser.sleep(4000);
  
  
                 browser.actions().mouseMove(element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/div[1]/div/h3"))).perform();
                   browser.sleep(4000);
  
                 // save clicking
                   element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/div[1]/div/div/button[1]")).click();
                   browser.sleep(3000);
                   
                 var error = element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[2]/p"));
                   error.isPresent().then (function (result) {
              if (result) {
                   browser.actions().mouseMove(element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[2]/p"))).perform();
                   browser.sleep(3000);
                    element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[2]/button/span[1]")).click();
                  browser.sleep(3000);
  
               // cancel clicking- without save
               element(by.xpath("//ecb-piproperties/div[1]/ngx-aside/aside/section/div/div/div[1]/div[1]/div/div/button[2]")).click();
               browser.sleep(3000);
                 var cancelpopup = element(by.xpath("//ecb-piproperties/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"));
                    popup.isPresent().then (function (result) {
              if (result) {
                   browser.actions().mouseMove(element(by.xpath("//ecb-piproperties/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
                   browser.sleep(3000);
                    element(by.xpath("//ecb-piproperties/ecb-modal-dialog/div/div/div/div[2]/div/button[1]")).click();
                  browser.sleep(3000);
              } else {
                    console.log('cancel without save popup is not came while canceling properties of one time charges in pi templates');
              }
                    });
              } else {
                   console.log('error is not present while saving properties in one time charges of pi templates');
              }
                   });
              } else {
                     console.log('return popup not came while canceling properties of one time charges in pi templates');
              }
                    });
              } else {
                  console.log('cancel without save popup is not came while canceling properties of one time charges in pi templates');
              }
                    });
  
              } else {
                 console.log('edit properties panel not came for onetime charges in pi templates');
              }
                    });
              } else {
                  console.log('edit icon is not there in properties widget in one time charges-pitemplates');
              }
                  });
  
              } else {
                  console.log('properties are not there under properties in pi template detail page');
              }
                  });
                  } else {
                 console.log('properties widget heading is not present in pi templates detail page');
              }
                  });
             
              // extended properties
                var extpropertiesheading = element(by.xpath("//h2[contains(text(),'Extended Properties')]"));
                  extpropertiesheading.isPresent().then (function (result) {
              if (result) {
                  var extproperties = element(by.xpath("//ecb-extended-properties/div/div[1]/div[2]/form/div[1]/div/label"));
                  extproperties.isPresent().then (function (result) {
              if (result) {    
                  var editiconext = element(by.xpath("//ecb-extended-properties/div/div[1]/div[1]/div/div/div/a"));
                   editiconext.isPresent().then (function (result) {
              if (result) {
                   editiconext.click();
                   browser.sleep(3000);
                   var popup = element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[1]/div/div/h2"));
                    popup.isPresent().then (function (result) {
              if (result) {
                  browser.actions().mouseMove(element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[1]/div/div/h2"))).perform();
                  browser.sleep(4000);
                  var exttext = element(by.xpath("//span[contains(text(),'Changes to these values will impact all new and')]"));
                  exttext.isPresent().then (function (result) {
              if (result) {
                   browser.sleep(4000);
                var link = element(by.xpath("//span[contains(text(),'existing Priceable Item Instances')]"));
                link.isPresent().then (function (result) {
              if (result) {
                  link.click();
                  browser.sleep(3000);
                  var popup = element(by.xpath("//h3[contains(text(),'Offerings List')]"));
                   popup.isPresent().then (function (result) {
              if (result) {
                  browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Offerings List')]"))).perform();
                  browser.sleep(3000);
                  var sorting = element(by.xpath("//ecb-extended-properties/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[2]/dialog-body-template/div[3]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]"));
                  sorting.isPresent().then (function (result) {
              if (result) {
                sorting.click();
                browser.sleep(2000);
                sorting.click();
                browser.sleep(2000);
           // cross icon
                element(by.xpath("//ecb-extended-properties/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[1]/button/span[1]")).click();
                browser.sleep(3000);
       } else {
               console.log('sorting button is not present in extended properties of one time charges pi templates');
               // cross icon
               element(by.xpath("//ecb-extended-properties/ecb-inuse-offerings-modal-dialog/ecb-modal-dialog/div/div/div/div/div[1]/button/span[1]")).click();
               browser.sleep(3000);
              }
                   });
              } else {
                   console.log('offering list popup not came');
              }
                });
              } else {
                   console.log('link is not present');
              }
                  });
              } else {
                     console.log('text is not present');  
              }
                  });
                  browser.actions().mouseMove(element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[1]/div/div/h2"))).perform();
                  browser.sleep(3000);
                  element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[2]/form/div[1]/div/input")).click();
                  element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[2]/form/div[1]/div/input")).sendKeys(testdata.glcodeinput);
                  browser.sleep(2000);
                  //cancel clicking
                  element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[2]")).click();
                  var cancelpopup = element(by.xpath("//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"));
                    popup.isPresent().then (function (result) {
              if (result) {
                   browser.actions().mouseMove(element(by.xpath("//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
                   browser.sleep(3000);
                    element(by.xpath("//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]")).click();
                  browser.sleep(3000);
                  element(by.xpath("//ecb-extended-properties/div/div[1]/div[1]/div/div/div/a")).click();
                    browser.sleep(3000);
                       browser.actions().mouseMove(element(by.xpath("//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[1]/div/div/h2"))).perform();
                  browser.sleep(3000);
                  element(by.xpath('//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[2]/form/div[1]/div/input')).click();
                  element(by.xpath('//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[2]/form/div[1]/div/input')).sendKeys(testdata.glcodeinput);
                  browser.sleep(3000);
                  // cancel clicking 
                  element(by.xpath('//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[2]')).click();
                  var returnpopup = element(by.xpath('//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]'));
                    returnpopup.isPresent().then (function (result) {
              if (result) {
                   browser.actions().mouseMove(element(by.xpath('//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]'))).perform();
                   browser.sleep(3000);
                    element(by.xpath('//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[2]')).click();
                  browser.sleep(3000);
                 browser.actions().mouseMove(element(by.xpath('//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[1]/div/div/h2'))).perform();
                 // save clicking
                  element(by.xpath('//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[1]')).click();
                  browser.sleep(3000);
                 var error = element(by.xpath('//ecb-extended-properties/div/ngx-aside/aside/section/div/div[2]/div/p'));
                   error.isPresent().then (function (result) {
              if (result) {
                   browser.actions().mouseMove(element(by.xpath('//ecb-extended-properties/div/ngx-aside/aside/section/div/div[2]/div/p'))).perform();
                   browser.sleep(3000);
                    element(by.xpath('//ecb-extended-properties/div/ngx-aside/aside/section/div/div[2]/div/button/span[1]')).click();
                  browser.sleep(3000);
               // cancel clicking- without save
               element(by.xpath('//ecb-extended-properties/div/ngx-aside/aside/section/div/div/div[1]/div/div/div/button[2]')).click();
               browser.sleep(3000);
                 var cancelpopup = element(by.xpath('//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]'));
                    popup.isPresent().then (function (result) {
              if (result) {
                   browser.actions().mouseMove(element(by.xpath('//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]'))).perform();
                   browser.sleep(3000);
                    element(by.xpath('//ecb-extended-properties/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]')).click();
                  browser.sleep(3000);
               } else {
                    console.log('cancel without save popup is not came while canceling extendedproperties of one time charges in pi templates');
              }
                    });
              } else {
                   console.log('error is not present while saving extendedproperties in one time charges of pi templates');
              }
                   });
              } else {
                     console.log('return popup not came while canceling extendedproperties of one time charges in pi templates');
              }
                    });
              } else {
                  console.log('cancel without save popup is not came while canceling extendedproperties of one time charges in pi templates');
              }
                    });
                  
                
                  
  
              } else {
                 console.log('edit extendedproperties panel not came for onetime charges in pi templates');
              }
                    });
              } else {
                  console.log('edit icon is not there in extendedproperties widget in one time charges-pitemplates');
              }
                  });
  
  
              } else {
                  console.log('extendedproperties are not there under properties in pi template detail page');
              }
                  });
                  } else {
                 console.log('extendedproperties widget heading is not present in pi templates detail page');
              }
                  });
  
               
               // ratetables
                 var ratetableheading =  element(by.xpath('//h2[contains(text(),"Rate Tables")]'));
                 ratetableheading.isPresent().then (function (result) {
              if (result) {
                  browser.actions().mouseMove(element(by.xpath('//h2[contains(text(),"Rate Tables")]'))).perform();
                  browser.sleep(2000);
                    var ratetablecoloumns = element(by.xpath('//span[contains(text(),"Name")]'));
                    ratetablecoloumns.isPresent().then (function (result) {
              if (result) {
                  element(by.xpath('//span[contains(text(),"Decision Name")]')).isPresent();
                  browser.sleep(2000);
                  var ratetablescount = element(by.xpath('//tr[@class="ui-datatable-even ui-widget-content"]'));
                  ratetablescount.isPresent().then (function (result) {
              if (result) {
                      items =element.all(by.xpath('//tr[@class="ui-datatable-even ui-widget-content"]'));
        
        startCounttables = items.count();
        console.log(startCounttables);
              }
              else {
                console.log('rate tables are not there');
              }
                  });
              
              } else {
                  console.log('rate table coloumns are not there');
              }
                    });
              } else {
                   console.log('ratetables heading is not present in one time charges detail page in pi templates');
              }
                 });
  

                 
      
        
          } else {
           console.log('pi  templates heading is not present ');
          }
         });

        

    });
});