var testdata = require('../inputs/testdata/sharedratesdetailpage.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {
        browser.sleep(2000);

      it('sharedrates detail page', function() {
      var firstrate = element(by.xpath("//ecb-shared-pricelist/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[2]/span/a"));
      firstrate.isPresent().then(function (result){
         if(result){ 
           firstrate.click();
           browser.sleep(6000);
          var detailpage = element(by.xpath("//ecb-breadcrumb/div[3]/h1"));
          detailpage.isPresent().then(function (result){
         if(result){ 
          expect(element(by.xpath("//ecb-breadcrumb/div[3]/h1")).getText()).toEqual(testdata.headinginratelistdetailpage);
        
         } else {
         console.log('It is not redirected to the ratelist detail page');
         }
          });
         } else {
           console.log('table is not there');
         }
      });
    });
      it('sharedrates detail page  properties widget', function() {
     var heading = element(by.xpath("//h2[contains(text(),'Properties')]"));
         heading.isPresent().then(function (result){
         if(result){
             var properties =  element(by.xpath("//ecb-spproperties/div[2]/div[2]/form/div/div[1]/label"));
             properties.isPresent().then(function (result){
         if(result){
          var editicon = element(by.xpath("//ecb-spproperties/div[2]/div[1]/div/div/a"));
          editicon.isPresent().then(function (result){
         if(result){
          editicon.click();
          browser.sleep(3000);
           var slide = element(by.xpath("//ecb-spproperties/div[1]/ngx-aside/aside/section/div/div/div/div/h3"));
           slide.isPresent().then(function (result){
         if(result){
                  browser.actions().mouseMove(element(by.xpath("//ecb-spproperties/div[1]/ngx-aside/aside/section/div/div/div/div/h3"))).perform();
                  browser.sleep(3000);

                  // cancel clicking 
                  element(by.xpath("//ecb-spproperties/div[1]/ngx-aside/aside/section/div/div/div/div/div/button[2]")).click();
                  browser.sleep(3000);
                  editicon.click();
          browser.sleep(3000);
          browser.actions().mouseMove(element(by.xpath("//ecb-spproperties/div[1]/ngx-aside/aside/section/div/div/div/div/h3"))).perform();
                  browser.sleep(3000);
          element(by.xpath("//ecb-spproperties/div[1]/ngx-aside/aside/section/div/div/form/div/div[2]/textarea")).click();
          browser.sleep(1000);
               element(by.xpath("//ecb-spproperties/div[1]/ngx-aside/aside/section/div/div/form/div/div[2]/textarea")).clear();
               element(by.xpath("//ecb-spproperties/div[1]/ngx-aside/aside/section/div/div/form/div/div[2]/textarea")).sendKeys(testdata.description);
               browser.sleep(1000);
                element(by.xpath("//ecb-spproperties/div[1]/ngx-aside/aside/section/div/div/div/div/div/button[2]")).click();
                  browser.sleep(3000);
                  var cancelwithoutsave = element(by.xpath("//ecb-spproperties/div[1]/ngx-aside/aside/section/div/ecb-modal-dialog/div/div/div/div[1]/div[2]/div[1]/dialog-header"));
                  cancelwithoutsave.isPresent().then(function (result){
         if(result){
           browser.actions().mouseMove(element(by.xpath("//ecb-spproperties/div[1]/ngx-aside/aside/section/div/ecb-modal-dialog/div/div/div/div[1]/div[2]/div[1]/dialog-header"))).perform();
           browser.sleep(2000);
           // cancel without save
           element(by.xpath("//ecb-spproperties/div[1]/ngx-aside/aside/section/div/ecb-modal-dialog/div/div/div/div[2]/div/button[1]")).click();
           browser.sleep(3000);
             editicon.click();
          browser.sleep(3000);
          browser.actions().mouseMove(element(by.xpath("//ecb-spproperties/div[1]/ngx-aside/aside/section/div/div/div/div/h3"))).perform();
                  browser.sleep(3000);
          element(by.xpath("//ecb-spproperties/div[1]/ngx-aside/aside/section/div/div/form/div/div[2]/textarea")).click();
          browser.sleep(1000);
               element(by.xpath("//ecb-spproperties/div[1]/ngx-aside/aside/section/div/div/form/div/div[2]/textarea")).clear();
               element(by.xpath("//ecb-spproperties/div[1]/ngx-aside/aside/section/div/div/form/div/div[2]/textarea")).sendKeys(testdata.description);
               browser.sleep(1000);
                element(by.xpath("//ecb-spproperties/div[1]/ngx-aside/aside/section/div/div/div/div/div/button[2]")).click();
                  browser.sleep(3000);
                   browser.actions().mouseMove(element(by.xpath("//ecb-spproperties/div[1]/ngx-aside/aside/section/div/ecb-modal-dialog/div/div/div/div[1]/div[2]/div[1]/dialog-header"))).perform();
           browser.sleep(2000);
           // return
           element(by.xpath("//ecb-spproperties/div[1]/ngx-aside/aside/section/div/ecb-modal-dialog/div/div/div/div[2]/div/button[2]")).click();
           browser.sleep(2000);
            // save 
               element(by.xpath("//ecb-spproperties/div[1]/ngx-aside/aside/section/div/div/div/div/div/button[1]")).click();
               browser.sleep(4000);
         } else {
             console.log('cancel without save popup not came while canceling properties widget in shared rates');
         }
                  });
              
         } else {
             console.log('editpopup is not coming when we edit properties in shared rates');
         }
           });

         } else {
           console.log('edit icon is not present in properties widget in shared rates detail page');
         }
          });
         } else {
          console.log('properties are not present in properties widget');
         }
             });
          }
         else {
          console.log('properties widget  heading is not there');
         }
         });


      });
      it('sharedrates detail page  in use widget', function() {
     var inuseheading = element(by.xpath("//h2[contains(text(),'In-Use')]"));
         inuseheading.isPresent().then(function (result){
         if(result){
            browser.sleep(1000);
            var inuse = element(by.xpath("//ecb-inuse/div/div/div[2]/div/div[1]/label"));
            inuse.isPresent().then(function (result){
         if(result){
          
         } else {
            console.log(' In In-use widget data is not populating');
         }
            });
           

          }
         else {
          console.log('inuse widget heading  is not there');
         }
         });


      });
});