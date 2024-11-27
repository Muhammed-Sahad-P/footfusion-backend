const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");

// User Register
const Register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ datas: savedUser }); // Do not return the hashed password
  } catch (error) {
    next(error); // Pass error to error-handling middleware
  }
};

// User Login
const Login = async (req, res, next) => {
  try {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (
      req.body.email === ADMIN_EMAIL &&
      req.body.password === ADMIN_PASSWORD
    ) {
      console.log("admin logged in");

      const token = jwt.sign(
        {
          id: "admin",
          isAdmin: true,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({ token, isAdmin: true });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new CustomError("User not found", 404));
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return next(new CustomError("Invalid email or password", 400));
    }

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ token, isAdmin: user.isAdmin, user });
  } catch (error) {
    next(error); // Pass error to error-handling middleware
  }
};

module.exports = { Register, Login };
