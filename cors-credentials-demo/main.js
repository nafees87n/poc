const API_BASE = "http://localhost:3652";
let isLoggedIn = false;

function updateAuthStatus() {
	const statusEl = document.getElementById("authStatus");
	if (isLoggedIn) {
		statusEl.textContent = "Status: Logged in ✅";
		statusEl.className = "status logged-in";
	} else {
		statusEl.textContent = "Status: Not logged in ❌";
		statusEl.className = "status logged-out";
	}
}

function updateResult(message, type = "info") {
	const resultEl = document.getElementById("result");
	resultEl.textContent = message;
	resultEl.className = `result ${type}-result`;
}

async function login() {
	try {
		updateResult("Logging in...");

		const response = await fetch(`${API_BASE}/api/login`, {
			method: "POST",
			credentials: "omit", // Important: include credentials to set cookies
		});
		console.log(
			"!!!debug",
			"response headers",
			response.headers.has("set-cookie")
		);
		response.headers.forEach((value, key) => {
			console.log(`Header: ${key} = ${value}`);
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();
		isLoggedIn = true;
		updateAuthStatus();
		updateResult(`LOGIN SUCCESS!\n${JSON.stringify(data, null, 2)}`, "success");
	} catch (error) {
		updateResult(`LOGIN FAILED!\nError: ${error.message}`, "error");
	}
}

async function logout() {
	try {
		updateResult("Logging out...");

		const response = await fetch(`${API_BASE}/api/logout`, {
			method: "POST",
			credentials: "include", // Include credentials to clear cookies
		});

		const data = await response.json();
		isLoggedIn = false;
		updateAuthStatus();
		updateResult(
			`LOGOUT SUCCESS!\n${JSON.stringify(data, null, 2)}`,
			"success"
		);
	} catch (error) {
		updateResult(`LOGOUT FAILED!\nError: ${error.message}`, "error");
	}
}

function xhrRequest(endpoint, withCredentials) {
	updateResult(
		`Making XHR request to ${endpoint}...\nwithCredentials: ${withCredentials}`
	);

	const xhr = new XMLHttpRequest();
	xhr.open("GET", `${API_BASE}${endpoint}`);
	xhr.withCredentials = withCredentials; // This is the key setting!

	xhr.onload = function () {
		if (xhr.status >= 200 && xhr.status < 300) {
			const data = JSON.parse(xhr.responseText);
			updateResult(
				`XHR SUCCESS (withCredentials: ${withCredentials})\nStatus: ${
					xhr.status
				}\n\n${JSON.stringify(data, null, 2)}`,
				"success"
			);
		} else {
			const errorData = xhr.responseText ? JSON.parse(xhr.responseText) : {};
			updateResult(
				`XHR ERROR (withCredentials: ${withCredentials})\nStatus: ${
					xhr.status
				}\n\n${JSON.stringify(errorData, null, 2)}`,
				"error"
			);
		}
	};

	xhr.onerror = function () {
		updateResult(
			`XHR NETWORK ERROR (withCredentials: ${withCredentials})\nThis might be a CORS issue. Check the server console.`,
			"error"
		);
	};

	xhr.send();
}

async function fetchRequest(endpoint, credentials) {
	try {
		updateResult(
			`Making Fetch request to ${endpoint}...\ncredentials: '${credentials}'`
		);
		console.log("!!!debug", "fetching");
		const response = await fetch(`${API_BASE}${endpoint}`, {
			credentials: credentials, // 'omit', 'same-origin', or 'include'
		});

		const data = await response.json();
		console.log(
			"!!!debug",
			"response headers",
			response.headers.has("set-cookie")
		);
		// console.log("!!!debug", "set-cookie", response.headers.getSetCookie());
		response.headers.forEach((value, key) => {
			console.log(`Header: ${key} = ${value}`);
		});

		if (response.ok) {
			updateResult(
				`FETCH SUCCESS (credentials: '${credentials}')\nStatus: ${
					response.status
				}\n\n${JSON.stringify(data, null, 2)}`,
				"success"
			);
		} else {
			updateResult(
				`FETCH ERROR (credentials: '${credentials}')\nStatus: ${
					response.status
				}\n\n${JSON.stringify(data, null, 2)}`,
				"error"
			);
		}
	} catch (error) {
		updateResult(
			`FETCH NETWORK ERROR (credentials: '${credentials}')\nError: ${error.message}\nThis might be a CORS issue.`,
			"error"
		);
	}
}

// Initialize
updateAuthStatus();
