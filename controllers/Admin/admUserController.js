const Users = require("../../models/userSchema");
const CustomError = require("../../utils/customError");
const bcrypt = require("bcrypt");

// Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await Users.find();
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

// Get single user by ID
const getUser = async (req, res, next) => {
  try {
    const user = await Users.findById(req.params.id);
    if (!user) {
      return next(new CustomError("User not found", 404));
    }
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

// Update user by ID
const updateUser = async (req, res, next) => {
  try {
    if (req.body.password) {
      const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      req.body.password = hashedPassword;
    }

    const updatedUser = await Users.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      return next(new CustomError("User not found", 404));
    }
    res.status(200).json({ updatedUser });
  } catch (err) {
    next(err);
  }
};

// Delete user by ID
const deleteUser = async (req, res, next) => {
  try {
    const user = await Users.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(new CustomError("User not found", 404));
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, getUser, updateUser, deleteUser };
