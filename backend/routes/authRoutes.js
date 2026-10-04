const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const { sendOtp, technicianSignup, technicianLogin } = require("../controllers/otpAuthController");

router.post("/signup", signup);
router.post("/login", login);

// Technician auth via mobile OTP
router.post("/send-otp", sendOtp);
router.post("/technician-signup", technicianSignup);
router.post("/technician-login", technicianLogin);

module.exports = router;