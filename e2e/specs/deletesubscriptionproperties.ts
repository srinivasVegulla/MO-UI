var testdata = require('../inputs/testdata/deletesubscriptionproperties.json');

import { browser, by, element } from 'protractor';

describe('widget', function () {

      it('subscriptionproperties delete', function() {

              browser.sleep(5000);
     

          var table = element(by.xpath("//em[@class='fa fa-times-circle']"));
          table.isPresent().then(function (result) {
      if (result) {
     var deletedisable = element(by.xpath("//div[@class='ui-datatable-scrollable-table-wrapper']/table/tbody/tr[1]/td[1]/span/a[@class='disable']"));
      deletedisable.isPresent().then(function (result) {
      if (result) {
      console.log('delete icon in subscription properties grid is in disable state');
      }
      else{
       console.log('delete icon in subscription properties grid is in enable state');
       element(by.xpath("//div[@class='ui-datatable-scrollable-table-wrapper']/table/tbody/tr[1]/td[1]/span/a[3]/em")).click();
       browser.sleep(2000);
       var deletepopup = element(by.xpath("//ecb-subscription-property-details/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"));
        deletepopup.isPresent().then(function (result) {
      if (result) {
        browser.actions().mouseMove(element(by.xpath("//ecb-subscription-property-details/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
        browser.sleep(2000);
        // clicking cancel without save
        element(by.xpath("//ecb-subscription-property-details/ecb-modal-dialog/div/div/div/div[2]/div/button[2]")).click();
        browser.sleep(3000);
         element(by.xpath("//em[@class='fa fa-times-circle'][1]")).click();
       browser.sleep(2000);
        browser.actions().mouseMove(element(by.xpath("//ecb-subscription-property-details/ecb-modal-dialog/div/div/div/div[2]/div/button[1]"))).perform();
        browser.sleep(2000);
         element(by.xpath("//ecb-subscription-property-details/ecb-modal-dialog/div/div/div/div[2]/div/button[1]")).click();
        browser.sleep(3000);

      } else {
        console.log('popup is not came for delete in subscription properties');
      }
        });
      }
    });
      } else {
       console.log('table is not present to delete subscription property');
      }
          });
      });
});