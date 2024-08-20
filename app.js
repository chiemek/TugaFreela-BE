const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const path = require("path");
const flash = require("express-flash");
const Contact = require("./models/contact"); // Path to your Contact model
// const session = require("express-sesion");

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());
app.use(flash());
// app.use(session());

// Root endPoint
app.get("/", (req, res) => {
  res.send("Welcome to TugaFreela API");
});

//middleware log request
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Define the MONGO_URI
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
  profileImageUrl: String, // New field for storing Cloudinary image URL
  profileImagePublicId: String, // New field for storing Cloudinary public_id
  profilePicture: String,
  balance: Number,
  proposals: Number,
  acceptedProposals: Number,
  views: Number,
  level: Number,
  jobProposals: [
    {
      name: String,
      proposals: Number,
      clientsName: String,
      clientId: String,
      status: String,
      date: Date,
    },
  ],
  activeProposals: [
    {
      name: String,
      proposals: Number,
      clientsName: String,
      clientId: String,
      status: String,
      date: Date,
    },
  ],
  areaOfInterest: [],
  skills: [],
  projectCompleted: Number,
  executingProjects: Number,
  projectsInDespute: Number,
  customerRating: Number,
  customerFeedback: [
    {
      image: String,
      name: String,
      comment: String,
      rating: Number,
      date: Date,
      title: String,
    },
  ],
  notifications: [
    {
      message: String,
      date: Date,
      read: Boolean,
    },
  ],
  chat: [
    {
      user: String,
      image: String,
      title: String,
      message: String,
      read: Boolean,
    },
  ],
});

const User = mongoose.model("User", userSchema);

