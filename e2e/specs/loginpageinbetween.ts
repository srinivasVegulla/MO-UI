var testdata = require('../inputs/testdata/loginpageinbetween.json');

import { browser, by, element } from 'protractor';

describe('UI Baseline App', function () {
  it('should have a title', function () {
     browser.sleep(3000);
    var error = element(by.xpath("//button[@class='btn btn-primary btn-lg ecb-loginBtn']"));
    error.isPresent().then(function (result) {
      if (result) {
        expect(browser.getCurrentUrl()).toMatch(testdata.url.CurrentUrl);
        console.log('login page');
        browser.sleep(1000);
     
       
        element(by.name('username')).sendKeys(testdata.user.username);
        element(by.name('password')).sendKeys(testdata.user.passwordField);
          browser.sleep(1000);
      
        
        // Click to sign in - waiting for Angular as it is manually bootstrapped.
        element(by.xpath("//button[@class='btn btn-primary btn-lg ecb-loginBtn']")).click();
        // jasmine.DEFAULT_TIMEOUT_INTERVAL = 90000;
         browser.ignoreSynchronization = true;
        browser.waitForAngular();
       
        browser.sleep(3000);
        console.log('login is succesfull');        
      } else {
        console.log('URL is wrong');
        console.log('404 PAGE');
        browser.sleep(500);
        browser.close(); 
      }
    });
  });
});

