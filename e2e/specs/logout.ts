
var testdata = require('../inputs/testdata/login.json');


import { browser, by, element } from 'protractor';
describe('UI Baseline App', function() {
  it('should logout', function() {
         
         
       // log out functionality
       browser.sleep(3000);
      
      
       element(by.xpath("//i[@class='fa fa-sign-out']")).click();
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toMatch(testdata.url.CurrentUrl);
        console.log('loggedout successfully');
         });
});