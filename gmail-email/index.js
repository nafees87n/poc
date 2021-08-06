const express = require("express");
const app = express();
const readline = require("readline");
const { google } = require("googleapis");

const TOKEN_PATH = "token.json";
const CRED_PATH = "credentials.json";
const MAIL_PATH = "mail.txt";

const SCOPES = ["https://mail.google.com/"];

const fs = require("fs");

fs.readFile(CRED_PATH, (err, content) => {
  authorize(JSON.parse(content));
});

let oAuth2Client;

function authorize(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[1]
  );
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client);
    oAuth2Client.setCredentials(JSON.parse(token));
  });
}

function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  console.log("Authorize this app by visiting this url: ", authUrl);

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return;
    oAuth2Client.setCredentials(JSON.parse(token));
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here", (code) => {
    rl.close();

    oAuth2Client.getToken(code, (err, token) => {
      console.log(err, "-----------------$$$$");
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("token stored to", TOKEN_PATH);
      });
    });
  });
}

const encodeBase64 = () => {
  const data = fs.readFileSync(MAIL_PATH, { encoding: "base64" });
  return data;
};

async function sendEmail(auth) {
  const gmail = google.gmail({ version: "v1", auth });

  let email = await gmail.users.messages.send({
    userId: "me",
    resource: {
      raw: encodeBase64(),
    },
  });
  return email;
}

app.get("/", function (req, res) {
  const token = req.query.code;
  res.send(token);
});

app.get("/sendmail", async (req, res) => {
  let email = await sendEmail(oAuth2Client);
  res.json({ email });
});

app.listen("8000", () => console.log("Server Running"));
