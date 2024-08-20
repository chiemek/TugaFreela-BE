const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  // signup logic...
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
              .upload_stream(
                { folder: "profile_pictures" },
                (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(result);
                  }
                }
              )
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
              .upload_stream(
                { folder: "profile_pictures" },
                (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(result);
                  }
                }
              )
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
};

exports.login = async (req, res) => {
  // login logic...
  // Login Endpoint
  app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid email " });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
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
        // e.g., username: user.username, or other data from the user document
      };

      res.json({ token, userData });
    } catch (error) {
      console.error("Login error:", error);
      res
        .status(500)
        .json({ error: "Internal server error", details: error.message });
    }
  });
};

exports.forgotPassword = async (req, res) => {
  // forgot password logic...
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
      return res
        .status(400)
        .json({ error: "Both password fields are required" });
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
};
