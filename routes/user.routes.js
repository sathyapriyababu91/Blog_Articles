console.log("user.routes.js loaded");

const express = require("express");
const router = express.Router();

const auth = require("../security/user.security");

router.post("/register", auth.registerUser);
router.post("/login", auth.loginUser);

module.exports = router;