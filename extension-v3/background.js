console.log("!!!debug", "background script loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log("!!!debug", "", request);
	if (request.action === "trigger") {
		console.log("!!!debug", "tiggered");
		chrome.offscreen
			.createDocument({
				url: "index.html",
				reasons: ["BLOBS"],
				justification: "To load the extension's UI",
			})
			.then(() => {
				console.log("Offscreen document created successfully");
			})
			.catch((error) => {
				console.error("Error creating offscreen document:", error);
			});
	} else if (request.action === "sendRequest") {
		console.log("!!!debug", "sendRequest");
		sendRequest();
	}
});

async function sendRequest() {
	const fileobj = window.jsonFileRef;

	const formData = new FormData();
	formData.append("jsonFile", fileobj);

	const response = await fetch("http://localhost:3300/upload", {
		method: "POST",
		body: formData,
	});

	const result = await response.json();
	console.log(JSON.stringify(result, null, 2));
	chrome.offscreen.closeDocument();
}
