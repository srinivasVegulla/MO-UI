var testdata = require('../inputs/testdata/deletepi-pitemplatesgridandetailspage.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {

     it('delete pi pi templates detailspage', function() {
       browser.sleep(5000);

       var deleteicontext = element(by.xpath("//body[@id='mainBody']/app-root/welcome/div[2]/div[2]/ecb-contextbar/div/div/div/div[2]/div/button"));
       deleteicontext.isPresent().then (function (result) {
           if(result) {
          browser.sleep(2000);
          var deletebutton = element(by.xpath("//body[@id='mainBody']/app-root/welcome/div[2]/div[2]/ecb-contextbar/div/div/div/div[2]/div/button"));
          deletebutton.isPresent().then (function (result) {
           if(result) {
            browser.sleep(3000);
            element(by.xpath("//body[@id='mainBody']/app-root/welcome/div[2]/div[2]/ecb-contextbar/div/div/div/div[2]/div/button")).click();
         browser.sleep(3000);
           var deletepopup = element(by.xpath("//ecb-contextbar/ecb-modal-dialog[1]/div/div/div/div[1]/div[2]/div[1]/dialog-header"));
           deletepopup.isPresent().then (function (result) {
           if(result) {
          browser.sleep(3000);
            var widget= element(by.xpath("//ecb-contextbar/ecb-modal-dialog[1]/div/div/div/div[1]/div[2]/div[1]/dialog-header"));
     
            browser.executeScript('arguments[0].scrollIntoView()',widget.getWebElement());
            
              browser.sleep(4000);
             
             // close icon

             element(by.xpath("//ecb-contextbar/ecb-modal-dialog[4]/div/div/div/div[1]/div[1]/button/span[1]")).click();
             browser.sleep(5000);

           } else {
            console.log('deletepopup not came in pi templates grid');
           }
           });
           } else {
             console.log('delete icon is not there to click in pi templates detail page');
           }
          });

           } else {
             console.log('delete icon text  is not there to click in pi templates detail page');
           }
       });

});

});