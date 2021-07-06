require("chromedriver");

const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { loadSharedList } = require("./driver-code");

const { getRequestlyExtension } = require("./requestly-chrome");

let opt = new chrome.Options();

opt.addExtensions(getRequestlyExtension());

function init() {
  const driver = new Builder()
    .forBrowser("chrome")
    .setChromeOptions(opt)
    .build();
  return driver;
}

const driver = init();

const sharedListUrl =
  "https://app.requestly.io/shared-lists/viewer/1625034285160-nafees-test-2";

  // load sharedList by passing the Url as argument
loadSharedList(driver, sharedListUrl);
