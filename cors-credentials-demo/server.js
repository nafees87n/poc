// server.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
const PORT = 3001;
const CLIENT_PORT = 3003;

// Middleware
app.use(cookieParser());
app.use(express.json());

// // CORS configuration - this is the key part!
const corsOptions = {
	origin: `http://localhost:${CLIENT_PORT}`, // Must be specific, not '*' when using credentials
	credentials: true, // Allow credentials (cookies, authorization headers)
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// app.use((req, res, next) => {
// 	res.header("Access-Control-Allow-Credentials", "true");
// 	res.header("Access-Control-Allow-Origin", `http://localhost:${CLIENT_PORT}`);
// 	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
// 	res.header(
// 		"Access-Control-Allow-Headers",
// 		"Content-Type, Authorization, Content-Length, X-Requested-With, Cookie"
// 	);

// 	// Handle preflight requests
// 	if (req.method === "OPTIONS") {
// 		res.sendStatus(200);
// 	} else {
// 		next();
// 	}
// });

// Routes for testing

// 1. Set a cookie (login simulation)
app.post("/api/login", (req, res) => {
	// Set an authentication cookie
	res.cookie("authToken", "user123-secret-token", {
		httpOnly: true,
		secure: false, // Set to true in production with HTTPS
		sameSite: "lax",
		maxAge: 24 * 60 * 60 * 1000, // 24 hours
	});

	// Also set a regular cookie for testing
	res.cookie("username", "johnDoe", {
		maxAge: 24 * 60 * 60 * 1000,
	});

	res.json({
		message: "Login successful",
		user: "johnDoe",
		timestamp: new Date().toISOString(),
	});
});

// 2. Protected route that requires cookies
app.get("/api/profile", (req, res) => {
	console.log("Received cookies:", req.cookies);
	console.log("Request headers:", req.headers);

	const authToken = req.cookies.authToken;
	const username = req.cookies.username;

	if (!authToken) {
		return res.status(401).json({
			error: "Unauthorized - No auth token found",
			cookiesReceived: req.cookies,
			message:
				"Make sure to call /api/login first and use withCredentials: true",
		});
	}

	res.json({
		message: "Profile data retrieved successfully",
		user: username || "Unknown",
		authToken: authToken.substring(0, 10) + "...", // Show partial token
		cookiesReceived: req.cookies,
		headers: {
			origin: req.headers.origin,
			referer: req.headers.referer,
			userAgent: req.headers["user-agent"]?.substring(0, 50) + "...",
		},
		timestamp: new Date().toISOString(),
	});
});

// 3. Public route (doesn't need cookies)
app.get("/api/public", (req, res) => {
	res.json({
		message: "This is public data - no authentication required",
		cookiesReceived: req.cookies,
		timestamp: new Date().toISOString(),
	});
});

// 4. Logout route
app.post("/api/logout", (req, res) => {
	res.clearCookie("authToken");
	res.clearCookie("username");
	res.json({ message: "Logged out successfully" });
});

// 5. Debug route to see all request info
app.get("/api/debug", (req, res) => {
	res.json({
		cookies: req.cookies,
		headers: req.headers,
		origin: req.headers.origin,
		timestamp: new Date().toISOString(),
	});
});

app.get("/", (req, res) => {
	return res.json({
		success: true,
	});
});

// Error handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	return res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
	console.log(`🚀 API Server running on http://localhost:${PORT}`);
	console.log(
		`📝 CORS configured for client on http://localhost:${CLIENT_PORT}`
	);
	console.log("\n📋 Available endpoints:");
	console.log(`   POST http://localhost:${PORT}/api/login`);
	console.log(`   GET  http://localhost:${PORT}/api/profile`);
	console.log(`   GET  http://localhost:${PORT}/api/public`);
	console.log(`   POST http://localhost:${PORT}/api/logout`);
	console.log(`   GET  http://localhost:${PORT}/api/debug`);
	console.log(
		"\n🔧 Next: Run the client on port 3000 to test CORS with credentials"
	);
});

// Handle server shutdown
process.on("SIGINT", () => {
	console.log("\n👋 Server shutting down...");
	process.exit(0);
});
