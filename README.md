# framework

Is a debuggable BDD Javascript test automation framework. Built on  webdriver.io  and  cucumber-js with integrated Visual, accessibility and API Testing, your test can run locally.

## Pre Installation

Please check that you have these applications installed on your PC:
https://nodejs.org/ -NodeJs
http://java.sun.com/javase/downloads/index.jsp" -Java JDK
https://Atlassian.com/git/tutorials/install-git -Git-– You need to have an account on GitHub first
https://yarnpkg.com" -Yarn
https://appium.io/downloads.html -Appium
https://developer.android.com/studio -Android studio
https://github.com/appium/appium-inspector?ysclid=lbf13mq7ek792397024 -Appium inspector
If not, download and install them with just the default configuration, it is enough for framework usages.

## Installation

npm install 
npm init
npm init wdio
npm webdriverio --save
npm i @wdio/cli --save
npm i wdio/local-runner
npm i @wdio/sync
npm i @wdio/mocha-framework
npm i @babel/cli --save-dev
npm i @babel/core --save-dev
npm i @babel/present-env --save-dev
npm i @babel/register --save-dev

## Options

```bash
--help                              output usage information
--version                           output the version number
--browser <name>                    name of browser to use (chrome, firefox). defaults to chrome
--tags <@tagName>                   name of cucumber tags to run - Multiple TAGS usage (@tag1,@tag2)
--exclude <@tagName>                name of cucumber tags to exclude - Multiple TAGS usage(@tag3,@tag5)
--steps <path>                      path to step definitions. defaults to ./step-definitions
--featureFiles <path>               path to feature definitions. defaults to ./features
--pageObjects <path>                path to page objects. defaults to ./page-objects
--sharedObjects <paths>             path to shared objects - repeatable. defaults to ./shared-objects
--reports <path>                    output path to save reports. defaults to ./reports
--disableReport                     disables the test report from opening after test completion
--email                             sends email reports to stakeholders
--env <path>                        name of environment to run the framework/test in. default to dev
--reportName <optional>             name of what the report would be called i.e. 'Automated Test'
--remoteService <optional>          which remote driver service, if any, should be used e.g. browserstack
--extraSettings <optional>          further piped configs split with pipes
--updateBaselineImages              automatically update the baseline image after a failed comparison or new images
--wdProtocol                        the switch to change the browser option from using devtools to webdriver
--closeBrowser <optional>           this closes the browser after each scenario, defaults to always, use 'no' if you want to want to keep the  browser open

## Visual Regression with [Resemble JS](https://github.com/rsmbl/Resemble.js)

Visual regression testing, the ability to compare a whole page screenshots or of specific parts of the application / page under test.
If there is dynamic content (i.e. a clock), hide this element by passing the selector (or an array of selectors) to the takeImage function.
```js
// usage within page-object file:
  await helpers.takeImage(fileName, [elementsToHide, elementsToHide]);
  await browser.pause(100);
  await helpers.compareImage(fileName);
```

## API Testing with [PactumJS](https://github.com/pactumjs/pactum#readme)
Getting data from a JSON REST API
```js
 apiCall: async (url, method, auth, body, status) => {
 let resp;
 const options = {
  url,
  method,
  headers: {
   Authorization: `Bearer ${auth}`,
   'content-Type': 'application/json',
  },
  body,
 };

 if (method === 'GET') {
  resp = await helpers.apiCall(url, 'GET', auth);
  return resp.statusCode;
 }
 if (method === 'POST') {
  resp = await helpers.apiCall(url, 'POST', auth, body, status);
  return resp;
 }
}
```
## Accessibility Testing with [Axe](https://www.deque.com/axe/)
Automated accessibility testing feature has been introduced using the Axe-Core OpenSource library.

### Sample code
All the accessibility fuctions can be accessed through the global variable ``` accessibilityLib ```.
| function          | Description                                                     |
|----------------------------|-----------------------------------------------------------------|
| ``` accessibilityLib.getAccessibilityReport('PageName')```| generates the accessibility report with the given page name |
| ``` accessibilityLib.getAccessibilityError()``` | returns the total number of error count for a particular page. |
| ``` accessibilityLib.getAccessibilityTotalError() ``` | returns the total number of error count for all the pages in a particilar execution |

```js
// usage within page-object file:
When('I run the accesibility analysis for {string}', async function (PageName) {
  // After navigating to a particular page, just call the function to generate the accessibility report
  await accessibilityLib.getAccessibilityReport(PageName);
});

