var testdata = require('../inputs/testdata/deletepi-pitemplatesgridandetailspage.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {
    it('delete pi pi templates grid page', function() {
        
    browser.sleep(5000);

    var deleteicon = element(by.xpath("//em[@class='fa fa-times-circle fa-lg'][1]"));
    deleteicon.isPresent().then (function(result) {
        if(result) {

       element(by.xpath("//em[@class='fa fa-times-circle fa-lg'][1]")).click();
       browser.sleep(5000);

  
       var deletepopup = element(by.xpath("//ecb-priceableitem-template/ecb-modal-dialog[1]/div/div/div/div[1]/div[2]/div[1]/dialog-header"));
        deletepopup.isPresent().then (function(result) {
        if(result) {
         browser.actions().mouseMove(element(by.xpath("//ecb-priceableitem-template/ecb-modal-dialog[1]/div/div/div/div[1]/div[2]/div[1]/dialog-header"))).perform();
        
         browser.sleep(5000);
        
        element(by.xpath("//ecb-priceableitem-template/ecb-modal-dialog[2]/div/div/div/div[1]/div[1]/button/span[1]")).click();
        browser.sleep(5000);
        } else {
           console.log('deletepopup not came when we click on delete icon in pi grid page');
        }
        });


        } else {
           console.log('delete icons are in disabled state cannot delete any pi');
        }
    });

});

});
