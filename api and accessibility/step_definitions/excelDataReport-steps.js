/* eslint-disable radix */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prefer-template */
/* eslint-disable prefer-const */

const helpers = require("../runtime/helpers");

/* eslint-disable global-require */
const urls = [];
// const Login = [];
const refresh1 = [];
const refresh2 = [];

Given("User launches url from {string}", async (data) => {
  const urlDataArr = require("../shared-objects/urlData.json").URLs;
  console.log("URLDATA ==> ", urlDataArr);
  console.log(typeof urlDataArr);
  let url;
  for (obj of urlDataArr) {
    let keys = Object.keys(obj);
    if (keys[0] === data) url = obj[data].url;
  }
  urls.push(url);
  console.log("this is the requested url ===> ", url);
  await helpers.loadPage(url, 10);
});

// can be introduced login if needed here.

Then("User refreshes the page for 1st time", async () => {
  // Then('User refreshes the page for 1st time', async (data) => {
  startDate = new Date();
  await browser.refresh();
  endDate = new Date();
  let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
  let str = seconds.toString().replace("-", "") + "sec";
  refresh1.push(str);
  await helpers.executeTime(
    startDate,
    endDate,
    "Total time taken for 1st Refresh: "
  );
});

Then("User refreshes the page for 2nd time", async () => {
  startDate = new Date();
  await browser.refresh();
  endDate = new Date();
  let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
  let str = seconds.toString().replace("-", "") + "sec";
  refresh2.push(str);
  await helpers.executeTime(
    startDate,
    endDate,
    "Total time taken for 2nd Refresh: "
  );
});

Then("copy the Urls from testdata file to json file", async () => {
  const urlData = require("../shared-objects/testdata.json").genericUrl;
  let arr = [];
  let keys = Object.keys(urlData);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let url = urlData[key];
    let obj = {
      ["data " + (i + 1)]: {
        url,
      },
    };
    arr.push(obj);
  }
  let data = {
    URLs: arr,
  };
  await helpers.writeToUrlsData(data);
});

Then("write recorded data to urlData.json file", async () => {
  let arr = [];
  for (let i = 0; i < urls.length; i++) {
    // let t1 = parseInt(Login[i].split('s')[0]);
    let t2 = parseFloat(refresh1[i].split("s")[0]);
    let t3 = parseFloat(refresh2[i].split("s")[0]);
    let average = (t2 + t3) / 2;
    let obj = {
      ["data " + (i + 1)]: {
        url: urls[i],
        refresh1: refresh1[i],
        refresh2: refresh2[i],
        average: parseFloat(average).toFixed(2),
      },
    };
    arr.push(obj);
  }
  let data = {
    URLs: arr,
  };
  await helpers.writeToUrlsData(data);
});

Then("copy the json data to excel file", async () => {
  await helpers.convertJsonToExcel();
});

// Then('User can write to csv file', async () => {

//   await common.csvWrite();
// });
