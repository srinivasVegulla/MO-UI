import { browser, by, element } from 'protractor';

var testdata = require('../inputs/testdata/deletepo.json');


describe('widget', function () {
  it('deleting product offer po details page ', function () {
     
      
  
    browser.sleep(5000);
   
   
  
   var deletebutton = element(by.xpath("//div[@class='control-bar visible-md-up hidden-sm hidden-xs']/ecb-contextbar/div/div/div/div[1]/div[2]/button"));
deletebutton.isPresent().then(function (result){
              if(result){
                  deletebutton.click();
                  browser.sleep(2000);  
      var popup = element(by.xpath("//div[@class='control-bar visible-md-up hidden-sm hidden-xs']/ecb-contextbar/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]/dialog-button-1"));
      popup.isPresent().then(function (result){
          if(result){  
browser.actions().mouseMove(element(by.xpath("//div[@class='control-bar visible-md-up hidden-sm hidden-xs']/ecb-contextbar/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]/dialog-button-1"))).perform();
          element(by.xpath("//div[@class='control-bar visible-md-up hidden-sm hidden-xs']/ecb-contextbar/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[2]/dialog-button-2")).click();
          browser.sleep(3000);
          element(by.xpath("//div[@class='control-bar visible-md-up hidden-sm hidden-xs']/ecb-contextbar/div/div/div/div[1]/div[2]/button")).click();
          browser.actions().mouseMove(element(by.xpath("//div[@class='control-bar visible-md-up hidden-sm hidden-xs']/ecb-contextbar/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]/dialog-button-1"))).perform();
        
          element(by.xpath("//div[@class='control-bar visible-md-up hidden-sm hidden-xs']/ecb-contextbar/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]/dialog-button-1")).click();
          browser.sleep(6000);
          }else {
   console.log('popup is not came for delete');
     
          }
      });     
       var error = element(by.xpath("//ecb-product-offer/div[1]/div[1]/div/div/p"));
      error.isPresent().then(function (result){
          if(result){
               browser.actions().mouseMove(element(by.xpath("//ecb-product-offer/div[1]/div[1]/div/div/p"))).perform();
          browser.sleep(2000);
          element(by.xpath("//ecb-product-offer/div[1]/div[1]/div/div/span/i")).click();
          browser.sleep(3000);
          } else {
           console.log('error not came while deleting po from po details page');
          }
      });       
                  
              } else {
         console.log('delete button is not there');
         
              }
});
      
   
 
  });
});