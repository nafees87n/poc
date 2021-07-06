const { By, until } = require("selenium-webdriver");

const loadSharedList = async (driver, pageUrl) => {
  await driver.get(pageUrl);
  const tabs = await driver.getAllWindowHandles();
  // Switch to /rules to gets opened after installation of extension
  await driver.switchTo().window(tabs[0]);
  //close the /rules tab
  await driver.close();
  // switch to pageUrl tab
  await driver.switchTo().window(tabs[1]);

  // wait until Import List button gets loaded
  await driver.wait(until.elementsLocated(By.css(".btn-primary")), 10000);
  // click on import List button
  await driver.findElement(By.css(".btn-primary")).click();
};

module.exports = {
  loadSharedList,
};