Then('there should not be any violation in the accessibility report', function () {
// This will return the total accessibility error count for a particular page.
let violationcount=accessibilityLib.getAccessibilityError();
assert.equal(violationcount, 0);
});
```

## Test Execution Reports

HTML and JSON reports will be automatically generated and stored in the default `./reports` folder. This location can be
 changed by providing a new path using the `--reports` command line switch:

![Cucumber HTML report](./runtime/img/cucumber-html-report.png)

## Accessibility Report

HTML and JSON reports will be automatically generated and stored in the default `./reports/accessibility`  folder.This location can be changed by providing a new path using the `--reports` command line switch:

![Aceessibility HTML report](./runtime/img/accessibility-html-report.png)


## Mobile App automation with [Appium](https://appium.io/docs/en/about-appium/getting-started/?lang=en)

Besides the ability to test web applications on mobile environments, the framework allows for the automation mobile applications.
Init packages:
sdkmanager platform tool emulator
sdkmanager ---list
sdkmanager "platform; android-29"
sdkmanager "system-images; android-29; default; x86"
sdkmanager "build-tools; 29.0.2"
Launch AVD:
avdmanager create avd --name
android_29 --package "system-images; android-29; default; x86"
emulator@android-29

## Mobile capabilities

For instance:

```
{
  "platformName": "Android",
  "appium:platformVersion": "13",
  "appium:deviceName": "Pixel_3a_API_33_x86_64",
  "appium:automationName": "UIAutomator2",
  "appium:app": "C:/Users/User/Downloads/Android-NativeDemoApp-0.4.0.apk",
  "appium:appWaitActivity": "com.wdiodemoapp.MainActivity"
}

### Appium documentation

To learn about the APIs that can be used to interact with the mobile drivers, please refer to the [Appium documentation](https://appium.io/docs/en/about-appium/intro/). Find the specific functions by clicking on *Commands* and navigating to the specific section.

Please bear in mind that the page describing each function will contain information about how to invoke the function in different languages and compatibility with different drivers.

For instance, the page for the [App installation functions](https://appium.io/docs/en/commands/device/app/install-app/) describes that when used in JavaScript (specifically using WebdriverIO), `driver.installApp('/path/to/APK')` is the code to use (bear in mind when referencing the documentation that klassi-js uses WDIO asynchronously and that driver = browser, so we would use `await browser.installApp('/path/to/APK')`).

![JavaScript implementation of installApp](./runtime/img/javascript-code.jpg)

It also tells us that the function is compatible with XCUITest and UiAutomator2, so we can use it for our tests.

![Install App support](./runtime/img/installapp-support.jpg)

### Mobile selectors

As it is described in [WebDriverIO's website](https://webdriver.io/docs/selectors/#mobile-selectors), native app element selection can be achieved through different methods, though they are handled the same way at the framework level (i.e., `const elementName = await browser.$(selector);` or `const elementName = await browser.$$(selector);` for all elements that match the selectors).

**Pre-considerations for local environment**: the Appium server (included as a dependency of the project) should be running for the tests to be executed locally, which should should only be done for debugging or creating the tests, by running the `yarn run appium-start` command.

On Windows, both processes can be run concurrently using `start yarn appium-start & yarn android-local` or `start yarn appium-start & yarn ios-local`.

On iOS, the equivalent commands would be `yarn appium-start & yarn android-local` and `yarn appium-start & yarn ios-local`.

To verify that a local emulator or simulator is working correctly, use `adb devices` (Android) and `xcrun simctl list | grep Booted` (iOS).

**For Android testing,** it is recommended to use [UISelector class of the UI Automator API](https://developer.android.com/reference/android/support/test/uiautomator/UiSelector), passing the Java code to the selector method.

For instance:
```
const navbarBtn = await browser.$(android=new UiSelector().text("Toggle navigation").className("android.widget.Button"));
```

Please remember that this example should actually be implemented setting the selector in its own shared objects script (e.g., `browser.$(sharedObjects.android.elem.navbarBtn);`).

To retrieve the attributes that will be used in the selector, the [Appium Inspector desktop application](https://github.com/appium/appium-inspector) is recommended.

**For iOS testing,** it is recommended to use [Apple's UI Automation framework](https://developer.apple.com/library/prerelease/tvos/documentation/DeveloperTools/Conceptual/InstrumentsUserGuide/UIAutomation.html) to find elements and [Apple's API](https://developer.apple.com/library/ios/documentation/DeveloperTools/Reference/UIAutomationRef/index.html#//apple_ref/doc/uid/TP40009771).


## Event handlers

You can register event handlers for the following events within the cucumber lifecycle.

const {After, Before, AfterAll, BeforeAll, BeforeStep, AfterStep} = require('@cucumber/cucumber');

| Event          | Example                                                     |
|----------------|-------------------------------------------------------------|
| Before     | ```Before(function() { // This hook will be executed before all scenarios}) ```  |
| After      | ```After(function() {// This hook will be executed after all scenarios});```    |
| BeforeAll  | ```BeforeAll(function() {// perform some shared setup});``` |
| AfterAll   | ```AfterAll(function() {// perform some shared teardown});```  |
| BeforeStep | ```BeforeStep(function() {// This hook will be executed before all steps in a scenario with tagname;``` |
| AfterStep  | ```AfterStep(function() {// This hook will be executed after all steps, and take a screenshot on step failure;```  |

## How to debug

Most webdriverio methods return a [JavaScript Promise](https://spring.io/understanding/javascript-promises "view JavaScript promise introduction") that is resolved when the method completes. The easiest way to step in with a debugger is to add a ```.then``` method to the function and place a ```debugger``` statement within it, for example:

```js
  When(/^I search DuckDuckGo for "([^"]*)"$/, function (searchQuery, done) {
    elem = browser.$('#search_form_input_homepage').then(function(input) {
      expect(input).to.exist;
      debugger; // <<- your IDE should step in at this point, with the browser open
      return input;
    })
       done(); // <<- let cucumber know you're done
  });
```
```
