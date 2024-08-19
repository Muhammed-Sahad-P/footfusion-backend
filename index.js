const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.error(error));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
