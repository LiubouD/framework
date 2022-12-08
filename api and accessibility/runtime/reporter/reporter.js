const fs = require('fs-extra');
const path = require('path');
const reporter = require('cucumber-html-reporter');
const jUnit = require('cucumber-junit');
const pactumJs = require('pactum');
const getRemote = require('../getRemote');

const remoteService = getRemote(global.settings.remoteService);
const browserName = global.settings.remoteConfig || global.BROWSER_NAME;

let resp;
let obj;

module.exports = {
  ipAddr: async () => {
    const endPoint = 'http://ip-api.com/json';
    resp = await pactumJs.spec().get(endPoint).toss();
    await resp;
  },

  async reporter() {
    const envName = env.envName.toLowerCase();
    try {
      await this.ipAddr();
      obj = await resp.body;
    } catch (err) {
      obj = {};
      console.log('IpAddr func err: ', err.message);
    }
    const jsonFile = path.resolve(global.paths.reports, browserName, envName, `${reportName}-${dateTime}.json`);

    if (global.paths.reports && fs.existsSync(global.paths.reports)) {
      global.endDateTime = helpers.getEndDateTime();

      const reportOptions = {
        theme: 'bootstrap',
        jsonFile,
        output: path.resolve(global.paths.reports, browserName, envName, `${reportName}-${dateTime}.html`),
        reportSuiteAsScenarios: true,
        launchReport: !global.settings.disableReport,
        ignoreBadJsonFile: true,
        metadata: {
          'Test Started': startDateTime,
          // eslint-disable-next-line no-undef
          Environment: env.envName,
          IpAddress: obj.query,
          Browser: browserName,
          Location: `${obj.city} ${obj.regionName}`,
          Platform: process.platform,
          'Test Completion': endDateTime,
          Executed: remoteService && remoteService.type === 'lambdatest' ? 'Remote' : 'Local',
        },
        brandTitle: `${reportName} ${dateTime}`,
        // brandTitle: `${reportName} ${dateTime} ${env.envName}`,
        name: `${projectName} ${browserName}`,
      };
      // eslint-disable-next-line func-names,wdio/no-pause
      browser.pause(DELAY_3s).then(() => {
        reporter.generate(reportOptions);

        // grab the file data for xml creation
        const reportRaw = fs.readFileSync(jsonFile).toString().trim();
        const xmlReport = jUnit(reportRaw);
        const junitOutputPath = path.resolve(
          path.resolve(global.paths.reports, browserName, envName, `${reportName}-${dateTime}.xml`)
        );
        fs.writeFileSync(junitOutputPath, xmlReport);
      });
    }
  },
};
