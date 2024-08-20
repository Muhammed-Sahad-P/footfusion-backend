const express = require("express");
const dotenv = require("dotenv");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./config/connectDB");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

connectDB();

const app = express();
app.use(express.json());

app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
