const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log(authHeader);

    if (!authHeader) {
      return next(new CustomError("Please login first", 401));
    }
    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(new CustomError("Please login first", 401));
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userId) => {
      if (err) {
        return next(new CustomError("Please login first", 401));
      }
      req.userId = userId;
      next();
    });
  } catch (err) {
    return next(new CustomError(err, 401));
  }
};
