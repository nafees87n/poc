const btn = document.getElementById("send-btn");
btn.addEventListener("click", () => {
	console.log("Button clicked, sending request...");
	chrome.runtime.sendMessage({ action: "trigger" });
});