// Contact Us POST endpoint
app.post("/ContactUs", async (req, res) => {
  const { name, email, number, message } = req.body;

  try {
    // Step 1: Save the contact information to the database
    const newContact = new Contact({
      name,
      email,
      number,
      message,
    });
    await newContact.save();

    // Step 2: Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Step 3: Set up email data
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nNumber: ${number}\nMessage: ${message}`,
    };

    // Step 4: Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Error sending email" });
      } else {
        console.log("Email sent:", info.response);
        return res.status(200).json({
          message: "Email sent successfully and contact saved to database",
        });
      }
    });
  } catch (error) {
    console.error("Error saving contact to the database:", error);
    return res.status(500).json({ error: "Error processing your request" });
  }
});

// Endpoint for uploading profile picture
app.post(
  "/upload-profile-picture",
  upload.single("profilePicture"),
  async (req, res) => {
    const { userId } = req.body; // Get userId from request body

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      // Upload image to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "profile_pictures" }, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          })
          .end(req.file.buffer);
      });

      // Update user document with the new image URL and public ID
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          profileImageUrl: result.secure_url,
          profileImagePublicId: result.public_id,
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Send the updated user data back to the frontend
      res.status(200).json({
        message: "Profile picture updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error uploading to Cloudinary or updating user:", error);
      return res.status(500).json({ error: "Error updating profile picture" });
    }
  }
);

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
      profileImageUrl, // New field for storing Cloudinary image URL
      profileImagePublicId, // New field for storing Cloudinary public_id
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
      profileImageUrl: profileImageUrl || null, // New field for storing Cloudinary image URL
      profileImagePublicId: profileImagePublicId || null, // New field for storing Cloudinary public_id
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
app.post(
  "/signup-freelancer",
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      // Extract fields from req.body
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
        nif,
        citizenCard,
        title,
        categories,
        description,
        rate,
      } = req.body;
      const profilePicture = req.file ? req.file.buffer : null; // Extract the file

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

      // Variables for profile image data
      let profileImageUrl = null;
      let profileImagePublicId = null;

      // Upload profile picture to Cloudinary if provided
      if (profilePicture) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "profile_pictures" }, (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            })
            .end(profilePicture);
        });

        profileImageUrl = result.secure_url;
        profileImagePublicId = result.public_id;
      }

      // Prepare user data
      const newUser = new User({
        role,
        phoneNumber,
        email,
        dateOfBirth,
        address,
        postalCode,
        state,
        password: hashedPassword,
        firstName,
        lastName,
        nif,
        citizenCard,
        title,
        categories: categories ? categories.split(",") : [], // Ensure categories is an array
        description,
        rate,
        profileImageUrl,
        profileImagePublicId,
        balance: 0,
        proposals: 0,
        acceptedProposals: 0,
        views: 0,
        level: 0,
        jobProposals: [
          {
            name: "Design de aplicativo de eventos e entretenimento",
            proposals: 212,
            clientsName: "Diego Lucsen",
            clientId: "",
            status: "",
            date: "",
          },
        ],
        activeProposals: [
          {
            name: "Design de aplicativo de eventos e entretenimento",
            proposals: 212,
            clientsName: "Diego Lucsen",
            clientId: "",
            status: "",
            date: "",
          },
        ],
        areaOfInterest: ["Design"],
        skills: [
          "Design3D",
          "UI/UX Designer",
          "Web Designer",
          "Marketing Digital",
        ],
        projectCompleted: 3,
        executingProjects: 1,
        projectsInDespute: 0,
        customerRating: 5,
        customerFeedback: [
          {
            image: "",
            name: "Paulo S",
            comment: "Ótimo profissional! Recomendo.",
            rating: 4.0,
            title: "Design de aplicativo de eventos e entretenimento",
            date: Date,
          },
        ],
        notifications: [
          {
            message:
              "A sua proposta foi aceita em um job Design de aplicativo de eventos e",
            date: Date,
            read: false,
          },
        ],
        chat: [
          {
            user: String,
            image: "",
            title: "Design de aplicativo de eventos e ",
            message: "Olá, tudo bem? Me chamo Dayvid e sou freelancer ...",
            read: false,
          },
        ],
      });

      // Save the user
      await newUser.save();

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error("Error creating user:", error);
      res
        .status(500)
        .json({ error: "Internal server error", details: error.message });
    }
  }
);

// Endpoint for signup-client
app.post(
  "/signup-client",
  upload.single("profilePicture"),
  async (req, res) => {
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
        nif,
        citizenCard,
        title,
        categories,
        description,
        rate,
      } = req.body;
      const profilePicture = req.file ? req.file.buffer : null; // Extract the file

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

      // Variables for profile image data
      let profileImageUrl = null;
      let profileImagePublicId = null;

      // Upload profile picture to Cloudinary if provided
      if (profilePicture) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "profile_pictures" }, (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            })
            .end(profilePicture);
        });

        profileImageUrl = result.secure_url;
        profileImagePublicId = result.public_id;
      }

      // Prepare user data
      const newUser = new User({
        role,
        phoneNumber,
        email,
        dateOfBirth,
        address,
        postalCode,
        state,
        password: hashedPassword,
        firstName,
        lastName,
        nif: nif || null, // Ensure nif is either provided or null
        citizenCard: citizenCard || null, // Ensure citizenCard is either provided or null
        title: title || null,
        categories: categories ? categories.split(",") : [], // Convert categories to an array if provided
        description,
        rate: rate || null,
        profileImageUrl,
        profileImagePublicId,
        balance: 0,
        proposals: 0,
        acceptedProposals: 0,
        views: 0,
        level: 0,
        jobProposals: [
          {
            name: "Design de aplicativo de eventos e entretenimento",
            proposals: 212,
            clientsName: "Diego Lucsen",
            clientId: "",
            status: "",
            date: "",
          },
        ],
        activeProposals: [
          {
            name: "Design de aplicativo de eventos e entretenimento",
            proposals: 212,
            clientsName: "Diego Lucsen",
            clientId: "",
            status: "",
            date: "",
          },
        ],
      });

      // Save the user
      await newUser.save();
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error("Error creating user:", error);
      res
        .status(500)
        .json({ error: "Internal server error", details: error.message });
    }
  }
);

// Login Endpoint
// Login Endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Define the data you want to send back
    const userData = {
      id: user._id,
      email: user.email,
      role: user.role,
      profileImagePublicId: user.profileImagePublicId,
      profileImageUrl: user.profileImageUrl,
      balance: user.balance,
      acceptedProposals: user.acceptedProposals,
      views: user.views,
      level: user.level,
      jobProposals: user.jobProposals,
      activeProposals: user.activeProposals,
      firstName: user.firstName,
      // Add more fields as needed
    };

    res.json({ token, userData });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// JWT Middleware
// Enhanced authenticateJWT middleware
const authenticateJWT = (req, res, next) => {
  console.log("Entering authenticateJWT middleware");

  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  console.log("Authorization header:", authHeader);

  if (!authHeader) {
    console.log("No authorization header provided");
    return res
      .status(401)
      .json({ message: "No authorization header provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log(
    "Extracted token:",
    token ? `${token.substring(0, 10)}...` : "undefined"
  );

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  console.log(
    "Attempting to verify token with secret:",
    process.env.JWT_SECRET ? "Secret exists" : "Secret is undefined"
  );
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification failed:", err.message);
      console.log("Error name:", err.name);
      console.log("Error stack:", err.stack);

      const message =
        err.name === "TokenExpiredError"
          ? "Token expired"
          : "Token verification failed";

      return res.status(403).json({ message });
    }

    req.user = user;
    console.log("Token verified successfully");
    console.log("User data from token:", JSON.stringify(user, null, 2));

    next();
  });
};

// Modified protected route
app.get("/protected", authenticateJWT, (req, res) => {
  console.log("Entering /protected route");
  try {
    console.log("User object in request:", JSON.stringify(req.user, null, 2));
    res.json({ message: "This is a protected route", user: req.user });
  } catch (error) {
    console.error("Error in protected route:", error);
    res.status(500).json({
      message: "Internal server error in protected route",
      error: error.message,
    });
  }
});

// forgot password endpoint
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

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpires = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

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
https://tugafreela.netlify.app/reset-password/${resetToken}
If you did not request this, please ignore this email and your password will remain unchanged.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Password reset email sent" });
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
