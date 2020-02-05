var testdata  = require('./inputs/testdata/packagingworkspace.json');
var loginData = require('./inputs/testdata/login.json');
var dragAndDropFn = require('../draganddrop/dragNDrop/drag.js');

import { browser, by, element } from 'protractor';
describe('widget', function () {

  it('packagingworkspace widget', function () {
    browser.driver.manage().window().maximize();
    expect(browser.getCurrentUrl()).toMatch(loginData.url.DashBoardURL);
    expect(element(by.xpath("//h1[contains(text(),'Ericsson Enterprise and Cloud Billing')]")).isDisplayed()).toBe(true);
    expect(element(by.xpath("//div[@class='ebPageTitle-container ecb-pageTitle PageTitle']/h1")).getText()).toEqual("Product Catalog");
    expect(element(by.xpath("//ecb-breadcrumb/div[1]/ol[1]/li[1]/a")).getText()).toEqual("Dashboard");
    expect(element(by.xpath("//ecb-breadcrumb/div[1]/ol[1]/li[2]/a")).getText()).toEqual("Product Catalog");
    
    element(by.xpath("//ecb-breadcrumb/div[1]/ol[1]/li[2]/span")).click();
    element(by.xpath("//a[contains(text(),'Packaging Workspace')]")).click();
    browser.sleep(3000);
    expect(element(by.xpath("//div[@class='ebPageTitle-container ecb-pageTitle ecb-RtlViewPageTitle']/h1")).getText()).toEqual("Packaging Workspace");

    expect(element(by.xpath("//li[@class='ebText $ebColor_darkBlue active']/a")).getText()).toEqual("Product Offers");

    // drag and drop functionality
    var draganddrop = element(by.xpath("//ul[@class='ecbLibrary-items-container']"));
    draganddrop.isPresent().then(function (result) {
      if (result) {
        var source = element(by.xpath("//ul[@class='ecbLibrary-items-container']/li[@draggable='true'][1]"));
        browser.sleep(500);
        var target = element(by.xpath("//div[@class='card card-outline-primary mb-3']"));
        browser.executeScript(dragAndDropFn, source.getWebElement(), target.getWebElement());
        browser.sleep(500);
        console.log('drag and drop worked');
      }
      else {
        console.log('unable to drag the element');
      }
    });

    // functionality to validate whether product offer is present on the other side or not
    var addedoffer = element(by.xpath("//ecb-tilecontrol/div/div[@class='col-sm-12'][1]/div/span/div"));
    addedoffer.isPresent().then(function (result) {
      if (result) {
        console.log('drag and drop offer is added on the otherside');
        expect(element(by.xpath("//ecb-tilecontrol/div/div[@class='col-sm-12'][1]/div/span/div")).getText()).toEqual(addedoffer.getText());
        var attr = element(by.xpath("//ecb-tilecontrol/div/div[@class='col-sm-12'][1]/div/img")).getAttribute('src');
        expect(attr).toEqual(testdata.img3);
        console.log('product offer is added on the other side');
      }
      else {
        console.log('productoffer is not added on the otherside');
      }
    });

    // functionality to move product offers from library to other widget.           
    var productoffers = element(by.xpath("//div[@class='tab-pane active']"));
    productoffers.isPresent().then(function (result) {
      if (result) {
        expect(element(by.xpath("//div[@class='tab-pane active']/ul/li[1]/div[3]/a/i")).isDisplayed()).toBe(true);
        var attr = element(by.xpath("//div[@class='tab-pane active']/ul/li[@draggable='true'][1]/div[1]/img")).getAttribute('src');
        expect(attr).toEqual(testdata.img1);
        element(by.xpath("//div[@class='tab-pane active']/ul/li[1]/div[3]/a/i")).click();
        browser.sleep(500);
        // validating whether the product offer is adding that side or not
        expect(element(by.xpath("//div[@class='ecbTree-level-title']/span")).getText()).toEqual("Product Offers");
        var attr = element(by.xpath("//div[@class='ecbColumn-title-icon']/img")).getAttribute('src');
        expect(attr).toEqual(testdata.img2);
        var addedoffer1 = element(by.xpath("//ecb-tilecontrol/div/div[@class='col-sm-12'][1]/div/span/div"));
        addedoffer1.isPresent().then(function (result) {
          if (result) {
            console.log('offer is added on the otherside');
            expect(element(by.xpath("//ecb-tilecontrol/div/div[@class='col-sm-12'][1]/div/span/div")).getText()).toEqual(addedoffer1.getText());
            var attr = element(by.xpath("//ecb-tilecontrol/div/div[@class='col-sm-12'][1]/div/img")).getAttribute('src');
            expect(attr).toEqual(testdata.img3);
            console.log('product offer is added on the other side');
          } else {
            console.log('productoffer is not added on the otherside');
          }
        });

        // tooltip functionality               
        var tooltip = element(by.xpath("//ecb-tilecontrol/div/div[@class='col-sm-12'][3]/div/span[@tooltip-disabled='false']"));
        tooltip.isPresent().then(function (result) {
          if (result) {
            console.log('tooltip is there for this offer');
            browser.actions().mouseMove(element(by.xpath("//ecb-tilecontrol/div/div[@class='col-sm-12'][3]/div/span"))).perform();
            expect(element(by.xpath("//ecb-tilecontrol/div/div[@class='col-sm-12'][3]/div/tooltip-content/div[@class='tooltip top in fade']")).getText()).toEqual(testdata.fullnameoffer);

          }
          else {
            console.log('tooltip is not there for this offer');
          }
        });

        // edit availability functionality
        browser.sleep(500);
        var endDateSelection = element(by.xpath("//ecb-tilecontrol/div/div[@class='col-sm-12'][1]/div/div/a/span"))
        endDateSelection.isPresent().then((result) =>{
          if(result){
            endDateSelection.click();
            expect(element(by.xpath("//ecb-tilecontrol/div/div[@class='col-sm-12'][1]/div/div/ul/li/a")).getText()).toEqual("Edit Availability");
            element(by.xpath("//ecb-tilecontrol/div/div[@class='col-sm-12'][1]/div/div/ul/li/a")).click();
            browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Edit Availability')]"))).perform();
            expect(element(by.xpath("//label[contains(text(),'Start Date')]")).isDisplayed()).toBe(true);
            expect(element(by.xpath("//label[contains(text(),'End Date')]")).isDisplayed()).toBe(true);
    
    
            element(by.xpath("//span[@class='ui-button-icon-left ui-clickable fa fa-fw fa-calendar-o'][1]")).click();
    
            element(by.xpath("//span[@class='ui-button-icon-left ui-clickable fa fa-fw fa-calendar-o'][1]")).click();
            browser.sleep(500);
            element(by.xpath("//div[@class='aside-container']/div[2]/div[2]/form/div[2]/div/p-calendar/span/button")).click();
            browser.sleep(500);
            expect(element(by.xpath("//table[@class='ui-datepicker-calendar']")).isDisplayed()).toBe(true);
            console.log('enddate selection is present');
            element(by.xpath("//span[@class='ng-tns-c10-2 ecb-calender ui-calendar ui-calendar-w-btn']/div/table/tbody/tr[2]/td[4]/a")).click();
    
            browser.sleep(500);
            expect(element(by.xpath("//button[@class='ebBtn']")).isDisplayed()).toBe(true);
            element(by.xpath("//button[@class='ebBtn ebBtn-primary']")).click();
            browser.sleep(500);
            expect(element(by.xpath("//div[@class='ebAvailableDates'][1]")).getText()).toEqual(testdata.availabledate);
    
          }
          else{
            console.log("End Date is not present")
          }
        })
      }
      else {
        console.log('productoffers are not present in the library');
      }
    });
  });
}); 