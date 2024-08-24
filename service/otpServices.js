const crypto = require("crypto");
const OTPModel = require("../models/otpModel"); // Your OTP model (e.g., MongoDB)

// Generate a 6-digit OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// Store OTP in the database with expiration
const storeOTP = async (identifier, otp, type) => {
  if (!identifier || !otp || !type) {
    throw new Error("Invalid input parameters.");
  }

  // Optionally hash the OTP here before storing

  await OTPModel.create({
    identifier,
    otp,
    type,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiry
  });
};

// Verify OTP and remove it from the database if valid
const verifyOTP = async (identifier, otp, type) => {
  if (!identifier || !otp || !type) {
    throw new Error("Invalid input parameters.");
  }

  const otpRecord = await OTPModel.findOne({ identifier, otp, type });

  if (!otpRecord) {
    throw new Error("Invalid OTP");
  }

  if (new Date() > otpRecord.expiresAt) {
    throw new Error("OTP expired");
  }

  // Optional: Remove OTP after use
  await OTPModel.deleteOne({ identifier, otp, type });
};

module.exports = { generateOTP, storeOTP, verifyOTP };
