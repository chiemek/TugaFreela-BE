const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const path = require("path");

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Root endPoint
app.get("/", (req, res) => {
  res.send("Welcome to TugaFreela API");
});

//middleware log request
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static files from the node-js-getting-started/public directory

// Define the MONGO_URI
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define User Schema
const userSchema = new mongoose.Schema({
  role: { type: String, required: true },
  phoneNumber: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\+?(\d{1,3})?[-.\s]?(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{4})$/.test(
          v
        );
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  dateOfBirth: Date,
  address: String,
  postalCode: String,
  state: String,
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid password!`,
    },
  },
  firstName: String,
  lastName: String,
  id: String,
  nif: String,
  citizenCard: String,
  title: String,
  categories: [String], // Array of categories
  description: String,
  rate: Number,
  resetPasswordToken: String, // New field
  resetPasswordExpires: Date, // New field
});

const User = mongoose.model("User", userSchema);

// Endpoint for signup-clientSkip
app.post("/signup-clientSkip", async (req, res) => {
  try {
    const {
      role,
      phoneNumber,
      email,
      dateOfBirth,
      address,
      postalCode,
      state,
      password,
      confirmPassword,
      firstName,
      lastName,
      id,
      nif,
      citizenCard,
      title,
      categories,
      description,
      rate,
    } = req.body;

    // Check for required fields
    if (!role || !email || !password || !confirmPassword) {
      return res.status(400).json({
        error: "Role, email, password, and confirm password are required",
      });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data with default null values for missing fields
    const newUser = {
      role: role || null,
      phoneNumber: phoneNumber || null,
      email: email || null,
      dateOfBirth: dateOfBirth || null,
      address: address || null,
      postalCode: postalCode || null,
      state: state || null,
      password: hashedPassword,
      firstName: null,
      lastName: null,
      id: null,
      nif: null,
      citizenCard: null,
      title: null,
      categories: null,
      description: null,
      rate: null,
    };

    // Save the user
    const user = new User(newUser);
    await user.save();
    res.status(201).json({
      message:
        "User created successfully with fields set to null where not provided",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// Endpoint for signup-freelancer
app.post("/signup-freelancer", async (req, res) => {
  try {
    const {
      role,
      phoneNumber,
      email,
      dateOfBirth,
      address,
      postalCode,
      state,
      password,
      confirmPassword,
      firstName,
      lastName,
      id,
      nif,
      citizenCard,
      title,
      categories,
      description,
      rate,
    } = req.body;

    // Check for required fields
    if (!role || !email || !password || !confirmPassword) {
      return res.status(400).json({
        error: "Role, email, password, and confirm password are required",
      });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data with default null values for missing fields
    const newUser = {
      role: role,
      phoneNumber: phoneNumber,
      email: email,
      dateOfBirth: dateOfBirth,
      address: address,
      postalCode: postalCode,
      state: state,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      id: null, // Set id to null
      nif: nif,
      citizenCard: citizenCard,
      title: title,
      categories: categories,
      description: description,
      rate: rate,
    };

    // Save the user
    const user = new User(newUser);
    await user.save();
    res
      .status(201)
      .json({ message: "User created successfully with id set to null" });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// Endpoint for signup-client
app.post("/signup-client", async (req, res) => {
  try {
    const {
      role,
      phoneNumber,
      email,
      dateOfBirth,
      address,
      postalCode,
      state,
      password,
      confirmPassword,
      firstName,
      lastName,
      id,
      nif,
      citizenCard,
      title,
      categories,
      description,
      rate,
    } = req.body;

    // Check for required fields
    if (!role || !email || !password || !confirmPassword) {
      return res.status(400).json({
        error: "Role, email, password, and confirm password are required",
      });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data with default null values for missing fields
    const newUser = {
      role: role,
      phoneNumber: phoneNumber,
      email: email,
      dateOfBirth: dateOfBirth,
      address: address,
      postalCode: postalCode,
      state: state,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      id: id,
      nif: null, // Set nif to null
      citizenCard: null, // Set citizenCard to null
      title: null,
      categories: null,
      description: description,
      rate: null,
    };

    // Save the user
    const user = new User(newUser);
    await user.save();
    res.status(201).json({
      message: "User created successfully with nif and citizenCard set to null",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// Login Endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// Middleware to verify JWT token
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Example of a protected route
app.get("/protected", authenticateJWT, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a reset token and expiry time
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpires = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    // Send email with the reset token
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.
Please click on the following link, or paste it into your browser to complete the process:
http://localhost:5173/reset-password/${resetToken}
If you did not request this, please ignore this email and your password will remain unchanged.`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Error sending email:", error);
        return res
          .status(500)
          .json({ error: "Internal server error", details: error.message });
      }
      res.json({ message: "Password reset email sent" });
    });
  } catch (error) {
    console.error("Error sending reset password email:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// Endpoint to reset the password with token validation
app.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  console.log("Request body:", req.body); // Log the request body

  if (!newPassword || !confirmPassword) {
    return res.status(400).json({ error: "Both password fields are required" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Token must be valid
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Password reset token is invalid or has expired" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password successfully updated" });
  } catch (error) {
    console.error("Error updating password:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// error handling
app.use((req, res, next) => {
  res.status(404).send("Sorry, that route does not exist.");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
