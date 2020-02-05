var testdata = require('../inputs/testdata/sharedratesratetables.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {

      it('sharedrates rate table  widget', function() {
          
          browser.sleep(3000);
      var ratetablesheading = element(by.xpath("//h2[contains(text(),'Rate Tables')]"));
       ratetablesheading.isPresent().then(function (result) {
      if (result) {
         var norecords = element(by.xpath("//strong[contains(text(),'No Records')]"));
         norecords.isPresent().then(function (result){
           if (result) {
           browser.sleep(2000);
           var addlink = element(by.xpath("//a[contains(text(),'Add Rate Table')]"));
         addlink.isPresent().then(function (result){
          if (result) {
            addlink.click();
            browser.sleep(4000);
            var addpopup = element(by.xpath("//span[contains(text(),'Add Rate Table')]"));
             addpopup.isPresent().then(function (result){
          if (result) {
            browser.actions().mouseMove(element(by.xpath("//span[contains(text(),'Add Rate Table')]"))).perform();
            browser.sleep(3000);
            expect(element(by.xpath("//span[contains(text(),'Rate Table List')]")).isDisplayed()).toBe(true);
            //clicking cancel
            element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[1]/dialog-header-template/div/h2/button[1]")).click();
            browser.sleep(3000);
            // again clicking on add rate table
             addlink.click();
            browser.sleep(4000);
            browser.actions().mouseMove(element(by.xpath("//span[contains(text(),'Add Rate Table')]"))).perform();
            browser.sleep(2000);
            var table = element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]"));
            table.isPresent().then(function (result){
          if (result) {
              var secondratetable = element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-body-template/div/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[2]/td[2]/span"));
              secondratetable.isPresent().then(function (result) {
               if (result) {
                   //filtering
                element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]")).click();
                browser.sleep(2000);
                element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]")).click();
                browser.sleep(2000);
                // sorting
                element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div[1]/input")).click();
                browser.sleep(1000);
                element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div[1]/input")).clear();
                element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div[1]/input")).sendKeys(testdata.serachname);
                browser.sleep(3000);
                element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div[2]/div/em")).click();
                browser.sleep(4000);
                // charge type selection
                browser.actions().mouseMove(element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[4]/p-dropdown/div/label"))).perform();
                browser.sleep(2000);
                element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[4]/p-dropdown/div/div[3]/span")).click();
                browser.sleep(3000);
                 element(by.xpath("//body[@id='mainBody']/div/div/ul/li[2]/span")).click();
                browser.sleep(3000);
                browser.actions().mouseMove(element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[4]/p-dropdown/div/label"))).perform();
                browser.sleep(2000);
                element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[4]/p-dropdown/div/div[3]/span")).click();
                browser.sleep(3000);
                element(by.xpath("//body[@id='mainBody']/div/div/ul/li[1]/span")).click();
                browser.sleep(3000);

                // selection of checkboxes
                element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-body-template/div/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/div/input")).click();
                browser.sleep(1000);
                // clicking on cancel- cancelwithoutsave
                element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[1]/dialog-header-template/div/h2/button[1]")).click();
            browser.sleep(3000);
            // cancel popup
            var popup1 = element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]"));
            popup1.isPresent().then(function (result) {
               if (result) {
                browser.actions().mouseMove(element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]"))).perform();
                browser.sleep(2000);
                // clicking on cancel-withoutsave
                element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]")).click();
                browser.sleep(2000);
               
               } else {
               console.log('popup not came while clicking on cancel in add rate table link');
               }
            });
             // again clicking on add rate table
             addlink.click();
            browser.sleep(4000);
            browser.actions().mouseMove(element(by.xpath("//span[contains(text(),'Add Rate Table')]"))).perform();
            browser.sleep(2000);
             // selection of checkboxes
                element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-body-template/div/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/div/input")).click();
                browser.sleep(1000);
                 // clicking on cancel- return
                element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[1]/dialog-header-template/div/h2/button[1]")).click();
            browser.sleep(3000);
            // cancel popup
            var popup2 = element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]"));
            popup2.isPresent().then(function (result) {
               if (result) {
                browser.actions().mouseMove(element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]"))).perform();
                browser.sleep(2000);
                // clicking on return
                element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[2]")).click();
                browser.sleep(2000);
               
               } else {
               console.log('popup not came while clicking on cancel in add rate table link');
               }
            });
                // add
                 element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[1]/dialog-header-template/div/h2/button[2]")).click();
            browser.sleep(5000);
             

              }
              else {
               console.log('second row is not present in the add rate table popup so no need of sorting and filtering');
              }
          });
          } else {
              console.log('table is not present to sort and filter in shared ratelist add rate table popup');
          }
            });
          } else {  
             console.log('add rate table popup not came');
          }
             });

         } else {
           console.log('add rate table link is not there');
         }
           });
           } else {
           console.log('no records text is not there may be there are rate tables');
           // rate tables are there scenario

           }
         });
      } else {
      console.log('rate tables heading is not there in shared rates detail page');
      }
       });
     
      });
   it('sharedrates leftside table  widget', function() {
   
   var ratetableleft = element(by.xpath("//ecb-ratelist-mappings/div/div/div/p-tree/div/ul/p-treenode/li/div/span[2]/span/div/span[1]"));
   ratetableleft.isPresent().then(function (result) {
               if (result) {

           var ratetablelink = element(by.xpath("//span[@class='ecb-addRateTableLink'][1]/a"));
            ratetablelink.isPresent().then(function (result) {
               if (result) {
                ratetablelink.click();
                browser.sleep(4000);
    var addrates = element(by.xpath("//span[contains(text(),'Add Rate Table')]"));
    addrates.isPresent().then(function (result) {
               if (result) {
           browser.actions().mouseMove(element(by.xpath("//span[contains(text(),'Add Rate Table')]"))).perform();
           browser.sleep(3000);
           expect(element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[1]/dialog-header-template/div/h3")).getText()).toEqual(testdata.ratetablelistheading);
                //cancel clicking
                element(by.xpath("// ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[1]/dialog-header-template/div/h2/button[1]")).click();
                browser.sleep(3000);
                  ratetablelink.click();
                browser.sleep(4000);
                 browser.actions().mouseMove(element(by.xpath("//span[contains(text(),'Add Rate Table')]"))).perform();
           browser.sleep(3000);
           // sorting and filtering
        var table = element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div[1]/input"));
        table.isPresent().then(function (result) {
               if (result) {
            element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div[1]/input")).click();
            browser.sleep(2000);
             element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div[1]/input")).sendKeys(testdata.usersearch);
               
            browser.sleep(3000);
            element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/div[2]/div/em")).click();
            browser.sleep(2000);
            // sorting
            element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]")).click();
            browser.sleep(1000);
            element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span[2]")).click();
            browser.sleep(1000);
            // charge type
            browser.actions().mouseMove(element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[4]/p-dropdown/div/label"))).perform();
            browser.sleep(2000);
            element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[4]/p-dropdown/div/div[3]/span")).click();
            browser.sleep(3000);
            element(by.xpath("//body[@id='mainBody']/div[2]/div/ul/li[2]/span")).click();
            browser.sleep(3000);
        browser.actions().mouseMove(element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[4]/p-dropdown/div/label"))).perform();
            browser.sleep(2000);
            element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-body-template/div/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[4]/p-dropdown/div/div[3]/span")).click();
            browser.sleep(3000);
            element(by.xpath("//body[@id='mainBody']/div[2]/div/ul/li[1]/span")).click();
            browser.sleep(3000);
            // selection of rate table from list
            var input = element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[2]/dialog-body-template/div/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/div/input"));
            input.isPresent().then(function (result) {
               if (result) {
           input.click();
           browser.sleep(1000);
            element(by.xpath("// ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[1]/dialog-header-template/div/h2/button[1]")).click();
                browser.sleep(3000);
                // cancel without save
                var popup = element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]"));
                popup.isPresent().then(function (result) {
               if (result) {
                browser.actions().mouseMove(element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]"))).perform();
                element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]")).click();
                browser.sleep(2000);
               } else {
                  console.log('cancel without save popup not came to cancel');
               }
                });
                  ratetablelink.click();
                browser.sleep(4000);
                 browser.actions().mouseMove(element(by.xpath("//span[contains(text(),'Add Rate Table')]"))).perform();
           browser.sleep(3000);
            input.click();
           browser.sleep(1000);
            element(by.xpath("// ecb-ratelist-addratetable/ecb-modal-dialog[1]/div/div/div/div/div[1]/dialog-header-template/div/h2/button[1]")).click();
                browser.sleep(3000);
                // return
                var popup = element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]"));
                popup.isPresent().then(function (result) {
               if (result) {
             browser.actions().mouseMove(element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[1]"))).perform();
                element(by.xpath("//ecb-ratelist-addratetable/ecb-modal-dialog[2]/div/div/div/div[2]/div/button[2]")).click();
                browser.sleep(2000);
               } else {
                 console.log('cancel without save popup not came to return');
               }
                });
              // save

               } else {
                   console.log('rows are not present to add rate tables from the rate table list popup');
               }
            });

        } else {
              console.log('table is not present in the add rate table list popup');
               }
        });
            } else {
              console.log('add rate table popup not came');
               }
    });
               } else {
                console.log('ratetable link is not there');
               }
            });
               } else {
              console.log('rate tables are not added on the left side');
               }
   });

     
});

});