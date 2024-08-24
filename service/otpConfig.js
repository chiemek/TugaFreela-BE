// services.js
require("dotenv").config();
const twilio = require("twilio");
const nodemailer = require("nodemailer");

// Check for required environment variables
const requiredEnvVars = [
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_PHONE_NUMBER",
  "EMAIL_SERVICE",
  "EMAIL_USER",
  "EMAIL_PASS",
];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing environment variable: ${envVar}`);
  }
});

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendSMS = async (to, body) => {
  if (!to || !body) {
    throw new Error("Recipient phone number and message body are required.");
  }
  try {
    await twilioClient.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
  } catch (error) {
    console.error("Error sending SMS:", error.message);
    throw error;
  }
};

const sendEmail = async (to, subject, text) => {
  if (!to || !subject || !text) {
    throw new Error("Recipient email, subject, and message body are required.");
  }
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};

module.exports = { sendSMS, sendEmail };
