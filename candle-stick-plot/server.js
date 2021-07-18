const csv = require("csv-parser");
const fs = require("fs");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

const file = "./file.csv";

app.get("/data", (req, res) => {
  const parser = fs.createReadStream(file).pipe(csv());
  const data = [];
  parser.on("data", ({ time, high, low, open, close }) => {
    const date = time.split("T")[0];
    const check = { time: date, high, low, open, close };
    data.push(check);
  });
  parser.on("end", () => {
    res.json(data);
  });
});

app.listen("8000", () => console.log("Server Running"));
