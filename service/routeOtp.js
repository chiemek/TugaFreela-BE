const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const { sendSMS, sendEmail } = require("./otpConfig");
const { generateOTP, storeOTP, verifyOTP } = require("./otpServices");
const router = express.Router();
const cors = require("cors"); // Import the cors middleware

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: "Too many requests, please try again later." },
});

// Apply rate limiting to all routes
router.use(limiter);
app.use(cors()); // This will enable CORS for all routes

// Security headers middleware
router.use(helmet());

// Input validation functions
const validatePhoneNumber = (phoneNumber) => /^\d{9}$/.test(phoneNumber);
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Send SMS OTP Route
router.post("/send-sms-otp", async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
    return res
      .status(400)
      .json({ error: "Valid 9-digit phone number is required" });
  }
  const otp = generateOTP();
  try {
    await sendSMS(phoneNumber, `Your OTP code is ${otp}`);
    await storeOTP(phoneNumber, otp, "sms");
    res.status(200).json({ message: "OTP sent to phone number" });
  } catch (error) {
    console.error("Error in send-sms-otp:", error);
    res
      .status(500)
      .json({ error: "Failed to send OTP", details: error.message });
  }
});

// Send Email OTP Route
router.post("/send-email-otp", async (req, res) => {
  const { email } = req.body;
  if (!email || !validateEmail(email)) {
    return res.status(400).json({ error: "Valid email is required" });
  }
  const otp = generateOTP();
  try {
    await sendEmail(email, "Your OTP Code", `Your OTP code is ${otp}`);
    await storeOTP(email, otp, "email");
    res.status(200).json({ message: "OTP sent to email address" });
  } catch (error) {
    console.error("Error in send-email-otp:", error);
    res
      .status(500)
      .json({ error: "Failed to send OTP", details: error.message });
  }
});

// Verify OTP Route
router.post("/verify-otp", async (req, res) => {
  const { identifier, otp, type } = req.body; // type should be 'sms' or 'email'
  if (!identifier || !otp || !type) {
    return res
      .status(400)
      .json({ error: "Identifier, OTP, and type are required" });
  }
  try {
    await verifyOTP(identifier, otp, type);
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error in verify-otp:", error);
    res
      .status(400)
      .json({ error: "Invalid or expired OTP", details: error.message });
  }
});

module.exports = router;
