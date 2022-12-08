const { remote } = require('webdriverio');
const program = require('commander');
const fs = require('fs');
const path = require('path');
const { Before } = require('@cucumber/cucumber');
const { UtamWdioService } = require('wdio-utam-service');
const utamConfig = require('./utam.config');

let defaults = {};

const modHeader = fs.readFileSync(path.resolve(__dirname, './scripts/extensions/modHeader_3_1_22_0.crx'), {
  encoding: 'base64',
});

let isApiTest;
let isUTAMTest;
const apiTagKeywords = ['api', 'get', 'put', 'post', 'delete'];

Before((scenario) => {
  isApiTest = scenario.pickle.tags.some((tag) => apiTagKeywords.some((word) => tag.name.includes(word)));
  isUTAMTest = scenario.pickle.tags.some((tag) => tag.name.includes('utam'));
});
/**
 * create the web browser based on globals set in index.js
 * @returns {{}}
 */
module.exports = async function chromeDriver(options) {
  if (program.opts().wdProtocol) {
    defaults = {
      logLevel: 'error',
      path: '/wd/hub',
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['--no-sandbox', '--disable-gpu', '--disable-popup-blocking'],
          extensions: [modHeader],
        },
      },
    };
  } else if (program.opts().headless || isApiTest ? '--headless' : '') {
    defaults = {
      logLevel: 'error',
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['--headless', '--disable-popup-blocking', '--disable-gpu', '--no-sandbox', '--disable-extensions'],
        },
      },
    };
  } else {
    defaults = {
      logLevel: 'error',
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['--no-sandbox', '--disable-gpu', '--disable-popup-blocking'],
          extensions: [modHeader],
        },
      },
    };
  }

  // Add proxy based on env var.
  const useProxy = process.env.USE_PROXY || false;

  if (useProxy) {
    defaults.capabilities.proxy = {
      httpProxy: 'http://ouparray.oup.com:8080',
      proxyType: 'MANUAL',
      autodetect: false,
    };
  }

  const extendedOptions = Object.assign(defaults, options);
  global.browser = await remote(extendedOptions);
  if (isUTAMTest) {
    const utamInstance = new UtamWdioService(utamConfig, extendedOptions.capabilities, extendedOptions);
    await utamInstance.before(extendedOptions.capabilities);
  }
  await browser.setWindowSize(1280, 1024);
  return browser;
};
