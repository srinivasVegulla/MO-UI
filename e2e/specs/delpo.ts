var testdata = require('../inputs/testdata/delpo.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {

  it('productoffer widget', function () {
    
      browser.sleep(5000);
    expect(element(by.xpath("//ecb-breadcrumb/div[3]/h1")).getText()).toEqual(testdata.itemsheading);
    expect(element(by.xpath("//ecb-product-offer-list/div/div[1]/h2")).getText()).toEqual(testdata.numofoffersheading);
   
    var productoffers = element(by.xpath("//ecb-product-offer-list/div/div[2]/div[2]/div/p"));
    productoffers.isPresent().then(function (result) {
      if (result) {   
        console.log('productoffers are not there');
       
      } else {
       console.log('productoffers are present');
       // checking of columns 
   expect(element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[3]/span[1]")).getText()).toEqual(testdata.name);
 expect(element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[1]/span")).getText()).toEqual(testdata.actions);
expect(element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[2]/span")).getText()).toEqual(testdata.type);
expect(element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[4]/span[1]")).getText()).toEqual(testdata.disname);
expect(element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[5]/span[1]")).getText()).toEqual(testdata.descriptn);
expect(element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[6]/span[1]")).getText()).toEqual(testdata.currency);
expect(element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[7]/span[1]")).getText()).toEqual(testdata.partition);


expect(element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[8]/span[1]")).getText()).toEqual(testdata.effstartdt);

// download functionality
  var downloaddisable = element(by.xpath("//div[@class='ebButtonCommands-placement']/a[@class='disable'][1]"));
  downloaddisable.isPresent().then(function (result) {
      if (result) {
        console.log('download is disabled');
      } else {
      var downloadiconenable = element(by.xpath("//em[@class='fa fa-download']"));
          downloadiconenable.isPresent().then(function (result) {
      if (result) {
        downloadiconenable.click();
        browser.sleep(5000);
      } else {
       console.log('download is not enabled');
      }
          });
      }
  });

// hovering text productoffer name 
var attr = element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[2]/span/div/img")).getAttribute('src');
        expect(attr).toEqual(testdata.img);
        
  browser.actions().mouseMove(element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[2]/span/div/img"))).perform();
  expect(element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[2]/span/div/div/div[1]/span")).getText()).toEqual(testdata.hovername);  
// currency and partitionname options
  // browser.actions().mouseMove(element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[6]/p-dropdown/div/label"))).perform();
  // browser.sleep(2000);
//element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[6]/p-dropdown/div/div[3]/span")).click();
   // browser.sleep(3000);
    
 //  element(by.xpath("//body[@id='mainBody']/div[1]/div/ul/li[171]/span")).click();

   
    
  browser.sleep(3000);
  // refresh functionality
  element(by.xpath("//em[@class='fa fa-refresh']")).click();
  browser.sleep(5000);
    // browser.actions().mouseMove(element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[7]/p-dropdown/div/label"))).perform();
    // browser.sleep(3000);
    //element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[1]/div/table/thead/tr/th[7]/p-dropdown/div/div[3]/span")).click();
    //browser.sleep(3000);
   
   // element(by.xpath("//body[@id='mainBody']/div[2]/div/ul/li[1]")).click();
  //browser.sleep(3000); 
  var delpo = element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/a[@class='disable']/em"));
delpo.isPresent().then(function (result) {
      if (result) {
        console.log('the po cannot be deleted');
        browser.sleep(2000);
      } else {
     element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/a[4]/em")).click();
     browser.sleep(4000);
   var modalpop = element(by.xpath("//ecb-product-offer-list/div/div[2]/ecb-modal-dialog[1]/div/div/div/div[1]/div/div[2]"));
   modalpop.isPresent().then(function (result) {
      if (result) {
         browser.actions().mouseMove(element(by.xpath("//ecb-product-offer-list/div/div[2]/ecb-modal-dialog[1]/div/div/div/div[1]/div/div[2]"))).perform();
         element(by.xpath("//ecb-product-offer-list/div/div[2]/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[2]/dialog-button-2")).click();
         browser.sleep(2000);
         element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/a[4]/em")).click();
     browser.sleep(4000);
         browser.actions().mouseMove(element(by.xpath("//ecb-product-offer-list/div/div[2]/ecb-modal-dialog[1]/div/div/div/div[1]/div/div[2]"))).perform();
         element(by.xpath("//ecb-product-offer-list/div/div[2]/ecb-modal-dialog[1]/div/div/div/div[2]/div/button[1]/dialog-button-1")).click();
         browser.sleep(4000);
          var error = element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/span[2]/ecb-errortooltip/div/div[2]"));
             error.isPresent().then(function (result) {
      if (result) {
     browser.actions().mouseMove(element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/span[2]/ecb-errortooltip/div/div[2]"))).perform();
   browser.sleep(1000);
   element(by.xpath("//ecb-product-offer-list/div/div[2]/p-datatable/div/div[1]/div/div[2]/div/table/tbody/tr[1]/td[1]/span/span[2]/ecb-errortooltip/div/div[1]/i")).click();
   browser.sleep(2000);
      } else {
        console.log('error is not present while deleting po');
      }
             });
    }
    
      else { 
       console.log('modal popup is not present to delete');
      }
   });
      }
});

      browser.sleep(1000);  
    }
});
  });
}
);  