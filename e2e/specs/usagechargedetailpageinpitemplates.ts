var testdata = require('../inputs/testdata/usagechargedetailpageinpitemplates.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {
    it('pitemplates usagecharges detail page ', function() {
       browser.sleep(4000);

        var items;
         var startCounttables;
         var startCountadjustments;

      
                var heading = element(by.xpath("//ecb-breadcrumb/div[3]/h1"));
                heading.isPresent().then (function (result) {
            if (result) {
                 expect(element(by.xpath("//ecb-breadcrumb/div[3]/h1")).getText()).toEqual(testdata.usageheading);
                 browser.sleep(2000);
                

                // adjustments
                  var adjustmentsheading = element(by.xpath("//ecb-priceableitem-adjustments/div[1]/div/h2"));
                adjustmentsheading.isPresent().then (function (result) {
            if (result) {
                var adjustments = element(by.xpath("//div[@class='ecb-displayAdjName']"));
                adjustments.isPresent().then (function (result) {
            if (result) {
               items =element.all(by.xpath("//div[@class='ecb-displayAdjName']"));
      
      startCountadjustments = items.count();
      console.log(startCountadjustments);
       browser.sleep(3000);

       
            } else {
                console.log('adjustments are not present in usage charges detail page in pi templates');
            }
                });
                var view = element(by.xpath("//a[contains(text(),'View')]"));
                view.isPresent().then (function (result) {
            if (result) {
              view.click();
              browser.sleep(4000);
              var viewpopup = element(by.xpath("//h3[contains(text(),'Edit Adjustments')]"));
               viewpopup.isPresent().then (function (result) {
            if (result) {
              browser.actions().mouseMove(element(by.xpath("//h3[contains(text(),'Edit Adjustments')]"))).perform();
             browser.sleep(3000);
             // close clicking
             element(by.xpath("//ecb-priceableitem-adjustments/ngx-aside/aside/section/div/div/div[1]/div/div/button/span")).click();
             browser.sleep(4000);
            } else {
                console.log('view panel not came on clicking view icon of adjustment reasons of usage charges template');
            }
               });
            } else {
               console.log('view icon is not there to click in the adjustment reasons of usage charges template');
            }
                });


            } else {
                console.log('adjustments heading not present in pi templates detail page');
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
                  element(by.xpath("//input[@id='initFocus']")).click();
                  element(by.xpath("//input[@id='initFocus']")).sendKeys(testdata.glcodeinput);
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
                  element(by.xpath('//input[@id="initFocus"]')).click();
                  element(by.xpath('//input[@id="initFocus"]')).sendKeys(testdata.glcodeinput);
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

                 // child pi's
         
                 var childpi = element(by.xpath("//ecb-card-controller/h2"));
                 childpi.isPresent().then(function (result) {
                   if (result) {
                     console.log('child pis heading is present');
                 browser.actions().mouseMove(element(by.xpath("//ecb-card-controller/h2"))).perform();
                 browser.sleep(3000);
                     var card = element(by.xpath("//div[@class='ecbClickableCard-heading']"));
                     card.isPresent().then(function (result) {
                   if (result) {
                     console.log('pis are present to click');
                     card.click();
                     browser.sleep(6000);

                     var extpropertiesheading = element(by.xpath("//h2[contains(text(),'Extended Properties')]"));
                     extpropertiesheading.isPresent().then (function (result) {
                 if (result) {
                    console.log('child pi page from usage pi template page');
                    browser.navigate().back();
                    browser.sleep(5000);
                    browser.navigate().back();
                    browser.sleep(5000);
                 } else {
                  console.log('it is not directed to child pi page from usage charge pi template page');
                  browser.navigate().back();
                  browser.sleep(5000);
                 }
                });
                     
              } else {
                console.log('child pis are absent');
             }
               });
             } else {
               console.log('child pi heading is absent');
             }
           });

              
                 } else {
              console.log('pi templates detail page heading is not there');
            }
                });
           

        

    });
});