const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");

//User Register
const Register = async (req, res) => {
  console.log(req.body);
  const { fullName, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

  const newUser = new User({
    fullName,
    email,
    password: hashedPassword,
  });

  const savedUser = await newUser.save();
  res.status(201).json({ datas: savedUser, password: hashedPassword });
};

//User Login
const Login = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new CustomError("user not found", 404));
  }
  const isMatch = await bcrypt.compare(req.body.password, user.password);

  if (!isMatch) {
    return next(new CustomError("Invalid email or password", 400));
  }
  console.log(user.isAdmin);

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
    sameSite: "Strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ token, isAdmin: user.isAdmin, user });
};

module.exports = { Register, Login };
