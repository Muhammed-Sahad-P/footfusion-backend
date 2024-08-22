const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");

//User Register
const Register = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  
  const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });
  const savedUser = await newUser.save();
  res.status(201).json({datas:savedUser,password:hashedPassword});
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

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );
  res.status(200).json({ token });
};

module.exports = { Register, Login };
