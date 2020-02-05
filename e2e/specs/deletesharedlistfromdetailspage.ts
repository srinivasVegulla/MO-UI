var testdata = require('../inputs/testdata/deletesharedlistfromdetailspage.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {

      it('sharedratesdelete from details page widget', function() {
          browser.sleep(5000);
          var created = element(by.xpath("//ecb-sharedpricelist-details/div[1]/div/div[1]/ecb-spproperties/div[2]/div[2]/form/div/div[1]/label"));
          created.isPresent().then(function (result){
 if(result){
     console.log('shared list details page ');

     var deletebutton = element(by.xpath("//body[@id='mainBody']/app-root/welcome/div[2]/div[2]/ecb-contextbar/div/div/div/div/div/button"));
      deletebutton.isPresent().then(function (result){
 if(result){
     deletebutton.click();
        browser.sleep(3000);
        var popup = element(by.xpath("//ecb-contextbar/ecb-modal-dialog[1]/div/div/div/div[1]/div[2]/div[1]/dialog-header"));
        popup.isPresent().then(function (result){
 if(result){
     browser.actions().mouseMove(element(by.xpath("//ecb-contextbar/ecb-modal-dialog[1]/div/div/div/div[1]/div[2]/div[1]/dialog-header"))).perform();
     browser.sleep(2000);
     element(by.xpath("//ecb-contextbar/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[2]/dialog-button-2")).click();
     browser.sleep(2000); 
     deletebutton.click();
        browser.sleep(3000);
        browser.actions().mouseMove(element(by.xpath("//ecb-contextbar/ecb-modal-dialog[1]/div/div/div/div[1]/div[2]/div[1]/dialog-header"))).perform();
     browser.sleep(2000);
     element(by.xpath("//ecb-contextbar/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]/dialog-button-1")).click();
     browser.sleep(5000);
     
 } else {
    console.log('popup is not came while deleting');
 }
        });
 } else {
    console.log('delete button is not there');
 }
      });
 }
 else {
    console.log('it is not shared list details page');
 }
          });
      });
});