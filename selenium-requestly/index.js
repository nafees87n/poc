require("chromedriver");
const fs = require("fs");
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
let opt = new chrome.Options();

function encode(file) {
  var stream = fs.readFileSync(file);
  return Buffer.from(stream).toString("base64");
}

opt.addExtensions(encode("./requestly-21.6.4.crx"));

// opt.addArguments("--load-extension=./requestly.crx");

//

async function init() {
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(opt)
    .build();

  const documentInitialised = () => driver.executeScript("return initialised");

  await driver.get(
    "https://app.requestly.io/shared-lists/viewer/1625034285160-nafees-test-2"
  );
  // await driver.manage().setTimeouts({ implicit: 10000 });
  await driver.wait(until.elementsLocated(By.css(".btn-primary")), 10000);

  // const button = await driver.findElement(
  //   By.className("btn-primary")
  // );
  // console.log(button);
  await driver.findElement(By.css(".btn-primary")).click();

  await driver.wait(until.elementsLocated(By.css(".btn-primary")), 10000);
  await driver.findElement(By.css(".custom-toggle")).click();

  await driver.switchTo().newWindow("tab");
  await driver.get("https://google.com");
}

init();
