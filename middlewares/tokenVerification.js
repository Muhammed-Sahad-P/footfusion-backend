const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");

const tokenVerification = (req, res, next) => {
  try {
    const authHeader = req.headers.token;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) throw new CustomError("Token is not valid", 403);
        else {
          req.user = user;
          next();
        }
      });
    } else {
      throw new CustomError("You are not authenticated", 403);
    }
  } catch (error) {
    throw new CustomError(
      error.message || "Failed to verify authentication",
      500
    );
  }
};

const adminVerification = (req, res, next) => {
  tokenVerification(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      throw new CustomError("You are not an authorization", 403);
    }
  });
};

module.exports = { tokenVerification, adminVerification };
