const path = require("path");
const fs = require("fs");

function encode(file) {
  const stream = fs.readFileSync(file);
  return Buffer.from(stream).toString("base64");
}

function getRequestlyExtension() {
  return encode(path.join(__dirname, "requestly-21.6.30.crx"));
}

module.exports = {
  getRequestlyExtension,
};
