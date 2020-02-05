var testdata = require('../inputs/testdata/auditlogdownload.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {

      it('auditlog download ', function() {
      var download = element(by.xpath("//ecb-auditlog/div/div[1]/div/span[@class='ecb-disableAlignIcon']"));
      download.isPresent().then(function (result){
           if(result){
               console.log('download in auditlog is disabled');
           } else {
            console.log('download icon is enabled');
            browser.sleep(10000);
            element(by.xpath("//ecb-auditlog/div/div[1]/div/span[1]/em")).click();
            browser.sleep(10000);
           }  
      });

      
      });
});
