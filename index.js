const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/connectDB");
const userRoutes = require("./routes/authRoutes");
dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use("/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
