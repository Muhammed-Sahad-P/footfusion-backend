const Users = require("../../models/userSchema");
const CustomError = require("../../utils/customError");
const bcrypt = require("bcrypt");

// get all users
const getAllUsers = async (req, res, next) => {
  const users = await Users.find();
  res.status(200).json({ users });
};

// get single user by Id
const getUser = async (req, res, next) => {
  const user = await Users.findById(req.params.id);
  if (!user) {
    return next(new CustomError("User not found", 404));
  }
  res.status(200).json({ user });
};

// update user by Id
const updateUser = async (req, res, next) => {
  if (req.body.password) {
    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    req.body.password = hashedPassword;
  }

  const updatedUser = await Users.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  );

  if (!updatedUser) {
    return next(new CustomError("User not found", 404));
  }
  res.status(200).json({ updatedUser });
};

// delete user by Id
const deleteUser = async (req, res, next) => {
  const user = await Users.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new CustomError("User not found", 404));
  }
  await user.remove();
  res.status(200).json({ message: "User deleted successfully" });
};

module.exports = { getAllUsers, getUser, updateUser, deleteUser };
