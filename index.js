const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./config/connectDB");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cookieParser = require("cookie-parser");

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(cors({  origin: "https://footfusion-e-commerce.vercel.app",credentials: true }));
app.use(cookieParser());
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
