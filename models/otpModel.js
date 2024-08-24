const mongoose = require("mongoose");
const { isEmail, isMobilePhone } = require("validator"); // Optional: validation library for emails and phone numbers

const otpSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Validate phone number or email
          return isEmail(v) || isMobilePhone(v, "any", { strictMode: false });
        },
        message: (props) =>
          `${props.value} is not a valid phone number or email!`,
      },
    },
    otp: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 6,
    },
    type: {
      type: String,
      enum: ["sms", "email"],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Add indexes for performance
otpSchema.index({ identifier: 1, type: 1 }); // Compound index for quick lookup
otpSchema.index({ expiresAt: 1 }); // Index for expiration date

const OTPModel = mongoose.model("OTP", otpSchema);

module.exports = OTPModel;
