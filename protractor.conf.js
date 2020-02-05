// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
require('ts-node/register');
var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');


var reporter = new HtmlScreenshotReporter({
  dest: 'e2e/REPORTS/e2e',
  filename: 'my-report.xml'
});

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    
   './e2e/**/login.ts',
   './e2e/**/delpo.ts',
   'e2e/**/hideandunhide.ts',
   './e2e/**/copyofnewbundleorpo.ts',
   './e2e/**/localization.ts',
    './e2e/**/createpo.ts',
    './e2e/**/localizationinpodetailpage.ts',
    './e2e/**/addanddelpi.ts',
    './e2e/**/addanddelsubs.ts',
    './e2e/**/properties.ts',
    './e2e/**/extendedproperties.ts',
  './e2e/**/checkingconfiguration.ts',
       './e2e/**/pidetailpage.ts',
      './e2e/**/childpi.ts',
       './e2e/**/ratetable-pidetailspage.ts',
       './e2e/**/schedules.ts',
       './e2e/**/schedules-edit.ts',
    './e2e/**/auditlogfromschedule.ts',
    './e2e/**/ratechangesanddatedescriptionfromschedule.ts',
       './e2e/**/rates.ts',
       './e2e/**/copyrates-rates.ts',
       './e2e/**/deletepo.ts',
        './e2e/**/productoffer.ts',
      './e2e/**/permissionswithdates.ts',
        './e2e/**/poexistencelink.ts',
      './e2e/**/bundles.ts',
       './e2e/**/localizationinbundledetailpage.ts',
         './e2e/**/checkingconfiguration.ts',
       './e2e/**/propertiesforbundles.ts',
      './e2e/**/extendedpropertiesforbundle.ts',
        './e2e/**/addanddelpi.ts',
         './e2e/**/addanddelsubs.ts',
       './e2e/**/addanddelpos.ts',
        './e2e/**/permissionsinbundles.ts',
       './e2e/**/bundle-podetailpage.ts',
       './e2e/**/deletebundle.ts',
       './e2e/**/adjustmentreasonsgrid.ts',
        './e2e/**/createadjustmentreasons.ts',
        './e2e/**/addadjustmentreasons.ts',
        './e2e/**/editadjustmentreasons.ts',
         './e2e/**/subscriptionpropertiesgrid.ts',
         './e2e/**/localizationinsubscriptionproperties.ts',
       './e2e/**/deletesubscriptionproperties.ts',
     './e2e/**/editsubscriptionproperties.ts',
        './e2e/**/subscriptioninuseofferings.ts',
      './e2e/**/createsubscriptionproperties.ts',
        './e2e/**/auditloggrid.ts',
          './e2e/**/ratechangesanddatedescriptionfromauditlog.ts',
          './e2e/**/auditlogdownload.ts',
           './e2e/**/pitemplates.ts',
        './e2e/**/usagechargedetailpageinpitemplates.ts',
          './e2e/**/deletepi-pitemplatesgrid.ts',
        './e2e/**/createonetimechargesinpitemplates.ts',
          './e2e/**/onetimechargesdetailpageinpitemplates.ts',
          './e2e/**/addanddeleteadjustments.ts',
             './e2e/**/createudrcinpitemplates.ts',
         './e2e/**/UDRCchargedetailsinpitemplates.ts',
        './e2e/**/addanddeleteadjustments.ts',
         './e2e/**/creatediscountinpitemplates.ts',
           './e2e/**/discountdetailpageinpitemplates.ts',
      './e2e/**/sharedratesgridanddelete.ts',
        './e2e/**/createratelist.ts',
       './e2e/**/sharedratesdetailpage.ts',
       './e2e/**/logout.ts'
       
  ],
  multiCapabilities: [/*{
    'browserName': 'firefox',
    acceptInsecureCerts: true,
     //marionette : true,
    jasmineNodeOpts: 40000,  
      jvmArgs: ['-Dwebdriver.firefox.bin=c:/Program Files (x86)/Mozilla Firefox/firefox.exe',
    '-Dwebdriver.gecko.driver=C:/Users/Developer/AppData/Roaming/npm/node_modules/protractor/node_modules/webdriver-manager/selenium/geckodriver-v0.16.0.exe']
  },
  {
    'browserName': 'internet explorer',
       acceptInsecureCerts: true,
        localSeleniumStandaloneOpts : {
         jvmArgs : ["-Dwebdriver.ie.driver=node_modules/protractor/node_modules/webdriver-manager/selenium/IEDriverServer3.4.0.exe"] 
         
		}
  } ,*/
   
  {
    'browserName': 'chrome',
   
       localSeleniumStandaloneOpts : {
         jvmArgs : ["-Dwebdriver.chrome.driver=node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver.exe"] 
         
		}
  } ],
  exclude: [],

  framework: 'jasmine2',
 
  //directConnect: true,

  allScriptsTimeout: 110000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 400000
  },
  seleniumAddress: 'http://localhost:4444/wd/hub',
 

  
   framework: 'jasmine2',
 onPrepare: function() {
    var jasmineReporters = require('jasmine-reporters');
    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
        consolidateAll: true,
        savePath: 'e2e/REPORTS/e2e',
        filePrefix: 'xmloutput'
    }));
     },
  plugins: [{
        package: 'protractor-screenshoter-plugin',
        screenshotPath: 'e2e/htmlreports/e2e',
        screenshotOnExpect: 'failure+success',
        screenshotOnSpec: 'failure',
        clearFoldersBeforeTest: 'true',
        withLogs: true,
        writeReportFreq: 'asap',
        clearFoldersBeforeTest: true
    }],
   

  /**
   * Angular 2 configuration
   *
   * useAllAngular2AppRoots: tells Protractor to wait for any angular2 apps on the page instead of just the one matching
   * `rootEl`
   */
   useAllAngular2AppRoots: true 
};

