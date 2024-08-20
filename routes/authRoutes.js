const express = require("express");
const router = express.Router();
const tryCatch = require("../utils/tryCatch");
const { Register, Login } = require("../controllers/authController");

router.post("/register", tryCatch(Register));
router.post("/login", tryCatch(Login));

module.exports = router;
