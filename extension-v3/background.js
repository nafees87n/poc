(function () {
  try {
    console.log("nafees");

    chrome.action
      .getUserSettings()
      .then((setting) => console.log("in v3", setting));
  } catch (e) {
    // Do nothing
  }
})();
