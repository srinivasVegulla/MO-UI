import { browser, by, element } from 'protractor';

var testdata = require('./inputs/testdata/createpo.json');
var scrollElement = element(by.xpath("//div[@class='ui-widget-header ui-datatable-scrollable-header']/div/table/thead/tr/th[1]/div/input"))

describe('widget', function () {
  it('creating product offer ', function () {
    browser.sleep(500);
    element(by.xpath("//ecb-breadcrumb/div[1]/ol[1]/li[2]/span")).click();
    element(by.xpath("//a[contains(text(),' Product Offer')]")).click();

    element(by.xpath("//span[@class='ui-sortable-column-icon fa fa-fw fa-sort fa-sort-desc']")).click();
    browser.sleep(500);
    element(by.xpath("//a[@href='/ProductCatalog/CreateProductOffer']")).click();

    browser.sleep(2000);

    element(by.xpath("//app-properties/div[2]/div[1]/div/a")).click();
    browser.sleep(1000);
    element(by.xpath("//ngx-aside/aside/section/div/div/form/div[1]/div[1]/div[1]/input"))
    .sendKeys(testdata.name);    
    element(by.xpath("//ngx-aside/aside/section/div/div/form/div[1]/div[2]/div[1]/input"))
    .sendKeys("sample po display");
    element(by.xpath("//ngx-aside/aside/section/div/div/form/div[1]/div[3]/input"))
    .sendKeys("sample po description");
    // element(by.xpath("//select[@id='test']/option[1]")).click();
    var startDateEle =  element(by.xpath("//div[1]/p-calendar/span/button")).click();
    browser.sleep(500)
    element(by.xpath("//div[1]/p-calendar/span/div/table/tbody/tr[1]/td[2]/a[@class='ui-state-highlight']"))
   .isPresent().then((result) =>{
      if(result){
        element(by.xpath("//div[1]/p-calendar/span/div/table/tbody/tr[1]/td[2]/a[@class='ui-state-highlight']")).click();
      }
    })
    
    // element(by.xpath("p-calendar/span/div/table/tbody/tr[2]/td[2]/a[@class='ui-state-highlight']")).isPresent().then((result) =>{
    //   if(result){
    //     element(by.xpath("p-calendar/span/div/table/tbody/tr[2]/td[2]/a[@class='ui-state-highlight']")).click();
    //   }
    // })
    // element(by.xpath("p-calendar/span/div/table/tbody/tr[3]/td[2]/a[@class='ui-state-highlight']")).isPresent().then((result) =>{
    //   if(result){
    //     element(by.xpath("p-calendar/span/div/table/tbody/tr[3]/td[2]/a[@class='ui-state-highlight']")).click();
    //   }
    // })
    element(by.xpath("//div[1]/p-calendar/span/div/table/tbody/tr[4]/td[2]/a[@class='ui-state-highlight']")).isPresent().then((result) =>{
      if(result){
        element(by.xpath("//div[1]/p-calendar/span/div/table/tbody/tr[4]/td[2]/a[@class='ui-state-highlight']")).click();
      }
    })
    element(by.xpath("//div[1]/p-calendar/span/div/table/tbody/tr[5]/td[2]/a[@class='ui-state-highlight']")).isPresent().then((result) =>{
      if(result){
        element(by.xpath("//div[1]/p-calendar/span/div/table/tbody/tr[5]/td[2]/a[@class='ui-state-highlight']")).click();
      }
    })
    element(by.xpath("//div[1]/p-calendar/span/div/table/tbody/tr[6]/td[2]/a[@class='ui-state-highlight']")).isPresent().then((result) =>{
      if(result){
        element(by.xpath("//div[1]/p-calendar/span/div/table/tbody/tr[6]/td[2]/a[@class='ui-state-highlight']")).click();
      }
    })
    element(by.xpath("//ngx-aside/aside/section/div/div/form/div[2]/div[3]/div/label[1]")).click();
    element(by.xpath("//ngx-aside/aside/section/div/div/div/div/div/button[2]")).click();
    browser.sleep(1000)
    element(by.xpath("//app-modal-dialog/div/div/div/div[2]/div/div/button[3]")).click();
   
// //*[@id="mainBody"]/app-root/welcome/div[2]/div[3]/app-product-offer/div[1]/div/app-properties/div[1]/ngx-aside/aside/section/
// div/div/form/div[2]/div[2]/p-calendar/span/div/table/tbody/tr[4]/td[2]/a


// //*[@id="mainBody"]/app-root/welcome/div[2]/div[3]/app-product-offer/div[1]/div/app-properties/div[1]/ngx-aside/aside/section
// /div/div/form/div[2]/div[1]/p-calendar/span/div/table/tbody/tr[4]/td[2]/a

    

    //previous code
    // element(by.xpath("//app-properties/div/form/div[1]/div[1]/div[1]/input")).click();
    // element(by.xpath("//app-properties/div/form/div[1]/div[1]/div[1]/input")).sendKeys(testdata.name);
    // element(by.xpath("//app-properties/div/form/div[1]/div[2]/div[1]/input")).click();
    // element(by.xpath("//app-properties/div/form/div[1]/div[2]/div[1]/input")).sendKeys('sampletest');
    // element(by.xpath("//app-properties/div/form/div[1]/div[3]/input")).click();
    // element(by.xpath("//app-properties/div/form/div[1]/div[3]/input")).sendKeys('sampletest');
    // element(by.xpath("//select[@id='test']/option[1]")).click();
    // browser.sleep(500);
    // browser.actions().mouseMove(element(by.xpath("//h2[contains(text(),'Permissions')]"))).perform;
    // element(by.xpath("//select[@formcontrolname='popartitionid']/option[2]")).click();
    // browser.sleep(500);

    // element(by.xpath("//button[contains(text(),'Save')]")).click();
    // browser.sleep(500);
    // scrollElement.isPresent().then(function(result){
    //   if(result){
    //     scrollElement.click();
    //     scrollElement.sendKeys('sampletest1');
    //   }
    // })    
    // browser.sleep(500);
    // browser.refresh();
    // browser.sleep(1000);
  });
});