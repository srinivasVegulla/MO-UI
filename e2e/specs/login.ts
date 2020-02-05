var testdata = require('../inputs/testdata/login.json');

import { browser, by, element } from 'protractor';

describe('UI Baseline App', function () {
  it('should have a title', function () {
    browser.sleep(3000);
    browser.ignoreSynchronization = true;
    browser.get(testdata.url.CurrentUrl);
    browser.sleep(2000);
    var error1 = element(by.xpath("//h1[contains(text(),'This site can’t be reached')]"));
     error1.isPresent().then(function (result) {
      if (result) {
     console.log('url is not up and running so connection is refused');
         browser.sleep(2000);
        browser.close(); 
      } else {
    var error = element(by.name('username'));
    error.isPresent().then(function (result) {
      if (result) {
        expect(browser.getCurrentUrl()).toMatch(testdata.url.CurrentUrl);
        console.log('login page');
        browser.sleep(5000);
     

       
        element(by.name('username')).sendKeys(testdata.user.username);
        element(by.name('password')).sendKeys(testdata.user.passwordField);
          browser.sleep(2000);
          

/*
       element(by.xpath("//img[@title='Hebrew']")).click();
       browser.sleep(5000);

         
       var text= element(by.xpath("//button[@class='btn btn-primary btn-lg ecb-loginBtn']")).getText().then( (result) =>{
         if(result = testdata.Hebrew.logintext){
           console.log('Hebrew language');
           
           testdata.logout = testdata.Hebrew.logout;
          
         }
       else {
            console.log('it is an another language');
       }
      
     });
        */
        
        // Click to sign in - waiting for Angular as it is manually bootstrapped.
        element(by.xpath("//button[@class='btn btn-primary btn-lg ecb-loginBtn']")).click();
        // jasmine.DEFAULT_TIMEOUT_INTERVAL = 90000;
         browser.ignoreSynchronization = true;
        browser.waitForAngular();
       
        browser.sleep(10000);
        console.log('login is succesfull');  
         browser.driver.manage().window().maximize();
    
    browser.sleep(5000);      
      } else {
        console.log('URL is wrong');
        console.log('404 PAGE');
        browser.sleep(1000);
        browser.close(); 
      }
    });
      }
     });
  });
});

