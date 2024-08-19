const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.error(error));

app.get("/", (req, res) => {
  res.send("hello world");
});
app.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
