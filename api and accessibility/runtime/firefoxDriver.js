const wdio = require('webdriverio');
const program = require('commander');
const { Before } = require('@cucumber/cucumber');
const { UtamWdioService } = require('wdio-utam-service');
const utamConfig = require('./utam.config');

let defaults = {};

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
module.exports = async function firefoxDriver(options) {
  if (program.opts().wdProtocol) {
    defaults = {
      logLevel: 'error',
      path: '/wd/hub',
      capabilities: {
        browserName: 'firefox',
      },
    };
  } else if (program.opts().headless || isApiTest ? '--headless' : '') {
    defaults = {
      logLevel: 'error',
      capabilities: {
        browserName: 'firefox',
        'moz:firefoxOptions': {
          args: ['--headless', '--disable-popup-blocking', '--disable-gpu'],
        },
      },
    };
  } else {
    defaults = {
      logLevel: 'error',
      capabilities: {
        browserName: 'firefox',
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
  global.browser = await wdio.remote(extendedOptions);
  if (isUTAMTest) {
    const utamInstance = new UtamWdioService(utamConfig, extendedOptions.capabilities, extendedOptions);
    await utamInstance.before(extendedOptions.capabilities);
  }
  await browser.setWindowSize(1280, 800);
  return browser;
};
