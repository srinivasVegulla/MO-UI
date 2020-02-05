var testdata = require('../inputs/testdata/bundle-podetailpage.json');

import { browser, by, element } from 'protractor';
describe('widget', function () {
  it('bundlepo detail page', function () {
    browser.sleep(4000);
    
    var widget = element(by.xpath("//ecb-productofferinbundle/div/div[1]/h2"));
    widget.isPresent().then(function (result){
             if(result){
            var widget= element(by.xpath("//ecb-productofferinbundle/div/div[1]/h2"));
     browser.executeScript('arguments[0].scrollIntoView()',widget.getWebElement());
     browser.sleep(2000);     
       var popresent = element(by.xpath("//div[@id='cardTotalHeightPO-0']"));
           popresent.isPresent().then(function (result){
             if(result){
                 popresent.click();
                 browser.sleep(5000);
                browser.navigate().back();
                browser.sleep(6000);
             } else {
             console.log('no pos are present inside the bundle');
             }
           });
             } else {
            console.log('productoffers widget is not present in bundle page');
             }
    });
  });
});