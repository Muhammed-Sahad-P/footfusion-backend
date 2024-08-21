const User = require("../../models/userSchema");

const getUser = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ user });
};

module.exports = { getUser };
