const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken, isLeader } = require("../middlewares/auth.middleware");
const { loginRequest } = require("../requests/LoginRequest");
const validate = require("../middlewares/handleValidation");

// Public routes
router.post("/register", authController.register);
router.post("/login", loginRequest, validate, authController.login);
router.post("/google", authController.googleAuth);

// Protected routes
router.get("/profile", verifyToken, authController.getProfile);

module.exports = router;
